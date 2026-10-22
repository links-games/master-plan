import { describe, it, expect } from 'test-anywhere';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, posix } from 'node:path';
import { buildSite, siteLink, sitePath } from '../scripts/build-site.mjs';
import { createSlugger, renderMarkdown } from '../scripts/site-markdown.mjs';

const out = mkdtempSync(join(tmpdir(), 'master-plan-site-'));
const result = buildSite({ out, copyArt: false });
const htmlFiles = (dir, prefix = '') =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? htmlFiles(join(dir, entry.name), `${prefix}${entry.name}/`)
      : entry.name.endsWith('.html')
        ? [`${prefix}${entry.name}`]
        : []
  );
const pages = htmlFiles(out);
const read = (path) => readFileSync(join(out, path), 'utf8');
const ids = (html) =>
  new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const decode = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

describe('markdown renderer', () => {
  it('renders headings with GitHub anchors, lists, tables and inline marks', () => {
    const { html, title } = renderMarkdown(
      [
        '# Raya — *home*',
        '',
        'A **bold** [link](a.md#x) and `code`.',
        '',
        '- one',
        '  - nested',
        '1. first',
        '',
        '| A | B |',
        '| - | - |',
        '| 1 | 2 |',
        '',
        '> **Wisdom:** Gentle hands.',
      ].join('\n'),
      { link: (href) => href.replace('.md', '.html') }
    );
    expect(title).toBe('Raya — home');
    expect(html).toContain('<h1 id="raya--home">');
    expect(html).toContain('<a href="a.html#x">link</a>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<code>code</code>');
    expect(html).toContain('<ul><li>one<ul><li>nested</li></ul></li></ul>');
    expect(html).toContain('<ol><li>first</li></ol>');
    expect(html).toContain('<td>2</td>');
    expect(html).toContain(
      '<blockquote><p><strong>Wisdom:</strong> Gentle hands.</p></blockquote>'
    );
  });

  it('escapes HTML and numbers duplicate anchors like GitHub', () => {
    expect(renderMarkdown('<script>x</script>').html).toBe(
      '<p>&lt;script&gt;x&lt;/script&gt;</p>'
    );
    const slug = createSlugger();
    expect([slug('Story'), slug('Story'), slug('R55–R76 (`x`)')]).toEqual([
      'story',
      'story-1',
      'r55r76-x',
    ]);
  });
});

describe('master-plan website (R71, R72)', () => {
  it('maps docs to site pages and keeps outside links on GitHub', () => {
    expect(sitePath('README.md')).toBe('overview.html');
    expect(sitePath('lore/README.md')).toBe('lore/index.html');
    expect(siteLink('lore/raya.md', 'stories.md#raya-scenes')).toBe(
      'stories.html#raya-scenes'
    );
    expect(
      siteLink('concepts/pages/pz-01.md', '../art/pz-01/01-gameplay.webp')
    ).toBe('../art/pz-01/01-gameplay.webp');
    expect(siteLink('README.md', '../../package.json')).toBe(
      'https://github.com/links-games/master-plan/blob/main/package.json'
    );
  });

  it('renders every idea, the lore, the stories and the plan', () => {
    expect(result.games).toBe(300);
    for (const page of [
      'index.html',
      'games.html',
      'development-plan.html',
      'game-ideas.html',
      'lore/index.html',
      'lore/raya.html',
      'lore/shacados.html',
      'lore/stories.html',
      'lore/scenery-pilots.html',
      'concepts/index.html',
      'concepts/pages/td-01.html',
      'concepts/pages/sh-16.html',
    ]) {
      expect(pages.includes(page)).toBe(true);
    }
    expect(pages.length).toBe(result.pages);
    expect((read('games.html').match(/<li class="card"/g) || []).length).toBe(
      300
    );
  });

  it('is mobile-first on every page', () => {
    for (const page of pages) {
      const html = read(page);
      expect(html).toContain(
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
      );
      expect(html).toContain('assets/site.css');
    }
    const css = readFileSync('site/site.css', 'utf8');
    expect(css).toContain('@media (min-width: 640px)');
    expect(css).not.toContain('max-width: 640px)');
  });

  it('has no broken relative links or anchors', () => {
    const anchors = new Map(pages.map((page) => [page, ids(read(page))]));
    const broken = [];
    for (const page of pages) {
      for (const [, attr, raw] of read(page).matchAll(
        /\s(href|src)="([^"]+)"/g
      )) {
        const href = decode(raw);
        if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
          continue;
        }
        const [path, hash] = href.replace(/\?[^#]*/, '').split('#');
        const target = path
          ? posix.normalize(posix.join(posix.dirname(page), path))
          : page;
        // Concept art is copied from the docs at build time.
        const file = target.startsWith('concepts/art/')
          ? join('docs/master-plan', target)
          : join(out, target);
        if (!existsSync(file)) {
          broken.push(`${page}: ${attr} ${href}`);
        } else if (
          hash &&
          target.endsWith('.html') &&
          !anchors.get(target).has(hash)
        ) {
          broken.push(`${page}: missing anchor ${href}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('is built and published by the Pages workflow', () => {
    const workflow = readFileSync('.github/workflows/example-app.yml', 'utf8');
    expect(workflow).toContain('node scripts/build-site.mjs --out _site');
    expect(workflow).toContain('path: _site');
    expect(workflow).toContain("- 'docs/master-plan/**'");
  });
});

process.on('exit', () => rmSync(out, { recursive: true, force: true }));
