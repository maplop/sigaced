// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useAuthContext } from "@renderer/context/AuthContext"
import { createWrapper, mockWindowApi } from "../../../utils/test-utils"
import { hashPassword } from "@renderer/utils/encryption"

function TestLoginAndShow() {
  const { user, login } = useAuthContext()
  return (
    <div>
      <span data-testid="username">{user?.username ?? "none"}</span>
      <button type="button" onClick={() => login("u", hashPassword("p"), false)}>
        Do login
      </button>
    </div>
  )
}

function TestLogout() {
  const { user, logout } = useAuthContext()
  return (
    <div>
      <span data-testid="username">{user?.username ?? "none"}</span>
      <button type="button" onClick={logout}>Logout</button>
    </div>
  )
}

function TestGetUserById() {
  const { user } = useAuthContext()
  return <span data-testid="username">{user?.username ?? "none"}</span>
}

describe("AuthContext", () => {
  beforeEach(() => {
    mockWindowApi()
  })
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it("login deja user en el contexto", async () => {
    const Wrapper = createWrapper({ initialRoute: "/login" })
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
    render(
      <Wrapper>
        <TestLoginAndShow />
      </Wrapper>
    )
    expect(screen.getByTestId("username")).toHaveTextContent("none")
    await userEvent.setup().click(screen.getByRole("button", { name: /Do login/i }))
    await waitFor(() => {
      expect(screen.getByTestId("username")).toHaveTextContent("u")
    })
  })

  it("logout limpia user y storage", async () => {
    const mockUser = {
      id: 1,
      username: "u",
      password: "x",
      name: "U",
      lastName: "U",
      role: "admin" as const,
      createdAt: "2024-01-01"
    }
    const Wrapper = createWrapper({ initialRoute: "/login", user: mockUser })
    render(
      <Wrapper>
        <TestLogout />
      </Wrapper>
    )
    expect(screen.getByTestId("username")).toHaveTextContent("u")
    await userEvent.setup().click(screen.getByRole("button", { name: /Logout/i }))
    expect(screen.getByTestId("username")).toHaveTextContent("none")
    expect(localStorage.getItem("storedUser")).toBeNull()
    expect(sessionStorage.getItem("storedUser")).toBeNull()
  })

  it("getUserById se llama al montar con usuario guardado y si devuelve null se limpia", async () => {
    const mockUser = { id: 1, username: "u", name: "U", lastName: "U", password: "x", role: "admin" as const, createdAt: "" }
    const Wrapper = createWrapper({ initialRoute: "/login", user: mockUser })
    render(
      <Wrapper>
        <TestGetUserById />
      </Wrapper>
    )
    await waitFor(() => {
      expect(screen.getByTestId("username")).toHaveTextContent("none")
    })
    expect((window as unknown as { api: { getUserById: ReturnType<typeof vi.fn> } }).api.getUserById).toHaveBeenCalledWith(1)
    expect(localStorage.getItem("storedUser")).toBeNull()
    expect(sessionStorage.getItem("storedUser")).toBeNull()
  })
})
