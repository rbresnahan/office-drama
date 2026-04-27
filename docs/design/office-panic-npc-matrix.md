# Office Panic Demo — NPC Strategy Matrix v0.1

## Purpose

This document defines how each major NPC supports different player approaches.

Each NPC should support:

- Positive route.
- Underhanded route.
- Neutral route.
- Info route.
- Cleanup route.
- Commitment move.
- Backlash scene.

This keeps scenes flexible and prevents every interaction from becoming a single-purpose branch.

---

# NPC Design Principles

## Each NPC Should Have a Tactical Identity

Every NPC needs a clear function in the pressure system.

The player should understand why each person matters.

## Each NPC Should Support Multiple Approaches

The player should be able to:

- Build trust.
- Exploit weakness.
- Gather information.
- Stay neutral.
- Repair damage.
- Commit to a risky payoff.

## Each NPC Should Have a Backlash

If the player uses someone too aggressively, that person should eventually push back.

The world should not sit there politely while the player turns the office into a haunted spreadsheet.

---

# Betty

## Tactical Identity

Betty is the emotional witness.

She can humanize the player, defend the player, or expose the player’s manipulation.

Betty is useful because she is socially trusted.

Betty is dangerous because betrayal hurts more when she was willing to help.

---

## Positive Route

Warm Betty.

The player makes Betty believe they are overwhelmed, remorseful, and scared rather than malicious.

### Example Choices

- Tell Betty you feel sick about what happened.
- Ask Betty what the right thing to do is.
- Admit partial truth.
- Say you want to apologize but are afraid of making it worse.

### Possible Effects

- Warm Betty +25%.
- Betty Loses Trust -25%, if already slightly raised.
- Celia Finds Out +25%, if Betty checks on Celia.

---

## Underhanded Route

Betty Klepto.

The player makes Betty seem like someone who borrows, moves, or takes things.

### Example Choices

- Mention that Betty borrowed something earlier.
- Suggest Betty may have moved office supplies.
- Link Betty to missing bathroom supplies.
- Place a harmless object near Betty’s desk.

### Possible Effects

- Betty Klepto +25%.
- Betty Loses Trust +25%.
- Warm Betty may decrease.
- Management Escalates +25%, if the missing item matters.

---

## Neutral Route

Keep the conversation shallow.

The player avoids giving Betty anything useful.

### Example Choices

- Say you are trying to stay out of the gossip.
- Ask how her day is going.
- Pretend you do not know much yet.
- Leave before she asks a hard question.

### Possible Effects

- Minimal bar movement.
- Costs one turn.
- May avoid immediate danger.

---

## Info Route

Learn what Betty knows.

### Example Choices

- Ask whether Tim has been asking questions.
- Ask what Celia has heard.
- Ask whether Frank seemed strange.
- Ask whether Devon is spreading anything.

### Possible Effects

- Reveals hidden bar state.
- Unlocks future choices.
- May increase Betty Loses Trust if too leading.

---

## Cleanup Route

Repair Betty trust.

### Example Choices

- Walk back a suspicious Frank comment.
- Admit you panicked and said too much.
- Tell Betty not to repeat something.
- Apologize for putting her in the middle.

### Possible Effects

- Betty Loses Trust -25%.
- Frame Frank -25%, if related.
- Warm Betty +25%, if sincere enough.

---

## Commitment Move

Ask Betty to defend the player at the all-hands.

### Requirements

- Warm Betty >= 75%.
- Betty Loses Trust <= 50%.

### Possible Effects

- Warm Betty reaches 100%.
- Betty becomes active in the finale.
- If Betty Loses Trust is high, this can backfire.

---

## Backlash Scene

Betty realizes she was used.

### Trigger Conditions

- Betty Loses Trust >= 75%.
- Player has used Betty as a witness for multiple lies.
- Betty hears contradictory versions from Tim, Celia, or Devon.
- Betty Klepto route has advanced too far.

### Backlash Outcome

Betty refuses to defend the player.

At high severity, Betty exposes what the player told her privately.

---

# Tim

## Tactical Identity

Tim is the timeline threat.

He is procedural, observant, and dangerous because he can turn social panic into evidence.

---

## Positive Route

Cooperate with Tim.

The player gives Tim enough truth to appear credible while limiting exposure.

### Example Choices

- Admit the recall partly failed.
- Ask Tim what he thinks happened.
- Give Tim one harmless true detail.
- Say you are trying to understand the timeline too.

