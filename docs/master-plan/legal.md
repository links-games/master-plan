# Legal — Clean Rooms, Kids' Privacy, Licensing

Covers requirements **R11, R19, R20** and **D1, D2**.
Sources (statutes, court cases, store policies) are in
[research-market-games.md](../case-studies/issue-1/data/research-market-games.md)
sections 3–4 and
[research-platforms-tech.md](../case-studies/issue-1/data/research-platforms-tech.md)
sections 1.4 and 5.

> This is an engineering plan, not legal advice. Before the first store
> release and before choosing names, a lawyer in the chosen jurisdiction
> reviews this document.

## Clean-room reimplementation

**Principle:** game ideas, rules and mechanics are free; expression is not.
US copyright law excludes "any idea, procedure, process, system, method of
operation" (17 U.S.C. 102(b)), and the US Copyright Office states that
copyright does not protect the idea for a game, its name or the method of
playing it. Genre-typical elements are free too (_scènes à faire_, Data
East v. Epyx, 1988).

**Where clones lost:**

- _Tetris Holding v. Xio_ (2012): copying the look — piece shapes and
  colors, the 10×20 well, the ghost piece — was infringement even though
  the rules are free.
- _Spry Fox v. Lolapps_ (2012): re-skinning the full progression and
  content map of Triple Town one-to-one was plausibly infringing.

**Where reimplementations won:** _DaVinci Editrice v. Ziko Games_
(S.D. Tex., 2014–2016): game structure and mechanics were unprotectable.

### Checklist for every game

Each game's `GAME.md` has a "Legal notes" section, and the pull request
template has the same checkboxes:

- [ ] The mechanic is old, publicly documented and implemented by many
      unrelated parties.
- [ ] No famous trade dress: board size, piece shapes, colors, UI layout,
      sounds and share format are our own.
- [ ] Levels, puzzles and word lists are generated or written by us; no
      copied level files or databases.
