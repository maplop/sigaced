/* eslint-disable prettier/prettier */
export interface Phase {
  id: number
  name: string
}

export interface Applicant {
  id: number
  ci: string
  name: string
  lastName: string
  grade: number
  gender: "M" | "F"
  municipality: string
  phaseId: number
  requests?: ApplicantRequest[]
}

export interface ApplicantRequest {
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
  applicantCi: string
  spotPhaseId: number
  preferenceOrder: number
}

export interface Allocation {
  id: number
  applicantId: number
  spotId: number
  allocatedAt?: string
}

export interface AllocationRow {
  id: number
  spotId: number
  applicantId: number
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
  totalApplicants: number
  avgGrade: number
  totalSpots: number
  totalCareers: number
  allocatedSpots: number
  remainingSpots: number
}

export interface TopApplicant {
  name: string
  lastName: string
  grade: number
  career: string | null
}

export interface TopCareer {
  career: string
  totalSpots: number
  totalRequests?: number
  totalAllocations?: number
}

export interface ApplicantRequestRow {
  ci: string
  lastName: string
  name: string
  grade: number | null
  career: string
  location: string
  phase: number
  preferenceOrder: 1 | 2 | 3
}

export interface CareerClosingRow {
  name: string
  closing_grade: number | null
}
