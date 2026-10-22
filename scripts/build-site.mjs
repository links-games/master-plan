#!/usr/bin/env node

// Builds the static, mobile-first master-plan website (requirements R71 and
// R72) from docs/master-plan into _site/:
//   node scripts/build-site.mjs                 # full site with concept art
//   node scripts/build-site.mjs --no-art        # skip copying the art
//   node scripts/build-site.mjs --out dir       # another output directory
// The Example app workflow publishes it to GitHub Pages, with the example
// app under example-app/.
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { pathToFileURL } from 'node:url';
import { rankGames } from './build-development-plan.mjs';
import { hasArt } from './game-families.mjs';
import { loadGames } from './game-estimates.mjs';
import { renderMarkdown } from './site-markdown.mjs';
import {
  REPOSITORY,
  chips,
  explorerPage,
  homePage,
  layout,
} from './site-pages.mjs';

const DOCS = 'docs/master-plan';
const EXCLUDED = ['templates/'];
const IMAGE = /\.(webp|png|jpe?g|svg|gif)$/i;

// Doc keys always use "/" so the concept-page and link rules match on
// Windows too, where path.relative would return backslashes.
function markdownFiles(dir = DOCS) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = posix.join(dir, entry.name);
    if (entry.isDirectory()) {
      return markdownFiles(path);
    }
    return entry.name.endsWith('.md') ? [posix.relative(DOCS, path)] : [];
  });
}

const included = (rel) =>
  rel.endsWith('.md') && !EXCLUDED.some((prefix) => rel.startsWith(prefix));

// docs/master-plan/<rel>.md → site path. The plan README becomes
// overview.html because index.html is the generated home page.
export function sitePath(rel) {
  if (rel === 'README.md') {
    return 'overview.html';
  }
  return rel
    .replace(/(^|\/)README\.md$/, '$1index.html')
    .replace(/\.md$/, '.html');
}

const depthPrefix = (path) => '../'.repeat(path.split('/').length - 1);

// Rewrites a link found in docs/master-plan/<fromRel> for the site.
export function siteLink(fromRel, href) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#')) {
    return href;
  }
  const [path, hash] = href.split('#');
  const target = posix.normalize(
    posix.join(posix.dirname(`${DOCS}/${fromRel}`), path)
  );
  const anchor = hash ? `#${hash}` : '';
  const inDocs = target.startsWith(`${DOCS}/`);
  const rel = target.slice(DOCS.length + 1);
  const from = sitePath(fromRel);
  if (inDocs && included(rel)) {
    return posix.relative(posix.dirname(from), sitePath(rel)) + anchor;
  }
  if (inDocs && IMAGE.test(rel)) {
    return posix.relative(posix.dirname(from), rel);
  }
  return `${REPOSITORY}/blob/main/${target}${anchor}`;
}

function rankedGames() {
  const data = loadGames();
  data.games = data.games.filter((game) => game.estimate);
  const ranked = rankGames(data).map((game) => ({
    ...game,
    hasArt: hasArt(game.id),
  }));
  const byStart = [...ranked].sort(
    (a, b) =>
      a.score.startScore - b.score.startScore || a.id.localeCompare(b.id)
  );
  byStart.forEach((game, index) => {
    game.startRank = index + 1;
  });
  return { ranked, byStart };
}

function write(out, path, html) {
  mkdirSync(dirname(join(out, path)), { recursive: true });
  writeFileSync(join(out, path), html);
}

function renderDoc(rel, games) {
  const { html, title } = renderMarkdown(
    readFileSync(join(DOCS, rel), 'utf8'),
    {
      link: (href) => siteLink(rel, href),
    }
  );
  const match = /^concepts\/pages\/([a-z]+-\d+)\.md$/.exec(rel);
  const game = match && games.get(match[1].toUpperCase());
  const summary = game
    ? `<p class="summary-bar">Start rank <strong>#${game.startRank}</strong> of ${games.size}: easy to develop and easy to play first.</p>${chips(game)}`
    : '';
  const path = sitePath(rel);
  const body = summary ? html.replace(/<\/h1>/, `</h1>\n${summary}`) : html;
  return [
    path,
    layout({ title, root: depthPrefix(path), body, source: `${DOCS}/${rel}` }),
  ];
}

export function buildSite({ out = '_site', copyArt = true } = {}) {
  rmSync(out, { recursive: true, force: true });
  mkdirSync(join(out, 'assets'), { recursive: true });
  for (const file of ['site.css', 'explorer.js']) {
    copyFileSync(join('site', file), join(out, 'assets', file));
  }
  writeFileSync(join(out, '.nojekyll'), '');
  const context = rankedGames();
  const games = new Map(context.ranked.map((game) => [game.id, game]));
  const docs = markdownFiles().filter(included);
  for (const rel of docs) {
    write(out, ...renderDoc(rel, games));
  }
  write(out, 'index.html', homePage(context));
  write(out, 'games.html', explorerPage(context));
  if (copyArt) {
    cpSync(join(DOCS, 'concepts', 'art'), join(out, 'concepts', 'art'), {
      recursive: true,
      filter: (source) => !source.endsWith('manifest.json'),
    });
  }
  return { pages: docs.length + 2, games: games.size };
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const args = process.argv.slice(2);
  const outIndex = args.indexOf('--out');
  const out = outIndex >= 0 ? args[outIndex + 1] : '_site';
  const result = buildSite({ out, copyArt: !args.includes('--no-art') });
  console.log(
    `Built ${result.pages} pages for ${result.games} games in ${out}/.`
  );
}
