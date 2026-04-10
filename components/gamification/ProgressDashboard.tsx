'use client';

import { useState, useEffect } from 'react';
import { getProgress, checkStreak, getLevel } from '@/lib/gamification';

type StudySession = {
  fecha: string;
  preguntas: number;
  correctas: number;
  xpGanado: number;
};

type ExamResult = {
  ramo: string;
  fecha: string;
  preguntas: number;
  correctas: number;
  porcentaje: number;
  xp: number;
};

export function ProgressDashboard() {
  const [progress, setProgress] = useState(() => getProgress());
  const [streakData, setStreakData] = useState(() => checkStreak());
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    // Cargar resultados de exámenes
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    setExamResults(results);

    // Cargar sesiones de estudio (desde Quick Quiz)
    const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    setStudySessions(sessions);
  }, []);

  const currentLevel = getLevel(progress.xp);
  const totalPreguntasRespondidas = progress.totalQuestions;
  const tasaExito = totalPreguntasRespondidas > 0
    ? Math.round((progress.correctAnswers / totalPreguntasRespondidas) * 100)
    : 0;

  // Filtrar datos según período seleccionado
  const filterByPeriod = (fecha: string) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (selectedPeriod === 'week') return diffDays <= 7;
    if (selectedPeriod === 'month') return diffDays <= 30;
    return true;
  };

  const filteredExams = examResults.filter((e) => filterByPeriod(e.fecha));
  const filteredSessions = studySessions.filter((s) => filterByPeriod(s.fecha));

  // Calcular estadísticas del período
  const totalExamenes = filteredExams.length;
  const promedioExamenes = totalExamenes > 0
    ? Math.round(
        filteredExams.reduce((acc, e) => acc + e.porcentaje, 0) / totalExamenes
      )
    : 0;

  const totalSesiones = filteredSessions.length;
  const xpPeriodo = [
    ...filteredExams.map((e) => e.xp),
    ...filteredSessions.map((s) => s.xpGanado),
  ].reduce((acc, xp) => acc + xp, 0);

  // Calcular actividad por día (últimos 7 días)
  const actividadPorDia = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];

    const examenes = examResults.filter((e) => e.fecha.startsWith(dateStr)).length;
    const sesiones = studySessions.filter((s) => s.fecha.startsWith(dateStr)).length;

    return {
      dia: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      actividad: examenes + sesiones,
    };
  });

  const maxActividad = Math.max(...actividadPorDia.map((d) => d.actividad), 1);

  // Ramos más estudiados
  const ramoStats: { [key: string]: number } = {};
  examResults.forEach((e) => {
    ramoStats[e.ramo] = (ramoStats[e.ramo] || 0) + 1;
  });
  const topRamos = Object.entries(ramoStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Progreso</h1>
        <p className="text-gray-600">Visualiza tu rendimiento y estadísticas de estudio</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedPeriod('week')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            selectedPeriod === 'week'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Esta semana
        </button>
        <button
          onClick={() => setSelectedPeriod('month')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            selectedPeriod === 'month'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Este mes
        </button>
        <button
          onClick={() => setSelectedPeriod('all')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            selectedPeriod === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todo el tiempo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-4xl mb-2">{currentLevel.emoji}</div>
          <div className="text-2xl font-bold mb-1">Nivel {currentLevel.level}</div>
          <div className="text-purple-100 text-sm">{progress.xp} XP total</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-6 shadow-lg">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-bold mb-1">{streakData.streak} días</div>
          <div className="text-orange-100 text-sm">Racha actual</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-2xl font-bold mb-1">{tasaExito}%</div>
          <div className="text-green-100 text-sm">Tasa de éxito</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-2xl font-bold mb-1">{totalPreguntasRespondidas}</div>
          <div className="text-blue-100 text-sm">Preguntas totales</div>
        </div>
      </div>

      {/* Period Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Exámenes completados</span>
            <span className="text-2xl">📝</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalExamenes}</div>
          {totalExamenes > 0 && (
            <div className="text-sm text-green-600 mt-1">
              Promedio: {promedioExamenes}%
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sesiones de estudio</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalSesiones}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">XP ganado</span>
            <span className="text-2xl">🌟</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">+{xpPeriodo}</div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Actividad de los últimos 7 días</h2>
        <div className="flex items-end justify-between gap-2 h-40">
          {actividadPorDia.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg absolute bottom-0 transition-all"
                  style={{ height: `${(d.actividad / maxActividad) * 100}%` }}
                />
              </div>
              <div className="text-xs font-medium text-gray-600">{d.dia}</div>
              <div className="text-xs text-gray-500">{d.actividad}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Ramos */}
      {topRamos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ramos más estudiados</h2>
          <div className="space-y-3">
            {topRamos.map(([ramo, count], i) => (
              <div key={ramo}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{ramo}</span>
                  <span className="text-sm text-gray-500">{count} exámenes</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    style={{
                      width: `${(count / Math.max(...topRamos.map(([, c]) => c))) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Exams */}
      {filteredExams.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Exámenes recientes</h2>
          <div className="space-y-3">
            {filteredExams.slice(0, 5).map((exam, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{exam.ramo}</div>
                  <div className="text-sm text-gray-600">
                    {exam.correctas}/{exam.preguntas} correctas
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(exam.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${
                      exam.porcentaje >= 70
                        ? 'text-green-600'
                        : exam.porcentaje >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {exam.porcentaje}%
                  </div>
                  <div className="text-xs text-purple-600 font-semibold">+{exam.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredExams.length === 0 && filteredSessions.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aún no tienes actividad en este período
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza a estudiar para ver tus estadísticas aquí
          </p>
        </div>
      )}
    </div>
  );
}
