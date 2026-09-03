/**
 * Minimalist, Child-friendly Header for Conway's Game of Life
 * Clean, lightweight, featuring a live cute cellular logo and live micro-status.
 */
import React from 'react';
import { Settings, Sparkles, HelpCircle } from 'lucide-react';
import { RulesetConfig, SimulationStats } from '../types';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  isRunning: boolean;
  currentRuleset: RulesetConfig;
  stats: SimulationStats;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenTutorial,
  isRunning,
  currentRuleset,
  stats,
}) => {
  return (
    <header
      id="app-header"
      className="flex items-center justify-between px-2.5 sm:px-5 py-1.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900/85 border border-slate-800 shadow-xl backdrop-blur-md gap-2 overflow-hidden"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Animated Cute Cellular Bubble Logo */}
        <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500/25 via-indigo-500/20 to-teal-500/25 border border-indigo-500/40 shadow-lg shadow-indigo-500/10 shrink-0">
          <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
            <span
              className={`absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md transition-transform duration-500 ${
                isRunning ? 'scale-110 -translate-x-1 -translate-y-1' : ''
              }`}
            />
            <span
              className={`absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-300 shadow-md transition-transform duration-500 ${
                isRunning ? 'scale-110 translate-x-1 translate-y-1' : ''
              }`}
            />
            <span className="relative w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-heading font-extrabold tracking-tight text-white flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-tight truncate">
              <span className="truncate">El Juego de la Vida</span>
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-pink-400 whitespace-nowrap">por Robert Pacheco</span>
            </h1>

            <span className="text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden md:flex items-center gap-1">
              <span>{currentRuleset.emoji}</span>
              <span>{currentRuleset.shortName}</span>
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-400 font-sans hidden md:block">
            Toca o desliza tu dedo sobre la placa para crear microorganismos 3D
          </p>
        </div>
      </div>

      {/* Right Side: Micro-stats & Settings Shortcut */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Live Mini Counters */}
        <div
          id="header-mini-stats"
          className="hidden xs:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] sm:text-xs font-heading font-bold text-slate-300"
          title="Generación actual y células vivas"
        >
          <span className="text-cyan-400">
            {stats.aliveCount.toLocaleString()}{' '}
            <span className="text-[9px] sm:text-[10px] font-normal text-slate-400">vivas</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-indigo-300">
            Gen{' '}
            <strong className="font-mono text-white">{stats.generation.toLocaleString()}</strong>
          </span>
        </div>

        {/* Tutorial / Ayuda Guía */}
        <button
          id="btn-header-tutorial"
          type="button"
          onClick={onOpenTutorial}
          className="px-2 sm:px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 transition-all cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center gap-1 sm:gap-1.5 text-xs font-heading font-bold shadow-sm"
          title="Ver tutorial guiado"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Tutorial</span>
        </button>

        {/* Settings button in header as well */}
        <button
          id="btn-header-settings"
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[38px] sm:min-w-[38px] flex items-center justify-center shadow-sm"
          title="Abrir menú de ajustes"
        >
          <Settings className="w-4 h-4 text-pink-400" />
        </button>
      </div>
    </header>
  );
};
