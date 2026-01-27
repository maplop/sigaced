// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, within, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import Details from "@renderer/components/User/Profile/Details"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe("Details", () => {
  const mockUser = { id: 1, name: "Juan", lastName: "Pérez", username: "jperez", password: "hash", role: "admin", createdAt: "2024-01-01" }

  beforeEach(() => {
    mockWindowApi({
      deleteUser: vi.fn().mockResolvedValue({ success: true }),
      getUserById: vi.fn().mockResolvedValue(mockUser)
    })
  })

  it("muestra los datos del usuario", () => {
    const Wrapper = createWrapper({ user: mockUser })
    render(
      <Wrapper>
        <Details />
      </Wrapper>
    )
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument()
    expect(screen.getByText("jperez")).toBeInTheDocument()
    expect(screen.getByText("Administrador")).toBeInTheDocument()
  })

  it("deleteUser se llama al confirmar eliminar cuenta", async () => {
    const user = userEvent.setup()
    const deleteUserMock = vi.fn().mockResolvedValue({ success: true })
    mockWindowApi({
      deleteUser: deleteUserMock,
      getUserById: vi.fn().mockResolvedValue(mockUser)
    })
    const Wrapper = createWrapper({ user: mockUser })
    render(
      <Wrapper>
        <Details />
      </Wrapper>
    )
    const eliminarButton = screen.getByText("Eliminar cuenta")
    await act(async () => {
      await user.click(eliminarButton)
    })
    const dialog = await screen.findByRole("alertdialog")
    const confirmButton = within(dialog).getByRole("button", { name: /Eliminar/i })
    await act(async () => {
      await user.click(confirmButton)
    })
    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalledWith(1)
    }, { timeout: 10000 })
  })
})
