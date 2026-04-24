## NPC Stat Legends

Use `0–100` for all hidden NPC values.

### playerLikability
How positively this NPC feels toward the player.

- **0–10**: Actively hates you  
  Wants you to fail and may work against you on principle.

- **11–25**: Strongly dislikes you  
  Interprets your actions negatively and is unlikely to help.

- **26–40**: Cold / irritated  
  Tolerates you, but assumes bad intent faster.

- **41–60**: Neutral / baseline workplace tolerance  
  Normal office coexistence. Not an ally, not an enemy.

- **61–75**: Warm  
  More willing to listen, forgive, or give benefit of the doubt.

- **76–90**: Strongly favorable  
  Inclined to help, defend, or privately side with you.

- **91–100**: Deeply aligned  
  Very rare in prototype 1. Would protect you even under pressure.

### playerSuspicion
How much this NPC suspects the player is manipulating events, hiding something, or causing trouble.

- **0–10**: No suspicion  
  You are not on their radar.

- **11–25**: Mild notice  
  Small weirdness registered, but nothing solid.

- **26–40**: Wary  
  They are watching your behavior more carefully.

- **41–60**: Concerned  
  They think you may be part of the problem.

- **61–75**: Highly suspicious  
  They are actively interpreting your actions through a hostile lens.

- **76–90**: Convinced you are a problem  
  Likely to talk to others about you, resist you, or expose you.

- **91–100**: Locked on  
  In their mind, you are the incident.

### allianceStrength
How strong the bond is between two NPCs.

- **0–10**: No real bond  
  Barely connected.

- **11–25**: Loose association  
  They interact, but do not meaningfully influence each other.

- **26–40**: Familiar  
  Mild transfer potential, low loyalty.

- **41–60**: Work bond  
  Noticeable connection, some opinion transfer.

- **61–75**: Strong office alliance  
  They affect each other’s read of events and of the player.

- **76–90**: Tight bond  
  High opinion transfer, strong loyalty, difficult to break.

- **91–100**: Core pair  
  One of the strongest relationships in the office. Breaking it should take real setup.

### sentimentTransferStrength
How strongly one NPC’s opinion of the player affects another NPC.

- **0–10**: No transfer  
  They do not care what the other thinks.

- **11–25**: Rare transfer  
  Might matter only in specific cases.

- **26–40**: Light influence  
  Some bleed-over.

- **41–60**: Moderate influence  
  Opinions can noticeably spread.

- **61–75**: Strong influence  
  One person’s read of you significantly affects the other.

- **76–90**: Very strong influence  
  They often borrow each other’s opinion of you.

- **91–100**: Near-linked  
  One person’s trust or suspicion almost automatically colors the other.

### intelligence
Raw reasoning and problem-solving ability. Not the same as social skill.

- **0–25**: Poor reasoning  
  Misses patterns, easy to mislead.

- **26–50**: Below average  
  Can follow obvious things, misses subtler dynamics.

- **51–75**: Competent  
  Thinks clearly enough, not easy to embarrass with nonsense.

- **76–90**: Sharp  
  Good pattern recognition, harder to manipulate lazily.

- **91–100**: Exceptional  
  Rare. Should feel dangerous and hard to bullshit.

### socialAwareness
How well they read people, motives, tension, and tone.

- **0–25**: Oblivious  
  Misses subtext constantly.

- **26–50**: Inconsistent  
  Notices some things, misses others.

- **51–75**: Socially competent  
  Can read a room decently well.

- **76–90**: Highly perceptive  
  Notices pressure, manipulation, and insincerity.

- **91–100**: Razor-sharp  
  Very hard to socially deceive for long.

### gullibility
How easily they accept misleading framing, rumor, or partial truth.

- **0–25**: Very skeptical  
  Needs proof or firsthand confirmation.

- **26–50**: Cautious  
  Can be moved, but not cheaply.

- **51–75**: Suggestible  
  Can absorb social framing fairly easily.

- **76–90**: Highly gullible  
  Prone to believing the wrong version.

- **91–100**: Dangerously gullible  
  Almost a rumor accelerant by existence.

### gossipAppetite
How much they enjoy, spread, or gravitate toward drama and social information.

- **0–25**: Avoids gossip  
  Does not feed the machine much.

- **26–50**: Mild interest  
  Will listen, does not always amplify.

- **51–75**: Interested  
  Frequently engages with social information.

- **76–90**: Strong appetite  
  Loves the current thing, spreads readily.

- **91–100**: Predator  
  Seeks, shapes, and weaponizes gossip.

### ruleFollowing
How strongly they care about proper conduct, procedure, and norms.

- **0–25**: Disregards rules  
  Easy to pull into messy tactics.

- **26–50**: Flexible  
  Rules matter until they become inconvenient.

- **51–75**: Generally compliant  
  Prefers order and acceptable behavior.

- **76–90**: Strong rule follower  
  Will resist obviously dirty plays.

- **91–100**: Procedural extremist  
  Order matters almost more than outcomes.

### courage
How willing they are to confront, expose, act publicly, or stand in conflict.

- **0–25**: Avoidant  
  Freezes, retreats, or folds.

- **26–50**: Hesitant  
  Can act, but prefers safety.

- **51–75**: Solid  
  Will engage when needed.

- **76–90**: Bold  
  Will confront, challenge, or escalate.

- **91–100**: Fearless  
  Rare. Very dangerous in public scenes.

## Prototype Rules
- Most NPCs should start near the middle ranges, not the extremes.
- Values above `90` should feel special.
- Values below `10` should also feel special.
- Repetition alone should not guarantee success.
- Failed manipulation should be able to lower `playerLikability` or raise `playerSuspicion`.
- NPC opinions about the player can spread through alliances if transfer thresholds are met.