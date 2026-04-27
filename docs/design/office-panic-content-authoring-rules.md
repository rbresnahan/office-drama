# Office Panic Demo — Content Authoring Rules v0.1

## Purpose

This document defines how to write new scenes, choices, schemes, and consequences for Office Panic.

The goal is to keep future content consistent, strategic, and easy to implement.

This is the document to use when adding new story material.

---

# Core Rule

Every meaningful action should usually do three things:

1. Advance one green bar.
2. Increase or reduce one red bar.
3. Unlock, block, or modify a future choice.

If a choice does not affect pressure, information, trust, risk, or future options, it probably does not belong.

---

# Story Unit Types

The game should use these content units:

- Scene.
- Choice.
- Effect.
- Requirement.
- Discovery.
- Scheme chain.
- Backlash scene.
- Finale outcome.

---

# Scene Rules

A scene is a location, person, or moment where the player can make a strategic choice.

Scenes should not exist only for atmosphere.

Each scene should support at least two tactical uses.

Good scene example:

Betty’s Desk can support:

- Warm Betty.
- Frame Frank.
- Info about Tim.
- Info about Celia.
- Cleanup after a bad comment.
- Commitment if Betty trust is high.

Bad scene example:

A hallway that only says “you walk down the hallway” and does nothing.

Atmosphere is good.

Empty turns are not.

---

# Scene Structure

Each scene should have:

## Scene ID

A stable machine-readable ID.

Example:

`betty_desk_phase_2`

## Title

Human-readable scene title.

Example:

`Betty Watches the Room`

## Phase Availability

Which phases this scene can appear in.

Example:

- Phase 1.
- Phase 2.

## Body Text

The story text shown to the player.

## Internal Thought

A short strategic thought explaining possible consequences.

This should help the player think tactically without revealing exact math every time.

## Choices

Three to five choices.

Each choice should have:

- Choice text.
- Category.
- Requirements.
- Effects.
- Unlocks.
- Locks.
- Result text.

---

# Internal Thought Rules

Internal thought should explain strategic pressure.

It should not tell the player the correct answer.

Good internal thought:

> Betty is watching the room more than her screen. If you tell her you are scared, she may soften. If you mention Frank, she may start watching him. If you push too hard, she may realize you are recruiting her.

Bad internal thought:

> Choose option two to increase Frame Frank by 25%.

The player should feel smart, not spreadsheet-haunted.

---

# Choice Category Rules

Each choice should belong to one or more categories.

## Positive

Builds trust, sympathy, or goodwill.

## Underhanded

Manipulates, frames, sabotages, or weaponizes information.

## Neutral

Maintains position and avoids major risk.

## Info-Gathering

Learns current state, relationships, vulnerabilities, or future opportunities.

## Cleanup

Reduces danger created by previous actions.

## Commitment

Major payoff or no-going-back move.

## Abort or Pivot

Abandons or redirects a plan.

---

# Choice Count Rules

Most scenes should offer three to five choices.

Avoid overwhelming the player with seven choices unless the moment is important.

A good default choice set:

- One positive choice.
- One underhanded choice.
- One info-gathering choice.
- One neutral or cleanup choice.

Late-game scenes can include a commitment choice if requirements are met.

---

# Requirements Rules

A requirement controls whether a choice appears.

Choices should be unlocked by:

- Phase.
- Prior discovery.
- Bar value.
- NPC state.
- Previous choice.
- Location access.
- Backlash condition.

Examples:

## Plant Bottle in Frank’s Drawer

Requires:

- Phase >= 2.
- Frame Frank >= 25%.
- Frank is away from desk.
- Player has discovered or created Frank suspicion.

## Ask Betty to Defend You

Requires:

- Warm Betty >= 75%.
- Betty Loses Trust <= 50%.

## Blame Missing Bathroom Supplies on Betty

Requires:

- Sideline Tim >= 75%.
- Betty Klepto >= 50%.
- Bathroom supplies missing.

---

# Effects Rules

Effects should be clear and small.

Most effects should move bars by 25%.

Avoid tiny hidden math unless absolutely necessary.

Example effect:

- Frame Frank +25%.
- Frank Retaliates +25%.
- Unlock `tell_tim_about_franks_desk`.

