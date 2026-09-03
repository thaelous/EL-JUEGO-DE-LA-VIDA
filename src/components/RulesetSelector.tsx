/**
 * Ruleset Selector component for switching between cellular automaton rulesets
 * Displays current rule, formula notation (e.g., B3/S23), description, and child-friendly tip.
 */
import React from 'react';
import { RULESETS } from '../engine/rulesets';
import { RulesetConfig, PatternPreset } from '../types';
import { PRESETS } from '../engine/presets';
import { Sparkles, Info, ArrowRight, Dna } from 'lucide-react';

interface RulesetSelectorProps {
  currentRuleset: RulesetConfig;
  onSelectRuleset: (ruleset: RulesetConfig) => void;
  onLoadPresetCentered: (preset: PatternPreset) => void;
}

export const RulesetSelector: React.FC<RulesetSelectorProps> = ({
  currentRuleset,
  onSelectRuleset,
  onLoadPresetCentered,
}) => {
  // Find recommended preset for this ruleset if any
  const recommendedPreset = PRESETS.find(
    (p) => p.recommendedRuleset === currentRuleset.id
  );

  return (
    <div
      id="ruleset-selector-card"
      className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col gap-3"
    >
      {/* Header with Title and Current Rule Badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center text-lg shadow-xs">
            <Dna className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-bold text-slate-100 flex items-center gap-2">
              <span>Leyes del Microcosmos</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentRuleset.notation}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Elige cómo nacen, viven y duermen tus células
            </p>
          </div>
        </div>

        {/* Current Active Rule Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200">
          <span className="text-base">{currentRuleset.emoji}</span>
          <span className="font-heading font-semibold">{currentRuleset.shortName}</span>
        </div>
      </div>

      {/* Ruleset Selection Grid / Scrollable Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {RULESETS.map((rule) => {
          const isSelected = rule.id === currentRuleset.id;
          return (
            <button
              key={rule.id}
              id={`rule-btn-${rule.id}`}
              type="button"
              onClick={() => onSelectRuleset(rule)}
              className={`flex flex-col items-center text-center p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer min-h-[52px] justify-center ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-600/30 to-purple-600/30 border-indigo-400 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/90 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg">{rule.emoji}</span>
                <span className="text-xs font-heading font-bold truncate max-w-[100px]">
                  {rule.shortName}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                {rule.notation}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Ruleset Info Banner */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-bold text-slate-100 flex items-center gap-1">
              <span>{currentRuleset.emoji}</span>
              <span>{currentRuleset.name}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-300 border border-pink-500/30 text-[10px] font-semibold">
              Nacen: {currentRuleset.birth.length > 0 ? currentRuleset.birth.join(', ') : 'Ninguno'} | Viven: {currentRuleset.survival.length > 0 ? currentRuleset.survival.join(', ') : 'Ninguno'}
            </span>
            {currentRuleset.isThreeState && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                ⚡ 3 Estados (Viva → Durmiendo → Vacía)
              </span>
            )}
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {currentRuleset.description}
          </p>
          <p className="text-amber-300 text-[11px] flex items-center gap-1.5 font-medium">
            <span>💡</span>
            <span>{currentRuleset.kidFriendlyTip}</span>
          </p>
        </div>

        {/* Recommended Preset Load Button */}
        {recommendedPreset && (
          <button
            id="btn-load-recommended-pattern"
            type="button"
            onClick={() => onLoadPresetCentered(recommendedPreset)}
            className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-heading font-bold text-xs shadow-md shadow-pink-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <span>{recommendedPreset.emoji || '✨'}</span>
            <span>Cargar {recommendedPreset.funKidName || recommendedPreset.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
