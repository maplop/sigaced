// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import EditProfile from "@renderer/components/User/Profile/EditProfile"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe("EditProfile", () => {
  const mockUser = { id: 1, name: "Juan", lastName: "Pérez", username: "jperez", password: "hash", role: "admin", createdAt: "2024-01-01" }

  beforeEach(() => {
    mockWindowApi({
      updateUser: vi.fn().mockResolvedValue({ success: true }),
      getUserById: vi.fn().mockResolvedValue(mockUser)
    })
  })

  it("muestra los campos del formulario con los datos del usuario", () => {
    const Wrapper = createWrapper({ user: mockUser })
    render(
      <Wrapper>
        <EditProfile />
      </Wrapper>
    )
    expect(screen.getByDisplayValue("Juan")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Pérez")).toBeInTheDocument()
    expect(screen.getByDisplayValue("jperez")).toBeInTheDocument()
  })

  it("updateUser se llama con los datos correctos al enviar el formulario", async () => {
    const user = userEvent.setup()
    const updateUserMock = vi.fn().mockResolvedValue({ success: true })
    const getUsersMock = vi.fn().mockResolvedValue([mockUser])
    mockWindowApi({
      updateUser: updateUserMock,
      getUsers: getUsersMock,
      getUserById: vi.fn().mockResolvedValue(mockUser)
    })
    const Wrapper = createWrapper({ user: mockUser })
    render(
      <Wrapper>
        <EditProfile />
      </Wrapper>
    )
    const nameInput = screen.getByDisplayValue("Juan")
    await act(async () => {
      await user.clear(nameInput)
      await user.type(nameInput, "María")
    })
    const submitButton = screen.getByRole("button", { name: /Editar/i })
    await act(async () => {
      await user.click(submitButton)
    })
    await waitFor(() => {
      expect(getUsersMock).toHaveBeenCalled()
    }, { timeout: 3000 })
    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: "María",
          lastName: "Pérez",
          username: "jperez",
          password: "hash",
          role: "admin"
        })
      )
    }, { timeout: 5000 })
  })

  it("muestra el selector de rol solo si el usuario es admin", () => {
    const Wrapper = createWrapper({ user: mockUser })
    render(
      <Wrapper>
        <EditProfile />
      </Wrapper>
    )
    expect(screen.getByText("Rol")).toBeInTheDocument()
  })

  it("no muestra el selector de rol si el usuario es viewer", () => {
    const viewerUser = { ...mockUser, role: "viewer" }
    const Wrapper = createWrapper({ user: viewerUser })
    render(
      <Wrapper>
        <EditProfile />
      </Wrapper>
    )
    expect(screen.queryByText("Rol")).not.toBeInTheDocument()
  })
})
