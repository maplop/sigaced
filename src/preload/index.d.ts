import { ElectronAPI } from "@electron-toolkit/preload"
import {
  Student,
  StudentWithRequests,
  Assignment,
  Career,
  Spot,
  Request,
  Location,
  Phase,
  User,
  OperationResult
} from "src/shared/types"

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // Students
      addStudent: (student: Student) => Promise<OperationResult>
      getStudents: () => Promise<Student[]>
      getStudentByCI: (ci: string) => Promise<Student | null>
      updateStudent: (student: Student) => Promise<OperationResult>
      deleteStudent: (ci: string) => Promise<OperationResult>
      addStudentWithRequests: (data: StudentWithRequests) => Promise<OperationResult>

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
      addSpot: (spot: Omit<Spot, "id">) => Promise<OperationResult>
      getSpots: () => Promise<Spot[]>
      updateSpot: (spot: Spot) => Promise<OperationResult>
      deleteSpot: (id: string) => Promise<OperationResult>
      addSpotWithQuantity: (spotData: any) => Promise<OperationResult>

      // SpotPhase
      addSpotPhase: (spotPhase: SpotPhase) => Promise<OperationResult>
      getSpotPhases: () => Promise<SpotPhase[]>
      getSpotPhase: (spotId: number, phaseId: number) => Promise<SpotPhase | null>
      updateSpotPhase: (spotPhase: SpotPhase) => Promise<OperationResult>
      deleteSpotPhase: (spotId: number, phaseId: number) => Promise<OperationResult>

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
