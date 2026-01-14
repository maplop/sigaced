import type { DashboardStats, TopApplicant, TopCareer, OperationResult } from "src/shared/types"

export const getDashboardStats = async (phaseId?: number): Promise<DashboardStats> => {
  const stats = await window.api.getDashboardStats(phaseId)

  if (!stats) throw new Error("No se pudieron obtener las estadísticas.")
  return stats
}

export const getTopApplicants = async (phaseId?: number): Promise<TopApplicant[]> => {
  const topApplicants = await window.api.getTopApplicants(phaseId)

  if (!topApplicants) throw new Error("No se pudieron obtener los aspirantes.")
  return topApplicants
}

export const getTopCareers = async (phaseId?: number): Promise<TopCareer[]> => {
  const topCareers = await window.api.getTopCareers(phaseId)

  if (!topCareers) throw new Error("No se pudieron obtener las carreras.")
  return topCareers
}

export const clearAllTables = async (): Promise<void> => {
  const response: OperationResult = await window.api.clearAllTables()
  if (!response.success) throw new Error(response.error || "Error al reinicar el proceso.")
}
