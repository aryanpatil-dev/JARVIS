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
  AI: {
    PROMPT: 'ai:prompt',
    CANCEL: 'ai:cancel',
    STREAM_CHUNK: 'ai:streamChunk',
    TOOL_EVENT: 'ai:toolEvent',
    SAVE_KEY: 'ai:saveKey',
    GET_KEY_STATUS: 'ai:getKeyStatus',
  },
  AGENT: {
    GET_PERSONAS: 'agent:getPersonas',
    RUN_TASK: 'agent:runTask',
    TASK_UPDATE: 'agent:taskUpdate',
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
  openPanels: ('terminal' | 'filesystem' | 'telemetry' | 'ai' | 'agents')[];
  activeTab: 'overview' | 'terminal' | 'filesystem' | 'telemetry' | 'ai' | 'agents' | 'split-term-fs' | 'split-term-telem' | 'split-ai-term';
  currentPath: string;
  terminalSessions: { id: string; name: string }[];
}

export interface ToolCallEvent {
  id: string;
  tool: string;
  args: Record<string, unknown>;
  status: 'executing' | 'completed' | 'failed' | 'requires_permission';
  result?: unknown;
  error?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis' | 'system';
  content: string;
  timestamp: number;
  toolCalls?: ToolCallEvent[];
  isStreaming?: boolean;
}

export interface AgentPersona {
  id: 'coding' | 'terminal' | 'browser' | 'file' | 'research' | 'system';
  name: string;
  description: string;
  badge: string;
  color: string;
}

export interface AgentTaskStep {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  toolCall?: ToolCallEvent;
  output?: string;
}

export interface AgentTask {
  id: string;
  agentType: 'coding' | 'terminal' | 'browser' | 'file' | 'research' | 'system';
  prompt: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  steps: AgentTaskStep[];
  startTime: number;
  endTime?: number;
  finalSummary?: string;
}
