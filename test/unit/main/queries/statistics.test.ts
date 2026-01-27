import { beforeAll, beforeEach, describe, expect, it } from "vitest"

const DB_AVAILABLE = process.env.DB_AVAILABLE === "1"

let db: { prepare: (sql: string) => { run: (...args: unknown[]) => unknown } }
let clearAllTables: () => void
let getInferredCurrentPhase: () => 1 | 2 | 3

/**
 * Inserta datos mínimos para tener una allocation con spot en la fase indicada.
 * Tras clearAllTables, los ids empiezan en 1.
 */
function seedAllocationWithSpotPhase(spotPhaseId: 1 | 2 | 3): void {
  db.prepare(
    "INSERT INTO career (full_name, abbreviation, faculty) VALUES (?, ?, ?)"
  ).run("Carrera", "C", "Fac")
  db.prepare("INSERT INTO location (name) VALUES (?)").run("Sede")
  db.prepare(
    "INSERT INTO spot (career_id, location_id, phase_id, available_quantity) VALUES (1, 1, ?, 1)"
  ).run(spotPhaseId)
  db.prepare(
    "INSERT INTO applicant (ci, name, last_name, grade, gender, municipality) VALUES (?, ?, ?, ?, ?, ?)"
  ).run("12345678901", "Nombre", "Apellido", 70, "M", "Mun")
  db.prepare("INSERT INTO allocation (applicant_id, spot_id) VALUES (1, 1)").run()
}

describe.skipIf(!DB_AVAILABLE)("getInferredCurrentPhase", () => {
  beforeAll(async () => {
    const d = await import("src/main/database")
    const s = await import("src/main/queries/statistics")
    db = d.db
    clearAllTables = s.clearAllTables
    getInferredCurrentPhase = s.getInferredCurrentPhase
  })

  beforeEach(() => {
    clearAllTables()
  })

  it("sin allocations devuelve 1", () => {
    expect(getInferredCurrentPhase()).toBe(1)
  })

  it("con allocation en spot de fase 1 devuelve 2", () => {
    seedAllocationWithSpotPhase(1)
    expect(getInferredCurrentPhase()).toBe(2)
  })

  it("con allocation en spot de fase 2 devuelve 3", () => {
    seedAllocationWithSpotPhase(2)
    expect(getInferredCurrentPhase()).toBe(3)
  })

  it("con allocation en spot de fase 3 devuelve 3", () => {
    seedAllocationWithSpotPhase(3)
    expect(getInferredCurrentPhase()).toBe(3)
  })
})
