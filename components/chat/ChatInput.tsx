'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Escribe tu pregunta...'
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 bg-white border-t border-[#e8e4da]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none font-sans text-sm md:text-base bg-[#f9f7f3] border border-[#e8e4da] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a96e] focus:border-transparent disabled:opacity-50 max-h-[200px]"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="px-5 py-3 bg-[#c9a96e] text-[#0a1628] rounded-xl font-sans font-semibold hover:bg-[#e8d5a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
      >
        Enviar
      </button>
    </div>
  );
}
