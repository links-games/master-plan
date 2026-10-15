# Case Study: Issue #1 — Initial Master Plan

## Issue Reference

- **Issue**: [#1 - Initial master plan](https://github.com/links-games/master-plan/issues/1)
- **Pull request**: [#2](https://github.com/links-games/master-plan/pull/2)
- **Raw copies**: [`data/issue-1.json`](data/issue-1.json), [`data/pr-2.json`](data/pr-2.json), [`data/pr-2-comments.json`](data/pr-2-comments.json)
- **Feedback**: the maintainer's [PR #2 comment](https://github.com/links-games/master-plan/pull/2#issuecomment-6189666260) added requirements R36–R49
- **Visual feedback**: the [later comment](https://github.com/links-games/master-plan/pull/2#issuecomment-6190555786) adds R50–R54, recorded in [raw form](data/pr-2-visual-feedback.json).

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

| Document                               | What it contains                                                                                                              |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [requirements.md](requirements.md)     | Every requirement from the issue (R1–R35) and the PR #2 feedback (R36–R54) with a quote, plus 7 derived requirements (D1–D7). |
| [solution-plans.md](solution-plans.md) | For each requirement: the chosen solution, existing components and libraries checked, and alternatives.                       |
| [The master plan](../../master-plan/)  | The result: roadmap, infrastructure, AI pipeline, game catalog, lore, monetization, community, legal.                         |
| [data/](data/)                         | Raw data and the online research notes listed below.                                                                          |

### Data

| File                                                                                                                | What it is                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`research-formal-ai-hive-mind.md`](data/research-formal-ai-hive-mind.md)                                           | Source-level study of formal-ai and hive-mind (release channels, CLI, `solve` options, PR mechanics), AI-on-issues alternatives.                               |
| [`research-platforms-tech.md`](data/research-platforms-tech.md)                                                     | Distribution targets and their SDKs, game libraries, services (payments, ads, analytics, backend), monorepo tooling, licensing.                                |
| [`research-market-games.md`](data/research-market-games.md)                                                         | Market data, popular reimplementable games, legal cases, learning science, kids' privacy, monetization benchmarks, cute IP.                                    |
| [`research-links-theory-lore.md`](data/research-links-theory-lore.md)                                               | Links Theory concepts, Links Notation, existing visual identity, concept-to-character mapping, anime styles, tone guide.                                       |
| [`research-genres-ideas.md`](data/research-genres-ideas.md)                                                         | Proven game genres, educational and citizen-science games, game collections, non-violent design and resource-based economies (for R36–R41, R49).               |
| [`research-visual-catalog.md`](data/research-visual-catalog.md)                                                     | Primary sources for the 48 added mechanics, four concept-art directions, resolution and model-reporting limits (R50–R54).                                      |
| [`pr-2-visual-feedback.json`](data/pr-2-visual-feedback.json)                                                       | Raw request for an expanded catalog with individual pages and four generated images per idea.                                                                  |
| [`research-physics-simulation.md`](data/research-physics-simulation.md)                                             | Physics engines for JS/WASM, the "universal formula" candidates, WebGPU reach, PBR and anime rendering, LOD, determinism, real-world validation (for R43–R48). |
| [`first-contact-pilot-scene.md`](data/first-contact-pilot-scene.md)                                                 | The First Contact pilot scene (Russian original, English translation) and the maintainer's framing (for R42).                                                  |
| [`issue-1.json`](data/issue-1.json), [`pr-2.json`](data/pr-2.json), [`pr-2-comments.json`](data/pr-2-comments.json) | Raw issue, pull request and pull request comments.                                                                                                             |
| [`linksplatform-repos.json`](data/linksplatform-repos.json) (88 repos)                                              | Repository list of the `linksplatform` organization (source of the lore).                                                                                      |
| [`link-assistant-repos.json`](data/link-assistant-repos.json) (29 repos)                                            | Repository list of `link-assistant` (formal-ai, hive-mind, agent).                                                                                             |
| [`link-foundation-repos.json`](data/link-foundation-repos.json) (175 repos)                                         | Repository list of `link-foundation` (Links Notation, shared actions, templates).                                                                              |

Each research note has its own snapshot date (2026-10-15) and a source URL
next to every fact. Prices, fees, store policies and library versions
change often, so re-check them before relying on them.

## Timeline

| Time (UTC)       | Event                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-15 09:02 | Issue #1 opened (labels `documentation`, `enhancement`).                                                                                                  |
| 2026-10-15 09:10 | Draft pull request #2 opened by the AI issue solver on branch `issue-1-fb26bf6c9ffd`.                                                                     |
| 2026-10-15 09:15 | Requirements list (R1–R35, D1–D7), master plan index, adorability gate and repository templates committed.                                                |
| 2026-10-15 09:27 | Online research notes committed (formal-ai/hive-mind, lore, market, platforms).                                                                           |
| 2026-10-15 09:31 | Restartable AI pipeline design, workflow templates and their tests committed.                                                                             |
| 2026-10-15 09:32 | Core infrastructure plan committed.                                                                                                                       |
| 2026-10-15 09:36 | Game catalog and phased roadmap committed.                                                                                                                |
| 2026-10-15 09:39 | Lore core and character bible committed.                                                                                                                  |
| 2026-10-15 09:42 | Monetization, business model, community and legal plans committed.                                                                                        |
| 2026-10-15       | This case study, the solution plans and the documentation link tests committed.                                                                           |
| 2026-10-15 10:02 | All CI checks passed; the pull request was marked ready.                                                                                                  |
| 2026-10-15 10:11 | The maintainer's feedback asked for a game ideas list, collections, a resource-based economy, the First Contact lore and a realistic simulator (R36–R49). |
| 2026-10-15 10:33 | The pilot scene source, the feedback data and a relativistic physics check of the scene committed.                                                        |
| 2026-10-15       | Game ideas, economy, simulation engine and First Contact lore documents, and the two new research notes, committed.                                       |
| 2026-10-15 11:04 | The maintainer requested missing popular ideas, a page and four generated high-resolution images per idea, for visual prototype selection (R50–R54).      |

## Method

The later [visual-catalog request](https://github.com/links-games/master-plan/pull/2#issuecomment-6190555786)
adds requirements **R50–R54**: expand missing genres, give each idea a page,
generate four high-resolution concepts per idea with GPT Image 2.5 or the latest
available generator, and make the visuals useful for choosing a first prototype.
The [visual catalog](../../master-plan/concepts/README.md) preserves all 168
previous IDs and adds 48, with 216 scoped pages and 864 independent concept
images at native 1254 × 1254 resolution. All four views of every idea have been
visually inspected; the [review record](data/visual-review.md) explains the method
and limits. The [research note](data/research-visual-catalog.md) records
primary sources and the tool's model-reporting limitation; the
[raw request](data/pr-2-visual-feedback.json) preserves the feedback.

Catalog integrity is checked by
[`tests/game-concepts.test.js`](../../../tests/game-concepts.test.js): complete
page and art coverage, actual WebP dimensions, unique byte hashes and exact
prompt provenance. The original documentation-link test checks navigation.

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

### Feedback on PR #2

- **The written pilot scene is faster than light.** The probe is said to
  fly at 500,000 km/s, which is above _c_ (299,792 km/s). The scene works
  at 0.5 _c_; every number is recomputed by
  [`examples/first-contact-physics.mjs`](../../../examples/first-contact-physics.mjs)
  and tested in
  [`tests/first-contact-physics.test.js`](../../../tests/first-contact-physics.test.js)
  ([physics check](../../master-plan/lore/first-contact.md#physics-check-of-the-pilot)).
- **relative-meta-logic has no physics yet** (checked at commit
  `c5513f2`). Using it to choose simplified laws per scale is a research
  track, not a dependency; no existing product does this automatically.
- **"Fully realistic" is only reachable per phenomenon**, within measured
  error bars, so every game declares a
  [fidelity level](../../master-plan/simulation-engine.md#determinism-and-fidelity-levels)
  from L0 (arcade) to L4 (reproducible in real life).
- **WebGPU reaches about 87.8% of users** and WebGL 2 has no compute
  shaders, so every GPU kernel needs a CPU reference, and GPU floats never
  drive state that must match across devices.
- **Box2D v3 and Rapier** are the most accurate permissive engines with
  documented cross-platform determinism in WASM; NVIDIA FleX is
  non-permissive and is not used.

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
6. **The DNA idea** from the feedback is recorded as a long-term thought
   experiment with an ethics boundary; the plan keeps characters
   biomechanically plausible instead.
7. **Start systems of Reya and Shacados** are a proposal until the
   maintainers confirm them.

## Verification

| Check                                                                                 | What it proves                                                                                         |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [`tests/ai-solve-workflow.test.js`](../../../tests/ai-solve-workflow.test.js)         | The AI pipeline template triggers, permissions, restart logic and same-PR targeting behave as planned. |
| [`tests/master-plan-docs.test.js`](../../../tests/master-plan-docs.test.js)           | Every relative link and `#anchor` in the master plan and this case study resolves.                     |
| [`tests/game-concepts.test.js`](../../../tests/game-concepts.test.js)                 | All 216 ideas have pages, four unique high-resolution images, matching hashes and exact prompts.       |
| [`tests/first-contact-physics.test.js`](../../../tests/first-contact-physics.test.js) | The physics numbers of the First Contact pilot scene are computed, not guessed.                        |
| `actionlint` and the repository's workflow checks                                     | The workflow templates are valid GitHub Actions.                                                       |
| Lychee (`links.yml`)                                                                  | External links in the documents are reachable.                                                         |

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
