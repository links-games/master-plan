#!/usr/bin/env node

// Deterministic documentation builder. Image generation is a separate, explicit
// tool operation; this script never requests images or substitutes placeholders.
// Collections whose art is pending get pages with image descriptions instead.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  DIRECTIONS as directions,
  loadingScreenJobs,
  extraStyleDirections,
  styleVariationJobs,
  promptFor,
  viewText,
} from './concept-prompts.mjs';
import {
  CONCEPTS_DIR as base,
  FAMILIES as families,
  STORY_FAMILIES,
  readCatalog,
  hasArt,
  hasArtViews,
} from './game-families.mjs';
import { loadGames } from './game-estimates.mjs';
import { rankGames } from './build-development-plan.mjs';

const LORE_CHECKS = {
  td: 'Follow the [toddler design rules](../../../case-studies/issue-1/data/research-raya-shacados.md#7-toddlers-and-screens-r68-r69): tap before drag, no reading, no failure, co-play under age 2.',
  pk: 'Follow the [toddler design rules](../../../case-studies/issue-1/data/research-raya-shacados.md#7-toddlers-and-screens-r68-r69) and keep every instruction voiced; reading is never required.',
  ry: 'Check every detail against the [Raya canon](../../lore/raya.md): untouched nature, white towers and clothing, Orbis, the Guard and the Gentle Defaults.',
  sh: 'Follow the age and tone rules of [Shacados](../../lore/shacados.md): dark but never hopeless, people never villains, the player never harms anyone.',
};

function technology(game) {
  const cx = Number(game.cx[0]);
  if (cx <= 2) {
    return 'React + SVG/DOM; deterministic state, undo and seeded levels. Start with one local screen and touch plus keyboard input.';
  }
  if (cx <= 4) {
    return 'React shell + PixiJS; use the shared simulation adapter only where motion or agent behavior requires it. Start with one bounded scene and measured frame time.';
  }
  return 'React shell + three.js/R3F and a validated simulation adapter. Begin with a small 2D reference model before a 3D vertical slice; use measured device tiers.';
}

function imagesSection(game, family) {
  const id = game.id.toLowerCase();
  if (!hasArt(game.id)) {
    const views = directions
      .map(([key, label]) => `### ${label}\n\n${viewText(game, key)}\n`)
      .join('\n');
    return `## Four image descriptions (art pending)

Images for this idea have not been generated yet. Each description below is
the brief for one view; the full generation prompts are in
[\`jobs/${family}.json\`](../jobs/${family}.json) under the IDs
\`${id}/01-gameplay\` to \`${id}/04-discovery\`, ready for the
[image-generation pass](../README.md#image-generation-and-provenance).

${views}`;
  }
  const alternatives = extraStyleDirections(game, family);
  const visible = hasArtViews(
    id,
    alternatives.map(([key]) => key)
  )
    ? alternatives
    : [];
  const renderImages = (views) =>
    views
      .map(
        ([key, label]) =>
          `### ${label}\n\n${game.views ? `${viewText(game, key)}\n\n` : ''}![${game.title}: ${label.toLowerCase()} concept](../art/${id}/${key}.webp)\n`
      )
      .join('\n');
  return `## Four visual directions

These are independently generated concept proposals for selecting a prototype.
The four views compare gameplay readability, world appeal, tactile identity and
room to grow.${visible.length ? ' Two additional core-screen alternatives make the flat storybook and painted anime styles explicit alongside the tactile 3D study.' : ''} They are not screenshots of an implemented game. Native image
dimensions, hashes, exact prompts and generation provenance are recorded in the
[art manifest](../art/${id}/manifest.json); see the [generation notes](../README.md#image-generation-and-provenance).

The [core prompts](../jobs/${family}.json) use IDs \`${id}/01-gameplay\` to \`${id}/04-discovery\`.${visible.length ? ' Additional [style prompts](../jobs/style-variations.json) match the two alternatives below.' : ''}

${renderImages(directions)}${visible.length ? `\n## Additional style alternatives\n\n${renderImages(visible)}` : ''}`;
}

function storySection(game) {
  if (!game.story) {
    return '';
  }
  return `## Story

${game.story}

> **Wisdom:** ${game.wisdom}

`;
}

const ASSET_LABELS = {
  sprites: 'sprites',
  animations: 'animations',
  backgrounds: 'backgrounds',
  ui: 'UI screens',
  sfx: 'sound effects',
  music: 'music tracks',
  voice: 'voice lines',
  levels: 'authored levels',
  content: 'content items',
  models3d: '3D models',
};

