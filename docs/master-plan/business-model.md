# Business Model — Profitable, Generous, Fundable

Covers requirements **R19, R20, R26, R28, R29** and **D4, D5**.
Data sources: [research-market-games.md](../case-studies/issue-1/data/research-market-games.md)
sections 1, 5 and 6, and
[research-platforms-tech.md](../case-studies/issue-1/data/research-platforms-tech.md)
section 5.

## The idea in one paragraph

Games are many, small, free and cheap to make (shared `game-core`,
templates and an AI pipeline). They reach players where there is no
install friction (web, Telegram, portals) and, later, through the stores.
They earn trust by being the most generous and the cutest games in their
category. Trust turns into **supporters, donations and merch** around
characters people love; scale later adds **opt-in rewarded ads** for
general audiences and **licensing** of the Links universe. The code is
public domain, so the value we own is **the brand, the characters, the
community and the store presence** — the same assets that made Pokémon,
Sanrio and Om Nom valuable.

## Revenue streams

In the order they are switched on ([roadmap](roadmap.md)):

| #   | Stream                                    | Phase | Why it fits                                                                    | Main costs / fees                                                                                |
| --- | ----------------------------------------- | ----- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1   | Donations                                 | 1     | Open source and kind games attract supporters; zero impact on play             | GitHub Sponsors 0% from personal accounts; Open Collective host fees                             |
| 2   | Supporter subscription and packs          | 2     | Cosmetic, optional; proven by Shattered Pixel Dungeon and Duolingo's free core | Store fees 15% (Google Play subscriptions; Apple Small Business), RevenueCat 1% above $2,500 MTR |
| 3   | Digital goods (sticker packs, wallpapers) | 2     | Characters spread on their own (Pusheen: 30B Giphy shares)                     | Near zero                                                                                        |
| 4   | Paid convenience builds (Steam, itch.io)  | 2     | Mindustry, Cataclysm: DDA: free source, paid convenient builds                 | Steam 30% and $100 per app                                                                       |
| 5   | Rewarded ads (general audience, opt-in)   | 3     | Pays at scale only (about $16–20 per 1,000 views in tier-1 markets)            | Ad network share; consent tools                                                                  |
| 6   | Physical merch                            | 3     | Merch dwarfs game revenue in cute IP, but only after an audience exists        | Print-on-demand margins; toy safety certification for plush                                      |
| 7   | Licensing, education partnerships         | 4     | Om Nom: 25 seasons on Disney+, 50+ licensees; schools and publishers           | Legal, agency fees                                                                               |

## Unit economics (planning model)

A planning model, not a forecast. Every number marked _(hypothesis)_ is
ours and is checked by the experiments in [monetization](monetization.md).

### Costs per game

| Item                             | Estimate                                                     |
| -------------------------------- | ------------------------------------------------------------ |
| Prototype of a complexity-1 game | ~1 week of one developer with the AI pipeline _(hypothesis)_ |
| Art                              | Shared cast and assets; new art per game is small            |
| Hosting                          | Static files on GitHub Pages / CDN: close to zero            |
| Backend                          | Supabase free tier up to 50k MAU; then the Pro plan          |
| AI pipeline                      | Model API costs per solved issue; capped per repository      |
| Store accounts                   | Google Play $25 once; Apple $99/year; Steam $100 per app     |

### Revenue per 1,000 monthly active players (general audience)

| Source       | Assumption _(hypothesis)_                         | Monthly per 1,000 MAU |
| ------------ | ------------------------------------------------- | --------------------- |
| Supporters   | 1% convert at $1.99, 15% store fee                | ≈ $17                 |
| Donations    | 0.2% donate $5 on average                         | ≈ $10                 |
| Rewarded ads | 30% of players watch 1 video on 10 days, $10 eCPM | ≈ $30                 |
| **Total**    |                                                   | **≈ $57**             |

