# Links Games — Master Plan

> A plan to make another game multiverse: lots of small, adorable,
> mobile-first games that teach something, live in one shared universe of
> cute **Links**, and ship everywhere from a single codebase.

This folder is the **living master plan** of the
[links-games](https://github.com/links-games) organization. It was produced
for [issue #1](https://github.com/links-games/master-plan/issues/1); the
research behind every decision (raw data, sources, requirement-by-requirement
analysis) lives in the
[issue #1 case study](../case-studies/issue-1/README.md).

## Mission

**Every play session gives two gifts: joy and one new idea.**

We make cool, high-quality, free-to-play mini games for toddlers, children
and adults. Each game is fun first, and quietly teaches one useful lesson —
a fact, a skill, or a piece of wisdom from our shared lore.

## Principles

1. **Adorable or it is a bug.** Characters, animations, sounds, texts and
   even error screens must pass the [adorability gate](lore/adorability-gate.md).
2. **Fun first, learning inside.** Every game has exactly one explicit
   learning objective and never feels like homework
   ([game catalog](game-catalog.md)).
3. **Simplest first.** We ship tiny games quickly, then reuse everything we
   learned. Complexity is earned by player data, not by ambition.
4. **One codebase, every platform.** Web/PWA, Android, iOS, desktop,
   Telegram Mini Apps, VK Mini Apps, web-game portals — all from one build
   ([infrastructure](infrastructure.md)).
5. **One universe.** All games share the [Links lore](lore/README.md), one
   player profile and one collection of characters.
6. **Most generous in the market.** Free to play, ad-free at launch, rewarded
   ads strictly opt-in, subscriptions optional and asked for later than any
   competitor does ([monetization](monetization.md)).
7. **Open by nature, quiet about it.** Code is public domain (Unlicense), but
   the store pages talk about the games, not the licenses
   ([legal](legal.md)).
8. **Automation of automation.** Every repository accepts issues that are
   solved by AI (latest `formal-ai`, `hive-mind`-style pull requests) and can
   be re-run as many times as needed ([AI pipeline](ai-pipeline.md)).
9. **Community is the moat.** Code can be cloned; characters, trust and a
   global community cannot ([community](community.md)).
10. **Profit funds quality.** Sustainable revenue is reinvested into more and
    better games ([business model](business-model.md)).
11. **Every proven genre, kind and smart.** We collect every popular genre,
    wrap real or transferable knowledge in it, and climb from the simplest
    games to a fully realistic simulator ([game ideas](game-ideas.md)).
12. **Non-violent, resource-based.** Nobody is hurt to win, and in-game
    economies count real resources and needs, not money
    ([economy](economy.md), [First Contact](lore/first-contact.md)).
13. **Physics, not guesswork.** Looks and behavior come from physical
    properties, accurate and efficient at every scale and on every device
    ([simulation engine](simulation-engine.md)).

## Documents

| Document                                             | What it answers                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| [roadmap.md](roadmap.md)                             | What we do first, next, and later — phases with exit criteria.                 |
| [infrastructure.md](infrastructure.md)               | Repositories, game-core library, templates, platforms, tech stack.             |
| [ai-pipeline.md](ai-pipeline.md)                     | Issue → formal-ai → auto pull request → restartable CI/CD.                     |
| [game-catalog.md](game-catalog.md)                   | Ranked list of first games, educational angle, legal notes.                    |
| [game-ideas.md](game-ideas.md)                       | The big list: 310 game ideas by genre, collections, ladder.                    |
| [development-plan.md](development-plan.md)           | All 310 games sorted by effort, with algorithms, assets and toddler ratings.   |
| [Visual concept catalog](concepts/README.md)         | 310 game pages, 1,672 core and style concepts in three distinct styles.        |
| [economy.md](economy.md)                             | Resource-based in-game economy, not money.                                     |
| [simulation-engine.md](simulation-engine.md)         | Physics engines, 2D/3D vector graphics, LOD, path to realism.                  |
| [lore/README.md](lore/README.md)                     | The Links universe: world, characters, wisdom, styles.                         |
| [lore/characters.md](lore/characters.md)             | Character bible — every Link character with traits and lessons.                |
| [lore/first-contact.md](lore/first-contact.md)       | Raya and Shacados: the setting of the final realistic simulator.               |
| [lore/raya.md](lore/raya.md)                         | Raya: untouched nature, white towers, Orbis, the Chord, Guard and Renewal.     |
| [lore/shacados.md](lore/shacados.md)                 | Shacados: rust, coal, hunger, frozen belts and the most unsafe spaceflight.    |
| [lore/scenery-pilots.md](lore/scenery-pilots.md)     | 22 pilot briefs with rendered environments, story beats and shot descriptions. |
| [lore/stories.md](lore/stories.md)                   | 14 short stories by age, each with a wisdom line and questions.                |
| [lore/adorability-gate.md](lore/adorability-gate.md) | The "not adorable = bug" checklist used in reviews.                            |
| [monetization.md](monetization.md)                   | Generosity charter, all monetization mechanics, experiments.                   |
| [business-model.md](business-model.md)               | Revenue streams, unit economics, profitability and capital.                    |
| [community.md](community.md)                         | Global community, contributors, hiring, donations, merchandise.                |
| [legal.md](legal.md)                                 | Clean-room reimplementation rules, kids' privacy, licensing.                   |
| [templates/](templates/)                             | Ready-to-copy workflow and issue templates for every game repo.                |

## Status

| Area                  | Status in this pull request                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Requirements analysis | 35 from the issue + 41 from PR feedback + 7 derived.                                                    |
| Research & case study | Done — see `docs/case-studies/issue-1/`.                                                                |
| Master plan documents | Done — this folder.                                                                                     |
| AI pipeline templates | Done — ready-to-copy workflow in `templates/`.                                                          |
| New repositories      | Planned — list and order in [roadmap.md](roadmap.md) (Phase 0).                                         |
| First games           | Planned — Phase 1 of the roadmap.                                                                       |
| Website               | Built by CI; published once GitHub Pages is enabled ([Website](#website)).                              |
| Concept art           | 1,672 GPT concepts across 310 ideas; 32 collection backgrounds; 22 Blender environments with opt-in 3D. |

## Website

The [Pages workflow](../../.github/workflows/example-app.yml) turns this
folder into a mobile-first website (R71, R72) with
[`scripts/build-site.mjs`](../../scripts/build-site.mjs): a home page with the
easiest games to start, a filterable **Choose a game** explorer (collection,
age, toddler rating, days of work, art or descriptions), the
[development plan](development-plan.md), every concept page with its core and
style artwork and detailed briefs, the [lore](lore/README.md) and the
[stories](lore/stories.md). The explorer keeps its filters in the URL, so a
shortlist can be shared as a link.

- **Address:** [links-games.github.io/master-plan](https://links-games.github.io/master-plan/), with the
  universal example app at `example-app/`.
- **Build locally:** `node scripts/build-site.mjs`, then serve the output with
  `node experiments/serve-master-plan.mjs _site` and open
  `http://127.0.0.1:4173/`. Serving over HTTP also enables the scene downloads.
  Add `--no-art` to the build command for a fast build without images.
- **Publishing:** each push to `main` that changes these documents deploys the
  site. GitHub Pages must be enabled once in **Settings → Pages → Source:
  GitHub Actions**; pull requests upload the built site as the
  `master-plan-website` artifact instead.
- **Tests:** [`tests/site.test.js`](../../tests/site.test.js) builds the site
  and checks every page for the mobile viewport and every link and anchor.
  [`experiments/audit-website-links.mjs`](../../experiments/audit-website-links.mjs)
  checks the published output, including responsive picture sources and
  lazily requested scene geometry, after the full asset copy.
  [`experiments/verify-master-plan.mjs`](../../experiments/verify-master-plan.mjs)
  decodes all 1,672 concepts on the 310 built game pages and verifies desktop
  and mobile layouts, visual baselines, filters and all 22 interactive scenes.
  Normal CI compares committed screenshots. A manual run of `example-app.yml`
  with `update_visual_baselines=true` captures candidate images in the
  `master-plan-browser` artifact for inspection; it does not run the job that
  writes example-app previews to `main`. Review and commit accepted images,
  then run the normal comparison again.

The [environment gallery](lore/scenes/README.md) documents offline Blender rendering, CI artifacts and browser performance budgets. See the [issue #3 audit](../case-studies/links-games-issue-3/README.md) for coverage and verification.
