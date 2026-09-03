/**
 * Types and interfaces for John Conway's Game of Life and Cellular Automata simulation
 */

// 0 = Muerta/Vacía, 1 = Viva/Activa, 2 = Muriendo/Durmiendo (para autómatas de 3 estados como Brian's Brain / Life-3 State)
export type CellState = 0 | 1 | 2;

export interface RulesetConfig {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  notation: string; // Ej: "B3/S23"
  description: string;
  kidFriendlyTip: string;
  birth: number[]; // Vecinos para nacer (ej: [3])
  survival: number[]; // Vecinos para sobrevivir (ej: [2, 3])
  isThreeState?: boolean; // Autómata de 3 estados (Brian's Brain / Células que descansan)
  badgeColor: string;
}

export interface SimulationStats {
  generation: number;
  aliveCount: number;
  restingCount?: number; // Células en estado 2 (para 3-estados)
  peakAliveCount: number;
  livingRatio: number; // Porcentaje 0-100
  actualFps: number;
}

export type PresetCategory = 'oscillators' | 'spaceships' | 'guns' | 'still_lifes' | 'methuselahs' | 'special_rules';

export interface PatternPreset {
  id: string;
  name: string;
  funKidName?: string;
  emoji?: string;
  category: PresetCategory;
  description: string;
  kidTip?: string;
  author?: string;
  width: number;
  height: number;
  recommendedRuleset?: string;
  /**
   * Grid representation where 1 = alive, 2 = resting, 0 = dead
   */
  cells: number[][];
}

export interface GridDimensions {
  cols: number;
  rows: number;
}

export type DrawMode = 'draw' | 'erase' | 'stamp';

export interface ActiveStamp {
  preset: PatternPreset;
  rotation: 0 | 90 | 180 | 270;
}

