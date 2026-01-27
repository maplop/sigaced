// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ApplicantsTable from "@renderer/components/common/Applicants/ApplicantsTable"
import { Applicant, SpotFull } from "src/shared/types"

vi.mock("@renderer/api/allocation", () => ({
  getAllocationsByPhase: vi.fn().mockResolvedValue([])
}))

const mockApplicants: Applicant[] = [
  {
    id: 1,
    ci: "12345678901",
    name: "Ana",
    lastName: "García",
    grade: 85,
    gender: "F",
    municipality: "Santa Clara",
    phaseId: 1,
    requests: [{ spotId: 1, preferenceOrder: 1 }]
  }
]
const mockSpots: SpotFull[] = [
  { spotId: 1, careerId: 1, careerName: "C", locationId: 1, locationName: "L", phaseId: 1, phaseName: "P", availableQuantity: 1 }
]

function TableWrapper({ children }: { children: React.ReactNode }) {
  const q = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={q}>{children}</QueryClientProvider>
}

describe("ApplicantsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("al hacer clic en Solicitudes se llama handleSort con requestsCount", async () => {
    const user = userEvent.setup()
    const handleSort = vi.fn()
    render(
      <TableWrapper>
        <ApplicantsTable
          loadingApplicants={false}
          filteredAndSortedApplicants={mockApplicants}
          paginatedApplicants={mockApplicants}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={handleSort}
          handleEdit={vi.fn()}
          handleDeleteApplicant={vi.fn()}
          spots={mockSpots}
          loadingSpots={false}
          phaseId={1}
        />
      </TableWrapper>
    )
    await user.click(screen.getByText("Solicitudes"))
    expect(handleSort).toHaveBeenCalledWith("requestsCount")
  })

  it("con phaseId 3 muestra columna Estado", () => {
    render(
      <TableWrapper>
        <ApplicantsTable
          loadingApplicants={false}
          filteredAndSortedApplicants={mockApplicants}
          paginatedApplicants={mockApplicants}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={vi.fn()}
          handleEdit={vi.fn()}
          handleDeleteApplicant={vi.fn()}
          spots={mockSpots}
          loadingSpots={false}
          phaseId={3}
        />
      </TableWrapper>
    )
    expect(screen.getByText("Estado")).toBeInTheDocument()
  })

  it("con phaseId 1 muestra columna Solicitudes", () => {
    render(
      <TableWrapper>
        <ApplicantsTable
          loadingApplicants={false}
          filteredAndSortedApplicants={mockApplicants}
          paginatedApplicants={mockApplicants}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={vi.fn()}
          handleEdit={vi.fn()}
          handleDeleteApplicant={vi.fn()}
          spots={mockSpots}
          loadingSpots={false}
          phaseId={1}
        />
      </TableWrapper>
    )
    expect(screen.getByText("Solicitudes")).toBeInTheDocument()
  })

  it("paginación: Siguiente llama setCurrentPage", async () => {
    const user = userEvent.setup()
    const setCurrentPage = vi.fn()
    render(
      <TableWrapper>
        <ApplicantsTable
          loadingApplicants={false}
          filteredAndSortedApplicants={mockApplicants}
          paginatedApplicants={mockApplicants}
          currentPage={1}
          totalPages={2}
          setCurrentPage={setCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={vi.fn()}
          handleEdit={vi.fn()}
          handleDeleteApplicant={vi.fn()}
          spots={mockSpots}
          loadingSpots={false}
          phaseId={1}
        />
      </TableWrapper>
    )
    await user.click(screen.getByRole("button", { name: /Siguiente/i }))
    expect(setCurrentPage).toHaveBeenCalledWith(2)
  })

  it("eliminar abre ConfirmDeleteDialog y al confirmar llama handleDeleteApplicant", async () => {
    const user = userEvent.setup()
    const handleDeleteApplicant = vi.fn()
    render(
      <TableWrapper>
        <ApplicantsTable
          loadingApplicants={false}
          filteredAndSortedApplicants={mockApplicants}
          paginatedApplicants={mockApplicants}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={vi.fn()}
          handleEdit={vi.fn()}
          handleDeleteApplicant={handleDeleteApplicant}
          spots={mockSpots}
          loadingSpots={false}
          phaseId={1}
        />
      </TableWrapper>
    )
    const rows = within(screen.getByRole("table")).getAllByRole("row")
    const row = rows[1]
    const buttons = within(row).getAllByRole("button")
    const deleteBtn = buttons[buttons.length - 1]
    await user.click(deleteBtn)
    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: /Eliminar/i }))
    expect(handleDeleteApplicant).toHaveBeenCalledWith(1)
  })
})
