import { describe, it, expect } from 'test-anywhere';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { extraStyleDirections } from '../scripts/concept-prompts.mjs';

const base = 'docs/master-plan/concepts';
const expectedOriginals = {
  pz: 18,
  wl: 15,
  ml: 17,
  bc: 14,
  sl: 17,
  nc: 14,
  bd: 11,
  mr: 8,
  sm: 14,
  sp: 14,
  sa: 12,
  ss: 14,
};
const baselineCounts = {
  pz: 30,
  wl: 18,
  ml: 20,
  bc: 18,
  sl: 20,
  nc: 17,
  bd: 14,
  mr: 10,
  sm: 17,
  sp: 17,
  sa: 15,
  ss: 20,
  td: 30,
  pk: 22,
  ry: 16,
  sh: 16,
};
const directions = ['01-gameplay', '02-world', '03-details', '04-discovery'];
const directionsFor = (game) => [
  ...directions,
  ...extraStyleDirections(game, game.id.split('-')[0].toLowerCase()).map(
    ([key]) => key
  ),
];
const read = (path) => readFileSync(path, 'utf8');
const json = (path) => JSON.parse(read(path));
const catalog = [
  ...Object.keys(expectedOriginals),
  'td',
  'pk',
  'ry',
  'sh',
].flatMap((family) => json(join(base, 'catalog', `${family}.json`)));

// Inspect the actual WebP bitstream, independently of manifest dimensions.
function dimensions(buffer) {
  if (
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    throw new Error('Expected a real WebP image');
  }
  let offset = 12;
  while (offset + 8 < buffer.length) {
    const kind = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (kind === 'VP8 ') {
      if (buffer.subarray(data + 3, data + 6).toString('hex') !== '9d012a') {
        throw new Error('Invalid VP8 frame signature');
      }
      return [
        buffer.readUInt16LE(data + 6) & 0x3fff,
        buffer.readUInt16LE(data + 8) & 0x3fff,
      ];
    }
    if (kind === 'VP8X') {
      return [
        buffer.readUIntLE(data + 4, 3) + 1,
        buffer.readUIntLE(data + 7, 3) + 1,
      ];
    }
    offset = data + size + (size % 2);
  }
  throw new Error('WebP dimensions not found');
}

