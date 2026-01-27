// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../utils/test-utils"
import ManualAllocationView from "@renderer/components/ManualAllocations/ManualAllocationView"
import { AllocationRow } from "src/shared/types"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockAllocation: AllocationRow = {
  id: 1,
  spotId: 1,
  applicantId: 1,
  ci: "12345678",
  lastName: "Pérez",
  name: "Juan",
  career: "Informática",
  location: "Santa Clara",
  grade: 95.5,
  preferenceOrder: 1,
  phase: 1
}

const adminUser = { id: 1, name: "A", lastName: "B", username: "u", password: "p", role: "admin" as const, createdAt: "" }

describe("ManualAllocationView", () => {
  beforeEach(() => {
    mockWindowApi({
      getAllocationsByPhase: vi.fn().mockResolvedValue([mockAllocation]),
      getApplicants: vi.fn().mockResolvedValue([
        { id: 2, ci: "87654321", name: "María", lastName: "González", grade: 90, requests: [] }
      ]),
      getAllSpots: vi.fn().mockResolvedValue([
        { spotId: 2, careerId: 1, careerName: "Inf", locationId: 1, locationName: "SC", phaseId: 1, phaseName: "F1", availableQuantity: 3 }
      ]),
      deleteAllAllocationsFromPhase: vi.fn().mockResolvedValue({ success: true }),
      getInferredCurrentPhase: vi.fn().mockResolvedValue(1),
      generatePDF: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.pdf" }),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
  })

  it("renderiza total de otorgamientos y búsqueda", async () => {
    const Wrapper = createWrapper({
      initialRoute: "/manual-allocations/1",
      user: adminUser,
      currentPhase: 1
    })
    render(
      <Wrapper>
        <ManualAllocationView phase={1} />
      </Wrapper>
    )
    expect(await screen.findByText(/Total de otorgamientos:/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Buscar por: (ci, nombre, apellidos, carrera, lugar)")).toBeInTheDocument()
  })

  it("renderiza el botón Deshacer otorgamiento cuando hay allocations y el usuario es admin", async () => {
    mockWindowApi({
      getAllocationsByPhase: vi.fn().mockResolvedValue([mockAllocation]),
      getApplicants: vi.fn().mockResolvedValue([]),
      getAllSpots: vi.fn().mockResolvedValue([]),
      deleteAllAllocationsFromPhase: vi.fn().mockResolvedValue({ success: true }),
      getInferredCurrentPhase: vi.fn().mockResolvedValue(1),
      generatePDF: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.pdf" }),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
    const Wrapper = createWrapper({
      initialRoute: "/manual-allocations/1",
      user: adminUser,
      currentPhase: 1
    })
    render(
      <Wrapper>
        <ManualAllocationView phase={1} />
      </Wrapper>
    )
    // Esperar a que los datos se carguen y el botón se renderice
    await waitFor(() => {
      expect(screen.getByText(/Total de otorgamientos:/)).toBeInTheDocument()
      // Buscar el botón por su texto, puede estar dentro de un trigger
      const button = screen.getByText("Deshacer otorgamiento", { exact: false })
      expect(button).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})
