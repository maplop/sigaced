/* eslint-disable prettier/prettier */
import { db } from "../database"
import { StudentWithRequests, SpotWithQuantity } from "src/shared/types"

// Insertar un estudiante con sus solicitudes y fase
export function insertStudentWithRequests(student: StudentWithRequests) {
  const insert = db.transaction(() => {
    const insertStudent = db.prepare(`
      INSERT INTO student (ci, name, last_name, grade, age, gender, municipality, current_phase_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const { ci, name, lastName, grade, age, gender, municipality, currentPhaseId, requests } =
      student

    const studentResult = insertStudent.run(
      ci,
      name,
      lastName,
      grade,
      age,
      gender,
      municipality,
      currentPhaseId
    )
    const studentId = studentResult.lastInsertRowid as number

    // Registrar participación en la fase
    const insertStudentPhase = db.prepare(`
      INSERT OR IGNORE INTO student_phase (student_id, phase_id) VALUES (?, ?)
    `)
    insertStudentPhase.run(studentId, currentPhaseId)

    // Insertar solicitudes
    const insertRequest = db.prepare(`
      INSERT INTO request (student_id, spot_phase_id, preference_order)
      VALUES (?, (
        SELECT id FROM spot_phase WHERE spot_id = ? AND phase_id = ?
      ), ?)
    `)
    for (const req of requests) {
      insertRequest.run(studentId, req.spotId, req.phaseId, req.preferenceOrder)
    }
  })

  insert()
}

// Insertar una plaza junto a la cantidad disponible y su fase
export function insertSpotWithQuantity(spot: SpotWithQuantity) {
  const insert = db.transaction(() => {
    const insertSpot = db.prepare(`
      INSERT OR IGNORE INTO spot (career_id, location_id) VALUES (?, ?)
    `)
    const { careerId, locationId, phaseId, availableQuantity } = spot
    insertSpot.run(careerId, locationId)

    const getSpotId = db.prepare(`
      SELECT id FROM spot WHERE career_id = ? AND location_id = ?
    `)
    const row = getSpotId.get(careerId, locationId)
    const spotId = row.id

    const insertSpotPhase = db.prepare(`
      INSERT OR REPLACE INTO spot_phase (spot_id, phase_id, available_quantity)
      VALUES (?, ?, ?)
    `)
    insertSpotPhase.run(spotId, phaseId, availableQuantity)
  })

  insert()
}