Large effects are allowed for commitment moves or backlash scenes.

Example:

- Betty Loses Trust +50%.
- Warm Betty -50%.
- Trigger `betty_backlash`.

---

# Green Bar Rules

Green bars represent stories, schemes, trust, leverage, or survivable positions.

Examples:

- Frame Frank.
- Warm Betty.
- Distract Tim.
- Contain Celia.
- Blame the System.
- Sideline Tim.
- Betty Klepto.
- Devon Leak.
- Lisa Overreacting.
- Celia Dramatic.

A green bar reaching 100% should mean the scheme is fully available during the finale.

A green bar at 50% or 75% should still matter.

Do not make partial progress worthless.

---

# Red Bar Rules

Red bars represent danger.

Examples:

- Tim Suspects You.
- Celia Finds Out.
- Frank Retaliates.
- Betty Loses Trust.
- Management Escalates.

A red bar reaching 100% should usually trigger a major consequence.

Examples:

- Tim exposes a contradiction.
- Celia gets the full message.
- Frank publicly attacks the player.
- Betty refuses to defend the player.
- Management makes the incident formal.

Red bars should not only be finale checks.

They should also trigger backlash scenes during play.

---

# Discovery Rules

A discovery is information that unlocks future choices.

Discoveries should be tracked separately from bar progress when useful.

Examples:

- `knows_tim_food_vulnerability`
- `knows_frank_under_pressure`
- `knows_devan_saw_email`
- `knows_celia_has_not_seen_full_email`
- `knows_lisa_talked_to_management`
- `bathroom_supplies_missing`
- `bottle_planted_frank`
- `betty_heard_frank_suspicion`

Discovery choices are valuable even if they do not move a bar immediately.

---

# Unlock and Lock Rules

Choices should create future consequences.

## Unlock Example

If the player asks Betty whether Frank seemed strange:

Unlock:

- Later ask Tim about Frank’s location.
- Later ask Devon if Frank has been under pressure.
- Later plant bottle with higher effectiveness.

## Lock Example

If the player plants evidence against Frank:

Lock:

- Ask Frank for sincere help.
- Clean apology route with Frank.
- Low-risk neutral route with Frank.

Locks make choices matter.

But avoid locking too much too early.

---

# Commitment Choice Rules

Commitment choices should be earned.

They should usually require:

- Phase 3 or Phase 4.
- Relevant green bar >= 50% or 75%.
- Required discovery.
- Related danger bar not already maxed.

Examples:

- Plant bottle in Frank’s drawer.
- Ask Betty to defend you.
- Push system failure in front of Lisa.
- Use Devon to spread the final Frank rumor.
- Confront Celia directly.

Commitment choices should feel powerful and scary.

The player should think:

> Okay, I am doing this. This is the story I am betting on.

---

# Cleanup Choice Rules

Cleanup choices exist to prevent spiraling failure.

They should cost time.

They should not be free undo buttons.

Example:

Walk back the Frank rumor.

Effects:

- Frank Retaliates -25%.
- Frame Frank -25%.
- Betty Loses Trust -25%, if Betty heard the original comment.

Cleanup choices give the player a way to recover without erasing consequences.

---

# Abort or Pivot Rules

Abort or pivot choices let the player change strategy.

They should matter because players will start schemes they later regret.

Example:

Pivot from Frame Frank to Blame the System.

Effects:

- Frame Frank -25%.
- Blame the System +25%.
- Tim Suspects You +25%, if Tim notices the sudden pivot.
- Frank Retaliates -25%.

Pivoting should create new problems while solving old ones.

That is the fun.

---

# Backlash Scene Rules

A backlash scene is the world pushing back.

It should trigger when a red bar or risky condition reaches a threshold.

Backlash scenes should not feel random.

They should feel earned by player behavior.

Examples:

## Betty Backlash

Trigger:

- Betty Loses Trust >= 75%.

Scene:

Betty confronts the player about being used.

## Tim Backlash

Trigger:

- Tim Suspects You >= 75%.

Scene:

Tim asks a precise question that exposes a contradiction.

## Frank Backlash

Trigger:

- Frank Retaliates >= 75%.

Scene:

Frank realizes the player is steering suspicion.

