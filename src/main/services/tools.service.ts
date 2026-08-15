import { exec } from 'child_process';
import { FilesystemService } from './filesystem.service';
import { TelemetryService } from './telemetry.service';
import os from 'os';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (args: Record<string, any>) => Promise<any>;
}

export class ToolsService {
  private filesystem: FilesystemService;
  private telemetry: TelemetryService;

  constructor(fsService: FilesystemService, telemService: TelemetryService) {
    this.filesystem = fsService;
    this.telemetry = telemService;
  }

  public getToolDeclarations() {
    return [
      {
        name: 'execute_command',
        description: 'Execute a real shell command on the host Windows system (PowerShell / CMD) and return the stdout, stderr, and exit code.',
        parameters: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'The shell command line to execute (e.g. "dir", "git status", "node -v").',
            },
            cwd: {
              type: 'string',
              description: 'Optional working directory path.',
            },
          },
          required: ['command'],
        },
      },
      {
        name: 'read_file',
        description: 'Read the text content of a file from the host filesystem.',
        parameters: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Absolute or relative path to the file to read.',
            },
          },
          required: ['filePath'],
        },
      },
      {
        name: 'write_file',
        description: 'Create or overwrite a file on the host filesystem with provided text content.',
        parameters: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Absolute or relative path to the file to write.',
            },
            content: {
              type: 'string',
              description: 'The complete text content to write into the file.',
            },
          },
          required: ['filePath', 'content'],
        },
      },
      {
        name: 'list_directory',
        description: 'List the contents of a directory on the host filesystem.',
        parameters: {
          type: 'object',
          properties: {
            dirPath: {
              type: 'string',
              description: 'Path of the directory to list.',
            },
          },
          required: ['dirPath'],
        },
      },
      {
        name: 'get_system_telemetry',
        description: 'Get real-time CPU utilization, per-core metrics, RAM usage, and uptime of the host computer.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_running_processes',
        description: 'List active Windows processes consuming CPU and memory on the system.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }

  public async executeTool(name: string, args: Record<string, any>): Promise<any> {
    switch (name) {
      case 'execute_command': {
        const cmd = args.command;
        const cwd = args.cwd || os.homedir();
        return new Promise((resolve) => {
          exec(cmd, { cwd, timeout: 30000, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
            resolve({
              stdout: stdout?.trim() || '',
              stderr: stderr?.trim() || '',
              exitCode: err ? (err.code || 1) : 0,
              error: err ? err.message : null,
            });
          });
        });
      }

      case 'read_file': {
        return this.filesystem.readFileContent(args.filePath);
      }

      case 'write_file': {
        const success = this.filesystem.writeFileContent(args.filePath, args.content);
        return { success, filePath: args.filePath };
      }

      case 'list_directory': {
        const items = this.filesystem.readDirectory(args.dirPath);
        return { count: items.length, items: items.slice(0, 50) };
      }

      case 'get_system_telemetry': {
        return this.telemetry.getDetailedStats();
      }

      case 'list_running_processes': {
        const procs = await this.telemetry.getProcesses();
        return { count: procs.length, processes: procs.slice(0, 15) };
      }

      default:
        throw new Error(`Tool "${name}" is not recognized.`);
    }
  }
}
