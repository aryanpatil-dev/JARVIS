import { BrowserWindow } from 'electron';
import { IPC_CHANNELS, ToolCallEvent } from '../../shared/ipc-channels';
import { ToolsService } from './tools.service';
import { AIService } from './ai.service';

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

export class AgentService {
  private toolsService: ToolsService;
  private aiService: AIService;
  private window: BrowserWindow | null = null;
  private activeTasks: Map<string, AgentTask> = new Map();

  constructor(toolsService: ToolsService, aiService: AIService) {
    this.toolsService = toolsService;
    this.aiService = aiService;
  }

  public setWindow(win: BrowserWindow) {
    this.window = win;
  }

  public getAgentPersonas() {
    return [
      {
        id: 'coding',
        name: 'Coding Agent',
        description: 'Specialized in source code inspection, editing, build verification, and debugging.',
        badge: 'ENGINEERING',
        color: '#38bdf8',
      },
      {
        id: 'terminal',
        name: 'Terminal Agent',
        description: 'Automates sequential PowerShell / CMD commands, script execution, and environment setup.',
        badge: 'DEVOPS',
        color: '#10b981',
      },
      {
        id: 'browser',
        name: 'Browser Agent',
        description: 'Performs web requests, tests local dev servers (localhost), and inspects HTTP responses.',
        badge: 'AUTOMATION',
        color: '#a855f7',
      },
      {
        id: 'file',
        name: 'File Agent',
        description: 'Organizes directories, searches files by regex/glob, and performs batch file operations.',
        badge: 'STORAGE',
        color: '#eab308',
      },
      {
        id: 'research',
        name: 'Research Agent',
        description: 'Gathers context, analyzes project architecture, and generates structured reports.',
        badge: 'INTELLIGENCE',
        color: '#ec4899',
      },
      {
        id: 'system',
        name: 'System Agent',
        description: 'Monitors host hardware, detects resource hogs, analyzes memory leaks, and manages processes.',
        badge: 'HARDWARE',
        color: '#f97316',
      },
    ];
  }

  public async runAgentTask(
    agentType: 'coding' | 'terminal' | 'browser' | 'file' | 'research' | 'system',
    prompt: string
  ): Promise<string> {
    const taskId = `task-${Date.now()}`;
    const task: AgentTask = {
      id: taskId,
      agentType,
      prompt,
      status: 'running',
      steps: [],
      startTime: Date.now(),
    };

    this.activeTasks.set(taskId, task);
    this.emitTaskUpdate(task);

    // Formulate specialized persona prompt prefix
    const personaPrefixes: Record<string, string> = {
      coding: `[ROLE: CODING AGENT] Focus on inspecting code, making precise file edits, testing builds with execute_command, and explaining solutions.`,
      terminal: `[ROLE: TERMINAL AGENT] Focus on running terminal commands, setting up environments, and executing CLI workflows.`,
      browser: `[ROLE: BROWSER AGENT] Focus on testing web endpoints, checking localhost HTTP ports, and validating web server status.`,
      file: `[ROLE: FILE AGENT] Focus on filesystem scanning, directory structure maintenance, and file searches.`,
      research: `[ROLE: RESEARCH AGENT] Focus on architecture review, synthesizing documentation, and providing clear technical conclusions.`,
      system: `[ROLE: SYSTEM AGENT] Focus on inspecting host CPU/RAM telemetry, active processes, and diagnosing bottlenecks.`,
    };

    const fullPrompt = `${personaPrefixes[agentType] || ''}\n\nTask: ${prompt}`;

    // Execute through AI engine
    try {
      await this.aiService.processPrompt(fullPrompt);
      task.status = 'completed';
      task.endTime = Date.now();
      this.emitTaskUpdate(task);
      return taskId;
    } catch (err) {
      task.status = 'failed';
      task.endTime = Date.now();
      this.emitTaskUpdate(task);
      throw err;
    }
  }

  private emitTaskUpdate(task: AgentTask) {
    this.window?.webContents.send('agent:taskUpdate', task);
  }
}
