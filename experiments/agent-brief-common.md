# Common brief for estimate and catalog agents

Repository: /tmp/gh-issue-solver-1792665113103 (educational game master plan for "Links Games").
Do NOT run git (no add/commit/stash/checkout). Only create/overwrite the files assigned to you.
Do not edit any other file. Use `node` for validation.

## Estimates (every agent writes some)

Read `docs/master-plan/concepts/estimates/README.md` (format and rules) and
`docs/master-plan/concepts/estimates/library.json` (82 algorithm IDs with LOC and difficulty,
asset types with hours per unit, toddler rubric 1-5, play factors).
Scoring (scripts/game-estimates.mjs): LOC = sum(algorithm loc) + extraLoc; asset hours =
sum(count x hours); effort days = LOC/120 + assetHours/6. Start score = days x play factor.

For each game write ONE entry `{id, algorithms, extraLoc, assets, toddler, minAge, plan}`:

- `algorithms`: only the library IDs the FIRST PLAYABLE, polished version really needs
  (typically 2-7). Be honest: a 3D game needs character-3d/camera-3d; a sim needs its sim.
- `extraLoc`: game-specific glue (screens, level logic, content). Calibration:
  toddler toy 50-250; simple 2D puzzle 150-500; mid game 400-1200; big sim/3D 1200-4000.
- `assets`: list ALL ten keys (sprites, animations, backgrounds, ui, sfx, music, voice,
  levels, content, models3d), 0 where unused. `content` = small data items (words, facts,
  cards, questions) at 0.1 h each; `levels` = authored levels/puzzles at 1 h; `voice` = short
  voiced lines at 0.3 h. Be realistic and consistent:
  toddler toy ~ sprites 8-25, animations 2-8, backgrounds 1-3, ui 1-2, sfx 6-15, music 1,
  voice 0-20; complex 3D ~ models3d 10-40.
- Target effort-days calibration: tiny toddler toys 3-10 days; Cx 1 games 8-25; Cx 2 12-35;
  Cx 3 20-50; Cx 4 35-80; Cx 5 60-200. ("Cx" is the complexity column in the catalog.)
- `toddler`: rubric rating 1-5 (library.json toddlerRubric). Rules enforced by the validator:
  rating 4-5 needs minAge <= 3; minAge >= 6 forces rating 1; td games need rating >= 3 and
  minAge <= 3; sh games need minAge >= 10. Touch research: toddlers tap well (~71% success),
  drag worse (~41%), swipe poorly (~20%); under 2 only with co-play; no reading, no timers.
- `minAge`: youngest age that can enjoy it (integer).
- `plan`: 1-2 sentences, 40-300 chars, no `|` characters: what the first playable version
  contains (screens, number of levels/items, core loop) and what is deliberately left out.
  Make each plan specific to the game, never generic.
  Write the estimates file as a JSON array in catalog order, 2-space indent, trailing newline.
  Validate: `node scripts/build-development-plan.mjs --check <family codes>` must print
  "Estimates are valid." (it validates only the given families). Fix until it does.
  Then print a short summary table of (id, effort days, toddler, minAge) with:
  node --input-type=module -e "import {loadGames,computeEstimate} from './scripts/game-estimates.mjs'; const {library,games}=loadGames(); for (const g of games.filter(g=>['FAM'].includes(g.family))) console.log(g.id, computeEstimate(g.estimate,library).effortDays, g.estimate.toddler, g.estimate.minAge)"
  and check the numbers match the calibration; adjust outliers.
