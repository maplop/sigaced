import { StudentPhase } from "src/shared/types"
import { db } from "../database"

// Crear registro de participación en fase
export function addStudentPhase(entry: Omit<StudentPhase, "id">): void {
  const stmt = db.prepare(`
    INSERT INTO student_phase (student_id, phase_id)
    VALUES (@studentId, @phaseId)
  `)
  stmt.run(entry)
}

// Obtener todas las participaciones
export function getStudentPhases(): StudentPhase[] {
  return db
    .prepare(
      `
    SELECT
      id,
      student_id AS studentId,
      phase_id AS phaseId,
    FROM student_phase
  `
    )
    .all()
}

// Obtener participaciones de un estudiante específico
export function getStudentPhasesByStudent(studentId: number): StudentPhase[] {
  return db
    .prepare(
      `
    SELECT
      id,
      student_id AS studentId,
      phase_id AS phaseId,
    FROM student_phase
    WHERE student_id = ?
  `
    )
    .all(studentId)
}

// Actualizar un registro (por si necesitas cambiar la fase o fecha)
export function updateStudentPhase(entry: StudentPhase): void {
  const stmt = db.prepare(`
    UPDATE student_phase
    SET
      student_id = @studentId,
      phase_id = @phaseId,
    WHERE id = @id
  `)
  stmt.run(entry)
}

// Eliminar un registro por id
export function deleteStudentPhase(id: number): void {
  db.prepare(`DELETE FROM student_phase WHERE id = ?`).run(id)
}
