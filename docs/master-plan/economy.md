# In-Game Economy — Resources, Not Money

Covers requirement **R38** (see the
[requirements](../case-studies/issue-1/requirements.md)). From the
maintainer's [PR #2 comment](https://github.com/links-games/master-plan/pull/2#issuecomment-6189666260):

> Our games should be focused on resource based economy, not money, where
> possible.

This document is about the economy **inside** the games. How the
organization earns real money is a separate question answered by
[monetization](monetization.md) and the [business model](business-model.md);
the two meet only at the boundary described [below](#the-boundary-with-real-money).

## What "resource-based" means for us

A resource-based economy, as described by Jacque Fresco and
[The Venus Project](https://www.thevenusproject.com/resource-based-economy/),
allocates goods and services by the available resources and people's needs,
instead of by money and trade. We do not take a political position on that
proposal; we borrow its **game-design idea**: players reason about real
quantities (energy, materials, water, time, attention, knowledge) and real
needs, not about prices.

For shared resources we also use the design principles from Elinor
Ostrom's _Governing the Commons_ (1990), which show how communities manage
commons without either a market or a ruler: clear boundaries, rules that fit
local conditions, collective choice, monitoring, graduated responses,
conflict resolution, the right to organize, and nested levels.

## Rules for every game

1. **No in-game money where a real resource can do the job.** A garden
   needs water, light and seeds, not coins. A station needs energy, mass and
   time, not credits.
2. **Conservation.** Resources come from sources, go through converters
   and end in sinks — like matter and energy. Nothing appears from nowhere,
   so the economy itself teaches physics and ecology. The flows are modeled
   as a graph in `@links-games/economy` (sources, pools, converters, drains,
   in the style of Joris Dormans' Machinations diagrams) so they can be
   simulated and balanced before a game ships.
3. **Needs first.** Goals are expressed as needs met (everyone fed, the
   habitat warm, the probe fueled), not as a balance to grow.
4. **Sharing beats hoarding.** Mechanics reward giving, lending, repairing
   and reusing: a "library of things", shared tools, gifts between players
   that cost the giver nothing they need.
5. **Abundance through knowledge.** The main way to get more is to learn —
   a better converter, a smarter route, recycling — so progress is
   understanding, which is the [mission](README.md#mission).
6. **Scarcity is a puzzle, never a pressure.** Limited resources make
   interesting choices, but no timer or energy system is ever sold; the
   [generosity charter](monetization.md#generosity-charter) still applies.
7. **Success is measured in wellbeing.** Scores are lives kept safe,
   creatures happy, knowledge collected and trust built — not wealth.

## Where money stays (the "where possible" clause)

Some genres and lessons are about money itself. We keep money only where it
**is** the lesson, and then teach it honestly:

| Case                                                     | What we do                                                                                    |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Financial literacy for children (counting coins, saving) | Money is the topic; prices are real, there is no premium currency.                            |
| Shop and restaurant simulators                           | Reframe as a community kitchen or a repair café that serves needs; ingredients are resources. |
| Trading and tycoon genres                                | Reframe as logistics: move resources to where they are needed; score is needs met per energy. |
| Strategy with two economies (First Contact)              | Raya run a resource-based economy, Shacados a scarcity economy; the contrast is the lesson.   |

## The economy as an educational ladder

The same rules scale with the [complexity ladder](game-ideas.md#complexity-ladder):

| Level                | Example games                          | Resources                                   |
| -------------------- | -------------------------------------- | ------------------------------------------- |
| Toddlers             | Feed the Links, garden                 | Water, food, sunlight — counted in icons    |
| Children             | Farm, town builder, recycling sorter   | Materials, energy, time; first converters   |
| Teens and adults     | Colony, logistics, ecosystem sim       | Full flow graphs, commons rules, trade-offs |
| Realistic simulators | [First Contact](lore/first-contact.md) | Physical units: joules, kilograms, seconds  |

At the top of the ladder the economy is no longer a game abstraction: the
"resources" are the same physical quantities the
[simulation engine](simulation-engine.md) computes, so what the player
learns about energy and materials is transferable to the real world.

## The boundary with real money

- Real money never buys in-game resources, progress or advantages. Players
  can support the project (donations, supporter subscription, cosmetic
  thank-you packs) as described in [monetization](monetization.md), and
  those rewards stay **outside** the resource economy (costumes, themes,
  credits).
- There is no premium currency and no exchange between real money and
  in-game resources ([never-list](monetization.md#the-never-list)).
- Resources are earned only by playing and are never time-gated to sell
  skips.

## Open questions

1. Should `@links-games/economy` be its own package or part of
   `game-core` from the start?
2. Do we show a "resource flow" view to players in older tiers, as a
   lesson in itself?
