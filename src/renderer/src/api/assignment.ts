import type { OperationResult, Assignment, AssignmentRow } from "src/shared/types"

// Obtener todas las asignaciones
export const getAllAssignments = async (): Promise<AssignmentRow[]> => {
  const assignments = await window.api.getAssignments()
  if (!assignments) throw new Error("No se pudieron obtener las asignaciones")
  return assignments
}

// Obtener asignaciones por fase
export const getAssignmentsByPhase = async (phaseId: number): Promise<Assignment[]> => {
  const assignments = await window.api.getAssignmentsByPhase(phaseId)
  if (!assignments) throw new Error("No se pudieron obtener las asignaciones de la fase")
  return assignments
}

// Crear una asignación
export const createAssignment = async (assignmentData: Omit<Assignment, "id">): Promise<void> => {
  const response: OperationResult = await window.api.addAssignment(assignmentData)
  if (!response.success) throw new Error(response.error || "Error al agregar la asignación")
}

// Actualizar una asignación
export const updateAssignment = async (assignmentData: Assignment): Promise<void> => {
  const response: OperationResult = await window.api.updateAssignment(assignmentData)
  if (!response.success) throw new Error(response.error || "Error al actualizar la asignación")
}

// Eliminar una asignación
export const deleteAssignment = async (assignmentId: number): Promise<void> => {
  const response: OperationResult = await window.api.deleteAssignment(assignmentId)
  if (!response.success) throw new Error(response.error || "Error al eliminar la asignación")
}
