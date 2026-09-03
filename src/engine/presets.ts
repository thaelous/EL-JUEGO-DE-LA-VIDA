/**
 * Library of classic presets for John Conway's Game of Life
 */

import { PatternPreset } from '../types';

// Helper to convert ascii multiline art or coordinate list to 2D grid
function parsePattern(ascii: string): number[][] {
  const lines = ascii.trim().split('\n').map((l) => l.trimEnd());
  const maxLen = Math.max(...lines.map((l) => l.length));
  return lines.map((line) => {
    const row = new Array(maxLen).fill(0);
    for (let i = 0; i < line.length; i++) {
      if (line[i] === 'O' || line[i] === '#' || line[i] === '1') {
        row[i] = 1;
      }
    }
    return row;
  });
}

export const PRESETS: PatternPreset[] = [
  // --- OSCILADORES ---
  {
    id: 'blinker',
    name: 'Blinker (Destello)',
    funKidName: 'Semáforo Saltador',
    emoji: '🚦',
    category: 'oscillators',
    description: 'El oscilador más pequeño y conocido. Período 2.',
    kidTip: '¡Gira de arriba a abajo como un pequeño semáforo que no para de parpadear!',
    width: 3,
    height: 3,
    cells: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  },
  {
    id: 'toad',
    name: 'Toad (Sapo)',
    funKidName: 'Rana Saltarina',
    emoji: '🐸',
    category: 'oscillators',
    description: 'Oscilador clásico de período 2 con alternancia simétrica.',
    kidTip: '¡Croac, croac! Parece una ranita inflando sus mofletes rítmicamente.',
    width: 4,
    height: 4,
    cells: [
      [0, 1, 1, 1],
      [1, 1, 1, 0],
    ],
  },
  {
    id: 'beacon',
    name: 'Beacon (Faro)',
    funKidName: 'Faro Luminoso',
    emoji: '💡',
    category: 'oscillators',
    description: 'Oscilador de período 2 compuesto por dos bloques tocándose diagonalmente.',
    kidTip: '¡Enciende y apaga su luz interior guiando a las demás células en la noche!',
    width: 4,
    height: 4,
    cells: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ],
  },
  {
    id: 'pulsar',
    name: 'Pulsar',
    funKidName: 'Flor de Estrellas',
    emoji: '🌸',
    category: 'oscillators',
    description: 'Impresionante oscilador simétrico de período 3 con 4 cuadrantes pulsantes.',
    kidTip: '¡Abre y cierra sus pétalos luminosos como una hermosa flor alienígena!',
    width: 13,
    height: 13,
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
`),
  },
  {
    id: 'pentadecathlon',
    name: 'Pentadecathlon',
    funKidName: 'Gusanito de Fiesta',
    emoji: '🐛',
    category: 'oscillators',
    description: 'Oscilador largo de período 15, capaz de reflejar deslizadores.',
    kidTip: '¡Un gusanito que baila un ritmo de 15 pasos sin cansarse jamás!',
    width: 10,
    height: 3,
    cells: parsePattern(`
..O....O..
OO.OOOO.OO
..O....O..
`),
  },

  // --- DESLIZADORES Y NAVES ESPACIALES ---
  {
    id: 'glider',
    name: 'Glider (Planeador)',
    funKidName: 'Pececillo Volador',
    emoji: '🐠',
    category: 'spaceships',
    description: 'La nave espacial más pequeña. Se desplaza en diagonal por la cuadrícula.',
    kidTip: '¡Nada en diagonal cruzando el océano del laboratorio a toda velocidad!',
    width: 3,
    height: 3,
    cells: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    id: 'lwss',
    name: 'LWSS (Nave Ligera)',
    funKidName: 'Cohete Veloz',
    emoji: '🚀',
    category: 'spaceships',
    description: 'Lightweight Spaceship. Viaja ortogonalmente a velocidad c/2.',
    kidTip: '¡Un cohete espacial que vuela recto hacia adelante surcando el espacio!',
    width: 5,
    height: 4,
    cells: [
      [0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
  },
  {
    id: 'gosper_gun',
    name: 'Gosper Glider Gun',
    funKidName: 'Fábrica de Pececillos',
    emoji: '🏭',
    category: 'guns',
    description: 'El primer cañón descubierto (1970). Dispara un flujo infinito de planeadores.',
    kidTip: '¡Una asombrosa máquina viviente que fabrica pececillos voladores sin parar!',
    author: 'Bill Gosper',
    width: 36,
    height: 9,
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
`),
  },
  {
    id: 'simkin_gun',
    name: 'Simkin Glider Gun',
    category: 'guns',
    description: 'Cañón de planeadores más compacto descubierto en 2015.',
    author: 'Michael Simkin',
    width: 33,
    height: 21,
    cells: parsePattern(`
OO.....OO........................
OO.....OO........................
.................................
....OO...........................
....OO...........................
.................................
.................................
.................................
.................................
......................OO.OO......
.....................O.....O.....
.....................O......O..OO
.....................OOO...O...OO
..........................O......
.................................
.................................
.................................
.................................
.................................
.................................
..................OO.............
`),
  },

  // --- VIDAS ESTABLES (STILL LIFES) ---
  {
    id: 'block',
    name: 'Bloque',
    category: 'still_lifes',
    description: 'La forma de vida estática de 4 celdas más común.',
    width: 2,
    height: 2,
    cells: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    id: 'beehive',
    name: 'Colmena (Beehive)',
    category: 'still_lifes',
    description: 'Segunda forma de vida estática más frecuente.',
    width: 4,
    height: 3,
    cells: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ],
  },
  {
    id: 'loaf',
    name: 'Hogaza de Pan (Loaf)',
    category: 'still_lifes',
    description: 'Vida estática asimétrica de 7 celdas.',
    width: 4,
    height: 4,
    cells: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 0],
    ],
  },

  // --- MATUSALENES (METHUSELAHS) ---
  {
    id: 'r_pentomino',
    name: 'R-pentomino',
    funKidName: 'El Fénix Travieso',
    emoji: '🔥',
    category: 'methuselahs',
    description: 'Evoluciona durante 1103 generaciones antes de estabilizarse emitiendo 6 planeadores.',
    kidTip: '¡5 células pequeñas que arman una fiesta gigante en toda la pantalla!',
    width: 3,
    height: 3,
    cells: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  {
    id: 'acorn',
    name: 'Acorn (Bellota)',
    funKidName: 'Semilla de Roble Mágico',
    emoji: '🌰',
    category: 'methuselahs',
    description: 'A partir de solo 7 celdas, evoluciona durante 5206 generaciones y produce 13 planeadores.',
    kidTip: '¡Una pequeña bellota que se convierte en un bosque de estrellas!',
    width: 7,
    height: 3,
    cells: parsePattern(`
.O.....
...O...
OO..OOO
`),
  },
  {
    id: 'diehard',
    name: 'Diehard (Inmortal Efímero)',
    funKidName: 'El Cometa Fugaz',
    emoji: '💫',
    category: 'methuselahs',
    description: 'Patrón que evoluciona por 130 generaciones y luego se desvanece por completo sin dejar rastro.',
    kidTip: '¡Baila durante 130 pasos y luego desaparece como por arte de magia!',
    width: 8,
    height: 3,
    cells: parsePattern(`
......O.
OO......
.O...OOO
`),
  },

  // --- REGLAS ESPECIALES (HIGHLIFE, LIFE-3 STATE, DAY & NIGHT) ---
  {
    id: 'replicator',
    name: 'Replicator (HighLife)',
    funKidName: 'El Clonador Mágico',
    emoji: '🧬',
    category: 'special_rules',
    recommendedRuleset: 'highlife',
    description: 'El célebre Replicador de HighLife (B36/S23). Cada 12 generaciones se duplica en dos copias idénticas.',
    kidTip: '¡Usa la regla HighLife! Verás cómo esta célula se clona a sí misma sin parar.',
    width: 6,
    height: 6,
    cells: [
      [0, 0, 1, 1, 1, 0],
      [0, 1, 0, 0, 1, 0],
      [1, 0, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 'brians_brain_glider',
    name: 'Glider Cerebral (Life-3)',
    funKidName: 'Neurona Relámpago',
    emoji: '⚡',
    category: 'special_rules',
    recommendedRuleset: 'life_3_state',
    description: 'Nave elemental de Brian\'s Brain / Life-3 State. Avanza en diagonal emitiendo destellos.',
    kidTip: '¡Prueba con la regla Life-3 Estados! Vuela por la cuadrícula dejando un rastro azul brillante.',
    width: 4,
    height: 4,
    cells: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [2, 0, 0, 2],
      [0, 2, 2, 0],
    ],
  },
  {
    id: 'brians_brain_oscillator',
    name: 'Mariposa Pulsante (Life-3)',
    funKidName: 'Mariposa de Neón',
    emoji: '🦋',
    category: 'special_rules',
    recommendedRuleset: 'life_3_state',
    description: 'Oscilador armónico para Life-3 State que late rítmicamente alternando estados activo y reposo.',
    kidTip: '¡Sus alas de luz brillan y descansan en un ciclo relajante y tierno!',
    width: 6,
    height: 6,
    cells: [
      [0, 1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 2, 2, 0, 1],
      [1, 0, 2, 2, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 1, 0],
    ],
  },
  {
    id: 'day_night_diamond',
    name: 'Diamante Simétrico (Day & Night)',
    funKidName: 'Gema del Día y la Noche',
    emoji: '💎',
    category: 'special_rules',
    recommendedRuleset: 'day_night',
    description: 'Patrón simétrico que demuestra la inversión complementaria en Day & Night (B3678/S34678).',
    kidTip: '¡Activa la regla Day & Night y observa cómo el centro y los bordes bailan en simetría!',
    width: 6,
    height: 6,
    cells: [
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 0],
    ],
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  oscillators: 'Osciladores (Bailarines)',
  spaceships: 'Naves y Pececitos',
  guns: 'Fábricas de Células',
  still_lifes: 'Células Dormilonas (Estables)',
  methuselahs: 'Semillas Mágicas',
  special_rules: 'Reglas Especiales (HighLife / Life-3)',
};
