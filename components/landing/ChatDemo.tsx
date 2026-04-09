'use client';

import { useEffect, useState, useRef } from 'react';
import { Logo } from '../ui/Logo';

interface DemoMessage {
  role: 'user' | 'assistant';
  content: string;
  delay: number; // ms antes de aparecer
}

const DEMO_CONVERSATION: DemoMessage[] = [
  {
    role: 'assistant',
    content: '¡Hola! Soy TutorLaw. ¿En qué puedo ayudarte hoy?',
    delay: 500
  },
  {
    role: 'user',
    content: 'Quiero practicar modo debate. Mi posición: La legítima defensa justifica cualquier acción en respuesta a una agresión',
    delay: 2000
  },
  {
    role: 'assistant',
    content: 'Excelente tema para debatir. Tomaré la posición contraria.\n\nARGUMENTO: La legítima defensa NO justifica cualquier acción, sino solo aquellas proporcionales y necesarias.\n\nArt. 10 N°4 Código Penal chileno exige:\n1. Agresión ilegítima\n2. Necesidad racional del medio empleado\n3. Falta de provocación suficiente\n\nEjemplo: Si alguien te empuja levemente, NO puedes dispararle. La respuesta debe ser proporcional a la agresión.\n\nJurisprudencia: CS 2018 - Se rechazó legítima defensa por uso excesivo de fuerza.\n\n¿Cómo rebates mi argumento?',
    delay: 3500
  },
  {
    role: 'user',
    content: 'Contraargumento: En situaciones de peligro real, es imposible calcular la "proporcionalidad perfecta". El que es agredido actúa bajo estrés extremo.',
    delay: 3000
  },
  {
    role: 'assistant',
    content: 'Buen punto sobre el estrés. Pero:\n\nEl estándar NO es "proporcionalidad perfecta" sino "necesidad racional" - se evalúa objetivamente según las circunstancias.\n\nArt. 10 N°6 (miedo insuperable) ya cubre el estado emocional extremo como eximente diferente.\n\nSi aceptamos "cualquier acción" bajo estrés:\n- Se abriría la puerta al abuso\n- Víctimas inocentes podrían morir por respuestas desmedidas\n- Se destruiría el principio de proporcionalidad del Derecho Penal\n\n¿Tienes jurisprudencia que respalde tu postura?',
    delay: 3500
  },
  {
    role: 'user',
    content: 'Me convenciste. La proporcionalidad es necesaria para evitar abusos. ¿Cómo quedó mi argumentación?',
    delay: 2500
  },
  {
    role: 'assistant',
    content: 'EVALUACIÓN DE TU DESEMPEÑO:\n\n✓ Fortalezas:\n- Identificaste el problema práctico (cálculo bajo estrés)\n- Argumento empático con la víctima\n- Apertura a cambiar de opinión con evidencia\n\n⚠️ Áreas de mejora:\n- Faltó citar artículos específicos\n- No presentaste jurisprudencia\n- Argumento más emocional que jurídico\n\nNota: 5.5/7.0\n\nPara mejorar: Siempre respalda con normativa y casos reales. El Derecho es evidencia, no solo lógica.\n\n¿Otro debate?',
    delay: 3500
  }
];

export function ChatDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll cuando aparecen nuevos mensajes
  useEffect(() => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentIndex >= DEMO_CONVERSATION.length) {
      // Reiniciar después de 5 segundos
      const resetTimer = setTimeout(() => {
        setMessages([]);
        setCurrentIndex(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }

    const currentMessage = DEMO_CONVERSATION[currentIndex];

    // Esperar el delay antes de mostrar el mensaje
    const delayTimer = setTimeout(() => {
      // Mostrar typing indicator
      setIsTyping(true);

      // Simular tiempo de escritura (más largo para assistant)
      const typingDuration = currentMessage.role === 'assistant'
        ? Math.min(currentMessage.content.length * 15, 2000)
        : 800;

      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, currentMessage]);
        setCurrentIndex(prev => prev + 1);
      }, typingDuration);

      return () => clearTimeout(typingTimer);
    }, currentMessage.delay);

    return () => clearTimeout(delayTimer);
  }, [currentIndex]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] rounded-3xl overflow-hidden border border-[#e9ecef] shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-[#e9ecef] flex items-center justify-between">
        <Logo size="md" showText={true} />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-[#6c757d] font-medium">Demo en vivo</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                message.role === 'user'
                  ? 'bg-[#0066ff] text-white shadow-sm'
                  : 'bg-white border border-[#e9ecef] text-[#212529] shadow-sm'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.2"/>
                      <path d="M6 10.5V15C6 15 8 17 12 17C16 17 18 15 18 15V10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="12" cy="17" r="1" fill="white"/>
                    </svg>
                  </div>
                  <span className="text-xs font-sans font-semibold text-[#6c757d]">TutorLaw</span>
                </div>
              )}
              <div className="font-sans text-[15px] whitespace-pre-wrap leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-center space-x-3 px-5 py-3.5 rounded-2xl bg-white border border-[#e9ecef] shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con badge */}
      <div className="px-6 py-4 bg-white border-t border-[#e9ecef]">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#6c757d]">
            Conversación de ejemplo · Probá gratis arriba 👆
          </div>
          <div className="flex items-center gap-1 text-xs text-[#6c757d]">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            Auto-play
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
