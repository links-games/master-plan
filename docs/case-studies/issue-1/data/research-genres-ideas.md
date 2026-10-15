# Research: game genres, collections, science-in-genre, non-violence, resource economy, complexity ladder, 150+ idea seeds

Issue: https://github.com/links-games/master-plan/issues/1
Compiled: 2026-10-15. Live GitHub numbers come from `gh api repos/OWNER/REPO` on the same date.

Maintainer request: collect as many game-type ideas as possible, for lots of small repositories and for collections in one app (for example "all puzzle games"). Use popular, proven genres and wrap useful scientific learning inside them. Start with the simplest games and climb to complex ones. Prefer a resource-based economy over money, and prefer non-violent games.

Conventions (same as `research-market-games.md`):
- Every number or fact has a source URL next to it.
- "unverified" marks a figure found only in secondary or low-quality sources.
- "company-reported" marks a figure that comes from the company itself and has no independent audit.
- "vendor estimate" marks a figure from an outsourcing studio's blog. Read it as a direction, not a benchmark.
- This is research, not legal advice. Legal background (ideas and rules are free, expression and trademarks are not; Tetris v. Xio; Wordle/NYT) is in `research-market-games.md` §3. It is not repeated here.
- Market totals (Newzoo, Sensor Tower, the puzzle IAP size) are in `research-market-games.md` §1. This note covers only genre-level splits.

---

## 1. Genre taxonomy

### 1.1 Reference taxonomies

| Taxonomy | Structure | Use for us | Source |
|---|---|---|---|
| Wikipedia "List of video game genres" | About 12 top groups: Action, Action-adventure, Adventure, Puzzle, RPG, Simulation, Strategy, Sports, MMO, Sandbox, "Other" and "By purpose" (educational, serious, exergame, art, casual) | Broadest checklist of sub-genres | https://en.wikipedia.org/wiki/List_of_video_game_genres |
| Google Play game categories | 17: Action, Adventure, Arcade, Board, Card, Casino, Casual, Educational, Music, Puzzle, Racing, Role Playing, Simulation, Sports, Strategy, Trivia, Word | The categories our store listings must pick from | https://trysonar.app/blog/google-play-categories |
| GameRefinery (Liftoff) | 4 categories (Casual, Midcore, Sports, Casino), 12 genres and 52 subgenres. Each game gets exactly one subgenre (for example, match-3 with an RPG meta-layer is "Puzzle RPG"). | Industry-standard market segmentation | https://docs.gamerefinery.com/en/articles/2278730-what-are-categories-genres-and-subgenres |
| GameRefinery 2021 update | Added Merge, Bubble Shooter, Tower Defense RPG, Asymmetric Survival and Casual Casino. Hypercasual is a genre of its own. | Shows that new subgenres keep appearing | https://gamerefinery.com/genre-taxonomy-update-april-2021 |
| Steam user tags | Community-applied and not a certification. "Casual" co-occurs with Indie (58%), Puzzle (26%) and Simulation (24%). "Cozy", "Wholesome" and "Relaxing" are community tags. | Discovery tags for PC releases | https://club.steam250.com/tag/597 ; https://www.itechguides.com/how-to-find-and-evaluate-cozy-games-on-steam/ (low-quality source) |
| BoardGameGeek mechanics | About 50 mechanics (worker placement, deck building, tile placement, set collection, area control, and more). The BGG page returned 403, so this comes from secondary sources. | Mechanic vocabulary for card and board seeds | https://en.wikiversity.org/wiki/Game_mechanics ; https://www.belloflostsouls.net/?p=271905 (unverified count) |

### 1.2 Genre map, sub-genres, landmarks and popularity evidence

Cx is the build complexity of the smallest credible version, from 1 (days) to 5 (years). See §6.

| Genre (Google Play) | Sub-genres | Landmark examples (all names are trademarks) | Popularity evidence | Violence by default? | Cx |
|---|---|---|---|---|---|
| Puzzle | Logic (grid), tile-matching / match-3, merge, physics, hidden object, jigsaw, sliding, nonogram, programming puzzle | Tetris, Candy Crush, 2048, Monument Valley, Cut the Rope | Puzzle had 12.70% of Google Play game downloads and 71,046 apps, the most of any category (09/2026). https://data.42matters.com/top-google-play-game-categories-by-download-trends . Puzzle IAP was $3.48B in Q2 2025 (+13%). https://wnhub.io/news/analytics/item-48527 . Puzzle had a 53% share of mobile ad revenue in Feb–Apr 2026. https://wnhub.io/news/analytics/item-51349 | No | 1–3 |
| Casual | Hyper-casual, hybrid-casual, idle, merge, dress-up, cooking/time-management | Subway Surfers, Cooking Fever | 13.84% of downloads and 59,190 apps (09/2026). https://data.42matters.com/top-google-play-game-categories-by-download-trends . Hybrid-casual IAP rose 20% YoY. https://gamedevreports.substack.com/p/sensor-tower-state-of-gaming-2026 | Mostly no | 1–2 |
| Arcade | Endless runner, breakout, snake, shmup, maze, flappy-style | Pac-Man, Breakout, Space Invaders | 8.52% of downloads and 26,905 apps. https://data.42matters.com/top-google-play-game-categories-by-download-trends | Often shooting; reframe (§4.2) | 1–2 |
| Action | Platformer, shooter, fighting, beat 'em up, stealth, battle royale | Mario, Fortnite | 13.59% of downloads. Shooters earned $1.77B and action $3.88B on Steam (2025). https://data.42matters.com/top-google-play-game-categories-by-download-trends ; https://gamedevreports.substack.com/p/sensor-tower-state-of-gaming-2026 | Yes; reframe or skip | 2–5 |
| Simulation | Construction/management, life sim, farming, vehicle, tycoon, god game | The Sims, Stardew Valley, Euro Truck Simulator 2 | 13.34% of downloads and 23,857 apps. https://data.42matters.com/top-google-play-game-categories-by-download-trends | Mostly no | 2–5 |
| Strategy | 4X, RTS, tower defense, TBS, grand strategy, auto battler, card battler, city builder | Civilization, Clash of Clans | The only mobile genre to grow revenue, downloads and time spent in 2025. https://wnhub.io/news/analytics/item-51344 . AppMagic reports strategy revenue up from $10.8B to $13.5B (+25.6%) and card battlers up 213%. https://gamedevreports.substack.com/p/appmagic-mobile-games-monetization | Mostly war; reframe | 3–5 |
| Role Playing | Action RPG, roguelike, tactical, monster-taming, MMORPG, gacha RPG | Pokémon, Shattered Pixel Dungeon | Q2 2025 IAP was $3.62B (-12%). https://wnhub.io/news/analytics/item-48527 . RPG fell 15–30% across regions; roguelike and tactical niches grew. https://gamedevreports.substack.com/p/appmagic-mobile-games-monetization | Mostly combat; reframe | 3–5 |
| Board / Card / Casino | Classic boards, solitaire, trick-taking, deckbuilder, CCG; casino (slots, poker) | Solitaire, chess, Catan, Hearthstone | Card had 1.37% of downloads and casino 0.73%. https://data.42matters.com/top-google-play-game-categories-by-download-trends . Puzzle and casino made 72% of $12B casual revenue in H1 2025. https://gamedevreports.substack.com/p/appmagic-mobile-casual-games-in-h125 | No. Casino is gambling; exclude it. | 1–3 |
| Word | Word search, crossword, anagram, daily guess, spelling | Wordle, Words With Friends | 1.34% of downloads, but +13.05% download growth 10/2025–09/2026. https://data.42matters.com/top-google-play-game-categories-by-download-trends | No | 1–2 |
| Trivia | Quiz, daily quiz, party quiz | Trivia Crack, Kahoot! | 0.71% of downloads and +10.78% growth. https://data.42matters.com/top-google-play-game-categories-by-download-trends | No | 1–2 |
| Music | Rhythm, instrument toy, composition | Guitar Hero, Beat Saber | 2.18% of downloads. https://data.42matters.com/top-google-play-game-categories-by-download-trends | Beat Saber "slashes"; reframe | 2–3 |
| Educational | Early learning, math, reading, coding, science sims | GCompris, PBS KIDS Games, Scratch | See §3 and `research-market-games.md` §1.3 | No | 1–4 |
| Adventure | Point-and-click, walking sim, visual novel, metroidvania | Monkey Island, A Short Hike | Adventure downloads grew 12.18% (10/2025–09/2026). https://data.42matters.com/top-google-play-game-categories-by-download-trends | Often no | 2–4 |
| Racing / Sports | Kart, sim racing, ball sports, golf, fitness/exergame | Mario Kart, Pokémon GO (exergame) | Sports downloads grew 13.9%, the fastest of any category. https://data.42matters.com/top-google-play-game-categories-by-download-trends | No (kart items can be "attacks"; reframe) | 2–4 |
| Sandbox / open world | Voxel building, physics sandbox, creative toy | Minecraft, Townscaper, Algodoo | Minecraft sold 350M copies (Apr 2025). https://twistedvoxel.com/minecraft-surpasses-350-million-copies-sold-worldwide/ | Survival mode has mobs; creative mode has none | 3–5 |
| Idle / incremental | Clicker, idle tycoon, prestige loops | Cookie Clicker, A Dark Room, Cell to Singularity | Cell to Singularity, an idle game about evolution, reports 20M+ downloads (company-reported). https://www.workwithindies.com/work-with/computer-lunch ; https://en.wikipedia.org/wiki/Cell_to_Singularity | No | 1–2 |
| Automation / factory | Factory builder, logistics, programming-by-placement | Factorio, Mindustry, Shapez | Factorio sold 3.5M+ by end of 2022 with a no-sale policy. https://pcgamer.com/factorio-has-sold-35-million-copies | Factorio has defense; Shapez has none | 3–4 |

