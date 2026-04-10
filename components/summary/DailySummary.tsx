'use client';

import { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, StarIcon, FlameIcon, TrophyIcon } from '@/components/ui/Icons';
import { getProgress, checkStreak } from '@/lib/gamification';

export function DailySummary() {
  const [summary, setSummary] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    generateSummary(selectedDate);
  }, [selectedDate]);

  const generateSummary = (date: string) => {
    const progress = getProgress();
    const streakData = checkStreak();

    // Get today's activity
    const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    const studySessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    const dailyChallenge = JSON.parse(localStorage.getItem('dailyChallengeCompleted') || '{}');
    const flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');

    // Filter by selected date
    const todayExams = examResults.filter((e: any) => e.fecha.startsWith(date));
    const todaySessions = studySessions.filter((s: any) => s.fecha.startsWith(date));
    const todayChallenge = dailyChallenge[date];
    const todayFlashcards = flashcardSets.filter((f: any) => f.createdAt.startsWith(date));
    const todayAssessments = assessments.filter((a: any) => a.fecha.startsWith(date));

    // Calculate stats
    const totalQuestions = todayExams.reduce((acc: number, e: any) => acc + e.preguntas, 0) +
                          todaySessions.reduce((acc: number, s: any) => acc + s.preguntas, 0) +
                          (todayChallenge ? 1 : 0);

    const correctAnswers = todayExams.reduce((acc: number, e: any) => acc + e.correctas, 0) +
                          todaySessions.reduce((acc: number, s: any) => acc + s.correctas, 0) +
                          (todayChallenge?.isCorrect ? 1 : 0);

    const xpEarned = todayExams.reduce((acc: number, e: any) => acc + e.xp, 0) +
                    todaySessions.reduce((acc: number, s: any) => acc + s.xpGanado, 0) +
                    (todayChallenge?.xpEarned || 0);

    const avgScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Most studied subjects
    const ramoCount: { [key: string]: number } = {};
    todayExams.forEach((e: any) => {
      ramoCount[e.ramo] = (ramoCount[e.ramo] || 0) + 1;
    });

    const topRamos = Object.entries(ramoCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([ramo, count]) => ({ ramo, count }));

    setSummary({
      date,
      totalQuestions,
      correctAnswers,
      avgScore,
      xpEarned,
      exams: todayExams.length,
      quizzes: todaySessions.length,
      flashcardSets: todayFlashcards.length,
      challengeCompleted: !!todayChallenge,
      assessments: todayAssessments.length,
      topRamos,
      streak: streakData.streak,
      currentLevel: progress.xp,
    });
  };

  const getPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const getNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    const today = new Date().toISOString().split('T')[0];
    if (date.toISOString().split('T')[0] <= today) {
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  };

  const getRecommendations = () => {
    if (!summary) return [];

    const recommendations: string[] = [];

    if (summary.totalQuestions === 0) {
      recommendations.push('No estudiaste hoy. ¡Mantén tu racha activa con al menos un desafío diario!');
    } else if (summary.avgScore < 60) {
      recommendations.push('Tu rendimiento puede mejorar. Intenta repasar los conceptos básicos con flashcards.');
    } else if (summary.avgScore >= 80) {
      recommendations.push('¡Excelente rendimiento! Sigue así.');
    }

    if (!summary.challengeCompleted) {
      recommendations.push('Completa el desafío diario para ganar XP extra y mantener tu racha.');
    }

    if (summary.exams === 0 && summary.totalQuestions > 0) {
      recommendations.push('Prueba el simulador de examen para practicar en condiciones reales.');
    }

    if (summary.flashcardSets === 0) {
      recommendations.push('Crea flashcards para reforzar tus conocimientos.');
    }

    if (summary.assessments === 0) {
      recommendations.push('Realiza un diagnóstico de conocimientos para saber en qué enfocarte.');
    }

    return recommendations.length > 0 ? recommendations : ['¡Buen trabajo! Sigue estudiando de manera constante.'];
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  if (!summary) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Resumen de Estudio</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={getPreviousDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="text-center min-w-[180px]">
              <div className="text-lg font-semibold text-gray-900">
                {new Date(selectedDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {isToday && <div className="text-sm text-blue-600 font-semibold">Hoy</div>}
            </div>
            <button
              onClick={getNextDay}
              disabled={isToday}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700 font-medium">Preguntas</span>
            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">{summary.totalQuestions}</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-700 font-medium">Precisión</span>
            <StarIcon className="w-5 h-5 text-green-600" filled />
          </div>
          <div className="text-3xl font-bold text-green-900">{summary.avgScore}%</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700 font-medium">XP Ganado</span>
            <TrophyIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-900">+{summary.xpEarned}</div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-orange-700 font-medium">Racha</span>
            <FlameIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-900">{summary.streak}</div>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Actividades del día</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.exams}</div>
            <div className="text-sm text-gray-600">Exámenes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.quizzes}</div>
            <div className="text-sm text-gray-600">Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.flashcardSets}</div>
            <div className="text-sm text-gray-600">Sets Flashcards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.assessments}</div>
            <div className="text-sm text-gray-600">Diagnósticos</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl ${summary.challengeCompleted ? 'text-green-600' : 'text-gray-300'}`}>
              {summary.challengeCompleted ? '✓' : '○'}
            </div>
            <div className="text-sm text-gray-600">Desafío Diario</div>
          </div>
        </div>
      </div>

      {/* Top Subjects */}
      {summary.topRamos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ramos estudiados</h2>
          <div className="space-y-3">
            {summary.topRamos.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.ramo}</span>
                <span className="text-sm text-gray-500">{item.count} actividad{item.count !== 1 ? 'es' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-3">Recomendaciones</h2>
        <ul className="space-y-2">
          {getRecommendations().map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
