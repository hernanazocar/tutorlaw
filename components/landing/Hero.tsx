'use client';

import { ChatWindow } from '../chat/ChatWindow';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export function Hero() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <Logo size="md" showText={true} />
          <div className="flex gap-3">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
            <Button variant="primary" size="sm">
              Empezar gratis
            </Button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e6f0ff] text-[#0066ff] rounded-full text-sm font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Potenciado por Claude Sonnet 4
            </div>

            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-[#212529] leading-tight tracking-tight">
              Tu profesor de derecho
              <span className="block text-[#0066ff]">disponible 24/7</span>
            </h1>

            <p className="font-sans text-xl text-[#6c757d] leading-relaxed max-w-xl">
              Aprende derecho con inteligencia artificial avanzada. Explicaciones personalizadas, casos prácticos y preparación para exámenes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#0066ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[#212529] text-sm">Derecho latinoamericano</div>
                  <div className="font-sans text-xs text-[#6c757d] mt-0.5">Chile, México, Argentina y más</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#0066ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[#212529] text-sm">7 modos de estudio</div>
                  <div className="font-sans text-xs text-[#6c757d] mt-0.5">Tutor, socrático, IRAC y más</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#0066ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[#212529] text-sm">Citas reales</div>
                  <div className="font-sans text-xs text-[#6c757d] mt-0.5">Artículos y jurisprudencia</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#0066ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[#212529] text-sm">Respuestas al instante</div>
                  <div className="font-sans text-xs text-[#6c757d] mt-0.5">Streaming en tiempo real</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button variant="primary" size="lg">
                Empezar gratis
              </Button>
              <div className="text-sm text-[#6c757d]">
                <span className="font-semibold text-[#212529]">5 consultas gratis</span> sin registro
              </div>
            </div>
          </div>

          {/* Right side - Chat Window */}
          <div className="lg:h-[700px] h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-[#e9ecef]">
            <ChatWindow anonymous={true} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-12 mt-24 pt-12 border-t border-[#e9ecef]">
          <div className="text-center">
            <div className="font-sans text-4xl md:text-5xl font-bold text-[#0066ff]">7</div>
            <div className="font-sans text-sm text-[#6c757d] mt-2">Modos de estudio</div>
          </div>
          <div className="text-center">
            <div className="font-sans text-4xl md:text-5xl font-bold text-[#0066ff]">24/7</div>
            <div className="font-sans text-sm text-[#6c757d] mt-2">Siempre disponible</div>
          </div>
          <div className="text-center">
            <div className="font-sans text-4xl md:text-5xl font-bold text-[#0066ff]">5+</div>
            <div className="font-sans text-sm text-[#6c757d] mt-2">Jurisdicciones</div>
          </div>
        </div>
      </div>
    </div>
  );
}
