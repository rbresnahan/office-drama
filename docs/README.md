# Docs Overview

This folder contains the design-side source of truth for the office sabotage prototype.

These files exist to help lock decisions before code changes are made.

The goal is to reduce back-and-forth, keep field meanings consistent, and make sure gameplay systems are intentional before they are implemented.

---

## File Map

### `legend.md`
Defines the meaning of the core stat ranges.

Use this file to keep numbers consistent across all NPCs and relationships.

Examples:
- `playerLikability`
- `playerSuspicion`
- `allianceStrength`
- `sentimentTransferStrength`
- `intelligence`
- `socialAwareness`

If a value uses a `0–100` scale, its meaning should match `legend.md`.

---

### `relationships.md`
Defines the strongest relationship bonds in the office.

Use this file for:
- alliance pairs
- bond strength
- sentiment transfer strength
- hidden bond truth
- break conditions
- reinforcement conditions

This file is about **social structure**, not scene writing.

---

### `npcs/`
Contains one markdown file per NPC.

These are the human-readable character sheets for the first playable cast.

Current structure:
- `betty.md`
- `celia.md`
- `devon.md`
- `frank.md`
- `lisa.md`
- `tim.md`
- `npc-template.md`

Use these files to define:
- core identity
- starting player sentiment
- hidden social traits
- manipulation hooks
- chaos profile
- notes for writing and gameplay

These files are design references first, not final engine data.

---

## Design Rules

### 1. Keep field names consistent
Use the same names everywhere.

Examples:
- `playerLikability`
- `playerSuspicion`
- `allianceStrength`
- `sentimentTransferStrength`
- `socialAwareness`
- `gossipAppetite`

Do not rename the same concept in different files.

Bad example:
- `favorability`
- `playerLike`
- `relationship trust thing`

Pick one name and keep it.

---

### 2. Keep design docs practical
These files should help build the game.

Do not let them turn into:
- fake psychology essays
- giant worldbuilding dumps
- personality worship without gameplay value

The test is simple:
if a note does not help gameplay, writing, or tuning, it probably does not need to be here.

---

### 3. Separate design truth from implementation truth
For now, these markdown files are the design source of truth.

Later, relevant values will be translated into story data files such as:
- `assets/stories/npcs.js`
- relationship seed data
- story state config

Do not assume every note in the docs belongs in code.

Some fields are useful for writing and tuning even if they never become live variables.

---

### 4. Prototype first
This project is trying to build a small, replayable, tonally strong first playable game.

Do not expand scope just because a system sounds interesting.

Priority order:
1. readable systems
2. concrete actions
3. reactive social fallout
4. strong public climax
5. replayability

Not priority:
- giant realism
- huge cast
- perfect simulation
- procedural dialogue nonsense

---

## Current Prototype Focus

The current prototype is moving toward:

- a closed office social environment
- a damaging email as the main problem
- player manipulation through concrete actions
- hidden NPC sentiment toward the player
- simple relationship-based sentiment transfer
- an all-hands ending that can become either:
  - incident containment
  - public collapse
  - or intervention about the player

---

## What Gets Reviewed Before Coding

Before system changes are coded, confirm:

- stat meanings are locked in `legend.md`
- NPC values are updated in `docs/npcs/`
- important alliances are updated in `relationships.md`
- first playable scope is still small enough to implement cleanly

If those are not clear, do not code yet.

---

## Translation Path To Code

The intended flow is:

1. update docs
2. lock meanings and scope
3. condense only needed fields into story data
4. implement system changes
5. tune based on actual play

The markdown files are where the thinking gets cleaned up first.

That is the point of this folder.