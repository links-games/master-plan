# Core Infrastructure Plan

Covers requirements **R2, R3, R4, R5, R6, R10, R25** and **D1, D3, D6**.
Versions, licenses and sources for every library named here are in
[research-platforms-tech.md](../case-studies/issue-1/data/research-platforms-tech.md)
(snapshot 2026-10-15).

**Goal:** a new production-ready game takes a few days from a template,
not weeks. The game repository contains only the game's rules, art and
texts. Everything else — platforms, saves, monetization, experiments,
characters, CI/CD, AI pipeline — comes from shared packages and templates.

## 1. Repository map

All repositories are planned, **not yet created** (creating them is an
outward-facing action approved separately; see [roadmap](roadmap.md)
Phase 0).

| Repository                             | Type             | Contents                                                                               | License                |
| -------------------------------------- | ---------------- | -------------------------------------------------------------------------------------- | ---------------------- |
| `links-games/master-plan`              | docs (this repo) | Plan, case studies, templates source.                                                  | Unlicense              |
| `links-games/.github`                  | org config       | Reusable workflows (AI pipeline, CI, release, deploy), org profile, default templates. | Unlicense              |
| `links-games/game-core`                | pnpm monorepo    | `@links-games/*` packages (section 2).                                                 | Unlicense              |
| `links-games/lore`                     | content          | Canonical lore, character sheets, wisdom bank as LiNo + Markdown, i18n strings.        | CC0 text, ™ names      |
| `links-games/assets`                   | content          | Character art (SVG, Rive, Lottie, glTF), sounds, fonts, brand kit.                     | CC0 art, ™ characters  |
| `links-games/game-template-pixi-react` | template repo    | Default 2D game template (section 4).                                                  | Unlicense              |
| `links-games/game-template-phaser`     | template repo    | Physics/arcade 2D template.                                                            | Unlicense              |
| `links-games/game-template-r3f`        | template repo    | 3D template (three.js + React Three Fiber).                                            | Unlicense              |
| `links-games/<game>` (many)            | game             | One repository per game, created from a template.                                      | Unlicense / CC0 assets |
| `links-games/hub`                      | app              | One "Links Playground" app hosting all games (web, stores, Telegram main app).         | Unlicense              |
| `links-games/backend`                  | service          | Supabase schema/edge functions: profiles, saves, entitlements, leaderboards.           | Unlicense              |
| private `links-games/ops`              | private          | Ad unit IDs, store credentials, signing keys, experiment configs (never public).       | proprietary            |

Why one repository per game: the AI pipeline works best on small,
focused repositories (an issue maps to a few files), community members can
own a game, and each game has its own release cadence. The `hub` app
imports published game packages so the player still sees one universe.

## 2. `game-core` packages

Published to npm as `@links-games/<name>`, versioned with Changesets, built
with Vite library mode, documented in Storybook.

| Package        | Responsibility                                                                                                                       | Built on (existing libraries)                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `core`         | Game loop helpers, scene/state machine, deterministic RNG (daily seeds), save/load with migrations, settings, timers.                | React 19, Zustand, `lino-objects-codec` for LiNo saves            |
| `platform`     | One `Platform` interface + adapters (section 3).                                                                                     | `@capacitor/*`, `@tma.js/sdk`, `@vkontakte/vk-bridge`, Yandex SDK |
| `profile`      | One player profile across games: avatar, collection of Links, streak, progress, parental settings, cloud sync.                       | Supabase anonymous auth + platform storage                        |
| `monetization` | Entitlements (`supporter`, `no-ads`, `boost`), rewarded-ad facade, store catalog, generosity rules engine.                           | RevenueCat (Capacitor + Web Billing), Stars, VK votes, AdMob      |
| `experiments`  | Feature flags, remote config, A/B assignment, event tracking with a kids-safe schema.                                                | PostHog (self-hosted for kids builds), GrowthBook as alternative  |
| `learning`     | Learning objectives, spaced-repetition scheduler (1/3/7 days), difficulty adaptation (target 70–85% success), pre/post micro-checks. | own code (small)                                                  |
| `ui`           | Adorable React UI kit: buttons, dialogs, HUD, "Let's try again!" screens, parental gate, settings, accessibility.                    | React DOM over canvas, Motion, Storybook                          |
| `characters`   | Link characters as components (`<Linky mood="happy" />`), emotes, stickers, voice lines.                                             | Rive runtime (MIT), dotLottie, SVG                                |
| `audio`        | Music/sfx with mobile unlock, ducking, mute by default in public places setting.                                                     | Howler.js                                                         |
| `i18n`         | Strings shared across games (lore, UI), locale from platform, plural/ICU rules.                                                      | i18next + react-i18next, `lino-i18n`                              |
| `render-pixi`  | React bindings and helpers for 2D games.                                                                                             | PixiJS v8 + `@pixi/react`                                         |
| `render-three` | Helpers for 3D games.                                                                                                                | three.js + R3F + drei + Rapier                                    |
| `testing`      | Playwright fixtures for mobile viewports, visual snapshots, adorability checks, platform adapter mocks.                              | Playwright, test-anywhere                                         |
| `shells`       | Shell configs and scripts: PWA, Capacitor, Electron, Telegram, VK, portals; one command builds all.                                  | vite-plugin-pwa, Capacitor 8, Electron 44                         |

