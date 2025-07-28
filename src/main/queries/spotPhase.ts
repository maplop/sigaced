import { SpotPhase } from "src/shared/types"
import { db } from "../database"

// CREATE
export function addSpotPhase(spotPhase: SpotPhase) {
  const stmt = db.prepare(`
    INSERT INTO spot_phase (spot_id, phase_id, available_quantity)
    VALUES (@spotId, @phaseId, @availableQuantity)
  `)
  stmt.run(spotPhase)
}

// READ ALL
export function getAllSpotPhases(): SpotPhase[] {
  return db
    .prepare(
      `
    SELECT
      spot_id AS spotId,
      phase_id AS phaseId,
      available_quantity AS availableQuantity
    FROM spot_phase
  `
    )
    .all()
}

// READ ONE
export function getSpotPhase(spotId: number, phaseId: number): SpotPhase | undefined {
  return db
    .prepare(
      `
    SELECT
      spot_id AS spotId,
      phase_id AS phaseId,
      available_quantity AS availableQuantity
    FROM spot_phase
    WHERE spot_id = ? AND phase_id = ?
  `
    )
    .get(spotId, phaseId)
}

// UPDATE
export function updateSpotPhase(spotPhase: SpotPhase) {
  const stmt = db.prepare(`
    UPDATE spot_phase
    SET available_quantity = @availableQuantity
    WHERE spot_id = @spotId AND phase_id = @phaseId
  `)
  stmt.run(spotPhase)
}

// DELETE
export function deleteSpotPhase(spotId: number, phaseId: number) {
  db.prepare(
    `
    DELETE FROM spot_phase
    WHERE spot_id = ? AND phase_id = ?
  `
  ).run(spotId, phaseId)
}
