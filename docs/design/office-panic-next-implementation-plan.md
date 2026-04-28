# Office Panic Demo — Next Implementation Plan v0.2

## Purpose

This document defines the next implementation pass for Office Panic.

The goal is to incorporate discovery routes and location identity without overbuilding the long-term randomized target system.

This pass should make the prototype feel more strategic, less repetitive, and more replayable.

---

# Implementation Goal

Implement discovery-driven choices.

The player should need to learn routines and vulnerabilities before major underhanded choices appear.

The next version should prove:

- Discovery unlocks future choices.
- Repeated location visits show evolved options.
- Cleanup choices cost leverage.
- NPC locations matter.
- Celia remains the clear email subject.
- Target randomization remains future design only.

---

# Do Not Implement Yet

Do not implement randomized email targets.

Do not rename every Celia variable to target variables yet.

Do not create a generalized NPC engine yet.

Do not add too many new bars.

The current prototype should stay small enough to test.

---

# Keep Current Core Bars

## Green Bars

- Frame Frank.
- Warm Betty.
- Distract Tim.
- Contain Celia.
- Blame the System.
- Sideline Tim.
- Betty Klepto Story.
- Devon Is the Leak.
- Lisa Is Overreacting.
- Celia Is Dramatic.

## Red Bars

- Tim Suspects You.
- Celia Finds Out.
- Frank Retaliates.
- Betty Loses Trust.
- Management Escalates.

---

# Add or Strengthen Discovery Flags

Add or use these flags in story data.

## Betty Discovery Flags

- `knowsBettyWatchesKitchen`
- `bettyNoticesOfficeMovement`
- `bettyKnowsTimLunchRoutine`
- `bettySawFrankAway`

## Tim Discovery Flags

- `sawTimLabeledFood`
- `knowsTimFoodVulnerability`
- `knowsTimLunchRoutine`
- `timHasNotes`
- `timChecksRecallLogs`

## Frank Discovery Flags

- `sawFrankDeskEmpty`
- `frankAwayFromDesk`
- `knowsFrankUnderPressure`
- `knowsFrankTargetTension`
- `frankLeftBagOut`

## Celia Discovery Flags

- `knowsCeliaHasNotSeenFullEmail`
- `celiaHeardFragments`
- `celiaHasFullEmail`
- `devonMayTellCelia`
- `frankMayTellCelia`

## Devon Discovery Flags

- `knowsDevonSawEmail`
- `devonHasPartialVersion`
- `devonCanCarryFalseDetail`
- `devonMayReachCelia`
- `devonCanSupportSystemConfusion`

## Lisa Discovery Flags

- `knowsLisaTalkedToManagement`
- `knowsAllHandsAgendaShifted`
- `knowsManagementPressure`
- `lisaCanDelayEscalation`

## Evidence and Location Flags

- `bathroomSuppliesKnown`
- `bathroomSuppliesMissing`
- `bottlePlantedFrank`
- `timLunchCompromised`

---

# Required Engine Changes

The current engine already supports most of this.

Required engine support already exists:

- Choice requirements.
- Flags.
- NPC state.
- Used choices.
- Locked and unlocked choices.
- Once-only choices.
- Bar thresholds.
- Phase thresholds.
- Backlash rules.

No major engine refactor is required for this pass.

---

# Story Data Updates

Most work should happen in `assets/stories/demo-story.js`.

Update story content to support discovery-driven routes.

---

## Update Betty’s Desk

Add discovery choices that make Betty more than an emotional witness.

Recommended additions:

### Choice: Ask Betty whether she saw anyone go into the kitchen

Category:

- Info.
- Discovery.

Effects:

- Set `knowsBettyWatchesKitchen`.
- Set `bettyNoticesOfficeMovement`.
- Unlock kitchen/fridge-related follow-up choices.
- Maybe Tim Suspects You +25% if Tim is already suspicious.

Purpose:

This supports Tim lunch route and makes Betty a movement witness.

---

### Choice: Notice Betty watching the break room

Category:

- Discovery.

Effects:

- Set `knowsBettyWatchesKitchen`.
- Unlock later risk that Betty may see player near the fridge.
- Warm Betty +25% only if framed as concern rather than manipulation.

