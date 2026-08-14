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
    METRICS_STREAM: 'system:metricsStream',
  },
  CONFIG: {
    GET: 'config:get',
    SET: 'config:set',
  },
  TERMINAL: {
    CREATE: 'terminal:create',
    INPUT: 'terminal:input',
    OUTPUT: 'terminal:output',
    RESIZE: 'terminal:resize',
    KILL: 'terminal:kill',
  },
} as const;
