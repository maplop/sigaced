import type { DashboardStats, TopStudent, TopCareer } from "src/shared/types"

export const getDashboardStats = async (phaseId?: number): Promise<DashboardStats> => {
  const stats = await window.api.getDashboardStats(phaseId)

  if (!stats) throw new Error("No se pudieron obtener las estadísticas.")
  return stats
}

export const getTopStudents = async (phaseId?: number): Promise<TopStudent[]> => {
  const topStudents = await window.api.getTopStudents(phaseId)

  if (!topStudents) throw new Error("No se pudieron obtener los estudiantes.")
  return topStudents
}

export const getTopCareers = async (phaseId?: number): Promise<TopCareer[]> => {
  const topCareers = await window.api.getTopCareers(phaseId)

  if (!topCareers) throw new Error("No se pudieron obtener las carreras.")
  return topCareers
}
