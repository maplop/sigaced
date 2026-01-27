// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Routes, Route } from "react-router-dom"
import Register from "@renderer/components/Auth/Register/Register"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import { ROUTES } from "@renderer/routes/routes"
import { toast } from "sonner"

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() }
}))

describe("Register", () => {
  beforeEach(() => {
    mockWindowApi()
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("datos válidos llaman addUser, muestran toast success y navegan a login", async () => {
    const user = userEvent.setup()
    ;(window as unknown as { api: { getUsers: ReturnType<typeof vi.fn>; addUser: ReturnType<typeof vi.fn> } }).api.getUsers = vi.fn().mockResolvedValue([])
    const addUser = vi.fn().mockResolvedValue({ success: true })
    ;(window as unknown as { api: { addUser: ReturnType<typeof vi.fn> } }).api.addUser = addUser
    const Wrapper = createWrapper({ initialRoute: ROUTES.REGISTER })
    render(
      <Wrapper>
        <Routes>
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.LOGIN} element={<div data-testid="login">Login</div>} />
        </Routes>
      </Wrapper>
    )
    await user.type(screen.getByLabelText(/^Nombre$/i), "Ana")
    await user.type(screen.getByLabelText(/^Apellidos$/i), "García")
    await user.type(screen.getByPlaceholderText(/Escribe tu usuario/i), "ana")
    await user.type(screen.getByPlaceholderText(/Escribe tu contraseña/i), "pass123")
    await user.click(screen.getByRole("button", { name: /Crear Cuenta/i }))
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Usuario registrado correctamente.")
    })
    expect(addUser).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByTestId("login")).toBeInTheDocument()
    })
  })

  it("usuario duplicado muestra toast error", async () => {
    const user = userEvent.setup()
    ;(window as unknown as { api: { getUsers: ReturnType<typeof vi.fn> } }).api.getUsers = vi
      .fn()
      .mockResolvedValue([{ id: 1, username: "existente", name: "X", lastName: "X", password: "x", role: "admin" as const, createdAt: "" }])
    const Wrapper = createWrapper({ initialRoute: ROUTES.REGISTER })
    render(
      <Wrapper>
        <Routes>
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Routes>
      </Wrapper>
    )
    await user.type(screen.getByLabelText(/^Nombre$/i), "Ana")
    await user.type(screen.getByLabelText(/^Apellidos$/i), "García")
    await user.type(screen.getByPlaceholderText(/Escribe tu usuario/i), "existente")
    await user.type(screen.getByPlaceholderText(/Escribe tu contraseña/i), "pass123")
    await user.click(screen.getByRole("button", { name: /Crear Cuenta/i }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Nombre de usuario ya está en uso", expect.any(Object))
    })
  })
})
