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

| Document                                             | What it answers                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| [roadmap.md](roadmap.md)                             | What we do first, next, and later — phases with exit criteria.           |
| [infrastructure.md](infrastructure.md)               | Repositories, game-core library, templates, platforms, tech stack.       |
| [ai-pipeline.md](ai-pipeline.md)                     | Issue → formal-ai → auto pull request → restartable CI/CD.               |
| [game-catalog.md](game-catalog.md)                   | Ranked list of first games, educational angle, legal notes.              |
| [game-ideas.md](game-ideas.md)                       | The big list: 216 game ideas by genre, collections, ladder.              |
| [Visual concept catalog](concepts/README.md)         | A page and four art directions per game, to choose a prototype visually. |
| [economy.md](economy.md)                             | Resource-based in-game economy, not money.                               |
| [simulation-engine.md](simulation-engine.md)         | Physics engines, 2D/3D vector graphics, LOD, path to realism.            |
| [lore/README.md](lore/README.md)                     | The Links universe: world, characters, wisdom, styles.                   |
| [lore/characters.md](lore/characters.md)             | Character bible — every Link character with traits and lessons.          |
| [lore/first-contact.md](lore/first-contact.md)       | Reya and Shacados: the setting of the final realistic simulator.         |
| [lore/adorability-gate.md](lore/adorability-gate.md) | The "not adorable = bug" checklist used in reviews.                      |
| [monetization.md](monetization.md)                   | Generosity charter, all monetization mechanics, experiments.             |
| [business-model.md](business-model.md)               | Revenue streams, unit economics, profitability and capital.              |
| [community.md](community.md)                         | Global community, contributors, hiring, donations, merchandise.          |
| [legal.md](legal.md)                                 | Clean-room reimplementation rules, kids' privacy, licensing.             |
| [templates/](templates/)                             | Ready-to-copy workflow and issue templates for every game repo.          |

## Status

| Area                  | Status in this pull request                                     |
| --------------------- | --------------------------------------------------------------- |
| Requirements analysis | 35 from the issue + 19 from PR feedback + 7 derived.            |
| Research & case study | Done — see `docs/case-studies/issue-1/`.                        |
| Master plan documents | Done — this folder.                                             |
| AI pipeline templates | Done — ready-to-copy workflow in `templates/`.                  |
| New repositories      | Planned — list and order in [roadmap.md](roadmap.md) (Phase 0). |
| First games           | Planned — Phase 1 of the roadmap.                               |