Takeaways:
- By download share, the four largest Google Play categories are Puzzle, Casual, Simulation and Action. Word, Trivia, Sports and Adventure are growing fastest. By revenue, Strategy and Puzzle lead.
- Puzzle, Casual, Word, Trivia, Board/Card, Simulation, Idle and Educational are non-violent by default and low in complexity. They should be the first rungs of our ladder (§6).

## 2. Game collections in one app

### 2.1 Proven collections

| Collection | Contents and model | Scale evidence | License / openness | Source |
|---|---|---|---|---|
| Simon Tatham's Portable Puzzle Collection | About 40 small logic puzzles (count unverified) on web, Windows, Unix and many unofficial mobile ports | Widely ported. No usage figures. | MIT-style licence, © Simon Tatham 2004–2024 and contributors | https://www.chiark.greenend.org.uk/~sgtatham/puzzles/doc/licence.html |
| Microsoft Solitaire Collection | Klondike, Spider, FreeCell, TriPeaks, Pyramid. Ads, or Premium at $1.99/month or $9.99/year. | 119M unique players over 4 years (2016, company-reported) | Proprietary | https://www.microsoft.com/store/apps/9wzdncrfhwd2 ; https://apple.co/2gCnkVc ; https://www.thurrott.com/xbox/85534/microsoft-solitaire-collection-comes-android-ios |
| Clubhouse Games: 51 Worldwide Classics (Switch) | 51 traditional board and card games with a shared UI, rule tutorials and world trivia | 4M+ sold by Apr 2022. VGChartz estimates 4.64M (unverified). | Proprietary | https://en.wikipedia.org/wiki/Clubhouse_Games:_51_Worldwide_Classics ; https://www.vgchartz.com/game/226406/clubhouse-games-51-worldwide-classics/sales |
| Board Game Arena | Browser platform for licensed board-game adaptations. Free tier plus Premium. | 10M accounts (Aug 2024) and 900+ games, up from about 250 at the 2021 Asmodee acquisition. About 5M hours played per month. | Proprietary; games licensed from publishers | https://corporate.asmodee.com/news/asmodee-and-board-game-arena-celebrate-10-million-users-milestone-cementing-the-online-board-gaming-platform-as-the-industrys-1 ; https://gamesbeat.com/board-game-arena-surpasses-10m-user-account-milestone/ ; https://boardgamewire.com/?p=2839 |
| Lichess (chess and variants) | One game with many variants, puzzles, studies and a coach. 100% free, funded by donations. | 2,958,024 games in one day (20 Jul 2024). More than $80K in donations in Dec 2025, a record. Costs about $720K/year (secondary source). | Server AGPL-3.0, chessground GPL-3.0, game database CC0 | https://www.chesstech.org/de/2024/7284970-is-not-the-maximum-number/ ; https://lichess.org/@/Lichess/blog/lichess-end-of-year-update-2025/YRiNKoaQ ; https://www.opensourceforu.com/?p=92564 ; https://database.lichess.org/ |
| GCompris | 100+ educational activities for ages 2–10. Free; donations and Patreon. | No usage figure collected | GNU AGPL (per site; the GitHub mirror API shows null) | https://gcompris.net/index-en.html |
| Tux Paint | Drawing program for ages 3–12 | n/a | GPL (version unverified) | https://www.tuxpaint.org/ |
| PBS KIDS Games | 280+ free, curriculum-based games for ages 2–8 | n/a | Proprietary, free, public-media funded | https://apps.apple.com/app/id1050773989 |
| Sago Mini World | Toy-box app. Free download plus subscription; Piknik bundle about $10.99–13.99/month. Owned by Spin Master. | n/a | Proprietary | https://help.sagomini.com/article/361-what-type-of-subscription-plans-are-offered-for-sago-mini-world ; https://en.wikipedia.org/wiki/Sago_Mini |
| Apple Arcade | Subscription of 200+ games with no ads and no IAP | n/a | Proprietary | https://stevivor.com/news/apple-arcade-august-2025-additions-and-updates/ |
| Netflix Games | Bundled with a subscription. In 2026 Netflix narrowed to party, kids, story and mainstream games and closed Night School and Moonloot. Boss Fight closed in Oct 2025. | Shows that bundles get pruned | Proprietary | https://mobilegamer.biz/netflix-to-close-la-studio-night-school-helsinkis-moonloot-and-cut-internal-game-teams/ ; https://gvwire.com/2025/10/25/netflix-shuts-down-game-studio-behind-squid-game-unleashed/ |

### 2.2 Brain-training collections: the warning case

| Item | Fact | Source |
|---|---|---|
| FTC v. Lumosity (Jan 2016) | $2M redress. The FTC said Lumos Labs made unfounded claims that its games improve work and school performance and delay dementia or Alzheimer's. It also said testimonials came from prize contests without disclosure. Future claims need "competent and reliable scientific evidence". | https://ftc.gov/news-events/press-releases/2016/01/lumosity-pay-2-million-settle-ftc-deceptive-advertising-charges |
| Simons et al. 2016, "Do 'Brain-Training' Programs Work?" (Psychol. Sci. Public Interest 17(3):103–186, DOI 10.1177/1529100616661983) | Players improve on the trained tasks. There is less evidence for near transfer and little for far transfer to everyday cognition. | https://www.psychologicalscience.org/publications/brain-training.html |
| Rule for us | Market a collection as fun practice of a named skill (for example "practises times tables"). Never claim it makes you smarter or protects against disease. | derived from the two rows above |

### 2.3 What makes collections succeed (derived from §2.1; inference, not measured)

| Pattern | Evidence |
|---|---|
| One shell, many games: a shared UI, account, settings and progress | Solitaire Collection, Clubhouse Games, GCompris, Simon Tatham's collection |
| Traditional and public-domain rule sets carry the catalogue | Clubhouse 51 (4M+ sold), Solitaire Collection |
| Per-game tutorials and a daily challenge drive habit | Microsoft Solitaire Collection daily challenges; Lichess daily puzzle |
| Catalogue growth sustains the platform | Board Game Arena went from about 250 to 900+ games and from 0 to 10M accounts |
| Open code plus open data builds trust and contributors | Lichess (AGPL plus CC0 database, donation-funded) |
| Collections get pruned when engagement is thin | Netflix studio closures in 2025–2026 |

Suggested bundles for links-games: Logic Puzzles (§7.A), Match and Merge (§7.B), Physics Toys (§7.C), Word Garden (§7.D), Number Garden (§7.E), Code Lab (§7.F), Classic Tables (§7.H) and Science Lab (§7.J). Each bundle should share one shell, one save system and one character cast from the lore.

## 3. Science and education wrapped in genres

### 3.1 Citizen-science games (players produce real research)

| Game | Genre wrapper | Scientific result | Source |
|---|---|---|---|
| Foldit (UW) | 3D spatial puzzle | Players solved the structure of the Mason-Pfizer monkey virus retroviral protease in about 10 days. The puzzle was open 3 weeks and about 15 players were in the "Foldit Contenders" group. Published in Nat. Struct. Mol. Biol. 2011. | https://en.wikipedia.org/wiki/Foldit ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3211970 |
| EteRNA (CMU/Stanford) | RNA design puzzle | Lee et al., PNAS 2014, 111:2122–2127, DOI 10.1073/pnas.1313039111. About 37,000 players. Player rules were distilled into the "EteRNABot" algorithm. | https://en.wikipedia.org/wiki/EteRNA |
| EyeWire (MIT/Princeton) | Coloring / tracing puzzle | Kim et al., Nature 509:331–336 (2014), on retinal direction selectivity. "The EyeWirers" are credited as a group author. | https://pmc.ncbi.nlm.nih.gov/articles/PMC4074887 |
| Phylo (McGill) | Tile-matching | Multiple sequence alignment of DNA | https://discovermagazine.com/the-sciences/5-ways-human-volunteers-are-helping-machines-make-new-discoveries |
| Stall Catchers (Human Computation Institute) | Spot-the-difference video | Labels blood-flow stalls in mouse brain vessels for Alzheimer's research with a Cornell lab | https://pages.scistarter.org/?p=13144 |
| Sea Hero Quest | Boat navigation | 4.3M players provided spatial-navigation data. Now a research edition. | https://www.dementiaresearcher.nihr.ac.uk/worlds-largest-study-of-spatial-navigation-offers-free-study-platform-to-researchers |
| Borderlands Science | Tile-sliding minigame inside a shooter | Sarrazin-Gendron et al., Nature Biotechnology 2024. 4M+ players and 135M+ puzzles since Apr 2020, aligning about 1M 16S rRNA sequences. | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11738981/ |

