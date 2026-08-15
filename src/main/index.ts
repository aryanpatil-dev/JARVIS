import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import { IPC_CHANNELS, StoredSession, ProjectMemoryEntry } from '../shared/ipc-channels';
import { TerminalService } from './services/terminal.service';
import { FilesystemService } from './services/filesystem.service';
import { TelemetryService } from './services/telemetry.service';
import { WorkspaceService } from './services/workspace.service';
import { ToolsService } from './services/tools.service';
import { AIService } from './services/ai.service';
import { AgentService } from './services/agent.service';
import { MemoryService } from './services/memory.service';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

const terminalService = new TerminalService();
const filesystemService = new FilesystemService();
const telemetryService = new TelemetryService();
const workspaceService = new WorkspaceService();
const memoryService = new MemoryService();
const toolsService = new ToolsService(filesystemService, telemetryService);
const aiService = new AIService(toolsService);
const agentService = new AgentService(toolsService, aiService);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
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

  terminalService.setWindow(mainWindow);
  aiService.setWindow(mainWindow);
  agentService.setWindow(mainWindow);

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.maximize();
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    terminalService.killAll();
    mainWindow = null;
  });
}

// Window state IPC handlers
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

ipcMain.handle(IPC_CHANNELS.SYSTEM.GET_DETAILED_STATS, () => {
  return telemetryService.getDetailedStats();
});

ipcMain.handle(IPC_CHANNELS.SYSTEM.GET_PROCESSES, async () => {
  return telemetryService.getProcesses();
});

ipcMain.handle(IPC_CHANNELS.SYSTEM.KILL_PROCESS, async (_e, pid: number) => {
  return telemetryService.killProcess(pid);
});

// Terminal IPC handlers
ipcMain.handle(
  IPC_CHANNELS.TERMINAL.CREATE,
  (_e, { id, customCwd, customShell }: { id: string; customCwd?: string; customShell?: string }) => {
    return terminalService.createSession(id, customCwd, customShell);
  }
);

ipcMain.handle(IPC_CHANNELS.TERMINAL.INPUT, (_e, { id, data }: { id: string; data: string }) => {
  return terminalService.writeInput(id, data);
});

ipcMain.handle(IPC_CHANNELS.TERMINAL.KILL, (_e, { id }: { id: string }) => {
  return terminalService.killSession(id);
});

// Filesystem IPC handlers
ipcMain.handle(IPC_CHANNELS.FILESYSTEM.GET_ROOTS, () => {
  return filesystemService.getRoots();
});

ipcMain.handle(IPC_CHANNELS.FILESYSTEM.READ_DIR, (_e, dirPath: string) => {
  return filesystemService.readDirectory(dirPath);
});

ipcMain.handle(IPC_CHANNELS.FILESYSTEM.READ_FILE, (_e, filePath: string) => {
  return filesystemService.readFileContent(filePath);
});

ipcMain.handle(
  IPC_CHANNELS.FILESYSTEM.WRITE_FILE,
  (_e, { filePath, content }: { filePath: string; content: string }) => {
    return filesystemService.writeFileContent(filePath, content);
  }
);

ipcMain.handle(IPC_CHANNELS.FILESYSTEM.CREATE_DIR, (_e, dirPath: string) => {
  return filesystemService.createDirectory(dirPath);
});

ipcMain.handle(IPC_CHANNELS.FILESYSTEM.DELETE, (_e, targetPath: string) => {
  return filesystemService.deleteItem(targetPath);
});

// Workspace State Persistence
ipcMain.handle(IPC_CHANNELS.WORKSPACE.GET_STATE, () => {
  return workspaceService.getState();
});

ipcMain.handle(IPC_CHANNELS.WORKSPACE.SAVE_STATE, (_e, state) => {
  return workspaceService.saveState(state);
});

// AI & Gemini Engine
ipcMain.handle(IPC_CHANNELS.AI.PROMPT, async (_e, { prompt, model }: { prompt: string; model?: string }) => {
  return aiService.processPrompt(prompt, model);
});

ipcMain.handle(IPC_CHANNELS.AI.CANCEL, () => {
  aiService.cancelGeneration();
});

ipcMain.handle(IPC_CHANNELS.AI.SAVE_KEY, (_e, key: string) => {
  return aiService.saveApiKey(key);
});

ipcMain.handle(IPC_CHANNELS.AI.GET_KEY_STATUS, () => {
  return aiService.hasApiKey();
});

// Agent Subsystem
ipcMain.handle(IPC_CHANNELS.AGENT.GET_PERSONAS, () => {
  return agentService.getAgentPersonas();
});

ipcMain.handle(
  IPC_CHANNELS.AGENT.RUN_TASK,
  async (_e, { agentType, prompt }: { agentType: any; prompt: string }) => {
    return agentService.runAgentTask(agentType, prompt);
  }
);

// Memory & Knowledge Subsystem
ipcMain.handle(IPC_CHANNELS.MEMORY.GET_SESSIONS, (_e, workspaceId?: string) => {
  return memoryService.getSessions(workspaceId);
});

ipcMain.handle(IPC_CHANNELS.MEMORY.SAVE_SESSION, (_e, session: StoredSession) => {
  return memoryService.saveSession(session);
});

ipcMain.handle(IPC_CHANNELS.MEMORY.DELETE_SESSION, (_e, sessionId: string) => {
  return memoryService.deleteSession(sessionId);
});

ipcMain.handle(IPC_CHANNELS.MEMORY.GET_ENTRIES, (_e, workspaceId?: string) => {
  return memoryService.getProjectMemories(workspaceId);
});

ipcMain.handle(
  IPC_CHANNELS.MEMORY.SAVE_ENTRY,
  (_e, entry: Omit<ProjectMemoryEntry, 'id' | 'timestamp'>) => {
    return memoryService.saveProjectMemory(entry);
  }
);

ipcMain.handle(IPC_CHANNELS.MEMORY.DELETE_ENTRY, (_e, memoryId: string) => {
  return memoryService.deleteProjectMemory(memoryId);
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
