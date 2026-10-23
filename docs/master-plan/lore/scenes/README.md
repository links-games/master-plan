# Rendered pilot environments

[Scenery pilots](../scenery-pilots.md) · [Sources and licenses](../../../../examples/lore-scenes/README.md)

All 22 pilot settings have a Blender Cycles environment, a native 1280 × 720
render and a low-detail mesh exported from the same scene. The stills are
lighting and environment studies. Characters, dialogue and animated story beats
remain in the linked pilot briefs; these backgrounds do not depict completed
films. “Two skies” combines two separately rendered night environments in a
split frame. Its packed Blender project retains both complete scenes; the
browser uses a lightweight paired study of these distant worlds.

The website starts with the rendered image. **Look around in 3D** loads one
bounded mesh. Arrow keys or the visible buttons rotate the view. Closing it,
changing scenes or leaving the page releases GPU resources. Failed requests
and unavailable or lost WebGL contexts retain the image. The complete rendered
gallery remains readable with JavaScript disabled.

## Gallery

Each scene directory contains `poster.webp`, the native `poster.png`, a packed
`environment.blend`, browser geometry in `scene.json` and `manifest.json`.

| Pilot                                        | World · minimum age     | Render                                                       | Blender source                                                         |
| -------------------------------------------- | ----------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1. The clover meadow                         | Raya · 1+               | [View](01-the-clover-meadow/poster.webp)                     | [Download](01-the-clover-meadow/environment.blend)                     |
| 2. The apple at dawn                         | Raya · 3+               | [View](02-the-apple-at-dawn/poster.webp)                     | [Download](02-the-apple-at-dawn/environment.blend)                     |
| 3. First ride on the Chord                   | Raya · 6+               | [View](03-first-ride-on-the-chord/poster.webp)               | [Download](03-first-ride-on-the-chord/environment.blend)               |
| 4. The double eclipse                        | Raya · 3+               | [View](04-the-double-eclipse/poster.webp)                    | [Download](04-the-double-eclipse/environment.blend)                    |
| 5. The arm that stopped                      | Raya · 6+               | [View](05-the-arm-that-stopped/poster.webp)                  | [Download](05-the-arm-that-stopped/environment.blend)                  |
| 6. A tower grows                             | Raya · 6+               | [View](06-a-tower-grows/poster.webp)                         | [Download](06-a-tower-grows/environment.blend)                         |
| 7. The tower song                            | Raya · 3+               | [View](07-the-tower-song/poster.webp)                        | [Download](07-the-tower-song/environment.blend)                        |
| 8. Rain in the delta                         | Raya · 3+               | [View](08-rain-in-the-delta/poster.webp)                     | [Download](08-rain-in-the-delta/environment.blend)                     |
| 9. The wall without the Guard                | Raya · 10+              | [View](09-the-wall-without-the-guard/poster.webp)            | [Download](09-the-wall-without-the-guard/environment.blend)            |
| 10. Why is Professor Acorn old?              | Raya · 6+               | [View](10-why-is-professor-acorn-old/poster.webp)            | [Download](10-why-is-professor-acorn-old/environment.blend)            |
| 11. Ration line at dawn                      | Shacados · 10+          | [View](11-ration-line-at-dawn/poster.webp)                   | [Download](11-ration-line-at-dawn/environment.blend)                   |
| 12. The scrap dunes                          | Shacados · 10+          | [View](12-the-scrap-dunes/poster.webp)                       | [Download](12-the-scrap-dunes/environment.blend)                       |
| 13. The ice town                             | Shacados · 10+          | [View](13-the-ice-town/poster.webp)                          | [Download](13-the-ice-town/environment.blend)                          |
| 14. Launch day                               | Shacados · 13+          | [View](14-launch-day/poster.webp)                            | [Download](14-launch-day/environment.blend)                            |
| 15. The Last Woods                           | Shacados · 10+          | [View](15-the-last-woods/poster.webp)                        | [Download](15-the-last-woods/environment.blend)                        |
| 16. The radio roof                           | Shacados · 10+          | [View](16-the-radio-roof/poster.webp)                        | [Download](16-the-radio-roof/environment.blend)                        |
| 17. The night school                         | Shacados · 10+          | [View](17-the-night-school/poster.webp)                      | [Download](17-the-night-school/environment.blend)                      |
| 18. Three dead radios                        | Shacados · 10+          | [View](18-three-dead-radios/poster.webp)                     | [Download](18-three-dead-radios/environment.blend)                     |
| 19. Fifty seconds — the station's side       | Raya · 13+              | [View](19-fifty-seconds-the-stations-side/poster.webp)       | [Download](19-fifty-seconds-the-stations-side/environment.blend)       |
| 20. Fifty seconds — the tracking room's side | Shacados · 13+          | [View](20-fifty-seconds-the-tracking-rooms-side/poster.webp) | [Download](20-fifty-seconds-the-tracking-rooms-side/environment.blend) |
| 21. The first answer                         | Shacados · 10+          | [View](21-the-first-answer/poster.webp)                      | [Download](21-the-first-answer/environment.blend)                      |
| 22. Two skies                                | Raya and Shacados · 10+ | [View](22-two-skies/poster.webp)                             | [Download](22-two-skies/environment.blend)                             |

## Rendering and provenance

The committed outputs use the official Blender 4.0.2 build, Cycles CPU,
OpenImageDenoise, 64 samples, two render threads and a 1280 × 720 frame.
Sapling supplies detailed tree geometry; vendored CC0 photogrammetry, materials
and HDR lighting supply surface detail. Every scene has its own fixed seed
and pilot-specific setting. No proprietary renderer, paid library, network
request or image-generation service runs during rendering.

See the [source instructions](../../../../examples/lore-scenes/README.md) for
installation, reproduction, bounded previews, asset licenses and CI batches.
Each manifest records the actual renderer settings, triangle count, byte length
and SHA-256 of every output. Renderer versions can produce different pixels;
CI validates fresh artifacts against their own manifests.

```sh
bash experiments/install-lore-blender.sh /tmp/master-plan-blender
/tmp/master-plan-blender/blender --background --factory-startup --threads 2 --python examples/lore-scenes/render.py -- --all
/usr/bin/python3 experiments/encode-lore-scenes.py
node scripts/validate-scenes.mjs
```

## Browser budgets

- At most 60,000 triangles, 4 MB raw geometry and 600 KB gzip per scene.
- At most 500 KB per WebP preview. PNGs and packed Blender files stay in the
  repository; the website downloads previews and explicitly opened meshes.
- One active scene, one draw call, no textures or external runtime dependency.
- Input-driven rendering with no idle animation loop, device pixel ratio capped
  at 1.25 and canvas width capped at 1600 pixels.
- A 15-second request deadline, cancellation when another scene opens, complete
  GPU cleanup and static fallback support slower devices.

The meshes use composition units rather than engineering scale. Distant spires
represent the much taller Chord towers in the lore; this simplification does
not change their fictional dimensions. Fine plants, scanned rocks and detailed
architecture remain in the offline render and use simple browser proxies.

The Lore environments workflow renders every pilot in six CPU batches, validates
fresh manifests and budgets, and uploads sources, renders and logs. The Example
app workflow's browser job checks all 22 scenes, desktop and mobile screenshots, keyboard controls,
idle rendering, cancelled loads, context loss and static fallback. Diagnostics
are off by default; `?debugScene` enables frame counters for investigations.
