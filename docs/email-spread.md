# Email Spread — Prototype 1

## Purpose
This document defines what “email spread” means in the first playable prototype.

The goal is to keep this system small, readable, and directly useful for gameplay.

Email spread should not try to simulate everything.
It only needs to answer:

- who knows
- how strongly they believe it
- how much the office is centering it

---

## Core Definition

In prototype 1, email spread is made of **three layers**:

### 1. Awareness
How many NPCs know about the email at all.

This is the simplest spread layer.

Questions it answers:
- who has heard something
- who has seen proof
- who is still outside the loop

### 2. Confidence
How sure an NPC is about what happened.

This matters because:
- hearing a rumor is not the same as seeing the email
- confidence affects how strongly an NPC repeats or acts on what they know

Questions it answers:
- do they only suspect something happened
- do they think they know
- do they know for sure

### 3. Focus
How much the office is centering the email as the current social reality.

This is the “how big is the room making this?” layer.

Questions it answers:
- is this still background noise
- is this now the main office topic
- is this becoming the story that defines the all-hands

---

## Prototype Rule

Email spread is **not** just “more people know.”

It is the combination of:
- more awareness
- stronger confidence
- higher office focus

A run gets more dangerous when all three rise together.

---

## NPC Knowledge States

Each NPC should have one of these knowledge levels for the email:

- `none`
- `heard`
- `suspects`
- `confirmed`

### Meaning

#### `none`
The NPC is outside the loop.

#### `heard`
The NPC has heard something vague or secondhand.

#### `suspects`
The NPC has enough signals to think something specific is wrong.

#### `confirmed`
The NPC has seen enough evidence or direct information to act as if it is true.

---

## Office Focus States

The office should also have a lightweight global focus state for the email.

Recommended values:

- `background`
- `active`
- `dominant`

### Meaning

#### `background`
People know things are weird, but the email is not the room’s center.

#### `active`
The email is a meaningful live issue and is influencing behavior.

#### `dominant`
The email is the main social reality in the office.
At this point, the meeting is likely to orbit it unless the player has successfully redirected attention elsewhere.

---

## What Raises Spread

These are the main prototype spread causes.

### Awareness increases when:
- a talkative NPC learns about the email
- an allied pair shares information
- the player fails a manipulation attempt publicly
- physical evidence is seen
- the player delays too long while the issue remains active

### Confidence increases when:
- an NPC sees direct proof
- an NPC hears the same version from multiple sources
- a trusted ally confirms the story
- the player behaves in a way that supports the rumor
- technical or written evidence is found

### Focus increases when:
- multiple NPCs are aware at once
- a high-status NPC becomes aware
- conflict around the email becomes public
- the player becomes suspicious while the email is still active
- side effects keep pointing back to the email

---

## What Lowers Spread

### Awareness can be limited by:
- stopping a specific NPC from learning
- isolating key spreaders
- removing access points
- ending conversations before they carry

### Confidence can be reduced by:
- muddying certainty
- removing proof
- making a true claim sound socially unreliable
- giving a believable alternate focus
- having a respected NPC reject the weak version

### Focus can be reduced by:
- creating a stronger competing topic
- redirecting the room into another conflict
- containing the issue before high-status NPCs lock onto it
- keeping the player under the radar
- resolving key pair tensions before they amplify the main issue

---

## Important Design Rule

The player does **not** need to make the email disappear completely.

A successful run can still involve:
- some NPCs knowing
- some confidence existing
- some damage remaining

The real goal is to stop the email from becoming the office’s dominant public story.

That is the win condition shape.

---

## Interaction With Player Suspicion

Email spread and player suspicion should influence each other.

### When player suspicion rises:
- NPCs may interpret the email story as more believable
- office focus may rise faster
- confidence may harden more easily

### When player suspicion stays low:
- the email may remain socially unstable
- NPCs may disagree more
- the room may pivot toward other conflicts instead

This supports the core strategy:
**stay under the radar while everyone else becomes the mess.**

---

## Interaction With Alliances

Strong bonds should affect spread.

Examples:
- Betty learns -> Tim may hear faster
- Frank learns -> Celia may take the issue more seriously
- Lisa distrusts the player -> player-safe routes shrink
- Devon confirms something -> confidence rises more than if Betty repeats it

Not every NPC should spread equally.
Spread should respect:
- gossip appetite
- social awareness
- alliance strength
- sentiment transfer strength
- status in the office

---

## Prototype Implementation Goal

Prototype 1 only needs to support:

- per-NPC email knowledge state
- one global office focus state
- simple confidence effects through repeated confirmation
- a few clear causes that raise or lower spread

Do **not** build a giant spread simulation yet.

---

## Summary

In prototype 1, email spread means:

- who knows
- how sure they are
- how much the office is centering it

That is enough to support:
- containment
- redirection
- rumor escalation
- public fallout
- and under-the-radar manipulation