import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import * as fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

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
  electronApp.setAppUserModelId('com.markdown.app')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('getArchivesMd', async () => {
    const folderPath = 'C:\\md-files\\'

    // Función para crear la carpeta si no existe
    const createFolderIfNotExists = (folderPath: string) => {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      }
    }

    // Función para crear un archivo .md con contenido predeterminado
    const createMdFile = (filePath: string, content: string) => {
      fs.writeFileSync(filePath, content)
    }

    // Función para leer todos los archivos .md en la carpeta
    const getMdFilesContent = (folderPath: string) => {
      const files = fs.readdirSync(folderPath)
      const mdFiles = files.filter((file) => path.extname(file) === '.md')
      const result = mdFiles.map((file) => {
        const content = fs.readFileSync(path.join(folderPath, file), 'utf-8')
        return { name: file, content: content }
      })
      return result
    }

    createFolderIfNotExists(folderPath)

    const filePath = path.join(folderPath, 'example.md')
    const fileContent = '# Example Markdown File\nThis is an example content.'
    createMdFile(filePath, fileContent)

    const mdFilesContent = getMdFilesContent(folderPath)
    return mdFilesContent
  })
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