The packages follow the associative tech stack of `link-assistant/formal-ai`
where it fits: data that is stored or exchanged (saves, lore, character
graph, level definitions) uses **Links Notation (LiNo)** through
`links-notation` / `lino-objects-codec`, so the same data is readable by
formal-ai, by humans and by the games.

## 3. The `Platform` interface

Games never call a platform SDK directly. They call `platform.*`:

```js
// @links-games/platform — capability-based, every method is optional
const platform = await detectPlatform(); // web | capacitor | electron | telegram | vk | yandex | discord | crazygames | poki | playgama
platform.capabilities; // { ads, iap, subscriptions, cloudSave, leaderboard, share, haptics, kidsMode, ... }
await platform.ready(); // VKWebAppInit, LoadingAPI.ready(), Telegram ready(), ...
await platform.storage.get('save'); // CloudStorage / VKWebAppStorage / Preferences / localStorage
await platform.ads.rewarded({ placement: 'extra-hint' }); // returns { rewarded: boolean }
await platform.store.purchase('supporter-monthly'); // Stars / votes / IAP / Web Billing
platform.share({ text, image }); // shareMessage, VKWebAppShare, Web Share API
platform.haptics.light();
platform.locale; // feeds i18next
platform.lifecycle.on('pause', save); // gameplay start/stop for portals
```

| Adapter               | Shell / SDK                             | Payments             | Ads (off by default)         | Notes                                            |
| --------------------- | --------------------------------------- | -------------------- | ---------------------------- | ------------------------------------------------ |
| `web`                 | PWA (`vite-plugin-pwa`)                 | Web Billing (Stripe) | AdSense H5 Games Ads         | Also GitHub Pages / own domain / itch.io.        |
| `capacitor`           | Capacitor 8 (Android 24+, iOS 15+)      | RevenueCat IAP       | `@capacitor-community/admob` | Kids builds: no ads SDK linked at all.           |
| `electron`            | Electron 44 (+ `steamworks.js`)         | Steam / Web          | none                         | Steam page is paid "supporter edition" optional. |
| `telegram`            | `@tma.js/sdk`                           | Telegram Stars (XTR) | AdsGram / Monetag            | Validate `initData` on the backend.              |
| `vk`                  | `@vkontakte/vk-bridge`                  | VK votes             | VK ads                       | Needs a Russian legal entity/IE (see legal).     |
| `yandex`              | Yandex Games SDK                        | SDK purchases        | SDK ads                      | ≤100 MB, no external links.                      |
| `discord`             | `@discord/embedded-app-sdk`             | Discord SKUs         | none                         | URL mappings for the proxy.                      |
| `crazygames` / `poki` | portal SDKs                             | portal / none        | portal SDK                   | Avoid Poki's 7-year exclusivity deal.            |
| `playgama`            | Playgama Bridge (LGPL, loaded from CDN) | per portal           | per portal                   | Catch-all for the long tail of portals.          |

**`kidsMode` capability (D1):** when the profile says the player is under
13 (or the build is a kids build), the platform layer itself disables
third-party ads, personalized anything, external links and chat, routes
analytics to the self-hosted first-party endpoint with no identifiers, and
puts purchases and links behind a parental gate. Games cannot forget it,
because it is not their code.

## 4. Template repositories

`game-template-pixi-react` is the default. It grows from the
`examples/universal-app` already in this repository (React + Vite +
Capacitor + Electron + GitHub Pages), upgraded to React 19, Capacitor 8 and
Electron 44, plus:

