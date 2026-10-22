// Import a complete, validated CI render set; never publish mixed source revisions.
// Usage: node experiments/import-lore-artifacts.mjs ci-logs/render-artifacts-current
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { format } from 'prettier';
import { SCENES } from '../scripts/lore-scenes.mjs';
import {
  validateSceneAssets,
  validateScenes,
} from '../scripts/validate-scenes.mjs';

const source = process.argv[2];
assert.ok(source, 'Pass the directory containing all 22 CI render outputs');
validateSceneAssets();
validateScenes(source);
const destination = 'docs/master-plan/lore/scenes';
for (const scene of SCENES) {
  const target = join(destination, scene.id);
  mkdirSync(target, { recursive: true });
  for (const file of [
    'environment.blend',
    'poster.png',
    'poster.webp',
    'scene.json',
  ]) {
    copyFileSync(join(source, scene.id, file), join(target, file));
  }
  // Blender's JSON layout differs from the repository's formatter; preserve
  // every manifest value while normalizing the imported document.
  writeFileSync(
    join(target, 'manifest.json'),
    await format(
      readFileSync(join(source, scene.id, 'manifest.json'), 'utf8'),
      {
        parser: 'json',
      }
    )
  );
}
const reports = validateScenes(destination);
console.log(JSON.stringify(reports, null, 2));
