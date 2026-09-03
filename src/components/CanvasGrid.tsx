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

  // Hover position for coordinates and stamp ghost preview
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  // Animation and FPS throttling refs
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const fpsIntervalRef = useRef<number>(1000 / targetFps);
  const frameCountRef = useRef<number>(0);
  const fpsMeasureTimerRef = useRef<number>(performance.now());
  const actualFpsRef = useRef<number>(0);

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
        return null;
      }

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
   * 1. Bioluminescent petri-dish background
   * 2. Delicate lab grid lines
   * 3. 3D organic cellular bubbles (Active, Resting 3-state, and Newborns)
   * 4. Ghost stamp preview if an active stamp is selected
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

    // 1. Clear with Deep Bioluminescent Lab Background
    const bgGrad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.1,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    bgGrad.addColorStop(0, '#0f172a'); // slate-900 center
    bgGrad.addColorStop(1, '#020617'); // slate-950 edges
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Selected theme definition
    const theme = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];
    const buffer = engine.getGridBuffer();
    const isThreeState = engine.isThreeState;

    // 2. Draw Subtle Bio-Grid Lines
    if (showGridLines && cellWidth >= 4) {
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)'; // slate-700
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
      className="relative w-full flex-1 h-[55vh] sm:h-[65vh] lg:h-[calc(100vh-220px)] min-h-[360px] rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800/80 shadow-2xl select-none cursor-crosshair touch-none"
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY, e.button)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseUp={handlePointerUp}
      onMouseLeave={() => {
        handlePointerUp();
        setHoverCoord(null);
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
