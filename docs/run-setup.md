# Run Setup — Prototype 1

## Purpose
This document defines how a run starts in the first playable prototype.

The run setup is built around:
- one selected email subject
- a partial recall attempt
- a resulting delivery pattern
- and the player’s first read of the damage

This setup should create variation without requiring a giant simulation.

---

## Core Rule

At the start of each run:

1. the player sends a bad email
2. the email is about one selected NPC
3. the player attempts recall
4. recall partially succeeds or fails
5. the player begins the run with limited but useful information about who got it

The player can never fully undo the send.

The game forbids a perfect unsend because that would delete the core problem.

---

## Email Subject

The email subject is one existing NPC from the current cast.

Prototype field:
- `emailTargetId`

The selected subject remains a normal NPC in the social system.
They are not a special extra character.

This means:
- they keep their alliances
- they still react like themselves
- they still influence others
- but the email being about them raises the stakes around their awareness and public reaction

---

## Fair Start Rule

The player must always get a fair first intervention window.

If the subject received the email in the starting setup, the subject cannot instantly read it before the player gets a chance to act.

That means:
- the subject may start at their desk
- the subject may start with the email in their inbox
- the subject may be very close to reading it
- but the game should not auto-resolve that read before the player gets a chance to intervene

The player may fail.

But failure must come after play, not before it.

This is required for fair gameplay.

---

## Player Knowledge At Start

The player should know:
- who the email is about
- that recall did not fully solve the problem
- at least some actionable information about who got the email
- whether the subject appears to have received it
- whether the subject has read it yet, if that is knowable from the inbox state

The player should not necessarily know everything.
The opening should include enough uncertainty to create pressure.

---

## Starting Delivery Patterns

Prototype 1 should use a small set of setup patterns.

These are not all equal in difficulty.

---

## Pattern 1: Wide Including Subject

### Description
Most or all of the office got the email, including the subject.

### Fair Play Rule
The subject may have the email, but begins in `received_unread` until the player has had an intervention chance.

### Pressure Shape
- hard mode
- high awareness risk
- subject is in immediate danger of discovery
- player must choose between deletion attempts, distraction, and social redirection

### Example
You send an email about Betty.
Everyone gets it.
Betty has not read it yet, but the danger is immediate.
Now you need to decide whether to delay her, access her machine, or let the run shift toward defense.

---

## Pattern 2: Wide Excluding Subject

### Description
Most or all of the office got the email, but the subject did not.

### Pressure Shape
- strong middle-to-hard mode
- lots of cleanup work
- the subject is still protected for the moment
- player can focus on delay, lie, distract, and redirect tactics

### Example
You send an email about Betty.
Everyone but Betty gets it.
The office is dangerous, but at least the subject is not yet in the loop.

---

## Pattern 3: Limited Group

### Description
Only a few NPCs got the email.

### Pressure Shape
- easier mode
- more surgical
- the player can contain specific people or machines
- good for cleaner manipulation runs

### Example
You send an email about Betty.
Only Tim and Lisa got it.
That is still bad, but much more manageable.

---

## Pattern 4: Subject Only Unread

### Description
Only the subject got the email, and they have not read it yet.

### Pressure Shape
- panic timer mode
- highly tactical
- player may need to distract, access, delete, or delay immediately

### Example
You send an email about Betty.
Only Betty got it, but she has not opened it yet.
Now it is a race.

---

## Pattern 5: Messy Partial

### Description
The email reached an awkward, mixed subset of NPCs.

### Pressure Shape
- medium unpredictability
- good replayability
- useful for runs where the room becomes socially strange instead of simply wide or narrow

### Example
You send an email about Betty.
Tim, Devon, and Frank got it.
Betty did not.
Now the problem is less about volume and more about the specific shape of the room.

---

## Difficulty Logic

For prototype 1, different delivery patterns can imply different starting pressure.

General rule of thumb:
- `Wide Including Subject` = hardest
- `Wide Excluding Subject` = hard
- `Messy Partial` = medium
- `Limited Group` = easier
- `Subject Only Unread` = tactical panic mode

This does not need to be perfectly balanced yet.
It just needs to feel different enough to support replayability.

---

## Setup Variables

Prototype 1 only needs a few run-setup variables:
- `emailTargetId`
- `deliveryPatternId`
- per-NPC `deliveryState`
- per-NPC `knowledgeState`
- subject `awarenessState`
- global `officeFocusState`
- one fair intervention window before the subject can auto-read an unread delivered email

That is enough.

Do not overbuild this.

---

## First Turn Goal

A good opening turn should force the player to answer:
- who actually got it
- who is most dangerous right now
- whether the subject is safe for the moment
- whether this is a deletion run, a delay run, or a diversion run

That gives the player a strong immediate problem instead of slow abstract setup.

---

## End-Game Shift Rule

Once the subject actually reads the email and reaches `confirmed`, the run shifts toward end-game / defensive mode.

At that point:
- the defensive phase has started
- the player is now shaping fallout, not just preventing discovery
- all-hands pressure should rise sharply
- the room becomes harder to stabilize quietly

This is the point where the player has lost the clean prevention line.

It is not automatic game over.

---

## Prototype Summary

The run setup should:
- choose one existing NPC as the subject
- use recall failure to generate the starting pattern
- guarantee a fair first intervention window
- tell the player enough to make decisions
- and create pressure around whether the subject finds out before the all-hands

That is enough for a strong prototype opening.