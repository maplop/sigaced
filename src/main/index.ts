import { app, shell, BrowserWindow, ipcMain, dialog } from "electron"
import { join } from "path"
import { electronApp, optimizer, is } from "@electron-toolkit/utils"
import icon from "../../resources/icon.png?asset"
import {
  addApplicant,
  getApplicants,
  updateApplicant,
  deleteApplicant,
  addApplicantToPhase,
  deleteAllApplicantsFromPhase
} from "./queries/applicant"
import {
  getAllocations,
  addAllocation,
  updateAllocation,
  deleteAllocationForId,
  getAllocationsByPhase,
  deleteAllAllocationsFromPhase,
  deleteAllAllocations
} from "./queries/allocation"
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
  getTopApplicants,
  getInferredCurrentPhase
} from "./queries/statistics"
import { OperationResult } from "src/shared/types"
import { generatePDF } from "./pdf/generatePDF"
import { createZipFromDirectory } from "./pdf/createZip"
import {
  seedDatabase,
  clearSeedTables,
  validateSeedData
} from "./seed/seedDatabase"
import {
  getCareerClosing,
  getApplicantsAndRequest,
  getAssignedApplicantsBySpot,
  getAssignedApplicantsByCareer,
  getAssignedApplicantsByLocation,
  getApplicantsByMunicipality
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

// Aspirantes y solicitudes por CI
ipcMain.handle("reports:getByRequestSpot", async (_event) => {
  try {
    return getApplicantsAndRequest()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Aspirantes otorgados a un spot
ipcMain.handle("reports:getByAssignedSpot", async (_event) => {
  try {
    return getAssignedApplicantsBySpot()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Aspirantes por ubicación
ipcMain.handle("reports:getByLocation", async (_event) => {
  try {
    return getAssignedApplicantsByLocation()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Aspirantes por carrera
ipcMain.handle("reports:getByCareer", async (_event) => {
  try {
    return getAssignedApplicantsByCareer()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Aspirantes por municipio
ipcMain.handle("reports:getByMunicipality", async (_event) => {
  try {
    return getApplicantsByMunicipality()
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

ipcMain.handle("pdf:createZip", async (_event, sourceDir: string, zipName?: string) => {
  try {
    const zipPath = await createZipFromDirectory(sourceDir, zipName)
    return { success: true, path: zipPath }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("app:selectFolder", async (_event) => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Seleccionar carpeta para guardar los PDFs"
    })

    if (result.canceled) {
      return { success: false, canceled: true, error: "Selección cancelada por el usuario" }
    }

    if (result.filePaths && result.filePaths.length > 0) {
      return { success: true, path: result.filePaths[0] }
    }

    return { success: false, error: "No se seleccionó ninguna carpeta" }
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

ipcMain.handle("stats:getTopApplicants", async (_event, phaseId?: number) => {
  try {
    return getTopApplicants(phaseId)
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

ipcMain.handle("stats:getInferredCurrentPhase", async () => {
  try {
    return getInferredCurrentPhase()
  } catch (error: any) {
    return 1
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
ipcMain.handle("seed:populate", async (_event, applicantCount?: number) => {
  try {
    const result = seedDatabase(applicantCount ?? 500)
    return { success: true, result }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Nota: clearSeedTables no actualiza currentPhase. Si se invoca desde el renderer,
// el caller debe invocar setCurrentPhase(1) en onSuccess para mantener la referencia en localStorage.
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

// IPC handlers for applicant CRUD
// Crear aspirante con su fase y opcionalmente solicitudes
ipcMain.handle("applicant:add", async (_event, applicant) => {
  try {
    const id = addApplicant(applicant)
    return { success: true, id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Obtener todos los aspirantes y solicitudes de una fase
ipcMain.handle("applicant:getAll", async (_event, phaseId: number) => {
  try {
    return getApplicants(phaseId)
  } catch (error) {
    console.error("Error al obtener aspirantes:", error)
    return []
  }
})

// Editar aspirante y/o solicitudes en una fase
ipcMain.handle("applicant:update", async (_event, applicant) => {
  try {
    updateApplicant(applicant)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Eliminar completamente un aspirante
ipcMain.handle("applicant:deleteApplicant", async (_event, applicantId: number) => {
  try {
    deleteApplicant(applicantId)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Agregar un aspirante existente a una fase específica
ipcMain.handle("applicant:addApplicantToPhase", async (_event, applicantId: number, phaseId: number) => {
  try {
    addApplicantToPhase(applicantId, phaseId)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Eliminar todos los aspirantes de una fase (sin borrarlos completamente)
ipcMain.handle("applicant:deleteAll", async (_event, phaseId: number) => {
  try {
    deleteAllApplicantsFromPhase(phaseId)
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todos los aspirantes de la fase:", error)
    return { success: false, error: error.message }
  }
})

// IPC handlers for allocation CRUD
ipcMain.handle("allocation:addAllocation", async (_event, allocation) => {
  try {
    await addAllocation(allocation)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("allocation:getAllAllocation", async () => {
  try {
    return await getAllocations()
  } catch (error: any) {
    console.error("Error al obtener otorgamientos:", error)
    return []
  }
})

ipcMain.handle("allocation:getAllocationsByPhase", async (_event, phaseId: number) => {
  try {
    return await getAllocationsByPhase(phaseId)
  } catch (error: any) {
    console.error("Error al obtener otorgamientos por fase:", error)
    return []
  }
})

ipcMain.handle("allocation:updateAllocation", async (_event, allocation) => {
  try {
    await updateAllocation(allocation)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("allocation:deleteAllocationForId", async (_event, id: number) => {
  try {
    await deleteAllocationForId(id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("allocation:deleteAllFromPhase", async (_event, phaseId: number) => {
  try {
    await deleteAllAllocationsFromPhase(phaseId)
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todos los otorgamientos de la fase:", error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle("allocation:deleteAll", async (_event) => {
  try {
    await deleteAllAllocations()
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar todos los otorgamientos.", error)
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

ipcMain.handle("location:delete", async (_event, id: number) => {
  try {
    const deleted = deleteLocation(id)
    if (!deleted) return { success: false, error: "Ubicación no encontrada" }
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
    console.error("Error al eliminar todas las ubicaciones:", error)
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
    const deleted = deleteUser(id)
    if (!deleted) return { success: false, error: "Usuario no encontrado" }
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
