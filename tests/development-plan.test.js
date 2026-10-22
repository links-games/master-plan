import { describe, it, expect } from 'test-anywhere';
import { readFileSync } from 'node:fs';
import { format } from 'prettier';
import { rankGames, renderPlan } from '../scripts/build-development-plan.mjs';
import {
  computeEstimate,
  loadGames,
  validateGames,
} from '../scripts/game-estimates.mjs';

const PLAN = 'docs/master-plan/development-plan.md';
const data = loadGames();

describe('development plan (R66, R67, R69)', () => {
  it('has a valid estimate for every one of the 300 games', () => {
    expect(data.games.length).toBe(300);
    expect(validateGames(data)).toEqual([]);
    for (const game of data.games) {
      expect(Boolean(game.estimate)).toBe(true);
      expect(Number.isInteger(game.estimate.toddler)).toBe(true);
      expect(game.estimate.toddler >= 1 && game.estimate.toddler <= 5).toBe(
        true
      );
    }
  });

  it('computes effort, risk and start score with the documented formula', () => {
    const { library } = data;
    const estimate = {
      algorithms: [library.algorithms[0].id, library.algorithms[1].id],
      extraLoc: 30,
      assets: { [library.assets[0].id]: 2 },
      toddler: 3,
    };
    const result = computeEstimate(estimate, library);
    const loc = library.algorithms[0].loc + library.algorithms[1].loc + 30;
    const hours = library.assets[0].hours * 2;
    const days =
      Math.round(
        (loc / library.productivity.locPerDay +
          hours / library.productivity.assetHoursPerDay) *
          10
      ) / 10;
    expect(result.loc).toBe(loc);
    expect(result.effortDays).toBe(days);
    expect(result.risk).toBe(
      Math.max(
        library.algorithms[0].difficulty,
        library.algorithms[1].difficulty
      )
    );
    expect(result.startScore).toBe(
      Math.round(days * library.playFactor[3] * 10) / 10
    );
  });

  it('sorts every game by development effort', () => {
    const ranked = rankGames(data);
    expect(ranked.length).toBe(300);
    for (let index = 1; index < ranked.length; index++) {
      expect(
        ranked[index - 1].score.effortDays <= ranked[index].score.effortDays
      ).toBe(true);
    }
  });

  it('is regenerated from the estimates', async () => {
    const expected = await format(renderPlan(data), { filepath: PLAN });
    expect(readFileSync(PLAN, 'utf8')).toBe(expected);
  });

  it('shows the estimated plan on every concept page', () => {
    for (const game of data.games) {
      const page = readFileSync(
        `docs/master-plan/concepts/pages/${game.id.toLowerCase()}.md`,
        'utf8'
      );
      expect(page.includes('## Estimated plan')).toBe(true);
      expect(page.includes('Toddler learnability')).toBe(true);
    }
  });
});
