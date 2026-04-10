'use client';

import { useState, useEffect } from 'react';
import { addQuestionXP } from '@/lib/gamification';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    question: '¿Qué artículo del Código Civil establece que "todo contrato legalmente celebrado es una ley para los contratantes"?',
    options: ['Art. 1437', 'Art. 1445', 'Art. 1545', 'Art. 1560'],
    correct: 2,
    explanation: 'El Artículo 1545 del Código Civil establece el principio de la fuerza obligatoria del contrato.',
  },
  {
    question: '¿Cuáles son las fuentes de las obligaciones según el Art. 1437?',
    options: [
      'Solo contratos',
      'Contratos, cuasicontratos, delitos, cuasidelitos y la ley',
      'Solo delitos y cuasidelitos',
      'Contratos y la ley únicamente',
    ],
    correct: 1,
    explanation: 'El Art. 1437 enumera cinco fuentes: contratos, cuasicontratos, delitos, cuasidelitos y la ley.',
  },
  {
    question: '¿Qué es la legítima defensa según el Código Penal?',
    options: [
      'Defenderse de cualquier agresión',
      'Defensa ante agresión ilegítima con necesidad racional del medio empleado',
      'Solo defensa de la propiedad',
      'Venganza proporcional',
    ],
    correct: 1,
    explanation: 'La legítima defensa requiere agresión ilegítima, necesidad racional del medio empleado, y falta de provocación suficiente.',
  },
];

interface QuickQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickQuizModal({ isOpen, onClose }: QuickQuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAnswer = (index: number) => {
    if (showResult) return;

    setSelectedAnswer(index);
    setShowResult(true);

    const correct = index === SAMPLE_QUESTIONS[currentQuestion].correct;
    if (correct) {
      setScore(score + 1);
    }

    const xp = addQuestionXP(correct);
    setXpEarned(xpEarned + xp);
  };

  const handleNext = () => {
    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Show final score
    setShowResult(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(120);
    setXpEarned(0);
  };

  const question = SAMPLE_QUESTIONS[currentQuestion];
  const isFinished = currentQuestion >= SAMPLE_QUESTIONS.length - 1 && showResult;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">⚡ Quick Quiz</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span>
                Pregunta {currentQuestion + 1}/{SAMPLE_QUESTIONS.length}
              </span>
              <span className="flex items-center gap-1">
                ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Puntaje: {score}</span>
              <span>+{xpEarned} XP</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {!isFinished ? (
            <>
              {/* Question */}
              <h3 className="text-base font-bold text-[#212529] mb-4">
                {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correct;
                  const showFeedback = showResult;

                  let className = 'w-full text-left p-4 border-2 rounded-xl transition-all ';

                  if (showFeedback) {
                    if (isCorrect) {
                      className += 'border-green-500 bg-green-50 ';
                    } else if (isSelected && !isCorrect) {
                      className += 'border-red-500 bg-red-50 ';
                    } else {
                      className += 'border-[#e9ecef] bg-[#f8f9fa] ';
                    }
                  } else {
                    className += isSelected
                      ? 'border-blue-500 bg-blue-50 '
                      : 'border-[#e9ecef] hover:border-blue-300 hover:bg-blue-50 ';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={className}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          showFeedback
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : isSelected
                              ? 'bg-red-500 text-white'
                              : 'bg-[#e9ecef] text-[#6c757d]'
                            : isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-[#e9ecef] text-[#6c757d]'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm text-[#212529]">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && (
                <div className={`p-4 rounded-xl mb-6 ${
                  selectedAnswer === question.correct
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {selectedAnswer === question.correct ? '✅' : '❌'}
                    </span>
                    <span className="font-bold text-sm">
                      {selectedAnswer === question.correct ? '¡Correcto!' : 'Incorrecto'}
                    </span>
                  </div>
                  <p className="text-sm text-[#6c757d]">{question.explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {showResult && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                >
                  {currentQuestion < SAMPLE_QUESTIONS.length - 1 ? 'Siguiente Pregunta →' : 'Ver Resultados'}
                </button>
              )}
            </>
          ) : (
            /* Final Results */
            <div className="text-center py-8">
              <div className="text-6xl mb-4">
                {score === SAMPLE_QUESTIONS.length ? '🏆' : score >= SAMPLE_QUESTIONS.length / 2 ? '🎉' : '📚'}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {score === SAMPLE_QUESTIONS.length
                  ? '¡Perfecto!'
                  : score >= SAMPLE_QUESTIONS.length / 2
                  ? '¡Bien hecho!'
                  : 'Sigue estudiando'}
              </h3>
              <p className="text-[#6c757d] mb-6">
                Respondiste correctamente {score} de {SAMPLE_QUESTIONS.length} preguntas
              </p>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 mb-6">
                <div className="text-4xl font-bold mb-1">+{xpEarned} XP</div>
                <div className="text-sm opacity-90">Experiencia ganada</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                >
                  Reintentar
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
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
