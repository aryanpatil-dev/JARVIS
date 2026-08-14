import { useState, useEffect } from 'react';
import { Terminal, Cpu, HardDrive, Shield, Activity, Sparkles, Layers, Search } from 'lucide-react';
import type { SystemMetrics } from './types/electron';

export default function App() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

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
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMinimize = () => window.jarvisAPI?.window.minimize();
  const handleMaximize = () => window.jarvisAPI?.window.maximize();
  const handleClose = () => window.jarvisAPI?.window.close();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#08090b', color: '#f1f5f9' }}>
      {/* Titlebar */}
      <header className="titlebar-drag-region" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '40px',
        padding: '0 12px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backgroundColor: '#0a0c10',
        fontSize: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#38bdf8',
            boxShadow: '0 0 8px #38bdf8'
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em' }}>JARVIS // OS</span>
          <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>v0.1.0-DEV</span>
        </div>

        {/* Telemetry snippet in titlebar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#94a3b8' }}>
          {metrics && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Cpu size={12} color="#38bdf8" />
                <span>CORES: {metrics.cpuCores}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <HardDrive size={12} color="#10b981" />
                <span>RAM: {metrics.usedMemoryGB} / {metrics.totalMemoryGB} GB ({metrics.memoryUsagePercent}%)</span>
              </div>
            </>
          )}
        </div>

        {/* Window controls */}
        <div className="no-drag" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={handleMinimize} style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>─</button>
          <button onClick={handleMaximize} style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>□</button>
          <button onClick={handleClose} style={{
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>✕</button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <aside style={{
          width: '240px',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          backgroundColor: '#0d0f14',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '12px'
        }}>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
              Workspaces
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '4px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                <Layers size={14} />
                <span>Core Workspace</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={12} color="#10b981" />
              <span>SECURITY: SAFE MODE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={12} color="#38bdf8" />
              <span>ENGINE: READY</span>
            </div>
          </div>
        </aside>

        {/* Central Workspace Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#08090b', padding: '16px', gap: '16px' }}>
          {/* Tactical Prompt Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#0f1219',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            padding: '10px 14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            <Search size={16} color="#38bdf8" />
            <input
              type="text"
              placeholder="Tell JARVIS what you want to accomplish or press Ctrl+K..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f1f5f9',
                fontSize: '13px',
                flex: 1,
                fontFamily: 'var(--font-sans)'
              }}
            />
            <kbd style={{
              backgroundColor: '#1a1f2c',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '10px',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono)'
            }}>CTRL + K</kbd>
          </div>

          {/* Subsystem Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flex: 1 }}>
            <div style={{
              backgroundColor: '#0d0f14',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '8px' }}>
                  <Terminal size={16} />
                  <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>PTY TERMINAL</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Real Windows process execution & streaming console.</p>
              </div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>STATUS: INITIALIZED</span>
            </div>

            <div style={{
              backgroundColor: '#0d0f14',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
                  <Cpu size={16} />
                  <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>TELEMETRY MATRIX</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Live CPU, memory, and native process telemetry.</p>
              </div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>STATUS: MONITORING</span>
            </div>

            <div style={{
              backgroundColor: '#0d0f14',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '8px' }}>
                  <Sparkles size={16} />
                  <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>AI ORCHESTRATION</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Gemini agent workflows & structured tool calling engine.</p>
              </div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>STATUS: STANDBY</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
