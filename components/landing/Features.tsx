export function Features() {
  const features = [
    {
      icon: '📖',
      title: 'Modo Tutor',
      description: 'Explicaciones paso a paso con definiciones, elementos, ejemplos y artículos exactos. Como tener un profesor particular.',
      tag: 'Popular'
    },
    {
      icon: '🔍',
      title: 'Método Socrático',
      description: 'Te hace preguntas para que llegues tú solo a la respuesta. Aprendes de verdad, no solo memorizas para el certamen.',
      tag: null
    },
    {
      icon: '⚖️',
      title: 'Casos IRAC',
      description: 'Resuelve casos prácticos con la metodología IRAC: Issue, Rule, Application, Conclusion. Justo como te piden en la U.',
      tag: 'Esencial'
    },
    {
      icon: '🗣️',
      title: 'Debate Jurídico',
      description: 'Defiende tu posición y TutorLaw argumenta en contra con jurisprudencia real. Prepárate para el examen oral.',
      tag: null
    },
    {
      icon: '📝',
      title: 'Generador de Exámenes',
      description: 'Crea preguntas de desarrollo o múltiple opción sobre cualquier tema. Te evalúa con nota 1-7 y explica lo correcto.',
      tag: null
    },
    {
      icon: '🎤',
      title: 'Examen Oral',
      description: 'Simula un examen oral real con preguntas, repreguntas y evaluación final. Practica hasta que te salga perfecto.',
      tag: null
    },
    {
      icon: '✏️',
      title: 'Evaluador de Ensayos',
      description: 'Revisa tus ensayos con rúbrica: estructura, rigor jurídico, argumentación y conclusión. Feedback detallado.',
      tag: null
    },
    {
      icon: '📚',
      title: 'Flashcards Automáticas',
      description: 'Genera tarjetas de estudio de cualquier tema con pregunta y respuesta (incluye artículos). Perfectas para repasar.',
      tag: 'Nuevo'
    }
  ];

  return (
    <div className="relative bg-gradient-to-b from-white via-[#f8f9fa] to-[#f1f3f5] py-24 overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,102,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,102,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e9ecef] rounded-full text-sm font-medium text-[#6c757d] mb-6">
            7 formas de estudiar
          </div>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            Elige cómo quieres aprender
          </h2>
          <p className="font-sans text-xl text-[#6c757d] max-w-2xl mx-auto">
            No es solo un chat. TutorLaw se adapta a tu estilo de estudio y lo que necesitas en cada momento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#e9ecef] p-6 hover:shadow-lg transition-shadow relative group"
            >
              {feature.tag && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#0066ff] text-white text-xs font-semibold rounded-full">
                  {feature.tag}
                </div>
              )}
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-sans font-bold text-lg text-[#212529] mb-2">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-[#6c757d] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
