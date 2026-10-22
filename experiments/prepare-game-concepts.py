"""One-time import of the existing idea table, preserving all stable IDs.

The maintained catalog lives in docs/master-plan/concepts/catalog/*.json.
Run this importer only against the pre-gallery game-ideas.md table.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "docs/master-plan/concepts"

# ID | title | genre | learning objective | complexity | gameplay scene
ADDITIONS = """
PZ-19|Blossom Swap|Match-3|Planning cascades and recognizing plant parts|2|Swap adjacent leaf and flower tiles on a six-by-six garden bed to complete a visible collection goal.
PZ-20|Bubble Canopy|Bubble shooter|Reflection angles and color grouping|3|Aim a seed bubble at a suspended canopy of matching bubbles, with a dotted wall-bounce preview.
PZ-21|Tiny Triples|Triple-match object tray|Classification and limited working space|2|Find three identical field-study objects in a shallow pile and place them in a seven-slot tray.
PZ-22|Pebble Pop|Tap-to-collapse puzzle|Connected components and planning|2|Tap connected same-pattern pebbles in a basin to open a channel for a seed boat.
PZ-23|Harvest Drop|Physics drop-and-merge|Size ordering and collision prediction|3|Drop round seed pods into a glass planter; matching pods combine into the next larger botanical model.
PZ-24|Habitat Merge|Merge-3 map puzzle|Habitat succession and spatial planning|2|Arrange three seed tokens on a hexagonal restoration map to unlock a sapling model, with growth clearly presented as a game abstraction.
PZ-25|Bicycle Jam|Parking escape puzzle|Dependencies and route planning|2|Slide little cargo bicycles along their marked axes until the library delivery bike can exit.
PZ-26|Shuttle Queue|Bus-seat sorting puzzle|Capacity and queue management|2|Send color-and-symbol-coded shuttles to a station so waiting link friends can all board safely.
PZ-27|Parcel Conveyor|Conveyor tile matching|Ordering and buffer capacity|2|Route patterned parcels from a conveyor into three labeled-by-symbol sorting bays without overflowing a small buffer.
PZ-28|One Stroke Garden|One-line drawing puzzle|Euler paths and graph degree|2|Trace every path of a small garden graph exactly once, linking all its flower-shaped junctions.
PZ-29|Ribbon Rescue|Rope sorting and untangling|Spatial reasoning and crossing order|3|Move ribbon endpoints between wooden pegs until all colored-and-patterned ribbons lie separately.
PZ-30|Trail Numbers|Numbered Hamiltonian path puzzle|Sequencing and constraint propagation|2|Draw one continuous route through every garden square, visiting numbered checkpoints in order.
WL-16|Word Ladder Grove|Word transformation ladder|Spelling and edit distance|2|Change one letter per rung on a treehouse ladder, turning COLD into WARM through valid words.
WL-17|Category Picnic|Word grouping puzzle|Semantic categories and ambiguity|2|Sort sixteen word cards into four meaningful picnic baskets and explain the shared category.
WL-18|Picture Phrase|Rebus puzzle|Language inference and idioms|2|Rearrange illustrated word-and-object tiles on a theater stage to reveal a familiar phrase.
ML-18|Island Bridges|Hashi bridges puzzle|Graph degree and connectivity|2|Connect numbered islands with one or two bridges while keeping every island reachable.
ML-19|Greater Garden|Futoshiki inequality puzzle|Ordering and inequalities|2|Place number stones in a small Latin-square garden with clearly visible greater-than gates.
ML-20|Make Twenty-Four|Arithmetic expression puzzle|Arithmetic and order of operations|1|Arrange four number cards and operation tiles on a kitchen table to make twenty-four.
BC-15|Acorn Backgammon|Backgammon|Probability and risk-aware planning|3|Move acorn counters around an original woodland backgammon board, showing the two dice and legal destinations.
BC-16|Leaf Hearts|Hearts card game|Counting suits and forecasting|2|Choose a leaf-suit card from a visible hand at a friendly four-player woodland table.
BC-17|Signal Crew|Cooperative trick-taking|Communication constraints and deduction|3|Coordinate a four-player space crew using original numbered signal cards and a shared research objective.
BC-18|Expedition Deck|Roguelite deckbuilder|Probability and resource trade-offs|4|Play weather, rope and shelter cards to complete a mountain research expedition, without combat or gambling.
SL-18|Momentum Pinball|Pinball|Momentum and angle of reflection|3|Use two flippers to guide a polished ball through a botanical laboratory pinball table with spring bumpers.
SL-19|Prism Breaker|Brick-breaker|Angles and elastic collision models|3|Move a small paddle to bounce a light sphere through an ordered wall of translucent research tiles.
SL-20|Watergate Pins|Pull-pin flow puzzle|Gravity and connectivity|3|Remove a brass pin between transparent chambers so clean water reaches a thirsty seedling.
NC-15|Clean Little World|Cleaning simulator|Material care and water budgeting|3|Sweep a gentle water jet across a muddy playground tile, exposing a bright mosaic while a water gauge stays visible.
NC-16|Terrarium Journal|Creature collection and care|Microhabitats and species observation|3|Photograph tiny real-world invertebrates in a planted terrarium and place observations into a field journal.
NC-17|Magnet Fishing Day|Fishing-style cleanup|Magnetism and material classification|3|Lower a magnet from a small dock to retrieve metal litter while fish swim safely past.
BD-12|Room for Everyone|Unpacking and room organization|Spatial fit and accessible design|2|Unpack study objects into a tiny room, leaving a clear accessible path from the door to the desk.
BD-13|Research Backpack|Inventory packing and synergies|Area and adjacency constraints|2|Fit differently shaped field tools into a gridded backpack, keeping complementary items adjacent.
BD-14|Clay and Symmetry|Pottery shaping|Rotational symmetry and volume|3|Shape a spinning clay pot with a gentle touch, with a side profile and reference silhouette visible.
MR-09|Dance Dialogue|Rhythm duel|Call-and-response and timing|3|Two link friends exchange mirrored dance steps across a glowing beat circle, with no fighting.
MR-10|Beat Path|Rhythm platformer|Beat subdivision and anticipation|3|Hop across musical stepping stones whose spacing follows a visible four-beat rhythm.
SM-15|Crossing Friends|Endless crossing arcade|Timing and gap estimation|2|Guide a tiny link friend across a stream of toy carts and lily-pad channels toward a library.
SM-16|Keep It Up|Cooperative volleyball|Trajectories and cooperation|3|Two friendly teams keep a soft ball airborne over a low garden net, predicting its landing circle.
SM-17|Rooftop Routes|Precision platformer|Momentum and safe route planning|3|Choose jumps between low rooftop gardens with soft landing pads and visible wind ribbons.
SP-15|Orbital Dock|Precision docking simulator|Relative velocity and reference frames|4|Align a small research capsule with a rotating station docking ring using tiny reaction-control puffs.
SP-16|Debris Sweep|Survivor-like rescue arcade|Vectors and prioritization|3|Pilot a rescue drone through drifting debris, using gentle tractor-field arcs to clear paths for stranded probes.
SP-17|Rover Geologist|Rover exploration simulator|Geology and instrument uncertainty|4|Drive a compact scientific rover to layered rock outcrops and compare a sample with instrument readings.
SA-13|Lantern Labyrinth|Exploration metroidvania|Mapping and tool-based reasoning|4|Explore a connected cave garden, using a newly found mirror lantern to open a previously inaccessible light gate.
SA-14|Evidence Circle|Social deduction without elimination|Evidence quality and revising beliefs|3|Compare weather-station clues around a round table to identify a faulty sensor together, with no accusing people.
SA-15|Map of Whispers|Non-combat roguelike exploration|Risk assessment and navigation|3|Choose between procedurally arranged forest rooms using a small map, food supplies and weather clues.
SS-15|Circular Factory|Factory automation|Flow rates and closed material loops|4|Connect recycling machines with conveyor belts to transform recovered materials into shared repair parts.
SS-16|Helper Teams|Non-combat autobattler|Complementary roles and scheduling|4|Arrange a team of gardening robots on a preparation grid, then watch their combined abilities restore a habitat.
SS-17|Lunch for All|Restaurant time management|Queueing and nutrition planning|3|Sequence soup, bread and fruit preparation across a shared counter to serve all waiting friends.
SS-18|Repair Cafe|Workshop management|Repairability and resource allocation|4|Assign returned toys and appliances to repair benches, budgeting spare parts and volunteer time.
SS-19|Railway Signals|Train dispatch and track routing|Scheduling and collision avoidance|3|Switch tracks on a compact railway so two passenger trains reach their stations with safe separation.
SS-20|Ready Together|Cooperative disaster preparation|Preparedness and resilient systems|4|Place rain gardens, water stores and safe footpaths on a town model before a forecast storm.
""".strip()

SCENES = {
    "PZ": """Turn over two leaf cards in a small wooden memory grid, revealing a matching pair.
