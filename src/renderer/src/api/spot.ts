import type { OperationResult, Spot, SpotFull } from "src/shared/types"

export const getAllSpots = async (phaseId: number): Promise<SpotFull[]> => {
  const spots = await window.api.getAllSpots(phaseId)
  if (!spots) throw new Error("No se pudieron obtener las plazas")
  return spots
}

export const createSpot = async (spotData: Omit<Spot, "id">): Promise<void> => {
  const response: OperationResult = await window.api.createSpot(spotData)
  if (!response.success) throw new Error(response.error || "Error al agregar la plaza")
}

export const updateSpot = async (spotData: Spot): Promise<void> => {
  const response: OperationResult = await window.api.updateSpot(spotData)
  if (!response.success) throw new Error(response.error || "Error al actualizar la plaza")
}

export const deleteSpot = async (spotId: number): Promise<void> => {
  const response: OperationResult = await window.api.deleteSpot(spotId)
  if (!response.success)
    throw new Error(response.error || "Error al eliminar la plaza completamente")
}

// Eliminar todas las plazas de una fase específica
export const deleteAllSpotsFromPhase = async (phaseId: number): Promise<void> => {
  const response: OperationResult = await window.api.deleteAllSpotsFromPhase(phaseId)
  if (!response.success)
    throw new Error(response.error || "Error al eliminar todas las plazas de la fase")
}
