export function Stats() {
  return (
    <div className="relative bg-[#0066ff] py-20 sm:py-24 md:py-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Tu tutor de derecho 24/7
          </h2>
          <p className="font-sans text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Aprende a tu ritmo, cuando quieras, donde quieras
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
          {/* Stat 1 */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 6.5V17.5" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 9L12 6.5L16 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 15H16" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 18H16" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Number */}
              <div className="font-sans text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none">
                7
              </div>

              {/* Label */}
              <div className="space-y-1">
                <div className="font-sans text-base sm:text-lg font-semibold text-white">
                  Modos de estudio
                </div>
                <div className="font-sans text-xs sm:text-sm text-white/70">
                  Desde tutorías hasta debates
                </div>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Number */}
              <div className="font-sans text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none">
                24/7
              </div>

              {/* Label */}
              <div className="space-y-1">
                <div className="font-sans text-base sm:text-lg font-semibold text-white">
                  Siempre disponible
                </div>
                <div className="font-sans text-xs sm:text-sm text-white/70">
                  Estudia cuando tú quieras
                </div>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 12C4 12 5.5 7 12 7C18.5 7 20 12 20 12C20 12 18.5 17 12 17C5.5 17 4 12 4 12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                  <path d="M12 3V5" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 19V21" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 12H19" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5 12H3" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Number */}
              <div className="font-sans text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none">
                ∞
              </div>

              {/* Label */}
              <div className="space-y-1">
                <div className="font-sans text-base sm:text-lg font-semibold text-white">
                  Paciencia infinita
                </div>
                <div className="font-sans text-xs sm:text-sm text-white/70">
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
