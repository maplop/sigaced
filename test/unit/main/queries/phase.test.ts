import { describe, it, expect } from "vitest"

const DB_AVAILABLE = process.env.DB_AVAILABLE === "1"

describe.skipIf(!DB_AVAILABLE)("getPhases", () => {
  it("devuelve un array de 3 fases", async () => {
    const { getPhases } = await import("src/main/queries/phase")
    const phases = getPhases()
    expect(phases).toHaveLength(3)
  })

  it("devuelve las fases con id 1, 2, 3 y nombres first, second, manual", async () => {
    const { getPhases } = await import("src/main/queries/phase")
    const phases = getPhases()
    const ids = phases.map((p) => p.id).sort((a, b) => a - b)
    expect(ids).toEqual([1, 2, 3])
    const names = phases.map((p) => p.name).sort()
    expect(names).toContain("first")
    expect(names).toContain("second")
    expect(names).toContain("manual")
  })
})
