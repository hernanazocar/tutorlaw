'use client';

import { useEffect, useState } from 'react';
import { checkStreak } from '@/lib/gamification';
import { FlameIcon } from '@/components/ui/Icons';

export function StreakCounter() {
  const [streakData, setStreakData] = useState(() => checkStreak());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreakData(checkStreak());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (streakData.streak === 0) return null;

  const getMotivation = (streak: number) => {
    if (streak >= 30) return '¡Impresionante! Eres un estudiante dedicado.';
    if (streak >= 14) return '¡Excelente! Dos semanas seguidas.';
    if (streak >= 7) return '¡Genial! Una semana completa.';
    if (streak >= 3) return '¡Bien! Sigue así.';
    return '¡Buen comienzo! No pierdas el ritmo.';
  };

  const getNextMilestone = (streak: number) => {
    if (streak < 3) return 3;
    if (streak < 7) return 7;
    if (streak < 14) return 14;
    if (streak < 30) return 30;
    if (streak < 60) return 60;
    return 100;
  };

  const nextMilestone = getNextMilestone(streakData.streak);
  const daysToMilestone = nextMilestone - streakData.streak;

  return (
    <div className="relative">
      <div
        className="flex flex-col items-center justify-center gap-0.5 w-[70px] h-[70px] bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-sm cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all hover:shadow-md"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FlameIcon className="w-5 h-5 text-white animate-pulse" />
        <div className="text-center text-white leading-tight">
          <div className="text-xs font-bold whitespace-nowrap">{streakData.streak} día{streakData.streak !== 1 ? 's' : ''}</div>
          <div className="text-[10px] opacity-90">Racha</div>
        </div>
      </div>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-[#e9ecef] rounded-lg shadow-xl p-3 z-[100]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-[#212529]">Racha de estudio</span>
            <FlameIcon className="w-5 h-5 text-orange-500" />
          </div>

          <div className="mb-3">
            <div className="text-center mb-2">
              <div className="text-3xl font-bold text-orange-600">{streakData.streak}</div>
              <div className="text-xs text-gray-600">días consecutivos</div>
            </div>
            <p className="text-xs text-gray-700 text-center italic">
              {getMotivation(streakData.streak)}
            </p>
          </div>

          <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Próximo hito: {nextMilestone} días</span>
              <span>{daysToMilestone} días más</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${(streakData.streak / nextMilestone) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-700">¿Cómo funciona?</div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Estudia al menos una vez al día</li>
              <li>• Completa quizzes o exámenes</li>
              <li>• No dejes pasar 24 horas sin actividad</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
