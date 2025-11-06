import type { DashboardStats, TopStudent, TopCareer } from "src/shared/types"

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const stats = await window.api.getDashboardStats()

  if (!stats) throw new Error("No se pudieron obtener las estadísticas.")
  return stats
}

export const getTopStudents = async (): Promise<TopStudent[]> => {
  const topStudents = await window.api.getTopStudents()

  if (!topStudents) throw new Error("No se pudieron obtener los estudiantes.")
  return topStudents
}

export const getTopCareers = async (): Promise<TopCareer[]> => {
  const topCareers = await window.api.getTopCareers()

  if (!topCareers) throw new Error("No se pudieron obtener las carreras.")
  return topCareers
}