function estimateSection(ranked, library) {
  if (!ranked) {
    return '';
  }
  const { estimate: e, score } = ranked;
  const algorithms = new Map(library.algorithms.map((a) => [a.id, a]));
  const assets = library.assets
    .filter((asset) => e.assets[asset.id])
    .map((asset) => {
      const count = e.assets[asset.id];
      const label = ASSET_LABELS[asset.id];
      return `${count} ${count === 1 ? label.replace(/s$/, '') : label}`;
    })
    .join(', ');
  const used = e.algorithms
    .map(
      (id) =>
        `\`${id}\` (${algorithms.get(id).name}, ${algorithms.get(id).loc} LOC)`
    )
    .join(' · ');
  return `## Estimated plan

**First playable version:** ${e.plan}

| Measure | Estimate |
| --- | --- |
| Youngest age | ${e.minAge}+ |
| Toddler learnability | ${e.toddler} of 5 — ${library.toddlerRubric[e.toddler]} |
| Code | ${score.loc} LOC, ${score.codeDays} days |
| Assets | ${score.assetHours} hours, ${score.assetDays} days |
| Effort | ${score.effortDays} days, risk ${score.risk} of 5 |
| Start score | ${score.startScore} (rank ${ranked.startRank} of ${ranked.total}; lower is better) |

**Algorithms:** ${used}

**Assets:** ${assets || 'none beyond the shared platform'}

How the numbers are computed: [development plan](../../development-plan.md#how-the-scores-work).

`;
}

function header(game, family) {
  const origin = game.original
    ? 'Original catalog'
    : game.expansion === 'issue-3'
      ? 'Research catalog'
      : STORY_FAMILIES.has(family)
        ? 'Raya story catalog'
        : 'Extended catalog';
  const parts = [
    game.id,
    `[${families[family][0]}](../${family}.md)`,
    `Cx ${game.cx}`,
    game.wave,
    game.ages ? `Ages ${game.ages}` : null,
    origin,
  ];
  return parts.filter(Boolean).join(' · ');
}

function pageFor(game, family, neighbors, context) {
  const [previous, next] = neighbors;
  const cx = Number(game.cx[0]);
  const toddler = family === 'td';
  const loreCheck = LORE_CHECKS[family] ? `\n- ${LORE_CHECKS[family]}` : '';
  return `# ${game.title}

${header(game, family)}

**The idea:** ${game.scene}

| Decision | Proposal |
| --- | --- |
| Familiar mechanic | ${game.genre} |
| Learning objective | ${game.lesson} |
| First prototype | ${toddler ? 'One sensory toy or guided interaction with a large tap target, immediate gentle feedback and unlimited repetition. Introduce dragging only after an accessible tap alternative. No score or fail state; invite caregiver co-play under age 2.' : 'One authored challenge built around the interaction above, with a clear goal, immediate feedback, restart and unlimited retries.'} |
| Technology | ${technology(game)} |
| Scope boundary | ${cx <= 2 ? 'One board and one rule set; defer accounts, multiplayer, procedural content and platform SDKs.' : 'One bounded scenario and one core system; defer a full campaign, network play and production-scale content.'} |
| Reuse | Shared input, saves, accessibility, seeded state and the ${families[family][0].toLowerCase()} collection shell. |
| Prototype acceptance | ${toddler ? 'During caregiver co-play, the child can explore one clear interaction and repeat it willingly. Observe recognition or purposeful action; require no reading or spoken explanation. Check large touch targets and a keyboard-accessible caregiver alternative at narrow and wide sizes.' : 'A player can identify the next action from the screen, complete one challenge, explain the practiced idea and restart without help. Check touch and keyboard play at narrow and wide sizes.'} |
| Main uncertainty | ${cx >= 4 ? 'Simulation accuracy and device cost need measured evidence before extending the scenario.' : 'Test whether the lesson follows from play and whether the first interaction is understandable without reading.'} |

${estimateSection(context.ranked.get(game.id), context.library)}${storySection(game)}${imagesSection(game, family)}
## Design checks before prototyping

- Learning target: **${game.lesson}**. Ask a domain reviewer to validate factual content in the mechanic.
- Keep goals cooperative or self-directed, using resources and needs. Avoid purchasable power. No pressure timers in the accessible mode.
- Use original layouts and character designs; the [legal checklist](../../legal.md) applies even when a mechanic is familiar.
- Choose the minimum [fidelity level](../../simulation-engine.md#determinism-and-fidelity-levels) the lesson needs; concept art does not establish scientific accuracy.
- Review silhouettes, text alternatives, reduced motion and non-color cues against the [adorability gate](../../lore/adorability-gate.md).${loreCheck}

Genre context: [existing genre research](../../../case-studies/issue-1/data/research-genres-ideas.md)
and [expansion research](../../../case-studies/issue-1/data/research-visual-catalog.md).

${previous ? `[← ${previous.title}](${previous.id.toLowerCase()}.md) · ` : ''}[All concepts](../README.md)${next ? ` · [${next.title} →](${next.id.toLowerCase()}.md)` : ''}
`;
}

