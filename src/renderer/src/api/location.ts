import { Location } from "src/shared/types"

export const getAllLocations = async (): Promise<Location[]> => {
  const locations = (await window.api.getLocations()) ?? []
  return locations
}

export const createLocation = async (location: Omit<Location, "id">): Promise<boolean> => {
  try {
    await window.api.addLocation(location)
    return true
  } catch (error) {
    console.error("Error al agregar localización:", error)
    return false
  }
}

export const editLocation = async (location: Location): Promise<boolean> => {
  if (!location.id) return false
  try {
    await window.api.updateLocation(location)
    return true
  } catch (error) {
    console.error("Error al agregar localización:", error)
    return false
  }
}

export const deleteLocation = async (id: string): Promise<boolean> => {
  try {
    await window.api.deleteLocation(id)
    return true
  } catch (error) {
    console.error("Error al eliminar localización:", error)
    return false
  }
}
