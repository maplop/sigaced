import { Location } from "src/shared/types"

export const getAllLocations = async (): Promise<Location[]> => {
  const locations = (await window.api.getLocations()) ?? []
  return locations
}
