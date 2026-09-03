/**
 * Cellular Automata Rulesets definitions
 * Includes Conway's Game of Life, HighLife, Day & Night, Life-3 State (Brian's Brain), Seeds, Diamoeba, and Morley.
 */
import { RulesetConfig } from '../types';

export const RULESETS: RulesetConfig[] = [
  {
    id: 'conway',
    name: 'Juego de la Vida (Conway)',
    shortName: 'Conway',
    emoji: '🌱',
    notation: 'B3/S23',
    birth: [3],
    survival: [2, 3],
    isThreeState: false,
    badgeColor: 'emerald',
    description: 'El clásico y legendario autómata ideado por John Conway en 1970. Crea un equilibrio fascinante entre orden y caos.',
    kidFriendlyTip: '¡3 amigos traen un nuevo bebé al mundo, y las células con 2 o 3 vecinos viven felices!',
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
    badgeColor: 'cyan',
    description: 'Similar a Conway pero con nacimiento adicional en 6 vecinos (B6). Permite la existencia del famoso patrón "Replicador" que se duplica a sí mismo.',
    kidFriendlyTip: '¡Magia de clonación! El Replicador se divide una y otra vez en dos copias idénticas.',
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
    badgeColor: 'amber',
    description: 'Regla totalmente simétrica ante la inversión de colores: los patrones vivos en fondo oscuro evolucionan igual que los huecos en un mar de células vivas.',
    kidFriendlyTip: '¡Mundo espejo! Llena la pantalla o déjala casi vacía y verás cómo bailan las mismas figuras.',
  },
  {
    id: 'life_3_state',
    name: 'Life-3 Estados (Cerebro Durmiente)',
    shortName: 'Life-3 State',
    emoji: '⚡',
    notation: 'B2/S0/3-Estados',
    birth: [2],
    survival: [],
    isThreeState: true,
    badgeColor: 'violet',
    description: 'Autómata de 3 estados (Brian\'s Brain). Estado 0 = Vacío, 1 = Viva/Brillante, 2 = Durmiendo/Refractaria. Produce impulsos continuos y ondas neuronales.',
    kidFriendlyTip: '¡Células de luz! Nacen con 2 amigas, luego toman una siesta mágica de color lavanda antes de descansar.',
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
    badgeColor: 'rose',
    description: 'Todas las células vivas mueren al turno siguiente, pero nacen nuevas con 2 vecinos. Genera patrones caóticos que parecen fuegos artificiales.',
    kidFriendlyTip: '¡Fuegos artificiales de células! Crecen a toda velocidad dibujando chispas y estrellas.',
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
    badgeColor: 'teal',
    description: 'Forma grandes colonias continuas con bordes redondeados y ondulantes como membranas celulares reales y amebas en placas de cultivo.',
    kidFriendlyTip: '¡Como gotas gigantes de gelatina viva! Se mueven despacito y se abrazan entre sí.',
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
    badgeColor: 'indigo',
    description: 'Bautizado en honor a Stephen Morley, conocido por dar origen a naves espaciales exóticas y osciladores móviles únicos.',
    kidFriendlyTip: '¡Naves espaciales curiosas que viajan cruzando el microscopio!',
  },
];

export const DEFAULT_RULESET = RULESETS[0];

export function getRulesetById(id: string): RulesetConfig {
  return RULESETS.find((r) => r.id === id) || DEFAULT_RULESET;
}
