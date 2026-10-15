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

## Summary

| ID      | Requirement (short)                     | Solution in one line                                                                           | Status in this PR        |
| ------- | --------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------ |
| R1      | Lots of mobile-first mini games         | Waves of small games from templates; mobile viewports first                                    | Planned (catalog, waves) |
| R2      | Web, mobile, Telegram, VK, …            | One Vite build + thin shells + `Platform` adapters                                             | Planned                  |
| R3      | Game-core library                       | `@links-games/*` packages in a pnpm monorepo                                                   | Planned                  |
| R4      | Template repositories                   | GitHub template repos per genre, starting from `examples/universal-app`                        | Planned                  |
| R5      | React + JS + Capacitor + Electron       | React 19 + JavaScript (JSDoc), Capacitor 8, Electron 44                                        | Planned                  |
| R6      | Use formal-ai                           | formal-ai as the pipeline brain; LiNo for game data                                            | Templates done           |
| R7      | Issue → latest formal-ai → PR           | Reusable workflow: `formal-ai:latest` + hive-mind `solve`                                      | Templates + tests done   |
| R8      | PR created the hive-mind way            | hive-mind `solve` opens and continues the draft PR                                             | Templates + tests done   |
| R9      | Restartable on the same PR              | New events (`/retry`, reviews, labels, schedule) keyed to the same target                      | Templates + tests done   |
| R10     | Detailed core infrastructure plan       | [infrastructure.md](../../master-plan/infrastructure.md)                                       | Done                     |
| R11     | Popular, legally reimplementable games  | Ranked catalog with "avoid" notes per game                                                     | Done                     |
| R12     | Lore core from linksplatform            | World of Omi built from Links Theory                                                           | Done                     |
| R13     | Cute for toddlers, children, adults     | Primitive shapes, chibi first, age tiers                                                       | Done                     |
| R14     | Not adorable = bug                      | Adorability gate checklist, label, template, visual tests                                      | Done (gate), CI planned  |
| R15     | One universe                            | Shared lore, profile, collection, hub app                                                      | Planned                  |
| R16     | Wisdom and lessons in the lore          | Wisdom bank linked to games                                                                    | Done                     |
| R17     | Fun + learning                          | One learning objective per game, `learning` package                                            | Planned                  |
| R18     | Simplest games first                    | Wave 1 ordered by complexity                                                                   | Done                     |
| R19     | Open source, public domain              | Unlicense code, CC0 assets, trademarks kept                                                    | Done (policy)            |
| R20     | Do not advertise it much                | License in repo and About screen only                                                          | Done (policy)            |
| R21     | Free to play + custom subscriptions     | Supporter tier with cosmetic perks; entitlement model                                          | Planned                  |
| R22     | Ad-free at start                        | Ads SDKs off by flag; kids builds link none                                                    | Planned                  |
| R23     | Ads/subscriptions give advantages       | Opt-in rewarded ads and boosts, all earnable for free                                          | Planned (Phase 3)        |
| R24     | More generous than competitors          | Public generosity charter enforced in code                                                     | Done (charter)           |
| R25     | All mechanics in place for experiments  | Every mechanic behind a remote flag; PostHog experiments                                       | Planned                  |
| R26     | Big global community                    | Channels, growth loops, AI-assisted contributions                                              | Planned                  |
| R27     | Hiring when budget allows               | Hiring order and rules                                                                         | Planned                  |
| R28     | Donations, merch                        | Sponsors/Open Collective/Ko-fi; print-on-demand; licensing                                     | Planned                  |
| R29     | Profitable, attract capital             | Unit economics, break-even, capital instruments                                                | Planned                  |
| R30     | Own anime characters in many styles     | Chibi 2D, normal anime 2D, 3D, anime hosts                                                     | Done (bible)             |
| R31–R35 | Case study, requirements, plans, one PR | This folder and PR #2                                                                          | Done                     |
| D1–D7   | Derived requirements                    | Kids privacy, legal checklist, shared identity, moat, AI cost, safe analytics, learning design | Done (plans)             |

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