Lesson: a simple puzzle (tile-matching, tracing, sliding) can carry real science if a research partner supplies the data and validates the results. Borderlands Science shows that the minigame can sit inside an unrelated game. For us, the host would be non-violent.

### 3.2 Physics and space

| Item | Fact | Source |
|---|---|---|
| Kerbal Space Program | Nearly 4M units sold by FY2020. Take-Two acquired it on 2017-05-31. | https://www.vgchartz.com/article/442363/kerbal-space-program-shipped-nearly-4-million-units-worldwide/ ; https://www.gameinformer.com/b/news/archive/2017/05/31/take-two-acquires-kerbal-space-program.aspx |
| KerbalEdu / KSP EDU | Classroom edition with TeacherGaming at about $17 per licence | https://wiki.kerbalspaceprogram.com/wiki/KerbalEdu ; https://www.mcvuk.com/kerbal-space-program-lifts-off-in-classrooms/ |
| KSP and NASA | 2014 Asteroid Redirect Mission update made in collaboration with NASA | https://www.engadget.com/2014-03-06-nasa-taps-kerbal-space-program-to-replicate-real-space-mission.html |
| Universe Sandbox | Gravity and astronomy sandbox, reviewed for classroom use | https://www.commonsense.org/education/game/universe-sandbox |
| Algodoo (Algoryx) | Free 2D physics sandbox for grades 4–12. Descends from "Phun". | https://www.commonsense.org/education/reviews/algodoo |
| PhET (University of Colorado) | Sims released before 2026-03-29 are CC BY 4.0. "PhET" and its logo are trademarks of the Regents of the University of Colorado. | https://phet.colorado.edu/en/licensing/html |
| PhET licence change | A 2026-03-30 social post says new sims move from CC BY to CC BY-NC (not fully verified). NC content cannot go into a commercial build. | https://bsky.app/profile/did:plc:3s2musp7e36erkkvw5aufqmk/rss |
| PhET code | Live data: phetsims/scenery and phetsims/joist are MIT. A mirror says sim-specific code is GPL-3.0 (unverified). | `gh api repos/phetsims/scenery` ; https://clixplatform.tiss.ac.in/phet/en/licensing.html |

### 3.3 Programming games

| Item | Fact | Source |
|---|---|---|
| Human Resource Machine (Tomorrow Corp, 2015) | Assembly-like office puzzle. IEEE Spectrum calls it a good introduction to how processors work. | https://spectrum.ieee.org/three-computer-games-that-make-assembly-language-fun |
| Zachtronics (SpaceChem, TIS-100 2015, Shenzhen I/O 2016, Opus Magnum) | Reused one formula: open-ended programming puzzles with histograms that compare your solution to others. Closed in 2022 after Last Call BBS by choice, not for financial reasons. | https://www.gamepressure.com/companies/zachtronics-industries/z11000 |
| Scratch (MIT) | 100M+ community members and 130M+ shared projects (2023). scratch-gui is AGPL-3.0 with 4,808 stars (live). | https://www.media.mit.edu/projects/scratch-online-community/overview/ ; `gh api repos/scratchfoundation/scratch-gui` |
| CodeCombat | Learn-to-code RPG. MIT, 8,572 stars (live). | `gh api repos/codecombat/codecombat` |
| GDQuest Learn GDScript | Interactive Godot scripting course. 2,803 stars; license NOASSERTION. | `gh api repos/gdquest/learn-gdscript` |

### 3.4 Chemistry, biology, math, language, economy and ecology

| Item | Fact | Source |
|---|---|---|
| Spore (2008), a negative example | Bohannon in Science gave it failing grades on mutation and natural selection: it "gets most of biology badly ... wrong". Lesson: fake science in a science wrapper is criticised. | https://www.nationalgeographic.com/science/article/bad-grades-for-spore ; https://carlzimmer.com/bad-grades-for-spore/ |
| Cell to Singularity | Idle game about evolution and cosmology using the currency "entropy". Reports 20M+ downloads (company-reported). Third-party reviews criticise late-game pacing walls (unverified). | https://en.wikipedia.org/wiki/Cell_to_Singularity ; https://www.workwithindies.com/work-with/computer-lunch |
| DragonBox (algebra; now part of the Kahoot! family) | Norway Algebra Challenge 2014: 35,000 students solved 7M+ equations (UW figure; another source says 5M+). A Nordic study covered about 1,500 children (company-reported). | https://news.cs.washington.edu/?p=11744 ; https://kahoot.com/kahoot-news/research-in-norway-shows-dragonbox-delivered-greater-learning-benefits-and-motivation/ |
| Prodigy Math, a negative example | On 2021-02-19 a 22-group coalition led by CCFC/Fairplay filed an FTC complaint. It said children saw up to 4x more ads and upsells than math problems. Premium cost $59.88/year. | https://fairplayforkids.org/feb-19-2021-advocates-to-ftc-prodigy-math-game-preys-on-kids-and-families/ ; https://www.edweek.org/technology/popular-interactive-math-game-prodigy-is-target-of-complaint-to-federal-trade-commission/2021/02 |
| Eco (Strange Loop Games) | Ecology survival game: shared world, pollution, laws and elections. Funded by an IES SBIR Phase II grant ($899,871, 2015–2017) for middle-school ecology and a $202,760 Kickstarter. | https://ies.ed.gov/funding/grantsearch/details.asp?ID=1600 ; https://ies.ed.gov/about/organization/strange-loop-games ; https://store.steampowered.com/app/382310/Eco/ |
| Language and spaced repetition | Already covered (Duolingo streaks, spacing effect) | `research-market-games.md` §4.1 |
| Typing | Tux Typing is GPL-2.0 (74 stars, live). TuxMath license is NOASSERTION (53 stars). | `gh api repos/tux4kids/tuxtype` ; `gh api repos/tux4kids/tuxmath` |

### 3.5 Transfer of learning: what the evidence supports

| Study | Finding | Source |
|---|---|---|
| Clark, Tanner-Smith & Killingsworth 2016, Rev. Educ. Res. 86(1):79–122 | Digital games vs non-game instruction: g = 0.33 [0.19, 0.48], k = 57. Augmented game designs vs standard versions: g = 0.34, k = 20. | https://doi.org/10.3102/0034654315582065 |
| Wouters et al. 2013, J. Educ. Psychol. 105(2):249–265 | Serious games vs conventional instruction: learning d = 0.29, retention d = 0.36. Motivation d = 0.26 was not significant. Effects were larger when games were combined with other instruction, played over several sessions, or played in groups. | https://research-portal.uu.nl/en/publications/a-meta-analysis-of-the-cognitive-and-motivational-effects-of-seri/ |
| Simons et al. 2016 | Near transfer happens; far transfer is weak (see §2.2) | https://www.psychologicalscience.org/publications/brain-training.html |

Design rules derived from these studies (inference):
1. Make the mechanic *be* the concept: you balance the equation to open the door, and you obey orbital mechanics to dock. A quiz bolted onto a game is not enough.
2. Expect gains mostly on skills close to what the game practises, and claim only those.
3. Design for several short sessions plus a "teacher/parent mode" or a printable worksheet. Both match the moderators found by Wouters.
4. Get a domain expert to review the content, so the Spore failure does not repeat.

## 4. Non-violent games

### 4.1 Commercial evidence that non-violent games sell

| Game | Core verb | Result | Source |
|---|---|---|---|
| Minecraft | Build / mine | 350M copies (Apr 2025). A 425M figure is unverified. | https://twistedvoxel.com/minecraft-surpasses-350-million-copies-sold-worldwide/ ; https://www.vgchartz.com/article/469182/minecraft-sales-top-425-million-units/ |
| Animal Crossing: New Horizons | Decorate, collect, socialise | 50.29M units (2026-06-30, Nintendo) | https://www.shacknews.com/article/150276/animal-crossing-new-horizons-50-million-units-sold |
| Stardew Valley | Farm, befriend (it has optional mine combat) | 41M+. A 50M+ figure from Feb 2026 is unverified. | https://www.pocketgamer.biz/stardew-valley-sells-over-41-million-copies ; https://opencritic.com/news/34419/stardew-valley-creator-almost-canceled-the-game |
| The Sims 4 | Life simulation | 85M cumulative players (2024). Base game free since Oct 2022. | https://www.gamestar.de/artikel/sims-4-85-millionen-spieler,3422034.html |
| Monument Valley 1 + 2 | Impossible-geometry puzzle | 160M+ downloads (Apr 2024, company-reported) | https://www.gamedeveloper.com/press-release/ustwo-games-marks-10-years-of-monument-valley-with-year-long-celebration |
| Euro Truck Simulator 2 | Drive and deliver | 13M+ copies and 80M DLC at 10 years. 15M on Steam (Aug 2025). | https://wnhub.io/news/marketing/item-406 ; https://mezha.ua/en/blogs/euro-truck-simulator-2-nordic-horizons-record-306692/ |
| Factorio | Automate (has optional defense against "biters") | 3.5M+ by end of 2022. Space Age sold 400K+ at launch and hit a 118,674 concurrent peak. | https://pcgamer.com/factorio-has-sold-35-million-copies ; https://gamingonlinux.com/2024/10/factorio-space-age-sold-over-400000-copies-and-sets-a-new-player-count-record |
| Unpacking | Unpack boxes (environmental storytelling) | 1M+ in its first year | https://Techraptor.net/gaming/news/unpacking-sales-move-across-million-mark |
| Townscaper | Town-building toy with no goals and no resources | 500K+ on PC and Switch; 380K on Steam | https://gamespress.com/Townscaper-Coming-to-Android-and-iOS-October-20 ; https://mcvuk.com/business-news/when-we-made-townscaper |
| Terra Nil (2023) | Reverse city builder: restore the ecosystem, then recycle your own buildings | 300K players in about a week, including Netflix mobile. Part of Steam profits go to the Endangered Wildlife Trust. | https://wnhub.io/news/other/item-39922 ; https://gematsu.com/2021/06/ecosystem-reconstruction-reverse-city-builder-terra-nil-announced-for-pc |

