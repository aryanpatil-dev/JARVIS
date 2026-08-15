import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../../shared/ipc-channels';
import os from 'os';

interface TerminalSession {
  id: string;
  process: ChildProcessWithoutNullStreams;
  buffer: string[];
}

export class TerminalService {
  private sessions: Map<string, TerminalSession> = new Map();
  private window: BrowserWindow | null = null;

  public setWindow(win: BrowserWindow) {
    this.window = win;
  }

  public createSession(id: string, customCwd?: string, customShell?: string): boolean {
    if (this.sessions.has(id)) {
      return true;
    }

    const isWindows = process.platform === 'win32';
    const shell = customShell || (isWindows ? 'powershell.exe' : '/bin/bash');
    const cwd = customCwd || os.homedir();

    const args = isWindows && shell.includes('powershell')
      ? ['-NoLogo', '-NoExit', '-ExecutionPolicy', 'Bypass']
      : [];

    try {
      const child = spawn(shell, args, {
        cwd,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          COLORTERM: 'truecolor',
        },
      });

      const session: TerminalSession = {
        id,
        process: child,
        buffer: [],
      };

      child.stdout.on('data', (data: Buffer) => {
        const text = data.toString('utf-8');
        session.buffer.push(text);
        if (session.buffer.length > 500) session.buffer.shift();
        this.window?.webContents.send(IPC_CHANNELS.TERMINAL.OUTPUT, { id, data: text });
      });

      child.stderr.on('data', (data: Buffer) => {
        const text = data.toString('utf-8');
        session.buffer.push(text);
        if (session.buffer.length > 500) session.buffer.shift();
        this.window?.webContents.send(IPC_CHANNELS.TERMINAL.OUTPUT, { id, data: text });
      });

      child.on('close', (code) => {
        this.sessions.delete(id);
        this.window?.webContents.send(IPC_CHANNELS.TERMINAL.EXIT, { id, code });
      });

      child.on('error', (err) => {
        this.window?.webContents.send(IPC_CHANNELS.TERMINAL.OUTPUT, {
          id,
          data: `\r\n[Process Error]: ${err.message}\r\n`,
        });
      });

      this.sessions.set(id, session);
      return true;
    } catch (err) {
      console.error(`Failed to spawn terminal session ${id}:`, err);
      return false;
    }
  }

  public writeInput(id: string, data: string): boolean {
    const session = this.sessions.get(id);
    if (!session || !session.process.stdin.writable) return false;

    session.process.stdin.write(data);
    return true;
  }

  public killSession(id: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;

    try {
      session.process.kill();
      this.sessions.delete(id);
      return true;
    } catch (err) {
      console.error(`Error killing terminal session ${id}:`, err);
      return false;
    }
  }

  public getSessionBuffer(id: string): string[] {
    return this.sessions.get(id)?.buffer || [];
  }

  public killAll() {
    for (const [id] of this.sessions) {
      this.killSession(id);
    }
  }
}
