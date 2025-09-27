import { db } from "../database"
import { Assignment, AssignmentRow } from "../../shared/types"

// Create
export function addAssignment(assignment: Assignment) {
  const stmt = db.prepare(`
    INSERT INTO assignment (student_id, spot_id)
    VALUES (@studentId, @spotId)
  `)
  stmt.run(assignment)
}

// Read all
export function getAssignments(): AssignmentRow[] {
  return db
    .prepare(
      `
    SELECT
      a.id AS id,
      s.ci AS ci,
      s.last_name AS lastName,
      s.name AS name,
      c.abbreviation AS career,         -- 👈 aquí usamos la abreviatura
      l.name AS location,
      s.grade AS grade,
      r.preference_order AS preferenceOrder,
      sp.phase_id AS phase
    FROM assignment a
    JOIN student s ON a.student_id = s.id
    JOIN spot sp ON a.spot_id = sp.id
    JOIN career c ON sp.career_id = c.id
    JOIN location l ON sp.location_id = l.id
    LEFT JOIN request r 
      ON r.student_id = s.id AND r.spot_id = sp.id
    ORDER BY a.id
    `
    )
    .all()
}

// Obtener asignaciones por fase
export function getAssignmentsByPhase(phaseId: number): Assignment[] {
  return db
    .prepare(
      `
      SELECT
        a.id,
        a.student_id AS studentId,
        a.spot_id AS spotId,
        a.assigned_at AS assignedAt
      FROM assignment a
      JOIN spot s ON s.id = a.spot_id
      WHERE s.phase_id = ?
      `
    )
    .all(phaseId)
}

// Update
export function updateAssignment(assignment: Assignment) {
  const stmt = db.prepare(`
    UPDATE assignment
    SET student_id = @studentId,
        spot_id = @spotId
    WHERE id = @id
  `)
  stmt.run(assignment)
}

// Delete
export function deleteAssignment(id: number) {
  db.prepare("DELETE FROM assignment WHERE id = ?").run(id)
}