### 4.2 Combat-replacement patterns (genre convention → non-violent verb)

| Violent convention | Non-violent replacement verb | Precedent (if any) |
|---|---|---|
| Shoot enemies (shmup, FPS) | Photograph, scan, water, pollinate, paint, catch | Photo-safari games; Splatoon paints turf (still "splats" players) |
| Defeat a boss | Calm, befriend, solve its puzzle, help it home | Undertale's "spare" option (it still has fights) |
| Tower defense "kill waves" | Guide, sort or feed the waves: route water, deliver mail, herd sheep | Flood and traffic sims (inference) |
| Artillery (Worms-like) | Launch seeds to plant trees, throw a ball into a hoop | Basketball and golf trajectory games |
| Beat 'em up | Clean up: sweep litter, wash graffiti, repair | Cleaning sims, PowerWash Simulator |
| Survival horror | Survive weather: shelter, warmth, food stores | Frostpunk (but it has moral-cruelty themes) |
| Monster capture and battle | Field-guide documentation; befriend and release | Citizen-science ID apps (iNaturalist style) |
| RTS war | Ecosystem restoration, ant foraging, firefighting | Terra Nil |
| 4X "exterminate" | 4E: explore, expand, exploit, *exchange*; cultural and scientific victory | Civilization's culture and science victories exist alongside war |
| Fighting game | Dance-off, rhythm duel, debate (rhetoric) | Rhythm games |
| Battle royale elimination | Hide-and-seek or tag, where the tagged player joins the seekers | Playground games |
| Social deduction "kill" | "Who took the cookies" or "secret gift-giver" | Werewolf/Mafia structure with harmless roles |
| Stealth assassination | Surprise-party sneak; nature photography of shy animals | Untitled Goose Game (pranks, not violence) |

Rule: keep the *tension* (time pressure, threat, scarcity) and replace the *harm*. Weather, entropy, puzzles and time are antagonists that need no victims.

### 4.3 The Wholesome Games movement

| Fact | Source |
|---|---|
| Wholesome Games "promotes video games that inspire hope, joy, and introspection" | https://wholesomegames.com/ |
| Co-founded by Matthew Taylor and James Tillman (claims of other co-founders unverified) | https://wholesomegames.com/ |
| Wholesome Direct showcase: about 25K viewers in 2020, 5M+ views in 2025, 6M+ in 2026, with an average of +20K wishlists per featured game (company-reported) | https://wholesomegames.com/ |
| The 2026 show (June 6) featured 50+ games | https://engadget.com/2164200/wholesome-direct-returns-june-6-with-a-slew-of-joyful-games |
| "Cozy" and "Wholesome" are Steam community tags, not certifications | https://www.itechguides.com/how-to-find-and-evaluate-cozy-games-on-steam/ (low-quality source) |

For us: submitting to Wholesome Direct (Steam/PC) is a realistic marketing channel for the larger rungs of the ladder.

## 5. Resource-based economy (RBE) and moneyless game economies

### 5.1 Definition, neutrally stated

| Item | Fact | Source |
|---|---|---|
| Resource-based economy (Jacque Fresco / The Venus Project) | Goods and services are available without money, credit, barter or debt. Technology and automation remove scarcity, and Earth's resources are a shared heritage. Fresco died in 2017. | https://wiki.p2pfoundation.net/Venus_Project |
| Zeitgeist Movement | Promoted RBE, then split from the Venus Project in 2011 | https://wiki.p2pfoundation.net/Venus_Project |
| Criticism: economic calculation | Austrian-school critics invoke Mises: without prices there is no way to compare the cost of alternative uses of resources | https://mises.org/library/venus-needs-some-austrians |
| Criticism: feasibility | Motherboard: "no one knows if a city like this will work". We found no peer-reviewed evaluation of RBE. | https://motherboard.vice.com/read/eliminating-money-taxes-and-ownership-will-bring-forth-technoutopia |
| Ostrom's commons design principles (Governing the Commons, 1990) | 1. Clear boundaries. 2. Rules fit local conditions. 3. Collective-choice arrangements. 4. Monitoring. 5. Graduated sanctions. 6. Conflict-resolution mechanisms. 7. Minimal recognition of the right to organise. 8. Nested enterprises. Cox et al. 2010 reviewed 91 studies and found broad empirical support. | https://blog.p2pfoundation.net/eight-design-principles-for-successful-commons/ ; https://wikis.mit.edu/confluence/download/attachments/142935647/ES-2010-3704%20%281%29.pdf?api=v2 |

Positioning (inference): games are a safe sandbox for testing RBE and commons ideas. Our games can show both the strengths of these ideas and the calculation and coordination problems that critics raise, which keeps them educational rather than propaganda.

### 5.2 Moneyless or resource-first economies in existing games

| Game | How its economy works | Source |
|---|---|---|
| Factorio | No money. Flows of raw resources are turned into products and research. | https://en.wikipedia.org/wiki/Factorio |
| Banished | No money. A trading post barters goods by their resource value. | https://banished.fandom.com/wiki/Trading_post |
| Dwarf Fortress | The coin-based dwarven economy has been disabled since about v0.31, so coins have little use | https://dwarffortresswiki.org/index.php/v0.31:Coin |
| Oxygen Not Included | Survival colony balancing oxygen, heat, food and power. No currency (general description). | https://en.wikipedia.org/wiki/Oxygen_Not_Included |
| Catan (board game) | Pure resource trading between players. No money. Trading is a trademarked design, but the mechanic is free. | https://en.wikipedia.org/wiki/Catan |
| Terra Nil | Spend "leaves" earned from restoring the ecosystem, then recycle your buildings to leave no trace | https://gematsu.com/2021/06/ecosystem-reconstruction-reverse-city-builder-terra-nil-announced-for-pc |
| Mindustry (open source, GPL-3.0, 29,362 stars live) | Resource conveyor economy. It has tower-defense combat, so it is a reference for the economy only. | `gh api repos/Anuken/Mindustry` |
| Eco | NOT moneyless. Players mint fiat or resource-backed currencies, write laws through templates the game enforces once ratified, and hold elections. Barter is also possible. A good reference for governance. | https://wiki.play.eco/en/Economy ; https://store.steampowered.com/app/382310/Eco/ |

### 5.3 Moneyless mechanics menu (for our designs)

| Mechanic | What it teaches | Example seed (§7) |
|---|---|---|
| Energy budget: every action costs joules or calories, and the sun or food replenishes it | Thermodynamics, efficiency | K3, J14 |
| Material flows: inputs turn into outputs, which can be recycled | Conservation of mass, circular economy | K5, K8 |
| Barter with a double coincidence of wants | Why trade needs matching; exchange ratios | K1 |
| Commons pool with a regeneration rate | Tragedy of the commons and Ostrom's principles | K2, K4 |
| Time as the currency (for example "hours of care") | Opportunity cost | K10 |
| Reputation and gratitude tokens that cannot be transferred | Trust and reciprocity | K11 |
| Library of things: shared tools with queues | Sharing economy and utilization | K9 |
| Abundance unlocks: automation lowers the cost to zero over time (an RBE-style end state) | Productivity and automation | L2, K12 |

### 5.4 Interaction with free-to-play monetization (inference plus sibling-note policy)

| Rule | Why |
|---|---|
| No premium currency (gems or coins bought with money) | Money-like currencies hide real prices from children. This is a dark pattern (`research-market-games.md` §4.4), and it contradicts the request to focus on resource-based economies rather than money. |
| In-game resources can never be bought, only earned by play | Keeps the moneyless model honest |
| Real money buys only whole things at clear prices: supporter edition, cosmetics bundle, donation or merch | Transparent. Matches the Lichess and GCompris donation models (§2.1). |
| No loot boxes and no gacha | Gambling-like. Casino is excluded as a genre too (§1.2). |
| Energy timers only as a diegetic resource (the sun sets, plants grow), never sold to skip | Avoids pay-to-skip |

## 6. Complexity ladder and progressive strategy

### 6.1 Rung definitions (team and time; vendor estimates and case data)

