# The Links Universe — Lore Core

Covers requirements **R12, R13, R15, R16, R30** and **D3, D4**.
Sources, quotes and the full concept glossary are in
[research-links-theory-lore.md](../../case-studies/issue-1/data/research-links-theory-lore.md).

> "Everything is a link." — the first line of every Links story.

## Where the lore comes from

The universe is built from the ideas of
[linksplatform](https://github.com/linksplatform) and
[link-foundation](https://github.com/link-foundation): **Links Theory**
(`L ↦ L²`, "a link links links"), Links Notation (LiNo), and the constants
of the Links data libraries (`Null`, `Any`, `Itself`, `Continue`,
`Break`, `Skip`, `Error`). Every character **is** one concept, the way
every Numberblock _is_ a number: a child who plays with the characters is
playing with the real structure of the theory, and an adult finds the
second layer of jokes and references.

We do not invent a separate fantasy world and then sprinkle theory on top.
The **world rules below are the theory**, retold for a four-year-old.

## The world: Omi

**Omi** is a round, soft planet whose surface is a woven net of glowing
threads. Every being, object and place in Omi is a Link — a little
creature with two hands, a red one (where it reaches **from**) and a blue
one (where it reaches **to**). When two Links hold hands, a thread appears
between them. All the threads together are Omi itself.

In the middle of Omi grows the first tree, from the first seed: **Akoren**,
a tiny glowing acorn that hugs itself (`∞ → ∞`). Every Link in the world
can trace its threads back to Akoren.

### World rules

These are the "physics" of the universe. A story or game that breaks one
of them is a lore bug.

| #   | Rule (for kids)                                     | Theory behind it                                     | Lesson                                       |
| --- | --------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------- |
| 1   | Everything is a Link.                               | `L ↦ L²`: a link is made of links.                   | Everything is connected.                     |
| 2   | Everyone has an address; no one is ever lost.       | Every link has an index; Ω addresses everything.     | You can always be found; ask for help.       |
| 3   | Two hands, one direction.                           | Doublet `(source, target)`; an edge is two doublets. | Kindness flows; you can make it mutual.      |
| 4   | When two friends meet, a third one makes it happen. | Triplet `source–linker–target`.                      | Actions connect us.                          |
| 5   | No friendship is made twice.                        | Uniqueness resolver: no duplicate links.             | Share instead of copying.                    |
| 6   | Let go gently before you leave.                     | Reset to `(0, 0)` before delete; usages validator.   | Healthy goodbyes; check who needs you.       |
| 7   | There is one magic spell: "this becomes that".      | Substitution is the one universal operation.         | You can always change things for the better. |
| 8   | Zero is a resting place, not a scary void.          | `Null = 0` means "no link".                          | Rest is important; empty is OK.              |
| 9   | "Any" opens doors that match everyone.              | `Any` is the wildcard of queries.                    | Everyone is welcome.                         |
| 10  | The world describes itself.                         | Ω and the cycle of definitions point to themselves.  | (adults) You are part of the story.          |

### Visual rules

| Element         | Rule                                                                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Role colors     | **Coral red `#FF5A5F` = from/source**, **leaf green `#3BB273` = linker/action**, **sky blue `#3A86FF` = to/target** (proposal, see open questions). |
| Accent          | Sunshine yellow `#FFD166` for sparks, dashes and rewards.                                                                                           |
| Lines           | Soft gray `#4D4D4D` outlines, `#F2F2F2` backgrounds; never pure black backgrounds in kids modes.                                                    |
| Shapes by role  | Round = source, square = target, triangle = linker — so roles never depend on color alone (color-blind safe).                                       |
| Signature motif | Every Link has at least one "hand-arrow" that can link to another character; linking plays a sparkle and a soft "boop".                             |
| Reserved motif  | The infinity loop belongs only to Itsy, Akoren and Omi — the "self" and the "whole".                                                                |
| Silhouette test | Every design must be recognizable as a pure black silhouette at 48×48 px.                                                                           |

The current [linksplatform avatar](https://github.com/linksplatform) is
already a face: a red eye, a blue eye and an arrow-smile between them. That
face becomes **Linky**, so the games continue an identity that already
exists rather than replacing it.

## Styles (R30)

One cast, several looks. Each character sheet in
[characters.md](characters.md) defines all of them.

| Style                  | Used for                                | Rules                                                                                                  |
| ---------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Chibi 2D** (primary) | All games, toddlers to adults, stickers | Head-to-body 1:1 to 1:2, big low-set eyes, mouth optional at rest, flat fills with one shadow tone.    |
| **Sticker / pixel**    | Messengers, organization avatars, icons | 2–3 colors, readable at 16–48 px.                                                                      |
| **Normal anime 2D**    | Older players, story games, episodes    | Humanoid hosts at 1:6–1:7, soft cel shading; Link creatures stay chibi as companions.                  |
| **Toy-like 3D**        | 3D games, merch prototypes              | Few primitives (sphere, rounded cube, cone), felt or vinyl material, rim light; links as bezier ropes. |
| **Anime-shaded 3D**    | Humanoid hosts in 3D                    | Toon shader with outlines; same palette and role colors.                                               |

Consistency across styles: the red/blue hands (or eyes) are always present
on Link characters, and green appears whenever something happens.

## Tone of voice

- Short sentences, warm and curious; humor from surprise, sound and
  physical comedy — never sarcasm aimed at the player.
- Problems are puzzles, misunderstandings or lost things — never violence.
  Breaking a link is "letting go" or "rearranging", never a punishment.
- No "Game Over": Oopsy says "Let's try again!"
- Nully is never scary; with toddlers we say "nap", not "void" or "delete".
- Every lesson has a second layer for adults (LiNo puns, `L ↦ L²` Easter
  eggs, the self-describing world) — Pixar-style writing for two audiences.
- In-product voice is always kind; a cheekier voice is allowed only on
  adult social media channels.

The [adorability gate](adorability-gate.md) turns these rules into a
checklist that every pull request passes.

## Wisdom bank

One-liners for loading screens, level ends and the "lesson of the day".
Every new line must be true both in Links Theory and in life.

| Line                                              | Character     | Theory link                  |
| ------------------------------------------------- | ------------- | ---------------------------- |
| "Everything is connected."                        | Linky         | `L ↦ L²`                     |
| "A link is a beginning and an end holding hands." | Soru & Tari   | Doublet                      |
| "Big trees grow from tiny acorns."                | Akoren        | `∞`, the associative root    |
| "No one is lost; everyone has an address."        | Postie        | Index, Ω                     |
| "Let go gently."                                  | Letgo         | Reset before delete          |
| "Oops means you're learning."                     | Oopsy         | `Error`                      |
| "Rest is important. Nothing is also something."   | Nully         | `Null`                       |
| "Everyone is welcome."                            | Anya          | `Any`                        |
| "Big things are made of small steps."             | Choo-Choo Seq | Sequences of pairs           |
| "Share instead of copying."                       | Uni           | Uniqueness                   |
| "Truth can depend on where you stand."            | Rela          | Relative meta logic          |
| "Small words build big ideas."                    | Prime Sprites | Semantic primes              |
| "Two can be one, and one can be two."             | Akoren        | Two-in-oneness (deep theory) |
| "There is always one more way to link."           | Linky         | Unlimited alphabet of links  |

The wisdom bank lives as LiNo in `links-games/lore`, so the games,
translators and formal-ai all read the same data:

```
wisdom (everything-connected: (says Linky) (text "Everything is connected."))
wisdom (tiny-acorns: (says Akoren) (text "Big trees grow from tiny acorns."))
```

## Story seeds

Each seed can become a game level pack, a short episode or a sticker set.

| Seed                         | Story                                                                                                                   | Lesson                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **The First Link** (origin)  | Akoren, alone and hugging itself, reaches out a red hand and a blue hand and becomes two; the two link and become many. | Everything begins somewhere.              |
| **Linky's Lost Hand**        | Linky's blue hand holds nothing; the quest is to find a friend to hold.                                                 | It's OK to look for friends.              |
| **Itsy's Mirror**            | Itsy learns that hugging yourself helps you hug others.                                                                 | Self-acceptance before connection.        |
| **Go, Stop and Hop**         | Traffic-light siblings run a crossing and argue about when to go.                                                       | Self-regulation.                          |
| **Oopsy's Very Big Oops**    | Oopsy makes a duplicate link; Uni explains gently.                                                                      | Mistakes are fine; sharing beats copying. |
| **Choo-Choo Seq's Train**    | Building trains from pairs of pairs.                                                                                    | Patterns, counting, recursion.            |
| **The LiNo Family Picnic**   | "papa has car", "mama has house" become links on screen.                                                                | Early reading as linking words.           |
| **Letgo and the Moving Day** | A gentle story about moving house.                                                                                      | Change and goodbyes.                      |
| **Prime Sprites**            | Collect the 65 meaning-sprites; I + WANT + GOOD makes a sentence.                                                       | Every language shares small words.        |
| **Cadets of Depth Academy**  | Players graduate point → doublet → triplet → sequence → network; the last level shows Omi contains itself.              | (adults) The self-describing world.       |

## The second layer: First Contact (R42)

Omi is the gentle layer for toddlers and children. Above it, for teens and
adults, is the realistic layer of **[First Contact](first-contact.md)**: the
peaceful, advanced civilization **Reya** meets the violent anti-utopia
**Shacados**. It is the setting of our last, fully realistic multi-genre
simulator, and its rules are real physics. The proposed bridge between the
layers is that Omi is the learning world of Reyan children, so growing up
through our games is growing up as a Reyan
([details](first-contact.md#how-it-connects-to-omi-and-the-links-proposal)).

## How the universe connects all games (R15, D3)

- **One cast** appears in every game: each game has a star from the
  [catalog](../game-catalog.md), and the others cameo.
- **One collection:** finishing a lesson in any game unlocks a character
  card, sticker or costume, shown in **Linky Home** (the hub game).
- **One profile:** the `@links-games/profile` package keeps the collection
  and progress across games and platforms.
- **One map:** every game is a place in Omi (Pair Friends is the Twin
  Meadow, Bead Merge is Akoren's Garden, Letter Train runs on the Sequence
  Line, …), so the hub's map grows as new games ship.
- **One calendar:** daily challenges share a seed, so families can play
  "today's puzzle" together.

## Lore governance

- `links-games/lore` is the canonical source; game repositories import it
  through `@links-games/characters` and `@links-games/i18n`.
- Changes to world rules or character sheets need two reviews: the
  [adorability gate](adorability-gate.md) and a **theory consistency
  check** (a maintainer who knows Links Theory confirms the metaphor stays
  true).
- Lore text is CC0; character names and designs are protected as
  trademarks ([legal](../legal.md#licensing)).

## Open questions

1. **Canonical role colors.** The linksplatform avatar uses red source and
   blue target with a green ring; figure 10 of "The Links Theory 0.0.2"
   uses green for "to". Proposed: red = source, green = linker,
   blue = target.
2. **Names.** "Linky" is also the name of a French smart electricity meter;
   "Omi" and "Uni" are common words. Trademark searches decide the final
   names; working names stay until then.
3. **Hero design.** Proposed: Linky continues the existing linksplatform
   avatar face, for continuity.
4. **Humanoid hosts for toddlers?** Proposed: creatures only in toddler
   mode, anime hosts from the children tier up.
5. **Russian-language sources.** Deep Theory poetry and the 0.0.3 draft are
   in Russian; proposed: official translations live in the lore repository
   with the original next to them.
