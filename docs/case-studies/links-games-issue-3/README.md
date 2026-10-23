# Issue #3 implementation and verification

[Issue #3](https://github.com/links-games/master-plan/issues/3) · [PR #4](https://github.com/links-games/master-plan/pull/4)

This case study is separate from `issue-3/`, which documents an unrelated
issue inherited from the upstream package template.

## Requirement inventory and work plan

The issue has no comments or required sub-issues. PR #4 initially has no
conversation comments, inline comments or reviews. PR #2 and issue #1 supply
the existing lore and catalog decisions; historical generation manifests and
research snapshots retain their original provenance.

- [x] Read issue #3 and all comments, PR #4 conversation, inline comments and reviews; study PR #2 and issue #1.
- [x] Audit all catalog entries, art manifests, generated pages and website assets. Record a failing coverage test before changing the art pipeline.
- [x] Complete multiple GPT concept-art styles for every unillustrated game, retaining the four-view convention and native image provenance; inspect outputs.
- [x] Research missing popular mechanics with primary sources; add distinct, educational, nonviolent ideas with estimates, pages and complete art.
- [x] Audit lore, conclusions, stories, pilot scenes, ages and physics against the latest maintainer vision; correct contradictions everywhere.
- [x] Build realistic pilot environments in Blender and export lightweight website scenes from the same source; retain reproducible sources, render settings and outputs.
- [x] Render and validate scenes in CI/CD, with bounded resource use and downloadable artifacts.
- [x] Improve the website's immersion and presentation across home, explorer, game and lore pages; preserve filtering, sorting, static content, keyboard access and reduced-motion support.
- [x] Capture browser screenshots before/after; verify artwork and 3D behavior on desktop and mobile, including fallback behavior. Commit final screenshots for the PR.
- [x] Update all current catalog counts, generated docs, maintenance instructions and release changeset.
- [x] Run focused tests followed by all local CI checks; preserve verbose logs under ci-logs/; inspect failures.
- [x] Commit useful atomic steps and push only issue-3-15f93486408a.
- [x] Fetch/merge latest main, inspect PR diff, refresh all PR feedback, title and description; retain Fixes #3.
- [x] List recent CI runs with timestamps/SHA, download failing logs, resolve failures and verify the latest head passes.
- [x] Verify clean working tree and mark PR #4 ready only after all requirements are verified.

## Requirement evidence map

| Requirement                                                         | Implementation                                                                                                                                                      | Verification                                                                                                                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Complete missing concept art and provide 2–3 styles for every game  | Four core views for all 310 games; storybook, painted anime and tactile 3D directions; two additional alternatives for each of the 216 previously illustrated games | `tests/game-concepts.test.js`, `tests/concept-prompts.test.js`, `tests/concept-review.test.js`; visual review and exact-prompt native encoding audit                          |
| Display the artwork on the website                                  | Asset-based visibility checks, linked core and alternative images, 32 responsive collection backgrounds                                                             | `tests/art-visibility.test.js`, `tests/site.test.js`; real-browser decoding of all 1,672 concept images                                                                       |
| Add missing popular game mechanics                                  | Ten researched additions, with original educational settings, estimates, algorithms and complete art                                                                | [Research and lore audit](research-and-lore.md); catalog, estimates and development-plan tests                                                                                |
| Keep conclusions and lore consistent throughout the repository      | Current canon, stories, pilot briefs, catalog descriptions, prompts and generated pages follow the maintainer's decisions; historical provenance remains labeled    | `tests/master-plan-docs.test.js`, `tests/game-concepts.test.js`, `tests/concept-prompts.test.js`; repository-wide contradiction searches                                      |
| Render realistic pilot and lore environments with open-source tools | All 22 pilots have Blender sources, CC0 asset attribution, native renders and lightweight exports from the same scene inputs                                        | `tests/lore-scenes.test.js`, `tests/lore-scene-source.test.js`; source/output hashes, license checks and inspection of all 22 final stills                                    |
| Reproduce rendering in CI/CD                                        | Six bounded CPU render batches, preserved logs and downloadable scene artifacts                                                                                     | [Lore rendering workflow](../../../.github/workflows/lore-environments.yml); every batch validates source hashes, outputs, image dimensions, readability and geometry budgets |
| Display efficient 3D scenes on the website                          | Opt-in WebGL, one draw call and one active context, bounded geometry and resolution, no idle render loop, static poster fallbacks                                   | Real-browser interaction with all 22 scenes on desktop and mobile; retry, cancellation, context loss, reopening, unavailable WebGL and disabled-JavaScript checks             |
| Improve immersion across the whole master-plan website              | Shared responsive navigation, typography, game cards, collection artwork, lore layouts and environment gallery                                                      | Committed before/after screenshots; desktop/mobile visual comparisons, overflow checks, filtering and URL-state regression checks                                             |
| Validate, document and retain the complete solution in one PR       | Maintenance instructions, reproducible experiment scripts, release changeset, regression tests and this evidence record                                             | Full local checks on Node, Bun and Deno; final-head CI, diff review, feedback refresh and clean working tree                                                                  |

## Initial findings

The catalog contains 300 games in 16 collections. 216 have four independently
generated GPT concept images; 84 (30 toddler, 22 preschool, 16 Raya life,
16 Shacados) have descriptions only. Art visibility is decided by a hardcoded
pending-family set in the documentation builder; the website only tests whether
a manifest exists. Loading-screen prompts exist but are not rendered assets.
The homepage uses an inline SVG landscape and no interactive scene exists.
No Blender rendering workflow exists.

## Reproduction and regression coverage

At the prepared revision, opening a Toddler, Preschool, Raya life or Shacados
game page shows four descriptions without concept images. The initial coverage
probe reported **336 missing core images across 84 games**. Its diagnostic log
is retained locally as `ci-logs/art-before.log`. The completed coverage probe is
[`experiments/issue-3-coverage.mjs`](../../../experiments/issue-3-coverage.mjs).

The filesystem regression in
[`tests/art-visibility.test.js`](../../../tests/art-visibility.test.js) creates
temporary manifests and assets. A manifest alone, an incomplete image set or a
missing thumbnail must never expose broken artwork links. Complete assets can
become visible in any collection, and adding style alternatives must preserve
the original core images.

The consistency review also found that toddler pages inherited the generic
prototype requirement to explain a lesson and restart without help. The new
regression in `tests/game-concepts.test.js` first failed against that guidance,
then passed on Node, Bun and Deno after all 30 toddler pages were corrected.
Toddler acceptance now observes recognition or purposeful action during
caregiver co-play, without requiring reading or speech. The template provides
large tap targets, an alternative before dragging, unlimited repetition and no
score or fail state. The
[`isolated page refresher`](../../../experiments/refresh-concept-pages.mjs)
rebuilds selected pages without rewriting prompt jobs used by an active image
generation batch.

The website asset-copy regression in
[`tests/site-assets.test.js`](../../../tests/site-assets.test.js) reproduced
temporary encodings and offline source files leaking into the published asset
tree. Publication now allows finished concept WebP files, scene WebP previews
and scene JSON metadata. Both fixture tests pass on Node, Bun and Deno.
The built-output audit in
[`experiments/audit-website-links.mjs`](../../../experiments/audit-website-links.mjs)
also checks local links, fragments, responsive picture sources and lazy scene
geometry against the published files. The browser CI job runs it before
opening the website.

The static scene fallback previously instructed visitors to open a scene even
when JavaScript was disabled and its controls were hidden. A failing document
test now verifies the neutral fallback caption. Real-browser checks confirm
all 22 static captions, hidden inactive controls and decoded previews; with
JavaScript enabled, all 22 controls retain their interaction instructions.
The [before](../../screenshots/issue-3/static-fallback-before.png) and
[after](../../screenshots/issue-3/static-fallback-after.png) screenshots preserve
the same scene card with JavaScript disabled.

An interrupted tool session also exposed two zero-byte encodings that existed
on disk without complete manifest entries. The bounded regression
[`experiments/test-save-concept-art.py`](../../../experiments/test-save-concept-art.py)
reproduces the failure by interrupting the encoder after its first write. It
fails against direct publication and passes with temporary-file encoding and
atomic publication. The first native-render CI batch runs this regression.
[`experiments/recover-concept-art.py`](../../../experiments/recover-concept-art.py)
recovers incomplete deliveries by matching full prompts to native generation
records, while preserving valid reviewed replacements.

[`tests/game-concepts.test.js`](../../../tests/game-concepts.test.js) checks
every generated page, native image dimensions, exact prompts, hashes and unique
compositions. The real-browser verifier opens every game page and decodes each
required concept, in addition to its desktop/mobile, filtering and scene tests.

Final regeneration exposed missing generation-prompt links after art became
visible. The extended catalog regression first failed on that loss. Every
illustrated page now retains the core prompt link and stable view IDs; the
216 games with extra styles also link directly to their style-generation jobs.

The additional
[`native encoding audit`](../../../experiments/audit-native-concept-art.py)
checks new deliveries against their exact-prompt generation records. It
re-encodes one native output at a time and requires byte-identical WebP output,
recording native-source, prompt and delivered-file hashes. This supplements
visual review and catches incorrect image-to-prompt associations.

The final evidence publisher,
[`finalize-concept-review.mjs`](../../../experiments/finalize-concept-review.mjs),
requires current visual-review hashes and exact-prompt native-encoding hashes
for all 808 added concept images and 32 loading backgrounds. It also verifies
that the original concept images and thumbnails are unchanged from the prepared
baseline, together with all 864 original generation prompts. Its initial run
correctly refused publication at the first unfinished
style alternative; incomplete batches cannot produce a completed review record.
[`tests/concept-review.test.js`](../../../tests/concept-review.test.js) then
checks that every published review still matches its delivered file and prompt,
with independent native generation IDs and recorded native dimensions.

## Render review corrections

Initial native renders exposed shelters above uneven ground, sparse salvage,
unreadable night settings and raised edges on the river surface. Corrections
ground each shelter on its complete footprint, carve continuous river banks,
increase offline terrain detail, add weathered construction and salvage heaps,
and make night lighting readable. Scanned rock silhouettes, station engineering
and furnished school desks replace the corresponding simple draft forms.
Browser geometry retains bounded proxies for the offline detail.

The final pilot uses independently rendered environments in a split frame,
with both worlds at night, rather than two miniature stages in its native still.
Its source-data regression test preserves the two settings. A CI render caught
Blender purging an unlinked half-frame while constructing the second scene;
loading and linking both frames after setup fixes that failure. Each fresh
render must also pass a luminance floor, which supplements visual inspection
without claiming to measure artistic quality.

The saved [river before image](../../screenshots/issue-3/river-before.png) and
[scrap-dune before image](../../screenshots/issue-3/scrap-before.png) preserve the
problem states. Final renders and source hashes are reviewed together; an
earlier passing render does not validate a later source revision.

The corresponding final [river](../../master-plan/lore/scenes/03-first-ride-on-the-chord/poster.png),
[scrap dunes](../../master-plan/lore/scenes/12-the-scrap-dunes/poster.png) and
[radio roof](../../master-plan/lore/scenes/16-the-radio-roof/poster.png) retain
their native render dimensions. All 22 final stills were inspected, including
night readability, grounded buildings, scanned rocks and the two-world split.
The [review record](data/native-render-review.json) identifies the exact
reviewed files by SHA-256.

The [six successful render batches](https://github.com/links-games/master-plan/actions/runs/39841118927)
used source commit `afb68c01d004dd6cc21c32a94ff30279db8f0e51`.
The imported files pass the same source, output, license and performance checks
locally. Their measured maximums are 29,832 triangles, 3,248,211 bytes of raw
geometry, 326,374 gzip bytes and 325,554 bytes for a WebP preview. Five focused
source and render tests pass. These checks validate provenance and budgets;
the recorded visual inspection covers the artistic review.

The [fresh six-batch run on the complete feature commit](https://github.com/links-games/master-plan/actions/runs/39879553145)
also passes with those same frozen rendering inputs.

CI subsequently caught formatting differences in all 22 imported manifests.
The importer now applies the repository's JSON formatter after validating the
fresh render set. Source, output and license validation pass after import;
formatting preserves every manifest value and every rendered asset hash.

The browser workflow compares committed desktop and mobile screenshots during
normal checks. Its manual candidate-capture mode is isolated from the existing
preview job that writes to `main`. A regression first reproduced that unwanted
trigger, then verified that candidate capture skips the writer while ordinary
manual preview runs and pushes to `main` retain their existing behavior. The
workflow status gate includes the new browser job.

## Local validation

The complete test suites pass on Node.js 24.22.1 (907 tests), Bun 1.4.3
(907 tests) and Deno 2.9.7 (904 tests, three existing compatibility skips).
Deno's skips cover its relative bin-symlink imports and two command-stream
CDN cases that use unsupported `createRequire`; no new tests are skipped.
The Node run uses `--test-concurrency=1`, Bun uses `--max-concurrency 1`,
and Deno uses `DENO_JOBS=1` to respect the shared container memory limit.

`NODE_OPTIONS=--max-old-space-size=256 npm run check` passes lint, repository-wide
formatting and duplication checks (8.27%, below the existing 10% threshold).
The memory-bounded wrapper preserves a 128 MB resident-memory reserve and imposes
no elapsed-time deadline. An initial unrestricted lint run reached that reserve;
the smaller heap completed successfully. Existing warnings on unchanged lines
remain handled by the repository's normal lint policy.

A later full-check repeat for the screenshot follow-up also reached the reserve.
The follow-up's focused lint, formatting and documentation checks pass locally.
The [complete feature commit's nine-job runtime/platform matrix](https://github.com/links-games/master-plan/actions/runs/39879553247)
passes on CI's larger runners. The existing incremental detector reuses that
result for the screenshot follow-up, which changes only screenshots, case-study
notes and experiment scripts. Browser verification still executes the updated
experiment and compares all ten screenshots. Resource stops remain recorded as
incomplete local repeats, not passing test runs.

The final website build contains 353 HTML pages for 310 games. The output audit
resolves all 11,731 local links, fragments, image sources and lazy mesh references.
Required documentation, line limits, syntax, package-version and minor-changeset
guards also pass. The full real-browser capture and final-head CI checks are
tracked separately in the work plan above.

## Browser verification and final review

The [complete browser capture](https://github.com/links-games/master-plan/actions/runs/39879554642)
at `0c67f2e024ed1712e4b21227dfde94c2a014f8a9` passed. It decoded all 1,672
concept images across all 310 game pages, opened and rotated every environment
on desktop and mobile, and verified filtering, URL state, keyboard focus,
closing/reopening, failed downloads, cancellation, context loss, idle rendering,
the device-pixel-ratio cap, unavailable WebGL and disabled JavaScript.
All ten candidate screenshots were downloaded and visually inspected before
being committed as regression baselines. The ordinary run at the same head
correctly rejected the missing home baseline; its preserved log identifies
the missing file at line 287. Reviewed captures supply those required files.

The [ordinary comparison run on the committed baselines](https://github.com/links-games/master-plan/actions/runs/39881058488)
passes at `d804aafe9ac878c36a2aa9f46cfcb07a033b6c3f`: all ten screenshots have
0.00% differing pixels. Its full interaction, artwork and desktop/mobile
embedded-layout checks also pass. The generated website again resolves all
11,731 local references across 353 pages.

The focused [embedded-pilot layout probe](../../../experiments/verify-pilot-layout.mjs)
also confirms that every preview aligns with its 16:9 stage without horizontal
overflow at both viewport sizes. Document-image margins collapse outside the
stages, so their computed values do not indicate a layout error. The full
browser verifier now checks the actual rectangles on every run.
The [desktop](../../screenshots/issue-3/pilot-layout-desktop.png) and
[mobile](../../screenshots/issue-3/pilot-layout-mobile.png) captures show this
separate document layout.

GitHub's unified PR-diff endpoint rejects this change because it exceeds
300 files. Final review therefore uses the complete paginated changed-files
API plus a local diff against the merge base. All 1,834 remote file blob hashes
matched the reviewed local revision before the screenshot follow-up. The same
comparison also matched all 1,844 files after the follow-up. Generated
catalog pages and assets additionally pass their content, provenance and
coverage guards; source, tests, workflows and documentation are reviewed as
separate patches. The original 300 game IDs, original concept images,
thumbnails and generation prompts are preserved.

All six workflows passed at `d804aafe9ac878c36a2aa9f46cfcb07a033b6c3f`,
including the [fresh six-batch render](https://github.com/links-games/master-plan/actions/runs/39881058496)
and ordinary browser comparison. The latest `main` was already an ancestor,
all issue and review feedback was refreshed, and the working tree was clean
before PR #4 was marked ready. This final evidence-only update records those
observations; the PR's live checks identify validation of later revisions.

## Default-branch CI investigation

The baseline checks run [39787810966](https://github.com/links-games/master-plan/actions/runs/39787810966)
failed on the Windows/Bun release fixture. The preserved log records its
20-second child-process deadline and `SIGTERM` at lines 11912–11913, followed by
an `EBUSY` cleanup error at line 12011. The trace stops at the npm formatter
subprocess; eight other runtime/platform combinations passed. The same fixture
passes in the PR's [fresh nine-job runtime/platform matrix](https://github.com/links-games/master-plan/actions/runs/39869875707),
without increasing its deadline or removing its assertions.

The baseline release preflight also reports the required npm trusted-publisher
or bootstrap-token configuration explicitly at lines 158–159. Baseline
[security run 39787811125](https://github.com/links-games/master-plan/actions/runs/39787811125)
reports at line 151 that a repository administrator must enable the dependency
graph. Existing guards preserve these actionable failures on `main` while
allowing credential-free PR verification. The PR's release and security checks
pass; no repository-admin setting is required to review this change.
