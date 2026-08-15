import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Send,
  Square,
  Key,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import type { ChatMessage, ToolCallEvent } from '../../types/electron';

interface AIStudioPanelProps {
  onOpenSettings: () => void;
}

export const AIStudioPanel = ({ onOpenSettings }: AIStudioPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'jarvis',
      content:
        '**JARVIS AI Core Online.**\n\nI am connected to your host Windows operating system with direct access to pseudo-terminals, local filesystems, and live hardware telemetry. Tell me what you want to inspect, build, or automate.',
      timestamp: Date.now(),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash-lite');
  const [hasApiKey, setHasApiKey] = useState(true);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check API key status on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.jarvisAPI?.ai) {
        const keyConfigured = await window.jarvisAPI.ai.getKeyStatus();
        setHasApiKey(keyConfigured);
      }
    };
    checkKey();
  }, []);

  // Listen for streaming chunks
  useEffect(() => {
    if (!window.jarvisAPI?.ai) return;

    const cleanupStream = window.jarvisAPI.ai.onStreamChunk(({ text, done }) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'jarvis' && last.isStreaming) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            content: done ? text : last.content + text,
            isStreaming: !done,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: `msg-${Date.now()}`,
              sender: 'jarvis',
              content: text,
              timestamp: Date.now(),
              isStreaming: !done,
            },
          ];
        }
      });

      if (done) {
        setIsGenerating(false);
      }
    });

    const cleanupTools = window.jarvisAPI.ai.onToolEvent((event: ToolCallEvent) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'jarvis') {
          const updated = [...prev];
          const existingTools = last.toolCalls || [];
          const existingIdx = existingTools.findIndex((t: ToolCallEvent) => t.id === event.id);

          let newTools: ToolCallEvent[];
          if (existingIdx >= 0) {
            newTools = [...existingTools];
            newTools[existingIdx] = event;
          } else {
            newTools = [...existingTools, event];
          }

          updated[updated.length - 1] = {
            ...last,
            toolCalls: newTools,
          };
          return updated;
        }
        return prev;
      });
    });

    return () => {
      cleanupStream();
      cleanupTools();
    };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const prompt = inputPrompt.trim();
    if (!prompt || isGenerating) return;

    setInputPrompt('');
    setIsGenerating(true);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    const jarvisMsg: ChatMessage = {
      id: `jarvis-${Date.now()}`,
      sender: 'jarvis',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
      toolCalls: [],
    };

    setMessages((prev) => [...prev, userMsg, jarvisMsg]);

    try {
      await window.jarvisAPI.ai.prompt(prompt, selectedModel);
    } catch (err) {
      console.error('Failed to send prompt:', err);
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    window.jarvisAPI?.ai.cancel();
    setIsGenerating(false);
  };

  const toggleToolExpand = (toolId: string) => {
    setExpandedTools((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'jarvis',
        content: '**Workspace context reset.** How may I assist you now?',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#07090e',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        overflow: 'hidden',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: '#0c0f17',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
          <Sparkles size={16} />
          <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            AI AGENT ORCHESTRATION STUDIO
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              backgroundColor: '#121622',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#cbd5e1',
              padding: '3px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite (Ultra Fast)</option>
            <option value="gemini-3.1-pro">Gemini 3.1 Pro (Deep Reasoning)</option>
          </select>

          <button
            onClick={handleClearChat}
            title="Clear Conversation"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* API Key Missing Alert */}
      {!hasApiKey && (
        <div
          onClick={onOpenSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#f59e0b',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Key size={13} />
            <span>Gemini API Key is not configured. Click here to add your key in Settings.</span>
          </div>
          <span style={{ fontWeight: 600, textDecoration: 'underline' }}>CONFIGURE NOW</span>
        </div>
      )}

      {/* Message Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '6px',
            }}
          >
            {/* Sender Label */}
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#64748b', textTransform: 'uppercase' }}>
              {msg.sender === 'user' ? 'You' : 'JARVIS // CORE'}
            </div>

            {/* Message Bubble */}
            <div
              style={{
                maxWidth: '85%',
                backgroundColor: msg.sender === 'user' ? 'rgba(56, 189, 248, 0.12)' : '#0d1017',
                border: msg.sender === 'user' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '12px 16px',
                fontSize: '13px',
                lineHeight: '1.5',
                color: '#f1f5f9',
              }}
            >
              {/* Tool Execution Callouts */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                  {msg.toolCalls.map((tool: ToolCallEvent) => {
                    const isExpanded = Boolean(expandedTools[tool.id]);
                    return (
                      <div
                        key={tool.id}
                        style={{
                          backgroundColor: '#07090e',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <div
                          onClick={() => toggleToolExpand(tool.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            backgroundColor: '#0a0d14',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isExpanded ? <ChevronDown size={12} color="#64748b" /> : <ChevronRight size={12} color="#64748b" />}
                            <span style={{ color: '#38bdf8', fontWeight: 600 }}>› {tool.tool}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {tool.status === 'executing' && (
                              <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span className="animate-pulse-glow">●</span> EXECUTING
                              </span>
                            )}
                            {tool.status === 'completed' && (
                              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle size={11} /> SUCCESS
                              </span>
                            )}
                            {tool.status === 'failed' && (
                              <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertCircle size={11} /> FAILED
                              </span>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ padding: '8px 10px', borderTop: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div>
                              <span style={{ color: '#64748b' }}>ARGS: </span>
                              <pre style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', margin: '4px 0' }}>
                                {JSON.stringify(tool.args, null, 2)}
                              </pre>
                            </div>
                            {tool.result ? (
                              <div>
                                <span style={{ color: '#64748b' }}>RESULT: </span>
                                <pre style={{ color: '#10b981', whiteSpace: 'pre-wrap', margin: '4px 0', maxHeight: '160px', overflowY: 'auto' }}>
                                  {typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result, null, 2)}
                                </pre>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Render Markdown Text */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>

              {msg.isStreaming && (
                <span className="animate-cursor-blink" style={{ color: '#38bdf8', marginLeft: '4px' }}>
                  █
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          backgroundColor: '#0a0d14',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          overflowX: 'auto',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span style={{ color: '#64748b' }}>QUICK ACTIONS:</span>
        {[
          { label: 'What is consuming my RAM?', query: 'Inspect running processes and tell me what is consuming the most RAM.' },
          { label: 'Check git status', query: 'Run git status on the workspace and summarize any uncommitted changes.' },
          { label: 'List Desktop files', query: 'List the files on my Desktop.' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setInputPrompt(item.query);
            }}
            style={{
              backgroundColor: '#121622',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              color: '#94a3b8',
              padding: '3px 8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '10px',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input Prompt Box */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          backgroundColor: '#0c0f17',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Give JARVIS a task or ask a question (e.g. 'Check why build failed', 'What processes are running')..."
          style={{
            flex: 1,
            backgroundColor: '#07090e',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '10px 14px',
            color: '#f8fafc',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
          }}
        />

        {isGenerating ? (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ef4444',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            <Square size={13} fill="#ffffff" />
            <span>ABORT</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!inputPrompt.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: inputPrompt.trim() ? '#38bdf8' : '#1e293b',
              border: 'none',
              borderRadius: '6px',
              color: inputPrompt.trim() ? '#08090b' : '#64748b',
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              cursor: inputPrompt.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <Send size={13} />
            <span>SEND</span>
          </button>
        )}
      </form>
    </div>
  );
};
