import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { ChatMessage } from '../../shared/ipc-channels';

export interface ProjectMemoryEntry {
  id: string;
  workspaceId: string;
  key: string;
  content: string;
  category: 'architecture' | 'task' | 'preference' | 'snippet';
  timestamp: number;
}

export interface StoredSession {
  id: string;
  title: string;
  workspaceId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export class MemoryService {
  private memoryDir: string;
  private sessionsFile: string;
  private projectMemoryFile: string;

  constructor() {
    const userData = app.getPath('userData');
    this.memoryDir = path.join(userData, 'memory');
    this.sessionsFile = path.join(this.memoryDir, 'sessions.json');
    this.projectMemoryFile = path.join(this.memoryDir, 'project-memory.json');
    this.ensureDirectory();
  }

  private ensureDirectory() {
    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir, { recursive: true });
    }
  }

  public getSessions(workspaceId?: string): StoredSession[] {
    try {
      if (!fs.existsSync(this.sessionsFile)) return [];
      const raw = fs.readFileSync(this.sessionsFile, 'utf-8');
      const sessions: StoredSession[] = JSON.parse(raw);
      if (workspaceId) {
        return sessions.filter((s) => s.workspaceId === workspaceId);
      }
      return sessions;
    } catch (err) {
      console.error('Failed to read memory sessions:', err);
      return [];
    }
  }

  public saveSession(session: StoredSession): boolean {
    try {
      this.ensureDirectory();
      const sessions = this.getSessions();
      const idx = sessions.findIndex((s) => s.id === session.id);
      if (idx >= 0) {
        sessions[idx] = { ...session, updatedAt: Date.now() };
      } else {
        sessions.unshift({ ...session, createdAt: Date.now(), updatedAt: Date.now() });
      }
      fs.writeFileSync(this.sessionsFile, JSON.stringify(sessions, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed to save memory session:', err);
      return false;
    }
  }

  public deleteSession(sessionId: string): boolean {
    try {
      const sessions = this.getSessions().filter((s) => s.id !== sessionId);
      fs.writeFileSync(this.sessionsFile, JSON.stringify(sessions, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed to delete memory session:', err);
      return false;
    }
  }

  public getProjectMemories(workspaceId?: string): ProjectMemoryEntry[] {
    try {
      if (!fs.existsSync(this.projectMemoryFile)) return [];
      const raw = fs.readFileSync(this.projectMemoryFile, 'utf-8');
      const entries: ProjectMemoryEntry[] = JSON.parse(raw);
      if (workspaceId) {
        return entries.filter((e) => e.workspaceId === workspaceId);
      }
      return entries;
    } catch (err) {
      console.error('Failed to read project memory entries:', err);
      return [];
    }
  }

  public saveProjectMemory(entry: Omit<ProjectMemoryEntry, 'id' | 'timestamp'>): ProjectMemoryEntry {
    this.ensureDirectory();
    const entries = this.getProjectMemories();
    const newEntry: ProjectMemoryEntry = {
      ...entry,
      id: `mem-${Date.now()}`,
      timestamp: Date.now(),
    };
    entries.unshift(newEntry);
    fs.writeFileSync(this.projectMemoryFile, JSON.stringify(entries, null, 2), 'utf-8');
    return newEntry;
  }

  public deleteProjectMemory(memoryId: string): boolean {
    try {
      const entries = this.getProjectMemories().filter((e) => e.id !== memoryId);
      fs.writeFileSync(this.projectMemoryFile, JSON.stringify(entries, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed to delete project memory entry:', err);
      return false;
    }
  }
}
