# Office Panic Demo — NPC Strategy Matrix v0.3

## Purpose

This document defines how each major NPC supports different player approaches in Office Panic.

Each NPC should support:

- Tactical identity.
- Location identity.
- Positive route.
- Underhanded route.
- Neutral route.
- Info route.
- Discovery route.
- Cleanup route.
- Commitment move.
- Backlash scene.
- Future target-role behavior.

The current prototype uses Celia as the email target.

Long-term, the email target may become configurable or randomizable. This document includes target-role notes for future-proofing, but the next implementation pass should keep Celia as the active target.

---

# Current Implementation Scope

For the next implementation pass, focus on:

- Discovery routes.
- Location identity.
- Unlocking choices through discovered routines.
- Making repeated visits feel less robotic.
- Preventing cleanup choices from becoming free consequence removal.
- Keeping Celia as the email subject.

Do not implement randomized email targets yet.

That belongs in a later story-system pass after the current Celia version feels solid.

---

# NPC Design Principles

## Each NPC Needs a Tactical Identity

Every NPC should have a clear gameplay purpose.

The player should understand why each person matters.

Examples:

- Betty is the emotional witness.
- Tim is the timeline threat.
- Frank is the scapegoat candidate.
- Celia is the injured party.
- Devon is the rumor amplifier.
- Lisa is the process threat.

---

## Each NPC Needs a Location Identity

NPCs should not only be dialogue menus.

They should be connected to locations, routines, and visibility.

A player should think:

- Betty might have seen who went into the kitchen.
- Tim may have notes, logs, or food routines.
- Frank’s empty desk may create an opportunity.
- Devon may spread whatever he hears in the break room.
- Lisa may know whether the all-hands agenda changed.
- Celia’s visibility tells the player whether the target knows enough to be dangerous.

Location identity makes discovery choices matter.

---

## Each NPC Should Support Multiple Approaches

The player should be able to:

- Build trust.
- Exploit weakness.
- Gather information.
- Discover routines.
- Stay neutral.
- Repair damage.
- Commit to a risky payoff.
- Trigger or avoid backlash.

---

## Each NPC Should Have a Backlash

If the player uses someone too aggressively, that person should eventually push back.

Backlash should feel earned, not random.

Examples:

- Betty realizes she was used.
- Tim asks a precise question.
- Frank realizes he is being framed.
- Celia gets the full message.
- Devon repeats the planted detail at the wrong time.
- Lisa starts documenting formally.

---

## Each NPC Should Be Able To Be The Target Later

This is future-facing.

The current prototype target is Celia.

Later, each NPC may need a target-role version:

- What happens if the email is about this person?
- What danger do they create as the injured party?
- What makes them sympathetic?
- What makes them dangerous?
- Which schemes become harder?
- Which schemes become more interesting?

This should be documented now but not implemented yet.

---

# Player-Facing Status Language

Internal state can use precise variable names.

Examples:

- `frameFrank`
- `warmBetty`
- `timSuspectsYou`
- `celiaFindsOut`
- `managementEscalates`

Player-facing language should feel more natural.

Prefer phrases like:

- Frank is becoming a believable scapegoat.
- Betty may defend you.
- Tim is building a timeline.
- Celia is hearing fragments.
- Lisa is making this formal.
- Devon is spreading the wrong version.
- Frank is on to you.

The UI should feel like the player is reading the room, not inspecting raw debug state.

---

# Betty

## Tactical Identity

Betty is the emotional witness.

She can humanize the player, defend the player, spread the wrong version, or expose the player’s manipulation.

Betty is useful because she is socially active and emotionally persuasive.

Betty is dangerous because betrayal hurts more when she was willing to help.

---

## Location Identity

Primary locations:

- Betty’s Desk.
- Kitchen visibility.
- Printer area.
- Break room edges.

Betty should often know who moved where.

She is useful as a witness because she notices people while pretending not to.

---

## Positive Route

Warm Betty.

The player makes Betty believe they are overwhelmed, remorseful, and scared rather than malicious.

Example choices:

- Tell Betty you feel sick about what happened.
- Ask Betty what the right thing to do is.
- Admit partial truth.
- Say you want to apologize but are afraid of making it worse.
- Give Betty one small truth so the larger lie has somewhere to hide.

