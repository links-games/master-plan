import { describe, it, expect } from 'test-anywhere';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';

const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

describe('completed concept-art review evidence', () => {
  it('keeps the visual review and native-source audit current for all 840 new images', () => {
    const report = json(
      'docs/case-studies/links-games-issue-3/data/concept-art-review.json'
    );
    expect(report.baseline).toBe('ba2ba272a23c8df2dbbbc4b75d84d8ce7720b9a5');
    expect(report.newConcepts).toBe(808);
    expect(report.loadingBackgrounds).toBe(32);
    expect(report.images.length).toBe(840);
    expect(new Set(report.images.map((entry) => entry.image)).size).toBe(840);
    expect(new Set(report.images.map((entry) => entry.generationId)).size).toBe(
      840
    );
    expect(
      report.images.filter((entry) => entry.image.includes('/art/loading/'))
        .length
    ).toBe(32);
    for (const entry of report.images) {
      const manifest = json(`${dirname(entry.image)}/manifest.json`);
      const image = manifest.images.find((candidate) =>
        entry.image.endsWith(`/${candidate.file}`)
      );
      expect(Boolean(image)).toBe(true);
      expect(sha256(readFileSync(entry.image))).toBe(entry.sha256);
      expect(image.sha256).toBe(entry.sha256);
      expect(sha256(image.prompt)).toBe(entry.promptSha256);
      expect(/^[a-f0-9]{64}$/.test(entry.nativeSourceSha256)).toBe(true);
      expect(/^exec-[a-f0-9-]+$/.test(entry.generationId)).toBe(true);
      expect(entry.nativeDimensions).toEqual([image.width, image.height]);
      expect(Number.isNaN(Date.parse(entry.visuallyReviewedAt))).toBe(false);
      expect(entry.visualReview.length > 20).toBe(true);
      expect(entry.verification).toBe(
        'Exact prompt and byte-identical native-size WebP encoding'
      );
    }
  });
});
