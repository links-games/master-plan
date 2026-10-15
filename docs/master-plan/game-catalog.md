# Game Catalog — What We Build First

Covers requirements **R1, R11, R17, R18** and **D2, D7**.
Evidence (download numbers, revenue, court cases, trademark disputes) is in
[research-market-games.md](../case-studies/issue-1/data/research-market-games.md)
sections 2, 3 and 7.

## How games are chosen

Each candidate is scored on five things, in this order:

1. **Simplicity (R18)** — complexity 1 means a playable prototype in a week;
   5 means months of content and tuning. We start with 1s and 2s.
2. **Proven popularity (R11)** — the mechanic already has hundreds of
   millions of players somewhere, so we are not testing whether the fun
   exists, only whether our version is cuter and kinder.
3. **Natural learning fit (R17, D7)** — the lesson is _inside_ the
   mechanic (merge letters into a word, fly through the right answer), never
   a quiz that interrupts play.
4. **Character fit (R13, R15)** — one of the [Links](lore/characters.md)
   is the obvious star, so every game also tells a piece of the lore.
5. **Legal cleanliness (D2)** — the mechanic is old and widely implemented;
   names and looks to avoid are known (see [legal](legal.md)).

Every game, however small, ships with the same shared parts from
`game-core` (see [infrastructure](infrastructure.md)): one learning
objective in `lesson.lino`, a daily challenge with a shared seed, the
player's Link collection (finishing a lesson unlocks a character card or
sticker), kids mode, and all monetization mechanics present but switched off.

## Wave 1 — the first 15 games

