/**
 * Minimalist, Floating Bottom Toolbar for Conway's Game of Life
 * Houses only the essential primary simulation controls: Play/Pause, Step, Clear,
 * Draw/Erase toggle, Quick Magic Soup, and the Settings gear button.
 */
import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Settings, PenTool, Eraser, Shuffle } from 'lucide-react';
import { DrawMode } from '../types';

interface BottomToolbarProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onClear: () => void;
  onRandomize: () => void;
  drawMode: DrawMode;
  onDrawModeToggle: () => void;
  onOpenSettings: () => void;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  isRunning,
  onTogglePlay,
  onStep,
  onClear,
  onRandomize,
  drawMode,
  onDrawModeToggle,
  onOpenSettings,
}) => {
  return (
    <div
      id="floating-bottom-toolbar"
      className="w-full flex items-center justify-center pointer-events-none select-none"
    >
      <nav
        aria-label="Controles Principales"
        className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl max-w-fit"
      >
        {/* HERO: Play / Pause */}
        <button
          id="btn-main-play"
          type="button"
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full text-sm font-heading font-extrabold shadow-lg transition-all duration-200 cursor-pointer active:scale-95 min-h-[48px] ${
            isRunning
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400'
              : 'bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white shadow-pink-500/30 hover:brightness-110 hover:scale-[1.02] animate-pulse'
          }`}
          title={isRunning ? 'Pausar simulación (Espacio)' : '¡Dar vida a las células! (Espacio)'}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pausa</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>¡Dar Vida!</span>
            </>
          )}
        </button>

        {/* Paso a paso */}
        <button
          id="btn-main-step"
          type="button"
          onClick={onStep}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-3 rounded-full bg-slate-800/90 hover:bg-slate-750 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 hover:text-white text-xs font-heading font-bold border border-slate-700 shadow-sm cursor-pointer transition-all min-h-[48px]"
          title="Avanzar 1 generación (Flecha derecha)"
        >
          <SkipForward className="w-4 h-4 text-cyan-400" />
          <span className="hidden xs:inline">Paso</span>
        </button>

        {/* Limpiar */}
        <button
          id="btn-main-clear"
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-3 rounded-full bg-slate-800/90 hover:bg-rose-950/60 active:scale-95 text-slate-200 hover:text-rose-300 text-xs font-heading font-bold border border-slate-700 hover:border-rose-800/50 shadow-sm cursor-pointer transition-all min-h-[48px]"
          title="Limpiar toda la placa"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span className="hidden xs:inline">Limpiar</span>
        </button>

        {/* Alternar Lápiz / Goma */}
        <button
          id="btn-toggle-draw-mode"
          type="button"
          onClick={onDrawModeToggle}
          className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-3 rounded-full text-xs font-heading font-bold border transition-all active:scale-95 cursor-pointer min-h-[48px] ${
            drawMode === 'erase'
              ? 'bg-rose-950/70 border-rose-500/80 text-rose-200 shadow-rose-900/30'
              : 'bg-slate-800/90 border-slate-700 hover:bg-slate-750 text-slate-200'
          }`}
          title={drawMode === 'erase' ? 'Modo actual: Goma de borrar. Toca para volver a dibujar' : 'Modo actual: Lápiz. Toca para cambiar a goma de borrar'}
        >
          {drawMode === 'erase' ? (
            <>
              <Eraser className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Goma</span>
            </>
          ) : (
            <>
              <PenTool className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Lápiz</span>
            </>
          )}
        </button>

        {/* Sopa Mágica Rápida */}
        <button
          id="btn-main-random"
          type="button"
          onClick={onRandomize}
          className="hidden sm:flex items-center gap-1.5 px-3.5 sm:px-4 py-3 rounded-full bg-slate-800/90 hover:bg-slate-750 active:scale-95 text-slate-200 hover:text-white text-xs font-heading font-bold border border-slate-700 shadow-sm cursor-pointer transition-all min-h-[48px]"
          title="Generar sopa de células mágicas al azar"
        >
          <Shuffle className="w-4 h-4 text-teal-400" />
          <span>Sopa 🎲</span>
        </button>

        {/* Botón de Ajustes (Engranaje) */}
        <button
          id="btn-main-settings"
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-indigo-950/80 hover:bg-indigo-900 active:scale-95 text-indigo-200 hover:text-white text-xs font-heading font-extrabold border border-indigo-500/50 shadow-lg shadow-indigo-500/10 cursor-pointer transition-all min-h-[48px]"
          title="Abrir ajustes avanzados, criaturas, temas y velocidades"
        >
          <Settings className="w-4 h-4 text-pink-400 animate-spin-slow" />
          <span>Ajustes</span>
        </button>
      </nav>
    </div>
  );
};
