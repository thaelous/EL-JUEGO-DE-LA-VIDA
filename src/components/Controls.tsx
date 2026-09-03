/**
 * Playback and simulation controls for Conway's Game of Life & Cellular Automata
 * Designed with touch-friendly targets, playful animations, and vibrant styling.
 */
import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  Sliders,
  Grid,
  Globe,
  Palette,
  Eraser,
  PenTool,
  Repeat,
  Zap,
} from 'lucide-react';
import { DrawMode } from '../types';

export interface GridSizeOption {
  label: string;
  shortLabel: string;
  cols: number;
  rows: number;
}

export const GRID_SIZES: GridSizeOption[] = [
  { label: 'Compacta (45 × 28) - Células grandes', shortLabel: 'Compacta', cols: 45, rows: 28 },
  { label: 'Estándar (75 × 45) - Recomendada', shortLabel: 'Estándar', cols: 75, rows: 45 },
  { label: 'Amplia (105 × 65) - Gran colonia', shortLabel: 'Amplia', cols: 105, rows: 65 },
  { label: 'Máxima (140 × 85) - Alta densidad', shortLabel: 'Máxima', cols: 140, rows: 85 },
];

export type ColorTheme = 'cyan' | 'emerald' | 'violet' | 'pink' | 'amber';

export interface ColorThemeConfig {
  id: ColorTheme;
  label: string;
  emoji: string;
  bgClass: string;
  hex: string;
  lightColor: string;
  primaryColor: string;
  deepColor: string;
  membraneColor: string;
  glowColor: string;
}

export const COLOR_THEMES: ColorThemeConfig[] = [
  {
    id: 'cyan',
    label: 'Burbujas Marinas',
    emoji: '🫧',
    bgClass: 'bg-cyan-400',
    hex: '#22d3ee',
    lightColor: '#e0f2fe',
    primaryColor: '#38bdf8',
    deepColor: '#0284c7',
    membraneColor: '#0369a1',
    glowColor: 'rgba(56, 189, 248, 0.5)',
  },
  {
    id: 'emerald',
    label: 'Gominolas Esmeralda',
    emoji: '🍏',
    bgClass: 'bg-emerald-400',
    hex: '#10b981',
    lightColor: '#dcfce7',
    primaryColor: '#4ade80',
    deepColor: '#16a34a',
    membraneColor: '#15803d',
    glowColor: 'rgba(74, 222, 128, 0.5)',
  },
  {
    id: 'violet',
    label: 'Poción Mágica',
    emoji: '🔮',
    bgClass: 'bg-purple-400',
    hex: '#c084fc',
    lightColor: '#f3e8ff',
    primaryColor: '#c084fc',
    deepColor: '#9333ea',
    membraneColor: '#7e22ce',
    glowColor: 'rgba(192, 132, 252, 0.5)',
  },
  {
    id: 'pink',
    label: 'Células Fresa',
    emoji: '🍓',
    bgClass: 'bg-pink-400',
    hex: '#f472b6',
    lightColor: '#fce7f3',
    primaryColor: '#f472b6',
    deepColor: '#db2777',
    membraneColor: '#be185d',
    glowColor: 'rgba(244, 114, 182, 0.5)',
  },
  {
    id: 'amber',
    label: 'Miel Solar',
    emoji: '🍯',
    bgClass: 'bg-amber-400',
    hex: '#fbbf24',
    lightColor: '#fef3c7',
    primaryColor: '#fbbf24',
    deepColor: '#d97706',
    membraneColor: '#b45309',
    glowColor: 'rgba(251, 191, 36, 0.5)',
  },
];

