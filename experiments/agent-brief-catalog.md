# Brief for new-collection catalog agents

You write a NEW collection catalog `docs/master-plan/concepts/catalog/<fam>.json` (currently `[]`)
AND its estimates `docs/master-plan/concepts/estimates/<fam>.json` (see the common brief in
experiments/agent-brief-common.md for estimates).

Context to read first (skim fully, they define canon):

- docs/master-plan/lore/raya.md (the utopian home planet: untouched nature, tall white acoustic
  and telecom "Chord towers", white tight lattice clothing, Orbis = 30 cm white robotic sphere
  companions with a coral-red left eye and sky-blue right eye, acoustic flight on sky-lanes,
  copy-don't-take apple copying, the Guard, Renewal, Gentle Defaults, waivers).
- docs/master-plan/lore/shacados.md (the dark rusted planet; age rule; tone rule; visual guide).
- docs/master-plan/lore/README.md and docs/master-plan/lore/characters.md (Linky and friends,
  wisdom lines, rules).
- docs/case-studies/issue-1/data/research-raya-shacados.md section 7 (toddler design rules).
- Look at docs/master-plan/concepts/catalog/pz.json and nc.json for the existing style, and
  docs/master-plan/game-ideas.md for existing ideas so you do not duplicate titles.

Each catalog entry (JSON object, keys in this order):
{
"id": "TD-01", // family code upper-case + 2-digit number, sequential
"title": "Bubble Meadow", // short, original, unique across the repo
"genre": "Tap-to-pop cause and effect", // familiar mechanic in plain words
"lesson": "Cause and effect, pointing", // learning objective, plain words
"cx": "1", // string "1".."5", complexity ladder
"wave": null,
"original": false,
"ages": "1–3", // en dash, e.g. "1–3", "3–5", "10+", "13+"
"scene": "...", // GAMEPLAY image description: 1-2 sentences, 20-45
// words, the playable moment as seen on screen
"views": {
"world": "...", // WORLD image description, 35-70 words: the place,
// light, nature, towers/landmarks, mood
"details": "...", // CHARACTERS AND MATERIALS, 35-70 words: who appears,
// clothing, Orbi/props, textures, palette
"discovery": "..." // EXPANDED PLAY, 35-70 words: how the game grows
// later (new levels, modes), as an image
},
"story": "...", // a tiny story with wisdom, 50-110 words, in the
// world's voice, suitable for the target age
"wisdom": "..." // one-line saying the story teaches (max ~10 words)
}
Writing rules: simple, concrete English; short sentences; no "|" characters; no markdown;
no violence, weapons, money, shops, ads, logos or written text in images; original
characters only (no existing IP). Image descriptions are prompts another agent will turn into
art later, so be visual and specific (camera, composition, light, colors, materials) and keep
the mechanic readable with large touch targets. Everything must be consistent with the lore.
Estimates must cover every game you add (same ids, same order).
Validate the estimates with the --check command for your family, and validate the catalog with:
node -e "const c=require('./docs/master-plan/concepts/catalog/FAM.json');const keys='id,title,genre,lesson,cx,wave,original,ages,scene,views,story,wisdom';for(const g of c){if(Object.keys(g).join()!==keys)console.log('keys',g.id);for(const k of ['world','details','discovery'])if(!g.views[k]||g.views[k].length<150)console.log('short view',g.id,k);if(JSON.stringify(g).includes('|'))console.log('pipe',g.id);if(g.story.length<200)console.log('short story',g.id)}console.log(c.length,'games')"
Finish with a list of your ids and titles.
