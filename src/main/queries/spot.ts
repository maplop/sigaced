import { db } from "../database"
import { Spot } from "../../shared/types"

// Create
export function addSpot(spot: Omit<Spot, "availableQuantity">) {
  const stmt = db.prepare(`
    INSERT INTO spot (career_id, location_id)
    VALUES (@careerId, @locationId)
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
      location_id AS locationId
    FROM spot
  `
    )
    .all()
}

// Update
export function updateSpot(spot: Omit<Spot, "availableQuantity"> & { id: number }) {
  const stmt = db.prepare(`
    UPDATE spot
    SET
      career_id = @careerId,
      location_id = @locationId
    WHERE id = @id
  `)
  stmt.run(spot)
}

// Delete
export function deleteSpot(id: number) {
  db.prepare("DELETE FROM spot WHERE id = ?").run(id)
}
