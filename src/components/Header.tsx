/**
 * Minimalist, Child-friendly Header for Conway's Game of Life
 * Clean, lightweight, featuring a live cute cellular logo and live micro-status.
 */
import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { RulesetConfig, SimulationStats } from '../types';

interface HeaderProps {
  onOpenSettings: () => void;
  isRunning: boolean;
  currentRuleset: RulesetConfig;
  stats: SimulationStats;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  isRunning,
  currentRuleset,
  stats,
}) => {
  return (
    <header
      id="app-header"
      className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        {/* Animated Cute Cellular Bubble Logo */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500/25 via-indigo-500/20 to-teal-500/25 border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/10 shrink-0">
          <div className="relative w-5 h-5 flex items-center justify-center">
            <span
              className={`absolute w-3 h-3 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md transition-transform duration-500 ${
                isRunning ? 'scale-110 -translate-x-1 -translate-y-1' : ''
              }`}
            />
            <span
              className={`absolute w-3 h-3 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-300 shadow-md transition-transform duration-500 ${
                isRunning ? 'scale-110 translate-x-1 translate-y-1' : ''
              }`}
            />
            <span className="relative w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-heading font-extrabold tracking-tight text-white flex items-center gap-1.5 flex-wrap">
              <span>El Juego de la Vida de Conway</span>
              <span className="text-xs sm:text-sm font-semibold text-pink-400">por Robert Pacheco</span>
              <span className="text-base">✨</span>
            </h1>

            <span className="text-[11px] font-heading font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden xs:flex items-center gap-1">
              <span>{currentRuleset.emoji}</span>
              <span>{currentRuleset.shortName}</span>
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-400 font-sans hidden sm:block">
            Toca o desliza tu dedo sobre la placa para crear microorganismos 3D
          </p>
        </div>
      </div>

      {/* Right Side: Micro-stats & Settings Shortcut */}
      <div className="flex items-center gap-2">
        {/* Live Mini Counters */}
        <div
          id="header-mini-stats"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-heading font-bold text-slate-300"
          title="Generación actual y células vivas"
        >
          <span className="text-cyan-400">
            {stats.aliveCount.toLocaleString()}{' '}
            <span className="text-[10px] font-normal text-slate-400">vivas</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-indigo-300">
            Gen{' '}
            <strong className="font-mono text-white">{stats.generation.toLocaleString()}</strong>
          </span>
        </div>

        {/* Settings button in header as well */}
        <button
          id="btn-header-settings"
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shadow-sm"
          title="Abrir menú de ajustes"
        >
          <Settings className="w-4 h-4 text-pink-400" />
        </button>
      </div>
    </header>
  );
};
