/**
 * Simulation Engine for John Conway's Game of Life and Cellular Automata
 * High-performance implementation using dual-buffered Uint8Arrays.
 * Supports configurable rulesets (Conway, HighLife, Day & Night, Life-3 State / Brian's Brain, Seeds, Diamoeba, etc.)
 */

import { CellState, SimulationStats, PatternPreset, RulesetConfig } from '../types';
import { DEFAULT_RULESET } from './rulesets';

export class GameOfLifeEngine {
  public cols: number;
  public rows: number;
  public totalCells: number;

  private currentGrid: Uint8Array;
  private nextGrid: Uint8Array;
  // Tracks cell ages for visual aesthetics (0 = dead, 1 = newly born, 2+ = aged)
  private ageGrid: Uint16Array;

  public generation: number = 0;
  public aliveCount: number = 0;
  public restingCount: number = 0; // State 2 for 3-state cellular automata
  public peakAliveCount: number = 0;
  public toroidal: boolean = true; // Wrap borders around

  // Active ruleset configuration
  public ruleset: RulesetConfig = DEFAULT_RULESET;
  private birthMask: boolean[] = new Array(9).fill(false);
  private survivalMask: boolean[] = new Array(9).fill(false);
  public isThreeState: boolean = false;

  constructor(cols: number = 80, rows: number = 50, toroidal: boolean = true, ruleset: RulesetConfig = DEFAULT_RULESET) {
    this.cols = cols;
    this.rows = rows;
    this.totalCells = cols * rows;
    this.toroidal = toroidal;

    this.currentGrid = new Uint8Array(this.totalCells);
    this.nextGrid = new Uint8Array(this.totalCells);
    this.ageGrid = new Uint16Array(this.totalCells);

    this.setRuleset(ruleset);
  }

  /**
   * Applies a new cellular automaton ruleset and precomputes neighbor masks
   */
  public setRuleset(newRuleset: RulesetConfig): void {
    this.ruleset = newRuleset;
    this.birthMask.fill(false);
    for (const b of newRuleset.birth) {
      if (b >= 0 && b <= 8) this.birthMask[b] = true;
    }
    this.survivalMask.fill(false);
    for (const s of newRuleset.survival) {
      if (s >= 0 && s <= 8) this.survivalMask[s] = true;
    }
    this.isThreeState = !!newRuleset.isThreeState;

    // If switching away from 3-state, clear any resting cells (state 2)
    if (!this.isThreeState) {
      for (let i = 0; i < this.totalCells; i++) {
        if (this.currentGrid[i] === 2) {
          this.currentGrid[i] = 0;
          this.ageGrid[i] = 0;
        }
      }
      this.restingCount = 0;
    }
  }

  /**
   * Resizes the grid. Optionally preserves existing alive cells centered.
   */
  public resize(newCols: number, newRows: number, preserve: boolean = true): void {
    const oldCols = this.cols;
    const oldRows = this.rows;
    const oldGrid = this.currentGrid;

    this.cols = newCols;
    this.rows = newRows;
    this.totalCells = newCols * newRows;

    this.currentGrid = new Uint8Array(this.totalCells);
    this.nextGrid = new Uint8Array(this.totalCells);
    this.ageGrid = new Uint16Array(this.totalCells);

    if (preserve) {
      const offsetX = Math.floor((newCols - oldCols) / 2);
      const offsetY = Math.floor((newRows - oldRows) / 2);

      let count = 0;
      let resting = 0;
      for (let y = 0; y < oldRows; y++) {
        for (let x = 0; x < oldCols; x++) {
          const oldIdx = y * oldCols + x;
          const val = oldGrid[oldIdx];
          if (val > 0) {
            const targetX = x + offsetX;
            const targetY = y + offsetY;
            if (targetX >= 0 && targetX < newCols && targetY >= 0 && targetY < newRows) {
              const targetIdx = targetY * newCols + targetX;
              this.currentGrid[targetIdx] = val;
              this.ageGrid[targetIdx] = 1;
              if (val === 1) count++;
              if (val === 2) resting++;
            }
          }
        }
      }
      this.aliveCount = count;
      this.restingCount = resting;
      this.peakAliveCount = Math.max(this.peakAliveCount, count);
    } else {
      this.aliveCount = 0;
      this.restingCount = 0;
      this.generation = 0;
      this.peakAliveCount = 0;
    }
  }

