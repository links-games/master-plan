// HTML templates of the master-plan website: the shared layout, game cards,
// the home page and the game explorer. Paths are relative so the site works
// under any GitHub Pages base path and from the file system.
import { FAMILIES, familyTitle } from './game-families.mjs';
import { escapeHtml } from './site-markdown.mjs';

export const REPOSITORY = 'https://github.com/links-games/master-plan';

const NAV = [
  ['index.html', 'Home'],
  ['games.html', 'Choose a game'],
  ['worlds.html', 'Explore worlds'],
  ['development-plan.html', 'Build plan'],
  ['lore/index.html', 'Lore'],
  ['lore/stories.html', 'Stories'],
  ['game-ideas.html', 'All ideas'],
];

export function layout({ title, root, body, source, wide = false }) {
  const sourceLink = source
    ? ` · <a href="${REPOSITORY}/blob/main/${escapeHtml(source)}">Source on GitHub</a>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Links Games master plan</title>
<meta name="description" content="Game ideas, lore, stories and the development plan of Links Games: educational games set on the planets Raya and Shacados.">
<link rel="stylesheet" href="${root}assets/site.css">
<link rel="icon" type="image/svg+xml" href="${root}assets/favicon.svg">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="top">
<a class="brand" href="${root}index.html">Links Games</a>
<nav aria-label="Main">${NAV.map(([href, label]) => `<a href="${root}${href}">${label}</a>`).join('')}</nav>
</header>
<main id="main"${wide ? '' : ' class="doc"'}>
${body}
</main>
<footer><a href="${REPOSITORY}/tree/main/docs/master-plan">Links Games master plan</a>${sourceLink}. Original concept art, stories and reproducible environments for worlds worth exploring. Concept proposals for future games.</footer>
</body>
</html>
`;
}

export const pagePath = (game) =>
  `concepts/pages/${game.id.toLowerCase()}.html`;

const firstSentence = (text) => (/^.*?[.!?](\s|$)/.exec(text) || [text])[0];

function thumb(game, root) {
  if (game.hasArt) {
    return `<img src="${root}concepts/art/${game.id.toLowerCase()}/thumbnail.webp" alt="" loading="lazy" width="320" height="320">`;
  }
  return `<span>Art pending · image described on the page</span>`;
}

export function chips(game) {
  const { estimate, score } = game;
  const toddler = estimate.toddler >= 4 ? ' class="good"' : '';
  return `<ul class="chips">
<li>${escapeHtml(familyTitle(game.family))}</li>
<li>Ages ${estimate.minAge}+</li>
<li${toddler}>Toddler ${estimate.toddler}/5</li>
<li>${score.effortDays} days</li>
<li>Risk ${score.risk}/5</li>
<li>Start #${game.startRank}</li>
</ul>`;
}

export function gameCard(game, root) {
  const search = [game.id, game.title, game.genre, game.lesson, game.scene]
    .join(' ')
    .toLowerCase();
  const data = {
    id: game.id,
    family: game.family,
    age: game.estimate.minAge,
    toddler: game.estimate.toddler,
    days: game.score.effortDays,
    start: game.score.startScore,
    art: game.hasArt ? 'images' : 'descriptions',
    search,
  };
  const attributes = Object.entries(data)
    .map(([key, value]) => `data-${key}="${escapeHtml(value)}"`)
    .join(' ');
  return `<li class="card" ${attributes}>
<a class="thumb${game.hasArt ? '' : ` pending ${game.family}`}" href="${root}${pagePath(game)}" tabindex="-1" aria-hidden="true">${thumb(game, root)}</a>
<div class="card-body">
<h3><a href="${root}${pagePath(game)}">${escapeHtml(game.title)}</a></h3>
<p>${escapeHtml(game.id)} · ${escapeHtml(game.genre)}. ${escapeHtml(firstSentence(game.estimate.plan))}</p>
${chips(game)}
</div>
</li>`;
}