Possible effects:

- Warm Betty +25%.
- Betty Loses Trust -25%, if already slightly raised.
- Celia Finds Out +25%, if Betty checks on Celia.
- Unlock a later request for Betty to defend the player.

---

## Underhanded Route

Betty Klepto.

The player makes Betty seem like someone who borrows, moves, or takes things.

Example choices:

- Mention that Betty borrowed something earlier.
- Suggest Betty may have moved office supplies.
- Link Betty to missing bathroom supplies.
- Place a harmless object near Betty’s desk.
- Let Betty become the explanation for something suspicious moving.

Possible effects:

- Betty Klepto +25%.
- Betty Loses Trust +25%.
- Warm Betty may decrease.
- Management Escalates +25%, if the missing item matters.

---

## Neutral Route

Keep the conversation shallow.

Example choices:

- Say you are trying to stay out of the gossip.
- Ask how her day is going.
- Pretend you do not know much yet.
- Leave before she asks a hard question.

Possible effects:

- Minimal bar movement.
- Costs one turn.
- Avoids immediate danger.
- May allow passive threats to advance elsewhere.

---

## Info Route

Learn what Betty knows.

Example choices:

- Ask whether Tim has been asking questions.
- Ask what Celia has heard.
- Ask whether Frank seemed strange.
- Ask whether Devon is spreading anything.

Possible effects:

- Reveals hidden state.
- Unlocks future choices.
- May increase Betty Loses Trust if too leading.

---

## Discovery Route

Learn what Betty notices.

Example choices:

- Ask whether she saw anyone go into the kitchen.
- Notice Betty watching the break room more than her screen.
- Ask whether Tim always labels his lunch like that.
- Ask whether Frank has been away from his desk much.

Possible discoveries:

- `knowsBettyWatchesKitchen`
- `bettyNoticesOfficeMovement`
- `bettyKnowsTimLunchRoutine`
- `bettySawFrankAway`

Purpose:

Betty can make location choices matter.

She is not only an emotional witness.

She is also an office-traffic witness.

---

## Cleanup Route

Repair Betty trust.

Example choices:

- Walk back a suspicious Frank comment.
- Admit you panicked and said too much.
- Tell Betty not to repeat something.
- Apologize for putting her in the middle.

Possible effects:

- Betty Loses Trust -25%.
- Frame Frank -25%, if related.
- Warm Betty +25%, if sincere enough.

Cleanup should not erase all damage for free.

If Betty trust improves, some story leverage should usually weaken.

---

## Commitment Move

Ask Betty to defend the player at the all-hands.

Requirements:

- Warm Betty >= 75%.
- Betty Loses Trust <= 50%.

Possible effects:

- Warm Betty reaches 100%.
- Betty becomes active in the finale.
- If Betty Loses Trust is high, this can backfire.

---

## Backlash Scene

Betty realizes she was used.

Trigger conditions:

- Betty Loses Trust >= 75%.
- Player used Betty as a witness for multiple lies.
- Betty hears contradictory versions from Tim, Celia, or Devon.
- Betty Klepto route has advanced too far.

Backlash outcome:

Betty refuses to defend the player.

At high severity, Betty exposes what the player told her privately.

---

## If Betty Is The Target

Future-use only.

Core danger:

- The player loses the easiest emotional defender.
- The office may turn sympathetic toward Betty.
- Tim may become more dangerous because of his bond with Betty.

Target behavior:

- Betty turns hurt into social energy.
- She may not have the cleanest facts, but she can make the room feel the injury.
- Her emotional credibility becomes the threat.

Routes that become harder:

- Warm Betty.
- Betty Klepto.
- Using Betty as a carrier.

Routes that become more interesting:

- Blame the System.
- Devon Leak.
- Tim distraction.
- Controlled apology.

---

# Tim

## Tactical Identity

Tim is the timeline threat.

He is procedural, anxious, and dangerous because he can turn social panic into evidence.

He is not scary because he is bold.

He is scary because he can accidentally become correct.

---

## Location Identity

Primary locations:

- Tim’s Desk.
- Printer.
- Kitchen / Fridge.
- Meeting prep area.

Tim’s mundane routines should matter.

