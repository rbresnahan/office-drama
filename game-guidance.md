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

# Phase 4: Visible Consequence Beats

## Goal

Make the office feel alive. After the player makes choices, the game should show visible reactions in the world.

## Core Idea

When the player acts, the office responds.

This can happen through:

- NPC movement
- Office chatter
- Reaction messages
- New unlocked choices
- Changed location states
- Thread updates

## Example Consequence Beats

### Betty Moves

Betty leaves her desk and walks toward Lisa.

Wheels have been set in motion.

### Tim Watches

Tim looks up from his monitor.

He starts writing something down.

### Frank Reacts

Frank slams a drawer shut.

Either he heard something, or he wants you to think he did.

### Lisa Checks the Schedule

Lisa opens the office calendar.

That is probably bad.

### Office Chatter Starts

Two people near the printer stop talking when you look over.

The email is moving faster than you are.

## Consequence Message Tone

The tone should be short, punchy, and slightly anxious.

Avoid long explanations.

Good:

Betty walks toward Lisa's desk.

Bad:

Because of your previous decision, Betty has now decided to initiate a conversation with Lisa that may affect future social variables.

The second one sounds like patch notes escaped containment.

## Suggested Consequence Categories

### Movement

NPC physically changes location.

Example:

Betty moves from her desk to Lisa's desk.

### Chatter

The rumor spreads.

Example:

Someone near the printer says Frank's name.

### Suspicion

An NPC becomes more alert.

Example:

Tim starts tracking the order of events.

### Opportunity

A new option opens.

Example:

Lisa's desk is empty. You can check the schedule.

### Threat

A danger gets closer.

Example:

The boss has opened the email.

## Phase 4 Acceptance Criteria

- Major choices trigger visible consequence beats.
- At least some NPCs visibly move or react.
- The player gets feedback that the office is changing.
- Consequence beats connect to active threads.
- The world feels reactive, not random.

---

# Phase 5: NES Intro Animation

## Goal

Add a short intro sequence that establishes the inciting incident before gameplay begins.

This should be added after the guided opening works, not before.

## Style

Simple NES-style or old 8-bit visual sequence.

The intro should be short and readable.

No complex animation required.

## Suggested Sequence

### Panel 1: Commute

A tiny car or bus moves through traffic.

Caption:

Monday morning.

Already cursed.

### Panel 2: Arrival

The player arrives at the office building.

Caption:

You made it to work.

Technically.

### Panel 3: Desk

The player sits at their computer.

Caption:

One email before coffee.

A classic mistake.

### Panel 4: Email

The player types a reply.

Caption:

You write the thing you should not say out loud.

### Panel 5: Send

The cursor hovers over Send.

Caption:

Then your finger betrays you.

### Panel 6: Realization

The recipient list appears.

Caption:

Everyone.

You sent it to everyone.

### Panel 7: Gameplay Start

Cut to the player at their desk.

Caption:

The office is quiet.

For now.

## Intro Requirements

- The intro should be skippable.
- The intro should not be too long.
- The intro should lead directly into Phase 1.
- The intro should explain the situation visually.
- The player should understand the mistake before making choices.

## Phase 5 Acceptance Criteria

- The player sees the commute and email mistake.
- The player understands what caused the office panic.
- The intro transitions directly into the guided opening.
- The intro can be skipped.
- The intro does not delay gameplay too much.

---

# Phase 6: Expand Locations and Deeper Systems

## Goal

After the guided opening works, unlock the wider office and deeper systems.

This is where the game becomes more open.

## Unlock Timing

The full office should open only after the first guided interaction.

Possible unlock trigger:

- Player has interacted with Betty or Lisa.
- Player has started at least one thread.
- First consequence beat has fired.

## Expanded Locations

### Break Room

Purpose:

- Rumor overhearing.
- Bottle discovery.
- Side conversations.
- Low-risk hiding place that may become risky.

Possible inspect options:

- Inspect fridge.
- Inspect counter.
- Inspect bottle.
- Listen near doorway.
- Talk to whoever is present.

### Bathroom

Purpose:

- Hiding.
- Panic reset.
- Removing or planting evidence.
- Private reflection.

Possible inspect options:

- Inspect sink.
- Inspect trash.
- Inspect stall.
- Remove toilet paper.
- Hide for one turn.

### Closet

Purpose:

- Mischief and evidence manipulation.
- Object-based choices.
- Risky hiding.

Possible inspect options:

- Inspect shelves.
- Take supplies.
- Remove toilet paper.
- Hide.
- Listen through wall.

### Conference Room

Purpose:

- Scheduled meetings.
- Group pressure.
- Forced social encounters.

Possible inspect options:

- Check meeting board.
- Inspect chairs.
- Read notes.
- Listen outside.

### Frank's Desk

Purpose:

- Scapegoat path.
- Retaliation risk.
- Evidence planting or confrontation.

Possible inspect options:

- Inspect desk.
- Talk to Frank.
- Mention Betty.
- Mention Tim.
- Back away.

### Tim's Desk

Purpose:

- Timeline threat.
- Procedural pressure.
- Evidence tracking.

Possible inspect options:

- Ask what Tim knows.
- Look at Tim's notes.
- Distract Tim.
- Challenge Tim.
- Feed Tim bad information.

## Inspect System

Add inspect options to locations.

Inspecting should:

- Reveal information.
- Unlock choices.
- Advance or reduce threads.
- Sometimes cost a turn.
- Sometimes trigger risk.

## Hidden Layer

Some events should happen without the player seeing everything.

Examples:

- Betty talks to Lisa.
- Tim compares timestamps.
- Frank hears his name.
- Boss reads the email.
- Lisa updates the meeting schedule.

However, the player should see enough surface-level evidence to understand the office is moving.

## Meeting System

Meetings should be introduced before they happen.

The player needs warning.

Example:

Lisa updates the office board.

Morning Stand Up: 10:00 AM

Catch Up: 2:30 PM

All Hands: 5:00 PM

## Meeting Names

Use grounded office names:

- Morning Stand Up
- Catch Up
- All Hands

The names should sound boring, because boring meetings make panic funnier.

## Phase 6 Acceptance Criteria

- More locations unlock after the guided opening.
- Inspect options exist in key locations.
- Hidden NPC actions affect the world.
- Meeting events are introduced before they trigger.
- The player can understand scheduled pressure.
- The office feels larger without becoming confusing.

---

# Suggested Implementation Order

1. Phase 1: Guided opening flow.
2. Phase 2: Strategy-grouped choices.
3. Phase 3: Active threads UI.
4. Phase 4: Visible consequence beats.
5. Phase 5: NES intro animation.
6. Phase 6: Expanded locations and deeper systems.

Do not build the intro first.

The intro explains the situation, but the guided opening teaches the player how to play.

The best early test is the first five minutes of gameplay.

Ask testers:

- Do you understand what happened?
- Do you know what your goal is?
- Do the first choices make sense?
- Do you understand the difference between truth, scheme, and neutral?
- Do you understand what changed after your choice?
- Do you feel like you are building toward something?

If the answer is yes, the game is pointed in the right direction.