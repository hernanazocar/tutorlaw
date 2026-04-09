export function Comparison() {
  const comparisons = [
    {
      feature: 'Disponibilidad',
      tutor: '1-2 veces/semana',
      chatgpt: '24/7',
      tutorlaw: '24/7',
      highlight: false
    },
    {
      feature: 'Conoce derecho chileno',
      tutor: '✓',
      chatgpt: 'Aprox. (errores comunes)',
      tutorlaw: '✓ Artículos exactos',
      highlight: true
    },
    {
      feature: 'Método socrático',
      tutor: '✓',
      chatgpt: '✗',
      tutorlaw: '✓',
      highlight: true
    },
    {
      feature: 'Casos IRAC',
      tutor: 'Depende',
      chatgpt: '✗',
      tutorlaw: '✓',
      highlight: true
    },
    {
      feature: 'Genera exámenes',
      tutor: '✗',
      chatgpt: 'Genérico',
      tutorlaw: '✓ Con evaluación',
      highlight: true
    },
    {
      feature: 'Precio',
      tutor: '$15.000-30.000/hr',
      chatgpt: 'Gratis o $20 USD/mes',
      tutorlaw: 'Gratis hasta 20/mes',
      highlight: false
    },
    {
      feature: 'Paciencia',
      tutor: 'Limitada',
      chatgpt: 'Infinita',
      tutorlaw: 'Infinita',
      highlight: false
    }
  ];

  return (
    <div className="relative bg-gradient-to-b from-[#f8f9fa] to-white py-24 overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            ¿Por qué TutorLaw?
          </h2>
          <p className="font-sans text-xl text-[#6c757d] max-w-2xl mx-auto">
            Combina lo mejor de un tutor particular con la disponibilidad de la IA, pero especializado en derecho chileno.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e9ecef] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e9ecef]">
                  <th className="text-left p-6 font-sans font-semibold text-[#6c757d] text-sm w-1/4">
                    Característica
                  </th>
                  <th className="text-center p-6 font-sans font-semibold text-[#6c757d] text-sm w-1/4">
                    Tutor particular
                  </th>
                  <th className="text-center p-6 font-sans font-semibold text-[#6c757d] text-sm w-1/4">
                    ChatGPT genérico
                  </th>
                  <th className="text-center p-6 font-sans font-bold text-[#0066ff] text-sm w-1/4 bg-[#e6f0ff]">
                    TutorLaw
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-[#e9ecef] ${row.highlight ? 'bg-[#f8f9fa]' : ''}`}
                  >
                    <td className="p-6 font-sans text-[#212529] font-medium text-sm">
                      {row.feature}
                    </td>
                    <td className="p-6 text-center font-sans text-[#6c757d] text-sm">
                      {row.tutor}
                    </td>
                    <td className="p-6 text-center font-sans text-[#6c757d] text-sm">
                      {row.chatgpt}
                    </td>
                    <td className="p-6 text-center font-sans text-[#212529] font-semibold text-sm bg-[#e6f0ff]/30">
                      {row.tutorlaw}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="font-sans text-sm text-[#6c757d]">
            * Precios referenciales. Tutores particulares de derecho cobran entre $15.000 y $30.000 por hora en Chile.
          </p>
        </div>
      </div>
    </div>
  );
}
