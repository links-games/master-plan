import { describe, it, expect } from 'test-anywhere';
import { readFileSync } from 'node:fs';
import { SCENES } from '../scripts/lore-scenes.mjs';
import { validateSceneAssets } from '../scripts/validate-scenes.mjs';
import { renderMarkdown } from '../scripts/site-markdown.mjs';

describe('offline lore scene sources', () => {
  it('retains licensed, checksum-verified lighting, surfaces and scanned plants', () => {
    expect(validateSceneAssets().length).toBe(25);
  });

  it('maps one unique environment to every existing pilot and its age tier', () => {
    const html = renderMarkdown(
      readFileSync('docs/master-plan/lore/scenery-pilots.md', 'utf8')
    ).html;
    const headings = [...html.matchAll(/<h3 id="([^"]+)">/g)].map(
      (match) => match[1]
    );
    expect(SCENES.length).toBe(22);
    expect(SCENES.map((scene) => scene.number)).toEqual(
      Array.from({ length: 22 }, (_, index) => index + 1)
    );
    expect(SCENES.map((scene) => scene.pilot.split('#')[1])).toEqual(headings);
    expect(new Set(SCENES.map((scene) => scene.seed)).size).toBe(22);
    for (const scene of SCENES) {
      expect(typeof scene.night).toBe('boolean');
      if (scene.world === 'Shacados') {
        expect(scene.ages >= 10).toBe(true);
      }
    }
  });
});
