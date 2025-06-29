import { ElectronAPI } from '@electron-toolkit/preload'
import { Student, Assignment, Career, Spot, Request, Location, Phase } from 'src/shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // Students
      addStudent: (student: Student) => Promise<void>
      getStudents: () => Promise<Student[]>
      getStudentByCI: (ci: string) => Promise<Student | undefined>
      updateStudent: (student: Student) => Promise<void>
      deleteStudent: (ci: string) => Promise<void>

      // Assignments
      addAssignment: (assignment: Assignment) => Promise<void>
      getAssignments: () => Promise<Assignment[]>
      updateAssignment: (assignment: Assignment) => Promise<void>
      deleteAssignment: (id: number) => Promise<void>

      // Careers
      addCareer: (career: Career) => Promise<void>
      getCareers: () => Promise<Career[]>
      getCareerByName: (name: string) => Promise<Career | undefined>
      updateCareer: (career: Career) => Promise<void>
      deleteCareer: (id: number) => Promise<void>

      // Spots
      addSpot: (spot: Spot) => Promise<void>
      getSpots: () => Promise<Spot[]>
      updateSpot: (spot: Spot) => Promise<void>
      deleteSpot: (id: number) => Promise<void>

      // Requests
      addRequest: (request: Request) => Promise<void>
      getRequests: () => Promise<Request[]>
      updateRequest: (request: Request) => Promise<void>
      deleteRequest: (id: number) => Promise<void>

      // Loacation
      addLocation: (location: Location) => Promise<void>
      getLocations: () => Promise<Location[]>
      getLocationByName: (name: string) => Promise<Location | undefined>
      updateLocation: (location: Location) => Promise<void>
      deleteLocation: (id: number) => Promise<void>

      // Phase
      getPhases: () => Promise<Phase[]>

      // Users
      addUser: (user: User) => Promise<void>
      getUsers: () => Promise<User[]>
      getUserByUsername: (username: string) => Promise<User | undefined>
      updateUser: (user: User) => Promise<void>
      deleteUser: (id: number) => Promise<void>
      changeUserPassword: (data: { id: number; newPassword: string }) => Promise<void>
    }
  }
}
