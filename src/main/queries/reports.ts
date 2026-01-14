import { db } from "../database"
import { CareerClosingRow, Applicant, ApplicantRequestRow } from "src/shared/types"

export function getApplicantsAndRequest(): ApplicantRequestRow[] {
  const stmt = db.prepare(`
    SELECT
      a.ci,
      a.last_name AS lastName,
      a.name,
      a.grade,
      c.full_name AS career,
      l.name AS location,
      sp.phase_id AS phase,
      r.preference_order AS preferenceOrder
    FROM applicant a
    JOIN request r ON r.applicant_id = a.id
    JOIN spot sp ON sp.id = r.spot_id
    JOIN career c ON c.id = sp.career_id
    JOIN location l ON l.id = sp.location_id
    ORDER BY
      a.last_name,
      a.name,
      sp.phase_id,
      r.preference_order
      
  `)

  return stmt.all() as ApplicantRequestRow[]
}

export function getAssignedApplicantsByLocation(): Applicant[] {
  const stmt = db.prepare(`
    SELECT DISTINCT
      a.id,
      a.ci,
      a.name,
      a.last_name AS lastName,
      a.grade,
      a.gender,
      a.municipality,
      sp.phase_id AS phaseId
    FROM applicant a
    JOIN allocation alloc ON alloc.applicant_id = a.id
    JOIN spot sp ON sp.id = alloc.spot_id
    JOIN location l ON l.id = sp.location_id
    ORDER BY
      a.last_name,
      a.name
  `)

  return stmt.all() as Applicant[]
}

export function getAssignedApplicantsByCareer(): Applicant[] {
  const stmt = db.prepare(`
    SELECT DISTINCT
      a.id,
      a.ci,
      a.name,
      a.last_name AS lastName,
      a.grade,
      a.gender,
      a.municipality,
      sp.phase_id AS phaseId
    FROM applicant a
    JOIN allocation alloc ON alloc.applicant_id = a.id
    JOIN spot sp ON sp.id = alloc.spot_id
    JOIN career c ON c.id = sp.career_id
    ORDER BY
      a.last_name,
      a.name
  `)

  return stmt.all() as Applicant[]
}

export function getAssignedApplicantsBySpot(): ApplicantRequestRow[] {
  const stmt = db.prepare(`
    SELECT
      a.ci,
      a.last_name,
      a.name,
      a.grade,
      c.full_name AS career,
      l.name AS location,
      r.preference_order AS option_number
    FROM applicant a
    JOIN allocation alloc ON alloc.applicant_id = a.id
    JOIN spot sp ON sp.id = alloc.spot_id
    JOIN career c ON c.id = sp.career_id
    JOIN location l ON l.id = sp.location_id
    JOIN request r ON r.applicant_id = a.id AND r.spot_id = sp.id
    ORDER BY
      c.full_name,
      l.name,
      a.last_name,
      a.name
  `)

  return stmt.all() as ApplicantRequestRow[]
}

export function getApplicantsByMunicipality(): Applicant[] {
  const stmt = db.prepare(`
    SELECT DISTINCT
      a.id,
      a.ci,
      a.name,
      a.last_name AS lastName,
      a.grade,
      a.gender,
      a.municipality,
      sp.phase_id AS phaseId
    FROM applicant a
    JOIN allocation alloc ON alloc.applicant_id = a.id
    JOIN spot sp ON sp.id = alloc.spot_id
    ORDER BY
      a.last_name,
      a.name
  `)

  return stmt.all() as Applicant[]
}

export function getCareerClosing(): CareerClosingRow[] {
  const stmt = db.prepare(`
    SELECT
      c.full_name AS name,
      MIN(a.grade) AS closing_grade
    FROM career c
    JOIN spot sp ON sp.career_id = c.id
    JOIN allocation alloc ON alloc.spot_id = sp.id
    JOIN applicant a ON a.id = alloc.applicant_id
    GROUP BY c.id
    ORDER BY closing_grade DESC
  `)

  return stmt.all() as CareerClosingRow[]
}
