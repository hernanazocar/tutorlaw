import { Button } from '../ui/Button';

export function CTA() {
  return (
    <div className="relative bg-gradient-to-br from-[#0066ff] via-[#0052cc] to-[#003d99] py-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">
          Deja de perder tiempo buscando
        </h2>
        <p className="font-sans text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Tienes un certamen en 3 días, 200 páginas que leer y cero ganas.
          TutorLaw te explica lo importante en minutos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button variant="secondary" size="lg" className="bg-white text-[#0066ff] hover:bg-gray-50">
            Probar gratis ahora
          </Button>
          <div className="text-white/80 text-sm">
            Sin tarjeta · 5 preguntas gratis · Cancelable cuando quieras
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 pt-8 border-t border-white/20">
          <div className="text-center">
            <div className="font-sans text-3xl font-bold text-white mb-1">+500</div>
            <div className="font-sans text-sm text-white/80">Estudiantes activos</div>
          </div>
          <div className="text-center">
            <div className="font-sans text-3xl font-bold text-white mb-1">4.8/5</div>
            <div className="font-sans text-sm text-white/80">Calificación promedio</div>
          </div>
          <div className="text-center">
            <div className="font-sans text-3xl font-bold text-white mb-1">24/7</div>
            <div className="font-sans text-sm text-white/80">Siempre disponible</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
