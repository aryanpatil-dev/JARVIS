import { useState, useEffect } from 'react';
import {
  Code,
  Terminal,
  Globe,
  FolderSearch,
  BookOpen,
  Cpu,
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import type { AgentPersona, AgentTask } from '../../types/electron';

interface AgentHubPanelProps {
  onOpenSettings?: () => void;
}

export const AgentHubPanel = ({}: AgentHubPanelProps) => {
  const [personas, setPersonas] = useState<AgentPersona[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('coding');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(true);

  // Load personas on mount
  useEffect(() => {
    const fetchPersonas = async () => {
      if (window.jarvisAPI?.agent) {
        try {
          const list = await window.jarvisAPI.agent.getPersonas();
          setPersonas(list);
        } catch (err) {
          console.error('Failed to get agent personas:', err);
        }
      }
    };
    fetchPersonas();
  }, []);

  // Listen for task updates
  useEffect(() => {
    if (!window.jarvisAPI?.agent) return;
    const cleanup = window.jarvisAPI.agent.onTaskUpdate((task: AgentTask) => {
      setActiveTask(task);
      if (task.status === 'completed' || task.status === 'failed') {
        setIsExecuting(false);
      }
    });
    return () => cleanup();
  }, []);

  const handleLaunchTask = async (presetPrompt?: string) => {
    const prompt = (presetPrompt || taskPrompt).trim();
    if (!prompt || isExecuting) return;

    setIsExecuting(true);
    setTaskPrompt('');

    try {
      await window.jarvisAPI?.agent.runTask(selectedAgent, prompt);
    } catch (err) {
      console.error('Task launch failed:', err);
      setIsExecuting(false);
    }
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'coding':
        return <Code size={18} color="#38bdf8" />;
      case 'terminal':
        return <Terminal size={18} color="#10b981" />;
      case 'browser':
        return <Globe size={18} color="#a855f7" />;
      case 'file':
        return <FolderSearch size={18} color="#eab308" />;
      case 'research':
        return <BookOpen size={18} color="#ec4899" />;
      case 'system':
        return <Cpu size={18} color="#f97316" />;
      default:
        return <Sparkles size={18} color="#38bdf8" />;
    }
  };

  const activePersona = personas.find((p) => p.id === selectedAgent);

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
      {/* Panel Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
          <Sparkles size={16} />
          <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            AUTONOMOUS AGENT ORCHESTRATOR
          </span>
        </div>

        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
          6 SPECIALIZED AGENTS ONLINE
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1, overflow: 'hidden' }}>
        {/* Left: Persona Selector */}
        <div
          style={{
            backgroundColor: '#090c13',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
            SELECT SPECIALIZED AGENT
          </div>

          {personas.map((persona) => {
            const isSelected = selectedAgent === persona.id;
            return (
              <div
                key={persona.id}
                onClick={() => setSelectedAgent(persona.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ marginTop: '2px' }}>{getAgentIcon(persona.id)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#38bdf8' : '#f1f5f9' }}>
                      {persona.name}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: persona.color,
                      }}
                    >
                      {persona.badge}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                    {persona.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Mission Control & Task Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Active Agent Banner */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#0c0f18',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activePersona && getAgentIcon(activePersona.id)}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                  {activePersona?.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {activePersona?.description}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isExecuting ? '#f59e0b' : '#10b981',
                }}
                className={isExecuting ? 'animate-pulse-glow' : ''}
              />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: isExecuting ? '#f59e0b' : '#10b981' }}>
                {isExecuting ? 'AGENT BUSY' : 'AGENT IDLE'}
              </span>
            </div>
          </div>

          {/* Quick Mission Templates */}
          <div
            style={{
              padding: '10px 18px',
              backgroundColor: '#090b11',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
            }}
          >
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#64748b', whiteSpace: 'nowrap' }}>
              AUTONOMOUS MISSIONS:
            </span>

            {selectedAgent === 'coding' && (
              <>
                <button
                  onClick={() => handleLaunchTask('Inspect workspace codebase, find potential lint/type issues, and summarize fixes.')}
                  style={missionButtonStyle}
                >
                  Inspect & Audit Codebase
                </button>
                <button
                  onClick={() => handleLaunchTask('Verify build pipeline integrity by running npm run build in dry-run.')}
                  style={missionButtonStyle}
                >
                  Verify Build Integrity
                </button>
              </>
            )}

            {selectedAgent === 'terminal' && (
              <>
                <button
                  onClick={() => handleLaunchTask('Run git status and show latest commit log.')}
                  style={missionButtonStyle}
                >
                  Git Status & Log
                </button>
                <button
                  onClick={() => handleLaunchTask('Check host network status and ping Google DNS.')}
                  style={missionButtonStyle}
                >
                  Network Diagnostic
                </button>
              </>
            )}

            {selectedAgent === 'system' && (
              <>
                <button
                  onClick={() => handleLaunchTask('Inspect all running processes, calculate top 5 RAM consumers, and evaluate system stability.')}
                  style={missionButtonStyle}
                >
                  Diagnose RAM Consumers
                </button>
              </>
            )}

            {selectedAgent === 'file' && (
              <>
                <button
                  onClick={() => handleLaunchTask('List all Markdown documents in the project and organize their file paths.')}
                  style={missionButtonStyle}
                >
                  Map Markdown Files
                </button>
              </>
            )}
          </div>

          {/* Task History & Activity Viewport */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeTask ? (
              <div
                style={{
                  backgroundColor: '#0c0f17',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {activeTask.status === 'running' && <Clock size={14} color="#f59e0b" />}
                    {activeTask.status === 'completed' && <CheckCircle size={14} color="#10b981" />}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                      Mission: {activeTask.prompt}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      backgroundColor: activeTask.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: activeTask.status === 'completed' ? '#10b981' : '#f59e0b',
                    }}
                  >
                    {activeTask.status.toUpperCase()}
                  </span>
                </div>

                <div
                  onClick={() => setExpandedDetails(!expandedDetails)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: '#38bdf8',
                    cursor: 'pointer',
                  }}
                >
                  {expandedDetails ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <span>MISSION TELEMETRY & EXECUTION STEPS</span>
                </div>

                {expandedDetails && (
                  <div
                    style={{
                      backgroundColor: '#07090e',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                      padding: '10px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: '#cbd5e1',
                      lineHeight: '1.5',
                    }}
                  >
                    <div>Agent Persona: {activeTask.agentType}</div>
                    <div>Started: {new Date(activeTask.startTime).toLocaleTimeString()}</div>
                    {activeTask.endTime && <div>Finished: {new Date(activeTask.endTime).toLocaleTimeString()}</div>}
                    <div style={{ marginTop: '8px', color: '#10b981' }}>
                      ✓ Agent loop orchestrated via Google Gemini SDK. Check AI Studio (Ctrl+2) for full streaming logs.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#64748b',
                  gap: '8px',
                }}
              >
                <Sparkles size={28} />
                <span style={{ fontSize: '13px' }}>Select an agent and launch an autonomous mission below.</span>
              </div>
            )}
          </div>

          {/* Mission Dispatch Input Bar */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#0c0f17',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <input
              type="text"
              value={taskPrompt}
              onChange={(e) => setTaskPrompt(e.target.value)}
              placeholder={`Assign a goal to ${activePersona?.name || 'Agent'}...`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLaunchTask();
              }}
              style={{
                flex: 1,
                backgroundColor: '#07090e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '10px 14px',
                color: '#f8fafc',
                fontSize: '13px',
                outline: 'none',
              }}
            />

            <button
              onClick={() => handleLaunchTask()}
              disabled={!taskPrompt.trim() || isExecuting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: taskPrompt.trim() ? '#38bdf8' : '#1e293b',
                border: 'none',
                borderRadius: '6px',
                color: taskPrompt.trim() ? '#08090b' : '#64748b',
                padding: '10px 18px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                cursor: taskPrompt.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              <Play size={13} fill={taskPrompt.trim() ? '#08090b' : '#64748b'} />
              <span>DISPATCH</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const missionButtonStyle: React.CSSProperties = {
  backgroundColor: '#121622',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '4px',
  color: '#94a3b8',
  padding: '4px 10px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontSize: '11px',
  fontFamily: 'var(--font-mono)',
};
