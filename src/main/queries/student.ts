/* eslint-disable prettier/prettier */
import { db } from "../database"
import { Student } from "src/shared/types"

// -------------------- CREATE --------------------
export function addStudent(student: Student): number {
  try {
    const insertStudent = db.prepare(`
      INSERT INTO student (ci, name, last_name, grade, age, gender, municipality)
      VALUES (@ci, @name, @lastName, @grade, @age, @gender, @municipality)
    `)

    const insertPhase = db.prepare(`
      INSERT INTO student_phase (student_id, phase_id)
      VALUES (?, ?)
    `)

    const insertRequest = db.prepare(`
      INSERT INTO request (student_id, spot_id, preference_order)
      VALUES (?, ?, ?)
    `)

    const tx = db.transaction((s: Student) => {
      const result = insertStudent.run(s)
      const studentId = result.lastInsertRowid as number

      insertPhase.run(studentId, s.phaseId)

      if (s.requests) {
        for (const r of s.requests) {
          insertRequest.run(studentId, r.spotId, r.preferenceOrder)
        }
      }

      return studentId
    })

    return tx(student)
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed: student.ci")) {
      throw new Error("Ya existe un aspirante con ese CI")
    }

    if (error.message.includes("UNIQUE constraint failed: request.student_id, request.spot_id")) {
      throw new Error(
        "No se puede duplicar la solicitud: el aspirante ya está vinculado a esa plaza."
      )
    }
    throw error
  }
}

// -------------------- READ --------------------
export function getStudents(phaseId: number): Student[] {
  const students = db
    .prepare(
      `
    SELECT 
      st.id,
      st.ci,
      st.name,
      st.last_name AS lastName,
      st.grade,
      st.age,
      st.gender,
      st.municipality,
      sp.phase_id AS phaseId
    FROM student st
    JOIN student_phase sp ON sp.student_id = st.id
    WHERE sp.phase_id = ?
  `
    )
    .all(phaseId)

  // Traer solicitudes por aspirante
  const getRequests = db.prepare(
    `
    SELECT r.spot_id AS spotId, r.preference_order AS preferenceOrder
    FROM request r
    JOIN spot s ON s.id = r.spot_id
    WHERE r.student_id = ? AND s.phase_id = ?
    ORDER BY r.preference_order
  `
  )

  return students.map((s) => ({
    ...s,
    requests: getRequests.all(s.id, phaseId)
  }))
}

// -------------------- UPDATE --------------------
export function updateStudent(student: Student): void {
  try {
    const updateSt = db.prepare(`
      UPDATE student
      SET ci=@ci,
          name=@name,
          last_name=@lastName,
          grade=@grade,
          age=@age,
          gender=@gender,
          municipality=@municipality
      WHERE id=@id
    `)

    const deleteRequests = db.prepare(`
      DELETE FROM request
      WHERE student_id = ? AND spot_id IN (
        SELECT id FROM spot WHERE phase_id = ?
      )
    `)

    const insertRequest = db.prepare(`
      INSERT INTO request (student_id, spot_id, preference_order)
      VALUES (?, ?, ?)
    `)

    const tx = db.transaction((s: Student) => {
      updateSt.run(s)
      if (s.requests) {
        deleteRequests.run(s.id, s.phaseId)
        for (const r of s.requests) {
          insertRequest.run(s.id, r.spotId, r.preferenceOrder)
        }
      }
    })

    tx(student)
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed: student.ci")) {
      throw new Error("Ya existe un aspirante con ese CI")
    }

    if (error.message.includes("UNIQUE constraint failed: request.student_id, request.spot_id")) {
      throw new Error(
        "No se puede duplicar la solicitud: el aspirante ya está vinculado a esa plaza."
      )
    }
    throw error
  }
}

// -------------------- DELETE --------------------
// Eliminar aspirante SOLO de una fase
export function deleteStudentFromPhase(studentId: number, phaseId: number): void {
  const deleteRequests = db.prepare(`
    DELETE FROM request
    WHERE student_id = ? AND spot_id IN (
      SELECT id FROM spot WHERE phase_id = ?
    )
  `)

  const deletePhase = db.prepare(`
    DELETE FROM student_phase
    WHERE student_id = ? AND phase_id = ?
  `)

  const tx = db.transaction((id: number, ph: number) => {
    deleteRequests.run(id, ph)
    deletePhase.run(id, ph)
  })

  tx(studentId, phaseId)
}

// Eliminar aspirante COMPLETAMENTE
export function deleteStudentCompletely(studentId: number): void {
  db.prepare("DELETE FROM student WHERE id = ?").run(studentId)
}

// Agregar un aspirante a una fase sin duplicar
export function addStudentToPhase(studentId: number, phaseId: number): void {
  const insertPhase = db.prepare(`
    INSERT INTO student_phase (student_id, phase_id)
    VALUES (?, ?)
    ON CONFLICT(student_id, phase_id) DO NOTHING
  `)

  insertPhase.run(studentId, phaseId)
}

// Elimina a todos los estudiantes de una fase específica
export function deleteAllStudentsFromPhase(phaseId: number): void {
  const deleteRequests = db.prepare(`
    DELETE FROM request
    WHERE spot_id IN (
      SELECT id FROM spot WHERE phase_id = ?
    )
  `)

  const deleteStudentPhase = db.prepare(`
    DELETE FROM student_phase
    WHERE phase_id = ?
  `)

  const tx = db.transaction((ph: number) => {
    deleteRequests.run(ph)
    deleteStudentPhase.run(ph)
  })

  tx(phaseId)
}
