import { GoogleGenAI } from '@google/genai';
import { BrowserWindow } from 'electron';
import { IPC_CHANNELS, ToolCallEvent } from '../../shared/ipc-channels';
import { ToolsService } from './tools.service';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export class AIService {
  private apiKey: string = '';
  private configPath: string;
  private toolsService: ToolsService;
  private window: BrowserWindow | null = null;
  private isGenerating: boolean = false;

  constructor(toolsService: ToolsService) {
    this.toolsService = toolsService;
    const userData = app.getPath('userData');
    this.configPath = path.join(userData, 'ai-config.json');
    this.loadSavedKey();
  }

  public setWindow(win: BrowserWindow) {
    this.window = win;
  }

  private loadSavedKey() {
    try {
      if (fs.existsSync(this.configPath)) {
        const raw = fs.readFileSync(this.configPath, 'utf-8');
        const data = JSON.parse(raw);
        this.apiKey = data.apiKey || '';
      }
    } catch {
      this.apiKey = '';
    }
  }

  public saveApiKey(key: string): boolean {
    try {
      this.apiKey = key.trim();
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.configPath, JSON.stringify({ apiKey: this.apiKey }), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed to save API key:', err);
      return false;
    }
  }

  public hasApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  public cancelGeneration() {
    this.isGenerating = false;
  }

  public async processPrompt(prompt: string, modelName: string = 'gemini-2.5-flash'): Promise<void> {
    if (!this.hasApiKey()) {
      this.window?.webContents.send(IPC_CHANNELS.AI.STREAM_CHUNK, {
        text: '⚠️ **Gemini API Key is not configured.**\n\nPlease click the Settings icon (`Ctrl+,`) in the top right to configure your Google Gemini API key to activate autonomous agent workflows and tool execution.',
        done: true,
      });
      return;
    }

    this.isGenerating = true;

    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const tools = this.toolsService.getToolDeclarations();

      const systemInstruction = `You are JARVIS, an elite AI operating environment running natively on the user's host Windows system.
You are NOT a web chatbot. You have direct host tools to inspect files, execute real terminal commands, monitor CPU/RAM telemetry, and inspect running processes.
When asked to perform tasks:
1. Formulate a clear plan.
2. Select and call the appropriate native tools (e.g. execute_command, read_file, write_file, get_system_telemetry).
3. Explain your actions and summarize findings concisely with high technical precision.
Always maintain the persona of an intelligent, tactical, ultra-fast engineering operating system.`;

      // Formulate request with function declarations
      const functionDeclarations = tools.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters as any,
      }));

      const chat = ai.chats.create({
        model: modelName,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations }],
        },
      });

      let response = await chat.sendMessage({
        message: prompt,
      });

      // Loop while the model makes tool calls
      while (response.functionCalls && response.functionCalls.length > 0 && this.isGenerating) {
        const functionCall = response.functionCalls[0];
        const toolName = functionCall?.name;
        if (!toolName) break;

        const callId = `call-${Date.now()}`;

        const toolEvent: ToolCallEvent = {
          id: callId,
          tool: toolName,
          args: (functionCall.args as Record<string, unknown>) || {},
          status: 'executing',
        };

        this.window?.webContents.send(IPC_CHANNELS.AI.TOOL_EVENT, toolEvent);

        try {
          const toolResult = await this.toolsService.executeTool(
            toolName,
            (functionCall.args as Record<string, any>) || {}
          );

          this.window?.webContents.send(IPC_CHANNELS.AI.TOOL_EVENT, {
            ...toolEvent,
            status: 'completed',
            result: toolResult,
          });

          // Send function result back to chat
          response = await chat.sendMessage({
            message: [
              {
                functionResponse: {
                  name: toolName,
                  response: { result: toolResult },
                },
              },
            ],
          });
        } catch (toolErr) {
          const errMsg = (toolErr as Error).message;
          this.window?.webContents.send(IPC_CHANNELS.AI.TOOL_EVENT, {
            ...toolEvent,
            status: 'failed',
            error: errMsg,
          });

          response = await chat.sendMessage({
            message: [
              {
                functionResponse: {
                  name: functionCall.name,
                  response: { error: errMsg },
                },
              },
            ],
          });
        }
      }

      // Stream / send final text response
      const finalText = response.text || 'Task completed.';
      this.window?.webContents.send(IPC_CHANNELS.AI.STREAM_CHUNK, {
        text: finalText,
        done: true,
      });
    } catch (err) {
      console.error('Error during AI processing:', err);
      this.window?.webContents.send(IPC_CHANNELS.AI.STREAM_CHUNK, {
        text: `\n\n❌ **AI Engine Error**: ${(err as Error).message}\n\nPlease check your Gemini API key or network connection.`,
        done: true,
      });
    } finally {
      this.isGenerating = false;
    }
  }
}
