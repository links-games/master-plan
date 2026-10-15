# Visual game catalog: coverage expansion and image provenance

Snapshot: 2026-10-15. Request:
[PR #2 feedback at 11:04 UTC](https://github.com/links-games/master-plan/pull/2#issuecomment-6190555786).
The previous list had 168 ideas but no per-game visual comparison. The expansion
preserves every original ID and adds 48 ideas, giving 216 pages across the same
12 collections. Four directions per page require 864 separate image generations.

## Evidence for the missing mechanics

These primary sources establish shipped examples and their mechanics. They are
not a sales ranking, and a shipped genre does not guarantee demand for our
version. The following mapping is our design analysis of gaps in the existing
catalog. All new titles, scenes and learning objectives are proposals.

| Primary source | What it establishes | Catalog response |
| --- | --- | --- |
| [King's game catalog](https://www.king.com/game/) | The publisher describes switching/matching, bubble matching and block clearing in its portfolio. | PZ-19 Blossom Swap, PZ-20 Bubble Canopy, PZ-22 Pebble Pop. |
| [Dream Games' games](https://www.dreamgames.com/games) | Puzzle progression and world renovation are used together in its current portfolio. | Match-3 gets its own small-game concept; world-building is a later extension, not prototype scope. |
| [Voodoo publishing](https://voodoo.io/publishing) | Block Jam is a featured puzzle case study; fast prototype iteration is part of the publisher's process. | Separate sorting, buffer and transport-dependency concepts PZ-21, PZ-25–27. This is genre analysis, not a claim that each uses Block Jam's exact rules. |
| [Voodoo's Throw Blocks](https://voodoo.io/games/throw-blocks) | The game combines block dragging, color grouping and merging. | Distinguish drag/merge, triple matching, collapse and conveyor sorting rather than treating all as one merge game. |
| [Suika Game, publisher's official site](https://suikagame.jp/) | The publisher explains colliding matching fruits inside a box to evolve them, a different interaction from sliding 2048. | PZ-23 Harvest Drop uses original seed models and a different setting; no copied fruit faces or interface. |
| [Dinosaur Polo Club's games](https://dinopoloclub.com/Games/) | Mini Metro and Mini Motorways use drawn networks, changing demand and limited resources. | SS-19 Railway Signals isolates track dispatch and safe separation from the broader existing Logistics Links concept. |
| [Backpack Battles, developer's Steam listing](https://store.steampowered.com/app/2427700/Backpack_Battles/) | Inventory arrangement and item synergies are a distinct playable loop. | BD-13 Research Backpack keeps packing and adjacency; SS-16 Helper Teams uses cooperative roles without combat. |
| [Slay the Spire, developer's Steam listing](https://store.steampowered.com/app/646570/Slay_the_Spire/) | Deckbuilding combined with repeatable procedural runs. | BC-18 Expedition Deck applies deck choice to shelter, weather and scientific expeditions, without combat. |
| [Unpacking, developer's Steam community description](https://steamcommunity.com/app/1135690/) | Pulling possessions out of boxes and fitting them into a home is the core activity. | BD-12 Room for Everyone adds accessible paths and an original space. |
| [PowerWash Simulator, developer's Steam community description](https://steamcommunity.com/app/1290000/) | Cleaning surfaces is the main interaction. | NC-15 Clean Little World uses a small scene and an explicit water budget. |
| Simon Tatham's manuals for [Bridges](https://www.chiark.greenend.org.uk/~sgtatham/puzzles/doc/bridges.html) and [Unequal](https://www.chiark.greenend.org.uk/~sgtatham/puzzles/doc/unequal.html) | These compact logic families have independent graph and inequality rules. | ML-18 and ML-19 complement the existing Sudoku and nonogram ideas. |

Other additions fill classic or adjacent mechanics: word ladders, rebuses,
cooperative trick-taking, pinball, brick-breaker, pottery, rhythm platforming,
crossing, docking, exploration and repair management. Their presence expands
choice; it is not evidence that every proposed combination is popular. The
[existing genres note](research-genres-ideas.md) remains the broader research
baseline. No licensed screenshots, characters or commercial game assets are
included as concept-generation inputs.

## Four views per idea

1. **Gameplay:** readable board or interaction, crisp silhouettes; evaluate
   whether the next action is obvious.
2. **World:** environmental key visual with the specific mechanic in foreground;
   evaluate setting appeal.
3. **Characters and materials:** tactile stylized 3D detail; evaluate identity.
4. **Expanded play:** a richer scenario using the same core mechanic; evaluate
   potential beyond the first challenge.

Every prompt includes its game's unique scene, mechanic and learning objective.
The reusable direction scaffolding keeps comparisons consistent. No montage is
split into four deliverables; no image is shared as different games' concept art.

## Model and resolution constraints

The request names GPT Image 2.5 or the latest available. The official
[Images and vision guide](https://developers.openai.com/api/docs/guides/images-vision)
names `gpt-image-2.5-sunburst` for direct image API requests and describes
automatic GPT Image selection with tool-based generation. The official
[image prompting guide](https://developers.openai.com/api/docs/guides/image-prompting)
describes GPT Image 2.5 Flare and Sunburst. Both pages were opened for this
snapshot. These observations establish public documentation, not this session's
hidden model configuration.

This session uses the built-in `image_gen.imagegen` tool, which has no model,
quality or size parameter and does not report a model ID. Prompts request
2048 × 2048 or the highest native resolution available. The first sample returned
1254 × 1254. Manifests therefore report actual dimensions and `modelReported:
null`, rather than claiming a verified 2.5 deployment or a fixed 2K output.
The catalog minimum is 1024 pixels on both edges. Full art is encoded as WebP
quality 92 without resizing; only index thumbnails are downscaled.

## Verification and limits

Automated coverage checks independently verify all stable IDs, one page per
idea, exactly four distinct image files and manifest entries, image signatures
and dimensions, byte hashes, exact prompt correspondence and navigation links.
These tests catch missing deliverables and accidental duplicate reuse. They
cannot establish educational correctness, market success, usability or perfect
character continuity. Each concept is a proposal to review before prototyping;
playtesting and domain review remain necessary.

The [visual review record](visual-review.md) preserves collection observations
and distinguishes overview inspection from scientific or rule validation.