  /**
   * Counts active neighbors (state === 1) for cell at (x, y).
   * Supports toroidal wrap-around or bounded borders.
   */
  private countNeighbors(x: number, y: number): number {
    const cols = this.cols;
    const rows = this.rows;
    const grid = this.currentGrid;
    let count = 0;

    if (this.toroidal) {
      const up = y === 0 ? rows - 1 : y - 1;
      const down = y === rows - 1 ? 0 : y + 1;
      const left = x === 0 ? cols - 1 : x - 1;
      const right = x === cols - 1 ? 0 : x + 1;

      // 8 Neighbors - active cells (1) trigger births
      if (grid[up * cols + left] === 1) count++;
      if (grid[up * cols + x] === 1) count++;
      if (grid[up * cols + right] === 1) count++;
      if (grid[y * cols + left] === 1) count++;
      if (grid[y * cols + right] === 1) count++;
      if (grid[down * cols + left] === 1) count++;
      if (grid[down * cols + x] === 1) count++;
      if (grid[down * cols + right] === 1) count++;
    } else {
      const minY = Math.max(0, y - 1);
      const maxY = Math.min(rows - 1, y + 1);
      const minX = Math.max(0, x - 1);
      const maxX = Math.min(cols - 1, x + 1);

      for (let ny = minY; ny <= maxY; ny++) {
        for (let nx = minX; nx <= maxX; nx++) {
          if (nx === x && ny === y) continue;
          if (grid[ny * cols + nx] === 1) count++;
        }
      }
    }

    return count;
  }

  /**
   * Advances the simulation by exactly one generation according to current ruleset:
   * Standard 2-state:
   *   Survival if alive and neighbor count in survivalMask.
   *   Birth if dead and neighbor count in birthMask.
   * 3-state (Brian's Brain):
   *   State 1 (Active) -> State 2 (Resting / Dying)
   *   State 2 (Resting) -> State 0 (Empty)
   *   State 0 (Empty) -> State 1 (Active) if active neighbor count in birthMask
   */
  public step(): SimulationStats {
    const cols = this.cols;
    const rows = this.rows;
    const current = this.currentGrid;
    const next = this.nextGrid;
    const ages = this.ageGrid;
    const isThreeState = this.isThreeState;
    const birthMask = this.birthMask;
    const survivalMask = this.survivalMask;

    let alive = 0;
    let resting = 0;

    for (let y = 0; y < rows; y++) {
      const rowOffset = y * cols;
      for (let x = 0; x < cols; x++) {
        const idx = rowOffset + x;
        const state = current[idx];
        const neighbors = this.countNeighbors(x, y);

        if (isThreeState) {
          if (state === 1) {
            // Célula activa pasa a descansar/dormir
            next[idx] = 2;
            ages[idx] = Math.min(ages[idx] + 1, 65535);
            resting++;
          } else if (state === 2) {
            // Célula descansando pasa a vacía
            next[idx] = 0;
            ages[idx] = 0;
          } else {
            // Célula vacía: nace si tiene el número de vecinos activos requerido (ej: 2)
            if (birthMask[neighbors]) {
              next[idx] = 1;
              ages[idx] = 1;
              alive++;
            } else {
              next[idx] = 0;
              ages[idx] = 0;
            }
          }
        } else {
          // 2-state (Conway, HighLife, Day & Night, Seeds, etc.)
          if (state === 1) {
            if (survivalMask[neighbors]) {
              next[idx] = 1;
              ages[idx] = Math.min(ages[idx] + 1, 65535);
              alive++;
            } else {
              next[idx] = 0;
              ages[idx] = 0;
            }
          } else {
            if (birthMask[neighbors]) {
              next[idx] = 1;
              ages[idx] = 1; // Newly born
              alive++;
            } else {
              next[idx] = 0;
              ages[idx] = 0;
            }
          }
        }
      }
    }

    // Swap buffers
    this.currentGrid = next;
    this.nextGrid = current;

    this.generation++;
    this.aliveCount = alive;
    this.restingCount = resting;
    if (alive > this.peakAliveCount) {
      this.peakAliveCount = alive;
    }

    return this.getStats();
  }

  /**
   * Sets a specific cell state (0 = dead/empty, 1 = alive/active, 2 = resting)
   */
  public setCell(x: number, y: number, state: CellState): void {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
    const idx = y * this.cols + x;
    const prev = this.currentGrid[idx];

    if (prev !== state) {
      if (prev === 1) this.aliveCount = Math.max(0, this.aliveCount - 1);
      if (prev === 2) this.restingCount = Math.max(0, this.restingCount - 1);

      this.currentGrid[idx] = state;
      if (state === 1) {
        this.ageGrid[idx] = 1;
        this.aliveCount++;
        if (this.aliveCount > this.peakAliveCount) {
          this.peakAliveCount = this.aliveCount;
        }
      } else if (state === 2) {
        this.ageGrid[idx] = 1;
        this.restingCount++;
      } else {
        this.ageGrid[idx] = 0;
      }
    }
  }