This includes food, notes, logs, and desk timing.

---

## Positive Route

Cooperate with Tim.

The player gives Tim enough truth to appear credible while limiting exposure.

Example choices:

- Admit the recall partly failed.
- Ask Tim what he thinks happened.
- Give Tim one harmless true detail.
- Say you are trying to understand the timeline too.

Possible effects:

- Tim Suspects You may decrease.
- Blame the System may increase.
- Risk: Tim gets better information.

---

## Underhanded Route

Distract or sideline Tim.

The player either pollutes Tim’s timeline or physically/socially prevents him from controlling the all-hands.

Example choices:

- Ask Tim about recall logs.
- Suggest Devon forwarded the message.
- Mention Frank was away from his desk.
- Create lunch confusion after discovering Tim’s vulnerability.
- Keep Tim away from his notes.

Possible effects:

- Distract Tim +25%.
- Sideline Tim +25%.
- Tim Suspects You +25%.
- Management Escalates +25%, depending on severity.

---

## Neutral Route

Avoid Tim.

Example choices:

- Do not approach Tim.
- Say you do not know enough yet.
- Return to desk.
- Let Tim talk to someone else.

Possible effects:

- Costs one turn.
- Tim may continue investigating independently.
- Tim Suspects You may rise passively if other threats are high.

---

## Info Route

Learn what Tim knows.

Example choices:

- Ask whether the recall worked.
- Ask whether he knows who forwarded the email.
- Ask what time people saw the message.
- Ask whether he talked to Lisa.

Possible effects:

- Reveals Tim Suspects You.
- Unlocks Blame the System.
- Unlocks Distract Tim.
- May increase Tim Suspects You if too leading.

---

## Discovery Route

Learn Tim’s routines and vulnerabilities.

Example choices:

- Make boring small talk about his morning.
- Ask why he labels his lunch so aggressively.
- Put your lunch away and notice Tim’s labeled food.
- Notice Tim keeps meeting notes too carefully.

Possible discoveries:

- `sawTimLabeledFood`
- `learnedTimFoodVulnerability`
- `knowsTimLunchRoutine`
- `timHasNotes`
- `timChecksRecallLogs`

Purpose:

Tim’s most useful vulnerabilities should come from normal office friction, not obvious villain prompts.

The player should feel like they noticed an opportunity, not selected a sabotage command from a menu.

---

## Cleanup Route

Give Tim a boring explanation.

Example choices:

- Admit confusion about recall instead of pushing a person.
- Correct a previous timeline mistake.
- Stop blaming Frank if Tim is checking Frank.
- Give Tim a minor truth to reduce suspicion.

Possible effects:

- Tim Suspects You -25%.
- Distract Tim may decrease.
- Frame Frank may decrease.
- Blame the System may increase.

Cleanup should cost something.

If Tim is calmer because the player stops steering him, the false trail should weaken.

---

## Commitment Move

Send Tim fully down the wrong path or remove him from the meeting.

Requirements for Distract Tim:

- Distract Tim >= 75%.

Requirements for Sideline Tim:

- Sideline Tim >= 75%.
- Required discoveries for the sideline route are true.

Possible effects:

- Tim cannot cleanly expose the player.
- If the move fails, Tim becomes one of the most dangerous finale threats.

---

## Backlash Scene

Tim asks a precise question.

Trigger conditions:

- Tim Suspects You >= 75%.
- Player has changed stories.
- Tim has talked to Betty or Celia.
- Blame the System has failed.
- Sideline Tim has partially failed.

Backlash outcome:

Tim confronts the player with a clean contradiction.

If unresolved, Tim can expose the player at the all-hands.

---

## If Tim Is The Target

Future-use only.

Core danger:

- The injured party is also the timeline threat.
- Tim may turn hurt into documentation.
- Betty may protect him socially.

Target behavior:

- Tim becomes frightened, then procedural.
- He may not confront immediately, but he will compare details.
- If confirmed, he can build the cleanest case against the player.

Routes that become harder:

- Distract Tim.
- Sideline Tim.
- Blame the System, if Tim controls the facts.

Routes that become more interesting:

- Warm Betty as indirect containment.
- Devon Leak.
- Frank scapegoat.
- Controlled confession.

---

