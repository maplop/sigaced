import { ElectronAPI } from "@electron-toolkit/preload"
import {
  Student,
  Assignment,
  Career,
  Spot,
  Request,
  Location,
  Phase,
  User,
  OperationResult,
  SpotFull
} from "src/shared/types"

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // Students
      addStudent: (
        student: Omit<Student, "id">
      ) => Promise<{ success: boolean; id?: number; error?: string }>
      getStudents: (phaseId: number) => Promise<Student[]>
      updateStudent: (student: Student) => Promise<{ success: boolean; error?: string }>
      deleteStudentFromPhase: (
        studentId: number,
        phaseId: number
      ) => Promise<{ success: boolean; error?: string }>
      deleteStudentCompletely: (studentId: number) => Promise<{ success: boolean; error?: string }>

      // Assignments
      addAssignment: (assignment: Assignment) => Promise<OperationResult>
      getAssignments: () => Promise<Assignment[]>
      updateAssignment: (assignment: Assignment) => Promise<OperationResult>
      deleteAssignment: (id: string) => Promise<OperationResult>

      // Careers
      addCareer: (career: Omit<Career, "id">) => Promise<OperationResult>
      getCareers: () => Promise<Career[]>
      getCareerByName: (name: string) => Promise<Career | null>
      updateCareer: (career: Career) => Promise<OperationResult>
      deleteCareer: (id: string) => Promise<OperationResult>

      // Spots
      createSpot: (spotData: Omit<Spot, "id">) => Promise<OperationResult>
      updateSpot: (spotData: Spot) => Promise<OperationResult>
      getAllSpots: (phaseId: number) => Promise<SpotFull[]>
      deleteSpot: (spotId: number) => Promise<OperationResult>

      // Requests
      addRequest: (request: Request) => Promise<OperationResult>
      getRequests: () => Promise<Request[]>
      updateRequest: (request: Request) => Promise<OperationResult>
      deleteRequest: (id: number) => Promise<OperationResult>

      // Location
      addLocation: (location: Omit<Location, "id">) => Promise<OperationResult>
      getLocations: () => Promise<Location[]>
      getLocationByName: (name: string) => Promise<Location | null>
      updateLocation: (location: Location) => Promise<OperationResult>
      deleteLocation: (id: string) => Promise<OperationResult>

      // Phase
      getPhases: () => Promise<Phase[]>

      // Users
      addUser: (user: Omit<User, "id" | "createdAt">) => Promise<OperationResult>
      getUsers: () => Promise<User[]>
      getUserById: (id: string) => Promise<User | null>
      updateUser: (user: Omit<User, "createdAt">) => Promise<OperationResult>
      deleteUser: (id: string) => Promise<OperationResult>
      changeUserPassword: (data: { id: string; newPassword: string }) => Promise<OperationResult>
    }
  }
}
