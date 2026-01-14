/* eslint-disable prettier/prettier */
// src/main/queries/statistics.ts

import { db } from "../database"

// =========================
// ESTADÍSTICAS GENERALES
// =========================
export function getDashboardStats(phaseId?: number) {
  // Total de aspirantes que participaron en la fase
  const totalApplicants =
    db
      .prepare(
        `
      SELECT COUNT(DISTINCT a.id) AS total
      FROM applicant a
      LEFT JOIN applicant_phase ap ON ap.applicant_id = a.id
      ${phaseId ? `WHERE ap.phase_id = ${phaseId}` : ""}
    `
      )
      .get().total || 0

  // Promedio de calificaciones de los aspirantes
  const avgGrade =
    db
      .prepare(
        `
    SELECT ROUND(AVG(grade), 2) AS average
    FROM (
      SELECT DISTINCT a.id, a.grade
      FROM applicant a
      LEFT JOIN applicant_phase ap ON ap.applicant_id = a.id
      ${phaseId ? `WHERE ap.phase_id = ${phaseId}` : ""}
    ) AS unique_applicants
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

  // Total de plazas otorgadas
  const allocatedSpots =
    db
      .prepare(
        `
      SELECT COUNT(*) AS totalAllocated
      FROM allocation alloc
      LEFT JOIN spot sp ON sp.id = alloc.spot_id
      ${phaseId ? `WHERE sp.phase_id = ${phaseId}` : ""}
    `
      )
      .get().totalAllocated || 0

  // Plazas restantes
  const remainingSpots = (spotData.totalSpots || 0) - allocatedSpots

  return {
    totalApplicants,
    avgGrade,
    totalSpots: spotData.totalSpots || 0,
    totalCareers: spotData.totalCareers || 0,
    allocatedSpots,
    remainingSpots
  }
}

// =========================
// TOP 5 ASPIRANTES
// =========================
export function getTopApplicants(phaseId?: number) {
  const phaseFilter = phaseId ? `WHERE ap.phase_id = ${phaseId}` : ""

  return db
    .prepare(
      `
      SELECT 
        a.id,
        a.name,
        a.last_name AS lastName,
        a.grade,
        c.full_name AS career
      FROM applicant a
      LEFT JOIN applicant_phase ap ON ap.applicant_id = a.id
      LEFT JOIN allocation alloc ON alloc.applicant_id = a.id
      LEFT JOIN spot st ON st.id = alloc.spot_id
      LEFT JOIN career c ON c.id = st.career_id
      ${phaseFilter}
      GROUP BY a.id
      ORDER BY a.grade DESC
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
        COUNT(alloc.id) AS totalAllocations,
        IFNULL((
          SELECT SUM(s.available_quantity)
          FROM spot s
          WHERE s.career_id = c.id AND s.phase_id = 3
        ), 0) AS totalSpots
      FROM allocation alloc
      JOIN spot sp ON sp.id = alloc.spot_id
      JOIN career c ON c.id = sp.career_id
      WHERE sp.phase_id = 3
      GROUP BY c.id
      ORDER BY totalAllocations DESC
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
    "applicant",
    "applicant_phase",
    "career",
    "location",
    "spot",
    "request",
    "allocation"
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
