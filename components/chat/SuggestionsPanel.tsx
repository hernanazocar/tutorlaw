interface Suggestion {
  title: string;
  prompt: string;
}

const SUGGESTIONS: Record<string, Suggestion[]> = {
  tutor: [
    { title: '📚 Explícame un concepto', prompt: 'Explícame qué es la legítima defensa' },
    { title: '📝 Elementos de...', prompt: 'Cuáles son los elementos del contrato' },
    { title: '📖 Artículos relacionados', prompt: 'Qué artículos regulan el mandato' },
    { title: '💡 Dame ejemplos', prompt: 'Dame ejemplos de error en el consentimiento' },
  ],
  socratico: [
    { title: '❓ Empecemos a pensar', prompt: 'Quiero entender mejor la prescripción' },
    { title: '🤔 Guíame con preguntas', prompt: 'Ayúdame a descubrir qué es la simulación' },
    { title: '🧠 Razonamiento paso a paso', prompt: 'Guíame para entender el dolo' },
    { title: '💭 Análisis crítico', prompt: 'Qué diferencia hay entre novación y compensación' },
  ],
  caso: [
    { title: '⚖️ Resuelve mi caso', prompt: 'Juan compró un auto con vicios ocultos. ¿Puede pedir resolución del contrato?' },
    { title: '📋 Metodología IRAC', prompt: 'Analiza este caso: Pedro prestó dinero sin documentar' },
    { title: '🔍 Identifica el problema', prompt: 'María firmó un contrato bajo amenaza' },
    { title: '📚 Aplica las normas', prompt: 'Caso: Arrendamiento sin escritura pública' },
  ],
  debate: [
    { title: '🗣️ Debate: Legítima defensa', prompt: 'Defiendo que la legítima defensa justifica cualquier acción' },
    { title: '⚔️ Tesis vs Antítesis', prompt: 'El dolo eventual es igual que el dolo directo' },
    { title: '📢 Argumenta tu posición', prompt: 'La simulación debe probarse de forma estricta' },
    { title: '🎯 Refuta mi argumento', prompt: 'El error esencial siempre anula el contrato' },
  ],
  examen: [
    { title: '📝 Genera preguntas', prompt: 'Hazme preguntas sobre responsabilidad civil' },
    { title: '✅ Múltiple opción', prompt: 'Dame 5 preguntas de alternativas sobre contratos' },
    { title: '📊 Evalúa mi respuesta', prompt: 'Pregúntame sobre prescripción adquisitiva' },
    { title: '🎯 Desarrollo', prompt: 'Dame una pregunta de desarrollo sobre bienes' },
  ],
  oral: [
    { title: '🎤 Simula examen oral', prompt: 'Comienza el examen oral sobre obligaciones' },
    { title: '❓ Pregunta y repregunta', prompt: 'Examíname sobre sucesión intestada' },
    { title: '⏱️ Examen cronometrado', prompt: 'Examen oral de 10 minutos sobre contratos' },
    { title: '🎓 Evalúa mi conocimiento', prompt: 'Hazme un oral sobre derechos reales' },
  ],
  ensayo: [
    { title: '✏️ Revisa mi ensayo', prompt: 'Voy a escribir un ensayo sobre la causa en los contratos' },
    { title: '📊 Evalúa estructura', prompt: 'Revisa la estructura de mi ensayo sobre el error' },
    { title: '🔍 Feedback detallado', prompt: 'Dame retroalimentación sobre mi argumentación' },
    { title: '📚 Rúbrica completa', prompt: 'Evalúa mi ensayo con nota 1-7' },
  ],
};

interface SuggestionsPanelProps {
  mode: string;
  onSelectSuggestion: (prompt: string) => void;
}

export function SuggestionsPanel({ mode, onSelectSuggestion }: SuggestionsPanelProps) {
  const suggestions = SUGGESTIONS[mode] || SUGGESTIONS.tutor;

  return (
    <div className="w-72 bg-white border-l border-[#e9ecef] flex flex-col">
      <div className="p-3 border-b border-[#e9ecef]">
        <h3 className="text-sm font-bold text-[#212529]">💡 Sugerencias</h3>
        <p className="text-xs text-[#6c757d] mt-1">Haz clic para usar</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion.prompt)}
            className="w-full text-left p-3 bg-[#f8f9fa] hover:bg-[#e9ecef] rounded-lg transition-colors group"
          >
            <div className="text-sm font-semibold text-[#212529] mb-1 group-hover:text-[#0066ff] transition-colors">
              {suggestion.title}
            </div>
            <div className="text-xs text-[#6c757d] line-clamp-2">
              {suggestion.prompt}
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-[#e9ecef] bg-[#f8f9fa]">
        <div className="text-xs text-[#6c757d] text-center">
          <p className="font-semibold text-[#212529] mb-1">💡 Consejo</p>
          <p>Sé específico en tus preguntas para obtener mejores respuestas</p>
        </div>
      </div>
    </div>
  );
}
