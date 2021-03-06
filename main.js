const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')
const path = require('path')

const server = require('./server/app')
const platform = process.platform
const isOsx = platform === 'darwin'

let isDevelopment = true

var mainWindow
var forceQuit

function startServer() {
  server.startServer(3008).then(() => {
    createWindow()
  })
}

function createWindow() {
  if (mainWindow) {
    mainWindow.show()
    return
  }
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    titleBarStyle: 'hidden',
    frame: false,
    show: false,
    icon: path.join(__dirname, 'dist/icon/mimimi.png')
  })
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))

  mainWindow.once('ready-to-show', () => {
    // 显示主窗口
    mainWindow.show()
    // 开发模式下打开调试工具
    // if (process.env.NODE_ENV === 'development') win.webContents.openDevTools()
  })
}

app.on('ready', () => {
  startServer()
})

if (isOsx) {
  app.dock.setIcon(`${__dirname}/dist/icon/mimimi.png`)
}

app.on('activate', () => {
  if (mainWindow === null) {
    startServer()
  }
})
