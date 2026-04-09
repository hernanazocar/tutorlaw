'use client';

import { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '@/hooks/useChat';

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
    initialMessage: '¡Hola! Soy TutorLaw, tu tutora de derecho con inteligencia artificial. ¿En qué puedo ayudarte hoy?'
  });

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col h-full bg-[#f9f7f3] ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-[#e8e4da]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0d1f35] rounded-full flex items-center justify-center text-xl">
            ⚖️
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#0a1628]">TutorLaw</h2>
            <p className="text-xs font-sans text-[#0d1f35]/60">Tu tutora jurídica IA</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {loading && (
          <div className="mb-4">
            <TypingIndicator />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
