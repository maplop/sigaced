// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../utils/test-utils"
import StatisticsView from "@renderer/components/Statistics/StatisticsView"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe("StatisticsView", () => {
  beforeEach(() => {
    mockWindowApi({
      getDashboardStats: vi.fn().mockResolvedValue({
        totalApplicants: 100,
        avgGrade: 85.5,
        totalSpots: 50,
        totalCareers: 5,
        allocatedSpots: 30,
        remainingSpots: 20
      }),
      getTopCareers: vi.fn().mockResolvedValue([]),
      getTopApplicants: vi.fn().mockResolvedValue([]),
      clearAllTables: vi.fn().mockResolvedValue({ success: true }),
      getInferredCurrentPhase: vi.fn().mockResolvedValue(1)
    })
  })

  it("renderiza PhaseSelector y KPICards", async () => {
    const Wrapper = createWrapper({
      initialRoute: "/statistics",
      user: { id: 1, name: "A", lastName: "B", username: "u", password: "p", role: "admin", createdAt: "" },
      currentPhase: 1
    })
    render(
      <Wrapper>
        <StatisticsView />
      </Wrapper>
    )
    expect(await screen.findByText("Filtrar Estadísticas por Fase")).toBeInTheDocument()
    expect(screen.getByText("Aspirantes Registrados")).toBeInTheDocument()
  })
})
