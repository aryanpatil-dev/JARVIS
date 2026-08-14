import { useState } from 'react';
import { X, Key, Shield, Eye, EyeOff, Check, Sliders, Monitor } from 'lucide-react';
import type { SystemMetrics } from '../../types/electron';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: SystemMetrics | null;
  securityMode: 'SAFE' | 'NORMAL' | 'POWER';
  onSecurityModeChange: (mode: 'SAFE' | 'NORMAL' | 'POWER') => void;
  showBootSequence: boolean;
  onToggleBootSequence: (val: boolean) => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: (val: boolean) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  metrics,
  securityMode,
  onSecurityModeChange,
  showBootSequence,
  onToggleBootSequence,
  scanlinesEnabled,
  onToggleScanlines,
}: SettingsModalProps) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('jarvis_gemini_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveKey = () => {
    localStorage.setItem('jarvis_gemini_key', apiKey.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 5, 7, 0.8)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '640px',
          maxHeight: '85vh',
          backgroundColor: '#0c0f16',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#0f131d',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} color="#38bdf8" />
            <span style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              JARVIS CONFIGURATION
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          {/* AI Credentials */}
          <div
            style={{
              backgroundColor: '#0f131d',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#38bdf8' }}>
              <Key size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                GEMINI AI CREDENTIALS
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
              Provide your Google Gemini API Key for autonomous agent workflows and command routing.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  style={{
                    width: '100%',
                    padding: '8px 36px 8px 12px',
                    backgroundColor: '#080a0f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                onClick={handleSaveKey}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isSaved ? '#10b981' : '#38bdf8',
                  color: '#08090b',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                {isSaved ? <Check size={14} /> : null}
                <span>{isSaved ? 'SAVED' : 'SAVE'}</span>
              </button>
            </div>
          </div>

          {/* Security Mode */}
          <div
            style={{
              backgroundColor: '#0f131d',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#10b981' }}>
              <Shield size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                SECURITY & PERMISSION TIER
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
              {(['SAFE', 'NORMAL', 'POWER'] as const).map((mode) => {
                const isSelected = securityMode === mode;
                return (
                  <div
                    key={mode}
                    onClick={() => onSecurityModeChange(mode)}
                    style={{
                      padding: '10px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#080a0f',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? '#38bdf8' : '#f8fafc' }}>
                      {mode} MODE
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                      {mode === 'SAFE' && 'Confirm destructive actions'}
                      {mode === 'NORMAL' && 'Standard automation'}
                      {mode === 'POWER' && 'Autonomous execution'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environment & Visuals */}
          <div
            style={{
              backgroundColor: '#0f131d',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#f59e0b' }}>
              <Monitor size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                DISPLAY & STARTUP
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Show ASCII Diagnostic Boot Sequence</span>
                <input
                  type="checkbox"
                  checked={showBootSequence}
                  onChange={(e) => onToggleBootSequence(e.target.checked)}
                  style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Enable CRT Scanline Micro-Overlay</span>
                <input
                  type="checkbox"
                  checked={scanlinesEnabled}
                  onChange={(e) => onToggleScanlines(e.target.checked)}
                  style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          {/* Host Diagnostics */}
          {metrics && (
            <div
              style={{
                backgroundColor: '#080a0f',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#64748b',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>HOST: {metrics.platform.toUpperCase()} ({metrics.arch})</span>
              <span>CPU: {metrics.cpuModel.slice(0, 24)}...</span>
              <span>UPTIME: {Math.floor(metrics.uptimeSeconds / 60)}m</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
