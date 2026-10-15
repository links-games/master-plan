# Case Study: Issue #1 — Initial Master Plan

## Issue Reference

- **Issue**: [#1 - Initial master plan](https://github.com/links-games/master-plan/issues/1)
- **Pull request**: [#2](https://github.com/links-games/master-plan/pull/2)
- **Raw copies**: [`data/issue-1.json`](data/issue-1.json), [`data/pr-2.json`](data/pr-2.json)

The issue asks for a complete plan for the `links-games` organization:

- lots of adorable, educational, mobile-first mini games that ship to web,
  mobile, desktop, Telegram and VK from one codebase;
- a shared game-core library and template repositories;
- an AI pipeline in every repository: an issue runs the latest
  `formal-ai`, a pull request is created the way `hive-mind` does it, and
  the run can be restarted on the same pull request as often as needed;
- a lore universe built from Links Theory, with characters that are cute
  for toddlers, children and adults;
- a generous free-to-play business model that is still profitable;
- a global community.

## Contents of this case study

| Document                               | What it contains                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [requirements.md](requirements.md)     | Every requirement from the issue (R1–R35) with a quote, plus 7 derived requirements (D1–D7).            |
| [solution-plans.md](solution-plans.md) | For each requirement: the chosen solution, existing components and libraries checked, and alternatives. |
| [The master plan](../../master-plan/)  | The result: roadmap, infrastructure, AI pipeline, game catalog, lore, monetization, community, legal.   |
| [data/](data/)                         | Raw data and the online research notes listed below.                                                    |

### Data

| File                                                                        | What it is                                                                                                                       |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [`research-formal-ai-hive-mind.md`](data/research-formal-ai-hive-mind.md)   | Source-level study of formal-ai and hive-mind (release channels, CLI, `solve` options, PR mechanics), AI-on-issues alternatives. |
| [`research-platforms-tech.md`](data/research-platforms-tech.md)             | Distribution targets and their SDKs, game libraries, services (payments, ads, analytics, backend), monorepo tooling, licensing.  |
| [`research-market-games.md`](data/research-market-games.md)                 | Market data, popular reimplementable games, legal cases, learning science, kids' privacy, monetization benchmarks, cute IP.      |
| [`research-links-theory-lore.md`](data/research-links-theory-lore.md)       | Links Theory concepts, Links Notation, existing visual identity, concept-to-character mapping, anime styles, tone guide.         |
| [`issue-1.json`](data/issue-1.json), [`pr-2.json`](data/pr-2.json)          | Raw issue and pull request at the start of the work.                                                                             |
| [`linksplatform-repos.json`](data/linksplatform-repos.json) (88 repos)      | Repository list of the `linksplatform` organization (source of the lore).                                                        |
| [`link-assistant-repos.json`](data/link-assistant-repos.json) (29 repos)    | Repository list of `link-assistant` (formal-ai, hive-mind, agent).                                                               |
| [`link-foundation-repos.json`](data/link-foundation-repos.json) (175 repos) | Repository list of `link-foundation` (Links Notation, shared actions, templates).                                                |

Each research note has its own snapshot date (2026-10-15) and a source URL
next to every fact. Prices, fees, store policies and library versions
change often, so re-check them before relying on them.

## Timeline

| Time (UTC)       | Event                                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| 2026-10-15 09:02 | Issue #1 opened (labels `documentation`, `enhancement`).                                                   |
| 2026-10-15 09:10 | Draft pull request #2 opened by the AI issue solver on branch `issue-1-fb26bf6c9ffd`.                      |
| 2026-10-15 09:15 | Requirements list (R1–R35, D1–D7), master plan index, adorability gate and repository templates committed. |
| 2026-10-15 09:27 | Online research notes committed (formal-ai/hive-mind, lore, market, platforms).                            |
| 2026-10-15 09:31 | Restartable AI pipeline design, workflow templates and their tests committed.                              |
| 2026-10-15 09:32 | Core infrastructure plan committed.                                                                        |
| 2026-10-15 09:36 | Game catalog and phased roadmap committed.                                                                 |
| 2026-10-15 09:39 | Lore core and character bible committed.                                                                   |
| 2026-10-15 09:42 | Monetization, business model, community and legal plans committed.                                         |
| 2026-10-15       | This case study, the solution plans and the documentation link tests committed.                            |

## Method

1. **Split the issue into atomic requirements.** Every sentence of the
   issue became one or more checkable requirements with a stable ID and the
   original quote ([requirements.md](requirements.md)). Requirements that
   follow from the issue but are not written in it (kids' privacy, legal
   checklist, cost control, …) were added as D1–D7.
2. **Read the source repositories.** `link-assistant/formal-ai`,
   `link-assistant/hive-mind`, `link-foundation/.github` and the
   `linksplatform` repositories were cloned read-only and read at the
   source level; the commit of every snapshot is recorded in the research
   notes.
3. **Search online** for market data, platform rules, library versions,
   court cases, learning-science results and monetization benchmarks.
   GitHub stars, licenses and npm versions were pulled live with `gh api`
   and `npm view`.
4. **Check existing components first.** For every requirement, the
   [solution plans](solution-plans.md) list what already exists (in our
   organizations and in open source) before proposing anything new.
5. **Write the plan** as a set of small documents in
   [`docs/master-plan/`](../../master-plan/), each covering named
   requirements.
6. **Test what can be tested.** The AI pipeline decision logic and the
   documentation links are covered by automated tests (see
   [Verification](#verification)).

## Key findings

### Technology

- **One build, every platform, is realistic.** A Vite web build is the
  single artifact; thin shells wrap it: PWA, Capacitor 8 (Android/iOS),
  Electron 44 (desktop, Steam), Telegram (`@tma.js/sdk`), VK
  (`@vkontakte/vk-bridge`), Yandex Games, Discord, and Playgama Bridge for
  about two dozen portals. This repository already has a working
  React + Capacitor + Electron example (`examples/universal-app`) to grow
  the first template from.
- **A thin `Platform` interface is the key abstraction.** Games never call
  SDKs; adapters map ads, purchases, storage, sharing, haptics, locale and
  lifecycle per platform. Kids-mode rules live there too, so no game can
  forget them.
- **React-friendly engines exist for every genre:** PixiJS v8 +
  `@pixi/react` (2D default), Phaser 4 (arcade and physics), three.js +
  React Three Fiber (3D). All MIT.
- **Avoid licenses that break "public domain"** in game bundles: GPL/AGPL
  code, GSAP (proprietary "no charge" license) and Spine runtimes. Rive and
  dotLottie runtimes are MIT.

### AI pipeline

- **Everything needed already exists in our organizations.** hive-mind
  `solve` turns an issue into a draft pull request and continues the same
  pull request on later runs (`--auto-continue`); `--tool agent --model
formal-ai` uses formal-ai; the `ghcr.io/link-assistant/formal-ai:latest`
  image always holds the newest build; `link-foundation/.github` has
  actions for tokens and for dispatching checks on bot pull requests.
- **GitHub re-runs cannot carry new feedback** (they replay the same event
  and commit), so "restartable" is built from new events (`/retry`
  comments, "request changes" reviews, labels, a schedule) keyed to the
  same issue or pull request, with a per-target queue.
- **formal-ai is not yet able to solve general game-development issues**
  (its own roadmap lists HumanEval 21/164, SWE-bench Lite 0/1). The pipeline
  therefore keeps formal-ai as the default but makes the tool pluggable.

### Games and market

- **Mobile is more than half of games revenue** ($113B of $202B in 2025),
  while installs get more expensive. Free channels with no install
  friction — web portals (Poki: 100M+ monthly players) and Telegram (1B+
  MAU) — are the best start for small games.
- **The simplest classic mechanics are still the biggest hits** (Block
  Blast! was the most downloaded game of 2025) and are legally free to
  reimplement: ideas, rules and methods of play are not protected
  (17 U.S.C. 102(b)), but trade dress and names are (_Tetris v. Xio_,
  _Spry Fox v. Lolapps_). The catalog lists what to avoid for each game.
- **Learning in games works when the lesson is inside the mechanic**
  (meta-analyses: d ≈ 0.3–0.4 for early-grade educational apps), with
  spaced repetition and kind streaks.

### Lore and characters

- **Links Theory already has a face.** The `linksplatform` avatar is two
  round eyes (red source, blue target) with a curved arrow as a smiling
  mouth. Doublets, triplets, the self-link and "everything is a link" map
  naturally to characters (Linky, Soru & Tari, Verbi, Itsy, Akoren, Omi).
- **Cute IP that scales** (Pokémon, Sanrio, Om Nom, Pusheen) shares a few
  rules: simple primitive shapes, one recognizable silhouette, a short
  personality line, and characters that travel without the game (stickers,
  merch, short videos).

### Business and law

- **Generous is a strategy, not a cost.** Big players now compete on "no
  ads, no IAP" for kids (Netflix Playground, Apple Arcade, Khan Academy
  Kids). Kids' privacy enforcement is strict (FTC v. Epic, $520M; amended
  COPPA rule with compliance by 2026-04-22).
- **Open source games do make money** through convenient paid builds and
  supporter features (Mindustry, Shattered Pixel Dungeon), but clones are
  certain (2048). The moat is the brand, the characters, the community and
  the store presence, protected by trademarks, which public-domain
  dedications explicitly do not waive.
- **Platform rules shape monetization:** Telegram sells digital goods only
  for Stars, VK only for votes and needs a Russian entity; store
  subscription fees are 15% for small developers.

## Decisions and assumptions

The issue leaves several choices open. The plan takes these defaults and
lists them for maintainers in the
[roadmap](../../master-plan/roadmap.md#decisions-needed-from-maintainers):

1. **No new repositories were created.** Creating repositories is an
   outward-facing action, so the plan lists them in creation order and the
   ready-to-copy templates live in
   [`docs/master-plan/templates/`](../../master-plan/templates/).
2. **Licenses:** Unlicense for code (as in this repository), CC0 for art
   and texts, trademarks for names and character designs.
3. **"Ads as an advantage"** is read as opt-in rewarded ads for general
   audiences only, never in kids mode, starting in Phase 3.
4. **Character names are working names** until a trademark search
   ("Linky" is already used by a French smart meter).
5. **"Latest formal-ai"** means the `latest` container image, pulled on
   every run.

## Verification

| Check                                                                         | What it proves                                                                                         |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [`tests/ai-solve-workflow.test.js`](../../../tests/ai-solve-workflow.test.js) | The AI pipeline template triggers, permissions, restart logic and same-PR targeting behave as planned. |
| [`tests/master-plan-docs.test.js`](../../../tests/master-plan-docs.test.js)   | Every relative link and `#anchor` in the master plan and this case study resolves.                     |
| `actionlint` and the repository's workflow checks                             | The workflow templates are valid GitHub Actions.                                                       |
| Lychee (`links.yml`)                                                          | External links in the documents are reachable.                                                         |

Run locally:

```bash
npm test
npm run lint
npx prettier --check .
```

## Open questions

These need the maintainers' decision or more data; none blocks Phase 0.

1. Canonical role colors of the Links (the avatar and Links Theory 0.0.2
   differ).
2. Final character and brand names after trademark searches.
3. Legal entity and jurisdiction (needed for stores, VK payments and
   trademarks).
4. Whether to fund a stronger AI agent for the pipeline while formal-ai
   matures.
5. Which language markets to localize first after English and Russian.
