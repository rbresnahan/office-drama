# Office Panic Demo — Discovery and Location System v0.1

## Purpose

This document defines how discovery routes and location identity should work in Office Panic.

The goal is to make future choices feel earned.

The player should not receive every powerful option immediately.

They should discover routines, vulnerabilities, movement patterns, and social connections, then use that information later.

---

# Core Idea

Discovery is how the player earns future choices.

A discovery can reveal:

- A routine.
- A vulnerability.
- A relationship.
- A location opportunity.
- A witness.
- A timing window.
- A contradiction.
- A future risk.

Discovery should often cost a turn.

That turn should feel worthwhile because it unlocks future choices or makes later choices safer.

Inspection is a content convention first, not a new engine system.

An inspect choice should usually:

- Use the `info` category.
- Use `advanceTurn: false`.
- Stay in the current scene unless the choice clearly moves the player.
- Reveal one useful fact or flag.
- Use short result text as immediate feedback.
- May add `hiddenEvents`.
- May queue visible aftermath through existing aftermath data.
- May update `latestSignal` or player-facing feedback.

Meaningful follow-up actions, such as taking, planting, sabotaging, or manipulating, usually advance the turn.

---

# Why This Matters

The core game loop depends on staged schemes.

A player should not be able to immediately choose:

- Plant the bottle.
- Make Tim miss the meeting.
- Blame Betty for missing supplies.
- Ask Betty to defend you.
- Push system failure through Lisa.

Those choices need setup.

Discovery provides that setup.

This creates replayability because different early discoveries unlock different later options.

---

# Discovery Types

## Routine Discovery

The player learns what someone usually does.

Examples:

- Tim labels his lunch.
- Betty watches the kitchen.
- Frank leaves his desk at predictable times.
- Lisa checks the all-hands agenda.
- Devon hangs around the break room.

Use this when unlocking physical or timing-based schemes.

---

## Vulnerability Discovery

The player learns a weakness or pressure point.

Examples:

- Tim has a food vulnerability.
- Frank is under pressure.
- Betty worries about doing the right thing.
- Celia has not seen the full message.
- Lisa wants to keep things process-safe.
- Devon likes knowing what others do not.

Use this when unlocking underhanded or positive routes.

---

## Awareness Discovery

The player learns what someone knows.

Examples:

- Celia has only heard fragments.
- Tim is checking recall logs.
- Betty knows Tim is asking questions.
- Devon has seen part of the email.
- Lisa knows management may address the incident.

Use this when determining whether the player is preventing discovery or managing fallout.

---

## Location Discovery

The player learns where someone is, was, or tends to be.

Examples:

- Frank is away from his desk.
- Betty saw someone enter the kitchen.
- Tim was near the printer.
- Devon moved from the break room toward Celia.
- Lisa has the conference room calendar open.

Use this when making location choices matter.

---

## Evidence Discovery

The player discovers or creates something that can be used later.

Examples:

- The bottle exists.
- Bathroom supplies are stocked or missing.
- Tim has meeting notes.
- A printed copy of the email exists.
- Devon has a partial version.
- Lisa is documenting.

Use this when unlocking commitment choices or backlash scenes.

---

# Discovery State

Discovery should be tracked as boolean flags.

Current and proposed flags:

- `knowsTimFoodVulnerability`
- `sawTimLabeledFood`
- `knowsTimLunchRoutine`
- `timHasNotes`
- `timChecksRecallLogs`
- `knowsFrankUnderPressure`
- `sawFrankDeskEmpty`
- `frankAwayFromDesk`
- `knowsFrankTargetTension`
- `frankLeftBagOut`
- `knowsBettyWatchesKitchen`
- `bettyNoticesOfficeMovement`
- `bettySawFrankAway`
- `knowsCeliaHasNotSeenFullEmail`
- `celiaHeardFragments`
- `celiaHasFullEmail`
- `devonMayTellCelia`
- `frankMayTellCelia`
- `knowsDevonSawEmail`
- `devonHasPartialVersion`
- `devonCanCarryFalseDetail`
- `devonCanSupportSystemConfusion`
- `knowsLisaTalkedToManagement`
- `knowsAllHandsAgendaShifted`
- `knowsManagementPressure`
- `lisaCanDelayEscalation`
- `bathroomSuppliesKnown`
- `bathroomSuppliesMissing`
- `bottlePlantedFrank`

---

# Discovery Should Unlock Choices

A discovery should usually unlock at least one future choice.

Examples:

## Tim Food Discovery

Discovery:

- `knowsTimFoodVulnerability`

Unlocks:

- Create lunch confusion.
- Watch the fridge.
- Ask Devon about Tim’s lunch.
- Later remove bathroom backup supplies.

---

## Frank Desk Discovery

Discovery:

- `frankAwayFromDesk`

Unlocks:

- Plant evidence at Frank’s desk.
- Search Frank’s desk.
- Let Devon discover something near Frank’s desk.
- Ask Betty whether she saw Frank leave.

