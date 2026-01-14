import type { OperationResult, Applicant } from "src/shared/types"

// Obtener todos los aspirantes de una fase
export const getAllApplicants = async (phaseId: number): Promise<Applicant[]> => {
  const applicants = await window.api.getApplicants(phaseId)
  if (!applicants) throw new Error("No se pudieron obtener los aspirantes")
  return applicants
}

// Crear aspirante (fase + solicitudes opcionales)
export const createApplicant = async (applicantData: Omit<Applicant, "id">): Promise<number> => {
  const response: { success: boolean; id?: number; error?: string } =
    await window.api.addApplicant(applicantData)
  if (!response.success || !response.id)
    throw new Error(response.error || "Error al agregar el aspirante")
  return response.id
}

// Actualizar aspirante y/o solicitudes
export const updateApplicant = async (applicantData: Applicant): Promise<void> => {
  const response: OperationResult = await window.api.updateApplicant(applicantData)
  if (!response.success) throw new Error(response.error || "Error al actualizar el aspirante")
}

// Eliminar aspirante completamente
export const deleteApplicant = async (applicantId: number): Promise<void> => {
  const response: OperationResult = await window.api.deleteApplicant(applicantId)
  if (!response.success)
    throw new Error(response.error || "Error al eliminar completamente el aspirante")
}

// Agregar aspirante a una fase específica
export const addApplicantToPhase = async (applicantId: number, phaseId: number): Promise<void> => {
  const response: { success: boolean; error?: string } = await window.api.addApplicantToPhase(
    applicantId,
    phaseId
  )
  if (!response.success)
    throw new Error(response.error || "Error al agregar el aspirante a la fase")
}

// Eliminar todos los aspirantes de una fase específica
export const deleteAllApplicantsFromPhase = async (phaseId: number): Promise<void> => {
  const response: { success: boolean; error?: string } =
    await window.api.deleteAllApplicantsFromPhase(phaseId)

  if (!response.success)
    throw new Error(response.error || "Error al eliminar todos los aspirantes de la fase")
}
