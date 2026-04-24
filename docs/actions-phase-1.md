# Phase 1 Action List

## Purpose
This document defines the first playable set of player-facing actions.

The goal is to keep actions:
- concrete
- readable
- tonally strong
- and small enough to implement cleanly

Player-facing actions should feel like office sabotage and social maneuvering.
They should **not** read like abstract system commands.

The new core shape of the prototype is:
- the email is about one selected NPC
- recall only partially works
- the player is trying to manage who got it, who read it, and when the subject finds out

That means phase 1 actions must support both:
- offensive manipulation
- defensive delay and containment
- late end-game reframing after discovery

---

## Phase 1 Action Set

Prototype 1 should start with **8 core action types**.

---

## 1. Trace

### Player-facing meaning
Check inbox, sent folder, recall results, or related clues to learn who received the email and whether it has been opened.

### Best used for
- understanding the opening state
- learning whether the subject has the email
- deciding who needs immediate attention

### Likely effects
- reveals delivery state
- reveals unread vs read risk
- helps the player make informed decisions
- may slightly increase confidence in the player’s internal model

### Risks
- usually low risk
- may cost time
- may create risk if done from the wrong machine or in the wrong place

---

## 2. Distract

### Player-facing meaning
Pull someone’s attention away with inconvenience, urgency, nuisance, or workplace nonsense.

### Best used for
- buying time
- preventing the subject from checking their inbox
- stopping an NPC from acting immediately
- keeping a recipient away from their machine

### Likely effects
- delays opening or spread
- reduces awareness growth temporarily
- can create funny office sabotage beats

### Risks
- usually temporary
- can look suspicious if overused
- may create collateral resentment

---

## 3. Access

### Player-facing meaning
Get access to a person’s machine, desk area, or email environment through trust, opportunity, deception, or chaos.

### Best used for
- unread email scenarios
- selective containment
- setting up a delete or suppression attempt

### Likely effects
- opens the path to deletion or interference
- may reward good social setup or smart timing
- can be very strong when the subject has not read the email yet

### Risks
- can fail hard if the target already distrusts the player
- can sharply raise playerSuspicion if caught or poorly explained

---

## 4. Delete / Suppress

### Player-facing meaning
Remove, hide, bury, or otherwise interfere with the email after gaining access.

### Best used for
- a subject who received but has not yet read the email
- a small recipient list
- desperate containment

### Likely effects
- reduces delivery danger
- lowers confidence if proof disappears
- may stop the subject from learning early

### Risks
- never solves the whole problem globally
- high risk if discovered
- may count as dirty depending on method

### Important Rule
The player can never fully undo the send.
The recall is never perfect and the game does not allow a total reset of reality.

---

## 5. Reassure

### Player-facing meaning
Calm someone down, make them feel safer, reduce panic or defensiveness.

### Best used for
- anxious NPCs
- unstable allies
- preventing someone from overreacting
- keeping a likely spreader from turning the situation into a crisis

### Likely effects
- lowers tension
- raises playerLikability on success
- can lower playerSuspicion if done credibly
- may reinforce bonds instead of breaking them

### Risks
- fails if used on someone who wants force, proof, or leverage instead of comfort

---

## 6. Redirect

### Player-facing meaning
Give someone a more interesting target, topic, or social path.

### Best used for
- gossip-driven NPCs
- attention-seeking NPCs
- room-level deflection
- shifting focus away from the subject before all-hands

### Likely effects
- lowers office focus on the email
- creates or strengthens side conflict
- can weaponize existing rivalries
- often useful for staying under the radar

### Risks
- may create a new fire
- may count as dirty if obviously manipulative

---

## 7. Lie / Deflect

### Player-facing meaning
Explain away weird behavior, muddy what happened, deny the shape of the truth, or steer someone toward a false conclusion.

### Best used for
- delaying the subject
- confusing low-confidence recipients
- reducing confidence before the story hardens
- reframing blame after the subject already knows

### Likely effects
- lowers confidence if it lands
- buys time
- can protect the player’s position in the short term
- can enable a desperate end-game pivot if enough groundwork was laid earlier

### Risks
- if it fails, playerSuspicion rises
- if used on perceptive NPCs, it can backfire badly
- repeated use can push the room toward intervention mode

### Important Rule
A late blame-shift should only work if the room was prepared for it.
The player must earn that possibility through earlier setup.

---

## 8. Sabotage

### Player-facing meaning
Use a dirtier move to interfere with access, timing, credibility, or smooth communication.

### Best used for
- desperate containment
- breaking a clean chain of events
- forcing the room into disorder
- preventing the subject from learning too early

### Likely effects
- can sharply reduce immediate spread
- can create chaos-diversion opportunities
- can damage key bonds
- can buy precious time when the subject is one click away from reading

### Risks
- high dirty-play cost
- raises playerSuspicion strongly
- increases chance of intervention ending

---

## Prototype Action Rule

Every action should resolve through:
- target
- context
- hidden NPC state
- playerLikability
- playerSuspicion
- alliance effects
- current office focus
- current email delivery state
- current subject-awareness state

This means the same action can succeed or fail differently depending on the room.

---

## Clean vs Dirty Actions

### Usually cleaner
- Trace
- Reassure

### Mixed
- Distract
- Access
- Redirect
- Lie / Deflect

### Usually dirtier
- Delete / Suppress
- Sabotage

This distinction matters because dirtier actions should raise suspicion faster.

---

## Important Design Rule

The action list should stay player-facing and concrete.

Good:
- trace who got the email
- distract Betty from her desk
- access Tim’s computer
- delete the unread message
- reassure Lisa
- redirect Betty
- lie to Frank
- sabotage a printer jam

Bad:
- reduce transfer probability
- alter suspicion vector
- suppress relational signal

Those are system descriptions, not game actions.

---

## Prototype Summary

Phase 1 actions should let the player:
- inspect the damage
- buy time
- get access
- suppress unread copies
- calm people
- redirect attention
- lie when needed
- and get dirty when desperate

Once the subject reads the email, those same actions shift into defensive use:
- protect yourself
- redirect blame
- fracture the room
- and survive the fallout

That is enough for the first playable without bloating the system.