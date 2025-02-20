import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';
import path from 'path';
import started from 'electron-squirrel-startup';
import { createFile, OpenExternalFile, OpenFolder_Dialog } from './FApis';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    show: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(0, 0, 0, 0.0)',
      symbolColor: '#74b1be',
      height: 35
    },

    ...(process.platform !== 'darwin' ? {} : {}),

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegrationInWorker: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }


  // Открытие инструментов разработчика при нажатии F12
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'Electron',
    submenu: [{
      role: 'help',
      accelerator: 'F12',
      click: () => { mainWindow.webContents.openDevTools() }
    }]
  }))

  Menu.setApplicationMenu(menu)
};

// Регистация обработчиков для моста контекстов
function ipcMainHandlers() {
  // Однонаправленные события, ничего не возвращают
  ipcMain.on('close-window', () => { app.quit() });

  // Асинхронные события, возвращают промис
  ipcMain.handle('OpenFolder_Dialog', (event) => { return OpenFolder_Dialog() });
  ipcMain.handle('create-file', (event, filename, text) => { return createFile(filename, text) });
  ipcMain.handle('OpenExternalFile', (event, filename, path) => { return OpenExternalFile(filename, path) });
}

// Запуск функций когда приложение готово
app.whenReady().then(() => {
  const { session } = require('electron');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
    callback({ responseHeaders: details.responseHeaders });
  });
  createWindow();
  ipcMainHandlers();
  
});



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
