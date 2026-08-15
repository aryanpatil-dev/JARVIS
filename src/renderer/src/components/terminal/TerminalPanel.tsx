import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Plus, X, Terminal as TermIcon, Play, Trash2 } from 'lucide-react';
import 'xterm/css/xterm.css';

interface TabSession {
  id: string;
  name: string;
  shell: string;
}

export const TerminalPanel = () => {
  const [tabs, setTabs] = useState<TabSession[]>([
    { id: 'term-1', name: 'PowerShell 1', shell: 'powershell.exe' },
  ]);
  const [activeTabId, setActiveTabId] = useState('term-1');
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermInstance = useRef<XTerm | null>(null);
  const fitAddonInstance = useRef<FitAddon | null>(null);
  const activeTabRef = useRef(activeTabId);
  activeTabRef.current = activeTabId;

  // Initialize xterm.js instance
  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      theme: {
        background: '#07090e',
        foreground: '#cbd5e1',
        cursor: '#38bdf8',
        cursorAccent: '#07090e',
        selectionBackground: 'rgba(56, 189, 248, 0.25)',
        black: '#0a0d14',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#38bdf8',
        magenta: '#ec4899',
        cyan: '#06b6d4',
        white: '#f8fafc',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#34d399',
        brightYellow: '#fbbf24',
        brightBlue: '#60a5fa',
        brightMagenta: '#f472b6',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      },
      fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
      fontSize: 13,
      lineHeight: 1.25,
      cursorBlink: true,
      cursorStyle: 'block',
      convertEol: true,
      scrollback: 2000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermInstance.current = term;
    fitAddonInstance.current = fitAddon;

    // Send user keystrokes to active PTY session
    const onDataDisposable = term.onData((data) => {
      window.jarvisAPI?.terminal.write(activeTabRef.current, data);
    });

    // Resize observer to handle container adjustments
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {
        // Ignore resize before layout stabilizes
      }
    });

    resizeObserver.observe(terminalRef.current);

    return () => {
      onDataDisposable.dispose();
      resizeObserver.disconnect();
      term.dispose();
      xtermInstance.current = null;
    };
  }, []);

  // Listen for native terminal stdout/stderr stream from Main process
  useEffect(() => {
    if (!window.jarvisAPI?.terminal) return;

    const cleanup = window.jarvisAPI.terminal.onOutput(({ id, data }) => {
      if (id === activeTabRef.current && xtermInstance.current) {
        xtermInstance.current.write(data);
      }
    });

    return () => cleanup();
  }, []);

  // Spawns the session on backend
  const spawnTab = useCallback((id: string, shell: string) => {
    if (window.jarvisAPI?.terminal) {
      window.jarvisAPI.terminal.create(id, undefined, shell);
    }
  }, []);

  // Ensure active tab session is spawned
  useEffect(() => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (activeTab) {
      spawnTab(activeTab.id, activeTab.shell);
    }
  }, [activeTabId, tabs, spawnTab]);

  const handleNewTab = (shell: string = 'powershell.exe') => {
    const newId = `term-${Date.now()}`;
    const name = shell.includes('cmd') ? `CMD ${tabs.length + 1}` : `PS ${tabs.length + 1}`;
    setTabs((prev) => [...prev, { id: newId, name, shell }]);
    setActiveTabId(newId);
    if (xtermInstance.current) {
      xtermInstance.current.reset();
      xtermInstance.current.writeln(`\x1b[36m[JARVIS]\x1b[0m Spawning new session ${name}...\r\n`);
    }
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Keep at least one tab

    window.jarvisAPI?.terminal.kill(id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
      if (xtermInstance.current) xtermInstance.current.reset();
    }
  };

  const handleClear = () => {
    xtermInstance.current?.clear();
  };

  const handleQuickCommand = (cmd: string) => {
    window.jarvisAPI?.terminal.write(activeTabId, cmd + '\r');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#07090e',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        overflow: 'hidden',
      }}
    >
      {/* Terminal Tab Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          height: '36px',
          backgroundColor: '#0c0f17',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                <TermIcon size={12} color={isActive ? '#38bdf8' : '#64748b'} />
                <span>{tab.name}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                    }}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={() => handleNewTab('powershell.exe')}
            title="New PowerShell Tab"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleClear}
            title="Clear Terminal"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Trash2 size={13} />
          </button>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#10b981' }}>
            ● PTY ONLINE
          </span>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div
        ref={terminalRef}
        style={{
          flex: 1,
          padding: '8px 12px',
          overflow: 'hidden',
          backgroundColor: '#07090e',
        }}
      />

      {/* Quick Command Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: '#0a0d14',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#64748b',
          overflowX: 'auto',
        }}
      >
        <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Play size={10} /> QUICK:
        </span>
        {[
          { label: 'git status', cmd: 'git status' },
          { label: 'dir / ls', cmd: 'dir' },
          { label: 'npm run build', cmd: 'npm run build' },
          { label: 'cls', cmd: 'Clear-Host' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleQuickCommand(item.cmd)}
            style={{
              background: '#121622',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              color: '#94a3b8',
              padding: '2px 6px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
