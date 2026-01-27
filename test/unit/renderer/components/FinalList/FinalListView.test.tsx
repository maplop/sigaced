// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../utils/test-utils"
import FinalListView from "@renderer/components/FinalList/FinalListView"
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

describe("FinalListView", () => {
  beforeEach(() => {
    mockWindowApi({
      getAllAllocations: vi.fn().mockResolvedValue([mockAllocation]),
      deleteAllAllocations: vi.fn().mockResolvedValue({ success: true }),
      generatePDF: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.pdf" }),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
  })

  it("renderiza título y total de otorgamientos", async () => {
    const Wrapper = createWrapper({
      initialRoute: "/final-list",
      user: adminUser
    })
    render(
      <Wrapper>
        <FinalListView />
      </Wrapper>
    )
    expect(await screen.findByText("Listado Final del Otorgamiento")).toBeInTheDocument()
    expect(await screen.findByText(/Total de otorgamientos: 1/)).toBeInTheDocument()
  })

  it("getAllAllocations se invoca al montar", async () => {
    const getAllAllocations = vi.fn().mockResolvedValue([mockAllocation])
    mockWindowApi({
      getAllAllocations,
      deleteAllAllocations: vi.fn().mockResolvedValue({ success: true }),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
    const Wrapper = createWrapper({
      initialRoute: "/final-list",
      user: adminUser
    })
    render(
      <Wrapper>
        <FinalListView />
      </Wrapper>
    )
    await waitFor(() => {
      expect(getAllAllocations).toHaveBeenCalled()
    })
  })

  it("renderiza el botón Deshacer otorgamiento cuando hay allocations y el usuario es admin", async () => {
    mockWindowApi({
      getAllAllocations: vi.fn().mockResolvedValue([mockAllocation]),
      deleteAllAllocations: vi.fn().mockResolvedValue({ success: true }),
      generatePDF: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.pdf" }),
      getUserById: vi.fn().mockResolvedValue(adminUser)
    })
    const Wrapper = createWrapper({
      initialRoute: "/final-list",
      user: adminUser
    })
    render(
      <Wrapper>
        <FinalListView />
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
})
