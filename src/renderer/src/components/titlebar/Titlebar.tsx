import { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Key,
} from 'lucide-react';
import type { SystemMetrics } from '../../types/electron';
import { VoiceWaveform } from '../voice/VoiceWaveform';
import { voiceEngine, VoiceState } from '../../services/voice.service';
import { soundEffects } from '../../services/sound.service';

interface TitlebarProps {
  metrics: SystemMetrics | null;
  onOpenSettings: () => void;
  onVoiceTranscript?: (text: string) => void;
}

export const Titlebar = ({ metrics, onOpenSettings, onVoiceTranscript }: TitlebarProps) => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    transcript: '',
    isSupported: true,
    audioLevel: 0,
  });
  const [isTtsMuted, setIsTtsMuted] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    voiceEngine.onStateChange((state) => {
      setVoiceState(state);
    });

    if (onVoiceTranscript) {
      voiceEngine.onTranscript((text) => {
        onVoiceTranscript(text);
      });
    }

    const checkApiKey = async () => {
      if (window.jarvisAPI?.ai) {
        const configured = await window.jarvisAPI.ai.getKeyStatus();
        setHasApiKey(configured);
      }
    };
    checkApiKey();
  }, [onVoiceTranscript]);

  const handleMinimize = () => {
    soundEffects.playClick();
    window.jarvisAPI?.window.minimize();
  };

  const handleMaximize = () => {
    soundEffects.playClick();
    window.jarvisAPI?.window.maximize();
  };

  const handleClose = () => {
    soundEffects.playClick();
    window.jarvisAPI?.window.close();
  };

  const toggleMic = () => {
    soundEffects.playClick();
    voiceEngine.toggleListening();
  };

  const toggleTts = () => {
    soundEffects.playClick();
    const nextState = !isTtsMuted;
    setIsTtsMuted(nextState);
    voiceEngine.setTTSEnabled(!nextState);
  };

  return (
    <header
      className="drag-region"
      style={{
        height: '38px',
        backgroundColor: '#05070a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        userSelect: 'none',
        zIndex: 1000,
      }}
    >
      {/* Left: Brand + Status HUD */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="no-drag">
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 8px #38bdf8',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#f8fafc',
              fontFamily: 'var(--font-mono)',
            }}
          >
            JARVIS // OS
          </span>
        </div>

        {/* API Key Status Pill */}
        {!hasApiKey && (
          <button
            onClick={onOpenSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '3px',
              color: '#f59e0b',
              padding: '2px 6px',
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            <Key size={10} />
            <span>ADD GEMINI KEY</span>
          </button>
        )}
      </div>

      {/* Center: Live Voice Waveform & Voice Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
          padding: '2px 10px',
        }}
        className="no-drag"
      >
        {/* Mic Toggle Button */}
        <button
          onClick={toggleMic}
          title={voiceState.isListening ? 'Mute Microphone' : 'Enable Voice Command'}
          style={{
            background: 'transparent',
            border: 'none',
            color: voiceState.isListening ? '#10b981' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
        >
          {voiceState.isListening ? <Mic size={14} /> : <MicOff size={14} />}
        </button>

        {/* Dynamic Sinusoidal Waveform */}
        <VoiceWaveform isActive={voiceState.isListening} isSpeaking={voiceState.isSpeaking} />

        {/* TTS Audio Toggle */}
        <button
          onClick={toggleTts}
          title={isTtsMuted ? 'Unmute JARVIS Voice' : 'Mute JARVIS Voice'}
          style={{
            background: 'transparent',
            border: 'none',
            color: isTtsMuted ? '#64748b' : '#38bdf8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
        >
          {isTtsMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Right: Telemetry Indicators + Sleek Window Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="no-drag">
        {metrics && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: '#64748b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={12} color="#38bdf8" />
              <span>{metrics.cpuCores}C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} color="#10b981" />
              <span>{metrics.memoryUsagePercent}% RAM</span>
            </div>
          </div>
        )}

        {/* Settings Action */}
        <button
          onClick={onOpenSettings}
          title="Settings (Ctrl+,)"
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
          <Settings size={13} />
        </button>

        {/* Sleek Minimalist Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
          <button
            onClick={handleMinimize}
            title="Minimize"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#eab308',
              border: 'none',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
          />
          <button
            onClick={handleMaximize}
            title="Maximize / Restore"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              border: 'none',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
          />
          <button
            onClick={handleClose}
            title="Close"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              border: 'none',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
          />
        </div>
      </div>
    </header>
  );
};
