export function Stats() {
  return (
    <div className="relative bg-[#0066ff] py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white mb-3">
            Estudia derecho de forma más inteligente
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Stat 1 */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                </svg>
              </div>

              {/* Number */}
              <div className="font-sans text-4xl sm:text-5xl font-bold text-white leading-none">
                7
              </div>

              {/* Label */}
              <div className="space-y-1">
                <div className="font-sans text-base font-semibold text-white">
                  Modos de estudio
                </div>
                <div className="font-sans text-xs text-white/70">
                  Desde tutorías hasta debates
                </div>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Number */}
              <div className="font-sans text-4xl sm:text-5xl font-bold text-white leading-none">
                24/7
              </div>

              {/* Label */}
              <div className="space-y-1">
                <div className="font-sans text-base font-semibold text-white">
                  Siempre disponible
                </div>
                <div className="font-sans text-xs text-white/70">
                  Estudia cuando tú quieras
                </div>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 12C3 12 5.5 6 12 6C18.5 6 21 12 21 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 12C3 12 5.5 18 12 18C18.5 18 21 12 21 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="2" fill="white" strokeWidth="2"/>
                </svg>
              </div>

              {/* Number */}
              <div className="font-sans text-4xl sm:text-5xl font-bold text-white leading-none">
                ∞
              </div>

              {/* Label */}
              <div className="space-y-1">
                <div className="font-sans text-base font-semibold text-white">
                  Paciencia infinita
                </div>
                <div className="font-sans text-xs text-white/70">
                  Pregunta las veces que necesites
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
