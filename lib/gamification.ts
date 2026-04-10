/**
 * Sistema de Gamificación - Niveles, XP, Streaks
 */

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  totalQuestions: number;
  correctAnswers: number;
  materiasEstudiadas: Record<string, number>; // materia -> cantidad
  logros: string[];
}

export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  emoji: string;
}

const LEVELS: Level[] = [
  { level: 1, name: 'Estudiante de 1er año', minXP: 0, maxXP: 99, emoji: '📚' },
  { level: 2, name: 'Estudiante de 2do año', minXP: 100, maxXP: 249, emoji: '📖' },
  { level: 3, name: 'Estudiante de 3er año', minXP: 250, maxXP: 499, emoji: '📝' },
  { level: 4, name: 'Estudiante de 4to año', minXP: 500, maxXP: 999, emoji: '⚖️' },
  { level: 5, name: 'Egresado', minXP: 1000, maxXP: 1999, emoji: '🎓' },
  { level: 10, name: 'Memorista', minXP: 2000, maxXP: 3999, emoji: '📜' },
  { level: 15, name: 'Licenciado', minXP: 4000, maxXP: 7999, emoji: '🏆' },
  { level: 20, name: 'Abogado Junior', minXP: 8000, maxXP: 14999, emoji: '⚖️' },
  { level: 25, name: 'Abogado Senior', minXP: 15000, maxXP: 29999, emoji: '👨‍⚖️' },
  { level: 30, name: 'Profesor de Derecho', minXP: 30000, maxXP: 59999, emoji: '👨‍🏫' },
  { level: 40, name: 'Juez', minXP: 60000, maxXP: 99999, emoji: '👨‍⚖️' },
  { level: 50, name: 'Ministro de Corte Suprema', minXP: 100000, maxXP: Infinity, emoji: '⚖️' },
];

const XP_REWARDS = {
  question: 10,
  correctAnswer: 20,
  streak: 50,
  dailyChallenge: 100,
  quickQuiz: 30,
  flashcard: 5,
};

export function getLevel(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getNextLevel(currentLevel: number): Level | null {
  const nextLevelIndex = LEVELS.findIndex(l => l.level > currentLevel);
  return nextLevelIndex >= 0 ? LEVELS[nextLevelIndex] : null;
}

export function getProgressToNextLevel(xp: number): number {
  const currentLevel = getLevel(xp);
  const nextLevel = getNextLevel(currentLevel.level);

  if (!nextLevel) return 100; // Max level

  const currentLevelXP = xp - currentLevel.minXP;
  const levelRange = nextLevel.minXP - currentLevel.minXP;

  return Math.min(100, (currentLevelXP / levelRange) * 100);
}

export function addXP(currentXP: number, amount: number): number {
  return currentXP + amount;
}

export function checkStreak(): { streak: number; isActive: boolean } {
  const progress = getProgress();
  const today = new Date().toDateString();
  const lastStudy = progress.lastStudyDate ? new Date(progress.lastStudyDate).toDateString() : null;

  if (lastStudy === today) {
    return { streak: progress.streak, isActive: true };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (lastStudy === yesterdayStr) {
    // Continua el streak
    return { streak: progress.streak + 1, isActive: true };
  }

  // Se rompió el streak
  return { streak: 1, isActive: false };
}

export function updateStreak(): number {
  const { streak } = checkStreak();
  const progress = getProgress();

  progress.streak = streak;
  progress.lastStudyDate = new Date().toISOString();

  // Bonus XP por streak
  if (streak % 7 === 0) {
    progress.xp = addXP(progress.xp, XP_REWARDS.streak);
  }

  saveProgress(progress);
  return streak;
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  const stored = localStorage.getItem('tutorlaw_progress');
  if (!stored) {
    return getDefaultProgress();
  }

  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('tutorlaw_progress', JSON.stringify(progress));
}

export function getDefaultProgress(): UserProgress {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: '',
    totalQuestions: 0,
    correctAnswers: 0,
    materiasEstudiadas: {},
    logros: [],
  };
}

export function addQuestionXP(correct: boolean): number {
  const progress = getProgress();

  progress.totalQuestions++;
  let xpGained = XP_REWARDS.question;

  if (correct) {
    progress.correctAnswers++;
    xpGained += XP_REWARDS.correctAnswer;
  }

  progress.xp = addXP(progress.xp, xpGained);

  const currentLevel = getLevel(progress.xp);
  progress.level = currentLevel.level;

  saveProgress(progress);
  updateStreak();

  return xpGained;
}

export function getAllLevels(): Level[] {
  return LEVELS;
}
