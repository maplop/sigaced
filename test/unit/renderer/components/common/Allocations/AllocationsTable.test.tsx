// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AllocationsTable from "@renderer/components/common/Allocations/AllocationsTable"
import { AllocationRow } from "src/shared/types"

vi.mock("@renderer/api/allocation", () => ({
  getAllocationsByPhase: vi.fn().mockResolvedValue([])
}))

const mockAllocations: AllocationRow[] = [
  {
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
]

function TableWrapper({ children }: { children: React.ReactNode }) {
  const q = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={q}>{children}</QueryClientProvider>
}

describe("AllocationsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("handleSort se llama al hacer clic en CI", async () => {
    const user = userEvent.setup()
    const handleSort = vi.fn()
    render(
      <TableWrapper>
        <AllocationsTable
          loadingAllocations={false}
          paginatedAllocations={mockAllocations}
          filteredAndSortedAllocations={mockAllocations}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={handleSort}
          phaseId={1}
        />
      </TableWrapper>
    )
    await user.click(screen.getByText("CI"))
    expect(handleSort).toHaveBeenCalledWith("ci")
  })

  it("con phaseId 3 no muestra columna Preferencia Otorgada", () => {
    const handleSort = vi.fn()
    render(
      <TableWrapper>
        <AllocationsTable
          loadingAllocations={false}
          paginatedAllocations={mockAllocations}
          filteredAndSortedAllocations={mockAllocations}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={handleSort}
          phaseId={3}
        />
      </TableWrapper>
    )
    expect(screen.queryByText("Preferencia Otorgada")).not.toBeInTheDocument()
  })

  it("con phaseId 1 muestra columna Preferencia Otorgada", () => {
    const handleSort = vi.fn()
    render(
      <TableWrapper>
        <AllocationsTable
          loadingAllocations={false}
          paginatedAllocations={mockAllocations}
          filteredAndSortedAllocations={mockAllocations}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={handleSort}
          phaseId={1}
        />
      </TableWrapper>
    )
    expect(screen.getByText("Preferencia Otorgada")).toBeInTheDocument()
  })

  it("paginación: Siguiente llama setCurrentPage con página siguiente", async () => {
    const user = userEvent.setup()
    const setCurrentPage = vi.fn()
    render(
      <TableWrapper>
        <AllocationsTable
          loadingAllocations={false}
          paginatedAllocations={mockAllocations}
          filteredAndSortedAllocations={mockAllocations}
          currentPage={1}
          totalPages={2}
          setCurrentPage={setCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={vi.fn()}
          phaseId={1}
        />
      </TableWrapper>
    )
    await user.click(screen.getByText("Siguiente"))
    expect(setCurrentPage).toHaveBeenCalledWith(2)
  })
})
