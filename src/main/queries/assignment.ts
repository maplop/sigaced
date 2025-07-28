import { db } from "../database"
import { Assignment } from "../../shared/types"

// Create
export function addAssignment(assignment: Assignment) {
  const stmt = db.prepare(`
    INSERT INTO assignment (student_ci, spot_phase_id)
    VALUES (@studentCi, @spotPhaseId)
  `)
  stmt.run(assignment)
}

// Read all
export function getAssignments(): Assignment[] {
  return db
    .prepare(
      `
      SELECT
        a.id,
        a.student_ci AS studentCi,
        a.spot_phase_id AS spotPhaseId,
        a.assigned_at AS assignmentDate
      FROM assignment a
    `
    )
    .all()
}

// Update
export function updateAssignment(assignment: Assignment) {
  const stmt = db.prepare(`
    UPDATE assignment
    SET student_ci = @studentCi,
        spot_phase_id = @spotPhaseId
    WHERE id = @id
  `)
  stmt.run(assignment)
}

// Delete
export function deleteAssignment(id: number) {
  db.prepare("DELETE FROM assignment WHERE id = ?").run(id)
}
