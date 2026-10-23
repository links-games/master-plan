// Shared metadata of the game-concept collections, used by the concept,
// development-plan and website builders.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const CONCEPTS_DIR = 'docs/master-plan/concepts';

// [title, world used in image prompts, Raya loading-screen place]
// Collections from `td` on were added for the Raya feedback (R55–R76); their
// pages retain detailed scene descriptions alongside generated art.
export const FAMILIES = {
  pz: [
    'Puzzles',
    'a tactile botanical puzzle garden',
    'A fern garden with stone circles under a twisted white spire',
  ],
  wl: [
    'Words and languages',
    'a cozy library village and word garden',
    'A reading nest village in giant tree crowns, linked by sky-lanes',
  ],
  ml: [
    'Math and logic',
    'an inviting mathematical discovery garden',
    "A hexagonal basalt plateau where a tower's rings cast geometric shadows",
  ],
  bc: [
    'Board and card games',
    'a friendly woodland board-game club',
    'A clearing with flat stones used as tables, under a sunset tower',
  ],
  sl: [
    'Science lab',
    'a bright, safe, hands-on science workshop',
    'A waterfall valley with an open-air lattice lab and a levitating water drop',
  ],
  nc: [
    'Nature and care',
    'an ecologically rich garden community',
    'A mangrove delta with herons, where a tower stands in shallow water',
  ],
  bd: [
    'Build and create',
    'a sunlit community makerspace',
    'Cliff nests woven from white lattice, with a garden assembler at work',
  ],
  mr: [
    'Music and rhythm',
    'a musical garden with acoustic instruments',
    'A tower festival on a flower steppe, with the audible tower song on',
  ],
  sm: [
    'Sports and motion',
    'an accessible outdoor movement park',
    'Sky-lanes over a glacier lake, with flyers in pearl-paneled suits',
  ],
  sp: [
    'Space and physics',
    'a peaceful space research academy',
    'The tallest tower at night, with the moons Pim and Pom and the Milky Way above it',
  ],
  sa: [
    'Stories and adventures',
    'a warm, mysterious storybook world',
    'A misty forest path with old stone steps and a distant tower light',
  ],
  ss: [
    'Strategy and simulation',
    'a cooperative resource-sharing settlement',
    'A ridge overlooking a valley of towers that fades into blue haze',
  ],
  td: [
    'Toddlers (1–3)',
    'a soft clover meadow on the planet Raya at the foot of a short, slender white tower, untouched nature all around',
    'A soft clover meadow at the foot of a short white tower, with grazing fawns and floating bubbles',
  ],
  pk: [
    'Preschool (3–5)',
    'a river beach of round pebbles on the planet Raya beside a slender white tower, with white lattice nests in the trees',
    "A river beach of round pebbles beside a tower, with children's nests in the trees",
  ],
  ry: [
    'Raya life',
    'the untouched nature of the planet Raya, with tall, slender, white acoustic and telecom towers in the distance',
    'The apple tree at dawn, a child and her Orbi',
  ],
  sh: [
    'Shacados',
    'the rusted, dusty, smog-covered industrial planet Shacados, with junk everywhere, dying polluted forests and frozen regions',
    "Raya's bright star seen through a clear gap in the smog over a Shacados rooftop",
  ],
};

export const STORY_FAMILIES = new Set(['td', 'pk', 'ry', 'sh']);

export const familyTitle = (family) => FAMILIES[family][0];

export function readCatalog(family) {
  return JSON.parse(
    readFileSync(join(CONCEPTS_DIR, 'catalog', `${family}.json`), 'utf8')
  );
}

export function readEstimates(family) {
  const path = join(CONCEPTS_DIR, 'estimates', `${family}.json`);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : [];
}

export function readLibrary() {
  return JSON.parse(
    readFileSync(join(CONCEPTS_DIR, 'estimates', 'library.json'), 'utf8')
  );
}

export const familyOf = (gameId) => gameId.split('-')[0].toLowerCase();

export const hasArtViews = (gameId, views, conceptsDir = CONCEPTS_DIR) => {
  const dir = join(conceptsDir, 'art', gameId.toLowerCase());
  if (!existsSync(join(dir, 'manifest.json'))) {
    return false;
  }
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  return (
    views.every(
      (view) =>
        manifest.images.some((image) => image.file === `${view}.webp`) &&
        existsSync(join(dir, `${view}.webp`))
    ) && existsSync(join(dir, 'thumbnail.webp'))
  );
};

export const hasArt = (gameId, conceptsDir = CONCEPTS_DIR) =>
  hasArtViews(
    gameId,
    ['01-gameplay', '02-world', '03-details', '04-discovery'],
    conceptsDir
  );
