// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import SpotTable from "@renderer/components/common/Spot/SpotTable"
import { SpotFull } from "src/shared/types"

vi.mock("@renderer/api/allocation", () => ({
  getAllocationsByPhase: vi.fn().mockResolvedValue([])
}))

const mockSpots: SpotFull[] = [
  { spotId: 1, careerId: 1, careerName: "Informática", locationId: 1, locationName: "Santa Clara", phaseId: 1, phaseName: "P1", availableQuantity: 5 }
]

function TableWrapper({ children }: { children: React.ReactNode }) {
  const q = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={q}>{children}</QueryClientProvider>
}

describe("SpotTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("handleSort se llama al hacer clic en Carrera", async () => {
    const user = userEvent.setup()
    const handleSort = vi.fn()
    render(
      <TableWrapper>
        <SpotTable
          loadingSpots={false}
          paginatedSpots={mockSpots}
          filteredAndSortedSpots={mockSpots}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={handleSort}
          handleEdit={vi.fn()}
          handleDelete={vi.fn()}
          phaseId={1}
        />
      </TableWrapper>
    )
    await user.click(screen.getByText("Carrera"))
    expect(handleSort).toHaveBeenCalledWith("careerName")
  })

  it("handleDelete se llama con spotId al confirmar eliminar", async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()
    render(
      <TableWrapper>
        <SpotTable
          loadingSpots={false}
          paginatedSpots={mockSpots}
          filteredAndSortedSpots={mockSpots}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={vi.fn()}
          handleEdit={vi.fn()}
          handleDelete={handleDelete}
          phaseId={1}
        />
      </TableWrapper>
    )
    const rows = within(screen.getByRole("table")).getAllByRole("row")
    const row = rows[1]
    const buttons = within(row).getAllByRole("button")
    await user.click(buttons[buttons.length - 1])
    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: /Eliminar/i }))
    expect(handleDelete).toHaveBeenCalledWith(1)
  })
})
