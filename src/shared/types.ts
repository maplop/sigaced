/* eslint-disable prettier/prettier */
export interface Phase {
  id: number
  name: string
}

export interface Student {
  ci: string
  firstName: string
  firstLastName: string
  secondLastName?: string
  grade: number
  age: number
  gender: 'M' | 'F'
  municipality?: string
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
  id?: number
  careerId: number
  locationId: number
  availableQuantity: number
}

export interface Request {
  id?: number
  studentCi: string
  spotId: number
  order: number // 1 to 3
  phaseId: number
}

export interface Assignment {
  id?: number
  studentCi: string
  spotId: number
  phaseId: number
  assignmentDate?: string // timestamp, optional if just reading
}

export interface User {
  id?: number
  username: string
  password: string
  role: 'admin' | 'viewer'
}
