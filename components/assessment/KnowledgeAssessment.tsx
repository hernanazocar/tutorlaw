'use client';

import { useState, useEffect } from 'react';
import { BrainIcon, CheckCircleIcon, TargetIcon } from '@/components/ui/Icons';
import { addQuestionXP } from '@/lib/gamification';

type AssessmentQuestion = {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  ramo: string;
  nivel: 'básico' | 'intermedio' | 'avanzado';
};

type AssessmentResult = {
  ramo: string;
  nivel: 'básico' | 'intermedio' | 'avanzado';
  porcentaje: number;
  recomendaciones: string[];
};

interface KnowledgeAssessmentProps {
  isOpen: boolean;
  onClose: () => void;
  jurisdiccion: string;
}

export function KnowledgeAssessment({ isOpen, onClose, jurisdiccion }: KnowledgeAssessmentProps) {
  const [step, setStep] = useState<'select' | 'test' | 'results'>('select');
  const [selectedRamo, setSelectedRamo] = useState('');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const ramos = [
    'Derecho Civil',
    'Derecho Penal',
    'Derecho Constitucional',
    'Derecho Procesal',
    'Derecho Comercial',
    'Derecho Laboral',
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSelectedRamo('');
      setQuestions([]);
      setCurrentQuestion(0);
      setAnswers([]);
      setResults(null);
    }
  }, [isOpen]);

  const startAssessment = async () => {
    if (!selectedRamo) return;

    setLoading(true);
    try {
      const response = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ramo: selectedRamo,
          jurisdiccion,
        }),
      });

      if (!response.ok) throw new Error('Error generando evaluación');

      const data = await response.json();
      setQuestions(data.preguntas);
      setAnswers(new Array(data.preguntas.length).fill(null));
      setStep('test');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar la evaluación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishAssessment = () => {
    // Calculate results
    let basicoCorrect = 0;
    let intermedioCorrect = 0;
    let avanzadoCorrect = 0;
    let basicoTotal = 0;
    let intermedioTotal = 0;
    let avanzadoTotal = 0;
    let totalCorrect = 0;

    questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.respuestaCorrecta;

      if (q.nivel === 'básico') {
        basicoTotal++;
        if (isCorrect) basicoCorrect++;
      } else if (q.nivel === 'intermedio') {
        intermedioTotal++;
        if (isCorrect) intermedioCorrect++;
      } else {
        avanzadoTotal++;
        if (isCorrect) avanzadoCorrect++;
      }

      if (isCorrect) {
        totalCorrect++;
        addQuestionXP(true);
      }
    });

    const basicoPct = basicoTotal > 0 ? (basicoCorrect / basicoTotal) * 100 : 0;
    const intermedioPct = intermedioTotal > 0 ? (intermedioCorrect / intermedioTotal) * 100 : 0;
    const avanzadoPct = avanzadoTotal > 0 ? (avanzadoCorrect / avanzadoTotal) * 100 : 0;
    const totalPct = (totalCorrect / questions.length) * 100;

    // Determine level
    let nivel: 'básico' | 'intermedio' | 'avanzado';
    if (avanzadoPct >= 70) {
      nivel = 'avanzado';
    } else if (intermedioPct >= 70 || basicoPct >= 80) {
      nivel = 'intermedio';
    } else {
      nivel = 'básico';
    }

    // Generate recommendations
    const recomendaciones: string[] = [];

    if (basicoPct < 70) {
      recomendaciones.push('Refuerza los conceptos fundamentales con el modo Tutor');
      recomendaciones.push('Usa flashcards para memorizar definiciones básicas');
    }

    if (intermedioPct < 70 && basicoPct >= 70) {
      recomendaciones.push('Practica casos prácticos con el modo IRAC');
      recomendaciones.push('Participa en el desafío diario para mejorar');
    }

    if (avanzadoPct < 70 && intermedioPct >= 70) {
      recomendaciones.push('Profundiza con el modo Debate y casos complejos');
      recomendaciones.push('Realiza simuladores de examen para casos avanzados');
    }

    if (totalPct >= 90) {
      recomendaciones.push('¡Excelente! Considera ayudar a otros estudiantes');
    }

    const result: AssessmentResult = {
      ramo: selectedRamo,
      nivel,
      porcentaje: Math.round(totalPct),
      recomendaciones: recomendaciones.length > 0 ? recomendaciones : ['¡Sigue practicando para mejorar!'],
    };

    setResults(result);

    // Save assessment
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    assessments.push({
      ...result,
      fecha: new Date().toISOString(),
      preguntas: questions.length,
      correctas: totalCorrect,
    });
    localStorage.setItem('assessments', JSON.stringify(assessments));

    // Save recommended level for this ramo
    const levels = JSON.parse(localStorage.getItem('ramoLevels') || '{}');
    levels[selectedRamo] = nivel;
    localStorage.setItem('ramoLevels', JSON.stringify(levels));

    setStep('results');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BrainIcon className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Diagnóstico de Conocimientos</h2>
              </div>
              <p className="text-cyan-100 text-sm">Evalúa tu nivel y recibe recomendaciones personalizadas</p>
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
          {/* Select Ramo */}
          {step === 'select' && (
            <div className="space-y-6">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <h3 className="font-semibold text-cyan-900 mb-2">¿Cómo funciona?</h3>
                <ul className="text-sm text-cyan-700 space-y-1">
                  <li>• Responde 15 preguntas de nivel progresivo</li>
                  <li>• Evaluamos tu conocimiento en 3 niveles: básico, intermedio y avanzado</li>
                  <li>• Recibe recomendaciones personalizadas para mejorar</li>
                  <li>• Gana XP por cada respuesta correcta</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Selecciona el ramo a evaluar
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ramos.map((ramo) => (
                    <button
                      key={ramo}
                      onClick={() => setSelectedRamo(ramo)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedRamo === ramo
                          ? 'border-cyan-500 bg-cyan-50 shadow-md'
                          : 'border-gray-300 hover:border-cyan-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{ramo}</div>
                      <div className="text-xs text-gray-600 mt-1">15 preguntas</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startAssessment}
                disabled={loading || !selectedRamo}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? 'Generando evaluación...' : 'Comenzar Diagnóstico'}
              </button>
            </div>
          )}

          {/* Test */}
          {step === 'test' && questions.length > 0 && (
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    questions[currentQuestion].nivel === 'básico'
                      ? 'bg-green-100 text-green-700'
                      : questions[currentQuestion].nivel === 'intermedio'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {questions[currentQuestion].nivel.toUpperCase()}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {questions[currentQuestion].pregunta}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestion].opciones.map((opcion, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        answers[currentQuestion] === index
                          ? 'border-cyan-600 bg-cyan-50'
                          : 'border-gray-300 hover:border-cyan-300'
                      }`}
                    >
                      <span className="font-semibold text-cyan-600 mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {opcion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={answers[currentQuestion] === null}
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente →'}
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {step === 'results' && results && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {results.porcentaje >= 80 ? '🎉' : results.porcentaje >= 60 ? '📚' : '💪'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {results.porcentaje >= 80 ? '¡Excelente!' : results.porcentaje >= 60 ? 'Buen trabajo' : 'Sigue practicando'}
                </h3>
                <p className="text-gray-600">Has completado el diagnóstico de {results.ramo}</p>
              </div>

              {/* Score */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl p-6 text-center">
                <div className="text-5xl font-bold mb-2">{results.porcentaje}%</div>
                <div className="text-cyan-100">Calificación general</div>
              </div>

              {/* Level */}
              <div className="bg-white border-2 border-cyan-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">Tu nivel determinado</h4>
                  <TargetIcon className="w-6 h-6 text-cyan-600" />
                </div>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  results.nivel === 'básico'
                    ? 'bg-green-100 text-green-700'
                    : results.nivel === 'intermedio'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  NIVEL {results.nivel.toUpperCase()}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  Recomendaciones personalizadas
                </h4>
                <ul className="space-y-2">
                  {results.recomendaciones.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep('select');
                    setSelectedRamo('');
                    setQuestions([]);
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setResults(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  Evaluar otro ramo
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
