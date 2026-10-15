#!/usr/bin/env node

// Deterministic documentation builder. Image generation is a separate, explicit
// tool operation; this script never requests images or substitutes placeholders.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const base = 'docs/master-plan/concepts';
const families = {
  pz: ['Puzzles', 'a tactile botanical puzzle garden'],
  wl: ['Words and languages', 'a cozy library village and word garden'],
  ml: ['Math and logic', 'an inviting mathematical discovery garden'],
  bc: ['Board and card games', 'a friendly woodland board-game club'],
  sl: ['Science lab', 'a bright, safe, hands-on science workshop'],
  nc: ['Nature and care', 'an ecologically rich garden community'],
  bd: ['Build and create', 'a sunlit community makerspace'],
  mr: ['Music and rhythm', 'a musical garden with acoustic instruments'],
  sm: ['Sports and motion', 'an accessible outdoor movement park'],
  sp: ['Space and physics', 'a peaceful space research academy'],
  sa: ['Stories and adventures', 'a warm, mysterious storybook world'],
  ss: ['Strategy and simulation', 'a cooperative resource-sharing settlement'],
};

const directions = [
  [
    '01-gameplay',
    'Gameplay',
    'Show the playable board or interaction from a readable overhead or side camera. Use crisp 2D shapes and an inviting hand-painted finish. The mechanic is the hero; keep environmental detail at the edges.',
  ],
  [
    '02-world',
    'World',
    'Show a wide establishing key visual of the game world, with the specific gameplay interaction visible in the foreground. Use cinematic anime-inspired environmental painting, layered depth and thoughtful lighting.',
  ],
  [
    '03-details',
    'Characters and materials',
    'Show a close-up concept of the specific game objects and a friendly Links character interacting with them. Use a tactile, beautifully lit stylized 3D diorama, physically plausible materials and clear silhouettes.',
  ],
  [
    '04-discovery',
    'Expanded play',
    'Show a later, richer playable scenario that develops this exact mechanic and makes its learning objective visible through the objects. Use polished illustrated game art and a different camera and atmosphere from the other views.',
  ],
];

function promptFor(game, family, direction) {
  return `Use case: stylized-concept
Asset type: standalone high-resolution concept art for an original educational mobile-first game. Request 2048x2048 pixels or the highest native resolution available.
Game: ${game.title} (${game.id}). Genre/mechanic: ${game.genre}.
Primary scene and action: ${game.scene}
Learning objective expressed by the actual interaction: ${game.lesson}.
${game.artConstraint ? `Visual constraint: ${game.artConstraint}\n` : ''}World: ${families[family][1]}, in the shared Links universe.
Art direction: ${direction[1]}. ${direction[2]}
Identity: adorable, intelligent and welcoming for children and adults. An original tiny Links guide may appear: a soft round creature with a coral-red left eye, sky-blue right eye and gentle curved smile. Keep the main mechanic unmistakable.
Constraints: one complete standalone image, no collage, no contact sheet, no inset panels. Original characters, compositions, boards and objects; do not copy existing games' art or trade dress. No violence, weapons, money, shop, advertising, logos, watermarks, or written title. Use pattern and shape as well as color. Educational visuals are concept proposals, not validated scientific diagrams. Preserve physical plausibility where relevant. Beautiful deliberate composition and readable large interaction targets.`;
}

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

