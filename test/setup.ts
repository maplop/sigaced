import "@testing-library/jest-dom/vitest"

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// Comprueba si better-sqlite3 se puede cargar (mismo NODE_MODULE_VERSION que Node).
// Si no, los tests de main/queries se omitirán (describe.skipIf).
try {
  const D = require("better-sqlite3")
  const db = new D(":memory:")
  db.close()
  process.env.DB_AVAILABLE = "1"
} catch {
  process.env.DB_AVAILABLE = "0"
  if (process.env.CI !== "true") {
    console.warn(
      "[test/setup] better-sqlite3 no se pudo cargar: los tests de test/unit/main/queries se omitirán. " +
        "Ejecute 'pnpm rebuild' con la misma versión de Node que usa Vitest."
    )
  }
}
