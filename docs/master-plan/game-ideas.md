# Game Ideas — the Big List

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

| ID    | Idea                | Proven genre (example)                | What it teaches                                        | Cx  |
| ----- | ------------------- | ------------------------------------- | ------------------------------------------------------ | --- |
| PZ-01 | Pair Friends **W1** | Memory / pairs                        | Vocabulary in many languages, memory                   | 1   |
| PZ-02 | Bead Merge **W1**   | Slide-merge (2048)                    | Doubling, powers of two                                | 1   |
| PZ-03 | Tangram Friends     | Tangram                               | Shapes, area stays the same when pieces move           | 1   |
| PZ-04 | Jigsaw of Omi       | Jigsaw                                | Public-domain art, maps, anatomy pictures              | 1   |
| PZ-05 | Spot the Change     | Spot the difference                   | Attention; real photos of animals and plants           | 1   |
| PZ-06 | Hidden Links        | Hidden object                         | Vocabulary, observation                                | 1   |
| PZ-07 | Slide Home          | Sliding tiles (15-puzzle)             | Permutations, why half of the positions are unsolvable | 1   |
| PZ-08 | Color Cups **W1**   | Water / color sort                    | Color mixing, sorting, planning                        | 1–2 |
| PZ-09 | Shape Garden **W1** | Block placement                       | Area, spatial reasoning                                | 2   |
| PZ-10 | Link It! **W1**     | Connect pairs with non-crossing paths | Planning, matching concepts                            | 2   |
| PZ-11 | Pixel Itsy **W1**   | Nonogram                              | Logic, grid coordinates                                | 2–3 |
| PZ-12 | Light the Links     | Lights Out                            | Parity, linear algebra over two values                 | 2   |
| PZ-13 | Pipe Garden         | Rotate pipes (Pipe Mania, Net)        | Water flow, closed circuits                            | 2   |
| PZ-14 | Untangle            | Planar graph untangling               | Graph theory, planarity                                | 2   |
| PZ-15 | Laser Mirrors       | Reflection puzzle                     | Optics: angle of incidence equals angle of reflection  | 2   |
| PZ-16 | Screw Garden **W2** | Screw / pin puzzle                    | Order of operations                                    | 2   |
| PZ-17 | Push & Think **W2** | Box pushing (Sokoban)                 | Planning, irreversible moves                           | 3   |
| PZ-18 | Gravity Turn        | Rotate-the-world puzzle               | Gravity as a direction, falling bodies                 | 3   |

## Words and languages (WL)

| ID    | Idea                 | Proven genre (example)            | What it teaches                         | Cx  |
| ----- | -------------------- | --------------------------------- | --------------------------------------- | --- |
| WL-01 | Letter Train **W1**  | Snake                             | Spelling, counting                      | 1   |
| WL-02 | Alphabet Trace       | Tracing                           | Handwriting of many scripts             | 1   |
| WL-03 | Phonics Pop          | Bubble pop                        | Letter sounds, reading readiness        | 1   |
| WL-04 | Word Search Garden   | Word search                       | Vocabulary, scanning                    | 1   |
| WL-05 | Translate Bridge     | Matching                          | Foreign words, cognates                 | 1   |
| WL-06 | Word Links **W1**    | Daily word guess                  | Spelling, letter frequency              | 2   |
| WL-07 | Anagram Bakery       | Word scramble                     | Morphology, spelling                    | 2   |
| WL-08 | Honeycomb Words      | Letters-around-a-center word game | Vocabulary, prefixes and suffixes       | 2   |
| WL-09 | Crossword Links      | Mini crossword                    | Definitions, synonyms                   | 2   |
| WL-10 | Rhyme Time           | Rhythm matching                   | Rhymes, syllables, poetry               | 2   |
| WL-11 | Sign Friends         | Matching / memory                 | Sign-language alphabets                 | 2   |
| WL-12 | Type the Rain        | Typing tutor (falling words)      | Touch typing — words water the garden   | 2   |
| WL-13 | Code Words           | Cipher puzzles                    | Cryptography from Caesar to public keys | 2–3 |
| WL-14 | Prime Sprites **W3** | Sentence building                 | Grammar, word order across languages    | 3   |
| WL-15 | Story Dice           | Storytelling cards                | Narrative structure, speaking           | 3   |

## Math and logic (ML)

