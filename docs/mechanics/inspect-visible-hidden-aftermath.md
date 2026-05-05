# Inspect, Visible Aftermath, and Hidden Fallout

## Purpose

This document defines the inspection and consequence systems for the current Office Panic prototype.

These systems exist to make the current limited slice feel interactive, physical, and reactive.

## Core Idea

The player should not be handed important action choices before discovering the thing they are acting on.

The player should inspect a location, discover a detail or object, then decide whether to act.

After meaningful actions, the office should react.

Some reactions should be visible.

Some reactions should happen offscreen and affect later scenes.

## Key Terms

### Inspect

An inspect action means the player looks more closely at a location, object, room, desk, or area.

Inspecting reveals information.

Inspecting may unlock new choices.

Inspecting is usually low risk.

### Discovery

A discovery is a fact the player learns through inspection or dialogue.

Examples:

- The player saw the bottle on top of the fridge.
- The player saw toilet paper in the closet.
- The player noticed the bathroom has no backup toilet paper.
- The player learned Tim has lactose issues.
- The player learned Frank has a reputation problem.

### Action

An action is when the player changes the world.

Examples:

- Take the bottle.
- Remove toilet paper.
- Plant or imply evidence.
- Push Betty toward a topic.
- Manipulate Tim’s meeting schedule.
- Create a distraction.

Actions usually cost a turn.

### Visible Aftermath

Visible aftermath is a consequence the player directly observes.

Examples:

- Betty walks to Lisa.
- Devon walks to Tim.
- Celia looks at the player’s bag.
- Frank slams his chair back.
- Lisa writes something down.
- Tim starts documenting something.

Visible aftermath should describe what the player can see.

It should not reveal the entire hidden meaning.

### Hidden Fallout

Hidden fallout is a consequence that happens offscreen.

Examples:

- Betty tells Lisa the player asked about Tim.
- Celia suspects the player took something from the kitchen.
- Tim starts tracking suspicious behavior.
- Lisa connects the kitchen incident with the player’s movement.
- Frank hears that people are talking about him.

Hidden fallout should affect later scenes, choices, pressure, suspicion, forced interruptions, or all-hands.

## Current Implementation Mapping

The current engine already supports this layer through story data.

Inspection is represented as normal scene choices. An inspect choice is usually an `info` choice with `advanceTurn: false`, a fact or flag effect, short result text, and no new engine behavior.

Facts and flags represent discovered information. Current story data uses them for things the player has learned, world details the player has changed, and route context that later requirements can check.

`visibleAftermathQueue` stores visible office motion waiting to be shown. `visibleAftermathBeats` defines the short observed beat the player sees when the queue is resolved.

`hiddenEvents` represent offscreen motion. They are not explained immediately, but later scenes, choices, forced interruptions, or all-hands resolution can check them.

`forcedRules` represent NPC approach or interruption scenes. They let a character step into the player’s path after requirements are met without requiring a larger NPC simulation system.

`latestSignal` and `feedback` provide player-facing clarity. `feedback` explains the immediate result of the choice, while `latestSignal` keeps the current tactical meaning visible after the player returns to the office flow.

## Turn Rules

Inspecting usually does not cost a turn.

Taking, altering, weaponizing, or manipulating something usually costs a turn.

Leaving a location after a turn-based action should not cost an additional turn.

Aftermath shown while leaving a location should be treated as the consequence of the previous action, not a separate action.

Recommended rules:

- Inspect fridge: no turn.
- Take bottle: turn.
- Leave kitchen after taking bottle: no extra turn, but may show aftermath.
- Inspect closet shelves: no turn.
- Take toilet paper: turn.
- Inspect bathroom stall: no turn.
- Remove toilet paper: turn.
- Talk to Betty meaningfully: turn.
- Leave Betty’s desk after meaningful dialogue: no extra turn, but may show aftermath.

## Player-Facing Rule

The player should feel rewarded for inspecting.

Inspection should create curiosity and reveal opportunities.

Inspection should not feel like wasting time.

The game pressure should come from actions, schemes, and consequences, not from basic observation.

## Visible Aftermath Guidelines

Visible aftermath should be:

- Short.
- Specific.
- Observational.
- Slightly ominous or funny.
- Connected to the player’s previous action.
- Written like the player is seeing the office react.

Good visible aftermath:

As you leave Betty’s desk, she waits until you are halfway across the room. Then she stands up with her coffee and walks toward Lisa.

