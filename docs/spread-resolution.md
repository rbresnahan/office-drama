# Spread Resolution — Prototype 1

## Purpose
This document defines the turn-by-turn method for how the email spreads through the office in the first playable prototype.

This is the missing bridge between:
- what spread **means**
- and how spread actually **behaves**

The goal is to make spread:
- readable
- controllable
- reactive to player actions
- and capable of producing believable chains like:
  - Devon reads the email
  - later tells Frank
  - Frank later tells Celia

This system should feel like social propagation, not random infection math.

---

## Core Rule

Spread should be resolved in a **single spread phase per turn**.

That means:
- the player acts
- the world updates
- then spread is evaluated
- then the next turn begins

This keeps propagation:
- understandable
- tunable
- and fair

Do **not** make spread happen continuously in the background with no readable cadence.

---

## Spread Resolution Order

At the end of each turn, resolve spread in this order:

1. apply player action effects
2. update direct NPC state changes
3. determine who is eligible to spread this turn
4. determine who they are likely to tell
5. resolve knowledge transfer
6. update office focus
7. update subject pressure / awareness
8. check for end-game shift conditions

This should happen once per turn.

---

## Step 1: Apply Player Action Effects

Before spread is evaluated, the player’s action should already have changed the world.

Examples:
- distracting Betty keeps her away from her inbox
- reassuring Tim lowers the chance he spreads something impulsively
- isolating Frank from Celia blocks a likely transfer path
- sabotaging access delays reading or forwarding
- redirecting Betty may reduce focus on the main issue for a turn

Spread should always react to the current world state, not the pre-action state.

---

## Step 2: Update Direct NPC State

After the player acts, resolve immediate NPC consequences.

Examples:
- playerLikability changes
- playerSuspicion changes
- emotional state changes
- alliance strain changes
- delivery state changes
- subject-awareness changes

These matter because spread is not just about knowledge.
It is also about:
- who feels like talking
- who feels like protecting
- who feels like escalating
- who feels like shutting up

---

## Step 3: Determine Who Is Eligible To Spread

An NPC is eligible to spread information this turn if all of these are true:

- they have `knowledgeState` of `heard`, `suspects`, or `confirmed`
- they are not fully blocked by the player’s action
- they are socially or procedurally capable of telling someone
- they are not currently prevented from acting by a stronger state like panic, isolation, or distraction

### Basic eligibility filter
An NPC is **not eligible** if:
- they are successfully distracted for the turn
- they are physically separated from likely recipients
- they are deliberately suppressing the information
- they have no believable path to share it this turn

### Example
If Betty is distracted in the break room all turn, she may still know the email exists, but she may not get to spread it that turn.

---

## Step 4: Determine Spread Pressure

Each eligible NPC gets a temporary spread pressure for that turn.

Spread pressure is not a visible player stat.
It is a hidden resolution value that answers:

**How likely is this NPC to pass the email information along right now?**

### Spread pressure should increase with:
- higher `gossipAppetite`
- stronger `knowledgeState`
- higher confidence in what they know
- higher office focus
- stronger alliance path to another NPC
- higher frustration, fear, or agitation
- higher playerSuspicion if they think the player is hiding something

### Spread pressure should decrease with:
- successful reassurance
- successful distraction
- low gossip appetite
- low confidence
- high rule-following plus low certainty
- fear of consequences
- lack of opportunity
- deliberate isolation from likely recipients

---

## Step 5: Choose Likely Recipients

An NPC should not tell random people first.

Recipients should come from real social paths.

### Recipient priority order
Use this rough order:

1. primary ally
2. secondary ally
3. strongest live relationship
4. relevant authority figure
5. socially adjacent office contact
6. general room leakage only if the office is already hot

### Meaning
This keeps spread feeling like:
- people talking to who they actually talk to
instead of:
- magical rumor teleportation

### Example paths
- Betty -> Tim
- Frank -> Celia
- Lisa -> Player or Betty
- Devon -> Frank
- Tim -> Betty
- Celia -> Frank

### Special case: procedural escalation
Some NPCs may spread “upward” even with low gossip appetite.

Example:
- Devon may tell Frank
not because he loves gossip,
but because Frank is the most relevant procedural recipient.

That is still spread.

---

## Step 6: Resolve Knowledge Transfer

When an NPC tells another NPC, the recipient should not always jump straight to certainty.

Use knowledge steps.

### Recommended knowledge states
- `none`
- `heard`
- `suspects`
- `confirmed`

### Basic transfer logic

#### `none -> heard`
The recipient now knows something exists, but vaguely.

#### `heard -> suspects`
The recipient now thinks something specific is wrong.

#### `suspects -> confirmed`
The recipient has enough confidence to act as if it is true.

### What makes transfer stronger
A transfer is stronger if:
- the sender is trusted
- the alliance is strong
- sentiment transfer is strong
- the sender has `confirmed`
- the recipient is gullible
- the recipient already had partial signals
- the message fits what the recipient already believes

### What makes transfer weaker
A transfer is weaker if:
- the sender is not trusted
- the recipient is skeptical
- the recipient has high intelligence and low proof
- the player successfully disrupted the relationship path
- the office focus is still low
- the sender only “heard” and is guessing

---

## Step 7: Update Office Focus

After transfers are resolved, update `officeFocusState`.

