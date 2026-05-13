function getFrankStrategyFlags( strategy ) {
	return {
		frankStrategyTruth: strategy === 'truth',
		frankStrategyScheme: strategy === 'scheme',
		frankStrategyNeutral: strategy === 'neutral',
	};
}

function getFrankAngleFlags( selectedAngle ) {
	return Object.fromEntries(
		frankAngleFlagIds.map( ( angle ) => [ angle, angle === selectedAngle ] )
	);
}

function withFrankAngle( strategy, angle, requirements = {} ) {
	return {
		...requirements,
		flagsAll: [
			...( requirements.flagsAll || [] ),
			`frankStrategy${ strategy }`,
			angle,
		],
	};
}

const frankStrategyFlagIds = [
	'frankStrategyTruth',
	'frankStrategyScheme',
	'frankStrategyNeutral',
];

const frankAngleFlagIds = [
	'frankTruthKeepCalm',
	'frankTruthReduceSuspicion',
	'frankTruthAvoidRetaliation',
	'frankSchemeFrameFrank',
	'frankSchemePlantEvidence',
	'frankSchemePushOut',
	'frankNeutralObserve',
	'frankNeutralCheckDesk',
	'frankNeutralConfirmMovement',
];

const noFrankStrategySelected = {
	flagsNone: frankStrategyFlagIds,
};

const frankStrategySelected = {
	flagsAny: frankStrategyFlagIds,
};

const frankAngleSelected = {
	flagsAny: frankAngleFlagIds,
};

function frankStrategyNeedsAngle( strategy ) {
	return {
		flagsAll: [
			`frankStrategy${ strategy }`,
		],
		flagsNone: frankAngleFlagIds,
	};
}

