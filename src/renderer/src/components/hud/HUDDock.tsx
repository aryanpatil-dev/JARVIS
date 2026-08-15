import {
  LayoutGrid,
  Sparkles,
  Bot,
  Database,
  Terminal,
  FolderTree,
  Activity,
  Mic,
  MicOff,
  Settings,
} from 'lucide-react';
import { soundEffects } from '../../services/sound.service';
import { ViewMode } from '../workspace/DockableLayout';

interface HUDDockProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isListening: boolean;
  onToggleMic: () => void;
  onOpenSettings: () => void;
}

export const HUDDock = ({
  activeView,
  onViewChange,
  isListening,
  onToggleMic,
  onOpenSettings,
}: HUDDockProps) => {
  const dockItems = [
    {
      id: 'overview',
      index: '01',
      label: 'Matrix HUD',
      icon: <LayoutGrid size={18} />,
      isAction: false,
    },
    {
      id: 'ai',
      index: '02',
      label: 'AI Studio',
      icon: <Sparkles size={18} color="#00f0ff" />,
      isAction: false,
    },
    {
      id: 'agents',
      index: '03',
      label: 'Agent Hub',
      icon: <Bot size={18} color="#38bdf8" />,
      isAction: false,
    },
    {
      id: 'memory',
      index: '04',
      label: 'Memory Vault',
      icon: <Database size={18} color="#c084fc" />,
      isAction: false,
    },
    {
      id: 'terminal',
      index: '05',
      label: 'PTY Console',
      icon: <Terminal size={18} />,
      isAction: false,
    },
    {
      id: 'filesystem',
      index: '06',
      label: 'File Matrix',
      icon: <FolderTree size={18} />,
      isAction: false,
    },
    {
      id: 'telemetry',
      index: '07',
      label: 'Telemetry',
      icon: <Activity size={18} />,
      isAction: false,
    },
    {
      id: 'mic',
      index: '08',
      label: isListening ? 'Voice [REC]' : 'Voice Mic',
      icon: isListening ? <Mic size={18} color="#ef4444" /> : <MicOff size={18} color="#94a3b8" />,
      isAction: true,
      action: onToggleMic,
    },
    {
      id: 'settings',
      index: '09',
      label: 'Config',
      icon: <Settings size={18} color="#94a3b8" />,
      isAction: true,
      action: onOpenSettings,
    },
  ];

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        padding: '10px 24px',
        backgroundColor: 'rgba(5, 9, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0, 240, 255, 0.2)',
        boxShadow: '0 -8px 25px rgba(0, 240, 255, 0.05)',
      }}
    >
      {dockItems.map((item) => {
        const isSelected = activeView === item.id || (item.id === 'mic' && isListening);

        return (
          <div
            key={item.id}
            onClick={() => {
              soundEffects.playClick();
              if (item.isAction && item.action) {
                item.action();
              } else {
                onViewChange(item.id as ViewMode);
              }
            }}
            title={item.label}
            className={`hud-pod ${isSelected ? 'hud-pod-active' : ''}`}
            style={{
              width: '52px',
              height: '52px',
              backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.16)' : 'rgba(6, 11, 24, 0.8)',
              border: isSelected
                ? '2px solid #00f0ff'
                : '1px solid rgba(0, 240, 255, 0.25)',
              position: 'relative',
            }}
          >
            {/* Concentric Decorative Rings */}
            <div
              style={{
                position: 'absolute',
                inset: '3px',
                borderRadius: '50%',
                border: isSelected
                  ? '1px dashed rgba(0, 240, 255, 0.6)'
                  : '1px solid rgba(0, 240, 255, 0.1)',
                pointerEvents: 'none',
              }}
            />

            {/* Micro Index Label (e.g. 01, 02) */}
            <span
              style={{
                position: 'absolute',
                top: '4px',
                fontSize: '8px',
                fontFamily: 'var(--font-mono)',
                color: isSelected ? '#00f0ff' : '#64748b',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {item.index}
            </span>

            {/* Icon */}
            <div
              style={{
                color: isSelected ? '#00f0ff' : '#94a3b8',
                marginTop: '6px',
                transition: 'color 0.2s ease',
              }}
            >
              {item.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};
