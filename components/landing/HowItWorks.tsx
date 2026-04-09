export function HowItWorks() {
  return (
    <div className="relative bg-gradient-to-br from-[#0066ff] to-[#0052cc] py-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-white mb-4">
              Más fácil imposible
            </h2>
            <p className="font-sans text-xl text-white/90 max-w-2xl mx-auto">
              En 3 pasos estás estudiando. Sin instalaciones, sin configuraciones complicadas.
            </p>
          </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                1
              </div>
              <h3 className="font-sans font-bold text-xl text-[#212529] mb-3">
                Elige tu modo
              </h3>
              <p className="font-sans text-[#6c757d] leading-relaxed">
                ¿Necesitas que te expliquen? Modo Tutor. ¿Resolver un caso? IRAC. ¿Practicar oral? Examen Oral.
              </p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-8 -right-6 text-[#e9ecef]">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                2
              </div>
              <h3 className="font-sans font-bold text-xl text-[#212529] mb-3">
                Pregunta lo que sea
              </h3>
              <p className="font-sans text-[#6c757d] leading-relaxed">
                "Explícame Art. 1545", "Caso: Juan compró un auto con vicios ocultos", "Dame 10 preguntas de Civil I"
              </p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-8 -right-6 text-[#e9ecef]">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
              3
            </div>
            <h3 className="font-sans font-bold text-xl text-[#212529] mb-3">
              Aprende de verdad
            </h3>
            <p className="font-sans text-[#6c757d] leading-relaxed">
              Respuestas claras, ejemplos prácticos, artículos exactos. Sin vueltas, sin relleno.
            </p>
          </div>
        </div>

          {/* Testimonial inline */}
          <div className="mt-20 max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold flex-shrink-0">
                M
              </div>
              <div>
                <p className="font-sans text-white leading-relaxed mb-3">
                  "Antes perdía horas buscando en apuntes. Ahora pregunto directo y me explica mejor que algunos profes.
                  El modo IRAC me salvó en el certamen de Obligaciones."
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-sm text-white">María José</span>
                  <span className="text-white/60 text-sm">·</span>
                  <span className="font-sans text-sm text-white/80">3° año Derecho UC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
