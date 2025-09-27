import type { OperationResult, Student } from "src/shared/types"

// Obtener todos los estudiantes de una fase
export const getAllStudents = async (phaseId: number): Promise<Student[]> => {
  const students = await window.api.getStudents(phaseId)
  if (!students) throw new Error("No se pudieron obtener los estudiantes")
  return students
}

// Crear aspirante (fase + solicitudes opcionales)
export const createStudent = async (studentData: Omit<Student, "id">): Promise<number> => {
  const response: { success: boolean; id?: number; error?: string } =
    await window.api.addStudent(studentData)
  if (!response.success || !response.id)
    throw new Error(response.error || "Error al agregar el aspirante")
  return response.id
}

// Actualizar aspirante y/o solicitudes
export const updateStudent = async (studentData: Student): Promise<void> => {
  const response: OperationResult = await window.api.updateStudent(studentData)
  if (!response.success) throw new Error(response.error || "Error al actualizar el aspirante")
}

// Eliminar aspirante de una fase específica
export const deleteStudentFromPhase = async (studentId: number, phaseId: number): Promise<void> => {
  const response: OperationResult = await window.api.deleteStudentFromPhase(studentId, phaseId)
  if (!response.success)
    throw new Error(response.error || "Error al eliminar el aspirante de la fase")
}

// Eliminar aspirante completamente
export const deleteStudentCompletely = async (studentId: number): Promise<void> => {
  const response: OperationResult = await window.api.deleteStudentCompletely(studentId)
  if (!response.success)
    throw new Error(response.error || "Error al eliminar completamente el aspirante")
}

// Agregar estudiante a una fase específica
export const addStudentToPhase = async (studentId: number, phaseId: number): Promise<void> => {
  const response: { success: boolean; error?: string } = await window.api.addStudentToPhase(
    studentId,
    phaseId
  )
  if (!response.success)
    throw new Error(response.error || "Error al agregar el estudiante a la fase")
}
