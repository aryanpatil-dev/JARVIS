import {
  ProcessInfo,
  DetailedSystemStats,
  FileItem,
  WorkspaceState,
} from '../../shared/ipc-channels';

export type { ProcessInfo, DetailedSystemStats, FileItem, WorkspaceState };

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
