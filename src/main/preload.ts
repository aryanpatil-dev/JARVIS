import { contextBridge, ipcRenderer } from 'electron';
import {
  IPC_CHANNELS,
  ProcessInfo,
  DetailedSystemStats,
  FileItem,
  WorkspaceState,
} from '../shared/ipc-channels';

const jarvisAPI = {
  window: {
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.MAXIMIZE),
    close: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.CLOSE),
  },
  system: {
    getMetrics: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.GET_METRICS),
    getDetailedStats: (): Promise<DetailedSystemStats> =>
      ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.GET_DETAILED_STATS),
    getProcesses: (): Promise<ProcessInfo[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.GET_PROCESSES),
    killProcess: (pid: number): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.KILL_PROCESS, pid),
  },
  terminal: {
    create: (id: string, customCwd?: string, customShell?: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.TERMINAL.CREATE, { id, customCwd, customShell }),
    write: (id: string, data: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.TERMINAL.INPUT, { id, data }),
    kill: (id: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.TERMINAL.KILL, { id }),
    onOutput: (callback: (event: { id: string; data: string }) => void) => {
      const subscription = (_e: unknown, value: { id: string; data: string }) => callback(value);
      ipcRenderer.on(IPC_CHANNELS.TERMINAL.OUTPUT, subscription);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL.OUTPUT, subscription);
      };
    },
    onExit: (callback: (event: { id: string; code: number }) => void) => {
      const subscription = (_e: unknown, value: { id: string; code: number }) => callback(value);
      ipcRenderer.on(IPC_CHANNELS.TERMINAL.EXIT, subscription);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL.EXIT, subscription);
      };
    },
  },
  fs: {
    getRoots: (): Promise<{ name: string; path: string }[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILESYSTEM.GET_ROOTS),
    readDir: (dirPath: string): Promise<FileItem[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILESYSTEM.READ_DIR, dirPath),
    readFile: (filePath: string): Promise<{ content: string; truncated: boolean }> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILESYSTEM.READ_FILE, filePath),
    writeFile: (filePath: string, content: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILESYSTEM.WRITE_FILE, { filePath, content }),
    createDir: (dirPath: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILESYSTEM.CREATE_DIR, dirPath),
    delete: (targetPath: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILESYSTEM.DELETE, targetPath),
  },
  workspace: {
    getState: (): Promise<WorkspaceState> =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE.GET_STATE),
    saveState: (state: Partial<WorkspaceState>): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE.SAVE_STATE, state),
  },
  config: {
    get: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.CONFIG.GET, key),
    set: (key: string, value: unknown) => ipcRenderer.invoke(IPC_CHANNELS.CONFIG.SET, key, value),
  },
};

export type JarvisAPI = typeof jarvisAPI;

contextBridge.exposeInMainWorld('jarvisAPI', jarvisAPI);
