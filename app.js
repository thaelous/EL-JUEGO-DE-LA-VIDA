/**
 * ==========================================================================
 * Juego de la Vida de Conway - Laboratorio Celular 3D
 * JavaScript Estándar / Vainilla (Sin dependencias externas ni compiladores)
 * ==========================================================================
 */

(function () {
  'use strict';

  /* --- 1. REGLAS Y AUTÓMATAS CELULARES --- */
  const RULESETS = [
    {
      id: 'conway',
      name: 'Juego de la Vida (Conway)',
      shortName: 'Conway',
      emoji: '🌱',
      notation: 'B3/S23',
      birth: [3],
      survival: [2, 3],
      isThreeState: false,
      description: 'El clásico y legendario autómata ideado por John Conway en 1970. Crea un equilibrio fascinante entre orden y caos.',
      tip: '¡3 amigos traen un nuevo bebé al mundo, y las células con 2 o 3 vecinos viven felices!'
    },
    {
      id: 'highlife',
      name: 'HighLife (El Replicador)',
      shortName: 'HighLife',
      emoji: '🧬',
      notation: 'B36/S23',
      birth: [3, 6],
      survival: [2, 3],
      isThreeState: false,
      description: 'Similar a Conway pero con nacimiento adicional con 6 vecinos (B6). Permite la existencia del famoso patrón "Replicador" que se duplica a sí mismo.',
      tip: '¡Magia de clonación! El Replicador se divide una y otra vez en dos copias idénticas.'
    },
    {
      id: 'day_night',
      name: 'Día y Noche (Day & Night)',
      shortName: 'Day & Night',
      emoji: '🌓',
      notation: 'B3678/S34678',
      birth: [3, 6, 7, 8],
      survival: [3, 4, 6, 7, 8],
      isThreeState: false,
      description: 'Regla simétrica ante la inversión: los patrones vivos en fondo oscuro evolucionan igual que los huecos en un mar de células vivas.',
      tip: '¡Mundo espejo! Llena la pantalla o déjala casi vacía y verás cómo bailan las mismas figuras.'
    },
    {
      id: 'life_3_state',
      name: 'Life-3 Estados (Cerebro de Brian)',
      shortName: 'Life-3 State',
      emoji: '⚡',
      notation: 'B2/S0/3-Estados',
      birth: [2],
      survival: [],
      isThreeState: true,
      description: 'Autómata de 3 estados: Vacío (0), Viva brillante (1) y Durmiendo/Refractaria (2). Produce ondas neuronales continuas.',
      tip: '¡Células de luz! Nacen con 2 amigas, luego toman una siesta mágica de color lavanda antes de descansar.'
    },
    {
      id: 'seeds',
      name: 'Semillas Mágicas (Seeds)',
      shortName: 'Seeds',
      emoji: '✨',
      notation: 'B2/S',
      birth: [2],
      survival: [],
      isThreeState: false,
      description: 'Todas las células vivas mueren al turno siguiente, pero nacen nuevas con 2 vecinos. Genera patrones caóticos como fuegos artificiales.',
      tip: '¡Fuegos artificiales de células! Crecen a toda velocidad dibujando chispas y estrellas.'
    },
    {
      id: 'diamoeba',
      name: 'Diamoeba (Amebas Gigantes)',
      shortName: 'Diamoeba',
      emoji: '🦠',
      notation: 'B35678/S5678',
      birth: [3, 5, 6, 7, 8],
      survival: [5, 6, 7, 8],
      isThreeState: false,
      description: 'Forma grandes colonias continuas con bordes ondulantes como membranas celulares reales y amebas en placas de cultivo.',
      tip: '¡Como gotas gigantes de gelatina viva! Se mueven despacito y se abrazan entre sí.'
    },
    {
      id: 'morley',
      name: 'Morley (Naves Lentas)',
      shortName: 'Morley',
      emoji: '🚀',
      notation: 'B368/S245',
      birth: [3, 6, 8],
      survival: [2, 4, 5],
      isThreeState: false,
      description: 'Bautizado en honor a Stephen Morley, conocido por dar origen a naves espaciales exóticas y osciladores móviles únicos.',
      tip: '¡Naves espaciales curiosas que viajan cruzando el microscopio!'
    }
  ];

  /* --- 2. BIBLIOTECA DE PATRONES Y CRIATURAS --- */
  function parsePattern(ascii) {
    const lines = ascii.trim().split('\n').map(l => l.trimEnd());
    const maxLen = Math.max(...lines.map(l => l.length));
    return lines.map(line => {
      const row = new Array(maxLen).fill(0);
      for (let i = 0; i < line.length; i++) {
        if (line[i] === 'O' || line[i] === '#' || line[i] === '1') {
          row[i] = 1;
        } else if (line[i] === '2') {
          row[i] = 2;
        }
      }
      return row;
    });
  }

  const PRESETS = [
    {
      id: 'glider',
      name: 'Glider (Planeador)',
      funKidName: 'Pececillo Volador',
      emoji: '🐠',
      category: 'spaceships',
      desc: 'La nave espacial más famosa. Nada en diagonal cruzando el océano del laboratorio a toda velocidad.',
      tip: '¡Colócalo en una esquina y observa cómo cruza toda la pantalla!',
      cells: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1]
      ]
    },
    {
      id: 'gosper_gun',
      name: 'Cañón Gosper',
      funKidName: 'Fábrica de Pececillos',
      emoji: '🏭',
      category: 'guns',
      desc: 'El primer cañón descubierto en 1970. Dispara un flujo infinito de planeadores en diagonal.',
      tip: '¡Una fábrica viva incansable! Centrarlo en la placa es un espectáculo garantizado.',
      cells: parsePattern(`
........................O...........
......................O.O...........
............OO......OO............OO
...........O...O....OO............OO
OO........O.....O...OO..............
OO........O...O.OO....O.O...........
..........O.....O.......O...........
...........O...O....................
............OO......................
`)
    },
    {
      id: 'lwss',
      name: 'Nave Ligera (LWSS)',
      funKidName: 'Cohete Veloz',
      emoji: '🚀',
      category: 'spaceships',
      desc: 'Nave espacial ortogonal. Viaja en línea recta hacia adelante a mitad de la velocidad de la luz (c/2).',
      tip: '¡Vuela horizontalmente como un pequeño torpedo espacial!',
      cells: [
        [0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
      ]
    },
    {
      id: 'pulsar',
      name: 'Pulsar Galáctico',
      funKidName: 'Flor de Estrellas',
      emoji: '🌸',
      category: 'oscillators',
      desc: 'Impresionante oscilador simétrico de período 3 con cuatro cuadrantes pulsantes.',
      tip: '¡Abre y cierra sus pétalos luminosos como una hermosa flor alienígena!',
      cells: parsePattern(`
..OOO...OOO..
.............
O....O.O....O
O....O.O....O
O....O.O....O
..OOO...OOO..
.............
..OOO...OOO..
O....O.O....O
O....O.O....O
O....O.O....O
.............
..OOO...OOO..
`)
    },
    {
      id: 'toad',
      name: 'Toad (Sapo)',
      funKidName: 'Rana Saltarina',
      emoji: '🐸',
      category: 'oscillators',
      desc: 'Oscilador clásico de período 2 con alternancia simétrica.',
      tip: '¡Croac, croac! Parece una ranita inflando sus mofletes rítmicamente.',
      cells: [
        [0, 1, 1, 1],
        [1, 1, 1, 0]
      ]
    },
    {
      id: 'beacon',
      name: 'Beacon (Faro)',
      funKidName: 'Faro Luminoso',
      emoji: '💡',
      category: 'oscillators',
      desc: 'Oscilador de período 2 compuesto por dos bloques tocándose diagonalmente.',
      tip: '¡Enciende y apaga su luz interior guiando a las demás células en la noche!',
      cells: [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 1, 1],
        [0, 0, 1, 1]
      ]
    },
    {
      id: 'pentadecathlon',
      name: 'Pentadecathlon',
      funKidName: 'Gusanito de Fiesta',
      emoji: '🐛',
      category: 'oscillators',
      desc: 'Oscilador largo de período 15, capaz de reflejar planeadores que impactan en sus extremos.',
      tip: '¡Un gusanito que baila un ritmo de 15 pasos sin cansarse jamás!',
      cells: parsePattern(`
..O....O..
OO.OOOO.OO
..O....O..
`)
    },
    {
      id: 'acorn',
      name: 'Acorn (Bellota)',
      funKidName: 'Semilla de Roble Mágico',
      emoji: '🌰',
      category: 'methuselahs',
      desc: 'A partir de solo 7 celdas, evoluciona durante 5206 generaciones y produce 13 planeadores.',
      tip: '¡Una pequeña bellota que se convierte en un bosque de estrellas!',
      cells: parsePattern(`
.O.....
...O...
OO..OOO
`)
    },
    {
      id: 'r_pentomino',
      name: 'R-pentomino',
      funKidName: 'El Fénix Travieso',
      emoji: '🔥',
      category: 'methuselahs',
      desc: 'Evoluciona durante 1103 generaciones antes de estabilizarse emitiendo 6 planeadores.',
      tip: '¡5 células pequeñas que arman una fiesta gigante en toda la pantalla!',
      cells: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 1, 0]
      ]
    },
    {
      id: 'replicator',
      name: 'El Replicador (HighLife)',
      funKidName: 'El Clonador Mágico',
      emoji: '🧬',
      category: 'special_rules',
      recommendedRuleset: 'highlife',
      desc: 'El célebre Replicador de HighLife (B36/S23). Cada 12 generaciones se duplica en dos copias idénticas.',
      tip: '¡Usa la regla HighLife! Verás cómo esta célula se clona a sí misma sin parar.',
      cells: [
        [0, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0],
        [1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    }
  ];

  /* --- 3. PALETAS Y TEMAS 3D --- */
  const COLOR_PALETTES = {
    cyan: {
      name: 'Burbujas Marinas',
      primary: '#38bdf8',
      light: '#e0f2fe',
      deep: '#0284c7',
      membrane: '#0369a1',
      glow: 'rgba(56, 189, 248, 0.4)'
    },
    emerald: {
      name: 'Gominolas Esmeralda',
      primary: '#4ade80',
      light: '#dcfce7',
      deep: '#16a34a',
      membrane: '#15803d',
      glow: 'rgba(74, 222, 128, 0.4)'
    },
    violet: {
      name: 'Poción Mágica',
      primary: '#c084fc',
      light: '#f3e8ff',
      deep: '#9333ea',
      membrane: '#7e22ce',
      glow: 'rgba(192, 132, 252, 0.4)'
    },
    pink: {
      name: 'Células Fresa',
      primary: '#f472b6',
      light: '#fce7f3',
      deep: '#db2777',
      membrane: '#be185d',
      glow: 'rgba(244, 114, 182, 0.4)'
    },
    amber: {
      name: 'Miel Solar',
      primary: '#fbbf24',
      light: '#fef3c7',
      deep: '#d97706',
      membrane: '#b45309',
      glow: 'rgba(251, 191, 36, 0.4)'
    }
  };

  /* --- 4. TAMAÑOS DE RESOLUCIÓN DE CUADRÍCULA --- */
  const GRID_SIZES = {
    compact: { id: 'compact', name: 'Compacta', cols: 45, rows: 28, desc: 'Células gigantes, ideal para niños y dedos pequeños' },
    standard: { id: 'standard', name: 'Estándar', cols: 75, rows: 45, desc: 'Equilibrio perfecto entre detalle y visibilidad' },
    large: { id: 'large', name: 'Amplia', cols: 105, rows: 65, desc: 'Excelente para cañones y grandes ecosistemas' },
    maximum: { id: 'maximum', name: 'Máxima', cols: 140, rows: 85, desc: 'Densidad masiva con miles de microorganismos' }
  };

  /* --- 5. MOTOR DEL JUEGO DE LA VIDA --- */
  class GameEngine {
    constructor(cols, rows, toroidal = true, ruleset = RULESETS[0]) {
      this.cols = cols;
      this.rows = rows;
      this.total = cols * rows;
      this.toroidal = toroidal;

      this.current = new Uint8Array(this.total);
      this.next = new Uint8Array(this.total);
      this.ages = new Uint16Array(this.total);

      this.generation = 0;
      this.aliveCount = 0;
      this.restingCount = 0;
      this.peakAlive = 0;

      this.birthMask = new Array(9).fill(false);
      this.survivalMask = new Array(9).fill(false);
      this.setRuleset(ruleset);
    }

    setRuleset(ruleset) {
      this.ruleset = ruleset;
      this.birthMask.fill(false);
      for (const b of ruleset.birth) {
        if (b >= 0 && b <= 8) this.birthMask[b] = true;
      }
      this.survivalMask.fill(false);
      for (const s of ruleset.survival) {
        if (s >= 0 && s <= 8) this.survivalMask[s] = true;
      }
      this.isThreeState = !!ruleset.isThreeState;

      if (!this.isThreeState) {
        for (let i = 0; i < this.total; i++) {
          if (this.current[i] === 2) {
            this.current[i] = 0;
            this.ages[i] = 0;
          }
        }
        this.restingCount = 0;
      }
    }

    resize(newCols, newRows) {
      const oldCols = this.cols;
      const oldRows = this.rows;
      const oldGrid = this.current;

      this.cols = newCols;
      this.rows = newRows;
      this.total = newCols * newRows;

      this.current = new Uint8Array(this.total);
      this.next = new Uint8Array(this.total);
      this.ages = new Uint16Array(this.total);

      const offX = Math.floor((newCols - oldCols) / 2);
      const offY = Math.floor((newRows - oldRows) / 2);
      let count = 0;
      let rest = 0;

      for (let y = 0; y < oldRows; y++) {
        for (let x = 0; x < oldCols; x++) {
          const v = oldGrid[y * oldCols + x];
          if (v > 0) {
            const tx = x + offX;
            const ty = y + offY;
            if (tx >= 0 && tx < newCols && ty >= 0 && ty < newRows) {
              const idx = ty * newCols + tx;
              this.current[idx] = v;
              this.ages[idx] = 1;
              if (v === 1) count++;
              if (v === 2) rest++;
            }
          }
        }
      }

      this.aliveCount = count;
      this.restingCount = rest;
      this.peakAlive = Math.max(this.peakAlive, count);
    }

    countNeighbors(x, y) {
      const cols = this.cols;
      const rows = this.rows;
      const grid = this.current;
      let count = 0;

      if (this.toroidal) {
        const up = y === 0 ? rows - 1 : y - 1;
        const down = y === rows - 1 ? 0 : y + 1;
        const left = x === 0 ? cols - 1 : x - 1;
        const right = x === cols - 1 ? 0 : x + 1;

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

    step() {
      const cols = this.cols;
      const rows = this.rows;
      const cur = this.current;
      const nxt = this.next;
      const ages = this.ages;
      const is3 = this.isThreeState;
      const bMask = this.birthMask;
      const sMask = this.survivalMask;

      let alive = 0;
      let rest = 0;

      for (let y = 0; y < rows; y++) {
        const rowOff = y * cols;
        for (let x = 0; x < cols; x++) {
          const idx = rowOff + x;
          const state = cur[idx];
          const n = this.countNeighbors(x, y);

          if (is3) {
            if (state === 1) {
              nxt[idx] = 2;
              ages[idx] = Math.min(ages[idx] + 1, 65535);
              rest++;
            } else if (state === 2) {
              nxt[idx] = 0;
              ages[idx] = 0;
            } else {
              if (bMask[n]) {
                nxt[idx] = 1;
                ages[idx] = 1;
                alive++;
              } else {
                nxt[idx] = 0;
                ages[idx] = 0;
              }
            }
          } else {
            if (state === 1) {
              if (sMask[n]) {
                nxt[idx] = 1;
                ages[idx] = Math.min(ages[idx] + 1, 65535);
                alive++;
              } else {
                nxt[idx] = 0;
                ages[idx] = 0;
              }
            } else {
              if (bMask[n]) {
                nxt[idx] = 1;
                ages[idx] = 1;
                alive++;
              } else {
                nxt[idx] = 0;
                ages[idx] = 0;
              }
            }
          }
        }
      }

      this.current = nxt;
      this.next = cur;

      this.generation++;
      this.aliveCount = alive;
      this.restingCount = rest;
      if (alive > this.peakAlive) {
        this.peakAlive = alive;
      }
    }

    setCell(x, y, state) {
      if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
      const idx = y * this.cols + x;
      const prev = this.current[idx];

      if (prev !== state) {
        if (prev === 1) this.aliveCount = Math.max(0, this.aliveCount - 1);
        if (prev === 2) this.restingCount = Math.max(0, this.restingCount - 1);

        this.current[idx] = state;
        if (state === 1) {
          this.ages[idx] = 1;
          this.aliveCount++;
          if (this.aliveCount > this.peakAlive) this.peakAlive = this.aliveCount;
        } else if (state === 2) {
          this.ages[idx] = 1;
          this.restingCount++;
        } else {
          this.ages[idx] = 0;
        }
      }
    }

    getCell(x, y) {
      if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return 0;
      return this.current[y * this.cols + x];
    }

    clear() {
      this.current.fill(0);
      this.next.fill(0);
      this.ages.fill(0);
      this.generation = 0;
      this.aliveCount = 0;
      this.restingCount = 0;
      this.peakAlive = 0;
    }

    randomize(density = 0.2) {
      let count = 0;
      for (let i = 0; i < this.total; i++) {
        const isA = Math.random() < density ? 1 : 0;
        this.current[i] = isA;
        this.ages[i] = isA ? 1 : 0;
        if (isA) count++;
      }
      this.generation = 0;
      this.aliveCount = count;
      this.restingCount = 0;
      this.peakAlive = count;
    }

    stamp(preset, startX, startY, rotation = 0) {
      const raw = preset.cells;
      const pRows = raw.length;
      const pCols = raw[0]?.length || 0;

      for (let r = 0; r < pRows; r++) {
        for (let c = 0; c < pCols; c++) {
          const val = raw[r][c];
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

            let targetX = startX + rx;
            let targetY = startY + ry;

            if (this.toroidal) {
              targetX = (targetX % this.cols + this.cols) % this.cols;
              targetY = (targetY % this.rows + this.rows) % this.rows;
            }

            if (targetX >= 0 && targetX < this.cols && targetY >= 0 && targetY < this.rows) {
              this.setCell(targetX, targetY, val);
            }
          }
        }
      }
    }

    loadPresetCentered(preset) {
      const pRows = preset.cells.length;
      const pCols = preset.cells[0]?.length || 0;
      const sx = Math.floor((this.cols - pCols) / 2);
      const sy = Math.floor((this.rows - pRows) / 2);
      this.stamp(preset, sx, sy, 0);
    }
  }

  /* --- 6. ESTADO GLOBAL DE LA APLICACIÓN --- */
  const state = {
    engine: null,
    isRunning: false,
    fps: 20,
    drawMode: 'draw', // 'draw' | 'erase'
    showGridLines: true,
    toroidal: true,
    theme: 'cyan',
    randomDensity: 0.2,
    activeStamp: null, // { preset, rotation: 0 | 90 | 180 | 270 }
    activePresetCategory: 'all',
    hoverCell: null,
    mouseCanvasPos: null,
    lastFrameTime: 0,
    lastParticleTime: performance.now(),
    fpsAccumulator: 0,
    fpsCounter: 0,
    actualFps: 0,
    particles: [],
    // Zoom y Desplazamiento interactivo (Pan)
    zoom: 1.0,
    panX: 0,
    panY: 0,
    minZoom: 0.6,
    maxZoom: 8.0,
    isPanMode: false
  };

  // Inicializar partículas flotantes bioluminiscentes y etéreas (pequeñas, medianas y grandes)
  (function initParticles() {
    const colors = ['emerald', 'mint', 'teal', 'cyan', 'lime', 'celestial'];

    // 1. Partículas Grandes: Macro-orbes etéreos de fondo profundo (bokeh fluido)
    for (let i = 0; i < 10; i++) {
      state.particles.push({
        tier: 'large',
        x: Math.random(),
        y: Math.random(),
        radius: 46 + Math.random() * 50,
        baseAlpha: 0.025 + Math.random() * 0.045,
        pulseSpeed: 0.0004 + Math.random() * 0.0008,
        pulsePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.000015,
        vy: -(0.00001 + Math.random() * 0.000025),
        waveAmp: 0.016 + Math.random() * 0.028,
        waveFreq: 0.0004 + Math.random() * 0.0008,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // 2. Partículas Medianas: Burbujas translúcidas con reborde etéreo
    for (let i = 0; i < 18; i++) {
      state.particles.push({
        tier: 'medium',
        x: Math.random(),
        y: Math.random(),
        radius: 14 + Math.random() * 18,
        baseAlpha: 0.045 + Math.random() * 0.075,
        pulseSpeed: 0.0008 + Math.random() * 0.0014,
        pulsePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.000025,
        vy: -(0.000018 + Math.random() * 0.000045),
        waveAmp: 0.01 + Math.random() * 0.02,
        waveFreq: 0.0007 + Math.random() * 0.0012,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // 3. Partículas Pequeñas: Esporas sutiles
    for (let i = 0; i < 32; i++) {
      state.particles.push({
        tier: 'small',
        x: Math.random(),
        y: Math.random(),
        radius: 1.2 + Math.random() * 3.8,
        baseAlpha: 0.12 + Math.random() * 0.22,
        pulseSpeed: 0.0012 + Math.random() * 0.002,
        pulsePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.000035,
        vy: -(0.000025 + Math.random() * 0.000065),
        waveAmp: 0.006 + Math.random() * 0.015,
        waveFreq: 0.0009 + Math.random() * 0.0016,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  })();

  // Inicializar Motor por defecto con Gosper Gun
  const defaultGrid = GRID_SIZES.standard;
  state.engine = new GameEngine(defaultGrid.cols, defaultGrid.rows, state.toroidal, RULESETS[0]);
  const initialPreset = PRESETS.find(p => p.id === 'gosper_gun') || PRESETS[0];
  state.engine.loadPresetCentered(initialPreset);

  /* --- 7. ELEMENTOS DEL DOM --- */
  const dom = {
    body: document.body,
    avatar: document.getElementById('cellular-avatar'),
    ruleBadge: document.getElementById('header-rule-badge'),
    aliveStat: document.getElementById('header-alive-stat'),
    genStat: document.getElementById('header-gen-stat'),
    canvasStage: document.getElementById('canvas-stage'),
    canvas: document.getElementById('life-canvas'),
    stampBanner: document.getElementById('stamp-banner'),
    stampBannerName: document.getElementById('stamp-banner-name'),
    // Controles de Zoom y Pan
    zoomControls: document.getElementById('canvas-zoom-controls'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),
    zoomLevelText: document.getElementById('zoom-level-text'),
    btnPanMode: document.getElementById('btn-pan-mode'),
    btnPlay: document.getElementById('btn-play'),
    playText: document.getElementById('play-btn-text'),
    btnStep: document.getElementById('btn-step'),
    btnClear: document.getElementById('btn-clear'),
    btnDrawMode: document.getElementById('btn-draw-mode'),
    drawModeText: document.getElementById('draw-mode-text'),
    btnRandomSoup: document.getElementById('btn-random-soup'),
    btnOpenSettings: document.getElementById('btn-open-settings'),
    btnHeaderSettings: document.getElementById('btn-header-settings'),
    btnHeaderTutorial: document.getElementById('btn-header-tutorial'),
    settingsModal: document.getElementById('settings-modal'),
    // Elementos de la Intro Screen (Bienvenida)
    introScreen: document.getElementById('intro-screen'),
    introCanvas: document.getElementById('intro-particles-canvas'),
    // Elementos del Tutorial Integrado en Tablero
    tutorialPanel: document.getElementById('tutorial-integrated-panel'),
    tutorialHighlight: document.getElementById('tutorial-highlight-zone'),
    btnCloseIntegratedTutorial: document.getElementById('btn-close-integrated-tutorial'),
    btnTutorialPrev: document.getElementById('btn-tutorial-prev'),
    btnTutorialNext: document.getElementById('btn-tutorial-next'),
    btnTutorialNextText: document.getElementById('btn-tutorial-next-text'),
    btnTutorialNextIcon: document.getElementById('btn-tutorial-next-icon'),
    tutorialStepBadge: document.getElementById('tutorial-step-badge'),
    tutorialStepStatus: document.getElementById('tutorial-step-status'),
    tutorialInlineTitle: document.getElementById('tutorial-inline-title'),
    tutorialInlineDesc: document.getElementById('tutorial-inline-desc'),
    tutorialDots: document.querySelectorAll('.tut-dot'),
    chkNeverShowTutorial: document.getElementById('chk-never-show-tutorial'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnDoneModal: document.getElementById('btn-done-modal'),
    modalTabs: document.querySelectorAll('.tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    fpsSlider: document.getElementById('fps-slider'),
    fpsDisplay: document.getElementById('fps-display'),
    densitySlider: document.getElementById('density-slider'),
    densityDisplay: document.getElementById('density-display'),
    btnSoupModal: document.getElementById('btn-soup-modal'),
    toggleGridLines: document.getElementById('toggle-grid-lines'),
    toggleToroidal: document.getElementById('toggle-toroidal'),
    presetsGrid: document.getElementById('presets-grid'),
    presetsFilterBtns: document.querySelectorAll('.cat-filter-btn'),
    rulesetsGrid: document.getElementById('rulesets-grid'),
    // Stats Panel
    statGen: document.getElementById('stat-generation'),
    statAlive: document.getElementById('stat-alive'),
    statPeak: document.getElementById('stat-peak'),
    statFps: document.getElementById('stat-fps'),
    statDim: document.getElementById('stat-dimensions'),
    statRule: document.getElementById('stat-active-rule')
  };

  const ctx = dom.canvas.getContext('2d');

  /* --- 8. RENDERIZADO 3D EN CANVAS --- */
  function renderCanvas() {
    if (!dom.canvas.width || !dom.canvas.height) return;

    const engine = state.engine;
    const cols = engine.cols;
    const rows = engine.rows;
    const cellW = dom.canvas.width / cols;
    const cellH = dom.canvas.height / rows;
    const radius = Math.min(cellW, cellH) * 0.44;
    const palette = COLOR_PALETTES[state.theme] || COLOR_PALETTES.cyan;
    const width = dom.canvas.width;
    const height = dom.canvas.height;
    const now = performance.now();

    // 1. Fondo Animado Tenue en Tonos Degradados de Verde Oscuro y Negro
    const maxDim = Math.max(width, height);
    const shiftX1 = width * (0.5 + 0.16 * Math.sin(now * 0.00035));
    const shiftY1 = height * (0.5 + 0.14 * Math.cos(now * 0.00028));

    const bgGrad = ctx.createRadialGradient(
      shiftX1,
      shiftY1,
      maxDim * 0.06,
      shiftX1,
      shiftY1,
      maxDim * 0.78
    );
    bgGrad.addColorStop(0, '#032415');    // Verde esmeralda oscuro en el centro
    bgGrad.addColorStop(0.32, '#02180e'); // Bosque profundo
    bgGrad.addColorStop(0.68, '#010f08'); // Verde obsidiana tenue
    bgGrad.addColorStop(1, '#000402');    // Negro profundo
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Halo bioluminiscente sutil en movimiento
    const shiftX2 = width * (0.35 + 0.22 * Math.cos(now * 0.00022));
    const shiftY2 = height * (0.65 + 0.2 * Math.sin(now * 0.0003));
    const nebulaGrad = ctx.createRadialGradient(
      shiftX2,
      shiftY2,
      0,
      shiftX2,
      shiftY2,
      maxDim * 0.55
    );
    nebulaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
    nebulaGrad.addColorStop(0.45, 'rgba(5, 46, 22, 0.08)');
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Efecto de Partículas Flotantes Etéreas (Pequeñas, Medianas y Grandes)
    const particles = state.particles;
    const dt = Math.min(now - state.lastParticleTime, 100);
    state.lastParticleTime = now;
    const mousePos = state.mouseCanvasPos;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.y += p.vy * dt;
      p.x += p.vx * dt;

      if (p.y < -0.1) p.y = 1.1;
      if (p.y > 1.1) p.y = -0.1;
      if (p.x < -0.1) p.x = 1.1;
      if (p.x > 1.1) p.x = -0.1;

      const wave = Math.sin(now * p.waveFreq + p.pulsePhase) * p.waveAmp;
      let px = (p.x + wave) * width;
      let py = p.y * height;

      // Interacción suave con el puntero
      let interactionGlow = 0;
      if (mousePos) {
        const dx = px - mousePos.x;
        const dy = py - mousePos.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = p.tier === 'large' ? 140 : p.tier === 'medium' ? 110 : 80;
        if (dist < repelRadius && dist > 0.001) {
          const force = 1 - dist / repelRadius;
          const push = p.tier === 'large' ? 10 : p.tier === 'medium' ? 16 : 22;
          px += (dx / dist) * force * push;
          py += (dy / dist) * force * push;
          interactionGlow = force * 0.2;
        }
      }

      const pulse = Math.sin(now * p.pulseSpeed + p.pulsePhase);
      const alpha = Math.min(
        0.85,
        Math.max(0.015, p.baseAlpha + pulse * (p.baseAlpha * 0.4) + interactionGlow)
      );

      let rgb = '52, 211, 153';
      if (p.color === 'mint') rgb = '110, 231, 183';
      else if (p.color === 'teal') rgb = '45, 212, 191';
      else if (p.color === 'cyan') rgb = '103, 232, 249';
      else if (p.color === 'lime') rgb = '163, 230, 53';
      else if (p.color === 'celestial') rgb = '167, 243, 208';

      if (p.tier === 'large') {
        // Macro-orbes etéreos transparentes
        const outerR = p.radius * 1.6;
        const grad = ctx.createRadialGradient(
          px - p.radius * 0.15,
          py - p.radius * 0.15,
          0,
          px,
          py,
          outerR
        );
        grad.addColorStop(0, `rgba(${rgb}, ${alpha * 1.5})`);
        grad.addColorStop(0.35, `rgba(${rgb}, ${alpha * 0.8})`);
        grad.addColorStop(0.7, `rgba(${rgb}, ${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.beginPath();
        ctx.arc(px, py, outerR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Membrana esférica tenue
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.5})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Destello en arco
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 0.85, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (p.tier === 'medium') {
        // Esferas y burbujas translúcidas medianas
        const outerR = p.radius * 1.5;
        const grad = ctx.createRadialGradient(
          px - p.radius * 0.1,
          py - p.radius * 0.1,
          0,
          px,
          py,
          outerR
        );
        grad.addColorStop(0, `rgba(${rgb}, ${alpha * 1.4})`);
        grad.addColorStop(0.45, `rgba(${rgb}, ${alpha * 0.65})`);
        grad.addColorStop(0.85, `rgba(${rgb}, ${alpha * 0.2})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.beginPath();
        ctx.arc(px, py, outerR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Membrana
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.8})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();

        // Destello interior
        ctx.beginPath();
        ctx.arc(px - p.radius * 0.25, py - p.radius * 0.25, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
        ctx.fill();
      } else {
        // Esporas bioluminiscentes pequeñas
        const haloR = p.radius * 2.4;
        const haloGrad = ctx.createRadialGradient(px, py, 0, px, py, haloR);
        haloGrad.addColorStop(0, `rgba(${rgb}, ${alpha * 1.4})`);
        haloGrad.addColorStop(0.4, `rgba(${rgb}, ${alpha * 0.6})`);
        haloGrad.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.beginPath();
        ctx.arc(px, py, haloR, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.8, p.radius * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.1})`;
        ctx.fill();
      }
    }

    // 3. Renderizar Cuadrícula, Líneas y Células Orgánicas 3D con Zoom y Pan
    ctx.save();
    ctx.translate(state.panX, state.panY);
    ctx.scale(state.zoom, state.zoom);

    // Contorno exterior que delimita la placa de cultivo
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.28)';
    ctx.lineWidth = Math.max(0.8, 1.5 / state.zoom);
    ctx.strokeRect(0, 0, width, height);

    // Líneas sutiles de la placa (opcional)
    if (state.showGridLines && (cellW * state.zoom) >= 4) {
      ctx.strokeStyle = 'rgba(20, 83, 45, 0.4)';
      ctx.lineWidth = Math.max(0.35, 0.6 / state.zoom);
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) {
        const px = Math.round(x * cellW);
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
      }
      for (let y = 0; y <= rows; y++) {
        const py = Math.round(y * cellH);
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
      }
      ctx.stroke();
    }

    // 4. Renderizar Células Orgánicas 3D con recorte inteligente (Viewport Culling para 60 FPS fluidos)
    const minVisX = -state.panX / state.zoom;
    const maxVisX = (width - state.panX) / state.zoom;
    const minVisY = -state.panY / state.zoom;
    const maxVisY = (height - state.panY) / state.zoom;

    const startCol = Math.max(0, Math.floor((minVisX / width) * cols));
    const endCol = Math.min(cols, Math.ceil((maxVisX / width) * cols) + 1);
    const startRow = Math.max(0, Math.floor((minVisY / height) * rows));
    const endRow = Math.min(rows, Math.ceil((maxVisY / height) * rows) + 1);

    const grid = engine.current;
    for (let y = startRow; y < endRow; y++) {
      const rowOff = y * cols;
      const cy = y * cellH + cellH * 0.5;

      for (let x = startCol; x < endCol; x++) {
        const val = grid[rowOff + x];
        if (val === 0) continue;

        const cx = x * cellW + cellW * 0.5;

        if (val === 1) {
          // --- Célula Viva (Microburbuja 3D) ---
          // Halo exterior luminoso
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = palette.glow;
          ctx.fill();

          // Cuerpo de la burbuja con iluminación radial esférica
          const lightX = cx - radius * 0.32;
          const lightY = cy - radius * 0.32;
          const grad = ctx.createRadialGradient(
            lightX, lightY, radius * 0.08,
            cx, cy, radius
          );
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.25, palette.light);
          grad.addColorStop(0.65, palette.primary);
          grad.addColorStop(1, palette.deep);

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Borde de membrana translúcida
          ctx.strokeStyle = palette.membrane;
          ctx.lineWidth = Math.max(1, radius * 0.12);
          ctx.stroke();

          // Destello especular de brillo húmedo (glare 3D)
          ctx.beginPath();
          ctx.ellipse(
            cx - radius * 0.28,
            cy - radius * 0.28,
            radius * 0.28,
            radius * 0.16,
            -Math.PI / 4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fill();

        } else if (val === 2) {
          // --- Célula Descansando (Life-3 State: Lavanda suave) ---
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 5. Previsualización Fantasma del Sello Activo o Cursor
    if (state.activeStamp && state.hoverCell) {
      const preset = state.activeStamp.preset;
      const rot = state.activeStamp.rotation;
      const raw = preset.cells;
      const pRows = raw.length;
      const pCols = raw[0]?.length || 0;
      const sx = state.hoverCell.x;
      const sy = state.hoverCell.y;

      ctx.save();
      ctx.fillStyle = 'rgba(244, 114, 182, 0.65)';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = Math.max(1, 1.5 / state.zoom);

      for (let r = 0; r < pRows; r++) {
        for (let c = 0; c < pCols; c++) {
          if (raw[r][c] > 0) {
            let rx = c;
            let ry = r;
            if (rot === 90) { rx = pRows - 1 - r; ry = c; }
            else if (rot === 180) { rx = pCols - 1 - c; ry = pRows - 1 - r; }
            else if (rot === 270) { rx = r; ry = pCols - 1 - c; }

            const tx = sx + rx;
            const ty = sy + ry;
            if (tx >= 0 && tx < cols && ty >= 0 && ty < rows) {
              const pcx = tx * cellW + cellW * 0.5;
              const pcy = ty * cellH + cellH * 0.5;
              ctx.beginPath();
              ctx.arc(pcx, pcy, radius * 0.9, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }
        }
      }
      ctx.restore();
    } else if (state.hoverCell && !state.isRunning) {
      // Indicador de celda bajo el cursor
      const hx = state.hoverCell.x * cellW;
      const hy = state.hoverCell.y * cellH;
      ctx.strokeStyle = state.drawMode === 'erase' ? 'rgba(244, 63, 94, 0.7)' : 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = Math.max(1, 1.5 / state.zoom);
      ctx.strokeRect(hx, hy, cellW, cellH);
    }

    // Restaurar transformación de zoom y pan
    ctx.restore();
  }

  /* --- 9. BUCLE DE SIMULACIÓN Y ANIMACIÓN --- */
  function animationLoop(timestamp) {
    if (!state.lastFrameTime) state.lastFrameTime = timestamp;
    const elapsed = timestamp - state.lastFrameTime;
    const frameInterval = 1000 / state.fps;

    if (elapsed >= frameInterval) {
      state.lastFrameTime = timestamp - (elapsed % frameInterval);

      if (state.isRunning) {
        state.engine.step();
        updateStatsDisplay();
      }

      // Cálculo de FPS reales
      state.fpsCounter++;
      state.fpsAccumulator += elapsed;
      if (state.fpsAccumulator >= 1000) {
        state.actualFps = state.fpsCounter;
        state.fpsCounter = 0;
        state.fpsAccumulator = 0;
        if (dom.statFps) dom.statFps.textContent = `${state.actualFps} FPS`;
      }
    }

    // El lienzo, fondo orgánico degradado y partículas se renderizan suavemente a 60 FPS
    renderCanvas();
    requestAnimationFrame(animationLoop);
  }

  /* --- 10. SINCRONIZACIÓN DE ESTADÍSTICAS Y UI --- */
  function updateStatsDisplay() {
    const engine = state.engine;
    dom.aliveStat.textContent = `${engine.aliveCount.toLocaleString()} vivas`;
    dom.genStat.textContent = `Gen ${engine.generation.toLocaleString()}`;

    // Si el modal de ajustes está abierto, sincronizar sus números
    if (dom.settingsModal.classList.contains('open')) {
      if (dom.statGen) dom.statGen.textContent = engine.generation.toLocaleString();
      if (dom.statAlive) dom.statAlive.textContent = engine.aliveCount.toLocaleString();
      if (dom.statPeak) dom.statPeak.textContent = engine.peakAlive.toLocaleString();
      if (dom.statDim) dom.statDim.textContent = `${engine.cols} × ${engine.rows}`;
      if (dom.statRule) dom.statRule.textContent = `${engine.ruleset.emoji} ${engine.ruleset.name}`;
    }
  }

  function syncRulesetBadge() {
    const r = state.engine.ruleset;
    dom.ruleBadge.innerHTML = `<span>${r.emoji}</span><span>${r.shortName} (${r.notation})</span>`;
  }

  function setPlayState(running) {
    state.isRunning = running;
    if (running) {
      dom.btnPlay.classList.add('playing');
      dom.playText.textContent = 'Pausa';
      dom.avatar.classList.add('running');
    } else {
      dom.btnPlay.classList.remove('playing');
      dom.playText.textContent = '¡Dar Vida!';
      dom.avatar.classList.remove('running');
    }
    updateStatsDisplay();
  }

  function togglePlay() {
    setPlayState(!state.isRunning);
  }

  function setTheme(themeKey) {
    if (!COLOR_PALETTES[themeKey]) return;
    state.theme = themeKey;
    dom.body.setAttribute('data-theme', themeKey);
    document.querySelectorAll('.theme-card-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeKey);
    });
    renderCanvas();
  }

  function setDrawMode(mode) {
    state.drawMode = mode;
    if (mode === 'erase') {
      dom.btnDrawMode.classList.add('mode-erase');
      dom.drawModeText.textContent = 'Goma';
    } else {
      dom.btnDrawMode.classList.remove('mode-erase');
      dom.drawModeText.textContent = 'Lápiz';
    }
  }

  function clearActiveStamp() {
    state.activeStamp = null;
    dom.stampBanner.classList.remove('visible');
    renderCanvas();
  }

  /* --- 11. REDIMENSIONAMIENTO DEL CANVAS --- */
  function resizeCanvasToContainer() {
    const stage = dom.canvasStage;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    if (rect.width > 0 && rect.height > 0) {
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (dom.canvas.width !== targetW || dom.canvas.height !== targetH) {
        dom.canvas.width = targetW;
        dom.canvas.height = targetH;
        clampPan();
      }
      renderCanvas();
    }
  }

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(resizeCanvasToContainer);
  });

  /* --- 11b. GESTIÓN DE ZOOM Y DESPLAZAMIENTO (PAN) --- */
  function clampPan() {
    const w = dom.canvas.width;
    const h = dom.canvas.height;
    if (!w || !h) return;

    // Permitir desplazarse cómodamente manteniendo al menos 20% del tablero visible en pantalla
    const minPanX = w * 0.2 - w * state.zoom;
    const maxPanX = w * 0.8;
    const minPanY = h * 0.2 - h * state.zoom;
    const maxPanY = h * 0.8;

    state.panX = Math.max(minPanX, Math.min(maxPanX, state.panX));
    state.panY = Math.max(minPanY, Math.min(maxPanY, state.panY));
  }

  function setZoom(newZoom, pivotX, pivotY) {
    const clampedZoom = Math.max(state.minZoom, Math.min(state.maxZoom, newZoom));
    if (Math.abs(clampedZoom - state.zoom) < 0.0001) return;

    const px = pivotX !== undefined ? pivotX : (dom.canvas.width * 0.5);
    const py = pivotY !== undefined ? pivotY : (dom.canvas.height * 0.5);

    const scaleRatio = clampedZoom / state.zoom;
    state.panX = px - (px - state.panX) * scaleRatio;
    state.panY = py - (py - state.panY) * scaleRatio;
    state.zoom = clampedZoom;

    clampPan();
    updateZoomDisplay();
    renderCanvas();
  }

  function zoomIn() {
    setZoom(state.zoom * 1.25);
  }

  function zoomOut() {
    setZoom(state.zoom / 1.25);
  }

  function resetZoom() {
    state.zoom = 1.0;
    state.panX = 0;
    state.panY = 0;
    updateZoomDisplay();
    renderCanvas();
  }

  function updateZoomDisplay() {
    if (dom.zoomLevelText) {
      const pct = Math.round(state.zoom * 100);
      dom.zoomLevelText.textContent = `${pct}%`;
    }
  }

  function togglePanMode(force) {
    state.isPanMode = force !== undefined ? force : !state.isPanMode;
    if (dom.btnPanMode) {
      dom.btnPanMode.classList.toggle('active', state.isPanMode);
    }
    if (dom.canvasStage) {
      dom.canvasStage.classList.toggle('pan-mode', state.isPanMode);
    }
  }

  // Conectar botones visuales de zoom
  if (dom.btnZoomIn) {
    dom.btnZoomIn.addEventListener('click', (e) => {
      e.stopPropagation();
      zoomIn();
    });
  }
  if (dom.btnZoomOut) {
    dom.btnZoomOut.addEventListener('click', (e) => {
      e.stopPropagation();
      zoomOut();
    });
  }
  if (dom.btnZoomReset) {
    dom.btnZoomReset.addEventListener('click', (e) => {
      e.stopPropagation();
      resetZoom();
    });
  }
  if (dom.btnPanMode) {
    dom.btnPanMode.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanMode();
    });
  }

  /* --- 12. GESTIÓN DE RATÓN, ZOOM Y EVENTOS TÁCTILES --- */
  let isPointerDown = false;
  let pointerButton = 0;
  let isPanning = false;
  let panStartClient = { x: 0, y: 0 };
  let lastActionCell = null;
  let isPinching = false;
  let lastPinchDist = 0;
  let lastPinchMid = { x: 0, y: 0 };
  const activePointers = new Map();

  function getCellCoordinates(clientX, clientY) {
    const rect = dom.canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    if (px < 0 || px >= rect.width || py < 0 || py >= rect.height) {
      state.mouseCanvasPos = null;
      return null;
    }

    const screenX = px * (dom.canvas.width / rect.width);
    const screenY = py * (dom.canvas.height / rect.height);
    state.mouseCanvasPos = { x: screenX, y: screenY };

    // Conversión de coordenadas de pantalla a espacio mundo con Zoom y Pan
    const worldX = (screenX - state.panX) / state.zoom;
    const worldY = (screenY - state.panY) / state.zoom;

    const x = Math.floor((worldX / dom.canvas.width) * state.engine.cols);
    const y = Math.floor((worldY / dom.canvas.height) * state.engine.rows);

    if (x < 0 || x >= state.engine.cols || y < 0 || y >= state.engine.rows) {
      return null;
    }

    return { x, y };
  }

  function plotLine(x0, y0, x1, y1, callback) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let cx = x0;
    let cy = y0;

    while (true) {
      callback(cx, cy);
      if (cx === x1 && cy === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        cx += sx;
      }
      if (e2 < dx) {
        err += dx;
        cy += sy;
      }
    }
  }

  function handlePointerAction(clientX, clientY) {
    const cell = getCellCoordinates(clientX, clientY);
    if (!cell) return;

    if (state.activeStamp) {
      // Estampar criatura en esa posición
      state.engine.stamp(
        state.activeStamp.preset,
        cell.x,
        cell.y,
        state.activeStamp.rotation
      );
      clearActiveStamp();
      updateStatsDisplay();
      renderCanvas();
      return;
    }

    // Dibujar o borrar
    const shouldErase = state.drawMode === 'erase' || pointerButton === 2;
    const targetVal = shouldErase ? 0 : 1;

    if (lastActionCell) {
      plotLine(lastActionCell.x, lastActionCell.y, cell.x, cell.y, (x, y) => {
        if (x >= 0 && x < state.engine.cols && y >= 0 && y < state.engine.rows) {
          state.engine.setCell(x, y, targetVal);
        }
      });
    } else {
      state.engine.setCell(cell.x, cell.y, targetVal);
    }

    lastActionCell = cell;
    updateStatsDisplay();
    renderCanvas();
  }

  // Zoom en PC con rueda del ratón (scroll) directamente sobre el lienzo
  dom.canvasStage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = dom.canvas.getBoundingClientRect();
    const pivotX = (e.clientX - rect.left) * (dom.canvas.width / rect.width);
    const pivotY = (e.clientY - rect.top) * (dom.canvas.height / rect.height);

    const zoomDelta = e.deltaY < 0 ? 1.15 : (1 / 1.15);
    setZoom(state.zoom * zoomDelta, pivotX, pivotY);
  }, { passive: false });

  // Eventos de Puntero (Mouse, Touch y Stylus unificados)
  dom.canvasStage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#canvas-zoom-controls') || e.target.closest('#tutorial-integrated-panel') || e.target.closest('#stamp-banner')) {
      return;
    }

    try {
      dom.canvasStage.setPointerCapture(e.pointerId);
    } catch {}

    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.size === 1) {
      pointerButton = e.button;
      const wantsPan = state.isPanMode || e.button === 1 || e.button === 2;

      if (wantsPan) {
        isPanning = true;
        panStartClient = { x: e.clientX, y: e.clientY };
        dom.canvasStage.classList.add('panning');
      } else {
        isPointerDown = true;
        lastActionCell = null;
        handlePointerAction(e.clientX, e.clientY);
      }
    } else if (activePointers.size === 2) {
      // Detección táctil de dos dedos: Activar Pinch-to-Zoom y Desplazamiento (Pan)
      isPointerDown = false;
      lastActionCell = null;
      isPanning = true;
      isPinching = true;
      dom.canvasStage.classList.add('panning');

      const ptrs = Array.from(activePointers.values());
      lastPinchDist = Math.hypot(ptrs[1].x - ptrs[0].x, ptrs[1].y - ptrs[0].y);
      lastPinchMid = {
        x: (ptrs[0].x + ptrs[1].x) * 0.5,
        y: (ptrs[0].y + ptrs[1].y) * 0.5
      };
    }
  });

  dom.canvasStage.addEventListener('pointermove', (e) => {
    if (activePointers.has(e.pointerId)) {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Gestos táctiles de 2 dedos (Pinch-to-zoom y Pan simultáneo en celulares)
    if (activePointers.size >= 2 && isPinching) {
      const ptrs = Array.from(activePointers.values());
      const p1 = ptrs[0];
      const p2 = ptrs[1];
      const currentDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const currentMid = {
        x: (p1.x + p2.x) * 0.5,
        y: (p1.y + p2.y) * 0.5
      };

      if (lastPinchDist > 0 && currentDist > 0) {
        const scaleRatio = currentDist / lastPinchDist;
        const newZoom = Math.max(state.minZoom, Math.min(state.maxZoom, state.zoom * scaleRatio));

        const rect = dom.canvas.getBoundingClientRect();
        const pivotX = (currentMid.x - rect.left) * (dom.canvas.width / rect.width);
        const pivotY = (currentMid.y - rect.top) * (dom.canvas.height / rect.height);

        const actualRatio = newZoom / state.zoom;
        state.panX = pivotX - (pivotX - state.panX) * actualRatio;
        state.panY = pivotY - (pivotY - state.panY) * actualRatio;
        state.zoom = newZoom;

        // Desplazamiento continuo con el punto medio de los dos dedos
        const dMidX = (currentMid.x - lastPinchMid.x) * (dom.canvas.width / rect.width);
        const dMidY = (currentMid.y - lastPinchMid.y) * (dom.canvas.height / rect.height);
        state.panX += dMidX;
        state.panY += dMidY;

        lastPinchDist = currentDist;
        lastPinchMid = currentMid;

        clampPan();
        updateZoomDisplay();
        renderCanvas();
      }
      return;
    }

    // Desplazamiento (Pan) con 1 dedo o ratón
    if (isPanning && activePointers.size === 1) {
      const rect = dom.canvas.getBoundingClientRect();
      const dx = (e.clientX - panStartClient.x) * (dom.canvas.width / rect.width);
      const dy = (e.clientY - panStartClient.y) * (dom.canvas.height / rect.height);

      state.panX += dx;
      state.panY += dy;
      panStartClient = { x: e.clientX, y: e.clientY };

      clampPan();
      renderCanvas();
      return;
    }

    // Comportamiento normal: pintar o hover sobre la cuadrícula
    const cell = getCellCoordinates(e.clientX, e.clientY);
    state.hoverCell = cell;

    if (isPointerDown) {
      handlePointerAction(e.clientX, e.clientY);
    } else {
      renderCanvas();
    }
  });

  function handlePointerEnd(e) {
    if (activePointers.has(e.pointerId)) {
      try {
        dom.canvasStage.releasePointerCapture(e.pointerId);
      } catch {}
      activePointers.delete(e.pointerId);
    }

    if (activePointers.size === 0) {
      isPointerDown = false;
      isPanning = false;
      isPinching = false;
      lastActionCell = null;
      lastPinchDist = 0;
      dom.canvasStage.classList.remove('panning');
    } else if (activePointers.size === 1) {
      isPinching = false;
      lastPinchDist = 0;
      const remaining = Array.from(activePointers.values())[0];
      panStartClient = { x: remaining.x, y: remaining.y };
    }
    renderCanvas();
  }

  dom.canvasStage.addEventListener('pointerup', handlePointerEnd);
  dom.canvasStage.addEventListener('pointercancel', handlePointerEnd);

  dom.canvasStage.addEventListener('pointerleave', () => {
    if (!isPointerDown && !isPanning) {
      state.hoverCell = null;
      state.mouseCanvasPos = null;
      renderCanvas();
    }
  });

  dom.canvasStage.addEventListener('contextmenu', (e) => e.preventDefault());

  /* --- 13. CONTROLES DE LA BARRA INFERIOR --- */
  dom.btnPlay.addEventListener('click', () => setPlayState(!state.isRunning));

  dom.btnStep.addEventListener('click', () => {
    if (!state.isRunning) {
      state.engine.step();
      updateStatsDisplay();
      renderCanvas();
    }
  });

  dom.btnClear.addEventListener('click', () => {
    state.engine.clear();
    setPlayState(false);
    clearActiveStamp();
    updateStatsDisplay();
    renderCanvas();
  });

  dom.btnDrawMode.addEventListener('click', () => {
    setDrawMode(state.drawMode === 'draw' ? 'erase' : 'draw');
  });

  dom.btnRandomSoup.addEventListener('click', () => {
    state.engine.randomize(state.randomDensity);
    updateStatsDisplay();
    renderCanvas();
  });

  /* --- 14. MODAL DE AJUSTES Y PESTAÑAS --- */
  function openSettings() {
    dom.settingsModal.classList.add('open');
    updateStatsDisplay();
  }

  function closeSettings() {
    dom.settingsModal.classList.remove('open');
  }

  dom.btnOpenSettings.addEventListener('click', openSettings);
  dom.btnHeaderSettings.addEventListener('click', openSettings);
  dom.btnCloseModal.addEventListener('click', closeSettings);
  dom.btnDoneModal.addEventListener('click', closeSettings);

  dom.settingsModal.addEventListener('click', (e) => {
    if (e.target === dom.settingsModal) closeSettings();
  });

  /* --- 14b. PANTALLA DE BIENVENIDA (INTRO) & TUTORIAL INTERACTIVO INTEGRADO --- */
  let tutorialCurrentStep = 0;
  let isIntroActive = false;
  let introAnimFrame = null;
  let introParticles = [];

  // Configuración de partículas verdes sutiles y luminosas para la pantalla de bienvenida
  function startIntroScreen() {
    if (!dom.introScreen || !dom.introCanvas) {
      checkAndStartTutorial();
      return;
    }

    isIntroActive = true;
    dom.introScreen.style.display = 'flex';
    dom.introScreen.classList.remove('fade-out');

    const ctx = dom.introCanvas.getContext('2d');
    let width = (dom.introCanvas.width = window.innerWidth);
    let height = (dom.introCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      if (isIntroActive && dom.introCanvas) {
        width = dom.introCanvas.width = window.innerWidth;
        height = dom.introCanvas.height = window.innerHeight;
      }
    });

    // Crear partículas luminosas en tonos verdes
    introParticles = [];
    for (let i = 0; i < 45; i++) {
      introParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 2 + Math.random() * 5.5,
        alpha: 0.15 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -(0.3 + Math.random() * 0.7),
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseVal: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? 'rgba(52, 211, 153, ' : 'rgba(167, 243, 208, '
      });
    }

    function renderIntroLoop() {
      if (!isIntroActive) return;
      ctx.clearRect(0, 0, width, height);

      introParticles.forEach(p => {
        p.pulseVal += p.pulseSpeed;
        const currentAlpha = Math.max(0.08, p.alpha + Math.sin(p.pulseVal) * 0.18);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowColor = 'rgba(52, 211, 153, 0.7)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      });

      introAnimFrame = requestAnimationFrame(renderIntroLoop);
    }

    renderIntroLoop();

    // La pantalla de bienvenida se muestra exactamente durante 3 segundos
    setTimeout(() => {
      endIntroScreen();
    }, 3000);
  }

  function endIntroScreen() {
    if (!isIntroActive) return;
    if (dom.introScreen) {
      dom.introScreen.classList.add('fade-out');
      // Iniciar el tutorial integrado automáticamente sin esperas adicionales
      checkAndStartTutorial();
      setTimeout(() => {
        isIntroActive = false;
        if (introAnimFrame) cancelAnimationFrame(introAnimFrame);
        if (dom.introScreen) dom.introScreen.style.display = 'none';
      }, 700);
    } else {
      isIntroActive = false;
      checkAndStartTutorial();
    }
  }

  // Pasos del tutorial interactivo integrado sobre el tablero
  const tutorialSteps = [
    {
      badge: 'Paso 1 de 3',
      status: 'Crear vida',
      title: 'Paso 1: ¡Despierta Células Vivas!',
      desc: 'Haz clic o desliza tu dedo/cursor sobre la zona resaltada en la cuadrícula para sembrar tus primeras células orgánicas.',
      action: 'paint',
      setup: () => {
        if (state.isRunning) setPlayState(false);
        state.engine.clear();
        state.drawMode = 'draw';
        dom.btnDrawMode.classList.add('active');
        dom.drawModeText.textContent = 'Modo: Dibujar';
        if (dom.tutorialHighlight) dom.tutorialHighlight.style.display = 'flex';
        renderCanvas();
        updateStatsDisplay();
      }
    },
    {
      badge: 'Paso 2 de 3',
      status: 'Ejemplo de Patrón',
      title: 'Paso 2: Criaturas y Patrones Biológicos',
      desc: 'Observa este oscilador Pulsar en el centro. Las células sobreviven o mueren según las leyes de Conway: nacen con 3 vecinas vivas y viven con 2 o 3.',
      action: 'pattern',
      setup: () => {
        if (state.isRunning) setPlayState(false);
        state.engine.clear();
        if (dom.tutorialHighlight) dom.tutorialHighlight.style.display = 'none';
        const pulsarPreset = PRESETS.find(p => p.id === 'pulsar') || PRESETS[0];
        if (pulsarPreset) {
          state.engine.loadPresetCentered(pulsarPreset);
        }
        renderCanvas();
        updateStatsDisplay();
      }
    },
    {
      badge: 'Paso 3 de 3',
      status: 'Evolución Dinámica',
      title: 'Paso 3: ¡Dale Play a la Simulación!',
      desc: 'Observa la danza biológica en movimiento. Pulsa "Comenzar a jugar" o presiona la Barra Espaciadora en cualquier momento.',
      action: 'evolve',
      setup: () => {
        if (dom.tutorialHighlight) dom.tutorialHighlight.style.display = 'none';
        if (!state.isRunning) setPlayState(true);
      }
    }
  ];

  function renderTutorialStep(stepIndex) {
    tutorialCurrentStep = stepIndex;
    const step = tutorialSteps[stepIndex];
    if (!step) return;

    if (dom.tutorialStepBadge) dom.tutorialStepBadge.textContent = step.badge;
    if (dom.tutorialStepStatus) dom.tutorialStepStatus.textContent = step.status;
    if (dom.tutorialInlineTitle) dom.tutorialInlineTitle.textContent = step.title;
    if (dom.tutorialInlineDesc) dom.tutorialInlineDesc.textContent = step.desc;

    if (dom.tutorialDots) {
      dom.tutorialDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === stepIndex);
      });
    }

    if (dom.btnTutorialPrev) {
      dom.btnTutorialPrev.style.display = stepIndex === 0 ? 'none' : 'inline-flex';
    }

    if (dom.btnTutorialNextText && dom.btnTutorialNextIcon) {
      if (stepIndex === tutorialSteps.length - 1) {
        dom.btnTutorialNextText.textContent = 'Comenzar a jugar';
        dom.btnTutorialNextIcon.textContent = '✨';
      } else {
        dom.btnTutorialNextText.textContent = 'Siguiente';
        dom.btnTutorialNextIcon.textContent = '→';
      }
    }

    if (typeof step.setup === 'function') {
      step.setup();
    }
  }

  function openTutorial() {
    if (dom.tutorialPanel) dom.tutorialPanel.style.display = 'flex';
    renderTutorialStep(0);
  }

  function closeTutorial() {
    if (dom.tutorialPanel) dom.tutorialPanel.style.display = 'none';
    if (dom.tutorialHighlight) dom.tutorialHighlight.style.display = 'none';

    // Guardar preferencia de 'No volver a mostrar' si el usuario marcó la casilla
    try {
      if (dom.chkNeverShowTutorial && dom.chkNeverShowTutorial.checked) {
        localStorage.setItem('conway_never_show_tutorial', 'true');
      }
    } catch {}
  }

  function checkAndStartTutorial() {
    try {
      const neverShow = localStorage.getItem('conway_never_show_tutorial') === 'true';
      if (!neverShow) {
        openTutorial();
      }
    } catch {
      openTutorial();
    }
  }

  // Inicializar estado de la casilla 'No volver a mostrar'
  try {
    if (dom.chkNeverShowTutorial) {
      dom.chkNeverShowTutorial.checked = localStorage.getItem('conway_never_show_tutorial') === 'true';
      dom.chkNeverShowTutorial.addEventListener('change', (e) => {
        try {
          if (e.target.checked) {
            localStorage.setItem('conway_never_show_tutorial', 'true');
          } else {
            localStorage.removeItem('conway_never_show_tutorial');
          }
        } catch {}
      });
    }
  } catch {}

  if (dom.btnHeaderTutorial) dom.btnHeaderTutorial.addEventListener('click', openTutorial);
  if (dom.btnCloseIntegratedTutorial) dom.btnCloseIntegratedTutorial.addEventListener('click', closeTutorial);

  if (dom.btnTutorialPrev) {
    dom.btnTutorialPrev.addEventListener('click', () => {
      if (tutorialCurrentStep > 0) {
        renderTutorialStep(tutorialCurrentStep - 1);
      }
    });
  }

  if (dom.btnTutorialNext) {
    dom.btnTutorialNext.addEventListener('click', () => {
      if (tutorialCurrentStep < tutorialSteps.length - 1) {
        renderTutorialStep(tutorialCurrentStep + 1);
      } else {
        closeTutorial();
      }
    });
  }

  if (dom.tutorialDots) {
    dom.tutorialDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => renderTutorialStep(idx));
    });
  }

  // Cambio de pestañas
  dom.modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dom.modalTabs.forEach(t => t.classList.remove('active'));
      dom.tabPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Selector de Temas 3D
  document.querySelectorAll('.theme-card-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  // Slider de Velocidad FPS
  dom.fpsSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.fps = val;
    dom.fpsDisplay.textContent = `${val} FPS`;
    document.querySelectorAll('.quick-buttons-row .btn-chip').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.fps, 10) === val);
    });
  });

  document.querySelectorAll('.quick-buttons-row .btn-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.fps, 10);
      state.fps = val;
      dom.fpsSlider.value = val;
      dom.fpsDisplay.textContent = `${val} FPS`;
      document.querySelectorAll('.quick-buttons-row .btn-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Selector de Tamaño de Cuadrícula
  document.querySelectorAll('.grid-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.grid-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const s = GRID_SIZES[btn.dataset.size];
      if (s) {
        state.engine.resize(s.cols, s.rows);
        updateStatsDisplay();
        renderCanvas();
      }
    });
  });

  // Conmutador de Líneas Guía
  dom.toggleGridLines.addEventListener('click', () => {
    state.showGridLines = !state.showGridLines;
    dom.toggleGridLines.classList.toggle('active', state.showGridLines);
    dom.toggleGridLines.querySelector('.status-indicator').textContent = state.showGridLines ? 'Activadas' : 'Ocultas';
    renderCanvas();
  });

  // Conmutador de Borde Toroide
  dom.toggleToroidal.addEventListener('click', () => {
    state.toroidal = !state.toroidal;
    state.engine.toroidal = state.toroidal;
    dom.toggleToroidal.classList.toggle('active', state.toroidal);
    dom.toggleToroidal.querySelector('.status-indicator').textContent = state.toroidal ? 'Infinito' : 'Con Muros';
  });

  // Slider de Sopa Mágica
  dom.densitySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.randomDensity = val / 100;
    dom.densityDisplay.textContent = `${val}%`;
  });

  dom.btnSoupModal.addEventListener('click', () => {
    state.engine.randomize(state.randomDensity);
    updateStatsDisplay();
    renderCanvas();
    closeSettings();
  });

  /* --- 15. RENDERIZADO DINÁMICO DE CRIATURAS (PRESETS) --- */
  function renderPresetsList() {
    dom.presetsGrid.innerHTML = '';
    const filtered = PRESETS.filter(p => {
      if (state.activePresetCategory === 'all') return true;
      return p.category === state.activePresetCategory;
    });

    for (const preset of filtered) {
      const card = document.createElement('div');
      card.className = 'preset-card';

      const pRows = preset.cells.length;
      const pCols = preset.cells[0]?.length || 0;

      card.innerHTML = `
        <div class="preset-card-top">
          <span class="preset-title">
            <span>${preset.emoji}</span>
            <span>${preset.funKidName}</span>
          </span>
          <span class="preset-dim">${pCols}×${pRows}</span>
        </div>
        <p class="preset-desc">${preset.desc}</p>
        <div class="preset-tip">💡 ${preset.tip}</div>
        <div class="preset-actions">
          <button class="btn-preset-action btn-preset-center" type="button">Centrar</button>
          <button class="btn-preset-action btn-preset-stamp" type="button">Sello 🎯</button>
        </div>
      `;

      card.querySelector('.btn-preset-center').addEventListener('click', () => {
        if (preset.recommendedRuleset && preset.recommendedRuleset !== state.engine.ruleset.id) {
          const ruleMatch = RULESETS.find(r => r.id === preset.recommendedRuleset);
          if (ruleMatch) {
            state.engine.setRuleset(ruleMatch);
            syncRulesetBadge();
          }
        }
        state.engine.loadPresetCentered(preset);
        updateStatsDisplay();
        renderCanvas();
        closeSettings();
      });

      card.querySelector('.btn-preset-stamp').addEventListener('click', () => {
        if (preset.recommendedRuleset && preset.recommendedRuleset !== state.engine.ruleset.id) {
          const ruleMatch = RULESETS.find(r => r.id === preset.recommendedRuleset);
          if (ruleMatch) {
            state.engine.setRuleset(ruleMatch);
            syncRulesetBadge();
          }
        }
        state.activeStamp = { preset, rotation: 0 };
        dom.stampBannerName.textContent = `${preset.emoji} ${preset.funKidName}`;
        dom.stampBanner.classList.add('visible');
        closeSettings();
      });

      dom.presetsGrid.appendChild(card);
    }
  }

  dom.presetsFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.presetsFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activePresetCategory = btn.dataset.category;
      renderPresetsList();
    });
  });

  /* --- 16. RENDERIZADO DINÁMICO DE REGLAS (RULESETS) --- */
  function renderRulesetsList() {
    dom.rulesetsGrid.innerHTML = '';

    for (const rule of RULESETS) {
      const card = document.createElement('div');
      const isActive = state.engine.ruleset.id === rule.id;
      card.className = `ruleset-card ${isActive ? 'active' : ''}`;

      card.innerHTML = `
        <div>
          <div class="ruleset-header">
            <span class="ruleset-name">
              <span>${rule.emoji}</span>
              <span>${rule.name}</span>
            </span>
            <span class="ruleset-notation">${rule.notation}</span>
          </div>
          <p class="config-description" style="margin-top: 6px;">${rule.description}</p>
          <div class="preset-tip" style="margin-top: 8px;">✨ ${rule.tip}</div>
        </div>
        <button class="btn-ruleset-select" type="button">
          ${isActive ? '✓ Regla Activa' : 'Activar Regla'}
        </button>
      `;

      card.querySelector('.btn-ruleset-select').addEventListener('click', () => {
        state.engine.setRuleset(rule);
        syncRulesetBadge();
        renderRulesetsList();
        updateStatsDisplay();
        renderCanvas();
      });

      dom.rulesetsGrid.appendChild(card);
    }
  }

  /* --- 17. ATAJOS DE TECLADO GLOBALES --- */
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
      e.preventDefault();
      setPlayState(!state.isRunning);
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      if (!state.isRunning) {
        state.engine.step();
        updateStatsDisplay();
        renderCanvas();
      }
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomIn();
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomOut();
    } else if (e.key === '0') {
      e.preventDefault();
      resetZoom();
    } else if (e.key === 'r' || e.key === 'R') {
      if (state.activeStamp) {
        e.preventDefault();
        state.activeStamp.rotation = ((state.activeStamp.rotation + 90) % 360);
        renderCanvas();
      }
    } else if (e.key === 'Escape') {
      if (state.activeStamp) {
        clearActiveStamp();
      } else if (dom.tutorialPanel && dom.tutorialPanel.style.display !== 'none') {
        closeTutorial();
      } else if (dom.settingsModal.classList.contains('open')) {
        closeSettings();
      }
    }
  });

  /* --- 18. INICIALIZACIÓN DE LA APLICACIÓN --- */
  setTheme('cyan');
  syncRulesetBadge();
  updateStatsDisplay();
  renderPresetsList();
  renderRulesetsList();

  // Asegurar tamaño del lienzo tras cargar fuentes y layout
  setTimeout(() => {
    resizeCanvasToContainer();
  }, 50);

  // Iniciar la secuencia de bienvenida envolvente (Pantalla de bienvenida verde con partículas de 3s)
  startIntroScreen();

  // Iniciar bucle de animación a 60 FPS
  requestAnimationFrame(animationLoop);

})();