Slide numbered beads on a four-by-four tray, merging equal values into doubled beads.
Fit seven geometric wooden tangram pieces into a friendly animal outline.
Drag one final jigsaw piece into an illustrated map of Omi.
Compare two botanical pictures side by side and circle one changed leaf.
Find small link-shaped objects among carefully arranged study-room treasures.
Slide numbered wooden tiles into the empty cell of a four-by-four board.
Pour a top layer between transparent patterned cups without mixing unlike layers.
Fit flower-shaped polyominoes into an open garden grid to complete a row.
Draw separate non-crossing paths between matching endpoints on a square grid.
Fill cells in a nonogram whose clues reveal an infinity-loop friend.
Toggle a lamp in a small grid, showing that its orthogonal neighbors change too.
Rotate pipe elbows to connect a water tank to planted beds in a small grid.
Drag graph nodes apart until every crossing edge becomes separate.
Rotate a mirror to reflect one laser beam into a distant flower-shaped receiver.
Unscrew brass fasteners in a clear dependency order to release wooden plates.
Push one seed crate toward its marked destination in a small walled warehouse.
Rotate a miniature room so gravity rolls a seed into a sheltered planter.""",
    "WL": """Steer a letter-carrying toy train along a grid to spell a short word.
Trace a large letter on a sand tablet, following a clear directional guide.
Tap a bubble bearing a letter that matches a pictured object's initial sound.
Find a plant word along a highlighted line in a letter-search grid.
Connect a picture card to its translation card across a small bridge.
Place letter tiles into a five-letter guess grid with patterned feedback markers.
Rearrange letter-shaped biscuits on a bakery tray to form a valid word.
Build words from six outer letter tiles and one mandatory center tile.
Fill a tiny crossword using pictured clues and intersecting letters.
Match pictured rhyming objects along a musical garden path.
Pair a carefully drawn sign-language alphabet handshape with its letter card.
Type a short falling word before its raindrops reach a seedling bed.
Rotate a Caesar-cipher wheel beside a short encoded postcard.
Connect subject, verb and object cards into a visible sentence path.
Arrange illustrated story dice into a beginning, middle and ending.""",
    "ML": """Choose an arithmetic answer gate for a round link friend hopping between clouds.
