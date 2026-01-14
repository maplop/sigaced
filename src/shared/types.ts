/* eslint-disable prettier/prettier */
export interface Phase {
  id: number
  name: string
}

export interface Student {
  id: number
  ci: string
  name: string
  lastName: string
  grade: number
  gender: "M" | "F"
  municipality: string
  phaseId: number
  requests?: StudentRequest[]
}

export interface StudentRequest {
  spotId: number
  preferenceOrder: 1 | 2 | 3
}

export interface Career {
  id: number
  fullName: string
  abbreviation: string
  faculty: string
}

export interface Location {
  id: number
  name: string
}

export interface Spot {
  id: number
  careerId?: number
  locationId?: number
  phaseId?: number
  availableQuantity: number
}

export interface SpotFull {
  spotId: number
  careerId: number
  careerName: string
  locationId: number
  locationName: string
  phaseId: number
  phaseName: string
  availableQuantity: number
}

export interface Request {
  id: number
  studentCi: string
  spotPhaseId: number
  preferenceOrder: number
}

export interface Assignment {
  id: number
  studentId: number
  spotId: number
  assignedAt?: string
}

export interface AssignmentRow {
  id: number
  spotId: number
  studentId: number
  ci: string
  lastName: string
  name: string
  career: string
  location: string
  grade: number
  preferenceOrder: 1 | 2 | 3 | null
  phase: number
}

export interface User {
  id: string
  name: string
  lastName: string
  username: string
  password: string
  role: "admin" | "viewer"
  createdAt: string
}

export interface OperationResult {
  success: boolean
  error?: string
}

export interface DashboardStats {
  totalStudents: number
  avgGrade: number
  totalSpots: number
  totalCareers: number
  assignedSpots: number
  remainingSpots: number
}

export interface TopStudent {
  name: string
  lastName: string
  grade: number
  career: string | null
}

export interface TopCareer {
  career: string
  totalSpots: number
  totalRequests?: number
  totalAssignments?: number
}

export interface StudentRequestRow {
  ci: string
  last_name: string
  name: string
  grade: number | null
  career: string
  location: string
  option_number: 1 | 2 | 3
}

export interface CareerClosingRow {
  name: string
  closing_grade: number | null
}
