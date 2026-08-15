import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { VoiceWaveform } from '../voice/VoiceWaveform';
import { voiceEngine } from '../../services/voice.service';
import { soundEffects } from '../../services/sound.service';
import { weatherService, WeatherData } from '../../services/weather.service';
import type { SystemMetrics } from '../../types/electron';

interface TitlebarProps {
  metrics: SystemMetrics | null;
  onOpenSettings: () => void;
  onVoiceTranscript?: (text: string) => void;
}

export const Titlebar = ({ onVoiceTranscript }: TitlebarProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Weather & Location fetch
  useEffect(() => {
    weatherService.fetchLiveWeather().then((data) => setWeather(data));
    const interval = setInterval(() => {
      weatherService.fetchLiveWeather().then((data) => setWeather(data));
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  // Voice listeners
  useEffect(() => {
    voiceEngine.onStateChange((state) => {
      setIsListening(state.isListening);
      setIsSpeaking(state.isSpeaking);
    });

    if (onVoiceTranscript) {
      voiceEngine.onTranscript((text) => {
        onVoiceTranscript(text);
      });
    }
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

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '44px',
        padding: '0 18px',
        backgroundColor: 'rgba(3, 7, 18, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
        boxShadow: '0 4px 20px rgba(0, 240, 255, 0.08)',
        zIndex: 1000,
        position: 'relative',
      }}
      className="titlebar-drag-region"
    >
      {/* Left: Stark / JARVIS Branding & System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }} className="no-drag">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00f0ff',
              boxShadow: '0 0 12px #00f0ff',
            }}
          />
          <span
            className="hud-glow"
            style={{
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: '#00f0ff',
              fontFamily: 'var(--font-mono)',
            }}
          >
            STARK INDUSTRIES // JARVIS
          </span>
        </div>

        <span style={{ color: 'rgba(0, 240, 255, 0.3)', fontSize: '12px' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
          <Shield size={12} color="#00f0ff" />
          <span>SYS.VER 1.0 // ONLINE</span>
        </div>
      </div>

      {/* Center: Audio Spectrum & Voice Waveform */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="no-drag">
        <VoiceWaveform isActive={isListening} isSpeaking={isSpeaking} />
        {isListening && (
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: '#ef4444',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            VOICE ACTIVE
          </span>
        )}
      </div>

      {/* Right: Weather & Location Widget + Minimalist Window Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="no-drag">
        {weather && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '4px',
              padding: '3px 10px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{weather.icon}</span>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{weather.city}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="hud-glow" style={{ color: '#00f0ff', fontWeight: 700 }}>
                {weather.tempC}°C
              </span>
              <span style={{ fontSize: '9px', color: '#64748b' }}>({weather.condition})</span>
            </div>
          </div>
        )}

        {/* Minimal Circular Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleMinimize}
            title="Minimize"
            style={{
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              border: 'none',
              cursor: 'pointer',
              opacity: 0.85,
            }}
          />
          <button
            onClick={handleMaximize}
            title="Maximize"
            style={{
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              border: 'none',
              cursor: 'pointer',
              opacity: 0.85,
            }}
          />
          <button
            onClick={handleClose}
            title="Close"
            style={{
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              border: 'none',
              cursor: 'pointer',
              opacity: 0.85,
            }}
          />
        </div>
      </div>
    </header>
  );
};
