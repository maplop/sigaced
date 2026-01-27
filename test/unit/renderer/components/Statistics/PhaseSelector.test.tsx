// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PhaseSelector } from "@renderer/components/Statistics/PhaseSelector"

describe("PhaseSelector", () => {
  it("handlePhaseSelector se llama al hacer clic en una fase", async () => {
    const user = userEvent.setup()
    const handlePhaseSelector = vi.fn()
    render(<PhaseSelector selectedPhase="all" handlePhaseSelector={handlePhaseSelector} />)
    await user.click(screen.getByText("Fase 1: Primer Otorgamiento"))
    expect(handlePhaseSelector).toHaveBeenCalledWith(1)
  })

  it("renderiza todas las opciones de fase", () => {
    const handlePhaseSelector = vi.fn()
    render(<PhaseSelector selectedPhase="all" handlePhaseSelector={handlePhaseSelector} />)
    expect(screen.getByText("Todas las Fases")).toBeInTheDocument()
    expect(screen.getByText("Fase 1: Primer Otorgamiento")).toBeInTheDocument()
    expect(screen.getByText("Fase 2: Segundo Otorgamiento")).toBeInTheDocument()
    expect(screen.getByText("Fase 3: Otorgamiento Manual")).toBeInTheDocument()
  })
})
