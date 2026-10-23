# The Adorability Gate

> "If something is not adorable it is a bug." —
> [issue #1](https://github.com/links-games/master-plan/issues/1)

This is the checklist that turns that sentence into an enforceable quality
gate. It is used in three places:

1. **Pull request template** of every game repository (copy of
   [`../templates/pull_request_template.md`](../templates/pull_request_template.md)).
2. **Issue label** `not-adorable` (bug severity: same as a functional bug).
   Anyone — a player, a parent, a contributor, a child — may open an issue
   with the [adorability bug template](../templates/ISSUE_TEMPLATE/not-adorable.md).
3. **Release checklist**: a game cannot leave `beta` while an open
   `not-adorable` issue exists.

## The checklist

A change passes the gate only when **every applicable** item is ✅.

### Shapes and faces

- [ ] Round shapes dominate; no sharp spikes on friendly characters.
- [ ] Head-to-body ratio of characters is large (chibi proportions 1:1 to
      1:3) in 2D; big eyes placed low on the face.
- [ ] Characters have a readable silhouette at 48×48 px (mobile icon size).
- [ ] Every character can show at least five emotions: happy, curious,
      surprised, sleepy, proud. Sadness is gentle, never frightening.

### Color and light

- [ ] Uses the shared palette from `@links-games/assets` (soft, high-value,
      medium-saturation colors); contrast still meets WCAG AA for text.
- [ ] No pure black backgrounds in kid modes; dark mode uses deep blues or
      purples.
- [ ] Color is never the only carrier of meaning (color-blind safe).

### Motion and sound

- [ ] Gentle idle motion (breathing, blinking, wiggle) is optional while visible.
      Respect reduced-motion preferences; a still scene stays welcoming. Pause
      animation off-screen and in background tabs.
- [ ] Squash-and-stretch on jumps, landings and taps.
- [ ] Every tap gives feedback within 100 ms (visual + optional sound +
      optional haptic).
- [ ] Sounds are soft, short, and mute-able; no sudden loud sounds; no jump
      scares.

### Words and tone

- [ ] Texts are short, kind and encouraging; a toddler-mode alternative uses
      icons/voice instead of text.
- [ ] Failure is framed as learning ("Oops! Let's try another way!"), never
      as shame or punishment.
- [ ] No sarcasm aimed at the player, no violence, no fear-based urgency
      ("Only 2 minutes left to buy!").
- [ ] Every lesson is phrased as a discovery, not a lecture.

### Fairness and respect (adorable also means kind)

- [ ] No dark patterns: no fake close buttons, no confirm-shaming, no
      surprise purchases, no streak guilt-tripping.
- [ ] Ads never appear without the player explicitly choosing to watch one.
- [ ] A child can always reach a calm "home" screen within two taps.

### Error states and edge cases

- [ ] Loading screens, empty states, offline screens and crash dialogs use a
      character and optional gentle motion respecting reduced-motion preferences (e.g. _Nully_ the sleepy ghost from the
      [character bible](characters.md)).
- [ ] Error messages for adults are still precise and actionable.

## How to measure it

- **Five-second test**: show a screenshot to three people from different age
  groups (toddler + parent, child, adult). If anyone does not smile or say
  something positive, open a `not-adorable` issue with what they said.
- **Playtest notes**: add a short "Adorability" section to every playtest
  report.
- **Visual regression**: screenshots of key screens are stored in the game
  repository and compared in CI, so a regression in looks is caught like a
  regression in code.
