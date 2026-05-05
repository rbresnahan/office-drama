# Narrative Interaction Layer

## Status

Approved scope anchor for the narrative interaction layer.

This document defines the intended narrative interaction layer for Office Panic.

The current game mechanics are working well enough to build on. This layer should not replace the engine. It should make better use of the existing story, state, effect, guard, aftermath, forced-scene, and schedule systems.

## Problem

The game currently has strong mechanics, but the player does not always feel enough interaction with the characters or environments.

The player can make choices and see consequences, but some choices can feel too menu-like.

The player needs more reasons to:

- Move around the office.
- Talk to different people.
- Inspect rooms.
- Learn useful facts.
- Understand why schemes become available.
- See NPCs react to earlier actions.
- Feel the office becoming more unstable as the day progresses.

The game should feel less like button chess and more like a social pressure simulator inside a small, anxious office.

## Goal

Add a controlled narrative reactivity layer where schemes, reactions, and pressure emerge from things the player discovers, causes, and fails to contain.

The player should feel like they are assembling bad ideas from office clues, gossip, timing, and character vulnerabilities.

## Core Experience

The player should think:

- I should talk to Frank before I try to blame Frank.
- I should inspect the kitchen before I use the bottle.
- I should talk to Betty because she notices who moves through the office.
- I should worry that Tim is building a timeline.
- I should worry when Lisa starts documenting things.
- I should listen when Devon brings gossip, even if he is probably making it worse.
- I should check the schedule before I waste a turn.
- I should expect earlier actions to come back later.

## Success Criteria

This layer succeeds when:

- The player walks around more.
- The player talks to more people.
- The player understands why a scheme became available.
- The player sees other characters reacting to things they did earlier.
- The office feels increasingly unstable as the day progresses.

## Non-Goals

Do not rewrite the whole engine.

Do not make every NPC interaction huge.

Do not add massive dialogue trees yet.

Do not make this open world.

Do not create a full NPC simulation engine.

Do not add an inventory system unless a later phase proves it is necessary.

Do not make every object interactable.

Do not add complexity just because the idea sounds interesting.

The goal is controlled narrative reactivity.

## Existing-System Bias

Use existing systems first.

The current engine already supports many of the needed behaviors through story data and choice effects.

Prefer using:

- `facts`.
- `requirements`.
- `hiddenEvents`.
- `visibleAftermathQueue`.
- `visibleAftermathBeats`.
- `forcedRules`.
- `schedule`.
- `feedback`.
- `latestSignal`.
- `unlocked`.
- `locked`.
- `usedChoices`.
- `bars`.
- `npc`.
- `history`.

Only propose engine changes after proving the existing systems cannot support the required behavior.

## Discovery-Gated Schemes

Major schemes should not appear without narrative context.

The player should discover why a scheme is possible.

A scheme may become available because the player:

- Learns a character fact.
- Finds a location clue.
- Hears gossip.
- Triggers hidden office motion.
- Reaches a schedule moment.
- Causes a character reaction.
- Connects multiple smaller facts.

Example:

The player should not simply receive an option to frame Frank for drinking.

The player should first discover one or more of these:

- There is a bottle in the kitchen.
- Frank has a history with drinking.
- Betty knows something about Frank’s past.
- Lisa has old HR context.
- Devon heard a rumor and is repeating it badly.

Then the game can surface the scheme with a short internal thought or feedback message explaining why the option now exists.

## Inspectable Locations

Rooms should give the player reasons to move.

Inspection should usually be implemented first as normal story choices, not as a new engine system.

An inspect choice should usually:

- Stay in the current scene.
- Reveal one useful fact.
- Produce short feedback.
- Possibly update latest signal.
- Possibly add a hidden event.
- Possibly queue visible aftermath.
- Possibly unlock a scheme.

Potential early inspection targets:

- Kitchen bottle.
- Supply closet toilet paper.
- Bathroom signs of panic or sabotage.
- Conference room notes or seating.
- Betty’s desk traffic awareness.
- Lisa’s desk schedule visibility.

Inspection should not become object hunting.

The point is to create reasons to move through the office and notice things.

## Visible Aftermath

Visible aftermath should show the player that the office keeps moving after they act.

A visible aftermath beat can happen after the player leaves an area or after a meaningful action creates a social ripple.

