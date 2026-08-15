import { Activity, Cpu, HardDrive } from 'lucide-react';
import type { SystemMetrics } from '../../types/electron';

interface HUDLeftWingProps {
  metrics: SystemMetrics | null;
  securityMode: 'SAFE' | 'NORMAL' | 'POWER';
}

export const HUDLeftWing = ({ metrics, securityMode }: HUDLeftWingProps) => {
  const ramPercent = metrics?.memoryUsagePercent || 35;
  const cpuCount = metrics?.cpuCores || 8;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '280px',
        height: '100%',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Top Diagnostics Header */}
      <div
        className="hud-panel hud-corners"
        style={{
          padding: '12px',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f0ff' }}>
            <Activity size={14} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em' }}>
              SYSTEM DIAGNOSTICS
            </span>
          </div>
          <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 700 }}>ARMED</span>
        </div>

        {/* Circular RAM Load Meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
          <div style={{ position: 'relative', width: '56px', height: '56px' }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="23"
                fill="none"
                stroke="rgba(0, 240, 255, 0.15)"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="23"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="4"
                strokeDasharray="144"
                strokeDashoffset={144 - (144 * ramPercent) / 100}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#00f0ff',
              }}
            >
              {ramPercent}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#f8fafc' }}>
              CORE MEMORY
            </span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>
              {metrics?.usedMemoryGB || '5.4'} GB / {metrics?.totalMemoryGB || '16.0'} GB
            </span>
            <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(0,240,255,0.15)', borderRadius: '2px', marginTop: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${ramPercent}%`, height: '100%', backgroundColor: '#00f0ff' }} />
            </div>
          </div>
        </div>
      </div>

      {/* CPU Hardware Node */}
      <div
        className="hud-panel hud-corners"
        style={{
          padding: '12px',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
          <Cpu size={14} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em' }}>
            CPU ARCHITECTURE
          </span>
        </div>

        <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {metrics?.cpuModel || 'Intel / AMD Processor Matrix'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '2px' }}>
          <div style={{ backgroundColor: 'rgba(0, 240, 255, 0.06)', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(0, 240, 255, 0.15)' }}>
            <span style={{ fontSize: '9px', color: '#64748b' }}>TOTAL CORES</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#00f0ff' }}>{cpuCount} THREADS</div>
          </div>
          <div style={{ backgroundColor: 'rgba(0, 240, 255, 0.06)', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(0, 240, 255, 0.15)' }}>
            <span style={{ fontSize: '9px', color: '#64748b' }}>PLATFORM</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#00f0ff' }}>WIN_X64</div>
          </div>
        </div>
      </div>

      {/* Disk & Security Matrix */}
      <div
        className="hud-panel hud-corners"
        style={{
          padding: '12px',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
          <HardDrive size={14} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em' }}>
            STORAGE & DEFENSE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: '#94a3b8' }}>DRIVE C:</span>
            <span style={{ color: '#00f0ff', fontWeight: 600 }}>ONLINE / RW</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: '#94a3b8' }}>SECURITY TIER:</span>
            <span
              style={{
                color: securityMode === 'SAFE' ? '#10b981' : securityMode === 'NORMAL' ? '#38bdf8' : '#ef4444',
                fontWeight: 700,
              }}
            >
              {securityMode}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: '#94a3b8' }}>GLOBAL HOTKEY:</span>
            <span style={{ color: '#00f0ff', fontWeight: 600 }}>WIN+J</span>
          </div>
        </div>
      </div>
    </div>
  );
};
