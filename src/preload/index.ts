import { contextBridge } from "electron"
import { electronAPI } from "@electron-toolkit/preload"
import { ipcRenderer } from "electron"
import { Student } from "src/shared/types"

// Custom APIs for renderer
const api = {
  // Student
  addStudent: (student: Student) => ipcRenderer.invoke("student:add", student),
  getStudents: (phaseId: number) => ipcRenderer.invoke("student:getAll", phaseId),
  updateStudent: (student: Student) => ipcRenderer.invoke("student:update", student),
  deleteStudent: (studentId: number) => ipcRenderer.invoke("student:deleteStudent", studentId),
  addStudentToPhase: (studentId: number, phaseId: number) =>
    ipcRenderer.invoke("student:addStudentToPhase", studentId, phaseId),
  deleteAllStudentsFromPhase: (phaseId: number) => ipcRenderer.invoke("student:deleteAll", phaseId),

  // Assignment
  addAssignment: (assignment) => ipcRenderer.invoke("assignment:addAssignment", assignment),
  getAssignments: () => ipcRenderer.invoke("assignment:getAllAssignment"),
  getAssignmentsByPhase: (phaseId: number) =>
    ipcRenderer.invoke("assignment:getAssignmentsByPhase", phaseId),
  updateAssignment: (assignment) => ipcRenderer.invoke("assignment:updateAssignment", assignment),
  deleteAssignmentForId: (id: number) => ipcRenderer.invoke("assignment:deleteAssignmentForId", id),
  deleteAllAssignmentsFromPhase: (phaseId: number) =>
    ipcRenderer.invoke("assignment:deleteAllFromPhase", phaseId),
  deleteAllAssignments: () => ipcRenderer.invoke("assignment:deleteAll"),

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
    ipcRenderer.invoke("user:changePassword", data)
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
