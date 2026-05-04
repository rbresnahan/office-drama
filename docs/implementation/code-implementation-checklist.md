# Code Implementation Checklist

## Purpose

This checklist defines the recommended code implementation order for the current refinement pass.

The goal is to support the existing limited slice without expanding the game.

## Implementation Principle

Build one complete vertical slice first.

The first target is the kitchen booze inspection path.

Do not build broad systems beyond what the kitchen slice requires.

Once the kitchen slice works, reuse the same pattern for closet, bathroom, Betty, Tim, Frank, and all-hands.

## Likely Files to Review

Review the current structure before implementation.

Likely files involved:

- index.html
- style.css
- main.js
- data.js
- assets/js/app.js
- assets/js/engine/state.js
- assets/js/engine/effects.js
- assets/js/engine/game.js
- assets/js/engine/guards.js
- assets/js/engine/renderer.js
- assets/js/engine/story-helpers.js
- assets/stories/demo-story.js
- assets/stories/npcs.js
- assets/stories/relationships.js
- assets/stories/run-setup.js

Do not assume every file needs changes.

Prefer the smallest set of changes that supports the current slice.

## Step 1: Add State Support

Add or confirm support for:

- Facts.
- Hidden events.
- Visible aftermath queue.
- Location discoveries.
- Taken or removed objects.

The simplest acceptable model can use facts for most state.

Examples of facts needed by the current slice:

- Kitchen bottle seen.
- Player has bottle.
- Bottle missing from kitchen.
- Closet toilet paper seen.
- Player has toilet paper.
- Bathroom toilet paper removed.
- Betty discussed Tim.
- Betty discussed Frank.
- Tim disrupted.
- Frank framed.
- Chaos increased.

Examples of hidden events needed by the current slice:

- Betty talked to Lisa after player conversation.
- Celia may have seen player leave kitchen with something.
- Devin checked on Tim.
- Tim started documenting.
- Lisa connected suspicious movement.
- Frank suspects setup.

## Step 2: Add Effect Support

Choices should be able to apply effects such as:

- Add fact.
- Remove fact if needed.
- Add hidden event.
- Queue visible aftermath.
- Advance turn.
- Adjust pressure or suspicion.
- Mark object as taken or unavailable.

Existing effect handling should be extended instead of replaced.

## Step 3: Add Choice Conditions

Choices should be showable or hidden based on current state.

Needed conditions include:

- Requires fact.
- Blocked by fact.
- Requires hidden event if needed.
- Requires location discovery if separate from facts.
- Requires scheme progress if already supported.

Examples:

Before inspecting the kitchen fridge, show inspect option.

After discovering the bottle, show take bottle option.

After taking the bottle, do not show take bottle again.

After taking toilet paper, do not show the same take option again.

## Step 4: Add Visible Aftermath Queue

After meaningful actions, the game should be able to queue a visible aftermath beat.

The aftermath should display when appropriate, usually after leaving a location or after an interaction resolves.

The aftermath should not cost an extra turn by default.

Acceptance criteria:

- A choice can queue visible aftermath.
- The renderer can display the aftermath text.
- The game can clear the aftermath after showing it.
- Aftermath does not repeat endlessly.
- Aftermath does not break normal navigation.

## Step 5: Add Hidden Fallout Support

A choice should be able to add hidden fallout.

Hidden fallout should not be directly displayed when added.

Later scenes can check hidden fallout and alter text, choices, or outcomes.

Acceptance criteria:

- Hidden event can be stored.
- Hidden event persists through the current run.
- Later content can check hidden event.
- Hidden event can influence dialogue or all-hands.

## Step 6: Implement Kitchen Booze Vertical Slice

This is the first real implementation target.

Before inspection:

- Player enters kitchen.
- Player sees normal kitchen description.
- Player can inspect fridge or top of fridge.
- Player should not yet see take bottle as a choice.

After inspection:

- Player discovers the bottle.
- Bottle discovery fact is added.
- Take bottle choice becomes available.
- Leave bottle option may be available.

After taking bottle:

- Player has bottle fact is added.
- Bottle missing fact is added.
- Bottle should no longer be available in kitchen.
- Visible aftermath is queued.
- Hidden fallout is added.
- Action should advance turn if that is the current action rule.

Suggested visible aftermath:

As the player leaves the kitchen, Celia glances up from the printer. Not at the player’s face. At the player’s bag.

Suggested hidden fallout:

Celia may have seen the player leave the kitchen with something.

Later payoff:

Celia, Lisa, or office chatter can reference that the kitchen got weird after the player was there.

## Step 7: Implement Closet Toilet Paper Slice

Before inspection:

- Player enters closet.
- Player can inspect shelves.
- Player should not yet see take toilet paper choices.

After inspection:

- Player discovers backup toilet paper.
- Take one roll and take all rolls can become available.

After taking:

- Appropriate fact is added.
- Toilet paper availability changes.
- Visible aftermath may be queued.
- Hidden fallout may be added.
- Action should advance turn if appropriate.

Risk levels:

- Taking one roll is lower risk.
- Taking all rolls is higher risk.

## Step 8: Implement Bathroom Toilet Paper Slice

Before inspection:

