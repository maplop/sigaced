import { app, shell, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { electronApp, optimizer, is } from "@electron-toolkit/utils"
import icon from "../../resources/icon.png?asset"
import {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  addStudentToPhase,
  deleteAllStudentsFromPhase
} from "./queries/student"
import {
  getAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignmentForId,
  getAssignmentsByPhase,
  deleteAllAssignmentsFromPhase,
  deleteAllAssignments
} from "./queries/assignment"
import {
  getCareers,
  addCareer,
  getCareerByName,
  updateCareer,
  deleteCareer,
  deleteAllCareers
} from "./queries/career"
import {
  getLocations,
  addLocation,
  getLocationByName,
  updateLocation,
  deleteLocation,
  deleteAllLocations
} from "./queries/location"
import { getPhases } from "./queries/phase"
import {
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserPassword
} from "./queries/user"
import {
  getAllSpots,
  createSpot,
  updateSpot,
  deleteSpot,
  deleteAllSpotsFromPhase
} from "./queries/spot"
import {
  clearAllTables,
  getDashboardStats,
  getTopCareers,
  getTopStudents
} from "./queries/statistics"
import { OperationResult } from "src/shared/types"
import { generatePDF } from "./pdf/generatePDF"
import {
  seedDatabase,
  clearSeedTables,
  validateSeedData
} from "./seed/seedDatabase"
import {
  getCareerClosing,
  getStudentsAndRequest,
  getAssignedStudentsBySpot,
  getAssignedStudentsByCareer,
  getAssignedStudentsByLocation,
  getStudentsByMunicipality
} from "./queries/reports"

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  })

  mainWindow.on("ready-to-show", () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron")

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on("ping", () => console.log("pong"))

  createWindow()

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Estudiantes y solicitudes por ci
ipcMain.handle("reports:getByRequestSpot", async (_event) => {
  try {
    return getStudentsAndRequest()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Estudiantes asignados a un spot
ipcMain.handle("reports:getByAssignedSpot", async (_event) => {
  try {
    return getAssignedStudentsBySpot()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Estudiantes por ubicación
ipcMain.handle("reports:getByLocation", async (_event) => {
  try {
    return getAssignedStudentsByLocation()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Estudiantes por carrera
ipcMain.handle("reports:getByCareer", async (_event) => {
  try {
    return getAssignedStudentsByCareer()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Estudiantes por municipio
ipcMain.handle("reports:getByMunicipality", async (_event) => {
  try {
    return getStudentsByMunicipality()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Cierre de carreras
ipcMain.handle("reports:getClosingGrades", async () => {
  try {
    return getCareerClosing()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// IPC handlers for PDf
ipcMain.handle("pdf:generate", async (_event, payload) => {
  try {
    const filePath = await generatePDF(payload)
    return { success: true, path: filePath }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// IPC handlers for statistics
ipcMain.handle("stats:getDashboardStats", async (_event, phaseId?: number) => {
  try {
    return getDashboardStats(phaseId)
  } catch (error: any) {
    return { success: false, error: error?.message ?? "Error desconocido" } as OperationResult
  }
})

ipcMain.handle("stats:getTopStudents", async (_event, phaseId?: number) => {
  try {
    return getTopStudents(phaseId)
  } catch (error: any) {
    return { success: false, error: error?.message ?? "Error desconocido" } as OperationResult
  }
})

ipcMain.handle("stats:getTopCareers", async (_event, phaseId?: number) => {
  try {
    return getTopCareers(phaseId)
  } catch (error: any) {
    return { success: false, error: error?.message ?? "Error desconocido" } as OperationResult
  }
})

ipcMain.handle("stats:clearAllTables", async (_event) => {
  try {
    clearAllTables()
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// IPC handlers for seed database
ipcMain.handle("seed:populate", async (_event, studentCount?: number) => {
  try {
    const result = seedDatabase(studentCount || 100)
    return { success: true, result }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("seed:clear", async (_event) => {
  try {
    clearSeedTables()
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("seed:validate", async (_event) => {
  try {
    const validation = validateSeedData()
    return { success: true, validation }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// IPC handlers for student CRUD
// Crear aspirante con su fase y opcionalmente solicitudes
ipcMain.handle("student:add", async (_event, student) => {
  try {
    const id = addStudent(student)
    return { success: true, id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Obtener todos los estudiantes y solicitudes de una fase
ipcMain.handle("student:getAll", async (_event, phaseId: number) => {
  try {
    return getStudents(phaseId)
  } catch (error) {
    console.error("Error al obtener estudiantes:", error)
    return []
  }
})

// Editar aspirante y/o solicitudes en una fase
ipcMain.handle("student:update", async (_event, student) => {
  try {
    updateStudent(student)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Eliminar completamente un aspirante
ipcMain.handle("student:deleteStudent", async (_event, studentId: number) => {
  try {
    deleteStudent(studentId)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Agregar un aspirante existente a una fase específica
ipcMain.handle("student:addStudentToPhase", async (_event, studentId: number, phaseId: number) => {
  try {
    addStudentToPhase(studentId, phaseId)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Eliminar todos los aspirantes de una fase (sin borrarlos completamente)
ipcMain.handle("student:deleteAll", async (_event, phaseId: number) => {
  try {
    deleteAllStudentsFromPhase(phaseId)
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todos los estudiantes de la fase:", error)
    return { success: false, error: error.message }
  }
})

// IPC handlers for assignment CRUD
ipcMain.handle("assignment:addAssignment", async (_event, assignment) => {
  try {
    await addAssignment(assignment)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("assignment:getAllAssignment", async () => {
  try {
    return await getAssignments()
  } catch (error: any) {
    console.error("Error al obtener asignaciones:", error)
    return []
  }
})

ipcMain.handle("assignment:getAssignmentsByPhase", async (_event, phaseId: number) => {
  try {
    return await getAssignmentsByPhase(phaseId)
  } catch (error: any) {
    console.error("Error al obtener otorgamientospor fase:", error)
    return []
  }
})

ipcMain.handle("assignment:updateAssignment", async (_event, assignment) => {
  try {
    await updateAssignment(assignment)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("assignment:deleteAssignmentForId", async (_event, id: number) => {
  try {
    await deleteAssignmentForId(id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("assignment:deleteAllFromPhase", async (_event, phaseId: number) => {
  try {
    await deleteAllAssignmentsFromPhase(phaseId)
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todas los otorgamientos de la fase:", error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle("assignment:deleteAll", async (_event) => {
  try {
    await deleteAllAssignments()
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todas las asignaciones.", error)
    return { success: false, error: error.message }
  }
})

// IPC handlers for career CRUD
ipcMain.handle("career:add", async (_event, career) => {
  try {
    await addCareer(career)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("career:getAll", async () => {
  try {
    return await getCareers()
  } catch (error) {
    console.error("Error al obtener carreras:", error)
    return []
  }
})

ipcMain.handle("career:getByName", async (_event, name) => {
  try {
    return (await getCareerByName(name)) ?? null
  } catch (error) {
    console.error("Error al obtener carrera por nombre:", error)
    return null
  }
})

ipcMain.handle("career:update", async (_event, career) => {
  try {
    await updateCareer(career)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("career:delete", async (_event, id) => {
  try {
    await deleteCareer(id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("career:deleteAll", async () => {
  try {
    await deleteAllCareers()
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todas las carreras:", error)
    return { success: false, error: error.message }
  }
})

// IPC handlers for spot CRUD
ipcMain.handle("spot:add", async (_event, spotData) => {
  try {
    await createSpot(spotData)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("spot:update", async (_event, spotData) => {
  try {
    await updateSpot(spotData)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("spot:getAll", async (_event, phaseId: number) => {
  try {
    return await getAllSpots(phaseId)
  } catch (error) {
    console.error("Error al obtener plazas:", error)
    return []
  }
})

ipcMain.handle("spot:delete", async (_event, spotId: number) => {
  try {
    await deleteSpot(spotId)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Eliminar todas las plazas de una fase específica
ipcMain.handle("spot:deleteAll", async (_event, phaseId: number) => {
  try {
    deleteAllSpotsFromPhase(phaseId)
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todas las plazas de la fase:", error)
    return { success: false, error: error.message }
  }
})

// IPC handlers for location CRUD
ipcMain.handle("location:add", async (_event, location) => {
  try {
    await addLocation(location)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("location:getAll", async () => {
  try {
    return await getLocations()
  } catch (error) {
    console.error("Error al obtener ubicaciones:", error)
    return []
  }
})

ipcMain.handle("location:getByName", async (_event, name) => {
  try {
    return (await getLocationByName(name)) ?? null
  } catch (error) {
    console.error("Error al obtener ubicación por nombre:", error)
    return null
  }
})

ipcMain.handle("location:update", async (_event, location) => {
  try {
    await updateLocation(location)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("location:delete", async (_event, id) => {
  try {
    await deleteLocation(id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("location:deleteAll", async () => {
  try {
    await deleteAllLocations()
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todas las localizaciones:", error)
    return { success: false, error: error.message }
  }
})

// IPC handlers for phase
ipcMain.handle("phase:getAll", async () => {
  try {
    return await getPhases()
  } catch (error) {
    console.error("Error al obtener fases:", error)
    return []
  }
})

// IPC handlers for user CRUD
ipcMain.handle("user:addUser", async (_event, user) => {
  try {
    await addUser(user)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("user:getAll", async () => {
  try {
    return await getUsers()
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return []
  }
})

ipcMain.handle("user:getById", async (_event, id) => {
  try {
    return (await getUserById(id)) ?? null
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return null
  }
})

ipcMain.handle("user:update", async (_event, user) => {
  try {
    await updateUser(user)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("user:delete", async (_event, id) => {
  try {
    await deleteUser(id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("user:changePassword", async (_event, data) => {
  try {
    await changeUserPassword(data.id, data.newPassword)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
