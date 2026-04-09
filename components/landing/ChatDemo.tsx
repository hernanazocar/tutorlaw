'use client';

import { useEffect, useState } from 'react';
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
    content: 'Tengo un certamen mañana de Civil I y no entiendo bien el artículo 1545 del Código Civil 😰',
    delay: 2000
  },
  {
    role: 'assistant',
    content: 'Tranquilo, te explico el Art. 1545 paso a paso:\n\n**Definición:** "Todo contrato legalmente celebrado es una ley para los contratantes"\n\n**Elementos clave:**\n1. Fuerza obligatoria del contrato\n2. Solo puede invalidarse por consentimiento mutuo o causas legales\n3. No puede ser dejado sin efecto por voluntad unilateral\n\n**Ejemplo práctico:** Si Juan arrienda un depto a María por 1 año, ninguno puede terminar el contrato antes solo porque quiere. Necesitan acuerdo mutuo o una causal legal (ej: no pago).\n\n¿Te quedó claro o quieres que profundice en algo?',
    delay: 3500
  },
  {
    role: 'user',
    content: '¡Perfecto! Ahora dame un caso práctico IRAC para practicar',
    delay: 2000
  },
  {
    role: 'assistant',
    content: '**CASO PRÁCTICO:**\n\nPedro y Ana firman contrato de arriendo de un local comercial por 2 años. Al mes, Pedro le dice a Ana que quiere terminar el contrato porque encontró un local más barato.\n\n**Tu turno:** Resuelve el caso usando IRAC:\n- Issue (problema jurídico)\n- Rule (norma aplicable)\n- Application (aplicación al caso)\n- Conclusion\n\n¿Cómo lo resolverías?',
    delay: 3000
  },
  {
    role: 'user',
    content: 'Issue: ¿Puede Pedro terminar unilateralmente el contrato?\n\nRule: Art. 1545 - el contrato solo puede invalidarse por consentimiento mutuo o causas legales.\n\nApplication: Pedro quiere terminar solo por conveniencia económica, no hay causa legal ni Ana está de acuerdo.\n\nConclusion: Pedro NO puede terminar el contrato unilateralmente. Debe cumplirlo o llegar a acuerdo con Ana.',
    delay: 4000
  },
  {
    role: 'assistant',
    content: '🎯 ¡EXCELENTE! Nota: 7.0\n\nIdentificaste correctamente:\n✓ El problema jurídico\n✓ La norma aplicable (Art. 1545)\n✓ Aplicación al caso concreto\n✓ Conclusión fundamentada\n\n**Consejo para el certamen:** Siempre menciona el artículo exacto y explica brevemente por qué aplica al caso.\n\n¿Quieres practicar otro caso o repasar otro tema?',
    delay: 3000
  }
];

export function ChatDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
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
                    <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L4 5V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V5L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