describe('visual game catalog', () => {
  it('preserves every original ID and covers all 310 distinct ideas', () => {
    expect(catalog.length).toBe(310);
    expect(new Set(catalog.map((game) => game.id)).size).toBe(310);
    expect(catalog.filter((game) => game.original).length).toBe(168);
    expect(
      Object.values(baselineCounts).reduce((sum, count) => sum + count, 0)
    ).toBe(300);
    for (const [family, count] of Object.entries(baselineCounts)) {
      for (let number = 1; number <= count; number++) {
        const id = `${family.toUpperCase()}-${String(number).padStart(2, '0')}`;
        expect(catalog.some((game) => game.id === id)).toBe(true);
      }
    }
    for (const game of catalog) {
      expect(typeof game.original).toBe('boolean');
      for (const field of ['title', 'genre', 'lesson', 'cx', 'scene']) {
        expect(typeof game[field]).toBe('string');
        expect(game[field].trim().length > 0).toBe(true);
      }
    }
    for (const [family, count] of Object.entries(expectedOriginals)) {
      for (let number = 1; number <= count; number++) {
        const id = `${family.toUpperCase()}-${String(number).padStart(2, '0')}`;
        expect(catalog.some((game) => game.id === id && game.original)).toBe(
          true
        );
      }
    }
  });

  it('gives every idea its own reachable page, scope and all core and style image links', () => {
    const overview = read(join(base, 'README.md'));
    expect(
      readdirSync(join(base, 'pages')).filter((name) => name.endsWith('.md'))
        .length
    ).toBe(310);
    for (const game of catalog) {
      const id = game.id.toLowerCase();
      const family = id.split('-')[0];
      expect(overview.includes(`](${family}.md)`)).toBe(true);
      expect(
        read(join(base, `${family}.md`)).includes(`](pages/${id}.md)`)
      ).toBe(true);
      const page = read(join(base, 'pages', `${id}.md`));
      for (const text of [
        game.title,
        game.genre,
        game.lesson,
        game.scene,
        'First prototype',
        'Prototype acceptance',
      ]) {
        expect(page.includes(text)).toBe(true);
      }
      for (const direction of directionsFor(game)) {
        expect(page.includes(`](../art/${id}/${direction}.webp)`)).toBe(true);
      }
      expect(page.includes(`](../jobs/${family}.json)`)).toBe(true);
      expect(page.includes(`${id}/01-gameplay`)).toBe(true);
      expect(page.includes(`${id}/04-discovery`)).toBe(true);
      if (extraStyleDirections(game, family).length) {
        expect(page.includes('](../jobs/style-variations.json)')).toBe(true);
      }
    }
  });

  it('has 1,672 independent native-resolution images with accurate provenance', () => {
    const errors = [];
    const hashes = new Set();
    const styleJobs = json(join(base, 'jobs', 'style-variations.json'));
    for (const game of catalog) {
      const id = game.id.toLowerCase();
      const art = join(base, 'art', id);
      const manifestPath = join(art, 'manifest.json');
      if (!existsSync(manifestPath)) {
        errors.push(`${id}: missing art manifest`);
        continue;
      }
      const manifest = json(manifestPath);
      expect(manifest.gameId).toBe(game.id);
      const expectedDirections = directionsFor(game);
      expect(manifest.images.length).toBe(expectedDirections.length);
      const jobs = [
        ...json(join(base, 'jobs', `${id.split('-')[0]}.json`)),
        ...styleJobs,
      ];
      for (const direction of expectedDirections) {
        const entry = manifest.images.find(
          (image) => image.file === `${direction}.webp`
        );
        expect(Boolean(entry)).toBe(true);
        const image = readFileSync(join(art, entry.file));
        const [width, height] = dimensions(image);
        expect(width >= 1024 && height >= 1024).toBe(true);
        expect([entry.width, entry.height]).toEqual([width, height]);
        const hash = createHash('sha256').update(image).digest('hex');
        expect(hash).toBe(entry.sha256);
        expect(hashes.has(hash)).toBe(false);
        hashes.add(hash);
        expect(entry.tool).toBe('image_gen.imagegen (built-in)');
        expect(entry.modelRequested).toBe('GPT Image 2.5 or latest available');
        expect(entry.modelReported).toBe(null);
        expect(Number.isNaN(Date.parse(entry.generatedAt))).toBe(false);
        expect(entry.prompt).toBe(
          jobs.find((job) => job.id === `${id}/${direction}`).prompt
        );
      }
      const thumbnail = readFileSync(join(art, 'thumbnail.webp'));
      const [width, height] = dimensions(thumbnail);
      expect(width <= 320 && height <= 320).toBe(true);
    }
    expect(errors).toEqual([]);
    expect(hashes.size).toBe(1672);
  });
});

// Story collections added for the Raya feedback now have complete concept art.
const pendingCounts = { td: 30, pk: 22, ry: 16, sh: 16 };
const pending = Object.keys(pendingCounts).flatMap((family) =>
  json(join(base, 'catalog', `${family}.json`))
);
const views = {
  '02-world': 'world',
  '03-details': 'details',
  '04-discovery': 'discovery',
};

