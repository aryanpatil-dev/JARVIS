import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const ASCII_LOGO = `
    ██╗ █████╗ ██████╗ ██╗   ██╗██╗███████╗
    ██║██╔══██╗██╔══██╗██║   ██║██║██╔════╝
    ██║███████║██████╔╝██║   ██║██║███████╗
██╗ ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║
╚█████║██║  ██║██║  ██║ ╚████╔╝ ██║███████║
 ╚════╝╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝
`;

const BOOT_LOGS = [
  { text: 'JARVIS KERNEL INITIALIZING (x64_WIN_HOST)...', delay: 200 },
  { text: 'VERIFYING SYSTEM PERMISSIONS & CONTEXT ISOLATION... [OK]', delay: 350 },
  { text: 'MOUNTING PSEUDO-TERMINAL SUBSYSTEM (PTY)... [OK]', delay: 500 },
  { text: 'INITIALIZING AI ORCHESTRATION PIPELINE... [OK]', delay: 650 },
  { text: 'CONNECTING AGENT REGISTRY & TOOL FIREWALL... [OK]', delay: 800 },
  { text: 'LOADING PERSISTENT WORKSPACES & TELEMETRY... [OK]', delay: 950 },
  { text: 'JARVIS DESKTOP ENVIRONMENT READY.', delay: 1150 },
];

export const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Handle skip on Space / Escape / Enter
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Escape' || e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Stream logs
    const timeouts = BOOT_LOGS.map((item, index) => {
      return setTimeout(() => {
        setLogs((prev) => [...prev, item.text]);
        setProgress(Math.round(((index + 1) / BOOT_LOGS.length) * 100));

        if (index === BOOT_LOGS.length - 1) {
          setTimeout(() => {
            onComplete();
          }, 400);
        }
      }, item.delay);
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050608',
        color: '#38bdf8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        zIndex: 9999,
        padding: '24px',
        cursor: 'pointer',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ASCII Banner */}
        <pre
          style={{
            fontSize: '11px',
            lineHeight: '1.2',
            color: '#38bdf8',
            textAlign: 'center',
            textShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
            overflow: 'hidden',
          }}
        >
          {ASCII_LOGO}
        </pre>

        <div style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '0.2em', color: '#94a3b8' }}>
          AI-NATIVE DESKTOP ENVIRONMENT // V0.1.0-DEV
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 8px #38bdf8',
              transition: 'width 0.15s ease-out',
            }}
          />
        </div>

        {/* Telemetry Output Log */}
        <div
          style={{
            backgroundColor: '#0a0d14',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '6px',
            padding: '14px',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '11px',
            color: '#cbd5e1',
          }}
        >
          {logs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#38bdf8' }}>›</span>
              <span>{log}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#38bdf8' }}>›</span>
            <span className="animate-cursor-blink" style={{ color: '#38bdf8' }}>█</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#64748b',
            letterSpacing: '0.05em',
          }}
        >
          <span>HOST: WINDOWS x64</span>
          <span>CLICK OR PRESS [SPACE/ESC] TO ENTER IMMEDIATELY</span>
        </div>
      </div>
    </div>
  );
};