Visible aftermath should be short.

It should usually answer one question:

What changed because of what the player just did?

Examples:

- Betty goes quiet after the player leaves.
- Devon appears because he heard something.
- Lisa starts asking questions.
- Frank hears his name.
- Tim begins checking timing.
- Celia reacts to rumor pressure.

Visible aftermath should provide breathing room between choices without becoming a cutscene dump.

## Hidden Office Motion

Hidden office motion represents conversations and reactions the player does not directly see.

This should use existing hidden event patterns first.

Hidden events can support:

- Future forced scenes.
- Future visible aftermath.
- Changed dialogue.
- Scheme unlocks.
- Chatter changes.
- NPC reactions.
- Schedule pressure.

Hidden office motion should usually be triggered by player action, not pure randomness.

The player should feel responsible for the chaos, even when the office mutates the story offscreen.

## NPC Approach Scenes

The player should not always initiate interaction.

Sometimes an NPC should approach the player because of something that happened earlier.

Start with Devon.

Devon is the best first messenger because he can surface gossip, misunderstanding, and offscreen motion without feeling like a system notification.

An NPC approach scene should usually include:

- A short setup.
- One character beat.
- Two or three player responses.
- One consequence.
- Optional hidden event or visible aftermath.

Do not make these scenes huge.

## Schedule Pressure

The schedule should make the day feel structured and fair.

The game already has schedule concepts, so the first goal is to make them clearer to the player.

The schedule should show:

- Start.
- Stand Up.
- Lunch.
- Afternoon Checkup.
- All-Hands.

All-Hands may be hidden, pending, or locked until activated by time, pressure, or specific events.

A future UI pass may make the schedule label tappable or open a small schedule panel.

Do not build a new calendar engine unless the existing schedule system cannot support the needed behavior.

## Character Reaction Roles

### Betty

Betty notices movement, emotion, and office traffic.

She can defend the player, expose the player, or spread concern to Lisa.

### Tim

Tim notices timing and contradictions.

He turns vibes into timelines, which is extremely inconvenient.

### Frank

Frank is a plausible scapegoat but dangerous if he realizes he is being aimed at.

He reacts defensively and loudly.

### Lisa

Lisa controls access, schedule, calls, and documentation.

She is dangerous because she calmly turns drama into process.

### Devon

Devon is a rumor distribution network.

He surfaces offscreen motion and makes half-understood information travel faster.

### Celia

Celia is under pressure and may react emotionally, defensively, or publicly depending on what reaches her.

### Boss

The boss should remain mostly looming in the early pass.

The boss becomes important as all-hands approaches.

## Escalation

The office should become less stable over time.

Early game:

- Confusion.
- Awkward damage control.
- Soft gossip.

Middle game:

- People compare stories.
- Rumors mutate.
- Characters begin reacting to earlier choices.

Late game:

- Tim and Lisa organize facts.
- Frank may retaliate.
- Betty may choose a side.
- Celia may receive more information.
- All-hands becomes inevitable.

## First Recommended Implementation Slice

After the audit and docs-only update, the first implementation slice should be narrow.

Recommended slice:

Frank drinking discovery path.

Add or verify:

- Kitchen inspection reveals the bottle.
- Frank conversation can reveal sober/history context.
- Betty, Lisa, or Devon can provide alternate discovery.
- The Frank drinking scheme only appears after enough discovery.
- The unlock feedback explains why the scheme became available.
- At least one hidden event or aftermath beat shows the office reacting.

This slice proves the full layer without requiring a broad rewrite.

## Authoring Rules

Use small, sharp interactions.

Prefer one useful fact per interaction.

Do not over-explain mechanics.

Do not hide major cause and effect.

Make unlocks understandable.

Let facts do multiple jobs.

Make delayed consequences visible enough to feel fair.

Keep mobile readability in mind.

## Phase Order

1. Docs-first update to align the scope, mechanics, design, authoring, and implementation docs.
2. Frank discovery slice focused on drinking context and unlock clarity.
3. Aftermath and hidden office motion pass.
4. Schedule panel or small schedule-clarity pass after mobile review.
5. Devon approach scenes using existing forced-scene patterns.

## Naming Rule

Use Devon consistently in player-facing docs.

Do not rename existing machine IDs, scene IDs, flags, files, or assets as part of this docs-only phase.