| Cx | Rung | Typical scope | Team / time evidence | Source |
|---|---|---|---|---|
| 1 | Toy / micro | One screen, one mechanic, no levels or procedural content | Game-jam scale: 48–96 h. GMTK Jam 2025 had 9,576 entries and 37K participants, itch.io's biggest jam. The 2026 jam had about 10,500 entries. | https://itch.io/jam/gmtk-2025/screenshots ; https://gamemakerstoolkit.com/jam |
| 2 | Hyper-casual / small puzzle | One core mechanic, 20–100 levels or a generator, menus and saves | 1–10 weeks (vendor estimate). Or 2–3 months with 1–2 devs. Teams grew from 1–2 people (2019) to 3–4 (2022). | https://www.yudiz.com/insights/hyper-casual-vs-mid-core-game-development-cost/ ; https://oceanviewgames.co.uk/resources/game-development-timeline ; https://azurgames.com/blog/hyper-casual-game-development-then-and-now-did-three-years-make-a-difference |
| 3 | Hybrid-casual / casual with meta | Core loop plus a meta layer (a garden or town to build), several systems, a content pipeline | Mid-range indie: 6–18 months (vendor estimate) | https://oceanviewgames.co.uk/resources/game-development-timeline |
| 4 | Mid-core sim / strategy / multiplayer | Many interacting systems, AI, networking, balancing | Mid-core: 6–12+ months (vendor estimate). Open-source references: Unciv (MPL-2.0, 11,438 stars), OpenTTD (GPL-2.0, 8,371), OpenRCT2 (GPL-3.0, 16,433). | https://www.yudiz.com/insights/hyper-casual-vs-mid-core-game-development-cost/ ; live `gh api` |
| 5 | Large sim / open world / MMO | Persistent world, voxel engine, economy, server | AAA budgets: $80–300M (modelled) with about 220–300 staff. Spider-Man 2 cost about $300M (leak). Open-source references: Luanti (formerly Minetest; 13,726 stars), Veloren (GPL-3.0, 7,623), 0 A.D. (moved to Gitea 2024-08-20). | https://ziva.sh/blogs/game-development-cost-trend ; https://aftermath.site/big-budget-game-development-is-not-sustainable/ ; live `gh api` |

### 6.2 Progressive strategies of studios that shipped many small games

| Studio | Strategy | Evidence | Lesson for us | Source |
|---|---|---|---|---|
| Ketchapp | High volume of tiny games, up to one per week. Its breakout was a port of open-source 2048 (MIT). | 700M+ downloads. Acquired by Ubisoft 2016-09-27. | Volume plus reuse of open-source mechanics works. Ketchapp's ad-heavy model does not match our values. | https://en.wikipedia.org/wiki/Ketchapp ; https://www.pocketgamer.biz/why-did-ubisoft-buy-ketchapp/ ; `gh api repos/gabrielecirulli/2048` (MIT, 13,437 stars) |
| Voodoo | Test a fake ad's CTR before building. Then gate prototypes on CPI and D1 retention (2021 contest: CPI $0.20 and D1 30% on Android, $0.30 and 30% on iOS). Later moved to hybrid-casual. | Company-reported | Use cheap kill gates, but our gates must be organic: playtest retention, jam ratings and teacher feedback, not paid ads aimed at children | https://newsletter.failory.com/p/addriven-validation ; https://gameworldobserver.com/2021/06/02/voodoo-announces-summer-game-competition-for-hyper-casual-devs-with-prizes-of-up-to-1-million ; https://www.gameanalytics.com/blog/how-voodoo-diversified-and-lowered-game-product-kpis |
| Supercell | Small autonomous "cells". Kills most projects and "celebrates the learnings" with champagne. | 30+ games killed (Feb 2023); 9 cancelled during Clash Royale development; 5 live games | Killing a game is fine if what was learned is captured. With open-source repos, archived games stay available to learn from. | https://gameworldobserver.com/2024/03/14/all-games-killed-by-supercell-everdale-hay-day-pop-clash-mini ; https://www.pocketgamer.biz/5-lessons-from-ilkka-paananens-bafta-games-lecture |
| Zachtronics | Repeated one formula (programming puzzles with solution histograms) across many games, each with a new theme | SpaceChem → TIS-100 → Shenzhen I/O → Opus Magnum | Build a shared engine or kit once, then reskin it per science topic (§7.F, §7.J) | https://www.gamepressure.com/companies/zachtronics-industries/z11000 |

### 6.3 Suggested ladder for links-games (inference)

1. **Cx 1 kit** (weeks 1–8): one shared shell (menu, save, settings, accessibility, lore cast) plus 10–20 micro toys and puzzles from §7.A, §7.D and §7.E. This is a game jam per seed, collected in one app.
2. **Cx 2** (months 2–6): puzzle generators, daily challenges and level packs. Reuse the grid engine across §7.A, §7.B and §7.E.
3. **Cx 3** (months 6–12): add a meta layer (a garden or town fed by the puzzles), a physics engine (§7.C and §7.J) and programming puzzles (§7.F).
4. **Cx 4** (year 2): resource-economy sims and automation (§7.K and §7.I) and async multiplayer for board games (§7.H).
5. **Cx 5** (year 3+): a shared persistent world where all games' resources flow, built on the lore universe. Benchmark it against Luanti, Unciv and OpenTTD before building.

## 7. Idea seeds (219 seeds)

Columns:
- **Cx** is the complexity rung from §6.1.
- **Framing** says how a normally violent convention is made non-violent ("-" means none was needed).
- **Avoid** lists protected names or trade dress to stay away from. Brand ownership is common knowledge and was not checked in a trademark registry (unverified). Mechanics and rules are free (`research-market-games.md` §3.1).

Working names are placeholders.

### 7.A Logic and grid puzzles

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| A1 | Number Place | 4x4 → 9x9 Latin-square grid | Deduction, constraint propagation | 1 | - | Nikoli puzzle databases; generate our own |
| A2 | Picture Logic | Nonogram (row/column run hints) | Combinatorics, pixel art | 2 | - | "Picross" (Nintendo) |
| A3 | Treasure Finder | Adjacency-number grid | Deduction, probability | 2 | Find buried seeds, not mines | Windows Minesweeper art |
| A4 | Lamp Switch | Toggle a cell and its neighbours | Linear algebra mod 2 | 1 | - | "Lights Out" (Tiger, unverified) |
| A5 | Island Bridges | Connect islands with 1–2 bridges | Graph degree constraints | 2 | - | - |
| A6 | Loop Line | Draw one closed loop around number clues | Topology, parity | 2 | - | Nikoli "Slitherlink" naming (unverified) |
| A7 | Box Pusher | Push crates to targets | Planning, irreversibility | 2 | A robot tidies the warehouse | "Sokoban" (TM) |
| A8 | Sliding Tiles | 15-puzzle | Permutation parity | 1 | - | - |
| A9 | Traffic Out | Slide cars to free the exit | Search, planning | 2 | - | "Rush Hour" (ThinkFun) |
| A10 | Shape Pieces | Seven-piece tangram silhouettes | Geometry, area conservation | 1 | - | - |
| A11 | Tower Moves | Tower of Hanoi | Recursion, powers of 2 | 1 | - | - |
| A12 | Peg Jump | Peg solitaire | Invariants | 1 | - | - |
| A13 | Cage Sums | Arithmetic cages in a Latin square | Arithmetic, factoring | 2 | - | "KenKen" (TM) |
| A14 | Cross Sums | Kakuro-style sums | Addition partitions | 2 | - | - |
| A15 | Colour Flood | Flood fill from a corner in N moves | Greedy vs optimal search | 1 | Watering a garden | - |
| A16 | Pipe Connect | Rotate tiles to connect water pipes | Graph connectivity | 1 | - | - |
| A17 | Star Battle-lite | Place stars, one per row, column and region | Constraint satisfaction | 2 | "Plant one tree per plot" | - |
| A18 | Mirror Laser | Place mirrors to route a light beam | Reflection angles | 2 | - | - |
| A19 | Knot Untangle | Move nodes until no edges cross | Planar graphs | 1 | - | "Untangle"/"Planarity" are generic (unverified) |
| A20 | Link Weaver | Build the target structure from (source, target) pair links | Associative data, graphs (ties to the links lore) | 2 | - | - |

