# Office Panic Demo — Tactic Bible v0.2

## Purpose

This document defines the core logic, pressure structure, and story strategy system for the Office Panic demo.

Office Panic is a social pressure game where the player has sent a damaging office email. The recall only partly worked. The email is loose, people are talking, and an all-hands meeting is approaching.

The player’s goal is not simply to escape blame.

The player’s goal is to build the most survivable version of the story before the all-hands meeting.

This document should be treated as the central design reference before implementation.

---

# Core Game Idea

Office Panic is a game about building believable narratives under time pressure.

The player can:

- Apologize.
- Deflect.
- Manipulate.
- Seed suspicion.
- Build sympathy.
- Frame someone else.
- Confuse the timeline.
- Contain emotional fallout.
- Blame the system.
- Abort a failing plan.
- Commit to a risky plan.

The game is not about finding one correct path.

The game is about deciding which story the player can make believable before everyone compares notes.

---

# Design Spine

Every scheme is a story the player is trying to make other people believe.

The progress bar measures how believable that story has become.

The danger bars measure who is starting to see through it.

The all-hands meeting is where every story gets tested.

---

# Core Player Feeling

The player should constantly feel:

> I have several ways out, but not enough time to complete all of them.

That is the central tension.

The player should be able to keep multiple plans alive, but not fully complete every plan.

The game should encourage the player to think:

- I need Betty on my side, but Tim is getting close.
- I can frame Frank, but I need one more setup beat.
- I could talk to Celia now, but if I do, I may lose the chance to plant evidence.
- I have enough time for one strong plan and one backup plan, not everything.
- I do not need Frank destroyed. I just need him questionable enough that Tim hesitates.
- I can survive this, but not cleanly.

---

# Core Loop

The core loop is:

1. The player enters a scene.
2. The scene provides internal strategic dialogue.
3. The player chooses an action.
4. The action changes one or more progress bars.
5. The action may unlock future choices.
6. The action may increase danger.
7. The world reacts based on accumulated state.
8. The all-hands resolves the final board state.

---

# Turn Structure

The first demo should use approximately 24 turns.

The player should have enough time to complete one strong plan and partially develop one or two backup plans.

The player should not have enough time to max every strategy.

---

## Phase 1: Damage Control

Turns 1 to 5.

The player learns who knows what.

The email is loose. The player is trying to understand the blast radius.

### Main Actions

- Talk to Betty.
- Check on Tim.
- Avoid Celia.
- Read the latest office chatter.
- Get a sense of Frank and Devon.
- Learn who saw the email.
- Learn who heard about the email secondhand.
- Discover possible vulnerabilities.

### Phase Purpose

This phase should give the player information, not full control.

The player should feel exposed and reactive.

This phase unlocks future schemes.

---

## Phase 2: Narrative Building

Turns 6 to 14.

The player starts choosing tactics.

This is where schemes begin moving from 0% to 25% or 50%.

### Main Actions

- Seed suspicion.
- Build sympathy.
- Mislead Tim.
- Start preparing a scapegoat.
- Try to contain Celia.
- Start blaming the email system.
- Learn which NPCs are useful witnesses.
- Begin setting up underhanded schemes.

### Phase Purpose

This phase should make the player feel clever, but not safe.

The player should start seeing how different schemes compete with each other.

---

## Phase 3: Pressure Rising

Turns 15 to 20.

People start reacting to what the player has done.

Earlier choices now create consequences.

### Main Actions

- Frank gets suspicious.
- Betty asks harder questions.
- Tim starts comparing timelines.
- Celia may hear more of the truth.
- Management starts preparing for the all-hands.
- Devon spreads something the player said.
- Lisa starts noticing process or policy problems.
- The player chooses whether to double down or pivot.

### Phase Purpose

This phase should make the player feel the cost of earlier decisions.

The game should begin pushing back.

---

## Phase 4: Final Setup

Turns 21 to 24.

The player has time for only a few more moves.

This is where they decide which scheme to push and which risk to ignore.

### Main Actions

- Commit to Frank.
- Commit to Betty.
- Commit to blaming the system.
- Commit to apologizing.
- Commit to chaos.
- Try to lower one danger bar.
- Try to push one green bar to 100%.
- Trigger or avoid backlash scenes.

### Phase Purpose

This phase should feel like triage.

The player should not be asking:

> How do I win everything?

The player should be asking:

> Which disaster can I survive?

---

