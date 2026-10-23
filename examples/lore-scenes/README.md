# Reproducible lore environments

These open-source Blender scenes provide backgrounds for all
[22 scenery pilots](../../docs/master-plan/lore/scenery-pilots.md).
The [render gallery](../../docs/master-plan/lore/scenes/README.md) links every
native render, packed `.blend`, low-detail web mesh and provenance manifest.
They are environment studies; the character action remains in the pilot briefs.

## Reproduce the renders

On Linux x86-64, install the official Blender 4.0.2 build with the checked-in
installer. Its SHA-256 is pinned to the
[official release checksum](https://download.blender.org/release/Blender4.0/blender-4.0.2.sha256).
This build includes Sapling and OpenImageDenoise. Some distribution packages
omit the denoiser and cannot reproduce the production settings.

```sh
bash experiments/install-lore-blender.sh /tmp/master-plan-blender
/tmp/master-plan-blender/blender --background --factory-startup --threads 2 --python examples/lore-scenes/render.py -- --all
/usr/bin/python3 experiments/encode-lore-scenes.py
node scripts/validate-scenes.mjs
```

The WebP encoder needs Python's Pillow package (`python3-pil` on Ubuntu).
Ordinary rendering needs no downloads after Blender is installed: all source
materials, models and HDR lighting are vendored in `assets/`. Every generated
`.blend` packs its image dependencies. `scenes.json` maps each fixed seed to its
pilot heading, world, age tier and setting. Geometry is built by `render.py`,
`detail.py` and `trees.py`.

Production settings are 1280 × 720, 64 Cycles CPU samples, OpenImageDenoise and
two render threads. The manifest records the actual version, seed, sample count,
resolution, geometry count, source-input hashes and output hashes. Validation
rejects a render when its scene code, presets or source-asset manifest changes.
Different Blender versions may
produce different pixels; reproducibility means documented inputs and settings,
not an unsupported promise of identical images across renderer versions.

For a bounded preview, render one scene to a temporary directory:

```sh
/tmp/master-plan-blender/blender --background --factory-startup --threads 2 --python examples/lore-scenes/render.py -- --scene 01 --width 960 --samples 16 --out /tmp/lore-preview
```

Widths are bounded to 320–1920 pixels and samples to 1–128. Production validation
requires 1280 × 720 and at least 64 samples. Use a fresh Blender process for each scene on a
memory-constrained machine:

```sh
/usr/bin/python3 experiments/render-lore-scenes.py --resume
```

The supervisor retains completed renders only when source and output hashes
match, and saves a separate verbose log for each process. Linked botanical and scanned-mesh instances share
data, and orphaned data is removed between scenes.

## CI and browser validation

The Lore environments workflow renders all scenes in six CPU batches of at most four
scenes: `--all --batch 0/6` through `--all --batch 5/6`. It retains packed sources,
renders and verbose render logs as downloadable artifacts. The validator checks
the fresh outputs against their own manifest and enforces mesh and preview
budgets. The browser job opens all 22 scenes at desktop and mobile sizes,
checks keyboard controls and idle rendering, and exercises network, WebGL and
JavaScript fallbacks.

```sh
node scripts/build-site.mjs
node experiments/serve-master-plan.mjs _site
# In another terminal, with Playwright 1.59.1 installed:
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node experiments/verify-master-plan.mjs
```

`--update` captures candidate screenshot baselines; inspect them before committing.
Ordinary verification compares against the committed images. `--before` preserves the original website's
screenshots. Runtime scene diagnostics are disabled unless `?debugScene` is set.

On machines without enough browser memory, dispatch the Example app workflow on
the PR branch with `update_visual_baselines=true`. Its pinned Playwright container
runs the full verifier and uploads `master-plan-browser`, including the candidate
screenshots. Download and inspect those images, commit the reviewed baselines,
then require an ordinary PR run to pass without updating them.

The browser receives one flat-colored, single-draw-call mesh at a time, with
at most 60,000 triangles, 4 MB raw JSON and 600 KB gzip. Detailed leaves,
photogrammetry and fine architecture remain in the offline render. There is no
idle animation loop. The canvas caps device pixel ratio at 1.25 and width at
1600 pixels. Native PNG and Blender sources stay in the repository and link
from the website; only WebP previews and explicitly opened meshes are published
as runtime assets.

## Source assets and licenses

The original scene code follows this repository's [license](../../LICENSE).
Sapling is Blender's GPL tree generator; it is used as a tool and is not
redistributed here. The original presets in `trees.py` create the detailed
trees. All downloaded art assets are from Poly Haven under
[CC0](https://polyhaven.com/license):

- [Spruit sunrise](https://polyhaven.com/a/spruit_sunrise): outdoor HDR lighting.
- [Leafy grass](https://polyhaven.com/a/leafy_grass) and
  [forest ground 04](https://polyhaven.com/a/forest_ground_04): ground materials.
- [Fern 02](https://polyhaven.com/a/fern_02) and
  [mossy rock set 01](https://polyhaven.com/a/rock_moss_set_01): scanned detail.
- [Wood table 001](https://polyhaven.com/a/wood_table_001),
  [brown brick 02](https://polyhaven.com/a/brown_brick_02) and
  [rusty metal 02](https://polyhaven.com/a/rusty_metal_02): architectural materials.

`assets/manifest.json` records every source URL, license, byte count and SHA-256.
`validateSceneAssets()` verifies these committed files without network access.
`python3 experiments/fetch-lore-materials.py` can refresh the source download;
it checks the provider's checksums before recording the local SHA-256.

The stages use composition units, not engineering scale. Far spires represent
the tall Chord towers in the lore. “Two skies” renders two complete, separate
night environments into scene-linear EXR half-frames, then composes their native
split-screen still. Both scenes and their packed half-frames remain in the
Blender project; rerun the Python renderer to refresh the half-frames after
editing either world. The browser uses a lightweight paired study of the two
settings. Neither composition makes the distant planets adjacent in the story.
