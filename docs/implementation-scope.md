# Implementation Scope — Prototype 1

## Purpose

This document defines what becomes live code in the next implementation pass.

It is the bridge between:
- design docs
- story data
- runtime state
- and engine behavior

The goal is to stop guessing during implementation.

If a field or rule is not listed here as live, it should stay docs-only for now.

---

## Core Principle

Prototype 1 should implement only what is needed to make this scenario work:

- one selected subject
- partial recall
- fair intervention window
- limited per-turn spread
- hidden NPC sentiment toward the player
- a few key relationships
- end-game / defensive mode after subject confirmation
- all-hands payoff

That is enough.

Do not drag the whole design archive into code.

---

## Live Run State

These should become live fields in the next implementation pass.

### Required run-level fields
- `turn`
- `turnLimit`
- `emailTargetId`
- `deliveryPatternId`
- `officeFocusState`
- `gamePhase`

### Recommended `gamePhase` values
- `containment`
- `defensive`
- `all_hands`
- `resolved`

### Meaning
- `containment` = subject has not confirmed the email yet
- `defensive` = subject confirmed, fallout shaping phase
- `all_hands` = public climax
- `resolved` = ending state

---

## Live Per-NPC State

Each core NPC should have a condensed live state object.

### Required live fields
- `id`
- `name`
- `role`
- `playerLikability`
- `playerSuspicion`
- `mood`
- `deliveryState`
- `knowledgeState`
- `isSubject`
- `subjectAwarenessState`
- `primaryAllyId`
- `secondaryAllyId`

### Recommended supporting live traits
Only include the traits that directly affect resolution now:
- `gossipAppetite`
- `socialAwareness`
- `intelligence`
- `gullibility`
- `ruleFollowing`
- `courage`

### Notes
- `subjectAwarenessState` only matters for the current `emailTargetId`, but it is fine to keep the same field on all NPCs for consistency
- non-subject NPCs can stay effectively neutral on that field

---

## Live Delivery State

Prototype 1 should implement these values:

- `not_received`
- `received_unread`
- `received_read`

These are used by:
- run setup
- trace
- access
- delete / suppress
- fair intervention logic

---

## Live Knowledge State

Prototype 1 should implement these values:

- `none`
- `heard`
- `suspects`
- `confirmed`

These are used by:
- spread resolution
- focus escalation
- subject pressure
- all-hands evaluation

---

## Live Subject Awareness State

Prototype 1 should implement these values:

- `unaware`
- `at_risk`
- `suspicious`
- `confirmed`

This is one of the most important state ladders in the scenario.

Once the subject reaches `confirmed`:
- `gamePhase` should shift to `defensive`

---

## Live Relationship State

Do not implement the whole office network.

Implement only the strongest relationships that matter now.

### Required live relationship entries
- Betty ↔ Tim
- Frank ↔ Celia
- Lisa ↔ Player
- Devon ↔ Office as a special low-bond factual node

### Required live relationship fields
- `pairId`
- `leftId`
- `rightId`
- `bondStrength`
- `sentimentTransferStrength`
- `isMutual`
- `isActive`

### Optional but useful now
- `strain`
- `isolatedUntilTurn`

### Notes
- `Lisa ↔ Player` may be implemented slightly differently from NPC-to-NPC bonds, but it should still be treated as live relationship data
- Devon may need special handling because he is more of a node than a pair bond

---

## Live Action Categories

Prototype 1 should implement these actions as actual game behaviors:

- `trace`
- `distract`
- `access`
- `delete_suppress`
- `reassure`
- `redirect`
- `lie_deflect`
- `sabotage`

### Each action needs:
- target rules
- success/failure handling
- stat impact rules
- spread interruption rules where relevant
- dirty-play implications where relevant

---

## Live Action Effects

The next pass does not need final perfect tuning.
It does need live behavior.

### At minimum, actions must be able to affect:
- `playerLikability`
- `playerSuspicion`
- `deliveryState`
- `knowledgeState`
- `subjectAwarenessState`
- `officeFocusState`
- relationship availability or strain
- current turn pressure

