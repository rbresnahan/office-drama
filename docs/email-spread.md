# Email Spread — Prototype 1

## Purpose
This document defines what “email spread” means in the first playable prototype.

The goal is to keep this system small, readable, and directly useful for gameplay.

Email spread should not try to simulate everything.
It only needs to answer:

- who got the email
- who knows about it
- how strongly they believe it
- whether the subject of the email has found out yet
- how much the office is centering it

---

## Core Definition

In prototype 1, email spread is made of **four layers**:

### 1. Delivery
Who actually received the email after recall partially succeeds or fails.

This is the starting-state layer.

Questions it answers:
- who got the message
- who did not get it
- whether the subject got it
- whether the subject has read it yet

### 2. Awareness
How many NPCs know about the email at all.

This is the broad social spread layer.

Questions it answers:
- who has heard something
- who has seen proof
- who is still outside the loop

### 3. Confidence
How sure an NPC is about what happened.

This matters because:
- hearing a rumor is not the same as seeing the email
- confidence affects how strongly an NPC repeats or acts on what they know

Questions it answers:
- do they only suspect something happened
- do they think they know
- do they know for sure

### 4. Focus
How much the office is centering the email as the current social reality.

This is the “how big is the room making this?” layer.

Questions it answers:
- is this still background noise
- is this now the main office topic
- is this becoming the story that defines the all-hands

---

## Subject Rule

Each run has one selected subject.

That subject is:
- one existing NPC from the current cast
- the person the email is about
- the person the player is trying to manage most carefully

Prototype field:
- `emailTargetId`

No extra character is added for this role.
The selected subject is still a normal NPC with their usual alliances, weaknesses, and reactions.

---

## Fair Play Rule

Prototype 1 should guarantee a **fair intervention window**.

If the subject received the email at the start of the run, they must not instantly read it before the player can act.

That means:
- the subject can begin in a dangerous state
- the subject can be at their desk
- the subject can be one step away from reading
- but the game must still give the player a chance to intervene first

The player may fail that intervention.
But the system should not pre-resolve the failure before the player gets to play.

This is a core fairness rule.

---

## End-Game Shift Rule

Once the subject actually reads the email and reaches `confirmed`, the run shifts into **end-game / defensive mode**.

That means:
- the clean prevention line is over
- the player is now shaping fallout rather than preventing discovery
- all-hands pressure rises sharply
- the player may still survive through blame-shifting, reframing, or chaos

The subject reading the email is not automatic game over.
It is the state change that moves the run into its final phase.

---

## Win Condition Shape

The ideal outcome is:

- the subject of the email finds out at the all-hands
- not earlier
- and under the least-damaging conditions possible

This means the player is not trying to erase all damage.
The player is trying to control:
- timing
- awareness
- interpretation
- and public fallout

If the subject finds out early, that does **not** have to mean instant failure.
It means the run has shifted into a more defensive and end-game-leaning state.

---

## Delivery States

Each NPC can begin in one of these delivery states:

- `not_received`
- `received_unread`
- `received_read`

### Meaning

#### `not_received`
The recall worked for this person.
They do not have the email in their inbox.

#### `received_unread`
The email reached this person, but they have not opened it yet.

#### `received_read`
The email reached this person and they have already seen it.

---

## Knowledge States

Each NPC should also have one of these knowledge levels about the incident:

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

## Subject Awareness States

The selected email subject should also track a dedicated awareness state.

Recommended values:

- `unaware`
- `at_risk`
- `suspicious`
- `confirmed`

### Meaning

#### `unaware`
The subject does not know the email is about them.

#### `at_risk`
The subject has not seen the email, but conditions suggest they may find out soon.

#### `suspicious`
The subject senses something is wrong or that people are behaving strangely around them.

#### `confirmed`
The subject knows about the email and understands they are the subject of it.

Once the subject reaches `confirmed`, the run should shift toward end-game / defensive resolution.

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
At this point, the all-hands is very likely to orbit it unless the player has successfully redirected attention elsewhere.

---

## What Raises Spread

These are the main prototype spread causes.

### Delivery risk increases when:
- the recall fails widely
- a high-gossip NPC receives the email
- the subject receives the email, even if unread

### Awareness increases when:
- a talkative NPC learns about the email
- an allied pair shares information
- the player fails a manipulation attempt publicly
- physical evidence is seen
- the player delays too long while the issue remains active

### Confidence increases when:
- an NPC sees the email directly
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
- the subject becomes visibly aware before the all-hands

---

## What Lowers Spread

### Delivery risk can be reduced by:
- gaining access to a machine before the email is opened
- deleting or suppressing the email on a specific device
- distracting a recipient from checking their inbox
- isolating a recipient from their device

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

The real goal is to stop the email from becoming the office’s dominant public story **before the subject learns about it under the worst possible conditions**.

The best prototype success is:
- the subject first finds out at the all-hands
- and the room is not fully centered on destroying the player

---

## Interaction With Player Suspicion

Email spread and player suspicion should influence each other.

### When player suspicion rises:
- NPCs may interpret the email story as more believable
- office focus may rise faster
- confidence may harden more easily
- the subject may become suspicious sooner

### When player suspicion stays low:
- the email may remain socially unstable
- NPCs may disagree more
- the room may pivot toward other conflicts instead
- the player has a better chance of keeping the subject unaware until the meeting

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
- if the subject is closely bonded to another NPC, that bond may accelerate early discovery

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

- one selected `emailTargetId`
- per-NPC delivery state
- per-NPC email knowledge state
- one subject-awareness state
- one global office focus state
- one fair intervention window before the subject can auto-read a newly delivered unread email
- simple confidence effects through repeated confirmation
- a few clear causes that raise or lower spread

Do **not** build a giant spread simulation yet.

---

## Summary

In prototype 1, email spread means:

- who got the email
- who knows
- how sure they are
- whether the subject has found out
- how much the office is centering it
- and whether the player still has time to intervene before the subject reads it

That is enough to support:
- containment
- deletion attempts
- delay tactics
- rumor escalation
- public fallout
- and under-the-radar manipulation