## Finale: The All-Hands

All progress bars resolve.

The ending is based on the full state of the board.

The finale should not be one clean binary ending.

It should be a blended consequence of:

- Which schemes were completed.
- Which schemes were partially completed.
- Which danger bars reached critical levels.
- Which NPCs trust or distrust the player.
- Which story became most believable.
- Which backlash scenes were triggered.
- Which characters are present or absent.
- Which evidence exists.
- Which lies are still intact.

---

# Progress Bars

All progress bars move in 25% increments.

Valid values:

- 0%
- 25%
- 50%
- 75%
- 100%

Bars should not exceed 100%.

Bars should not go below 0%.

---

## Green Bars

Green bars are schemes, stories, or positions the player is trying to build.

They represent leverage.

### Initial Green Bars

- Frame Frank.
- Warm Betty.
- Distract Tim.
- Contain Celia.
- Blame the System.
- Sideline Tim.

Additional green bars can be added later, but the first demo should stay focused.

---

## Red Bars

Red bars are threats closing in on the player.

They represent suspicion, exposure, escalation, or retaliation.

### Initial Red Bars

- Tim Suspects You.
- Celia Finds Out.
- Frank Retaliates.
- Betty Loses Trust.
- Management Escalates.

Optional future red bars:

- Devon Talks Too Much.
- Lisa Starts Documenting.
- Office Chaos.
- Evidence Trail.

---

# Choice Categories

Every player choice should belong to at least one category.

Not every scene needs every category.

A typical scene should offer three to five choices.

---

## Positive Choice

A positive choice builds trust, sympathy, or goodwill.

Examples:

- Apologize sincerely.
- Ask Betty for advice.
- Admit partial fault.
- Express concern for Celia.
- Ask Frank for help instead of attacking him.

Positive choices should usually:

- Build a green trust bar.
- Lower or delay a red danger bar.
- Cost time.
- Limit some underhanded options.

---

## Underhanded Choice

An underhanded choice manipulates, frames, sabotages, or weaponizes information.

Examples:

- Suggest Frank has been acting unstable.
- Make Betty look like she takes office supplies.
- Feed Devon a false rumor.
- Make Celia seem dramatic.
- Redirect blame toward Lisa.

Underhanded choices should usually:

- Advance a scheme.
- Increase at least one danger bar.
- Unlock more aggressive future choices.
- Risk a backlash scene.

---

## Neutral Choice

A neutral choice maintains position without strongly advancing or risking much.

Examples:

- Say something vague.
- Avoid a person.
- Return to desk.
- Watch the room.
- Pretend to be confused.

Neutral choices should usually:

- Preserve safety.
- Cost a turn.
- Provide minor information or positioning.
- Avoid major commitment.

---

## Info-Gathering Choice

An info-gathering choice discovers vulnerabilities, relationships, current risk, or future opportunities.

Examples:

- Ask Betty what Tim knows.
- Ask Devon who has seen the email.
- Check whether Frank is at his desk.
- Ask Tim what he is looking into.
- Learn whether Celia has read the full message.

Info-gathering choices should usually:

- Unlock future choices.
- Reveal hidden bar state.
- Identify prerequisites.
- Provide low immediate progress but high strategic value.

---

## Cleanup Choice

A cleanup choice reduces damage from previous actions.

Examples:

- Walk back a suspicious comment.
- Tell Betty you were wrong about Frank.
- Stop Devon from spreading a specific detail.
- Remove or soften a clue.
- Give Tim a boring explanation before he invents a sharper one.

Cleanup choices should usually:

- Lower one red bar.
- Cost time.
- Potentially reduce progress in a related green bar.
- Prevent a backlash scene.

---

## Commitment Choice

A commitment choice is a major payoff or no-going-back move.

Examples:

- Plant evidence near Frank.
- Ask Betty to defend you at the all-hands.
- Publicly suggest Frank was involved.
- Push the system failure theory in front of management.
- Confront Celia directly.

Commitment choices should usually:

- Require prior setup.
- Require a minimum bar value.
- Have large effects.
- Lock or damage other routes.
- Trigger finale consequences.

---

## Abort or Pivot Choice

An abort or pivot choice lets the player abandon or redirect a plan.

Examples:

- Stop framing Frank and start blaming the system.
- Tell Betty you were wrong to mention Frank.
- Apologize to Celia and drop the manipulation route.
- Let Tim chase Devon instead.
- Sacrifice one scheme to lower a danger bar.

