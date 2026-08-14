import { useState, useEffect, useMemo, useCallback } from 'react';
import { Titlebar } from './components/titlebar/Titlebar';
import { BootSequence } from './components/boot/BootSequence';
import { CommandPalette, CommandItem } from './components/command/CommandPalette';
import { SettingsModal } from './components/settings/SettingsModal';
import { WorkspaceShell } from './components/workspace/WorkspaceShell';
import { Terminal, Settings, Shield, RefreshCw, Cpu, Layers, Power, Folder } from 'lucide-react';
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

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Ctrl + , -> Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handler functions
  const handleSubsystemSelect = useCallback((subsystem: string) => {
    console.log(`Navigating to subsystem: ${subsystem}`);
    if (subsystem === 'Terminal') {
      setIsCommandPaletteOpen(true);
    }
  }, []);

  // Command Palette Items
  const commands: CommandItem[] = useMemo(
    () => [
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
        id: 'switch-workspace-core',
        title: 'Switch to Core Workspace',
        category: 'Workspace',
        icon: <Layers size={14} />,
        action: () => console.log('Switched to Core'),
      },
      {
        id: 'switch-workspace-dev',
        title: 'Switch to Development Workspace',
        category: 'Workspace',
        icon: <Folder size={14} />,
        action: () => console.log('Switched to Dev'),
      },
      {
        id: 'open-terminal',
        title: 'Spawn PTY Terminal Console',
        category: 'Terminal',
        shortcut: 'Ctrl+`',
        icon: <Terminal size={14} />,
        action: () => console.log('Spawning Terminal session'),
      },
      {
        id: 'system-diagnostic',
        title: 'Run Real-time System Diagnostics',
        category: 'System',
        icon: <Cpu size={14} />,
        action: () => console.log('Running diagnostics'),
      },
      {
        id: 'replay-boot',
        title: 'Replay Cinematic Boot Sequence',
        category: 'AI',
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        position: 'relative',
      }}
    >
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

      {/* Tactical Titlebar */}
      <Titlebar metrics={metrics} onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Workspace Viewport */}
      <WorkspaceShell
        metrics={metrics}
        securityMode={securityMode}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectSubsystem={handleSubsystemSelect}
      />

      {/* Raycast Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCommand={(cmd) => cmd.action()}
        commands={commands}
      />

      {/* Settings Modal */}
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
  );
}
