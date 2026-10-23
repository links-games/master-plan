import { escapeHtml } from './site-markdown.mjs';
import { REPOSITORY } from './site-pages.mjs';

import { SCENES } from './lore-scenes.mjs';
export { SCENES } from './lore-scenes.mjs';

export function sceneViewer(scene, root = '') {
  const path = `${root}lore/scenes/${scene.id}`;
  return `<div class="scene-viewer" data-scene="${path}/scene.json">
<div class="scene-stage">
<img src="${path}/poster.webp" alt="${escapeHtml(scene.title)}: ${scene.world} environment rendered in Blender" width="1280" height="720" loading="lazy">
<canvas hidden tabindex="0" aria-label="${escapeHtml(scene.title)} interactive environment. Use left and right arrow keys to look around."></canvas>
<button class="button scene-open" type="button" data-open-scene hidden>Look around in 3D <span aria-hidden="true">↗</span></button>
</div>
<div class="scene-controls" hidden>
<button type="button" data-turn="-0.15" aria-label="Look left">←</button>
<button type="button" data-turn="0.15" aria-label="Look right">→</button>
<button type="button" data-close-scene>Return to rendered view</button>
</div>
<p class="scene-status" role="status">Rendered view.</p>
</div>`;
}

export function scenesBody() {
  return `<div class="page-intro"><p class="eyebrow">Places with a story</p>
<h1>Step into two worlds.</h1>
<p class="lead">Quiet meadows and white towers. Rusted rooftops and a light kept burning.</p>
<p>Visit all 22 pilot settings. Look around in 3D, then follow each place’s story.</p>
<div class="buttons"><a class="button" href="#raya">Raya</a><a class="button secondary" href="#shacados">Shacados · ages 10+</a><a class="button secondary" href="#contact">First Contact · ages 10–13+</a></div></div>
${[
  ['raya', 'Raya', 1, 10],
  ['shacados', 'Shacados', 11, 18],
  ['contact', 'First Contact', 19, 22],
]
  .map(
    ([id, title, first, last]) =>
      `<section id="${id}"><div class="section-head"><h2>${title}</h2><a href="lore/scenery-pilots.html">Read the pilots →</a></div>
<div class="scene-grid">${SCENES.filter(
        (s) => s.number >= first && s.number <= last
      )
        .map(
          (scene) =>
            `<article class="scene-card"><div class="scene-heading"><span class="eyebrow">Pilot ${String(scene.number).padStart(2, '0')} · Ages ${scene.ages}+</span><h3>${escapeHtml(scene.title)}</h3></div>
${sceneViewer(scene)}
<p><a href="lore/${scene.pilot.replace('.md', '.html')}">Setting, story and wisdom →</a> · <a href="${REPOSITORY}/blob/main/docs/master-plan/lore/scenes/${scene.id}/environment.blend?raw=true">Blender source</a></p></article>`
        )
        .join('\n')}</div></section>`
  )
  .join('\n')}
<p><a href="lore/scenes/index.html">Render settings, provenance and performance budgets</a></p>
<script src="assets/scenes.js" defer></script>`;
}
