# Docs Status

This file tracks what is currently locked, what is still under review, and what should not be coded yet.

---

## Locked Enough To Keep Using

### Repo structure
- `docs/legend.md`
- `docs/relationships.md`
- `docs/npcs/`
- one file per core NPC
- shared NPC template

### Prototype cast
Current first-playable cast is:
- Betty
- Tim
- Frank
- Celia
- Devon
- Lisa

### Core direction
- office sabotage prototype
- damaging email as central threat
- social manipulation through concrete actions
- player wants to stay under the radar
- if the room focuses on the player, that is dangerous
- if the room fractures around itself, that can be useful

---

## In Review

### Hidden player-facing NPC sentiment
Fields currently being defined:
- `playerLikability`
- `playerSuspicion`

### Relationship-based opinion spread
Still being tuned:
- when transfer happens
- how strong it is
- how much unpredictability is allowed
- which bonds matter most

### All-hands structure
Direction is agreed on, but exact trigger logic and outcome buckets still need to be locked.

### Email spread mechanics
Still needs a cleaner definition before coding.

---

## Not Ready For Code Yet

Do not code these until meanings are tighter:

- full sentiment transfer model
- full intervention logic
- wider hidden relationship simulation
- expanded sabotage action set
- deeper NPC trait systems beyond prototype need

---

## Current Coding Rule

If a field or mechanic does not clearly affect the next playable build, keep it in docs only for now.

Do not move it into engine/story data just because it sounds smart.

---

## Next Pre-Code Checklist

Before coding the next update, confirm:

- [ ] `legend.md` ranges are locked
- [ ] all first-playable NPC files are filled out enough to use
- [ ] `relationships.md` identifies the strongest meaningful bonds
- [ ] prototype scope is still intentionally small
- [ ] email spread has a simple definition
- [ ] all-hands trigger conditions are defined well enough to implement

---

## Notes
- This file should stay short.
- Update it when something moves from “design idea” to “ready for implementation.”
- If this file gets bloated, it is failing its job.