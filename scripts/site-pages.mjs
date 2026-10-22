// HTML templates of the master-plan website: the shared layout, game cards,
// the home page and the game explorer. Paths are relative so the site works
// under any GitHub Pages base path and from the file system.
import { FAMILIES, familyTitle } from './game-families.mjs';
import { escapeHtml } from './site-markdown.mjs';

export const REPOSITORY = 'https://github.com/links-games/master-plan';

const NAV = [
  ['index.html', 'Home'],
  ['games.html', 'Choose a game'],
  ['development-plan.html', 'Plan'],
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
</head>
<body>
<header class="top">
<a class="brand" href="${root}index.html">Links Games</a>
<nav aria-label="Main">${NAV.map(([href, label]) => `<a href="${root}${href}">${label}</a>`).join('')}</nav>
</header>
<main${wide ? '' : ' class="doc"'}>
${body}
</main>
<footer>Generated from the <a href="${REPOSITORY}/tree/main/docs/master-plan">master plan</a> by <code>scripts/build-site.mjs</code>${sourceLink}. Art for the Toddlers, Preschool, Raya life and Shacados collections is pending; their pages describe each image instead.</footer>
</body>
</html>
`;
}

export const pagePath = (game) =>
  `concepts/pages/${game.id.toLowerCase()}.html`;

const firstSentence = (text) => (/^.*?[.!?](\s|$)/.exec(text) || [text])[0];

function thumb(game, root) {
  if (game.hasArt) {
    return `<img src="${root}concepts/art/${game.id.toLowerCase()}/thumbnail.webp" alt="" loading="lazy" width="96" height="96">`;
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
<div>
<h3><a href="${root}${pagePath(game)}">${escapeHtml(game.title)}</a></h3>
<p>${escapeHtml(game.id)} · ${escapeHtml(game.genre)}. ${escapeHtml(firstSentence(game.estimate.plan))}</p>
${chips(game)}
</div>
</li>`;
}

// A hand-drawn Raya landscape: untouched hills and forest, the moons Pim and
// Pom, slender white towers and an Orbi sphere companion.
const RAYA_SVG = `<svg viewBox="0 0 1200 420" role="img" aria-label="Raya: forested hills under a pale sky, three slender white towers in the distance, two moons and a white Orbi sphere floating near a child">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d8f0"/><stop offset="1" stop-color="#eaf7f0"/></linearGradient></defs>
<rect width="1200" height="420" fill="url(#sky)"/>
<circle cx="980" cy="80" r="26" fill="#f6f3ea"/><circle cx="1040" cy="110" r="13" fill="#f3d6d4"/>
<path d="M0 260 L160 190 L300 240 L470 170 L640 235 L820 180 L1000 230 L1200 190 V420 H0Z" fill="#b9d3d6"/>
<g fill="#fff" stroke="#c8d8dc" stroke-width="2">
<path d="M318 245 L326 40 L334 245Z"/><ellipse cx="326" cy="120" rx="18" ry="4"/><ellipse cx="326" cy="80" rx="12" ry="3"/>
<path d="M708 236 L714 85 L720 236Z"/><ellipse cx="714" cy="140" rx="13" ry="3"/>
<path d="M1012 232 L1016 125 L1020 232Z"/>
</g>
<path d="M0 300 C200 250 380 290 560 270 C760 248 960 300 1200 262 V420 H0Z" fill="#7fb98f"/>
<path d="M0 350 C240 310 460 345 700 325 C900 308 1060 340 1200 320 V420 H0Z" fill="#4f9a6c"/>
<g fill="#2f7d5b">
<path d="M80 340 l22 -70 l22 70z"/><path d="M120 345 l18 -56 l18 56z"/><path d="M940 330 l24 -76 l24 76z"/><path d="M985 334 l18 -58 l18 58z"/><path d="M1100 328 l20 -64 l20 64z"/>
</g>
<g transform="translate(560 318)"><rect x="-7" y="-46" width="14" height="40" rx="7" fill="#fff" stroke="#9fb3bb"/><circle cy="-56" r="10" fill="#f2d2b6"/></g>
<g transform="translate(600 262)"><circle r="20" fill="#fff" stroke="#9fb3bb" stroke-width="2"/><circle cx="-7" cy="-3" r="3.5" fill="#e2574c"/><circle cx="7" cy="-3" r="3.5" fill="#4a90c8"/><path d="M-6 6 Q0 11 6 6" stroke="#1d2a33" stroke-width="2" fill="none"/></g>
</svg>`;

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
      return `<li><a class="tile" href="concepts/${family}.html"><strong>${escapeHtml(familyTitle(family))}</strong><span>${list.length} games · easiest ${list[0].score.effortDays} days${toddler ? ` · ${toddler} toddler-friendly` : ''}</span></a></li>`;
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
${RAYA_SVG}
<div class="hero-text">
<h1>Links Games master plan</h1>
<p class="lead">${ranked.length} educational game ideas set on Raya, a planet of untouched nature, white towers and Orbi companions, and on Shacados, its rusted, struggling twin. Every idea has a story, a lesson and an estimated plan, so you can choose what to build first.</p>
<div class="buttons"><a class="button" href="games.html">Choose a game</a><a class="button secondary" href="games.html?toddler=4&amp;sort=days">Toddler games first</a><a class="button secondary" href="lore/index.html">Read the lore</a></div>
</div>
</section>
<section>
<div class="section-head"><h2>Start here</h2><a href="games.html">All ${ranked.length} →</a></div>
<p>The lowest start scores: easy to develop and easy to learn to play. Start score = effort days × a factor for how hard the game is for a toddler (<a href="development-plan.html#how-the-scores-work">how the scores work</a>).</p>
${cards(byStart.slice(0, 9), '')}
</section>
<section>
<div class="section-head"><h2>Toddler-first</h2><a href="games.html?toddler=4&amp;sort=days">All ${toddlerFirst.length} →</a></div>
<p>Rated 4–5 for toddlers: a single tap or drag, no reading and no fail state. Easiest to build first.</p>
${cards(toddlerFirst.slice(0, 9), '')}
</section>
<section>
<h2>Collections</h2>
<ul class="tiles">${collectionTiles(ranked)}</ul>
</section>
<section>
<h2>Two worlds</h2>
<div class="worlds">
<div class="world"><h3>Raya</h3><p>Untouched forests, rivers and steppes. Tall, slender white towers carry sound and the telepathy internet, the Chord. People in tight white clothing walk, play or glide on sound. White Orbi spheres copy an apple overnight, lift what is heavy and gently hold a hand that is about to hurt someone. Laws are optional defaults, everyone can stay young and every choice can be switched off.</p><p><a href="lore/raya.html">Raya lore</a> · <a href="lore/first-contact.html">First contact</a></p></div>
<div class="world shacados"><h3>Shacados</h3><p>Rust, dust and junk; coal smoke, oil and gas flares; dying forests and frozen belts. Poor people mend, share and teach under the Holders who own the food and the debts. Its rockets are the least safe ever flown. Its games are about mending, sharing and refusing to do harm.</p><p><a href="lore/shacados.html">Shacados lore</a> · <a href="games.html?collection=sh">Shacados games</a></p></div>
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
  const body = `<h1>Choose a game to build</h1>
<p class="summary-bar">Filter by collection, the age of the player, how easily a toddler learns it and how many days it takes. Sorted by start score: easy to develop and easy to play first. Each card links to the game's story, image descriptions and estimated plan.</p>
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
