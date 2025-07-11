import { db } from "../database"
import { Request } from "../../shared/types"

// Create
export function addRequest(request: Omit<Request, "id">): void {
  const stmt = db.prepare(`
    INSERT INTO request (student_ci, spot_id, preference_order, phase_id)
    VALUES (@studentCi, @spotId, @preferenceOrder, @phaseId)
  `)
  stmt.run(request)
}

// Read all
export function getRequests(): Request[] {
  return db
    .prepare(
      `
    SELECT
      id,
      student_ci AS studentCi,
      spot_id AS spotId,
      preference_order AS preferenceOrder,
      phase_id AS phaseId
    FROM request
  `
    )
    .all()
}

// Update
export function updateRequest(request: Request): void {
  const stmt = db.prepare(`
    UPDATE request
    SET
      student_ci = @studentCi,
      spot_id = @spotId,
      preference_order = @preferenceOrder,
      phase_id = @phaseId
    WHERE id = @id
  `)
  stmt.run(request)
}

// Delete
export function deleteRequest(id: number): void {
  db.prepare("DELETE FROM request WHERE id = ?").run(id)
}
