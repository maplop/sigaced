// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AddManualAllocation from "@renderer/components/ManualAllocations/AddManualAllocation"
import { SpotFull, Applicant } from "src/shared/types"
import React from "react"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  const q = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={q}>{children}</QueryClientProvider>
}

const mockApplicants: Applicant[] = [
  {
    id: 1,
    ci: "12345678",
    name: "Juan",
    lastName: "Pérez",
    grade: 95,
    gender: "M",
    municipality: "Santa Clara",
    phaseId: 1,
    requests: []
  }
]

const mockSpots: (SpotFull & { availableQuantityReal: number })[] = [
  {
    spotId: 1,
    careerId: 1,
    careerName: "Informática",
    locationId: 1,
    locationName: "Santa Clara",
    phaseId: 1,
    phaseName: "Fase 1",
    availableQuantity: 5,
    availableQuantityReal: 3
  }
]

function TestComponent() {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <AddManualAllocation
      isDialogOpen={isOpen}
      setIsDialogOpen={setIsOpen}
      applicants={mockApplicants}
      loadingApplicants={false}
      spots={mockSpots}
      loadingSpots={false}
      formData={{ applicantId: null, spotId: null }}
      setFormData={vi.fn()}
      handleSubmit={vi.fn()}
      resetForm={vi.fn()}
    />
  )
}

describe("AddManualAllocation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock scrollIntoView para jsdom
    Element.prototype.scrollIntoView = vi.fn()
  })

  it("abre el diálogo al hacer clic en Otorgar Manualmente", async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    )
    const trigger = screen.getByRole("button", { name: /Otorgar Manualmente/i })
    await user.click(trigger)
    expect(await screen.findByText("Otorgamiento Manual de Plazas")).toBeInTheDocument()
  })

  it("handleSubmit se llama con applicantId y spotId al enviar el formulario", async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn((e) => e.preventDefault())
    render(
      <Wrapper>
        <AddManualAllocation
          isDialogOpen={true}
          setIsDialogOpen={vi.fn()}
          applicants={mockApplicants}
          loadingApplicants={false}
          spots={mockSpots}
          loadingSpots={false}
          formData={{ applicantId: 1, spotId: 1 }}
          setFormData={vi.fn()}
          handleSubmit={handleSubmit}
          resetForm={vi.fn()}
        />
      </Wrapper>
    )
    const submitButton = screen.getByRole("button", { name: /Otorgar/i })
    await user.click(submitButton)
    expect(handleSubmit).toHaveBeenCalled()
  })

  it("muestra aspirantes disponibles en el selector", async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <AddManualAllocation
          isDialogOpen={true}
          setIsDialogOpen={vi.fn()}
          applicants={mockApplicants}
          loadingApplicants={false}
          spots={mockSpots}
          loadingSpots={false}
          formData={{ applicantId: null, spotId: null }}
          setFormData={vi.fn()}
          handleSubmit={vi.fn()}
          resetForm={vi.fn()}
        />
      </Wrapper>
    )
    const comboboxes = screen.getAllByRole("combobox")
    const applicantButton = comboboxes[0] // El primer combobox es el de aspirantes
    await user.click(applicantButton)
    // Esperar a que el Popover se abra y renderice el contenido
    await waitFor(() => {
      expect(screen.getByText("Pérez Juan")).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it("muestra plazas disponibles en el selector", async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <AddManualAllocation
          isDialogOpen={true}
          setIsDialogOpen={vi.fn()}
          applicants={mockApplicants}
          loadingApplicants={false}
          spots={mockSpots}
          loadingSpots={false}
          formData={{ applicantId: null, spotId: null }}
          setFormData={vi.fn()}
          handleSubmit={vi.fn()}
          resetForm={vi.fn()}
        />
      </Wrapper>
    )
    const comboboxes = screen.getAllByRole("combobox")
    const spotButton = comboboxes[1] // El segundo combobox es el de plazas
    await user.click(spotButton)
    // Esperar a que el Popover se abra y renderice el contenido
    await waitFor(() => {
      expect(screen.getByText(/Informática en Santa Clara/)).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})
