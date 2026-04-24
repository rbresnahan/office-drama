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

---

## Pre-Meeting Inputs

Before resolving the all-hands, the game should evaluate:

### Email state
- how many NPCs are aware
- how many are confirmed
- current office focus

### Player social state
- average playerLikability across the office
- average playerSuspicion across the office
- how many key NPCs distrust the player

### Key relationships
- Betty ↔ Tim
- Frank ↔ Celia
- Lisa ↔ Player
- Devon’s current stance toward the player and the facts

### Dirty play state
- how many obvious manipulations were used
- whether the player created visible social damage
- whether the room sees the player as the destabilizing variable

---

## Outcome Modes

Prototype 1 should support these main meeting modes.

### 1. Containment Mode
The player kept suspicion manageable and stopped the email from becoming dominant.

The room still feels tense, but the player has enough control to steer the outcome.

### 2. Email Reckoning Mode
The email is the center of the room.

The player is still relevant, but the meeting is mainly about the incident.

### 3. Intervention Mode
The meeting becomes partly or fully about the player’s behavior.

The room sees the player as:
- manipulative
- destabilizing
- suspicious
- or socially reckless

This is a major failure state.

### 4. Chaos Diversion Mode
The player successfully redirected the room into other conflicts.

The email still matters, but the office has become too fragmented to settle cleanly on it.

This is a possible win if the player is not the center of blame.

---

## Intervention Triggers

Prototype 1 should use a small number of hard-ish triggers.

Recommended trigger buckets:

### Trigger Bucket A: Suspicion count
Intervention mode becomes possible if:
- 3 or more NPCs have `playerSuspicion >= 61`

### Trigger Bucket B: Key pair hostility
Intervention mode becomes likely if:
- Lisa turns against the player
- and either Frank or Celia also reaches high suspicion

### Trigger Bucket C: High-status lock-on
Intervention mode becomes likely if:
- Frank and Celia both view the player as the problem
- regardless of what the rest of the office thinks

---

## Successful Outcome Conditions

Prototype 1 should treat success as **social survivability**, not clean innocence.

A successful meeting should usually require:

- email focus not dominant
- player suspicion kept below intervention threshold
- at least one useful ally or neutralizer still intact
- no catastrophic visible dirty-play backlash

### Optional bonus success conditions
- Lisa still trusts the player
- Frank accepts a procedural version
- Celia is not blindsided
- Betty and Tim are too busy with each other to center the player

---

## Failure Outcome Conditions

Prototype 1 should support at least these failures:

### 1. Intervention failure
The room converges on the player as the real problem.

### 2. Email collapse failure
The email becomes dominant and the player cannot redirect the room.

### 3. Dirty survival failure
The player avoids total exposure, but the room now sees them as morally rotten.

### 4. Scapegoat failure
The player tries to redirect blame, but the room sees the move as obvious or ugly.

---

## Tone Rule

The all-hands should not feel like a spreadsheet verdict.

It should feel like:
- a confrontation
- a collapse
- a narrow survival
- a public reframing
- or a social intervention

Short, authored ending text should do most of the emotional work.

---

## What The Player Should Learn

A good all-hands outcome should let the player say things like:

- “I stayed invisible.”
- “I made the room fracture away from me.”
- “I let the email harden too much.”
- “I burned Lisa and that doomed me.”
- “Frank and Celia locked onto me.”
- “Betty and Tim became the story instead.”

That means the system is readable.

---

## Prototype Summary

In prototype 1, the all-hands should be driven by:

- email spread
- player suspicion
- player likability
- a few key bonds
- dirty-play visibility
- whether the room is focused on the player or on itself

That is enough for a strong first public climax.