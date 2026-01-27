import { resolve } from "path"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@renderer": resolve(__dirname, "src/renderer/src"),
      src: resolve(__dirname, "src")
    }
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [["**/*.test.tsx", "jsdom"]],
    include: [
      "test/unit/**/*.test.ts",
      "test/unit/**/*.test.tsx",
      "test/unit/**/*.spec.ts",
      "test/unit/**/*.spec.tsx",
      "test/integration/**/*.test.ts",
      "test/integration/**/*.spec.ts"
    ],
    globals: true,
    setupFiles: ["./test/setup.ts"]
  }
})
