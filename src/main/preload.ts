import { contextBridge, ipcRenderer } from 'electron';
import {
  IPC_CHANNELS,
  ProcessInfo,
  DetailedSystemStats,
  FileItem,
  WorkspaceState,
  ToolCallEvent,
  AgentPersona,
  AgentTask,
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
  ai: {
    prompt: (prompt: string, model?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.AI.PROMPT, { prompt, model }),
    cancel: () => ipcRenderer.invoke(IPC_CHANNELS.AI.CANCEL),
    saveKey: (key: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.AI.SAVE_KEY, key),
    getKeyStatus: (): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.AI.GET_KEY_STATUS),
    onStreamChunk: (callback: (event: { text: string; done?: boolean }) => void) => {
      const subscription = (_e: unknown, value: { text: string; done?: boolean }) => callback(value);
      ipcRenderer.on(IPC_CHANNELS.AI.STREAM_CHUNK, subscription);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.AI.STREAM_CHUNK, subscription);
      };
    },
    onToolEvent: (callback: (event: ToolCallEvent) => void) => {
      const subscription = (_e: unknown, value: ToolCallEvent) => callback(value);
      ipcRenderer.on(IPC_CHANNELS.AI.TOOL_EVENT, subscription);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.AI.TOOL_EVENT, subscription);
      };
    },
  },
  agent: {
    getPersonas: (): Promise<AgentPersona[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.AGENT.GET_PERSONAS),
    runTask: (agentType: string, prompt: string): Promise<string> =>
      ipcRenderer.invoke(IPC_CHANNELS.AGENT.RUN_TASK, { agentType, prompt }),
    onTaskUpdate: (callback: (task: AgentTask) => void) => {
      const subscription = (_e: unknown, task: AgentTask) => callback(task);
      ipcRenderer.on(IPC_CHANNELS.AGENT.TASK_UPDATE, subscription);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.AGENT.TASK_UPDATE, subscription);
      };
    },
  },
  config: {
    get: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.CONFIG.GET, key),
    set: (key: string, value: unknown) => ipcRenderer.invoke(IPC_CHANNELS.CONFIG.SET, key, value),
  },
};

export type JarvisAPI = typeof jarvisAPI;

contextBridge.exposeInMainWorld('jarvisAPI', jarvisAPI);