interface ControlsProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onClear: () => void;
  onRandomize: (density?: number) => void;
  onInvert: () => void;
  fps: number;
  onFpsChange: (fps: number) => void;
  currentGridSize: { cols: number; rows: number };
  onGridSizeChange: (size: GridSizeOption) => void;
  drawMode: DrawMode;
  onDrawModeChange: (mode: DrawMode) => void;
  showGridLines: boolean;
  onToggleGridLines: () => void;
  toroidal: boolean;
  onToggleToroidal: () => void;
  colorTheme: ColorTheme;
  onColorThemeChange: (theme: ColorTheme) => void;
  density: number;
  onDensityChange: (density: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onTogglePlay,
  onStep,
  onClear,
  onRandomize,
  onInvert,
  fps,
  onFpsChange,
  currentGridSize,
  onGridSizeChange,
  drawMode,
  onDrawModeChange,
  showGridLines,
  onToggleGridLines,
  toroidal,
  onToggleToroidal,
  colorTheme,
  onColorThemeChange,
  density,
  onDensityChange,
}) => {
  return (
    <div
      id="main-controls-panel"
      className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md text-slate-200"
    >
      {/* Primera fila: Botones de Acción Táctiles Grandes */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Iniciar / Pausar */}
          <button
            id="btn-play-pause"
            type="button"
            onClick={onTogglePlay}
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-heading font-bold text-sm sm:text-base transition-all shadow-lg active:scale-95 cursor-pointer min-h-[44px] ${
              isRunning
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/40'
                : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-400/40 animate-pulse'
            }`}
            title={isRunning ? 'Pausar simulación (Espacio)' : '¡Dar vida a la simulación! (Espacio)'}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>¡Iniciar Vida!</span>
              </>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-black/25 rounded-md font-mono text-slate-900">
              Espacio
            </kbd>
          </button>

          {/* Paso a paso */}
          <button
            id="btn-step"
            type="button"
            onClick={onStep}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-heading font-semibold border border-slate-700 transition-all active:scale-95 cursor-pointer min-h-[44px]"
            title="Avanzar 1 generación a la vez"
          >
            <SkipForward className="w-4 h-4 text-cyan-400" />
            <span>Paso a Paso</span>
          </button>

          {/* Aleatorio */}
          <button
            id="btn-randomize"
            type="button"
            onClick={() => onRandomize(density)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 hover:text-amber-200 text-xs font-heading font-semibold border border-slate-700 transition-all active:scale-95 cursor-pointer min-h-[44px]"
            title="Generar caldo primordial de células vivas"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Sopa de Células</span>
          </button>

          {/* Reiniciar / Limpiar */}
          <button
            id="btn-clear"
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-700/60 text-slate-300 text-xs font-heading font-semibold border border-slate-700 transition-all active:scale-95 cursor-pointer min-h-[44px]"
            title="Limpiar toda la placa"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Limpiar</span>
          </button>

          {/* Invertir */}
          <button
            id="btn-invert"
            type="button"
            onClick={onInvert}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white text-xs font-heading font-medium border border-slate-700 transition-all active:scale-95 cursor-pointer min-h-[44px]"
            title="Invertir todas las celdas"
          >
            <Repeat className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Invertir</span>
          </button>
        </div>

        {/* Modo de interacción: Pintar vs Borrar */}
        <div
          id="draw-mode-controls"
          className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 shadow-inner"
        >
          <button
            id="mode-draw"
            type="button"
            onClick={() => onDrawModeChange('draw')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer min-h-[38px] ${
              drawMode === 'draw'
                ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/25 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pintar células vivas con el dedo o ratón"
          >
            <PenTool className="w-4 h-4 text-emerald-400" />
            <span>Lápiz Mágico</span>
          </button>
          <button
            id="mode-erase"
            type="button"
            onClick={() => onDrawModeChange('erase')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer min-h-[38px] ${
              drawMode === 'erase'
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Borrar células con el dedo o ratón"
          >
            <Eraser className="w-4 h-4 text-rose-400" />
            <span>Goma Borradora</span>
          </button>
        </div>
      </div>

      {/* Segunda fila: Sliders, Ajustes y Temas de Color 3D */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3 border-t border-slate-800/70 text-xs">
        {/* Velocidad / FPS con Presets de Animalitos */}
        <div id="control-speed" className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5 font-heading font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Velocidad de Vida</span>
            </span>
            <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {fps} pasos/s
            </span>
          </div>
          <input
            id="slider-fps"
            type="range"
            min={1}
            max={60}
            step={1}
            value={fps}
            onChange={(e) => onFpsChange(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          {/* Botones rápidos de velocidad */}
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => onFpsChange(5)}
              className={`px-1.5 py-1 rounded-md text-[11px] font-heading font-medium border transition-all cursor-pointer ${
                fps <= 8
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              🐢 Tortuga (5)
            </button>
            <button
              type="button"
              onClick={() => onFpsChange(20)}
              className={`px-1.5 py-1 rounded-md text-[11px] font-heading font-medium border transition-all cursor-pointer ${
                fps > 8 && fps <= 35
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              🐰 Conejo (20)
            </button>
            <button
              type="button"
              onClick={() => onFpsChange(60)}
              className={`px-1.5 py-1 rounded-md text-[11px] font-heading font-medium border transition-all cursor-pointer ${
                fps > 35
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚡ Rayo (60)
            </button>
          </div>
        </div>

        {/* Densidad para aleatorizar */}
        <div id="control-density" className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5 font-heading font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Población Inicial</span>
            </span>
            <span className="font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
              {Math.round(density * 100)}%
            </span>
          </div>
          <input
            id="slider-density"
            type="range"
            min={0.05}
            max={0.6}
            step={0.05}
            value={density}
            onChange={(e) => onDensityChange(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-heading">
            <span>Poco (5%)</span>
            <span>Equilibrado (20%)</span>
            <span>Lleno (60%)</span>
          </div>
        </div>

        {/* Tamaño de cuadrícula */}
        <div id="control-grid-size" className="flex flex-col gap-2">
          <label htmlFor="select-grid-size" className="flex items-center gap-1.5 font-heading font-semibold text-slate-300">
            <Grid className="w-3.5 h-3.5 text-purple-400" />
            <span>Tamaño de la Placa</span>
          </label>
          <select
            id="select-grid-size"
            value={`${currentGridSize.cols}x${currentGridSize.rows}`}
            onChange={(e) => {
              const matched = GRID_SIZES.find((s) => `${s.cols}x${s.rows}` === e.target.value);
              if (matched) onGridSizeChange(matched);
            }}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-sans focus:outline-hidden focus:border-purple-400 cursor-pointer shadow-inner min-h-[38px]"
          >
            {GRID_SIZES.map((size) => (
              <option key={`${size.cols}x${size.rows}`} value={`${size.cols}x${size.rows}`}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Opciones visuales y Temas de Color 3D */}
        <div id="control-options" className="flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-heading font-semibold text-slate-300">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>Piel Celular 3D</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {COLOR_THEMES.find((t) => t.id === colorTheme)?.emoji}{' '}
              {COLOR_THEMES.find((t) => t.id === colorTheme)?.label.split(' ')[0]}
            </span>
          </div>

          {/* Temas de Color con emojis */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {COLOR_THEMES.map((th) => (
              <button
                key={th.id}
                id={`theme-${th.id}`}
                type="button"
                onClick={() => onColorThemeChange(th.id)}
                className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-all cursor-pointer text-sm ${
                  colorTheme === th.id
                    ? 'bg-slate-800 border-white ring-2 ring-white/40 scale-110 shadow-md'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
                title={`Tema 3D: ${th.label}`}
              >
                <span>{th.emoji}</span>
              </button>
            ))}
          </div>

          {/* Toggles Rápidos (Líneas y Borde Infinito) */}
          <div className="flex items-center gap-2 pt-1">
            <button
              id="btn-toggle-grid-lines"
              type="button"
              onClick={onToggleGridLines}
              className={`flex-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-medium transition-colors cursor-pointer text-center ${
                showGridLines
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Líneas {showGridLines ? 'ON' : 'OFF'}
            </button>

            <button
              id="btn-toggle-toroidal"
              type="button"
              onClick={onToggleToroidal}
              className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-medium transition-colors cursor-pointer ${
                toroidal
                  ? 'bg-cyan-950/50 border-cyan-700/60 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
              title="Bordes infinitos: las células viajan al otro extremo"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>Borde Infinito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
