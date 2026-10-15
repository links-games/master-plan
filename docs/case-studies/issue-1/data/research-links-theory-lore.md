# Research Note: Links Theory as the Core of a Cute Lore Universe

> Status: research note for issue #1 (https://github.com/links-games/master-plan/issues/1).
> This is not a final design. It collects facts with sources and offers a first
> mapping from Links Theory concepts to characters, lessons and world rules. Use it
> as raw material for the lore bible and the adorability gate.

The issue asks us to "check github.com/linksplatform and produce some lore core, where we
try to use links as characters", to keep everything "cute, funny and likable by toddlers,
children and adults" ("if something is not adorable it is a bug"), and to connect all games
and apps into "a single ecosystem/universe with common lore containing lots of wisdom and
useful lessons", including "meta links theory related characters" and our own anime
characters in chibi and normal 3D styles.

---

## 1. Primary sources

### 1.1 Organizations

| Org | Self-description | URL |
|---|---|---|
| linksplatform | "A cross-platform modular framework for automation of automation." The profile README ends with "P.S. L ↦ L × L". | https://github.com/linksplatform, https://github.com/linksplatform/.github/blob/main/profile/README.md |
| link-foundation | "The foundation of foundations. Our mission is linkness." The profile is titled "Welcome to the Deep (L ↦ L²)". | https://github.com/link-foundation, https://github.com/link-foundation/.github |
| link-assistant | AI assistant tooling plus language research (semantic-primes, human-language) | https://github.com/link-assistant |
| deep-foundation | "associative technology development bay" | https://github.com/deep-foundation |
| links-games | this project | https://github.com/links-games |

The linksplatform master plan, from its profile README, has four steps: (1) the best
database, (2) source-to-source translators, (3) a GitHub bot that does the average
programmer's tasks, and (4) automating automation.

### 1.2 Repositories read for this note

All were shallow-cloned read-only into `/tmp/research-clones/`.

- Theory
  - https://github.com/link-foundation/meta-theory (archive of article versions 0.0.0 to 0.0.2, plus draft 0.0.3)
  - https://github.com/deep-foundation/deep-theory (mirrored at https://github.com/link-foundation/deep-theory)
- Notation and language
  - https://github.com/link-foundation/links-notation (LiNo)
  - https://github.com/link-foundation/meta-notation
  - https://github.com/link-foundation/meta-language
  - https://github.com/link-foundation/meta-ontology
  - https://github.com/link-foundation/relative-meta-logic
  - https://github.com/link-foundation/link-cli
- Language research
  - https://github.com/link-assistant/semantic-primes
  - https://github.com/link-assistant/human-language (live: https://link-assistant.github.io/human-language/)
- Implementations
  - https://github.com/linksplatform/Data (`LinksConstants.cs`, `Point.cs`, `ILinks`)
  - https://github.com/linksplatform/Data.Doublets
  - https://github.com/linksplatform/Data.Doublets.Sequences
  - https://github.com/linksplatform/Data.Triplets
  - https://github.com/linksplatform/doublets-rs
- Documentation and site
  - https://github.com/linksplatform/Documentation (logos, figures, intro animation)
  - https://linksplatform.github.io (site, including https://linksplatform.github.io/itself.html)

### 1.3 Habr articles

| Version / topic | Title | URL |
|---|---|---|
| 0.0.0 | "Math introduction to Deep Theory" (Ivan Glazunov, 2022-04-01) | https://habr.com/en/articles/658705/ |
| Earlier post (RU) | Deep Theory predecessor post | https://habr.com/ru/post/656879/ |
| Link definition (RU) | Deep.Foundation article on the definition of a link | https://habr.com/ru/companies/deepfoundation/articles/576398 |
| 0.0.1 (RU) | "Глубокая Теория Связей 0.0.1" (Deep Links Theory 0.0.1) | https://habr.com/ru/articles/804617/ (also https://habr.com/ru/companies/deepfoundation/articles/804617/) |
| 0.0.2 (EN) | "The Links Theory 0.0.2" (Konard, 2025-04-01) | https://habr.com/en/articles/895896/ |
| 0.0.3 | Draft only, in Russian, with Rocq/Lean formalization | https://github.com/link-foundation/meta-theory/tree/main/drafts/0.0.3 |

Authors listed across versions: Vasily Solopov, Roman Vertushkin, Ivan Glazunov and
Konstantin Diachenko (Konard).

Community channels:
- Telegram: https://t.me/unilinkness
- Discord: https://discord.gg/eEXJyjWv5e
- Deep's Discord has a role called "Cadet of Depth", a lovely lore hook.

---

## 2. Core concepts glossary, with citations

