# Catalog research and lore audit

Reviewed 22 October 2026 against issue #3, issue #1 and the complete PR #2
conversation. Popularity is a reason to investigate a mechanic, not evidence
of educational value. The additions below are our design choices, with original
compositions and bounded prototype plans. None imports another game's assets.

| New ID                    | Mechanic evidence                                                                                                                                                                                                                                          | Distinction from the existing catalog                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| WL-19 Theme Trails        | [NYT Games](https://thenewyorktimeshelpcenter.helpjuice.com/360011158491-New-York-Times-Games/360052272251-New-York-Times-Games-Subscription) lists Strands; [primary computational research](https://arxiv.org/abs/2509.10846) analyzes its themed paths. | Semantic clues and bending adjacent-letter paths, rather than WL-09's straight word search or WL-17's category groups.                                 |
| WL-20 Perimeter Words     | The same research analyzes Letter Boxed.                                                                                                                                                                                                                   | Chain words across different banks of a triangular pond; cover a small letter set, rather than guessing a hidden word.                                 |
| BC-20 Sum Garden          | The same research analyzes Pips' region constraints.                                                                                                                                                                                                       | Spatial two-ended tiles must satisfy sums and inequalities; BC-04 remains ordinary matching dominoes.                                                  |
| SS-21 Riverline Transit   | [Mini Metro's developer](https://dinopoloclub.com/games/mini-metro/) describes drawing and revising transit routes.                                                                                                                                        | Design ferry networks and capacity; SS-19 still covers dispatching trains at existing railway signals.                                                 |
| BC-19 Probability Orchard | [Balatro's official site](https://www.playbalatro.com/) describes hand combinations and rule-changing deckbuilding.                                                                                                                                        | Fruit collections expose exact probabilities; no betting, currency or gambling imagery. BC-18's expedition deckbuilding remains separate.              |
| SA-16 Where on Raya?      | [GeoGuessr](https://www.geoguessr.com/) describes geographic inference from environmental clues.                                                                                                                                                           | Authored fictional panoramas and biome evidence, without street imagery, location services or a real-world map quiz.                                   |
| SA-17 Lantern Seekers     | [Innersloth's Hide n Seek announcement](https://www.innersloth.com/new-game-mode-hide-n-seek-is-here-emergency-meeting-35/) establishes the distinct search mode.                                                                                          | Cooperative perspective and sound clues for ages 6+; TD-21 remains a one-tap object-permanence toy.                                                    |
| BD-15 Repair Runway       | [Roblox's infrastructure report](https://about.roblox.com/newsroom/2025/06/roblox-infrastructure-supporting-record-breaking-games?pubDate=20250824) discusses Dress to Impress alongside record participation in Grow a Garden.                            | Weather briefs and repaired material choices, with a cooperative showcase rather than rankings. Garden Grow and existing dress-up ideas remain intact. |
| SM-18 Meadow Outlines     | [Voodoo's Paper.io 2 page](https://voodoo.io/games/paper-io-2) describes expanding territory by drawing a trail and identifies its established audience.                                                                                                   | Closed survey loops teach area versus perimeter, without opponents, cut-off penalties or BC-12's Go liberties.                                         |
| NC-18 Tidepool Sizes      | [Miniclip's web-game catalog](https://www.miniclip.com/games/web) includes Agar.io among its popular games and describes controlling a cell to grow.                                                                                                       | Nutrient mass and scale are explicit; living organisms pass unharmed. This adapts the growth-and-navigation loop without consuming other players.      |

The original 300 IDs remain; ten additions bring the catalog to 310. Every
addition uses existing algorithm and asset-estimate schemas, has an individual
page, and receives four independent image directions in three explicit styles.

## Lore decisions applied

- Every citizen controls their own Guard. Remove the contradictory blanket
  under-18 prohibition; nobody can switch it off for someone else. Gentle
  children's product modes and age labels do not rewrite fictional rights.
  Sora and Tavi ask Trip which game he wants; they do not claim he cannot choose.
- Any two citizens may instantly waive any rule. Remove the contradictory
  distinction between waivable social rules and supposedly unwaivable rules.
  Nobody chooses another person's Guard or consent. Personal choices have
  consequences; gentle product scenarios are deliberate story choices.
- Professor Acorn wears a fitted white suit, including in the eclipse and
  glacier pilots. His rare aging follows his choice to disable Renewal.
- Toddler generation prompts explicitly exclude humans and humanoid hosts.
  They also exclude human hands: touch is a creature paw or a tap ripple.
  Preschool scenes may show Rayan children; human hosts stay in older tiers.
- Keep copying overnight, intact original apples, white thin distant towers,
  2 km flight range, lattice flight suits, and red-left/blue-right Orbi eyes.
- Raya's E1–E5 are declared speculative exceptions. Shacados has no magical
  exceptions, but extreme propulsion calculations are not demonstrated
  engineering feasibility. The realistic simulator must not teach them as facts.
- Preserve the latest wide-binary choice: 2,000 AU, approximately 11.6 light-days,
  autonomous uncrewed interstellar probe, a separate crewed boost capsule only
  to orbit, and Kesh's refusal. Older original-pilot numbers remain explicitly
  historical alternatives. Loading backgrounds now show Raya's star as a bright
  point through a clear gap, consistent with the wide-binary pilot.
- Keep Shacados dignified and hopeful: one living plant, warm light, repair and
  sharing; 10+ or 13+ as labeled. Its settings do not enter toddler collections.
- Omi is a learning world. Toy transformations inside it do not add unexplained
  powers to physical Orbis. Render composition units are not engineering scale.
- Existing draft names and alternative creative proposals remain labeled as
  proposals. The render presets choose concrete settings so every pilot can be
  reproduced without waiting for those editorial choices to become canon.

Historical art prompts and research records retain their original wording and
dates. Current lore and fresh generation briefs use the corrected decisions.

The final physics review removed a claim that speed alone makes the pilot's
object a planet-killer. The script computes energy per unit mass; total impact
energy needs a mass. [NASA/JPL's Sentry documentation](https://ssd-api.jpl.nasa.gov/doc/sentry.html)
also identifies mass and impact velocity as inputs to impact energy. The lore
retains its relativistic calculations, corrects the impact-scale wording and
states that passing kinematic checks does not prove buildable propulsion or
survivable acceleration. The regression in `tests/first-contact-physics.test.js`
failed against the former wording, then passed on Node, Bun and Deno.

## Visual review

New concept briefs require three distinct styles: flat storybook graphics,
painted anime environments and tactile 3D dioramas. Initial images whose first
two directions both looked three-dimensional were replaced before delivery.
Native generation outputs remain separate assets, with no compositing or
upscaling. Review sheets are internal inspection aids only.

The existing 216 illustrated games also receive new flat storybook and painted
anime alternatives. Their four original images and original prompts remain
intact; the additions make style selection explicit even where the original
views had converged on similar 3D shading. The finished catalog contains 1,672
concept images, with three distinct styles offered for every game.

The Blender studies use CC0 scanned materials and plants, linked procedural
trees, dense ground cover, physically based surfaces and Cycles illumination.
The photographed outdoor panorama supplies light; camera rays see an authored
sky and landscape. Fine detail remains offline, while the web export uses
bounded geometry and draws only when the user opens or changes a view.
