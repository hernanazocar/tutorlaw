export function Stats() {
  return (
    <div className="bg-[#0066ff] py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          <div className="text-center">
            <div className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white">7</div>
            <div className="font-sans text-xs sm:text-sm text-white/90 mt-2">Modos de estudio</div>
          </div>
          <div className="text-center">
            <div className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white">24/7</div>
            <div className="font-sans text-xs sm:text-sm text-white/90 mt-2">Siempre disponible</div>
          </div>
          <div className="text-center">
            <div className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white">∞</div>
            <div className="font-sans text-xs sm:text-sm text-white/90 mt-2">Paciencia infinita</div>
          </div>
        </div>
      </div>
    </div>
  );
}
