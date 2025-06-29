import { db } from '../database'
import { Spot } from '../../shared/types'

// Create
export function addSpot(spot: Spot) {
  const stmt = db.prepare(`
    INSERT INTO spot (career_id, location_id, available_quantity)
    VALUES (@careerId, @locationId, @availableQuantity)
  `)
  stmt.run(spot)
}

// Read all
export function getSpots(): Spot[] {
  return db
    .prepare(
      `
    SELECT
      id,
      career_id AS careerId,
      location_id AS locationId,
      available_quantity AS availableQuantity
    FROM spot
  `
    )
    .all()
}

// Update
export function updateSpot(spot: Spot) {
  const stmt = db.prepare(`
    UPDATE spot
    SET
      career_id = @careerId,
      location_id = @locationId,
      available_quantity = @availableQuantity
    WHERE id = @id
  `)
  stmt.run(spot)
}

// Delete
export function deleteSpot(id: number) {
  db.prepare('DELETE FROM spot WHERE id = ?').run(id)
}