# Frank

## Tactical Identity

Frank is the scapegoat target.

He can absorb blame, but he can also retaliate hard.

Frank is useful because he can become plausible.

Frank is dangerous because he can become angry and formal.

---

## Location Identity

Primary locations:

- Frank’s Desk.
- HR / procedure zone.
- Conference room.
- Celia’s orbit.

Frank’s empty desk should matter.

If the player sees Frank away from his desk, later options can unlock.

---

## Positive Route

Ask Frank for help.

Example choices:

- Ask whether Frank saw the email.
- Admit things are getting bad.
- Ask Frank to keep an eye on Devon.
- Ask Frank what people are saying.

Possible effects:

- Frank Retaliates may decrease.
- Info gained.
- May lock or weaken Frame Frank.

---

## Underhanded Route

Frame Frank.

Example choices:

- Suggest Frank seemed unstable.
- Mention Frank was away from his desk.
- Plant or move evidence.
- Use Devon to spread Frank suspicion.
- Tell Tim Frank may have forwarded the email.

Possible effects:

- Frame Frank +25%.
- Frank Retaliates +25%.
- Tim Suspects You +25%, if sloppy.

---

## Neutral Route

Avoid Frank.

Example choices:

- Do not approach Frank.
- Stay away from his desk.
- Watch who talks to Frank.
- Let Frank remain uninvolved.

Possible effects:

- Costs one turn.
- Avoids retaliation.
- Frame Frank does not advance.

---

## Info Route

Learn Frank’s vulnerability.

Example choices:

- Ask Betty whether Frank has seemed off.
- Ask Devon whether Frank has been under pressure.
- Watch whether Frank returns to his desk.
- Learn whether Frank has tension with Celia.

Possible effects:

- Unlocks Frame Frank.
- May increase Frank Retaliates if too obvious.
- May reveal a safer path.

---

## Discovery Route

Learn whether Frank is physically or socially vulnerable.

Example choices:

- Check whether Frank is at his desk.
- Notice Frank left his bag unattended.
- Ask Lisa whether Frank is already dealing with another issue.
- Ask Devon whether Frank has been under pressure.

Possible discoveries:

- `sawFrankDeskEmpty`
- `frankAwayFromDesk`
- `knowsFrankUnderPressure`
- `knowsFrankTargetTension`
- `frankLeftBagOut`

Purpose:

The player should not be able to plant evidence or hard-frame Frank until there is enough setup.

---

## Cleanup Route

Stop the Frank rumor.

Example choices:

- Tell Betty you were wrong about Frank.
- Tell Devon not to repeat the Frank thing.
- Avoid planting evidence.
- Give Frank a harmless explanation.
- Ask Frank for help instead of pushing him.

Possible effects:

- Frank Retaliates -25%.
- Frame Frank -25%.
- Tim Suspects You -25%, if the player stops contradicting the timeline.
- Lock the most aggressive Frank commitment move.

---

## Commitment Move

Plant evidence or publicly point suspicion at Frank.

Requirements:

- Frame Frank >= 50%.
- Frank is away from desk or otherwise vulnerable.
- Tim Suspects You preferably below 75%.
- Relevant discovery is true.

Possible effects:

- Frame Frank +25%.
- Frank Retaliates +25%.
- Management Escalates +25%.
- Earn a possible all-hands accusation.

---

## Backlash Scene

Frank realizes he is being framed.

Trigger conditions:

- Frank Retaliates >= 75%.
- Frame Frank >= 50%.
- Devon or Betty repeats the suspicion to Frank.
- Tim questions Frank directly.

Backlash outcome:

Frank attacks the player publicly.

He may reveal the player was the first person steering suspicion.

---

## If Frank Is The Target

Future-use only.

Core danger:

- The injured party is defensive, formal, and retaliation-prone.
- Frank may move quickly toward procedure or accusation.

Target behavior:

- Frank does not melt down.
- Frank narrows the room.
- He may turn the incident into an HR-shaped weapon.

Routes that become harder:

- Frame Frank.
- Frank cleanup.
- Blame the System, if Frank demands documentation.

Routes that become more interesting:

- Warm Betty.
- Devon Leak.
- Lisa Overreacting.
- Distract Tim.

---

