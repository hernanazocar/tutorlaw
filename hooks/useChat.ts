'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/lib/types';

interface UseChatOptions {
  mode?: string;
  ramo?: string;
  jurisdiccion?: string;
  sessionId?: string;
  anonymous?: boolean;
  initialMessage?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const {
    mode = 'tutor',
    ramo = 'general',
    jurisdiccion = 'Chile',
    sessionId,
    anonymous = false,
    initialMessage
  } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Inicializar con mensaje de bienvenida
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: initialMessage,
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, [initialMessage, messages.length]);

  const send = useCallback(async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    setError(null);
    setInput('');

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    // Crear mensaje del asistente vacío
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Crear AbortController para poder cancelar
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          mode,
          ramo,
          jurisdiccion,
          sessionId,
          anonymous
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la solicitud');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No se pudo leer la respuesta');
      }

      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Actualizar el mensaje del asistente progresivamente
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedText }
              : msg
          )
        );
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('Request aborted');
        } else {
          console.error('Error en chat:', err);
          setError(err.message || 'Error al enviar mensaje');

          // Remover el mensaje del asistente vacío en caso de error
          setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
        }
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, loading, messages, mode, ramo, jurisdiccion, sessionId, anonymous]);

  const reset = useCallback(() => {
    setMessages([]);
    setInput('');
    setError(null);
    setLoading(false);

    // Agregar mensaje inicial si existe
    if (initialMessage) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: initialMessage,
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, [initialMessage]);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    loading,
    input,
    setInput,
    send,
    reset,
    abort,
    error
  };
}
