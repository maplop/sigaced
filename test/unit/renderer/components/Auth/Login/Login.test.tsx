// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Routes, Route } from "react-router-dom"
import Login from "@renderer/components/Auth/Login/Login"
import { createWrapper, mockWindowApi } from "../../../../../utils/test-utils"
import { ROUTES } from "@renderer/routes/routes"
import { hashPassword } from "@renderer/utils/encryption"
import { toast } from "sonner"

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() }
}))

describe("Login", () => {
  beforeEach(() => {
    mockWindowApi()
    localStorage.clear()
    sessionStorage.clear()
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("usuario y contraseña OK navegan a estadísticas y muestran toast success", async () => {
    const user = userEvent.setup()
    ;(window as unknown as { api: { getUsers: ReturnType<typeof vi.fn> } }).api.getUsers = vi
      .fn()
      .mockResolvedValue([
        {
          id: 1,
          username: "u",
          password: hashPassword("p"),
          name: "U",
          lastName: "U",
          role: "admin" as const,
          createdAt: "2024-01-01"
        }
      ])
    const Wrapper = createWrapper({ initialRoute: ROUTES.LOGIN })
    render(
      <Wrapper>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.STATISTICS} element={<div data-testid="stats">Estadísticas</div>} />
        </Routes>
      </Wrapper>
    )
    await user.type(screen.getByLabelText(/Usuario/i), "u")
    await user.type(screen.getByLabelText(/Contraseña/i), "p")
    await user.click(screen.getByRole("button", { name: /Iniciar Sesión/i }))
    await waitFor(() => {
      expect(screen.getByTestId("stats")).toBeInTheDocument()
    })
    expect(toast.success).toHaveBeenCalledWith("Inicio de sesión exitoso.")
  })

  it("credenciales inválidas muestran toast error", async () => {
    const user = userEvent.setup()
    ;(window as unknown as { api: { getUsers: ReturnType<typeof vi.fn> } }).api.getUsers = vi
      .fn()
      .mockResolvedValue([])
    const Wrapper = createWrapper({ initialRoute: ROUTES.LOGIN })
    render(
      <Wrapper>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
        </Routes>
      </Wrapper>
    )
    await user.type(screen.getByLabelText(/Usuario/i), "u")
    await user.type(screen.getByLabelText(/Contraseña/i), "p")
    await user.click(screen.getByRole("button", { name: /Iniciar Sesión/i }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Credenciales incorrectas.",
        expect.any(Object)
      )
    })
  })

  it("Guardar mi sesión guarda en localStorage al hacer login OK", async () => {
    const user = userEvent.setup()
    ;(window as unknown as { api: { getUsers: ReturnType<typeof vi.fn> } }).api.getUsers = vi
      .fn()
      .mockResolvedValue([
        {
          id: 1,
          username: "u",
          password: hashPassword("p"),
          name: "U",
          lastName: "U",
          role: "admin" as const,
          createdAt: "2024-01-01"
        }
      ])
    const Wrapper = createWrapper({ initialRoute: ROUTES.LOGIN })
    render(
      <Wrapper>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.STATISTICS} element={<div data-testid="stats">Estadísticas</div>} />
        </Routes>
      </Wrapper>
    )
    await user.type(screen.getByLabelText(/Usuario/i), "u")
    await user.type(screen.getByLabelText(/Contraseña/i), "p")
    await user.click(screen.getByLabelText(/Guardar mi sesión/i))
    await user.click(screen.getByRole("button", { name: /Iniciar Sesión/i }))
    await waitFor(() => {
      expect(screen.getByTestId("stats")).toBeInTheDocument()
    })
    expect(localStorage.getItem("storedUser")).not.toBeNull()
  })
})
