import { Settings, Cpu, HardDrive, Minus, Square, X } from 'lucide-react';
import type { SystemMetrics } from '../../types/electron';

interface TitlebarProps {
  metrics: SystemMetrics | null;
  onOpenSettings: () => void;
}

export const Titlebar = ({ metrics, onOpenSettings }: TitlebarProps) => {
  const handleMinimize = () => window.jarvisAPI?.window.minimize();
  const handleMaximize = () => window.jarvisAPI?.window.maximize();
  const handleClose = () => window.jarvisAPI?.window.close();

  return (
    <header
      className="titlebar-drag-region"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '38px',
        padding: '0 12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        backgroundColor: '#0a0c10',
        fontSize: '12px',
        zIndex: 50,
      }}
    >
      {/* Brand & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          className="animate-pulse-glow"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#38bdf8',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.12em', color: '#f8fafc' }}>
            JARVIS
          </span>
          <span
            style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 5px',
              borderRadius: '3px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.2)',
            }}
          >
            v0.1.0-DEV
          </span>
        </div>
      </div>

      {/* Center Telemetry Readout */}
      <div
        className="no-drag"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#94a3b8',
        }}
      >
        {metrics ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={12} color="#38bdf8" />
              <span>CPU: {metrics.cpuCores} CORES</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <HardDrive size={12} color="#10b981" />
              <span>RAM: {metrics.usedMemoryGB} / {metrics.totalMemoryGB} GB ({metrics.memoryUsagePercent}%)</span>
            </div>
          </>
        ) : (
          <span style={{ color: '#64748b' }}>TELEMETRY CONNECTING...</span>
        )}
      </div>

      {/* Right Controls */}
      <div className="no-drag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Settings (Ctrl+,)"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <Settings size={14} />
        </button>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '0 4px' }} />

        {/* Window state buttons */}
        <button
          onClick={handleMinimize}
          title="Minimize"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Minus size={12} />
        </button>

        <button
          onClick={handleMaximize}
          title="Maximize / Restore"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Square size={11} />
        </button>

        <button
          onClick={handleClose}
          title="Close"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <X size={13} />
        </button>
      </div>
    </header>
  );
};
