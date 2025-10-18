import { db } from "../database"
import { SpotFull, Spot } from "src/shared/types"

export function getAllSpots(phaseId: number): SpotFull[] {
  return db
    .prepare(
      `
    SELECT 
      spot.id AS spotId,
      spot.career_id AS careerId,
      career.full_name AS careerName,
      spot.location_id AS locationId,
      location.name AS locationName,
      spot.phase_id AS phaseId,
      phase.name AS phaseName,
      spot.available_quantity AS availableQuantity
    FROM spot
    JOIN career ON career.id = spot.career_id
    JOIN location ON location.id = spot.location_id
    JOIN phase ON phase.id = spot.phase_id
    WHERE spot.phase_id = ?
  `
    )
    .all(phaseId)
}

export function createSpot(spot: Omit<Spot, "id">) {
  const { careerId, locationId, phaseId, availableQuantity } = spot

  const existing = db
    .prepare(
      `
      SELECT id FROM spot 
      WHERE career_id = ? AND location_id = ? AND phase_id = ?
    `
    )
    .get(careerId, locationId, phaseId)

  if (existing) {
    throw new Error("Ya existe una plaza con esa combinación de carrera, ubicación y fase.")
  }

  const stmt = db.prepare(`
    INSERT INTO spot (career_id, location_id, phase_id, available_quantity)
    VALUES (?, ?, ?, ?)
  `)

  stmt.run(careerId, locationId, phaseId, availableQuantity)
}

export function updateSpot(spot: Spot): void {
  const { id, careerId, locationId, phaseId, availableQuantity } = spot

  const existing = db
    .prepare(
      `
    SELECT id FROM spot 
    WHERE career_id = ? AND location_id = ? AND phase_id = ? AND id != ?
  `
    )
    .get(careerId, locationId, phaseId, id)

  if (existing) {
    throw new Error("Ya existe una plaza con esa combinación de carrera, ubicación y fase.")
  }

  const stmt = db.prepare(`
    UPDATE spot SET 
      career_id = ?, 
      location_id = ?, 
      phase_id = ?, 
      available_quantity = ?
    WHERE id = ?
  `)

  stmt.run(careerId, locationId, phaseId, availableQuantity, id)
}

export function deleteSpot(id: number) {
  const stmt = db.prepare(`
    DELETE FROM spot WHERE id = ?
  `)
  stmt.run(id)
}

export function deleteAllSpotsFromPhase(phaseId: number): void {
  const stmt = db.prepare(`
    DELETE FROM spot
    WHERE phase_id = ?
  `)

  stmt.run(phaseId)
}
