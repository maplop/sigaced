// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import ChangePassword from "@renderer/components/User/Profile/ChangePassword"
import { hashPassword } from "@renderer/utils/encryption"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe("ChangePassword", () => {
  const mockUser = { id: 1, name: "Juan", lastName: "Pérez", username: "jperez", password: hashPassword("oldpass"), role: "admin", createdAt: "2024-01-01" }

  beforeEach(() => {
    mockWindowApi({
      getUsers: vi.fn().mockResolvedValue([mockUser]),
      changeUserPassword: vi.fn().mockResolvedValue({ success: true }),
      getUserById: vi.fn().mockResolvedValue(mockUser)
    })
  })

  it("muestra los campos de contraseña", () => {
    const Wrapper = createWrapper({ user: mockUser })
    render(
      <Wrapper>
        <ChangePassword />
      </Wrapper>
    )
    expect(screen.getByPlaceholderText("Escribe tu contraseña actual")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Escribe tu nueva contraseña")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Confirma tu nueva contraseña")).toBeInTheDocument()
  })

  it("muestra error cuando la contraseña actual es incorrecta", async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper({ user: mockUser })
    render(
      <Wrapper>
        <ChangePassword />
      </Wrapper>
    )
    const currentPasswordInput = screen.getByPlaceholderText("Escribe tu contraseña actual")
    await user.type(currentPasswordInput, "wrongpass")
    await waitFor(() => {
      expect(screen.getByText("La contraseña actual es incorrecta")).toBeInTheDocument()
    })
  })

  it("changeUserPassword se llama con la nueva contraseña cuando los datos son válidos", async () => {
    const user = userEvent.setup()
    const changeUserPasswordMock = vi.fn().mockResolvedValue({ success: true })
    mockWindowApi({
      getUsers: vi.fn().mockResolvedValue([mockUser]),
      changeUserPassword: changeUserPasswordMock,
      getUserById: vi.fn().mockResolvedValue(mockUser)
    })
    const Wrapper = createWrapper({ user: mockUser })
    render(
      <Wrapper>
        <ChangePassword />
      </Wrapper>
    )
    const currentPasswordInput = screen.getByPlaceholderText("Escribe tu contraseña actual")
    const newPasswordInput = screen.getByPlaceholderText("Escribe tu nueva contraseña")
    const confirmPasswordInput = screen.getByPlaceholderText("Confirma tu nueva contraseña")
    
    await act(async () => {
      await user.type(currentPasswordInput, "oldpass")
    })
    await act(async () => {
      await user.type(newPasswordInput, "newpass123")
    })
    await act(async () => {
      await user.type(confirmPasswordInput, "newpass123")
    })
    
    // Esperar a que la validación se complete y el botón se habilite
    await waitFor(() => {
      const btn = screen.getByRole("button", { name: /Cambiar contraseña/i })
      expect(btn).not.toBeDisabled()
    }, { timeout: 5000 })
    const submitButton = screen.getByRole("button", { name: /Cambiar contraseña/i })
    
    await act(async () => {
      await user.click(submitButton)
    })
    
    await waitFor(() => {
      expect(changeUserPasswordMock).toHaveBeenCalledWith({ id: 1, newPassword: hashPassword("newpass123") })
    }, { timeout: 5000 })
  })
})
