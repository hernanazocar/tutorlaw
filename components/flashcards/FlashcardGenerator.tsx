'use client';

import { useState } from 'react';
import { SparklesIcon } from '@/components/ui/Icons';

type Flashcard = {
  front: string;
  back: string;
};

interface FlashcardGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  jurisdiccion: string;
}

export function FlashcardGenerator({ isOpen, onClose, jurisdiccion }: FlashcardGeneratorProps) {
  const [tema, setTema] = useState('');
  const [ramo, setRamo] = useState('Derecho Civil');
  const [cantidad, setCantidad] = useState(10);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const ramos = [
    'Derecho Civil',
    'Derecho Penal',
    'Derecho Constitucional',
    'Derecho Procesal',
    'Derecho Comercial',
    'Derecho Laboral',
  ];

  const handleGenerate = async () => {
    if (!tema.trim()) {
      alert('Por favor ingresa un tema');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema,
          ramo,
          cantidad,
          jurisdiccion,
        }),
      });

      if (!response.ok) throw new Error('Error generando flashcards');

      const data = await response.json();
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
      saved.push({
        id: Date.now().toString(),
        tema,
        ramo,
        flashcards: data.flashcards,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('flashcardSets', JSON.stringify(saved));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar flashcards. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleExport = () => {
    const text = flashcards
      .map((card, i) => `${i + 1}. ${card.front}\nR: ${card.back}\n`)
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards-${tema.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Flashcards Auto-generadas</h2>
              </div>
              <p className="text-indigo-100 text-sm">Crea tarjetas de estudio con IA</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {flashcards.length === 0 ? (
            /* Setup Form */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tema o concepto
                </label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ej: Contratos, Delitos contra la propiedad, Derechos fundamentales..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ramo
                </label>
                <select
                  value={ramo}
                  onChange={(e) => setRamo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {ramos.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad de tarjetas
                </label>
                <select
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={5}>5 flashcards</option>
                  <option value={10}>10 flashcards</option>
                  <option value={15}>15 flashcards</option>
                  <option value={20}>20 flashcards</option>
                </select>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">¿Cómo funciona?</h3>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• Ingresa el tema que quieres estudiar</li>
                  <li>• La IA generará preguntas y respuestas</li>
                  <li>• Repasa las tarjetas cuantas veces quieras</li>
                  <li>• Exporta tus tarjetas para estudiar offline</li>
                </ul>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !tema.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? 'Generando...' : 'Generar Flashcards'}
              </button>
            </div>
          ) : (
            /* Flashcard Viewer */
            <div className="flex flex-col items-center">
              {/* Progress */}
              <div className="w-full mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Tarjeta {currentIndex + 1} de {flashcards.length}</span>
                  <span>{Math.round(((currentIndex + 1) / flashcards.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Card */}
              <div
                className="w-full max-w-xl aspect-[3/2] perspective-1000 cursor-pointer mb-8"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-sm font-semibold opacity-75 mb-4">PREGUNTA</div>
                    <p className="text-xl font-bold text-center">
                      {flashcards[currentIndex].front}
                    </p>
                    <div className="mt-8 text-sm opacity-75">
                      Toca para ver la respuesta
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 bg-white border-2 border-indigo-300 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="text-sm font-semibold text-indigo-600 mb-4">RESPUESTA</div>
                    <p className="text-lg text-gray-900 text-center">
                      {flashcards[currentIndex].back}
                    </p>
                    <div className="mt-8 text-sm text-gray-500">
                      Toca para volver a la pregunta
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente →
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                >
                  Exportar TXT
                </button>
                <button
                  onClick={() => {
                    setFlashcards([]);
                    setTema('');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-semibold"
                >
                  Nuevo Set
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
