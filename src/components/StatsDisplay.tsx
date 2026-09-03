/**
 * Real-time statistics display for the Game of Life & Cellular Automata simulation
 * Playful, kid-friendly cards with rounded badges and live micro-data
 */
import React from 'react';
import { Activity, Play, Pause, Users, Gauge, Moon, Sparkles } from 'lucide-react';
import { SimulationStats } from '../types';

interface StatsDisplayProps {
  stats: SimulationStats;
  isRunning: boolean;
  targetFps: number;
  totalCells: number;
  cols: number;
  rows: number;
  isThreeState?: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  isRunning,
  targetFps,
  totalCells,
  cols,
  rows,
  isThreeState = false,
}) => {
  return (
    <div
      id="stats-panel"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md text-xs font-sans"
    >
      {/* Estado & Generación */}
      <div
        id="stat-generation"
        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-xs"
      >
        <div
          className={`p-2 rounded-xl text-base ${
            isRunning
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {isRunning ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-heading font-bold">
            Paso de Tiempo
          </span>
          <span className="text-sm font-heading font-extrabold text-slate-100 truncate">
            Gen {stats.generation.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Células Vivas */}
      <div
        id="stat-living-cells"
        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-xs"
      >
        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-base">
          <Users className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-heading font-bold">
            Células Vivas
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-heading font-extrabold text-cyan-300">
              {stats.aliveCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono font-bold">
              ({stats.livingRatio}%)
            </span>
          </div>
        </div>
      </div>

      {/* 3-State Resting Cells or Peak Population */}
      {isThreeState && stats.restingCount !== undefined ? (
        <div
          id="stat-resting-cells"
          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 shadow-xs"
        >
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-base">
            <Moon className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-purple-300 uppercase tracking-wider font-heading font-bold">
              Durmiendo (Descanso)
            </span>
            <span className="text-sm font-heading font-extrabold text-purple-200">
              {stats.restingCount.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div
          id="stat-peak-population"
          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-xs"
        >
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 text-base">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-heading font-bold">
              Población Récord
            </span>
            <span className="text-sm font-heading font-extrabold text-pink-300">
              {stats.peakAliveCount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Velocidad Medida */}
      <div
        id="stat-speed-rate"
        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-xs"
      >
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-base">
          <Gauge className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-heading font-bold">
            Ritmo Real
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-heading font-extrabold text-amber-300">
              {isRunning ? `${stats.actualFps}` : '0'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ {targetFps} fps</span>
          </div>
        </div>
      </div>

      {/* Dimensión de la placa */}
      <div
        id="stat-grid-dimensions"
        className="hidden lg:flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-xs"
      >
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-base">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-heading font-bold">
            Espacio Celular
          </span>
          <span className="text-xs font-heading font-bold text-indigo-200">
            {cols} × {rows}{' '}
            <span className="text-[10px] font-mono text-slate-400">
              ({totalCells.toLocaleString()})
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