  /**
   * Gets the state of a cell (0, 1, or 2)
   */
  public getCell(x: number, y: number): CellState {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return 0;
    return (this.currentGrid[y * this.cols + x] as CellState);
  }

  /**
   * Gets cell age for rendering
   */
  public getCellAge(x: number, y: number): number {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return 0;
    return this.ageGrid[y * this.cols + x];
  }

  /**
   * Toggles a cell state between empty (0) and alive (1)
   */
  public toggleCell(x: number, y: number): CellState {
    const current = this.getCell(x, y);
    const newState: CellState = current === 0 ? 1 : 0;
    this.setCell(x, y, newState);
    return newState;
  }

  /**
   * Clears the grid completely
   */
  public clear(): void {
    this.currentGrid.fill(0);
    this.nextGrid.fill(0);
    this.ageGrid.fill(0);
    this.generation = 0;
    this.aliveCount = 0;
    this.restingCount = 0;
    this.peakAliveCount = 0;
  }

  /**
   * Randomizes the grid based on target density (0.0 to 1.0)
   */
  public randomize(density: number = 0.2): void {
    let alive = 0;
    for (let i = 0; i < this.totalCells; i++) {
      const isAlive = Math.random() < density ? 1 : 0;
      this.currentGrid[i] = isAlive;
      this.ageGrid[i] = isAlive ? 1 : 0;
      if (isAlive) alive++;
    }
    this.generation = 0;
    this.aliveCount = alive;
    this.restingCount = 0;
    this.peakAliveCount = alive;
  }

  /**
   * Inverts cells (living become dead, dead become living)
   */
  public invert(): void {
    let alive = 0;
    for (let i = 0; i < this.totalCells; i++) {
      const next = this.currentGrid[i] === 1 ? 0 : 1;
      this.currentGrid[i] = next;
      this.ageGrid[i] = next ? 1 : 0;
      if (next) alive++;
    }
    this.aliveCount = alive;
    this.restingCount = 0;
    if (alive > this.peakAliveCount) {
      this.peakAliveCount = alive;
    }
  }

  /**
   * Stamps a preset pattern at a specific top-left coordinate (startX, startY).
   * Supports 90-degree rotations.
   */
  public stampPattern(
    preset: PatternPreset,
    startX: number,
    startY: number,
    rotation: 0 | 90 | 180 | 270 = 0
  ): void {
    const rawCells = preset.cells;
    const pRows = rawCells.length;
    const pCols = rawCells[0]?.length || 0;

    for (let r = 0; r < pRows; r++) {
      for (let c = 0; c < pCols; c++) {
        const val = rawCells[r][c];
        if (val > 0) {
          let rx = c;
          let ry = r;

          if (rotation === 90) {
            rx = pRows - 1 - r;
            ry = c;
          } else if (rotation === 180) {
            rx = pCols - 1 - c;
            ry = pRows - 1 - r;
          } else if (rotation === 270) {
            rx = r;
            ry = pCols - 1 - c;
          }

          const targetX = startX + rx;
          const targetY = startY + ry;

          let finalX = targetX;
          let finalY = targetY;

          if (this.toroidal) {
            finalX = (targetX % this.cols + this.cols) % this.cols;
            finalY = (targetY % this.rows + this.rows) % this.rows;
          }

          if (finalX >= 0 && finalX < this.cols && finalY >= 0 && finalY < this.rows) {
            this.setCell(finalX, finalY, val as CellState);
          }
        }
      }
    }
  }

  /**
   * Places a preset pattern centered in the grid
   */
  public loadPresetCentered(preset: PatternPreset): void {
    const pRows = preset.cells.length;
    const pCols = preset.cells[0]?.length || 0;
    const startX = Math.floor((this.cols - pCols) / 2);
    const startY = Math.floor((this.rows - pRows) / 2);
    this.stampPattern(preset, startX, startY);
  }

  /**
   * Returns current statistics
   */
  public getStats(actualFps: number = 0): SimulationStats {
    const ratio = this.totalCells > 0 ? (this.aliveCount / this.totalCells) * 100 : 0;
    return {
      generation: this.generation,
      aliveCount: this.aliveCount,
      restingCount: this.isThreeState ? this.restingCount : undefined,
      peakAliveCount: this.peakAliveCount,
      livingRatio: Number(ratio.toFixed(2)),
      actualFps: Math.round(actualFps),
    };
  }

  /**
   * Read-only view of grid buffer for direct canvas blitting
   */
  public getGridBuffer(): Uint8Array {
    return this.currentGrid;
  }
}

