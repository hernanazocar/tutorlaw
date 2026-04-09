'use client';

import Link from 'next/link';
import { ChatDemo } from './ChatDemo';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export function Hero() {
  return (
    <div className="min-h-screen bg-[#f1f3f5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e9ecef] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo size="md" showText={true} />
        <div className="flex gap-2 sm:gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/registro">
            <Button variant="primary" size="sm">
              Probar gratis
            </Button>
          </Link>
        </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e6f0ff] text-[#0066ff] rounded-full text-sm font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Potenciado por IA avanzada
            </div>

            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-[#212529] leading-tight tracking-tight">
              Estudia derecho con
              <span className="block text-[#0066ff]">tu tutor IA 24/7</span>
            </h1>

            <p className="font-sans text-xl text-[#6c757d] leading-relaxed max-w-xl">
              ¿Preparando un examen? ¿Atascado en un concepto? TutorLaw te explica con ejemplos claros,
              resuelve tus casos prácticos y te ayuda a aprobar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#0066ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[#212529] text-sm">Derecho chileno real</div>
                  <div className="font-sans text-xs text-[#6c757d] mt-0.5">Artículos exactos del código civil, penal, laboral</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#0066ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[#212529] text-sm">Método socrático</div>
                  <div className="font-sans text-xs text-[#6c757d] mt-0.5">Aprende pensando, no solo memorizando</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#0066ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[#212529] text-sm">Casos prácticos IRAC</div>
                  <div className="font-sans text-xs text-[#6c757d] mt-0.5">Resuelve casos como en tus certámenes</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#0066ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[#212529] text-sm">Responde al toque</div>
                  <div className="font-sans text-xs text-[#6c757d] mt-0.5">Sin turnos, sin esperas</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <Link href="/registro">
                <Button variant="primary" size="lg">
                  Probar ahora gratis
                </Button>
              </Link>
              <div className="text-sm text-[#6c757d]">
                <span className="font-semibold text-[#212529]">5 preguntas gratis</span> · Sin tarjeta · Sin instalación
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3 text-xs text-[#6c757d]">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#fbbf24]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <svg className="w-4 h-4 text-[#fbbf24]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <svg className="w-4 h-4 text-[#fbbf24]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <svg className="w-4 h-4 text-[#fbbf24]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <svg className="w-4 h-4 text-[#fbbf24]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <span>Usado por estudiantes de derecho en Chile y Latinoamérica</span>
            </div>
          </div>

          {/* Right side - Chat Demo */}
          <div className="lg:h-[700px] h-[600px]">
            <ChatDemo />
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
            <div className="font-sans text-4xl md:text-5xl font-bold text-[#0066ff]">∞</div>
            <div className="font-sans text-sm text-[#6c757d] mt-2">Paciencia infinita</div>
          </div>
        </div>
      </div>
    </div>
  );
}