function familyPage(family, games, ranked) {
  const pending = games.some((game) => !hasArt(game.id));
  const score = (game) => {
    const entry = ranked.get(game.id);
    return entry
      ? [entry.score.effortDays, entry.estimate.toddler]
      : ['—', '—'];
  };
  const rows = games.map((game) => {
    const id = game.id.toLowerCase();
    const [days, toddler] = score(game);
    const idea = `[${game.title}](pages/${id}.md) (${game.id})`;
    return pending
      ? `| ${idea} | ${game.genre} | ${game.ages} | ${game.cx} | ${days} | ${toddler} |`
      : `| [![${game.title} gameplay thumbnail](art/${id}/thumbnail.webp)](pages/${id}.md) | ${idea} | ${game.genre} | ${game.cx} | ${days} | ${toddler} |`;
  });
  const intro = pending
    ? `[All collections](README.md) · ${games.length} ideas · art pending: every page carries four image descriptions, and the prompts are in [\`jobs/${family}.json\`](jobs/${family}.json).`
    : `[All collections](README.md) · ${games.length} ideas · four full-resolution core views per idea${games.some((game) => extraStyleDirections(game, family).length) ? ', with flat storybook and painted anime alternatives on the original illustrated games' : ''}.`;
  const head = pending
    ? '| Idea | Mechanic | Ages | Cx | Days | Toddler |\n| --- | --- | --- | --- | --- | --- |'
    : '| Gameplay preview | Idea | Mechanic | Cx | Days | Toddler |\n| --- | --- | --- | --- | --- | --- |';
  return `# ${families[family][0]} — ${pending ? 'concepts' : 'visual concepts'}\n\n${intro}\n\nOpen a game page to compare the four views, the learning objective, the prototype scope and the estimated plan. Cx follows the [complexity ladder](../game-ideas.md#complexity-ladder); days and the toddler learnability rating (1–5) come from the [development plan](../development-plan.md).\n\n${head}\n${rows.join('\n')}\n`;
}

function rankingContext() {
  const data = loadGames();
  const complete = {
    ...data,
    games: data.games.filter((game) => game.estimate),
  };
  const ranked = rankGames(complete);
  const byStart = [...ranked].sort(
    (a, b) =>
      a.score.startScore - b.score.startScore || a.id.localeCompare(b.id)
  );
  byStart.forEach((game, index) => {
    game.startRank = index + 1;
    game.total = byStart.length;
  });
  return {
    library: data.library,
    ranked: new Map(ranked.map((game) => [game.id, game])),
  };
}

function replaceIdeaRows(ideaLines, family, games) {
  const rowPattern = new RegExp(`^\\| ${family.toUpperCase()}-\\d+`);
  const rowIndexes = ideaLines.flatMap((line, index) =>
    rowPattern.test(line) ? [index] : []
  );
  if (!rowIndexes.length) {
    throw new Error(`Missing idea table for ${family}`);
  }
  const ideaRows = games.map(
    (game) =>
      `| ${game.id} | [${game.title}](concepts/pages/${game.id.toLowerCase()}.md)${game.wave ? ` **${game.wave}**` : ''} | ${game.genre} | ${game.lesson} | ${game.cx} |`
  );
  ideaLines.splice(
    rowIndexes[0],
    rowIndexes.at(-1) - rowIndexes[0] + 1,
    ...ideaRows
  );
}

mkdirSync(join(base, 'pages'), { recursive: true });
mkdirSync(join(base, 'jobs'), { recursive: true });
const context = rankingContext();
const all = [];
const ideaLines = readFileSync('docs/master-plan/game-ideas.md', 'utf8').split(
  '\n'
);
for (const family of Object.keys(families)) {
  const games = readCatalog(family);
  if (!games.length) {
    continue;
  }
  all.push(...games);
  replaceIdeaRows(ideaLines, family, games);
  const jobs = [];
  for (const [index, game] of games.entries()) {
    writeFileSync(
      join(base, 'pages', `${game.id.toLowerCase()}.md`),
      pageFor(game, family, [games[index - 1], games[index + 1]], context)
    );
    for (const direction of directions) {
      jobs.push({
        id: `${game.id.toLowerCase()}/${direction[0]}`,
        gameId: game.id,
        direction: direction[1],
        prompt: promptFor(game, family, direction),
      });
    }
  }
  writeFileSync(
    join(base, 'jobs', `${family}.json`),
    `${JSON.stringify(jobs, null, 2)}\n`
  );
  writeFileSync(
    join(base, `${family}.md`),
    familyPage(family, games, context.ranked)
  );
}
const styles = styleVariationJobs();
writeFileSync(
  join(base, 'jobs', 'style-variations.json'),
  `${JSON.stringify(styles, null, 2)}\n`
);
const loading = loadingScreenJobs();
writeFileSync(
  join(base, 'jobs', 'loading-screens.json'),
  `${JSON.stringify(loading, null, 2)}\n`
);
writeFileSync('docs/master-plan/game-ideas.md', ideaLines.join('\n'));
console.log(
  `Built ${all.length} pages, ${all.length * directions.length} core image prompts, ${styles.length} additional style prompts and ${loading.length} loading-screen prompts.`
);
