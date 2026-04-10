'use client';

import { useState, useEffect } from 'react';
import { addQuestionXP } from '@/lib/gamification';

type Question = {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
};

type ExamConfig = {
  ramo: string;
  numPreguntas: number;
  duracionMinutos: number;
};

interface ExamSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  ramo: string;
  jurisdiccion: string;
}

export function ExamSimulator({ isOpen, onClose, ramo, jurisdiccion }: ExamSimulatorProps) {
  const [step, setStep] = useState<'config' | 'exam' | 'results'>('config');
  const [config, setConfig] = useState<ExamConfig>({
    ramo,
    numPreguntas: 10,
    duracionMinutos: 30,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep('config');
      setCurrentQuestion(0);
      setAnswers([]);
      setQuestions([]);
      setScore(0);
      setTotalXP(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'exam' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateExam = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ramo: config.ramo,
          jurisdiccion,
          numPreguntas: config.numPreguntas,
        }),
      });

      if (!response.ok) throw new Error('Error generando examen');

      const data = await response.json();
      setQuestions(data.preguntas);
      setAnswers(new Array(data.preguntas.length).fill(null));
      setTimeLeft(config.duracionMinutos * 60);
      setStep('exam');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el examen. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishExam = () => {
    let correct = 0;
    let earnedXP = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.respuestaCorrecta) {
        correct++;
        earnedXP += addQuestionXP(true);
      }
    });

    setScore(correct);
    setTotalXP(earnedXP);
    setStep('results');

    // Guardar resultado
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    results.push({
      ramo: config.ramo,
      fecha: new Date().toISOString(),
      preguntas: questions.length,
      correctas: correct,
      porcentaje: (correct / questions.length) * 100,
      xp: earnedXP,
    });
    localStorage.setItem('examResults', JSON.stringify(results));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">Simulador de Examen</h2>
              <p className="text-purple-100">{config.ramo}</p>
            </div>
            {step === 'exam' && (
              <div className="text-right">
                <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-sm text-purple-100">Tiempo restante</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Configuración */}
          {step === 'config' && (
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de preguntas
                  </label>
                  <select
                    value={config.numPreguntas}
                    onChange={(e) => setConfig({ ...config, numPreguntas: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={5}>5 preguntas</option>
                    <option value={10}>10 preguntas</option>
                    <option value={15}>15 preguntas</option>
                    <option value={20}>20 preguntas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duración del examen
                  </label>
                  <select
                    value={config.duracionMinutos}
                    onChange={(e) => setConfig({ ...config, duracionMinutos: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Instrucciones</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• El examen simulará condiciones reales con tiempo límite</li>
                    <li>• Puedes navegar entre preguntas antes de finalizar</li>
                    <li>• Ganarás XP por cada respuesta correcta</li>
                    <li>• Al terminar verás tu calificación y retroalimentación</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={generateExam}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Generando...' : 'Comenzar Examen'}
                </button>
              </div>
            </div>
          )}

          {/* Examen */}
          {step === 'exam' && questions.length > 0 && (
            <div className="p-8">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{answers.filter(a => a !== null).length} respondidas</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all"
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
                      onClick={() => selectAnswer(index)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        answers[currentQuestion] === index
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <span className="font-semibold text-purple-600 mr-2">
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

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={finishExam}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Finalizar Examen
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                  >
                    Siguiente →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {step === 'results' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">
                  {score / questions.length >= 0.7 ? '🎉' : score / questions.length >= 0.5 ? '📚' : '💪'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {score / questions.length >= 0.7 ? '¡Excelente!' : score / questions.length >= 0.5 ? 'Bien hecho' : 'Sigue practicando'}
                </h3>
                <p className="text-gray-600">Has completado el examen</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{score}</div>
                  <div className="text-sm text-purple-700">Correctas</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-blue-700">Calificación</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">+{totalXP}</div>
                  <div className="text-sm text-green-700">XP ganados</div>
                </div>
              </div>

              {/* Review answers */}
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900">Revisión de respuestas:</h4>
                {questions.map((q, i) => {
                  const isCorrect = answers[i] === q.respuestaCorrecta;
                  return (
                    <div
                      key={i}
                      className={`border-2 rounded-lg p-4 ${
                        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">{q.pregunta}</p>
                          <p className="text-sm text-gray-600">
                            <strong>Tu respuesta:</strong>{' '}
                            {answers[i] !== null ? q.opciones[answers[i]] : 'No respondida'}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-700 mt-1">
                              <strong>Respuesta correcta:</strong> {q.opciones[q.respuestaCorrecta]}
                            </p>
                          )}
                          <p className="text-sm text-gray-700 mt-2 italic">{q.explicacion}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
