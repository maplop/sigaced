/* eslint-disable prettier/prettier */
import { db } from "../database"
import { Applicant } from "src/shared/types"

// -------------------- CREATE --------------------
export function addApplicant(applicant: Applicant): number {
  try {
    const insertApplicant = db.prepare(`
      INSERT INTO applicant (ci, name, last_name, grade, gender, municipality)
      VALUES (@ci, @name, @lastName, @grade, @gender, @municipality)
    `)

    const insertPhase = db.prepare(`
      INSERT INTO applicant_phase (applicant_id, phase_id)
      VALUES (?, ?)
    `)

    const insertRequest = db.prepare(`
      INSERT INTO request (applicant_id, spot_id, preference_order)
      VALUES (?, ?, ?)
    `)

    const tx = db.transaction((a: Applicant) => {
      const result = insertApplicant.run(a)
      const applicantId = result.lastInsertRowid as number

      insertPhase.run(applicantId, a.phaseId)

      if (a.requests) {
        for (const r of a.requests) {
          insertRequest.run(applicantId, r.spotId, r.preferenceOrder)
        }
      }

      return applicantId
    })

    return tx(applicant)
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed: applicant.ci")) {
      throw new Error("Ya existe un aspirante con ese CI")
    }

    if (error.message.includes("UNIQUE constraint failed: request.applicant_id, request.spot_id")) {
      throw new Error(
        "No se puede duplicar la solicitud: el aspirante ya está vinculado a esa plaza."
      )
    }
    throw error
  }
}

// -------------------- READ --------------------
export function getApplicants(phaseId: number): Applicant[] {
  const applicants = db
    .prepare(
      `
    SELECT 
      a.id,
      a.ci,
      a.name,
      a.last_name AS lastName,
      a.grade,
      a.gender,
      a.municipality,
      ap.phase_id AS phaseId
    FROM applicant a
    JOIN applicant_phase ap ON ap.applicant_id = a.id
    WHERE ap.phase_id = ?
    ORDER BY a.grade DESC 
  `
    )
    .all(phaseId)

  // Traer solicitudes por aspirante
  const getRequests = db.prepare(
    `
    SELECT r.spot_id AS spotId, r.preference_order AS preferenceOrder
    FROM request r
    JOIN spot s ON s.id = r.spot_id
    WHERE r.applicant_id = ? AND s.phase_id = ?
    ORDER BY r.preference_order
  `
  )

  return applicants.map((a) => ({
    ...a,
    requests: getRequests.all(a.id, phaseId)
  }))
}

// -------------------- UPDATE --------------------
export function updateApplicant(applicant: Applicant): void {
  try {
    const updateApp = db.prepare(`
      UPDATE applicant
      SET ci=@ci,
          name=@name,
          last_name=@lastName,
          grade=@grade,
          gender=@gender,
          municipality=@municipality
      WHERE id=@id
    `)

    const deleteRequests = db.prepare(`
      DELETE FROM request
      WHERE applicant_id = ? AND spot_id IN (
        SELECT id FROM spot WHERE phase_id = ?
      )
    `)

    const insertRequest = db.prepare(`
      INSERT INTO request (applicant_id, spot_id, preference_order)
      VALUES (?, ?, ?)
    `)

    const tx = db.transaction((a: Applicant) => {
      updateApp.run(a)
      if (a.requests) {
        deleteRequests.run(a.id, a.phaseId)
        for (const r of a.requests) {
          insertRequest.run(a.id, r.spotId, r.preferenceOrder)
        }
      }
    })

    tx(applicant)
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed: applicant.ci")) {
      throw new Error("Ya existe un aspirante con ese CI")
    }

    if (error.message.includes("UNIQUE constraint failed: request.applicant_id, request.spot_id")) {
      throw new Error(
        "No se puede duplicar la solicitud: el aspirante ya está vinculado a esa plaza."
      )
    }
    throw error
  }
}

// Eliminar aspirante COMPLETAMENTE
export function deleteApplicant(applicantId: number): void {
  const deleteRequests = db.prepare(`
    DELETE FROM request WHERE applicant_id = ?
  `)

  const deleteAllocations = db.prepare(`
    DELETE FROM allocation WHERE applicant_id = ?
  `)

  const deleteApplicantPhase = db.prepare(`
    DELETE FROM applicant_phase WHERE applicant_id = ?
  `)

  const deleteApplicant = db.prepare(`
    DELETE FROM applicant WHERE id = ?
  `)

  const tx = db.transaction((id: number) => {
    deleteRequests.run(id)
    deleteAllocations.run(id)
    deleteApplicantPhase.run(id)
    deleteApplicant.run(id)
  })

  tx(applicantId)
}

// Agregar un aspirante a una fase sin duplicar
export function addApplicantToPhase(applicantId: number, phaseId: number): void {
  const insertPhase = db.prepare(`
    INSERT INTO applicant_phase (applicant_id, phase_id)
    VALUES (?, ?)
    ON CONFLICT(applicant_id, phase_id) DO NOTHING
  `)

  insertPhase.run(applicantId, phaseId)
}

// Elimina todos los aspirantes de una fase específica de manera eficiente
export function deleteAllApplicantsFromPhase(phaseId: number): void {
  const deleteTx = db.prepare(`
    DELETE FROM applicant
    WHERE id IN (
      SELECT applicant_id
      FROM applicant_phase
      WHERE phase_id = ?
    )
  `)

  const tx = db.transaction((ph: number) => {
    deleteTx.run(ph)
  })

  tx(phaseId)
}
