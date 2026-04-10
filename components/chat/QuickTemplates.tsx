interface Template {
  icon: string;
  label: string;
  suffix: string;
}

const TEMPLATES: Template[] = [
  { icon: '📋', label: 'Formato IRAC', suffix: ' (explica en formato IRAC: Issue, Rule, Analysis, Conclusion)' },
  { icon: '💡', label: '3 Ejemplos', suffix: ' (dame 3 ejemplos prácticos)' },
  { icon: '🎯', label: 'Más Simple', suffix: ' (explícalo de forma más simple)' },
  { icon: '❓', label: '5 Preguntas', suffix: ' (genera 5 preguntas sobre esto)' },
  { icon: '📚', label: 'Artículos', suffix: ' (indica qué artículos del código aplican)' },
  { icon: '⚖️', label: 'Casos', suffix: ' (dame casos judiciales relacionados)' },
];

interface QuickTemplatesProps {
  onSelectTemplate: (suffix: string) => void;
  visible: boolean;
}

export function QuickTemplates({ onSelectTemplate, visible }: QuickTemplatesProps) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#e9ecef] rounded-lg shadow-lg p-2 max-h-[60vh] overflow-y-auto">
      <div className="text-xs font-semibold text-[#6c757d] mb-2 px-2">
        📝 Templates rápidos
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        {TEMPLATES.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelectTemplate(template.suffix)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm bg-[#f8f9fa] hover:bg-[#e9ecef] rounded-lg transition-colors"
          >
            <span className="text-sm sm:text-base">{template.icon}</span>
            <span className="text-[#212529] font-medium truncate">{template.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