# Celia

## Tactical Identity

Celia is the current prototype target.

She is the injured party and emotional center of the incident.

If she has the full message and confidence, she can damage the player badly in the all-hands.

Long-term, her target role should become portable.

Celia-specific notes should remain useful when she is the target, but mechanics should eventually support target-based language.

---

## Location Identity

Primary locations:

- Celia’s Area.
- Frank’s orbit.
- Conference room.
- Bathroom hallway, if she is avoiding the room.

Celia’s visibility should matter.

If she is absent, that creates dread.

If she is present, the player has to manage what she can read from the room.

---

## Positive Route

Apologize or repair.

Example choices:

- Apologize early.
- Admit the email was wrong.
- Ask Celia if she wants space.
- Say you do not expect forgiveness.

Possible effects:

- Contain Celia +25%.
- Celia Finds Out may increase if apology is too specific.
- Warm Betty may improve if Betty hears about it.

---

## Underhanded Route

Make Celia seem dramatic, strategic, or misinformed.

This may eventually become a generic Target Dramatic scheme.

Example choices:

- Suggest Celia heard Devon’s version.
- Tell Tim Celia may not have full context.
- Suggest Celia is waiting for the all-hands.
- Tell Betty Celia may be reacting to fragments.

Possible effects:

- Celia Dramatic +25%.
- Celia Finds Out +25%.
- Betty Loses Trust +25%, if Betty sees cruelty.
- Management Escalates +25%, if it becomes victim-blaming.

---

## Neutral Route

Avoid Celia.

Example choices:

- Do not approach her.
- Watch who talks to her.
- Let Betty or Devon reach her first.
- Return to desk.

Possible effects:

- Costs one turn.
- Celia Finds Out may rise passively if Devon is active.
- Avoids immediate confrontation.

---

## Info Route

Learn what Celia knows.

Example choices:

- Ask whether she has heard anything weird.
- Ask Devon whether he talked to Celia.
- Ask Betty whether Celia is upset.
- Watch whether Celia has read the email.

Possible effects:

- Reveals Celia Finds Out.
- Unlocks Contain Celia.
- Unlocks Celia Dramatic.
- May increase danger if too obvious.

---

## Discovery Route

Learn Celia’s awareness state.

Example choices:

- Watch whether Celia checks her email.
- Ask Betty whether Celia seems upset.
- Ask Devon whether Celia has heard the rumor.
- Check whether Frank has talked to Celia.

Possible discoveries:

- `knowsCeliaHasNotSeenFullEmail`
- `celiaHeardFragments`
- `celiaHasFullEmail`
- `frankMayTellCelia`
- `devonMayTellCelia`

Purpose:

The player should know whether they are preventing discovery or managing fallout.

---

## Cleanup Route

Stop Celia from getting the worst version.

Example choices:

- Ask Devon not to talk to Celia.
- Tell Betty not to show Celia fragments.
- Admit enough to Celia to prevent rumor inflation.
- Clarify one false rumor without exposing all truth.

Possible effects:

- Celia Finds Out -25%, if not already too high.
- Contain Celia +25%.
- Devon Leak may decrease.

---

## Commitment Move

Direct apology, direct minimization, or direct credibility attack.

Requirements for apology:

- Contain Celia >= 25%.

Requirements for credibility attack:

- Celia Dramatic >= 50%.
- High risk.

Possible effects:

- Can stabilize Celia.
- Can backfire severely.
- Can define the emotional tone of the finale.

---

## Backlash Scene

Celia gets the full message.

Trigger conditions:

- Celia Finds Out >= 100%.
- Devon reaches Celia.
- Tim shows Celia the message.
- Player overexplains.
- Celia Dramatic route fails.

Backlash outcome:

Celia becomes the emotional center of the all-hands.

If the player attacked her credibility first, the backlash should be brutal.

---

## If Celia Is The Target

Current prototype behavior.

Core danger:

- Celia becomes the emotional and moral center of the all-hands.
- Her composure makes her anger more dangerous.

Target behavior:

- Celia tightens control.
- She does not need to be loud to dominate the room.
- If she gets the full message, vague softness fails hard.

Routes that become harder:

- Celia Dramatic.
- Vague apology.
- Soft spin.

