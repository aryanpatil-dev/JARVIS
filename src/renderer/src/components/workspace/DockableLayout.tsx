import { useEffect } from 'react';
import { TerminalPanel } from '../terminal/TerminalPanel';
import { FilesystemPanel } from '../filesystem/FilesystemPanel';
import { TelemetryPanel } from '../telemetry/TelemetryPanel';
import { AIStudioPanel } from '../ai/AIStudioPanel';
import { AgentHubPanel } from '../agents/AgentHubPanel';
import {
  Terminal,
  FolderTree,
  Activity,
  LayoutGrid,
  Columns,
  Sparkles,
  Bot,
} from 'lucide-react';
import type { SystemMetrics } from '../../types/electron';

export type ViewMode =
  | 'overview'
  | 'ai'
  | 'agents'
  | 'terminal'
  | 'filesystem'
  | 'telemetry'
  | 'split-ai-term'
  | 'split-term-fs'
  | 'split-term-telem';

interface DockableLayoutProps {
  metrics?: SystemMetrics | null;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
}

export const DockableLayout = ({
  activeView,
  onViewChange,
  onOpenCommandPalette,
  onOpenSettings,
}: DockableLayoutProps) => {
  // Save workspace view mode to local persistence
  useEffect(() => {
    if (window.jarvisAPI?.workspace) {
      window.jarvisAPI.workspace.saveState({ activeTab: activeView as any });
    }
  }, [activeView]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '10px' }}>
      {/* Subsystem Dock Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px',
          backgroundColor: '#0c0f17',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '6px',
        }}
      >
        {/* View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Matrix Overview', icon: <LayoutGrid size={13} /> },
            { id: 'ai', label: 'AI Studio', icon: <Sparkles size={13} color="#f59e0b" /> },
            { id: 'agents', label: 'Agent Hub', icon: <Bot size={13} color="#38bdf8" /> },
            { id: 'terminal', label: 'PTY Terminal', icon: <Terminal size={13} /> },
            { id: 'filesystem', label: 'File Explorer', icon: <FolderTree size={13} /> },
            { id: 'telemetry', label: 'Telemetry', icon: <Activity size={13} /> },
            { id: 'split-ai-term', label: 'AI + Terminal', icon: <Columns size={13} /> },
            { id: 'split-term-fs', label: 'Terminal + Files', icon: <Columns size={13} /> },
          ].map((mode) => {
            const isSelected = activeView === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onViewChange(mode.id as ViewMode)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  border: isSelected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                  color: isSelected ? '#38bdf8' : '#94a3b8',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenCommandPalette}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#121622',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              color: '#94a3b8',
              padding: '4px 8px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={11} color="#38bdf8" />
            <span>COMMAND CENTER (Ctrl+K)</span>
          </button>
        </div>
      </div>

      {/* Main Dock Content Container */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {activeView === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', width: '100%', height: '100%' }}>
            {/* Terminal Left */}
            <div style={{ gridRow: 'span 2', height: '100%' }}>
              <TerminalPanel />
            </div>

            {/* Files Top Right */}
            <div style={{ height: '100%' }}>
              <FilesystemPanel />
            </div>

            {/* Telemetry Bottom Right */}
            <div style={{ height: '100%' }}>
              <TelemetryPanel />
            </div>
          </div>
        )}

        {activeView === 'ai' && (
          <div style={{ width: '100%', height: '100%' }}>
            <AIStudioPanel onOpenSettings={onOpenSettings} />
          </div>
        )}

        {activeView === 'agents' && (
          <div style={{ width: '100%', height: '100%' }}>
            <AgentHubPanel onOpenSettings={onOpenSettings} />
          </div>
        )}

        {activeView === 'terminal' && (
          <div style={{ width: '100%', height: '100%' }}>
            <TerminalPanel />
          </div>
        )}

        {activeView === 'filesystem' && (
          <div style={{ width: '100%', height: '100%' }}>
            <FilesystemPanel />
          </div>
        )}

        {activeView === 'telemetry' && (
          <div style={{ width: '100%', height: '100%' }}>
            <TelemetryPanel />
          </div>
        )}

        {activeView === 'split-ai-term' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '10px', width: '100%', height: '100%' }}>
            <AIStudioPanel onOpenSettings={onOpenSettings} />
            <TerminalPanel />
          </div>
        )}

        {activeView === 'split-term-fs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '10px', width: '100%', height: '100%' }}>
            <TerminalPanel />
            <FilesystemPanel />
          </div>
        )}
      </div>
    </div>
  );
};
