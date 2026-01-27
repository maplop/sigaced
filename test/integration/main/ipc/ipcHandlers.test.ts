import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

const DB_AVAILABLE = process.env.DB_AVAILABLE === "1"

let db: { prepare: (sql: string) => { run: (...args: unknown[]) => unknown } }
let clearAllTables: () => void
let statsGetInferredCurrentPhase: () => 1 | 2 | 3

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

describe("phaseGetAll", () => {
  describe.skipIf(!DB_AVAILABLE)("con BD", () => {
    it("devuelve array de 3 fases con id 1, 2, 3 y nombres first, second, manual", async () => {
      const { phaseGetAll } = await import("src/main/ipcHandlers")
      const phases = await phaseGetAll()
      expect(phases).toHaveLength(3)
      const ids = phases.map((p) => p.id).sort((a, b) => a - b)
      expect(ids).toEqual([1, 2, 3])
      const names = phases.map((p) => p.name).sort()
      expect(names).toContain("first")
      expect(names).toContain("second")
      expect(names).toContain("manual")
    })
  })

  describe("cuando getPhases lanza", () => {
    it("devuelve []", async () => {
      vi.doMock("src/main/queries/phase", () => ({
        getPhases: vi.fn().mockRejectedValue(new Error("db"))
      }))
      vi.doMock("src/main/queries/statistics", () => ({
        getInferredCurrentPhase: vi.fn().mockReturnValue(1)
      }))
      vi.resetModules()
      const { phaseGetAll } = await import("src/main/ipcHandlers")
      await expect(phaseGetAll()).resolves.toEqual([])
    })
  })
})

describe("statsGetInferredCurrentPhase", () => {
  describe.skipIf(!DB_AVAILABLE)("con BD", () => {
    beforeAll(async () => {
      const d = await import("src/main/database")
      const s = await import("src/main/queries/statistics")
      const h = await import("src/main/ipcHandlers")
      db = d.db
      clearAllTables = s.clearAllTables
      statsGetInferredCurrentPhase = h.statsGetInferredCurrentPhase
    })

    beforeEach(() => {
      clearAllTables()
    })

    it("sin allocations devuelve 1", () => {
      expect(statsGetInferredCurrentPhase()).toBe(1)
    })

    it("con allocation en spot de fase 1 devuelve 2", () => {
      seedAllocationWithSpotPhase(1)
      expect(statsGetInferredCurrentPhase()).toBe(2)
    })

    it("con allocation en spot de fase 2 devuelve 3", () => {
      seedAllocationWithSpotPhase(2)
      expect(statsGetInferredCurrentPhase()).toBe(3)
    })

    it("con allocation en spot de fase 3 devuelve 3", () => {
      seedAllocationWithSpotPhase(3)
      expect(statsGetInferredCurrentPhase()).toBe(3)
    })
  })

  describe("cuando getInferredCurrentPhase lanza", () => {
    it("devuelve 1", async () => {
      vi.doMock("src/main/queries/phase", () => ({
        getPhases: vi.fn().mockResolvedValue([])
      }))
      vi.doMock("src/main/queries/statistics", () => ({
        getInferredCurrentPhase: vi.fn().mockImplementation(() => {
          throw new Error("db")
        })
      }))
      vi.resetModules()
      const { statsGetInferredCurrentPhase: fn } = await import(
        "src/main/ipcHandlers"
      )
      expect(fn()).toBe(1)
    })
  })
})
