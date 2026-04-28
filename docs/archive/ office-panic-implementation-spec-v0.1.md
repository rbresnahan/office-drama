# Office Panic Demo — Implementation Spec v0.1

## Purpose

This document defines the minimum code-facing requirements for implementing the Office Panic pressure system.

This is not code.

This is the bridge between the design documents and the JavaScript implementation.

---

# Implementation Goal

Implement a small playable version of the Office Panic demo that proves the core loop:

- Turns advance.
- Phases change.
- Bars update in 25% increments.
- Choices appear or disappear based on requirements.
- Choices unlock future choices.
- Red bars trigger backlash scenes.
- Internal dialogue responds to state.
- The all-hands resolves the final board.

---

# Recommended First Implementation Scope

Do not implement every scheme at once.

Start with a vertical slice.

## Required Green Bars

- Frame Frank.
- Warm Betty.
- Distract Tim.
- Contain Celia.
- Blame the System.
- Sideline Tim.

## Required Red Bars

- Tim Suspects You.
- Celia Finds Out.
- Frank Retaliates.
- Betty Loses Trust.
- Management Escalates.

## Required NPCs

- Betty.
- Tim.
- Frank.
- Celia.
- Devon.
- Lisa.

## Required Scenes

- Betty’s Desk.
- Tim’s Desk.
- Frank’s Desk.
- Celia’s Area.
- Break Room.
- Bathroom Hallway.
- Lisa’s Area.
- All-Hands Finale.

---

# State Model

The game state should track:

## Turn State

- Current turn number.
- Maximum turn number.
- Current phase.
- Whether the finale has started.

## Bar State

Green and red bars.

All bars use values:

- 0
- 25
- 50
- 75
- 100

## Discovery State

Boolean flags for information the player has learned.

Examples:

- `knowsTimFoodVulnerability`
- `knowsFrankUnderPressure`
- `knowsDevonSawEmail`
- `knowsCeliaHasNotSeenFullEmail`
- `knowsLisaTalkedToManagement`
- `bathroomSuppliesMissing`
- `bottlePlantedFrank`
- `bettyHeardFrankSuspicion`
- `devonHasFalseDetail`

## NPC State

Simple NPC flags.

Examples:

- `frankAwayFromDesk`
- `timHasNotes`
- `bettyWillingToHelp`
- `celiaHasFullEmail`
- `devonIsSpreading`
- `lisaIsDocumenting`

## Unlock State

Specific unlocked choices or scenes.

Examples:

- `canPlantBottle`
- `canAskBettyToDefend`
- `canBlameBettyForMissingSupplies`
- `canPushSystemFailureToLisa`
- `canFeedDevonFalseDetail`

## Backlash State

Track whether backlash scenes have already fired.

Examples:

- `bettyBacklashTriggered`
- `timBacklashTriggered`
- `frankBacklashTriggered`
- `celiaBacklashTriggered`
- `lisaBacklashTriggered`

---

# Phase Rules

The phase should be calculated from the current turn.

## Phase 1: Damage Control

Turns 1 to 5.

## Phase 2: Narrative Building

Turns 6 to 14.

## Phase 3: Pressure Rising

Turns 15 to 20.

## Phase 4: Final Setup

Turns 21 to 24.

## Finale

After turn 24.

---

# Bar Rules

## Increment Size

Bars move in 25% increments.

## Minimum Value

0%.

## Maximum Value

100%.

## Clamp Rule

Any effect that would move a bar below 0 should leave it at 0.

Any effect that would move a bar above 100 should leave it at 100.

## Display Rule

Green bars and red bars should be visually distinct.

Green bars represent player-built schemes.

Red bars represent threats.

## Hidden vs Visible Bars

For the first implementation, all bars can be visible.

Later versions may hide some bars until discovered.

---

# Choice Model

Each choice should support these fields:

## id

Stable machine-readable choice ID.

Example:

`ask_betty_frank_seemed_off`

## text

Text shown to the player.

Example:

`Ask Betty if Frank seemed strange today.`

## category

One or more choice categories.

Examples:

- `positive`
- `underhanded`
- `neutral`
- `info`
- `cleanup`
- `commitment`
- `pivot`

## requirements

Conditions required for the choice to appear.

Examples:

- Minimum phase.
- Maximum phase.
- Bar threshold.
- Discovery flag.
- NPC flag.
- Choice not already used.
- Backlash not triggered.

## effects

State changes applied when selected.

Examples:

- Bar changes.
- Discovery changes.
- NPC state changes.
- Unlocks.
- Locks.
- Resulting scene.

## resultText

Text shown after the choice is selected.

## nextScene