### 7.B Tile-matching, merge and stacking

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| B1 | Element Merge | 2048-style merge of H → He → C → O ... | Nucleosynthesis chain | 1 | - | Use own art; 2048 code is MIT |
| B2 | Swap-3 Garden | Swap gems to match three | Pattern recognition | 2 | - | "Candy Crush", "Saga", "Bejeweled" |
| B3 | Tile Pairs | Mahjong-solitaire pair removal | Visual search | 2 | - | "Shanghai" (TM) |
| B4 | Memory Pairs | Flip cards to find pairs | Working memory; vocabulary pairs | 1 | - | "Memory" (Ravensburger; unverified) |
| B5 | Bubble Pop | Aim bubbles to match colours | Angles, bank shots | 2 | Bubbles free trapped critters | "Puzzle Bobble"/"Bust-a-Move" |
| B6 | Block Fit | Place polyomino pieces on a 9x9 grid to clear lines | Spatial reasoning | 1 | - | Tetris look: 10x20 well, falling tetrominoes, its colours |
| B7 | Falling Garden | Falling pairs of seeds; group 4 to bloom | Chain reactions | 2 | - | "Puyo Puyo" look |
| B8 | Evolution Merge | Merge organisms up the tree of life | Phylogeny | 2 | - | "Cell to Singularity" |
| B9 | Sort Water | Pour coloured liquids into tubes | Stack and queue reasoning | 1 | - | - |
| B10 | Stack Tower | Time drops to stack blocks | Centre of mass | 1 | - | "Stack" (Ketchapp) trade dress |
| B11 | Domino Chain | Match domino ends | Counting, graph paths | 1 | - | - |
| B12 | Recycle Sort | Swipe items into the correct bins | Waste sorting, materials | 1 | - | - |

### 7.C Physics puzzles and toys

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| C1 | Bridge Builder | Build a truss and test it with a vehicle | Tension, compression, triangles | 3 | - | "Poly Bridge", "Bridge Constructor" |
| C2 | Seed Launcher | Slingshot trajectory to plant trees | Projectile motion | 2 | Launch seeds, not birds | "Angry Birds" trade dress |
| C3 | Rope Snip | Cut ropes to swing a candy to a pet | Pendulums | 2 | - | "Cut the Rope", Om Nom |
| C4 | Chain Machine | Rube Goldberg contraption | Energy transfer | 3 | - | "The Incredible Machine" |
| C5 | Marble Run | Place tracks so the marble reaches the goal | Gravity, friction | 2 | - | - |
| C6 | Balance Scale | Place weights to balance | Torque, ratios | 1 | - | - |
| C7 | Float or Sink | Load a boat without sinking it | Buoyancy, density | 2 | - | - |
| C8 | Wind Glider | Shape a wing and glide | Lift, drag | 3 | - | - |
| C9 | Draw-a-Path | Draw lines that become physical objects | Rigid bodies | 2 | - | "Brain It On" look |
| C10 | Magnet Maze | Toggle magnets to steer a ball | Magnetic force | 2 | - | - |
| C11 | Sand and Water | Falling-sand cellular automaton | Phases, flow | 2 | - | - |
| C12 | Gear Train | Connect gears to drive an output | Gear ratios | 2 | - | - |

### 7.D Word and language

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| D1 | Daily Word | Guess a 5-letter word with feedback | Spelling, deduction | 1 | - | "Wordle", its grid, colours and share format |
| D2 | Word Ladder | Change one letter per step | Vocabulary | 1 | - | - |
| D3 | Anagram Wheel | Make words from letters on a wheel | Morphology | 1 | - | "Wordscapes" trade dress |
| D4 | Word Search | Find words in a grid | Spelling, scanning | 1 | - | - |
| D5 | Letter Tiles | Crossword placement with letter values | Vocabulary, scoring | 3 | - | "Scrabble", "Words With Friends" |
| D6 | Mini Crossword | 5x5 themed crossword | Vocabulary, general knowledge | 2 | - | NYT Mini look |
| D7 | Honeycomb Words | Make words that use the centre letter | Morphology | 1 | - | NYT "Spelling Bee" |
| D8 | Typing Garden | Type words to make flowers grow | Touch typing | 1 | Typing grows plants, it does not shoot zombies | "Typing of the Dead" |
| D9 | Phonics Blend | Drag sounds together to build a word | Early reading | 1 | - | - |
| D10 | Sentence Train | Order the word-wagons into a grammatical sentence | Syntax | 1 | - | - |
| D11 | Word Pet | Feed a pet spaced-repetition vocab cards | Second-language vocabulary | 2 | - | "Duolingo" owl; "Tamagotchi" |
| D12 | Roots Tree | Grow a tree from Latin and Greek roots | Etymology | 2 | - | - |

### 7.E Math and numbers

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| E1 | Number Hop | A frog hops along a number line | Addition, negatives | 1 | - | - |
| E2 | Fraction Kitchen | Cut and share pies fairly | Fractions | 1 | - | - |
| E3 | Times Garden | Plant arrays of rows × columns | Multiplication | 1 | - | - |
| E4 | Prime Sieve | Tap multiples to sieve primes | Primes, divisibility | 1 | - | - |
| E5 | Balance Algebra | Keep the scale balanced to isolate x | Equations | 2 | - | "DragonBox" |
| E6 | Compass Craft | Ruler-and-compass constructions | Euclidean geometry | 2 | - | "Euclidea" |
| E7 | Map Colours | Colour a map so neighbours differ | Graph colouring | 1 | - | - |
| E8 | Mirror Paint | Paint with mirror and rotational symmetry | Symmetry groups | 1 | - | - |
| E9 | Estimation Jar | Guess counts and areas | Estimation | 1 | - | - |
| E10 | Coordinate Treasure | Dig at (x, y) | Cartesian coordinates | 1 | - | - |
| E11 | Binary Lamps | Toggle lamps to make a number | Binary, place value | 1 | - | - |
| E12 | Clock Arithmetic | Wrap around a clock face | Modular arithmetic | 1 | - | - |
| E13 | Tessellate | Tile the plane with shapes | Angles, tilings | 2 | - | - |
| E14 | Graph Matcher | Bend a function to hit the targets | Functions, slopes | 2 | - | - |
| E15 | Dice Lab | Predict dice and bag outcomes | Probability | 1 | No gambling or wagering | Casino look |

### 7.F Programming and computer science

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| F1 | Robot Steps | Queue commands to guide a robot | Sequencing, loops | 1 | - | "Lightbot" |
| F2 | Mailroom CPU | Tiny assembly language moving parcels | Registers, jumps | 3 | - | "Human Resource Machine" office look |
| F3 | Logic Gates | Wire AND/OR/NOT to light a lamp | Boolean logic | 2 | - | - |
| F4 | Sort Race | Pick swaps to sort items and compare algorithms | Sorting complexity | 2 | - | - |
| F5 | Path Finder | Place waypoints and watch BFS or A* run | Graph search | 2 | - | - |
| F6 | Fractal Tree | Set recursive rules to grow a tree | Recursion, L-systems | 2 | - | - |
| F7 | Traffic Lights | Build a state machine for an intersection | Finite automata | 2 | - | - |
| F8 | Cipher Club | Break Caesar and Vigenère ciphers | Cryptography basics | 2 | - | - |
| F9 | Packet Post | Route packets through a network | Routing, latency | 3 | - | - |
| F10 | Pack the Truck | Huffman-like compression packing | Information theory | 2 | - | - |
| F11 | Signal Chip | Parallel nodes passing values | Concurrency | 4 | - | "TIS-100", "Shenzhen I/O" |
| F12 | Regex Garden | Write patterns to harvest matching flowers | Regular expressions | 2 | - | - |
| F13 | Version Garden | Branch and merge timelines of a garden | Version control | 3 | - | - |
| F14 | Block Coder | Drag-and-drop code to animate characters | Programming fundamentals | 3 | - | "Scratch" (a TM; AGPL code) |