Abort or pivot choices should usually:

- Reduce progress in one scheme.
- Reduce one danger bar.
- Increase another danger bar if the pivot looks suspicious.
- Open a different route.

---

# Scheme Chains

A scheme chain is a staged plan the player builds over several turns.

A scheme chain should have:

- Name.
- Target.
- Goal.
- Why it matters.
- Required discovery.
- Phase availability.
- Progress stages.
- Actions that advance it.
- Risks.
- Failure states.
- Partial success outcomes.
- Full success outcome.
- Cross-scheme tie-ins.

Scheme chains are defined in:

`office-panic-scheme-chains.md`

---

# NPC Strategy Matrix

Each major NPC should support several player approaches.

For each NPC, define:

- Positive route.
- Underhanded route.
- Neutral route.
- Info route.
- Cleanup route.
- Commitment move.
- Backlash scene.

The NPC matrix is defined in:

`office-panic-npc-matrix.md`

---

# Main Scene Locations

The first demo should use a small set of reusable scenes.

Do not create one scene for each scheme.

Instead, each scene should support multiple tactical angles.

---

## Betty’s Desk

Possible uses:

- Warm Betty.
- Frame Frank.
- Check Tim’s suspicion.
- Contain Celia indirectly.
- Build emotional cover.
- Learn what people are saying.
- Start or repair Betty trust.

---

## Tim’s Desk

Possible uses:

- Distract Tim.
- Blame the System.
- Frame Frank.
- Measure risk.
- Learn what Tim knows.
- Pollute the timeline.
- Unlock or advance Sideline Tim.

---

## Frank’s Desk

Possible uses:

- Frame Frank.
- Plant evidence.
- Test Frank.
- Trigger Frank Retaliates.
- Create or avoid physical risk.

---

## Celia’s Area

Possible uses:

- Contain Celia.
- Apologize.
- Minimize damage.
- Risk making everything worse.
- Learn whether Celia knows.
- Delay confrontation.
- Attack Celia credibility, if the player goes dark.

---

## Break Room

Possible uses:

- Seed gossip.
- Use Devon.
- Frame Frank.
- Spread system confusion.
- Learn what rumors are active.
- Create indirect pressure.
- Unlock Sideline Tim lunch-related beats.

---

## Bathroom Hallway

Possible uses:

- Advance Sideline Tim.
- Create evidence of missing supplies.
- Connect Betty klepto scheme to Tim scheme.
- Increase Office Chaos or Management Escalates.

This scene should be used carefully because it has high tonal risk.

---

## Lisa’s Area

Possible uses:

- Learn management or policy risk.
- Blame Lisa for escalation.
- Redirect the incident toward process.
- Learn whether HR or leadership is involved.
- Trigger Management Escalates.

---

# Example Board State Before All-Hands

## Bars

- Frame Frank: 75%
- Warm Betty: 50%
- Distract Tim: 25%
- Contain Celia: 50%
- Blame the System: 25%
- Sideline Tim: 50%
- Tim Suspects You: 75%
- Celia Finds Out: 50%
- Frank Retaliates: 50%
- Betty Loses Trust: 25%
- Management Escalates: 50%

## Interpretation

The player has a working Frank plan and some Betty protection.

Tim is dangerous.

Celia is hurt but not fully armed.

Frank may take damage, but he may fight back.

The all-hands should feel unstable.

This is a strong messy ending state.

---

# Ending Philosophy

The ending should not simply ask:

> Did the player win?

The ending should ask:

> What story survived?

Possible ending tones:

- Clean survival.
- Messy survival.
- Public humiliation.
- Blame shifted, but trust destroyed.
- Frank destroyed, but Tim keeps digging.
- Betty protects the player, but realizes too late she was used.
- Celia does not expose the player, but never forgives them.
- Management focuses on policy, but the player’s reputation is damaged.
- The player survives the all-hands, but creates a worse future problem.
- The player wins tactically but becomes socially radioactive.
- The player loses publicly but preserves one important relationship.

---

# Core Design Summary

Office Panic is not a normal branching story.

It is a pressure system.

The player is not choosing paths.

The player is building believable lies, partial truths, emotional cover, and social escape routes under a deadline.

The progress bars are not decoration.

They are loaded weapons.

The green bars show what stories the player is building.

The red bars show who is starting to see through them.

The all-hands is where every story gets tested.