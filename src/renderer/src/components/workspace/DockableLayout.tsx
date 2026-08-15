import { useEffect } from 'react';
import { TerminalPanel } from '../terminal/TerminalPanel';
import { FilesystemPanel } from '../filesystem/FilesystemPanel';
import { TelemetryPanel } from '../telemetry/TelemetryPanel';
import { AIStudioPanel } from '../ai/AIStudioPanel';
import { AgentHubPanel } from '../agents/AgentHubPanel';
import { MemoryPanel } from '../memory/MemoryPanel';
import { ArcReactorCore } from '../hud/ArcReactorCore';
import { HUDLeftWing } from '../hud/HUDLeftWing';
import type { SystemMetrics } from '../../types/electron';

export type ViewMode =
  | 'overview'
  | 'ai'
  | 'agents'
  | 'memory'
  | 'terminal'
  | 'filesystem'
  | 'telemetry'
  | 'split-ai-term'
  | 'split-term-fs';

interface DockableLayoutProps {
  metrics?: SystemMetrics | null;
  securityMode: 'SAFE' | 'NORMAL' | 'POWER';
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  isListening?: boolean;
}

export const DockableLayout = ({
  metrics,
  securityMode,
  activeView,
  onOpenSettings,
  isListening = false,
}: DockableLayoutProps) => {
  useEffect(() => {
    if (window.jarvisAPI?.workspace) {
      window.jarvisAPI.workspace.saveState({ activeTab: activeView as any });
    }
  }, [activeView]);

  return (
    <div style={{ display: 'flex', flex: 1, width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* 1. OVERVIEW: Full Holographic HUD Matrix with Arc Reactor Core + Side Wings */}
      {activeView === 'overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr 340px',
            gap: '14px',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Left Wing: System Diagnostics & Arc Gauges */}
          <HUDLeftWing metrics={metrics || null} securityMode={securityMode} />

          {/* Center: Central Arc Reactor Holographic Core */}
          <div
            className="hud-panel hud-corners"
            style={{
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ArcReactorCore metrics={metrics} isListening={isListening} />
          </div>

          {/* Right Wing: Quick AI Studio & Terminal Widget */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
            <div className="hud-panel hud-corners" style={{ flex: 1, borderRadius: '6px', overflow: 'hidden' }}>
              <AIStudioPanel onOpenSettings={onOpenSettings} />
            </div>
          </div>
        </div>
      )}

      {/* 2. AI STUDIO VIEW */}
      {activeView === 'ai' && (
        <div className="hud-panel hud-corners" style={{ width: '100%', height: '100%', borderRadius: '6px', overflow: 'hidden' }}>
          <AIStudioPanel onOpenSettings={onOpenSettings} />
        </div>
      )}

      {/* 3. AGENT HUB VIEW */}
      {activeView === 'agents' && (
        <div className="hud-panel hud-corners" style={{ width: '100%', height: '100%', borderRadius: '6px', overflow: 'hidden' }}>
          <AgentHubPanel onOpenSettings={onOpenSettings} />
        </div>
      )}

      {/* 4. MEMORY VAULT VIEW */}
      {activeView === 'memory' && (
        <div className="hud-panel hud-corners" style={{ width: '100%', height: '100%', borderRadius: '6px', overflow: 'hidden' }}>
          <MemoryPanel />
        </div>
      )}

      {/* 5. PTY TERMINAL VIEW */}
      {activeView === 'terminal' && (
        <div className="hud-panel hud-corners" style={{ width: '100%', height: '100%', borderRadius: '6px', overflow: 'hidden' }}>
          <TerminalPanel />
        </div>
      )}

      {/* 6. FILESYSTEM EXPLORER VIEW */}
      {activeView === 'filesystem' && (
        <div className="hud-panel hud-corners" style={{ width: '100%', height: '100%', borderRadius: '6px', overflow: 'hidden' }}>
          <FilesystemPanel />
        </div>
      )}

      {/* 7. HARDWARE TELEMETRY VIEW */}
      {activeView === 'telemetry' && (
        <div className="hud-panel hud-corners" style={{ width: '100%', height: '100%', borderRadius: '6px', overflow: 'hidden' }}>
          <TelemetryPanel />
        </div>
      )}

      {/* 8. SPLIT AI + TERMINAL VIEW */}
      {activeView === 'split-ai-term' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', height: '100%' }}>
          <div className="hud-panel hud-corners" style={{ borderRadius: '6px', overflow: 'hidden' }}>
            <AIStudioPanel onOpenSettings={onOpenSettings} />
          </div>
          <div className="hud-panel hud-corners" style={{ borderRadius: '6px', overflow: 'hidden' }}>
            <TerminalPanel />
          </div>
        </div>
      )}

      {/* 9. SPLIT TERMINAL + FILESYSTEM VIEW */}
      {activeView === 'split-term-fs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', height: '100%' }}>
          <div className="hud-panel hud-corners" style={{ borderRadius: '6px', overflow: 'hidden' }}>
            <TerminalPanel />
          </div>
          <div className="hud-panel hud-corners" style={{ borderRadius: '6px', overflow: 'hidden' }}>
            <FilesystemPanel />
          </div>
        </div>
      )}
    </div>
  );
};
