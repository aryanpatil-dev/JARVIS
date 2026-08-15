import { useState, useEffect, useMemo, useCallback } from 'react';
import { Titlebar } from './components/titlebar/Titlebar';
import { BootSequence } from './components/boot/BootSequence';
import { CommandPalette, CommandItem } from './components/command/CommandPalette';
import { SettingsModal } from './components/settings/SettingsModal';
import { WorkspaceShell } from './components/workspace/WorkspaceShell';
import { ViewMode } from './components/workspace/DockableLayout';
import { TacticalBackground } from './components/common/TacticalBackground';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { soundEffects } from './services/sound.service';
import { voiceEngine } from './services/voice.service';
import {
  Terminal,
  Settings,
  Shield,
  RefreshCw,
  Cpu,
  Power,
  FolderTree,
  Columns,
  LayoutGrid,
  Sparkles,
  Bot,
  Mic,
  Database,
} from 'lucide-react';
import type { SystemMetrics } from './types/electron';

export default function App() {
  // State management
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [securityMode, setSecurityMode] = useState<'SAFE' | 'NORMAL' | 'POWER'>('SAFE');
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [showBootSequenceSetting, setShowBootSequenceSetting] = useState(true);
  const [bootCompleted, setBootCompleted] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>('overview');

  // Periodic Telemetry
  useEffect(() => {
    const fetchMetrics = async () => {
      if (window.jarvisAPI?.system) {
        try {
          const data = await window.jarvisAPI.system.getMetrics();
          setMetrics(data);
        } catch (err) {
          console.error('Failed to get metrics:', err);
        }
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2500);
    return () => clearInterval(interval);
  }, []);

  // Voice transcript handler
  const handleVoiceTranscript = useCallback((text: string) => {
    setActiveView('ai');
    if (window.jarvisAPI?.ai) {
      window.jarvisAPI.ai.prompt(text);
    }
  }, []);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundEffects.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Ctrl + , -> Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        soundEffects.playClick();
        setIsSettingsOpen((prev) => !prev);
      }
      // Ctrl + M -> Toggle Voice Mic
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        voiceEngine.toggleListening();
      }
      // Number hotkeys for view switching
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        soundEffects.playClick();
        setActiveView('overview');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        soundEffects.playClick();
        setActiveView('ai');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '3') {
        e.preventDefault();
        soundEffects.playClick();
        setActiveView('agents');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '4') {
        e.preventDefault();
        soundEffects.playClick();
        setActiveView('memory');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '5') {
        e.preventDefault();
        soundEffects.playClick();
        setActiveView('terminal');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '6') {
        e.preventDefault();
        soundEffects.playClick();
        setActiveView('filesystem');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '7') {
        e.preventDefault();
        soundEffects.playClick();
        setActiveView('telemetry');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Command Palette Items
  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'view-overview',
        title: 'Switch View: Matrix Overview',
        category: 'Workspace',
        shortcut: 'Ctrl+1',
        icon: <LayoutGrid size={14} />,
        action: () => setActiveView('overview'),
      },
      {
        id: 'view-ai',
        title: 'Focus View: AI Orchestration Studio',
        category: 'AI',
        shortcut: 'Ctrl+2',
        icon: <Sparkles size={14} color="#f59e0b" />,
        action: () => setActiveView('ai'),
      },
      {
        id: 'view-agents',
        title: 'Focus View: Autonomous Agent Hub',
        category: 'Agents',
        shortcut: 'Ctrl+3',
        icon: <Bot size={14} color="#38bdf8" />,
        action: () => setActiveView('agents'),
      },
      {
        id: 'view-memory',
        title: 'Focus View: Memory & Knowledge Vault',
        category: 'Workspace',
        shortcut: 'Ctrl+4',
        icon: <Database size={14} color="#c084fc" />,
        action: () => setActiveView('memory'),
      },
      {
        id: 'toggle-mic',
        title: 'Toggle Voice Microphone Listening',
        category: 'System',
        shortcut: 'Ctrl+M',
        icon: <Mic size={14} color="#10b981" />,
        action: () => voiceEngine.toggleListening(),
      },
      {
        id: 'view-terminal',
        title: 'Focus View: PTY Terminal Console',
        category: 'Terminal',
        shortcut: 'Ctrl+5',
        icon: <Terminal size={14} />,
        action: () => setActiveView('terminal'),
      },
      {
        id: 'view-filesystem',
        title: 'Focus View: File Explorer Matrix',
        category: 'Workspace',
        shortcut: 'Ctrl+6',
        icon: <FolderTree size={14} />,
        action: () => setActiveView('filesystem'),
      },
      {
        id: 'view-telemetry',
        title: 'Focus View: Hardware Telemetry & Processes',
        category: 'System',
        shortcut: 'Ctrl+7',
        icon: <Cpu size={14} />,
        action: () => setActiveView('telemetry'),
      },
      {
        id: 'view-split-ai-term',
        title: 'Split View: AI Studio + Terminal',
        category: 'AI',
        icon: <Columns size={14} />,
        action: () => setActiveView('split-ai-term'),
      },
      {
        id: 'view-split-files',
        title: 'Split View: Terminal + Filesystem',
        category: 'Workspace',
        icon: <Columns size={14} />,
        action: () => setActiveView('split-term-fs'),
      },
      {
        id: 'open-settings',
        title: 'Open Settings Configuration',
        category: 'Settings',
        shortcut: 'Ctrl+,',
        icon: <Settings size={14} />,
        action: () => setIsSettingsOpen(true),
      },
      {
        id: 'toggle-safe-mode',
        title: `Security Mode: Cycle (Current: ${securityMode})`,
        category: 'System',
        icon: <Shield size={14} />,
        action: () => {
          setSecurityMode((prev) => (prev === 'SAFE' ? 'NORMAL' : prev === 'NORMAL' ? 'POWER' : 'SAFE'));
        },
      },
      {
        id: 'replay-boot',
        title: 'Replay Cinematic Boot Sequence',
        category: 'System',
        icon: <RefreshCw size={14} />,
        action: () => setBootCompleted(false),
      },
      {
        id: 'exit-jarvis',
        title: 'Exit JARVIS Environment',
        category: 'System',
        icon: <Power size={14} color="#ef4444" />,
        action: () => window.jarvisAPI?.window.close(),
      },
    ],
    [securityMode]
  );

  return (
    <ErrorBoundary>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          backgroundColor: 'var(--bg-app)',
          color: 'var(--text-primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dynamic Ambient Background Particle Mesh */}
        <TacticalBackground />

        {/* Optional Scanlines CRT Overlay */}
        {scanlinesEnabled && (
          <div
            className="scanlines-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Boot Animation */}
        {!bootCompleted && showBootSequenceSetting && (
          <BootSequence onComplete={() => setBootCompleted(true)} />
        )}

        {/* Tactical Titlebar with Voice Waveform HUD */}
        <Titlebar
          metrics={metrics}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onVoiceTranscript={handleVoiceTranscript}
        />

        {/* Main Workspace Viewport */}
        <WorkspaceShell
          metrics={metrics}
          securityMode={securityMode}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Raycast Command Palette Modal */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectCommand={(cmd) => cmd.action()}
          commands={commands}
        />

        {/* Settings Modal with API Key Config & Voice Controls */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          metrics={metrics}
          securityMode={securityMode}
          onSecurityModeChange={setSecurityMode}
          showBootSequence={showBootSequenceSetting}
          onToggleBootSequence={setShowBootSequenceSetting}
          scanlinesEnabled={scanlinesEnabled}
          onToggleScanlines={setScanlinesEnabled}
        />
      </div>
    </ErrorBoundary>
  );
}
