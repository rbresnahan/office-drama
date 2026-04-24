# All-Hands Rules — Prototype 1

## Purpose
This document defines how the all-hands meeting works in the first playable prototype.

The all-hands is not just a final choice screen.
It is the public payoff scene where the hidden social state becomes visible.

The player should feel like they are cashing in or suffering the room they built.

---

## Core Function

The all-hands should answer:

- what story the office settles on
- whether the email remains the main issue
- whether the player stayed under the radar
- whether the room fractures around itself
- whether the meeting becomes an intervention about the player
- whether the subject of the email finds out here, and under what conditions

---

## Core Reveal Rule

Prototype 1 should treat the all-hands as the ideal reveal point.

The best-case version of the run is:
- the subject of the email does **not** find out earlier
- the subject first learns about it at the all-hands
- the player has shaped the room enough that this reveal does not instantly collapse into total social loss

If the subject found out before the meeting, the run shifts into a more defensive and end-game-leaning state.

---

## End-Game Shift Rule

Once the selected subject reaches `confirmed`, the run should shift into **end-game / defensive mode**.

That does **not** mean the run instantly ends.
It means:
- the clean prevention line is gone
- the player is now managing fallout rather than purely preventing discovery
- all-hands pressure rises sharply
- the room becomes harder to stabilize quietly
- final-sequence plays become more about attribution, framing, and survival

This is the point where the damage is truly done.

---

## Defensive End-Game Rule

In defensive mode, the player can still win.

Possible defensive win paths include:
- controlled confession
- procedural containment
- chaos diversion
- scapegoat play
- narrative reframing

A defensive win is weaker and dirtier than a controlled reveal win, but it is still a valid success state.

The key rule is:
**subject confirmed does not mean automatic loss.**

---

## Scapegoat Rule

Prototype 1 may allow a late scapegoat play after the subject reads the email.

Example:
- the player tries to convince the subject that another coworker sent the email from the player’s machine

This kind of move should only work if the room was prepared for it.

Recommended prerequisites:
- the scapegoat target already has weakened credibility
- the subject has reason to distrust that target
- the player’s own suspicion is still lower than the scapegoat’s
- earlier actions created enough social groundwork for the lie to feel plausible
- fact-driven NPCs do not immediately destroy the claim

This keeps late dirty wins from feeling cheap or magical.

---

## All-Hands Trigger

Prototype 1 should use a simple trigger.

The meeting starts when **one** of these happens:

### Trigger A: Turn limit reached
The player runs out of time.

### Trigger B: Office focus hits dominant
The email becomes too socially central to avoid public reckoning.

### Trigger C: Intervention threshold reached
Enough anti-player sentiment builds that the room stops being about the email alone.

### Trigger D: Subject pressure maxes out
The selected subject is too close to finding out, and the room is no longer containable as a private problem.

### Trigger E: Subject confirmed and countdown exhausted
The subject already knows, the run has shifted to defense, and the player runs out of time to reshape the fallout before the meeting.

---

## Pre-Meeting Inputs

Before resolving the all-hands, the game should evaluate:

### Email state
- who received the email
- how many NPCs are aware
- how many are confirmed
- current office focus

### Subject state
- selected `emailTargetId`
- whether the subject is `unaware`, `at_risk`, `suspicious`, or `confirmed`
- whether the subject has already read the email
- whether the subject is blindsided, suspicious, or prepared

### Player social state
- average playerLikability across the office
- average playerSuspicion across the office
- how many key NPCs distrust the player

### Key relationships
- Betty ↔ Tim
- Frank ↔ Celia
- Lisa ↔ Player
- Devon’s current stance toward the player and the facts
- any relationship directly involving the selected subject if it matters to spread or defense

### Dirty play state
- how many obvious manipulations were used
- whether the player created visible social damage
- whether the room sees the player as the destabilizing variable

---

## Outcome Modes

Prototype 1 should support these main meeting modes.

### 1. Controlled Reveal Mode
The subject first finds out at the all-hands.

The room is tense, but the player kept enough control that the reveal does not instantly collapse into total social loss.

This is the strongest success mode.

### 2. Email Reckoning Mode
The email is the center of the room.

The subject may find out here or may already know.
The meeting is mainly about the incident and the damage around it.

