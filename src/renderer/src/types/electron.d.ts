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