Optional scene ID to load next.

If no next scene is specified, the game can return to the normal scene pool.

---

# Requirement Types

The first implementation should support these requirement types:

## Phase Requirement

Example:

Choice appears only in Phase 2 or later.

## Bar Minimum Requirement

Example:

`Frame Frank >= 25`.

## Bar Maximum Requirement

Example:

`Betty Loses Trust <= 50`.

## Discovery Requirement

Example:

`knowsTimFoodVulnerability === true`.

## NPC State Requirement

Example:

`frankAwayFromDesk === true`.

## Choice Used Requirement

Example:

Choice appears only if another choice has or has not been used.

## Backlash Requirement

Example:

Choice appears only if Tim backlash has not triggered.

---

# Effect Types

The first implementation should support these effect types:

## Bar Change

Example:

- `Frame Frank +25`.
- `Tim Suspects You +25`.
- `Betty Loses Trust -25`.

## Discovery Set

Example:

- `knowsTimFoodVulnerability = true`.

## NPC State Set

Example:

- `frankAwayFromDesk = true`.

## Unlock Choice

Example:

- Unlock `plant_bottle_frank_drawer`.

## Lock Choice

Example:

- Lock `ask_frank_for_help`.

## Trigger Backlash

Example:

- Trigger `frank_backlash`.

## Add Signal

Short message shown in the UI as the latest consequence.

Example:

`Betty is now watching Frank.`

---

# Scene Model

Each scene should support these fields:

## id

Stable scene ID.

Example:

`betty_desk_phase_2`

## title

Scene title.

Example:

`Betty Watches the Room`

## location

Scene location.

Example:

`Betty’s Desk`

## phases

Array of phases where this scene can appear.

Example:

- `damage_control`
- `narrative_building`

## body

Main story text.

## internalThought

Strategic internal dialogue.

## choices

Array of choice IDs or inline choice objects.

## weight

Optional value for random or priority scene selection.

## once

Boolean for one-time scenes.

## requirements

Optional scene-level requirements.

---

# Scene Selection Rules

The first implementation can use simple scene selection.

Recommended order:

1. Check for required backlash scenes.
2. Check for forced scenes from previous choice.
3. If turn > max turns, load finale.
4. Otherwise, show available scenes for current phase.
5. Prefer scenes with valid choices.
6. Avoid repeating one-time scenes.

Do not overbuild scene selection yet.

The first version can be deterministic.

---

# Backlash Rules

Backlash scenes should trigger when red bars hit thresholds.

## Tim Backlash

Trigger:

- Tim Suspects You >= 75%.
- Not already triggered.

Effect:

Tim asks a precise question.

## Celia Backlash

Trigger:

- Celia Finds Out >= 100%.
- Not already triggered.

Effect:

Celia has the full message.

## Frank Backlash

Trigger:

- Frank Retaliates >= 75%.
- Frame Frank >= 50%.
- Not already triggered.

Effect:

Frank realizes he is being positioned.

## Betty Backlash

Trigger:

- Betty Loses Trust >= 75%.
- Not already triggered.

Effect:

Betty confronts the player.

## Lisa Backlash

Trigger:

- Management Escalates >= 75%.
- Not already triggered.

Effect:

Lisa starts documenting the incident formally.

---

# Internal Dialogue Rules

Internal dialogue should be selected based on current state.

Example:

## Frame Frank Internal Thought

If Frame Frank = 0:

Frank is available as a target, but nobody has a reason to look at him yet.

If Frame Frank = 50:

The Frank story has shape now. One more push could make people start interpreting everything he does as suspicious.

If Frank Retaliates = 75:

Frank knows enough to be dangerous. If you keep pushing, he may stop defending himself and start attacking you.

---

# Finale Resolver

The finale should read the board and assemble an ending.

The first implementation can use a simple priority-based resolver.

## Resolver Inputs

- Green bar values.
- Red bar values.
- Backlash flags.
- Key discoveries.
- Key NPC state.

## Resolver Output

The finale should output:

- Main outcome.
- NPC-specific consequences.
- Reputation consequence.
- Future hook.

---

# Finale Priority Rules

The finale should check high-severity red bars first.

## Catastrophic Conditions

If Management Escalates = 100:

The incident becomes formal discipline.

If Celia Finds Out = 100 and Contain Celia < 75:

Celia becomes the emotional center of the meeting.

If Tim Suspects You = 100 and Distract Tim < 75 and Sideline Tim < 100:

Tim exposes the timeline.

If Frank Retaliates = 100 and Frame Frank >= 50:

Frank publicly attacks the player.

If Betty Loses Trust = 100 and Warm Betty >= 50:

