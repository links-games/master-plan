import { describe, it, expect } from 'test-anywhere';
import {
  FAMILIES,
  readCatalog,
  STORY_FAMILIES,
} from '../scripts/game-families.mjs';
import {
  DIRECTIONS,
  extraStyleDirections,
  styleVariationJobs,
  promptFor,
} from '../scripts/concept-prompts.mjs';

describe('new concept-art generation briefs', () => {
  it('adds explicit 2D style choices to all 216 previously illustrated games', () => {
    const jobs = styleVariationJobs();
    expect(jobs.length).toBe(432);
    expect(new Set(jobs.map((job) => job.id)).size).toBe(432);
    let count = 0;
    for (const family of Object.keys(FAMILIES)) {
      for (const game of readCatalog(family)) {
        const styles = extraStyleDirections(game, family);
        if (!styles.length) {
          continue;
        }
        expect(styles.map(([key]) => key)).toEqual([
          '05-storybook',
          '06-anime',
        ]);
        expect(promptFor(game, family, styles[0])).toContain(
          'Absolutely no 3D rendering'
        );
        expect(promptFor(game, family, styles[1])).toContain(
          'traditional hand-painted 2D anime'
        );
        for (const style of styles) {
          expect(
            jobs.find(
              (job) => job.id === `${game.id.toLowerCase()}/${style[0]}`
            ).prompt
          ).toBe(promptFor(game, family, style));
        }
        count++;
      }
    }
    expect(count).toBe(216);
  });

  it('separates graphic illustration, painted anime and tactile 3D alternatives', () => {
    let count = 0;
    for (const family of Object.keys(FAMILIES)) {
      for (const game of readCatalog(family)) {
        if (!STORY_FAMILIES.has(family) && game.expansion !== 'issue-3') {
          continue;
        }
        const prompts = DIRECTIONS.map((direction) =>
          promptFor(game, family, direction)
        );
        expect(prompts[0]).toContain('flat 2D storybook game illustration');
        expect(prompts[0]).toContain('Absolutely no 3D rendering');
        expect(prompts[1]).toContain('traditional hand-painted 2D anime');
        expect(prompts[1]).toContain('never a 3D render or photograph');
        expect(prompts[2]).toContain('stylized 3D diorama');
        count++;
      }
    }
    expect(count).toBe(94);
  });

  it('keeps human hosts and human hands out of toddler artwork', () => {
    for (const game of readCatalog('td')) {
      for (const direction of DIRECTIONS) {
        const prompt = promptFor(game, 'td', direction);
        expect(prompt).toContain('ONLY nonhuman round creatures');
        expect(prompt).toContain(
          'No humans, humanoid children, human faces, human hands or human fingers'
        );
        expect(prompt.includes('Rayans are humanlike')).toBe(false);
        expect(prompt.includes('A single fingertip may')).toBe(false);
      }
    }
  });
});
