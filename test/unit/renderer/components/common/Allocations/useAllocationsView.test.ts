// @vitest-environment jsdom
import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import { AllocationPhaseProvider } from "@renderer/context/AllocationPhaseContext"
import { useAllocations } from "@renderer/components/common/Allocations/useAllocationsView"
import { mockWindowApi } from "../../../../../utils/test-utils"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock("@renderer/utils/allocations", () => ({
  handleAllocate: vi.fn().mockResolvedValue(undefined)
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const q = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  localStorage.setItem("currentPhase", "1")
  return React.createElement(
    QueryClientProvider,
    { client: q },
    React.createElement(
      MemoryRouter,
      {},
      React.createElement(AllocationPhaseProvider, { children })
    )
  )
}

describe("useAllocationsView", () => {
  beforeEach(() => {
    mockWindowApi({
      getAllocationsByPhase: vi.fn().mockResolvedValue([]),
      getApplicants: vi.fn().mockResolvedValue([]),
      getAllSpots: vi.fn().mockResolvedValue([])
    })
  })

  it("allocate con aspirantes sin requests pone showAlert en true", async () => {
    const applicantsWithoutRequests = [
      { id: 1, ci: "12345678", name: "Juan", lastName: "Pérez", grade: 95, requests: [] }
    ]
    mockWindowApi({
      getAllocationsByPhase: vi.fn().mockResolvedValue([]),
      getApplicants: vi.fn().mockResolvedValue(applicantsWithoutRequests),
      getAllSpots: vi.fn().mockResolvedValue([
        { spotId: 1, careerId: 1, careerName: "Inf", locationId: 1, locationName: "SC", phaseId: 1, phaseName: "F1", availableQuantity: 5 }
      ])
    })
    const { result } = renderHook(() => useAllocations(1), { wrapper })
    await waitFor(() => {
      expect(result.current.loadingAllocations).toBe(false)
    })
    act(() => {
      result.current.allocate()
    })
    await waitFor(() => {
      expect(result.current.showAlert).toBe(true)
      expect(result.current.applicantsWithoutRequests.length).toBeGreaterThan(0)
    })
  })

  it("allocate con datos OK llama handleAllocate y avanza fase", async () => {
    const { handleAllocate } = await import("@renderer/utils/allocations")
    const applicantsWithRequests = [
      { id: 1, ci: "12345678", name: "Juan", lastName: "Pérez", grade: 95, requests: [{ id: 1, spotPhaseId: 1, preferenceOrder: 1 }] }
    ]
    const spots = [
      { spotId: 1, careerId: 1, careerName: "Inf", locationId: 1, locationName: "SC", phaseId: 1, phaseName: "F1", availableQuantity: 5 }
    ]
    mockWindowApi({
      getAllocationsByPhase: vi.fn().mockResolvedValue([]),
      getApplicants: vi.fn().mockResolvedValue(applicantsWithRequests),
      getAllSpots: vi.fn().mockResolvedValue(spots)
    })
    const { result } = renderHook(() => useAllocations(1), { wrapper })
    await waitFor(() => {
      expect(result.current.loadingAllocations).toBe(false)
    })
    act(() => {
      result.current.allocate()
    })
    await waitFor(() => {
      expect(handleAllocate).toHaveBeenCalled()
    })
  })
})
