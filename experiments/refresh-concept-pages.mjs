// Refresh selected documentation without rewriting jobs used by active image saves.
// Usage: node experiments/refresh-concept-pages.mjs td [other collection IDs]
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import {
  CONCEPTS_DIR,
  FAMILIES,
  readCatalog,
} from '../scripts/game-families.mjs';

const families = process.argv.slice(2);
assert.ok(
  families.length && families.every((family) => Object.hasOwn(FAMILIES, family))
);
mkdirSync('ci-logs', { recursive: true });
const sandbox = mkdtempSync('ci-logs/concept-preview-');
const concepts = join(sandbox, CONCEPTS_DIR);
mkdirSync(concepts, { recursive: true });
for (const directory of ['catalog', 'estimates']) {
  cpSync(join(CONCEPTS_DIR, directory), join(concepts, directory), {
    recursive: true,
  });
}
copyFileSync(
  'docs/master-plan/game-ideas.md',
  join(sandbox, 'docs/master-plan/game-ideas.md')
);
symlinkSync(resolve(CONCEPTS_DIR, 'art'), join(concepts, 'art'), 'dir');
execFileSync(process.execPath, [resolve('scripts/build-game-concepts.mjs')], {
  cwd: sandbox,
  stdio: 'inherit',
});
for (const family of families) {
  for (const game of readCatalog(family)) {
    const page = join('pages', `${game.id.toLowerCase()}.md`);
    copyFileSync(join(concepts, page), join(CONCEPTS_DIR, page));
  }
  copyFileSync(
    join(concepts, `${family}.md`),
    join(CONCEPTS_DIR, `${family}.md`)
  );
}
rmSync(sandbox, { recursive: true, force: true });
console.log(
  `Refreshed ${families.join(', ')} pages; active prompt jobs unchanged.`
);
