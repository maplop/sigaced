// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../utils/test-utils"
import ReportsView from "@renderer/components/Reports/ReportsView"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}))

describe("ReportsView", () => {
  beforeEach(() => {
    mockWindowApi({
      getAssignedApplicantsBySpot: vi.fn().mockResolvedValue([]),
      getAssignedApplicantsByCareer: vi.fn().mockResolvedValue([]),
      getAssignedApplicantsByLocation: vi.fn().mockResolvedValue([]),
      getApplicantsByMunicipality: vi.fn().mockResolvedValue([]),
      getCareerClosing: vi.fn().mockResolvedValue([]),
      getApplicantsAndRequest: vi.fn().mockResolvedValue([]),
      selectFolder: vi.fn().mockResolvedValue({ success: true, path: "/tmp" }),
      generatePDF: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.pdf" }),
      createZip: vi.fn().mockResolvedValue({ success: true, path: "/tmp/test.zip" })
    })
  })

  it("renderiza el título y todos los ReportCards", async () => {
    const Wrapper = createWrapper({
      initialRoute: "/reports",
      user: {
        id: 1,
        name: "A",
        lastName: "B",
        username: "u",
        password: "p",
        role: "admin",
        createdAt: ""
      }
    })
    render(
      <Wrapper>
        <ReportsView />
      </Wrapper>
    )
    expect(await screen.findByText("Centro de Reportes")).toBeInTheDocument()
    expect(screen.getByText("Aspirantes y Solicitudes")).toBeInTheDocument()
    expect(screen.getByText("Aspirantes por Ubicación")).toBeInTheDocument()
    expect(screen.getByText("Aspirantes por Carrera")).toBeInTheDocument()
    expect(screen.getByText("Aspirantes por Plaza")).toBeInTheDocument()
    expect(screen.getByText("Aspirantes por Municipios")).toBeInTheDocument()
    expect(screen.getByText("Nota de Corte")).toBeInTheDocument()
  })

  it("getApplicantsAndRequest se invoca al montar", async () => {
    const getApplicantsAndRequest = vi.fn().mockResolvedValue([])
    mockWindowApi({
      getApplicantsAndRequest,
      getAssignedApplicantsBySpot: vi.fn().mockResolvedValue([]),
      getAssignedApplicantsByCareer: vi.fn().mockResolvedValue([]),
      getAssignedApplicantsByLocation: vi.fn().mockResolvedValue([]),
      getApplicantsByMunicipality: vi.fn().mockResolvedValue([]),
      getCareerClosing: vi.fn().mockResolvedValue([])
    })
    const Wrapper = createWrapper({
      initialRoute: "/reports",
      user: {
        id: 1,
        name: "A",
        lastName: "B",
        username: "u",
        password: "p",
        role: "admin",
        createdAt: ""
      }
    })
    render(
      <Wrapper>
        <ReportsView />
      </Wrapper>
    )
    await waitFor(() => {
      expect(getApplicantsAndRequest).toHaveBeenCalled()
    })
  })
})
