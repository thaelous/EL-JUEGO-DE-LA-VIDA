/**
 * Main Application Component for John Conway's Game of Life & Cellular Automata
 * Ultra-clean, minimalist main screen with immersive 3D Canvas,
 * floating bottom toolbar, and a comprehensive dedicated Settings Modal.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameOfLifeEngine } from './engine/gameOfLife';
import { PRESETS } from './engine/presets';
import { RULESETS } from './engine/rulesets';
import { PatternPreset, ActiveStamp, DrawMode, SimulationStats, RulesetConfig } from './types';
import { GRID_SIZES, GridSizeOption, ColorTheme } from './constants/theme';
import { Header } from './components/Header';
import { CanvasGrid } from './components/CanvasGrid';
import { BottomToolbar } from './components/BottomToolbar';
import { SettingsModal } from './components/SettingsModal';
import { IntroScreen } from './components/IntroScreen';
import { BoardTutorialOverlay } from './components/BoardTutorialOverlay';

export default function App() {
  // Grid resolution default: Estándar (75 x 45)
  const defaultSize = GRID_SIZES[1];
  const [gridSize, setGridSize] = useState<GridSizeOption>(defaultSize);

  // Active Ruleset (Conway B3/S23 by default)
  const [currentRuleset, setCurrentRuleset] = useState<RulesetConfig>(RULESETS[0]);

  // Core Engine Instance (persists across re-renders)
  const engineRef = useRef<GameOfLifeEngine | null>(null);
  if (!engineRef.current) {
    const engine = new GameOfLifeEngine(
      defaultSize.cols,
      defaultSize.rows,
      true,
      RULESETS[0]
    );
    // Seed initial Gosper Glider Gun for immediate engaging life on first load
    const initialPreset = PRESETS.find((p) => p.id === 'gosper_gun') || PRESETS[0];
    engine.loadPresetCentered(initialPreset);
    engineRef.current = engine;
  }
  const engine = engineRef.current;

  // Simulation play state & parameters
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(20);
  const [drawMode, setDrawMode] = useState<DrawMode>('draw');
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [toroidal, setToroidal] = useState<boolean>(true);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('cyan');
  const [randomDensity, setRandomDensity] = useState<number>(0.2);

  // Active pattern stamp tool
  const [activeStamp, setActiveStamp] = useState<ActiveStamp | null>(null);

  // Dedicated Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Intro Screen State (3 segundos de bienvenida en fondo verde sólido con partículas)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return localStorage.getItem('conway_never_show_tutorial') !== 'true';
    } catch {
      return true;
    }
  });

  // Interactive Guided Tutorial directly integrated on board
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    try {
      const neverShow = localStorage.getItem('conway_never_show_tutorial') === 'true';
      if (!neverShow) {
        setIsTutorialOpen(true);
      }
    } catch {
      setIsTutorialOpen(true);
    }
  }, []);

  const handleCloseTutorial = useCallback((neverShowAgain: boolean) => {
    setIsTutorialOpen(false);
    try {
      if (neverShowAgain) {
        localStorage.setItem('conway_never_show_tutorial', 'true');
      }
    } catch {
      // Ignored if local storage is restricted
    }
  }, []);

  const handleTutorialStepChange = useCallback(
    (stepIndex: number) => {
      if (!engineRef.current) return;
      if (stepIndex === 0) {
        // Modo Crear vida: pausar, limpiar y modo dibujar
        setIsRunning(false);
        engineRef.current.clear();
        setDrawMode('draw');
        setStats(engineRef.current.getStats());
      } else if (stepIndex === 1) {
        // Ejemplo de Patrón biológico (Pulsar)
        setIsRunning(false);
        engineRef.current.clear();
        const pulsarPreset = PRESETS.find((p) => p.id === 'pulsar') || PRESETS[0];
        if (pulsarPreset) {
          engineRef.current.loadPresetCentered(pulsarPreset);
        }
        setStats(engineRef.current.getStats());
      } else if (stepIndex === 2) {
        // Evolución Dinámica: dar play a la simulación
        setIsRunning(true);
      }
    },
    []
  );

  // Live Simulation Statistics
  const [stats, setStats] = useState<SimulationStats>(() => engine.getStats());

  // Callback to sync stats on each tick or user interaction
  const handleStatsUpdate = useCallback(() => {
    if (engineRef.current) {
      setStats(engineRef.current.getStats());
    }
  }, []);

  // Ruleset selection handler
  const handleSelectRuleset = useCallback(
    (newRule: RulesetConfig) => {
      setCurrentRuleset(newRule);
      if (engineRef.current) {
        engineRef.current.setRuleset(newRule);
        handleStatsUpdate();
      }
    },
    [handleStatsUpdate]
  );

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // Single Step
  const handleStep = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.step();
      handleStatsUpdate();
    }
  }, [handleStatsUpdate]);

  // Clear Grid
  const handleClear = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.clear();
      setIsRunning(false);
      handleStatsUpdate();
    }
  }, [handleStatsUpdate]);

  // Randomize Grid (Sopa Mágica)
  const handleRandomize = useCallback(
    (density?: number) => {
      if (engineRef.current) {
        engineRef.current.randomize(density ?? randomDensity);
        handleStatsUpdate();
      }
    },
    [randomDensity, handleStatsUpdate]
  );

  // Toggle Draw / Erase mode
  const handleDrawModeToggle = useCallback(() => {
    setDrawMode((prev) => (prev === 'draw' ? 'erase' : 'draw'));
  }, []);

  // Resize Grid
  const handleGridSizeChange = useCallback(
    (newSize: GridSizeOption) => {
      setGridSize(newSize);
      if (engineRef.current) {
        engineRef.current.resize(newSize.cols, newSize.rows, true);
        handleStatsUpdate();
      }
    },
    [handleStatsUpdate]
  );

  // Toggle Toroidal Wrap-around
  const handleToggleToroidal = useCallback(() => {
    setToroidal((prev) => {
      const next = !prev;
      if (engineRef.current) {
        engineRef.current.toroidal = next;
      }
      return next;
    });
  }, []);

  // Load Preset directly centered
  const handleLoadPresetCentered = useCallback(
    (preset: PatternPreset) => {
      if (engineRef.current) {
        if (preset.recommendedRuleset && preset.recommendedRuleset !== currentRuleset.id) {
          const matchRule = RULESETS.find((r) => r.id === preset.recommendedRuleset);
          if (matchRule) {
            setCurrentRuleset(matchRule);
            engineRef.current.setRuleset(matchRule);
          }
        }
        engineRef.current.loadPresetCentered(preset);
        handleStatsUpdate();
      }
    },
    [currentRuleset.id, handleStatsUpdate]
  );

  // Rotate active stamp
  const handleRotateStamp = useCallback(() => {
    setActiveStamp((prev) => {
      if (!prev) return null;
      const nextRotation = ((prev.rotation + 90) % 360) as 0 | 90 | 180 | 270;
      return { ...prev, rotation: nextRotation };
    });
  }, []);

  // Keyboard Shortcuts (Space, ArrowRight, R, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (!isRunning) {
          handleStep();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (activeStamp) {
          e.preventDefault();
          handleRotateStamp();
        }
      } else if (e.key === 'Escape') {
        if (activeStamp) {
          e.preventDefault();
          setActiveStamp(null);
        } else if (isTutorialOpen) {
          handleCloseTutorial(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleStep, isRunning, activeStamp, handleRotateStamp, isSettingsOpen, isTutorialOpen, handleCloseTutorial]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-pink-500/30 font-sans p-2 sm:p-4 gap-2.5 sm:gap-3">
      {/* 1. Playful & Clean Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        isRunning={isRunning}
        currentRuleset={currentRuleset}
        stats={stats}
      />

      {/* 2. Large, Immersive 3D Canvas Stage */}
      <main className="flex-1 w-full flex flex-col items-center justify-center relative min-h-0">
        <CanvasGrid
          engine={engine}
          isRunning={isRunning}
          targetFps={fps}
          drawMode={drawMode}
          showGridLines={showGridLines}
          colorTheme={colorTheme}
          activeStamp={activeStamp}
          onClearStamp={() => setActiveStamp(null)}
          onStatsUpdate={handleStatsUpdate}
        />

        {/* Tutorial Interactivo Integrado directamente sobre la cuadrícula */}
        <BoardTutorialOverlay
          isOpen={isTutorialOpen}
          onClose={handleCloseTutorial}
          onStepChange={handleTutorialStepChange}
        />
      </main>

      {/* 3. Minimalist Floating Bottom Toolbar */}
      <footer className="w-full pb-1 sm:pb-2">
        <BottomToolbar
          isRunning={isRunning}
          onTogglePlay={handleTogglePlay}
          onStep={handleStep}
          onClear={handleClear}
          onRandomize={() => handleRandomize()}
          drawMode={drawMode}
          onDrawModeToggle={handleDrawModeToggle}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </footer>

      {/* 4. Comprehensive Independent Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fps={fps}
        onFpsChange={setFps}
        currentGridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        colorTheme={colorTheme}
        onColorThemeChange={setColorTheme}
        showGridLines={showGridLines}
        onToggleGridLines={() => setShowGridLines((prev) => !prev)}
        toroidal={toroidal}
        onToggleToroidal={handleToggleToroidal}
        randomDensity={randomDensity}
        onRandomDensityChange={setRandomDensity}
        onRandomize={handleRandomize}
        onLoadPresetCentered={handleLoadPresetCentered}
        activeStamp={activeStamp}
        onSetActiveStamp={setActiveStamp}
        onRotateStamp={handleRotateStamp}
        currentRuleset={currentRuleset}
        onSelectRuleset={handleSelectRuleset}
        stats={stats}
        isRunning={isRunning}
        totalCells={gridSize.cols * gridSize.rows}
      />

      {/* 5. Pantalla de Bienvenida (Intro Envolvente Verde Sólido con Partículas de 3 Segundos) */}
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
    </div>
  );
}
