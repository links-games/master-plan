import { describe, it, expect } from 'test-anywhere';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

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
const directions = ['01-gameplay', '02-world', '03-details', '04-discovery'];
const read = (path) => readFileSync(path, 'utf8');
const json = (path) => JSON.parse(read(path));
const catalog = Object.keys(expectedOriginals).flatMap((family) =>
  json(join(base, 'catalog', `${family}.json`))
);

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
  it('preserves every original ID and adds 48 distinct ideas', () => {
    expect(catalog.length).toBe(216);
    expect(new Set(catalog.map((game) => game.id)).size).toBe(216);
    expect(catalog.filter((game) => game.original).length).toBe(168);
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

  it('gives every idea its own reachable page, scope and four image links', () => {
    const overview = read(join(base, 'README.md'));
    expect(
      readdirSync(join(base, 'pages')).filter((name) => name.endsWith('.md'))
        .length
    ).toBe(300);
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
      for (const direction of directions) {
        expect(page.includes(`](../art/${id}/${direction}.webp)`)).toBe(true);
      }
    }
  });

  it('has four independent native-resolution generated images per idea with accurate provenance', () => {
    const errors = [];
    const hashes = new Set();
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
      expect(manifest.images.length).toBe(4);
      const jobs = json(join(base, 'jobs', `${id.split('-')[0]}.json`));
      for (const direction of directions) {
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
    expect(hashes.size).toBe(864);
  });
});

// Collections added for the Raya feedback (R55–R76): image descriptions and
// prompts now, images later (R76).
const pendingCounts = { td: 30, pk: 22, ry: 16, sh: 16 };
const pending = Object.keys(pendingCounts).flatMap((family) =>
  json(join(base, 'catalog', `${family}.json`))
);
const views = {
  '02-world': 'world',
  '03-details': 'details',
  '04-discovery': 'discovery',
};

describe('art-pending collections', () => {
  it('adds toddler, preschool, Raya life and Shacados ideas with stories', () => {
    expect(new Set(pending.map((game) => game.id)).size).toBe(84);
    expect(new Set([...catalog, ...pending].map((game) => game.id)).size).toBe(
      300
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
        'Four image descriptions (art pending)',
        `](../jobs/${family}.json)`,
      ]) {
        expect(page.includes(text)).toBe(true);
      }
      expect(page.includes('.webp)')).toBe(false);
      expect(existsSync(join(base, 'art', id))).toBe(false);
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
});
