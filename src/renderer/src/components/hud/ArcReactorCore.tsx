import { useEffect, useRef, useState } from 'react';
import type { SystemMetrics } from '../../types/electron';

interface ArcReactorCoreProps {
  metrics?: SystemMetrics | null;
  activeModel?: string;
  isListening?: boolean;
}

export const ArcReactorCore = ({
  metrics,
  activeModel = 'Gemini 3.5 Flash Lite',
  isListening = false,
}: ArcReactorCoreProps) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: '2-digit',
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Canvas Rotating Rings & Dial Gauges
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle1 = 0;
    let angle2 = 0;
    let angle3 = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 600);
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(centerX, centerY) * 0.72;

      ctx.clearRect(0, 0, width, height);

      // Speed multipliers based on CPU & Voice
      const cpuSpeed = ((metrics?.memoryUsagePercent || 30) / 100) * 0.015 + 0.005;
      angle1 += isListening ? 0.03 : cpuSpeed;
      angle2 -= isListening ? 0.025 : cpuSpeed * 0.7;
      angle3 += 0.008;

      // 1. Outer Dashed Degree Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle1);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Degree Tick Marks (every 30 deg)
      for (let i = 0; i < 12; i++) {
        const rad = (i * 30 * Math.PI) / 180;
        const x1 = Math.cos(rad) * (baseRadius - 8);
        const y1 = Math.sin(rad) * (baseRadius - 8);
        const x2 = Math.cos(rad) * (baseRadius + 4);
        const y2 = Math.sin(rad) * (baseRadius + 4);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Middle Segmented Telemetry Arc (CPU Gauge)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 15, 60, 20]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Counter-Rotating Notched Arc
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle3);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([40, 40]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.64, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 4. Inner Glowing Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = isListening ? '#00f0ff' : 'rgba(0, 240, 255, 0.7)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = isListening ? 25 : 12;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([15, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 5. Plasma Core Flare
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        baseRadius * 0.32
      );
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.32, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [metrics, isListening]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '380px',
        overflow: 'hidden',
      }}
    >
      {/* Background Canvas Rings */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Central Core Telemetry Readout */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          padding: '20px',
        }}
      >
        {/* Date / Status */}
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(0, 240, 255, 0.7)',
            letterSpacing: '0.25em',
            fontWeight: 600,
          }}
        >
          {dateStr || 'SYSTEM ACTIVE'}
        </div>

        {/* Digital Military Time */}
        <div
          className="hud-glow"
          style={{
            fontSize: '38px',
            fontWeight: 700,
            color: '#f8fafc',
            letterSpacing: '0.08em',
            lineHeight: 1,
            margin: '4px 0',
          }}
        >
          {timeStr || '00:00:00'}
        </div>

        {/* JARVIS Core Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '4px',
            padding: '3px 10px',
            marginTop: '4px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#00f0ff',
              boxShadow: '0 0 8px #00f0ff',
            }}
          />
          <span style={{ fontSize: '10px', color: '#00f0ff', letterSpacing: '0.15em', fontWeight: 600 }}>
            {activeModel.toUpperCase()}
          </span>
        </div>

        {/* Real-time Hardware Telemetry Bar in Core */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '8px',
            fontSize: '10px',
            color: '#94a3b8',
          }}
        >
          <div>
            RAM: <span style={{ color: '#00f0ff', fontWeight: 600 }}>{metrics?.memoryUsagePercent || 0}%</span>
          </div>
          <div>•</div>
          <div>
            CORES: <span style={{ color: '#00f0ff', fontWeight: 600 }}>{metrics?.cpuCores || 8}</span>
          </div>
          <div>•</div>
          <div>
            UPTIME: <span style={{ color: '#00f0ff', fontWeight: 600 }}>{Math.floor((metrics?.uptimeSeconds || 0) / 60)}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
