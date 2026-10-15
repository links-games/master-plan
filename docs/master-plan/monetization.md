# Monetization — the Most Generous Games in the Market

Covers requirements **R21, R22, R23, R24, R25** and **D1, D5, D6**.
Evidence (eCPMs, store fees, subscription benchmarks, enforcement cases) is
in [research-market-games.md](../case-studies/issue-1/data/research-market-games.md)
sections 4–5 and
[research-platforms-tech.md](../case-studies/issue-1/data/research-platforms-tech.md)
sections 1 and 3.

## Generosity charter

These promises are public, are shown on the "About" screen of every game,
and change only by an announced decision of the maintainers.

1. **Everything playable is free.** Every level, every game mode, every
   lesson. No energy, no lives, no timers that a payment skips.
2. **Learning is never paywalled.** No lesson, hint that teaches, or
   progress report for parents is behind a payment.
3. **Ad-free at launch.** No ads in any game until the
   [rewarded ads](#rewarded-ads) experiment in Phase 3 — and then only
   opt-in, only for general audiences, never in kids mode.
4. **We ask late and once.** The supporter offer appears no earlier than
   the 10th session or day 7, after a finished lesson, and can be dismissed
   forever with one tap.
5. **What you pay for is what you get.** No loot boxes, no gacha, no paid
   randomness, no premium currency hiding real prices.
6. **One-tap cancel** and a reminder before every renewal.
7. **Nothing is lost.** Pets wait happily, streaks have free freezes,
   purchases follow the profile across games and platforms where store
   rules allow.
8. **Kids are customers of their parents.** Every purchase and every link
   out in a child profile is behind a parental gate.

"More generous than competitors" (R24) is checked against these benchmarks:
Apple Arcade ($6.99/month for no ads and no IAP), Microsoft Solitaire
Premium ($1.99/month to remove ads), and Khan Academy Kids (free, donor
funded). We aim to be **free like Khan Academy Kids** for everything that
matters and to price the supporter tier **under** the ad-removal tiers of
the biggest casual games.

## The mechanics

All mechanics exist in `@links-games/monetization` from day one but ship
**off** behind remote flags ([infrastructure](infrastructure.md#7-experiments-r25-d6)),
so turning one on is an experiment, not a release.

| Mechanic                      | What the player gets                                                                                   | Default            | Kids mode                    | First phase |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------ | ---------------------------- | ----------- |
| **Donations**                 | A thank-you sticker and a name in the credits (opt-in)                                                 | on (website/About) | link behind a parental gate  | 1           |
| **Supporter subscription**    | Costumes for the Links, themes, early access to new games, supporter badge, credits                    | off                | parent buys, child enjoys    | 2           |
| **Thank-you packs** (one-off) | A fixed, visible set of cosmetics (e.g. "Akoren's Garden theme")                                       | off                | parent buys                  | 2           |
| **No-ads entitlement**        | Removes the option to watch rewarded ads and gives their rewards for free                              | off                | n/a (no ads in kids mode)    | 3           |
| **Rewarded ads**              | Opt-in video for an extra hint, a costume trial, a second daily puzzle                                 | off                | never                        | 3           |
| **Boosts / hints store**      | Convenience only (extra hints in hard puzzles); every boost is also earnable by playing                | off                | never paid                   | 3           |
| **Interstitial ads**          | —                                                                                                      | off                | never                        | not planned |
| **Merch and digital goods**   | Printable coloring pages (free), sticker packs, physical merch ([community](community.md#merchandise)) | on (website)       | links behind a parental gate | 2           |

### Entitlements

One entitlement model is mapped onto every platform, so a game asks only
"does this player have `supporter`?":

| Entitlement | Meaning                                    | Granted by                                         |
| ----------- | ------------------------------------------ | -------------------------------------------------- |
| `supporter` | Supporter cosmetics, early access, badge   | Subscription, a lifetime pack, or a large donation |
| `no-ads`    | Rewarded-ad rewards without watching an ad | `supporter`, or a separate one-time purchase       |
| `pack:<id>` | A specific cosmetic pack                   | One-time purchase or event reward                  |
| `boost:<n>` | A consumable hint balance                  | Playing (daily gifts), rewarded ads, purchase      |

Entitlements are stored in the `entitlements` table of the backend
(Supabase), filled by webhooks from RevenueCat, Telegram Stars payments and
VK votes, and cached locally so games work offline.

### Per-platform mapping

| Platform                  | Payment rails we use                                            | Ads (when enabled)          | Notes                                                                                                 |
| ------------------------- | --------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| Web / PWA                 | RevenueCat Web Billing (Stripe)                                 | AdSense H5 Games Ads        | Lowest fees; the primary place for donations.                                                         |
| Android (Capacitor)       | Google Play Billing via RevenueCat                              | AdMob (general builds only) | 15% on subscriptions; kids builds link no ads SDK.                                                    |
| iOS (Capacitor)           | Apple IAP via RevenueCat                                        | AdMob (general builds only) | 15% under the Small Business Program; consider the Mini Apps Partner Program for the hub.             |
| Telegram Mini App         | **Telegram Stars only** (30-day Stars subscriptions)            | AdsGram / Monetag           | `/paysupport` command required; refunds through `refundStarPayment`.                                  |
| VK Mini App               | **VK votes only** for virtual goods                             | VK ads                      | Cannot mix votes and real money; "remove ads for votes" is encouraged by VK.                          |
| Yandex Games, CrazyGames  | Portal SDK purchases                                            | Portal SDK ads              | Portal rules forbid external purchases and links.                                                     |
| Electron (itch.io, Steam) | itch.io pay-what-you-want; Steam "supporter edition" (optional) | none                        | The game is free elsewhere, so Steam is a way to support, like Mindustry and Shattered Pixel Dungeon. |
| Discord Activities        | Discord SKUs                                                    | none                        | Later; only if a game fits social play.                                                               |

### Prices (starting hypotheses)

Prices are set per region with store price tiers and adjusted by
experiments. Starting points:

- **Supporter:** $1.99/month or $14.99/year; lifetime $29.99. Telegram:
  the closest Stars amount; VK: the closest votes amount.
- **Thank-you packs:** $0.99–$2.99.
- **No-ads (standalone):** $2.99 one-time.
- **Family sharing** on wherever the store supports it.

## Rewarded ads

Planned for Phase 3 of the [roadmap](roadmap.md), as an experiment that
can be stopped at any time.

- **Who sees them:** only profiles that are not in kids mode (13+ or a
  parent-confirmed general audience) and only in builds that link an ads
  SDK. Kids builds for the App Store Kids Category and Google Play Families
  link **no** ads SDK at all.
- **How:** always behind a button that names the reward ("Watch a short
  video for an extra hint"), never automatically, never during a lesson,
  at most a few per day (`ads.rewarded.dailyCap`).
- **What for:** convenience and cosmetics trials — never progress that is
  otherwise impossible.
- **Generosity rule:** if the ad fails to load or the player closes it
  early, the reward is still granted once per day.
- **Economics:** rewarded video eCPM in tier-1 markets is about $16–20 per
  1,000 views (Appodeal, Q4 2024), so ads pay only at scale; supporter
  revenue and donations come first ([business model](business-model.md)).
- **Consent:** Google UMP for EEA/UK/CH, ATT on iOS; non-personalized ads
  by default.

## Experiments (R25)

Every mechanic is an experiment with a hypothesis, a guardrail and an end
date. They are run with `@links-games/experiments` (PostHog flags and
experiments; self-hosted endpoint and no identifiers in kids mode).

| Experiment                           | Variants                                  | Primary metric            | Guardrails (must not get worse)              |
| ------------------------------------ | ----------------------------------------- | ------------------------- | -------------------------------------------- |
| When to show the supporter offer     | session 10 / day 7 / after 3 lessons      | supporter conversion      | D7 retention, offer dismiss rate             |
| Supporter price per region           | 2–3 price tiers                           | revenue per 1,000 players | conversion of first-time payers, refunds     |
| Supporter perks                      | early access vs. costumes vs. both        | conversion                | perceived fairness (in-app survey)           |
| Rewarded ads (general audience only) | off / 1 placement / 2 placements          | ad revenue per DAU        | D1/D7/D30 retention, session length, reviews |
| Daily puzzle and kind streaks        | streak freezes 1 / 2 / unlimited          | D7, D30 retention         | uninstall rate, parent complaints            |
| Cross-promotion in the hub           | on / off                                  | games per player          | session satisfaction                         |
| Donation prompt wording              | gratitude / transparency ("what we fund") | donation conversion       | none (outside gameplay)                      |

Rules for every experiment:

1. Written down as an issue with the template "experiment" before it
   starts; results are posted publicly in the same issue.
2. Read on **retention, learning gain and revenue together** — an
   experiment that raises revenue but lowers learning or retention loses.
3. Never run on kids-mode profiles unless the change only makes things
   more generous.
4. Kill switch: every flag can be turned off remotely within minutes.

## The never-list

These are not experiments; they are out of scope for good.

- Paid random rewards (loot boxes, gacha, mystery boxes for money).
- Interstitial or forced ads, and any ad in kids mode.
- Paywalled learning, energy systems or pay-to-continue.
- Premium currencies that hide real prices, or currencies that can be
  bought and also expire.
- Guilt and fear mechanics ("your pet is sad", "you will lose your
  streak").
- Crypto tokens, NFTs, play-to-earn.
- Open chat for children; public leaderboards for children.
- Selling or sharing player data.

The [adorability gate](lore/adorability-gate.md) checks the same list in
every pull request, and [legal](legal.md) explains the laws behind it.

## Inside the games: resources, not money

Monetization is about how the organization is funded. Inside the games
there is no money where a real resource can do the job: players manage
water, energy, materials, time and knowledge, and real money never buys
in-game resources or progress. The rules are in [economy](economy.md).
