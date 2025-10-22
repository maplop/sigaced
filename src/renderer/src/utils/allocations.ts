import { Student, SpotFull } from "src/shared/types"
import { createAssignment } from "@renderer/api/assignment"
import { addStudentToPhase } from "@renderer/api/student"
import { createSpot } from "@renderer/api/spot"

// ---------------------------
// 1. Copiar spots para no mutar el cache
const copySpots = (spots: SpotFull[]) => spots.map((s) => ({ ...s }))

// ---------------------------
// 2. Intentar asignar un aspirante a sus solicitudes
const assignStudentToSpot = async (student: Student, spots: SpotFull[]): Promise<boolean> => {
  if (!student.requests?.length) return false

  for (const req of student.requests) {
    const spot = spots.find((s) => s.spotId === req.spotId)
    if (spot && spot.availableQuantity > 0) {
      try {
        await createAssignment({ studentId: student.id, spotId: spot.spotId })
        spot.availableQuantity -= 1
        return true // otorgamientoexitosa
      } catch (error) {
        console.error(`Error al asignar plaza a ${student.name}:`, error)
        return false
      }
    }
  }
  return false // no se pudo asignar
}

// ---------------------------
// 3. Mover aspirante a la siguiente fase  si no tiene plaza
const moveStudentToNextPhase = async (student: Student, phaseId: number) => {
  try {
    await addStudentToPhase(student.id, phaseId)
  } catch (error) {
    console.error(`Error al agregar ${student.name} a fase ${phaseId}:`, error)
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
  students: Student[],
  spots: SpotFull[],
  phaseId: number,
  onProgress?: (processed: number, total: number) => void
) => {
  if (!students || !spots) return

  const spotsCopy = copySpots(spots)
  const total = students.length

  for (let i = 0; i < students.length; i++) {
    const student = students[i]

    const assigned = await assignStudentToSpot(student, spotsCopy)

    if (!assigned) {
      await moveStudentToNextPhase(student, phaseId)
    }

    // Notificar progreso si se pasó el callback
    if (onProgress) {
      onProgress(i + 1, total)
    }
  }

  await copyRemainingSpotsToNextPhase(spotsCopy, phaseId)
}
