// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import AllocationsView from "@renderer/components/common/Allocations/AllocationsView"
import { AllocationRow } from "src/shared/types"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock("@renderer/utils/allocations", () => ({
  handleAllocate: vi.fn().mockResolvedValue(undefined)
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

describe("AllocationsView", () => {
  beforeEach(() => {
    mockWindowApi({
      getAllocationsByPhase: vi.fn().mockResolvedValue([mockAllocation]),
      getApplicants: vi.fn().mockResolvedValue([]),
      getAllSpots: vi.fn().mockResolvedValue([]),
      deleteAllAllocationsFromPhase: vi.fn().mockResolvedValue({ success: true }),
      getInferredCurrentPhase: vi.fn().mockResolvedValue(1),
      generatePDF: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.pdf" }),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
  })

  it("renderiza total de otorgamientos y búsqueda", async () => {
    const Wrapper = createWrapper({
      initialRoute: "/allocations/1",
      user: adminUser,
      currentPhase: 1
    })
    render(
      <Wrapper>
        <AllocationsView phase={1} />
      </Wrapper>
    )
    expect(await screen.findByText(/Total de otorgamientos: 1/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Buscar por: (ci, nombre, apellidos, carrera, lugar)")).toBeInTheDocument()
  })

  it("getAllocationsByPhase se invoca con el phaseId correcto", async () => {
    const getAllocationsByPhase = vi.fn().mockResolvedValue([mockAllocation])
    mockWindowApi({
      getAllocationsByPhase,
      getApplicants: vi.fn().mockResolvedValue([]),
      getAllSpots: vi.fn().mockResolvedValue([]),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
    const Wrapper = createWrapper({
      initialRoute: "/allocations/2",
      user: adminUser,
      currentPhase: 2
    })
    render(
      <Wrapper>
        <AllocationsView phase={2} />
      </Wrapper>
    )
    await waitFor(() => {
      expect(getAllocationsByPhase).toHaveBeenCalledWith(2)
    })
  })

  it("renderiza el botón Otorgar cuando el usuario es admin", async () => {
    const mockApplicants = [
      { id: 1, ci: "12345678", name: "Juan", lastName: "Pérez", grade: 95, requests: [{ id: 1, spotPhaseId: 1, preferenceOrder: 1 }] }
    ]
    const mockSpots = [
      { spotId: 1, careerId: 1, careerName: "Inf", locationId: 1, locationName: "SC", phaseId: 1, phaseName: "F1", availableQuantity: 5 }
    ]
    mockWindowApi({
      getAllocationsByPhase: vi.fn().mockResolvedValue([]),
      getApplicants: vi.fn().mockResolvedValue(mockApplicants),
      getAllSpots: vi.fn().mockResolvedValue(mockSpots),
      getInferredCurrentPhase: vi.fn().mockResolvedValue(1),
      generatePDF: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.pdf" }),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
    const Wrapper = createWrapper({
      initialRoute: "/allocations/1",
      user: adminUser,
      currentPhase: 1
    })
    render(
      <Wrapper>
        <AllocationsView phase={1} />
      </Wrapper>
    )
    // Esperar a que los datos se carguen y el botón se renderice
    await waitFor(() => {
      expect(screen.getByText(/Total de otorgamientos: 0/)).toBeInTheDocument()
      // Buscar el botón por su texto
      const button = screen.getByText("Otorgar", { exact: false })
      expect(button).toBeInTheDocument()
    }, { timeout: 5000 })
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
      initialRoute: "/allocations/1",
      user: adminUser,
      currentPhase: 1
    })
    render(
      <Wrapper>
        <AllocationsView phase={1} />
      </Wrapper>
    )
    // Esperar a que los datos se carguen y el botón se renderice
    await waitFor(() => {
      expect(screen.getByText(/Total de otorgamientos: 1/)).toBeInTheDocument()
      // Buscar el botón por su texto
      const button = screen.getByText("Deshacer otorgamiento", { exact: false })
      expect(button).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it("renderiza botón de exportar PDF", async () => {
    mockWindowApi({
      getAllocationsByPhase: vi.fn().mockResolvedValue([mockAllocation]),
      getApplicants: vi.fn().mockResolvedValue([]),
      getAllSpots: vi.fn().mockResolvedValue([]),
      generatePDF: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.pdf" }),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
    const Wrapper = createWrapper({
      initialRoute: "/allocations/1",
      user: adminUser,
      currentPhase: 1
    })
    render(
      <Wrapper>
        <AllocationsView phase={1} />
      </Wrapper>
    )
    await waitFor(() => {
      expect(screen.getByText(/Total de otorgamientos: 1/)).toBeInTheDocument()
    })
    const buttons = screen.getAllByRole("button")
    const exportButton = buttons.find(b => b.querySelector("svg") && b.className.includes("bg-[#F1F5F9]"))
    expect(exportButton).toBeInTheDocument()
  })
})
