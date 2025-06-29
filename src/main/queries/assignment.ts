import { db } from '../database'
import { Assignment } from '../../shared/types'

// Create
export function addAssignment(assignment: Assignment) {
  const stmt = db.prepare(`
    INSERT INTO assignment (student_ci, spot_id, phase_id)
    VALUES (@studentCi, @spotId, @phaseId)
  `)
  stmt.run(assignment)
}

// Read all
export function getAssignments(): Assignment[] {
  return db
    .prepare(
      `
    SELECT
      id,
      student_ci AS studentCi,
      spot_id AS spotId,
      phase_id AS phaseId,
      assigned_at AS assignmentDate
    FROM assignment
  `
    )
    .all()
}

// Update
export function updateAssignment(assignment: Assignment) {
  const stmt = db.prepare(`
    UPDATE assignment
    SET student_ci = @studentCi,
        spot_id = @spotId,
        phase_id = @phaseId
    WHERE id = @id
  `)
  stmt.run(assignment)
}

// Delete
export function deleteAssignment(id: number) {
  db.prepare('DELETE FROM assignment WHERE id = ?').run(id)
}
