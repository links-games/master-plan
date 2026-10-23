import { describe, it, expect } from 'test-anywhere';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { SCENES } from '../scripts/lore-scenes.mjs';
import { validateScenes } from '../scripts/validate-scenes.mjs';

describe('reproducible lore environments', () => {
  it('ships complete Blender sources, native renders and bounded unique meshes', () => {
    expect(validateScenes().length).toBe(22);
  });
  it('keeps the visual review current for every delivered native render', () => {
    const review = JSON.parse(
      readFileSync(
        'docs/case-studies/links-games-issue-3/data/native-render-review.json',
        'utf8'
      )
    );
    expect(Number.isNaN(Date.parse(review.reviewedAt))).toBe(false);
    expect(/^[a-f0-9]{40}$/.test(review.sourceCommit)).toBe(true);
    expect(review.renderRun).toMatch(
      /^https:\/\/github\.com\/links-games\/master-plan\/actions\/runs\/\d+$/
    );
    expect(review.method.length > 30).toBe(true);
    expect(review.renders.map((entry) => entry.scene)).toEqual(
      SCENES.map((scene) => scene.id)
    );
    for (const entry of review.renders) {
      expect(entry.path).toBe(
        `docs/master-plan/lore/scenes/${entry.scene}/poster.png`
      );
      expect(
        createHash('sha256').update(readFileSync(entry.path)).digest('hex')
      ).toBe(entry.sha256);
      expect(Number.isFinite(entry.meanLuminance)).toBe(true);
      expect(entry.nearBlackFraction >= 0 && entry.nearBlackFraction <= 1).toBe(
        true
      );
    }
  });
  it('renders and validates every pilot in CI', () => {
    const workflow = readFileSync(
      '.github/workflows/lore-environments.yml',
      'utf8'
    );
    expect(workflow).toContain('experiments/render-lore-scenes.py --batch');
    expect(workflow).toContain(
      "batch: ['0/6', '1/6', '2/6', '3/6', '4/6', '5/6']"
    );
    expect(workflow).toContain('node scripts/validate-scenes.mjs');
    expect(readFileSync('.github/workflows/example-app.yml', 'utf8')).toContain(
      'node experiments/verify-master-plan.mjs'
    );
  });
});
