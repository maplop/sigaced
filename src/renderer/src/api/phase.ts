import { Phase } from "src/shared/types"

export const getAllPhases = async (): Promise<Phase[]> => {
  const phases = await window.api.getPhases()
  if (!phases) {
    throw new Error("No se pudieron obtener las fases.")
  }
  return phases
}
