import { Spot } from "src/shared/types"

export const getAllSpots = async (): Promise<Spot[]> => {
  const spots = (await window.api.getSpots()) ?? []
  return spots
}

export const createSpot = async (spot: Omit<Spot, "id">): Promise<boolean> => {
  try {
    await window.api.addSpot(spot)
    return true
  } catch (error) {
    console.error("Error al agregar plaza:", error)
    return false
  }
}

export const editSpot = async (spot: Spot): Promise<boolean> => {
  if (!spot.id) return false
  try {
    await window.api.updateSpot(spot)
    return true
  } catch (error) {
    console.error("Error al agregar plaza:", error)
    return false
  }
}

export const deleteSpot = async (id: string): Promise<boolean> => {
  try {
    await window.api.deleteSpot(id)
    return true
  } catch (error) {
    console.error("Error al eliminar plaza:", error)
    return false
  }
}
