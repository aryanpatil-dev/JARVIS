import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { WorkspaceState } from '../../shared/ipc-channels';

const DEFAULT_STATE: WorkspaceState = {
  activeWorkspaceId: 'core',
  openPanels: ['terminal', 'filesystem', 'telemetry'],
  activeTab: 'terminal',
  currentPath: '',
  terminalSessions: [{ id: 'term-main', name: 'PS Main' }],
};

export class WorkspaceService {
  private configPath: string;

  constructor() {
    const userData = app.getPath('userData');
    this.configPath = path.join(userData, 'workspace-state.json');
  }

  public getState(): WorkspaceState {
    try {
      if (fs.existsSync(this.configPath)) {
        const raw = fs.readFileSync(this.configPath, 'utf-8');
        return { ...DEFAULT_STATE, ...JSON.parse(raw) };
      }
    } catch (err) {
      console.error('Failed to load workspace state:', err);
    }
    return DEFAULT_STATE;
  }

  public saveState(state: Partial<WorkspaceState>): boolean {
    try {
      const current = this.getState();
      const updated = { ...current, ...state };
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(updated, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed to save workspace state:', err);
      return false;
    }
  }
}