Routes that become more interesting:

- Direct controlled apology.
- Blame the System.
- Devon Leak.
- Warm Betty.

---

# Devon

## Tactical Identity

Devon is the rumor and fact amplifier.

He is dangerous because what he says can carry social or technical weight.

Devon spreads, mutates, tests, and punctures stories.

He is useful because he carries stories.

He is dangerous because he does not stay controlled.

---

## Location Identity

Primary locations:

- Break Room.
- IT area.
- Printer / system-adjacent spaces.
- Hallway edges.

Devon should often function as a rumor thermometer.

He tells the player what version is moving through the office.

---

## Positive Route

Use Devon lightly without making him an enemy.

Example choices:

- Ask Devon what he has heard.
- Tell Devon not to spread anything.
- Ask Devon to slow down the gossip.
- Joke lightly to keep Devon friendly.

Possible effects:

- Info gained.
- Devon Leak may stay controlled.
- Risk: Devon spreads anyway.

---

## Underhanded Route

Make Devon the leak or use him as a rumor carrier.

Example choices:

- Feed Devon a controlled false detail.
- Suggest Frank has been acting strange.
- Suggest Lisa is escalating.
- Tell Devon not to spread something useful.
- Let Devon exaggerate the email.

Possible effects:

- Devon Leak +25%.
- Frame Frank +25%, if relevant.
- Blame the System +25%, if relevant.
- Celia Finds Out +25%, if Devon talks to Celia.

---

## Neutral Route

Do not engage Devon.

Example choices:

- Avoid the break room.
- Give Devon nothing.
- Pretend you are busy.
- Let Devon talk.

Possible effects:

- Costs one turn.
- Devon may still spread information passively.

---

## Info Route

Use Devon as a rumor thermometer.

Example choices:

- Ask who has seen the email.
- Ask whether Celia knows.
- Ask whether Tim has been asking questions.
- Ask whether Frank has heard anything.

Possible effects:

- Reveals multiple hidden states.
- May increase Devon Leak.
- May unlock new routes.

---

## Discovery Route

Learn how the rumor is moving.

Example choices:

- Ask Devon who said the weird version first.
- Ask whether he saw the email or only heard about it.
- Watch who Devon talks to after leaving the break room.
- Ask whether the system logs show anything weird.

Possible discoveries:

- `knowsDevonSawEmail`
- `devonHasPartialVersion`
- `devonCanCarryFalseDetail`
- `devonMayReachCelia`
- `devonCanSupportSystemConfusion`

Purpose:

Devon is a spread path and a distortion path.

He can support multiple schemes but is hard to control.

---

## Cleanup Route

Contain Devon.

Example choices:

- Tell Devon the rumor is wrong.
- Give Devon a boring version.
- Ask Devon not to drag Celia into it.
- Redirect Devon toward system confusion.

Possible effects:

- Celia Finds Out may decrease or stop rising.
- Devon Leak may decrease.
- Blame the System may increase.

---

## Commitment Move

Use Devon to spread a chosen narrative.

Requirements:

- Devon has already shown he will spread information.
- The player has selected a route to push.
- Devon suspicion is not too high.

Possible effects:

- Advances Frame Frank, Lisa Overreacting, Celia Dramatic, or Blame the System.
- Increases danger because Devon is hard to control.

---

## Backlash Scene

Devon repeats the wrong thing at the wrong time.

Trigger conditions:

- Devon Leak >= 75%.
- Player fed Devon a false detail.
- Celia Finds Out is rising.
- Tim is comparing stories.

Backlash outcome:

Devon exposes the player’s planted detail.

Tim and Celia may both become more dangerous.

---

## If Devon Is The Target

Future-use only.

Core danger:

- The injured party is detached, fact-sensitive, and hard to emotionally manipulate.
- Devon may expose sloppy logic instead of making an emotional appeal.

Target behavior:

- Devon watches before acting.
- If confirmed, he may calmly produce facts.
- He is less socially explosive than Betty, but harder to bullshit.

Routes that become harder:

- Devon Leak.
- Blame the System, if Devon can verify details.
- Emotional apology.

Routes that become more interesting:

- Warm Betty.
- Frame Frank.
- Lisa Overreacting.
- Controlled factual admission.

