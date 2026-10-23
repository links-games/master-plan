// Idempotent catalog expansion; sources and scope are documented in the case study.
import { readFileSync, writeFileSync } from 'node:fs';
const additions = [
  [
    'bc',
    'BC-20',
    'Sum Garden',
    'Domino placement with regional constraints',
    'Addition, inequalities, constraint propagation',
    '2',
    7,
    ['grid-board', 'puzzle-solver-hints', 'arithmetic-gen'],
    'Place two-ended seed tiles into garden beds whose carved stone signs show a target dot count or a same-number rule; shaped borders distinguish each region independently of color.',
    'One authored eight-tile board, three region rules and visible running sums; allow rotation, undo and a spoken explanation of each satisfied rule.',
  ],
  [
    'wl',
    'WL-20',
    'Perimeter Words',
    'Word chaining with alternating border groups',
    'Spelling, word planning, letter coverage',
    '2',
    8,
    ['word-list', 'word-search-gen', 'graph-network'],
    'Connect letter pebbles around a triangular pond, alternating banks as each new word begins with the last letter of the previous word; used letters bloom into flowers.',
    'One nine-letter triangular board with a curated vocabulary and a verified solution chain; optional audio, undo and no timer, with bank shapes as well as colors.',
  ],
  [
    'wl',
    'WL-19',
    'Theme Trails',
    'Themed adjacent-letter word paths',
    'Vocabulary, semantic categories, spelling',
    '2',
    7,
    ['word-search-gen', 'word-list', 'draw-trace'],
    'Trace a continuous path through adjacent letter stones to spell the names of wetland animals, leaving a glowing reed trail across a board in a quiet garden.',
    'One 6x6 authored letter board with five wetland words, optional spoken clues and undo; teach adjacency and vocabulary without a timer.',
  ],
  [
    'ss',
    'SS-21',
    'Riverline Transit',
    'Transit-network drawing and capacity planning',
    'Graph connectivity, queues, sustainable transport',
    '3',
    8,
    ['graph-network', 'pathfinding', 'agent-steering'],
    // eslint-disable-next-line local/no-changelog-comments -- Describes the game rule.
    'Connect colored passenger markers at river landings with looping boat routes on a readable map; a crowded landing asks for one extra ferry instead of punishing the player.',
    'One river map with six landings, two ferry loops and visible capacity; allow pause and compare passenger waiting time before and after a route edit.',
  ],
  [
    'bc',
    'BC-19',
    'Probability Orchard',
    'Poker-hand roguelite without gambling',
    'Combinatorics, probability, expected outcomes',
    '3',
    10,
    ['card-rules', 'shuffle-deal', 'arithmetic-gen'],
    'Arrange illustrated fruit cards into pairs and runs on a wooden research table; transparent probability beads show how many unseen cards could complete the chosen botanical collection.',
    'One 20-card fruit deck, three rounds and four rule modifiers; show exact draw chances, no money, wagering, purchasable cards or gambling imagery.',
  ],
  [
    'sa',
    'SA-16',
    'Where on Raya?',
    'Scenery-based geographic deduction',
    'Geography, evidence, uncertainty',
    '2',
    8,
    ['map-geo', 'camera-photo', 'puzzle-solver-hints'],
    'Compare a panorama of a glacial valley with a habitat map, a sun-shadow compass and plant samples; place a pin near the white tower that best fits the environmental clues.',
    'Six original authored panoramas of Raya with a fictional biome map; explain each clue after choosing, no real location tracking or external street imagery.',
  ],
  [
    'sa',
    'SA-17',
    'Lantern Seekers',
    'Cooperative hide-and-seek and prop search',
    'Observation, perspective, consent',
    '3',
    6,
    ['hidden-object', 'pathfinding', 'quest-state'],
    'A smiling Orbi peeks from behind a leaf-shaped lantern in a white lattice reading nest; friends follow sound rings and invite it out with an open hand.',
    'One small nest with six opt-in hiding places, adjustable audio clues and a practice seeker; no elimination, scares or chasing children.',
  ],
  [
    'sm',
    'SM-18',
    'Meadow Outlines',
    'Territory enclosure by drawing loops',
    'Area, perimeter, spatial planning',
    '2',
    6,
    ['draw-trace', 'flood-fill', 'grid-board'],
    'Draw a closed ribbon loop across a virtual meadow grid to mark a wildlife survey area; the enclosed flowers light up while a side strip compares boundary length with counted squares.',
    "One 12x12 survey board, five loop challenges and undo; compare equal perimeters and different areas, no enemies or loss of another player's territory.",
  ],
  [
    'nc',
    'NC-18',
    'Tidepool Sizes',
    'Growth-and-navigation arcade',
    'Scale, food webs, conservation',
    '3',
    6,
    ['agent-steering', 'ecosystem-sim', 'physics-2d'],
    'Guide a translucent round microbe through a magnified tidepool, gathering floating nutrient beads while larger organisms pass peacefully; a scale bar compares its changing diameter.',
    'One microscopic water droplet with inert nutrients and three organism sizes; mass is conserved and other organisms remain unharmed, no online arena or predation.',
  ],
  [
    'bd',
    'BD-15',
    'Repair Runway',
    'Themed outfit design and cooperative showcase',
    'Materials, reuse, weather suitability',
    '2',
    6,
    ['dress-up-layers', 'sort-classify', 'quest-state'],
    'Choose repaired white lattice suit layers and small accent panels for a rainy forest walk; two friends compare fabric swatches under droplets before a friendly show in a tree-crown nest.',
    'One host, twelve reusable garment panels and three weather briefs; explain each material choice, no body ratings, public chat, beauty rankings or paid advantages.',
  ],
];
for (const [
  family,
  id,
  title,
  genre,
  lesson,
  cx,
  age,
  algorithms,
  scene,
  plan,
] of additions) {
  const base = 'docs/master-plan/concepts';
  const path = `${base}/catalog/${family}.json`;
  const data = JSON.parse(readFileSync(path));
  const existing = data.find((g) => g.id === id);
  if (existing) {
    if (existing.title !== title) {
      throw new Error(`ID collision: ${id}`);
    }
    continue;
  }
  data.push({
    id,
    title,
    genre,
    lesson,
    cx,
    wave: null,
    original: false,
    ages: `${age}+`,
    scene,
    expansion: 'issue-3',
  });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
  const ep = `${base}/estimates/${family}.json`;
  const estimates = JSON.parse(readFileSync(ep));
  estimates.push({
    id,
    algorithms,
    extraLoc: 450,
    assets: {
      sprites: 24,
      animations: 5,
      backgrounds: 3,
      ui: 4,
      sfx: 8,
      music: 1,
      voice: 12,
      levels: 6,
      content: 24,
      models3d: 0,
    },
    toddler: 1,
    minAge: age,
    plan,
  });
  writeFileSync(ep, `${JSON.stringify(estimates, null, 2)}\n`);
}
