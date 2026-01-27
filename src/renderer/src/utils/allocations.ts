import { Applicant, SpotFull } from "src/shared/types"
import { createAllocation } from "@renderer/api/allocation"
import { addApplicantToPhase } from "@renderer/api/applicant"
import { createSpot } from "@renderer/api/spot"

// ---------------------------
// 1. Copiar spots para no mutar el cache
export const copySpots = (spots: SpotFull[]) => spots.map((s) => ({ ...s }))

// ---------------------------
// 2. Intentar otorgar un aspirante a sus solicitudes
const allocateApplicantToSpot = async (applicant: Applicant, spots: SpotFull[]): Promise<boolean> => {
  if (!applicant.requests?.length) return false

  for (const req of applicant.requests) {
    const spot = spots.find((s) => s.spotId === req.spotId)
    if (spot && spot.availableQuantity > 0) {
      try {
        await createAllocation({ applicantId: applicant.id, spotId: spot.spotId })
        spot.availableQuantity -= 1
        return true // otorgamiento exitoso
      } catch (error) {
        console.error(`Error al otorgar plaza a ${applicant.name}:`, error)
        return false
      }
    }
  }
  return false // no se pudo otorgar
}

// ---------------------------
// 3. Mover aspirante a la siguiente fase  si no tiene plaza
const moveApplicantToNextPhase = async (applicant: Applicant, phaseId: number) => {
  try {
    await addApplicantToPhase(applicant.id, phaseId)
  } catch (error) {
    console.error(`Error al agregar ${applicant.name} a fase ${phaseId}:`, error)
  }
}

// ---------------------------
// 4. Copiar plazas sobrantes a la siguiente fase
const copyRemainingSpotsToNextPhase = async (spots: SpotFull[], phaseId: number) => {
  for (const spot of spots) {
    if (spot.availableQuantity > 0) {
      try {
        await createSpot({
          careerId: spot.careerId,
          locationId: spot.locationId,
          phaseId: phaseId,
          availableQuantity: spot.availableQuantity
        })
      } catch (error: any) {
        console.warn(error.message)
      }
    }
  }
}

// ---------------------------
// 5. Función principal que coordina todo
export const handleAllocate = async (
  applicants: Applicant[],
  spots: SpotFull[],
  phaseId: number,
  onProgress?: (processed: number, total: number) => void
) => {
  if (!applicants || !spots) return

  const spotsCopy = copySpots(spots)
  const total = applicants.length

  for (let i = 0; i < applicants.length; i++) {
    const applicant = applicants[i]

    const allocated = await allocateApplicantToSpot(applicant, spotsCopy)

    if (!allocated) {
      await moveApplicantToNextPhase(applicant, phaseId)
    }

    // Notificar progreso si se pasó el callback
    if (onProgress) {
      onProgress(i + 1, total)
    }
  }

  await copyRemainingSpotsToNextPhase(spotsCopy, phaseId)
}
