'use client';

import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

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
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al procesar tu mensaje. Por favor intenta de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-[#e9ecef] flex flex-col overflow-hidden`}>
        {/* Header Sidebar */}
        <div className="p-6 border-b border-[#e9ecef]">
          <Logo size="md" showText={true} />
          <p className="text-xs text-[#6c757d] mt-2">Estudiando con IA</p>
        </div>

        {/* Modos de estudio */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-4 px-2">
            Modos de estudio
          </h3>
          <div className="space-y-2">
            {MODOS.map((modo) => (
              <button
                key={modo.id}
                onClick={() => setModoActual(modo)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  modoActual.id === modo.id
                    ? 'bg-gradient-to-r ' + modo.color + ' text-white shadow-lg scale-105'
                    : 'bg-[#f8f9fa] text-[#212529] hover:bg-[#e9ecef]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${modoActual.id === modo.id ? 'text-white' : 'text-[#0066ff]'}`}>
                    {modo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{modo.nombre}</div>
                    <div className={`text-xs truncate ${modoActual.id === modo.id ? 'text-white/80' : 'text-[#6c757d]'}`}>
                      {modo.descripcion}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-t border-[#e9ecef]">
          <Link href="/" className="text-xs text-[#6c757d] hover:text-[#0066ff]">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#e9ecef] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div>
              <h1 className="font-bold text-xl text-[#212529]">{modoActual.nombre}</h1>
              <p className="text-sm text-[#6c757d]">{modoActual.descripcion}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs bg-[#e6f0ff] text-[#0066ff] px-3 py-1 rounded-full font-medium">
              5 preguntas restantes
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${modoActual.color} flex items-center justify-center text-white mb-6`}>
                {modoActual.icon}
              </div>
              <h2 className="text-2xl font-bold text-[#212529] mb-3">
                {modoActual.nombre}
              </h2>
              <p className="text-[#6c757d] mb-8">
                {modoActual.id === 'tutor' && 'Te explicaré cualquier concepto paso a paso con ejemplos claros y artículos exactos del código.'}
                {modoActual.id === 'socratico' && 'Te haré preguntas para que llegues tú solo a la respuesta. Aprenderás pensando.'}
                {modoActual.id === 'caso' && 'Resolvamos casos prácticos con la metodología IRAC: Issue, Rule, Application, Conclusion.'}
                {modoActual.id === 'debate' && 'Defiende tu posición y yo argumentaré en contra con jurisprudencia real.'}
                {modoActual.id === 'examen' && 'Generaré preguntas de desarrollo o múltiple opción sobre cualquier tema.'}
                {modoActual.id === 'oral' && 'Simularemos un examen oral con preguntas, repreguntas y evaluación final.'}
                {modoActual.id === 'ensayo' && 'Revisaré tu ensayo evaluando estructura, rigor jurídico y argumentación.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setInput(modoActual.id === 'tutor' ? 'Explícame qué es la legítima defensa' :
                    modoActual.id === 'caso' ? 'Caso: Juan compró un auto con vicios ocultos' :
                    modoActual.id === 'debate' ? 'Debate: La legítima defensa justifica cualquier acción' :
                    '¿Cómo empiezo?')}
                  className="p-4 bg-[#f8f9fa] hover:bg-[#e9ecef] rounded-xl text-left text-sm transition-colors"
                >
                  <div className="font-semibold text-[#212529] mb-1">
                    {modoActual.id === 'tutor' && '📚 Explícame un concepto'}
                    {modoActual.id === 'socratico' && '❓ Quiero entender mejor'}
                    {modoActual.id === 'caso' && '⚖️ Resolvamos un caso'}
                    {modoActual.id === 'debate' && '🗣️ Practiquemos debate'}
                    {modoActual.id === 'examen' && '📝 Genera preguntas'}
                    {modoActual.id === 'oral' && '🎤 Simula examen oral'}
                    {modoActual.id === 'ensayo' && '✏️ Revisa mi ensayo'}
                  </div>
                  <div className="text-xs text-[#6c757d]">Ejemplo de uso</div>
                </button>
                <button
                  onClick={() => setInput('¿Qué temas puedes ayudarme a estudiar?')}
                  className="p-4 bg-[#f8f9fa] hover:bg-[#e9ecef] rounded-xl text-left text-sm transition-colors"
                >
                  <div className="font-semibold text-[#212529] mb-1">💡 ¿Qué temas cubres?</div>
                  <div className="text-xs text-[#6c757d]">Ver alcance</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-[#0066ff] text-white'
                        : 'bg-white border border-[#e9ecef] text-[#212529]'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-[#6c757d]">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${modoActual.color} flex items-center justify-center text-white text-xs`}>
                          {modoActual.icon}
                        </div>
                        <span className="text-xs font-semibold">{modoActual.nombre}</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-[#e9ecef] p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`Escribe tu ${modoActual.id === 'caso' ? 'caso' : 'pregunta'}...`}
                className="flex-1 px-6 py-4 bg-[#f8f9fa] border border-[#e9ecef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-[#212529] placeholder-[#6c757d]"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-8 py-4 bg-[#0066ff] text-white rounded-xl font-semibold hover:bg-[#0052cc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Pensando...' : 'Enviar'}
              </button>
            </div>
            <p className="text-xs text-[#6c757d] mt-3 text-center">
              TutorLaw puede cometer errores. Verifica información importante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
