// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import SpotView from "@renderer/components/common/Spot/SpotView"

const mockSpot = {
  spotId: 1,
  careerId: 1,
  careerName: "Informática",
  locationId: 1,
  locationName: "Santa Clara",
  phaseId: 1,
  phaseName: "Fase 1",
  availableQuantity: 5
}

describe("SpotView", () => {
  beforeEach(() => {
    mockWindowApi({
      getAllSpots: vi.fn().mockResolvedValue([mockSpot]),
      getCareers: vi.fn().mockResolvedValue([{ id: 1, fullName: "Inf", abbreviation: "I", faculty: "F" }]),
      getLocations: vi.fn().mockResolvedValue([{ id: 1, name: "Santa Clara" }])
    })
  })

  it("renderiza total de registros, plazas disponibles y búsqueda por fase", async () => {
    const Wrapper = createWrapper({
      initialRoute: "/spot/1",
      user: { id: 1, name: "A", lastName: "B", username: "u", password: "p", role: "admin", createdAt: "" }
    })
    render(
      <Wrapper>
        <SpotView phase={1} />
      </Wrapper>
    )
    expect(await screen.findByText(/Total de registros: 1/)).toBeInTheDocument()
    expect(screen.getByText(/Plazas disponibles: 5/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Buscar por carrera o ubicación...")).toBeInTheDocument()
  })

  it("getAllSpots se invoca con el phaseId de la vista", async () => {
    const getAllSpots = vi.fn().mockResolvedValue([mockSpot])
    mockWindowApi({
      getAllSpots,
      getCareers: vi.fn().mockResolvedValue([]),
      getLocations: vi.fn().mockResolvedValue([])
    })
    const Wrapper = createWrapper({
      initialRoute: "/spot/2",
      user: { id: 1, name: "A", lastName: "B", username: "u", password: "p", role: "admin", createdAt: "" }
    })
    render(
      <Wrapper>
        <SpotView phase={2} />
      </Wrapper>
    )
    await waitFor(() => {
      expect(getAllSpots).toHaveBeenCalledWith(2)
    })
  })
})