### Possible Effects

- Tim Suspects You may decrease.
- Blame the System may increase.
- Risk: Tim gets better information.

---

## Underhanded Route

Distract or sideline Tim.

The player either pollutes Tim’s timeline or physically/socially prevents him from controlling the all-hands.

### Example Choices

- Ask Tim about recall logs.
- Suggest Devon forwarded the message.
- Mention Frank was away from his desk.
- Create lunch confusion after discovering Tim’s vulnerability.
- Keep Tim away from his notes.

### Possible Effects

- Distract Tim +25%.
- Sideline Tim +25%.
- Tim Suspects You +25%.
- Management Escalates +25%, depending on severity.

---

## Neutral Route

Avoid Tim.

### Example Choices

- Do not approach Tim.
- Say you do not know enough yet.
- Return to desk.
- Let Tim talk to someone else.

### Possible Effects

- Costs one turn.
- Tim may continue investigating independently.
- Tim Suspects You may rise passively if other bars are high.

---

## Info Route

Learn what Tim knows.

### Example Choices

- Ask whether the recall worked.
- Ask whether he knows who forwarded the email.
- Ask what time people saw the message.
- Ask whether he talked to Lisa.

### Possible Effects

- Reveals Tim Suspects You.
- Unlocks Blame the System.
- Unlocks Distract Tim.
- May increase Tim Suspects You if too leading.

---

## Cleanup Route

Give Tim a boring explanation.

### Example Choices

- Admit confusion about recall instead of pushing a person.
- Correct a previous timeline mistake.
- Stop blaming Frank if Tim is checking Frank.
- Give Tim a minor truth to reduce suspicion.

### Possible Effects

- Tim Suspects You -25%.
- Distract Tim may decrease.
- Frame Frank may decrease.

---

## Commitment Move

Send Tim fully down the wrong path or remove him from the meeting.

### Requirements

For Distract Tim:

- Distract Tim >= 75%.

For Sideline Tim:

- Sideline Tim >= 75%.

### Possible Effects

- Tim cannot cleanly expose the player.
- If the move fails, Tim becomes one of the most dangerous finale threats.

---

## Backlash Scene

Tim asks a precise question.

### Trigger Conditions

- Tim Suspects You >= 75%.
- Player has changed stories.
- Tim has talked to Betty or Celia.
- Blame the System has failed.
- Sideline Tim has partially failed.

### Backlash Outcome

Tim confronts the player with a clean contradiction.

If unresolved, Tim can expose the player at the all-hands.

---

# Frank

## Tactical Identity

Frank is the scapegoat target.

He can absorb blame, but he can also retaliate hard.

Frank is useful because he can become plausible.

Frank is dangerous because he can become angry.

---

## Positive Route

Ask Frank for help.

### Example Choices

- Ask whether Frank saw the email.
- Admit things are getting bad.
- Ask Frank to keep an eye on Devon.
- Ask Frank what people are saying.

### Possible Effects

- Frank Retaliates may decrease.
- Info gained.
- May lock or weaken Frame Frank.

---

## Underhanded Route

Frame Frank.

### Example Choices

- Suggest Frank seemed unstable.
- Mention Frank was away from his desk.
- Plant or move evidence.
- Use Devon to spread Frank suspicion.
- Tell Tim Frank may have forwarded the email.

### Possible Effects

- Frame Frank +25%.
- Frank Retaliates +25%.
- Tim Suspects You +25%, if sloppy.

---

## Neutral Route

Avoid Frank.

### Example Choices

- Do not approach Frank.
- Stay away from his desk.
- Watch who talks to Frank.
- Let Frank remain uninvolved.

### Possible Effects

- Costs one turn.
- Avoids retaliation.
- Frame Frank does not advance.

---

## Info Route

Learn Frank’s vulnerability.

### Example Choices

- Ask Betty whether Frank has seemed off.
- Ask Devon whether Frank has been under pressure.
- Watch whether Frank returns to his desk.
- Learn whether Frank has tension with Celia.

### Possible Effects

- Unlocks Frame Frank.
- May increase Frank Retaliates if too obvious.
- May reveal a safer path.

---

## Cleanup Route

Stop the Frank rumor.

### Example Choices

- Tell Betty you were wrong about Frank.
- Tell Devon not to repeat the Frank thing.
- Avoid planting evidence.
- Give Frank a harmless explanation.

### Possible Effects

