import React, { useEffect, useRef } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Partículas luminosas tenues en tonos verdes
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speedX: number;
      speedY: number;
      pulseVal: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    for (let i = 0; i < 48; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 2 + Math.random() * 5.5,
        alpha: 0.15 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -(0.3 + Math.random() * 0.7),
        pulseVal: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        color: Math.random() > 0.4 ? 'rgba(52, 211, 153, ' : 'rgba(167, 243, 208, ',
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.pulseVal += p.pulseSpeed;
        const currentAlpha = Math.max(0.08, p.alpha + Math.sin(p.pulseVal) * 0.18);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowColor = 'rgba(52, 211, 153, 0.7)';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 3 segundos de duración exacta antes de desvanecer y dar paso al tutorial
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <div
      id="react-intro-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#064e3b] overflow-hidden transition-opacity duration-700 pointer-events-auto h-[100dvh] w-full"
      style={{ backgroundColor: '#064e3b' }}
      aria-live="polite"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10 px-4 sm:px-6 w-full max-w-[94vw] sm:max-w-2xl text-center flex flex-col items-center box-border">
        <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] [text-shadow:0_0_35px_rgba(52,211,153,0.7)] animate-in fade-in zoom-in-95 duration-700 text-balance break-words max-w-full">
          El juego de la vida de Conway.
        </h1>
        <p className="mt-2 sm:mt-3 text-base sm:text-xl md:text-2xl font-semibold text-emerald-200 drop-shadow-md self-end -rotate-2 animate-in fade-in slide-in-from-bottom-2 duration-1000 pr-2 sm:pr-4 whitespace-nowrap">
          Por Robert Pacheco.
        </p>
      </div>
    </div>
  );
};
