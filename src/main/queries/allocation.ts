import { db } from "../database"
import { Allocation, AllocationRow } from "../../shared/types"

// Create
export function addAllocation(allocation: Allocation) {
  const stmt = db.prepare(`
    INSERT INTO allocation (applicant_id, spot_id)
    VALUES (@applicantId, @spotId)
  `)
  stmt.run(allocation)
}

// Read all
export function getAllocations(): AllocationRow[] {
  return db
    .prepare(
      `
    SELECT
      a.id AS id,
      app.ci AS ci,
      app.last_name AS lastName,
      app.name AS name,
      c.abbreviation AS career,         
      l.name AS location,
      app.grade AS grade,
      r.preference_order AS preferenceOrder,
      sp.phase_id AS phase
    FROM allocation a
    JOIN applicant app ON a.applicant_id = app.id
    JOIN spot sp ON a.spot_id = sp.id
    JOIN career c ON sp.career_id = c.id
    JOIN location l ON sp.location_id = l.id
    LEFT JOIN request r 
      ON r.applicant_id = app.id AND r.spot_id = sp.id
    ORDER BY app.grade DESC
    `
    )
    .all()
}

// Obtener otorgamientos por fase
export function getAllocationsByPhase(phaseId: number): AllocationRow[] {
  return db
    .prepare(
      `
      SELECT
        a.id AS id,
        a.spot_id AS spotId,         
        a.applicant_id AS applicantId,   
        app.ci AS ci,
        app.last_name AS lastName,
        app.name AS name,
        c.abbreviation AS career,
        l.name AS location,
        app.grade AS grade,
        r.preference_order AS preferenceOrder,
        sp.phase_id AS phase
      FROM allocation a
      JOIN applicant app ON a.applicant_id = app.id
      JOIN spot sp ON a.spot_id = sp.id
      JOIN career c ON sp.career_id = c.id
      JOIN location l ON sp.location_id = l.id
      LEFT JOIN request r 
        ON r.applicant_id = app.id AND r.spot_id = sp.id
      WHERE sp.phase_id = ?
      ORDER BY app.grade DESC
      `
    )
    .all(phaseId)
}

// Update
export function updateAllocation(allocation: Allocation) {
  const stmt = db.prepare(`
    UPDATE allocation
    SET applicant_id = @applicantId,
        spot_id = @spotId
    WHERE id = @id
  `)
  stmt.run(allocation)
}

// Delete
export function deleteAllocationForId(id: number) {
  db.prepare("DELETE FROM allocation WHERE id = ?").run(id)
}

// Delete all allocations (regardless of phase)
export function deleteAllAllocations() {
  const stmt = db.prepare(`
    DELETE FROM allocation
  `)
  stmt.run()
}

// Delete all allocations from a specific phase
export function deleteAllAllocationsFromPhase(phaseId: number) {
  const stmt = db.prepare(`
    DELETE FROM allocation
    WHERE spot_id IN (
      SELECT id FROM spot WHERE phase_id = ?
    )
  `)
  stmt.run(phaseId)
}
