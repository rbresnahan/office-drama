# Phase 0 Codex Brief: Narrative Interaction Layer Audit

## Purpose

This is the prompt to give Codex for the first audit pass.

Codex should inspect the repo and return a concise plan.

Codex must not edit files during this phase.

## Copy/Paste Prompt For Codex

Inspect the Office Panic repo and prepare a docs-first implementation plan for the narrative interaction layer.

Primary blank file:

- `docs/scopes/narrative-interaction-layer.md`

Goal:

Define and prepare implementation for the missing narrative layer where the player discovers schemes through NPC conversations, inspectable locations, visible aftermath, hidden office motion, schedule pressure, and NPC reactions.

Important constraints:

- Do not edit files yet.
- Do not rewrite the engine.
- Do not propose a large NPC simulation system.
- Do not create a new docs folder unless there is a clear reason.
- Prefer updating existing docs over creating duplicate docs.
- Treat this as a controlled narrative-reactivity layer, not an open-world system.
- Use existing engine mechanics wherever possible.
- Mobile-first playtesting matters.

Known existing engine concepts to inspect and use if available:

- `facts`
- `flags`
- `requirements`
- `hiddenEvents`
- `visibleAftermathQueue`
- `visibleAftermathBeats`
- `forcedRules`
- `schedule`
- `scheduleTriggered`
- `feedback`
- `latestSignal`
- `unlocked`
- `locked`
- `usedChoices`
- `bars`
- `npc`
- `history`

Files to inspect first:

- `docs/scopes/narrative-interaction-layer.md`
- `docs/design/office-panic-discovery-location-system.md`
- `docs/design/office-panic-scheme-chains.md`
- `docs/design/office-panic-content-authoring-rules.md`
- `docs/mechanics/inspect-visible-hidden-aftermath.md`
- `docs/implementation/limited-scope-refinement-plan.md`
- `assets/js/engine/effects.js`
- `assets/js/engine/guards.js`
- `assets/js/engine/game.js`
- `assets/js/engine/state.js`
- `assets/js/engine/renderer.js`
- `assets/stories/demo/aftermath.js`
- `assets/stories/demo/forced-rules.js`
- `assets/stories/demo/schedule.js`
- `assets/stories/demo/scenes/`
- `assets/stories/demo/index.js`

Also inspect naming consistency around:

- `Devin`
- `Devon`

Return a concise audit with these sections:

1. Existing systems already available

Explain which current systems can support discovery-gated schemes, inspection, visible aftermath, hidden events, forced NPC approach scenes, scheduled scenes, and unlock requirements.

2. Existing docs that should be updated

List docs that already cover part of this work and explain what each should receive.

3. New docs needed, if any

Only propose a new doc if the existing docs cannot reasonably hold the material.

4. Proposed file plan

List exactly which files should be edited in the next docs-only phase.

Separate required edits from optional edits.

5. Smallest safe implementation path

Propose the smallest content/data slice after docs are approved.

Prefer starting with the Frank drinking discovery path.

6. Risks and scope creep warnings

Call out any proposed work that would become too large, duplicate existing systems, or require unnecessary engine changes.

7. Questions before editing

List only blocking questions.

Do not ask broad preference questions if a reasonable default exists.

Output rules:

- Do not edit files.
- Do not produce full rewritten docs yet.
- Keep the audit concise.
- Do not paste large file contents unless necessary.
- Do not propose implementation until the docs plan is approved.