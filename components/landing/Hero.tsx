'use client';

import { ChatWindow } from '../chat/ChatWindow';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0d1f35] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#c9a96e] rounded-lg flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#c9a96e]">TutorLaw</h1>
              <p className="text-xs font-sans text-white/60">Tutoría jurídica con IA</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
            <Button variant="primary" size="sm">
              Registrarse gratis
            </Button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Tu profesor de derecho
              <span className="block text-[#c9a96e]">disponible 24/7</span>
            </h2>

            <p className="font-sans text-lg md:text-xl text-white/80 leading-relaxed">
              Aprende derecho con inteligencia artificial. Recibe explicaciones personalizadas,
              resuelve casos prácticos y prepárate para tus exámenes con TutorLaw.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#c9a96e]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#c9a96e]">✓</span>
                </div>
                <span className="font-sans text-sm">Derecho chileno y latinoamericano</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#c9a96e]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#c9a96e]">✓</span>
                </div>
                <span className="font-sans text-sm">7 modos de estudio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#c9a96e]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#c9a96e]">✓</span>
                </div>
                <span className="font-sans text-sm">Citas normas y jurisprudencia real</span>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="primary" size="lg">
                Empezar gratis →
              </Button>
              <p className="mt-3 font-sans text-sm text-white/60">
                5 consultas gratis sin registro. No requiere tarjeta de crédito.
              </p>
            </div>
          </div>

          {/* Right side - Chat Window */}
          <div className="lg:h-[600px] h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-[#c9a96e]/20">
            <ChatWindow anonymous={true} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/10">
          <div className="text-center">
            <div className="font-serif text-3xl md:text-4xl font-bold text-[#c9a96e]">7</div>
            <div className="font-sans text-sm text-white/60 mt-1">Modos de estudio</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-3xl md:text-4xl font-bold text-[#c9a96e]">24/7</div>
            <div className="font-sans text-sm text-white/60 mt-1">Disponibilidad</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-3xl md:text-4xl font-bold text-[#c9a96e]">5+</div>
            <div className="font-sans text-sm text-white/60 mt-1">Jurisdicciones</div>
          </div>
        </div>
      </div>
    </div>
  );
}
