import type { Student, StudentRequestRow, CareerClosingRow } from "src/shared/types"

export const getStudentsAndRequest = async (): Promise<StudentRequestRow[]> => {
  const data = await window.api.getStudentsAndRequest()
  if (!data) throw new Error("No se pudieron obtener los estudiantes con sus solicitudes.")
  return data
}

export const getAssignedStudentsBySpot = async (): Promise<StudentRequestRow[]> => {
  const data = await window.api.getAssignedStudentsBySpot()
  if (!data) throw new Error("No se pudieron obtener los estudiantes asignados.")
  return data
}

export const getAssignedStudentsByLocation = async (): Promise<Student[]> => {
  const data = await window.api.getAssignedStudentsByLocation()
  if (!data) throw new Error("No se pudieron obtener los estudiantes por ubicación.")
  return data
}

export const getAssignedStudentsByCareer = async (): Promise<Student[]> => {
  const data = await window.api.getAssignedStudentsByCareer()
  if (!data) throw new Error("No se pudieron obtener los estudiantes por carrera.")
  return data
}

export const getStudentsByMunicipality = async (): Promise<Student[]> => {
  const data = await window.api.getStudentsByMunicipality()
  if (!data) throw new Error("No se pudieron obtener los estudiantes por municipio.")
  return data
}

export const getCareerClosing = async (): Promise<CareerClosingRow[]> => {
  const data = await window.api.getCareerClosing()
  if (!data) throw new Error("No se pudieron obtener las notas de cierre de carreras.")
  return data
}
