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
  age: number
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
  id: string
  fullName: string
  abbreviation: string
  faculty: string
}

export interface Location {
  id: string
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
  preferenceOrder: number // 1 to 3
}

export interface Assignment {
  id: string
  studentCi: string
  spotPhaseId: number
  assignmentDate?: string // timestamp, optional if just reading
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

// Nuevo: tipo para insertar aspirante con solicitudes
export interface StudentWithRequests {
  ci: string
  name: string
  lastName: string
  grade: number
  age: number
  gender: "M" | "F"
  municipality: string
  currentPhaseId: number
  requests: {
    spotId: number
    phaseId: number
    preferenceOrder: number
  }[]
}

// Nuevo: tipo para insertar una plaza con su cantidad por fase
export interface SpotWithQuantity {
  careerId: number
  locationId: number
  phaseId: number
  availableQuantity: number
}

export interface OperationResult {
  success: boolean
  error?: string
}
