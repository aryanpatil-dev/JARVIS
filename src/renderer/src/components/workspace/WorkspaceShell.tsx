import { useState } from 'react';
import {
  Terminal,
  Cpu,
  Layers,
  FolderTree,
  Shield,
  Activity,
  Plus,
  Columns,
  Sparkles,
  Bot,
} from 'lucide-react';
import { DockableLayout, ViewMode } from './DockableLayout';
import type { SystemMetrics } from '../../types/electron';

interface WorkspaceShellProps {
  metrics: SystemMetrics | null;
  securityMode: 'SAFE' | 'NORMAL' | 'POWER';
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const WorkspaceShell = ({
  metrics,
  securityMode,
  onOpenCommandPalette,
  onOpenSettings,
  activeView,
  onViewChange,
}: WorkspaceShellProps) => {
  const [activeWorkspace, setActiveWorkspace] = useState('Core');
  const [workspaces, setWorkspaces] = useState([
    { id: 'Core', name: 'Core Workspace', count: '5 Subsystems' },
    { id: 'Dev', name: 'Development', count: 'React, Node, Git' },
    { id: 'Research', name: 'AI & Research', count: 'Docs, Notes' },
  ]);

  const handleCreateWorkspace = () => {
    const name = prompt('Enter new workspace name:');
    if (name && name.trim()) {
      const newWs = {
        id: `ws-${Date.now()}`,
        name: name.trim(),
        count: '0 Subsystems',
      };
      setWorkspaces((prev) => [...prev, newWs]);
      setActiveWorkspace(newWs.id);
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 38px)' }}>
      {/* Left Sidebar */}
      <aside
        style={{
          width: '230px',
          backgroundColor: '#0a0d14',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '12px 10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Workspace Switcher */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 6px 6px 6px',
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
                onClick={handleCreateWorkspace}
                title="Create Workspace"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'padding',
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
                      padding: '7px 9px',
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
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                      <span style={{ fontWeight: isSelected ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ws.name}
                      </span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>{ws.count}</span>
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
                padding: '0 6px 6px 6px',
              }}
            >
              VIEWS & SUBSYSTEMS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { name: 'Matrix Overview', icon: <Columns size={13} />, mode: 'overview' },
                { name: 'AI Studio', icon: <Sparkles size={13} color="#f59e0b" />, mode: 'ai' },
                { name: 'Agent Hub', icon: <Bot size={13} color="#38bdf8" />, mode: 'agents' },
                { name: 'PTY Terminal', icon: <Terminal size={13} />, mode: 'terminal' },
                { name: 'File Explorer', icon: <FolderTree size={13} />, mode: 'filesystem' },
                { name: 'Hardware Telemetry', icon: <Cpu size={13} />, mode: 'telemetry' },
              ].map((item) => {
                const isActive = activeView === item.mode;
                return (
                  <div
                    key={item.name}
                    onClick={() => onViewChange(item.mode as ViewMode)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 9px',
                      borderRadius: '4px',
                      color: isActive ? '#38bdf8' : '#94a3b8',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                );
              })}
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
            <span>JARVIS AGENTS: READY</span>
          </div>
        </div>
      </aside>

      {/* Main Center Area with Dockable Panels */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#08090b',
          padding: '10px 14px',
          overflow: 'hidden',
        }}
      >
        <DockableLayout
          metrics={metrics}
          activeView={activeView}
          onViewChange={onViewChange}
          onOpenCommandPalette={onOpenCommandPalette}
          onOpenSettings={onOpenSettings}
        />
      </main>
    </div>
  );
};
