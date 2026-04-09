'use client';

import { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '@/hooks/useChat';
import { Logo } from '../ui/Logo';

interface ChatWindowProps {
  mode?: string;
  ramo?: string;
  jurisdiccion?: string;
  anonymous?: boolean;
  className?: string;
}

export function ChatWindow({
  mode = 'tutor',
  ramo = 'general',
  jurisdiccion = 'Chile',
  anonymous = false,
  className = ''
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, loading, input, setInput, send, error } = useChat({
    mode,
    ramo,
    jurisdiccion,
    anonymous,
    initialMessage: '¡Hola! Soy TutorLaw, tu asistente de derecho con IA. ¿En qué puedo ayudarte hoy?'
  });

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col h-full bg-[#f8f9fa] ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-[#e9ecef]">
        <div className="flex items-center justify-between">
          <Logo size="md" showText={true} />
          <div className="text-xs text-[#6c757d] font-medium">
            Asistente IA
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {loading && (
          <div className="mb-4">
            <TypingIndicator />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-sans">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={send}
        disabled={loading}
        placeholder="Escribe tu pregunta jurídica..."
      />
    </div>
  );
}
