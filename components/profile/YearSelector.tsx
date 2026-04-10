'use client';

import { useEffect, useState } from 'react';
import { AcademicCapIcon } from '@/components/ui/Icons';

const YEARS = [
  { id: '1', name: '1° año', description: 'Introducción al Derecho', color: 'from-blue-400 to-blue-500' },
  { id: '2', name: '2° año', description: 'Derecho Civil I, Penal I', color: 'from-green-400 to-green-500' },
  { id: '3', name: '3° año', description: 'Derecho Civil II, Penal II', color: 'from-yellow-400 to-yellow-500' },
  { id: '4', name: '4° año', description: 'Especialización', color: 'from-orange-400 to-orange-500' },
  { id: '5', name: '5° año', description: 'Práctica profesional', color: 'from-red-400 to-red-500' },
  { id: 'egresado', name: 'Egresado', description: 'Preparación examen de grado', color: 'from-purple-400 to-purple-500' },
  { id: 'profesional', name: 'Profesional', description: 'Actualización y repaso', color: 'from-gray-600 to-gray-700' },
];

export function YearSelector() {
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userYear') || '';
    }
    return '';
  });
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    if (selectedYear) {
      localStorage.setItem('userYear', selectedYear);
    }
  }, [selectedYear]);

  const currentYear = YEARS.find(y => y.id === selectedYear);

  if (!selectedYear) {
    // Modal inicial para seleccionar año
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
          <div className="text-center mb-6">
            <AcademicCapIcon className="w-16 h-16 mx-auto mb-3 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido a TutorLaw!</h2>
            <p className="text-gray-600">Selecciona tu nivel para personalizar tu experiencia</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {YEARS.map((year) => (
              <button
                key={year.id}
                onClick={() => setSelectedYear(year.id)}
                className={`p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left bg-gradient-to-br ${year.color} text-white`}
              >
                <div className="font-bold text-lg mb-1">{year.name}</div>
                <div className="text-sm opacity-90">{year.description}</div>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Podrás cambiar esto más tarde desde tu perfil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${currentYear?.color} text-white hover:shadow-md transition-all`}
      >
        <AcademicCapIcon className="w-4 h-4" />
        <div className="flex-1 text-left">
          <div className="text-xs font-bold">{currentYear?.name}</div>
          <div className="text-xs opacity-90 truncate">{currentYear?.description}</div>
        </div>
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {showSelector && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-700 px-2 py-1">Cambiar nivel</div>
            {YEARS.map((year) => (
              <button
                key={year.id}
                onClick={() => {
                  setSelectedYear(year.id);
                  setShowSelector(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  selectedYear === year.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-semibold">{year.name}</div>
                <div className="text-xs opacity-75">{year.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function getUserYear(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userYear') || '';
  }
  return '';
}

export function getUserYearInfo() {
  const yearId = getUserYear();
  return YEARS.find(y => y.id === yearId);
}