Purpose:

This makes Betty’s location identity visible.

---

## Update Tim’s Desk

Add discovery choices that reveal Tim’s routines.

Recommended additions:

### Choice: Make boring small talk about Tim’s meeting prep

Category:

- Info.
- Discovery.

Effects:

- Set `timHasNotes`.
- Set `timChecksRecallLogs`.
- Unlock later choice to distract Tim from his notes.
- Tim Suspects You +25% if the player already asked too many leading questions.

Purpose:

Tim’s procedural danger becomes tangible.

---

### Choice: Notice Tim’s labeled lunch bag near his desk

Category:

- Discovery.

Effects:

- Set `sawTimLabeledFood`.
- Unlock Betty follow-up about Tim’s food vulnerability.
- Does not immediately advance Sideline Tim unless the player connects it.

Purpose:

Makes Tim sideline route feel less like a magic option.

---

## Update Frank’s Desk

Frank’s desk already supports discovery.

Strengthen the requirements so hard commitment requires discovery.

Plant bottle should require:

- Frame Frank >= 50%.
- `frankAwayFromDesk` is true.
- `confirmedFrankAway` or `sawFrankDeskEmpty` is true.
- Frank honest route not chosen.

Add or confirm:

- Watching Frank’s desk is once-only.
- Asking Frank for help weakens Frame Frank.
- Cleanup is not free.

---

## Update Celia’s Area

Keep Celia as the target.

Add or strengthen discovery around awareness state.

Recommended additions:

### Choice: Watch whether Celia has opened the thread

Category:

- Discovery.
- Info.

Effects:

- Set `knowsCeliaHasNotSeenFullEmail`, if applicable.
- Set `celiaHeardFragments`.
- Unlock early containment.
- Celia Finds Out +25% if Devon Leak is already high.

Purpose:

The player should understand whether they are preventing discovery or managing fallout.

---

## Update Break Room

Break Room should become the main discovery and rumor node.

Recommended additions:

### Choice: Ask Devon whether he saw the email or only heard about it

Category:

- Discovery.
- Info.

Effects:

- Set `devonHasPartialVersion`.
- Set `devonCanCarryFalseDetail`.
- Devon Leak +25%.
- Unlock Devon false-detail route.

Purpose:

Makes Devon Leak more intentional.

---

### Choice: Watch who Devon talks to after leaving

Category:

- Discovery.

Effects:

- Set `devonMayReachCelia`.
- Celia Finds Out +25%, if Devon Leak is already active.
- Unlock cleanup choice to stop Devon.

Purpose:

Makes rumor spread spatial and visible.

---

## Update Bathroom Hallway

Bathroom Hallway already supports the Tim sideline route.

Strengthen requirements:

Remove bathroom backup supplies should require:

- `knowsTimFoodVulnerability` is true.
- `timLunchCompromised` is true.
- Phase is narrative building or later.

Blame Betty for missing supplies should require:

- `bathroomSuppliesMissing` is true.
- Betty Klepto >= 50%.

Purpose:

Keep the route earned.

---

## Update Lisa’s Area

Lisa should reveal formal pressure.

Recommended additions:

### Choice: Ask why the all-hands invite changed

Category:

- Discovery.
- Info.

Effects:

- Set `knowsAllHandsAgendaShifted`.
- Set `knowsManagementPressure`.
- Management Escalates +25%.
- Unlock Lisa Overreacting and system route.

Purpose:

Makes Lisa the meeting-pressure window.

---

### Choice: Ask Lisa whether there is still time to keep this informal

Category:

- Positive.
- Cleanup.

Effects:

- Management Escalates -25%.
- Blame the System -25%, if the player stops using process confusion.
- Set `lisaCanDelayEscalation`.

Purpose:

Creates a positive Lisa route and makes cleanup cost leverage.

---

# Repetition Fixes

Every unique social beat should usually include:

- `once: true`.

Repeated visits should produce new choices because of:

- Prior choices.
- Discovery flags.
- Bar thresholds.
- Phase changes.
- Backlash state.

Avoid letting the player repeatedly select:

- Same apology.
- Same cleanup.
- Same information request.
- Same suspicion seed.

