import { db } from '../database'
import { Request } from '../../shared/types'

// Create
export function addRequest(request: Request) {
  const stmt = db.prepare(`
    INSERT INTO request (student_ci, spot_id, preference_order, phase_id)
    VALUES (@studentCi, @spotId, @order, @phaseId)
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
      preference_order AS order,
      phase_id AS phaseId
    FROM request
  `
    )
    .all()
}

// Update
export function updateRequest(request: Request) {
  const stmt = db.prepare(`
    UPDATE request
    SET
      student_ci = @studentCi,
      spot_id = @spotId,
      preference_order = @order,
      phase_id = @phaseId
    WHERE id = @id
  `)
  stmt.run(request)
}

// Delete
export function deleteRequest(id: number) {
  db.prepare('DELETE FROM request WHERE id = ?').run(id)
}
