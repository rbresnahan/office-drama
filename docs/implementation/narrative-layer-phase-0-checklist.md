# Phase 0 Checklist

## Purpose

Use this checklist before sending the Phase 0 audit prompt to Codex.

## Files Created In Phase 0

- `docs/implementation/narrative-layer-codex-workflow.md`
- `docs/implementation/narrative-layer-phase-0-codex-brief.md`
- `docs/scopes/narrative-interaction-layer.md`
- `docs/implementation/narrative-layer-phase-0-checklist.md`

## Before Running Codex

Confirm:

- The scope file exists at `docs/scopes/narrative-interaction-layer.md`.
- The Codex workflow file exists.
- The Codex brief exists.
- The Codex brief says audit only.
- The Codex brief says do not edit files.
- The Codex brief says do not rewrite the engine.
- The Codex brief says to use existing systems first.
- The Codex brief says to prefer existing docs over duplicate docs.
- The Codex brief asks Codex to check Devin versus Devon naming drift.

## Codex Must Return

Codex should return:

- Existing systems already available.
- Existing docs that should be updated.
- New docs needed, if any.
- Proposed file plan.
- Smallest safe implementation path.
- Risks and scope creep warnings.
- Blocking questions before editing.

## Codex Must Not Do Yet

Codex must not:

- Edit files.
- Rewrite docs.
- Change story data.
- Change engine files.
- Add UI.
- Rename Devin or Devon files.
- Create new systems.
- Create new folders unless only proposing them.

## After Codex Returns

Bring the Codex audit summary back to ChatGPT.

Do not paste the whole repo.

Bring back:

- Codex file plan.
- Codex risks.
- Codex recommended next step.
- Any blocking questions.
- Any naming drift findings.

ChatGPT should then approve, reduce, or revise the plan before Codex edits anything.

## Approval Standard

The audit is acceptable if it:

- Recognizes that the engine already supports many needed mechanics.
- Keeps the next step docs-only.
- Uses `docs/scopes/narrative-interaction-layer.md` as the anchor.
- Avoids duplicate documentation.
- Avoids engine rewrite.
- Proposes a small first implementation slice.
- Treats mobile testing as important.
- Flags Devin/Devon naming drift.

## Rejection Standard

Send the plan back for revision if Codex:

- Proposes a full NPC simulation engine.
- Proposes a broad engine rewrite.
- Creates a large new docs hierarchy.
- Ignores existing docs.
- Ignores existing facts, requirements, hidden events, visible aftermath, forced rules, or schedule systems.
- Starts implementation before the audit is approved.
- Expands beyond the narrative interaction layer.