Names are **working names**; each needs a trademark search before release
([legal](legal.md#names-and-trademarks)). "Cx" is complexity (1–5).

| #   | Working name          | Mechanic (generic)                                                   | Cx  | Learning objective                                              | Star Links                       | Avoid (names, looks)                                                     |
| --- | --------------------- | -------------------------------------------------------------------- | --- | --------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| 1   | **Pair Friends**      | Memory / pairs                                                       | 1   | Vocabulary in many languages (word ↔ picture), memory           | Soru & Tari (a pair is a link)   | "Memory" as the sole brand (Ravensburger marks in the EU)                |
| 2   | **Bead Merge**        | Slide-merge numbers (2048-like)                                      | 1   | Number sense, doubling, powers of two                           | Beadles (numbers as bead chains) | The name "2048", its exact colors and layout                             |
| 3   | **Color Cups**        | Color / water sort                                                   | 1–2 | Colors, color mixing, sorting, planning                         | Soru, Tari, Verbi (palette trio) | Copying a specific app's vessels or level packs                          |
| 4   | **Letter Train**      | Snake                                                                | 1   | Spelling words, counting                                        | Choo-Choo Seq, Letterlinks       | Nokia-style art                                                          |
| 5   | **Linky Hop**         | One-tap flyer through answer gates                                   | 1   | Mental arithmetic and facts at speed                            | Linky, Go/Stop/Hop               | Pipes, a bird look-alike, the word "Flappy"                              |
| 6   | **Shape Garden**      | 8×8 block placement (non-falling)                                    | 2   | Shapes, area, spatial reasoning                                 | Soru (round), Tari (square)      | Tetris trade dress: 10×20 well, falling pieces, ghost piece, "-tris"     |
| 7   | **Uni's Grid**        | Sudoku (4×4 pictures → 6×6 → 9×9)                                    | 2   | Logic; "no duplicates" (uniqueness)                             | Uni                              | Copied puzzle databases (generate our own)                               |
| 8   | **Word Links**        | Daily word guess / word search                                       | 2   | Spelling, vocabulary, foreign languages                         | Letterlinks, Prime Sprites       | "Wordle", its tile colors/grid/share format, its word list               |
| 9   | **Postie's Treasure** | Minesweeper-like deduction ("treasure finder")                       | 2   | Number adjacency, deduction, probability                        | Postie Index, Nully              | Windows Minesweeper art; mines and explosions (we find treasure instead) |
| 10  | **Link It!**          | Connect pairs with non-crossing paths                                | 2   | Planning; matching concepts (animal ↔ home, word ↔ translation) | Linky (the flagship "link" game) | The name "Flow", its art and level packs (generate levels)               |
| 11  | **Acorn Tower**       | Stack / tower timing                                                 | 2   | Measurement, balance, center of mass                            | Akoren                           | Ketchapp's Stack visuals                                                 |
| 12  | **Omi Colors**        | Coloring / color by number                                           | 2   | Colors, numbers, art history (public-domain artworks)           | Omi                              | Tracing any licensed character                                           |
| 13  | **Pixel Itsy**        | Nonogram                                                             | 2–3 | Logic, grid coordinates; reveals cute pictures                  | Itsy                             | "Picross" (Nintendo)                                                     |
| 14  | **Rela's Board Club** | Reversi, checkers, mancala, four in a row, dots and boxes vs kind AI | 2–3 | Strategy, counting, turn-taking, fair play                      | Rela (sees both sides)           | "Othello", "Connect 4"                                                   |
| 15  | **Linky Home**        | Virtual pet hub — the home screen of the universe                    | 3   | Care routines, emotions, healthy habits                         | Linky and the whole cast         | "Tamagotchi", egg-shaped device; any guilt mechanic                      |

### Why this order

- Games 1–5 are complexity 1: each is a template exercise, so they also
  **test the infrastructure** (shells, saves, lesson tracking, AI
  pipeline) with almost no game risk.
- **Link It!** (10) is the most on-brand game — the player literally links
  pairs — so it becomes the face of the store pages even though it ships
  after the complexity-1 games.
- **Linky Home** (15) ships last in the wave because it is the **hub**: it
  rewards play in every other game (stickers, costumes, new friends), which
  only makes sense once there are other games.

## Wave 2 — after the shared tech and the cast are proven

Complexity 3–4. Start only when Phase 2 exit criteria of the
[roadmap](roadmap.md) are met.

| Mechanic (generic)                           | Learning objective                        | Star Links              | Avoid                                           |
| -------------------------------------------- | ----------------------------------------- | ----------------------- | ----------------------------------------------- |
| Box pushing (Sokoban-like)                   | Planning, reversibility                   | Swappy                  | "Sokoban" as a name; classic level sets         |
| Solitaire and mahjong solitaire              | Sequencing, suits, Chinese numerals       | LiNo Family             | "Shanghai"; copied card art                     |
| Match-3                                      | Pattern recognition; matches reveal facts | Prime Sprites           | "Candy", "Saga", "Crush"; copied level layouts  |
| Rope / slingshot physics                     | Forces, angles, trajectories              | Linky (ropes = links)   | Birds-and-pigs or candy-monster looks           |
| Endless runner                               | Categories (lanes), quick recall          | Go, Stop & Hop          | Subway Surfers / Temple Run looks               |
| Merge-2 with decoration                      | Biology (seed → tree), chemistry, history | Akoren                  | Copied item chains (Merge Mansion, Travel Town) |
| Idle science                                 | Exponents, compound growth, economics     | Beadles                 | Pay-to-skip pressure on kids                    |
| Tower defense (friendly: "guard the garden") | Resource management, geometry             | Cadets of Depth         | Bloons / Kingdom Rush names and art             |
| Screw / pin puzzle                           | Order of operations                       | Letgo (gentle "let go") | Check design patents before shipping            |

## Wave 3 — the universe grows up

Story-led games for older children and adults, built only when the cast
already has an audience: "Cadets of Depth Academy" (point → doublet →
triplet → sequence → network levels, see [lore](lore/README.md)),
"Prime Sprites" sentence-building collection, 3D exploration of Omi with the
anime hosts, and short animated episodes that reuse game assets.

## Clean-room rules for every game (D2)

The full rules are in [legal](legal.md#clean-room-reimplementation). In
short, before a game leaves prototype:

1. The mechanic is old, documented publicly and implemented by many
   unrelated parties.
2. Name, art, characters, sounds, UI layout and palette are our own.
3. Levels, puzzles and word lists are generated or hand-made by us.
4. Dependencies are permissive (MIT, Apache-2.0, BSD, zlib, ISC).
5. Store listings never use competitor names as keywords.
6. The `GAME.md` of the game has a "Legal notes" section listing what we
   avoided and why; the pull request template has the same checkboxes.

## Adding a new game

1. Open an issue in `master-plan` with the
   [game idea template](templates/ISSUE_TEMPLATE/game-idea.md).
2. When accepted, create the repository from `game-template-pixi-react`
   (or the Phaser / R3F template) and paste the idea into `GAME.md`.
3. The [AI pipeline](ai-pipeline.md) picks up the first issue
   ("implement the core loop from GAME.md") and opens a pull request;
   humans review it for fun, adorability and the lesson.
4. Ship to web and Telegram first; other shells follow automatically from
   the template.
