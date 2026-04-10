'use client';

export type TeacherMode = 'patient' | 'strict';

interface TeacherModeToggleProps {
  mode: TeacherMode;
  onChange: (mode: TeacherMode) => void;
}

export function TeacherModeToggle({ mode, onChange }: TeacherModeToggleProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e9ecef] rounded-lg">
      <span className="text-xs font-semibold text-[#6c757d]">Modo:</span>
      <div className="flex gap-1 bg-[#f8f9fa] rounded-lg p-1">
        <button
          onClick={() => onChange('patient')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
            mode === 'patient'
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-[#6c757d] hover:bg-white'
          }`}
        >
          😊 Paciente
        </button>
        <button
          onClick={() => onChange('strict')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
            mode === 'strict'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-[#6c757d] hover:bg-white'
          }`}
        >
          😤 Exigente
        </button>
      </div>
    </div>
  );
}
