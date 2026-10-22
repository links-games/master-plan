// Image-generation prompts for the game concepts and the loading screens.
// Prompts of the original 216 concepts must stay byte-identical, because the
// art manifests record the exact prompt each image was generated from.
import { FAMILIES, PENDING_ART_FAMILIES } from './game-families.mjs';

export const DIRECTIONS = [
  [
    '01-gameplay',
    'Gameplay',
    'Show the playable board or interaction from a readable overhead or side camera. Use crisp 2D shapes and an inviting hand-painted finish. The mechanic is the hero; keep environmental detail at the edges.',
  ],
  [
    '02-world',
    'World',
    'Show a wide establishing key visual of the game world, with the specific gameplay interaction visible in the foreground. Use cinematic anime-inspired environmental painting, layered depth and thoughtful lighting.',
  ],
  [
    '03-details',
    'Characters and materials',
    'Show a close-up concept of the specific game objects and a friendly Links character interacting with them. Use a tactile, beautifully lit stylized 3D diorama, physically plausible materials and clear silhouettes.',
  ],
  [
    '04-discovery',
    'Expanded play',
    'Show a later, richer playable scenario that develops this exact mechanic and makes its learning objective visible through the objects. Use polished illustrated game art and a different camera and atmosphere from the other views.',
  ],
];

// The catalog field that describes each view of a pending-art concept.
export const viewText = (game, key) =>
  key === '01-gameplay'
    ? game.scene
    : game.views[
        { '02-world': 'world', '03-details': 'details' }[key] || 'discovery'
      ];

const LINKY =
  'An original tiny Links guide may appear: a soft round creature with a coral-red left eye, sky-blue right eye and gentle curved smile.';
const ORBI =
  'Rayans are humanlike and wear tight, white, futuristic lattice clothing. A white robotic Orbi sphere companion (about 30 cm, with a coral-red left eye, a sky-blue right eye and a gentle curved smile) may float beside them. Nature is untouched: no roads, fields, fences, cars or power lines; tall, slender, white acoustic and telecom towers stand only in the distance.';
const RAYA = `Identity: adorable, intelligent and welcoming for children and adults. ${ORBI} ${LINKY}`;
const LITTLE =
  'Soft rounded shapes, very large touch targets and calm colors for small children.';

const IDENTITY = {
  td: `${RAYA} ${LITTLE}`,
  pk: `${RAYA} ${LITTLE}`,
  ry: RAYA,
  sh: 'Identity: dark but dignified and hopeful, for teens and adults. Technology of roughly 1890-1960: riveted steel, coal stoves, vacuum tubes, steam and diesel. Palette of rust, soot, mustard, ash and sick green, with one warm lamp-orange light source for hope and one small living green plant. People are humanlike, in layered patched work clothes with scarves and goggles, tired but never shown as monsters. No gore, corpses or cruelty.',
};
const DEFAULT_IDENTITY = `Identity: adorable, intelligent and welcoming for children and adults. ${LINKY}`;

const CONSTRAINTS =
  "Constraints: one complete standalone image, no collage, no contact sheet, no inset panels. Original characters, compositions, boards and objects; do not copy existing games' art or trade dress. No violence, weapons, money, shop, advertising, logos, watermarks, or written title. Use pattern and shape as well as color. Educational visuals are concept proposals, not validated scientific diagrams. Preserve physical plausibility where relevant. Beautiful deliberate composition and readable large interaction targets.";

export function promptFor(game, family, direction) {
  const pending = PENDING_ART_FAMILIES.has(family);
  const view =
    pending && direction[0] !== '01-gameplay'
      ? `This view: ${viewText(game, direction[0])}\n`
      : '';
  return `Use case: stylized-concept
Asset type: standalone high-resolution concept art for an original educational mobile-first game. Request 2048x2048 pixels or the highest native resolution available.
Game: ${game.title} (${game.id}). Genre/mechanic: ${game.genre}.
Primary scene and action: ${game.promptScene || game.scene}
${view}Learning objective expressed by the actual interaction: ${game.lesson}.
${game.artConstraint ? `Visual constraint: ${game.artConstraint}\n` : ''}World: ${FAMILIES[family][1]}, in the shared Links universe.
Art direction: ${direction[1]}. ${direction[2]}
${IDENTITY[family] || DEFAULT_IDENTITY} Keep the main mechanic unmistakable.
${CONSTRAINTS}`;
}

const RAYA_LANDSCAPE =
  'The planet Raya: untouched nature fills at least 70% of the frame. Tall, slender, white acoustic and telecom towers (300 to 1200 m) rise in the distance; they are thin and few. Small white lattice nests hide in the trees. Rayans in tight white futuristic clothing appear small, walking, playing or gliding acoustically along invisible sky-lanes near a tower, some with floating white Orbi spheres. No roads, cars, fences, power lines or crowds.';
const SHACADOS_LANDSCAPE =
  "The planet Shacados: a rusted, dusty, smog-covered coal town with junk on every roof, gas flares and dying trees. On a rare clear patch of sky, Raya's star shows as a faint dot. One warm lamp-orange window and one small living plant on a rooftop bring hope. No people in danger, no gore.";

export const LOADING_SIZES = [
  ['portrait', '1080x1920', 'lower third'],
  ['landscape', '1920x1080', 'lower center'],
];

export function loadingScreenJobs() {
  return Object.entries(FAMILIES).flatMap(([family, [title, , place]]) =>
    LOADING_SIZES.map(([orientation, size, band]) => ({
      id: `loading/${family}-${orientation}`,
      family,
      orientation,
      prompt: `Use case: loading-screen background
Asset type: full-bleed loading screen and menu background for the "${title}" collection of an original educational mobile-first game. Request ${size} pixels or the highest native resolution available in this aspect ratio.
Place: ${place}.
World: ${family === 'sh' ? SHACADOS_LANDSCAPE : RAYA_LANDSCAPE}
Composition: a wide, calm landscape with a quiet, low-detail band in the ${band} where the game will draw its progress indicator; no interface drawn.
Art direction: luminous painterly realism with a soft anime influence, deep atmospheric perspective and natural light.
Constraints: one complete standalone image, no text, letters, logos, watermarks or user interface. Original composition. No violence or weapons.`,
    }))
  );
}
