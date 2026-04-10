import { Modo } from './types';

export const RAMOS = [
  'general',
  'civil',
  'penal',
  'constitucional',
  'procesal',
  'laboral',
  'comercial',
  'administrativo'
] as const;

export const JURISDICCIONES = [
  'Chile',
  'España',
  'México',
  'Argentina',
  'Colombia'
] as const;

export const MODOS: Record<string, Modo> = {
  tutor: {
    label: 'Tutor',
    icon: '📖',
    acento: '#1e3a5f',
    bg: '#eef2f8'
  },
  socratico: {
    label: 'Socrático',
    icon: '🔍',
    acento: '#7c5c0a',
    bg: '#fdf8ec'
  },
  caso: {
    label: 'Caso IRAC',
    icon: '⚖️',
    acento: '#1a4731',
    bg: '#edf5f0'
  },
  debate: {
    label: 'Debate',
    icon: '🗣️',
    acento: '#7b1d1d',
    bg: '#fdf0f0'
  },
  examen: {
    label: 'Preguntas',
    icon: '📝',
    acento: '#14375c',
    bg: '#eef4fb'
  },
  oral: {
    label: 'Examen oral',
    icon: '🎤',
    acento: '#2d3748',
    bg: '#f0f0f5'
  },
  ensayo: {
    label: 'Ensayo',
    icon: '✏️',
    acento: '#4a1d6e',
    bg: '#f5eefb'
  }
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getSystemPrompt(
  mode: string,
  ramo: string = 'general',
  jurisdiccion: string = 'Chile',
  pdfContext?: string,
  teacherMode: 'patient' | 'strict' = 'patient'
): string {
  const ramoText = ramo === 'general'
    ? 'todas las ramas del derecho'
    : `Derecho ${capitalize(ramo)}`;

  const contextText = pdfContext
    ? `\n\nApuntes del estudiante:\n---\n${pdfContext}\n---`
    : '';

  const teacherPersonality = teacherMode === 'strict'
    ? '\n\nPERSONALIDAD EXIGENTE: Sé estricto y directo. Si hay errores, señálalos claramente ("Incorrecto"). No des pistas fáciles. El estudiante debe esforzarse. Mantén estándares altos.'
    : '\n\nPERSONALIDAD PACIENTE: Sé comprensivo y alentador. Si hay errores, corrige con amabilidad ("Casi, pero..."). Da pistas útiles. Celebra los aciertos.';

  const base = `Eres TutorLaw, tutora IA experta en ${ramoText} del ordenamiento jurídico de ${jurisdiccion}. Ayudas a estudiantes universitarios de derecho. Cita artículos y normas reales de ${jurisdiccion}. Sé precisa, didáctica, en español.${teacherPersonality}${contextText}`;

  const prompts: Record<string, string> = {
    tutor: `${base}\n\nMODO TUTOR: estructura definición→elementos→ejemplo→norma. Corrige con amabilidad.`,

    socratico: `${base}\n\nMODO SOCRÁTICO: NUNCA des la respuesta. Solo preguntas guiadas hasta que el estudiante llegue solo a la conclusión.`,

    caso: `${base}\n\nMODO IRAC: Issue→Rule(artículo exacto)→Application→Conclusion. Guía paso a paso sin anticipar.`,

    debate: `${base}\n\nMODO DEBATE: argumenta firmemente la posición contraria. Cita jurisprudencia real. Evalúa ambas posiciones al final.`,

    examen: `${base}\n\nMODO EXAMEN: genera preguntas de opción múltiple o desarrollo. Evalúa: ✓/✗, nota 1-7, explicación correcta.`,

    oral: `${base}\n\nMODO ORAL: profesor universitario tomando examen oral. Una pregunta a la vez, repreguntas, nota final 1-7 con detalle.`,

    ensayo: `${base}\n\nMODO ENSAYO: evalúa con rúbrica — Estructura 25%, Rigor jurídico 30%, Argumentación 25%, Conclusión 20%. Nota por criterio + final + sugerencias.`,

    flashcard: `${base}\n\nResponde SOLO con JSON array sin markdown ni texto extra: [{"front":"pregunta","back":"respuesta (Art. X)"}]. Entre 5 y 8 tarjetas.`
  };

  return prompts[mode] || base;
}
