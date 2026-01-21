import { ElectronAPI } from "@electron-toolkit/preload"
import {
  Applicant,
  Allocation,
  Career,
  Spot,
  Request,
  Location,
  Phase,
  User,
  OperationResult,
  SpotFull,
  AllocationRow,
  CareerClosingRow,
  ApplicantRequestRow,
  DashboardStats,
  TopApplicant,
  TopCareer
} from "src/shared/types"

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      //Reports
      getApplicantsAndRequest: () => Promise<ApplicantRequestRow[]>
      getAssignedApplicantsBySpot: () => Promise<ApplicantRequestRow[]>
      getAssignedApplicantsByLocation: () => Promise<ApplicantRequestRow[]>
      getAssignedApplicantsByCareer: () => Promise<ApplicantRequestRow[]>
      getApplicantsByMunicipality: () => Promise<ApplicantRequestRow[]>
      getCareerClosing: () => Promise<CareerClosingRow[]>

      //PDF
      generatePDF: (payload: {
        subtitle?: string
        table: (string | number | null)[][]
        columnWidths?: (number | string)[]
        columnAlignments?: ("left" | "center" | "right")[]
        saveName?: string
        outputDir?: string
      }) => Promise<{ success: boolean; path?: string; error?: string }>
      createZip: (
        sourceDir: string,
        zipName?: string
      ) => Promise<{ success: boolean; path?: string; error?: string }>
      selectFolder: () => Promise<{
        success: boolean
        path?: string
        canceled?: boolean
        error?: string
      }>

      // Statistics
      getDashboardStats: (phaseId?: number) => Promise<DashboardStats>
      getTopApplicants: (phaseId?: number) => Promise<TopApplicant[]>
      getTopCareers: (phaseId?: number) => Promise<TopCareer[]>
      getInferredCurrentPhase: () => Promise<1 | 2 | 3>
      clearAllTables: () => Promise<OperationResult>

      // Applicants
      addApplicant: (
        applicant: Omit<Applicant, "id">
      ) => Promise<{ success: boolean; id?: number; error?: string }>
      getApplicants: (phaseId: number) => Promise<Applicant[]>
      updateApplicant: (applicant: Applicant) => Promise<OperationResult>
      deleteApplicant: (applicantId: number) => Promise<OperationResult>
      addApplicantToPhase: (applicantId: number, phaseId: number) => Promise<OperationResult>
      deleteAllApplicantsFromPhase: (phaseId: number) => Promise<OperationResult>

      // Allocations
      addAllocation: (allocation: Omit<Allocation, "id">) => Promise<OperationResult>
      getAllAllocations: () => Promise<AllocationRow[]>
      getAllocationsByPhase: (phaseId: number) => Promise<AllocationRow[]>
      updateAllocation: (allocation: Allocation) => Promise<OperationResult>
      deleteAllocationForId: (id: number) => Promise<OperationResult>
      deleteAllAllocationsFromPhase: (phaseId: number) => Promise<OperationResult>
      deleteAllAllocations: () => Promise<OperationResult>

      // Careers
      addCareer: (career: Omit<Career, "id">) => Promise<OperationResult>
      getCareers: () => Promise<Career[]>
      getCareerByName: (name: string) => Promise<Career | null>
      updateCareer: (career: Career) => Promise<OperationResult>
      deleteCareer: (id: number) => Promise<OperationResult>
      deleteAllCareers: () => Promise<OperationResult>

      // Spots
      createSpot: (spotData: Omit<Spot, "id">) => Promise<OperationResult>
      updateSpot: (spotData: Spot) => Promise<OperationResult>
      getAllSpots: (phaseId: number) => Promise<SpotFull[]>
      deleteSpot: (spotId: number) => Promise<OperationResult>
      deleteAllSpotsFromPhase: (phaseId: number) => Promise<OperationResult>

      // Location
      addLocation: (location: Omit<Location, "id">) => Promise<OperationResult>
      getLocations: () => Promise<Location[]>
      getLocationByName: (name: string) => Promise<Location | null>
      updateLocation: (location: Location) => Promise<OperationResult>
      deleteLocation: (id: number) => Promise<OperationResult>
      deleteAllLocations: () => Promise<OperationResult>

      // Phase
      getPhases: () => Promise<Phase[]>

      // Users
      addUser: (user: Omit<User, "id" | "createdAt">) => Promise<OperationResult>
      getUsers: () => Promise<User[]>
      getUserById: (id: number) => Promise<User | null>
      updateUser: (user: Omit<User, "createdAt">) => Promise<OperationResult>
      deleteUser: (id: number) => Promise<OperationResult>
      changeUserPassword: (data: { id: number; newPassword: string }) => Promise<OperationResult>

      // Seed Database
      seedDatabase: (applicantCount?: number) => Promise<{
        success: boolean
        result?: {
          careers: number
          locations: number
          spots: number
          applicants: number
          applicantPhases: number
          requests: number
          errors: string[]
        }
        error?: string
      }>
      clearSeedTables: () => Promise<OperationResult>
      validateSeedData: () => Promise<{
        success: boolean
        validation?: {
          valid: boolean
          errors: string[]
          warnings: string[]
        }
        error?: string
      }>
    }
  }
}
