# Issue #1 — Solution Plans per Requirement

For every requirement in [requirements.md](requirements.md) this document
gives:

- **Solution:** what we do;
- **Reuse:** the existing components and libraries checked first (ours and
  open source), so nothing is built that already exists;
- **Alternatives:** what else was considered, and why it is not the
  default;
- **Plan:** where the detailed plan lives in
  [`docs/master-plan/`](../../master-plan/README.md).

Versions, licenses, prices and sources for every library and service named
here are in the [research data](README.md#data) (snapshot 2026-10-15).

This records issue #1's original delivery. Its 300-game and 216-image-catalog
counts are historical. [Issue #3](../links-games-issue-3/README.md) expands the
current catalog to 310 fully illustrated games and supplies the previously
pending 84 concepts, 32 loading backgrounds and 22 reproducible 3D scenes.

## Summary

| ID      | Requirement (short)                                                          | Solution in one line                                                                           | Status in this PR          |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------- |
| R1      | Lots of mobile-first mini games                                              | Waves of small games from templates; mobile viewports first                                    | Planned (catalog, waves)   |
| R2      | Web, mobile, Telegram, VK, …                                                 | One Vite build + thin shells + `Platform` adapters                                             | Planned                    |
| R3      | Game-core library                                                            | `@links-games/*` packages in a pnpm monorepo                                                   | Planned                    |
| R4      | Template repositories                                                        | GitHub template repos per genre, starting from `examples/universal-app`                        | Planned                    |
| R5      | React + JS + Capacitor + Electron                                            | React 19 + JavaScript (JSDoc), Capacitor 8, Electron 44                                        | Planned                    |
| R6      | Use formal-ai                                                                | formal-ai as the pipeline brain; LiNo for game data                                            | Templates done             |
| R7      | Issue → latest formal-ai → PR                                                | Reusable workflow: `formal-ai:latest` + hive-mind `solve`                                      | Templates + tests done     |
| R8      | PR created the hive-mind way                                                 | hive-mind `solve` opens and continues the draft PR                                             | Templates + tests done     |
| R9      | Restartable on the same PR                                                   | New events (`/retry`, reviews, labels, schedule) keyed to the same target                      | Templates + tests done     |
| R10     | Detailed core infrastructure plan                                            | [infrastructure.md](../../master-plan/infrastructure.md)                                       | Done                       |
| R11     | Popular, legally reimplementable games                                       | Ranked catalog with "avoid" notes per game                                                     | Done                       |
| R12     | Lore core from linksplatform                                                 | World of Omi built from Links Theory                                                           | Done                       |
| R13     | Cute for toddlers, children, adults                                          | Primitive shapes, chibi first, age tiers                                                       | Done                       |
| R14     | Not adorable = bug                                                           | Adorability gate checklist, label, template, visual tests                                      | Done (gate), CI planned    |
| R15     | One universe                                                                 | Shared lore, profile, collection, hub app                                                      | Planned                    |
| R16     | Wisdom and lessons in the lore                                               | Wisdom bank linked to games                                                                    | Done                       |
| R17     | Fun + learning                                                               | One learning objective per game, `learning` package                                            | Planned                    |
| R18     | Simplest games first                                                         | Wave 1 ordered by complexity                                                                   | Done                       |
| R19     | Open source, public domain                                                   | Unlicense code, CC0 assets, trademarks kept                                                    | Done (policy)              |
| R20     | Do not advertise it much                                                     | License in repo and About screen only                                                          | Done (policy)              |
| R21     | Free to play + custom subscriptions                                          | Supporter tier with cosmetic perks; entitlement model                                          | Planned                    |
| R22     | Ad-free at start                                                             | Ads SDKs off by flag; kids builds link none                                                    | Planned                    |
| R23     | Ads/subscriptions give advantages                                            | Opt-in rewarded ads and boosts, all earnable for free                                          | Planned (Phase 3)          |
| R24     | More generous than competitors                                               | Public generosity charter enforced in code                                                     | Done (charter)             |
| R25     | All mechanics in place for experiments                                       | Every mechanic behind a remote flag; PostHog experiments                                       | Planned                    |
| R26     | Big global community                                                         | Channels, growth loops, AI-assisted contributions                                              | Planned                    |
| R27     | Hiring when budget allows                                                    | Hiring order and rules                                                                         | Planned                    |
| R28     | Donations, merch                                                             | Sponsors/Open Collective/Ko-fi; print-on-demand; licensing                                     | Planned                    |
| R29     | Profitable, attract capital                                                  | Unit economics, break-even, capital instruments                                                | Planned                    |
| R30     | Own anime characters in many styles                                          | Chibi 2D, normal anime 2D, 3D, anime hosts                                                     | Done (bible)               |
| R31–R35 | Case study, requirements, plans, one PR                                      | This folder and PR #2                                                                          | Done                       |
| R36–R37 | Game ideas list, collections in one app                                      | 300 ideas in 16 collections; one repo per game, collection apps are configuration              | Done (list), apps planned  |
| R38     | Resource-based economy                                                       | Real resources and needs, conservation, sharing; money only where it is the lesson             | Done (rules)               |
| R39–R41 | All genres, learning inside, simplest first, non-violence                    | Proven genre per idea, complexity ladder Cx 1–7, non-violent reframing table                   | Done (list)                |
| R42     | First Contact lore: Reya and Shacados                                        | Lore page, pilot source and translation, physics check script and test                         | Done (draft), review       |
| R43–R48 | Accurate, efficient physics; vector 2D → 3D; LOD; realism; universal formula | Rapier/Box2D/XPBD/MPM on WebGPU; action principle; RML law selection as research               | Planned (simulation track) |
| R49     | Advance education and science                                                | Real or transferable knowledge in every game; validated open simulators; citizen science       | Planned                    |
| R50–R54 | Expanded ideas and a visual page per game                                    | 216 scoped pages, four independent high-resolution concepts each, prompts and provenance       | Visual catalog             |
| R55–R76 | Raya vision, Shacados, toddler games, estimates, website                     | Raya and Shacados lore, 84 new ideas, estimated plan per game, mobile-first Pages site         | Done (art pending)         |
| D1–D7   | Derived requirements                                                         | Kids privacy, legal checklist, shared identity, moat, AI cost, safe analytics, learning design | Done (plans)               |

## Products and platforms

### R1 — Lots of mobile-first mini games

- **Solution:** produce games in waves (15 in Wave 1, then Waves 2–3), each
  from a template, so a complexity-1 game is a prototype in about a week.
  "Mobile first" is enforced by CI: Playwright screenshots on three phone
  viewports, touch-only controls, portrait layout by default, a ≤10 MB
  initial bundle and first load ≤3 s on a mid-range phone.
- **Reuse:** Playwright device emulation and `toHaveScreenshot()`,
  vite-plugin-pwa (offline play), the existing `examples/universal-app`.
- **Alternatives:** one big game with many modes (rejected: slower to ship,
  one failure risks everything, worse for the AI pipeline, which works best
  on small repositories).
- **Plan:** [game catalog](../../master-plan/game-catalog.md),
  [quality gates](../../master-plan/infrastructure.md#6-quality-gates).

### R2 — Redistribute as web, mobile, Telegram, VK "and so on"

- **Solution:** one Vite web build is the only artifact; thin shells wrap
  it. Games call one capability-based `Platform` interface; adapters
  implement it per platform. Order by effort and reach: PWA → Telegram →
  VK → Yandex Games and other portals → Capacitor (stores) → Electron
  (itch.io, Steam) → Discord Activities.
- **Reuse:** vite-plugin-pwa; Capacitor 8; Electron 44 (+ `steamworks.js`);
  `@tma.js/sdk` (Telegram); `@vkontakte/vk-bridge` (VK); Yandex Games SDK;
  CrazyGames and Poki SDKs; `@discord/embedded-app-sdk`; Playgama Bridge
  (LGPL, loaded from CDN) as a catch-all for about two dozen portals.
- **Alternatives:** Playgama Bridge or GamePush for everything (rejected as
  the default: LGPL/proprietary, and they do not cover stores or kids-mode
  rules); separate native apps (rejected: cost).
- **Plan:** [the Platform interface](../../master-plan/infrastructure.md#3-the-platform-interface),
  [platform obligations](../../master-plan/legal.md#platform-specific-obligations).

### R3 — Game-core library

- **Solution:** `links-games/game-core`, a pnpm monorepo publishing
  `@links-games/*` packages: `core`, `platform`, `profile`, `monetization`,
  `experiments`, `learning`, `ui`, `characters`, `audio`, `i18n`,
  `render-pixi`, `render-three`, `testing`, `shells`.
- **Reuse:** pnpm workspaces, Turborepo, Changesets (already used in this
  repository's CI), Vite library mode, Storybook 10, Zustand, Howler.js,
  i18next, Rive and dotLottie runtimes, `links-notation` and
  `lino-objects-codec` from `link-foundation`.
- **Alternatives:** Nx (good generators, heavier); a single all-in-one
  engine package (rejected: games would carry code they do not use).
- **Plan:** [game-core packages](../../master-plan/infrastructure.md#2-game-core-packages).

### R4 — Game template repositories

- **Solution:** GitHub template repositories, one per genre:
  `game-template-pixi-react` (default 2D), `game-template-phaser` (arcade,
  physics), `game-template-r3f` (3D). A new game is "Use this template" or
  an issue from the game-idea template that the AI pipeline fills in.
- **Reuse:** `examples/universal-app` in this repository (React + Vite +
  Capacitor + Electron + GitHub Pages) as the starting point; the official
  Phaser `template-react`; the CI conventions of the `link-foundation`
  JavaScript template this repository was created from.
- **Alternatives:** a `create-links-game` generator (later, once templates
  are stable); Nx generators.
- **Plan:** [template repositories](../../master-plan/infrastructure.md#4-template-repositories),
  [repositories to create](../../master-plan/roadmap.md#repositories-to-create).

### R5 — Start with React + JavaScript + Capacitor + Electron

- **Solution:** React 19 + JavaScript with JSDoc types (optional
  `tsc --checkJs`), Capacitor 8 for Android/iOS, Electron 44 for desktop.
  Rendering inside React: PixiJS v8 + `@pixi/react`, Phaser 4, or
  three.js + React Three Fiber, chosen per template.
- **Reuse:** the same React + Electron stack is used by formal-ai's web UI
  and desktop app, and React + Capacitor + Electron by
  `examples/universal-app`.
- **Alternatives:** Godot or Unity web exports (heavier builds, not React,
  weaker Telegram/VK fit); Babylon.js and PlayCanvas (good, smaller React
  ecosystems); TypeScript (allowed later; the issue asks for JavaScript).
- **Plan:** [infrastructure](../../master-plan/infrastructure.md).

## AI pipeline

### R6 — Use link-assistant/formal-ai and its associative tech stack

- **Solution:** formal-ai is the default tool of the AI pipeline in every
  repository. From its associative tech stack we also adopt Links Notation
  (LiNo) for data that people, games and formal-ai all read: saves,
  `lesson.lino` learning objectives, the lore wisdom bank and the character
  social graph.
- **Reuse:** `ghcr.io/link-assistant/formal-ai:latest`;
  `links-notation`, `lino-objects-codec`, `lino-i18n`; formal-ai's
  `author-with-formal-ai` composite action as a fallback path.
- **Alternatives:** none for the brain (the issue requires formal-ai); see
  R7 for the agent alternatives kept pluggable.
- **Plan:** [AI pipeline](../../master-plan/ai-pipeline.md),
  [research](data/research-formal-ai-hive-mind.md).

### R7 — On every issue, run the latest formal-ai and publish results on a PR

- **Solution:** a reusable workflow in `links-games/.github` and a ~40-line
  caller in every repository. On an issue (from a maintainer or labeled
  `ai-solve`) it pulls `formal-ai:latest`, copies the binary over the one
  pinned in the hive-mind image, and runs hive-mind `solve` with
  `--tool agent --model formal-ai`.
- **Reuse:** hive-mind Docker image `konard/hive-mind:latest`; the binary
  extraction recipe of formal-ai's own action; hive-mind's own
  `formal-ai-draft.yml` job as the precedent;
  `link-foundation/.github` actions `resolve-github-token` and
  `dispatch-checks`.
- **Alternatives:** formal-ai's `author-with-formal-ai` action (uses the
  latest image, but not pluggable); `anthropics/claude-code-action`,
  `openai/codex-action`, GitHub Copilot coding agent (paid keys; do not use
  formal-ai). The tool stays pluggable because formal-ai cannot yet solve
  general game issues (HumanEval 21/164, SWE-bench Lite 0/1 in its
  roadmap).
- **Plan:** [AI pipeline](../../master-plan/ai-pipeline.md); ready-to-copy
  [`ai-solve-reusable.yml`](../../master-plan/templates/workflows/ai-solve-reusable.yml)
  and [`ai-solve.yml`](../../master-plan/templates/workflows/ai-solve.yml),
  tested by [`tests/ai-solve-workflow.test.js`](../../../tests/ai-solve-workflow.test.js).

### R8 — The pull request is created automatically, the hive-mind way

- **Solution:** hive-mind `solve <issue-url>` creates the
  `issue-N-<hash>` branch, opens a draft PR and attaches logs; the workflow
  labels it `ai-draft` and posts an attempt comment.
- **Reuse:** hive-mind `solve` (`--attach-logs`, `--auto-continue`), the
  same flow that created this pull request.
- **Alternatives:** `peter-evans/create-pull-request` after any tool
  (used by `link-foundation` templates; kept as the fallback for tools
  that do not open PRs).
- **Plan:** [AI pipeline flow](../../master-plan/ai-pipeline.md#flow).

### R9 — Restartable automatically, on the same PR, as often as needed

- **Solution:** GitHub re-runs replay the same event and commit, so they
  cannot carry new feedback. Restarts come from new events — `/solve`,
  `/retry`, `/continue` comments, "request changes" reviews, the
  `ai-solve` label, `workflow_dispatch`, and a 6-hourly sweep of `ai-draft`
  PRs with new human feedback — all keyed to the same `issue-N`/`pr-N`
  target. Per-target concurrency queues attempts without cancelling them;
  `HIVE_MIND_AUTO_CONTINUE_AGE_HOURS=0` makes hive-mind continue the open PR
  at once.
- **Reuse:** hive-mind `--auto-continue`; GitHub Actions `concurrency`
  groups.
- **Alternatives:** `gh run rerun` loops (rejected: same payload, capped);
  a separate bot service (rejected for Phase 0: more to host).
- **Plan:** [restartability](../../master-plan/ai-pipeline.md#restartability-r9).

## Plan deliverables

### R10 — Detailed core infrastructure plan

- **Solution:** a repository map, packages, the `Platform` interface,
  templates, CI/CD in every repository, quality gates, experiments and the
  backend, with Phase 0 tasks and exit criteria.
- **Reuse:** the CI/CD of this repository (Changesets, lychee, file-size
  limits, actionlint, secretlint) becomes the base of `links-games/.github`.
- **Plan:** [infrastructure](../../master-plan/infrastructure.md),
  [roadmap Phase 0](../../master-plan/roadmap.md#phase-0--foundations-weeks-04).

### R11 — Popular, legally reimplementable game ideas

- **Solution:** a ranked catalog of classic mechanics with proven reach
  (pairs, merge, sort, snake, one-tap flyer, block placement, sudoku, word
  games, deduction, path-linking, stacking, coloring, nonograms, board
  classics, virtual pet), each with a learning objective, a star character
  and the names and looks to avoid.
- **Reuse:** public-domain and long-standing mechanics; case law
  (17 U.S.C. 102(b), _Data East v. Epyx_, _DaVinci v. Ziko_ — and the
  limits set by _Tetris v. Xio_ and _Spry Fox v. Lolapps_).
- **Alternatives:** original mechanics only (riskier and slower; kept for
  Wave 3).
- **Plan:** [game catalog](../../master-plan/game-catalog.md),
  [clean-room rules](../../master-plan/legal.md#clean-room-reimplementation),
  [market research](data/research-market-games.md).

## Lore and characters

### R12 — Lore core from linksplatform, links as characters

- **Solution:** the world of Omi, where everything is made of links. Core
  cast from Links Theory: Linky (a link), Soru & Tari (source and target),
  Verbi (the linker), Itsy (the self-link), Akoren (the wise elder), Omi
  (the world); an extended cast of 16 more.
- **Reuse:** the `linksplatform` avatar (already a face: two eyes and a
  smiling arrow), doublet and triplet figures, Links Notation, the
  Links Theory articles; repository lists in [`data/`](data/).
- **Plan:** [lore](../../master-plan/lore/README.md),
  [characters](../../master-plan/lore/characters.md),
  [research](data/research-links-theory-lore.md).

### R13 — Cute, funny and likable for toddlers, children and adults

- **Solution:** characters from simple primitives (round, square,
  triangle), big eyes, readable as a 16 px icon, a sticker or a plush;
  roles differ by shape as well as color (color-blind safe); humor in three
  layers by age tier (2–5, 6–12, 13+).
- **Reuse:** patterns of cute IP that scales (Pusheen, Om Nom, Molang,
  Hello Kitty, Angry Birds shape coding).
- **Plan:** [style sheets and age tiers](../../master-plan/lore/characters.md#age-tiers).

### R14 — "If something is not adorable it is a bug"

- **Solution:** an adorability gate: a checklist in every PR template, a
  `not-adorable` issue template and label, Storybook stories for every
  character state, Playwright visual snapshots, and measured signals
  (sticker shares, reviews, playtests).
- **Reuse:** Storybook, Playwright `toHaveScreenshot()`, GitHub issue
  templates.
- **Plan:** [adorability gate](../../master-plan/lore/adorability-gate.md),
  [issue template](../../master-plan/templates/ISSUE_TEMPLATE/not-adorable.md).

### R15 — One ecosystem / universe

- **Solution:** one lore, one player profile, one collection of Links and
  stickers across games, daily challenges, and the Linky Home hub that
  rewards play in every game; cross-promotion in the hub.
- **Reuse:** Supabase anonymous auth and saves, platform cloud storage
  (Telegram CloudStorage, VK storage, Capacitor Preferences).
- **Plan:** [how the universe connects all games](../../master-plan/lore/README.md#how-the-universe-connects-all-games-r15-d3).

### R16 — Lore full of wisdom and useful lessons

- **Solution:** a wisdom bank of short lines, each tied to a character and
  to the games that teach it, stored in LiNo so games and formal-ai read
  the same source.
- **Plan:** [wisdom bank](../../master-plan/lore/README.md#wisdom-bank).

### R30 — Own anime characters in many styles

- **Solution:** five styles: chibi 2D (primary), sticker/pixel, normal
  anime 2D, toy-like 3D and anime-shaded 3D; human anime hosts (Lina,
  Doubl and Trip, Professor Acorn, Ana) for older players; consistency
  rules across styles.
- **Reuse:** Rive (MIT runtime) for interactive 2D, dotLottie for
  stickers, glTF 2.0 with three.js / React Three Fiber and a toon shader
  for 3D.
- **Alternatives:** Spine (license conflicts with public-domain builds),
  Live2D (proprietary SDK).
- **Plan:** [styles](../../master-plan/lore/README.md#styles-r30),
  [anime hosts](../../master-plan/lore/characters.md#anime-hosts-r30).

## Education

### R17 — Cool games with educational elements

- **Solution:** "stealth learning": the lesson is inside the mechanic.
  Each game declares one objective in `lesson.lino` (CI fails without it);
  `@links-games/learning` adds spaced repetition (1/3/7 days), difficulty
  adaptation and anonymous pre/post micro-checks.
- **Reuse:** learning-science evidence (spacing effect; app effect sizes
  d ≈ 0.3–0.4); Duolingo-style kind streaks; Khan Academy Kids as the
  generosity benchmark.
- **Plan:** [game catalog](../../master-plan/game-catalog.md),
  [quality gates](../../master-plan/infrastructure.md#6-quality-gates).

### R18 — Start with the simplest games

- **Solution:** Wave 1 starts with five complexity-1 games (pairs, merge,
  sort, snake, one-tap flyer) that also exercise the infrastructure.
- **Plan:** [why this order](../../master-plan/game-catalog.md#why-this-order),
  [roadmap Phase 1](../../master-plan/roadmap.md#phase-1--first-games-zero-friction-months-13).

## Open source

### R19 — Fully open-source and public domain

- **Solution:** Unlicense for code (as this repository), CC0 for art,
  audio and texts; trademarks on names and character designs are kept;
  secrets stay in a private `ops` repository. No GPL/AGPL code inside game
  bundles.
- **Reuse:** Kenney (CC0 assets with a reserved brand) as the model.
- **Plan:** [licensing](../../master-plan/legal.md#licensing).

### R20 — Do not advertise the open-source nature much

- **Solution:** the license is in each repository and in the About
  screen; store pages and marketing talk about games and characters.
- **Plan:** [why open source helps](../../master-plan/business-model.md#why-open-source-and-public-domain-help-r19-r20).

## Monetization

### R21 — Free to play with custom subscriptions

- **Solution:** everything playable is free; an optional supporter
  subscription with cosmetic perks, early access and credits; one
  entitlement model (`supporter`, `no-ads`, `pack:<id>`, `boost:<n>`)
  mapped to every platform.
- **Reuse:** RevenueCat (Capacitor + Web Billing; free up to $2,500
  monthly tracked revenue), Telegram Stars subscriptions, VK votes, Yandex
  SDK purchases, Steam and itch.io for desktop.
- **Alternatives:** own store integrations (more work, more compliance
  risk); a premium paid game (contradicts R21).
- **Plan:** [the mechanics](../../master-plan/monetization.md#the-mechanics).

### R22 — Start ads-free

- **Solution:** no ads until a Phase 3 experiment; ad flags off by default;
  kids builds link no ads SDK at all (checked by a bundle scan in CI).
- **Plan:** [generosity charter](../../master-plan/monetization.md#generosity-charter).

### R23 — Ads and subscriptions as a way to get an advantage

- **Solution:** opt-in rewarded ads for general audiences (an extra hint, a
  costume trial, a second daily puzzle) and convenience boosts; every
  advantage can also be earned by playing, and failed ads still reward once
  a day.
- **Reuse:** AdMob (`@capacitor-community/admob`), AdSense H5 Games Ads,
  AdsGram/Monetag (Telegram), VK and portal SDK ads; Google UMP for consent.
- **Plan:** [rewarded ads](../../master-plan/monetization.md#rewarded-ads).

### R24 — More generous than competitors; ask later

- **Solution:** a public generosity charter (8 promises), the supporter
  offer no earlier than session 10 or day 7, one-tap dismiss forever, a
  never-list, and benchmarks against Apple Arcade, Microsoft Solitaire and
  Khan Academy Kids. Enforced in `@links-games/monetization` with tests.
- **Plan:** [generosity charter](../../master-plan/monetization.md#generosity-charter),
  [the never-list](../../master-plan/monetization.md#the-never-list).

### R25 — All mechanics in place to experiment

- **Solution:** every mechanic exists from day one and ships off behind a
  remote flag; experiments are written up as issues with a hypothesis,
  guardrails and an end date, and judged on retention, learning and
  revenue together.
- **Reuse:** PostHog (flags, experiments, analytics; self-hosted endpoint
  for kids builds); GrowthBook as the warehouse-native alternative.
- **Alternatives:** Firebase Remote Config + A/B Testing (Google
  identifiers are a problem for kids' builds).
- **Plan:** [experiments](../../master-plan/monetization.md#experiments-r25),
  [flags](../../master-plan/infrastructure.md#7-experiments-r25-d6).

## Community and business

### R26 — Big global community, contributions out of good will

- **Solution:** GitHub and Telegram first, then Discord, VK, a website
  and short video; growth loops (daily share cards, stickers, fan-art and
  level contests, classroom mode, community translations); AI-assisted
  contributions through the pipeline; in-game credits.
- **Reuse:** GitHub Discussions, issue templates, `good first issue`
  labels; Telegram sticker packs.
- **Plan:** [community](../../master-plan/community.md).

### R27 — Hire developers and designers when the budget allows

- **Solution:** hire when revenue or funding covers 12 months, in order:
  character artist/animator, educational game designer, community
  manager, mobile release engineer, 3D artist, writer; hire from the
  community first, contractors before employees.
- **Plan:** [hiring](../../master-plan/community.md#hiring).

### R28 — Donations, merchandise and other community revenue

- **Solution:** donations from Phase 1 (GitHub Sponsors, Open Collective,
  Ko-fi, Boosty, itch.io); bounties through Algora or Open Collective;
  merch in stages: free printables and stickers, print-on-demand, certified
  plush, then licensing.
- **Reuse:** Printful/Spring print-on-demand; licensed toy manufacturers
  with EN 71 / CPSIA / UKCA certification.
- **Plan:** [donations](../../master-plan/community.md#donations),
  [merchandise](../../master-plan/community.md#merchandise).

### R29 — Profitable and able to attract capital

- **Solution:** keep costs tiny (one codebase, AI pipeline, static
  hosting); a planning model of ≈$27 per 1,000 MAU without ads and ≈$57
  with ads, with break-even tables; capital in order of preference:
  grants, revenue-based financing, charter-respecting angels and seed,
  strategic licensing partners.
- **Plan:** [business model](../../master-plan/business-model.md),
  [attracting capital](../../master-plan/business-model.md#attracting-capital).

## Case study deliverables

### R31 — Collect the data in `docs/case-studies/issue-1`

- **Solution:** raw issue and PR JSON, organization repository lists and
  four research notes in [`data/`](data/).

### R32 — Deep case-study analysis with online search

- **Solution:** the [case study](README.md) with method, timeline, key
  findings and open questions; every fact in the research notes has a
  source URL.

### R33 — List every requirement

- **Solution:** [requirements.md](requirements.md): R1–R35 with quotes,
  D1–D7 derived.

### R34 — Solutions for each requirement, checking existing components

- **Solution:** this document; each requirement names what is reused.

### R35 — Everything in one pull request

- **Solution:** all documents, templates and tests are in
  [PR #2](https://github.com/links-games/master-plan/pull/2). Actions that
  must happen outside this repository (creating repositories, trademark
  filings, store accounts) are planned with an order and owners in the
  [roadmap](../../master-plan/roadmap.md), because they need maintainer
  approval.

## Derived requirements

### D1 — Kids' privacy and store policies

- **Solution:** no accounts and no personal data by default; a `kidsMode`
  capability in the platform layer switches off third-party ads,
  personalization, external links and chat; parental gates; a neutral age
  screen; kids builds without ads SDKs.
- **Reuse:** Apple Kids Category and Google Play Families rules; Google
  UMP; self-hosted PostHog.
- **Plan:** [kids' privacy](../../master-plan/legal.md#kids-privacy-d1).

### D2 — Written legal checklist for reimplementation

- **Solution:** a clean-room checklist in every game's `GAME.md` and PR
  template, plus a names-to-avoid table.
- **Plan:** [checklist for every game](../../master-plan/legal.md#checklist-for-every-game),
  [names to avoid](../../master-plan/legal.md#names-to-avoid).

### D3 — Shared identity, saves, cross-promotion, asset library

- **Solution:** `@links-games/profile`, `characters` and the `assets`
  repository; the hub app.
- **Plan:** [repository map](../../master-plan/infrastructure.md#1-repository-map).

### D4 — The moat is not code secrecy

- **Solution:** brand, characters (trademarked), community, profile and
  collection, store presence, speed and trust.
- **Plan:** [moat](../../master-plan/business-model.md#moat-d4).

### D5 — Gate, budget and secure the AI pipeline

- **Solution:** only owners, members and collaborators trigger runs;
  strangers' issues wait for the `ai-solve` label; `no-ai` opt-out; bots
  ignored; minimal permissions; secrets forwarded by name; attempt caps and
  timeouts.
- **Plan:** [security](../../master-plan/ai-pipeline.md#security-d5).

### D6 — Privacy-safe analytics, remote config and A/B tests

- **Solution:** `@links-games/experiments` with a kids-safe event schema;
  no identifiers in kids mode; first-party, self-hosted endpoint.
- **Plan:** [experiments](../../master-plan/infrastructure.md#7-experiments-r25-d6).

### D7 — Learning-design framework

- **Solution:** one objective per game, mastery path (target 70–85%
  success), spaced repetition, pre/post micro-checks, published results.
- **Plan:** [quality gates](../../master-plan/infrastructure.md#6-quality-gates),
  [learning research](data/research-market-games.md#41-learning-science-evidence).

## Requirements from the PR #2 feedback

Requirements R36–R49 come from the maintainer's
[PR #2 comment](https://github.com/links-games/master-plan/pull/2#issuecomment-6189666260).

### R36 — A list of game ideas, many small repositories

- **Solution:** [game ideas](../../master-plan/game-ideas.md): 216 ideas
  in 12 genre collections, each with a proven genre, a lesson and a
  complexity; one repository per game.
- **Reuse:** the Wave 1–3 games of the [catalog](../../master-plan/game-catalog.md)
  are included and marked; the [game idea template](../../master-plan/templates/ISSUE_TEMPLATE/game-idea.md)
  adds new ones.
- **Evidence:** [research-genres-ideas.md](data/research-genres-ideas.md).

### R37 — Game collections in a single app

- **Solution:** each game publishes a package with a manifest; a
  `collection-<family>` repository is only configuration (list of games,
  store listing, theme). The same game can ship alone, in a collection and
  in the hub.
- **Alternatives:** one monorepo per collection — rejected, because small
  repositories work best with the AI pipeline (R7) and community owners.
- **Plan:** [collections](../../master-plan/game-ideas.md#collections-in-a-single-app),
  [repository map](../../master-plan/infrastructure.md#1-repository-map).

### R38 — Resource-based economy, not money

- **Solution:** [economy](../../master-plan/economy.md): real resources and
  needs, conservation of flows, sharing beats hoarding, success measured in
  wellbeing; money only where it is the lesson; real money never buys
  in-game resources.
- **Reuse:** The Venus Project's resource-based economy idea, Ostrom's
  commons principles, Machinations-style flow graphs.

### R39 — All popular genres with useful and scientific learning inside

- **Solution:** every idea names a proven genre and the knowledge used to
  win; the science collections (Science Lab, Space, Strategy) carry real
  physics, biology, chemistry and economics.
- **Plan:** [game ideas](../../master-plan/game-ideas.md#rules-for-every-idea).

### R40 — Simplest first, then progressively more complex

- **Solution:** the [complexity ladder](../../master-plan/game-ideas.md#complexity-ladder)
  extends the catalog's Cx 1–5 to Cx 6 (scientific simulators) and Cx 7
  (First Contact); ideas are sorted by Cx in every collection; the
  [simulation track](../../master-plan/roadmap.md#simulation-track) gates
  each step on shipped games.

### R41 — Non-violent games

- **Solution:** a [reframing table](../../master-plan/game-ideas.md#non-violent-reframing)
  keeps the fun of violent genres without harm; First Contact has no
  "destroy" verb ([world rules](../../master-plan/lore/first-contact.md#world-rules-of-the-realistic-layer)).

### R42 — First Contact lore: Reya and Shacados

- **Solution:** [first-contact.md](../../master-plan/lore/first-contact.md)
  with both civilizations, their start systems, the retold pilot, world
  rules of the realistic layer, the proposed bridge to Omi and game seeds.
  The [source text and translation](data/first-contact-pilot-scene.md) are
  in the data folder.
- **Verification:** [`examples/first-contact-physics.mjs`](../../../examples/first-contact-physics.mjs)
  and `tests/first-contact-physics.test.js` check the scene with special
  relativity; they found that the written probe speed (500,000 km/s) is
  faster than light and propose 0.5 _c_.

### R43 — Accurate and efficient physics engines

- **Solution:** Rapier 2D/3D by default, Box2D v3 and MuJoCo as accuracy
  references, XPBD and MPM on WebGPU for soft matter, symplectic
  integrators for orbits.
- **Plan:** [engines](../../master-plan/simulation-engine.md#engines-and-libraries-reuse-first);
  evidence in [research-physics-simulation.md](data/research-physics-simulation.md).

### R44 — 2D vector first, then 3D vector

- **Solution:** SVG and Rive, then PixiJS and GPU vector rendering, then
  low-poly and SDF 3D in three.js.
- **Plan:** [path](../../master-plan/simulation-engine.md#path-2d-vector--3d-vector--realistic).

### R45 — All screens, any quality, level of detail

- **Solution:** measured device tiers and dynamic LOD for geometry,
  shading, simulation and audio; the laws never change between tiers.
- **Plan:** [LOD](../../master-plan/simulation-engine.md#level-of-detail-and-every-screen).

### R46 — Toward an exactly real simulator, anime style kept

- **Solution:** physically based light and materials with the anime style
  as a final transfer; error budgets per simulator. The DNA idea is
  recorded as a long-term thought experiment with an ethics boundary.
- **Plan:** [rendering](../../master-plan/simulation-engine.md#rendering-from-physical-properties).

### R47 — The 3D engine comes from physical properties

- **Solution:** objects are described by measured physical properties
  (glTF 2.0 PBR plus mass, elasticity, friction); motion and looks are
  computed from them.

### R48 — One universal formula on the GPU, laws per scale via relative-meta-logic

- **Solution:** the principle of stationary action through variational
  integrators as the universal formula; simplified laws stored with
  validity domains; relative-meta-logic selects and justifies the law.
  RML has no physics today, so this is a research track in
  `simulation-lab`.
- **Plan:** [universal formula](../../master-plan/simulation-engine.md#one-universal-formula-and-laws-per-scale).

### R49 — Advance education and science

- **Solution:** real or transferable knowledge in every game; open,
  validated simulators; citizen-science modes for adults.
- **Plan:** [games that advance science](../../master-plan/game-ideas.md#games-that-advance-science),
  [education and science](../../master-plan/simulation-engine.md#education-and-science-r49).

## Visual-catalog feedback (R50–R54)

### R50 — Expand missing popular game ideas

- **Existing components checked:** the 168-idea table and previous genre
  research; publisher catalogs from King, Dream Games, Voodoo and Dinosaur Polo
  Club; developer listings for deckbuilding, inventory packing, unpacking and
  cleaning; Simon Tatham's classic logic-puzzle collection.
- **Solution:** retain all 168 stable IDs and add 48 distinct concepts, including
  match-3, bubble shooting, drop-and-merge, sorting queues, deckbuilding,
  inventory packing, cleaning, railway dispatch and automation. Keep the same
  12 collections and the existing complexity ladder. Shipped examples are genre
  evidence, not a market ranking or a guarantee of demand.
- **Plan:** [expanded list](../../master-plan/game-ideas.md),
  [primary-source research](data/research-visual-catalog.md).

### R51 — A page for every idea

- **Existing components checked:** GitHub Markdown rendering, the existing
  documentation-link checker and the catalog's stable IDs.
- **Solution:** 216 Markdown pages, generated from collection-scoped JSON
  records. Each page specifies the actual interaction, practiced knowledge,
  first prototype, scope boundary, shared technology and acceptance checks.
  Collection indexes and previous/next links make every page reachable.
- **Verification:** `tests/game-concepts.test.js` preserves the original IDs
  and checks page coverage; `tests/master-plan-docs.test.js` checks navigation.

### R52 — At least four high-resolution concept images per game

- **Existing components checked:** the available built-in image generator,
  WebP encoding with Pillow and GitHub's support for linked repository images.
- **Solution:** four independent prompts and compositions per idea: Gameplay,
  World, Characters and materials, Expanded play. Save full images with native
  dimensions (at least 1024 pixels on both edges), with separate small index
  thumbnails. Never count crops, repeated images or upscaled thumbnails as
  independent concept art.
- **Verification:** artifact checks compare file signatures, native dimensions,
  hashes, four distinct entries and the exact generation prompts.

### R53 — GPT Image 2.5 or latest available

- **Existing components checked:** official OpenAI image documentation and the
  built-in `image_gen.imagegen` tool schema.
- **Solution:** use the available built-in generator. Record the user's
  requested model separately from the actual reported model; this tool exposes
  neither a selector nor a returned model ID, so `modelReported` remains null.
  Record actual dimensions rather than claiming the requested 2048-pixel size.
- **Limit:** the exact backend model cannot be independently attested through
  this tool. The catalog makes this limitation explicit in its provenance.

### R54 — Choose a prototype by key visuals

- **Existing components checked:** Markdown image links and collection tables
  keep review within this repository and PR, without requiring an app install.
- **Solution:** one illustrated index per collection, full images on each game
  page, consistent four-view comparisons and a Cx 1–2 shortlist. Explain what to
  evaluate in each view, then check scope before selecting a first prototype.
- **Plan:** [visual selection catalog](../../master-plan/concepts/README.md).
  Art explores appeal; player testing and domain review establish usability and
  educational correctness.

## Raya, Shacados, toddlers and the website (R55–R76)

### R55–R60 — Raya: landscape, clothing, Orbis, loading screens, telekinesis, ethics

- **Existing components checked:** the World of Omi rules and the First
  Contact pilot (where Raya was spelled "Reya"); published acoustic levitation,
  diamagnetic levitation, brain-interface and partial-reprogramming research.
- **Solution:** a dedicated lore page, [Raya](../../master-plan/lore/raya.md).
  Untouched nature with tall white
  [Chord towers](../../master-plan/lore/raya.md#the-chord-towers) (R55); the
  [white lattice](../../master-plan/lore/raya.md#clothing--the-white-lattice)
  flight suit (R56);
  [Orbis](../../master-plan/lore/raya.md#orbis--the-companion-spheres) and the
  [Chord](../../master-plan/lore/raya.md#the-chord--the-telepathy-internet),
  with walking, play and acoustic flight near towers (R57);
  [loading screens and backgrounds](../../master-plan/lore/raya.md#loading-screens-and-backgrounds)
  plus 32 loading-screen prompts in
  [`loading-screens.json`](../../master-plan/concepts/jobs/loading-screens.json)
  (R58); copying an apple in one night without picking it (R59); and the
  [Gentle Defaults](../../master-plan/lore/raya.md#the-gentle-defaults) of a
  society that takes nothing from nature that it can copy instead (R60).
- **Realism:** every step beyond today's science is a numbered lore exception
  (E1 Chord flight, E2 Orbi field, E3 Copy, E4 the Chord and the Guard,
  E5 Renewal) with its real-world anchor in the
  [Raya and Shacados research note](data/research-raya-shacados.md).

### R61–R63 — Optional laws, the Guard, Renewal

- **Solution:** [Waivers](../../master-plan/lore/raya.md#waivers--laws-are-optional)
  let two consenting citizens lift a default between themselves, applied at
  once through the Chord (R61). [The Guard](../../master-plan/lore/raya.md#the-guard--thoughts-are-free)
  pauses a harmful motor command before the muscle moves, never reads or
  writes thoughts, and can be switched off by each citizen for themselves
  (R62). [Renewal](../../master-plan/lore/raya.md#renewal--forever-young)
  keeps adults at an apparent 18–21; elders are rare and are the people who
  switched it off (R63).
- **Alternatives:** a law-free society without defaults (rejected: the
  maintainer asked for peaceful defaults) and a Guard that also filters
  thoughts (rejected: "each citizen can think anything").

### R64, R70 — No contradictions, maximum detail

- **Solution:** a [consistency check](../../master-plan/lore/raya.md#lore-consistency-check-r64)
  lists every earlier lore statement that conflicts with the vision and how
  it now reads (for example, the pilot's "Reya" is renamed Raya, Professor
  Acorn is one of the rare elders who chose to age, and the hosts wear white
  lattice suits). The First Contact page, the Omi lore, the wisdom bank,
  all 300 idea pages and the stories were reviewed against R55–R63. Each new
  idea has a story, a wisdom line and three image descriptions, and each new
  lore page ends with open questions instead of silent gaps.

### R65 — Scenery pilots

- **Solution:** [22 scenery pilots](../../master-plan/lore/scenery-pilots.md)
  (Raya, Shacados and First Contact). Each one has a setting, characters, the
  beat, the wisdom, an image description and the lore rules it shows, so it
  can be pictured later.

### R66, R67, R69 — Estimated plan per game, sorted by simplicity

- **Existing components checked:** the complexity ladder Cx 1–7, the shared
  technology named on each page and the platform plan.
- **Solution:** every one of the 300 games has an estimate in
  [`concepts/estimates/`](../../master-plan/concepts/estimates/): the
  algorithms it needs (from a library of reusable algorithms with lines of
  code and difficulty), extra game code, assets by type and count, and a
  toddler learnability rating 1–5. A script computes code size, asset hours,
  effort days, risk and a start score (effort × learnability factor), writes
  an **Estimated plan** section on each page and generates the
  [development plan](../../master-plan/development-plan.md): all games sorted
  by effort, the 40 lowest start scores, a toddler-first list and the
  algorithm reuse table.
- **Limit:** the numbers are planning estimates for ordering work, not
  promises; the formula and the productivity constants are written down so
  they can be recalibrated after the first games ship.

### R68 — Toddler games for ages 1–3 and up

- **Solution:** a [toddler collection](../../master-plan/concepts/td.md) (30
  ideas for ages 1–3, co-play first) and a
  [preschool collection](../../master-plan/concepts/pk.md) (22 ideas for ages
  3–5), designed with the WHO and AAP screen-time guidance and the touch
  research in the [research note](data/research-raya-shacados.md#7-toddlers-and-screens-r68-r69).

### R71, R72 — Mobile-first GitHub Pages website

- **Existing components checked:** the existing Pages workflow for the
  example app; static site generators (rejected for now: one more dependency
  for a site that only renders this repository's Markdown and JSON).
- **Solution:** `scripts/build-site.mjs` renders every master-plan document,
  every idea page and a games explorer that searches and filters by
  collection, age, toddler rating, effort and art status and sorts by start
  score, effort, toddler rating or age, so the
  first game is easy to choose on a phone. The CSS is written for small
  screens first and widens at 640 px. The Pages workflow publishes the site
  at the root, with the example app under `example-app/`.
- **Verification:** `tests/site.test.js` builds the site and checks every
  page, the viewport tag, the 300 game cards and every relative link and
  anchor.

### R73–R75 — Shacados and its games

- **Solution:** [Shacados](../../master-plan/lore/shacados.md): rust, dust and
  junk, coal, oil and gas, dying forests and rivers, frozen regions, poverty
  and exploitation, and what keeps people human (R73). A
  [Shacados collection](../../master-plan/concepts/sh.md) of 16 ideas with
  image descriptions and prompts (R74). Spaceflight is a crude nuclear-pulse
  probe launched at the cost of a poisoned region of the planet — the
  [least advanced and most unsafe way](../../master-plan/lore/shacados.md#spaceflight--the-least-advanced-and-most-unsafe-way)
  that is still physically possible (R75).

### R76 — Descriptions now, images later

- **Solution:** the 84 new ideas (toddler, preschool, Raya life, Shacados)
  have four image descriptions and four generation prompts each, in the same
  job format as the existing art, plus 32 loading-screen prompts. Their pages
  originally said "art pending" and linked to the prompts. This original
  delivery boundary is resolved by [issue #3](../links-games-issue-3/README.md):
  all 84 now have four standalone illustrations in distinct visual styles,
  and all 32 loading backgrounds are generated and displayed on the website.
