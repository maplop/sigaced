import { Career } from "src/shared/types"

export const getAllCareers = async (): Promise<Career[]> => {
  const careers = (await window.api.getCareers()) ?? []
  return careers
}

export const createCareer = async (career: Omit<Career, "id">): Promise<boolean> => {
  try {
    await window.api.addCareer(career)
    return true
  } catch (error) {
    console.error("Error al agregar carrera:", error)
    return false
  }
}

export const editCareer = async (career: Career): Promise<boolean> => {
  if (!career.id) return false
  try {
    await window.api.updateCareer(career)
    return true
  } catch (error) {
    console.error("Error al agregar carrera:", error)
    return false
  }
}

export const deleteCareer = async (id: string): Promise<boolean> => {
  try {
    await window.api.deleteCareer(id)
    return true
  } catch (error) {
    console.error("Error al eliminar carrera:", error)
    return false
  }
}
