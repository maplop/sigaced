import { describe, it, expect } from "vitest"
import { formatDate } from "@renderer/utils/formatDate"

describe("formatDate", () => {
  it("formatea fecha concreta como 'd mes y' (5 enero 2025)", () => {
    // new Date(2025, 0, 5) = 5 de enero de 2025 (mes 0 = enero)
    expect(formatDate(new Date(2025, 0, 5))).toBe("5 enero 2025")
  })

  it("formatea otro mes correctamente (31 diciembre 2024)", () => {
    // new Date(2024, 11, 31) = 31 de diciembre de 2024 (mes 11 = diciembre)
    expect(formatDate(new Date(2024, 11, 31))).toBe("31 diciembre 2024")
  })
})
