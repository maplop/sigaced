// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import ManageUsersView from "@renderer/components/User/ManageUsers/ManageUsersView"
import { User } from "src/shared/types"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockUsers: User[] = [
  { id: 1, name: "Juan", lastName: "Pérez", username: "jperez", password: "hash", role: "admin", createdAt: "2024-01-01" }
]

describe("ManageUsersView", () => {
  beforeEach(() => {
    mockWindowApi({
      getUsers: vi.fn().mockResolvedValue(mockUsers),
      addUser: vi.fn().mockResolvedValue({ success: true }),
      updateUser: vi.fn().mockResolvedValue({ success: true }),
      deleteUser: vi.fn().mockResolvedValue({ success: true })
    })
  })

  it("renderiza título y campo de búsqueda", async () => {
    const Wrapper = createWrapper({
      initialRoute: "/manage-users",
      user: { id: 1, name: "A", lastName: "B", username: "u", password: "p", role: "admin", createdAt: "" }
    })
    render(
      <Wrapper>
        <ManageUsersView />
      </Wrapper>
    )
    expect(await screen.findByText("Gestionar usuarios")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Buscar por nombre...")).toBeInTheDocument()
  })

  it("getUsers se invoca al montar", async () => {
    const getUsers = vi.fn().mockResolvedValue(mockUsers)
    mockWindowApi({
      getUsers
    })
    const Wrapper = createWrapper({
      initialRoute: "/manage-users",
      user: { id: 1, name: "A", lastName: "B", username: "u", password: "p", role: "admin", createdAt: "" }
    })
    render(
      <Wrapper>
        <ManageUsersView />
      </Wrapper>
    )
    await waitFor(() => {
      expect(getUsers).toHaveBeenCalled()
    })
  })
})
