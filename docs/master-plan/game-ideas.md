# Game Ideas — the Big List

**[Browse the visual concept catalog](concepts/README.md)** to choose a
prototype by its key visuals. The expanded list has **216 ideas** (the original
168 plus 48 additions); every title below opens its own concept page with four
art directions and prototype scope. Added genre evidence is in the
[visual-catalog research](../case-studies/issue-1/data/research-visual-catalog.md).

Covers requirements **R36, R37, R39, R40, R41, R49** (see the
[requirements](../case-studies/issue-1/requirements.md#requirements-from-the-pr-2-feedback)).
From the maintainer's
[PR #2 comment](https://github.com/links-games/master-plan/pull/2#issuecomment-6189666260):

> We need to collect as much as possible game types ideas, so we do lots of
> small repositories with lots of small games. We can also do game
> collections in a single app. Like all puzzle games, and so on. We should
> take all popular and proven genre, and also try to make useful and
> scientific learning wrapped by genres. We should start by simplest
> possible games to develop, and progressively reapply all our experience to
> the most complex games.

The [game catalog](game-catalog.md) says **what we build first** (Wave 1 to
3). This document is the **pool** those waves are drawn from: every proven
genre we know, each wrapped around real knowledge, sorted from the simplest
to build to the most complex. Evidence for the genres and the educational
references is in
[research-genres-ideas.md](../case-studies/issue-1/data/research-genres-ideas.md).

Names are **working names** and need a trademark search before release
([legal](legal.md#names-and-trademarks)). Games already scheduled are marked
**W1**, **W2** or **W3** (the wave in the [catalog](game-catalog.md)).

## Rules for every idea

1. **Proven genre.** The mechanic already has a large audience; we test
   whether our version is cuter, kinder and smarter, not whether the fun
   exists.
2. **The lesson is the mechanic.** The knowledge is what you use to win
   (fractions to cut a pizza, momentum to deflect a comet), never a quiz
   that interrupts play.
3. **Real or transferable knowledge** (R49). Facts are real; when a game is
   set in the lore, its rules are real physics, biology or logic, so what is
   learned in Omi or in [First Contact](lore/first-contact.md) still works in
   the real world.
4. **Non-violent** (R41). Nobody is hurt to win. Violent genres are reframed
   (see [below](#non-violent-reframing)).
5. **Resources, not money** (R38). In-game economies follow the
   [economy rules](economy.md).
6. **Small and separate.** One idea is one small repository; collections
   bundle them (see [collections](#collections-in-a-single-app)).
7. **Honest claims.** A game says which skill it practises ("practises
   times tables"), never that it makes players smarter or prevents
   disease: the FTC fined Lumosity $2M for such claims, and studies find
   gains mostly on the practised skill
   ([evidence](../case-studies/issue-1/data/research-genres-ideas.md#22-brain-training-collections-the-warning-case)).
   Science content is reviewed by a domain expert, so we do not repeat
   Spore's "failing grades" in biology.

## Complexity ladder

`Cx` is the complexity used in the [catalog](game-catalog.md), extended
upwards to reach the final simulator (R40). Each step reuses everything
built on the steps below it.

| Cx  | What it is                                          | Typical tech                                                         | First prototype |
| --- | --------------------------------------------------- | -------------------------------------------------------------------- | --------------- |
| 1   | One screen, tap or drag, no physics                 | React + SVG / DOM, `game-core` only                                  | days            |
| 2   | Grid or turn-based logic, generated levels          | + level generator, solver, daily seed                                | 1–2 weeks       |
| 3   | Real-time 2D, simple physics, 2D vector art         | + PixiJS or Phaser, 2D rigid bodies ([engine](simulation-engine.md)) | weeks           |
| 4   | 2D systems: economies, ecosystems, many agents      | + `economy` flow graphs, agent simulation, async multiplayer         | 1–3 months      |
| 5   | 3D vector / low-poly worlds, 3D physics, LOD        | + three.js / R3F, 3D physics, device tiers                           | months          |
| 6   | Scientific simulators with validated physics        | + `sim` packages: orbits, fluids, circuits, relativity, GPU compute  | months, ongoing |
| 7   | **First Contact** — realistic multi-genre simulator | everything above at real scale ([lore](lore/first-contact.md))       | years           |

Within each collection below the ideas are sorted by `Cx`, so the next game
to build is always the cheapest one that is still missing.

## Collections in a single app

A collection is an app that bundles several small games of one family (R37),
for example **all puzzle games**. Players who like one puzzle get the
others with no new install; stores see one strong app instead of many thin
ones. Every game is still its own repository and its own package:

- A game repository `links-games/<game>` publishes `@links-games/game-<game>`
  with a manifest (`id`, `collection`, `cx`, `lesson`, `ageTiers`,
  `deviceTier`), built from a template ([infrastructure](infrastructure.md#4-template-repositories)).
- A collection repository `links-games/collection-<family>` is only
  configuration: the list of game packages, the store listing and the
  theme. The same games can be in several collections and in the `hub`.
- A single game can also ship alone (for portals, Telegram and VK) from the
  same package.

| Collection app (working name) | Family                      | Section                                 |
| ----------------------------- | --------------------------- | --------------------------------------- |
| **Links Puzzle Box**          | Puzzles                     | [Puzzles](#puzzles-pz)                  |
| **Links Word Garden**         | Words and languages         | [Words](#words-and-languages-wl)        |
| **Links Math Club**           | Math and logic              | [Math](#math-and-logic-ml)              |
| **Rela's Board Club**         | Board and card games        | [Board](#board-and-card-games-bc)       |
| **Akoren's Science Lab**      | Physics, chemistry, biology | [Science](#science-lab-sl)              |
| **Omi Nature**                | Care, nature, ecology       | [Nature](#nature-and-care-nc)           |
| **Omi Workshop**              | Building and creating       | [Build](#build-and-create-bd)           |
| **Links Music**               | Music and rhythm            | [Music](#music-and-rhythm-mr)           |
| **Links Sports**              | Sports and motion           | [Sports](#sports-and-motion-sm)         |
| **Reya Space Academy**        | Space and physics           | [Space](#space-and-physics-sp)          |
| **Omi Stories**               | Stories and adventures      | [Stories](#stories-and-adventures-sa)   |
| **Two Planets**               | Strategy and simulation     | [Strategy](#strategy-and-simulation-ss) |

## Puzzles (PZ)

| ID    | Idea                                           | Proven genre (example)                | What it teaches                                        | Cx  |
| ----- | ---------------------------------------------- | ------------------------------------- | ------------------------------------------------------ | --- |
| PZ-01 | [Pair Friends](concepts/pages/pz-01.md) **W1** | Memory / pairs                        | Vocabulary in many languages, memory                   | 1   |
| PZ-02 | [Bead Merge](concepts/pages/pz-02.md) **W1**   | Slide-merge (2048)                    | Doubling, powers of two                                | 1   |
| PZ-03 | [Tangram Friends](concepts/pages/pz-03.md)     | Tangram                               | Shapes, area stays the same when pieces move           | 1   |
| PZ-04 | [Jigsaw of Omi](concepts/pages/pz-04.md)       | Jigsaw                                | Public-domain art, maps, anatomy pictures              | 1   |
| PZ-05 | [Spot the Change](concepts/pages/pz-05.md)     | Spot the difference                   | Attention; real photos of animals and plants           | 1   |
| PZ-06 | [Hidden Links](concepts/pages/pz-06.md)        | Hidden object                         | Vocabulary, observation                                | 1   |
| PZ-07 | [Slide Home](concepts/pages/pz-07.md)          | Sliding tiles (15-puzzle)             | Permutations, why half of the positions are unsolvable | 1   |
| PZ-08 | [Color Cups](concepts/pages/pz-08.md) **W1**   | Water / color sort                    | Color mixing, sorting, planning                        | 1–2 |
| PZ-09 | [Shape Garden](concepts/pages/pz-09.md) **W1** | Block placement                       | Area, spatial reasoning                                | 2   |
| PZ-10 | [Link It!](concepts/pages/pz-10.md) **W1**     | Connect pairs with non-crossing paths | Planning, matching concepts                            | 2   |
| PZ-11 | [Pixel Itsy](concepts/pages/pz-11.md) **W1**   | Nonogram                              | Logic, grid coordinates                                | 2–3 |
| PZ-12 | [Light the Links](concepts/pages/pz-12.md)     | Lights Out                            | Parity, linear algebra over two values                 | 2   |
| PZ-13 | [Pipe Garden](concepts/pages/pz-13.md)         | Rotate pipes (Pipe Mania, Net)        | Water flow, closed circuits                            | 2   |
| PZ-14 | [Untangle](concepts/pages/pz-14.md)            | Planar graph untangling               | Graph theory, planarity                                | 2   |
| PZ-15 | [Laser Mirrors](concepts/pages/pz-15.md)       | Reflection puzzle                     | Optics: angle of incidence equals angle of reflection  | 2   |
| PZ-16 | [Screw Garden](concepts/pages/pz-16.md) **W2** | Screw / pin puzzle                    | Order of operations                                    | 2   |
| PZ-17 | [Push & Think](concepts/pages/pz-17.md) **W2** | Box pushing (Sokoban)                 | Planning, irreversible moves                           | 3   |
| PZ-18 | [Gravity Turn](concepts/pages/pz-18.md)        | Rotate-the-world puzzle               | Gravity as a direction, falling bodies                 | 3   |
| PZ-19 | [Blossom Swap](concepts/pages/pz-19.md)        | Match-3                               | Planning cascades and recognizing plant parts          | 2   |
| PZ-20 | [Bubble Canopy](concepts/pages/pz-20.md)       | Bubble shooter                        | Reflection angles and color grouping                   | 3   |
| PZ-21 | [Tiny Triples](concepts/pages/pz-21.md)        | Triple-match object tray              | Classification and limited working space               | 2   |
| PZ-22 | [Pebble Pop](concepts/pages/pz-22.md)          | Tap-to-collapse puzzle                | Connected components and planning                      | 2   |
| PZ-23 | [Harvest Drop](concepts/pages/pz-23.md)        | Physics drop-and-merge                | Size ordering and collision prediction                 | 3   |
| PZ-24 | [Habitat Merge](concepts/pages/pz-24.md)       | Merge-3 map puzzle                    | Habitat succession and spatial planning                | 2   |
| PZ-25 | [Bicycle Jam](concepts/pages/pz-25.md)         | Parking escape puzzle                 | Dependencies and route planning                        | 2   |
| PZ-26 | [Shuttle Queue](concepts/pages/pz-26.md)       | Bus-seat sorting puzzle               | Capacity and queue management                          | 2   |
| PZ-27 | [Parcel Conveyor](concepts/pages/pz-27.md)     | Conveyor tile matching                | Ordering and buffer capacity                           | 2   |
| PZ-28 | [One Stroke Garden](concepts/pages/pz-28.md)   | One-line drawing puzzle               | Euler paths and graph degree                           | 2   |
| PZ-29 | [Ribbon Rescue](concepts/pages/pz-29.md)       | Rope sorting and untangling           | Spatial reasoning and crossing order                   | 3   |
| PZ-30 | [Trail Numbers](concepts/pages/pz-30.md)       | Numbered Hamiltonian path puzzle      | Sequencing and constraint propagation                  | 2   |

## Words and languages (WL)

| ID    | Idea                                            | Proven genre (example)            | What it teaches                         | Cx  |
| ----- | ----------------------------------------------- | --------------------------------- | --------------------------------------- | --- |
| WL-01 | [Letter Train](concepts/pages/wl-01.md) **W1**  | Snake                             | Spelling, counting                      | 1   |
| WL-02 | [Alphabet Trace](concepts/pages/wl-02.md)       | Tracing                           | Handwriting of many scripts             | 1   |
| WL-03 | [Phonics Pop](concepts/pages/wl-03.md)          | Bubble pop                        | Letter sounds, reading readiness        | 1   |
| WL-04 | [Word Search Garden](concepts/pages/wl-04.md)   | Word search                       | Vocabulary, scanning                    | 1   |
| WL-05 | [Translate Bridge](concepts/pages/wl-05.md)     | Matching                          | Foreign words, cognates                 | 1   |
| WL-06 | [Word Links](concepts/pages/wl-06.md) **W1**    | Daily word guess                  | Spelling, letter frequency              | 2   |
| WL-07 | [Anagram Bakery](concepts/pages/wl-07.md)       | Word scramble                     | Morphology, spelling                    | 2   |
| WL-08 | [Honeycomb Words](concepts/pages/wl-08.md)      | Letters-around-a-center word game | Vocabulary, prefixes and suffixes       | 2   |
| WL-09 | [Crossword Links](concepts/pages/wl-09.md)      | Mini crossword                    | Definitions, synonyms                   | 2   |
| WL-10 | [Rhyme Time](concepts/pages/wl-10.md)           | Rhythm matching                   | Rhymes, syllables, poetry               | 2   |
| WL-11 | [Sign Friends](concepts/pages/wl-11.md)         | Matching / memory                 | Sign-language alphabets                 | 2   |
| WL-12 | [Type the Rain](concepts/pages/wl-12.md)        | Typing tutor (falling words)      | Touch typing — words water the garden   | 2   |
| WL-13 | [Code Words](concepts/pages/wl-13.md)           | Cipher puzzles                    | Cryptography from Caesar to public keys | 2–3 |
| WL-14 | [Prime Sprites](concepts/pages/wl-14.md) **W3** | Sentence building                 | Grammar, word order across languages    | 3   |
| WL-15 | [Story Dice](concepts/pages/wl-15.md)           | Storytelling cards                | Narrative structure, speaking           | 3   |
| WL-16 | [Word Ladder Grove](concepts/pages/wl-16.md)    | Word transformation ladder        | Spelling and edit distance              | 2   |
| WL-17 | [Category Picnic](concepts/pages/wl-17.md)      | Word grouping puzzle              | Semantic categories and ambiguity       | 2   |
| WL-18 | [Picture Phrase](concepts/pages/wl-18.md)       | Rebus puzzle                      | Language inference and idioms           | 2   |

## Math and logic (ML)

| ID    | Idea                                                | Proven genre (example)                 | What it teaches                                                                                                    | Cx  |
| ----- | --------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --- |
| ML-01 | [Linky Hop](concepts/pages/ml-01.md) **W1**         | One-tap flyer                          | Mental arithmetic                                                                                                  | 1   |
| ML-02 | [Number Line Jump](concepts/pages/ml-02.md)         | Platform hop                           | Number line, negatives                                                                                             | 1   |
| ML-03 | [Times Table Garden](concepts/pages/ml-03.md)       | Tap to grow                            | Multiplication as area                                                                                             | 1   |
| ML-04 | [Pattern Train](concepts/pages/ml-04.md)            | Sequence completion                    | Patterns, sequences                                                                                                | 1   |
| ML-05 | [Uni's Grid](concepts/pages/ml-05.md) **W1**        | Sudoku                                 | Uniqueness, deduction                                                                                              | 2   |
| ML-06 | [Postie's Treasure](concepts/pages/ml-06.md) **W1** | Minesweeper-like deduction             | Adjacency, probability                                                                                             | 2   |
| ML-07 | [Fraction Kitchen](concepts/pages/ml-07.md)         | Cutting / slicing                      | Fractions, equal shares                                                                                            | 2   |
| ML-08 | [Balance Friends](concepts/pages/ml-08.md)          | Balance-scale algebra (DragonBox-like) | Equations: do the same to both sides                                                                               | 2   |
| ML-09 | [Cage Sums](concepts/pages/ml-09.md)                | Kakuro / arithmetic cages              | Sums, factor pairs                                                                                                 | 2   |
| ML-10 | [Tower of Hanoi Acorns](concepts/pages/ml-10.md)    | Tower of Hanoi                         | Recursion, powers of two                                                                                           | 2   |
| ML-11 | [Binary Beads](concepts/pages/ml-11.md)             | Switch puzzles                         | Binary numbers, bits                                                                                               | 2   |
| ML-12 | [Match the Kind](concepts/pages/ml-12.md)           | Attribute matching card game           | Sets, logic of attributes                                                                                          | 2   |
| ML-13 | [Detective Grid](concepts/pages/ml-13.md)           | Logic grid (zebra puzzle)              | Deduction, truth tables                                                                                            | 2–3 |
| ML-14 | [Lucky Spinner Lab](concepts/pages/ml-14.md)        | Dice / spinner experiments             | Probability, law of large numbers                                                                                  | 2–3 |
| ML-15 | [Compass Garden](concepts/pages/ml-15.md)           | Compass-and-straightedge (Euclid)      | Geometry constructions                                                                                             | 3   |
| ML-16 | [Shortest Path Postie](concepts/pages/ml-16.md)     | Route puzzle                           | Graphs, shortest paths, algorithms                                                                                 | 3   |
| ML-17 | [Proof Steps](concepts/pages/ml-17.md)              | Rule-rewrite puzzle                    | Logic and proofs in Links Notation ([relative-meta-logic](https://github.com/link-foundation/relative-meta-logic)) | 3–4 |
| ML-18 | [Island Bridges](concepts/pages/ml-18.md)           | Hashi bridges puzzle                   | Graph degree and connectivity                                                                                      | 2   |
| ML-19 | [Greater Garden](concepts/pages/ml-19.md)           | Futoshiki inequality puzzle            | Ordering and inequalities                                                                                          | 2   |
| ML-20 | [Make Twenty-Four](concepts/pages/ml-20.md)         | Arithmetic expression puzzle           | Arithmetic and order of operations                                                                                 | 1   |

## Board and card games (BC)

| ID    | Idea                                                | Proven genre (example)                     | What it teaches                               | Cx  |
| ----- | --------------------------------------------------- | ------------------------------------------ | --------------------------------------------- | --- |
| BC-01 | [Tic-Tac-Links](concepts/pages/bc-01.md)            | Tic-tac-toe and ultimate tic-tac-toe       | Strategy, forced moves                        | 1   |
| BC-02 | [Ropes and Ladders](concepts/pages/bc-02.md)        | Snakes and ladders (Moksha Patam)          | Counting, history of the game's moral lessons | 1   |
| BC-03 | [Happy Families](concepts/pages/bc-03.md)           | Go Fish / families                         | Categories, asking politely                   | 1   |
| BC-04 | [Dominoes](concepts/pages/bc-04.md)                 | Dominoes                                   | Number matching, addition                     | 1–2 |
| BC-05 | [Rela's Board Club](concepts/pages/bc-05.md) **W1** | Reversi, checkers, mancala, four in a row  | Strategy, counting, fair play                 | 2–3 |
| BC-06 | [Nim Garden](concepts/pages/bc-06.md)               | Nim                                        | Game theory, winning positions, binary XOR    | 2   |
| BC-07 | [Home Run Race](concepts/pages/bc-07.md)            | Ludo / pachisi (pieces go home, not "die") | Counting, probability of dice                 | 2   |
| BC-08 | [Solitaire](concepts/pages/bc-08.md) **W2**         | Klondike, FreeCell, spider                 | Sequencing, suits                             | 2   |
| BC-09 | [Tile Pairs](concepts/pages/bc-09.md) **W2**        | Mahjong solitaire                          | Chinese numerals and symbols                  | 2   |
| BC-10 | [Sets and Runs](concepts/pages/bc-10.md)            | Rummy                                      | Sets, sequences, planning                     | 2–3 |
| BC-11 | [Hex Bridges](concepts/pages/bc-11.md)              | Hex (connection game)                      | Topology: one side always connects            | 3   |
| BC-12 | [Garden Plots](concepts/pages/bc-12.md)             | Go (territory)                             | Territory, liberty, patience                  | 3–4 |
| BC-13 | [Chess Friends](concepts/pages/bc-13.md)            | Chess (captured pieces "go home")          | Planning, history of chess                    | 3–4 |
| BC-14 | [Island Rescue](concepts/pages/bc-14.md)            | Cooperative board game                     | Teamwork, risk management                     | 3   |
| BC-15 | [Acorn Backgammon](concepts/pages/bc-15.md)         | Backgammon                                 | Probability and risk-aware planning           | 3   |
| BC-16 | [Leaf Hearts](concepts/pages/bc-16.md)              | Hearts card game                           | Counting suits and forecasting                | 2   |
| BC-17 | [Signal Crew](concepts/pages/bc-17.md)              | Cooperative trick-taking                   | Communication constraints and deduction       | 3   |
| BC-18 | [Expedition Deck](concepts/pages/bc-18.md)          | Roguelite deckbuilder                      | Probability and resource trade-offs           | 4   |

## Science lab (SL)

| ID    | Idea                                           | Proven genre (example)                    | What it teaches                                | Cx  |
| ----- | ---------------------------------------------- | ----------------------------------------- | ---------------------------------------------- | --- |
| SL-01 | [Light and Color](concepts/pages/sl-01.md)     | Color mixing toy                          | Additive (light) vs subtractive (paint) mixing | 1   |
| SL-02 | [Element Cards](concepts/pages/sl-02.md)       | Collectible cards                         | The periodic table                             | 1–2 |
| SL-03 | [Acorn Tower](concepts/pages/sl-03.md) **W1**  | Stack / tower timing                      | Balance, center of mass                        | 2   |
| SL-04 | [Body Explorer](concepts/pages/sl-04.md)       | Hidden object / jigsaw                    | Anatomy, organs and what they do               | 2   |
| SL-05 | [Density Tank](concepts/pages/sl-05.md)        | Drop-and-see physics toy                  | Buoyancy, density                              | 2–3 |
| SL-06 | [Magnet Maze](concepts/pages/sl-06.md)         | Tilt maze                                 | Magnetic fields                                | 3   |
| SL-07 | [Rope Friends](concepts/pages/sl-07.md) **W2** | Rope cutting physics                      | Forces, tension, pendulums                     | 3   |
| SL-08 | [Seed Sling](concepts/pages/sl-08.md)          | Slingshot physics (launch seeds to plant) | Projectile motion, angles                      | 3   |
| SL-09 | [Atom Merge](concepts/pages/sl-09.md) **W2**   | Merge-2                                   | Atoms to molecules, chemical bonds             | 3   |
| SL-10 | [Circuit Garden](concepts/pages/sl-10.md)      | Circuit building                          | Ohm's law, logic gates                         | 3   |
| SL-11 | [Optics Bench](concepts/pages/sl-11.md)        | Laser / lens puzzle                       | Refraction, lenses, focal length               | 3   |
| SL-12 | [Simple Machines](concepts/pages/sl-12.md)     | Contraption builder (Incredible Machine)  | Levers, pulleys, gears, energy                 | 3   |
| SL-13 | [Sound Waves](concepts/pages/sl-13.md)         | Music toy with an oscilloscope            | Frequency, amplitude, resonance                | 3   |
| SL-14 | [Weather Maker](concepts/pages/sl-14.md)       | Sandbox                                   | Water cycle, clouds, pressure                  | 3–4 |
| SL-15 | [Bridge Builder](concepts/pages/sl-15.md)      | Bridge construction (Poly Bridge)         | Structural forces, tension and compression     | 4   |
| SL-16 | [Sand and Water](concepts/pages/sl-16.md)      | Falling-sand sandbox (Powder Toy)         | States of matter, reactions                    | 4   |
| SL-17 | [Microscope Explorer](concepts/pages/sl-17.md) | Exploration / collection                  | Cells, microorganisms, scale                   | 4   |
| SL-18 | [Momentum Pinball](concepts/pages/sl-18.md)    | Pinball                                   | Momentum and angle of reflection               | 3   |
| SL-19 | [Prism Breaker](concepts/pages/sl-19.md)       | Brick-breaker                             | Angles and elastic collision models            | 3   |
| SL-20 | [Watergate Pins](concepts/pages/sl-20.md)      | Pull-pin flow puzzle                      | Gravity and connectivity                       | 3   |

## Nature and care (NC)

| ID    | Idea                                          | Proven genre (example)                     | What it teaches                          | Cx  |
| ----- | --------------------------------------------- | ------------------------------------------ | ---------------------------------------- | --- |
| NC-01 | [Healthy Habits](concepts/pages/nc-01.md)     | Routine toy (brush teeth, wash hands)      | Hygiene, sleep, healthy food             | 1   |
| NC-02 | [Weather Dress-Up](concepts/pages/nc-02.md)   | Dress-up                                   | Weather, temperature, seasons            | 1   |
| NC-03 | [Recycling Sorter](concepts/pages/nc-03.md)   | Sorting                                    | Materials, recycling rules               | 1   |
| NC-04 | [Bird Watch](concepts/pages/nc-04.md)         | Photo safari (instead of hunting)          | Real species identification              | 2   |
| NC-05 | [Ocean Cleanup](concepts/pages/nc-05.md)      | Collecting arcade                          | Plastic in the ocean, marine life        | 2   |
| NC-06 | [Pollinator Path](concepts/pages/nc-06.md)    | Path drawing                               | Bees, flowers, pollination               | 2   |
| NC-07 | [Animal Vet](concepts/pages/nc-07.md)         | Care / hospital sim                        | Animal health, empathy                   | 2–3 |
| NC-08 | [Linky Home](concepts/pages/nc-08.md) **W1**  | Virtual pet                                | Care routines, emotions                  | 3   |
| NC-09 | [Garden Grow](concepts/pages/nc-09.md)        | Garden sim                                 | Plant biology, light, water, soil        | 3   |
| NC-10 | [Community Kitchen](concepts/pages/nc-10.md)  | Cooking (Cooking Mama, Overcooked)         | Recipes, nutrition, measuring            | 3   |
| NC-11 | [Seasons Farm](concepts/pages/nc-11.md)       | Farming sim (Harvest Moon, Stardew Valley) | Crop rotation, seasons, soil             | 4   |
| NC-12 | [Migration Map](concepts/pages/nc-12.md)      | Route strategy                             | Geography, animal migration              | 4   |
| NC-13 | [Aquarium Balance](concepts/pages/nc-13.md)   | Ecosystem sim                              | Food webs, nitrogen cycle                | 4   |
| NC-14 | [Forest Keeper](concepts/pages/nc-14.md)      | Management sim                             | Forest ecology, fire prevention, commons | 4   |
| NC-15 | [Clean Little World](concepts/pages/nc-15.md) | Cleaning simulator                         | Material care and water budgeting        | 3   |
| NC-16 | [Terrarium Journal](concepts/pages/nc-16.md)  | Creature collection and care               | Microhabitats and species observation    | 3   |
| NC-17 | [Magnet Fishing Day](concepts/pages/nc-17.md) | Fishing-style cleanup                      | Magnetism and material classification    | 3   |

## Build and create (BD)

| ID    | Idea                                         | Proven genre (example)               | What it teaches                                    | Cx  |
| ----- | -------------------------------------------- | ------------------------------------ | -------------------------------------------------- | --- |
| BD-01 | [Omi Colors](concepts/pages/bd-01.md) **W1** | Coloring / color by number           | Colors, numbers, art history                       | 2   |
| BD-02 | [Pixel Studio](concepts/pages/bd-02.md)      | Pixel art editor                     | Grids, symmetry                                    | 1–2 |
| BD-03 | [Costume Designer](concepts/pages/bd-03.md)  | Dress-up / fashion                   | Color theory, patterns of world cultures           | 2   |
| BD-04 | [Origami Folds](concepts/pages/bd-04.md)     | Folding puzzle                       | Geometry of folding                                | 2–3 |
| BD-05 | [Robot Programmer](concepts/pages/bd-05.md)  | Visual coding (Lightbot, Scratch Jr) | Sequences, loops, functions                        | 2–3 |
| BD-06 | [Map Maker](concepts/pages/bd-06.md)         | Map editor                           | Cartography, scale, compass directions             | 3   |
| BD-07 | [Marble Run](concepts/pages/bd-07.md)        | Construction physics                 | Gravity, energy conservation                       | 3   |
| BD-08 | [Animation Studio](concepts/pages/bd-08.md)  | Flipbook maker                       | Frames, timing, persistence of vision              | 3   |
| BD-09 | [Level Maker](concepts/pages/bd-09.md)       | Level editor for our other games     | Design, testing, sharing                           | 3   |
| BD-10 | [Tiny Architect](concepts/pages/bd-10.md)    | Building design                      | Structures, materials, accessibility               | 4   |
| BD-11 | [Block World](concepts/pages/bd-11.md)       | Voxel sandbox (Minecraft)            | Geometry, volume, engineering, redstone-like logic | 5   |
| BD-12 | [Room for Everyone](concepts/pages/bd-12.md) | Unpacking and room organization      | Spatial fit and accessible design                  | 2   |
| BD-13 | [Research Backpack](concepts/pages/bd-13.md) | Inventory packing and synergies      | Area and adjacency constraints                     | 2   |
| BD-14 | [Clay and Symmetry](concepts/pages/bd-14.md) | Pottery shaping                      | Rotational symmetry and volume                     | 3   |

## Music and rhythm (MR)

| ID    | Idea                                      | Proven genre (example)                | What it teaches                                           | Cx  |
| ----- | ----------------------------------------- | ------------------------------------- | --------------------------------------------------------- | --- |
| MR-01 | [Echo Links](concepts/pages/mr-01.md)     | Simon (repeat the sequence)           | Memory, pitch                                             | 1   |
| MR-02 | [Drum Circle](concepts/pages/mr-02.md)    | Rhythm toy                            | Rhythms of world cultures                                 | 1   |
| MR-03 | [Piano Steps](concepts/pages/mr-03.md)    | Falling tiles                         | Reading notes, melody                                     | 2   |
| MR-04 | [Rhythm Tap](concepts/pages/mr-04.md)     | Rhythm game                           | Beats, note lengths as fractions                          | 2   |
| MR-05 | [Ear Trainer](concepts/pages/mr-05.md)    | Matching                              | Intervals, chords                                         | 2   |
| MR-06 | [Melody Garden](concepts/pages/mr-06.md)  | Step sequencer (melodies grow plants) | Composition, scales                                       | 3   |
| MR-07 | [Conductor](concepts/pages/mr-07.md)      | Timing game                           | Tempo, orchestra instruments                              | 3   |
| MR-08 | [Sing Along](concepts/pages/mr-08.md)     | Karaoke with pitch line               | Pitch, breathing (microphone off in kids mode by default) | 3   |
| MR-09 | [Dance Dialogue](concepts/pages/mr-09.md) | Rhythm duel                           | Call-and-response and timing                              | 3   |
| MR-10 | [Beat Path](concepts/pages/mr-10.md)      | Rhythm platformer                     | Beat subdivision and anticipation                         | 3   |

## Sports and motion (SM)

| ID    | Idea                                        | Proven genre (example)           | What it teaches                  | Cx  |
| ----- | ------------------------------------------- | -------------------------------- | -------------------------------- | --- |
| SM-01 | [Juggle](concepts/pages/sm-01.md)           | Timing                           | Rhythm, parabolas                | 2   |
| SM-02 | [Linky Run](concepts/pages/sm-02.md) **W2** | Endless runner                   | Categories (lanes), quick recall | 2–3 |
| SM-03 | [Mini Golf](concepts/pages/sm-03.md)        | Mini golf                        | Angles, friction, energy         | 3   |
| SM-04 | [Curling Friends](concepts/pages/sm-04.md)  | Curling / bowling                | Friction, momentum               | 3   |
| SM-05 | [Hoops](concepts/pages/sm-05.md)            | Basketball shots                 | Projectile motion                | 3   |
| SM-06 | [Billiard Links](concepts/pages/sm-06.md)   | Billiards                        | Elastic collisions, momentum     | 3   |
| SM-07 | [Paper Planes](concepts/pages/sm-07.md)     | Glider                           | Lift, drag, glide ratio          | 3   |
| SM-08 | [Kite Day](concepts/pages/sm-08.md)         | Flying toy                       | Wind, lift, tension              | 3   |
| SM-09 | [Ski Slalom](concepts/pages/sm-09.md)       | Downhill                         | Slopes, gravity, friction        | 3   |
| SM-10 | [Table Tennis](concepts/pages/sm-10.md)     | Racket sports                    | Spin, the Magnus effect          | 3–4 |
| SM-11 | [Kart Friends](concepts/pages/sm-11.md)     | Kart racing (no items that hurt) | Vectors, grip, racing lines      | 4   |
| SM-12 | [Sailing](concepts/pages/sm-12.md)          | Sailing sim                      | Real sail physics, wind vectors  | 4   |
| SM-13 | [Climbing](concepts/pages/sm-13.md)         | Physics climber                  | Balance, center of mass          | 4   |
| SM-14 | [Skate Park](concepts/pages/sm-14.md)       | Trick sports                     | Rotation, angular momentum       | 4–5 |
| SM-15 | [Crossing Friends](concepts/pages/sm-15.md) | Endless crossing arcade          | Timing and gap estimation        | 2   |
| SM-16 | [Keep It Up](concepts/pages/sm-16.md)       | Cooperative volleyball           | Trajectories and cooperation     | 3   |
| SM-17 | [Rooftop Routes](concepts/pages/sm-17.md)   | Precision platformer             | Momentum and safe route planning | 3   |

## Space and physics (SP)

| ID    | Idea                                         | Proven genre (example)                       | What it teaches                                   | Cx  |
| ----- | -------------------------------------------- | -------------------------------------------- | ------------------------------------------------- | --- |
| SP-01 | [Star Names](concepts/pages/sp-01.md)        | Connect the dots                             | Constellations and real star data                 | 1   |
| SP-02 | [Planet Pairs](concepts/pages/sp-02.md)      | Memory                                       | Planets and moons                                 | 1   |
| SP-03 | [Deflect!](concepts/pages/sp-03.md)          | Physics puzzle (2D vector)                   | Impulse: a small push early beats a big push late | 3   |
| SP-04 | [Lunar Lander](concepts/pages/sp-04.md)      | Lander                                       | Thrust, gravity, fuel budget                      | 3   |
| SP-05 | [Orbit Garden](concepts/pages/sp-05.md)      | Gravity sandbox                              | Kepler's laws, orbits                             | 3–4 |
| SP-06 | [Station Watch](concepts/pages/sp-06.md)     | Monitoring / idle sim                        | Detection, light delay, prediction                | 4   |
| SP-07 | [Probe Workshop](concepts/pages/sp-07.md)    | Engineering builder                          | Mass budgets, the rocket equation, sensors        | 4   |
| SP-08 | [Light-Lag Chess](concepts/pages/sp-08.md)   | Turn-based strategy with delayed information | Light speed and information                       | 4   |
| SP-09 | [Telescope Tour](concepts/pages/sp-09.md)    | Exploration                                  | Real sky catalogs, distances, light-years         | 4   |
| SP-10 | [Solar Sail](concepts/pages/sp-10.md)        | Navigation                                   | Radiation pressure, slow but endless thrust       | 4   |
| SP-11 | [Satellite Network](concepts/pages/sp-11.md) | Network builder                              | Orbits, coverage, communication delay             | 4–5 |
| SP-12 | [Rocket Builder](concepts/pages/sp-12.md)    | Rocket sim (Kerbal Space Program)            | Staging, delta-v, orbital mechanics               | 5   |
| SP-13 | [Planet Maker](concepts/pages/sp-13.md)      | God game                                     | Habitable zones, atmospheres, climate             | 5–6 |
| SP-14 | [Relativity Ride](concepts/pages/sp-14.md)   | Flight sim near light speed                  | Time dilation, Doppler, aberration                | 6   |
| SP-15 | [Orbital Dock](concepts/pages/sp-15.md)      | Precision docking simulator                  | Relative velocity and reference frames            | 4   |
| SP-16 | [Debris Sweep](concepts/pages/sp-16.md)      | Survivor-like rescue arcade                  | Vectors and prioritization                        | 3   |
| SP-17 | [Rover Geologist](concepts/pages/sp-17.md)   | Rover exploration simulator                  | Geology and instrument uncertainty                | 4   |

## Stories and adventures (SA)

| ID    | Idea                                                      | Proven genre (example)               | What it teaches                            | Cx  |
| ----- | --------------------------------------------------------- | ------------------------------------ | ------------------------------------------ | --- |
| SA-01 | [Choose Your Path](concepts/pages/sa-01.md)               | Interactive picture book             | Reading, choices and consequences          | 1–2 |
| SA-02 | [Kindness Quests](concepts/pages/sa-02.md)                | Daily quests                         | Social and emotional learning              | 2   |
| SA-03 | [Museum Night](concepts/pages/sa-03.md)                   | Point and click                      | Art history                                | 3   |
| SA-04 | [Little Detective](concepts/pages/sa-04.md)               | Mystery / deduction                  | Evidence, reasoning, fair judgment         | 3   |
| SA-05 | [Escape Room Together](concepts/pages/sa-05.md)           | Cooperative escape room              | Teamwork, logic                            | 3   |
| SA-06 | [Archaeology Dig](concepts/pages/sa-06.md)                | Dig and restore                      | Stratigraphy, history                      | 3   |
| SA-07 | [Language Quest](concepts/pages/sa-07.md)                 | Adventure in a foreign language      | Immersion learning                         | 3–4 |
| SA-08 | [Time Travel Diary](concepts/pages/sa-08.md)              | Visual novel                         | History from many points of view           | 3–4 |
| SA-09 | [Messages Across the Dark](concepts/pages/sa-09.md)       | Language and code puzzle             | Building a shared language from math       | 4   |
| SA-10 | [Cadets of Depth Academy](concepts/pages/sa-10.md) **W3** | Story-led puzzle campaign            | Links theory: point → doublet → network    | 4   |
| SA-11 | [Explore Omi](concepts/pages/sa-11.md) **W3**             | 3D exploration with the anime hosts  | Geography, ecology of Omi mapped to Earth  | 5   |
| SA-12 | [The Escape (13+)](concepts/pages/sa-12.md)               | Narrative adventure                  | Empathy for people inside a violent system | 5   |
| SA-13 | [Lantern Labyrinth](concepts/pages/sa-13.md)              | Exploration metroidvania             | Mapping and tool-based reasoning           | 4   |
| SA-14 | [Evidence Circle](concepts/pages/sa-14.md)                | Social deduction without elimination | Evidence quality and revising beliefs      | 3   |
| SA-15 | [Map of Whispers](concepts/pages/sa-15.md)                | Non-combat roguelike exploration     | Risk assessment and navigation             | 3   |

## Strategy and simulation (SS)

| ID    | Idea                                             | Proven genre (example)                                | What it teaches                              | Cx  |
| ----- | ------------------------------------------------ | ----------------------------------------------------- | -------------------------------------------- | --- |
| SS-01 | [Idle Science](concepts/pages/ss-01.md) **W2**   | Idle / incremental                                    | Exponents, compound growth                   | 2   |
| SS-02 | [Garden Guard](concepts/pages/ss-02.md) **W2**   | Tower defense (nets and umbrellas vs weather)         | Geometry, resource planning                  | 3   |
| SS-03 | [Traffic Lights](concepts/pages/ss-03.md)        | Traffic puzzle                                        | Flow, queues, timing                         | 3   |
| SS-04 | [Energy Grid](concepts/pages/ss-04.md)           | Balancing sim                                         | Supply and demand of power, storage          | 4   |
| SS-05 | [Water Commons](concepts/pages/ss-05.md)         | Commons management                                    | Ostrom's rules for shared resources          | 4   |
| SS-06 | [Logistics Links](concepts/pages/ss-06.md)       | Transport tycoon (needs met, not profit)              | Networks, logistics                          | 4   |
| SS-07 | [Outbreak Stoppers](concepts/pages/ss-07.md)     | Cooperative epidemic game                             | Epidemiology (SIR models), vaccines, hygiene | 4   |
| SS-08 | [Food Web](concepts/pages/ss-08.md)              | Ecosystem sim                                         | Predator–prey cycles as population curves    | 4   |
| SS-09 | [Care Hospital](concepts/pages/ss-09.md)         | Hospital management                                   | Health systems, triage, empathy              | 4   |
| SS-10 | [Town of Links](concepts/pages/ss-10.md)         | City builder                                          | Urban planning, resource flows               | 4–5 |
| SS-11 | [Climate Council](concepts/pages/ss-11.md)       | Policy sim                                            | Climate models, trade-offs                   | 5   |
| SS-12 | [Two Planets](concepts/pages/ss-12.md)           | 4X without war (explore, expand, exchange, cooperate) | Resource-based vs scarcity economies         | 5   |
| SS-13 | [Mars Habitat](concepts/pages/ss-13.md)          | Survival / colony sim                                 | Life support: air, water, food, energy       | 5–6 |
| SS-14 | [First Contact (final)](concepts/pages/ss-14.md) | Realistic multi-genre simulator                       | Everything above, at real scale              | 7   |
| SS-15 | [Circular Factory](concepts/pages/ss-15.md)      | Factory automation                                    | Flow rates and closed material loops         | 4   |
| SS-16 | [Helper Teams](concepts/pages/ss-16.md)          | Non-combat autobattler                                | Complementary roles and scheduling           | 4   |
| SS-17 | [Lunch for All](concepts/pages/ss-17.md)         | Restaurant time management                            | Queueing and nutrition planning              | 3   |
| SS-18 | [Repair Cafe](concepts/pages/ss-18.md)           | Workshop management                                   | Repairability and resource allocation        | 4   |
| SS-19 | [Railway Signals](concepts/pages/ss-19.md)       | Train dispatch and track routing                      | Scheduling and collision avoidance           | 3   |
| SS-20 | [Ready Together](concepts/pages/ss-20.md)        | Cooperative disaster preparation                      | Preparedness and resilient systems           | 4   |

The First Contact seeds (Station Watch, Deflect!, Probe Workshop,
Light-Lag Chess, Messages Across the Dark, The Escape, Two Planets) are
small games first, so the final simulator is assembled from games players
already know ([lore](lore/first-contact.md#game-seeds-from-the-setting)).

## Non-violent reframing

Popular genres with violence keep their fun mechanics; only the fiction
changes (R41).

| Popular violent genre        | What makes it fun                 | Our non-violent version                                                          |
| ---------------------------- | --------------------------------- | -------------------------------------------------------------------------------- |
| Shooter                      | Aiming, timing, quick decisions   | Photographer, painter, seed planter, firefighter with water                      |
| Tower defense                | Placement, planning, upgrades     | Guard the garden from weather, weeds and lost sheep                              |
| Fighting game                | Combos, reading the opponent      | Dance battles, rhythm duels, debate with good arguments                          |
| War strategy / 4X            | Explore, expand, manage resources | Explore, expand, exchange, cooperate; terraforming and diplomacy                 |
| Battle royale                | Shrinking area, last one standing | Rescue race: bring everyone to safety; cleanup races                             |
| Stealth                      | Hiding, timing, patrol patterns   | Hide and seek, surprise parties, wildlife observation                            |
| Zombie survival              | Pressure, scarcity, crafting      | Sleepy Nully naps everywhere; wake the town with music and breakfast             |
| Asteroid shooter             | Steering, momentum                | Deflect and catch asteroids for science ([First Contact](lore/first-contact.md)) |
| Combat in chess and checkers | Abstract capture                  | Captured pieces "go home"; nothing is destroyed                                  |

## Games that advance science

R49 asks that games advance not only education but also science. Proven
citizen-science games show this works
([sources](../case-studies/issue-1/data/research-genres-ideas.md#31-citizen-science-games-players-produce-real-research)):
Foldit players solved the structure of a retroviral protease (2011),
EteRNA players' design rules became an RNA design algorithm (PNAS 2014),
EyeWire players mapped retinal neurons (Nature 2014), Sea Hero Quest
collected navigation data from 4.3 million players for dementia research,
and the tile-sliding Borderlands Science minigame aligned about a million
rRNA sequences from 135 million solved puzzles (Nature Biotechnology 2024).
The last two show that a **simple puzzle** can carry real science if a
research partner supplies the data and checks the results. Educational
games in general beat non-game teaching by a moderate amount (g ≈ 0.3 in
two meta-analyses), more so over several short sessions
([evidence](../case-studies/issue-1/data/research-genres-ideas.md#35-transfer-of-learning-what-the-evidence-supports)).
Our path:

1. **Learn real science** in every game (all of the above).
2. **Open data and open simulators**: every simulator in Cx 6–7 is public
   domain and validated against real measurements
   ([simulation engine](simulation-engine.md#validation)).
3. **Citizen-science modes** for adults where a real research question
   fits a game we already have (with opt-in, anonymous, open data, and never
   in kids mode).

## Adding an idea

Ideas are welcome from anyone: open an issue in `master-plan` with the
[game idea template](templates/ISSUE_TEMPLATE/game-idea.md), name the proven
genre, the lesson inside the mechanic, the `Cx` and the collection. Accepted
ideas get an ID in this list; ideas are moved into a wave of the
[catalog](game-catalog.md) when the [roadmap](roadmap.md) allows.