---

## Betty Kitchen Discovery

Discovery:

- `knowsBettyWatchesKitchen`

Unlocks:

- Ask Betty who went into the kitchen.
- Use Betty as a witness for Tim’s lunch route.
- Risk Betty seeing the player near the fridge.
- Later frame Betty for moving supplies.

---

## Devon Partial Version Discovery

Discovery:

- `devonHasPartialVersion`

Unlocks:

- Feed Devon a controlled false detail.
- Blame Devon for rumor spread.
- Tell Celia she heard Devon’s version.
- Ask Tim whether Devon forwarded anything.

---

## Lisa Management Discovery

Discovery:

- `knowsAllHandsAgendaShifted`

Unlocks:

- Ask Lisa to delay escalation.
- Push the system-failure route.
- Suggest Lisa is making things formal.
- Prepare for management escalation.

---

# Discovery Choices Should Not Feel Like Dead Turns

A discovery choice can have small immediate effects.

Examples:

- Reveals hidden risk.
- Adds a signal message.
- Unlocks a later option.
- Adds minor suspicion if asked too directly.
- Adds minor trust if asked naturally.

A discovery choice should usually avoid major bar movement unless the discovery itself changes the social board.

---

# Discovery Choice Examples

## Betty Discovery Example

Choice:

Ask Betty whether she saw anyone go into the kitchen.

Result:

Betty says Tim was near the fridge earlier, but Devon was hovering too.

Effects:

- Set `knowsBettyWatchesKitchen`.
- Set `bettyNoticesOfficeMovement`.
- Unlock kitchen/fridge follow-up choices.
- Tim Suspects You +25% if the question is asked after Tim is already suspicious.

---

## Tim Discovery Example

Choice:

Make boring small talk about Tim’s morning routine.

Result:

Tim mentions he barely had time to prep for the meeting and points at his notes.

Effects:

- Set `timHasNotes`.
- Set `timChecksRecallLogs`.
- Unlock steal/distract notes route later.
- Tim Suspects You +25% if the player has already steered Tim once.

---

## Frank Discovery Example

Choice:

Watch Frank’s desk long enough to see if he returns.

Result:

Frank does not come back.

Effects:

- Set `frankAwayFromDesk`.
- Set `sawFrankDeskEmpty`.
- Unlock plant bottle.
- Costs one turn.

---

## Celia Discovery Example

Choice:

Watch whether Celia checks her email.

Result:

Celia keeps looking at her inbox but has not opened the thread yet.

Effects:

- Set `knowsCeliaHasNotSeenFullEmail`.
- Set `celiaHeardFragments`.
- Unlock early containment or direct apology.
- Celia Finds Out +25% if Devon Leak is already high.

---

## Devon Discovery Example

Choice:

Ask Devon whether he saw the email or only heard about it.

Result:

Devon saw a fragment and heard the rest from someone else.

Effects:

- Set `devonHasPartialVersion`.
- Set `devonCanCarryFalseDetail`.
- Unlock Devon Leak and Celia fragment route.
- Devon Leak +25%.

---

## Lisa Discovery Example

Choice:

Ask why the all-hands invite changed.

Result:

Lisa says leadership wants to keep communication norms from becoming a bigger issue.

Effects:

- Set `knowsAllHandsAgendaShifted`.
- Set `knowsManagementPressure`.
- Management Escalates +25%.
- Unlock system route and Lisa Overreacting route.

---

# Location Identity Rules

Locations should create opportunity and risk.

A location is not just a menu.

Each location should imply:

- Who might be seen there.
- What can be discovered there.
- What can be done there.
- Who might notice the player there.
- Which schemes connect to that location.

---

# Current Locations

## Open Office Floor

Purpose:

- Main hub.
- Read overall room state.
- Choose where to go next.
- Show internal strategic summary.

Risks:

- Passive danger can rise if too many turns pass.
- People may notice movement patterns later.

---

## Betty’s Desk

Purpose:

- Emotional trust.
- Office movement witness.
- Frank suspicion seed.
- Tim information.
- Celia awareness.

Risks:

- Betty notices contradictions.
- Betty may check on Celia.
- Betty may later realize she was recruited.

---

## Tim’s Desk

Purpose:

- Timeline information.
- Recall logs.
- System route.
- Tim suspicion management.
- Meeting notes discovery.

Risks:

- Tim notices leading questions.
- Tim compares the player’s statements with others.

---

## Frank’s Desk

Purpose:

- Empty desk opportunity.
- Evidence planting.
- Frank vulnerability.
- Frank honest route.

Risks:

- Frank notices.
- Betty may have seen movement.
- Tim may connect desk timing.

---

## Celia’s Area

Purpose:

- Target awareness.
- Early apology.
- Containment.
- High-risk credibility attack.

Risks:

- Overexplaining increases Celia awareness.
- Vague apology can reveal that there is something to find.

---

## Break Room

Purpose:

