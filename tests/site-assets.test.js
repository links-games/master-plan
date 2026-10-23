import { describe, it, expect } from 'test-anywhere';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { copySiteArt } from '../scripts/build-site.mjs';

function fixture(scenes) {
  const directory = mkdtempSync(join(tmpdir(), 'master-plan-assets-'));
  try {
    const source = join(directory, 'source');
    const target = join(directory, 'website');
    mkdirSync(join(source, 'nested'), { recursive: true });
    const files = {
      '01-gameplay.webp': 'finished image bytes',
      'nested/poster.webp': 'finished preview bytes',
      'manifest.json': '{"provenance":true}',
      'nested/scene.json': '{"vertices":[]}',
      'environment.blend': 'offline source',
      'poster.png': 'offline render',
      'README.md': 'source notes',
      'encoding-interrupted.tmp': 'unfinished encoding',
      'nested/encoding-active.tmp': 'active encoding',
    };
    for (const [path, content] of Object.entries(files)) {
      writeFileSync(join(source, path), content);
    }
    copySiteArt(source, target, { scenes });
    const actual = readdirSync(target, { recursive: true })
      .map((path) => path.replaceAll('\\', '/'))
      .filter((path) => path !== 'nested')
      .sort();
    const expected = ['01-gameplay.webp', 'nested/poster.webp'];
    if (scenes) {
      expected.push('manifest.json', 'nested/scene.json');
    }
    expect(actual).toEqual(expected.sort());
    for (const path of expected) {
      expect(readFileSync(join(target, path), 'utf8')).toBe(files[path]);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

describe('website artwork publication', () => {
  it('publishes finished concept images without encoder temporaries or source metadata', () => {
    fixture(false);
  });
  it('publishes scene previews and geometry metadata without offline renders or encoder temporaries', () => {
    fixture(true);
  });
});
