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
    ).toBe(216);
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
