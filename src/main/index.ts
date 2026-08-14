import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import { IPC_CHANNELS } from '../shared/ipc-channels';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 840,
    minWidth: 1024,
    minHeight: 640,
    frame: false,
    backgroundColor: '#08090b',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Window IPC handlers
ipcMain.handle(IPC_CHANNELS.WINDOW.MINIMIZE, () => {
  mainWindow?.minimize();
});

ipcMain.handle(IPC_CHANNELS.WINDOW.MAXIMIZE, () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle(IPC_CHANNELS.WINDOW.CLOSE, () => {
  mainWindow?.close();
});

// System telemetry IPC handlers
ipcMain.handle(IPC_CHANNELS.SYSTEM.GET_METRICS, () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const cpus = os.cpus();

  return {
    cpuModel: cpus[0]?.model || 'Generic CPU',
    cpuCores: cpus.length,
    totalMemoryGB: (totalMem / (1024 ** 3)).toFixed(1),
    usedMemoryGB: (usedMem / (1024 ** 3)).toFixed(1),
    freeMemoryGB: (freeMem / (1024 ** 3)).toFixed(1),
    memoryUsagePercent: Math.round((usedMem / totalMem) * 100),
    platform: process.platform,
    arch: process.arch,
    uptimeSeconds: os.uptime(),
  };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
