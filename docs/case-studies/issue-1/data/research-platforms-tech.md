# Research: Distribution Platforms, Game Tech and Services (2025-2026)

> Part of the case study for [links-games/master-plan#1](https://github.com/links-games/master-plan/issues/1).
> Snapshot date: **2026-10-15**. GitHub stars, licenses and release tags were pulled live with `gh api repos/<owner>/<repo>`; npm versions with `npm view <pkg> version`. All other facts link to their source. Where a source is third-party or marketing material, the row says so ("unverified"). Re-check prices, fees and policies before you rely on them, because they change often.

Goal: lots of mobile-first mini games built with **React + JavaScript**, sharing a **game-core** library and **template repositories**. The same build should ship as PWA, Capacitor (Android/iOS), Electron (desktop/Steam), Telegram Mini App, VK Mini App, web portals (Yandex, Poki, CrazyGames, ...) and Discord Activity. Monetization is free-to-play: optional subscriptions, opt-in rewarded ads (ad-free at launch) and donations. A/B tests, remote config and feature flags must exist from day one.

---

## 1. Distribution targets and their SDKs

### 1.1 Summary matrix

| Target | Wrapper / SDK (current) | Payments for digital goods | Ads | Key constraints | Sources |
|---|---|---|---|---|---|
| **Web / PWA** | `vite-plugin-pwa` 2.0.0 (MIT) | Any processor (Stripe, RevenueCat Web Billing, ...) | AdSense **H5 Games Ads** (Ad Placement API `adBreak()`), approval required | Service worker plus manifest; reward must not have monetary value | [vite-pwa](https://github.com/vite-pwa/vite-plugin-pwa), [H5 Games Ads](https://adsense.google.com/start/h5-games-ads/), [Ad Placement API](https://developers.google.com/ad-placement), [reward policy](https://support.google.com/publisherpolicies/answer/11975916) |
| **Android via TWA** | Bubblewrap CLI 1.27.0 (Apache-2.0), PWABuilder | Play Billing for digital goods in Play-distributed apps | Web ads inside TWA | Digital Asset Links `/.well-known/assetlinks.json` is required, or the app shows a URL bar | [bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap), [web.dev TWA](https://web.dev/using-a-pwa-in-your-android-app) |
| **Android/iOS native shell** | **Capacitor 8** (`@capacitor/core` 8.5.3, MIT, ~16.9k stars) | Google Play Billing / Apple IAP via RevenueCat or cordova-plugin-purchase | AdMob via `@capacitor-community/admob` 8.2.1 | Node 22+, Xcode 26, iOS 15+, Android API 24+, compile/target SDK 36 | [Capacitor support policy](https://capacitorjs.com/docs/next/main/reference/support-policy), [env setup](https://capacitorjs.com/docs/next/getting-started/environment-setup), [Capawesome v8 upgrade](https://capawesome.io/blog/how-to-upgrade-your-capacitor-app-to-capacitor-8) |
| **Desktop** | **Electron 44** (44.7.2, MIT, ~123k stars); alt. **Tauri 2** (CLI 2.12.3, Apache-2.0/MIT, ~112k stars; v3 in alpha) | Store-specific (Steam, MS Store) or web | n/a (Steam disallows typical web ads in practice) | Electron ships a new major every 8 weeks and supports the latest 3 majors | [Electron timelines](https://electronjs.org/docs/tutorial/electron-timelines), [tauri releases](https://github.com/tauri-apps/tauri/releases) |
| **Steam** | Electron + `steamworks.js` 0.4.0 (MIT, last publish 2024-08) | Steam Wallet; 30% default, 25%/20% at higher revenue tiers (secondary sources) | n/a | $100 Steam Direct fee per app, recoupable after $1,000 revenue (secondary); Steam overlay in Electron is flaky | [steamworks.js npm](https://www.npmjs.com/package/steamworks.js), [presskit.gg](https://presskit.gg/field-guides/how-much-does-steam-take), [GDevelop overlay thread](https://forum.gdevelop.io/t/steam-overlay-and-leaderboards/60725) |
| **Telegram Mini Apps** | `telegram-web-app.js` + **`@tma.js/sdk`** 3.3.0 / `@tma.js/sdk-react` (MIT). The older `@telegram-apps/sdk` 3.11.8 was last published 2025-12 | **Telegram Stars (XTR) only** for digital goods; Stars subscriptions (fixed 30 days, max 10,000 Stars) | Third-party: **AdsGram**, **Monetag**, TADS (no official Telegram ad rev-share for Mini Apps found) | Validate `initData` server-side (HMAC with bot token, or Ed25519 for third parties); Bot API 10.1 (2026-06) | [webapps](https://core.telegram.org/bots/webapps), [payments-stars](https://core.telegram.org/bots/payments-stars), [Star subscriptions](https://core.telegram.org/api/subscriptions), [tma.js migration](https://docs.telegram-mini-apps.com/packages/tma-js-sdk/migrate-from-telegram-apps) |
| **VK Mini Apps / VK games** | `@vkontakte/vk-bridge` 3.0.2 (MIT) | **Votes** for virtual goods (one-off or subscription); real money only for real/digital goods through a CBR-licensed processor; votes and money cannot be mixed | VK Ad Network: rewarded, interstitial, banner via bridge | Creator must be an IE, self-employed person or legal entity (Russia); real ads/payments only after moderation | [VK monetization](https://dev.vk.ru/en/mini-apps/monetization/overview), [VK Bridge](https://dev.vk.ru/en/bridge/getting-started), [vk-bridge repo](https://github.com/VKCOM/vk-bridge) |
| **Yandex Games** | Yandex Games SDK (`ysdk`) | SDK purchases only; no external purchases | SDK ads only (fullscreen, rewarded, sticky banner) | Max 100 MB uncompressed; `LoadingAPI.ready()`; `GameplayAPI.start/stop`; auto language detection; no external links | [Yandex requirements (updated 2026-10-09)](https://yandex.com/dev/games/doc/en/concepts/requirements) |
| **Poki** | PokiSDK | n/a (ads-driven) | Poki SDK ads | Web Exclusive deal: 7-year open-web exclusivity, 50% on Poki-referred traffic, 100% on traffic you bring. Third-party guide says <8 MB initial download (unverified) | [sdk.poki.com/deals](https://sdk.poki.com/deals), [new requirements](https://sdk.poki.com/new-requirements), [Cinevva guide](https://app.cinevva.com/guides/publish-game-poki) |
| **CrazyGames** | CrazyGames SDK v3 | In-game purchases supported (split unpublished) | SDK ads only | Initial download ≤50 MB (≤20 MB for mobile homepage), total ≤250 MB, ≤1,500 files; 2-week Basic Launch without monetization | [technical requirements](https://docs.crazygames.com/requirements/technical), [intro](https://docs.crazygames.com/requirements/intro/) |
| **GameDistribution** | GD HTML5 SDK | n/a | GD ads (rev-share) | No current official split found; historic complaints about late payouts (2017-2020) | [html5gamedevs thread](https://html5gamedevs.com/topic/32413-gamedistributioncom-offers-revenue-share) |
| **Facebook Instant Games** | Instant Games SDK v8.0 ("Zero Permissions") | Meta IAP | Meta Audience Network | Web/Canvas games sunset 2026-09-30; games created since 2025-08-01 must use Zero Permissions | [Meta blog 2025-07-31](https://developers.facebook.com/blog/post/2025/07/31/web-and-instant-games-changes/), [migration guide](https://developers.facebook.com/documentation/games/build/zero-permissions/onboarding-and-migration/canvas-game-migration) |
| **Discord Activities** | `@discord/embedded-app-sdk` 2.5.0 (MIT, ~1.4k stars) | Discord SKUs (durable, consumable, subscriptions) via `startPurchase()`; validate with the HTTP API | n/a | Runs in a sandboxed iframe behind Discord's proxy; CSP blocks unmapped URLs (use `patchUrlMappings`); IAP initially US/UK/EU desktop | [IAP for Activities](https://docs.discord.com/developers/monetization/implementing-iap-for-activities), [networking](https://docs.discord.com/developers/activities/development-guides/networking), [PocketGamer.biz](https://www.pocketgamer.biz/discord-activities-opens-up-to-all-developers-to-make-games-on-the-platform) |
| **YouTube Playables** | Playables SDK (after onboarding) | n/a | YouTube | Invite/onboarding plus certification test suite | [certification requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements) |
| **itch.io** | Upload HTML5 zip | Pay-what-you-want or donations; open revenue sharing, default 10%, adjustable 0-100% | none | Easiest "donations" channel | [itch.io open revenue sharing](https://itch.io/updates/open-revenue-sharing) |
| **Google Play** | Capacitor / TWA | Play Billing: 15% on auto-renewing subscriptions; 15% on first $1M per year for other digital sales, then 30% | AdMob etc. | $25 one-time registration; new apps/updates must target **API 36** from 2026-08-31 (extension to 2026-11-01) | [Play service fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en), [target SDK](https://developer.android.com/google/play/requirements/target-sdk) |
| **Apple App Store** | Capacitor | IAP: 15% under Small Business Program (<$1M per year), otherwise 30%. US link-outs to web checkout allowed since 2025-05-01 (litigation ongoing) | AdMob etc. (with ATT) | $99 per year; Kids Category rules (see 1.4) | [Small Business Program](https://apple.co/32XwvWV), [MacRumors 2025-04-30](https://macrumors.com/2025/04/30/apple-app-store-anti-steering-injunction-violation), [AppleInsider 2026-03](https://appleinsider.com/articles/26/03/30/the-epic-vs-apple-case-wont-get-a-rehearing-for-app-store-fees) |

### 1.2 Telegram Mini Apps: details

- **Official docs:** <https://core.telegram.org/bots/webapps>. The latest Mini App changes are in Bot API 10.1 (2026-06-11). Platform features useful for games:
  - fullscreen in portrait or landscape, with safe-area insets (8.0)
  - home-screen shortcuts (8.0)
  - accelerometer, gyroscope and device orientation (8.0)
  - haptics (6.1)
  - `CloudStorage` (up to 1024 keys per user, 6.9), `DeviceStorage` (5 MB, 9.0) and `SecureStorage` (Keychain/Keystore, 9.0)
  - `shareMessage` (8.0), `shareToStory` (7.8), emoji status (8.0)
  - `openInvoice` (6.1); Stars subscriptions and gifts (8.0)
  - launch via direct link `t.me/<bot>/<app>?startapp=...` or as the bot's Main Mini App
- **Stars requirement:** "Payments for digital goods and services must be carried out exclusively in Telegram Stars". Currency is `XTR`. Telegram says this is required by Apple and Google store rules. Refunds go through `refundStarPayment`. The bot must answer `/paysupport`. ([payments-stars](https://core.telegram.org/bots/payments-stars))
- **Stars subscriptions:** `subscription_period` must be 2592000 seconds (30 days); price ≤ 10,000 Stars. ([telegram.js.org CreateInvoiceLinkParams](https://telegram.js.org/docs/types/CreateInvoiceLinkParams/), [core.telegram.org/api/subscriptions](https://core.telegram.org/api/subscriptions))
- **Payout:** Stars are withdrawn through Fragment to TON. Third-party sources report a 21-day hold, a 1,000-Star minimum and about $0.013 per Star (unverified). ([InviteMember](https://blog.invitemember.com/withdraw-telegram-stars-and-convert-them-to-ton-in-2024), [launch blog](https://telegram.org/blog/telegram-stars))
- **SDK naming:** the community SDK moved from `@telegram-apps/*` to `@tma.js/*`; a migration guide exists. GitHub repo: [Telegram-Mini-Apps/tma.js](https://github.com/Telegram-Mini-Apps/tma.js) (~1.2k stars, MIT). ([migration guide](https://docs.telegram-mini-apps.com/packages/tma-js-sdk/migrate-from-telegram-apps))
- **Ads:**
  - **AdsGram** is a TON-ecosystem ad network built for Mini Apps. It offers rewarded video, interstitial and "task" formats, and pays in USDT on TON with a $100 minimum (competitor-written comparison). ([adsgram.ai](https://adsgram.ai), [docs.adsgram.ai](https://docs.adsgram.ai/), [Cointelegraph](https://cointelegraph.com/news/telegram-adsgram-launch-devs-earn-ton-ads))
  - **Monetag** offers Rewarded Interstitials for TMA (launched November 2024). ([HackerNoon PR](https://sia.hackernoon.com/monetag-unveils-new-monetization-option-for-telegram-mini-apps-via-rewarded-interstitial-ads))
  - **TADS** is another option. ([tads.me](https://tads.me/blog/monetize-telegram-mini-app))

### 1.3 VK Mini Apps: details

- Bridge methods confirmed in [`vk-bridge` source types](https://github.com/VKCOM/vk-bridge/blob/master/packages/core/src/types/data.ts):
  - lifecycle: `VKWebAppInit`
  - ads: `VKWebAppShowNativeAds` / `VKWebAppCheckNativeAds` (rewarded/interstitial), `VKWebAppShowBannerAd` / `VKWebAppCheckBannerAd` / `VKWebAppHideBannerAd`
  - payments: `VKWebAppShowOrderBox` (votes purchase), `VKWebAppShowSubscriptionBox`
  - storage: `VKWebAppStorageSet/Get/GetKeys`
  - social: `VKWebAppShowLeaderBoardBox`, `VKWebAppShowInviteBox`, `VKWebAppShare`, `VKWebAppShowStoryBox`, `VKWebAppRecommend`, `VKWebAppAddToFavorites`, `VKWebAppAddToHomeScreen`
  - haptics: `VKWebAppTaptic*`
- `VKWebAppInit` must be sent within 30 s of start. ([VK Bridge getting started](https://dev.vk.ru/en/bridge/getting-started))
- Monetization rules:
  - Virtual goods are sold for **votes** only.
  - A mini app cannot use votes and real money at the same time.
  - Ads and sales can be combined.
  - "Remove ads for votes" is explicitly suggested.
  - Ad income is withdrawable after a 10-day delay.
  - ([VK monetization overview](https://dev.vk.ru/en/mini-apps/monetization/overview))
- VK's HTML5 "Direct Games" announcement mentions a ≤10 MB starting size and votes-based IAP (date unclear). ([vk.ru/blog/direct-games](https://vk.ru/blog/direct-games))

### 1.4 App stores: kids, privacy and age rules

| Rule | What it means for us | Source |
|---|---|---|
| **COPPA (amended 2025)** | Published 2025-04-22, effective 2025-06-23, full compliance due **2026-04-22**. Applies to services directed to under-13s or with actual knowledge | [Davis Polk](https://www.davispolk.com/insights/client-update/ftc-prioritizes-coppa-enforcement-new-compliance-obligations-take-effect), [Finnegan](https://www.finnegan.com/en/insights/articles/coppas-amended-rule-is-now-in-full-effect-what-operators-need-to-know.html) |
| **GDPR Art. 8 ("GDPR-K")** | Default age of digital consent is 16; member states may lower it to 13 (IE/UK 13, FR 15, IT 14, AT/CZ/HU 16) | [CPD UK comparison](https://www.cpduk.co.uk/news/protection-children-data-protection-law-comparative-analysis-eu-gdpr-and-uk-gdpr) |
| **UK Age Appropriate Design Code** | Applies when under-18s are *likely* to access the service; 15 standards, privacy by default | [Bird & Bird](https://twobirds.com/insights/2020/uk/icos-publishes-age-appropriate-design-code) |
| **Google Play Families** | Apps targeting children must use **Families Self-Certified Ads SDKs** only; mixed-audience apps need a neutral age screen | [Families Self-Certified Ads SDK Policy](https://support.google.com/googleplay/android-developer/answer/12918983), [Families ads program](https://support.google.com/googleplay/android-developer/answer/9283445) |
| **Apple Kids Category (1.3 / 5.1.4)** | No third-party analytics or ads in kids apps unless there is explicit parental consent; ads must be human-reviewed; parental gates; **Declared Age Range API** | [developer.apple.com/kids](https://developer.apple.com/kids/), [GoodBarber summary](https://www.goodbarber.com/help/apple-rejection-r100/apple-rejection-apps-for-kids-a365/), [Help Net Security 2026-02](https://www.helpnetsecurity.com/2026/02/25/apple-expands-age-verification-controls/) |
| **Apple Mini Apps Partner Program (Nov 2025)** | 15% commission for IAP in hosted HTML5/JS mini apps or games inside a host app. Requires Advanced Commerce API and Declared Age Range API; guideline 4.7 covers HTML5 mini games. **Relevant if we ship one "hub" app containing many mini games** | [TechCrunch](https://techcrunch.com/2025/11/13/apple-halves-commissions-for-mini-app-makers/), [RevenueCat](https://revenuecat.com/blog/engineering/apple-mini-apps-partner-program) |
| **AdMob consent** | A Google-certified CMP (e.g. UMP) is required for EEA/UK/CH since January 2024 | [Capgo](https://capgo.app/blog/admob-gdpr-consent-capacitor/) |

**Implication:** our audience includes toddlers and children. Kids-facing builds therefore need a **"kids mode" privacy profile**: no third-party ads (or only certified SDKs, non-personalized), first-party or self-hosted analytics only, parental gate before purchases and links. Bake this into game-core as a capability flag, not into individual games.

### 1.5 Multi-platform bridge libraries

| Library | License | Platforms | Features | Notes | Source |
|---|---|---|---|---|---|
| **Playgama Bridge** (`@playgama/bridge` 2.3.1) | **LGPL-3.0** (~121 stars) | 24 incl. Yandex, CrazyGames, Poki, GameDistribution, Facebook, Discord, Telegram, VK, OK, YouTube, Reddit, TikTok, MS Store, MSN, GameSnacks, Samsung, Huawei, Xiaomi, JioGames, Y8, Lagged | Ads (interstitial/rewarded/banner), IAP with one catalog, cloud storage, leaderboards, achievements, remote config, analytics | Loaded from CDN; only the current platform adapter downloads. LGPL is fine if used as a separate, dynamically loaded library | [github.com/Playgama/bridge](https://github.com/Playgama/bridge) |
| **GamePush** | Proprietary SaaS | ~two dozen incl. Yandex, VK, OK, Telegram | Cloud saves (<1 MB), leaderboards, ads, purchases, auth | Free tier ~50k requests/month (homepage claim) | [docs.gamepush.com](https://docs.gamepush.com/docs/get-start/), [cloud saves](https://docs.gamepush.com/docs/player/cloud-saves/) |

**Recommendation:** write our own thin `Platform` interface in game-core with adapters (`web`, `capacitor`, `electron`, `telegram`, `vk`, `yandex`, `discord`, `crazygames`, `poki`). Add a `playgama` adapter as a catch-all for the long tail of portals. This keeps the game code free of platform SDK calls.

---

## 2. Game libraries for JS/React

GitHub stats are live from `gh api` on 2026-10-15.

| Library | Latest | License | Stars | React integration | Mobile-web suitability | Notes |
|---|---|---|---|---|---|---|
| [Phaser](https://github.com/phaserjs/phaser) | **v4.2.1** (2026-07) | MIT | ~40.5k | Official [template-react](https://github.com/phaserjs/template-react) (React UI + Phaser canvas via EventBus) | Very good: full 2D engine (scenes, input, tilemaps, arcade/matter physics, audio, loader) | Phaser 4 (first released 2026-04-10) has a new RenderNode WebGL renderer, auto-recovery from context loss, and unified filters. Most v3 code ports with small changes. ([Phaser 4 renderer](https://phaser.io/news/2026/04/phaser-4-renderer-faster-cleaner-and-built-for-modern-games), [v3 vs v4](https://phaser.io/news/2026/05/phaser-3-vs-phaser-4)) |
| [PixiJS](https://github.com/pixijs/pixijs) | **v8.22.0** | MIT | ~48.4k | [`@pixi/react`](https://github.com/pixijs/pixi-react) v8.0.5 (React 19, JSX for Pixi objects) | Excellent 2D renderer (WebGL/WebGPU); you add game loop, physics and audio yourself | Best fit for a "React-first" game-core |
| [KAPLAY](https://github.com/kaplayjs/kaplay) | 3001.0.19 (4000 in alpha) | MIT | ~1.8k | none (imperative) | Good for tiny arcade games, beginner-friendly | Fork of Kaboom.js |
| [Excalibur](https://github.com/excaliburjs/Excalibur) | v0.32.0 | BSD-2-Clause | ~2.4k | none | Good, TypeScript-first | Still pre-1.0 |
| [three.js](https://github.com/mrdoob/three.js) | r186 | MIT | ~116k | [react-three-fiber](https://github.com/pmndrs/react-three-fiber) v9.8 (~33k, React ≥19 <19.4) + [drei](https://github.com/pmndrs/drei) v10.7 (~10k) | Good with care (draw calls, texture sizes) | De facto web 3D |
| [Babylon.js](https://github.com/BabylonJS/Babylon.js) | 9.30/9.31 | Apache-2.0 | ~26k | community `react-babylonjs` | Good, heavier bundle | Full 3D engine incl. physics/GUI |
| [PlayCanvas](https://github.com/playcanvas/engine) | v2.23.2 | MIT | ~17k | `@playcanvas/react` 0.11 | Very good (mobile-optimized) | Optional cloud editor |
| [matter.js](https://github.com/liabru/matter-js) | 0.20.0 (npm last publish 2024-06) | MIT | ~18.5k | n/a | OK for simple 2D physics | Slow release cadence |
| [Rapier](https://github.com/dimforge/rapier) (`@dimforge/rapier2d-compat`/`3d-compat` 0.21.0) | 0.21.0 (2026-09) | Apache-2.0 | ~5.9k | `@react-three/rapier` | Fast WASM; deterministic option | JS bindings moved from the archived `rapier.js` into the main repo |
| [Howler.js](https://github.com/goldfire/howler.js) | 2.2.4 (npm 2023-09) | MIT | ~25k | n/a | Handles mobile audio unlock and sprites | Stable but little maintenance |
| [Motion](https://github.com/motiondivision/motion) (ex Framer Motion) | 14.2.0 | MIT | ~34k | native React | UI and menu animation | Truly open source |
| [GSAP](https://github.com/greensock/GSAP) | 3.15.0 | **Proprietary "no charge" Standard License** (Webflow) | ~29k | `@gsap/react` | Excellent | Free incl. former Club plugins since 2025, but **not OSI open source**. It also bans use in visual animation tools competing with Webflow. ([license](https://gsap.com/community/standard-license/), [Webflow](https://webflow.com/blog/gsap-becomes-free)) |
| [lottie-web](https://github.com/airbnb/lottie-web) / `@lottiefiles/dotlottie-web` 0.81 | 5.13.0 | MIT | ~32k | `@lottiefiles/dotlottie-react` | Good for UI stickers and emotes | lottie-web has had little maintenance; dotLottie (WASM ThorVG) is active |
| [Rive](https://github.com/rive-app/rive-wasm) | 2.44.2 | Runtimes MIT | ~1k | `@rive-app/react-canvas` | Excellent: state machines make interactive cute characters cheap | Editor is free but exports need a paid plan (Cadet $9/month since October 2025). ([Rive blog](https://framer.rive.app/blog/rive-s-new-9-mo-plan)) |
| [Spine runtimes](https://github.com/EsotericSoftware/spine-runtimes) | 4.3.13 (`spine-pixi-v8`, `spine-phaser-v4`) | **Spine Runtimes License** (needs a Spine Editor license) | ~5.3k | via Pixi/Phaser | Industry standard 2D skeletal animation | Incompatible with a fully public-domain or open distribution story. ([LICENSE](https://raw.github.com/EsotericSoftware/spine-runtimes/master/LICENSE)) |

**Picks for "lots of simple, cute, mobile-first games in React":**

- **2D default:** PixiJS v8 + `@pixi/react`. The scene is declared in React and state lives in React/Zustand, which suits puzzle, idle and casual games.
- **2D action/physics-heavy:** Phaser 4 inside a React shell, using the official React template pattern.
- **3D:** three.js + R3F + drei, with Rapier physics.
- **Character animation:** Rive (MIT runtime) for interactive cute mascots; dotLottie for stickers and UI. Avoid Spine and GSAP if license purity matters.

---

## 3. Cross-cutting game services

### 3.1 Monetization

| Need | Option | License / pricing | Notes | Source |
|---|---|---|---|---|
| IAP + subscriptions (Capacitor) | **RevenueCat** `@revenuecat/purchases-capacitor` 13.7.4 | SDK MIT; service free to $2,500 MTR, then 1% | Also offers `@revenuecat/purchases-js` for **Web Billing** (Stripe-backed), giving one entitlement system across web and mobile | [repo](https://github.com/RevenueCat/purchases-capacitor), [pricing](https://www.revenuecat.com/pricing/) |
| IAP (self-hosted alternative) | **cordova-plugin-purchase** / `capacitor-plugin-cdv-purchase` 13.19.1 | MIT; optional Iaptic receipt validation | Native Capacitor implementation; Apple, Google, Braintree | [repo](https://github.com/j3k0/cordova-plugin-purchase) |
| Rewarded ads (native) | **`@capacitor-community/admob`** 8.2.1 | MIT | Banner, interstitial, rewarded, rewarded-interstitial, app-open; UMP consent + ATT helpers; Capacitor 8.5+, iOS 15+, Android 24+ | [repo](https://github.com/capacitor-community/admob), [Capacitor ads guide](https://capacitorjs.com/docs/guides/ads) |
| Mediation (AppLovin MAX / Unity Ads) | No maintained Capacitor plugin found (a Unity Ads community plugin is beta, interstitial only, stale since 2023) | n/a | Would need a custom native plugin. Start with AdMob (which has its own mediation) | [capacitor-plugin-unityads](https://awesome.ecosyste.ms/projects/github.com%2Fopenanime%2Fcapacitor-plugin-unityads) |
| Web rewarded ads | AdSense H5 Games Ads (`adBreak` with `type: 'reward'`) | Rev-share; approval required | Rewards must have no monetary value | [Ad Placement API](https://developers.google.com/ad-placement/apis) |
| Telegram | Stars (XTR) + AdsGram / Monetag | see 1.2 | | |
| VK | Votes + VK ads | see 1.3 | | |
| Donations | itch.io PWYW, GitHub Sponsors, Open Collective, Boosty/Patreon | | | [itch.io](https://itch.io/updates/open-revenue-sharing) |

### 3.2 Analytics, remote config, feature flags, A/B tests

| Tool | License / hosting | Free tier | Fit | Source |
|---|---|---|---|---|
| **PostHog** (~40k stars) | MIT core (outside `ee/`), self-host or cloud; `posthog-js` 1.438 | ~1M events + 1M flag requests/month, 5k session replays (third-party summaries) | **Analytics + feature flags + experiments + remote config + surveys in one SDK**; good for web, Capacitor and Electron | [repo](https://github.com/PostHog/posthog), [pricing](https://posthog.com/pricing), [flexprice summary](https://flexprice.io/blog/posthog-pricing-guide) |
| **GrowthBook** (~8.5k) | MIT core plus enterprise dirs; self-host or cloud; SDK `@growthbook/growthbook` 1.8 (MIT) | Self-host unlimited (core) | Warehouse-native experiments; flags evaluated locally in the SDK (no network per check) | [repo](https://github.com/growthbook/growthbook) |
| **Unleash** (~13.9k) | Server **AGPL-3.0**; client SDKs Apache-2.0 | Self-host | Mature feature flags; experiments are weaker | [repo](https://github.com/Unleash/unleash) |
| **Firebase** Remote Config + A/B Testing + Analytics | Proprietary SaaS; JS SDK `firebase` 13.0 (Apache-2.0); Capacitor plugins `@capacitor-firebase/*` 8.5 | Free (Spark) | **A/B Testing for web launched 2026-03**; strong on mobile; less suitable for kids-mode privacy | [Firebase blog](https://firebase.blog/posts/2026/03/ab-testing-for-web), [docs](https://firebase.google.com/docs/remote-config/abtest-config) |
| **GameAnalytics** | Proprietary SaaS; `gameanalytics` npm 5.0.0 (MIT SDK) | Free core | Game-specific KPIs (retention, progression, resource sinks) | [GamesBeat](https://gamesbeat.com/gameanalytics-goes-free-for-developers/) |

### 3.3 Backend, multiplayer, saves, leaderboards

| Tool | License | Notes | Source |
|---|---|---|---|
| **Supabase** (~112k stars), `@supabase/supabase-js` 2.117 | Apache-2.0, self-hostable | Auth (anonymous plus social), Postgres with RLS, edge functions, realtime. Cloud saves and leaderboards are a few tables. Free: 50k MAU, 500 MB DB, 5 GB egress, pauses after 1 week inactive, 2 projects. Pro from $25/month | [pricing](https://supabase.com/pricing) |
| **Nakama** (Heroic Labs, ~13.5k) v3.41 | Apache-2.0; JS client `@heroiclabs/nakama-js` 2.8 (Apache-2.0) | Purpose-built game server: accounts, social, leaderboards, tournaments, storage (cloud saves), matchmaking, chat, server-authoritative runtime (Go/TS/Lua). Heroic Cloud is managed | [repo](https://github.com/heroiclabs/nakama), [docs](https://heroiclabs.com/docs/nakama/getting-started/) |
| **Colyseus** (~7.4k) 0.18 (SDK `@colyseus/sdk` 0.18.5) | MIT | Authoritative real-time rooms with state sync. 0.17 added auto-reconnect and full-stack TS; Colyseus Cloud is managed | [repo](https://github.com/colyseus/colyseus), [0.17 blog](https://colyseus.io/blog/colyseus-017-is-here/) |
| Platform-native | Telegram `CloudStorage`, VK `VKWebAppStorage*`, Yandex player data, Steam Cloud, Game Center / Play Games (`@openforge/capacitor-game-connect`, README lists Capacitor 3-5 only) | Use through the `Platform` adapter with Supabase as the canonical store | [capacitor-game-connect](https://github.com/openforge/capacitor-game-connect) |

### 3.4 i18n, crash reporting, live updates, accessibility

| Area | Pick | License | Notes | Source |
|---|---|---|---|---|
| i18n | **i18next** 26.4 + **react-i18next** 17.0 (+ `i18next-icu`) | MIT | ~8.6k / ~10k stars. Yandex requires automatic language detection through its SDK, so feed the platform locale into i18next | [i18next](https://github.com/i18next/i18next), [Yandex 2.14](https://yandex.com/dev/games/doc/en/concepts/requirements) |
| i18n alt | Lingui 6.9 | MIT | Compile-time ICU, smaller runtime | [npm](https://www.npmjs.com/package/@lingui/core) |
| Crash/error reporting | **Sentry**: `@sentry/react` 11.7, `@sentry/capacitor` 4.4, `@sentry/electron` 8.2 | SDKs MIT | Self-hosted Sentry or SaaS; PostHog also has error tracking | [sentry-javascript](https://github.com/getsentry/sentry-javascript) |
| OTA web-layer updates (Capacitor) | `@capawesome/capacitor-live-update` 8.7 (MIT), `@capgo/capacitor-updater` 8.53 (MPL-2.0) | | Ship JS/asset fixes without a store review (within store rules) | [npm capawesome](https://www.npmjs.com/package/@capawesome/capacitor-live-update) |
| Accessibility | React DOM UI for menus/HUD (semantic, screen-reader friendly) over the canvas; respect `prefers-reduced-motion`; colorblind-safe palettes; one-handed play (also a Yandex rule 1.10) | | Canvas content is not accessible by default, so keep text and UI in DOM | [Yandex requirements](https://yandex.com/dev/games/doc/en/concepts/requirements) |

---

## 4. Monorepo and template tooling

| Tool | Version | License | Stars | Role | Source |
|---|---|---|---|---|---|
| **Vite** | 8.3.4 | MIT | ~83k | Dev server and bundler for every game and package | [repo](https://github.com/vitejs/vite) |
| **pnpm** workspaces | 12.11 | MIT | ~37k | Package manager with strict, disk-efficient workspaces | [repo](https://github.com/pnpm/pnpm) |
| **Turborepo** | 2.11.8 | MIT | ~31k | Task graph and remote caching; simpler than Nx | [repo](https://github.com/vercel/turborepo) |
| **Nx** | 23.3 | MIT | ~29k | Alternative with generators (useful for scaffolding many games) | [repo](https://github.com/nrwl/nx) |
| **Changesets** | `@changesets/cli` 3.0.3 | MIT | ~12.5k | Versioning and changelogs for `game-core` packages published to npm | [repo](https://github.com/changesets/changesets) |
| **Storybook** | 10.6.2 | MIT | ~91k | Visual catalog of UI kit, characters and HUD components | [repo](https://github.com/storybookjs/storybook) |
| **Playwright** | 1.64.1 | Apache-2.0 | ~98k | E2E plus `toHaveScreenshot()` visual regression; mobile device emulation | [repo](https://github.com/microsoft/playwright) |
| GitHub **template repositories** | n/a | n/a | n/a | "Use this template" for each game repo (or `gh repo create --template`) | [GitHub docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository) |
| `@capacitor-community/electron` | 5.0.1 | MIT | ~400 | Capacitor plugins inside Electron (optional; a plain Electron shell loading the Vite build is simpler) | [repo](https://github.com/capacitor-community/electron) |

**Suggested layout:** a monorepo `game-core` with packages:

- `core` (loop, state, save, i18n)
- `platform` (adapters)
- `monetization` (ads/IAP/subscription facade)
- `experiments` (flags/AB/remote config facade)
- `ui` (React kit + Storybook)
- `characters` (Rive/Lottie assets)
- `shells` (pwa, capacitor, electron, telegram, vk, ...)

Then one **template repo** per game genre (`template-pixi-react`, `template-phaser`, `template-r3f`) that depends on published `@links-games/*` packages.

---

## 5. Licensing: public domain (Unlicense / CC0) and monetizing open games

### 5.1 Unlicense vs CC0

| Topic | Fact | Source |
|---|---|---|
| Unlicense status | OSI-approved (legacy approval, 2020) and FSF-approved; reviewers called it "poorly drafted" | [Wikipedia](https://en.wikipedia.org/wiki/Unlicense), [OSI license-review 2020](https://lists.opensource.org/pipermail/license-review_lists.opensource.org/2020-March/004798.html) |
| CC0 | Public-domain dedication with fallback license; the FSF calls it more thorough than the Unlicense. **Explicitly does not waive patent or trademark rights**, which is why it was withdrawn from OSI review and why Fedora disallows CC0 for code since 2022 | [OSI list 2012](https://lists.opensource.org/pipermail/license-review_lists.opensource.org/2012-February/001575.html), [CC0 legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode), [chrismorgan.info](https://chrismorgan.info/blog/unlicense/) |
| Assets | CC0 is the norm for public-domain game art (e.g. Kenney: all assets CC0, commercial use OK, credit optional, **but the Kenney logo/brand is reserved**) | [kenney.nl/support](https://kenney.nl/support) |

**Practical guidance:**

1. **Code:** use the Unlicense (OSI-approved, readable), or CC0. Do not use GPL/AGPL code *inside* the games. You cannot relicense GPL code to public domain, and doing so would also block store distribution models. LGPL (Playgama Bridge) is acceptable only as a separately loaded library. Proprietary runtimes (GSAP, Spine) conflict with "anyone can rebuild it".
2. **Assets** (art, audio, lore): CC0 if fully open. Alternatively keep **character designs, names and logos as trademarks**. Public-domain copyright does **not** grant trademark rights, and CC0 states this explicitly. The trademark is the main moat against clones re-uploading under our brand.
3. **Server-side secrets are not code:** ad unit IDs, RevenueCat keys, remote-config values and the experiment setup stay in private infra or env vars. Anyone can clone the game, but not our accounts, rankings, cloud saves, community or store presence.

### 5.2 How open-source games still make money

| Game | License | Business model | Lesson | Source |
|---|---|---|---|---|
| **Mindustry** (Anuken, ~29k stars) | GPL-3.0 | Free/PWYW on itch.io with donations; **paid on Steam** (Workshop and Steam integration) | Convenience plus platform features sell even when the source is free | [GamingOnLinux 2020](https://www.gamingonlinux.com/2020/01/open-ended-tower-defense-mining-game-mindustry-is-just-awesome/page=1/), [repo](https://github.com/Anuken/Mindustry) |
| **Shattered Pixel Dungeon** (~6.7k) | GPL-3.0 | Free on Android/iOS with supporter IAP; **$10 on Steam** (2022) with supporter features; source free on GitHub | Builds are paid, source is free; the community accepts this | [ShatteredPixel blog](https://ShatteredPixel.com/blog/shatteredpd-v120-and-steam-release.html), [repo](https://github.com/00-Evan/shattered-pixel-dungeon) |
| **2048** (Gabriele Cirulli, ~13k) | MIT | Open web game; **clones (e.g. Ketchapp's ad-supported version) topped the charts and earned the money**; about 15 Threes/2048 clones per day appeared on the App Store (April 2014) | Permissive and open means clones *will* happen. Win on brand, quality, speed to every store and community, not on code secrecy | [Wikipedia](https://en.wikipedia.org/wiki/2048_(video_game)), [Giant Bomb](https://giantbomb.com/articles/meet-the-clones), [Pocket Gamer](https://www.pocketgamer.com/articles/058810/r/) |

---

## 6. Recommended default stack (initial proposal)

| Layer | Default | Why |
|---|---|---|
| Language/UI | React 19 + JavaScript (JSDoc types, optional `tsc --checkJs`) | Matches the issue; R3F and `@pixi/react` both need React 19 |
| Build | Vite 8 + vite-plugin-pwa | Fast, and one build artifact feeds every shell |
| Monorepo | pnpm workspaces + Turborepo + Changesets | Simple; caching; publish `@links-games/*` to npm |
| 2D | PixiJS v8 + `@pixi/react` (default); Phaser 4 for physics/arcade-heavy games | React-native scene graph vs. batteries-included engine |
| 3D | three.js + R3F + drei + Rapier (`@react-three/rapier`) | Largest ecosystem |
| Animation | Rive (MIT runtime) for characters; dotLottie for stickers; Motion for UI | Cute, interactive, open-source runtimes |
| Audio | Howler.js (or `@pixi/sound`) | Mobile unlock and sprites |
| Shells | PWA → Capacitor 8 (Android/iOS) → Electron 44 (+ steamworks.js) → Telegram (`@tma.js/sdk`) → VK (`vk-bridge`) → Yandex SDK → Playgama Bridge (other portals) → Discord SDK | Priority order by effort vs. reach |
| Platform abstraction | Own `Platform` interface in game-core (ads, iap, storage, leaderboard, share, haptics, locale, lifecycle, kidsMode) | Keeps games platform-agnostic |
| IAP/subscriptions | RevenueCat (Capacitor + Web Billing); Stars on Telegram; votes on VK; SDK purchases on Yandex | One entitlement model ("supporter", "no-ads", "boosts") mapped per platform |
| Ads (off by default) | AdMob (native), AdSense H5 Games Ads (web), AdsGram/Monetag (TMA), platform SDK ads (VK/Yandex/portals) | Rewarded-only, opt-in, behind a remote flag |
| Analytics + flags + A/B + remote config | **PostHog** (self-host or cloud), GrowthBook as the warehouse-native alternative | One SDK for all experiment mechanics; MIT core |
| Backend | Supabase (auth, saves, leaderboards); add Nakama or Colyseus only when real-time multiplayer is needed | Cheap start, open-source, self-hostable |
| i18n | i18next + react-i18next (ICU) | Standard; platform locale detection |
| Errors | Sentry (react/capacitor/electron SDKs) | Cross-shell coverage |
| Quality | Storybook 10 (UI/characters) + Playwright visual snapshots (mobile viewports) + GitHub template repos | "If it's not adorable it's a bug" becomes a visual-regression test |
| Licensing | Code: Unlicense; assets: CC0; brand/characters: trademarked; avoid GPL/AGPL/proprietary runtimes in game bundles | Public domain while keeping a brand moat |
