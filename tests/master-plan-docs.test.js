import { describe, it, expect } from 'test-anywhere';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

// Lychee checks that linked files exist but not that #fragments match a
// heading, so cross-document anchors in the master plan are checked here.
const roots = [
  'docs/master-plan',
  'docs/case-studies/issue-1',
  'docs/case-studies/links-games-issue-3',
];

function readText(filePath) {
  return readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n');
}

function markdownFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return markdownFiles(path);
    }
    return name.endsWith('.md') ? [path] : [];
  });
}

function withoutCodeBlocks(text) {
  return text.replace(/^```[\s\S]*?^```/gm, '');
}

// GitHub heading slugs: rendered text, lowercased, punctuation removed,
// every space turned into a hyphen, duplicates suffixed with -1, -2, ...
function headingSlugs(filePath) {
  const seen = new Map();
  const slugs = new Set();
  for (const line of withoutCodeBlocks(readText(filePath)).split('\n')) {
    const match = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }
    const base = match[1]
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/`/g, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s/g, '-');
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    slugs.add(count === 0 ? base : `${base}-${count}`);
  }
  return slugs;
}

function relativeLinks(filePath) {
  const text = withoutCodeBlocks(readText(filePath)).replace(/`[^`\n]*`/g, '');
  const links = [];
  for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = match[1];
    if (!/^[a-z][a-z0-9+.-]*:/i.test(target)) {
      links.push(target);
    }
  }
  return links;
}

const files = roots.flatMap(markdownFiles);

describe('master plan documents', () => {
  it('finds the master plan and case study markdown files', () => {
    expect(files.length > 10).toBe(true);
  });

  it('resolves every relative link and #anchor', () => {
    const broken = [];
    for (const file of files) {
      for (const link of relativeLinks(file)) {
        const [pathPart, fragment] = link.split('#');
        const target = pathPart ? resolve(dirname(file), pathPart) : file;
        if (!existsSync(target)) {
          broken.push(`${file}: missing ${link}`);
          continue;
        }
        if (fragment && target.endsWith('.md')) {
          if (!headingSlugs(target).has(decodeURIComponent(fragment))) {
            broken.push(`${file}: no heading for ${link}`);
          }
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('links every document listed in the master plan index', () => {
    const index = readText('docs/master-plan/README.md');
    for (const name of [
      'roadmap.md',
      'infrastructure.md',
      'ai-pipeline.md',
      'game-catalog.md',
      'lore/README.md',
      'lore/characters.md',
      'lore/adorability-gate.md',
      'monetization.md',
      'business-model.md',
      'community.md',
      'legal.md',
    ]) {
      expect(index.includes(`](${name})`)).toBe(true);
    }
  });
});

describe('heading slugs', () => {
  it('match GitHub for punctuation, code and links', () => {
    const slugs = headingSlugs('docs/master-plan/infrastructure.md');
    expect(slugs.has('2-game-core-packages')).toBe(true);
    expect(slugs.has('7-experiments-r25-d6')).toBe(true);
  });
});
