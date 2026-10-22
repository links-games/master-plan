# Game estimates

Per-game plans of algorithms and assets, used to score every concept by
development complexity and toddler learnability (requirements R66, R67 and
R69). The scores and the sorted lists are generated into the
[development plan](../../development-plan.md); each game page shows its own
estimate.

- [`library.json`](library.json) — the shared algorithm library (ID, code
  size, difficulty), asset types (hours per unit), the shared platform, the
  productivity constants and the toddler learnability rubric.
- `<family>.json` — one entry per game of the collection, in catalog order.

## Entry format

```json
{
  "id": "PZ-01",
  "algorithms": ["card-memory", "grid-board", "shuffle-deal", "tap-feedback"],
  "extraLoc": 250,
  "assets": {
    "sprites": 30,
    "animations": 6,
    "backgrounds": 3,
    "ui": 3,
    "sfx": 8,
    "music": 1,
    "voice": 20,
    "levels": 12,
    "content": 120,
    "models3d": 0
  },
  "toddler": 3,
  "minAge": 3,
  "plan": "First playable: a 2x2 to 4x4 grid of leaf cards with picture pairs and voiced names; pairs stay open; no timer."
}
```

| Field        | Rule                                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `algorithms` | IDs from `library.json`, unique, only what the first playable version needs. Do not list the shared platform.                                                                        |
| `extraLoc`   | Game-specific code not covered by the algorithms: screens, level logic, content loading, tuning (integer, 0–5000).                                                                   |
| `assets`     | Counts per asset type for the first playable version (integers). List every type; use 0 when unused.                                                                                 |
| `toddler`    | 1–5 by the rubric in `library.json`. Rating 4–5 needs `minAge` ≤ 3; `minAge` ≥ 6 needs rating 1. Toddler games (`td`) are rated 3+ with `minAge` ≤ 3; Shacados games (`sh`) are 10+. |
| `minAge`     | The youngest age that can enjoy the game (1–18).                                                                                                                                     |
| `plan`       | One or two sentences describing the first playable version: what is built first and what is left out. No `\|` characters.                                                            |

Validate with `node scripts/build-development-plan.mjs --check` (or add
family codes, for example `--check td pk`), then regenerate the plan and the
pages with `node scripts/build-development-plan.mjs` and
`node scripts/build-game-concepts.mjs`.