- Devon gossip.
- Tim lunch route.
- Fridge route.
- Rumor thermometer.
- Frank rumor spread.

Risks:

- Devon carries details unpredictably.
- Betty may watch kitchen traffic.
- Tim may notice food tampering.

---

## Bathroom Hallway

Purpose:

- Sideline Tim route.
- Missing supplies.
- Betty Klepto tie-in.
- Office chaos.

Risks:

- High tonal and management risk.
- Lisa can escalate.
- Betty may become tied to missing supplies.

---

## Lisa’s Area

Purpose:

- Management pressure.
- Process route.
- System route.
- Formal escalation.

Risks:

- Lisa documents.
- Policy route can become formal.
- Tim may feed Lisa evidence.

---

# Implementation Rules

## Discovery Before Commitment

Commitment moves should require discoveries.

Examples:

Plant bottle in Frank’s drawer should require:

- Frame Frank >= 50%.
- `frankAwayFromDesk` is true.
- Phase is narrative building or later.
- Frank honest route has not been chosen.

Sideline Tim final move should require:

- Sideline Tim >= 75%.
- `knowsTimFoodVulnerability` is true.
- `timLunchCompromised` is true.
- `bathroomSuppliesMissing` is true.

---

## Repeated Visits Should Change Available Choices

A player can revisit a location.

But repeated choices should evolve.

Do not let the player repeatedly press the same social button.

Use:

- `once: true` for unique beats.
- Follow-up choices unlocked by previous choices.
- Different text after discovery.
- Cleanup choices with costs.
- Backlash if contradiction builds.

---

## Cleanup Must Cost Something

Cleanup choices should not erase consequences for free.

If cleanup lowers a red bar, it should often:

- Lower a green scheme bar.
- Lock a commitment move.
- Increase another red bar.
- Cost a turn.
- Trigger suspicion if repeated.

Example:

Calming Frank should reduce Frank Retaliates but weaken Frame Frank.

Giving Tim a boring truth should reduce Tim Suspects You but strengthen Blame the System or reduce Distract Tim.

Repairing Betty trust should weaken the underhanded route that damaged her.

---

# Testing Goals

The next implementation pass should prove:

1. Discovery choices unlock later choices.
2. Locations feel distinct.
3. Repeated visits do not feel robotic.
4. Cleanup choices are no longer free money.
5. Underhanded choices create useful leverage and visible risk.
6. Positive choices feel safer but not always sufficient.
7. Celia remains clear as the current email target.
8. Target-role behavior remains documented but not implemented.

---

# Example Test Route

## Route: Earn the Frank Bottle Choice

Turn 1:

Go to Betty.

Choice:

Ask whether Frank has seemed strange.

Effects:

- Frame Frank +25%.
- Frank Retaliates +25%.
- Unlock Frank-related follow-up.

Turn 2:

Go to Tim.

Choice:

Mention Frank was away from his desk.

Effects:

- Frame Frank +25%.
- Distract Tim +25%.
- Tim Suspects You +25%.

Turn 3:

Go to Frank’s desk.

Choice:

Watch whether Frank returns.

Effects:

- Set `frankAwayFromDesk`.
- Unlock plant bottle.

Turn 4:

Go to Frank’s desk.

Choice:

Plant the bottle.

Effects:

- Frame Frank +25%.
- Frank Retaliates +25%.
- Management Escalates +25%.

Expected result:

The player earned the choice through setup.

It did not appear immediately.

---

# Example Test Route

## Route: Earn the Tim Lunch Scheme

Turn 1:

Go to Betty.

Choice:

Ask why Tim labels his lunch.

Effects:

- Sideline Tim +25%.
- Set `knowsTimFoodVulnerability`.

Turn 2:

Go to Break Room.

Choice:

Create confusion around Tim’s labeled lunch.

Effects:

- Sideline Tim +25%.
- Tim Suspects You +25%.
- Set `timLunchCompromised`.

Turn 3:

Go to Bathroom Hallway.

Choice:

Remove bathroom backup supplies.

Effects:

- Sideline Tim +25%.
- Management Escalates +25%.
- Betty Klepto +25%.
- Set `bathroomSuppliesMissing`.

Turn 4 or later:

Go to Tim.

Choice:

Nudge Tim toward eating before the all-hands.

Effects:

- Sideline Tim +25%.
- Tim may miss the meeting.
- Management Escalates +25%.

Expected result:

The Tim sideline scheme requires multiple discoveries and setup actions.

It should feel earned and nasty, not instant.

---

# Future Target System Notes

Do not implement this yet.

Eventually, target-specific variables can be abstracted.

Current:

- `celiaFindsOut`
- `containCelia`
- `celiaDramatic`
- `celiaHasFullEmail`

Future:

- `targetFindsOut`
- `containTarget`
- `targetDramatic`
- `targetHasFullEmail`

For now, keep Celia-specific state because the current demo is about Celia.

Premature abstraction will slow the prototype down.

Tiny architecture goblin says “generalize everything.”

Do not feed him yet.
