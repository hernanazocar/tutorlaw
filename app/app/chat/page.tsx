'use client';

import { useState, useEffect, useRef } from 'react';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';
import { SuggestionsPanel } from '@/components/chat/SuggestionsPanel';
import type { Conversation, ConversationMessage } from '@/lib/types';

const MODOS = [
  {
    id: 'tutor',
    nombre: 'Modo Tutor',
    descripcion: 'Explicaciones paso a paso',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'socratico',
    nombre: 'Socrático',
    descripcion: 'Aprende preguntando',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'caso',
    nombre: 'Caso IRAC',
    descripcion: 'Resuelve casos prácticos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path d="M12 3L4 9L12 15L20 9L12 3Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 15L12 21L20 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'debate',
    nombre: 'Debate',
    descripcion: 'Argumenta y defiende',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'examen',
    nombre: 'Examen',
    descripcion: 'Genera preguntas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'oral',
    nombre: 'Examen Oral',
    descripcion: 'Simula oral',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'ensayo',
    nombre: 'Ensayo',
    descripcion: 'Evalúa tu redacción',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function ChatPage() {
  const [modoActual, setModoActual] = useState(MODOS[0]);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations for current mode
  useEffect(() => {
    loadConversations();
  }, [modoActual.id]);

  // Load messages for current conversation
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const res = await fetch(`/api/conversations?mode=${modoActual.id}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const data: ConversationMessage[] = await res.json();
        setMessages(data.map(m => ({ role: m.role, content: m.content })));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async (firstMessage: string) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : ''),
          mode: modoActual.id,
        }),
      });

      if (res.ok) {
        const conversation = await res.json();
        setCurrentConversationId(conversation.id);
        setConversations(prev => [conversation, ...prev]);
        return conversation.id;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
    return null;
  };

  const saveMessage = async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, content }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    let conversationId = currentConversationId;

    // Create new conversation if this is the first message
    if (!conversationId) {
      conversationId = await createNewConversation(userMessage);
    }

    // Save user message
    if (conversationId) {
      await saveMessage(conversationId, 'user', userMessage);
    }

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          mode: modoActual.id,
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantMessage };
          return newMessages;
        });
      }

      // Save assistant message
      if (conversationId) {
        await saveMessage(conversationId, 'assistant', assistantMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al procesar tu mensaje. Por favor intenta de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const handleSelectSuggestion = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-[#e9ecef] flex flex-col overflow-hidden`}>
        {/* Header Sidebar */}
        <div className="p-3 border-b border-[#e9ecef]">
          <Logo size="sm" showText={true} />
          <p className="text-xs text-[#6c757d] mt-1">Estudiando con IA</p>
        </div>

        {/* New Conversation Button */}
        <div className="p-2 border-b border-[#e9ecef]">
          <button
            onClick={startNewConversation}
            className="w-full px-3 py-2 bg-[#0066ff] text-white rounded-lg text-sm font-semibold hover:bg-[#0052cc] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nueva conversación
          </button>
        </div>

        {/* Modos de estudio */}
        <div className="flex-1 overflow-y-auto p-2">
          <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-2 px-2">
            Modos
          </h3>
          <div className="space-y-1">
            {MODOS.map((modo) => (
              <button
                key={modo.id}
                onClick={() => {
                  setModoActual(modo);
                  startNewConversation();
                }}
                className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                  modoActual.id === modo.id
                    ? 'bg-gradient-to-r ' + modo.color + ' text-white shadow-md'
                    : 'bg-[#f8f9fa] text-[#212529] hover:bg-[#e9ecef]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`${modoActual.id === modo.id ? 'text-white' : 'text-[#0066ff]'} w-4 h-4`}>
                    {modo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate">{modo.nombre}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Historial */}
          {conversations.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-2 px-2">
                Historial
              </h3>
              <div className="space-y-1">
                {conversations.slice(0, 5).map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setCurrentConversationId(conv.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      currentConversationId === conv.id
                        ? 'bg-[#e6f0ff] text-[#0066ff]'
                        : 'text-[#212529] hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <div className="text-xs font-medium truncate">{conv.title}</div>
                    <div className="text-xs text-[#6c757d]">
                      {new Date(conv.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="p-2 border-t border-[#e9ecef]">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#0066ff] flex items-center justify-center text-white font-semibold text-xs">
                H
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs font-semibold text-[#212529]">Mi cuenta</div>
                <div className="text-xs text-[#6c757d]">5 preguntas</div>
              </div>
              <svg className="w-3 h-3 text-[#6c757d]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#e9ecef] rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/app/settings"
                  className="block px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  ⚙️ Configuración
                </Link>
                <Link
                  href="/app/notes"
                  className="block px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  📝 Apuntes
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-red-600"
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#e9ecef] p-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-[#f8f9fa] rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-base text-[#212529]">{modoActual.nombre}</h1>
            <p className="text-xs text-[#6c757d]">{modoActual.descripcion}</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${modoActual.color} flex items-center justify-center text-white mb-4`}>
                {modoActual.icon}
              </div>
              <h2 className="text-lg font-bold text-[#212529] mb-2">
                {modoActual.nombre}
              </h2>
              <p className="text-sm text-[#6c757d] mb-4">
                {modoActual.id === 'tutor' && 'Explicaciones paso a paso con ejemplos y artículos del código'}
                {modoActual.id === 'socratico' && 'Aprende pensando con el método socrático'}
                {modoActual.id === 'caso' && 'Resuelve casos con metodología IRAC'}
                {modoActual.id === 'debate' && 'Argumenta y defiende con jurisprudencia'}
                {modoActual.id === 'examen' && 'Genera preguntas y evalúa tus respuestas'}
                {modoActual.id === 'oral' && 'Simula examen oral con evaluación'}
                {modoActual.id === 'ensayo' && 'Revisa ensayos con rúbrica detallada'}
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#0066ff] text-white'
                        : 'bg-white border border-[#e9ecef] text-[#212529]'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-[#6c757d]">
                        <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${modoActual.color} flex items-center justify-center text-white`}>
                          <div className="w-3 h-3">{modoActual.icon}</div>
                        </div>
                        <span className="text-xs font-semibold">{modoActual.nombre}</span>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-[#e9ecef] p-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`Escribe tu ${modoActual.id === 'caso' ? 'caso' : 'pregunta'}...`}
                className="flex-1 px-4 py-2.5 text-sm bg-[#f8f9fa] border border-[#e9ecef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-[#212529] placeholder-[#6c757d]"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-2.5 bg-[#0066ff] text-white rounded-lg text-sm font-semibold hover:bg-[#0052cc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Pensando...' : 'Enviar'}
              </button>
            </div>
            <p className="text-xs text-[#6c757d] mt-2 text-center">
              TutorLaw puede cometer errores. Verifica información importante.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions Panel */}
      <SuggestionsPanel mode={modoActual.id} onSelectSuggestion={handleSelectSuggestion} />
    </div>
  );
}
