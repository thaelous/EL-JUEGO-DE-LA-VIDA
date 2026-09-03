import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X, Sparkles, Check } from 'lucide-react';

export interface BoardTutorialStep {
  badge: string;
  status: string;
  title: string;
  description: string;
}

interface BoardTutorialOverlayProps {
  isOpen: boolean;
  onClose: (neverShowAgain: boolean) => void;
  onStepChange?: (stepIndex: number) => void;
}

export const BoardTutorialOverlay: React.FC<BoardTutorialOverlayProps> = ({
  isOpen,
  onClose,
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [neverShowAgain, setNeverShowAgain] = useState<boolean>(false);

  if (!isOpen) return null;

  const steps: BoardTutorialStep[] = [
    {
      badge: 'Paso 1 de 3',
      status: 'Crear vida',
      title: 'Paso 1: ¡Despierta Células Vivas!',
      description:
        'Haz clic o arrastra tu cursor sobre la cuadrícula del juego para sembrar tus primeras células orgánicas.',
    },
    {
      badge: 'Paso 2 de 3',
      status: 'Ejemplo de Patrón',
      title: 'Paso 2: Criaturas y Patrones Biológicos',
      description:
        'Observa este oscilador Pulsar en el centro. Las células sobreviven o mueren según las leyes de Conway: nacen con 3 vecinas y viven con 2 o 3.',
    },
    {
      badge: 'Paso 3 de 3',
      status: 'Evolución Dinámica',
      title: 'Paso 3: ¡Dale Play a la Simulación!',
      description:
        'Observa la danza biológica en movimiento. Pulsa "Comenzar a jugar" o presiona la Barra Espaciadora en cualquier momento.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (onStepChange) onStepChange(next);
    } else {
      onClose(neverShowAgain);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      if (onStepChange) onStepChange(prev);
    }
  };

  const current = steps[currentStep];

  return (
    <>
      {/* Paso 1: Zona resaltada de interacción sobre la cuadrícula */}
      {currentStep === 0 && (
        <div className="absolute top-[40%] sm:top-[35%] left-[12%] sm:left-[36%] w-[76%] sm:w-[28%] h-[26%] sm:h-[28%] pointer-events-none z-20 flex items-center justify-center rounded-2xl">
          <div className="absolute inset-0 border-2 sm:border-3 border-dashed border-emerald-400 rounded-2xl bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.4),inset_0_0_20px_rgba(52,211,153,0.2)] animate-pulse" />
          <div className="relative z-10 bg-emerald-950/95 border border-emerald-400/60 text-emerald-100 text-[11px] sm:text-xs font-bold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
            <span>¡Haz clic o arrastra aquí!</span>
          </div>
        </div>
      )}

      {/* Guía Gráfica: Burbuja Flotante y Semitransparente con Efecto Glassmorphism */}
      <div
        id="integrated-board-tutorial"
        className="absolute top-2 right-2 sm:top-4 sm:right-4 left-auto w-[calc(100%-16px)] max-w-[290px] sm:max-w-[320px] z-35 bg-emerald-950/50 sm:bg-emerald-950/45 border border-emerald-400/35 rounded-2xl rounded-br-sm p-2.5 sm:p-3.5 shadow-[0_10px_28px_rgba(0,0,0,0.45),0_0_18px_rgba(16,185,129,0.12)] backdrop-blur-md flex flex-col gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto"
        role="region"
        aria-label="Tutorial interactivo integrado"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="bg-emerald-500/90 text-emerald-950 text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wide">
              {current.badge}
            </span>
            <span className="text-emerald-300 text-[10.5px] sm:text-[11px] font-bold">
              {current.status}
            </span>
          </div>
          <button
            onClick={() => onClose(neverShowAgain)}
            className="w-5 h-5 rounded-md bg-slate-800/60 hover:bg-rose-900/60 border border-slate-700/50 hover:border-rose-500/50 text-slate-400 hover:text-rose-200 flex items-center justify-center transition-colors cursor-pointer text-xs"
            title="Cerrar tutorial"
            type="button"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <h3 className="text-xs sm:text-sm font-extrabold text-white drop-shadow-sm leading-snug">
            {current.title}
          </h3>
          <p className="text-[10.5px] sm:text-xs text-slate-200/90 leading-snug">
            {current.description}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-1.5 pt-1 sm:pt-1.5 border-t border-emerald-500/20">
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStep(idx);
                    if (onStepChange) onStepChange(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStep
                      ? 'w-3.5 sm:w-4 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : 'w-1.5 bg-slate-700/80 hover:bg-slate-600'
                  }`}
                  type="button"
                  aria-label={`Paso ${idx + 1}`}
                />
              ))}
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-0.5 sm:gap-1 cursor-pointer transition-colors"
                  type="button"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Anterior</span>
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-[10px] sm:text-[11px] font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.35)] flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                type="button"
              >
                <span>{currentStep === steps.length - 1 ? 'Jugar' : 'Siguiente'}</span>
                {currentStep === steps.length - 1 ? (
                  <Sparkles className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Checkbox 'No volver a mostrar' */}
          <label className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] text-slate-400 hover:text-slate-200 cursor-pointer select-none pt-0.5">
            <input
              type="checkbox"
              checked={neverShowAgain}
              onChange={(e) => setNeverShowAgain(e.target.checked)}
              className="rounded border-emerald-400/50 bg-emerald-950/60 text-emerald-500 focus:ring-emerald-400/40 w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer"
            />
            <span>No volver a mostrar el tutorial</span>
          </label>
        </div>
      </div>
    </>
  );
};
