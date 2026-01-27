import { describe, it, expect } from "vitest"
import { hashPassword } from "@renderer/utils/encryption"

describe("hashPassword", () => {
  it("devuelve el mismo hash para la misma string", () => {
    const a = hashPassword("test")
    const b = hashPassword("test")
    expect(a).toBe(b)
  })

  it("devuelve hashes distintos para strings distintas", () => {
    const a = hashPassword("a")
    const b = hashPassword("b")
    expect(a).not.toBe(b)
  })

  it("string vacía produce un hash SHA256 válido de 64 caracteres hex", () => {
    const h = hashPassword("")
    expect(h).toMatch(/^[a-f0-9]{64}$/)
    expect(h).toHaveLength(64)
  })

  it("caracteres especiales y unicode no lanzan y devuelven string", () => {
    expect(() => hashPassword("ñoñó")).not.toThrow()
    expect(typeof hashPassword("ñoñó")).toBe("string")
    expect(() => hashPassword("a@#1")).not.toThrow()
    expect(typeof hashPassword("a@#1")).toBe("string")
  })

  it("el resultado es siempre un string de 64 caracteres hex", () => {
    const h = hashPassword("test")
    expect(h).toMatch(/^[a-f0-9]{64}$/)
    expect(h).toHaveLength(64)
  })
})