Bad visible aftermath:

Betty tells Lisa that you are suspicious, increasing Lisa suspicion by 2.

The first version shows what the player can observe.

The second version exposes the hidden layer too directly.

## Hidden Fallout Guidelines

Hidden fallout should not be directly shown when it happens.

It should appear later through:

- Dialogue changes.
- New suspicion.
- Forced interruptions.
- Different all-hands framing.
- Chatter changes.
- NPC movement.
- Locked or unlocked choices.

Example:

Visible aftermath:

Betty walks toward Lisa after you leave.

Hidden fallout:

Betty told Lisa the player was asking about Tim.

Later payoff:

Lisa says, “You’ve been very interested in Tim today.”

## Location Inspection Pattern

Each important location should follow this pattern:

1. Enter location.
2. See basic room description.
3. Choose inspect option.
4. Discover useful object/detail.
5. Unlock action.
6. Choose action or leave it alone.
7. Apply state changes.
8. Queue visible aftermath if appropriate.
9. Add hidden fallout if appropriate.
10. Later scenes react.

## Kitchen Pattern

Initial state:

The player has not discovered the bottle.

Available choice:

Inspect the fridge or top of fridge.

After inspection:

The player discovers the bottle.

New choices:

- Take the bottle.
- Leave the bottle alone.
- Leave the kitchen.

If the player takes the bottle:

Visible aftermath may occur.

Hidden fallout should be added.

The bottle should no longer appear as available in the kitchen.

## Closet Pattern

Initial state:

The player has not discovered the toilet paper.

Available choice:

Inspect the shelves.

After inspection:

The player discovers backup toilet paper.

New choices:

- Take one roll.
- Take all the rolls.
- Leave them alone.

Taking one roll should be lower risk.

Taking all rolls should be higher risk.

## Bathroom Pattern

Initial state:

The player has not inspected the stall.

Available choice:

Inspect the stall.

After inspection:

The player learns the bathroom toilet paper situation is fragile.

New choices:

- Remove the roll.
- Leave it alone.

Removing bathroom toilet paper should be higher risk because it will be discovered quickly.

## Betty Pattern

Betty is the main opening intel source.

Talking to Betty should help the player understand the current office situation.

Betty can point toward:

- Tim’s lactose issue.
- Frank’s reputation problem.
- Kitchen oddities.
- Who watches office movement.
- Who talks to Lisa.

After certain Betty interactions, visible aftermath may occur.

Example:

Betty walks to Lisa after the player leaves.

Hidden fallout may also occur.

Example:

Betty tells Lisa the player was asking about Tim.

## Tim Pattern

Tim is the target of the lactose or meeting-disruption scheme.

The player should be able to create pressure around Tim through existing intel and actions.

Visible aftermath examples:

- Tim walks away from his desk in a hurry.
- Devon approaches Tim.
- Tim starts documenting.
- Tim misses or nearly misses a meeting.

Hidden fallout examples:

- Tim suspects the player.
- Devon warns Tim.
- Tim starts connecting food, timing, and player behavior.

## Frank Pattern

Frank is the scapegoat target for the drunk scheme.

The player should be able to use the discovered bottle or office reputation to make Frank look unstable.

Visible aftermath examples:

- Frank gets loud.
- Frank reacts defensively.
- Frank becomes visibly angry.
- Lisa watches Frank more closely.

Hidden fallout examples:

- Someone connects Frank to the bottle.
- Frank suspects he is being set up.
- Lisa starts watching the player and Frank.
- Celia notices the story does not fully add up.

## Chaos Pattern

Chaos uses existing environmental objects and social pressure to distract the office.

It should feel risky and messy.

Visible aftermath examples:

- Someone goes to the bathroom and reacts.
- People start moving around the office.
- Lisa gets interrupted.
- Frank complains loudly.
- Tim loses focus.

Hidden fallout examples:

- Lisa connects multiple disruptions.
- Celia notices timing.
- Devon reports something to Tim.
- Betty becomes less willing to cover for the player.

## Implementation Notes

The engine should support:

- Facts or discovered state.
- Hidden event state.
- Visible aftermath queue.
- Choice conditions based on facts.
- Effects that add facts.
- Effects that remove or block objects after being taken.
- Effects that queue aftermath.
- Effects that add hidden fallout.
- Turn advancement rules per action.

The first implementation target should be the kitchen booze slice.

After that works, apply the same pattern to closet and bathroom.
