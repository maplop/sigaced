import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  getStudents,
  getStudentByCI,
  addStudent,
  updateStudent,
  deleteStudent,
  seedStudents
} from './queries/student'
import {
  getAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignment
} from './queries/assignment'
import {
  getCareers,
  addCareer,
  getCareerByName,
  updateCareer,
  deleteCareer
} from './queries/career'
import { getSpots, addSpot, updateSpot, deleteSpot } from './queries/spot'
import { getRequests, addRequest, updateRequest, deleteRequest } from './queries/request'
import {
  getLocations,
  addLocation,
  getLocationByName,
  updateLocation,
  deleteLocation
} from './queries/location'
import { getPhases } from './queries/phase'
import {
  getUsers,
  getUserByUsername,
  addUser,
  updateUser,
  changeUserPassword,
  deleteUser
} from './queries/user'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  const count = getStudents().length
  if (count === 0) {
    seedStudents()
    console.log('Students seeded in DB')
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// IPC handlers for student CRUD
ipcMain.handle('student:add', (_event, student) => {
  addStudent(student)
})

ipcMain.handle('student:getAll', () => {
  return getStudents()
})

ipcMain.handle('student:getByCI', (_event, ci) => {
  return getStudentByCI(ci)
})

ipcMain.handle('student:update', (_event, student) => {
  updateStudent(student)
})

ipcMain.handle('student:delete', (_event, ci) => {
  deleteStudent(ci)
})

// IPC handlers for assignment CRUD
ipcMain.handle('assignment:add', (_event, assignment) => {
  addAssignment(assignment)
})

ipcMain.handle('assignment:getAll', () => {
  return getAssignments()
})

ipcMain.handle('assignment:update', (_event, assignment) => {
  updateAssignment(assignment)
})

ipcMain.handle('assignment:delete', (_event, id) => {
  deleteAssignment(id)
})

// IPC handlers for career CRUD
ipcMain.handle('career:add', (_event, career) => {
  addCareer(career)
})

ipcMain.handle('career:getAll', () => {
  return getCareers()
})

ipcMain.handle('career:getByName', (_event, name) => {
  return getCareerByName(name)
})

ipcMain.handle('career:update', (_event, career) => {
  updateCareer(career)
})

ipcMain.handle('career:delete', (_event, id) => {
  deleteCareer(id)
})

// IPC handlers for spot CRUD
ipcMain.handle('spot:add', (_event, spot) => {
  addSpot(spot)
})

ipcMain.handle('spot:getAll', () => {
  return getSpots()
})

ipcMain.handle('spot:update', (_event, spot) => {
  updateSpot(spot)
})

ipcMain.handle('spot:delete', (_event, id) => {
  deleteSpot(id)
})

// IPC handlers for request CRUD
ipcMain.handle('request:add', (_event, request) => {
  addRequest(request)
})

ipcMain.handle('request:getAll', () => {
  return getRequests()
})

ipcMain.handle('request:update', (_event, request) => {
  updateRequest(request)
})

ipcMain.handle('request:delete', (_event, id) => {
  deleteRequest(id)
})

// IPC handlers for location CRUD
ipcMain.handle('location:add', (_event, location) => {
  addLocation(location)
})

ipcMain.handle('location:getAll', () => {
  return getLocations()
})

ipcMain.handle('location:getByName', (_event, name) => {
  return getLocationByName(name)
})

ipcMain.handle('location:update', (_event, location) => {
  updateLocation(location)
})

ipcMain.handle('location:delete', (_event, id) => {
  deleteLocation(id)
})

// IPC handlers for phase
ipcMain.handle('phase:getAll', () => {
  return getPhases()
})

// IPC handlers for user CRUD
ipcMain.handle('user:add', (_event, user) => {
  addUser(user)
})

ipcMain.handle('user:getAll', () => {
  return getUsers()
})

ipcMain.handle('user:getByUsername', (_event, username) => {
  return getUserByUsername(username)
})

ipcMain.handle('user:update', (_event, user) => {
  updateUser(user)
})

ipcMain.handle('user:delete', (_event, id) => {
  deleteUser(id)
})

ipcMain.handle('user:changePassword', (_event, { id, newPassword }) => {
  changeUserPassword(id, newPassword)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
