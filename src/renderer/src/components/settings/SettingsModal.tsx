import { useState, useEffect } from 'react';
import {
  X,
  Key,
  Shield,
  Eye,
  EyeOff,
  Check,
  Sliders,
  Monitor,
  Mic,
} from 'lucide-react';
import type { SystemMetrics } from '../../types/electron';
import { voiceEngine } from '../../services/voice.service';
import { soundEffects } from '../../services/sound.service';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics?: SystemMetrics | null;
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(soundEffects.isEnabled());
    setTtsEnabled(voiceEngine.isTTSEnabled());
  }, [isOpen]);

  const handleSaveKey = async () => {
    const key = apiKey.trim();
    localStorage.setItem('jarvis_gemini_key', key);
    if (window.jarvisAPI?.ai) {
      await window.jarvisAPI.ai.saveKey(key);
    }
    soundEffects.playConfirm();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.setEnabled(next);
    if (next) soundEffects.playConfirm();
  };

  const toggleTts = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    voiceEngine.setTTSEnabled(next);
    if (next) {
      soundEffects.playConfirm();
      voiceEngine.speak('Voice synthesizer online.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 5, 7, 0.85)',
        backdropFilter: 'blur(8px)',
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
          width: '660px',
          maxHeight: '88vh',
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
            backgroundColor: '#090b10',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <Sliders size={16} color="#38bdf8" />
            <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              JARVIS CONFIGURATION & CREDENTIAL STORE
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Section 1: Gemini API Key */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
              <Key size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                GOOGLE GEMINI API KEY
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
              Required to activate autonomous agent execution, tool calling, and live token streaming with Gemini 3.5 Flash Lite and 3.1 Pro. Key is stored locally in your encrypted OS user data.
            </p>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div
                style={{
                  flex: 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  style={{
                    width: '100%',
                    backgroundColor: '#07090e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    padding: '8px 36px 8px 10px',
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
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
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
                  border: 'none',
                  borderRadius: '4px',
                  color: '#08090b',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                {isSaved ? <Check size={14} /> : null}
                <span>{isSaved ? 'SAVED' : 'SAVE KEY'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Voice & Sound Effects */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
              <Mic size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                VOICE & AUDIO MULTIMODAL SETTINGS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Tactical UI Sound FX</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Synthesizer feedback for confirmations, errors, and clicks</span>
                </div>
                <button
                  onClick={toggleSound}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor: soundEnabled ? '#10b981' : '#1e293b',
                    color: soundEnabled ? '#08090b' : '#64748b',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                  }}
                >
                  {soundEnabled ? 'ENABLED' : 'MUTED'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Text-to-Speech (TTS) Voice Responses</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>JARVIS audibly speaks responses and agent updates</span>
                </div>
                <button
                  onClick={toggleTts}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor: ttsEnabled ? '#38bdf8' : '#1e293b',
                    color: ttsEnabled ? '#08090b' : '#64748b',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                  }}
                >
                  {ttsEnabled ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Security Tier */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
              <Shield size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                SECURITY & PERMISSION FIREWALL TIER
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['SAFE', 'NORMAL', 'POWER'] as const).map((mode) => {
                const isSelected = securityMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      soundEffects.playClick();
                      onSecurityModeChange(mode);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#07090e',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                      color: isSelected ? '#38bdf8' : '#94a3b8',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: isSelected ? 700 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {mode} MODE
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Display & Visual FX */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
              <Monitor size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                VISUAL FX & BOOT PREFERENCES
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={scanlinesEnabled}
                  onChange={(e) => onToggleScanlines(e.target.checked)}
                />
                <span>Enable Tactical CRT Scanlines Shader</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showBootSequence}
                  onChange={(e) => onToggleBootSequence(e.target.checked)}
                />
                <span>Play Diagnostic Boot Telemetry on Startup</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
