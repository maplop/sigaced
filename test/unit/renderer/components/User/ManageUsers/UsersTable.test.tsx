// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import UsersTable from "@renderer/components/User/ManageUsers/UsersTable/UsersTable"
import { User } from "src/shared/types"

vi.mock("@renderer/api/allocation", () => ({
  getAllocationsByPhase: vi.fn().mockResolvedValue([])
}))

const mockUsers: User[] = [
  { id: 1, name: "Juan", lastName: "Pérez", username: "jperez", password: "hash", role: "admin", createdAt: "2024-01-01" },
  { id: 2, name: "María", lastName: "González", username: "mgonzalez", password: "hash", role: "viewer", createdAt: "2024-01-02" }
]

describe("UsersTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWindowApi({ getUserById: vi.fn().mockResolvedValue({ id: 1, username: "jperez" }) })
  })

  it("handleSort se llama al hacer clic en Nombre", async () => {
    const user = userEvent.setup()
    const handleSort = vi.fn()
    const Wrapper = createWrapper({ user: { id: 999, name: "Otro", username: "otro", password: "hash", role: "admin", createdAt: "" } })
    render(
      <Wrapper>
        <UsersTable
          loadingUsers={false}
          paginatedUsers={mockUsers}
          filteredAndSortedUsers={mockUsers}
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
        />
      </Wrapper>
    )
    await user.click(screen.getByText("Nombre"))
    expect(handleSort).toHaveBeenCalledWith("name")
  })

  it("no muestra botones de editar/eliminar para el usuario logueado", () => {
    const loggedUser = mockUsers[0]
    const Wrapper = createWrapper({ user: loggedUser })
    render(
      <Wrapper>
        <UsersTable
          loadingUsers={false}
          paginatedUsers={mockUsers}
          filteredAndSortedUsers={mockUsers}
          currentPage={1}
          totalPages={1}
          setCurrentPage={vi.fn()}
          itemsPerPage={10}
          setItemsPerPage={vi.fn()}
          sortField={null}
          sortDirection="asc"
          handleSort={vi.fn()}
          handleEdit={vi.fn()}
          handleDelete={vi.fn()}
        />
      </Wrapper>
    )
    const rows = within(screen.getByRole("table")).getAllByRole("row")
    const firstDataRow = rows[1]
    const buttons = within(firstDataRow).queryAllByRole("button")
    expect(buttons.length).toBe(0)
  })

  it("handleDelete se llama con el id del usuario al confirmar eliminar", async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()
    const Wrapper = createWrapper({ user: { id: 999, name: "Otro", username: "otro", password: "hash", role: "admin", createdAt: "" } })
    render(
      <Wrapper>
        <UsersTable
          loadingUsers={false}
          paginatedUsers={mockUsers}
          filteredAndSortedUsers={mockUsers}
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
        />
      </Wrapper>
    )
    const rows = within(screen.getByRole("table")).getAllByRole("row")
    const secondDataRow = rows[2]
    const buttons = within(secondDataRow).getAllByRole("button")
    const deleteButton = buttons[buttons.length - 1]
    await user.click(deleteButton)
    const dialog = screen.getByRole("alertdialog")
    const confirmButton = within(dialog).getByRole("button", { name: /Eliminar|Confirmar/i })
    await user.click(confirmButton)
    expect(handleDelete).toHaveBeenCalledWith(2)
  })
})
