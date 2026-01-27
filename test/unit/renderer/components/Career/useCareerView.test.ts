// @vitest-environment jsdom
import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useCareerView } from "@renderer/components/Career/useCareerView"
import { mockWindowApi } from "../../../../utils/test-utils"

function wrapper({ children }: { children: React.ReactNode }) {
  const q = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return React.createElement(QueryClientProvider, { client: q }, children)
}

describe("useCareerView", () => {
  beforeEach(() => {
    mockWindowApi()
    ;(window as unknown as { api: { getCareers: ReturnType<typeof vi.fn>; deleteCareer: ReturnType<typeof vi.fn> } }).api.getCareers = vi.fn().mockResolvedValue([{ id: 1, fullName: "C", abbreviation: "C", faculty: "F" }])
    ;(window as unknown as { api: { deleteCareer: ReturnType<typeof vi.fn> } }).api.deleteCareer = vi.fn().mockResolvedValue({ success: true })
  })

  it("handleDelete llama a deleteCareer con el id", async () => {
    const { result } = renderHook(() => useCareerView(), { wrapper })
    const api = (window as unknown as { api: { deleteCareer: ReturnType<typeof vi.fn> } }).api
    result.current.handleDelete(1)
    await waitFor(() => {
      expect(api.deleteCareer).toHaveBeenCalledWith(1)
    })
  })

  it("handleSort actualiza sortField y sortDirection", async () => {
    const { result } = renderHook(() => useCareerView(), { wrapper })
    expect(result.current.sortField).toBeNull()
    act(() => {
      result.current.handleSort("fullName")
    })
    await waitFor(() => {
      expect(result.current.sortField).toBe("fullName")
      expect(result.current.sortDirection).toBe("asc")
    })
  })
})