- Frank Retaliates -25%.
- Frame Frank -25%.
- Betty Loses Trust may decrease.

---

## Commitment Move

Plant evidence or publicly point suspicion at Frank.

### Requirements

- Frame Frank >= 50%.
- Frank away from desk or otherwise vulnerable.
- Tim Suspects You preferably below 75%.

### Possible Effects

- Frame Frank +25%.
- Frank Retaliates +25%.
- Management Escalates +25%.

---

## Backlash Scene

Frank realizes he is being framed.

### Trigger Conditions

- Frank Retaliates >= 75%.
- Frame Frank >= 50%.
- Devon or Betty repeats the suspicion to Frank.
- Tim questions Frank directly.

### Backlash Outcome

Frank attacks the player publicly.

He may reveal the player was the first person steering suspicion.

---

# Celia

## Tactical Identity

Celia is the injured party.

She is the emotional center of the incident.

If she has the full message and confidence, she can destroy the player in the all-hands.

---

## Positive Route

Apologize or repair.

### Example Choices

- Apologize early.
- Admit the email was wrong.
- Ask Celia if she wants space.
- Say you do not expect forgiveness.

### Possible Effects

- Contain Celia +25%.
- Celia Finds Out may increase if apology is too specific.
- Warm Betty may improve if Betty hears about it.

---

## Underhanded Route

Make Celia seem dramatic, strategic, or misinformed.

### Example Choices

- Suggest Celia heard Devon’s version.
- Tell Tim Celia may not have full context.
- Suggest Celia is waiting for the all-hands.
- Tell Betty Celia may be reacting to fragments.

### Possible Effects

- Celia Dramatic +25%.
- Celia Finds Out +25%.
- Betty Loses Trust +25%, if Betty sees cruelty.
- Management Escalates +25%, if it becomes victim-blaming.

---

## Neutral Route

Avoid Celia.

### Example Choices

- Do not approach her.
- Watch who talks to her.
- Let Betty or Devon reach her first.
- Return to desk.

### Possible Effects

- Costs one turn.
- Celia Finds Out may rise passively if Devon is active.
- Avoids immediate confrontation.

---

## Info Route

Learn what Celia knows.

### Example Choices

- Ask whether she has heard anything weird.
- Ask Devon whether he talked to Celia.
- Ask Betty whether Celia is upset.
- Watch whether Celia has read the email.

### Possible Effects

- Reveals Celia Finds Out.
- Unlocks Contain Celia.
- Unlocks Celia Dramatic.
- May increase danger if too obvious.

---

## Cleanup Route

Stop Celia from getting the worst version.

### Example Choices

- Ask Devon not to talk to Celia.
- Tell Betty not to show Celia fragments.
- Admit enough to Celia to prevent rumor inflation.
- Clarify one false rumor without exposing all truth.

### Possible Effects

- Celia Finds Out -25%, if not already too high.
- Contain Celia +25%.
- Devon Leak may decrease.

---

## Commitment Move

Direct apology, direct minimization, or direct credibility attack.

### Requirements

For apology:

- Contain Celia >= 25%.

For credibility attack:

- Celia Dramatic >= 50%.
- High risk.

### Possible Effects

- Can stabilize Celia.
- Can backfire severely.
- Can define the emotional tone of the finale.

---

## Backlash Scene

Celia gets the full message.

### Trigger Conditions

- Celia Finds Out >= 100%.
- Devon reaches Celia.
- Tim shows Celia the message.
- Player overexplains.
- Celia Dramatic route fails.

### Backlash Outcome

Celia becomes the emotional center of the all-hands.

If the player attacked her credibility first, the backlash should be brutal.

---

# Devon

## Tactical Identity

Devon is the gossip amplifier.

Devon spreads, mutates, and tests rumors.

He is useful because he carries stories.

He is dangerous because he does not stay controlled.

---

## Positive Route

Use Devon lightly without making him an enemy.

### Example Choices

- Ask Devon what he has heard.
- Tell Devon not to spread anything.
- Ask Devon to slow down the gossip.
- Joke lightly to keep Devon friendly.

### Possible Effects

- Info gained.
- Devon Leak may stay controlled.
- Risk: Devon spreads anyway.

---

## Underhanded Route

Make Devon the leak or use him as a rumor carrier.

### Example Choices

- Feed Devon a controlled false detail.
- Suggest Frank has been acting strange.
- Suggest Lisa is escalating.
- Tell Devon not to spread something useful.
- Let Devon exaggerate the email.

