import type { Applicant, ApplicantRequestRow, CareerClosingRow } from "src/shared/types"

export const getApplicantsAndRequest = async (): Promise<ApplicantRequestRow[]> => {
  const data = await window.api.getApplicantsAndRequest()
  if (!data) throw new Error("No se pudieron obtener los aspirantes con sus solicitudes.")
  return data
}

export const getAssignedApplicantsBySpot = async (): Promise<ApplicantRequestRow[]> => {
  const data = await window.api.getAssignedApplicantsBySpot()
  if (!data) throw new Error("No se pudieron obtener los aspirantes asignados.")
  return data
}

export const getAssignedApplicantsByLocation = async (): Promise<Applicant[]> => {
  const data = await window.api.getAssignedApplicantsByLocation()
  if (!data) throw new Error("No se pudieron obtener los aspirantes por ubicación.")
  return data
}

export const getAssignedApplicantsByCareer = async (): Promise<Applicant[]> => {
  const data = await window.api.getAssignedApplicantsByCareer()
  if (!data) throw new Error("No se pudieron obtener los aspirantes por carrera.")
  return data
}

export const getApplicantsByMunicipality = async (): Promise<Applicant[]> => {
  const data = await window.api.getApplicantsByMunicipality()
  if (!data) throw new Error("No se pudieron obtener los aspirantes por municipio.")
  return data
}

export const getCareerClosing = async (): Promise<CareerClosingRow[]> => {
  const data = await window.api.getCareerClosing()
  if (!data) throw new Error("No se pudieron obtener las notas de cierre de carreras.")
  return data
}
