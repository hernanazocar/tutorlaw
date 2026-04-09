export function HowItWorks() {
  return (
    <div className="relative bg-gradient-to-br from-[#0066ff] to-[#0052cc] py-20 sm:py-24 md:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Más fácil imposible
          </h2>
          <p className="font-sans text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            En 3 pasos estás estudiando. Sin instalaciones, sin configuraciones.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-6xl mx-auto mb-16 sm:mb-20">
          {/* Step 1 */}
          <div className="relative group">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon + Number */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-[#0066ff] flex items-center justify-center text-sm font-bold shadow-lg">
                    1
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-sans font-bold text-xl sm:text-2xl text-white">
                    Elige tu modo
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed">
                    ¿Necesitas que te expliquen? Modo Tutor. ¿Resolver un caso? IRAC. ¿Practicar oral? Examen Oral.
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <svg className="w-8 h-8 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon + Number */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                      <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M11 8a3 3 0 0 0-3 3" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-[#0066ff] flex items-center justify-center text-sm font-bold shadow-lg">
                    2
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-sans font-bold text-xl sm:text-2xl text-white">
                    Pregunta lo que sea
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed">
                    "Explícame Art. 1545", "Caso práctico de vicios ocultos", "10 preguntas de Civil I"
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <svg className="w-8 h-8 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon + Number */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 3L2 8L12 13L22 8L12 3Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 16L12 21L22 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-[#0066ff] flex items-center justify-center text-sm font-bold shadow-lg">
                    3
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-sans font-bold text-xl sm:text-2xl text-white">
                    Aprende de verdad
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed">
                    Respuestas claras, ejemplos prácticos, artículos exactos. Sin vueltas, sin relleno.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                M
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Quote */}
                <div className="mb-6">
                  <svg className="w-8 h-8 text-white/20 mb-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                  </svg>
                  <p className="font-sans text-base sm:text-lg text-white leading-relaxed">
                    Antes perdía horas buscando en apuntes. Ahora pregunto directo y me explica mejor que algunos profes.
                    El modo IRAC me salvó en el certamen de Obligaciones.
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-sans font-bold text-white">María José</div>
                    <div className="font-sans text-sm text-white/70">3° año Derecho · Universidad Católica</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