function pageFor(game, family, previous, next) {
  const id = game.id.toLowerCase();
  const images = directions
    .map(
      ([key, label]) =>
        `### ${label}\n\n![${game.title}: ${label.toLowerCase()} concept](../art/${id}/${key}.webp)\n`
    )
    .join('\n');
  return `# ${game.title}

${game.id} · [${families[family][0]}](../${family}.md) · Cx ${game.cx}${game.wave ? ` · ${game.wave}` : ''} · ${game.original ? 'Original catalog' : 'Added in the visual-catalog expansion'}

**The idea:** ${game.scene}

| Decision | Proposal |
| --- | --- |
| Familiar mechanic | ${game.genre} |
| Learning objective | ${game.lesson} |
| First prototype | One authored challenge built around the interaction above, with a clear goal, immediate feedback, restart and unlimited retries. |
| Technology | ${technology(game)} |
| Scope boundary | ${Number(game.cx[0]) <= 2 ? 'One board and one rule set; defer accounts, multiplayer, procedural content and platform SDKs.' : 'One bounded scenario and one core system; defer a full campaign, network play and production-scale content.'} |
| Reuse | Shared input, saves, accessibility, seeded state and the ${families[family][0].toLowerCase()} collection shell. |
| Prototype acceptance | A player can identify the next action from the screen, complete one challenge, explain the practiced idea and restart without help. Check touch and keyboard play at narrow and wide sizes. |
| Main uncertainty | ${Number(game.cx[0]) >= 4 ? 'Simulation accuracy and device cost need measured evidence before extending the scenario.' : 'Test whether the lesson follows from play and whether the first interaction is understandable without reading.'} |

## Four visual directions

These are independently generated concept proposals for selecting a prototype.
The four views compare gameplay readability, world appeal, tactile identity and
room to grow. They are not screenshots of an implemented game. Native image
dimensions, hashes, exact prompts and generation provenance are recorded in the
[art manifest](../art/${id}/manifest.json); see the [generation notes](../README.md#image-generation-and-provenance).

${images}
## Design checks before prototyping

- Learning target: **${game.lesson}**. Ask a domain reviewer to validate factual content in the mechanic.
- Keep goals cooperative or self-directed, using resources and needs. Avoid purchasable power. No pressure timers in the accessible mode.
- Use original layouts and character designs; the [legal checklist](../../legal.md) applies even when a mechanic is familiar.
- Choose the minimum [fidelity level](../../simulation-engine.md#determinism-and-fidelity-levels) the lesson needs; concept art does not establish scientific accuracy.
- Review silhouettes, text alternatives, reduced motion and non-color cues against the [adorability gate](../../lore/adorability-gate.md).

Genre context: [existing genre research](../../../case-studies/issue-1/data/research-genres-ideas.md)
and [expansion research](../../../case-studies/issue-1/data/research-visual-catalog.md).

${previous ? `[← ${previous.title}](${previous.id.toLowerCase()}.md) · ` : ''}[All concepts](../README.md)${next ? ` · [${next.title} →](${next.id.toLowerCase()}.md)` : ''}
`;
}

mkdirSync(join(base, 'pages'), { recursive: true });
mkdirSync(join(base, 'jobs'), { recursive: true });
const all = [];
const ideaLines = readFileSync('docs/master-plan/game-ideas.md', 'utf8').split(
  '\n'
);
for (const family of Object.keys(families)) {
  const games = JSON.parse(
    readFileSync(join(base, 'catalog', `${family}.json`), 'utf8')
  );
  all.push(...games);
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
  const jobs = [];
  for (const [index, game] of games.entries()) {
    writeFileSync(
      join(base, 'pages', `${game.id.toLowerCase()}.md`),
      pageFor(game, family, games[index - 1], games[index + 1])
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
  const rows = games.map((game) => {
    const id = game.id.toLowerCase();
    return `| [![${game.title} gameplay thumbnail](art/${id}/thumbnail.webp)](pages/${id}.md) | [${game.title}](pages/${id}.md) (${game.id}) | ${game.genre} | ${game.cx} |`;
  });
  writeFileSync(
    join(base, `${family}.md`),
    `# ${families[family][0]} — visual concepts\n\n[All collections](README.md) · ${games.length} ideas · four full-resolution views per idea.\n\nOpen a game page to compare all four directions, the learning objective and prototype scope. Cx follows the [complexity ladder](../game-ideas.md#complexity-ladder).\n\n| Gameplay preview | Idea | Mechanic | Cx |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n`
  );
}
writeFileSync('docs/master-plan/game-ideas.md', ideaLines.join('\n'));
console.log(
  `Built ${all.length} pages and ${all.length * directions.length} independent image prompts.`
);
