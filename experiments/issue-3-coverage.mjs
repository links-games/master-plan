// Minimum reproduction: all catalog entries must be illustrated on disk and on
// their generated pages. Runs without a browser or image-generation access.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  FAMILIES,
  readCatalog,
  CONCEPTS_DIR,
} from '../scripts/game-families.mjs';
import {
  DIRECTIONS,
  extraStyleDirections,
} from '../scripts/concept-prompts.mjs';
const missing = [];
let verified = 0;
for (const family of Object.keys(FAMILIES)) {
  for (const game of readCatalog(family)) {
    const id = game.id.toLowerCase();
    const page = readFileSync(`${CONCEPTS_DIR}/pages/${id}.md`, 'utf8');
    for (const [view] of [
      ...DIRECTIONS,
      ...extraStyleDirections(game, family),
    ]) {
      const file = `${CONCEPTS_DIR}/art/${id}/${view}.webp`;
      if (!existsSync(file) || !page.includes(`../art/${id}/${view}.webp`)) {
        missing.push(`${id}/${view}`);
      }
      verified++;
    }
  }
}
assert.deepEqual(
  missing,
  [],
  `Missing or hidden concept views: ${missing.length}`
);
assert.equal(verified, 1672);
console.log(
  `Verified ${verified} core and style views on disk and on their game pages.`
);