Hop along a number line from negative stones toward a target value.
Plant flowers in rows and columns to show multiplication as rectangular area.
Place the missing patterned carriage into a toy train sequence.
Place a number bead into a Sudoku grid with row and column guides.
Mark safe treasure squares using adjacent numbered clue envelopes.
Divide a round vegetable pie into equal fractional shares.
Balance identical tokens on both pans of a scale to preserve an equation.
Fill a small arithmetic-cage grid using sum clues printed along its edges.
Move an acorn disk between three pegs without placing larger disks above smaller ones.
Toggle binary bead switches to represent a target decimal number.
Select cards sharing one attribute while differing in other attributes.
Fill a compact logic-deduction grid using illustrated friends and their preferences.
Spin a probability wheel beside a growing bar chart of observed outcomes.
Use a compass and straightedge to construct a perpendicular bisector.
Draw the shortest delivery route between flower-shaped graph junctions.
Rewrite one symbolic link expression using a visible valid inference rule.""",
    "BC": """Place a link counter into a three-by-three tic-tac-toe board.
Move a round friend along a numbered path with rope bridges and ladders.
Ask for a matching animal-family card at a friendly small card table.
Place a domino so matching dot counts touch at the open end of a chain.
Flip a line of contrasting leaf counters on an original reversible-disc board.
Choose how many acorns to remove from one of three visible piles.
Guide colored-and-patterned pieces along a shared race track toward home.
Move a descending alternating-suit card sequence between solitaire columns.
Lift an exposed matching pair from a layered set of illustrated tiles.
Lay numbered cards into a same-rank set and a consecutive same-suit run.
Connect opposite sides of a hexagonal board with stepping-stone counters.
Place a stone to surround empty garden territory on a gridded board.
Move friendly chess-piece characters along legal squares toward a planning goal.
Coordinate rescue boats and sandbags on a cooperative island board.""",
    "SL": """Overlap red, green and blue spotlights on a white laboratory wall.