This is a global summary of how central the email has become.

### Office focus should increase when:
- more NPCs are aware
- more NPCs are `confirmed`
- high-status NPCs become aware
- the subject becomes suspicious or confirmed
- public behavior is clearly shaped by the issue
- the player looks increasingly suspicious while the issue remains active

### Office focus should decrease when:
- the player successfully redirects attention
- a stronger side conflict emerges
- spread paths are blocked
- key spreaders are isolated
- the room becomes fragmented enough that no single story dominates

### Recommended focus states
- `background`
- `active`
- `dominant`

---

## Step 8: Update Subject Pressure

The subject of the email needs special handling.

Prototype fields already discussed:
- `emailTargetId`
- subject awareness state:
  - `unaware`
  - `at_risk`
  - `suspicious`
  - `confirmed`

### Subject pressure rises when:
- allies around the subject know more
- the subject received the email, even if unread
- people behave strangely around the subject
- high-focus office behavior becomes visible
- the player fails obvious intervention attempts near the subject
- key allies discuss it around or near the subject

### Subject pressure falls when:
- the subject is distracted
- the subject is isolated from informed NPCs
- the player successfully lies or deflects
- the room is redirected into another conflict
- delivery is suppressed before the subject reads it

---

## Step 9: Check Fair Intervention Rule

If the subject has the email in `received_unread` state, the game must still honor the fair intervention rule.

That means:
- the subject cannot auto-read the email before the player gets a chance to respond
- the player must have at least one meaningful opportunity to intervene

### Important distinction
The subject can be:
- at their desk
- near the email
- at extreme risk

But the game should still allow the player a shot.

After that shot:
- the player may succeed
- the player may fail
- then the subject may read it

That is fair.

---

## Step 10: End-Game Shift Check

If the subject reaches `confirmed`, the run shifts into **end-game / defensive mode**.

That means:
- clean prevention is over
- the player is now shaping interpretation and fallout
- all-hands pressure increases sharply
- late dirty pivots become possible
- the run is still alive, but no longer in early containment mode

This is not automatic failure.
It is a state transition.

---

## Spread Frequency Rules

Prototype 1 should keep spread limited enough to stay legible.

### Recommended limits
- each eligible NPC gets at most **one major spread attempt per turn**
- one turn should usually produce **0 to 2 meaningful transfers**, not a social explosion every time
- wide-office runaway behavior should happen only when focus is already high

This keeps the system readable.

---

## Example Spread Chain

### Setup
- Email is about Betty
- Devon received and read it
- Devon is `confirmed`
- Office focus is `background`
- Betty is still `unaware`

### Turn 1
Devon knows.
Nobody else knows.

### Turn 2
Player does not contain well.
Devon remains eligible to spread.

Because Devon:
- has low gossip appetite
- but high confidence
- and Frank is a relevant procedural contact

Devon may tell Frank.

### Result
- Frank moves from `none` to `suspects` or `confirmed`
- office awareness rises
- office focus may shift toward `active`

### Turn 3–4
Player still fails to contain.
Frank now has a strong path to Celia.

Frank tells Celia.

### Result
- Celia becomes aware
- office awareness rises again
- focus rises again
- Betty’s subject pressure rises because key office figures now know

This is the intended kind of spread chain.

---

## Spread Personality Examples

### Betty
- spreads often
- spreads socially
- spreads fast
- lower credibility than Devon
- higher chaos output

### Tim
- spreads under fear or uncertainty
- more likely to leak than proudly declare
- may reinforce or seek reassurance from allies

### Frank
- spreads upward or strategically
- not noisy, but dangerous
- what he says matters more

### Celia
- not a casual spreader
- more likely to convert awareness into pressure or confrontation

### Devon
- low-volume spreader
- high-value spreader
- what he says carries weight

### Lisa
- relational spreader
- may carry things carefully, reluctantly, or with emotional context

These should emerge from stats and bonds, not special one-off hacks whenever possible.

---

## What Player Actions Interrupt Spread

The following actions should be able to interfere with spread directly:

- `Distract`
- `Access`
- `Delete / Suppress`
- `Reassure`
- `Redirect`
- `Lie / Deflect`
- `Isolate`
- `Sabotage`

### Example effects
- distract = delays spread this turn
- isolate = blocks a likely recipient path
- reassure = reduces spread pressure
- redirect = lowers office focus or shifts topic
- lie/deflect = weakens confidence transfer
- sabotage = disrupts normal spread channels

Spread should feel interruptible.
Otherwise the player is just watching an office-themed avalanche.

---

## Prototype Implementation Goal

Prototype 1 only needs:

- one spread phase per turn
- eligibility check
- recipient selection
- knowledge transfer
- office focus update
- subject pressure update
- end-game shift check

Do **not** build:
- full probabilistic office simulation
- multi-hop chain explosions in one turn
- giant hidden network math
- perfect realism

Keep it small and readable.

---

## Summary

Spread resolution in prototype 1 should work like this:

- someone knows
- they may be eligible to spread this turn
- they tell a likely person, not a random one
- that person’s knowledge increases by a step
- office focus updates
- subject pressure updates
- if the subject confirms the email, the run shifts into end-game / defensive mode

That is enough to support:
- believable propagation
- player intervention
- social escalation
- defensive late-game pivots
- and a readable all-hands payoff