---

# Lisa

## Tactical Identity

Lisa is the policy/process threat and the player’s safest early formal ally.

She may not be emotionally central at first, but she can make the incident official.

Lisa can drag management, HR, or procedure into the crisis.

She is useful if treated with respect.

She is dangerous if she realizes she has been used.

---

## Location Identity

Primary locations:

- Lisa’s Area.
- Conference room.
- Management-adjacent spaces.
- Calendar / all-hands planning.

Lisa should be the player’s window into whether the office is becoming formal.

---

## Positive Route

Cooperate with Lisa.

Example choices:

- Ask Lisa what the all-hands will cover.
- Say you want to handle this correctly.
- Ask how to prevent the email from spreading further.
- Give Lisa a restrained version.

Possible effects:

- Management Escalates may decrease.
- Blame the System may increase.
- Risk: Lisa documents what the player says.

---

## Underhanded Route

Make Lisa look like she is overreacting or using the incident.

Example choices:

- Suggest Lisa is making this bigger.
- Tell Betty Lisa is escalating.
- Tell Devon Lisa wants this to become formal.
- Ask Tim why Lisa wants logs.
- Suggest Lisa has an agenda against Celia.

Possible effects:

- Lisa Overreacting +25%.
- Management Escalates may increase or redirect.
- Tim Suspects You may increase.

---

## Neutral Route

Avoid Lisa.

Example choices:

- Do not approach Lisa.
- Do not mention policy.
- Focus on interpersonal fallout.
- Stay away from management talk.

Possible effects:

- Costs one turn.
- Lisa may escalate passively if other threats are high.

---

## Info Route

Learn whether management is involved.

Example choices:

- Ask Lisa if the all-hands agenda changed.
- Ask whether HR knows.
- Ask whether management saw the email.
- Ask whether Tim gave her anything.

Possible effects:

- Reveals Management Escalates.
- Unlocks Blame the System.
- Unlocks Lisa Overreacting.

---

## Discovery Route

Learn the meeting pressure.

Example choices:

- Ask why the all-hands invite changed.
- Notice Lisa has the conference room calendar open.
- Ask whether Frank has been looped in.
- Ask whether management is asking for details.

Possible discoveries:

- `knowsLisaTalkedToManagement`
- `knowsAllHandsAgendaShifted`
- `knowsFrankMayFormalize`
- `knowsManagementPressure`
- `lisaCanDelayEscalation`

Purpose:

Lisa tells the player whether the situation is becoming official.

---

## Cleanup Route

Reduce formal risk.

Example choices:

- Give Lisa a boring, process-focused explanation.
- Stop blaming the system if it is attracting attention.
- Say you are handling it directly with Celia.
- Avoid creating a policy issue.
- Tell Lisa enough truth to preserve trust.

Possible effects:

- Management Escalates -25%.
- Blame the System may decrease.
- Contain Celia may increase.

Cleanup should cost leverage.

If Lisa calms down because the player stops pushing system blame, the system route should weaken.

---

## Commitment Move

Push the process/system angle through Lisa.

Requirements:

- Blame the System >= 50%.
- Lisa has shown interest in procedure.
- Lisa trust is not too low.

Possible effects:

- Blame the System +25%.
- Management Escalates +25%.
- Finale may focus on policy instead of personal blame.

---

## Backlash Scene

Lisa starts documenting.

Trigger conditions:

- Management Escalates >= 75%.
- Lisa Overreacting route has advanced.
- Player asks too many policy questions.
- Tim gives Lisa evidence.
- Lisa realizes the player used her trust.

Backlash outcome:

Lisa makes the issue official.

The player’s social strategy may no longer be enough.

---

## If Lisa Is The Target

Future-use only.

Core danger:

- The injured party is also the player’s safest early ally.
- The player loses a stabilizer and gains a formal/process threat.

Target behavior:

- Lisa may try to stay calm first.
- If betrayed, she becomes emotionally dangerous and process-aware.
- Her disappointment should hurt.

Routes that become harder:

- Lisa cooperation.
- Lisa Overreacting.
- Blame the System, if it looks like evasion.

Routes that become more interesting:

- Controlled confession.
- Warm Betty.
- Devon Leak.
- Frame Frank.