```
game-template-pixi-react/
├─ src/
│  ├─ game/            # the only folder a new game must change: rules, levels
│  ├─ scenes/          # Title, Play, Result ("Let's try again!" / celebration)
│  ├─ lesson.lino      # the learning objective, in LiNo
│  └─ main.jsx         # createGame({ platform, profile, monetization, experiments })
├─ assets/             # game-specific art; characters come from @links-games/characters
├─ tests/              # unit + Playwright mobile screenshots + adorability checks
├─ shells/             # capacitor.config.json, electron/, telegram/, vk/ manifests
├─ .github/
│  ├─ workflows/ci.yml          # lint, test, build all shells, visual regression
│  ├─ workflows/deploy.yml      # Pages + portal zips + Telegram/VK web hosting
│  ├─ workflows/release.yml     # store builds (Fastlane/Gradle/Xcode) on tags
│  ├─ workflows/ai-solve.yml    # the AI pipeline caller (ai-pipeline.md)
│  ├─ ISSUE_TEMPLATE/           # game-idea, not-adorable, bug
│  └─ pull_request_template.md  # adorability + learning + legal checklist
├─ GAME.md             # one-page design: core loop, lesson, characters, legal notes
└─ LICENSE             # Unlicense
```

`GAME.md` and `lesson.lino` are written for both humans and formal-ai: a
new game is created by opening an issue with the
[game idea template](templates/ISSUE_TEMPLATE/game-idea.md), and the AI
pipeline fills in `src/game/` on a pull request.

## 5. CI/CD in every repository

| Workflow       | Trigger                                 | What it does                                                                                                                                                              |
| -------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`       | pull request, push, `workflow_dispatch` | ESLint, Prettier, unit tests, build web + Capacitor sync + Electron package, Playwright screenshots on 3 phone sizes, bundle-size budget (≤10 MB initial for portals/VK). |
| `deploy.yml`   | push to `main`                          | GitHub Pages (web/PWA, also the Telegram and VK Mini App URL), portal zips as artifacts.                                                                                  |
| `release.yml`  | tag / Changesets                        | npm publish (`game-core`), Android AAB + iOS IPA builds, Electron installers, store upload when secrets exist.                                                            |
| `ai-solve.yml` | issues, comments, reviews, schedule     | Latest formal-ai via hive-mind, same-PR restarts ([ai-pipeline.md](ai-pipeline.md)).                                                                                      |
| `links.yml`    | pull request                            | Broken link check (as in this repository).                                                                                                                                |

The CI/CD conventions already used in this repository (from the
`link-foundation` JavaScript template: Changesets, lychee, file-size
limits, actionlint, secretlint) are kept as the base of `links-games/.github`.

## 6. Quality gates

1. **Adorability gate (R14):** Storybook stories for every character state
   and every screen, Playwright `toHaveScreenshot()` on phone viewports, the
   [checklist](lore/adorability-gate.md) in every pull request. An
   "adorability bug" is a normal bug with a label and a template.
2. **Learning gate (R17, D7):** each game declares one objective in
   `lesson.lino`; CI fails if it is missing; `@links-games/learning` logs
   pre/post micro-check results (anonymous, aggregate).
3. **Generosity gate (R24):** `@links-games/monetization` enforces the
   [generosity charter](monetization.md) in code (for example no ad offer in
   the first sessions); tests assert it.
4. **Kids-safety gate (D1):** a kids build is tested to contain no ad or
   third-party analytics SDK (bundle scan in CI).
5. **Performance:** first load ≤ 3 s on a mid-range phone over 4G; 60 fps
   target, 30 fps floor; works offline after the first load (PWA).

## 7. Experiments (R25, D6)

Every mechanic exists from day one but ships **off**, behind remote flags:

| Mechanic             | Flag                    | Default                        |
| -------------------- | ----------------------- | ------------------------------ |
| Rewarded ads         | `ads.rewarded.enabled`  | off                            |
| Interstitial ads     | `ads.interstitial`      | off (never in kids mode)       |
| Supporter offer      | `offer.supporter.after` | session 10 / day 7             |
| Hints / boosts store | `store.boosts.enabled`  | off                            |
| Daily puzzle         | `daily.enabled`         | on                             |
| Streaks              | `streak.mode`           | `kind` (freeze days, no shame) |
| Cross-promo of games | `hub.crossPromo`        | on                             |

Experiments are assigned by `@links-games/experiments` (PostHog flags);
results are read on retention (D1/D7/D30), learning gain and revenue
together, so no experiment can "win" by hurting players or learning.

## 8. Backend

Start with **Supabase** (free tier, open source, self-hostable): anonymous
auth, `profiles`, `saves`, `entitlements` (synced from RevenueCat, Stars and
votes webhooks), `leaderboards`, `daily_seeds`. Telegram `initData` and VK
launch params are verified in edge functions. Real-time multiplayer
(Nakama or Colyseus) is added only when a game needs it.
