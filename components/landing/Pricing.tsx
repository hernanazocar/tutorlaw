import { Button } from '../ui/Button';

export function Pricing() {
  const plans = [
    {
      name: 'Gratis',
      price: '$0',
      period: 'siempre',
      description: 'Para probar TutorLaw',
      features: [
        '20 consultas al mes',
        'Todos los modos de estudio',
        'Derecho chileno',
        'Sin tarjeta de crédito'
      ],
      cta: 'Empezar gratis',
      popular: false,
      variant: 'secondary' as const
    },
    {
      name: 'Estudiante',
      price: '$4.990',
      period: '/mes',
      description: 'Para aprobar tus ramos',
      features: [
        'Consultas ilimitadas',
        'Todos los modos de estudio',
        'Sube tus apuntes (PDF)',
        'Exporta guías de estudio',
        'Genera flashcards',
        'Historial completo',
        'Soporte prioritario'
      ],
      cta: 'Suscribirme',
      popular: true,
      variant: 'primary' as const
    },
    {
      name: 'Universidad',
      price: 'Precio especial',
      period: 'por alumno',
      description: 'Para tu facultad',
      features: [
        'Todo del plan Estudiante',
        'Dashboard institucional',
        'Reportes de uso',
        'Personalización',
        'Implementación guiada',
        'Soporte dedicado'
      ],
      cta: 'Contactar',
      popular: false,
      variant: 'secondary' as const
    }
  ];

  return (
    <div className="bg-white py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#212529] mb-3 sm:mb-4 px-4">
            Inversión que vale la pena
          </h2>
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#6c757d] max-w-2xl mx-auto px-4">
            Menos de lo que gastas en un café al día. Más barato que reprobar un ramo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-6 sm:p-8 relative transition-all duration-300 bg-[#0066ff] shadow-xl border-2 border-[#0066ff] ${
                plan.popular ? 'scale-105' : 'hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-[#0066ff] text-sm font-bold rounded-full shadow-lg">
                  ⭐ Más popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-sans font-bold text-2xl mb-2 text-white">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-sans font-bold text-4xl text-white">
                    {plan.price}
                  </span>
                  <span className="font-sans text-sm text-white/80">
                    {plan.period}
                  </span>
                </div>
                <p className="font-sans text-sm text-white/90">
                  {plan.description}
                </p>
              </div>

              <Button
                variant="secondary"
                size="md"
                className="w-full mb-6 bg-white text-[#0066ff] hover:bg-white/90 font-bold shadow-lg"
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-sans text-sm text-white">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-sans text-sm text-[#6c757d]">
            ¿Estudiante con presupuesto ajustado?{' '}
            <a href="#" className="text-[#0066ff] font-semibold hover:underline">
              Becas disponibles
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
