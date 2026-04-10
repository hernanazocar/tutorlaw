'use client';

import { useEffect, useState } from 'react';
import { getLevel, getProgressToNextLevel, getNextLevel, getProgress } from '@/lib/gamification';
import { TrophyIcon, StarIcon } from '@/components/ui/Icons';

export function LevelBadge() {
  const [progress, setProgress] = useState(() => getProgress());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getProgress());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentLevel = getLevel(progress.xp);
  const nextLevel = getNextLevel(currentLevel.level);
  const progressPercent = getProgressToNextLevel(progress.xp);

  return (
    <div className="relative">
      <div
        className="flex flex-col items-center justify-center gap-1 w-[85px] h-[85px] bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <TrophyIcon className="w-6 h-6 text-white" />
        <div className="text-center text-white leading-tight">
          <div className="text-sm font-bold whitespace-nowrap">Nivel {currentLevel.level}</div>
          <div className="text-xs opacity-90">{progress.xp} XP</div>
        </div>
      </div>

      {showTooltip && (
        <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-[#e9ecef] rounded-lg shadow-xl p-3 z-[100]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-[#212529]">{currentLevel.name}</span>
            <TrophyIcon className="w-5 h-5 text-purple-600" />
          </div>

          <div className="mb-3">
            <div className="text-center mb-2">
              <div className="text-3xl font-bold text-purple-600">{currentLevel.level}</div>
              <div className="text-xs text-gray-600">Nivel actual</div>
            </div>
          </div>

          {nextLevel && (
            <>
              <div className="mb-3 pb-3 border-b border-gray-200">
                <div className="flex justify-between text-xs text-[#6c757d] mb-1">
                  <span>{progress.xp} XP</span>
                  <span>{nextLevel.minXP} XP</span>
                </div>
                <div className="w-full h-2 bg-[#f8f9fa] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-[#6c757d] mt-1">
                  Próximo nivel: {nextLevel.name}
                </p>
                <p className="text-xs text-purple-600 font-semibold">
                  Faltan {nextLevel.minXP - progress.xp} XP
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-700">Estadísticas</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Preguntas:</span>
                <span className="font-semibold text-gray-900">{progress.totalQuestions}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Correctas:</span>
                <span className="font-semibold text-green-600">
                  {progress.correctAnswers} ({progress.totalQuestions > 0 ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-700 mb-1">Gana XP:</div>
            <ul className="text-xs text-gray-600 space-y-0.5">
              <li>• Quiz: +10 XP por correcta</li>
              <li>• Examen: +15 XP por correcta</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
