/**
 * Interactive HTML5 Canvas Grid Component for John Conway's Game of Life & Cellular Automata
 * Renders cells as vibrant, organic 3D spheres/bubbles with internal glow, specular sheens,
 * and support for 2-state and 3-state cellular automata.
 * Optimized for mobile touch-and-drag and desktop interaction.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameOfLifeEngine } from '../engine/gameOfLife';
import { ActiveStamp, DrawMode } from '../types';
import { ColorTheme, COLOR_THEMES } from '../constants/theme';

interface CanvasGridProps {
  engine: GameOfLifeEngine;
  isRunning: boolean;
  targetFps: number;
  drawMode: DrawMode;
  showGridLines: boolean;
  colorTheme: ColorTheme;
  activeStamp: ActiveStamp | null;
  onClearStamp: () => void;
  onStatsUpdate: () => void;
}

interface AmbientParticle {
  tier: 'small' | 'medium' | 'large';
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  radius: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  vx: number;
  vy: number;
  waveAmp: number;
  waveFreq: number;
  color: 'emerald' | 'mint' | 'teal' | 'cyan' | 'lime' | 'celestial';
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({
  engine,
  isRunning,
  targetFps,
  drawMode,
  showGridLines,
  colorTheme,
  activeStamp,
  onClearStamp,
  onStatsUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction tracking
  const isPointerDownRef = useRef<boolean>(false);
  const strokeStateRef = useRef<0 | 1>(1); // 1 = paint alive, 0 = erase
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);
  const pointerCanvasPosRef = useRef<{ x: number; y: number } | null>(null);

  // Hover position for coordinates and stamp ghost preview
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  // Animation and FPS throttling refs
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const fpsIntervalRef = useRef<number>(1000 / targetFps);
  const frameCountRef = useRef<number>(0);
  const fpsMeasureTimerRef = useRef<number>(performance.now());
  const actualFpsRef = useRef<number>(0);
  const lastParticleTimeRef = useRef<number>(performance.now());

  // Ambient floating ethereal particles (small, medium, and large)
  const particlesRef = useRef<AmbientParticle[]>([]);
  if (particlesRef.current.length === 0) {
    const colors: ('emerald' | 'mint' | 'teal' | 'cyan' | 'lime' | 'celestial')[] = [
      'emerald',
      'mint',
      'teal',
      'cyan',
      'lime',
      'celestial',
    ];

    // 1. Large ethereal macro-orbs (sensación etérea profunda tipo bokeh fluido)
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push({
        tier: 'large',
        x: Math.random(),
        y: Math.random(),
        radius: 46 + Math.random() * 50, // 46px a 96px
        baseAlpha: 0.025 + Math.random() * 0.045, // muy transparente y tenue
        pulseSpeed: 0.0004 + Math.random() * 0.0008,
        pulsePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.000015,
        vy: -(0.00001 + Math.random() * 0.000025), // ascenso ultra lento
        waveAmp: 0.016 + Math.random() * 0.028,
        waveFreq: 0.0004 + Math.random() * 0.0008,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 2. Medium ethereal bubbles (esferas translúcidas con reborde luminoso sutil)
    for (let i = 0; i < 18; i++) {
      particlesRef.current.push({
        tier: 'medium',
        x: Math.random(),
        y: Math.random(),
        radius: 14 + Math.random() * 18, // 14px a 32px
        baseAlpha: 0.045 + Math.random() * 0.075, // translúcido y tenue
        pulseSpeed: 0.0008 + Math.random() * 0.0014,
        pulsePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.000025,
        vy: -(0.000018 + Math.random() * 0.000045),
        waveAmp: 0.01 + Math.random() * 0.02,
        waveFreq: 0.0007 + Math.random() * 0.0012,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 3. Small bioluminescent spores (polvo brillante sutil)
    for (let i = 0; i < 32; i++) {
      particlesRef.current.push({
        tier: 'small',
        x: Math.random(),
        y: Math.random(),
        radius: 1.2 + Math.random() * 3.8, // 1.2px a 5.0px
        baseAlpha: 0.12 + Math.random() * 0.22,
        pulseSpeed: 0.0012 + Math.random() * 0.002,
        pulsePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.000035,
        vy: -(0.000025 + Math.random() * 0.000065),
        waveAmp: 0.006 + Math.random() * 0.015,
        waveFreq: 0.0009 + Math.random() * 0.0016,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  useEffect(() => {
    fpsIntervalRef.current = 1000 / targetFps;
  }, [targetFps]);

  /**
   * Translates client pointer coordinates to grid cell coordinates (x, y)
   */
  const getGridCoordinates = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      if (clickX < 0 || clickX >= rect.width || clickY < 0 || clickY >= rect.height) {
        pointerCanvasPosRef.current = null;
        return null;
      }

      // Record canvas pixel space for subtle particle interaction
      pointerCanvasPosRef.current = {
        x: clickX * (canvas.width / rect.width),
        y: clickY * (canvas.height / rect.height),
      };

      const cellWidth = rect.width / engine.cols;
      const cellHeight = rect.height / engine.rows;

      const col = Math.floor(clickX / cellWidth);
      const row = Math.floor(clickY / cellHeight);

      if (col >= 0 && col < engine.cols && row >= 0 && row < engine.rows) {
        return { x: col, y: row };
      }
      return null;
    },
    [engine.cols, engine.rows]
  );

  /**
   * Renders the complete frame:
   * 1. Animated living petri-dish background (dark green & obsidian black gradients)
   * 2. Ambient floating & reactive bioluminescent particles
   * 3. Delicate lab grid lines
   * 4. 3D organic cellular bubbles (Active, Resting 3-state, and Newborns)
   * 5. Ghost stamp preview if an active stamp is selected
   */
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cols = engine.cols;
    const rows = engine.rows;
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    const now = performance.now();

    // 1. Animated Deep Dark Green & Obsidian Black Background
    const maxDim = Math.max(width, height);
    const shiftX1 = width * (0.5 + 0.16 * Math.sin(now * 0.00035));
    const shiftY1 = height * (0.5 + 0.14 * Math.cos(now * 0.00028));

    // Primary shifting radial gradient
    const bgGrad = ctx.createRadialGradient(
      shiftX1,
      shiftY1,
      maxDim * 0.06,
      shiftX1,
      shiftY1,
      maxDim * 0.78
    );
    bgGrad.addColorStop(0, '#032415');    // Verde esmeralda oscuro en el centro
    bgGrad.addColorStop(0.32, '#02180e'); // Bosque profundo
    bgGrad.addColorStop(0.68, '#010f08'); // Verde obsidiana tenue
    bgGrad.addColorStop(1, '#000402');    // Negro profundo
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Secondary subtle undulating bio-glow nebula
    const shiftX2 = width * (0.35 + 0.22 * Math.cos(now * 0.00022));
    const shiftY2 = height * (0.65 + 0.2 * Math.sin(now * 0.0003));
    const nebulaGrad = ctx.createRadialGradient(
      shiftX2,
      shiftY2,
      0,
      shiftX2,
      shiftY2,
      maxDim * 0.55
    );
    nebulaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)'); // Brillo tenue esmeralda
    nebulaGrad.addColorStop(0.45, 'rgba(5, 46, 22, 0.08)');
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Floating & Interactive Particles (Partículas etéreas pequeñas, medianas y grandes)
    const particles = particlesRef.current;
    const dt = Math.min(now - lastParticleTimeRef.current, 100);
    lastParticleTimeRef.current = now;
    const pointerPos = pointerCanvasPosRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Slow upward and horizontal drift
      p.y += p.vy * dt;
      p.x += p.vx * dt;

      // Wrap boundaries seamlessly
      if (p.y < -0.1) p.y = 1.1;
      if (p.y > 1.1) p.y = -0.1;
      if (p.x < -0.1) p.x = 1.1;
      if (p.x > 1.1) p.x = -0.1;

      // Gentle wave oscillation
      const wave = Math.sin(now * p.waveFreq + p.pulsePhase) * p.waveAmp;
      let px = (p.x + wave) * width;
      let py = p.y * height;

      // Subtle interaction with mouse/touch pointer
      let interactionGlow = 0;
      if (pointerPos) {
        const dx = px - pointerPos.x;
        const dy = py - pointerPos.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = p.tier === 'large' ? 140 : p.tier === 'medium' ? 110 : 80;
        if (dist < repelRadius && dist > 0.001) {
          const force = 1 - dist / repelRadius;
          const push = p.tier === 'large' ? 10 : p.tier === 'medium' ? 16 : 22;
          px += (dx / dist) * force * push;
          py += (dy / dist) * force * push;
          interactionGlow = force * 0.2;
        }
      }

      // Breathing opacity
      const pulse = Math.sin(now * p.pulseSpeed + p.pulsePhase);
      const alpha = Math.min(
        0.85,
        Math.max(0.015, p.baseAlpha + pulse * (p.baseAlpha * 0.4) + interactionGlow)
      );

      // Color selection in soft ethereal bioluminescent tones
      let rgb = '52, 211, 153'; // emerald
      if (p.color === 'mint') rgb = '110, 231, 183';
      else if (p.color === 'teal') rgb = '45, 212, 191';
      else if (p.color === 'cyan') rgb = '103, 232, 249';
      else if (p.color === 'lime') rgb = '163, 230, 53';
      else if (p.color === 'celestial') rgb = '167, 243, 208';

      if (p.tier === 'large') {
        // === PARTÍCULAS GRANDES: Macro-orbes etéreos, transparentes y envolventes ===
        const outerR = p.radius * 1.6;
        const grad = ctx.createRadialGradient(
          px - p.radius * 0.15,
          py - p.radius * 0.15,
          0,
          px,
          py,
          outerR
        );
        grad.addColorStop(0, `rgba(${rgb}, ${alpha * 1.5})`);
        grad.addColorStop(0.35, `rgba(${rgb}, ${alpha * 0.8})`);
        grad.addColorStop(0.7, `rgba(${rgb}, ${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.beginPath();
        ctx.arc(px, py, outerR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Delicada membrana etérea exterior ultra-translúcida
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.5})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Destello o reflejo sutil en forma de media luna
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 0.85, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (p.tier === 'medium') {
        // === PARTÍCULAS MEDIANAS: Esferas y burbujas translúcidas con brillo etéreo ===
        const outerR = p.radius * 1.5;
        const grad = ctx.createRadialGradient(
          px - p.radius * 0.1,
          py - p.radius * 0.1,
          0,
          px,
          py,
          outerR
        );
        grad.addColorStop(0, `rgba(${rgb}, ${alpha * 1.4})`);
        grad.addColorStop(0.45, `rgba(${rgb}, ${alpha * 0.65})`);
        grad.addColorStop(0.85, `rgba(${rgb}, ${alpha * 0.2})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.beginPath();
        ctx.arc(px, py, outerR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Membrana esférica transparente
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.8})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();

        // Destello etéreo interior
        ctx.beginPath();
        ctx.arc(px - p.radius * 0.25, py - p.radius * 0.25, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
        ctx.fill();
      } else {
        // === PARTÍCULAS PEQUEÑAS: Esporas bioluminiscentes finas ===
        const haloR = p.radius * 2.4;
        const haloGrad = ctx.createRadialGradient(px, py, 0, px, py, haloR);
        haloGrad.addColorStop(0, `rgba(${rgb}, ${alpha * 1.4})`);
        haloGrad.addColorStop(0.4, `rgba(${rgb}, ${alpha * 0.6})`);
        haloGrad.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.beginPath();
        ctx.arc(px, py, haloR, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();

        // Núcleo brillante
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.8, p.radius * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.1})`;
        ctx.fill();
      }
    }

    // Selected theme definition
    const theme = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];
    const buffer = engine.getGridBuffer();
    const isThreeState = engine.isThreeState;

    // 3. Draw Subtle Bio-Grid Lines
    if (showGridLines && cellWidth >= 4) {
      ctx.strokeStyle = 'rgba(20, 83, 45, 0.35)'; // Tono verde oscuro tenue
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) {
        const px = Math.round(x * cellWidth);
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
      }
      for (let y = 0; y <= rows; y++) {
        const py = Math.round(y * cellHeight);
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
      }
      ctx.stroke();
    }

    // 3. Render 3D Organic Cells
    const baseRadius = Math.min(cellWidth, cellHeight) * 0.46;
    const isHighDensity = baseRadius < 2.5;

    for (let r = 0; r < rows; r++) {
      const rowOffset = r * cols;
      const py = r * cellHeight;
      const cy = py + cellHeight / 2;

      for (let c = 0; c < cols; c++) {
        const val = buffer[rowOffset + c];
        if (val === 0) continue;

        const px = c * cellWidth;
        const cx = px + cellWidth / 2;
        const age = engine.getCellAge(c, r);

        if (isHighDensity) {
          // Fast rendering for ultra-dense resolutions
          ctx.beginPath();
          ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = val === 2 ? '#a78bfa' : theme.primaryColor;
          ctx.fill();
          continue;
        }

        if (val === 1) {
          // --- ESTADO 1: CÉLULA VIVA / BURBUJA 3D ---
          const cellR = baseRadius;
          const lightX = cx - cellR * 0.3;
          const lightY = cy - cellR * 0.35;

          // 3D Spherical Radial Gradient
          const sphereGrad = ctx.createRadialGradient(
            lightX,
            lightY,
            cellR * 0.08,
            cx,
            cy,
            cellR
          );
          sphereGrad.addColorStop(0, '#ffffff'); // Luz especular
          sphereGrad.addColorStop(0.25, theme.lightColor); // Citoplasma iluminado
          sphereGrad.addColorStop(0.65, theme.primaryColor); // Cuerpo celular
          sphereGrad.addColorStop(0.9, theme.deepColor); // Sombra interna
          sphereGrad.addColorStop(1, theme.membraneColor); // Membrana celular

          // Destello al nacer (pulso de nacimiento)
          if (age === 1 && cellR >= 3) {
            ctx.beginPath();
            ctx.arc(cx, cy, cellR * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = theme.glowColor;
            ctx.fill();
          }

          // Cuerpo de la célula
          ctx.beginPath();
          ctx.arc(cx, cy, cellR, 0, Math.PI * 2);
          ctx.fillStyle = sphereGrad;
          ctx.fill();

          // Borde de la membrana
          ctx.strokeStyle = theme.membraneColor;
          ctx.lineWidth = Math.max(0.6, cellR * 0.1);
          ctx.stroke();

          // Brillo de burbuja líquida (Glossy reflection)
          if (cellR >= 4) {
            ctx.save();
            ctx.translate(cx - cellR * 0.3, cy - cellR * 0.35);
            ctx.rotate(-0.4);
            ctx.beginPath();
            ctx.ellipse(0, 0, cellR * 0.32, cellR * 0.16, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fill();

            // Reflejo secundario sutil en el borde inferior
            ctx.beginPath();
            ctx.ellipse(cellR * 0.55, cellR * 0.55, cellR * 0.16, cellR * 0.07, 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fill();
            ctx.restore();

            // Pequeño núcleo celular si ya tiene más de una generación
            if (age > 1 && cellR >= 6) {
              ctx.beginPath();
              ctx.arc(cx, cy, cellR * 0.2, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
              ctx.fill();
            }
          }
        } else if (val === 2 && isThreeState) {
          // --- ESTADO 2: CÉLULA DURMIENDO / DESCANSO (Life-3 State) ---
          const restR = baseRadius * 0.9;
          const lightX = cx - restR * 0.25;
          const lightY = cy - restR * 0.3;

          const restGrad = ctx.createRadialGradient(
            lightX,
            lightY,
            restR * 0.1,
            cx,
            cy,
            restR
          );
          restGrad.addColorStop(0, '#f5f3ff');
          restGrad.addColorStop(0.3, '#ddd6fe');
          restGrad.addColorStop(0.7, '#8b5cf6');
          restGrad.addColorStop(1, '#5b21b6');

          ctx.beginPath();
          ctx.arc(cx, cy, restR, 0, Math.PI * 2);
          ctx.fillStyle = restGrad;
          ctx.fill();

          if (restR >= 4) {
            ctx.save();
            ctx.translate(cx - restR * 0.25, cy - restR * 0.3);
            ctx.rotate(-0.4);
            ctx.beginPath();
            ctx.ellipse(0, 0, restR * 0.25, restR * 0.12, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }

    // 4. Ghost Preview for Pattern Stamp
    if (activeStamp && hoverCoord) {
      const { preset, rotation } = activeStamp;
      const rawCells = preset.cells;
      const pRows = rawCells.length;
      const pCols = rawCells[0]?.length || 0;

      ctx.save();
      for (let r = 0; r < pRows; r++) {
        for (let c = 0; c < pCols; c++) {
          const val = rawCells[r][c];
          if (val > 0) {
            let rx = c;
            let ry = r;
            if (rotation === 90) {
              rx = pRows - 1 - r;
              ry = c;
            } else if (rotation === 180) {
              rx = pCols - 1 - c;
              ry = pRows - 1 - r;
            } else if (rotation === 270) {
              rx = r;
              ry = pCols - 1 - c;
            }

            let targetX = hoverCoord.x + rx;
            let targetY = hoverCoord.y + ry;

            if (engine.toroidal) {
              targetX = ((targetX % cols) + cols) % cols;
              targetY = ((targetY % rows) + rows) % rows;
            }

            if (targetX >= 0 && targetX < cols && targetY >= 0 && targetY < rows) {
              const px = targetX * cellWidth;
              const py = targetY * cellHeight;
              const cx = px + cellWidth / 2;
              const cy = py + cellHeight / 2;

              ctx.beginPath();
              ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
              ctx.fillStyle = val === 2 ? 'rgba(167, 139, 250, 0.65)' : 'rgba(56, 189, 248, 0.65)';
              ctx.fill();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }
      ctx.restore();
    } else if (hoverCoord && !isRunning) {
      // Cell target crosshair highlight
      const px = hoverCoord.x * cellWidth;
      const py = hoverCoord.y * cellHeight;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 1, py + 1, cellWidth - 2, cellHeight - 2);
    }
  }, [engine, showGridLines, colorTheme, activeStamp, hoverCoord, isRunning]);

  /**
   * Main Simulation Animation Loop with precise FPS throttling
   */
  useEffect(() => {
    let isCancelled = false;

    const loop = (now: number) => {
      if (isCancelled) return;

      const elapsed = now - lastFrameTimeRef.current;

      if (isRunning) {
        if (elapsed >= fpsIntervalRef.current) {
          lastFrameTimeRef.current = now - (elapsed % fpsIntervalRef.current);
          engine.step();
          onStatsUpdate();

          frameCountRef.current++;
          if (now - fpsMeasureTimerRef.current >= 1000) {
            actualFpsRef.current = frameCountRef.current;
            frameCountRef.current = 0;
            fpsMeasureTimerRef.current = now;
          }
        }
      } else {
        lastFrameTimeRef.current = now;
      }

      renderFrame();
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      isCancelled = true;
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [engine, isRunning, onStatsUpdate, renderFrame]);

  /**
   * ResizeObserver to adaptively scale canvas to container resolution.
   * Uses requestAnimationFrame to prevent 'ResizeObserver loop completed with undelivered notifications'.
   */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let rafId: number | null = null;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) return;
      const entry = entries[0];
      const { width, height } = entry.contentRect;

      if (width > 0 && height > 0) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        rafId = window.requestAnimationFrame(() => {
          const dpr = window.devicePixelRatio || 1;
          const targetW = Math.round(width * dpr);
          const targetH = Math.round(height * dpr);

          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
          }
          renderFrame();
        });
      }
    });

    resizeObserver.observe(container);
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
    };
  }, [renderFrame]);

  /**
   * Non-passive touch listener attachment to prevent page scroll while painting on mobile
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault(); // Prevent bounce scroll and zoom
    };

    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  /**
   * Linear Interpolation to connect points during fast finger or mouse drags
   */
  const paintLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number, state: 0 | 1) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      let cx = x0;
      let cy = y0;

      while (true) {
        engine.setCell(cx, cy, state);
        if (cx === x1 && cy === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          cx += sx;
        }
        if (e2 < dx) {
          err += dx;
          cy += sy;
        }
      }
    },
    [engine]
  );

  /**
   * Pointer interaction handlers (Mouse, Pen, Touch)
   */
  const handlePointerDown = (clientX: number, clientY: number, button: number = 0) => {
    const coords = getGridCoordinates(clientX, clientY);
    if (!coords) return;

    // Pattern Stamp placement
    if (activeStamp) {
      engine.stampPattern(activeStamp.preset, coords.x, coords.y, activeStamp.rotation);
      onStatsUpdate();
      renderFrame();
      return;
    }

    isPointerDownRef.current = true;
    lastCellRef.current = coords;

    if (drawMode === 'erase' || button === 2) {
      strokeStateRef.current = 0;
      engine.setCell(coords.x, coords.y, 0);
    } else {
      const current = engine.getCell(coords.x, coords.y);
      const newState: 0 | 1 = current === 0 ? 1 : 0;
      strokeStateRef.current = newState;
      engine.setCell(coords.x, coords.y, newState);
    }

    onStatsUpdate();
    renderFrame();
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    const coords = getGridCoordinates(clientX, clientY);
    setHoverCoord(coords);

    if (!isPointerDownRef.current || !coords) return;

    if (lastCellRef.current) {
      // Paint connected line between last position and current position
      paintLine(
        lastCellRef.current.x,
        lastCellRef.current.y,
        coords.x,
        coords.y,
        strokeStateRef.current
      );
    } else {
      engine.setCell(coords.x, coords.y, strokeStateRef.current);
    }

    lastCellRef.current = coords;
    onStatsUpdate();
    renderFrame();
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    lastCellRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      className="game-stage-container relative w-full flex-1 h-[55vh] sm:h-[65vh] lg:h-[calc(100vh-220px)] min-h-[360px] rounded-3xl overflow-hidden border-2 shadow-2xl select-none cursor-crosshair touch-none transition-all duration-700"
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY, e.button)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseUp={handlePointerUp}
      onMouseLeave={() => {
        handlePointerUp();
        setHoverCoord(null);
        pointerCanvasPosRef.current = null;
      }}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          handlePointerDown(t.clientX, t.clientY);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          handlePointerMove(t.clientX, t.clientY);
        }
      }}
      onTouchEnd={handlePointerUp}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Coordinate and Status Pill Badge */}
      <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs font-mono text-slate-300 backdrop-blur-md shadow-lg">
        {hoverCoord ? (
          <span>
            X: <strong className="text-pink-400 font-bold">{hoverCoord.x}</strong> Y:{' '}
            <strong className="text-cyan-400 font-bold">{hoverCoord.y}</strong>
          </span>
        ) : (
          <span className="font-heading">Placa de Microscopio</span>
        )}
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        <span className="text-[11px] font-sans">
          {activeStamp
            ? 'Toca para estampar'
            : drawMode === 'draw'
            ? 'Dibuja con tu dedo o ratón'
            : 'Modo goma de borrar'}
        </span>
      </div>

      {/* Stamp Active Floating Banner */}
      {activeStamp && (
        <div className="absolute top-3 left-3 flex items-center gap-2.5 bg-indigo-950/90 border border-indigo-500/60 px-3.5 py-2 rounded-xl text-xs text-indigo-200 shadow-xl backdrop-blur-md animate-pulse">
          <span className="text-base">{activeStamp.preset.emoji || '✨'}</span>
          <div>
            <span className="font-heading font-bold text-white block">
              Estampando: {activeStamp.preset.funKidName || activeStamp.preset.name}
            </span>
            <span className="text-[10px] text-indigo-300">Toca en la placa para clonarlo</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClearStamp();
            }}
            className="ml-1 px-2.5 py-1 bg-indigo-800/80 hover:bg-indigo-700 rounded-lg text-xs cursor-pointer text-white font-heading font-semibold"
          >
            Listo
          </button>
        </div>
      )}
    </div>
  );
};