Facts come from "The Links Theory 0.0.2" (https://habr.com/en/articles/895896/) unless
another source is given.

| Concept | What the sources say | Kid-level paraphrase |
|---|---|---|
| **Core formula** | `L ↦ L²` / `L → L × L` for doublets and `L ↦ L³` for triplets (linksplatform and link-foundation profiles). | "A link is made of links." |
| **Link** | "an n-tuple of references to links, which has its own reference that other links can use to refer to it." It has an "asymmetrical recursive (fractal) structure... a link links links." It has direction, from source (beginning) to target (end). | A link is a friend who holds two hands and has its own name. |
| **Reference** | Needed only because set theory lacks circular definitions. "A reference is simply a special case of a link." In draft 0.0.3, a reference is a zero-dimensional link, `r ≡ (r, ())`. | A name tag, which is itself a tiny link. |
| **Doublet** | `(source, target)`. Source is also called beginning, start, first, left or subject. Target is also called ending, stop, last, right, predicate or object. Example: `1→(1,1)`, `2→(2,2)`, `3→(1,2)`. | Two hands: "from" and "to". |
| **Triplet** | `Source–Linker–Target`. The linker is a verb, action, type, category, predicate, transition or algorithm. Example: `4→(1,2,3)`. In figure 10, red = from, blue = type and green = to. Implementation: https://github.com/linksplatform/Data.Triplets | Subject, verb, object: "Cat likes milk." |
| **Point / self-link / Itself** | A link that refers to itself. The figure 6 caption says it "resembles an infinity symbol". In graph terms, a vertex is a self-referential link. See also http://linksplatform.github.io/itself.html (animated "Closed link"). `Point.cs` has `IsFullPoint`, where all parts equal the index (https://github.com/linksplatform/Data). | A friend hugging themselves: "I am me." |
| **Graph edge** | An undirected edge is two doublets pointing in opposite directions. | Holding hands both ways. |
| **Sequence** | An n-tuple can be built from nested doublets, e.g. `[1,2,3,4] = ((1,2),(3,4))`. Data.Doublets.Sequences has Balanced, Compressing and Optimal converters, left/right/leveled walkers, Unicode strings as links, and unary numbers (https://github.com/linksplatform/Data.Doublets.Sequences). | A train of pairs; words made of letter friends. |
| **Index / Address** | Each link has an index (`IndexPart = 0`), plus `SourcePart` and `TargetPart`. doublets-rs stores a link as Index, Source, Target in file-mapped memory with size-balanced trees (https://github.com/linksplatform/doublets-rs). | Everyone has a house number. |
| **Null** | `Null = default (0)`, meaning no link (`LinksConstants.cs` in https://github.com/linksplatform/Data). | Empty seat number 0. |
| **Continue / Break / Skip** | Special handler return values. Counting down from the max internal reference: `Continue = max`, `Break = max-1`, `Skip = max-2`. | "Keep going", "stop", "skip this one". |
| **Any** | `Any = max-3`, a wildcard meaning "no restriction" in queries. | "Anyone can come!" |
| **Itself (constant)** | `Itself = max-4`, a "link-reference to the link itself". Decorators such as `LinksItselfConstantToSelfReferenceResolver` turn it into a real self-reference. | Pointing at your own chest. |
| **Error** | `Error = max-5`. | Oops! |
| **CRUD / substitution** | The ILinks API has `Count`, `Each`, `Create`, `Update(restriction, substitution)` and `Delete`. link-cli unifies them into one substitution operation in the spirit of Markov algorithms, e.g. `(1: 1 1)`, update to `(1: 1 2)`, delete all with `(* *)` (https://github.com/link-foundation/link-cli). | One magic spell: "turn this into that". |
| **Uniqueness** | `LinksUniquenessResolver` and `LinksUniquenessValidator` prevent duplicate links (https://github.com/linksplatform/Data.Doublets). | No need to say the same thing twice. |
| **Usages / unlinking** | `LinksUsagesValidator`: you cannot delete a link others still use. `LinksCascadeUsagesResolver` deletes dependents. `NonNullContentsLinkDeletionResolver`: reset a link to `(0,0)` before deleting. The README example calls `Update(link, default, default)` and then `Delete`. | You let go of hands gently before you leave, and you check that nobody is still holding on. |
| **Turing completeness** | Doublets can represent a Turing machine tape. "In links the 'alphabet' is essentially unlimited." | Links can build anything. |
| **Network** | Draft 0.0.3: "A network is a link of links." | A family of families. |
| **Ω, network of all networks** | Draft 0.0.3: `Ω: R → 𝒩`. Everything is addressable, and Ω is addressable in itself. | The whole world, which also has an address. |
| **Cycle of definitions** | Draft 0.0.3: links → sequences → sets → meta-links. The meta-theory defines itself, formalized in Rocq/Lean (e.g. theorem `meta_network_is_duplet_network`). | A circle of friends who introduce each other. |
| **Inspiration** | Simon Williams' Associative Model of Data, where the "Item" is a self-referential link. | — |

### 2.1 Performance as a lore flex

The Rust doublets implementation is reported as 1746–15745x faster than PostgreSQL on writes
and 100–9694x faster on reads (https://github.com/linksplatform/Comparisons.PostgreSQLVSDoublets).
In the lore, Linky can be "the fastest hand-holder in the universe".

### 2.2 Deep Theory poetry (Russian)

From https://github.com/deep-foundation/deep-theory, `sequence.md` and `anum_docs`:

- "Всё есть связь": "Everything is a link."
- "Связь есть определение начала и конца": "A link is the definition of a beginning and an end."
- The beginning is a link of unity with duality, and the end is a link of duality with unity.
- "Двуединство есть единство дуальности": "Two-in-oneness is the unity of duality."
- "В начале была последовательность, и последовательность была у субъекта, и последовательность была субъектом": "In the beginning was the sequence, and the sequence was with the subject, and the sequence was the subject."
- The axioms in `anum_docs` are "Существуют только связи" ("only links exist") and a link `r → v`. They define these operators:
  - `♂v ≡ ♂v→v`, a self-closed beginning
  - `r♀ ≡ r→r♀`, infinite recursion
  - `∞ ≡ ∞→∞`, the fully self-closed link
- Reflection rules: `-ab = ba` and `-∞ = ∞`.
- `∞` is unique and is called **"акорень" (akoren)**, the "associative root", the base point from which all other links are built.

Lore note: "akoren" sounds like the English "acorn". A tiny acorn that grows the whole tree of
links makes a perfect wise-elder character.

### 2.3 Deep (deep-foundation) data model

- Deep stores links as `id, type_id, from_id, to_id`, a typed doublet that works as a triplet.
- Values live in separate number, string and object tables.
- Core types include Type, Contain, Value and String.
- A "Node" is a link whose from and to are both 0.
- Handlers react to insert, update and delete.
- Source: https://github.com/deep-foundation

---

## 3. Links Notation (LiNo) examples

Source: https://github.com/link-foundation/links-notation. LiNo has 2 concepts, references
and links, and is implemented in 8 languages. Its README says "most of the text in the world
already may be parsed as links notation". Its official examples are already family-friendly,
which is a gift for kid lore:

```
papa (lovesMama: loves mama)
son lovesMama
daughter lovesMama
all (love mama)
```

```
papa has car
mama has house
(papa and mama) are happy
```

```
I'm a friendly AI.
(I'm a friendly AI too.)
(linksNotation supports (unlimited number (of references) in each link))
```

Indented form. This block:

```
3:
  papa
  loves
  mama
```

is equal to `(3: papa loves mama)`. The doublet form `(id: from to)`, e.g. `(3: 1 2)`, is
used in the 0.0.3 draft and in link-cli.

Related notations:
- meta-notation (https://github.com/link-foundation/meta-notation) is a simpler LiNo without `:` self-reference that parses `()`, `{}`, `[]` and quotes.
- meta-language (https://github.com/link-foundation/meta-language) is "a language about languages", a self-describing language backed by a links network.

### 3.1 Proposed in-game LiNo snippets (our own invention)

These are a teaching device. Kids can read them like sentences.

```
Linky (holds: Red Blue)
Red likes Blue
Blue likes Red
(Red and Blue) are friends
Itself (hugs: Itself Itself)
all (are links)
```

---

## 4. Ontology and language projects as character sources

- **meta-ontology** (https://github.com/link-foundation/meta-ontology) is an ontology that describes itself.
  - It ships the 65 NSM semantic primes of Wierzbicka and Goddard (I, YOU, SOMEONE, SOMETHING, PEOPLE, BODY, KIND, GOOD, BAD, BIG, SMALL, THINK, KNOW, WANT, FEEL, SEE, HEAR, SAY, DO, HAPPEN, LIVE, DIE, ...) in `data/primes/nsm.lino`.
  - It also has about 25 self-referential "link primes" (link, reference, name, concept, thing, object, term, class, property, relation, set, entity, definition) in `data/concepts/core.lino`.
  - These primes form deliberate cycles, e.g. "thing" is defined via "concept" and "concept" via "thing".
- **semantic-primes** (https://github.com/link-assistant/semantic-primes): "A research repository to find a way to formal universal ontology, taxonomy, language".
- **human-language** (https://github.com/link-assistant/human-language, live at https://link-assistant.github.io/human-language/): "A new kind of language for all people on earth". It maps text to sequences of Wikidata Q/P ids and has an Alphabet mode.
- **relative-meta-logic** (https://github.com/link-foundation/relative-meta-logic), formerly Associative-Dependent Logic: "all statements are relative to other statements". It supports probabilistic and fuzzy truth.

Lore use: semantic primes are the smallest words every human language shares. They make an
ideal collectible set of "Prime Sprites", like Alphablocks for meaning rather than for
letters. Relative logic gives a gentle lesson: "the same thing can be true from one side and
not from another; listen to both sides."

---

## 5. Existing visual identity and colors

### 5.1 The linksplatform avatar is already a face

Files: `doc/Avatar-bright.png`, `Avatar-rainbow.png`, `Avatar-dark.png` and the rainbow icons in
https://github.com/linksplatform/Documentation/tree/master/doc. The GitHub org avatar is
https://avatars.githubusercontent.com/u/15116341.

The avatar contains:
- two big filled circles as eyes, red on the left (`#f00`) and blue on the right (`#0026ff`)
- a curved arrow from red to blue as a smiling mouth, with a red-to-blue gradient
- a dashed yellow-to-lime line down to a hollow green ring, which reads as a pendant, tongue or tail

This is a ready-made mascot face. The two eyes are the source and target, the smile is the
link, and the green ring is the third element of the triplet: the linker, or "itself".

### 5.2 Other figures

- `doublet-colored.png` / `.svg`: a gray (`#4d4d4d`) outer circle around a red circle and a blue circle. It looks like two eyes in a round head.
- `triplet-colored.png`: red, blue and green circles inside a circle. It looks like a three-eyed face or a traffic light.
- `point_link.png`: a navy infinity-shaped arrow that loops into itself.
- Other files: `links-en.png/svg`, `links-edge-to-edge.svg`, `ST-dots`, `SLT-dots`, `Links Basics.png`.
- Intro animation: https://raw.githubusercontent.com/LinksPlatform/Documentation/master/doc/Intro/intro-animation-500.gif
- Graphical intro wiki: https://github.com/Konard/LinksPlatform/wiki/How-it-all-began
- https://linksplatform.github.io: a circle logo with "eye" circles, stroke `#555555`, white fill and hover `#DDDDDD`. `itself.html` animates a red closed bezier ("Closed link").

### 5.3 Other org avatars

- **link-foundation** (https://avatars.githubusercontent.com/u/176174013): a fiery orange-red arrow and an icy blue arrow forming an infinity loop on a starry black background. It is the same red/blue duality, now as fire and ice, and it doubles as the `∞` akoren symbol.
- **deep-foundation** (https://avatars.githubusercontent.com/u/62844658): a purple-to-cyan gradient ellipse orbit with two lines, on dark background, with the "deep.foundation" wordmark.
- **link-assistant** (https://avatars.githubusercontent.com/u/245352401): a default GitHub identicon in lime green with a pixel invader-like shape. There is no designed identity.
- **links-games** (https://avatars.githubusercontent.com/u/342928249): a default GitHub identicon in khaki/tan. There is no designed identity yet, which is an opportunity.

### 5.4 Color convention

- In the doublet figures and avatars, **red = source/from/beginning** and **blue = target/to/end**.
- **Green** appears as the third element: the ring in the avatar and the third circle in the triplet logo.
- Caution: in figure 10 of the 0.0.2 article, red = from, blue = type and green = to. The canonical palette therefore needs one decision. Recommendation: red = source, green = linker/verb, blue = target, which matches the avatar.
- Suggested kid palette (proposal):
  - warm coral red `#FF5A5F` (source)
  - sky blue `#3A86FF` (target)
  - leaf green `#3BB273` (linker)
  - sunshine yellow `#FFD166` (the "spark" or dashes)
  - soft gray `#4D4D4D` / `#F2F2F2` (outline and background)
- Accessibility caveat: red/green is the most common color-blindness pair, so roles must also differ by shape, e.g. round source, square target and triangle linker, as Angry Birds does (see section 9).

---

## 6. Concept-to-character mapping (proposal)

Design principle: each character *is* a concept, the way each Numberblock *is* a number. The
character's body shows the concept's structure, and the behavior teaches a lesson that is
true both in Links Theory and in life.

| # | Character (working name) | Concept | Look (chibi) | Personality | Lesson / wisdom |
|---|---|---|---|---|---|
| 1 | **Linky** (hero) | Link / doublet, `L ↦ L²` | Round body built from the avatar face: red left eye, blue right eye, arrow-smile, green ring tail. Two little arms, a red hand and a blue hand. | Curious, warm, always wants to connect things | "Everything is connected." "A friend is someone who holds your hand." |
| 2 | **Soru & Tari** (twins) | Source and Target | Soru is a red round blob and Tari is a blue square blob, holding hands with an arrow between them | Soru starts things and Tari finishes them | "Every journey has a beginning and an end." Direction matters: who gives and who receives. |
| 3 | **Verbi** | Triplet linker (verb/type) | Green triangle with springy legs who stands between the twins | Energetic, always doing something | "Actions connect us." Subject-verb-object as a game of three. |
| 4 | **Itsy (Itself)** | Point / self-link / `Itself` | Infinity-shaped loop that hugs itself, blushing | Calm and self-assured | "Love yourself first. You are your own beginning and end." Self-acceptance. |
| 5 | **Akoren** (wise elder) | `∞` associative root (deep-theory "акорень") | A tiny glowing acorn with an infinity-loop sprout, drawn with link-foundation's fire-and-ice infinity colors | Grandparent energy, speaks in short riddles | "Big trees grow from tiny seeds." "Everything begins somewhere." |
| 6 | **Omi** (the world) | Ω, network of all networks | A planet or bubble-world whose surface is a woven net. Omi is the setting and a gentle narrator. | Motherly, holds everyone | "Everyone has a place and an address. No one is lost." |
| 7 | **Choo-Choo Seq** | Sequence (nested pairs) | A caterpillar or train whose cars are pairs of friends, with pairs inside pairs | Loves order and counting | "Big things are made of small steps." Patterns and order. |
| 8 | **Nully** | Null (0) | A sleepy translucent ghost or empty bubble, seat number 0 | Shy, sweet, often forgotten | "Empty is OK. Rest is important. Nothing is also something." |
| 9 | **Anya (Any)** | Any (wildcard) | A shape-shifting star with a "?" belly | Welcoming, matches everyone | "Everyone is welcome." Inclusiveness and open questions. |
| 10 | **Go, Stop & Hop** | Continue / Break / Skip | Traffic-light siblings: green Go, red Stop, yellow Hop | Go is eager, Stop is careful, Hop is playful | Self-regulation: when to keep going, when to stop, when to skip and come back later. |
| 11 | **Oopsy** | Error | Clumsy little robot with a band-aid and a big smile | Makes mistakes, laughs and tries again | "Mistakes are how we learn." Growth mindset. |
| 12 | **Postie Index** | Index / address | A mail-carrier bird or snail with a satchel of numbered envelopes | Reliable, knows where everyone lives | "Names and addresses help us find each other." Safety lesson: know your home address (age-appropriate). |
| 13 | **Uni** | Uniqueness resolver (deduplication) | A sparkle with one big eye | Gently says "we already have that one!" | "Each friendship is unique. No need to repeat yourself. Share instead of copying." |
| 14 | **Letgo** | Unlinking / delete with reset to `(0,0)` | Soft cloud whose hands open slowly | Kind about goodbyes | "Say goodbye gently: let go of hands first." "You can't leave while someone still needs you." (usages validator) Handles loss and transitions. |
| 15 | **Swappy** | Substitution (the one universal operation) | Magician with a wand that is a two-headed arrow | Playful, loves "turn this into that" | "Change is the only spell. You can always change things for the better." |
| 16 | **Beadles** | Unary numbers (numbers as chains) | Bead-chain creatures; a Beadle of 3 has 3 beads | Like Numberblocks, each number is a character | Counting, addition as linking chains. |
| 17 | **Letterlinks** | Unicode characters and strings as links | Letters who hold hands to make words | Chatty | Reading. A direct parallel to Alphablocks. |
| 18 | **The LiNo Family** | LiNo canonical examples | Papa, Mama, Son, Daughter, with a car and a house | Warm sitcom family | "all (love mama)": family, love, sharing. Teaches reading LiNo as sentences. |
| 19 | **Prime Sprites** | 65 NSM semantic primes | Tiny glowing sprites, one per prime (I, YOU, GOOD, BIG, FEEL, ...) | Collectible, each with one word | "Big ideas are made of a few small words that every language shares." Empathy across cultures. |
| 20 | **Rela** | Relative meta logic | A two-faced (front/back) friendly moon | Sees both sides | "Truth can depend on where you stand. Listen to both sides." |
| 21 | **Notie** | Links Notation | A scroll or notebook creature with parentheses for arms `( )` | Storyteller | "Writing is linking words." |
| 22 | **Cadets of Depth** | Community and players (from Deep's "Cadet of Depth" Discord role) | The player avatars, in chibi uniforms with red/blue badges | Explorers | "Explore deeper. Ask why." |

### 6.1 Relationships, the social graph of the cast

The cast is itself a links network, which is a nice meta joke that adults will enjoy.

```
Linky (holds: Soru Tari)
Verbi (between: Soru Tari)
Itsy (hugs: Itsy Itsy)
Akoren (grows: Omi)
Omi (contains: all)
Anya (welcomes: all)
Seq (carries: (Soru Tari) (Soru Tari))
Oopsy (learns: Oopsy)
```

### 6.2 Possible human and anime cast, beyond creature mascots

The issue asks for "our own anime characters". Human or humanoid hosts can sit beside the
link creatures:

- **Lina** is a link-keeper girl with red and blue hair clips and a green ring necklace taken from the avatar. She carries a LiNo notebook.
- **Doubl and Trip** are twin and triplet siblings.
  - Doubl wears a red and blue hoodie.
  - Trip is the third sibling, who wears green.
- **Professor Acorn** is a human form of Akoren, an old scholar with infinity-shaped spectacles.
- **Ana** (Any) is a friendly mascot, easy to localize, whose name works in many languages.

---

## 7. Anime style variations

### 7.1 Chibi 2D (primary for toddlers and children)

- Body proportions are 1:1 to 1:2 head-to-body. Shapes are round, square or triangle by role, so roles are readable without color.
- Eyes are large and simple, taken from the avatar's filled-circle eyes, with a single highlight. Mouths should be minimal or absent at rest, because Hello Kitty's mouthless design lets viewers project their own feelings (see section 9).
- Outlines are thick, rounded and gray `#4D4D4D`, following the doublet logo. Fills are flat with at most one shadow tone.
- Signature motif: every character has at least one "hand-arrow" that can link to another character. Linking two characters plays a sparkle and a "boop" sound.
- Expression sheet: happy, curious, sleepy, surprised, oops, proud, sad but comforted. Duolingo's 2019 redesign explicitly expanded Duo from two expressions to a full range (Design Week, see section 9).
- Pixel or sticker variant: also good for the identicon-style org avatars, which could be replaced with a chibi Linky.

### 7.2 Normal anime 2D (for older children and adults)

- Humanoid hosts (Lina, Doubl and Trip) with 1:6 to 1:7 proportions and a soft cel-shaded palette.
- Link creatures stay chibi as companions, like Pokémon partners next to trainers.
- Visual language for links: glowing threads between characters. Red-to-blue gradient threads are friendships, and green knots are actions.

### 7.3 3D

- **Toy-like 3D** (vinyl or plush look) for creatures: subsurface "gummy" or felt material, rim light and rounded bevels. Molang and Om Nom-style squash and stretch.
- **Anime-shaded 3D** (toon shader with outlines) for humanoid hosts.
- Technical notes:
  - Keep each creature to a few primitives (sphere, rounded cube, cone) so it can be procedurally generated and cheap on mobile and web.
  - The arrow-smile can be a spline mesh.
  - Linking animations are bezier ropes, which echoes Cut the Rope's rope physics and the animated bezier on `itself.html`.
- Plush and merch: simple primitives translate directly into plushies and keychains.

### 7.4 Consistency rules across styles

1. The red/blue eyes, or the red/blue hands, are always present on link characters.
2. The green ring or the green verb appears whenever an action happens.
3. The infinity loop is reserved for Itsy, Akoren and Omi, the "self" and "whole" characters.
4. Silhouettes must stay recognizable in pure black. Test each design as a silhouette.

---

## 8. Kid-safe tone guide (draft)

Every rule below implements "If something is not adorable it is a bug".

**Voice**
- Short sentences, a warm and curious tone, and gentle humor based on surprise, sound effects and physical comedy.
- No sarcasm aimed at the player.
- Duolingo's "wholesome unhinged" tone is fine for adult social media only. Inside the product, the coach stays kind. Duolingo itself splits its tone this way (see section 9).

**Conflict**
- Problems are puzzles, misunderstandings or lost things, never violence or cruelty.
- "Breaking" a link is never a punishment. It is "letting go" or "rearranging".
- Angry Birds-style slapstick is acceptable only as non-harmful physics, such as bouncing or toppling blocks, with nobody hurt.

**Failure**
- Oopsy normalizes mistakes. Use no "Game Over" screens, only "Let's try again!"
- Never shame or guilt the player. Avoid streak-guilt dark patterns, a known risk with mascot-driven retention.

**Fears**
- Nully the ghost is never scary: no dark sudden appearances, and bright pastel translucency.
- Avoid the void, emptiness or "deletion" metaphors with toddlers. Use "sleep", "rest" or "nap" instead.

**Goodbyes and loss**
- Letgo's arc models healthy goodbyes: let go of hands first, check nobody still needs you, then wave.
- This is useful wisdom for moving house, finishing school and losing a pet. For toddlers, keep it to "bye-bye, see you later".

**Inclusivity**
- Anya welcomes everyone.
- Characters are shapes, not genders or ethnicities, by default. Humanoid hosts should be diverse.
- Localize names. Prefer names that are easy to say in many languages.

**Safety and privacy**
- Postie can teach "know your home address", but games must never ask children for real addresses or personal data.
- Comply with COPPA and GDPR-K: no chat with strangers, and no open text input for under-13s without moderation.

**Monetization**
- No loot boxes for children. Collectibles such as Prime Sprites and Beadles are earned by play.

**Depth for adults**
- Every lesson has a hidden second layer, such as the cycle of definitions, `L ↦ L²` Easter eggs and LiNo puns.
- Pixar-style "two audiences" writing.

**Adorability checklist** (per asset)
- Is it round or soft enough?
- Are the eyes big enough?
- Does it read in silhouette?
- Is it non-threatening at all sizes?
- Is the lesson positive?
- Would a toddler hug it?
- Would an adult put it on a sticker?

---

## 9. Mascot universe benchmarks: why they work

| Universe | Facts (source) | Why it works | What we borrow |
|---|---|---|---|
| **Numberblocks** / **Alphablocks** | Numberblocks is a British preschool series that debuted on CBeebies on 23 January 2017. It was created by Joe Elliot and produced by Alphablocks Ltd with Blue Zoo, and was BAFTA-nominated in the "Learning" category. Each number is a block character living in Numberland. Alphablocks is the sister phonics series, where letter characters hold hands to form words. Sources: https://en.wikipedia.org/wiki/Numberblocks, https://www.awn.com/news/blue-zoo-animations-numberblocks-launching-cbeebies, https://www.learningblocks.tv/blocksnews/numberblocks-bursts-into-5-new-international-language-markets-as-blocks-youtube-channels-hit-10m, https://learningblocks.tv | The concept *is* the character. The body structure shows the math: 3 has 3 blocks, and letters "hold hands" to make words. Learning happens by watching characters combine. | Our closest model. Links are literally "holding hands", and Alphablocks already uses that exact metaphor. Beadles and Letterlinks follow this pattern directly. |
| **Molang** | Created by South Korean illustrator Hye-Ji Yoon to express simple everyday happiness. Its very simple design aids recognition, and its world has everyday activities without complex drama. Sources: https://www.molang.com, https://partnerwithscphealth-jitsi.bluetext.com/blog/piu-piu-and-molang-a (secondary) | Minimal shapes, a soft palette, wordless storytelling that works globally, and gentle friendship between Molang and Piu Piu. | Wordless shorts for toddlers. The Soru and Tari friendship duo. |
| **Pusheen** | Created by Claire Belton as simple line art with relatable humor. A plump round shape and minimal features make her instantly recognizable and easy to animate in any scenario. Sources: https://pusheen.com, https://grandavehousing.calpoly.edu/news/pusheen-the-cat-who-conquered (secondary) | Relatable everyday behavior (snacks, naps), sticker and GIF-native, works for adults. | Sticker packs and GIFs of Linky. Nully's nap jokes. The adult audience. |
| **Hello Kitty / Sanrio** | Sanrio spokespeople have said Hello Kitty has no mouth so that people "project their feelings onto the character" (https://en.wikipedia.org/wiki/Hello_Kitty). Sanrio runs a large multi-character universe (https://www.sanrio.com). | Projection through minimal features. A huge roster of characters, each with a tiny personality. Endless merch. | Mouth-optional rest faces. Many small characters in one shared universe, e.g. the Prime Sprites. |
| **Pokémon** | Widely cited as the highest-grossing media franchise. Guinness lists it as the highest-grossing anime franchise at $105bn as of August 2021 (https://www.guinnessworldrecords.com/world-records/738103-highest-grossing-anime-franchise). Official site: https://www.pokemon.com | Collecting, partnership between trainer and creature, types, evolution, and cross-media (games, anime, cards) all in one shared universe. | One universe across all games. Collectible concept-creatures. Humanoid anime hosts plus creature partners. The "evolution" Point → Doublet → Triplet → Sequence → Network. |
| **Duolingo's Duo** | Duo was redesigned in 2019 to add personality and a full range of expressions, using geometric shapes and a flat perspective for easy animation (https://www.designweek.co.uk/issues/2-6-january-2019/duolingo-owl-receives-makeover-as-app-becomes-more-gamified, https://creativebloq.com/news/duolingos-redesigned-mascot-is-a-hoot). The comms strategy is "wholesome unhinged" on social media, while Duo stays a kind, helpful coach in the product (https://campaignlive.com/article/duolingo-comms-head-sam-dalsimer-leads-wholesome-unhinged-strategy/1910699). | Geometric construction for easy animation. A mascot that coaches inside an educational app. Personality as a growth engine. | Linky as an in-app coach across all our apps. Geometric construction. A separate tone for adult social media versus the kids' product. |
| **Om Nom (Cut the Rope)** | ZeptoLab's candy-loving monster. The Om Nom Stories shorts started on YouTube in 2012 (the pilot got almost 8M views), aired on CITV, Gulli, Clan and Kaiser, and later grew to many seasons with Netflix and Disney+ licensing deals. Sources: https://kidscreen.com/2012/10/25/om-nom-stories-makes-youtube-debut, https://www.licenseglobal.com/zeptolab-debuts-om-nom-series, https://www.pocketgamer.biz/zeptolabs-om-nom-stories-lands-25-seasons-deal-with-disney/, https://www.cuttherope.net | A single, simple, wordless desire (candy). Physics puzzles with ropes. Moved from game to series. | Rope and link physics puzzles are on-theme. Cut the Rope is literally about links. Keep our heroes' desires simple: Linky "wants to connect". The game-to-shorts path. |
| **Angry Birds** | The character design reduces to circles, ovals and triangles. Shape, color and emotion are the three components of appeal (https://uxdesign.cc/character-design-of-angry-birds-4a74feb90e8c). Official site: https://www.angrybirds.com | Each bird has a distinct shape, color and ability, so roles are readable instantly. | Shape coding by role: round source, square target, triangle verb. Keep the slapstick non-violent. |

### 9.1 Cross-cutting success patterns

1. **Simple primitives**: circles, squares and triangles make characters recognizable, easy to animate, cheap in 3D, and easy for kids to draw.
2. **The concept is the character** (Numberblocks/Alphablocks). The lesson emerges from what the characters *do*.
3. **Minimal faces**, with large eyes and an optional mouth, allow projection (Hello Kitty).
4. **One simple desire per character** (Om Nom: candy; Linky: connection).
5. **A shared universe across media** (Pokémon, Sanrio): games, shorts, stickers and plush.
6. **A dual audience**: kids get the cute, adults get the wit (Pusheen, Duolingo).
7. **A wordless-first design** that is localizable and global (Molang, Om Nom).

---

## 10. World rules and lore seeds

**World rules.** These are "physics" derived from the theory, so the lore stays consistent
with the real concepts.

1. **Everything is a link.** All beings, objects and places are links (`L ↦ L²`).
2. **Everyone has an address.** Nothing is truly lost in Omi. You can always be found (Ω and indexes).
3. **Two hands, one direction.** Every link reaches *from* something *to* something. Kindness flows in a direction, and you can always link back to make it mutual (an undirected edge is two doublets).
4. **The third friend acts.** When two friends meet, a verb friend (Verbi) makes something happen (triplets).
5. **No duplicates.** If a friendship already exists, you don't make it twice; you reuse it (uniqueness). Lesson: share.
6. **Gentle goodbyes.** Before leaving, you let go of both hands, i.e. reset to `(0,0)`. You can't vanish while someone still holds you (usages validator).
7. **One magic spell.** All change is substitution: "this becomes that". Every quest is solved by finding the right substitution.
8. **Zero is a resting place.** Address 0 (Null) is where sleepy links nap. It is not scary.
9. **Any is a welcome sign.** Any opens doors that "match everyone".
10. **The world defines itself.** At the deepest level, Akoren (∞) and Omi (Ω) point to themselves. This is the secret ending for adults: the universe is a self-describing network, and players are part of it.

**Lore seeds** (episode or game concepts)

- **"The First Link"** (origin myth): In the beginning there was only Akoren, a tiny acorn hugging itself (`∞ → ∞`). Akoren reached out a red hand and a blue hand and became two, and the two linked to become many. Echoes: "In the beginning was the sequence".
- **"Linky's Lost Hand"**: Linky's blue hand isn't holding anything. The quest finds a target, and the lesson is that it's OK to look for friends.
- **"Itsy's Mirror"**: Itsy learns that hugging yourself is fine and helps you hug others. The lesson is self-love before connection.
- **"Go, Stop and Hop"**: a traffic-light puzzle game teaching self-regulation (Continue/Break/Skip).
- **"Oopsy's Very Big Oops"**: Oopsy creates a duplicate link and Uni gently explains. The lesson is that mistakes are fine and sharing beats copying.
- **"Choo-Choo Seq's Train"**: kids build sequences by pairing cars. The lesson covers patterns, counting and pairs inside pairs (an intro to recursion).
- **"The LiNo Family Picnic"**: an early-reader game where sentences such as "papa has car" become links on screen.
- **"Prime Sprites Collection"**: collect the 65 meaning-sprites. Combining I + WANT + GOOD forms a sentence. This bridges to human-language and semantic-primes.
- **"Letgo and the Moving Day"**: a gentle story about change and goodbyes.
- **"Cadets of Depth Academy"**: older kids and adults "graduate" through levels: point → doublet → triplet → sequence → network → meta-network. This mirrors the cycle of definitions, and the final level reveals that Omi contains itself.

**Wisdom bank** (one-liners for loading screens)

- "Everything is connected."
- "A link is a beginning and an end holding hands."
- "Big trees grow from tiny acorns."
- "No one is lost; everyone has an address."
- "Let go gently."
- "Oops means you're learning."
- "Two can be one, and one can be two." (The two-in-oneness of deep theory.)
- "Small words build big ideas."
- "There is always one more way to link."

---

## 11. Open questions for the team

1. **Canonical palette.** The avatar uses red source, blue target and green ring, while figure 10 of the 0.0.2 article uses green for "to". Decide once and document it in the brand guide.
2. **Naming.** Should we use English working names (Linky, Itsy, Akoren) or names that are easy to say in many languages? Check trademarks: "Linky" is used by a French smart meter, and "Omi" and "Uni" are common words.
3. **Is the main mascot the existing avatar face?** It would give continuity with linksplatform, which is recommended, or a new Linky design.
4. **Theory accuracy versus cuteness.** Who reviews that lore claims stay true to the meta-theory? Suggest a "theory consistency" check alongside the adorability gate.
5. **Humanoid anime hosts.** Should they exist at all for the toddler tier, or appear only in the older tiers?
6. **Localization.** Russian-language material (deep-theory poetry, draft 0.0.3) is a source of lore text. Should official translations be part of the lore bible?
7. **Org avatars.** links-games and link-assistant use default identicons. Should we commission chibi Linky avatars as an early, visible win?

---

## 12. Fact source index

Quick lookup of where each fact came from.

- Core formula, link definition, doublet and triplet examples, graph mapping, sequences, Turing completeness: https://habr.com/en/articles/895896/
- Archive of article versions: https://github.com/link-foundation/meta-theory
- Draft 0.0.3 (reference as a 0-dimensional link, Ω, cycle of definitions, Rocq/Lean): https://github.com/link-foundation/meta-theory/tree/main/drafts/0.0.3
- Akoren, `∞`, poetic sequence: https://github.com/deep-foundation/deep-theory
- Constants (Null, Continue, Break, Skip, Any, Itself, Error): https://github.com/linksplatform/Data/blob/master/csharp/Platform.Data/LinksConstants.cs
- Decorators (uniqueness, usages, cascade, reset-before-delete): https://github.com/linksplatform/Data.Doublets
- Sequences, unary numbers, Unicode: https://github.com/linksplatform/Data.Doublets.Sequences
- Rust implementation: https://github.com/linksplatform/doublets-rs
- Benchmarks: https://github.com/linksplatform/Comparisons.PostgreSQLVSDoublets
- Substitution and CLI: https://github.com/link-foundation/link-cli
- LiNo: https://github.com/link-foundation/links-notation
- Ontology and primes: https://github.com/link-foundation/meta-ontology, https://github.com/link-assistant/semantic-primes
- Human language: https://github.com/link-assistant/human-language
- Relative logic: https://github.com/link-foundation/relative-meta-logic
- Logos and figures: https://github.com/linksplatform/Documentation/tree/master/doc
- Itself demo: http://linksplatform.github.io/itself.html
- Org avatars:
  - https://avatars.githubusercontent.com/u/15116341
  - https://avatars.githubusercontent.com/u/176174013
  - https://avatars.githubusercontent.com/u/245352401
  - https://avatars.githubusercontent.com/u/62844658
  - https://avatars.githubusercontent.com/u/342928249
