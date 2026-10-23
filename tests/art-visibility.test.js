import { describe, it, expect } from 'test-anywhere';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { hasArt, hasArtViews } from '../scripts/game-families.mjs';

describe('art availability is based on complete assets', () => {
  it('reveals every collection only when all four files and its thumbnail exist', () => {
    const root = mkdtempSync(join(tmpdir(), 'art-visibility-'));
    try {
      for (const family of ['pz', 'td', 'pk', 'ry', 'sh']) {
        const id = `${family}-01`;
        const path = join(root, 'art', id);
        mkdirSync(path, { recursive: true });
        expect(hasArt(id, root)).toBe(false);
        const images = [
          '01-gameplay',
          '02-world',
          '03-details',
          '04-discovery',
        ].map((view) => ({ file: `${view}.webp` }));
        writeFileSync(join(path, 'manifest.json'), JSON.stringify({ images }));
        expect(hasArt(id, root)).toBe(false);
        for (const image of images) {
          writeFileSync(join(path, image.file), 'fixture');
        }
        expect(hasArt(id, root)).toBe(false);
        writeFileSync(join(path, 'thumbnail.webp'), 'fixture');
        expect(hasArt(id.toUpperCase(), root)).toBe(true);
        const styles = ['05-storybook', '06-anime'];
        expect(hasArtViews(id, styles, root)).toBe(false);
        images.push(...styles.map((view) => ({ file: `${view}.webp` })));
        writeFileSync(join(path, 'manifest.json'), JSON.stringify({ images }));
        writeFileSync(join(path, '05-storybook.webp'), 'fixture');
        expect(hasArtViews(id, styles, root)).toBe(false);
        writeFileSync(join(path, '06-anime.webp'), 'fixture');
        expect(hasArtViews(id, styles, root)).toBe(true);
        expect(hasArt(id, root)).toBe(true);
        rmSync(join(path, '03-details.webp'));
        expect(hasArt(id, root)).toBe(false);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
