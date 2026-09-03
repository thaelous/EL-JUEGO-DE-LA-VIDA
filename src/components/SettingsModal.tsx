/**
 * Settings & Customization Modal for John Conway's Game of Life
 * Houses all advanced configurations, pattern libraries, rulesets, grid density,
 * simulation speed, theme choices, and statistics in an intuitive, child-friendly layout.
 */
import React, { useState } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  Grid,
  Globe,
  Palette,
  Gauge,
  Activity,
  Users,
  Moon,
  Crosshair,
  RotateCw,
  HelpCircle,
  Dna,
  Shuffle,
  Eye,
  Zap,
} from 'lucide-react';
import { PatternPreset, PresetCategory, ActiveStamp, RulesetConfig, SimulationStats } from '../types';
import { PRESETS, CATEGORY_LABELS } from '../engine/presets';
import { RULESETS } from '../engine/rulesets';
import { GRID_SIZES, GridSizeOption, ColorTheme, COLOR_THEMES } from '../constants/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Speed & Size
  fps: number;
  onFpsChange: (fps: number) => void;
  currentGridSize: GridSizeOption;
  onGridSizeChange: (size: GridSizeOption) => void;
  // Appearance & Options
  colorTheme: ColorTheme;
  onColorThemeChange: (theme: ColorTheme) => void;
  showGridLines: boolean;
  onToggleGridLines: () => void;
  toroidal: boolean;
  onToggleToroidal: () => void;
  randomDensity: number;
  onRandomDensityChange: (density: number) => void;
  onRandomize: (density?: number) => void;
  // Patterns
  onLoadPresetCentered: (preset: PatternPreset) => void;
  activeStamp: ActiveStamp | null;
  onSetActiveStamp: (stamp: ActiveStamp | null) => void;
  onRotateStamp: () => void;
  // Rulesets
  currentRuleset: RulesetConfig;
  onSelectRuleset: (rule: RulesetConfig) => void;
  // Stats
  stats: SimulationStats;
  isRunning: boolean;
  totalCells: number;
}

