import { contextBridge } from "electron"
import { electronAPI } from "@electron-toolkit/preload"
import { ipcRenderer } from "electron"
import { Applicant } from "src/shared/types"

// Custom APIs for renderer
const api = {
  // Reports
  getApplicantsAndRequest: () => ipcRenderer.invoke("reports:getByRequestSpot"),
  getAssignedApplicantsBySpot: () => ipcRenderer.invoke("reports:getByAssignedSpot"),
  getAssignedApplicantsByLocation: () => ipcRenderer.invoke("reports:getByLocation"),
  getAssignedApplicantsByCareer: () => ipcRenderer.invoke("reports:getByCareer"),
  getApplicantsByMunicipality: () => ipcRenderer.invoke("reports:getByMunicipality"),
  getCareerClosing: () => ipcRenderer.invoke("reports:getClosingGrades"),

  //PDF
  generatePDF: (payload) => ipcRenderer.invoke("pdf:generate", payload),
  createZip: (sourceDir: string, zipName?: string) =>
    ipcRenderer.invoke("pdf:createZip", sourceDir, zipName),
  selectFolder: () => ipcRenderer.invoke("app:selectFolder"),

  //Statistics
  getDashboardStats: (phaseId?: number) => ipcRenderer.invoke("stats:getDashboardStats", phaseId),
  getTopApplicants: (phaseId?: number) => ipcRenderer.invoke("stats:getTopApplicants", phaseId),
  getTopCareers: (phaseId?: number) => ipcRenderer.invoke("stats:getTopCareers", phaseId),
  getInferredCurrentPhase: () => ipcRenderer.invoke("stats:getInferredCurrentPhase"),
  clearAllTables: () => ipcRenderer.invoke("stats:clearAllTables"),

  // Applicant
  addApplicant: (applicant: Applicant) => ipcRenderer.invoke("applicant:add", applicant),
  getApplicants: (phaseId: number) => ipcRenderer.invoke("applicant:getAll", phaseId),
  updateApplicant: (applicant: Applicant) => ipcRenderer.invoke("applicant:update", applicant),
  deleteApplicant: (applicantId: number) =>
    ipcRenderer.invoke("applicant:deleteApplicant", applicantId),
  addApplicantToPhase: (applicantId: number, phaseId: number) =>
    ipcRenderer.invoke("applicant:addApplicantToPhase", applicantId, phaseId),
  deleteAllApplicantsFromPhase: (phaseId: number) =>
    ipcRenderer.invoke("applicant:deleteAll", phaseId),

  // Allocation
  addAllocation: (allocation) => ipcRenderer.invoke("allocation:addAllocation", allocation),
  getAllAllocations: () => ipcRenderer.invoke("allocation:getAllAllocation"),
  getAllocationsByPhase: (phaseId: number) =>
    ipcRenderer.invoke("allocation:getAllocationsByPhase", phaseId),
  updateAllocation: (allocation) => ipcRenderer.invoke("allocation:updateAllocation", allocation),
  deleteAllocationForId: (id: number) => ipcRenderer.invoke("allocation:deleteAllocationForId", id),
  deleteAllAllocationsFromPhase: (phaseId: number) =>
    ipcRenderer.invoke("allocation:deleteAllFromPhase", phaseId),
  deleteAllAllocations: () => ipcRenderer.invoke("allocation:deleteAll"),

  // Career
  addCareer: (career) => ipcRenderer.invoke("career:add", career),
  getCareers: () => ipcRenderer.invoke("career:getAll"),
  getCareerByName: (name: string) => ipcRenderer.invoke("career:getByName", name),
  updateCareer: (career) => ipcRenderer.invoke("career:update", career),
  deleteCareer: (id: string) => ipcRenderer.invoke("career:delete", id),
  deleteAllCareers: () => ipcRenderer.invoke("career:deleteAll"),

  // Spot
  createSpot: (spotData) => ipcRenderer.invoke("spot:add", spotData),
  updateSpot: (spotData) => ipcRenderer.invoke("spot:update", spotData),
  getAllSpots: (phaseId: number) => ipcRenderer.invoke("spot:getAll", phaseId),
  deleteSpot: (spotId: number) => ipcRenderer.invoke("spot:delete", spotId),
  deleteAllSpotsFromPhase: (phaseId: number) => ipcRenderer.invoke("spot:deleteAll", phaseId),

  // Location
  addLocation: (location) => ipcRenderer.invoke("location:add", location),
  getLocations: () => ipcRenderer.invoke("location:getAll"),
  getLocationByName: (name: string) => ipcRenderer.invoke("location:getByName", name),
  updateLocation: (location) => ipcRenderer.invoke("location:update", location),
  deleteLocation: (id: string) => ipcRenderer.invoke("location:delete", id),
  deleteAllLocations: () => ipcRenderer.invoke("location:deleteAll"),

  // Phase
  getPhases: () => ipcRenderer.invoke("phase:getAll"),

  // User
  addUser: (user) => ipcRenderer.invoke("user:addUser", user),
  getUsers: () => ipcRenderer.invoke("user:getAll"),
  getUserById: (id: string) => ipcRenderer.invoke("user:getById", id),
  updateUser: (user) => ipcRenderer.invoke("user:update", user),
  deleteUser: (id: string) => ipcRenderer.invoke("user:delete", id),
  changeUserPassword: (data: { id: string; newPassword: string }) =>
    ipcRenderer.invoke("user:changePassword", data),

  // Seed Database
  seedDatabase: (applicantCount?: number) => ipcRenderer.invoke("seed:populate", applicantCount),
  clearSeedTables: () => ipcRenderer.invoke("seed:clear"),
  validateSeedData: () => ipcRenderer.invoke("seed:validate")
}

// Expose APIs
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("api", api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