### Important implementation rule
The same action should not always succeed.
Resolution should depend on:
- target traits
- player sentiment with that target
- current phase
- current room conditions
- relationship context

---

## Live Spread Phase

Prototype 1 should implement one spread phase per turn.

### Required spread steps
1. apply player action effects
2. update immediate NPC state
3. determine who is eligible to spread
4. choose likely recipients
5. transfer knowledge by one step
6. update office focus
7. update subject awareness pressure
8. check end-game shift

### Spread limit rule
- each eligible NPC gets at most one major spread attempt per turn
- a turn should usually create 0 to 2 meaningful transfers

This keeps spread legible.

---

## Live Fair Intervention Rule

This must be implemented.

### Rule
If the subject starts with `received_unread`, the game must give the player at least one meaningful opportunity to intervene before the subject auto-reads the email.

### Meaningful intervention examples
- distract
- access
- delete / suppress
- isolate
- lie / deflect if it functionally buys time

### Important
The player may fail.
But failure must happen after play, not before play.

---

## Live End-Game Shift

This must be implemented.

### Trigger
If the subject reaches `subjectAwarenessState = confirmed`, then:
- `gamePhase` becomes `defensive`

### Immediate consequences
- clean prevention is over
- pressure rises
- all-hands timer becomes more urgent
- late attribution and scapegoat paths can become relevant

### Important
This is not instant loss.

---

## Live All-Hands Checks

Prototype 1 should evaluate all-hands from live state, not handcrafted one-off story logic.

### Required evaluation inputs
- `gamePhase`
- `officeFocusState`
- subject confirmed or not
- number of aware NPCs
- number of confirmed NPCs
- high-suspicion NPC count
- Lisa trust state
- Frank/Celia lock-on state
- dirty-play visibility
- whether a plausible defensive line exists

### Outcome buckets to support now
- controlled reveal
- email reckoning
- early discovery defense
- intervention
- chaos diversion
- dirty survival

---

## Live Dirty-Play Tracking

Prototype 1 should track dirty play in a simple way.

### Recommended field
- `dirtyPlayCount`

### Optional helper
- `visibleDirtyPlayCount`

### Why
This supports:
- intervention risk
- defensive-mode plausibility
- scapegoat failure
- dirty survival endings

Do not overcomplicate this yet.

---

## Docs-Only Fields For Now

These should remain in docs and not become live state yet unless implementation clearly needs them:

- age range
- full public persona text
- full private nature text
- long hidden bond prose
- rich narrative notes
- broader secondary bonds beyond the strongest few
- many weak office-wide relationships
- nuanced deeper psychology that does not change runtime behavior

These remain useful for writing and tuning, but they do not all belong in code.

---

## New Story Data Files

After this scope is accepted, the next implementation step should be creating condensed story data files.

### Recommended first files
- `assets/stories/npcs.js`
- `assets/stories/relationships.js`
- `assets/stories/run-setup.js`

### Purpose of each
- `npcs.js` = condensed live NPC seed data
- `relationships.js` = only the strongest live bond data
- `run-setup.js` = target selection, delivery pattern setup, opening state generation

Do not put all this directly into engine files first.

---

## Engine Files Expected To Change Later

After the story data exists, the likely implementation pass touches:

- `assets/js/engine/state.js`
- `assets/js/engine/game.js`
- `assets/js/engine/effects.js`
- `assets/stories/demo-story.js`

Potentially later:
- `renderer.js`
- `index.html`
- `style.css`

Those should change after live data exists, not before.

---

## First Implementation Order

Use this order:

1. create condensed story data files
2. wire run setup into live state
3. add live delivery and awareness fields
4. add fair intervention window
5. add per-turn spread phase
6. add defensive phase shift
7. add all-hands evaluation
8. tune action outcomes

This is the cleanest path.

---

## Summary

Prototype 1 live code should include:
- selected subject
- partial recall setup
- fair intervention
- limited per-turn spread
- player sentiment
- a few key relationships
- defensive phase after subject confirmation
- all-hands outcome evaluation

Everything else stays in docs until the prototype proves it needs more.