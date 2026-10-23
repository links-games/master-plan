// Publish evidence only after every new image has passed both review steps.
// Run after reviewing the sheets and completing audit-native-concept-art.py.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { FAMILIES, readCatalog } from '../scripts/game-families.mjs';
import {
  DIRECTIONS,
  extraStyleDirections,
  loadingScreenJobs,
} from '../scripts/concept-prompts.mjs';

const baseline = 'ba2ba272a23c8df2dbbbc4b75d84d8ce7720b9a5';
const art = 'docs/master-plan/concepts/art';
const original = new Set(
  execFileSync('git', ['ls-tree', '-r', '--name-only', baseline, '--', art], {
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
);
const originalImages = [...original].filter((path) => path.endsWith('.webp'));
assert.equal(
  execFileSync(
    'git',
    ['diff', '--name-only', baseline, '--', ...originalImages],
    {
      encoding: 'utf8',
    }
  ),
  '',
  'The original concept images and thumbnails must remain unchanged'
);

const expected = Object.keys(FAMILIES).flatMap((family) =>
  readCatalog(family).flatMap((game) =>
    [...DIRECTIONS, ...extraStyleDirections(game, family)].map(
      ([view]) => `${art}/${game.id.toLowerCase()}/${view}.webp`
    )
  )
);
expected.push(...loadingScreenJobs().map((job) => `${art}/${job.id}.webp`));
const added = expected.filter((path) => !original.has(path)).sort();
assert.equal(added.length, 840);
const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
let preservedPrompts = 0;
for (const family of Object.keys(FAMILIES)) {
  const path = `docs/master-plan/concepts/jobs/${family}.json`;
  const previous = JSON.parse(
    execFileSync('git', ['show', `${baseline}:${path}`], {
      encoding: 'utf8',
    })
  );
  const current = new Map(json(path).map((job) => [job.id, job.prompt]));
  for (const job of previous) {
    if (original.has(`${art}/${job.id}.webp`)) {
      assert.equal(
        current.get(job.id),
        job.prompt,
        `Original prompt: ${job.id}`
      );
      preservedPrompts++;
    }
  }
}
assert.equal(preservedPrompts, 864);
const visual = json('ci-logs/concept-art-visual-review.json');
const native = json('ci-logs/native-concept-encoding-audit.json');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const images = added.map((path) => {
  const manifest = json(`${dirname(path)}/manifest.json`);
  const entry = manifest.images.find((image) =>
    path.endsWith(`/${image.file}`)
  );
  assert.ok(entry, `Missing manifest entry: ${path}`);
  const hash = sha256(readFileSync(path));
  assert.equal(entry.sha256, hash, `Manifest hash: ${path}`);
  assert.equal(
    visual[path]?.sha256,
    hash,
    `Visual review is missing or stale: ${path}`
  );
  assert.equal(
    native[path]?.sha256,
    hash,
    `Native audit is missing or stale: ${path}`
  );
  assert.equal(
    native[path].promptSha256,
    sha256(entry.prompt),
    `Prompt audit: ${path}`
  );
  return {
    image: path,
    ...native[path],
    visuallyReviewedAt: visual[path].reviewedAt,
    visualReview: visual[path].review,
  };
});
const destination =
  'docs/case-studies/links-games-issue-3/data/concept-art-review.json';
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(
  destination,
  `${JSON.stringify({ baseline, newConcepts: 808, loadingBackgrounds: 32, images }, null, 2)}\n`
);
console.log(
  `Published exact-file visual and native-source evidence for all ${images.length} new images.`
);