---

# Cleanup Cost Rules

Apply these to story data.

## Frank Cleanup

If Frank Retaliates decreases, Frame Frank should often decrease.

Example:

- Frank Retaliates -25%.
- Frame Frank -25%.

## Tim Cleanup

If Tim Suspects You decreases, Distract Tim should often decrease or Blame the System should increase.

Example:

- Tim Suspects You -25%.
- Distract Tim -25%.

Or:

- Tim Suspects You -25%.
- Blame the System +25%.

## Betty Cleanup

If Betty Loses Trust decreases after manipulation, the related scheme should weaken.

Example:

- Betty Loses Trust -25%.
- Frame Frank -25%, if the damage came from Frank steering.
- Betty Klepto -25%, if the damage came from the klepto route.

## Lisa Cleanup

If Management Escalates decreases, the player should lose some process leverage.

Example:

- Management Escalates -25%.
- Blame the System -25%.

---

# Player-Facing Status Improvements

Keep current bar IDs internally.

Optionally update labels later.

Current label examples:

- Frame Frank.
- Warm Betty.
- Tim Suspects You.

Potential player-facing labels:

- Frank Looks Plausible.
- Betty May Defend You.
- Tim Is Building a Timeline.
- Celia Is Hearing Fragments.
- Frank Is On To You.
- Lisa Is Making This Formal.

This can be a later UI polish pass.

Do not block implementation on renaming labels.

---

# Target System Decision

Current decision:

Keep Celia as the email subject.

Reason:

The current prototype is still proving the scheme engine.

Randomizing the target now would create extra abstraction before the core story has enough weight.

Future direction:

When ready, create a story-level target object:

- Target ID.
- Target name.
- Target awareness bar.
- Target containment bar.
- Target dramatic route.
- Target-specific finale fragments.
- NPC-specific target behavior.

Not needed now.

---

# Next Implementation Order

## Step 1

Update story data with new discovery choices.

## Step 2

Make sure commitment choices require discoveries.

## Step 3

Add once-only flags to repeated social beats.

## Step 4

Add follow-up choices after discovery.

## Step 5

Make cleanup choices cost leverage.

## Step 6

Test Frank route.

## Step 7

Test Tim sideline route.

## Step 8

Test Betty trust route.

## Step 9

Test Celia awareness route.

## Step 10

Test Lisa management route.

---

# Minimum Test Routes

## Frank Route

Expected chain:

- Seed Frank suspicion with Betty.
- Mention Frank to Tim.
- Discover Frank is away.
- Plant bottle.
- See Frame Frank progress.
- See Frank Retaliates risk.

Pass condition:

Plant bottle does not appear before the setup exists.

---

## Tim Sideline Route

Expected chain:

- Discover Tim lunch vulnerability.
- Create lunch confusion.
- Remove bathroom backup supplies.
- Nudge Tim to eat.
- Tim misses or weakens all-hands.

Pass condition:

The final Tim move does not appear without all setup steps.

---

## Betty Route

Expected chain:

- Tell Betty you feel awful.
- Give Betty a small truth.
- Later ask her to defend you if trust is high enough.
- If Betty Loses Trust rises too high, defense option disappears or backfires.

Pass condition:

Betty cannot be farmed with repeated identical sympathy choices.

---

## Celia Route

Expected chain:

- Learn what Celia knows.
- Decide whether to apologize, contain, avoid, or manipulate.
- Celia Finds Out should rise if Devon or overexplaining gets involved.
- Celia backlash triggers if she reaches full awareness.

Pass condition:

The player understands Celia is the subject of the email.

---

## Lisa Route

Expected chain:

- Discover all-hands pressure.
- Choose whether to cooperate, blame system, or make Lisa look like the escalator.
- Management Escalates should rise or fall based on those choices.

Pass condition:

Lisa feels like the process/formality threat, not just another gossip node.

---

# Implementation Readiness

This idea is ready to implement.

No major engine rewrite is required.

Most changes belong in:

- `assets/stories/demo-story.js`

Possible small renderer or UI changes can wait.

The next code pass should be a story-data expansion and balance pass, not a core architecture rewrite.