describe('story collections', () => {
  it('keeps toddler prototype acceptance observable during caregiver co-play', () => {
    for (const game of pending.filter((item) => item.id.startsWith('TD-'))) {
      const page = read(join(base, 'pages', `${game.id.toLowerCase()}.md`));
      const rows = page.split('\n');
      const prototype = rows.find((row) => row.startsWith('| First prototype'));
      const acceptance = rows.find((row) =>
        row.startsWith('| Prototype acceptance')
      );
      expect(prototype.includes('tap')).toBe(true);
      expect(prototype.includes('No score or fail state')).toBe(true);
      expect(acceptance.includes('caregiver co-play')).toBe(true);
      expect(acceptance.includes('no reading or spoken explanation')).toBe(
        true
      );
      expect(acceptance.includes('without help')).toBe(false);
    }
  });

  it('adds toddler, preschool, Raya life and Shacados ideas with stories', () => {
    expect(new Set(pending.map((game) => game.id)).size).toBe(84);
    expect(new Set([...catalog, ...pending].map((game) => game.id)).size).toBe(
      310
    );
    for (const [family, count] of Object.entries(pendingCounts)) {
      const games = pending.filter((game) =>
        game.id.startsWith(family.toUpperCase())
      );
      expect(games.length).toBe(count);
    }
    for (const game of pending) {
      expect(game.original).toBe(false);
      for (const field of [
        'title',
        'genre',
        'lesson',
        'ages',
        'scene',
        'story',
        'wisdom',
      ]) {
        expect(typeof game[field]).toBe('string');
        expect(game[field].trim().length > 0).toBe(true);
      }
      for (const view of Object.values(views)) {
        expect(game.views[view].trim().length > 40).toBe(true);
      }
    }
    for (const game of pending.filter((item) => item.id.startsWith('TD'))) {
      expect(/^[1-3]/.test(game.ages)).toBe(true);
    }
  });

  it('renders image descriptions, the story and the prompt IDs on each page', () => {
    for (const game of pending) {
      const id = game.id.toLowerCase();
      const family = id.split('-')[0];
      const page = read(join(base, 'pages', `${id}.md`));
      for (const text of [
        game.title,
        game.scene,
        game.story,
        game.wisdom,
        ...Object.values(views).map((view) => game.views[view]),
        '## Estimated plan',
        '## Four visual directions',
        `](../jobs/${family}.json)`,
      ]) {
        expect(page.includes(text)).toBe(true);
      }
      for (const direction of directions) {
        expect(page.includes(`](../art/${id}/${direction}.webp)`)).toBe(true);
      }
      expect(page.includes('art pending')).toBe(false);
    }
  });

  it('writes four generation prompts per idea from its descriptions', () => {
    for (const family of Object.keys(pendingCounts)) {
      const jobs = json(join(base, 'jobs', `${family}.json`));
      const games = pending.filter((game) =>
        game.id.startsWith(family.toUpperCase())
      );
      expect(jobs.length).toBe(games.length * 4);
      for (const game of games) {
        const id = game.id.toLowerCase();
        for (const direction of directions) {
          const job = jobs.find((item) => item.id === `${id}/${direction}`);
          expect(job.gameId).toBe(game.id);
          const text =
            direction === '01-gameplay'
              ? game.scene
              : game.views[views[direction]];
          expect(job.prompt.includes(text)).toBe(true);
        }
      }
    }
  });

  it('prompts a portrait and a landscape loading screen per collection (R58)', () => {
    const jobs = json(join(base, 'jobs', 'loading-screens.json'));
    expect(jobs.length).toBe(32);
    for (const job of jobs) {
      const world = job.family === 'sh' ? 'Shacados' : 'Raya';
      expect(job.prompt.includes(`The planet ${world}`)).toBe(true);
      expect(job.prompt.includes('no text')).toBe(true);
    }
  });

  it('ships all 32 distinct loading backgrounds at their native aspect ratio', () => {
    const jobs = json(join(base, 'jobs', 'loading-screens.json'));
    const manifest = json(join(base, 'art', 'loading', 'manifest.json'));
    expect(manifest.images.length).toBe(32);
    const hashes = new Set();
    for (const job of jobs) {
      const name = `${job.id.split('/')[1]}.webp`;
      const entry = manifest.images.find((image) => image.file === name);
      expect(Boolean(entry)).toBe(true);
      const image = readFileSync(join(base, 'art', 'loading', name));
      const [width, height] = dimensions(image);
      expect(Math.min(width, height) >= 900).toBe(true);
      expect(width * height >= 1500000).toBe(true);
      const ratio = job.orientation === 'portrait' ? 9 / 16 : 16 / 9;
      expect(Math.abs(width / height - ratio) < 0.004).toBe(true);
      expect([entry.width, entry.height]).toEqual([width, height]);
      const hash = createHash('sha256').update(image).digest('hex');
      expect(entry.sha256).toBe(hash);
      expect(hashes.has(hash)).toBe(false);
      hashes.add(hash);
      expect(entry.prompt).toBe(job.prompt);
      expect(entry.tool).toBe('image_gen.imagegen (built-in)');
      expect(entry.modelReported).toBe(null);
    }
  });
});