type TabKey = 'setup' | 'creatures' | 'rules' | 'stats' | 'guide';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fps,
  onFpsChange,
  currentGridSize,
  onGridSizeChange,
  colorTheme,
  onColorThemeChange,
  showGridLines,
  onToggleGridLines,
  toroidal,
  onToggleToroidal,
  randomDensity,
  onRandomDensityChange,
  onRandomize,
  onLoadPresetCentered,
  activeStamp,
  onSetActiveStamp,
  onRotateStamp,
  currentRuleset,
  onSelectRuleset,
  stats,
  isRunning,
  totalCells,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('setup');
  const [selectedCategory, setSelectedCategory] = useState<PresetCategory | 'all'>('all');

  if (!isOpen) return null;

  const filteredPresets =
    selectedCategory === 'all'
      ? PRESETS
      : PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-modal-card"
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900/95 border-2 border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-xl shadow-md shadow-pink-500/20">
              ⚙️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-white flex items-center gap-2">
                <span>Panel de Ajustes del Laboratorio</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Personaliza la velocidad, colores, criaturas y leyes del microcosmos
              </p>
            </div>
          </div>
          <button
            id="btn-close-settings"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
            title="Cerrar ajustes"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-950/70 overflow-x-auto text-xs font-heading font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-all min-h-[38px] ${
              activeTab === 'setup'
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Ajustes & Aspecto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('creatures')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-all min-h-[38px] ${
              activeTab === 'creatures'
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Criaturas ({PRESETS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-all min-h-[38px] ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>Leyes del Universo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-all min-h-[38px] ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Estadísticas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-all min-h-[38px] ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>¿Cómo Jugar?</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
          {/* TAB 1: AJUSTES & ASPECTO */}
          {activeTab === 'setup' && (
            <div className="space-y-6">
              {/* Sección 1: Personalización Visual (Temas 3D) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white font-heading font-extrabold text-sm">
                  <Palette className="w-4 h-4 text-pink-400" />
                  <span>Color y Piel de las Células 3D</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Elige la apariencia orgánica de los microorganismos en la placa de microscopio:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {COLOR_THEMES.map((theme) => {
                    const isSelected = colorTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onColorThemeChange(theme.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-pink-500 shadow-md ring-2 ring-pink-500/30'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="relative w-8 h-8 rounded-full flex items-center justify-center shadow-inner">
                          <span
                            className="absolute inset-0 rounded-full shadow-md"
                            style={{
                              background: `radial-gradient(circle at 35% 35%, ${theme.lightColor}, ${theme.primaryColor} 60%, ${theme.deepColor} 100%)`,
                            }}
                          />
                          <span className="relative text-xs z-10">{theme.emoji}</span>
                        </div>
                        <span className="text-xs font-heading font-bold text-slate-200">
                          {theme.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sección 2: Velocidad de Simulación */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-white font-heading font-extrabold text-sm">
                    <Gauge className="w-4 h-4 text-amber-400" />
                    <span>Velocidad de Simulación (Generaciones / Seg)</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {fps} FPS
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm">🐢</span>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={fps}
                    onChange={(e) => onFpsChange(Number(e.target.value))}
                    className="flex-1 accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm">🚀</span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: '🐢 Lento', val: 5 },
                    { label: '🐰 Normal', val: 20 },
                    { label: '⚡ Rápido', val: 40 },
                    { label: '🚀 Turbo', val: 60 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => onFpsChange(preset.val)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer text-center ${
                        fps === preset.val
                          ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                          : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección 3: Tamaño de la Placa (Resolución del Grid) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white font-heading font-extrabold text-sm">
                  <Grid className="w-4 h-4 text-indigo-400" />
                  <span>Tamaño y Densidad de la Cuadrícula</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GRID_SIZES.map((size) => {
                    const isSelected =
                      currentGridSize.cols === size.cols && currentGridSize.rows === size.rows;
                    return (
                      <button
                        key={size.shortLabel}
                        type="button"
                        onClick={() => onGridSizeChange(size)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading font-bold text-white text-xs sm:text-sm">
                            {size.shortLabel}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                            {size.cols} × {size.rows}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans leading-tight">
                          {size.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sección 4: Opciones de Simulación y Sopa Mágica */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3.5">
                <div className="flex items-center gap-2 text-white font-heading font-extrabold text-sm">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Opciones de la Placa & Sopa Celular</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Interruptor Cuadrícula */}
                  <button
                    type="button"
                    onClick={onToggleGridLines}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-heading font-bold cursor-pointer transition-all ${
                      showGridLines
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Grid className="w-4 h-4" />
                      <span>Líneas Guía de la Placa</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] ${
                        showGridLines ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {showGridLines ? 'ACTIVADAS' : 'OCULTAS'}
                    </span>
                  </button>

                  {/* Interruptor Borde Toroidal */}
                  <button
                    type="button"
                    onClick={onToggleToroidal}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-heading font-bold cursor-pointer transition-all ${
                      toroidal
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Bordes Conectados (Infinito)</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] ${
                        toroidal ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {toroidal ? 'SÍ (TOROIDE)' : 'BORDES PLANOS'}
                    </span>
                  </button>
                </div>

                {/* Sopa Aleatoria con densidad regulable */}
                <div className="pt-2 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Densidad de la Sopa:</span>
                      <strong className="text-cyan-300 font-mono">
                        {Math.round(randomDensity * 100)}% de células
                      </strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.60"
                      step="0.05"
                      value={randomDensity}
                      onChange={(e) => onRandomDensityChange(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onRandomize(randomDensity);
                      onClose();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-heading font-extrabold shadow-md cursor-pointer transition-all active:scale-95 whitespace-nowrap min-h-[40px]"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>¡Generar Sopa Mágica!</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRIATURAS & PATRONES */}
          {activeTab === 'creatures' && (
            <div className="space-y-4">
              {/* Filtro de categorías */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-heading font-bold whitespace-nowrap cursor-pointer transition-all min-h-[36px] ${
                    selectedCategory === 'all'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  🌈 Todas ({PRESETS.length})
                </button>
                {(Object.keys(CATEGORY_LABELS) as PresetCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-heading font-bold whitespace-nowrap cursor-pointer transition-all min-h-[36px] ${
                      selectedCategory === cat
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {/* Grid de Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPresets.map((preset) => {
                  const isCurrentStamp = activeStamp?.preset.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className="flex flex-col justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-pink-500/60 transition-all shadow-md group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{preset.emoji || '✨'}</span>
                            <h4 className="text-sm font-heading font-extrabold text-white group-hover:text-pink-300 transition-colors">
                              {preset.funKidName || preset.name}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {preset.width}×{preset.height}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          <span className="text-[10px] uppercase font-heading font-bold text-cyan-400">
                            {CATEGORY_LABELS[preset.category]}
                          </span>
                          {preset.recommendedRuleset && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                              Regla: {preset.recommendedRuleset}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-2 font-sans">
                          {preset.description}
                        </p>

                        {preset.kidTip && (
                          <p className="text-[11px] text-amber-300 leading-normal mb-3 font-medium bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                            💡 {preset.kidTip}
                          </p>
                        )}
                      </div>

                      {/* Botones de acción */}
                      <div className="flex items-center gap-2 pt-2.5 border-t border-slate-900">
                        <button
                          type="button"
                          onClick={() => {
                            onLoadPresetCentered(preset);
                            onClose();
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-heading font-bold text-slate-100 transition-colors cursor-pointer text-center min-h-[38px]"
                        >
                          Colocar en Centro
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSetActiveStamp({ preset, rotation: 0 });
                            onClose();
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer min-h-[38px] ${
                            isCurrentStamp
                              ? 'bg-pink-500 text-white shadow-md'
                              : 'bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 hover:bg-indigo-900'
                          }`}
                          title="Modo Sello: Estampa donde quieras"
                        >
                          <Crosshair className="w-4 h-4 text-pink-400" />
                          <span>Sello</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LEYES DEL UNIVERSO */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Las reglas indican con cuántas vecinas nace una célula (<strong>B = Birth</strong>) y con cuántas sobrevive (<strong>S = Survival</strong>). Al cambiar de regla, el universo celular obedece una física completamente distinta.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {RULESETS.map((rule) => {
                  const isSelected = currentRuleset.id === rule.id;
                  return (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'bg-slate-950/80 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-heading font-extrabold text-white flex items-center gap-1.5 text-sm">
                            <span className="text-xl">{rule.emoji}</span>
                            <span>{rule.name}</span>
                          </span>
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                            {rule.notation}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mb-2 font-sans leading-relaxed">
                          {rule.description}
                        </p>

                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300 text-[11px] border border-amber-500/20 font-medium">
                          💡 {rule.kidFriendlyTip}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectRuleset(rule);
                          onClose();
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-heading font-extrabold cursor-pointer transition-all min-h-[38px] ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ Regla Activa' : 'Elegir esta Ley'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ESTADÍSTICAS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 uppercase font-heading font-bold">
                    Generación Actual
                  </span>
                  <span className="text-xl font-heading font-extrabold text-white">
                    {stats.generation.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans">
                    {isRunning ? 'En movimiento continuo' : 'Pausado'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 uppercase font-heading font-bold">
                    Células Vivas
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-heading font-extrabold text-cyan-400">
                      {stats.aliveCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-cyan-300/80 font-bold">
                      ({stats.livingRatio}%)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-sans">
                    De {totalCells.toLocaleString()} espacios
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 uppercase font-heading font-bold">
                    Población Récord
                  </span>
                  <span className="text-xl font-heading font-extrabold text-pink-400">
                    {stats.peakAliveCount.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans">
                    Máximo registrado
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 uppercase font-heading font-bold">
                    Velocidad Real
                  </span>
                  <span className="text-xl font-heading font-extrabold text-amber-400">
                    {isRunning ? `${stats.actualFps}` : '0'} <span className="text-xs font-mono">FPS</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans">
                    Objetivo: {fps} fps
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 uppercase font-heading font-bold">
                    Dimensiones
                  </span>
                  <span className="text-xl font-heading font-extrabold text-indigo-300">
                    {currentGridSize.cols} × {currentGridSize.rows}
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans">
                    {totalCells.toLocaleString()} cuadrantes
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 uppercase font-heading font-bold">
                    Regla Activa
                  </span>
                  <span className="text-base font-heading font-extrabold text-emerald-400 truncate">
                    {currentRuleset.shortName}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300/80">
                    {currentRuleset.notation}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GUÍA & CÓMO JUGAR */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 leading-relaxed font-sans">
                El matemático <strong>John Horton Conway</strong> descubrió que combinando solo 4 sencillas leyes de vecindad nacen formas vivas que caminan, giran y se reproducen solas:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850">
                  <div className="font-heading font-bold text-rose-400 mb-1">
                    1. Soledad (&lt; 2 vecinas)
                  </div>
                  <p className="text-xs text-slate-300">
                    Si una célula viva tiene menos de 2 amigas vecinas, se siente solita y desaparece.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850">
                  <div className="font-heading font-bold text-emerald-400 mb-1">
                    2. Armonía (2 o 3 vecinas)
                  </div>
                  <p className="text-xs text-slate-300">
                    Si una célula viva tiene 2 o 3 vecinas, vive feliz y continúa en la próxima generación.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850">
                  <div className="font-heading font-bold text-amber-400 mb-1">
                    3. Apretón (&gt; 3 vecinas)
                  </div>
                  <p className="text-xs text-slate-300">
                    Si hay más de 3 vecinas alrededor, hay demasiado ruido y apretón, y la célula se apaga.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850">
                  <div className="font-heading font-bold text-cyan-400 mb-1">
                    4. ¡Nacimiento! (Exactamente 3)
                  </div>
                  <p className="text-xs text-slate-300">
                    ¡Cualquier lugar vacío con exactamente 3 vecinas da a luz a una nueva célula burbuja!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850">
                <div className="font-heading font-bold text-white mb-2">
                  Atajos Rápidos de Teclado (PC)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-pink-400 block font-mono">Espacio</strong>
                    <span>Iniciar / Pausar</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-400 block font-mono">Flecha →</strong>
                    <span>Avanzar 1 paso</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-amber-400 block font-mono">Tecla R</strong>
                    <span>Girar criatura</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-rose-400 block font-mono">Esc</strong>
                    <span>Cerrar / Cancelar</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-heading hidden sm:inline">
            Configuración guardada en tiempo real
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-heading font-extrabold text-xs shadow-lg cursor-pointer transition-all active:scale-95 min-h-[40px]"
          >
            Listo, Volver a la Placa ✨
          </button>
        </div>
      </div>
    </div>
  );
};
