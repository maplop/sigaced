import type { OperationResult, Allocation, AllocationRow } from "src/shared/types"

// Obtener todos los otorgamientos
export const getAllAllocations = async (): Promise<AllocationRow[]> => {
  const allocations = await window.api.getAllAllocations()
  if (!allocations) throw new Error("No se pudieron obtener los otorgamientos.")
  return allocations
}

// Obtener otorgamientos por fase
export const getAllocationsByPhase = async (phaseId: number): Promise<AllocationRow[]> => {
  const allocations = await window.api.getAllocationsByPhase(phaseId)
  if (!allocations) throw new Error("No se pudieron obtener los otorgamientos de la fase.")
  return allocations
}

// Crear un otorgamiento
export const createAllocation = async (allocationData: Omit<Allocation, "id">): Promise<void> => {
  const response: OperationResult = await window.api.addAllocation(allocationData)
  if (!response.success) throw new Error(response.error || "Error al agregar el otorgamiento.")
}

// Actualizar un otorgamiento
export const updateAllocation = async (allocationData: Allocation): Promise<void> => {
  const response: OperationResult = await window.api.updateAllocation(allocationData)
  if (!response.success) throw new Error(response.error || "Error al actualizar el otorgamiento.")
}

// Eliminar un otorgamiento
export const deleteAllocation = async (allocationId: number): Promise<void> => {
  const response: OperationResult = await window.api.deleteAllocationForId(allocationId)
  if (!response.success) throw new Error(response.error || "Error al eliminar el otorgamiento.")
}

// Eliminar todos los otorgamientos de una fase específica
export const deleteAllAllocationsFromPhase = async (phaseId: number): Promise<void> => {
  const response: OperationResult = await window.api.deleteAllAllocationsFromPhase(phaseId)
  if (!response.success)
    throw new Error(response.error || "Error al eliminar todos los otorgamientos de la fase.")
}

// Eliminar todos los otorgamientos
export const deleteAllAllocations = async (): Promise<void> => {
  const response: OperationResult = await window.api.deleteAllAllocations()
  if (!response.success)
    throw new Error(response.error || "Error al eliminar todos los otorgamientos.")
}
