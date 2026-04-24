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
- one selected NPC is the subject of the email each run
- recall partially works, never perfectly
- player manipulation happens through concrete actions
- player wants to stay under the radar
- if the room focuses on the player, that is dangerous
- if the room fractures around itself, that can be useful
- if the subject reads the email early, the run shifts into end-game / defensive mode

### Design docs now usable
- `legend.md`
- `relationships.md`
- `actions-phase-1.md`
- `all-hands-rules.md`
- `email-spread.md`
- `spread-resolution.md`
- `run-setup.md`
- `implementation-scope.md`

---

## Still In Review

### Numeric tuning
The meanings are locked, but the actual starting values and thresholds may still need tuning during implementation.

Examples:
- starting playerLikability
- starting playerSuspicion
- transfer thresholds
- office focus escalation speed
- intervention thresholds

### Final all-hands bucket tuning
The meeting modes are defined well enough to implement, but exact ending balance and wording can still evolve after playtesting.

### Defensive win tuning
Dirty survival, scapegoat success, and late reframing are all valid directions, but they will need playtesting to avoid feeling too easy or too magical.

---

## Ready For Code

These are ready to move from docs into implementation planning:

- selected email subject per run
- partial recall setup
- delivery states
- knowledge states
- subject awareness states
- office focus states
- per-turn spread phase
- fair intervention window
- end-game / defensive mode trigger
- phase 1 action categories
- key relationship pairs
- playerLikability
- playerSuspicion

---

## Not Ready For Code Yet

Do not code these until meanings are tighter or the first playable proves it needs them:

- wider hidden relationship simulation
- many smaller secondary bonds
- larger cast expansion
- giant office-wide background relationship maps
- deep procedural conversation systems
- more than the strongest few pair sheets
- broader psychology modeling beyond prototype need

---

## Current Coding Rule

If a field or mechanic does not clearly affect the next playable build, keep it in docs only for now.

Do not move it into story data just because it sounds smart.

---

## Next Pre-Code Checklist

Before coding the next update, confirm:

- [x] `legend.md` ranges are locked
- [x] all first-playable NPC files are filled out enough to use
- [x] `relationships.md` identifies the strongest meaningful bonds
- [x] prototype scope is still intentionally small
- [x] email spread has a simple definition
- [x] all-hands trigger conditions are defined well enough to implement
- [x] run setup includes a fair intervention window
- [x] spread resolution has a per-turn method
- [x] implementation scope is locked

---

## Notes

- This file should stay short.
- Update it when something moves from “design idea” to “ready for implementation.”
- If this file gets bloated, it is failing its job.