Arrange illustrated element cards around a simplified periodic-table board.
Drop a wooden acorn block onto a gently swaying tower, keeping its center of mass above the base.
Fit illustrated organ pieces into a friendly transparent body model.
Drop equal-volume objects of different densities into a clear water tank.
Guide a steel bead through a maze using a movable magnet outside the glass.
Cut one support rope so a seed swings into a waiting planter.
Adjust a slingshot angle to launch a seed along a visible parabolic path.
Connect atom models into a correctly bonded water molecule on a workbench.
Close a simple battery, resistor and lamp circuit on a safe low-voltage breadboard.
Move a convex lens along an optical bench to bring light to a focus.
Arrange a lever, pulley and wheel into a small chain-reaction machine.
Match a plucked string's vibration to a visible oscilloscope wave.
Adjust sun and water inputs in a miniature water-cycle terrarium.
Place bridge beams between riverbanks with tension and compression overlays.
Draw a barrier in a falling-sand sandbox to redirect water into a reservoir.
Move a microscope slide to observe a magnified cell with clearly drawn structures.""",
    "NC": """Help a round link friend complete a gentle illustrated handwashing routine.
Choose a raincoat and boots for a friend beside a window showing rainy weather.
Sort paper, glass and metal objects into distinct symbol-marked recycling bins.
Photograph a recognizable garden bird through a field-guide camera view.
Collect floating litter with a soft net while marine animals remain free.
Draw a bee's route between flowers and its hive on a garden map.
Wrap a small animal's paw in a friendly veterinary care station.
Give a sleepy link pet water, rest and a comfortable corner in its home.
Choose water and light for seedlings in a cutaway planter showing roots.
Measure vegetables and grain into a shared meal using marked measuring cups.
Plan crop beds across seasons on a small farm with a compost heap.
Choose a safe migration route using wetlands and rest stops on a map.
Balance plants, filters and fish in a cutaway aquarium with oxygen and nitrogen indicators.
Design forest paths and firebreaks on a small community woodland map.""",
    "BD": """Fill a numbered botanical illustration with carefully chosen color swatches.
Place mirrored pixels on a small grid to complete a symmetric creature.
Arrange fabric patterns and reusable costume pieces on a friendly mannequin.
Fold a square sheet along a clear crease to form a simple paper bird.
Snap movement and repeat blocks into a program guiding a small robot.
Draw a walking map with a compass rose and a consistent distance scale.
Connect ramps and loops into a visible tabletop marble run.
Arrange successive drawings of a bouncing seed in a flipbook timeline.
Place a platform and a goal in a miniature level editor, then test the route.
Build a tiny accessible home with a clear ramp and load-bearing frame.
Construct a small voxel greenhouse using visible blocks and simple logic wiring.""",
    "MR": """Repeat a short sequence of four glowing musical pads around a friendly ring.
Tap illustrated hand drums following a simple repeating rhythmic pattern.
Tap falling note tiles as they meet the corresponding piano keys.
Hit large rhythm targets as notes arrive on a clear beat line.
Match two illustrated musical intervals using a small keyboard.
Place notes in a step-sequencer grid whose rows grow different musical plants.
Guide a tiny orchestra with a clear conducting arc and visible beat markers.
Follow a melody line above a gentle singing character, with microphone control visibly optional.""",
    "SM": """Keep three soft balls following distinct parabolic juggling paths.
Guide a runner between three lanes of picture-category gates.
Aim a miniature golf ball around a curved garden obstacle toward a cup.
Slide a curling stone toward a target while showing a friction trail.
Choose the launch angle for a soft basketball heading toward a low hoop.
Aim a cue ball at a second ball with a visible collision-angle guide.
Adjust the wing fold of a paper glider flying through a gentle air current.
Guide a kite on a visible taut string with wind ribbons showing direction.
Steer a tiny skier between slalom gates on a gentle snowy slope.
Return a table-tennis ball with a spin trail and a clear landing target.
Drive friendly electric karts along an original garden circuit with visible racing lines.
Trim a small sailboat's sail relative to wind arrows on a lake.
Choose handholds for a friendly climber on a low safe climbing wall.
Guide a skateboard through a smooth half-pipe with an angular-momentum trail.""",
    "SP": """Connect stars on a dark sky chart to reveal a recognizable constellation.