- [ ] Names checked against the [names table](#names-to-avoid) and
      trademark databases.
- [ ] No mechanic that copies a known gameplay patent claim (rare for
      classic games; check before Wave 2 mechanics such as screw puzzles).
- [ ] Dependencies are permissive (MIT, Apache-2.0, BSD, ISC, zlib, CC0);
      the license inventory is updated.
- [ ] Store listings do not use competitor names as keywords.

## Names and trademarks

### Our names

- All character and game names are **working names** until searched in
  USPTO, EUIPO (TMview), WIPO Global Brand Database and the national
  registers of the main markets (Russia, for VK and Yandex).
- Known conflict to check first: **"Linky"** is the name of a French smart
  electricity meter (Enedis). Class overlap (9 — software) needs a lawyer's
  opinion; fallback names are prepared.
- File trademarks for the brand and the core characters in classes
  **9** (software), **16** (stationery, books), **25** (apparel),
  **28** (toys) and **41** (entertainment, education) once names are
  confirmed (roadmap task 0.8).
- Character **designs** are registered as figurative marks together with
  the names.

### Names to avoid

| Avoid                                  | Owner / reason                                   | Use instead                     |
| -------------------------------------- | ------------------------------------------------ | ------------------------------- |
| Tetris, "-tris" names                  | The Tetris Company enforces actively             | Block puzzle, Shape Garden      |
| Wordle                                 | The New York Times (DMCA notices against clones) | Daily word, Word Links          |
| Candy, Saga, Crush                     | King (disputes with The Banner Saga, CandySwipe) | Match-3, our own names          |
| Picross                                | Nintendo                                         | Nonogram, Pixel Itsy            |
| Othello, Connect 4                     | Brand names of classic games                     | Reversi, four in a row          |
| Tamagotchi                             | Bandai                                           | Virtual pet, Linky Home         |
| Flappy, Flow, 2048, Sokoban (as names) | Owned or strongly associated names               | Linky Hop, Link It!, Bead Merge |
| Memory (alone, in the EU)              | Ravensburger                                     | Pairs, Pair Friends             |
| Scrabble, Monopoly                     | Hasbro / Mattel                                  | Word tiles, our own names       |

## Licensing

| What                                                          | License                                              | Why                                                                                       |
| ------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Code (all repositories)                                       | **Unlicense** (public domain, OSI- and FSF-approved) | R19; same as this repository                                                              |
| Art, audio, lore texts                                        | **CC0 1.0**                                          | Public domain dedication with a fallback license; the norm for game assets                |
| Character names, designs, logos                               | **Trademarks** (not waived)                          | CC0 explicitly does not waive trademarks; this is the moat against clones using our brand |
| Secrets (keys, ad unit IDs, remote config, store credentials) | Not published (private `ops` repository, CI secrets) | Not code; anyone can clone the game but not our accounts                                  |

Rules:

1. **No GPL/AGPL code inside game bundles** — it cannot be relicensed as
   public domain and complicates store distribution. LGPL (Playgama
   Bridge) only as a separately loaded library.
2. **No proprietary runtimes** that stop anyone from rebuilding a game
   (for example, closed animation runtimes); Rive and dotLottie runtimes
   are MIT.
3. **Trademark policy** (in `links-games/.github`): forks are welcome;
   releasing a fork under our names or with our characters as the brand is
   not. Fan art for non-commercial use is welcome.
4. **Contributor terms:** contributions are accepted under the Unlicense
   (code) and CC0 (assets); the pull request template asks for
   confirmation.
5. **Quiet about it (R20):** the license is stated in each repository and
   in the "About" screen; marketing and store pages talk about the games.

## Kids' privacy (D1)

Our audience includes toddlers and children, so the strictest rules apply
to everything that can be used by them.

| Rule                                                   | What it requires (summary)                                                                                                                                            | How we comply                                                                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **COPPA** (US, amended 2025; compliance by 2026-04-22) | Verifiable parental consent before collecting personal data from under-13s; separate consent for disclosure to third parties; data-retention policy; security program | No accounts and no personal data by default; local saves; optional parent account with consent; written retention policy |
| **GDPR Art. 8** and the **UK Children's Code**         | Parental consent below the national age of digital consent (13–16); high-privacy defaults for under-18s                                                               | Privacy by default for everyone; no profiling; data minimization                                                         |
| **Apple Kids Category** (1.3, 5.1.4)                   | No third-party analytics or ads that send identifiers; parental gates for links and purchases                                                                         | Kids builds link no ads SDK and no third-party analytics; parental gate in `ui`                                          |
| **Google Play Families**                               | Only Families Self-Certified Ads SDKs; neutral age screen for mixed audiences                                                                                         | Neutral age screen in the hub; kids builds without ads                                                                   |
| **FTC v. Epic** (2022, $520M)                          | Dark-pattern purchases and default-on chat for kids are punished                                                                                                      | Clear prices, confirmation and parental gate on purchases; no chat for children                                          |

Implementation is in `game-core`, not in each game: the `kidsMode`
capability of the [Platform interface](infrastructure.md#3-the-platform-interface)
switches off third-party ads, personalization, external links and chat,
and sends analytics only to the self-hosted endpoint without identifiers.

## Loot boxes and dark patterns

- **No paid randomized rewards anywhere.** Belgium treats paid loot boxes
  as illegal gambling; the Netherlands case was overturned, but the
  simplest compliant rule worldwide is "never".
- The full list of banned patterns is the never-list in
  [monetization](monetization.md#the-never-list) and the "Fairness and respect"
  section of the [adorability gate](lore/adorability-gate.md).

## Platform-specific obligations

| Platform                   | Obligation                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Telegram Mini Apps         | Digital goods only for **Telegram Stars**; the bot answers `/paysupport`; refunds via `refundStarPayment`; validate `initData` on the server.                                                                                                                 |
| VK Mini Apps               | The app owner must be a Russian individual entrepreneur, self-employed person or legal entity for payments and ads; virtual goods only for **votes**; votes and real money cannot be mixed; `VKWebAppInit` within 30 seconds; moderation before monetization. |
| Yandex Games               | Only SDK purchases and SDK ads; no external links; ≤100 MB; loading and gameplay events through the SDK.                                                                                                                                                      |
| CrazyGames, Poki           | Portal SDKs for ads; size limits; avoid Poki's 7-year web exclusivity deal.                                                                                                                                                                                   |
| Google Play                | Target API level requirements; Families policy for kids builds; Play Billing for digital goods.                                                                                                                                                               |
| App Store                  | Kids Category rules; IAP for digital goods; Small Business Program enrollment; consider the Mini Apps Partner Program for the hub.                                                                                                                            |
| Steam                      | $100 per app; Steam Direct review.                                                                                                                                                                                                                            |
| Web (AdSense H5 Games Ads) | Approval required; rewards must have no monetary value.                                                                                                                                                                                                       |

Each obligation is enforced in the matching adapter of
`@links-games/platform` and tested with the adapter mocks in
`@links-games/testing`.

## Physical products

Toys and plush sold to children need safety certification (EN 71 / CE in
the EU, CPSIA in the US, UKCA in the UK). We use licensed, certified
manufacturers for them, and print-on-demand only for non-toy merch
([community](community.md#merchandise)).
