import { contextBridge } from "electron"
import { electronAPI } from "@electron-toolkit/preload"
import { ipcRenderer } from "electron"

// Custom APIs for renderer
const api = {
  // Student
  addStudent: (student) => ipcRenderer.invoke("student:add", student),
  getStudents: () => ipcRenderer.invoke("student:getAll"),
  getStudentByCI: (ci: string) => ipcRenderer.invoke("student:getByCI", ci),
  updateStudent: (student) => ipcRenderer.invoke("student:update", student),
  deleteStudent: (ci: string) => ipcRenderer.invoke("student:delete", ci),

  // Assignment
  addAssignment: (assignment) => ipcRenderer.invoke("assignment:add", assignment),
  getAssignments: () => ipcRenderer.invoke("assignment:getAll"),
  updateAssignment: (assignment) => ipcRenderer.invoke("assignment:update", assignment),
  deleteAssignment: (id: string) => ipcRenderer.invoke("assignment:delete", id),

  // Career
  addCareer: (career) => ipcRenderer.invoke("career:add", career),
  getCareers: () => ipcRenderer.invoke("career:getAll"),
  getCareerByName: (name: string) => ipcRenderer.invoke("career:getByName", name),
  updateCareer: (career) => ipcRenderer.invoke("career:update", career),
  deleteCareer: (id: string) => ipcRenderer.invoke("career:delete", id),

  // Spot
  addSpot: (spot) => ipcRenderer.invoke("spot:add", spot),
  getSpots: () => ipcRenderer.invoke("spot:getAll"),
  updateSpot: (spot) => ipcRenderer.invoke("spot:update", spot),
  deleteSpot: (id: string) => ipcRenderer.invoke("spot:delete", id),

  // Request
  addRequest: (request) => ipcRenderer.invoke("request:add", request),
  getRequests: () => ipcRenderer.invoke("request:getAll"),
  updateRequest: (request) => ipcRenderer.invoke("request:update", request),
  deleteRequest: (id: string) => ipcRenderer.invoke("request:delete", id),

  // Location
  addLocation: (location) => ipcRenderer.invoke("location:add", location),
  getLocations: () => ipcRenderer.invoke("location:getAll"),
  getLocationByName: (name: string) => ipcRenderer.invoke("location:getByName", name),
  updateLocation: (location) => ipcRenderer.invoke("location:update", location),
  deleteLocation: (id: string) => ipcRenderer.invoke("location:delete", id),

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
