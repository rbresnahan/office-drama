# Narrative Layer Codex Workflow

## Purpose

This document defines the collaboration workflow for implementing the narrative interaction layer without wasting tokens or allowing scope creep.

The goal is to use ChatGPT for planning, review, and architecture guardrails, and Codex for repo inspection, diffs, and implementation.

## Core Rule

Codex should not freestyle the architecture.

Codex should inspect the repo, report findings, and wait for approval before editing.

The existing game mechanics already support many of the required narrative-layer behaviors. The first implementation passes should use existing systems before proposing new engine features.

## Role Split

### ChatGPT Role

ChatGPT is responsible for:

- Defining the scope.
- Writing or revising task briefs.
- Reviewing Codex audit summaries.
- Catching scope creep.
- Keeping the work aligned with the player experience goal.
- Translating playtest feedback into narrow implementation phases.
- Deciding whether code changes are necessary.

### Codex Role

Codex is responsible for:

- Inspecting the actual repo.
- Comparing docs against current code.
- Proposing a file plan.
- Making approved edits only.
- Returning concise summaries of changes.
- Running available validation commands.
- Reporting risks and uncertain areas.

## Token Efficiency Rule

Do not paste full files back and forth unless needed.

Prefer this loop:

1. ChatGPT creates a narrow Codex prompt.
2. Codex inspects and returns a short audit.
3. User brings the audit summary back to ChatGPT.
4. ChatGPT approves or narrows the next step.
5. Codex edits only approved files.
6. Codex returns changed files, validation results, and risks.
7. User playtests.
8. ChatGPT reviews only the summary and test results.

## Gate 1: Audit Only

Codex must inspect the repo and return a plan.

Codex must not edit files during this gate.

Codex should answer:

- What systems already exist?
- Which docs already cover this layer?
- Which docs should be updated?
- Is a new doc needed?
- Are there naming mismatches?
- What is the smallest safe implementation path?

## Gate 2: ChatGPT Review

After Codex returns the audit, bring the summary back to ChatGPT.

ChatGPT should check:

- Is Codex proposing an engine rewrite?
- Is Codex duplicating existing docs?
- Is Codex ignoring existing mechanics?
- Is Codex proposing too much at once?
- Is Codex treating discovery, aftermath, forced scenes, and schedule as existing systems?
- Is Codex respecting mobile-first testing?

Do not proceed to edits until this review is complete.

## Gate 3: Docs-Only Edits

Codex may edit docs only after the audit is approved.

Primary file:

- `docs/scopes/narrative-interaction-layer.md`

Likely supporting docs:

- `docs/design/office-panic-discovery-location-system.md`
- `docs/design/office-panic-scheme-chains.md`
- `docs/design/office-panic-content-authoring-rules.md`
- `docs/mechanics/inspect-visible-hidden-aftermath.md`
- `docs/implementation/limited-scope-refinement-plan.md`

Codex should not create a new docs folder unless the audit proves it is necessary.

## Gate 4: Content/Data Implementation

After docs are approved, Codex may update story content and story data.

This phase should use existing systems first:

- `facts`
- `requirements`
- `hiddenEvents`
- `visibleAftermathQueue`
- `visibleAftermathBeats`
- `forcedRules`
- `schedule`
- `feedback`
- `latestSignal`
- `unlocked`
- `locked`
- `usedChoices`

Codex should not modify engine files unless a specific limitation is identified and approved.

## Gate 5: Small Playtest Review

After each implementation pass, manually playtest one or two paths.

Bring back:

- What path was tested.
- What worked.
- What felt confusing.
- Whether the player understood why a scheme became available.
- Whether the office felt more reactive.
- Any validation output or browser errors.

Do not stack multiple phases without playtesting.

## Phase Order

### Phase 0: Task Brief

Create the Codex task brief and workflow docs.

No repo edits by Codex yet.

### Phase 1: Audit

Codex inspects the repo and proposes a file plan.

No edits.

### Phase 2: Docs-Only Update

Codex fills the blank scope file and updates supporting docs only if needed.

### Phase 3: Frank Discovery Slice

Codex implements one narrow discovery-gated scheme path around Frank, the kitchen bottle, and office gossip.

### Phase 4: Visible Aftermath Slice

Codex adds short aftermath beats that show the office moving after the player leaves a location or causes a social ripple.

### Phase 5: Schedule Panel

Codex expands the existing schedule display into a clearer schedule button, modal, or panel.

Mobile behavior must be reviewed first.

### Phase 6: Devin Approach Scenes

Codex adds one or two lightweight Devin approach scenes triggered by prior player actions.

### Phase 7: Broader NPC Reactions

Codex adds small reactions for Betty, Frank, Tim, Lisa, and Celia only after Devin proves the pattern works.

### Phase 8: Tune

Review pacing, interruption frequency, unlock clarity, and mobile usability.

## Scope Guardrails

Do not rewrite the engine.

Do not build a full NPC simulation system.

Do not add massive dialogue trees.

Do not make every object interactable.

Do not turn the game into open world.

Do not create duplicate docs when an existing doc should be updated.

Do not change renderer, state, guards, or game engine files unless the approved task specifically requires it.

## Player Experience Target

The implementation should make these things happen:

- The player walks around more.
- The player talks to more people.
- The player understands why a scheme became available.
- The player sees characters reacting to earlier actions.
- The office feels increasingly unstable as the day progresses.

## Implementation Bias

Prefer story data changes over engine changes.

Prefer one strong example over five half-built systems.

Prefer short reactive scenes over large dialogue trees.

Prefer visible cause and effect over hidden cleverness.

Prefer mobile-first playability over desktop polish.

## Naming Rule

Use `Devin` consistently.

If the repo contains `Devon`, Codex should report the mismatch during audit and propose a safe rename plan.

Do not rename files during the audit gate.