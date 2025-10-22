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
      c.abbreviation AS career,         
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

// Obtener otorgamientospor fase
export function getAssignmentsByPhase(phaseId: number): AssignmentRow[] {
  return db
    .prepare(
      `
      SELECT
        a.id AS id,
        s.ci AS ci,
        s.last_name AS lastName,
        s.name AS name,
        c.abbreviation AS career,
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
      WHERE sp.phase_id = ?
      ORDER BY a.id
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
export function deleteAssignmentForId(id: number) {
  db.prepare("DELETE FROM assignment WHERE id = ?").run(id)
}

// Delete all assignments (regardless of phase)
export function deleteAllAssignments() {
  const stmt = db.prepare(`
    DELETE FROM assignment
  `)
  stmt.run()
}

// Delete all assignments from a specific phase
export function deleteAllAssignmentsFromPhase(phaseId: number) {
  const stmt = db.prepare(`
    DELETE FROM assignment
    WHERE spot_id IN (
      SELECT id FROM spot WHERE phase_id = ?
    )
  `)
  stmt.run(phaseId)
}
