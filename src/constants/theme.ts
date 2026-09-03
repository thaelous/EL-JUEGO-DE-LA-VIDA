/**
 * Theme, color palettes, and grid size constants for Conway's Game of Life
 */

export interface GridSizeOption {
  label: string;
  shortLabel: string;
  cols: number;
  rows: number;
  description: string;
}

export const GRID_SIZES: GridSizeOption[] = [
  {
    label: 'Compacta (45 × 28) - Células Grandes',
    shortLabel: 'Compacta',
    cols: 45,
    rows: 28,
    description: 'Ideal para dedos pequeños y pantallas de teléfono',
  },
  {
    label: 'Estándar (75 × 45) - Recomendada',
    shortLabel: 'Estándar',
    cols: 75,
    rows: 45,
    description: 'Equilibrio perfecto entre detalle y tamaño',
  },
  {
    label: 'Amplia (105 × 65) - Gran Colonia',
    shortLabel: 'Amplia',
    cols: 105,
    rows: 65,
    description: 'Para colonias gigantescas y exploraciones complejas',
  },
  {
    label: 'Máxima (140 × 85) - Microcosmos',
    shortLabel: 'Máxima',
    cols: 140,
    rows: 85,
    description: 'Máxima resolución para criaturas veloces y cañones',
  },
];

export type ColorTheme = 'cyan' | 'emerald' | 'violet' | 'pink' | 'amber';

export interface ColorThemeConfig {
  id: ColorTheme;
  label: string;
  emoji: string;
  bgClass: string;
  hex: string;
  lightColor: string;
  primaryColor: string;
  deepColor: string;
  membraneColor: string;
  glowColor: string;
}

export const COLOR_THEMES: ColorThemeConfig[] = [
  {
    id: 'cyan',
    label: 'Burbujas Marinas',
    emoji: '🫧',
    bgClass: 'bg-cyan-400',
    hex: '#22d3ee',
    lightColor: '#e0f2fe',
    primaryColor: '#38bdf8',
    deepColor: '#0284c7',
    membraneColor: '#0369a1',
    glowColor: 'rgba(56, 189, 248, 0.5)',
  },
  {
    id: 'emerald',
    label: 'Gominolas Esmeralda',
    emoji: '🍏',
    bgClass: 'bg-emerald-400',
    hex: '#10b981',
    lightColor: '#dcfce7',
    primaryColor: '#4ade80',
    deepColor: '#16a34a',
    membraneColor: '#15803d',
    glowColor: 'rgba(74, 222, 128, 0.5)',
  },
  {
    id: 'violet',
    label: 'Poción Mágica',
    emoji: '🔮',
    bgClass: 'bg-purple-400',
    hex: '#c084fc',
    lightColor: '#f3e8ff',
    primaryColor: '#c084fc',
    deepColor: '#9333ea',
    membraneColor: '#7e22ce',
    glowColor: 'rgba(192, 132, 252, 0.5)',
  },
  {
    id: 'pink',
    label: 'Células Fresa',
    emoji: '🍓',
    bgClass: 'bg-pink-400',
    hex: '#f472b6',
    lightColor: '#fce7f3',
    primaryColor: '#f472b6',
    deepColor: '#db2777',
    membraneColor: '#be185d',
    glowColor: 'rgba(244, 114, 182, 0.5)',
  },
  {
    id: 'amber',
    label: 'Miel Solar',
    emoji: '🍯',
    bgClass: 'bg-amber-400',
    hex: '#fbbf24',
    lightColor: '#fef3c7',
    primaryColor: '#fbbf24',
    deepColor: '#d97706',
    membraneColor: '#b45309',
    glowColor: 'rgba(251, 191, 36, 0.5)',
  },
];
