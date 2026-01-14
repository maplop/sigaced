import { db } from "../database"
import { CareerClosingRow, Student, StudentRequestRow } from "src/shared/types"

export function getStudentsAndRequest(): StudentRequestRow[] {
  const stmt = db.prepare(`
    SELECT
      s.ci,
      s.last_name,
      s.name,
      s.grade,
      c.full_name AS career,
      l.name AS location,
      r.preference_order AS option_number
    FROM student s
    JOIN request r ON r.student_id = s.id
    JOIN spot sp ON sp.id = r.spot_id
    JOIN career c ON c.id = sp.career_id
    JOIN location l ON l.id = sp.location_id
    ORDER BY
      s.last_name,
      s.name,
      r.preference_order
  `)

  return stmt.all() as StudentRequestRow[]
}

export function getAssignedStudentsByLocation(): Student[] {
  const stmt = db.prepare(`
    SELECT DISTINCT
      s.id,
      s.ci,
      s.name,
      s.last_name AS lastName,
      s.grade,
      s.gender,
      s.municipality,
      sp.phase_id AS phaseId
    FROM student s
    JOIN assignment a ON a.student_id = s.id
    JOIN spot sp ON sp.id = a.spot_id
    JOIN location l ON l.id = sp.location_id
    ORDER BY
      s.last_name,
      s.name
  `)

  return stmt.all() as Student[]
}

export function getAssignedStudentsByCareer(): Student[] {
  const stmt = db.prepare(`
    SELECT DISTINCT
      s.id,
      s.ci,
      s.name,
      s.last_name AS lastName,
      s.grade,
      s.gender,
      s.municipality,
      sp.phase_id AS phaseId
    FROM student s
    JOIN assignment a ON a.student_id = s.id
    JOIN spot sp ON sp.id = a.spot_id
    JOIN career c ON c.id = sp.career_id
    ORDER BY
      s.last_name,
      s.name
  `)

  return stmt.all() as Student[]
}

export function getAssignedStudentsBySpot(): StudentRequestRow[] {
  const stmt = db.prepare(`
    SELECT
      s.ci,
      s.last_name,
      s.name,
      s.grade,
      c.full_name AS career,
      l.name AS location,
      r.preference_order AS option_number
    FROM student s
    JOIN assignment a ON a.student_id = s.id
    JOIN spot sp ON sp.id = a.spot_id
    JOIN career c ON c.id = sp.career_id
    JOIN location l ON l.id = sp.location_id
    JOIN request r ON r.student_id = s.id AND r.spot_id = sp.id
    ORDER BY
      c.full_name,
      l.name,
      s.last_name,
      s.name
  `)

  return stmt.all() as StudentRequestRow[]
}

export function getStudentsByMunicipality(): Student[] {
  const stmt = db.prepare(`
    SELECT DISTINCT
      s.id,
      s.ci,
      s.name,
      s.last_name AS lastName,
      s.grade,
      s.gender,
      s.municipality,
      sp.phase_id AS phaseId
    FROM student s
    JOIN assignment a ON a.student_id = s.id
    JOIN spot sp ON sp.id = a.spot_id
    ORDER BY
      s.last_name,
      s.name
  `)

  return stmt.all() as Student[]
}

export function getCareerClosing(): CareerClosingRow[] {
  const stmt = db.prepare(`
    SELECT
      c.full_name AS name,
      MIN(s.grade) AS closing_grade
    FROM career c
    JOIN spot sp ON sp.career_id = c.id
    JOIN assignment a ON a.spot_id = sp.id
    JOIN student s ON s.id = a.student_id
    GROUP BY c.id
    ORDER BY closing_grade DESC
  `)

  return stmt.all() as CareerClosingRow[]
}
