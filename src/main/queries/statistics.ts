/* eslint-disable prettier/prettier */
// src/main/queries/statistics.ts

import { db } from "../database"

// =========================
// ESTADÍSTICAS GENERALES
// =========================

export function getDashboardStats() {
  // Total de aspirantes registrados
  const totalStudents = db.prepare(`SELECT COUNT(*) AS total FROM student`).get().total

  // Promedio general del promedio de todos los aspirantes
  const avgGrade =
    db.prepare(`SELECT ROUND(AVG(grade), 2) AS average FROM student`).get().average || 0

  // Plazas totales (suma de available_quantity)
  const spotData = db
    .prepare(
      `
      SELECT 
        SUM(available_quantity) AS totalSpots,
        COUNT(DISTINCT career_id) AS totalCareers
      FROM spot
    `
    )
    .get()

  // Plazas asignadas
  const assignedSpots = db
    .prepare(`SELECT COUNT(*) AS totalAssigned FROM assignment`)
    .get().totalAssigned

  // Plazas restantes
  const remainingSpots = (spotData.totalSpots || 0) - (assignedSpots || 0)

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

export function getTopStudents() {
  return db
    .prepare(
      `
      SELECT 
        s.name,
        s.last_name AS lastName,
        s.grade,
        c.full_name AS career
      FROM student s
      LEFT JOIN assignment a ON a.student_id = s.id
      LEFT JOIN spot sp ON sp.id = a.spot_id
      LEFT JOIN career c ON c.id = sp.career_id
      ORDER BY s.grade DESC
      LIMIT 5
    `
    )
    .all()
}

// =========================
// CARRERAS MÁS SOLICITADAS
// =========================

export function getTopCareers() {
  return db
    .prepare(
      `
      SELECT 
        c.full_name AS career,
        IFNULL(SUM(sp.available_quantity), 0) AS totalSpots,
        COUNT(r.id) AS totalRequests
      FROM career c
      LEFT JOIN spot sp ON sp.career_id = c.id
      LEFT JOIN request r ON r.spot_id = sp.id
      GROUP BY c.id
      ORDER BY totalRequests DESC
      LIMIT 10
      `
    )
    .all()
}
