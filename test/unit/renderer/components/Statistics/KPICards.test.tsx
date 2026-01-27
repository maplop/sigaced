// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { KPICards } from "@renderer/components/Statistics/KPICards"
import { DashboardStats } from "src/shared/types"

const mockStats: DashboardStats = {
  totalApplicants: 100,
  avgGrade: 85.5,
  totalSpots: 50,
  totalCareers: 5,
  allocatedSpots: 30,
  remainingSpots: 20
}

describe("KPICards", () => {
  it("muestra los KPIs con los datos proporcionados", () => {
    render(<KPICards stats={mockStats} loadingStats={false} />)
    expect(screen.getByText("Aspirantes Registrados")).toBeInTheDocument()
    expect(screen.getByText("100")).toBeInTheDocument()
    expect(screen.getByText("85.50")).toBeInTheDocument()
    expect(screen.getByText("50")).toBeInTheDocument()
    expect(screen.getByText("30")).toBeInTheDocument()
    expect(screen.getByText("20")).toBeInTheDocument()
  })

  it("muestra skeleton cuando loadingStats es true", () => {
    render(<KPICards stats={undefined} loadingStats={true} />)
    const skeletons = screen.getAllByRole("generic").filter(el => el.className.includes("animate-pulse"))
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