| ID    | Idea                     | Proven genre (example)                 | What it teaches                                                                                                    | Cx  |
| ----- | ------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --- |
| ML-01 | Linky Hop **W1**         | One-tap flyer                          | Mental arithmetic                                                                                                  | 1   |
| ML-02 | Number Line Jump         | Platform hop                           | Number line, negatives                                                                                             | 1   |
| ML-03 | Times Table Garden       | Tap to grow                            | Multiplication as area                                                                                             | 1   |
| ML-04 | Pattern Train            | Sequence completion                    | Patterns, sequences                                                                                                | 1   |
| ML-05 | Uni's Grid **W1**        | Sudoku                                 | Uniqueness, deduction                                                                                              | 2   |
| ML-06 | Postie's Treasure **W1** | Minesweeper-like deduction             | Adjacency, probability                                                                                             | 2   |
| ML-07 | Fraction Kitchen         | Cutting / slicing                      | Fractions, equal shares                                                                                            | 2   |
| ML-08 | Balance Friends          | Balance-scale algebra (DragonBox-like) | Equations: do the same to both sides                                                                               | 2   |
| ML-09 | Cage Sums                | Kakuro / arithmetic cages              | Sums, factor pairs                                                                                                 | 2   |
| ML-10 | Tower of Hanoi Acorns    | Tower of Hanoi                         | Recursion, powers of two                                                                                           | 2   |
| ML-11 | Binary Beads             | Switch puzzles                         | Binary numbers, bits                                                                                               | 2   |
| ML-12 | Match the Kind           | Attribute matching card game           | Sets, logic of attributes                                                                                          | 2   |
| ML-13 | Detective Grid           | Logic grid (zebra puzzle)              | Deduction, truth tables                                                                                            | 2–3 |
| ML-14 | Lucky Spinner Lab        | Dice / spinner experiments             | Probability, law of large numbers                                                                                  | 2–3 |
| ML-15 | Compass Garden           | Compass-and-straightedge (Euclid)      | Geometry constructions                                                                                             | 3   |
| ML-16 | Shortest Path Postie     | Route puzzle                           | Graphs, shortest paths, algorithms                                                                                 | 3   |
| ML-17 | Proof Steps              | Rule-rewrite puzzle                    | Logic and proofs in Links Notation ([relative-meta-logic](https://github.com/link-foundation/relative-meta-logic)) | 3–4 |

## Board and card games (BC)

| ID    | Idea                     | Proven genre (example)                     | What it teaches                               | Cx  |
| ----- | ------------------------ | ------------------------------------------ | --------------------------------------------- | --- |
| BC-01 | Tic-Tac-Links            | Tic-tac-toe and ultimate tic-tac-toe       | Strategy, forced moves                        | 1   |
| BC-02 | Ropes and Ladders        | Snakes and ladders (Moksha Patam)          | Counting, history of the game's moral lessons | 1   |
| BC-03 | Happy Families           | Go Fish / families                         | Categories, asking politely                   | 1   |
| BC-04 | Dominoes                 | Dominoes                                   | Number matching, addition                     | 1–2 |
| BC-05 | Rela's Board Club **W1** | Reversi, checkers, mancala, four in a row  | Strategy, counting, fair play                 | 2–3 |
| BC-06 | Nim Garden               | Nim                                        | Game theory, winning positions, binary XOR    | 2   |
| BC-07 | Home Run Race            | Ludo / pachisi (pieces go home, not "die") | Counting, probability of dice                 | 2   |
| BC-08 | Solitaire **W2**         | Klondike, FreeCell, spider                 | Sequencing, suits                             | 2   |
| BC-09 | Tile Pairs **W2**        | Mahjong solitaire                          | Chinese numerals and symbols                  | 2   |
| BC-10 | Sets and Runs            | Rummy                                      | Sets, sequences, planning                     | 2–3 |
| BC-11 | Hex Bridges              | Hex (connection game)                      | Topology: one side always connects            | 3   |
| BC-12 | Garden Plots             | Go (territory)                             | Territory, liberty, patience                  | 3–4 |
| BC-13 | Chess Friends            | Chess (captured pieces "go home")          | Planning, history of chess                    | 3–4 |
| BC-14 | Island Rescue            | Cooperative board game                     | Teamwork, risk management                     | 3   |

## Science lab (SL)

| ID    | Idea                | Proven genre (example)                    | What it teaches                                | Cx  |
| ----- | ------------------- | ----------------------------------------- | ---------------------------------------------- | --- |
| SL-01 | Light and Color     | Color mixing toy                          | Additive (light) vs subtractive (paint) mixing | 1   |
| SL-02 | Element Cards       | Collectible cards                         | The periodic table                             | 1–2 |
| SL-03 | Acorn Tower **W1**  | Stack / tower timing                      | Balance, center of mass                        | 2   |
| SL-04 | Body Explorer       | Hidden object / jigsaw                    | Anatomy, organs and what they do               | 2   |
| SL-05 | Density Tank        | Drop-and-see physics toy                  | Buoyancy, density                              | 2–3 |
| SL-06 | Magnet Maze         | Tilt maze                                 | Magnetic fields                                | 3   |
| SL-07 | Rope Friends **W2** | Rope cutting physics                      | Forces, tension, pendulums                     | 3   |
| SL-08 | Seed Sling          | Slingshot physics (launch seeds to plant) | Projectile motion, angles                      | 3   |
| SL-09 | Atom Merge **W2**   | Merge-2                                   | Atoms to molecules, chemical bonds             | 3   |
| SL-10 | Circuit Garden      | Circuit building                          | Ohm's law, logic gates                         | 3   |
| SL-11 | Optics Bench        | Laser / lens puzzle                       | Refraction, lenses, focal length               | 3   |
| SL-12 | Simple Machines     | Contraption builder (Incredible Machine)  | Levers, pulleys, gears, energy                 | 3   |
| SL-13 | Sound Waves         | Music toy with an oscilloscope            | Frequency, amplitude, resonance                | 3   |
| SL-14 | Weather Maker       | Sandbox                                   | Water cycle, clouds, pressure                  | 3–4 |
| SL-15 | Bridge Builder      | Bridge construction (Poly Bridge)         | Structural forces, tension and compression     | 4   |
| SL-16 | Sand and Water      | Falling-sand sandbox (Powder Toy)         | States of matter, reactions                    | 4   |
| SL-17 | Microscope Explorer | Exploration / collection                  | Cells, microorganisms, scale                   | 4   |

## Nature and care (NC)

| ID    | Idea              | Proven genre (example)                     | What it teaches                          | Cx  |
| ----- | ----------------- | ------------------------------------------ | ---------------------------------------- | --- |
| NC-01 | Healthy Habits    | Routine toy (brush teeth, wash hands)      | Hygiene, sleep, healthy food             | 1   |
| NC-02 | Weather Dress-Up  | Dress-up                                   | Weather, temperature, seasons            | 1   |
| NC-03 | Recycling Sorter  | Sorting                                    | Materials, recycling rules               | 1   |
| NC-04 | Bird Watch        | Photo safari (instead of hunting)          | Real species identification              | 2   |
| NC-05 | Ocean Cleanup     | Collecting arcade                          | Plastic in the ocean, marine life        | 2   |
| NC-06 | Pollinator Path   | Path drawing                               | Bees, flowers, pollination               | 2   |
| NC-07 | Animal Vet        | Care / hospital sim                        | Animal health, empathy                   | 2–3 |
| NC-08 | Linky Home **W1** | Virtual pet                                | Care routines, emotions                  | 3   |
| NC-09 | Garden Grow       | Garden sim                                 | Plant biology, light, water, soil        | 3   |
| NC-10 | Community Kitchen | Cooking (Cooking Mama, Overcooked)         | Recipes, nutrition, measuring            | 3   |
| NC-11 | Seasons Farm      | Farming sim (Harvest Moon, Stardew Valley) | Crop rotation, seasons, soil             | 4   |
| NC-12 | Migration Map     | Route strategy                             | Geography, animal migration              | 4   |
| NC-13 | Aquarium Balance  | Ecosystem sim                              | Food webs, nitrogen cycle                | 4   |
| NC-14 | Forest Keeper     | Management sim                             | Forest ecology, fire prevention, commons | 4   |

## Build and create (BD)

| ID    | Idea              | Proven genre (example)               | What it teaches                                    | Cx  |
| ----- | ----------------- | ------------------------------------ | -------------------------------------------------- | --- |
| BD-01 | Omi Colors **W1** | Coloring / color by number           | Colors, numbers, art history                       | 2   |
| BD-02 | Pixel Studio      | Pixel art editor                     | Grids, symmetry                                    | 1–2 |
| BD-03 | Costume Designer  | Dress-up / fashion                   | Color theory, patterns of world cultures           | 2   |
| BD-04 | Origami Folds     | Folding puzzle                       | Geometry of folding                                | 2–3 |
| BD-05 | Robot Programmer  | Visual coding (Lightbot, Scratch Jr) | Sequences, loops, functions                        | 2–3 |
| BD-06 | Map Maker         | Map editor                           | Cartography, scale, compass directions             | 3   |
| BD-07 | Marble Run        | Construction physics                 | Gravity, energy conservation                       | 3   |
| BD-08 | Animation Studio  | Flipbook maker                       | Frames, timing, persistence of vision              | 3   |
| BD-09 | Level Maker       | Level editor for our other games     | Design, testing, sharing                           | 3   |
| BD-10 | Tiny Architect    | Building design                      | Structures, materials, accessibility               | 4   |
| BD-11 | Block World       | Voxel sandbox (Minecraft)            | Geometry, volume, engineering, redstone-like logic | 5   |

## Music and rhythm (MR)

| ID    | Idea          | Proven genre (example)                | What it teaches                                           | Cx  |
| ----- | ------------- | ------------------------------------- | --------------------------------------------------------- | --- |
| MR-01 | Echo Links    | Simon (repeat the sequence)           | Memory, pitch                                             | 1   |
| MR-02 | Drum Circle   | Rhythm toy                            | Rhythms of world cultures                                 | 1   |
| MR-03 | Piano Steps   | Falling tiles                         | Reading notes, melody                                     | 2   |
| MR-04 | Rhythm Tap    | Rhythm game                           | Beats, note lengths as fractions                          | 2   |
| MR-05 | Ear Trainer   | Matching                              | Intervals, chords                                         | 2   |
| MR-06 | Melody Garden | Step sequencer (melodies grow plants) | Composition, scales                                       | 3   |
| MR-07 | Conductor     | Timing game                           | Tempo, orchestra instruments                              | 3   |
| MR-08 | Sing Along    | Karaoke with pitch line               | Pitch, breathing (microphone off in kids mode by default) | 3   |

## Sports and motion (SM)

| ID    | Idea             | Proven genre (example)           | What it teaches                  | Cx  |
| ----- | ---------------- | -------------------------------- | -------------------------------- | --- |
| SM-01 | Juggle           | Timing                           | Rhythm, parabolas                | 2   |
| SM-02 | Linky Run **W2** | Endless runner                   | Categories (lanes), quick recall | 2–3 |
| SM-03 | Mini Golf        | Mini golf                        | Angles, friction, energy         | 3   |
| SM-04 | Curling Friends  | Curling / bowling                | Friction, momentum               | 3   |
| SM-05 | Hoops            | Basketball shots                 | Projectile motion                | 3   |
| SM-06 | Billiard Links   | Billiards                        | Elastic collisions, momentum     | 3   |
| SM-07 | Paper Planes     | Glider                           | Lift, drag, glide ratio          | 3   |
| SM-08 | Kite Day         | Flying toy                       | Wind, lift, tension              | 3   |
| SM-09 | Ski Slalom       | Downhill                         | Slopes, gravity, friction        | 3   |
| SM-10 | Table Tennis     | Racket sports                    | Spin, the Magnus effect          | 3–4 |
| SM-11 | Kart Friends     | Kart racing (no items that hurt) | Vectors, grip, racing lines      | 4   |
| SM-12 | Sailing          | Sailing sim                      | Real sail physics, wind vectors  | 4   |
| SM-13 | Climbing         | Physics climber                  | Balance, center of mass          | 4   |
| SM-14 | Skate Park       | Trick sports                     | Rotation, angular momentum       | 4–5 |

## Space and physics (SP)

| ID    | Idea              | Proven genre (example)                       | What it teaches                                   | Cx  |
| ----- | ----------------- | -------------------------------------------- | ------------------------------------------------- | --- |
| SP-01 | Star Names        | Connect the dots                             | Constellations and real star data                 | 1   |
| SP-02 | Planet Pairs      | Memory                                       | Planets and moons                                 | 1   |
| SP-03 | Deflect!          | Physics puzzle (2D vector)                   | Impulse: a small push early beats a big push late | 3   |
| SP-04 | Lunar Lander      | Lander                                       | Thrust, gravity, fuel budget                      | 3   |
| SP-05 | Orbit Garden      | Gravity sandbox                              | Kepler's laws, orbits                             | 3–4 |
| SP-06 | Station Watch     | Monitoring / idle sim                        | Detection, light delay, prediction                | 4   |
| SP-07 | Probe Workshop    | Engineering builder                          | Mass budgets, the rocket equation, sensors        | 4   |
| SP-08 | Light-Lag Chess   | Turn-based strategy with delayed information | Light speed and information                       | 4   |
| SP-09 | Telescope Tour    | Exploration                                  | Real sky catalogs, distances, light-years         | 4   |
| SP-10 | Solar Sail        | Navigation                                   | Radiation pressure, slow but endless thrust       | 4   |
| SP-11 | Satellite Network | Network builder                              | Orbits, coverage, communication delay             | 4–5 |
| SP-12 | Rocket Builder    | Rocket sim (Kerbal Space Program)            | Staging, delta-v, orbital mechanics               | 5   |
| SP-13 | Planet Maker      | God game                                     | Habitable zones, atmospheres, climate             | 5–6 |
| SP-14 | Relativity Ride   | Flight sim near light speed                  | Time dilation, Doppler, aberration                | 6   |

## Stories and adventures (SA)

| ID    | Idea                           | Proven genre (example)              | What it teaches                            | Cx  |
| ----- | ------------------------------ | ----------------------------------- | ------------------------------------------ | --- |
| SA-01 | Choose Your Path               | Interactive picture book            | Reading, choices and consequences          | 1–2 |
| SA-02 | Kindness Quests                | Daily quests                        | Social and emotional learning              | 2   |
| SA-03 | Museum Night                   | Point and click                     | Art history                                | 3   |
| SA-04 | Little Detective               | Mystery / deduction                 | Evidence, reasoning, fair judgment         | 3   |
| SA-05 | Escape Room Together           | Cooperative escape room             | Teamwork, logic                            | 3   |
| SA-06 | Archaeology Dig                | Dig and restore                     | Stratigraphy, history                      | 3   |
| SA-07 | Language Quest                 | Adventure in a foreign language     | Immersion learning                         | 3–4 |
| SA-08 | Time Travel Diary              | Visual novel                        | History from many points of view           | 3–4 |
| SA-09 | Messages Across the Dark       | Language and code puzzle            | Building a shared language from math       | 4   |
| SA-10 | Cadets of Depth Academy **W3** | Story-led puzzle campaign           | Links theory: point → doublet → network    | 4   |
| SA-11 | Explore Omi **W3**             | 3D exploration with the anime hosts | Geography, ecology of Omi mapped to Earth  | 5   |
| SA-12 | The Escape (13+)               | Narrative adventure                 | Empathy for people inside a violent system | 5   |

## Strategy and simulation (SS)

| ID    | Idea                      | Proven genre (example)                                | What it teaches                              | Cx  |
| ----- | ------------------------- | ----------------------------------------------------- | -------------------------------------------- | --- |
| SS-01 | Idle Science **W2**       | Idle / incremental                                    | Exponents, compound growth                   | 2   |
| SS-02 | Garden Guard **W2**       | Tower defense (nets and umbrellas vs weather)         | Geometry, resource planning                  | 3   |
| SS-03 | Traffic Lights            | Traffic puzzle                                        | Flow, queues, timing                         | 3   |
| SS-04 | Energy Grid               | Balancing sim                                         | Supply and demand of power, storage          | 4   |
| SS-05 | Water Commons             | Commons management                                    | Ostrom's rules for shared resources          | 4   |
| SS-06 | Logistics Links           | Transport tycoon (needs met, not profit)              | Networks, logistics                          | 4   |
| SS-07 | Outbreak Stoppers         | Cooperative epidemic game                             | Epidemiology (SIR models), vaccines, hygiene | 4   |
| SS-08 | Food Web                  | Ecosystem sim                                         | Predator–prey cycles as population curves    | 4   |
| SS-09 | Care Hospital             | Hospital management                                   | Health systems, triage, empathy              | 4   |
| SS-10 | Town of Links             | City builder                                          | Urban planning, resource flows               | 4–5 |
| SS-11 | Climate Council           | Policy sim                                            | Climate models, trade-offs                   | 5   |
| SS-12 | Two Planets               | 4X without war (explore, expand, exchange, cooperate) | Resource-based vs scarcity economies         | 5   |
| SS-13 | Mars Habitat              | Survival / colony sim                                 | Life support: air, water, food, energy       | 5–6 |
| SS-14 | **First Contact** (final) | Realistic multi-genre simulator                       | Everything above, at real scale              | 7   |

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
