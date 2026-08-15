/**
 * Type-safe IPC Channel Definitions for JARVIS
 */
export const IPC_CHANNELS = {
  WINDOW: {
    MINIMIZE: 'window:minimize',
    MAXIMIZE: 'window:maximize',
    CLOSE: 'window:close',
    IS_MAXIMIZED: 'window:isMaximized',
  },
  SYSTEM: {
    GET_METRICS: 'system:getMetrics',
    GET_DETAILED_STATS: 'system:getDetailedStats',
    GET_PROCESSES: 'system:getProcesses',
    KILL_PROCESS: 'system:killProcess',
    METRICS_STREAM: 'system:metricsStream',
  },
  TERMINAL: {
    CREATE: 'terminal:create',
    INPUT: 'terminal:input',
    RESIZE: 'terminal:resize',
    KILL: 'terminal:kill',
    OUTPUT: 'terminal:output',
    EXIT: 'terminal:exit',
  },
  FILESYSTEM: {
    GET_ROOTS: 'fs:getRoots',
    READ_DIR: 'fs:readDir',
    READ_FILE: 'fs:readFile',
    WRITE_FILE: 'fs:writeFile',
    CREATE_DIR: 'fs:createDir',
    DELETE: 'fs:delete',
  },
  WORKSPACE: {
    GET_STATE: 'workspace:getState',
    SAVE_STATE: 'workspace:saveState',
  },
  CONFIG: {
    GET: 'config:get',
    SET: 'config:set',
  },
} as const;

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number; // MB
  status?: string;
}

export interface FileItem {
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  modified: number;
  extension?: string;
}

export interface DetailedSystemStats {
  cpuUsage: number;
  cpuCoresUsage: number[];
  cpuModel: string;
  totalMemoryGB: string;
  usedMemoryGB: string;
  freeMemoryGB: string;
  memoryUsagePercent: number;
  activeProcessesCount: number;
  uptimeFormatted: string;
  platform: string;
}

export interface WorkspaceState {
  activeWorkspaceId: string;
  openPanels: ('terminal' | 'filesystem' | 'telemetry' | 'ai')[];
  activeTab: 'terminal' | 'filesystem' | 'telemetry' | 'ai';
  currentPath: string;
  terminalSessions: { id: string; name: string }[];
}
