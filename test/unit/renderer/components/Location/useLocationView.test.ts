// @vitest-environment jsdom
import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useLocationView } from "@renderer/components/Location/useLocationView"
import { mockWindowApi } from "../../../../utils/test-utils"

function wrapper({ children }: { children: React.ReactNode }) {
  const q = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return React.createElement(QueryClientProvider, { client: q }, children)
}

describe("useLocationView", () => {
  beforeEach(() => {
    mockWindowApi()
    ;(window as unknown as { api: { getLocations: ReturnType<typeof vi.fn>; deleteLocation: ReturnType<typeof vi.fn> } }).api.getLocations = vi.fn().mockResolvedValue([{ id: 1, name: "L1" }])
    ;(window as unknown as { api: { deleteLocation: ReturnType<typeof vi.fn> } }).api.deleteLocation = vi.fn().mockResolvedValue({ success: true })
  })

  it("handleDelete llama a deleteLocation con el id", async () => {
    const { result } = renderHook(() => useLocationView(), { wrapper })
    const api = (window as unknown as { api: { deleteLocation: ReturnType<typeof vi.fn> } }).api
    result.current.handleDelete(1)
    await waitFor(() => {
      expect(api.deleteLocation).toHaveBeenCalledWith(1)
    })
  })

  it("handleSort actualiza sortField y sortDirection", async () => {
    const { result } = renderHook(() => useLocationView(), { wrapper })
    expect(result.current.sortField).toBeNull()
    act(() => {
      result.current.handleSort("name")
    })
    await waitFor(() => {
      expect(result.current.sortField).toBe("name")
      expect(result.current.sortDirection).toBe("asc")
    })
    act(() => {
      result.current.handleSort("name")
    })
    await waitFor(() => {
      expect(result.current.sortDirection).toBe("desc")
    })
  })
})
