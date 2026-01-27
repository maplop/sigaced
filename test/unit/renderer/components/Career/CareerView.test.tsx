// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { createWrapper, mockWindowApi } from "../../../../utils/test-utils"
import CareerView from "@renderer/components/Career/CareerView"

const adminUser = { id: 1, name: "A", lastName: "B", username: "u", password: "p", role: "admin" as const, createdAt: "" }

describe("CareerView", () => {
  beforeEach(() => {
    mockWindowApi({ getUserById: vi.fn().mockResolvedValue(adminUser) })
    ;(window as unknown as { api: { getCareers: ReturnType<typeof vi.fn> } }).api.getCareers = vi
      .fn()
      .mockResolvedValue([{ id: 1, fullName: "Informática", abbreviation: "INF", faculty: "F" }])
  })

  it("renderiza el título y el campo de búsqueda", async () => {
    const Wrapper = createWrapper({ initialRoute: "/careers", user: adminUser })
    render(
      <Wrapper>
        <CareerView />
      </Wrapper>
    )
    expect(screen.getByText("Gestionar carreras")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Buscar por carrera...")).toBeInTheDocument()
  })
})