const cards = (games, root) =>
  `<ul class="cards">${games.map((game) => gameCard(game, root)).join('\n')}</ul>`;

function collectionTiles(ranked) {
  return Object.keys(FAMILIES)
    .map((family) => {
      const list = ranked.filter((game) => game.family === family);
      if (list.length === 0) {
        return '';
      }
      const toddler = list.filter((game) => game.estimate.toddler >= 4).length;
      return `<li><a class="tile" href="concepts/${family}.html">${thumb(list[0], '')}<strong>${escapeHtml(familyTitle(family))}</strong><span>${list.length} games · easiest ${list[0].score.effortDays} days${toddler ? ` · ${toddler} toddler-friendly` : ''}</span></a></li>`;
    })
    .join('\n');
}

function storyQuotes(ranked) {
  return ['ry', 'td', 'pk', 'sh']
    .map((family) =>
      ranked.find((game) => game.family === family && game.story)
    )
    .filter(Boolean)
    .map(
      (game) => `<blockquote class="story"><p>${escapeHtml(game.story)}</p>
<p><strong>Wisdom:</strong> ${escapeHtml(game.wisdom)} — <a href="${pagePath(game)}">${escapeHtml(game.title)}</a></p></blockquote>`
    )
    .join('\n');
}

export function homePage({ ranked, byStart }) {
  const toddlerFirst = ranked.filter((game) => game.estimate.toddler >= 4);
  const body = `<section class="hero">
<picture class="hero-art"><source media="(min-width: 640px)" srcset="concepts/art/loading/ry-landscape.webp" width="1672" height="941"><img src="concepts/art/loading/ry-portrait.webp" alt="Raya at dawn: an old apple tree, untouched forest and a distant white tower" width="941" height="1672" fetchpriority="high"></picture>
<div class="hero-text">
<p class="eyebrow">Links Games · A universe of possibilities</p>
<h1>Little discoveries.<br>Worlds of wonder.</h1>
<p class="lead">Play, learn and find a place in the story. Explore ${ranked.length} game ideas, from a first tap in a clover meadow to a message between the stars.</p>
<div class="buttons"><a class="button" href="games.html">Find your next game <span aria-hidden="true">↗</span></a><a class="button secondary" href="worlds.html">Explore the worlds</a></div>
<p class="hero-note">16 collections · 3 visual styles for every idea · Made for curiosity</p>
</div>
</section>
<section>
<div class="section-head"><h2>Small beginnings. Big possibilities.</h2><a href="games.html">All ${ranked.length} →</a></div>
<p>The lowest start scores: easy to develop and easy to learn to play. Start score = effort days × a factor for how hard the game is for a toddler (<a href="development-plan.html#how-the-scores-work">how the scores work</a>).</p>
${cards(byStart.slice(0, 6), '')}
</section>
<section>
<div class="section-head"><h2>Toddler-first</h2><a href="games.html?toddler=4&amp;sort=days">All ${toddlerFirst.length} →</a></div>
<p>Rated 4–5 for toddlers: a single tap or drag, no reading and no fail state. Easiest to build first.</p>
${cards(toddlerFirst.slice(0, 3), '')}
</section>
<section>
<h2>Collections</h2>
<ul class="tiles">${collectionTiles(ranked)}</ul>
</section>
<section>
<h2>Two worlds</h2>
<div class="worlds">
<div class="world"><img src="concepts/art/loading/ry-landscape.webp" alt="Raya’s untouched landscape" width="1672" height="941" loading="lazy"><div class="world-copy"><p class="eyebrow">Untouched nature · Gentle defaults</p><h3>Raya</h3><p>Untouched forests, rivers and steppes. Tall, slender white towers carry sound and the telepathy internet, the Chord. People in tight white clothing walk, play or glide on sound. White Orbi spheres copy an apple overnight, lift what is heavy and gently hold a hand that is about to hurt someone. Laws are optional defaults. Each citizen chooses whether their own Guard and Renewal apply to them.</p><p><a href="lore/raya.html">Raya lore</a> · <a href="lore/first-contact.html">First contact</a> · <a href="worlds.html#raya">Explore in 3D</a></p></div></div>
<div class="world shacados"><img src="concepts/art/loading/sh-landscape.webp" alt="Shacados rooftops with one warm light and a living plant" width="1672" height="941" loading="lazy"><div class="world-copy"><p class="eyebrow">Repair, sharing and hope · Ages 10+</p><h3>Shacados</h3><p>Rust, dust and junk; coal smoke, oil and gas flares; dying forests and frozen belts. Poor people mend, share and teach under the Holders who own the food and the debts. Its rockets are the least safe ever flown. Its games are about mending, sharing and refusing to do harm.</p><p><a href="lore/shacados.html">Shacados lore</a> · <a href="games.html?collection=sh">Shacados games</a> · <a href="worlds.html#shacados">Explore in 3D</a></p></div></div>
</div>
</section>
<section>
<div class="section-head"><h2>Stories with wisdom</h2><a href="lore/stories.html">More stories →</a></div>
${storyQuotes(ranked)}
</section>`;
  return layout({ title: 'Home', root: '', body, wide: true });
}

