const bettyDesk = {
	id: 'betty_desk',
	location: 'Betty’s Desk',
	title: 'Betty’s desk is cheerful in a way that feels operational.',
	body: [
		'Betty’s desk has color-coded folders, seasonal decorations, three kinds of sticky notes, and one tiny ceramic pumpkin that has absolutely survived more office drama than HR.',
		'Nothing looks messy. That is the first warning. The candy dish is full, the pens are aligned, and the framed vacation photo is angled just enough to look casual. Betty has built a friendly little command center and disguised it as personality.',
		'From here, she can see the kitchen, the printer, the hallway bend near Lisa’s office, and most of the desks where people pretend they are not watching each other. It is not a desk. It is a lighthouse for gossip with ergonomic support.',
		'Betty herself is half-facing her monitor, half-facing the room, performing the ancient office ritual of looking busy while receiving emotional weather reports from six directions.',
	],
	internalThought: [
		'Betty wants to be included. Not asked. Included. There is a difference, and getting it wrong is how people become lunch conversation.',
		'She is friendly enough to help, bored enough to enjoy a mess, and socially sharp enough to notice when someone is handing her a mess with instructions.',
		'If you seem scared, she may soften. If you make her feel like an insider, she may talk. If you make her feel used, replaced, or stupid, she may become a problem with earrings.',
		'The desk matters. She can see movement. She can confirm who went where. She can also turn one worried glance into a rumor with legs, teeth, and a calendar invite.',
	],
	choices: [
		{
			id: 'betty_feel_awful',
			text: 'Tell Betty you feel awful and do not know what to do.',
			category: 'positive',
			once: true,
			resultText: 'Betty studies your face. She does not forgive you. But she does not leave either.',
			effects: {
				bars: {
					warmBetty: 25,
				},
				flags: {
					bettyHeardRemorse: true,
				},
				unlocks: [
					'betty_give_small_truth',
				],
				signal: 'Betty sees panic. Panic is not innocence, but it is better than calculation.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_give_small_truth',
			text: 'Give Betty one small truth so the bigger lie has somewhere to hide.',
			category: 'positive',
			once: true,
			requirements: {
				usedChoicesAll: [
					'betty_feel_awful',
				],
				barsMax: {
					bettyLosesTrust: 50,
				},
			},
			resultText: 'Betty listens because the truth sounds expensive. You give her just enough of it to buy credibility.',
			effects: {
				bars: {
					warmBetty: 25,
					celiaFindsOut: 25,
				},
				flags: {
					bettyHeardSmallTruth: true,
				},
				signal: 'Betty trusts you more, but the truth is now closer to Celia.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_ask_advice',
			text: 'Ask Betty what the right thing to do is, without asking her to fix it.',
			category: 'positive',
			once: true,
			requirements: {
				usedChoicesAll: [
					'betty_feel_awful',
				],
				barsMax: {
					bettyLosesTrust: 50,
				},
			},
			resultText: 'Betty gives advice instead of an escape route. Annoying. Also useful. Also probably healthier, which feels off-brand for today.',
			effects: {
				bars: {
					warmBetty: 25,
					containCelia: 25,
				},
				flags: {
					bettyGaveAdvice: true,
				},
				signal: 'Betty thinks you may still choose the decent route. Dangerous misunderstanding, potentially useful.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_discover_kitchen_watch',
			text: 'Ask whether she saw anyone go into the kitchen or break room.',
			category: 'info',
			once: true,
			resultText: 'Betty says Tim was near the fridge earlier, but Devon was hovering too. Betty notices more traffic than she admits.',
			effects: {
				flags: {
					knowsBettyWatchesKitchen: true,
					bettyNoticesOfficeMovement: true,
				},
				unlocks: [
					'betty_ask_who_moved_where',
					'create_tim_lunch_confusion',
				],
				signal: 'Betty watches office traffic. That makes her a witness, which is useful until it is not.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_ask_who_moved_where',
			text: 'Ask Betty who moved around after the email recall failed.',
			category: 'info',
			once: true,
			requirements: {
				flagsAll: [
					'knowsBettyWatchesKitchen',
				],
			},
			resultText: 'Betty remembers Frank leaving his desk and Devon drifting toward the break room. She says it casually, which is how useful facts sneak in.',
			effects: {
				flags: {
					bettySawFrankAway: true,
					sawFrankDeskEmpty: true,
				},
				bars: {
					frameFrank: 25,
				},
				unlocks: [
					'tim_mention_frank_away',
				],
				signal: 'Betty saw Frank away from his desk. The Frank story has a location now.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_ask_frank_strange',
			text: 'Ask Betty if Frank has seemed strange today.',
			category: 'underhanded',
			once: true,
			resultText: 'Betty frowns. Not because she believes you. Because now she has a shape to put her worry into.',
			effects: {
				bars: {
					frameFrank: 25,
					frankRetaliates: 25,
				},
				flags: {
					bettyHeardFrankSuspicion: true,
					knowsFrankUnderPressure: true,
				},
				unlocks: [
					'tim_mention_frank_away',
					'devon_frank_pressure',
				],
				signal: 'Frank has entered Betty’s mental suspect board. Tiny corkboard. Big problem.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_ask_tim_knows',
			text: 'Ask Betty why Tim is always so engaged with everyone’s business.',
			category: 'info',
			once: true,
			resultText: [
				'Betty’s desk looked aggressively tidy, like clutter had once disappointed her personally.',
				'“Betty, you seem like someone who returns a shopping cart even when no one’s watching.”',
				'“Correct,” she said. “There are two kinds of people: cart returners and people who make retail workers wonder why civilization bothered.”',
				'“Respect.” You kept your voice casual. “Relatedly, why is Tim always so… engaged? He asked why I was near the storage closet like I’d breached a perimeter.”',
				'Betty gave a loyal little smile. “He notices things. Too many things. He cares a lot and means well, which can be exhausting.”',
				'You nodded like this was research. “Frank called it weaponized helpfulness. I’m trying to keep it from becoming a committee.”',
				'Betty glanced toward the hallway. “He gets distracted when he’s buried. When he starts doing hallway surveillance, I ask Lisa to forward sales calls to him.”',
				'She smiled brightly. “Keeps him busy. Helpful, really. For everyone’s wellness.”',
			],
			effects: {
				bars: {
					distractTim: 25,
				},
				flags: {
					knowsTimInvestigating: true,
					knowsTimCanBeBuried: true,
				},
				unlocks: [
					'ask_tim_recall_logs',
				],
				signal: 'Tim can be redirected when he is buried in other people’s work. Weaponized helpfulness has an off switch.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_ask_tim_lunch',
			text: 'Ask why Tim labels everything in the fridge like it contains state secrets.',
			category: 'info',
			once: true,
			requirements: {
				flagsNone: [
					'knowsTimFoodVulnerability',
				],
			},
			resultText: [
				'Betty’s desk had the kind of seasonal cheer corporate approved in bulk.',
				'“Hey Betty, getting into anything crazy this weekend? Maybe a glass of wine, an episode of something British, lights out by 8:15?”',
				'“Excuse you,” she said. “8:40. I’m not in hospice.”',
				'You leaned against the cubicle like you were only passing through. “Fair. Speaking of controlled substances, why does Tim label everything in the fridge? His oat milk has more documentation than our onboarding.”',
				'Betty’s smile held, but only because it had training.',
				'“He’s careful. Also dramatic. But medically dramatic, so we call it compliance.”',
				'You nodded, professionally concerned. “Celia called it a hostile cooling environment.”',
				'Betty sighed. “Fine, but don’t say I told you. He’s extremely lactose intolerant. One dairy-adjacent mistake and the afternoon becomes a facilities issue.”',
				'You nodded again.',
				'Not paranoia. Containment.',
			],
			effects: {
				bars: {
					sidelineTim: 25,
				},
				flags: {
					knowsTimFoodVulnerability: true,
					knowsTimLunchRoutine: true,
					show_sidelineTim: true,
				},
				unlocks: [
					'create_tim_lunch_confusion',
				],
				signal: 'Tim’s fridge paranoia is medical, not theatrical. That makes the lunch route worse and more useful.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_missing_items_seed',
			text: 'Mention that small office things keep disappearing lately.',
			category: 'underhanded',
			once: true,
			requirements: {
				phaseMin: 'narrative_building',
			},
			resultText: 'Betty blinks like she is trying to remember whether she borrowed something. Useful. Ugly, but useful.',
			effects: {
				bars: {
					bettyKlepto: 25,
					bettyLosesTrust: 25,
				},
				flags: {
					show_bettyKlepto: true,
				},
				signal: 'The Betty-takes-things story has a pulse. Congratulations, gremlin.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_cleanup_frank',
			text: 'Walk back the Frank comment before Betty repeats it.',
			category: 'cleanup',
			once: true,
			requirements: {
				barsMin: {
					frameFrank: 25,
				},
			},
			resultText: 'You soften the Frank angle. Betty relaxes a fraction. The Frank route loses heat.',
			effects: {
				bars: {
					frameFrank: -25,
					frankRetaliates: -25,
					bettyLosesTrust: -25,
				},
				signal: 'You lowered the Frank temperature. Boring, responsible, annoyingly useful.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_commit_defend',
			text: 'Ask Betty to speak up for you at the all-hands.',
			category: 'commitment',
			once: true,
			requirements: {
				phaseMin: 'pressure_rising',
				barsMin: {
					warmBetty: 75,
				},
				barsMax: {
					bettyLosesTrust: 50,
				},
			},
			resultText: 'Betty hates that you asked. She hates more that she is considering it.',
			effects: {
				bars: {
					warmBetty: 25,
				},
				flags: {
					bettyWillDefend: true,
				},
				signal: 'Betty may defend you. Try not to visibly become worse as a person.',
			},
			nextScene: 'hub',
		},
	],
};

export default bettyDesk;