// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ApplicantsForm from "@renderer/components/common/Applicants/ApplicantsForm"
import { Applicant, SpotFull } from "src/shared/types"

const mockSpots: SpotFull[] = [
  { spotId: 1, careerId: 1, careerName: "C", locationId: 1, locationName: "L", phaseId: 1, phaseName: "P", availableQuantity: 1 }
]
const baseFormData: Omit<Applicant, "id"> = {
  ci: "",
  name: "",
  lastName: "",
  grade: 0,
  gender: "M",
  municipality: "",
  phaseId: 1,
  requests: []
}

describe("ApplicantsForm", () => {
  it("con phaseId 1 muestra la sección Solicitudes", () => {
    render(
      <ApplicantsForm
        isDialogOpen={true}
        setIsDialogOpen={vi.fn()}
        resetForm={vi.fn()}
        editingApplicant={null}
        handleSubmit={vi.fn()}
        addRequest={vi.fn()}
        updateRequest={vi.fn()}
        removeRequest={vi.fn()}
        formData={baseFormData}
        setFormData={vi.fn()}
        spots={mockSpots}
        loadingSpots={false}
        phaseId={1}
      />
    )
    expect(screen.getByText("Solicitudes")).toBeInTheDocument()
  })

  it("con phaseId 3 no muestra la sección Solicitudes", () => {
    render(
      <ApplicantsForm
        isDialogOpen={true}
        setIsDialogOpen={vi.fn()}
        resetForm={vi.fn()}
        editingApplicant={null}
        handleSubmit={vi.fn()}
        addRequest={vi.fn()}
        updateRequest={vi.fn()}
        removeRequest={vi.fn()}
        formData={baseFormData}
        setFormData={vi.fn()}
        spots={mockSpots}
        loadingSpots={false}
        phaseId={3}
      />
    )
    expect(screen.queryByText("Solicitudes")).not.toBeInTheDocument()
  })

  it("con 3 requests no muestra el botón para añadir más solicitudes", () => {
    render(
      <ApplicantsForm
        isDialogOpen={true}
        setIsDialogOpen={vi.fn()}
        resetForm={vi.fn()}
        editingApplicant={null}
        handleSubmit={vi.fn()}
        addRequest={vi.fn()}
        updateRequest={vi.fn()}
        removeRequest={vi.fn()}
        formData={{ ...baseFormData, requests: [{ spotId: 1, preferenceOrder: 1 }, { spotId: 2, preferenceOrder: 2 }, { spotId: 3, preferenceOrder: 3 }] }}
        setFormData={vi.fn()}
        spots={mockSpots}
        loadingSpots={false}
        phaseId={1}
      />
    )
    const parent = screen.getByText("Solicitudes").parentElement
    expect(within(parent!).queryByRole("button")).toBeNull()
  })

  it("addRequest se llama al hacer clic en el botón añadir solicitud", async () => {
    const user = userEvent.setup()
    const addRequest = vi.fn()
    render(
      <ApplicantsForm
        isDialogOpen={true}
        setIsDialogOpen={vi.fn()}
        resetForm={vi.fn()}
        editingApplicant={null}
        handleSubmit={vi.fn()}
        addRequest={addRequest}
        updateRequest={vi.fn()}
        removeRequest={vi.fn()}
        formData={baseFormData}
        setFormData={vi.fn()}
        spots={mockSpots}
        loadingSpots={false}
        phaseId={1}
      />
    )
    const solicitudesLabel = screen.getByText("Solicitudes")
    const parent = solicitudesLabel.parentElement
    expect(parent).toBeTruthy()
    const btn = within(parent!).getByRole("button")
    await user.click(btn)
    expect(addRequest).toHaveBeenCalled()
  })
})
