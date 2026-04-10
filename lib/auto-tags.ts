/**
 * Sistema de detección automática de materias jurídicas
 */

export type MateriaTag =
  | 'contratos'
  | 'obligaciones'
  | 'bienes'
  | 'sucesiones'
  | 'familia'
  | 'responsabilidad-civil'
  | 'delitos'
  | 'penas'
  | 'procesal'
  | 'constitucional'
  | 'laboral'
  | 'general';

interface TagPattern {
  tag: MateriaTag;
  keywords: string[];
  nombre: string;
  emoji: string;
}

const TAG_PATTERNS: TagPattern[] = [
  {
    tag: 'contratos',
    nombre: 'Contratos',
    emoji: '📝',
    keywords: [
      'contrato', 'convención', 'compraventa', 'arrendamiento', 'mandato',
      'comodato', 'mutuo', 'depósito', 'permuta', 'donación', 'sociedad',
      'transacción', 'acreedor', 'deudor', 'oferta', 'aceptación',
      'consensual', 'solemne', 'real', 'bilateral', 'unilateral',
      'oneroso', 'gratuito', 'conmutativo', 'aleatorio',
    ],
  },
  {
    tag: 'obligaciones',
    nombre: 'Obligaciones',
    emoji: '⚖️',
    keywords: [
      'obligación', 'obligaciones', 'prestación', 'dar', 'hacer', 'no hacer',
      'mora', 'cumplimiento', 'incumplimiento', 'indemnización', 'perjuicio',
      'dolo', 'culpa', 'caso fortuito', 'fuerza mayor', 'novación',
      'compensación', 'confusión', 'remisión', 'prescripción',
      'solidaridad', 'indivisibilidad', 'divisibilidad',
    ],
  },
  {
    tag: 'bienes',
    nombre: 'Bienes y Derechos Reales',
    emoji: '🏠',
    keywords: [
      'bien', 'bienes', 'mueble', 'inmueble', 'dominio', 'propiedad',
      'posesión', 'tenencia', 'usufructo', 'uso', 'habitación',
      'servidumbre', 'prenda', 'hipoteca', 'prescripción adquisitiva',
      'accesión', 'ocupación', 'tradición', 'sucesión por causa de muerte',
      'comunidad', 'copropiedad', 'censo', 'enfiteusis',
    ],
  },
  {
    tag: 'sucesiones',
    nombre: 'Sucesión por Causa de Muerte',
    emoji: '👨‍👩‍👧‍👦',
    keywords: [
      'sucesión', 'herencia', 'heredero', 'legatario', 'testamento',
      'testamentaria', 'intestada', 'abintestato', 'legítima',
      'mejora', 'cuarta de libre disposición', 'albacea', 'partidor',
      'acción de petición de herencia', 'desheredamiento', 'indignidad',
      'repudiación', 'beneficio de inventario', 'colación',
    ],
  },
  {
    tag: 'familia',
    nombre: 'Derecho de Familia',
    emoji: '👨‍👩‍👧',
    keywords: [
      'matrimonio', 'divorcio', 'separación', 'nulidad matrimonial',
      'filiación', 'adopción', 'patria potestad', 'cuidado personal',
      'alimentos', 'régimen patrimonial', 'sociedad conyugal',
      'separación de bienes', 'participación en los gananciales',
      'capitulaciones matrimoniales', 'reconocimiento', 'tutor', 'curador',
    ],
  },
  {
    tag: 'responsabilidad-civil',
    nombre: 'Responsabilidad Civil',
    emoji: '⚠️',
    keywords: [
      'responsabilidad civil', 'daño', 'perjuicio', 'reparación',
      'indemnización de perjuicios', 'cuasidelito', 'delito civil',
      'culpa aquiliana', 'hecho ilícito', 'daño moral', 'daño material',
      'lucro cesante', 'daño emergente', 'nexo causal', 'imputabilidad',
    ],
  },
  {
    tag: 'delitos',
    nombre: 'Derecho Penal - Delitos',
    emoji: '🚨',
    keywords: [
      'delito', 'crimen', 'falta', 'homicidio', 'lesiones', 'robo', 'hurto',
      'estafa', 'apropiación indebida', 'receptación', 'violación',
      'secuestro', 'extorsión', 'cohecho', 'prevaricación', 'falsificación',
      'incendio', 'daños', 'amenazas', 'injurias', 'calumnias', 'usurpación',
    ],
  },
  {
    tag: 'penas',
    nombre: 'Derecho Penal - Teoría del Delito',
    emoji: '⚖️',
    keywords: [
      'pena', 'sanción penal', 'presidio', 'reclusión', 'multa',
      'inhabilitación', 'suspensión', 'dolo', 'culpa penal',
      'legítima defensa', 'estado de necesidad', 'eximente',
      'atenuante', 'agravante', 'iter criminis', 'tentativa',
      'frustración', 'consumación', 'autoría', 'complicidad',
      'encubrimiento', 'participación criminal', 'concurso de delitos',
    ],
  },
  {
    tag: 'procesal',
    nombre: 'Derecho Procesal',
    emoji: '⚖️',
    keywords: [
      'juicio', 'proceso', 'procedimiento', 'demanda', 'contestación',
      'prueba', 'testigo', 'perito', 'sentencia', 'recurso', 'apelación',
      'casación', 'nulidad procesal', 'excepción', 'medida cautelar',
      'embargo', 'precautoria', 'querella', 'acusación', 'defensa',
      'tribunal', 'juez', 'fiscal', 'imputado', 'querellante',
    ],
  },
  {
    tag: 'constitucional',
    nombre: 'Derecho Constitucional',
    emoji: '📜',
    keywords: [
      'constitución', 'constitucional', 'derechos fundamentales',
      'garantías constitucionales', 'recurso de protección',
      'amparo', 'inaplicabilidad', 'inconstitucionalidad',
      'tribunal constitucional', 'estado de derecho', 'soberanía',
      'poder legislativo', 'ejecutivo', 'judicial', 'autonomía',
    ],
  },
  {
    tag: 'laboral',
    nombre: 'Derecho Laboral',
    emoji: '👷',
    keywords: [
      'trabajo', 'laboral', 'trabajador', 'empleador', 'contrato de trabajo',
      'jornada', 'remuneración', 'sueldo', 'salario', 'despido',
      'finiquito', 'indemnización laboral', 'fuero laboral',
      'sindicato', 'negociación colectiva', 'huelga', 'seguridad social',
    ],
  },
];

/**
 * Detecta las materias jurídicas presentes en un texto
 */
export function detectMaterias(texto: string): MateriaTag[] {
  const textoNormalizado = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Quitar tildes

  const materiasDetectadas = new Set<MateriaTag>();

  for (const pattern of TAG_PATTERNS) {
    const matches = pattern.keywords.filter(keyword =>
      textoNormalizado.includes(keyword.toLowerCase())
    );

    if (matches.length > 0) {
      materiasDetectadas.add(pattern.tag);
    }
  }

  return Array.from(materiasDetectadas);
}

/**
 * Obtiene información de una materia
 */
export function getMateriaInfo(tag: MateriaTag): TagPattern | undefined {
  return TAG_PATTERNS.find(p => p.tag === tag);
}

/**
 * Obtiene todas las materias disponibles
 */
export function getAllMaterias(): TagPattern[] {
  return TAG_PATTERNS;
}
