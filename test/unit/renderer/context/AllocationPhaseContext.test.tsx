// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useAllocationPhase } from "@renderer/context/AllocationPhaseContext"
import { createWrapper, mockWindowApi } from "../../../utils/test-utils"

function TestPhase({ onPhase }: { onPhase?: (n: number) => void }) {
  const { currentPhase, setCurrentPhase } = useAllocationPhase()
  return (
    <div>
      <span data-testid="phase">{currentPhase}</span>
      <button type="button" onClick={() => { setCurrentPhase(2); onPhase?.(2) }}>
        Set 2
      </button>
    </div>
  )
}

describe("AllocationPhaseContext", () => {
  beforeEach(() => {
    mockWindowApi()
    localStorage.clear()
  })
  afterEach(() => {
    localStorage.clear()
  })

  it("inicial desde localStorage", () => {
    const Wrapper = createWrapper({ currentPhase: 2, initialRoute: "/" })
    ;(window as unknown as { api: { getInferredCurrentPhase: ReturnType<typeof vi.fn> } }).api.getInferredCurrentPhase = vi
      .fn()
      .mockResolvedValue(2)
    render(
      <Wrapper>
        <TestPhase />
      </Wrapper>
    )
    expect(screen.getByTestId("phase")).toHaveTextContent("2")
  })

  it("getInferredCurrentPhase actualiza la fase si difiere del localStorage", async () => {
    const Wrapper = createWrapper({ currentPhase: 1, initialRoute: "/" })
    ;(window as unknown as { api: { getInferredCurrentPhase: ReturnType<typeof vi.fn> } }).api.getInferredCurrentPhase = vi
      .fn()
      .mockResolvedValue(3)
    render(
      <Wrapper>
        <TestPhase />
      </Wrapper>
    )
    expect(screen.getByTestId("phase")).toHaveTextContent("1")
    await waitFor(() => {
      expect(screen.getByTestId("phase")).toHaveTextContent("3")
    })
  })

  it("setCurrentPhase persiste en localStorage", async () => {
    const Wrapper = createWrapper({ currentPhase: 1, initialRoute: "/" })
    ;(window as unknown as { api: { getInferredCurrentPhase: ReturnType<typeof vi.fn> } }).api.getInferredCurrentPhase = vi
      .fn()
      .mockResolvedValue(1)
    render(
      <Wrapper>
        <TestPhase />
      </Wrapper>
    )
    await userEvent.setup().click(screen.getByRole("button", { name: /Set 2/i }))
    expect(screen.getByTestId("phase")).toHaveTextContent("2")
    expect(localStorage.getItem("currentPhase")).toBe("2")
  })
})