const option = ([value, label]) =>
  `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;

const select = (name, label, options, wide = '') =>
  `<label${wide}>${label}<select name="${name}">${options.map(option).join('')}</select></label>`;

export function explorerPage({ ranked, byStart }) {
  const collections = [
    ['', 'All collections'],
    ...Object.keys(FAMILIES)
      .filter((family) => ranked.some((game) => game.family === family))
      .map((family) => [family, familyTitle(family)]),
  ];
  const body = `<div class="page-intro"><p class="eyebrow">The game collection</p><h1>Follow your curiosity.</h1>
<p class="summary-bar">Filter by collection, the age of the player, how easily a toddler learns it and how many days it takes. Sorted by start score: easy to develop and easy to play first. Each card opens the art styles, the learning goal and a practical prototype plan.</p></div>
<form id="filters" class="filters"><details open><summary>Filters</summary>
<div class="filter-grid">
<label class="wide">Search<input type="search" name="q" placeholder="Title, mechanic or lesson"></label>
${select('collection', 'Collection', collections)}
${select('age', 'Player age', [
  ['', 'Any age'],
  ['1', '1 year'],
  ['2', '2 years'],
  ['3', '3 years'],
  ['4', '4 years'],
  ['5', '5 years'],
  ['6', '6 years'],
  ['8', '8 years'],
  ['10', '10 years'],
  ['13', '13 years'],
])}
${select('toddler', 'Toddler rating', [
  ['', 'Any'],
  ['3', '3 or more'],
  ['4', '4 or more'],
  ['5', '5 only'],
])}
${select('days', 'Effort', [
  ['', 'Any'],
  ['20', '≤ 20 days'],
  ['30', '≤ 30 days'],
  ['45', '≤ 45 days'],
  ['60', '≤ 60 days'],
  ['90', '≤ 90 days'],
])}
${select('art', 'Art', [
  ['', 'Any'],
  ['images', 'Concept images'],
  ['descriptions', 'Descriptions only'],
])}
${select('sort', 'Sort by', [
  ['start', 'Start score'],
  ['days', 'Effort days'],
  ['toddler', 'Toddler rating'],
  ['age', 'Youngest age'],
  ['id', 'ID'],
])}
</div></details></form>
<p id="count" class="count" aria-live="polite">${ranked.length} games</p>
<ul id="games" class="cards">${byStart.map((game) => gameCard(game, '')).join('\n')}</ul>
<script src="assets/explorer.js" defer></script>`;
  return layout({ title: 'Choose a game', root: '', body, wide: true });
}
