export const PLAN_LIMITS = {
  anonymous: {
    consultas_mes: 5,
    label: 'Sin cuenta'
  },
  free: {
    consultas_mes: 20,
    label: 'Gratuito'
  },
  student: {
    consultas_mes: -1, // -1 = ilimitado
    label: 'Estudiante'
  },
  university: {
    consultas_mes: -1,
    label: 'Universidad'
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function canMakeQuery(plan: PlanType, consultasMes: number): boolean {
  const limit = PLAN_LIMITS[plan].consultas_mes;
  if (limit === -1) return true; // ilimitado
  return consultasMes < limit;
}

export function getRemainingQueries(plan: PlanType, consultasMes: number): number {
  const limit = PLAN_LIMITS[plan].consultas_mes;
  if (limit === -1) return -1; // ilimitado
  return Math.max(0, limit - consultasMes);
}
