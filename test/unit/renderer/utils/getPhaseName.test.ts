import { describe, it, expect } from "vitest"
import { getPhaseName } from "@renderer/utils/getPhaseName"

describe("getPhaseName", () => {
  it("phaseId 1 devuelve 'Primer Otorgamiento'", () => {
    expect(getPhaseName(1)).toBe("Primer Otorgamiento")
  })

  it("phaseId 2 devuelve 'Segundo Otorgamiento'", () => {
    expect(getPhaseName(2)).toBe("Segundo Otorgamiento")
  })

  it("phaseId 3 devuelve 'Otorgamiento Manual'", () => {
    expect(getPhaseName(3)).toBe("Otorgamiento Manual")
  })

  it("phaseId 0, 4, -1 devuelve el mismo número", () => {
    expect(getPhaseName(0)).toBe(0)
    expect(getPhaseName(4)).toBe(4)
    expect(getPhaseName(-1)).toBe(-1)
  })
})
