import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/ipc-channels';

const jarvisAPI = {
  window: {
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.MAXIMIZE),
    close: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.CLOSE),
  },
  system: {
    getMetrics: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.GET_METRICS),
  },
  config: {
    get: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.CONFIG.GET, key),
    set: (key: string, value: unknown) => ipcRenderer.invoke(IPC_CHANNELS.CONFIG.SET, key, value),
  },
};

export type JarvisAPI = typeof jarvisAPI;

contextBridge.exposeInMainWorld('jarvisAPI', jarvisAPI);
