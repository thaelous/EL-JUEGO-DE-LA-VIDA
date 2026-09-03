/**
 * Presets Library bar and modal selector for Conway's Game of Life & Cellular Automata
 * Packed with playful animal/fantasy names, tips for kids, and special rules presets
 */
import React, { useState } from 'react';
import { PRESETS, CATEGORY_LABELS } from '../engine/presets';
import { PatternPreset, PresetCategory, ActiveStamp } from '../types';
import { Bookmark, Crosshair, ChevronDown, RotateCw, X, Sparkles, ArrowRight } from 'lucide-react';

interface PresetsBarProps {
  onLoadPresetCentered: (preset: PatternPreset) => void;
  activeStamp: ActiveStamp | null;
  onSetActiveStamp: (stamp: ActiveStamp | null) => void;
  onRotateStamp: () => void;
}

export const PresetsBar: React.FC<PresetsBarProps> = ({
  onLoadPresetCentered,
  activeStamp,
  onSetActiveStamp,
  onRotateStamp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PresetCategory | 'all'>('all');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const filteredPresets =
    selectedCategory === 'all'
      ? PRESETS
      : PRESETS.filter((p) => p.category === selectedCategory);

  // Quick access presets highlighted for 1-touch playing
  const quickPresets = [
    PRESETS.find((p) => p.id === 'glider')!, // Pececillo
    PRESETS.find((p) => p.id === 'toad')!, // Rana
    PRESETS.find((p) => p.id === 'beacon')!, // Faro
    PRESETS.find((p) => p.id === 'pulsar')!, // Flor
    PRESETS.find((p) => p.id === 'lwss')!, // Cohete
    PRESETS.find((p) => p.id === 'gosper_gun')!, // Fábrica
    PRESETS.find((p) => p.id === 'replicator')!, // Clonador (HighLife)
    PRESETS.find((p) => p.id === 'brians_brain_glider')!, // Neurona (Life-3)
  ].filter(Boolean);

  return (
    <div
      id="presets-panel"
      className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md"
    >
      {/* Header bar with title and action buttons */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-heading font-extrabold text-slate-100 uppercase tracking-wider block">
              Criaturas y Criaderos Celulares
            </span>
            <span className="text-[11px] text-slate-400 font-sans">
              Toca para colocarlos en el centro o usa el sello para clonarlos donde quieras
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Active Stamp Indicator */}
          {activeStamp && (
            <div
              id="active-stamp-badge"
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-xs text-indigo-200"
            >
              <Crosshair className="w-4 h-4 text-pink-400 animate-spin" />
              <span className="font-heading font-bold">
                {activeStamp.preset.funKidName || activeStamp.preset.name} ({activeStamp.rotation}°)
              </span>
              <button
                type="button"
                onClick={onRotateStamp}
                className="p-1 hover:bg-indigo-800/60 rounded-lg text-indigo-200 cursor-pointer"
                title="Girar criatura 90° (Tecla R)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSetActiveStamp(null)}
                className="p-1 hover:bg-indigo-800/60 rounded-lg text-indigo-200 cursor-pointer"
                title="Cancelar (Tecla Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Ver catálogo completo */}
          <button
            id="btn-open-catalog"
            type="button"
            onClick={() => setIsOpenModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-heading font-bold border border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm min-h-[40px]"
          >
            <span>Ver Todas ({PRESETS.length})</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Presets Buttons (Scrollable playful pill row) */}
      <div id="quick-presets-row" className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-400 font-heading font-bold whitespace-nowrap mr-0.5">
          Favoritas:
        </span>
        {quickPresets.map((preset) => {
          const isCurrentStamp = activeStamp?.preset.id === preset.id;
          return (
            <div
              key={preset.id}
              className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-950/80 p-0.5 shrink-0 shadow-xs"
            >
              <button
                id={`preset-btn-${preset.id}`}
                type="button"
                onClick={() => onLoadPresetCentered(preset)}
                className="px-3 py-1.5 text-xs font-heading font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 min-h-[36px]"
                title={`${preset.description} - Toca para centrar`}
              >
                <span>{preset.emoji || '✨'}</span>
                <span>{preset.funKidName || preset.name}</span>
              </button>
              <button
                id={`stamp-btn-${preset.id}`}
                type="button"
                onClick={() => {
                  if (isCurrentStamp) {
                    onSetActiveStamp(null);
                  } else {
                    onSetActiveStamp({ preset, rotation: 0 });
                  }
                }}
                className={`p-2 rounded-lg text-xs transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                  isCurrentStamp
                    ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-pink-400 hover:bg-slate-800/80'
                }`}
                title="Modo Sello: Toca y estampa esta criatura en cualquier parte del microscopio"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal / Dialog con catálogo clasificado */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div
            id="presets-modal-content"
            className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500/30 to-indigo-500/30 border border-pink-500/40 flex items-center justify-center text-xl">
                  🧬
                </div>
                <div>
                  <h3 className="text-base font-heading font-extrabold text-white">
                    Catálogo de Criaturas Celulares
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Descubre cómo se mueven, bailan y se clonan en el micromundo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Categorías filtro */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-xl font-heading font-bold whitespace-nowrap cursor-pointer transition-all min-h-[38px] ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                🌈 Todas ({PRESETS.length})
              </button>
              {(Object.keys(CATEGORY_LABELS) as PresetCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl font-heading font-bold whitespace-nowrap cursor-pointer transition-all min-h-[38px] ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Grid de Presets */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredPresets.map((preset) => {
                const isCurrentStamp = activeStamp?.preset.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    id={`catalog-preset-${preset.id}`}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 transition-all group shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{preset.emoji || '✨'}</span>
                          <h4 className="text-sm font-heading font-extrabold text-slate-100 group-hover:text-pink-300 transition-colors">
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

                    {/* Botones de acción táctiles grandes */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          onLoadPresetCentered(preset);
                          setIsOpenModal(false);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-heading font-bold text-slate-100 transition-colors cursor-pointer text-center min-h-[40px]"
                      >
                        Centrar en Placa
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSetActiveStamp({ preset, rotation: 0 });
                          setIsOpenModal(false);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer min-h-[40px] ${
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

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span className="font-heading">
                Tip: Con el sello activo, pulsa <strong>R</strong> para girar la criatura en 90°.
              </span>
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-heading font-bold cursor-pointer min-h-[38px]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
