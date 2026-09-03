/**
 * Educational modal explaining Conway's Game of Life rules, alternative cellular automata rulesets,
 * and keyboard/touch shortcuts.
 */
import React, { useState } from 'react';
import { X, BookOpen, Skull, Heart, ShieldAlert, Sparkles, Keyboard, Dna, Touchpad } from 'lucide-react';
import { RULESETS } from '../engine/rulesets';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'conway' | 'rulesets' | 'controls'>('conway');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div
        id="rules-modal-dialog"
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20 border border-teal-500/30 flex items-center justify-center text-xl">
              🔬
            </div>
            <div>
              <h3 className="text-base font-heading font-extrabold text-white">
                Guía Científica del Microcosmos
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Aprende los secretos de los autómatas celulares y el milagro de la vida artificial
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-950/60 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('conway')}
            className={`px-3.5 py-2 rounded-xl font-heading font-bold cursor-pointer transition-all min-h-[38px] ${
              activeTab === 'conway'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            🌿 Las 4 Leyes de Conway
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rulesets')}
            className={`px-3.5 py-2 rounded-xl font-heading font-bold cursor-pointer transition-all min-h-[38px] ${
              activeTab === 'rulesets'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            🌌 Otros Universos Celulares ({RULESETS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('controls')}
            className={`px-3.5 py-2 rounded-xl font-heading font-bold cursor-pointer transition-all min-h-[38px] ${
              activeTab === 'controls'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            🎮 Controles & Gestos
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-slate-300">
          {activeTab === 'conway' && (
            <>
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  En 1970, el genial matemático <strong>John Horton Conway</strong> creó un juego que no necesita jugadores después de comenzar: cada célula vive o muere en una cuadrícula basándose únicamente en el número de amigas que tiene a su alrededor (sus <strong>8 vecinas directas</strong>).
                </p>
              </div>

              {/* 4 Reglas de Conway */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Subpoblación */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center gap-2 text-rose-400 font-heading font-bold text-sm">
                    <Skull className="w-4 h-4" />
                    <span>1. Soledad (Menos de 2 vecinas)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal font-sans">
                    Si una célula viva tiene <strong>menos de 2 vecinas</strong>, se siente sola y se apaga en la siguiente generación.
                  </p>
                  <div className="mt-auto pt-2 font-mono text-[11px] text-rose-300 font-bold bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-800/40">
                    Vecinas &lt; 2 → Muere
                  </div>
                </div>

                {/* 2. Supervivencia */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-sm">
                    <Heart className="w-4 h-4" />
                    <span>2. Armonía (2 o 3 vecinas)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal font-sans">
                    Si una célula viva tiene <strong>2 o 3 vecinas</strong>, está muy contenta y continúa viviendo fuerte y sana.
                  </p>
                  <div className="mt-auto pt-2 font-mono text-[11px] text-emerald-300 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                    Vecinas = 2 o 3 → Sigue Viva
                  </div>
                </div>

                {/* 3. Sobrepoblación */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-400 font-heading font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    <span>3. Apretón (Más de 3 vecinas)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal font-sans">
                    Si una célula viva tiene <strong>más de 3 vecinas</strong>, hay demasiado ruido y apretón, y se apaga por sobrepoblación.
                  </p>
                  <div className="mt-auto pt-2 font-mono text-[11px] text-amber-300 font-bold bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/40">
                    Vecinas &gt; 3 → Muere
                  </div>
                </div>

                {/* 4. Reproducción */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center gap-2 text-cyan-400 font-heading font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>4. ¡Nacimiento! (Exactamente 3)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal font-sans">
                    Si un espacio vacío está rodeado por <strong>exactamente 3 células vivas</strong>, ¡nace una hermosa célula bebé!
                  </p>
                  <div className="mt-auto pt-2 font-mono text-[11px] text-cyan-300 font-bold bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                    Espacio vacío + 3 vecinas → ¡Nace!
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'rulesets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                La notación <strong>B... / S...</strong> significa: <strong>B (Birth / Nacimiento)</strong> indica cuántas vecinas se necesitan para nacer, y <strong>S (Survival / Supervivencia)</strong> cuántas para seguir viviendo.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RULESETS.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-2 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-heading font-bold text-white flex items-center gap-1.5 text-sm">
                          <span>{rule.emoji}</span>
                          <span>{rule.name}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                          {rule.notation}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-2 font-sans">
                        {rule.description}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300 text-[11px] border border-amber-500/20 font-medium">
                      💡 {rule.kidFriendlyTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-sm mb-3">
                  <Touchpad className="w-4 h-4 text-cyan-400" />
                  <span>En Teléfonos y Tablets (Pantalla Táctil)</span>
                </div>
                <ul className="text-xs space-y-2 text-slate-300 font-sans list-disc list-inside">
                  <li><strong>Tocar y arrastrar:</strong> Dibuja hermosas estelas de burbujas vivas continuamente con tu dedo.</li>
                  <li><strong>Modo Goma:</strong> Activa el borrador para limpiar zonas específicas con solo deslizar tu dedo.</li>
                  <li><strong>Sello de Criaturas:</strong> Toca cualquier criatura del catálogo para activarla y luego toca la placa para colocarla donde desees.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-sm mb-3">
                  <Keyboard className="w-4 h-4 text-purple-400" />
                  <span>Atajos de Teclado (Computadora)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-[11px] text-pink-300 font-bold">
                      Espacio
                    </kbd>
                    <span className="text-slate-300">Play / Pausa</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-[11px] text-cyan-300 font-bold">
                      →
                    </kbd>
                    <span className="text-slate-300">Paso a paso</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-[11px] text-amber-300 font-bold">
                      R
                    </kbd>
                    <span className="text-slate-300">Girar sello 90°</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-[11px] text-rose-300 font-bold">
                      Esc
                    </kbd>
                    <span className="text-slate-300">Cancelar sello</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-heading font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer min-h-[40px]"
          >
            ¡Entendido, a jugar!
          </button>
        </div>
      </div>
    </div>
  );
};
