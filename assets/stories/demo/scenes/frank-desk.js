const frankDesk = {
	id: 'frank_desk',
	location: 'Frank’s Desk',
	title: 'Frank’s desk is empty.',
	body: [
		'The chair is pushed in. His mug is still here. His desk has the private dullness of someone who never expected to become a plot device.',
		'The empty desk matters only if someone later has a reason to care that it was empty.',
	],
	internalThought: [
		'If the bottle appears after people are already suspicious, it becomes evidence. If it appears before that, it becomes a mystery. Mysteries invite Tim. Tim is bad.',
	],
	choices: [
		{
			id: 'frank_watch_desk',
			text: 'Watch the desk long enough to confirm Frank is away.',
			category: 'info',
			once: true,
			resultText: 'Frank does not come back. Opportunity arrives wearing cheap office carpet.',
			effects: {
				npc: {
					frankAwayFromDesk: true,
				},
				flags: {
					frankAwayFromDesk: true,
					confirmedFrankAway: true,
					sawFrankDeskEmpty: true,
				},
				signal: 'Frank is away from his desk. That is access, not a story. Access only becomes useful once people have a reason to look at him.',
			},
			nextScene: 'hub',
		},
		{
			id: 'frank_notice_bag',
			text: 'Notice Frank left his bag half-open beside the desk.',
			category: 'info',
			once: true,
			requirements: {
				flagsAll: [
					'sawFrankDeskEmpty',
				],
			},
			resultText: 'The bag is not evidence. It is an invitation to become the kind of person who calls opportunity evidence.',
			effects: {
				flags: {
					frankLeftBagOut: true,
				},
				bars: {
					frameFrank: 25,
					frankRetaliates: 25,
				},
				signal: 'Frank left something unattended. The Frank route gained texture and risk.',
			},
			nextScene: 'hub',
		},
		{
			id: 'plant_bottle_frank',
			text: 'Plant the bottle in Frank’s drawer.',
			category: 'commitment',
			requirements: {
				phaseMin: 'narrative_building',
				barsMin: {
					frameFrank: 50,
				},
				factsAll: [
					'playerHasBottle',
					'confirmedFrankAway',
					'sawFrankDeskEmpty',
				],
				factsNone: [
					'bottlePlantedFrank',
				],
				flagsAny: [
					'bettySawFrankAway',
					'bettyHeardFrankSuspicion',
					'knowsFrankUnderPressure',
					'timCheckingFrank',
					'devonCarryingFrankStory',
				],
				npc: {
					frankAwayFromDesk: true,
				},
				usedChoicesNone: [
					'frank_ask_for_help',
				],
			},
			once: true,
			resultText: [
				'The bottle fits too easily.',
				'Frank is away, people already have a Frank-shaped worry, and now the drawer has something ugly for that worry to orbit.',
				'A good lie should resist a little. This one slides into place like the office has been saving room for it.',
			],
			effects: {
				bars: {
					frameFrank: 25,
					frankRetaliates: 25,
					managementEscalates: 25,
				},
				facts: {
					bottlePlantedFrank: true,
				},
				hiddenEvents: [
					'frank_bottle_planted_offscreen_ripple',
				],
				unsetFacts: [
					'playerHasBottle',
				],
				unlocks: [
					'tell_tim_about_franks_desk',
					'devon_discover_bottle',
				],
				locks: [
					'frank_ask_for_help',
				],
				queueVisibleAftermath: [
					'frank_bottle_planted_lisa_notice',
				],
				signal: 'The bottle is planted. The Frank story has moved from gossip to something people can point at.',
			},
		},
		{
			id: 'frank_ask_for_help',
			text: 'Find Frank and ask what he has heard.',
			category: 'positive',
			once: true,
			requirements: {
				usedChoicesNone: [
					'plant_bottle_frank',
				],
			},
			resultText: 'Frank is irritated, but not hostile. That helps. It also steals oxygen from the version of the story where Frank is your perfect scapegoat.',
			effects: {
				bars: {
					frankRetaliates: -25,
					timSuspectsYou: -25,
					frameFrank: -25,
				},
				flags: {
					frankTalkedHonestly: true,
				},
				locks: [
					'plant_bottle_frank',
				],
				signal: 'You cooled Frank down, but the Frank-frame story weakened. No free lunch, office goblin.',
			},
			nextScene: 'hub',
		},
		{
			id: 'frank_keep_close',
			text: 'Keep Frank friendly while his name keeps circulating.',
			category: 'cleanup',
			once: true,
			requirements: {
				usedChoicesAll: [
					'frank_ask_for_help',
				],
				barsMin: {
					frameFrank: 25,
				},
				usedChoicesNone: [
					'plant_bottle_frank',
				],
			},
			resultText: 'Frank accepts the friendly tone. Tim may not. There is something suspicious about standing beside a fire while holding a cup of water and a book of matches.',
			effects: {
				bars: {
					frankRetaliates: -25,
					frameFrank: -25,
					timSuspectsYou: 25,
				},
				signal: 'Frank cools down, but Tim notices the shape of the contradiction.',
			},
			nextScene: 'hub',
		},
		{
			id: 'frank_walk_away',
			text: 'Walk away and seed suspicion elsewhere first.',
			category: 'neutral',
			once: true,
			resultText: 'You leave the desk untouched. For once, restraint does not make a dramatic sound.',
			effects: {
				signal: 'You backed away from Frank’s desk. The opportunity remains, for better or worse.',
			},
			nextScene: 'hub',
		},
	],
};

export default frankDesk;
