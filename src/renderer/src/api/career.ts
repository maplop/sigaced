import { Career } from "src/shared/types"

export const getAllCareers = async (): Promise<Career[]> => {
  const careers = await window.api.getCareers()
  if (!careers) {
    throw new Error("No se pudieron obtener las carreras.")
  }
  return careers
}

export const createCareer = async (career: Omit<Career, "id">): Promise<void> => {
  const response = await window.api.addCareer(career)

  if (!response.success) {
    throw new Error(response.error || "Error al agregar la carrera.")
  }
}

export const editCareer = async (career: Career): Promise<void> => {
  if (!career.id) {
    throw new Error("La carrera debe tener un ID válido para editarse.")
  }

  const response = await window.api.updateCareer(career)

  if (!response.success) {
    throw new Error(response.error || "Error al editar la carrera.")
  }
}

export const deleteCareer = async (id: string): Promise<void> => {
  const response = await window.api.deleteCareer(id)
  if (!response.success) {
    throw new Error(response.error || "Error al eliminar la carrera.")
  }
}

export const deleteAllCareers = async (): Promise<void> => {
  const response = await window.api.deleteAllCareers()
  if (!response.success) {
    throw new Error(response.error || "Error al eliminar todas las carreras.")
  }
}