## Celia Backlash

Trigger:

- Celia Finds Out >= 100%.

Scene:

Celia has the full message and is ready to use it.

## Lisa Backlash

Trigger:

- Management Escalates >= 75%.

Scene:

Lisa starts documenting the incident formally.

---

# Cross-Scheme Rules

The strongest content should connect schemes.

A scheme should not only affect itself.

Good cross-scheme example:

The player removes bathroom supplies during Sideline Tim.

Later, if Betty Klepto is high enough, the player can blame the missing supplies on Betty.

This creates:

- Sideline Tim progress.
- Betty Klepto opportunity.
- Management Escalates risk.
- Betty Loses Trust risk.

This is exactly the kind of reusable narrative material the game should encourage.

---

# Partial Success Rules

Partial success should matter.

Do not make 100% the only useful state.

Example:

## Frame Frank

- 25%: Frank enters office chatter.
- 50%: Frank creates uncertainty.
- 75%: Frank is a serious suspect.
- 100%: Frank is a viable scapegoat.

Example:

## Warm Betty

- 25%: Betty is softer.
- 50%: Betty slows criticism.
- 75%: Betty may defend once.
- 100%: Betty actively protects the player.

Partial progress creates messy endings.

Messy endings are replayable.

---

# Finale Resolver Rules

The finale should read the board state.

It should not rely on one variable.

Finale should consider:

- Highest green bars.
- Highest red bars.
- Completed schemes.
- Partial schemes.
- NPC backlash states.
- Whether Tim is present.
- Whether Celia has the full email.
- Whether Betty trusts the player.
- Whether Frank is primed as scapegoat.
- Whether management has escalated.
- Whether system blame is credible.

The ending should blend consequences.

Example:

If:

- Frame Frank = 75%.
- Warm Betty = 50%.
- Tim Suspects You = 75%.
- Frank Retaliates = 50%.

Then:

Frank takes heat, but Tim still presses the timeline.

Betty hesitates.

The player survives, but only partly.

---

# Tone Rules

The game should be darkly funny, tense, and socially nasty.

The player can do bad things.

The game should not pretend bad things are harmless.

Underhanded actions should be useful, but costly.

Good tone:

- Petty.
- Strategic.
- Awkward.
- Funny in a bleak office way.
- Morally uncomfortable.
- Consequence-driven.

Bad tone:

- Cartoon villainy with no cost.
- Random cruelty with no logic.
- Spreadsheet-only gameplay.
- Consequences that feel arbitrary.
- Pure puzzle solving without social pressure.

---

# Writing Style Rules

Use clear, vivid prose.

Keep internal dialogue short enough to be readable during play.

Avoid giant paragraphs inside scenes.

A scene should usually have:

- One setup paragraph.
- One internal thought paragraph.
- Three to five choices.

Result text can be punchier.

Example result text:

> Betty frowns.
>
> Not because she believes you.
>
> Because now she has a shape to put her worry into.
>
> That is how rumors start feeling like observations.

---

# First Demo Content Limits

Do not overload the first demo.

Initial recommended scope:

## Green Bars

- Frame Frank.
- Warm Betty.
- Distract Tim.
- Contain Celia.
- Blame the System.
- Sideline Tim.

## Red Bars

- Tim Suspects You.
- Celia Finds Out.
- Frank Retaliates.
- Betty Loses Trust.
- Management Escalates.

## Main NPCs

- Betty.
- Tim.
- Frank.
- Celia.
- Devon.
- Lisa.

## Main Locations

- Betty’s Desk.
- Tim’s Desk.
- Frank’s Desk.
- Celia’s Area.
- Break Room.
- Bathroom Hallway.
- Lisa’s Area.

That is enough for the first serious prototype.

Do not add more until the first loop works.

---

# Authoring Checklist

Before adding a new choice, answer:

1. What category is this choice?
2. What bar does it affect?
3. What risk does it create or reduce?
4. What future choice does it unlock or block?
5. Does it require prior discovery?
6. Does it belong in this phase?
7. Does it create partial success value?
8. Does it connect to another scheme?
9. What backlash could it contribute to?
10. Is it fun to choose?

If the answer to number ten is no, rewrite it.

Life is short. Office panic should not be boring.