const frankDesk = {
	id: 'frank_desk',
	location: 'Frank’s Desk',
	title: 'Frank’s desk is empty.',
	body: ( state ) => {
		const body = [
			'The chair is pushed in. His mug is still here. His desk has the private dullness of someone who never expected to become a plot device.',
			'The empty desk matters only if someone later has a reason to care that it was empty.',
		];

		if ( state.npc.frankMood === 'alert' ) {
			body.push( 'Frank’s drawer is closed too hard. The desk feels less unattended than it looks.' );
		}

		return body;
	},
	internalThought: [
		'If the bottle appears after people are already suspicious, it becomes evidence. If it appears before that, it becomes a mystery. Mysteries invite Tim. Tim is bad.',
	],
	choices: [
		{
			id: 'frank_strategy_truth',
			text: 'Strategy: Tell the truth.',
			category: 'positive',
			advanceTurn: false,
			requirements: noFrankStrategySelected,
			resultText: 'You decide Frank is safer as a person than as a target.',
			effects: {
				flags: getFrankStrategyFlags( 'truth' ),
				signal: 'Truth choices with Frank can keep him calm, reduce suspicion, and avoid retaliation.',
			},
		},
		{
			id: 'frank_strategy_scheme',
			text: 'Strategy: Scheme.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: noFrankStrategySelected,
			resultText: 'You decide Frank’s desk is less furniture than opportunity.',
			effects: {
				flags: getFrankStrategyFlags( 'scheme' ),
				signal: 'Scheme choices with Frank focus on framing, planting evidence, and moving Frank out of position.',
			},
		},
		{
			id: 'frank_strategy_neutral',
			text: 'Strategy: Stay neutral.',
			category: 'info',
			advanceTurn: false,
			requirements: noFrankStrategySelected,
			resultText: 'You decide to observe before touching the part of the day with fingerprints.',
			effects: {
				flags: getFrankStrategyFlags( 'neutral' ),
				signal: 'Neutral choices with Frank reveal his desk, access, and movement.',
			},
		},
		{
			id: 'frank_truth_angle_keep_calm',
			text: 'Choose angle: Keep Frank Calm.',
			category: 'positive',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getFrankAngleFlags( 'frankTruthKeepCalm' ),
				signal: 'Keep Frank Calm focuses on reducing his heat before it turns back on you.',
			},
		},
		{
			id: 'frank_truth_angle_reduce_suspicion',
			text: 'Choose angle: Reduce Suspicion.',
			category: 'positive',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getFrankAngleFlags( 'frankTruthReduceSuspicion' ),
				signal: 'Reduce Suspicion focuses on weakening the Frank story.',
			},
		},
		{
			id: 'frank_truth_angle_avoid_retaliation',
			text: 'Choose angle: Avoid Retaliation.',
			category: 'positive',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getFrankAngleFlags( 'frankTruthAvoidRetaliation' ),
				signal: 'Avoid Retaliation focuses on keeping Frank from pushing back.',
			},
		},
		{
			id: 'frank_scheme_angle_frame_frank',
			text: 'Choose angle: Frame Frank.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getFrankAngleFlags( 'frankSchemeFrameFrank' ),
				signal: 'Frame Frank focuses on turning desk details into suspicion.',
			},
		},
		{
			id: 'frank_scheme_angle_plant_evidence',
			text: 'Choose angle: Plant Evidence.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getFrankAngleFlags( 'frankSchemePlantEvidence' ),
				signal: 'Plant Evidence focuses on using the bottle as the decisive Frank step.',
			},
		},
		{
			id: 'frank_scheme_angle_push_out',
			text: 'Choose angle: Push Frank Out of Position.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getFrankAngleFlags( 'frankSchemePushOut' ),
				signal: 'Push Frank Out of Position focuses on keeping access plausible.',
			},
		},
		{
			id: 'frank_neutral_angle_observe',
			text: 'Choose angle: Observe Frank.',
			category: 'info',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getFrankAngleFlags( 'frankNeutralObserve' ),
				signal: 'Observe Frank focuses on his mood and whether he might retaliate.',
			},
		},
		{
			id: 'frank_neutral_angle_check_desk',
			text: 'Choose angle: Check His Desk.',
			category: 'info',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getFrankAngleFlags( 'frankNeutralCheckDesk' ),
				signal: 'Check His Desk focuses on access and unattended details.',
			},
		},
		{
			id: 'frank_neutral_angle_confirm_movement',
			text: 'Choose angle: Confirm His Movement.',
			category: 'info',
			advanceTurn: false,
			requirements: frankStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getFrankAngleFlags( 'frankNeutralConfirmMovement' ),
				signal: 'Confirm His Movement focuses on proving Frank is away.',
			},
		},
		{
			id: 'frank_watch_desk',
			text: 'Watch the desk long enough to confirm Frank is away.',
			category: 'info',
			once: true,
			requirements: withFrankAngle( 'Neutral', 'frankNeutralConfirmMovement' ),
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
			requirements: withFrankAngle( 'Neutral', 'frankNeutralCheckDesk', {
				flagsAll: [
					'sawFrankDeskEmpty',
				],
			} ),
			resultText: 'The bag is not evidence. It is an invitation to become the kind of person who calls opportunity evidence.',
			effects: {
				flags: {
					frankLeftBagOut: true,
				},
				bars: {
					frameFrank: 10,
				},
				signal: 'Frank left something unattended. The Frank route gained texture and risk.',
			},
			nextScene: 'hub',
		},
		{
			id: 'plant_bottle_frank',
			text: 'Plant the bottle in Frank’s drawer.',
			category: 'commitment',
			requirements: withFrankAngle( 'Scheme', 'frankSchemePlantEvidence', {
				phaseMin: 'narrative_building',
				factsAll: [
					'playerHasBottle',
					'confirmedFrankAway',
					'sawFrankDeskEmpty',
				],
				factsNone: [
					'bottlePlantedFrank',
				],
				npc: {
					frankAwayFromDesk: true,
				},
				usedChoicesNone: [
					'frank_ask_for_help',
				],
			} ),
			once: true,
			resultText: [
				'The bottle fits too easily.',
				'Frank is away, you have access, and now the drawer has something ugly for people to find.',
				'A good lie should resist a little. This one slides into place like the office has been saving room for it.',
			],
			effects: {
				bars: {
					frameFrank: 50,
					frankRetaliates: 25,
					managementEscalates: 25,
				},
				facts: {
					bottlePlantedFrank: true,
				},
				flags: {
					officeChatterStarted: true,
					frankHeardRumor: true,
				},
				npc: {
					frankMood: 'alert',
				},
				hiddenEvents: [
					'frank_bottle_planted_offscreen_ripple',
				],
				unsetFacts: [
					'playerHasBottle',
				],
				locks: [
					'frank_ask_for_help',
				],
				queueVisibleAftermath: [
					'frank_bottle_planted_lisa_notice',
					'frank_drawer_slams',
				],
				signal: 'The bottle is planted. The Frank story has moved from gossip to something people can point at.',
			},
		},
		{
			id: 'frank_ask_for_help',
			text: 'Find Frank and ask what he has heard.',
			category: 'positive',
			once: true,
			requirements: withFrankAngle( 'Truth', 'frankTruthKeepCalm', {
				usedChoicesNone: [
					'plant_bottle_frank',
				],
			} ),
			resultText: 'Frank is irritated, but not hostile. That helps. It also steals oxygen from the version of the story where Frank is your perfect scapegoat.',
			effects: {
				bars: {
					frankRetaliates: -25,
					timSuspectsYou: -25,
					frameFrank: -20,
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
			requirements: withFrankAngle( 'Truth', 'frankTruthAvoidRetaliation', {
				usedChoicesAll: [
					'frank_ask_for_help',
				],
				barsMin: {
					frameFrank: 25,
				},
				usedChoicesNone: [
					'plant_bottle_frank',
				],
			} ),
			resultText: 'Frank accepts the friendly tone. Tim may not. There is something suspicious about standing beside a fire while holding a cup of water and a book of matches.',
			effects: {
				bars: {
					frankRetaliates: -20,
					frameFrank: -20,
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
			requirements: withFrankAngle( 'Scheme', 'frankSchemePushOut' ),
			resultText: 'You leave the desk untouched. For once, restraint does not make a dramatic sound.',
			effects: {
				signal: 'You backed away from Frank’s desk. The opportunity remains, for better or worse.',
			},
			nextScene: 'hub',
		},
		{
			id: 'frank_strategy_think_again',
			text: 'Think again.',
			category: 'info',
			advanceTurn: false,
			requirements: frankStrategySelected,
			resultText: 'You reconsider before Frank becomes either an ally or a headline.',
			effects: {
				flags: {
					frankStrategyTruth: false,
					frankStrategyScheme: false,
					frankStrategyNeutral: false,
					...getFrankAngleFlags(),
				},
				signal: 'You reconsider your approach with Frank.',
			},
		},
		{
			id: 'frank_choose_different_angle',
			text: 'Choose a different angle.',
			category: 'info',
			advanceTurn: false,
			requirements: frankAngleSelected,
			resultText: 'You keep the same approach with Frank, but change what you are trying to prove.',
			effects: {
				flags: getFrankAngleFlags(),
				signal: 'You choose a different Frank angle.',
			},
		},
	],
};

export default frankDesk;
