// Install approved native flat-style replacements after all Shacados jobs finish.
// Usage: node experiments/install-reviewed-sh-art.mjs ci-logs/sh-flat-approved.json
import assert from 'node:assert/strict';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { DIRECTIONS, promptFor } from '../scripts/concept-prompts.mjs';
import { CONCEPTS_DIR, readCatalog } from '../scripts/game-families.mjs';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const approved = read(process.argv[2]);
const games = readCatalog('sh');
assert.equal(approved.length, games.length);
assert.equal(new Set(approved.map(({ id }) => id)).size, games.length);
const jobFile = join(CONCEPTS_DIR, 'jobs/sh.json');
const jobs = read(jobFile);
for (const game of games) {
  const id = `${game.id.toLowerCase()}/01-gameplay`;
  const candidate = approved.find((image) => image.id === id);
  assert.ok(candidate, `${id}: missing approved replacement`);
  assert.ok(existsSync(candidate.path), `${id}: missing native output`);
  assert.equal(candidate.prompt, promptFor(game, 'sh', DIRECTIONS[0]));
  const dir = join(CONCEPTS_DIR, 'art', game.id.toLowerCase());
  for (const [direction] of DIRECTIONS) {
    assert.ok(
      existsSync(join(dir, `${direction}.webp`)),
      'Wait for all 64 Shacados generation jobs before replacing any artwork'
    );
  }
  const job = jobs.find((entry) => entry.id === id);
  assert.ok(job);
  job.prompt = candidate.prompt;
}

const archive = join('ci-logs/replaced-sh-art', String(Date.now()));
writeFileSync(jobFile, `${JSON.stringify(jobs, null, 2)}\n`);
for (const candidate of approved) {
  const game = candidate.id.split('/')[0];
  const dir = join(CONCEPTS_DIR, 'art', game);
  const manifestFile = join(dir, 'manifest.json');
  const manifest = read(manifestFile);
  const previous = manifest.images.find(
    (image) => image.file === '01-gameplay.webp'
  );
  assert.ok(previous);
  if (previous.prompt === candidate.prompt) {
    console.log(`${game}: approved prompt already installed`);
    continue;
  }
  const backup = join(archive, game);
  mkdirSync(backup, { recursive: true });
  for (const file of ['01-gameplay.webp', 'thumbnail.webp', 'manifest.json']) {
    copyFileSync(join(dir, file), join(backup, file));
  }
  for (const file of ['01-gameplay.webp', 'thumbnail.webp']) {
    unlinkSync(join(dir, file));
  }
  manifest.images = manifest.images.filter(
    (image) => image.file !== '01-gameplay.webp'
  );
  writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  const result = spawnSync(
    '/usr/bin/python3',
    ['experiments/save-concept-art.py', candidate.id, candidate.path],
    { stdio: 'inherit' }
  );
  assert.equal(
    result.status,
    0,
    `${candidate.id}: failed to save native output`
  );
}
console.log(`Preserved superseded drafts under ${archive}`);