### 7.G Arcade and action, reframed

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| G1 | Pollen Flight | Vertical scroller; collect pollen, dodge the wind | Pollination | 1 | Replaces a shmup | "Space Invaders", "Galaga" |
| G2 | Debris Sweeper | Thrust ship collects space junk | Inertia (Newton's 1st law) | 2 | Replaces Asteroids shooting | "Asteroids" |
| G3 | Ice Breaker | Paddle and ball melt ice to free animals | Reflection angles | 1 | - | "Arkanoid" look |
| G4 | Rain Catcher | Move umbrellas to catch hail for water tanks | Water cycle | 1 | Replaces Missile Command | "Missile Command" |
| G5 | Caterpillar | Grow a snake by eating leaves | Planning, growth | 1 | - | Nokia "Snake" look |
| G6 | Duckling Crossing | Cross roads and rivers safely | Road safety, wildlife corridors | 1 | - | "Frogger" |
| G7 | Maze Picnic | Collect dots in a maze; ants follow scent trails | Pheromones, AI | 2 | No ghosts eating you | "Pac-Man" |
| G8 | Flap Glide | One-tap glide through gaps | Timing | 1 | - | "Flappy Bird" |
| G9 | Endless Trail | Lane runner collecting litter | Recycling | 2 | - | "Subway Surfers" |
| G10 | Meteor Photographer | Dodge a meteor shower while taking photos | Astronomy | 2 | Replaces bullet hell | - |
| G11 | Platformer Climb | Jump-and-climb to rescue kites | Platforming, momentum | 2 | No stomping enemies | Mario |
| G12 | Hide and Seek | Tagged players become seekers | Spatial reasoning | 3 | Replaces battle royale | - |
| G13 | Paint Turf | Team paints the most floor | Area estimation | 3 | Paint walls, not players | "Splatoon" |
| G14 | Clean Crew | Side-scroller washing graffiti and fixing benches | Civic care | 2 | Replaces beat 'em up | - |

### 7.H Board, card and tabletop (traditional rules)

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| H1 | Patience | Klondike, FreeCell, Spider, Pyramid | Planning | 2 | - | MS Solitaire art |
| H2 | Flip Discs | Reversi | Strategy, corners | 2 | - | "Othello" |
| H3 | Four in a Row | Drop discs to connect four | Threats, parity | 1 | - | "Connect 4" |
| H4 | Checkers | Draughts | Forcing moves | 2 | Pieces "hop over", not "capture" (wording only) | - |
| H5 | Chess Garden | Chess with flower pieces and puzzles | Calculation | 3 | Capture = "send home" | Lichess UI (code is AGPL) |
| H6 | Go Stones | Go on 9x9 | Territory, liberties | 3 | Enclose territory | - |
| H7 | Mancala | Sow seeds into pits | Counting | 1 | Already a sowing game | Brand "Kalah" (unverified) |
| H8 | Dots and Boxes | Close boxes | Parity, chains | 1 | - | - |
| H9 | Code Breaker | Guess the colour code with peg feedback | Hypothesis testing | 1 | - | "Mastermind" |
| H10 | Set Finder | Find sets of attribute triplets | Combinatorics | 1 | - | "SET" (TM) |
| H11 | Trick Taking | Hearts, Whist or Spades | Probability, inference | 3 | - | - |
| H12 | Snakes & Ladders | Dice race | Counting | 1 | Rename to "Vines and Ladders" | - |
| H13 | Nine Men's Morris | Mills | Strategy | 2 | - | - |
| H14 | Word Dice | Roll letter dice to make words | Spelling | 1 | - | "Boggle" |
| H15 | Story Dice | Roll pictures to tell a story | Narrative | 1 | - | "Rory's Story Cubes" |

### 7.I Simulation, management and builders

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| I1 | Tiny Town | Place blocks to make a town with no goal | Architecture, harmony | 2 | - | "Townscaper" style |
| I2 | Juice Stand | Set the recipe and stock according to the weather | Supply and demand without money (pay in "smiles") | 2 | - | "Lemonade Stand" (1973 MECC, unverified) |
| I3 | Café Rush | Time-management cooking | Multitasking | 2 | - | "Diner Dash", "Cooking Mama" |
| I4 | Farm Seasons | Plant, water and harvest by season | Botany, seasons | 3 | - | "Stardew", "Harvest Moon" |
| I5 | Zoo Keeper | Design habitats for animal needs | Animal welfare, biomes | 3 | - | "Zoo Tycoon", "Planet Zoo" |
| I6 | Park Designer | Build rides and paths to keep visitors happy | Queues, flow | 4 | - | "RollerCoaster Tycoon" (OpenRCT2 is GPL) |
| I7 | Hospital for Pets | Diagnose and treat cute pets | Basic health | 3 | No gore | "Two Point", "Theme Hospital" |
| I8 | Rail Builder | Lay tracks to deliver goods | Logistics | 4 | - | OpenTTD (GPL) art |
| I9 | Unpack Rooms | Unpack boxes to tell a story | Spatial order, empathy | 2 | - | "Unpacking" |
| I10 | Life Sim Lite | Care for a family's needs and schedule | Planning, wellbeing | 4 | - | "The Sims" |
| I11 | Truck Routes | Deliver goods across a map | Geography | 3 | - | "Euro Truck Simulator" |
| I12 | Firefighters | Contain spreading wildfire with firebreaks | Fire science | 3 | Fight fire, not people | - |
| I13 | Rescue Tactics | Turn-based rescue of villagers from floods | Planning | 3 | Replaces tactics combat | "Into the Breach" |
| I14 | Space Station | Balance O2, heat, food and power | Life support | 4 | - | "Oxygen Not Included" |

### 7.J Science sims (physics, chemistry, biology, earth and space)

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| J1 | Orbit Toy | Fling planets and see Kepler orbits | Gravity, Kepler's laws | 2 | - | "Universe Sandbox" |
| J2 | Rocket Stages | Stack stages to reach orbit | Rocket equation | 4 | - | "Kerbal" |
| J3 | Molecule Builder | Connect atoms by valence | Bonding | 2 | - | PhET sims (CC BY-NC risk) |
| J4 | pH Painter | Mix acids and bases to hit target colours | pH, titration | 2 | - | - |
| J5 | Circuit Lab | Build circuits to light bulbs | Ohm's law | 2 | - | - |
| J6 | Lens Lab | Arrange lenses and prisms | Refraction | 2 | - | - |
| J7 | Wave Pond | Drop pebbles and see interference | Waves | 1 | - | - |
| J8 | Balloon Gas | Heat and squeeze a gas | Gas laws | 1 | - | - |
| J9 | Food Web | Connect species into a stable web | Ecology | 2 | Predation shown as arrows of energy, not violence | - |
| J10 | Pea Breeder | Cross plants and predict offspring | Mendelian genetics | 2 | - | - |
| J11 | Moth Selection | Camouflage changes as the environment changes | Natural selection | 2 | Moths "fly away" when spotted | - |
| J12 | DNA Zipper | Pair bases quickly | Base pairing | 1 | - | - |
| J13 | Fold Lite | Fold a 2D lattice protein by hydrophobic contact | Protein folding | 3 | - | "Foldit" |
| J14 | Cell Factory | Run organelles with an ATP budget | Cell biology, energy | 3 | - | - |
| J15 | Immune Patrol | Tag invaders so cleaners recycle them | Immune system | 3 | Tag-and-recycle instead of killing | "Plague Inc." |
| J16 | Herd Shield | Vaccinate network nodes to stop spread | Epidemiology (SIR model) | 2 | Spread is a cold, not death | "Plague Inc." |
| J17 | Rock Cycle | Move rocks through heat, pressure and erosion | Geology | 2 | - | - |
| J18 | Water Cycle | Steer evaporation, clouds and rivers | Hydrology | 2 | - | - |
| J19 | Moon Phases | Orbit the moon and match its phases | Astronomy | 1 | - | - |
| J20 | Star Life | Choose a stellar mass and watch its life | Stellar evolution | 2 | - | - |
| J21 | Field Guide | Photograph and identify species, then upload them | Taxonomy; citizen science | 3 | Replaces monster capture | "Pokémon", "Pokémon Snap" |
| J22 | Sequence Align | Slide DNA tiles to align them | Bioinformatics | 2 | - | "Phylo" |

### 7.K Economy, ecology and commons (resource-based)

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| K1 | Barter Market | Trade goods to meet villagers' needs | Double coincidence of wants | 2 | - | - |
| K2 | Shared Pond | Fish a regenerating commons with other players | Tragedy of the commons; Ostrom | 3 | Catch and release, or harvest kelp | - |
| K3 | Sun Budget | Every action costs solar energy | Energy accounting | 2 | - | - |
| K4 | Village Council | Vote on resource rules and see the effects | Ostrom's 8 principles | 3 | - | "Eco" |
| K5 | Circular Factory | Outputs become inputs; zero waste wins | Circular economy | 3 | - | - |
| K6 | Rewild | Restore land, then remove your own tools | Ecological succession | 3 | - | "Terra Nil" |
| K7 | Beehive | Balance foragers and nurses against flowers | Superorganisms, pollination | 2 | - | - |
| K8 | Compost Lab | Mix greens and browns at the right C:N ratio | Decomposition | 1 | - | - |
| K9 | Tool Library | Lend tools between neighbours and manage queues | Sharing economy | 2 | - | - |
| K10 | Time Bank | Trade hours of help | Opportunity cost | 2 | - | - |
| K11 | Gratitude Village | Reputation unlocks cooperation | Reciprocity, trust | 3 | - | - |
| K12 | Abundance City | Automate until goods are free, then manage the constraints | RBE thought experiment, including its criticisms | 4 | - | "Venus Project" (a trademark, unverified) |
| K13 | Watershed | Allocate water upstream and downstream | Water rights | 3 | - | - |
| K14 | Grid Balance | Match renewable supply to demand with storage | Electricity grids | 3 | - | - |
| K15 | Carbon Budget | Keep a town under its CO2 budget | Climate science | 3 | - | - |

### 7.L Idle and incremental

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| L1 | Forest Idle | Trees grow and seed new trees on their own | Exponential growth | 1 | - | - |
| L2 | Automation Idle | Buy machines with produced resources | Compounding, automation | 1 | - | "Cookie Clicker" |
| L3 | Universe Idle | Evolve the cosmos stage by stage | Cosmic history | 2 | Must stay scientifically accurate (the Spore lesson) | "Cell to Singularity" |
| L4 | Text Hamlet | Text idle that builds a village from nothing | Narrative pacing | 1 | - | "A Dark Room" (MPL-2.0; it has combat) |
| L5 | Bacteria Jar | Culture growth with limits | Logistic growth | 1 | - | - |
| L6 | Library Idle | Collect and shelve books to unlock knowledge | Classification | 1 | - | - |
| L7 | Coral Reef Idle | Grow a reef and manage temperature | Reef ecology | 2 | - | - |
| L8 | Tiny Lab Idle | Run experiments for "insight" points | The scientific method | 2 | - | - |

### 7.M Music and rhythm

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| M1 | Echo Notes | Repeat a growing tone sequence | Memory, pitch | 1 | - | "Simon" |
| M2 | Rhythm Garden | Tap on the beat to bloom flowers | Rhythm, meter | 2 | - | "Rhythm Heaven" |
| M3 | Step Composer | 16-step sequencer toy | Composition | 1 | - | - |
| M4 | Dance-Off | Rhythm duel between two players | Timing | 2 | Replaces fighting games | "Dance Dance Revolution" |
| M5 | Interval Birds | Birds sing intervals to identify | Ear training | 1 | - | - |
| M6 | Resonance Lab | Tune strings and tubes | Harmonics, frequency | 2 | - | - |

### 7.N Creative and sandbox toys

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| N1 | Paint Box | Stamps, brushes and fills | Creativity, colour | 1 | - | "Tux Paint" (GPL; reference only) |
| N2 | Pixel Studio | Pixel-art editor with palettes | Colour theory | 1 | - | - |
| N3 | Voxel Garden | Build with blocks in creative mode only | Spatial design | 4 | No mobs | "Minecraft" look |
| N4 | Dress-Up | Mix and match outfits | Culture, colour | 1 | - | "Toca Boca" style |
| N5 | Doll House | Role-play rooms and characters | Social play | 2 | - | "Toca", "Sago Mini" |
| N6 | Creature Maker | Build creatures with plausible anatomy | Biomechanics | 3 | - | "Spore" |
| N7 | Kite Designer | Design kites and test them in wind | Aerodynamics | 2 | - | - |
| N8 | Sound Toy | Generative ambient soundscape | Acoustics | 1 | - | - |

### 7.O Trivia, party and social

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| O1 | Daily Quiz | Five questions a day with a streak | General knowledge | 1 | - | "Trivia Crack", "Trivial Pursuit" |
| O2 | Flag and Map Quiz | Locate countries | Geography | 1 | - | - |
| O3 | Draw and Guess | One player draws, the others guess | Communication | 3 | - | "Pictionary", "Draw Something" |
| O4 | Cookie Detective | Social deduction: who took the cookies? | Inference, bluffing | 3 | Replaces Werewolf "kills" | "Among Us" look |
| O5 | Word Clues | Team gives one-word clues to find agents | Semantics | 2 | Agents become "friends" | "Codenames" |
| O6 | Spot It | Find the shared symbol between two cards | Visual search | 1 | - | "Dobble", "Spot It!" |

### 7.P Adventure, exploration and narrative

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| P1 | Short Hike | Explore an island and help its residents | Curiosity | 3 | - | "A Short Hike" |
| P2 | Point-and-Click Lab | Inventory puzzles in a science lab | Lab procedure | 3 | - | - |
| P3 | Time Detective | Visit eras and fix anachronisms | History | 3 | - | "Carmen Sandiego" |
| P4 | Wagon Trail | Resource journey across a map | Geography, planning | 3 | No death screen; the wagon "rests" | "The Oregon Trail" |
| P5 | Impossible Paths | Rotate the architecture to make paths | Perspective, geometry | 3 | - | "Monument Valley" |
| P6 | Visual Novel | Branching dialogue about the lore universe | Reading, ethics | 2 | - | - |
| P7 | Hidden Objects | Find items in a scene | Visual search, vocabulary | 1 | - | "Where's Waldo/Wally" |
| P8 | Escape Room | Chain of logic locks | Deduction | 2 | No captivity theme; it is a "puzzle house" | - |

### 7.Q Sports, racing and movement

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| Q1 | Mini Golf | Aim and power putts | Vectors, friction | 2 | - | - |
| Q2 | Kart Garden | Kart racing with only boosts and shortcuts | Racing lines | 3 | No shells or attacks | "Mario Kart" |
| Q3 | Curling Stones | Slide stones to the target | Friction, momentum | 2 | - | - |
| Q4 | Walk Quest | Real steps grow a garden | Health | 3 | Exergame | "Pokémon GO" |
| Q5 | Sail Race | Tack against the wind | Vectors, sailing | 3 | - | - |
| Q6 | Billiards Lab | Pool shots with angle guides | Elastic collisions | 2 | - | - |

### 7.R RPG and roguelite, reframed

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| R1 | Calm Quest | Turn-based "encounters" won by puzzles or empathy choices | Emotional literacy | 3 | Calm creatures instead of fighting them | "Undertale" |
| R2 | Dungeon Gardener | Roguelite where you grow plants that open paths | Botany | 3 | No combat | "Shattered Pixel Dungeon" (GPL; it has combat) |
| R3 | Deck of Recipes | Deckbuilder where cards are ingredients for dishes | Nutrition | 3 | Replaces combat cards | "Slay the Spire" |
| R4 | Mapmaker RPG | Survey terrain to level up | Cartography | 3 | - | - |
| R5 | Debate Duel | Card battler with argument types | Logic, fallacies | 3 | Persuasion instead of battle | "Phoenix Wright" |
| R6 | Trader Caravan | Travel and barter across the lore world | Comparative advantage | 4 | - | "Endless Sky" (GPL; it has combat) |

### 7.S Strategy, reframed

| # | Seed | Mechanic | Teaches | Cx | Framing | Avoid |
|---|---|---|---|---|---|---|
| S1 | Flood Guard | Place levees to route floodwater | Hydrology | 2 | Replaces tower defense | "Kingdom Rush" |
| S2 | Ant Colony | RTS-like foraging with pheromone trails | Emergence | 3 | No ant wars | "SimAnt" |
| S3 | Civilization of Ideas | 4X with explore, expand, exploit and exchange; science and culture victories only | History of science | 5 | Replaces conquest | "Civilization"; Unciv (MPL) and Freeciv (GPL) are code references |
| S4 | Settlers Trade | Resource trading on a hex island | Negotiation | 3 | - | "Catan" |
| S5 | Auto Orchestra | Auto-battler structure where you place musicians to play a piece | Harmony | 3 | Replaces auto-battler fights | "Teamfight Tactics" |
| S6 | Logistics Empire | Automated factory with no enemies | Systems thinking | 4 | Remove "biters" | "Factorio"; Mindustry (GPL) |

Counts: A 20, B 12, C 12, D 12, E 15, F 14, G 14, H 15, I 14, J 22, K 15, L 8, M 6, N 8, O 6, P 8, Q 6, R 6, S 6. Total: **219 seeds**. By complexity: Cx 1 = 72, Cx 2 = 86, Cx 3 = 50, Cx 4 = 10, Cx 5 = 1.

## Appendix A. Open-source reference games and lists (live `gh api`, 2026-10-15)

| Repo | Stars | License (API) | Note |
|---|---|---|---|
| lichess-org/lila | 18,838 | AGPL-3.0 | Chess server; chessground is GPL-3.0 (1,378 stars) |
| gabrielecirulli/2048 | 13,437 | MIT | The basis of Ketchapp's 2048 |
| Anuken/Mindustry | 29,362 | GPL-3.0 | Resource and automation reference (has combat) |
| OpenRCT2/OpenRCT2 | 16,433 | GPL-3.0 | Park management |
| luanti-org/luanti | 13,726 | NOASSERTION | Formerly Minetest; voxel engine (LGPL per project, unverified) |
| yairm210/Unciv | 11,438 | MPL-2.0 | 4X on mobile |
| codecombat/codecombat | 8,572 | MIT | Programming RPG |
| OpenTTD/OpenTTD | 8,371 | NOASSERTION | GPL-2.0 per project |
| doublespeakgames/adarkroom | 8,336 | MPL-2.0 | Text idle game |
| endless-sky/endless-sky | 7,632 | GPL-3.0 | Trade and exploration (has combat) |
| veloren/veloren | 7,623 | GPL-3.0 | Voxel RPG |
| 00-Evan/shattered-pixel-dungeon | 6,680 | GPL-3.0 | Mobile roguelike |
| scratchfoundation/scratch-gui | 4,808 | AGPL-3.0 | Block coding |
| SuperTux/supertux | 3,168 | GPL-3.0 | Platformer |
| 0ad/0ad | 2,825 | NOASSERTION | Deprecated mirror; moved to gitea.wildfiregames.com on 2024-08-20 |
| gdquest/learn-gdscript | 2,803 | NOASSERTION | Learn programming |
| Hextris/hextris | 2,441 | NOASSERTION | Hexagonal block puzzle |
| freeciv/freeciv | 1,607 | GPL-2.0 | 4X |
| ovidiuch/flatris | 1,504 | MIT | Falling-block game (watch the Tetris trade dress) |
| gcompris/GCompris-qt | 264 | null | AGPL per https://gcompris.net/index-en.html |
| phetsims/scenery | 81 | MIT | PhET scene graph; joist is also MIT |
| bobeff/open-source-games | 15,882 | CC0-1.0 | Curated list |
| michelpereira/awesome-open-source-games | 3,251 | CC0-1.0 | Curated list |
| ellisonleao/magictools | 17,496 | MIT | Gamedev resource list |

Licence caution: GPL and AGPL code is copyleft. Copying it into a permissively licensed or public-domain repo requires relicensing the derivative or a clean-room rewrite. Use these repos as references for design and behaviour, not as code to copy, unless the licence matches.
