/* eslint-disable prettier/prettier */
// src/main/queries/statistics.ts

import { db } from "../database"

// =========================
// ESTADÍSTICAS GENERALES
// =========================
export function getDashboardStats(phaseId?: number) {
  // Total de estudiantes que participaron en la fase
  const totalStudents =
    db
      .prepare(
        `
      SELECT COUNT(DISTINCT s.id) AS total
      FROM student s
      LEFT JOIN student_phase sp ON sp.student_id = s.id
      ${phaseId ? `WHERE sp.phase_id = ${phaseId}` : ""}
    `
      )
      .get().total || 0

  // Promedio de calificaciones de los estudiantes
  const avgGrade =
    db
      .prepare(
        `
    SELECT ROUND(AVG(grade), 2) AS average
    FROM (
      SELECT DISTINCT s.id, s.grade
      FROM student s
      LEFT JOIN student_phase sp ON sp.student_id = s.id
      ${phaseId ? `WHERE sp.phase_id = ${phaseId}` : ""}
    ) AS unique_students
  `
      )
      .get().average || 0

  // Información de las plazas disponibles
  const spotData = db
    .prepare(
      `
      SELECT SUM(sp.available_quantity) AS totalSpots,
             COUNT(DISTINCT sp.career_id) AS totalCareers
      FROM spot sp
      ${phaseId ? `WHERE sp.phase_id = ${phaseId}` : ""}
    `
    )
    .get()

  // Total de plazas asignadas
  const assignedSpots =
    db
      .prepare(
        `
      SELECT COUNT(*) AS totalAssigned
      FROM assignment a
      LEFT JOIN spot sp ON sp.id = a.spot_id
      ${phaseId ? `WHERE sp.phase_id = ${phaseId}` : ""}
    `
      )
      .get().totalAssigned || 0

  // Plazas restantes
  const remainingSpots = (spotData.totalSpots || 0) - assignedSpots

  return {
    totalStudents,
    avgGrade,
    totalSpots: spotData.totalSpots || 0,
    totalCareers: spotData.totalCareers || 0,
    assignedSpots,
    remainingSpots
  }
}

// =========================
// TOP 5 ESTUDIANTES
// =========================
export function getTopStudents(phaseId?: number) {
  const phaseFilter = phaseId ? `WHERE sp.phase_id = ${phaseId}` : ""

  return db
    .prepare(
      `
      SELECT 
        s.id,
        s.name,
        s.last_name AS lastName,
        s.grade,
        c.full_name AS career
      FROM student s
      LEFT JOIN student_phase sp ON sp.student_id = s.id
      LEFT JOIN assignment a ON a.student_id = s.id
      LEFT JOIN spot st ON st.id = a.spot_id
      LEFT JOIN career c ON c.id = st.career_id
      ${phaseFilter}
      GROUP BY s.id
      ORDER BY s.grade DESC
      LIMIT 5
    `
    )
    .all()
}

// =========================
// CARRERAS MÁS SOLICITADAS
// =========================
export function getTopCareers(phaseId?: number) {
  // 🟦 Caso especial: fase 3 (manual)
  if (phaseId === 3) {
    return db
      .prepare(
        `
      SELECT
        c.full_name AS career,
        COUNT(a.id) AS totalAssignments,
        IFNULL((
          SELECT SUM(s.available_quantity)
          FROM spot s
          WHERE s.career_id = c.id AND s.phase_id = 3
        ), 0) AS totalSpots
      FROM assignment a
      JOIN spot sp ON sp.id = a.spot_id
      JOIN career c ON c.id = sp.career_id
      WHERE sp.phase_id = 3
      GROUP BY c.id
      ORDER BY totalAssignments DESC
      LIMIT 10
    `
      )
      .all()
  }

  // 🟢 Fases 1 y 2 → modo normal
  const phaseCondition = phaseId ? `AND st.phase_id = ${phaseId}` : ""

  return db
    .prepare(
      `
    SELECT
      c.full_name AS career,
      IFNULL(COUNT(r.id), 0) AS totalRequests,
      IFNULL((
        SELECT SUM(s2.available_quantity)
        FROM spot s2
        WHERE s2.career_id = c.id
        ${phaseId ? `AND s2.phase_id = ${phaseId}` : ""}
      ), 0) AS totalSpots
    FROM career c
    LEFT JOIN spot st ON st.career_id = c.id ${phaseCondition}
    LEFT JOIN request r ON r.spot_id = st.id
    GROUP BY c.id
    ORDER BY totalRequests DESC
    LIMIT 10
  `
    )
    .all()
}

/**
 * Limpia todas las tablas excepto 'user'.
 * Elimina datos y reinicia los autoincrementos.
 */
export function clearAllTables() {
  const tablesToClear = [
    "student",
    "student_phase",
    "career",
    "location",
    "spot",
    "request",
    "assignment"
  ]

  const transaction = db.transaction(() => {
    tablesToClear.forEach((table) => {
      // Borra todos los registros
      db.prepare(`DELETE FROM ${table}`).run()

      // Reinicia autoincremento
      db.prepare(`DELETE FROM sqlite_sequence WHERE name = '${table}'`).run()
    })
  })

  transaction()
}
