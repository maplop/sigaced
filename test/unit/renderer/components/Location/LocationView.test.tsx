// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../utils/test-utils"
import LocationView from "@renderer/components/Location/LocationView"

const adminUser = { id: 1, name: "A", lastName: "B", username: "u", password: "p", role: "admin" as const, createdAt: "" }

describe("LocationView", () => {
  beforeEach(() => {
    mockWindowApi({ getUserById: vi.fn().mockResolvedValue(adminUser) })
    ;(window as unknown as { api: { getLocations: ReturnType<typeof vi.fn> } }).api.getLocations = vi
      .fn()
      .mockResolvedValue([{ id: 1, name: "Santa Clara" }])
  })

  it("renderiza el título y el campo de búsqueda", async () => {
    const Wrapper = createWrapper({ initialRoute: "/location", user: adminUser })
    render(
      <Wrapper>
        <LocationView />
      </Wrapper>
    )
    expect(screen.getByText("Gestionar ubicaciones")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Buscar por nombre...")).toBeInTheDocument()
  })
})
