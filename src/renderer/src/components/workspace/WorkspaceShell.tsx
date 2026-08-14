import { useState } from 'react';
import {
  Terminal,
  Cpu,
  Sparkles,
  Layers,
  Search,
  FolderTree,
  Shield,
  Activity,
  Plus,
  ArrowUpRight,
  Database,
  Radio,
  Zap,
} from 'lucide-react';
import type { SystemMetrics } from '../../types/electron';

interface WorkspaceShellProps {
  metrics: SystemMetrics | null;
  securityMode: 'SAFE' | 'NORMAL' | 'POWER';
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onSelectSubsystem: (name: string) => void;
}

export const WorkspaceShell = ({
  metrics,
  securityMode,
  onOpenCommandPalette,
  onOpenSettings,
  onSelectSubsystem,
}: WorkspaceShellProps) => {
  const [activeWorkspace, setActiveWorkspace] = useState('Core');
  const [promptInput, setPromptInput] = useState('');

  const workspaces = [
    { id: 'Core', name: 'Core Workspace', count: '3 Subsystems', active: true },
    { id: 'Dev', name: 'Development', count: 'React, Node, Git', active: false },
    { id: 'Research', name: 'AI & Research', count: 'Docs, Notes', active: false },
  ];

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      onOpenCommandPalette();
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 38px)' }}>
      {/* Left Sidebar */}
      <aside
        style={{
          width: '240px',
          backgroundColor: '#0a0d14',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '14px 10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Workspace Switcher */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 6px 8px 6px',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#64748b',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                WORKSPACES
              </span>
              <button
                title="Create Workspace"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <Plus size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {workspaces.map((ws) => {
                const isSelected = activeWorkspace === ws.id;
                return (
                  <div
                    key={ws.id}
                    onClick={() => setActiveWorkspace(ws.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '5px',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      border: isSelected ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                      color: isSelected ? '#38bdf8' : '#cbd5e1',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                    }}
                  >
                    <Layers size={14} color={isSelected ? '#38bdf8' : '#64748b'} />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{ws.name}</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{ws.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subsystems Navigation */}
          <div>
            <div
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#64748b',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                padding: '0 6px 8px 6px',
              }}
            >
              SUBSYSTEMS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { name: 'PTY Terminal', icon: <Terminal size={13} />, action: 'Terminal' },
                { name: 'File Explorer', icon: <FolderTree size={13} />, action: 'Files' },
                { name: 'AI Orchestrator', icon: <Sparkles size={13} />, action: 'AI' },
                { name: 'Telemetry Hub', icon: <Cpu size={13} />, action: 'Telemetry' },
              ].map((item) => (
                <div
                  key={item.name}
                  onClick={() => onSelectSubsystem(item.action)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 10px',
                    borderRadius: '4px',
                    color: '#94a3b8',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Engine status footer */}
        <div
          style={{
            backgroundColor: '#080a0f',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div
            onClick={onOpenSettings}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield
                size={12}
                color={securityMode === 'SAFE' ? '#10b981' : securityMode === 'NORMAL' ? '#38bdf8' : '#ef4444'}
              />
              <span style={{ color: '#cbd5e1' }}>{securityMode} MODE</span>
            </div>
            <span style={{ color: '#64748b' }}>EDIT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
            <Activity size={12} color="#38bdf8" />
            <span>JARVIS ENGINE: READY</span>
          </div>
        </div>
      </aside>

      {/* Main Center Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#08090b',
          padding: '18px 24px',
          gap: '18px',
          overflowY: 'auto',
        }}
      >
        {/* Natural Language Prompt Center */}
        <form onSubmit={handlePromptSubmit}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#0d1017',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px',
              padding: '12px 18px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(56, 189, 248, 0.05)',
            }}
          >
            <Sparkles size={18} color="#38bdf8" />
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Tell JARVIS what you want to accomplish or press Ctrl+K..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f8fafc',
                fontSize: '14px',
                fontFamily: 'var(--font-sans)',
              }}
            />
            <button
              type="button"
              onClick={onOpenCommandPalette}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: '#161c28',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                color: '#94a3b8',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
              }}
            >
              <Search size={12} />
              <span>COMMANDS</span>
              <kbd style={{ fontSize: '9px', marginLeft: '4px', color: '#64748b' }}>CTRL+K</kbd>
            </button>
          </div>
        </form>

        {/* Dashboard Bento Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flex: 1 }}>
          {/* Card 1: PTY Terminal */}
          <div
            onClick={() => onSelectSubsystem('Terminal')}
            style={{
              backgroundColor: '#0a0d14',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '8px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                  <Terminal size={18} />
                  <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    REAL PTY TERMINAL
                  </span>
                </div>
                <ArrowUpRight size={14} color="#64748b" />
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
                Direct bidirectional Windows process execution, streaming PowerShell & CMD sessions.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#06080c',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                padding: '8px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#64748b',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>SESSION: ACTIVE (PS64)</span>
              <span style={{ color: '#10b981' }}>CONNECTED</span>
            </div>
          </div>

          {/* Card 2: Telemetry Matrix */}
          <div
            onClick={() => onSelectSubsystem('Telemetry')}
            style={{
              backgroundColor: '#0a0d14',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '8px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                  <Cpu size={18} />
                  <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    HARDWARE TELEMETRY
                  </span>
                </div>
                <ArrowUpRight size={14} color="#64748b" />
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
                Real-time native CPU core utilization, memory allocations, and process tree analytics.
              </p>
            </div>

            {metrics && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                  <span>MEMORY LOAD</span>
                  <span style={{ color: '#10b981' }}>{metrics.memoryUsagePercent}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${metrics.memoryUsagePercent}%`, height: '100%', backgroundColor: '#10b981' }} />
                </div>
              </div>
            )}
          </div>

          {/* Card 3: AI Agent Orchestration */}
          <div
            onClick={() => onSelectSubsystem('AI')}
            style={{
              backgroundColor: '#0a0d14',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '8px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
                  <Zap size={18} />
                  <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    AGENT ORCHESTRATOR
                  </span>
                </div>
                <ArrowUpRight size={14} color="#64748b" />
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
                Gemini-powered autonomous agents: Coding, Browser, Filesystem, Terminal, and Research.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#06080c',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                padding: '8px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#64748b',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>6 REGISTERED AGENTS</span>
              <span style={{ color: '#f59e0b' }}>STANDBY</span>
            </div>
          </div>
        </div>

        {/* Tactical Quick Action Bar */}
        <div
          style={{
            backgroundColor: '#0a0d14',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '6px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#94a3b8',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={12} color="#38bdf8" />
              <span>ENVIRONMENT: ONLINE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={12} color="#10b981" />
              <span>PERSISTENCE: LOCAL</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>SHORTCUTS:</span>
            <kbd style={{ backgroundColor: '#141824', padding: '2px 5px', borderRadius: '3px', color: '#cbd5e1' }}>
              Ctrl+K
            </kbd>
            <span>Command Palette</span>
            <kbd style={{ backgroundColor: '#141824', padding: '2px 5px', borderRadius: '3px', color: '#cbd5e1' }}>
              Ctrl+,
            </kbd>
            <span>Settings</span>
          </div>
        </div>
      </main>
    </div>
  );
};
