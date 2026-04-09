import Link from 'next/link';
import { Button } from '../ui/Button';

const FeatureIcon = ({ name }: { name: string }) => {
  const icons: Record<string, any> = {
    tutor: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6v6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 9h6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    socratico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
        <circle cx="11" cy="11" r="8" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11 8a3 3 0 0 0-3 3" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    irac: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
        <path d="M12 3L4 9L12 15L20 9L12 3Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 15L12 21L20 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9V15" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    debate: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 10h8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 14h4" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    examen: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 15l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    oral: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 19v4" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 23h8" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    ensayo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
        <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    flashcards: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
        <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 4h12" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 1h8" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  };
  return icons[name] || null;
};

export function Features() {
  const features = [
    {
      icon: 'tutor',
      title: 'Modo Tutor',
      description: 'Explicaciones paso a paso con definiciones, elementos, ejemplos y artículos exactos. Como tener un profesor particular.',
      tag: 'Popular'
    },
    {
      icon: 'socratico',
      title: 'Método Socrático',
      description: 'Te hace preguntas para que llegues tú solo a la respuesta. Aprendes de verdad, no solo memorizas para el certamen.',
      tag: null
    },
    {
      icon: 'irac',
      title: 'Casos IRAC',
      description: 'Resuelve casos prácticos con la metodología IRAC: Issue, Rule, Application, Conclusion. Justo como te piden en la U.',
      tag: 'Esencial'
    },
    {
      icon: 'debate',
      title: 'Debate Jurídico',
      description: 'Defiende tu posición y TutorLaw argumenta en contra con jurisprudencia real. Prepárate para el examen oral.',
      tag: null
    },
    {
      icon: 'examen',
      title: 'Generador de Exámenes',
      description: 'Crea preguntas de desarrollo o múltiple opción sobre cualquier tema. Te evalúa con nota 1-7 y explica lo correcto.',
      tag: null
    },
    {
      icon: 'oral',
      title: 'Examen Oral',
      description: 'Simula un examen oral real con preguntas, repreguntas y evaluación final. Practica hasta que te salga perfecto.',
      tag: null
    },
    {
      icon: 'ensayo',
      title: 'Evaluador de Ensayos',
      description: 'Revisa tus ensayos con rúbrica: estructura, rigor jurídico, argumentación y conclusión. Feedback detallado.',
      tag: null
    },
    {
      icon: 'flashcards',
      title: 'Flashcards Automáticas',
      description: 'Genera tarjetas de estudio de cualquier tema con pregunta y respuesta (incluye artículos). Perfectas para repasar.',
      tag: 'Nuevo'
    }
  ];

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#e9ecef] rounded-full text-xs sm:text-sm font-medium text-[#6c757d] mb-4 sm:mb-6">
            7 formas de estudiar
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#212529] mb-3 sm:mb-4 px-4">
            Elige cómo quieres aprender
          </h2>
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#6c757d] max-w-2xl mx-auto px-4">
            No es solo un chat. TutorLaw se adapta a tu estilo de estudio y lo que necesitas en cada momento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#e9ecef] p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group cursor-pointer"
            >
              {feature.tag && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#0066ff] text-white text-xs font-semibold rounded-full">
                  {feature.tag}
                </div>
              )}
              <div className="w-12 h-12 mb-4 text-[#0066ff] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="font-sans font-bold text-lg text-[#212529] mb-2 group-hover:text-[#0066ff] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-[#6c757d] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA inline */}
        <div className="mt-16 text-center">
          <Link href="/registro">
            <Button variant="primary" size="lg">
              Empieza a estudiar gratis
            </Button>
          </Link>
          <p className="mt-4 text-sm text-[#6c757d]">
            5 preguntas gratis · Sin tarjeta · Menos de 1 minuto
          </p>
        </div>
      </div>
    </div>
  );
}
