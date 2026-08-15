import { useEffect, useRef } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  isSpeaking: boolean;
  color?: string;
  width?: number;
  height?: number;
}

export const VoiceWaveform = ({
  isActive,
  isSpeaking,
  color = '#38bdf8',
  width = 120,
  height = 20,
}: VoiceWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const numBars = 18;
      const barWidth = 3;
      const spacing = (width - numBars * barWidth) / (numBars - 1);

      for (let i = 0; i < numBars; i++) {
        let barHeight = 3;

        if (isActive || isSpeaking) {
          // Dynamic animated wave amplitude
          const frequency = 0.35;
          const sine = Math.sin(i * frequency + phase);
          const normalized = (sine + 1) / 2; // 0 to 1
          const multiplier = isSpeaking ? height * 0.85 : height * 0.65;
          barHeight = Math.max(3, normalized * multiplier);
        }

        const x = i * (barWidth + spacing);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = isActive
          ? '#10b981' // Green when user listening
          : isSpeaking
          ? '#f59e0b' // Amber when JARVIS talking
          : 'rgba(255, 255, 255, 0.15)'; // Idle subtle grey

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += 0.15;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isSpeaking, color, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'block',
      }}
    />
  );
};