### Possible Effects

- Devon Leak +25%.
- Frame Frank +25%, if relevant.
- Blame the System +25%, if relevant.
- Celia Finds Out +25%, if Devon talks to Celia.

---

## Neutral Route

Do not engage Devon.

### Example Choices

- Avoid the break room.
- Give Devon nothing.
- Pretend you are busy.
- Let Devon talk.

### Possible Effects

- Costs one turn.
- Devon may still spread information passively.

---

## Info Route

Use Devon as a rumor thermometer.

### Example Choices

- Ask who has seen the email.
- Ask whether Celia knows.
- Ask whether Tim has been asking questions.
- Ask whether Frank has heard anything.

### Possible Effects

- Reveals multiple hidden states.
- May increase Devon Leak.
- May unlock new routes.

---

## Cleanup Route

Contain Devon.

### Example Choices

- Tell Devon the rumor is wrong.
- Give Devon a boring version.
- Ask Devon not to drag Celia into it.
- Redirect Devon toward system confusion.

### Possible Effects

- Celia Finds Out may decrease or stop rising.
- Devon Leak may decrease.
- Blame the System may increase.

---

## Commitment Move

Use Devon to spread a chosen narrative.

### Requirements

- Devon has already shown he will spread information.
- The player has selected a route to push.

### Possible Effects

- Advances Frame Frank, Lisa Overreacting, Celia Dramatic, or Blame the System.
- Increases danger because Devon is hard to control.

---

## Backlash Scene

Devon repeats the wrong thing at the wrong time.

### Trigger Conditions

- Devon Leak >= 75%.
- Player fed Devon a false detail.
- Celia Finds Out is rising.
- Tim is comparing stories.

### Backlash Outcome

Devon exposes the player’s planted detail.

Tim and Celia may both become more dangerous.

---

# Lisa

## Tactical Identity

Lisa is the policy/process threat.

She may not be emotionally central, but she can make the incident official.

Lisa can drag management, HR, or procedure into the crisis.

---

## Positive Route

Cooperate with Lisa.

### Example Choices

- Ask Lisa what the all-hands will cover.
- Say you want to handle this correctly.
- Ask how to prevent the email from spreading further.
- Give Lisa a restrained version.

### Possible Effects

- Management Escalates may decrease.
- Blame the System may increase.
- Risk: Lisa documents what the player says.

---

## Underhanded Route

Make Lisa look like she is overreacting or using the incident.

### Example Choices

- Suggest Lisa is making this bigger.
- Tell Betty Lisa is escalating.
- Tell Devon Lisa wants this to become formal.
- Ask Tim why Lisa wants logs.
- Suggest Lisa has an agenda against Celia.

### Possible Effects

- Lisa Overreacting +25%.
- Management Escalates may increase or redirect.
- Tim Suspects You may increase.

---

## Neutral Route

Avoid Lisa.

### Example Choices

- Do not approach Lisa.
- Do not mention policy.
- Focus on interpersonal fallout.
- Stay away from management talk.

### Possible Effects

- Costs one turn.
- Lisa may escalate passively if other bars are high.

---

## Info Route

Learn whether management is involved.

### Example Choices

- Ask Lisa if the all-hands agenda changed.
- Ask whether HR knows.
- Ask whether management saw the email.
- Ask whether Tim gave her anything.

### Possible Effects

- Reveals Management Escalates.
- Unlocks Blame the System.
- Unlocks Lisa Overreacting.

---

## Cleanup Route

Reduce formal risk.

### Example Choices

- Give Lisa a boring, process-focused explanation.
- Stop blaming the system if it is attracting attention.
- Say you are handling it directly with Celia.
- Avoid creating a policy issue.

### Possible Effects

- Management Escalates -25%.
- Blame the System may decrease.
- Contain Celia may increase.

---

## Commitment Move

Push the process/system angle through Lisa.

### Requirements

- Blame the System >= 50%.
- Lisa has shown interest in procedure.

### Possible Effects

- Blame the System +25%.
- Management Escalates +25%.
- Finale may focus on policy instead of personal blame.

---

## Backlash Scene

Lisa starts documenting.

### Trigger Conditions

- Management Escalates >= 75%.
- Lisa Overreacting route has advanced.
- Player asks too many policy questions.
- Tim gives Lisa evidence.

### Backlash Outcome

Lisa makes the issue official.

The player’s social strategy may no longer be enough.