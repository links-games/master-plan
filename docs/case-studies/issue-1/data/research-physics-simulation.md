# Research: Physics simulation, physically based rendering and LOD for links-games

Research date: 2026-10-15. Context: [links-games/master-plan#1](https://github.com/links-games/master-plan/issues/1).

This note backs the maintainer's PR #2 direction (paraphrased from the PR comment):

> Prefer physics engines that are both highly accurate and efficient. Start with 2D vector games, then 3D.
> Support level of detail for all screen sizes and devices. Strive toward fully realistic simulation that is
> reproducible in real life. The 3D engine should come from physical properties, not artistic vision. Aim for
> "one single universal formula", GPU accelerated when possible, and use relative-meta-logic to infer simplified
> yet realistic laws for different scales.

How the data was collected:

- GitHub numbers (stars / license / last push) come from `gh api repos/<owner>/<repo>` on 2026-10-15.
- npm versions come from `npm view`. WASM sizes were measured by listing the published tarball contents.
- Stars change daily, so treat them as order-of-magnitude signals.
- **License flags:** anything that is not MIT, Apache-2.0, BSD or zlib is marked **NON-PERMISSIVE**.
- Where GitHub reports `NOASSERTION`, the LICENSE file was read directly.

---

## 1. Physics engines usable from JavaScript / WebAssembly

### 1.1 2D engines

| Engine | JS package (npm, 2026-10-15) | Solver / notable features | Determinism | License | GitHub (stars / pushed) |
|---|---|---|---|---|---|
| **Box2D v3** (C) | `box2d3-wasm` 5.2.0, MIT, wasm ~417 KB ([npm](https://www.npmjs.com/package/box2d3-wasm), [repo](https://github.com/Birch-san/box2d3-wasm)) | "Soft Step" solver: soft constraints + sub-stepping; SIMD; multithreaded; speculative collision + TOI "prevent almost all dynamic versus static tunneling" ([v3.0 post](https://box2d.org/posts/2024/08/releasing-box2d-3.0/)) | Cross-platform deterministic since v3.1 (no fast-math, no FMA, own `atan2f`); **no rollback determinism** ([determinism post](https://box2d.org/posts/2024/08/determinism/), [v3.1.0](https://github.com/erincatto/box2d/releases/tag/v3.1.0)) | MIT | [erincatto/box2d](https://github.com/erincatto/box2d): 10,417 / 2026-10-12; latest release v3.1.1 (2025-06-04) |
| Box2D v2.4 (C++) | `box2d-wasm` 7.0.0, Zlib, last modified 2022-04-12 ([npm](https://www.npmjs.com/package/box2d-wasm)) | Classic sequential impulse with NGS position solver | Not documented | Zlib | [Birch-san/box2d-wasm](https://github.com/Birch-san/box2d-wasm): 306 / 2024-12-29 |
| **Planck.js** | `planck` 1.5.1, MIT, pure JS ([npm](https://www.npmjs.com/package/planck)) | "JavaScript/TypeScript rewrite of Box2D" (v2 lineage) | Not documented (JS doubles; same-engine replays are practical) | MIT | [piqnt/planck.js](https://github.com/piqnt/planck.js): 5,295 / 2026-10-14 |
| Matter.js | `matter-js` 0.20.0, MIT, 2024-06-23 ([npm](https://www.npmjs.com/package/matter-js)) | "Stable stacking and resting"; **no CCD**: issue #5 "Prevent object passing through walls / tunneling" is still open ([#5](https://github.com/liabru/matter-js/issues/5), [#309](https://github.com/liabru/matter-js/issues/309)) | "Should be deterministic given the exact same conditions and using a fixed timestep" (maintainer, [#820](https://github.com/liabru/matter-js/issues/820)); fixed-step Runner is the default since 0.20.0 ([CHANGELOG](https://github.com/liabru/matter-js/blob/master/CHANGELOG.md)) | MIT | [liabru/matter-js](https://github.com/liabru/matter-js): 18,471 / 2026-09-30 |
| **Rapier 2D** (Rust) | `@dimforge/rapier2d` 0.21.0, Apache-2.0, wasm 2.40 MB; `-compat` and `-deterministic` variants ([npm](https://www.npmjs.com/package/@dimforge/rapier2d)) | Impulse solver, soft CCD (predictive contacts) since 0.19 ([CCD docs](https://rapier.rs/docs/user_guides/rust/rigid_body_ccd/)) | WASM build "fully cross-platform deterministic" with the same version and insertion order; `Math.sin`/`cos` in user code are not ([JS determinism](https://rapier.rs/docs/user_guides/javascript/determinism)) | Apache-2.0 | [dimforge/rapier](https://github.com/dimforge/rapier): 5,863 / 2026-10-10 (rapier.js is archived and migrated into this repo: [rapier.js](https://github.com/dimforge/rapier.js)) |

### 1.2 3D engines

| Engine | JS package | Solver / notable features | Determinism | License | GitHub |
|---|---|---|---|---|---|
| **Rapier 3D** | `@dimforge/rapier3d` 0.21.0, wasm 3.08 MB; `@dimforge/rapier3d-deterministic` 3.11 MB ([npm](https://www.npmjs.com/package/@dimforge/rapier3d-deterministic)) | Per-body extra solver iterations, dominance groups ([bodies](https://godot.rapier.rs/docs/reference/bodies)) | Rust: local by default; cross-platform via `enhanced-determinism` (IEEE 754-2008, incompatible with `simd8`); parallel solver gives the same result as the sequential one ([Rust determinism](https://rapier.rs/docs/user_guides/rust/determinism)) | Apache-2.0 | see above |
| **Jolt Physics** (C++) | `jolt-physics` 1.1.0, MIT, wasm 2.02 MB (multithread 2.48 MB) ([npm](https://www.npmjs.com/package/jolt-physics), [JoltPhysics.js](https://github.com/jrouwe/JoltPhysics.js)) | Sequential impulse with warm starting plus a position solver; symplectic Euler; islands and sleeping; job system ([docs](https://jrouwe.github.io/JoltPhysics/)) | `CROSS_PLATFORM_DETERMINISTIC` costs ~8%, is verified incl. "WASM32 emscripten running in nodejs", but is "less tested than other features" ([docs](https://jrouwe.github.io/JoltPhysics/)); optional `DOUBLE_PRECISION` for worlds "larger than a couple of km" ([JoltPhysics.js](https://github.com/jrouwe/JoltPhysics.js)) | MIT | [jrouwe/JoltPhysics](https://github.com/jrouwe/JoltPhysics): 11,734 / 2026-10-14, v5.6.0 (2026-07-11); JS: 579 / 2026-08-23 |
| **PhysX 5** (C++) | `physx-js-webidl` 2.8.0, MIT, wasm 5.40 MB, wraps PhysX 5.11.0; GPU/CUDA excluded ("not possible with WASM") ([repo](https://github.com/fabmax/physx-js-webidl)) | Open-sourced 2022 with CPU source only ([NVIDIA blog](https://developer.nvidia.com/blog/open-source-simulation-expands-with-nvidia-physx-5-release)); GPU source + Flow released April 2025 under BSD-3 ([PCGH, 2025-04-06](https://www.pcgameshardware.de/Grafikkarten-Grafikkarte-97980/News/Nvidia-PhysX-als-Open-Source-1469876/)) | Not documented for the WASM wrapper | BSD-3-Clause (wrapper MIT) | [NVIDIA-Omniverse/PhysX](https://github.com/NVIDIA-Omniverse/PhysX): 4,793 / 2026-10-09; wrapper 183 / 2026-09-27 |
| **Havok (Babylon.js)** | `@babylonjs/havok` 1.3.14, MIT, wasm 2.09 MB ([npm](https://www.npmjs.com/package/@babylonjs/havok)) | "free to use under the MIT license"; requires WASM SIMD (not on iOS < 16.4) ([Babylon docs](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin)) | Not documented | MIT (binary; engine source closed) | n/a |
| **MuJoCo** (C) | `@mujoco/mujoco` 3.16.0, Apache-2.0, wasm 10.75 MB (`/mt` 10.85 MB, needs COOP/COEP) ([README](https://cdn.jsdelivr.net/npm/@mujoco/mujoco@3.16.0/README.md)) | Robotics-grade convex contact; official DeepMind JS/TS bindings, still marked "WIP" ([README](https://cdn.jsdelivr.net/npm/@mujoco/mujoco@3.16.0/README.md)) | Not documented in the JS README | Apache-2.0 | [google-deepmind/mujoco](https://github.com/google-deepmind/mujoco): 15,689 / 2026-10-15, 3.16.0 (2026-10-14) |
| Bullet / ammo.js | `ammo.js` 0.0.10, last modified 2022-06-13, no license field ([npm](https://www.npmjs.com/package/ammo.js)) | Classic Bullet 2 | Not documented | zlib (Bullet LICENSE.txt, except "Extras" and ThirdPartyLibs) ([bullet3](https://github.com/bulletphysics/bullet3)) | bullet3 14,789 / 2026-10-09; [ammo.js](https://github.com/kripken/ammo.js) 4,580 / 2026-09-22 |
| cannon-es | `cannon-es` 0.20.0, MIT, last published 2022-08-12 ([npm](https://www.npmjs.com/package/cannon-es)) | Pure JS, simple | Not documented | MIT | [pmndrs/cannon-es](https://github.com/pmndrs/cannon-es): 2,064 / 2024-01-06 (stale) |
| OimoPhysics | `oimophysics` 1.2.2, MIT ([npm](https://www.npmjs.com/package/oimophysics)) | Pure JS/Haxe | Not documented | MIT | [saharan/OimoPhysics](https://github.com/saharan/OimoPhysics): 959 / 2025-05-18; [Oimo.js](https://github.com/lo-th/Oimo.js) 3,176 / 2021-07-08 (stale) |

### 1.3 GPU / research engines (not browser-ready, for offline work and validation)

| Engine | What it is | Hardware / browser | License | GitHub |
|---|---|---|---|---|
| **NVIDIA Warp** | Python-embedded GPU kernel language for simulation | CUDA (CPU fallback); no WebGPU | Apache-2.0 (when it moved from the NVIDIA license is **unverified**) | [NVIDIA/warp](https://github.com/NVIDIA/warp): 7,198 / 2026-10-14, v1.18.0 (2026-10-05) |
| **Newton** | Linux Foundation project contributed by Disney Research, Google DeepMind and NVIDIA, built on Warp + OpenUSD ([LF press, 2025-09-29](https://www.linuxfoundation.org/press/linux-foundation-announces-contribution-of-newton-by-disney-research-google-deepmind-and-nvidia-to-accelerate-open-robot-learning)). Solvers: Featherstone, ImplicitMPM, Kamino, MuJoCo, SemiImplicit, Style3D (cloth), VBD/AVBD, XPBD ([solvers](https://newton-physics.github.io/newton/latest/api/newton_solvers.html)) | NVIDIA Turing+ (CC 7.5), driver R580+; macOS CPU only ([README](https://github.com/newton-physics/newton)) | Apache-2.0 | [newton-physics/newton](https://github.com/newton-physics/newton): 5,779 / 2026-10-15, v1.7.0 |
| **Genesis** | Unified Rigid, FEM, MPM, PBD/SPH, IPC (uipc) and SAP solvers; Quadrants compiler for CUDA/ROCm/Metal/Vulkan/x86/ARM64 ([README](https://github.com/Genesis-Embodied-AI/genesis-world)) | GPU desktop; no browser | Apache-2.0 | [Genesis-Embodied-AI/genesis-world](https://github.com/Genesis-Embodied-AI/genesis-world): 30,058 / 2026-10-15, v1.4.4 |
| **MuJoCo Warp / MJX** | GPU MuJoCo for batched RL | NVIDIA GPU | Apache-2.0 | [mujoco_warp](https://github.com/google-deepmind/mujoco_warp): 1,551 / 2026-10-14 |
| **Taichi** | Compiler for spatially sparse simulation; backends CPU/CUDA/Vulkan/OpenGL 4.3+/Metal, WebAssembly "experimental" ([README](https://github.com/taichi-dev/taichi)) | Desktop GPU | Apache-2.0 | [taichi-dev/taichi](https://github.com/taichi-dev/taichi): 28,414 / 2026-10-05; last release v1.7.4 (2025-07-31), so releases have slowed |
| Brax | JAX physics with MJX, generalized, positional (PBD) and spring pipelines; "Only brax/training is actively being maintained as of 0.13.0" ([README](https://github.com/google/brax)) | TPU/GPU | Apache-2.0 | [google/brax](https://github.com/google/brax): 3,248 / 2026-10-07 |
| NVIDIA FleX | Unified particle engine (see 2.1) | CUDA/DX | **NON-PERMISSIVE**: "Nvidia Source Code License (1-Way Commercial)" | [NVIDIAGameWorks/FleX](https://github.com/NVIDIAGameWorks/FleX): 815 / 2021-04-15 (dead) |

**Caution on benchmark claims:**

- Genesis was announced as up to "430,000x faster than real time" ([Techzine](https://www.techzine.eu/news/devops/127319/physics-simulation-trains-robots-430000-times-faster/)).
- An independent analysis said the "publicly reported numbers are off by 150x" ([Stone Tao](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is)).
- The team later published a revised benchmark that applies to a narrow arm-only setup ([Genesis benchmark](https://placid-walkover-0cc.notion.site/genesis-performance-benchmarking)).

Treat vendor speed numbers as unverified until we reproduce them.

---

## 2. "One single universal formula" candidates

No single method is the "universal formula". The closest practical answers are **constraint-based particle methods (XPBD / unified particles)** for real-time play and **MPM** for continua. **Variational mechanics** is the theoretical unifier behind good integrators.

| Family | Key source | What it unifies | Strengths | Weaknesses | Real-time web fit |
|---|---|---|---|---|---|
| **PBD -> XPBD** | Müller et al. 2006 (PBD); Macklin, Müller & Chentanez 2016 (XPBD) ([publications](https://matthias-research.github.io/pages/publications/publications.html)) | Any system expressed as constraints | XPBD removes "iteration count and time step dependent constraint stiffness" using compliance α̃ = α/Δt² ([restated in arXiv 2301.01396](https://arxiv.org/abs/2301.01396)); unconditionally stable | Converges to an implicit-Euler-like answer, not exact; energy damping with few iterations | Excellent: simple, parallel |
| **Small Steps** | Macklin et al., SCA 2019 ([DigLib](https://diglib.eg.org/handle/10.1145/3309486-3340247)) | n substeps x 1 iteration beats 1 step x n iterations | Less damping and error than a large-step implicit integrator | More collision passes per frame | Excellent; same idea as Box2D v3 sub-stepping |
| **Rigid bodies in XPBD** | Müller et al. 2020 ([publications](https://matthias-research.github.io/pages/publications/publications.html)) | Rigid bodies, joints and soft bodies in one solver | One code path for everything | Less mature than impulse engines for large stacks | Good |
| **Unified Particle Physics** (FleX) | Macklin, Müller, Chentanez & Kim, TOG 33(4) 2014; SIGGRAPH 2025 Test-of-Time award ([SIGGRAPH blog](https://blog.siggraph.org/2025/10/technical-excellence-withstanding-the-test-of-time.html/)) | Gases, liquids, deformables, rigid bodies and cloth as particles + constraints | Truly one data model | Rigid bodies need many particles; FleX itself is **NON-PERMISSIVE** | Good via WebGPU compute (we would need our own implementation) |
| **MPM / MLS-MPM** | Stomakhin et al. 2013 snow, used in Disney's Matterhorn for Frozen, later mud, foam and sand ([paper](https://disneyanimation.com/publications/a-material-point-method-for-snow-simulation), [Matterhorn](https://www.disneyanimation.com/technology/matterhorn)); MLS-MPM ~2x faster with rigid coupling and cutting ([Hu et al. 2018](https://yuanming.taichi.graphics/publication/2018-mlsmpm/)) | Solids, granular material, fluids and snow from constitutive laws | Physically grounded material parameters (Young's modulus, Poisson ratio) | Grid + particles cost memory; small time steps | Medium: 2D on WebGPU is feasible, 3D needs a desktop GPU |
| **SPH** | Monaghan 2005 review, Rep. Prog. Phys. 68:1703 ([IOP](https://iopscience.iop.org/article/10.1088/0034-4885/68/8/R01/meta)) | Fluids (and solids) as kernel-smoothed particles | Meshless, intuitive | Incompressibility is costly; tuning needed | Good for small fluids |
| **LBM** | Chen & Doolen 1998, Annu. Rev. Fluid Mech. 30:329 ([DOI](https://doi.org/10.1146/annurev.fluid.30.1.329)) | Fluid flow from a discrete Boltzmann equation | Purely local operations, which suits GPUs ([arXiv 1309.3018](https://arxiv.org/pdf/1309.3018)) | Grid-bound, low Mach number only | Good for 2D wind and water fields |
| **Least action / Lagrangian / Hamiltonian -> variational integrators** | Marsden & West, Acta Numerica 10 (2001) ([page](https://lagrange.mechse.illinois.edu/pubs/MaWe2001/)); Hairer, Lubich & Wanner 2003 on Störmer–Verlet ([preprint](https://www.unige.ch/~hairer/preprints/gniverlet.html)) | Derives integrators from a discrete action and unifies symplectic schemes; gives a discrete Noether theorem | Energy error stays bounded over long runs ([West thesis](https://thesis.library.caltech.edu/2492/1/west_thesis.pdf)); momentum is conserved exactly | Contact and friction are non-smooth and break the clean theory | The *principle* to apply: use symplectic / Verlet-type steps |

**Practical reading:** the "single formula" for links-games could be:

> minimize a discrete action subject to constraints, solved with substepped XPBD

- Rigid bodies, ropes, cloth, soft bodies and particle fluids all fit this one solver.
- MPM covers continua when a scene needs real material laws.
- This is a design inference from the sources above, not a published standard.

### 2.1 GPU availability: WebGPU with WebGL2/CPU fallback

| Platform | WebGPU status | Source |
|---|---|---|
| Chrome / Edge desktop | Since Chrome 113 (Windows, macOS, ChromeOS); Linux: Intel Gen12+ from 144, NVIDIA on Wayland from 147 | [gpuweb implementation status](https://github.com/gpuweb/gpuweb/wiki/implementation-status) |
| Chrome Android | Android 12+ from Chrome 121 | same |
| Safari (macOS, iOS, iPadOS, visionOS) | On by default in Safari 26.0 | [WebKit blog, 2025-09-15](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/) |
| Firefox | 141 on Windows (2025-07-22); macOS from 145 (macOS 26+) and 147 (all versions); Linux Nightly only; Android behind a flag | [gpuweb implementation status](https://github.com/gpuweb/gpuweb/wiki/implementation-status) |
| Global reach | ~87.8% (85.8% full + 2.0% partial) | [caniuse](https://caniuse.com/webgpu) |
| Spec status | W3C Candidate Recommendation Draft, 2026-09-15 | [W3C TR](https://www.w3.org/TR/webgpu/) |

Implications:

- **We must keep a fallback.** three.js `WebGPURenderer` falls back to WebGL 2 automatically, and TSL shaders compile to both WGSL and GLSL. `ShaderMaterial` and `EffectComposer` are not supported there ([three.js manual](https://threejs.org/manual/en/webgpurenderer.html)).
- WebGL 2 has no compute shaders, so GPU physics needs a CPU (WASM) path as the reference implementation.
- GPU float results are not guaranteed bit-identical across vendors, so GPU physics must not drive gameplay-critical lockstep state (see section 7).

---

## 3. Multiscale modeling and model selection ("relative-meta-logic")

| Tool | What it does | Source | Use in links-games |
|---|---|---|---|
| **Dimensional analysis / Buckingham π** | n variables with k independent dimensions reduce to n−k dimensionless groups (Buckingham 1914, Phys. Rev. 4:345) | [DOI 10.1103/PhysRev.4.345](https://doi.org/10.1103/PhysRev.4.345), [NIST](https://www.nist.gov/node/1613181), [Wikipedia](https://en.wikipedia.org/wiki/Buckingham_pi_theorem) | Choose the model per scale from dimensionless numbers (e.g. Reynolds number decides the drag law, Froude number the water waves); keep units in SI |
| **Effective field theory (EFT)** | Physics at one scale is described by an effective model; corrections are power series in the ratio of scales | [Cohen, arXiv 1903.03622](https://arxiv.org/abs/1903.03622); [Burgess, hep-th/0701053](https://arxiv.org/pdf/hep-th/0701053); [Wikipedia](https://en.wikipedia.org/wiki/Effective_field_theory) | Conceptual basis for "simplified yet realistic laws per scale" (Newtonian vs relativistic vs quantum regimes) |
| **Reduced-order models (ROM)** | Project high-dimensional dynamics onto a few modes (POD, etc.) | [Wikipedia: Model order reduction](https://en.wikipedia.org/wiki/Model_order_reduction) | Cheap LOD physics: far-away objects run a reduced model |
| **SINDy** | Sparse regression over a library of candidate terms to discover governing equations (Brunton, Proctor & Kutz, PNAS 113:3932, 2016) | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4839439); [pysindy](https://github.com/dynamicslab/pysindy) (MIT, 1,915 stars, pushed 2026-10-15) | Fit simplified laws to high-fidelity offline sim data |
| **AI Feynman** | Physics-inspired symbolic regression (uses units, symmetry, separability); recovered all 100 Feynman equations vs 71 for prior software; hard set from 15% to 90% (Udrescu & Tegmark, Sci. Adv. 2020) | [arXiv 1905.11481](https://arxiv.org/abs/1905.11481); [SJ001/AI-Feynman](https://github.com/SJ001/AI-Feynman) (MIT, 784, pushed 2024-07-09, stale) | Prior art for unit-aware law inference |
| **PySR** | Evolutionary symbolic regression on a SymbolicRegression.jl backend, plus the EmpiricalBench benchmark (Cranmer 2023) | [arXiv 2305.01582](https://arxiv.org/abs/2305.01582); [PySR](https://github.com/MilesCranmer/PySR) (Apache-2.0, 3,804, pushed 2026-10-15) | Most maintained tool: derive closed-form surrogates for MPM/fluid behavior at coarse LOD |

**Proposed pipeline (design proposal, not an existing product):**

1. Simulate with a high-fidelity offline engine (MuJoCo, Warp, Newton or Genesis).
2. Non-dimensionalize the results with Buckingham π.
3. Run PySR/SINDy to fit a compact law that is valid within a range of a dimensionless number.
4. Ship that law with its validity range as a lower-LOD runtime model.
5. Switch models when the dimensionless number crosses the range, the way EFT switches models across scales.

This is the most concrete sourced precedent for the maintainer's "relative-meta-logic" idea. The formal links to Links Theory are covered in the sibling note [research-links-theory-lore.md](research-links-theory-lore.md).

---

## 4. Physically based rendering from physical properties

| Topic | Fact | Source |
|---|---|---|
| glTF 2.0 PBR (metal/rough) | Ratified extensions include `KHR_materials_ior`, `transmission`, `volume`, `sheen`, `clearcoat`, `iridescence`, `anisotropy`, `dispersion`, `specular`, `emissive_strength`, `variants`, `unlit`, plus `KHR_lights_punctual`, `KHR_texture_basisu`, `KHR_draco_mesh_compression` and `EXT_meshopt_compression`. `diffuse_transmission` is a Release Candidate and `subsurface` an Initial Draft | [glTF extensions registry](https://github.com/KhronosGroup/glTF/blob/main/extensions/README.md) (spec CC-BY-4.0, [repo](https://github.com/KhronosGroup/glTF) 7,856 stars) |
| Physical light units in glTF | `KHR_lights_punctual`: point/spot in candela, directional in lux, inverse-square falloff | [KHR_lights_punctual](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_lights_punctual) |
| three.js lighting | r155 defaulted `useLegacyLights` to false and r165 removed it: intensities are no longer scaled by π and decay is physically correct | [three.js forum](https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733) |
| three.js WebGPU / TSL | `WebGPURenderer` with automatic WebGL 2 fallback; TSL node shaders | [manual](https://threejs.org/manual/en/webgpurenderer.html); `three` 0.186.1 MIT; [mrdoob/three.js](https://github.com/mrdoob/three.js) 116,439 / 2026-10-15 |
| Babylon.js | Full PBR engine plus Havok physics | `@babylonjs/core` 9.31.0 Apache-2.0; [BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js) 26,166 / 2026-10-15 |
| Filament | Lux for directional, lumens for point/spot, candela for photometric profiles; "Using physical light units also allows us to use a physically based camera"; validated against light meter readings | [Filament PBR doc](https://google.github.io/filament/main/filament.html); [google/filament](https://github.com/google/filament) Apache-2.0, 20,607 |
| Spectral rendering (offline reference) | Mitsuba 3: monochrome/RGB/**spectral**/polarized variants, scalar/LLVM/CUDA backends, differentiable via Dr.Jit | [Mitsuba variants](https://mitsuba.readthedocs.io/en/stable/src/key_topics/variants.html); [mitsuba3](https://github.com/mitsuba-renderer/mitsuba3) BSD-3-style LICENSE, 2,951 |
| Spectral rendering (offline reference) | pbrt-v4: point-sampled spectra; GPU path via CUDA/OptiX (NVIDIA only) | [mmp/pbrt-v4](https://github.com/mmp/pbrt-v4) Apache-2.0, 3,731 |
| Measured materials | MERL BRDF database: 100 measured isotropic materials (Matusik et al. 2003) | [merl.com/brdf](https://www.merl.com/brdf): **NON-PERMISSIVE** (research/academic use only); use it for validation, never ship it |

### 4.1 Anime / NPR on top of a physical pipeline

These sources show that stylization can be a layer on top of a physical pipeline. The scene stays physical (geometry, units, light energy) and only the final shading is stylized.

| Example | Source |
|---|---|
| Guilty Gear Xrd: 3D models rendered to look 2D, GDC 2015 "The X Factor Between 2D and 3D" (Junya Motomura) | [GDC Vault](https://gdcvault.com/play/1022031/), [transcript](https://www.ggxrd.com/Motomura_Junya_GuiltyGearXrd.pdf) |
| Genshin Impact, GDC 2021 "Crafting an Anime Style Open World" (Haoyu Cai); details are paywalled and **not verified** | [GDC news](https://www.gdconf.com/news/learn-about-making-genshin-impacts-open-world-gdc-2021) |
| NetEase, GDC 2022 "Finding Harmony in Anime Style and Physically Based Rendering": "creating a physics-based world while keeping anime style feeling", deferred pipeline | [GDC Vault](https://gdcvault.com/play/1027995/Technical-Artist-Summit-Finding-Harmony) |
| MToon (VRM): `MToonNodeMaterial` for `WebGPURenderer`, three r167+ | [three-vrm MToon](https://github.com/pixiv/three-vrm/tree/dev/packages/three-vrm-materials-mtoon); `@pixiv/three-vrm` 3.5.5 MIT, 2,219 stars |

---

## 5. 2D / 3D vector graphics and resolution-independent assets

| Tech | Key facts | License / version | Source |
|---|---|---|---|
| SVG / Canvas `Path2D` | Native, resolution independent; no install cost | Web standard | [MDN Path2D](https://developer.mozilla.org/en-US/docs/Web/API/Path2D) |
| **PixiJS v8** | WebGL/WebGPU 2D renderer; `Graphics.svg()` warns "complex hole geometries may render inaccurately" (triangulation); `GraphicsContext` can be shared | `pixi.js` 8.22.0 MIT; 48,384 / 2026-10-14 | [Graphics guide](https://pixijs.com/8.x/guides/components/scene-objects/graphics), [repo](https://github.com/pixijs/pixijs) |
| **Rive** | Vector animation + state machines; C++ runtime renderer with Metal/Vulkan/D3D/OpenGL/WebGL backends | `@rive-app/canvas` 2.44.2 MIT; runtime 1,223 / 2026-10-15 | [C++ runtime docs](https://rive.app/docs/runtimes/cpp/overview), [rive-runtime](https://github.com/rive-app/rive-runtime), [rive-wasm](https://github.com/rive-app/rive-wasm) |
| Lottie / dotLottie | dotLottie is a ZIP container with state machines and a ThorVG renderer of ~150 KB WASM, "up to 10x smaller than Lottie JSON" | `@lottiefiles/dotlottie-web` 0.81.0 MIT; `lottie-web` 5.13.0 MIT (repo last push 2025-09-01) | [dotLottie](https://lottiefiles.com/dotlottie), [dotlottie-web](https://github.com/LottieFiles/dotlottie-web), [lottie-web](https://github.com/airbnb/lottie-web) |
| **Vello** | GPU-friendly 2D vector renderer; Vello CPU is the most mature; Vello GPU (hybrid) runs on WebGL2/wgpu "without requiring compute shaders"; the compute-centric renderer is experimental | Apache-2.0 OR MIT; 4,419 / 2026-10-15 | [linebender/vello](https://github.com/linebender/vello) |
| SDF / MSDF text and icons | MSDF can "reproduce sharp corners almost perfectly" | msdfgen MIT, 4,952 | [Chlumsky/msdfgen](https://github.com/Chlumsky/msdfgen) |
| Implicit surfaces / SDF | Signed distance functions define shape analytically; infinitely scalable, ray-marchable | general | [Wikipedia: Signed distance function](https://en.wikipedia.org/wiki/Signed_distance_function) |
| **3D Gaussian splatting** | Real-time radiance fields at ≥30 fps 1080p (Kerbl et al., SIGGRAPH 2023) | research paper | [arXiv 2308.04079](https://arxiv.org/abs/2308.04079) |
| Spark (three.js splats) | By World Labs; PLY, SOGS, SPZ, SPLAT and KSPLAT formats; has LOD | `@sparkjsdev/spark` 2.3.1 MIT; 3,741 / 2026-10-12 | [sparkjs.dev](https://sparkjs.dev/), [repo](https://github.com/sparkjsdev/spark) |
| GaussianSplats3D | Older three.js splat viewer | `@mkkellogg/gaussian-splats-3d` 0.4.7 MIT; last push 2025-10-19 | [repo](https://github.com/mkkellogg/GaussianSplats3D) |

Splats capture appearance, not physical properties, so they conflict with "physics, not artistic vision" for dynamic objects. They are useful for static, scanned real-world backdrops. This is an inference.

---

## 6. Level of detail and device scaling

| Layer | Tool / technique | Facts | Source |
|---|---|---|---|
| Mesh LOD | three.js `LOD` | `addLevel(object, distance, hysteresis)` | [three.js LOD](https://threejs.org/docs/pages/LOD.html) |
| Mesh simplification / meshlets | meshoptimizer | Simplification, `meshopt_buildMeshlets` (NVIDIA-recommended 64 vertices / 126 triangles), `clusterlod.h` for continuous cluster LOD, `gltfpack` | [zeux/meshoptimizer](https://github.com/zeux/meshoptimizer) MIT, 8,565 / 2026-10-14; npm `meshoptimizer` 1.3.0 |
| Nanite-style virtual geometry on the web | nanite-webgpu | Experiment; "WebGPU does not have the atomic<u64>"; Chrome 128 MB storage-buffer limit; the author is "moving on" | [Scthe/nanite-webgpu](https://github.com/Scthe/nanite-webgpu) MIT, 1,119 |
| Asset pipeline | glTF-Transform | Scripted optimize, compress and LOD for glTF | [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) MIT; `@gltf-transform/core` 4.5.1 |
| Textures | KTX2 / Basis Universal | ETC1S and UASTC modes that transcode to native GPU formats | [Khronos KTX](https://www.khronos.org/ktx/); [basis_universal](https://github.com/BinomialLLC/basis_universal) Apache-2.0; [KTX-Software](https://github.com/KhronosGroup/KTX-Software) (GitHub NOASSERTION, check LICENSE before vendoring) |
| Geometry compression | Draco | Mesh compression | [google/draco](https://github.com/google/draco) Apache-2.0; `draco3d` 1.5.7 |
| GPU tier detection | detect-gpu | Tiers 0–3 at ≥15/30/60 fps from gfxbench data; that data stopped updating in Dec 2025, so new GPUs fall back to heuristics | [pmndrs/detect-gpu](https://github.com/pmndrs/detect-gpu) MIT; 5.0.70 |
| Runtime adaptation | Babylon SceneOptimizer | Target FPS, then degrade (e.g. `HardwareScalingOptimization`) | [Babylon docs](https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer) |
| Thermal (Android native / Capacitor) | ADPF `getThermalHeadroom` | Thermal API from Android 11 | [Android ADPF](https://developer.android.com/games/optimize/adpf/thermal) |
| Thermal / CPU pressure (web, Electron) | Compute Pressure API | Shipped in Chrome 125; states nominal/fair/serious/critical; sources cpu/thermals | [Chrome docs](https://developer.chrome.com/docs/web-platform/compute-pressure) |
| Physics LOD | Box2D sleeping | Sleeping bodies have "very little CPU overhead" | [Box2D simulation docs](https://box2d.org/documentation/md_simulation.html) |

**Physics LOD rule (inference):** never change the physics model of gameplay-relevant objects per device, because that breaks determinism and fairness. Scale only rendering and non-gameplay effects such as debris, particles, cloth and splats. Reduced-order / symbolic-regression models (section 3) apply to distant or ambient phenomena.

---

## 7. Determinism and reproducibility

| Practice | Why | Source |
|---|---|---|
| Fixed timestep with accumulator; render interpolates | Variable dt changes results | [Fiedler, "Fix Your Timestep!"](https://gafferongames.com/post/fix_your_timestep/) |
| Box2D: 60 Hz step, 4 sub-steps | "A time step of 1/60 seconds (60Hz) will usually deliver a high quality simulation"; "The recommended sub-step count is 4" | [Box2D docs](https://box2d.org/documentation/md_simulation.html) |
| Avoid fast-math, FMA contraction and libm transcendentals | Box2D became cross-platform deterministic only after this (`-ffp-contract=off`, own `atan2f`) | [Box2D determinism](https://box2d.org/posts/2024/08/determinism/) |
| Same engine version + same insertion order; hash snapshots | Rapier: compare MD5 of `world.takeSnapshot()` | [Rapier JS determinism](https://rapier.rs/docs/user_guides/javascript/determinism) |
| Avoid `Math.sin` / `Math.cos` in gameplay code | JS transcendentals are "not cross-platform determinism" | [Rapier JS determinism](https://rapier.rs/docs/user_guides/javascript/determinism) |
| Lockstep sends only inputs | Requires bit-exact determinism; "yes, if…" | [Fiedler, "Floating Point Determinism"](https://gafferongames.com/post/floating_point_determinism/) |
| Rollback | Box2D: "does not provide roll-back determinism"; Rapier snapshots make save/restore possible | [Box2D determinism](https://box2d.org/posts/2024/08/determinism/), [Rapier](https://rapier.rs/docs/user_guides/javascript/determinism) |
| Keep GPU physics out of the authoritative state | GPU float behavior depends on hardware (no bit-exactness guarantee) | [WebGPU spec](https://www.w3.org/TR/webgpu/) (precision guarantees not re-verified in detail) |
| Large worlds | Use double precision or floating origin | [JoltPhysics.js](https://github.com/jrouwe/JoltPhysics.js) |

**Engines with documented cross-platform determinism in WASM:**

- Rapier (`-deterministic` packages).
- Box2D v3.1+ (upstream claim; the box2d3-wasm build flags were **not verified**).
- Jolt (`CROSS_PLATFORM_DETERMINISTIC`, "less tested").

Matter.js only claims same-conditions determinism.

---

## 8. Real-world validation and the sim-to-real gap

| Finding | Source |
|---|---|
| Cross-engine comparison found each engine tends to do best on the kind of system it was built for. Authors are the MuJoCo developers, so there is a possible bias | [Erez, Tassa & Todorov, ICRA 2015](https://homes.cs.washington.edu/~todorov/papers/ErezICRA15.pdf) |
| Predicting real-world rigid-body behavior: results were mixed across engines and scenarios | [Chung & Pollard 2016](https://www.ri.cmu.edu/app/uploads/2017/12/ChungCAVW2016.pdf) |
| Survey of robotics simulators and their fidelity limits | [Collins et al., IEEE Access 9 (2021), DOI 10.1109/ACCESS.2021.3068769](https://ora.ox.ac.uk/objects/uuid:e64b1797-917d-4b75-8eae-a5a60af74246) |
| "Reality gap": domain randomization let a detector trained only in simulation reach 1.5 cm accuracy on a real robot | [Tobin et al. 2017, arXiv 1703.06907](https://arxiv.org/abs/1703.06907) |
| Filament's physical camera and light units were checked against light meter readings | [Filament doc](https://google.github.io/filament/main/filament.html) |

**Takeaway:** "fully realistic, reproducible in real life" is achievable only per phenomenon and within measured error bars, not globally.

Validation should be:

1. Simple real experiments (drop tests, pendulum period, restitution, friction slopes) recorded on video.
2. Compared with an offline reference (MuJoCo, or Mitsuba for light).
3. Run as CI tests with tolerances.

This is a proposal built on the sources above.

---

## 9. Recommendation for links-games

### 9.1 Staged path

| Stage | Scope | Default physics | Default graphics | Why |
|---|---|---|---|---|
| **1. 2D vector games** | Puzzles, platformers, physics toys | **Box2D v3** via `box2d3-wasm` (MIT, ~417 KB wasm), or **Rapier2D-deterministic** (Apache-2.0, ~2.4 MB) when rollback/snapshots or netcode matter. **Planck.js** (MIT, pure JS) where WASM is unwanted | SVG/Path2D -> **PixiJS v8** (MIT); **Rive** (MIT runtime) or **dotLottie** (MIT) for authored animation; MSDF text | Box2D v3 is the most accurate and fast 2D solver with a documented cross-platform determinism claim; Matter.js lacks CCD ([#5](https://github.com/liabru/matter-js/issues/5)) |
| **2. 3D games** | Physics sandboxes, vehicles, characters | **Rapier3D** (Apache-2.0, deterministic build) or **Jolt** (MIT, more features, larger worlds); Havok via Babylon is an MIT-licensed binary alternative | **three.js WebGPURenderer** (MIT) with automatic WebGL2 fallback; glTF 2.0 PBR + `KHR_lights_punctual` in physical units; NPR (MToon / toon TSL) layered on top | Single default renderer and asset format; physical units are kept from asset to light |
| **3. Unified particles and continua** | Cloth, ropes, soft bodies, fluids, sand and snow | Own **XPBD (Small Steps)** solver in TSL/WGSL compute, with a WASM CPU reference; **MLS-MPM** for 2D continua first | Instanced particles, SDF surfaces | XPBD is the closest practical "universal formula" (section 2); FleX itself is non-permissive |
| **4. Research tier (offline)** | Validation, law inference | **MuJoCo** (Apache-2.0; also runs in browser at ~10.8 MB); Newton / Warp / Genesis / Taichi only offline (CUDA or desktop GPU) | Mitsuba 3 spectral as the ground truth for lighting | Produces reference data and PySR/SINDy-fitted per-scale laws |

### 9.2 Physics fidelity ladder

Every game declares its level. Higher levels need validation evidence.

| Level | Name | Model | Units | Validation required |
|---|---|---|---|---|
| L0 | Kinematic / arcade | Scripted motion, no solver | Any | None |
| L1 | Rigid-body impulse | Box2D/Rapier/Jolt, fixed 60 Hz | SI (m, kg, s) | Determinism hash test in CI |
| L2 | Substepped constraints | Box2D v3 soft-step / XPBD substeps; measured friction and restitution | SI + real material tables | Comparison to simple recorded real experiments within a tolerance |
| L3 | Continuum materials | MPM / SPH / LBM with constitutive parameters; physical light units + glTF PBR | SI + photometric | Comparison to an offline reference (MuJoCo / Mitsuba) |
| L4 | Validated "reproducible in real life" | L2/L3 plus per-scale laws inferred and checked against measurements | SI | Published dataset + error bars (sim-to-real report) |

### 9.3 What is available today and what is still research

| Available today (production-ready, permissive) | Research / experimental |
|---|---|
| Box2D v3, Rapier, Jolt, PhysX-WASM (CPU), Havok-WASM, Planck.js | MuJoCo JS bindings ("WIP") |
| three.js WebGPURenderer + WebGL2 fallback, Babylon.js, Filament | Nanite-style virtual geometry on WebGPU (no 64-bit atomics) |
| glTF 2.0 PBR + ratified KHR extensions, KTX2, Draco, meshoptimizer | `KHR_materials_subsurface` (draft), real-time spectral rendering on the web |
| PixiJS v8, Rive, dotLottie, MSDF, Vello CPU | Vello compute renderer |
| WebGPU in Chrome, Edge and Safari 26; Firefox on Windows and macOS | Firefox Linux/Android WebGPU (shipping date unverified) |
| PySR, SINDy (offline) | Automatic "relative-meta-logic" law switching at runtime (no existing product found) |
| 3D Gaussian splats for static scenes (Spark) | Physically simulated splats |

### 9.4 License flags

| Item | Status |
|---|---|
| NVIDIA FleX | **NON-PERMISSIVE** (NVIDIA 1-way commercial source license); do not use. Reimplement the published method instead |
| MERL BRDF database | **NON-PERMISSIVE** (research/academic only); validation only, never shipped |
| Bullet3 "Extras" and ThirdPartyLibs, KTX-Software | Mixed or NOASSERTION; read the LICENSE before vendoring |
| Havok (`@babylonjs/havok`) | MIT binary but closed source; acceptable to use, but not "open source" in spirit |
| Everything else listed in 9.1 | MIT, Apache-2.0, BSD-3 or zlib |

### 9.5 Not verified (do not rely on these without further checking)

- The date Warp changed to Apache-2.0.
- Genshin's rendering details (GDC talk paywalled).
- The exact WGSL/WebGPU floating-point precision guarantees.
- The Firefox WebGPU shipping date on Linux and Android.
- Whether `box2d3-wasm` compiles with the flags Box2D needs for cross-platform determinism.
- Vendor speed claims (Genesis, Box2D "2x faster than v2.4").
