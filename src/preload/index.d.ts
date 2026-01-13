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
  SpotFull,
  AssignmentRow,
  CareerClosingRow,
  StudentRequestRow
} from "src/shared/types"

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      //Reports
      getStudentsAndRequest: () => Promise<StudentRequestRow[]>
      getAssignedStudentsBySpot: () => Promise<StudentRequestRow[]>
      getAssignedStudentsByLocation: () => Promise<Student[]>
      getAssignedStudentsByCareer: () => Promise<Student[]>
      getStudentsByMunicipality: () => Promise<Student[]>
      getCareerClosing: () => Promise<CareerClosingRow[]>

      //PDF
      generatePDF: (payload: {
        subtitle?: string
        table: (string | number | null)[][]
        columnWidths?: (number | string)[]
        columnAlignments?: ("left" | "center" | "right")[]
        saveName?: string
      }) => Promise<{ success: boolean; path?: string; error?: string }>

      // Statistics
      getDashboardStats: (phaseId?: number) => Promise<DashboardStats>
      getTopStudents: (phaseId?: number) => Promise<TopStudent[]>
      getTopCareers: (phaseId?: number) => Promise<TopCareer[]>
      clearAllTables: () => Promise<OperationResult>

      // Students
      addStudent: (
        student: Omit<Student, "id">
      ) => Promise<{ success: boolean; id?: number; error?: string }>
      getStudents: (phaseId: number) => Promise<Student[]>
      updateStudent: (student: Student) => Promise<OperationResult>
      deleteStudent: (studentId: number) => Promise<OperationResult>
      addStudentToPhase: (studentId: number, phaseId: number) => Promise<OperationResult>
      deleteAllStudentsFromPhase: (phaseId: number) => Promise<OperationResult>

      // Assignments
      addAssignment: (assignment: Omit<Assignment, "id">) => Promise<OperationResult>
      getAssignments: () => Promise<AssignmentRow[]>
      getAssignmentsByPhase: (phaseId: number) => Promise<AssignmentRow[]>
      updateAssignment: (assignment: Assignment) => Promise<OperationResult>
      deleteAssignmentForId: (id: number) => Promise<OperationResult>
      deleteAllAssignmentsFromPhase: (phaseId: number) => Promise<OperationResult>
      deleteAllAssignments: () => Promise<OperationResult>

      // Careers
      addCareer: (career: Omit<Career, "id">) => Promise<OperationResult>
      getCareers: () => Promise<Career[]>
      getCareerByName: (name: string) => Promise<Career | null>
      updateCareer: (career: Career) => Promise<OperationResult>
      deleteCareer: (id: string) => Promise<OperationResult>
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
      deleteLocation: (id: string) => Promise<OperationResult>
      deleteAllLocations: () => Promise<OperationResult>

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
