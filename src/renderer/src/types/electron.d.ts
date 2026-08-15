import {
  ProcessInfo,
  DetailedSystemStats,
  FileItem,
  WorkspaceState,
  ToolCallEvent,
  ChatMessage,
  AgentPersona,
  AgentTask,
  ProjectMemoryEntry,
  StoredSession,
} from '../../shared/ipc-channels';

export type {
  ProcessInfo,
  DetailedSystemStats,
  FileItem,
  WorkspaceState,
  ToolCallEvent,
  ChatMessage,
  AgentPersona,
  AgentTask,
  ProjectMemoryEntry,
  StoredSession,
};

export interface SystemMetrics {
  cpuModel: string;
  cpuCores: number;
  totalMemoryGB: string;
  usedMemoryGB: string;
  freeMemoryGB: string;
  memoryUsagePercent: number;
  platform: string;
  arch: string;
  uptimeSeconds: number;
}

export interface IJarvisAPI {
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
  };
  system: {
    getMetrics: () => Promise<SystemMetrics>;
    getDetailedStats: () => Promise<DetailedSystemStats>;
    getProcesses: () => Promise<ProcessInfo[]>;
    killProcess: (pid: number) => Promise<boolean>;
    showNotification: (title: string, body: string) => Promise<void>;
  };
  terminal: {
    create: (id: string, customCwd?: string, customShell?: string) => Promise<boolean>;
    write: (id: string, data: string) => Promise<boolean>;
    kill: (id: string) => Promise<boolean>;
    onOutput: (callback: (event: { id: string; data: string }) => void) => () => void;
    onExit: (callback: (event: { id: string; code: number }) => void) => () => void;
  };
  fs: {
    getRoots: () => Promise<{ name: string; path: string }[]>;
    readDir: (dirPath: string) => Promise<FileItem[]>;
    readFile: (filePath: string) => Promise<{ content: string; truncated: boolean }>;
    writeFile: (filePath: string, content: string) => Promise<boolean>;
    createDir: (dirPath: string) => Promise<boolean>;
    delete: (targetPath: string) => Promise<boolean>;
  };
  workspace: {
    getState: () => Promise<WorkspaceState>;
    saveState: (state: Partial<WorkspaceState>) => Promise<boolean>;
  };
  ai: {
    prompt: (prompt: string, model?: string) => Promise<void>;
    cancel: () => Promise<void>;
    saveKey: (key: string) => Promise<boolean>;
    getKeyStatus: () => Promise<boolean>;
    onStreamChunk: (callback: (event: { text: string; done?: boolean }) => void) => () => void;
    onToolEvent: (callback: (event: ToolCallEvent) => void) => () => void;
  };
  agent: {
    getPersonas: () => Promise<AgentPersona[]>;
    runTask: (agentType: string, prompt: string) => Promise<string>;
    onTaskUpdate: (callback: (task: AgentTask) => void) => () => void;
  };
  memory: {
    getSessions: (workspaceId?: string) => Promise<StoredSession[]>;
    saveSession: (session: StoredSession) => Promise<boolean>;
    deleteSession: (sessionId: string) => Promise<boolean>;
    getEntries: (workspaceId?: string) => Promise<ProjectMemoryEntry[]>;
    saveEntry: (entry: Omit<ProjectMemoryEntry, 'id' | 'timestamp'>) => Promise<ProjectMemoryEntry>;
    deleteEntry: (memoryId: string) => Promise<boolean>;
  };
  config: {
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<void>;
  };
}

declare global {
  interface Window {
    jarvisAPI: IJarvisAPI;
  }
}
