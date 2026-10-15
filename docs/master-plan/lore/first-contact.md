# First Contact — Reya and Shacados

The second lore layer of the Links universe and the setting of our last,
**fully realistic multi-genre simulator** (see the
[complexity ladder](../game-ideas.md#complexity-ladder) and the
[simulation engine](../simulation-engine.md)). It comes from the maintainer's
[PR #2 comment](https://github.com/links-games/master-plan/pull/2#issuecomment-6189666260)
and the pilot scene by Konstantin Dyachenko
([source and translation](../../case-studies/issue-1/data/first-contact-pilot-scene.md)).

> We also should focus on non-violence games and universe lore here, by the
> pilot scene of a first contact … There should be Reya (highly
> technologically and scientifically advanced civilization — non violent
> civilization) and Shacados (highly violent anti utopia civilization with
> primitive just enough space exploration tech) planets in their start
> systems, which meet on the contrast of their differences.

Status: **draft for maintainer review**. Everything marked _(proposal)_
is our assumption and is listed again in [Open questions](#open-questions).

## The two civilizations

|                     | **Reya**                                                                                                      | **Shacados**                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Who they are        | Humanlike beings; a highly advanced scientific and technological civilization                                 | A violent anti-utopia; a hierarchy where fear is the main tool of control                                    |
| Principles          | Reduce pain, keep the peace, minimize harm (verbatim from the pilot)                                          | Strength decides; the ones on top take, the ones below obey _(proposal)_                                     |
| Economy             | Resource-based: shared resources, needs-first allocation, no money _(proposal, see [economy](../economy.md))_ | Scarcity and tribute; resources are hoarded by whoever controls the force _(proposal)_                       |
| Technology          | Electromagnetic launch rails, full-spectrum sensors, autonomous correlation centers, precise lasers           | "Primitive, just enough" for space flight: chemical or simple fusion drives, radio and laser remote control  |
| Space               | Frontier asteroid stations around their start system                                                          | Their own start system; first probes sent outward                                                            |
| How they compute    | A distributed network of supercomputers that finishes an analysis in milliseconds                             | Centralized, slow; remote control needs a nearby operator (see [physics check](#physics-check-of-the-pilot)) |
| What they can learn | That kindness needs strength and patience, not only rules                                                     | That cooperation produces more than force — the hope of the whole story                                      |

**Start systems** _(proposal)_: each civilization starts on its own planet
in its own star system. The systems are close enough for slow, primitive
probes to cross in a human-scale time, which suggests a binary star or two
neighboring systems a few light-years apart; the exact astronomy is chosen
with the simulator (real orbits, real light delays, no faster-than-light
travel, see [world rules](#world-rules-of-the-realistic-layer)).

**The contrast** is the engine of the story: Reya are strong but refuse to
harm; Shacados are weak but willing to harm. Every encounter asks the
pilot's question: _can Reya use their defense for good without harming
their guests, or is it time to compromise their principles?_ Our answer, in
every game, is that there is always a better move than violence — finding it
is the puzzle.

## The pilot scene, retold

A Reyan frontier asteroid station detects an object 2 million km away,
moving at 40,000 km/s straight at the point where the station will be in
50 seconds. The solution-search system picks the goal **capture the object
to study it, minimizing damage**, refits a free probe with sensors and
manipulators, and launches it on electromagnetic rails. The probe scans the
cylinder-shaped object, a correlation center finds the circuit that controls
it, and a precise laser pulse burns one wire so the object goes into
standby. The probe brings it home at 250 km/s, and the station sends probes
to find the object's source and make contact.

The full text and our translation are in the
[case study data](../../case-studies/issue-1/data/first-contact-pilot-scene.md).

**Our reading** _(proposal)_: the station is Reyan and the object is the
first Shacados probe. The scene does not name either side.

## Physics check of the pilot

The simulator promise is that the final game is "actually real", so we
checked the scene like a level. The script is
[`examples/first-contact-physics.mjs`](../../../examples/first-contact-physics.mjs)
(run `node examples/first-contact-physics.mjs` or add a speed in units of
_c_, for example `0.5`); the numbers below are asserted by
[`tests/first-contact-physics.test.js`](../../../tests/first-contact-physics.test.js).

| Check                              | Result                                                                                                                                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Impact window                      | 2,000,000 km / 40,000 km/s = **50 s** — consistent with the text.                                                                                                                        |
| Launch time                        | 0.01 s analysis + max(2.4 + 1.2, 4.5) s refit + 0.5 s rails + 0.001 s launch = **5.011 s**.                                                                                              |
| Probe speed 500,000 km/s           | **Faster than light** (_c_ ≈ 299,792 km/s) — the only physical error in the scene.                                                                                                       |
| Proposed fix: probe at 0.5 _c_     | Intercept at **14.5 s**, about 1.42 million km out, leaving **35.5 s** before impact — still a tense, winnable scene.                                                                    |
| Light delay                        | Light from 2 million km takes **6.67 s**; the object is really at about **1,733,000 km** when it is "seen". Reyan sensors must predict, not just look.                                   |
| Energy of the object               | At 40,000 km/s (γ ≈ 1.009) every tonne carries about **194 megatons TNT** — the object is a planet-killer by speed alone, even with no warhead.                                          |
| Stop or deflect?                   | Stopping it before the station (probe at 0.5 _c_) needs about 57,000 _g_ for 35 s; a sideways push of only **2.8 km/s** makes it miss by 100 km. Deflecting is the harm-minimizing move. |
| Escorting the object               | To fly "synchronously", the probe must change its speed by about **178,000 km/s** relative to the object (relativistic velocity addition) — a huge maneuver budget.                      |
| Correlation center in 0.002 s      | A round trip of 0.002 s at light speed limits the center to **about 300 km** away, so it is on board the probe or on the station's nearby escort.                                        |
| Laser remote control of the object | Light lag over millions of km makes real-time remote control impossible, so a **Shacados controller must be near** — a hook for the next scene.                                          |
| Launch rails                       | 0.5 _c_ in 0.001 s means about 1.5 × 10¹⁰ _g_; even Reyan rails need a longer track or a slower launch _(open question)_.                                                                |
| Probe energy at 0.5 _c_            | About **3.3 megatons TNT per kilogram** of probe — Reya are clearly powerful, which makes their restraint meaningful.                                                                    |

These findings are not corrections forced on the author; they are proposals
the author may accept, change or overrule. They also show the educational
value of the setting: one short scene teaches the speed of light, light
delay, relativistic kinetic energy, velocity addition and why deflecting is
cheaper than stopping.

## World rules of the realistic layer

1. **Real physics only.** No faster-than-light travel, no sound in space,
   real orbits and real light delay. Exceptions need a written
   justification in `links-games/lore` and a physics review.
2. **Every number is checkable.** Each scene with numbers ships a script
   like the one above and a test, so the lore never drifts from physics.
3. **Non-violence by design.** Reyan options are always to observe,
   predict, deflect, disable, capture, shelter, repair, talk and teach.
   There is no "destroy" verb for the player. Shacados violence happens off
   screen or as a threat to be prevented, never as a reward.
4. **Shacados are never dehumanized.** They are people inside a cruel
   system. Their scenes show individuals who doubt, help or escape; the
   enemy is the system and the scarcity, not the people.
5. **Resources, not money.** Reyan players manage energy, materials, time
   and attention ([economy](../economy.md)); success is measured in lives
   kept safe, knowledge gained and trust built.
6. **Age tiers.** Toddlers and children never see Shacados threats; they
   meet Reya only through the gentle Omi layer below. The Reya–Shacados
   conflict is for the teens and adults tier
   ([age tiers](characters.md#age-tiers)).

## How it connects to Omi and the Links (proposal)

- **Omi is a Reyan learning world.** The small, adorable games are the
  games Reyan children play to learn science, logic and kindness. Growing
  up through our catalog is literally growing up as a Reyan.
- **The Links are Reya's associative network.** The red/blue/green link
  creatures are how Reyan children see their knowledge network; the
  autonomous correlation centers of the pilot are the adult form of the same
  idea.
- **Lina and the hosts are young Reyans** — the "Cadets of Depth Academy"
  story seed in the [lore core](README.md#story-seeds) becomes the Reyan
  academy that trains station crews.
- **The last game is the first contact itself:** a realistic multi-genre
  simulator where a player who grew up in Omi runs a frontier station and
  meets Shacados.

## Game seeds from the setting

| Seed                     | Genre                           | What it teaches                                      |
| ------------------------ | ------------------------------- | ---------------------------------------------------- |
| Station Watch            | Idle / monitoring sim           | Orbits, detection, light delay                       |
| Deflect!                 | Physics puzzle (2D vector)      | Momentum, impulse, why a small push early is enough  |
| Probe Workshop           | Construction / engineering      | Mass budgets, sensors, rails, energy                 |
| Correlation Center       | Logic / deduction               | Signal analysis, finding the controlling circuit     |
| Light-Lag Chess          | Turn-based strategy             | Information arrives late; plan with predictions      |
| Two Planets              | Economy / city builder          | Resource-based economy versus scarcity               |
| Messages Across the Dark | Language and code puzzle        | Building a shared language from math (first contact) |
| The Escape               | Narrative adventure (13+)       | Empathy for people inside a violent system           |
| First Contact (final)    | Realistic multi-genre simulator | All of the above at once, at real scale              |

The full list lives in the [game ideas](../game-ideas.md) catalog.

## Open questions

1. Is the pilot's station Reyan and the object a Shacados probe?
2. Should the probe speed become 0.5 _c_ (or another sub-light value), and
   the rail launch longer than 0.001 s?
3. How far apart are the two start systems, and is it one binary system?
4. Is Omi a Reyan learning world, and are Lina and the hosts young Reyans?
5. How do Shacados look — humanlike like Reya, or a different species?
6. Does the setting stay under Unlicense like the rest of the lore, and does
   the author of the pilot agree to that?