- Player enters bathroom.
- Player can inspect stall.
- Player should not yet see remove toilet paper choice.

After inspection:

- Player discovers the bathroom toilet paper situation.
- Remove roll option becomes available.

After removing:

- Bathroom toilet paper missing fact is added.
- Visible aftermath may be queued.
- Hidden fallout should be added.
- Action should advance turn if appropriate.

Bathroom toilet paper should be riskier than closet toilet paper.

## Step 9: Connect Betty to Consequences

Betty should remain the entry point.

Refine Betty dialogue so it points toward current schemes.

Betty can create facts or leads such as:

- Player learned about Tim.
- Player learned about Frank.
- Player learned the kitchen matters.
- Player learned Lisa hears things.
- Player learned Devin talks to Tim.

After certain Betty interactions, queue visible aftermath.

Example:

Betty walks toward Lisa after the player leaves.

Also add hidden fallout.

Example:

Betty told Lisa the player was asking about Tim.

## Step 10: Connect Tim Route

The Tim route should respond to Betty intel and player actions.

Add or refine:

- Tim disruption progress.
- Meeting pressure.
- Devin approaching Tim.
- Tim documenting.
- Tim missing or mishandling a meeting.
- Hidden suspicion around the player.

Minimum acceptance criteria:

- Player can pursue Tim route from Betty intel.
- Tim route can produce visible aftermath.
- Tim route can produce hidden fallout.
- All-hands can recognize Tim route state.

## Step 11: Connect Frank Route

The Frank route should respond to booze discovery and player manipulation.

Add or refine:

- Frank scapegoat progress.
- Bottle-related facts.
- Frank visible reaction.
- Lisa or Celia suspicion.
- Hidden fallout around the bottle.

Minimum acceptance criteria:

- Player can pursue Frank route from Betty intel and/or kitchen discovery.
- Frank route can produce visible aftermath.
- Frank route can produce hidden fallout.
- All-hands can recognize Frank route state.

## Step 12: Connect Chaos Route

The chaos route should respond to environmental manipulation.

Add or refine:

- Toilet paper facts.
- Bathroom/closet consequences.
- Office pressure.
- Lisa interruptions.
- Frank or Tim being distracted.
- Hidden suspicion around timing.

Minimum acceptance criteria:

- Player can pursue chaos route using current locations.
- Chaos route can produce visible aftermath.
- Chaos route can produce hidden fallout.
- All-hands can recognize chaos route state.

## Step 13: All-Hands Payoff

All-hands should resolve the state of the current slice.

It should consider:

- Tim disruption state.
- Frank scapegoat state.
- Chaos state.
- Player suspicion.
- Hidden fallout.
- Office pressure.

All-hands does not need large branching complexity.

It needs to feel reactive.

Minimum acceptance criteria:

- Tim route gets acknowledged.
- Frank route gets acknowledged.
- Chaos route gets acknowledged.
- Excessive suspicion can backfire.
- Hidden fallout can surface.
- The ending feels connected to player actions.

## Step 14: Playtest Checklist

Run through these tests:

Kitchen:

- Can enter kitchen.
- Bottle is not immediately takeable.
- Inspect reveals bottle.
- Taking bottle updates choices.
- Taking bottle queues aftermath.
- Bottle does not reappear as takeable.
- Later content can reference the bottle event.

Closet:

- Can enter closet.
- Toilet paper is not immediately takeable.
- Inspect reveals toilet paper.
- Taking one roll works.
- Taking all rolls works or blocks properly.
- Later content can reference missing toilet paper.

Bathroom:

- Can enter bathroom.
- Remove toilet paper is not immediately available.
- Inspect reveals the situation.
- Removing roll works.
- Consequences appear later.

Betty:

- Betty gives useful starting direction.
- Betty can point toward Tim.
- Betty can point toward Frank.
- Betty can point toward office observation.
- Betty-related aftermath can appear after leaving.

Tim route:

- Player can pursue Tim scheme.
- Tim visible reaction occurs.
- Tim hidden fallout exists.
- All-hands can acknowledge Tim route.

Frank route:

- Player can pursue Frank scheme.
- Frank visible reaction occurs.
- Frank hidden fallout exists.
- All-hands can acknowledge Frank route.

Chaos route:

- Player can create environmental chaos.
- Visible office reactions occur.
- Hidden fallout exists.
- All-hands can acknowledge chaos route.

Turn rules:

- Inspect does not cost a turn unless intentionally configured otherwise.
- Taking or altering objects costs a turn.
- Leaving after a turn-based action does not cost another turn.
- Aftermath display does not create accidental extra turns.
- Movement-only leave behavior does not break the turn counter.

Mobile/UI:

- Aftermath cards are readable on mobile.
- Collapsible panels do not hide critical new consequence text.
- Choice buttons remain easy to tap.
- Response card overflow still works.
- The clock remains clear.

## Definition of Done

This implementation pass is done when:

- The current limited slice is playable from start to all-hands.
- The player can discover the bottle through inspection.
- The player can discover toilet paper opportunities through inspection.
- Choices cause visible aftermath.
- Choices create hidden fallout.
- Hidden fallout affects later content.
- Tim, Frank, and chaos routes each have at least one meaningful payoff.
- The prototype feels cohesive without adding new scope.