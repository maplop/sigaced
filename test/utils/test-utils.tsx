import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import { AuthContextProvider } from "@renderer/context/AuthContext"
import { AllocationPhaseProvider } from "@renderer/context/AllocationPhaseContext"
import { vi } from "vitest"
import type { User } from "src/shared/types"

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })
}

export interface CreateWrapperOptions {
  initialRoute?: string
  user?: User | { id: number; username: string; [k: string]: unknown }
  currentPhase?: 1 | 2 | 3
}

export function createWrapper(opts?: CreateWrapperOptions) {
  const queryClient = createTestQueryClient()
  const initialRoute = opts?.initialRoute ?? "/login"

  function Wrapper({ children }: { children: React.ReactNode }) {
    if (opts?.currentPhase != null) {
      localStorage.setItem("currentPhase", String(opts.currentPhase))
    }
    if (opts?.user != null) {
      sessionStorage.setItem("storedUser", JSON.stringify(opts.user))
    }
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <AuthContextProvider>
            <AllocationPhaseProvider>{children}</AllocationPhaseProvider>
          </AuthContextProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
  return Wrapper
}

type WindowApi = typeof window.api

const defaultMock: Record<string, ReturnType<typeof vi.fn>> = {
  getApplicantsAndRequest: vi.fn().mockResolvedValue([]),
  getAssignedApplicantsBySpot: vi.fn().mockResolvedValue([]),
  getAssignedApplicantsByLocation: vi.fn().mockResolvedValue([]),
  getAssignedApplicantsByCareer: vi.fn().mockResolvedValue([]),
  getApplicantsByMunicipality: vi.fn().mockResolvedValue([]),
  getCareerClosing: vi.fn().mockResolvedValue([]),
  generatePDF: vi.fn().mockResolvedValue({ success: true }),
  createZip: vi.fn().mockResolvedValue({ success: true }),
  selectFolder: vi.fn().mockResolvedValue({ success: true, path: "/tmp" }),
  getDashboardStats: vi.fn().mockResolvedValue({
    totalApplicants: 0,
    avgGrade: 0,
    totalSpots: 0,
    totalCareers: 0,
    allocatedSpots: 0,
    remainingSpots: 0
  }),
  getTopApplicants: vi.fn().mockResolvedValue([]),
  getTopCareers: vi.fn().mockResolvedValue([]),
  getInferredCurrentPhase: vi.fn().mockResolvedValue(1),
  clearAllTables: vi.fn().mockResolvedValue({ success: true }),
  addApplicant: vi.fn().mockResolvedValue({ success: true, id: 1 }),
  getApplicants: vi.fn().mockResolvedValue([]),
  updateApplicant: vi.fn().mockResolvedValue({ success: true }),
  deleteApplicant: vi.fn().mockResolvedValue({ success: true }),
  addApplicantToPhase: vi.fn().mockResolvedValue({ success: true }),
  deleteAllApplicantsFromPhase: vi.fn().mockResolvedValue({ success: true }),
  addAllocation: vi.fn().mockResolvedValue({ success: true }),
  getAllAllocations: vi.fn().mockResolvedValue([]),
  getAllocationsByPhase: vi.fn().mockResolvedValue([]),
  updateAllocation: vi.fn().mockResolvedValue({ success: true }),
  deleteAllocationForId: vi.fn().mockResolvedValue({ success: true }),
  deleteAllAllocationsFromPhase: vi.fn().mockResolvedValue({ success: true }),
  deleteAllAllocations: vi.fn().mockResolvedValue({ success: true }),
  addCareer: vi.fn().mockResolvedValue({ success: true }),
  getCareers: vi.fn().mockResolvedValue([]),
  getCareerByName: vi.fn().mockResolvedValue(null),
  updateCareer: vi.fn().mockResolvedValue({ success: true }),
  deleteCareer: vi.fn().mockResolvedValue({ success: true }),
  deleteAllCareers: vi.fn().mockResolvedValue({ success: true }),
  createSpot: vi.fn().mockResolvedValue({ success: true }),
  updateSpot: vi.fn().mockResolvedValue({ success: true }),
  getAllSpots: vi.fn().mockResolvedValue([]),
  deleteSpot: vi.fn().mockResolvedValue({ success: true }),
  deleteAllSpotsFromPhase: vi.fn().mockResolvedValue({ success: true }),
  addLocation: vi.fn().mockResolvedValue({ success: true }),
  getLocations: vi.fn().mockResolvedValue([]),
  getLocationByName: vi.fn().mockResolvedValue(null),
  updateLocation: vi.fn().mockResolvedValue({ success: true }),
  deleteLocation: vi.fn().mockResolvedValue({ success: true }),
  deleteAllLocations: vi.fn().mockResolvedValue({ success: true }),
  getPhases: vi.fn().mockResolvedValue([]),
  addUser: vi.fn().mockResolvedValue({ success: true }),
  getUsers: vi.fn().mockResolvedValue([]),
  getUserById: vi.fn().mockResolvedValue(null),
  updateUser: vi.fn().mockResolvedValue({ success: true }),
  deleteUser: vi.fn().mockResolvedValue({ success: true }),
  changeUserPassword: vi.fn().mockResolvedValue({ success: true }),
  seedDatabase: vi.fn().mockResolvedValue({ success: true, result: { careers: 0, locations: 0, spots: 0, applicants: 0, applicantPhases: 0, requests: 0, errors: [] } }),
  clearSeedTables: vi.fn().mockResolvedValue({ success: true }),
  validateSeedData: vi.fn().mockResolvedValue({ success: true, validation: { valid: true, errors: [], warnings: [] } })
}

export function mockWindowApi(overrides?: Partial<WindowApi>): WindowApi {
  const api = { ...defaultMock, ...overrides } as unknown as WindowApi
  ;(window as unknown as { api: WindowApi }).api = api
  return api
}

export function renderWithProviders(
  ui: ReactElement,
  opts?: CreateWrapperOptions & { renderOptions?: Omit<RenderOptions, "wrapper"> }
) {
  const { renderOptions, ...wrapperOpts } = opts ?? {}
  const Wrapper = createWrapper(wrapperOpts)
  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions
  })
}

export * from "@testing-library/react"
