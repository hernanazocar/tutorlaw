'use client';

import { useState, useEffect } from 'react';
import { TargetIcon, CheckCircleIcon, ClockIcon } from '@/components/ui/Icons';
import { addQuestionXP } from '@/lib/gamification';

type Challenge = {
  id: string;
  date: string;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
  ramo: string;
  dificultad: 'fácil' | 'medio' | 'difícil';
};

interface DailyChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  jurisdiccion: string;
}

export function DailyChallenge({ isOpen, onClose, jurisdiccion }: DailyChallengeProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadDailyChallenge();
    }
  }, [isOpen]);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const loadDailyChallenge = async () => {
    const today = getTodayDate();
    const completed = JSON.parse(localStorage.getItem('dailyChallengeCompleted') || '{}');

    // Check if already completed today
    if (completed[today]) {
      setChallenge(completed[today].challenge);
      setHasAnswered(true);
      setSelectedAnswer(completed[today].selectedAnswer);
      setIsCorrect(completed[today].isCorrect);
      setXpEarned(completed[today].xpEarned || 0);
      return;
    }

    // Check if we have today's challenge cached
    const cached = JSON.parse(localStorage.getItem('dailyChallenge') || 'null');
    if (cached && cached.date === today) {
      setChallenge(cached);
      return;
    }

    // Generate new challenge
    await generateChallenge();
  };

  const generateChallenge = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/challenge/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jurisdiccion }),
      });

      if (!response.ok) throw new Error('Error generando desafío');

      const data = await response.json();
      const newChallenge = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        date: getTodayDate(),
      };

      setChallenge(newChallenge);
      localStorage.setItem('dailyChallenge', JSON.stringify(newChallenge));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el desafío. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === challenge?.respuestaCorrecta;
    setIsCorrect(correct);
    setHasAnswered(true);

    // Award XP based on difficulty
    let xp = 0;
    if (correct) {
      if (challenge?.dificultad === 'fácil') xp = 15;
      else if (challenge?.dificultad === 'medio') xp = 25;
      else if (challenge?.dificultad === 'difícil') xp = 40;

      addQuestionXP(true);
      setXpEarned(xp);
    }

    // Save completion
    const today = getTodayDate();
    const completed = JSON.parse(localStorage.getItem('dailyChallengeCompleted') || '{}');
    completed[today] = {
      challenge,
      selectedAnswer: answerIndex,
      isCorrect: correct,
      xpEarned: xp,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('dailyChallengeCompleted', JSON.stringify(completed));

    // Update streak
    const streak = JSON.parse(localStorage.getItem('challengeStreak') || '{ "count": 0, "lastDate": "" }');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (correct) {
      if (streak.lastDate === yesterdayStr) {
        streak.count += 1;
      } else if (streak.lastDate !== today) {
        streak.count = 1;
      }
      streak.lastDate = today;
      localStorage.setItem('challengeStreak', JSON.stringify(streak));
    }
  };

  const getNextChallengeTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TargetIcon className="w-5 h-5" />
                <h2 className="text-lg font-bold">Desafío Diario</h2>
              </div>
              <p className="text-amber-100 text-xs">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : challenge ? (
            <div>
              {/* Challenge Info */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  challenge.dificultad === 'fácil'
                    ? 'bg-green-100 text-green-700'
                    : challenge.dificultad === 'medio'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {challenge.dificultad.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  {challenge.ramo}
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                  +{challenge.dificultad === 'fácil' ? 15 : challenge.dificultad === 'medio' ? 25 : 40} XP
                </span>
              </div>

              {/* Question */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {challenge.pregunta}
                </h3>

                <div className="space-y-2">
                  {challenge.opciones.map((opcion, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer = index === challenge.respuestaCorrecta;

                    let buttonClass = 'w-full text-left px-3 py-2 rounded-lg border-2 transition-all text-xs ';

                    if (hasAnswered) {
                      if (isCorrectAnswer) {
                        buttonClass += 'border-green-500 bg-green-50 ';
                      } else if (isSelected) {
                        buttonClass += 'border-red-500 bg-red-50 ';
                      } else {
                        buttonClass += 'border-gray-200 bg-gray-50 opacity-50 ';
                      }
                    } else {
                      buttonClass += isSelected
                        ? 'border-amber-500 bg-amber-50 '
                        : 'border-gray-300 hover:border-amber-300 ';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={hasAnswered}
                        className={buttonClass}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`font-bold ${
                            hasAnswered && isCorrectAnswer ? 'text-green-600' :
                            hasAnswered && isSelected ? 'text-red-600' :
                            'text-amber-600'
                          }`}>
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="flex-1 text-xs">{opcion}</span>
                          {hasAnswered && isCorrectAnswer && (
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Result */}
              {hasAnswered && (
                <div className={`rounded-lg p-2.5 ${
                  isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`text-base ${isCorrect ? '🎉' : '💡'}`}>
                      {isCorrect ? '🎉' : '💡'}
                    </div>
                    <h4 className={`font-bold text-sm ${
                      isCorrect ? 'text-green-900' : 'text-blue-900'
                    }`}>
                      {isCorrect ? '¡Correcto!' : 'Respuesta incorrecta'}
                    </h4>
                  </div>

                  {isCorrect && xpEarned > 0 && (
                    <p className="text-xs text-green-700 font-semibold mb-1.5">
                      +{xpEarned} XP ganados
                    </p>
                  )}

                  <p className={`text-xs ${
                    isCorrect ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {challenge.explicacion}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4" />
                      <span>Próximo desafío en: {getNextChallengeTime()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay desafío disponible</p>
            </div>
          )}
        </div>

        {!hasAnswered && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              💡 Tómate tu tiempo para pensar. Solo tienes una oportunidad al día.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
