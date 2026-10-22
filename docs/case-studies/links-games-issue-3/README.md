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
- [ ] Audit all catalog entries, art manifests, generated pages and website assets. Record a failing coverage test before changing the art pipeline.
- [ ] Complete multiple GPT concept-art styles for every unillustrated game, retaining the four-view convention and native image provenance; inspect outputs.
- [ ] Research missing popular mechanics with primary sources; add distinct, educational, nonviolent ideas with estimates, pages and complete art.
- [ ] Audit lore, conclusions, stories, pilot scenes, ages and physics against the latest maintainer vision; correct contradictions everywhere.
- [ ] Build realistic pilot environments in Blender and export lightweight website scenes from the same source; retain reproducible sources, render settings and outputs.
- [ ] Render and validate scenes in CI/CD, with bounded resource use and downloadable artifacts.
- [ ] Improve the website's immersion and presentation across home, explorer, game and lore pages; preserve filtering, sorting, static content, keyboard access and reduced-motion support.
- [ ] Capture browser screenshots before/after; verify artwork and 3D behavior on desktop and mobile, including fallback behavior. Commit final screenshots for the PR.
- [ ] Update all current catalog counts, generated docs, maintenance instructions and release changeset.
- [ ] Run focused tests followed by all local CI checks; preserve verbose logs under ci-logs/; inspect failures.
- [ ] Commit useful atomic steps and push only issue-3-15f93486408a.
- [ ] Fetch/merge latest main, inspect PR diff, refresh all PR feedback, title and description; retain Fixes #3.
- [ ] List recent CI runs with timestamps/SHA, download failing logs, resolve failures and verify the latest head passes.
- [ ] Verify clean working tree and mark PR #4 ready only after all requirements are verified.

## Initial findings

The catalog contains 300 games in 16 collections. 216 have four independently
generated GPT concept images; 84 (30 toddler, 22 preschool, 16 Raya life,
16 Shacados) have descriptions only. Art visibility is decided by a hardcoded
pending-family set in the documentation builder; the website only tests whether
a manifest exists. Loading-screen prompts exist but are not rendered assets.
The homepage uses an inline SVG landscape and no interactive scene exists.
No Blender rendering workflow exists.
