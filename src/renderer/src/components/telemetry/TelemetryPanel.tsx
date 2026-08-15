import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, RefreshCw, XCircle, Search, Clock, Laptop } from 'lucide-react';
import type { DetailedSystemStats, ProcessInfo } from '../../types/electron';

export const TelemetryPanel = () => {
  const [stats, setStats] = useState<DetailedSystemStats | null>(null);
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    if (window.jarvisAPI?.system) {
      try {
        const [detailed, procList] = await Promise.all([
          window.jarvisAPI.system.getDetailedStats(),
          window.jarvisAPI.system.getProcesses(),
        ]);
        setStats(detailed);
        setProcesses(procList);
      } catch (err) {
        console.error('Error fetching telemetry:', err);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleKillProcess = async (pid: number, name: string) => {
    if (confirm(`Terminate process "${name}" (PID: ${pid})?`)) {
      if (window.jarvisAPI?.system) {
        await window.jarvisAPI.system.killProcess(pid);
        fetchData();
      }
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredProcesses = processes.filter((p) =>
    p.name.toLowerCase().includes(filterQuery.toLowerCase()) || p.pid.toString().includes(filterQuery)
  );

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: '#0c0f17',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
          <Activity size={16} />
          <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            HARDWARE TELEMETRY & PROCESS ENGINE
          </span>
        </div>

        <button
          onClick={handleManualRefresh}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#121622',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            color: '#94a3b8',
            padding: '3px 8px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
          <span>POLL</span>
        </button>
      </div>

      {/* Top Telemetry Gauges Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '14px',
          backgroundColor: '#0a0d14',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* CPU Overall & Cores */}
        <div
          style={{
            backgroundColor: '#07090e',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
              <Cpu size={14} />
              <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>CPU LOAD</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
              {stats?.cpuUsage ?? 0}%
            </span>
          </div>

          {/* Per-Core Miniature Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '4px' }}>
            {stats?.cpuCoresUsage?.map((usage: number, idx: number) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ width: '100%', height: '14px', backgroundColor: '#131824', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${usage}%`,
                      backgroundColor: usage > 80 ? '#ef4444' : usage > 50 ? '#f59e0b' : '#38bdf8',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: '8px', color: '#64748b', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                  C{idx}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RAM Usage Breakdown */}
        <div
          style={{
            backgroundColor: '#07090e',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
              <HardDrive size={14} />
              <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>RAM USAGE</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
              {stats?.memoryUsagePercent ?? 0}%
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', backgroundColor: '#131824', borderRadius: '3px', overflow: 'hidden', margin: '8px 0' }}>
            <div
              style={{
                width: `${stats?.memoryUsagePercent ?? 0}%`,
                height: '100%',
                backgroundColor: '#10b981',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            <span>USED: {stats?.usedMemoryGB ?? '--'} GB</span>
            <span>TOTAL: {stats?.totalMemoryGB ?? '--'} GB</span>
          </div>
        </div>

        {/* Host Specs */}
        <div
          style={{
            backgroundColor: '#07090e',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
            <Laptop size={14} />
            <span style={{ fontWeight: 600 }}>HOST SYSTEM</span>
          </div>
          <div style={{ fontSize: '10px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stats?.cpuModel ?? 'Scanning hardware...'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '10px' }}>
            <Clock size={11} />
            <span>UPTIME: {stats?.uptimeFormatted ?? '--'}</span>
          </div>
        </div>
      </div>

      {/* Active Windows Process Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            backgroundColor: '#090c13',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
            RUNNING PROCESSES (TOP CONSUMPTION)
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#121622',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              padding: '2px 8px',
            }}
          >
            <Search size={11} color="#64748b" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter processes..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f8fafc',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                width: '120px',
              }}
            />
          </div>
        </div>

        {/* Process Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ color: '#64748b', fontSize: '10px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <th style={{ padding: '6px 8px', width: '70px' }}>PID</th>
                <th style={{ padding: '6px 8px' }}>PROCESS NAME</th>
                <th style={{ padding: '6px 8px', width: '100px' }}>MEMORY</th>
                <th style={{ padding: '6px 8px', width: '60px', textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcesses.map((proc) => (
                <tr
                  key={proc.pid}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                    color: '#cbd5e1',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '6px 8px', color: '#64748b' }}>{proc.pid}</td>
                  <td style={{ padding: '6px 8px', color: '#f8fafc' }}>{proc.name}</td>
                  <td style={{ padding: '6px 8px', color: '#10b981' }}>{proc.memory} MB</td>
                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleKillProcess(proc.pid, proc.name)}
                      title="Terminate Process"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2px',
                      }}
                    >
                      <XCircle size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
