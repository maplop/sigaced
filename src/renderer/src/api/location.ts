import { Location } from "src/shared/types"

export const getAllLocations = async (): Promise<Location[]> => {
  const locations = await window.api.getLocations()
  if (!locations) {
    throw new Error("No se pudieron obtener las ubicaciones.")
  }
  return locations
}

export const createLocation = async (location: Omit<Location, "id">): Promise<void> => {
  const response = await window.api.addLocation(location)

  if (!response.success) {
    throw new Error(response.error || "Error al agregar la ubicación")
  }
}

export const editLocation = async (location: Location): Promise<void> => {
  if (!location.id) {
    throw new Error("La ubicación debe tener un ID válido para editarse.")
  }

  const response = await window.api.updateLocation(location)

  if (!response.success) {
    throw new Error(response.error || "Error al actualizar la ubicación.")
  }
}

export const deleteLocation = async (id: string): Promise<void> => {
  const response = await window.api.deleteLocation(id)
  if (!response.success) {
    throw new Error(response.error || "Error al eliminar la ubicación")
  }
}

export const deleteAllLocations = async (): Promise<void> => {
  const response = await window.api.deleteAllLocations()
  if (!response.success) {
    throw new Error(response.error || "Error al eliminar todas las ubicaciones.")
  }
}