Turn over paired planet and moon cards on a small observatory desk.
Apply a gentle early impulse to a comet so its projected orbit misses a protected station.
Throttle a tiny lunar lander above a level landing pad with a visible fuel reserve.
Adjust a planet's initial velocity in a simple orbital sandbox with traced ellipses.
Compare delayed telescope readings on a calm orbital-station monitoring display.
Assemble a probe from sensors, battery and thruster modules on a workbench.
Send a move across a space-strategy board where a visible signal takes time to arrive.
Explore a mapped star field through a telescope with distance-scale markers.
Orient a thin solar sail so sunlight changes a probe's trajectory.
Connect satellites around a globe to cover isolated ground stations.
Stage a small research rocket with a clear propellant and dry-mass cutaway.
Adjust a fictional planet's atmosphere and incoming sunlight using model controls.
Compare clocks on a near-light-speed spacecraft and its home station.""",
    "SA": """Choose between two illustrated paths in a cozy interactive picture book.
Help a neighbor carry books through a small town square.
Inspect a painting and its material clues in a quiet nighttime museum.
Compare footprints and timestamped notes on a gentle mystery board.
Coordinate two friends using mirror and switch clues in a friendly escape room.
Brush soil layers away from a pottery fragment beside a stratigraphy chart.
Follow illustrated dialogue clues through a village in a new language.
Read two perspectives on a historical event in an illustrated diary.
Build a shared code from repeated mathematical signal patterns across space.
Connect points, doublets and networks on an academy puzzle table.
Explore a low-poly Omi coastline with an anime-style science guide.
Guide a teen traveler toward a safe exit using empathetic dialogue and non-violent routes.""",
    "SS": """Allocate solar energy between research stations and watch compounding progress on a graph.
Place umbrellas and water channels along a garden path to protect seedlings from weather.
Time two traffic lights so toy pedestrians and carts cross safely.
Connect solar panels, storage and homes while balancing power supply and demand.
Allocate a shared reservoir between households, gardens and a protected wetland.
Route small cargo vehicles between farms, workshops and shared storage.
Compare community health curves while choosing ventilation and vaccination resources.
Adjust a small food-web model and observe population curves beside the habitat.
Assign care teams and beds in a friendly hospital planning board.
Lay footpaths, homes and shared gardens around a town's visible resource flows.
Compare emissions-reduction choices on a town model with an uncertainty-band chart.
Exchange scientific observations between Reya and Shacados using peaceful diplomatic routes.
Balance air, water, food and electricity in a cutaway Mars habitat.
Coordinate a physically grounded peaceful first contact between two star systems, using delayed signals and orbital trajectories.""",
}


def main():
    groups = {}
    for line in (ROOT / "docs/master-plan/game-ideas.md").read_text().splitlines():
        if not re.match(r"\| [A-Z]{2}-\d+", line):
            continue
        identifier, title, genre, lesson, cx = [x.strip() for x in line.split("|")[1:6]]
        wave = re.search(r"\*\*(W\d)\*\*", title)
        title = re.sub(r"\*\*", "", re.sub(r"\s+\*\*W\d\*\*", "", title))
        family = identifier.split("-")[0]
        groups.setdefault(family, []).append(dict(id=identifier, title=title, genre=genre, lesson=lesson, cx=cx, wave=wave[1] if wave else None, original=True))
    assert sum(map(len, groups.values())) == 168, "Importer requires original 168-idea table"
    for family, games in groups.items():
        scenes = SCENES[family].splitlines()
        assert len(scenes) == len(games), family
        for game, scene in zip(games, scenes):
            game["scene"] = scene
    for line in ADDITIONS.splitlines():
        identifier, title, genre, lesson, cx, scene = line.split("|")
        family = identifier.split("-")[0]
        groups[family].append(dict(id=identifier, title=title, genre=genre, lesson=lesson, cx=cx, wave=None, original=False, scene=scene))
    (BASE / "catalog").mkdir(parents=True, exist_ok=True)
    for family, games in groups.items():
        (BASE / "catalog" / f"{family.lower()}.json").write_text(json.dumps(games, indent=2, ensure_ascii=False) + "\n")
    print(f"Preserved 168 original ideas; added 48; wrote {sum(map(len, groups.values()))} idea records.")


if __name__ == "__main__":
    main()