This is a mixed or unstable outcome mode.

### 3. Early Discovery Defense Mode
The subject found out before the all-hands.

The player is now trying to survive a room where the reveal already escaped their preferred timing.

This is more defensive and usually weaker than Controlled Reveal Mode.

### 4. Intervention Mode
The meeting becomes partly or fully about the player’s behavior.

The room sees the player as:
- manipulative
- destabilizing
- suspicious
- or socially reckless

This is a major failure state.

### 5. Chaos Diversion Mode
The player successfully redirected the room into other conflicts.

The email still matters, but the office has become too fragmented to settle cleanly on it.

This can be a success if:
- the subject only finds out at the meeting
- and the player is not the central villain

### 6. Dirty Survival Mode
The subject found out early, but the player survives by forcing the room to accept a dirtier explanation, weaker attribution, or a different villain.

This is a valid but compromised success state.

---

## Intervention Triggers

Prototype 1 should use a small number of hard-ish triggers.

Recommended trigger buckets:

### Trigger Bucket A: Suspicion count
Intervention mode becomes possible if:
- 3 or more NPCs have `playerSuspicion >= 61`

### Trigger Bucket B: Key relationship collapse
Intervention mode becomes likely if:
- Lisa turns against the player
- and either Frank or Celia also reaches high suspicion

### Trigger Bucket C: High-status lock-on
Intervention mode becomes likely if:
- Frank and Celia both view the player as the problem
- regardless of what the rest of the office thinks

### Trigger Bucket D: Dirty reveal pattern
Intervention mode becomes likely if:
- the player used too many obvious dirty actions
- and the subject still found out early anyway

---

## Successful Outcome Conditions

Prototype 1 should treat success as **timed survivability**, not clean innocence.

A successful meeting should usually require:

- the subject first finds out at the all-hands
- email focus not fully dominant, or at least not cleanly pinned on the player
- player suspicion kept below intervention threshold
- at least one useful ally or neutralizer still intact
- no catastrophic visible dirty-play backlash

### Optional bonus success conditions
- Lisa still trusts the player
- Frank accepts a procedural version
- Celia is not blindsided before the meeting
- Betty and Tim are too busy with each other to center the player
- the subject is angry, but not publicly humiliated before the meeting starts

### Defensive success conditions
If the subject found out early, success may still be possible if:
- the player survives without becoming the room’s central villain
- the subject accepts a weaker or redirected explanation
- the room remains divided enough that no single clean truth wins
- the player’s earlier setup makes a late explanation plausible

---

## Failure Outcome Conditions

Prototype 1 should support at least these failures:

### 1. Early subject failure
The subject finds out too early and the player never regains control of the room.

### 2. Intervention failure
The room converges on the player as the real problem.

### 3. Email collapse failure
The email becomes dominant and the player cannot redirect the room.

### 4. Dirty survival failure
The player avoids total exposure, but the room now sees them as morally rotten.

### 5. Scapegoat failure
The player tries to redirect blame, but the room sees the move as obvious or ugly.

---

## Tone Rule

The all-hands should not feel like a spreadsheet verdict.

It should feel like:
- a confrontation
- a collapse
- a narrow survival
- a controlled reveal
- a public reframing
- a desperate defensive pivot
- or a social intervention

Short, authored ending text should do most of the emotional work.

---

## What The Player Should Learn

A good all-hands outcome should let the player say things like:

- “I kept the subject from finding out until the meeting.”
- “I stayed invisible.”
- “I made the room fracture away from me.”
- “I let the email harden too much.”
- “I burned Lisa and that doomed me.”
- “Frank and Celia locked onto me.”
- “Betty and Tim became the story instead.”
- “The subject found out too early and I spent the rest of the run playing defense.”
- “I only survived because I had already made Tim believable as the kind of person who would do it.”

That means the system is readable.

---

## Prototype Summary

In prototype 1, the all-hands should be driven by:

- email delivery and spread
- the selected subject’s awareness state
- whether the subject has already read the email
- player suspicion
- player likability
- a few key bonds
- dirty-play visibility
- whether the room is focused on the player, the subject, or itself
- whether the player prepared a plausible defensive end-game line

That is enough for a strong first public climax.