# Limited Scope Refinement Plan

## Purpose

This document defines the current implementation goal for the Office Drama prototype.

The goal is not to expand the game.

The goal is to refine the existing limited scope until it feels like a cohesive playable game from start to finish.

## Current Scope

The current playable slice is built around one main entry point and a small number of scheme paths.

The player begins by talking to Betty.

From Betty, the player can learn enough office information to pursue one of the current schemes:

1. Use Tim’s lactose intolerance or meeting anxiety to make him miss meetings.
2. Make Frank look like the office drunk.
3. Cause general office chaos using existing environmental opportunities.

This limited scope is intentional.

The prototype should prove the game loop before adding more characters, schemes, rooms, endings, or systems.

## Non-Goals

Do not add new major characters.

Do not add new full scheme paths.

Do not add new map areas.

Do not add complex inventory systems unless required by the existing slice.

Do not add large all-hands branching yet.

Do not turn this into a general simulation engine before the prototype loop feels good.

Do not add new content just because the map has room for it.

## Current Design Problem

The current game has choices and consequences, but some consequences feel too abstract.

Choices may update stats or unlock options, but the player does not always feel the office reacting.

This makes the game feel more like a menu than a living office.

The missing layer is consequence texture.

After the player acts, the office should visibly react.

Some consequences should also happen offscreen and affect later scenes.

## Desired Player Loop

The desired loop is:

1. Talk to Betty.
2. Learn office intel.
3. Visit an existing location.
4. Inspect something.
5. Discover a usable detail or object.
6. Choose whether to act.
7. See a visible aftermath beat.
8. Trigger hidden fallout.
9. Experience later consequences.
10. Reach all-hands with the day shaped by player actions.

## Core Refinement

The current slice should support:

- Betty as the entry/intel hub.
- Tim as the lactose/meeting disruption target.
- Frank as the drunk/scapegoat target.
- Kitchen booze as a discovered object.
- Closet and bathroom toilet paper as discovered environmental chaos objects.
- Visible aftermath after meaningful actions.
- Hidden fallout that changes later dialogue, interruptions, or all-hands.
- A simple but reactive all-hands conclusion.

## Phase 1: Scope Lock

Keep the prototype narrow.

Only refine the existing Betty, Tim, Frank, kitchen, closet, bathroom, and all-hands material.

Any new mechanic must directly support the existing slice.

## Phase 2: Inspectable Locations

Add or refine inspect options for the current important locations.

Kitchen:

- Inspect fridge or top of fridge.
- Discover the bottle.
- Decide whether to take it or leave it.

Closet:

- Inspect shelves.
- Discover backup toilet paper.
- Decide whether to take one roll, take all rolls, or leave it.

Bathroom:

- Inspect stall.
- Discover the fragile toilet paper situation.
- Decide whether to remove the roll or leave it.

Inspecting should reveal options.

Actions should create consequences.

## Phase 3: Visible Aftermath

After meaningful actions or conversations, queue a visible aftermath beat.

Visible aftermath is what the player can observe.

Examples:

- Betty walks toward Lisa after the player leaves.
- Devin walks toward Tim.
- Celia glances at the player’s bag after the kitchen interaction.
- Frank reacts loudly after being nudged.
- Lisa writes something down.
- Tim starts documenting.

Visible aftermath should be short, punchy, and observational.

It should not explain every stat or hidden event.

## Phase 4: Hidden Fallout

Some consequences happen offscreen.

Hidden fallout should be stored as state and used later.

Examples:

- Betty told Lisa the player was asking about Tim.
- Celia may have seen the player leave the kitchen with something.
- Tim noticed something strange about his food or meeting schedule.
- Lisa connected two suspicious movements.
- Frank heard his name in connection with the kitchen.

Hidden fallout should create later payoffs.

The player should feel that conversations happened without them.

## Phase 5: Kitchen Booze Vertical Slice

The first complete implementation target should be the kitchen booze path.

Acceptance criteria:

- The bottle does not appear as a raw choice before inspection.
- The player can inspect the kitchen/fridge area.
- The player discovers the bottle.
- The player can take or leave the bottle.
- Taking the bottle updates state.
- Taking the bottle removes or hides the bottle from future kitchen choices.
- Taking the bottle queues visible aftermath.
- Taking the bottle creates hidden fallout.
- At least one later scene can reference the hidden fallout.

## Phase 6: Closet and Bathroom Chaos

After the kitchen slice works, apply the same pattern to toilet paper.

Closet acceptance criteria:

- Player inspects shelves.
- Player discovers toilet paper.
- Player can take one roll, take all rolls, or leave it.
- Taking toilet paper creates state changes and fallout.

Bathroom acceptance criteria:

- Player inspects stall.
- Player discovers the current toilet paper situation.
- Player can remove the roll or leave it.
- Removing it creates higher-risk fallout than taking from the closet.

## Phase 7: Scheme Payoffs

Each current scheme should have at least one visible consequence and one later payoff.

Tim route:

- Visible: Tim reacts, leaves, panics, documents, or misses something.
- Hidden: Tim or Devin connects the player to the disruption.
- Payoff: meeting/all-hands acknowledges Tim’s disruption.

Frank route:

- Visible: Frank reacts loudly, looks unstable, or gets connected to booze.
- Hidden: someone notices the bottle moved or hears Frank’s name.
- Payoff: Frank becomes a plausible scapegoat or retaliates.

Chaos route:

- Visible: bathroom/closet/kitchen consequences create office disturbance.
- Hidden: Lisa, Celia, Tim, or Devin connects odd events.
- Payoff: all-hands becomes more volatile or distracted.

## Phase 8: All-Hands Resolution

The all-hands ending should react to current state.

It does not need full branching complexity yet.

It should recognize:

- Which scheme was most developed.
- Whether the player created too much suspicion.
- Whether Tim was successfully disrupted.
- Whether Frank was successfully framed.
- Whether chaos became the dominant outcome.
- Whether hidden fallout caught up with the player.

## Success Criteria

The prototype succeeds when:

- The player understands what they are trying to do.
- Betty gives useful but not excessive direction.
- The player can discover usable details through inspection.
- Choices visibly affect the office.
- Hidden consequences surface later.
- The clock/day structure creates pressure.
- All-hands feels like a result of the player’s actions.
- The limited version feels like a complete game slice.

## Final Principle

Do not make the game wider right now.

Make the current slice deeper, clearer, and more reactive.