With ads off (Phases 1–2) the model relies on supporters and donations,
so **break-even comes from keeping costs tiny**: one shared codebase, AI
help on every issue, static hosting and community contributions. Kids-mode
players are counted in reach and learning, not in ad revenue — by design.

### Break-even examples _(hypothesis)_

| Monthly cost                             | MAU needed at ≈ $27 / 1,000 (no ads) | MAU needed at ≈ $57 / 1,000 (with ads) |
| ---------------------------------------- | ------------------------------------ | -------------------------------------- |
| $500 (infrastructure, stores, AI)        | ≈ 19,000                             | ≈ 9,000                                |
| $10,000 (two people plus infrastructure) | ≈ 370,000                            | ≈ 175,000                              |
| $40,000 (team of six)                    | ≈ 1.5M                               | ≈ 700,000                              |

For scale: web portals and Telegram each reach hundreds of millions of
monthly players, and simple-game hits reach tens of millions of installs
(see the research data). Fifteen games sharing one hub and one cast only
need a small share of that.

## Why open source and public domain help (R19, R20)

- **Cheaper development:** contributors, AI tools and other studios can
  improve the shared code; we benefit from every fix upstream.
- **Trust:** parents, teachers and schools can verify there is no
  tracking or manipulation. This matters for kids' products after
  FTC v. Epic ($520M) and the COPPA 2025 rule.
- **Distribution:** public domain code can be embedded by schools and
  partners without legal review.
- **Clones are expected** (2048 had about 15 clones a day in 2014). We win
  on brand, quality, speed to every platform and community, not on code
  secrecy. Trademarks protect the names and the characters
  ([legal](legal.md#licensing)).
- **Quiet about it (R20):** store pages and in-game screens talk about the
  games and the characters. The license is in the repository and in the
  "About" screen, not in the marketing.

## Moat (D4)

What a clone cannot copy:

1. **The characters and the universe** — trademarked names and designs,
   recognizable across all games.
2. **The community** — players, contributors, artists, translators.
3. **The profile and the collection** — the player's Links, stickers and
   progress across all games.
4. **Store presence and reviews** on every platform.
5. **Speed** — templates plus the AI pipeline let us ship a new game or a
   new platform faster than a cloner can copy the previous one.
6. **Trust** — the generosity charter and kids-safe record.

## Attracting capital

When the Phase 3 criteria of the [roadmap](roadmap.md) are in sight:

- **What we show:** public metrics (MAU, D1/D7/D30, learning gain,
  supporter conversion, revenue per 1,000 MAU), the size of the cast's
  audience (stickers shared, social followers), the number of games and
  platforms, and the cost to ship a new game.
- **The story:** an open, cute, educational game universe with the cost
  structure of open source and the upside of a character IP (Pokémon,
  Sanrio, Om Nom, Angry Birds — Sega bought Rovio for about €706M).
- **Instruments, in preference order:**
  1. Grants and impact funding for open educational software (no equity).
  2. Revenue-based financing once revenue is predictable.
  3. Angel and seed equity from investors who accept the generosity
     charter in writing (the charter is part of the term sheet).
  4. Strategic partners (education publishers, platforms) through
     licensing deals rather than exclusivity.
- **What we never trade:** the generosity charter, the kids-mode
  protections, the public-domain status of released code, and exclusive
  deals that block other platforms (for example 7-year web exclusivity).
- **Materials to prepare** (Phase 3): a one-page summary, a metrics
  dashboard that is public, a 3-year plan built from this document, and a
  trademark portfolio summary.

## Legal entity

Stores, VK and trademark ownership require a legal entity. Proposed: one
company that owns the trademarks and store accounts and receives revenue;
donations go through Open Collective (fiscal host) or GitHub Sponsors so
spending stays transparent. Jurisdiction is a maintainer decision
([roadmap](roadmap.md#decisions-needed-from-maintainers),
[legal](legal.md#platform-specific-obligations)).
