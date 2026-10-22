# Simulation Engine — From 2D Vector Games to a Real-World Simulator

Covers requirements **R43, R44, R45, R46, R47, R48, R49** (see the
[requirements](../case-studies/issue-1/requirements.md#requirements-from-the-pr-2-feedback)).
Versions, licenses, benchmarks and sources for every engine, paper and
library named here are in
[research-physics-simulation.md](../case-studies/issue-1/data/research-physics-simulation.md)
(snapshot 2026-10-15).

From the maintainer's
[PR #2 comment](https://github.com/links-games/master-plan/pull/2#issuecomment-6189666260):

> We should prefer physics simulations engines that are both highly
> accurate and highly efficient, we can start from 2D vector graphics
> games, and go with 3D vector graphics games. … we should support level of
> detail for different devices … we should strive to ultimately fully
> realistic or exactly real game engine simulator … Our 3D engine should
> come from physical properties … We can use one single universal formula,
> which should be GPU accelerated when possible, yet we should use our tech
> stack like relative-meta-logic to infer simplified yet realistic laws for
> computation of different scales.

## Goal and honesty

The goal is that our last games are **accurate physical simulators**: what
happens in the game would happen in the real world with the same inputs,
while running on a phone. "Exactly real" is a direction, not a claim — every
simulator says which laws it uses, at which scale, with which measured
error ([validation](#validation)). Anime style stays, as an artistic layer
on top of physically correct light and motion
([rendering](#rendering-from-physical-properties)).

## Principles

1. **Accurate and efficient together** (R43). We prefer methods that keep
   the physics right when the time step is large: implicit or
   position-based solvers, symplectic and variational integrators that
   conserve energy and momentum over long runs, and deterministic fixed
   time steps so a replay or a multiplayer game gives the same result
   everywhere.
2. **Physical properties are the source of truth** (R47). Objects are
   described by mass, density, elasticity, friction, optical properties
   (albedo, roughness, index of refraction) and temperature. Motion,
   sound and looks are computed from them, not drawn separately.
3. **One model, many levels of detail** (R45). Every device runs the same
   model; low-end devices get fewer particles, larger steps and simpler
   shading, but the same conserved quantities and the same rules.
4. **One law, many scales** (R48). The engine is organized around one
   general principle and derives cheaper, scale-specific laws from it,
   choosing at run time the simplest law that is accurate enough
   ([universal formula](#one-universal-formula-and-laws-per-scale)).
5. **Checked like code.** Every physical claim has a test, the way the
   [First Contact pilot](lore/first-contact.md#physics-check-of-the-pilot)
   is checked by `tests/first-contact-physics.test.js`.

## Path: 2D vector → 3D vector → realistic

The engine grows with the games on the
[complexity ladder](game-ideas.md#complexity-ladder) (R40, R44). Each
step is shipped as games before the next one starts.

| Step | Graphics                                                                                     | Physics                                                                               | Example games                                    |
| ---- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1    | **2D vector**: SVG and Rive characters, resolution-independent, tiny downloads               | none or scripted tweens                                                               | Pair Friends, Bead Merge, Link It!               |
| 2    | 2D vector on canvas/WebGL (PixiJS), GPU vector rendering (Vello-style compute) as it matures | 2D rigid bodies (Box2D v3 / Rapier 2D), ropes, joints                                 | Acorn Tower, Rope Friends, Seed Sling, Mini Golf |
| 3    | 2D vector with physically based light (normal maps from vector shapes, soft shadows)         | 2D particles: XPBD soft bodies, fluids, sand (MPM / unified particles)                | Sand and Water, Density Tank, Weather Maker      |
| 4    | **3D vector**: low-poly and SDF shapes, toon-shaded, glTF 2.0                                | 3D rigid bodies (Rapier 3D, Jolt), vehicles, cloth                                    | Explore Omi, Kart Friends, Block World           |
| 5    | 3D with PBR materials from measured data, toon/anime shading on top                          | GPU particles and continua (XPBD, MPM) in WebGPU compute                              | Bridge Builder 3D, Sailing, Mars Habitat         |
| 6    | Scientific visualization at real scale                                                       | Validated domain solvers: orbital mechanics, relativity, circuits, climate, epidemics | Orbit Garden, Rocket Builder, Relativity Ride    |
| 7    | **Realistic multi-genre simulator**                                                          | All solvers coupled across scales, chosen per scale by the law selector               | [First Contact](lore/first-contact.md)           |

"Vector" means geometry described by math (curves, signed distance
functions, meshes from primitives), not by fixed-size bitmaps. It is what
makes the same art sharp on a watch and on a 4K TV, and it keeps downloads
small. 3D vector art uses the same primitive shapes as the
[3D style sheet](lore/characters.md#3d) (sphere, rounded cube, cone).

## Engines and libraries (reuse first)

We do not write a physics engine where a permissively licensed, accurate
and fast one exists. Defaults, chosen in the
[physics research note](../case-studies/issue-1/data/research-physics-simulation.md#9-recommendation-for-links-games)
(versions, sizes and licenses checked on 2026-10-15) and to be confirmed by
our own benchmarks:

| Need                      | Default                                                       | Alternatives                                                                                                                                           | Why                                                                                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2D rigid bodies           | **Box2D v3** via `box2d3-wasm` (MIT, about 417 KB WASM)       | Rapier 2D deterministic build (Apache-2.0, about 2.4 MB) when snapshots, rollback or netcode matter; Planck.js where WASM is unwanted                  | Soft-step solver with sub-stepping and continuous collision, cross-platform determinism claimed since v3.1. Matter.js is not used for realistic games: it has no continuous collision ([matter-js#5](https://github.com/liabru/matter-js/issues/5)). |
| 3D rigid bodies           | **Rapier 3D** (deterministic build)                           | Jolt Physics (MIT, WASM build, double precision for large worlds), PhysX 5 (BSD-3, CPU only in WASM), Havok via Babylon.js (MIT binary, closed source) | Documented cross-platform determinism in WASM; already planned in `render-three`.                                                                                                                                                                    |
| Soft bodies, cloth, ropes | **XPBD** with small steps (own solver in `@links-games/sim`)  | Rapier joints, Jolt soft bodies                                                                                                                        | Stable at large steps, simple, GPU-friendly; easy to explain to players. NVIDIA FleX is not used (non-permissive license); we implement the published methods instead.                                                                               |
| Fluids, sand, snow, mud   | **MLS-MPM** and unified particles on WebGPU compute, 2D first | SPH, lattice Boltzmann                                                                                                                                 | One method for many materials; proven in film and research.                                                                                                                                                                                          |
| Robotics-grade accuracy   | **MuJoCo** (Apache-2.0) for reference runs                    | Newton, Warp, Genesis, Taichi (offline only, desktop GPU)                                                                                              | Used to validate our faster solvers, not shipped in small games; its JS bindings are still marked work in progress.                                                                                                                                  |
| Orbits and space          | Symplectic / variational integrators (own, small)             | REBOUND-style integrators                                                                                                                              | Energy does not drift over millions of steps.                                                                                                                                                                                                        |
| Relativity                | Own module (Lorentz factor, velocity addition, light delay)   | —                                                                                                                                                      | Already prototyped in [`examples/first-contact-physics.mjs`](../../examples/first-contact-physics.mjs).                                                                                                                                              |
| GPU compute               | **WebGPU** (compute shaders, WGSL)                            | WebAssembly CPU path (required)                                                                                                                        | About 87.8% of users have WebGPU ([caniuse](https://caniuse.com/webgpu)); Chrome, Edge and Safari 26 ship it, Firefox only on Windows and macOS. WebGL 2 has no compute shaders, so every GPU kernel needs a CPU reference.                          |
| 2D vector rendering       | SVG, Rive, PixiJS v8, MSDF text                               | dotLottie; Vello (its GPU compute renderer is still experimental)                                                                                      | Rive and SVG are already the character formats.                                                                                                                                                                                                      |
| 3D rendering              | three.js `WebGPURenderer` + R3F                               | Babylon.js                                                                                                                                             | Already planned in `render-three`; it falls back to WebGL 2 automatically, and TSL shaders compile to both WGSL and GLSL.                                                                                                                            |

## Determinism and fidelity levels

Two rules follow from the research:

- **The CPU result is the truth.** GPU floats are not bit-identical
  across vendors, so GPU physics never drives state that must be the same
  on every device (saves, replays, multiplayer). It drives effects such as
  particles, cloth and water that can differ slightly. Gameplay physics runs
  at a fixed 60 Hz step on the CPU, and CI compares state hashes
  ([determinism](../case-studies/issue-1/data/research-physics-simulation.md#7-determinism-and-reproducibility)).
- **Every game declares its fidelity level.** "Realistic" is a claim that
  needs evidence, so each game states one level in its `GAME.md`:

| Level | Name                      | Model                                                    | Evidence required                                           |
| ----- | ------------------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| L0    | Kinematic / arcade        | Scripted motion, no solver                               | None                                                        |
| L1    | Rigid-body impulse        | Box2D, Rapier or Jolt at a fixed 60 Hz, SI units         | Determinism hash test in CI                                 |
| L2    | Substepped constraints    | Box2D v3 soft step or XPBD; measured friction and bounce | Matches simple recorded real experiments within a tolerance |
| L3    | Continuum materials       | MPM, SPH or lattice Boltzmann; physical light units      | Matches an offline reference (MuJoCo, Mitsuba)              |
| L4    | Reproducible in real life | L2/L3 plus per-scale laws checked against measurements   | Published dataset and error bars                            |

Most small games are L0–L2; the realistic simulators of the
[simulation track](roadmap.md#simulation-track) aim at L3–L4. The levels
come from the [fidelity ladder](../case-studies/issue-1/data/research-physics-simulation.md#92-physics-fidelity-ladder) in the
research note.

## Level of detail and every screen

R45 asks that every game works **on all screen sizes and at any quality**.
LOD covers three things, not only meshes:

| LOD of …   | Low tier (old phone, slow network)            | Mid tier                          | High tier (desktop, new phone)                         |
| ---------- | --------------------------------------------- | --------------------------------- | ------------------------------------------------------ |
| Geometry   | Flat vector shapes, impostors, few triangles  | Simplified meshes (meshoptimizer) | Full meshes, tessellated SDF detail                    |
| Shading    | Flat colors and one shadow tone (chibi style) | Toon shading with outlines        | PBR + toon, soft shadows, global illumination          |
| Simulation | Fewer particles, larger steps, CPU or WASM    | GPU compute, medium resolution    | GPU compute, fine resolution, more substeps            |
| Audio      | Few voices                                    | Mixed                             | Physically modeled sounds (from impacts and materials) |

Rules:

1. **Device tiers are measured, not guessed**: on the first start
   `game-core` runs a one-second benchmark (frame time, WebGPU support,
   memory) and picks the tier; the player can change it in settings.
2. **Dynamic LOD**: if frames drop, the tier steps down for that scene.
3. **Same rules at every tier**: LOD changes resolution, never the laws.
   Conserved quantities (mass, energy, momentum) are tested at every tier,
   so a low-end player gets the same game, not an easier one.
4. **Every screen**: layouts are responsive from 320 px phones to 4K and
   foldables; vector art and UI scale without new assets; Playwright
   visual tests cover phone, tablet and desktop viewports
   ([quality gates](infrastructure.md#6-quality-gates)).

## Rendering from physical properties

R46 and R47 ask for realism that comes from physics while keeping the
anime look. The approach that does both:

1. **Physical light first.** Materials have measured physical parameters
   (base color/albedo, metalness, roughness, index of refraction,
   subsurface scattering), following the glTF 2.0 PBR model so assets work
   in every tool. Light is computed in physical units.
2. **Style as a final transfer.** Toon and anime looks are a mapping
   applied to the physically correct result — quantized light bands,
   outlines from geometry, color ramps from the [style sheets](lore/characters.md#style-sheets).
   The physics is the same in every style; only the last step differs, so
   the same scene can be shown chibi, anime or realistic.
3. **Characters from anatomy.** Hosts and creatures have plausible
   skeletons, masses and muscles, so motion comes from simulation and
   motion data instead of hand-drawn timing; squash and stretch remains an
   artistic layer.

**On "decoding exact DNA conditions to reproduce real anime-like
characters"** (from the comment): today nobody can compute a body from a
genome, and designing living beings is outside what a game organization
should do. We record it as a **long-term thought experiment only**: our
part is to keep characters **biomechanically plausible** (real proportions
that could stand, move and breathe) and to teach how genes, development and
environment shape living things. Any step beyond education needs a separate
ethics review.

## One universal formula and laws per scale

R48 asks for "one single universal formula, GPU accelerated when
possible" and for using
[relative-meta-logic](https://github.com/link-foundation/relative-meta-logic)
to infer "simplified yet realistic laws for computation of different
scales". Our proposal:

1. **The universal formula is the principle of stationary action.** Almost
   all of classical physics (mechanics, elasticity, fields, orbits) follows
   from one statement: a system moves so that its action (the time integral
   of kinetic minus potential energy, the Lagrangian) is stationary.
   **Variational integrators** discretize that one statement directly, and
   they keep momentum and energy well behaved; XPBD and many constraint
   solvers can be read the same way. So one GPU kernel family — "minimize
   the discrete action subject to constraints" — can drive particles, rigid
   bodies, cloth, fluids (as particles) and orbits.
2. **Laws per scale are approximations with a known validity domain.**
   Examples: Newtonian motion is relativity with `v ≪ c` (error about
   `v²/2c²`, 5 × 10⁻⁵ at 1% of _c_); rigid bodies are elastic bodies with
   stiffness → ∞; continuum fluids are particles at large numbers; orbits
   are N-body gravity with distant bodies merged. Each law is stored as
   data with its assumptions and error bounds.
3. **relative-meta-logic chooses and justifies the law.** RML is a
   probabilistic, many-valued logic on Links Notation with decimal
   arithmetic, dependent types and proof export (Lean, Rocq, Isabelle). It
   has **no physics today** (checked at commit `c5513f2`), so this is a
   research track, not a dependency: encode laws, assumptions and error
   bounds as LiNo links; let RML infer, for the current state (speeds,
   sizes, densities, requested accuracy), which simplified law is valid
   and how confident we are; export the inference so it can be checked in a
   proof assistant.
4. **Discover simpler laws from fine simulations.** Where no textbook
   approximation exists, run the fine model, fit a cheaper law (symbolic
   regression such as PySR, sparse identification such as SINDy, or
   reduced-order models), and keep it only if RML can state
   its validity domain and tests confirm the error bound.
5. **GPU when possible.** The kernels run as WebGPU compute shaders, with a
   WebAssembly CPU fallback that produces the same results within
   tolerance.

The first concrete step is small: a `@links-games/sim` package with
deterministic fixed-step XPBD and a symplectic orbit integrator, plus a
LiNo file of laws with validity domains (Newtonian vs relativistic speed,
point mass vs extended body) and one RML example that picks between them.

## Validation

Every simulator module ships with:

- **Analytic tests**: projectile range, pendulum period, Kepler orbits,
  elastic collisions — closed-form answers compared in CI.
- **Conservation tests**: energy, momentum and mass drift over long runs,
  at every LOD tier.
- **Real data**: comparisons with published measurements, for example
  planetary positions from NASA JPL Horizons, material constants from
  standard tables, and recorded experiments.
- **Reference engines**: our fast solvers are compared with an accurate
  reference (MuJoCo, Box2D, higher-resolution runs of our own solver).
- **A written error budget** in each simulator's `GAME.md`: what is exact,
  what is approximated, and how large the error is.

## Education and science (R49)

Each step of the engine is also a lesson. The sandbox games let players
change one physical parameter and see the law at work; the simulators show
their equations and validity domains in an optional "how it works" view for
older tiers; and the code and data are public domain, so teachers,
students and researchers can reuse them. Games that can answer real
research questions get citizen-science modes
([game ideas](game-ideas.md#games-that-advance-science)).

## Packages and repositories

| Package or repository        | What it holds                                                                | First needed at |
| ---------------------------- | ---------------------------------------------------------------------------- | --------------- |
| `@links-games/sim`           | Fixed-step loop, XPBD, symplectic integrators, units, conservation checks    | Cx 3            |
| `@links-games/sim-gpu`       | WebGPU compute kernels (particles, MPM), CPU/WASM fallback                   | Cx 5            |
| `@links-games/lod`           | Device-tier benchmark, dynamic LOD, quality settings UI                      | Cx 3            |
| `@links-games/laws`          | LiNo library of physical laws with validity domains; RML-based law selection | Cx 6            |
| `links-games/simulation-lab` | Research repository: benchmarks, reference comparisons, RML experiments      | Cx 5            |

These are added to the [repository map](infrastructure.md#1-repository-map)
and the [roadmap](roadmap.md#simulation-track).