Betty reveals the player manipulated her.

---

# Scheme Success Rules

After checking catastrophic conditions, check scheme success.

## Frame Frank

If Frame Frank >= 75:

Frank absorbs significant blame.

If Frame Frank = 100:

Frank is a primary scapegoat.

## Warm Betty

If Warm Betty >= 75 and Betty Loses Trust <= 50:

Betty defends the player.

If Warm Betty = 100:

Betty actively protects the player.

## Distract Tim

If Distract Tim >= 75:

Tim’s timeline is weakened.

If Distract Tim = 100:

Tim cannot prove the player’s story is false.

## Sideline Tim

If Sideline Tim >= 75:

Tim is late, distracted, or weakened.

If Sideline Tim = 100:

Tim misses the key part of the meeting.

## Contain Celia

If Contain Celia >= 75:

Celia is angry but does not fully destroy the player.

If Contain Celia = 100:

Celia does not become the central witness.

## Blame the System

If Blame the System >= 75:

The meeting shifts toward process failure.

If Blame the System = 100:

Management focuses on communication policy instead of only personal blame.

---

# Ending Tone Rules

Endings should be blended, not binary.

The player can:

- Survive cleanly.
- Survive messily.
- Shift blame but lose trust.
- Keep a relationship but take blame.
- Avoid formal discipline but become socially radioactive.
- Destroy Frank but make Tim suspicious.
- Win Betty but lose Celia.
- Blame the system but trigger management oversight.

The best endings should still have consequences.

The worst endings should still feel earned.

---

# Minimum Data Needed Before Coding

Before implementation, prepare at least:

## Scenes

- 2 Betty scenes.
- 2 Tim scenes.
- 2 Frank scenes.
- 2 Celia scenes.
- 2 Devon scenes.
- 1 Lisa scene.
- 1 Bathroom Hallway scene.
- 1 All-Hands finale scene.

## Choices

At least 30 choices total.

Recommended distribution:

- 6 Frame Frank choices.
- 6 Warm Betty choices.
- 4 Distract Tim choices.
- 4 Contain Celia choices.
- 4 Blame the System choices.
- 4 Sideline Tim choices.
- 2 cleanup choices.
- 2 pivot choices.

## Backlash Scenes

- Tim backlash.
- Betty backlash.
- Frank backlash.
- Celia backlash.
- Lisa backlash.

## Finale Fragments

At least one fragment for each major bar at:

- 50%.
- 75%.
- 100%.

This allows the finale to assemble blended endings.

---

# Implementation Order

Use this order.

## Step 1

Add bar state.

## Step 2

Add progress bar UI.

## Step 3

Add turn and phase tracking.

## Step 4

Add choice effects.

## Step 5

Add choice requirements.

## Step 6

Add discoveries and unlocks.

## Step 7

Add backlash triggers.

## Step 8

Add internal dialogue by state.

## Step 9

Add finale resolver.

## Step 10

Expand content.

---

# First Playable Vertical Slice

The first playable slice should include:

## Strong Route

Frame Frank.

## Opposite Route

Warm Betty.

## Main Threat

Tim Suspects You.

## Secondary Threat

Celia Finds Out.

## One Underhanded Side Scheme

Sideline Tim.

## Finale

All-hands resolver.

This proves the game.

After this works, add Betty Klepto, Devon Leak, Lisa Overreacting, and Celia Dramatic.

---

# Testing Checklist

During testing, verify:

## Bars

- Bars increase in 25% increments.
- Bars clamp at 0 and 100.
- Green and red bars are visually distinct.
- Bars update immediately after choices.

## Turns

- Turn count advances correctly.
- Phase changes happen at the correct turns.
- Finale triggers after max turns.

## Requirements

- Locked choices do not appear.
- Choices appear after discoveries.
- Commitment choices require proper setup.
- Cleanup choices appear after relevant damage.

## Backlash

- Backlash scenes trigger at thresholds.
- Backlash scenes do not repeat.
- Backlash effects change the game state.

## Finale

- Finale reflects partial progress.
- Finale reflects high red bars.
- Finale reflects completed schemes.
- Finale does not produce contradictory outcomes.

## Replayability

- Different early choices unlock different future choices.
- The player can pursue at least two strategies.
- The player cannot max every strategy.
- Underhanded choices feel powerful but costly.
- Positive choices feel safer but not always sufficient.

---

# Development Warning

Do not polish before the loop works.

Ugly UI with good pressure is better than beautiful UI with dead choices.

First prove:

- The player can build a con.
- The con unlocks future moves.
- The future moves create risk.
- The finale reads the damage.

Once that works, make it pretty.