# Office Panic Guided Opening Update Plan

## Purpose

The opening of the game needs clearer player guidance. A new player should quickly understand:

- What happened.
- Why it matters.
- What they should do next.
- What kind of choices they are making.
- What consequences their choices are creating.

The goal is not to make the game easier. The goal is to make the player understand the panic machine they just stepped into.

---

# Phase 1: Guided Opening Flow

## Goal

Create the first playable sequence after the bad email. The player should not be dropped into the full office immediately. The opening should guide them through the first few decisions with limited choices and a clear objective.

## Player Experience

The player begins at their desk immediately after sending the bad email.

The game should establish:

- The email has been sent.
- It was a mistake.
- Other people may have seen it.
- The player needs to act before the office reacts.

## Opening Beat

Scene idea:

Black screen with the text "Monday 9:00 am" displayed

An email message about a promotion is displayed

There Internal complaint from the main character, message displayed

An internal dialog summerizing the email message is displayed

The send button clicks.

For one second, nothing happens.

Then you notice the recipient list.

That was not supposed to go to everyone.

The office is quiet, but not normal quiet. The dangerous kind.

## First Objective

Current objective:

Find out who has seen the email.

## First Available Locations

At the start, only a few locations should be available:

- Your computer
- Betty's desk
- Lisa's desk

Other areas should be locked or unavailable until after the first interaction.

Examples:

- Break room: You are too panicked to wander off yet.
- Conference room: No meeting is happening yet.
- Bathroom: You can hide later. Right now you need information.
- Frank's desk: You are not ready to approach Frank directly.
- Tim's desk: Tim is watching the room too closely.

## First Desk Interaction

The player should be pushed toward an initial social decision.

Example prompt:

You need to decide how to handle this before everyone starts forming their own version of the story.

Available options:

- Go to Betty's desk.
- Go to Lisa's desk.
- Re-read the email at your computer.

## Phase 1 Acceptance Criteria

- The player understands that the email mistake caused the situation.
- The player has a clear first objective.
- The player has limited location choices.
- The player is not exposed to the full office immediately.
- The first interaction leads naturally into a strategy decision.

---

# Phase 2: Strategy-Grouped Choices

## Goal

Replace flat choice lists with clearer strategy groupings. The player should understand whether they are telling the truth, scheming, or staying neutral.

## Core Choice Groups

Each major early NPC interaction should offer three broad approaches:

- Tell the truth
- Scheme
- Stay neutral

These are not final moral labels. They are player-facing strategy buckets.

## Betty Interaction

### Setup

Betty looks up from her monitor.

She definitely saw the email.

She is trying not to look like she saw the email.

## Betty Strategy Groups

### Tell the truth

Use these when the player wants to repair damage or build trust.

Options:

- Apologize before Betty says anything.
- Admit the email was a mistake.
- Ask Betty for advice.
- Ask if anyone else has reacted yet.

Possible effects:

- Increase Betty trust.
- Reduce Betty suspicion.
- Start or advance the Win Betty Over thread.
- Reduce short-term panic but increase risk of the truth spreading.

### Scheme

Use these when the player wants to control the story or redirect blame.

Options:

- Suggest Frank has been acting weird.
- Ask if Tim has been asking questions.
- Say the email looks worse without context.
- Imply someone else may have edited or forwarded something.

Possible effects:

- Start or advance the Frame Frank thread.
- Increase Betty suspicion.
- Increase Tim Timeline Threat if the lie creates contradictions.
- Create office chatter.

### Stay neutral

Use these when the player wants to gather information or avoid committing.

Options:

- Ask what Betty thinks happened.
- Say you need to check something first.
- Retract part of what the email said.
- Say the message was sent before you were finished.
- Avoid giving a direct explanation.

Possible effects:

- Reveal who has seen the email.
- Delay immediate consequences.
- Slightly increase suspicion if the player sounds evasive.
- Keep multiple paths open.

## Lisa Interaction

### Setup

Lisa is organizing something at her desk.

She has the calm expression of someone who already knows there is a problem.

## Lisa Strategy Groups

### Tell the truth

Options:

- Admit the email was sent by mistake.
- Ask Lisa how bad this looks.
- Ask whether the boss has seen it.
- Ask for help containing the situation.

Possible effects:

- Start or advance the Repair Damage thread.
- Reveal meeting or schedule information.
- Reduce Lisa suspicion if handled early.
- Increase risk that Lisa reports the issue formally.

### Scheme

Options:

- Ask whether Frank has complained about you recently.
- Suggest someone may have misread the email.
- Ask Lisa who controls the meeting schedule.
- Try to learn whether Tim has raised concerns.

Possible effects:

- Advance Frame Frank.
- Advance Probe Tim.
- Increase Lisa suspicion.
- Unlock schedule-related information.

### Stay neutral

Options:

- Ask if anything unusual is happening today.
- Ask whether there are meetings later.
- Ask who is currently in the office.
- Say you are trying to understand the situation.

Possible effects:

- Unlock schedule.
- Unlock office movement hints.
- Reveal possible NPC routes.
- Keep both truth and scheme paths available.

## Phase 2 Acceptance Criteria

- Betty and Lisa both have strategy-grouped interactions.
- The player can clearly distinguish truth, scheme, and neutral choices.
- Each strategy group has different likely consequences.
- The choice structure teaches the player how the game works.

---

# Phase 3: Active Threads UI

## Goal

Show the player what they are building toward. The game should make it visible when a choice starts, advances, weakens, or threatens a thread.

## Core Idea

The player is not just picking dialogue.

The player is building social threads.

Examples:

- Frame Frank
- Win Betty Over
- Repair Damage
- Probe Tim
- Tim Timeline Threat
- Office Chatter
- Boss Awareness

## Suggested UI Label

Active Threads

## Example Thread Display

Frame Frank: 25%

Betty has heard that Frank may be involved.

Win Betty Over: 50%

Betty thinks this may have been a mistake, not sabotage.

Tim Timeline Threat: Rising

Tim is starting to compare who was where and when.

Office Chatter: Low

The office has noticed something, but the story has not spread yet.

## Thread Types

### Player-Built Threads

These are plans or paths the player intentionally advances.

Examples:

- Frame Frank
- Win Betty Over
- Repair Damage
- Control the Story
- Gather Timeline Info

### Threat Threads

These are dangers that grow as the player acts or delays.

Examples:

- Tim Timeline Threat
- Boss Awareness
- Office Chatter
- Frank Retaliation
- Lisa Formal Report

## Thread Feedback Messages

When a player makes a meaningful choice, show a short update.

Examples:

- Thread started: Frame Frank.
- Thread advanced: Win Betty Over.
- Threat increased: Tim Timeline Threat.
- Thread weakened: Repair Damage.
- New risk: Frank may hear about this.

## When Threads Should Appear

Do not show every possible thread at the start.

Only show a thread after:

- The player starts it.
- An NPC reveals it.
- The game wants to warn the player about a growing danger.

## Phase 3 Acceptance Criteria

- The player can see active social threads.
- The player understands what their choices are building toward.
- Threads update after major decisions.
- Hidden systems can still exist, but important player-facing progress is visible.
- The UI does not reveal every secret variable.

---
