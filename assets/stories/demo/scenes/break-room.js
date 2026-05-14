function getBreakRoomStrategyFlags( strategy ) {
	return {
		breakRoomStrategyTruth: strategy === 'truth',
		breakRoomStrategyScheme: strategy === 'scheme',
		breakRoomStrategyNeutral: strategy === 'neutral',
	};
}

function getBreakRoomAngleFlags( selectedAngle ) {
	return Object.fromEntries(
		breakRoomAngleFlagIds.map( ( angle ) => [ angle, angle === selectedAngle ] )
	);
}

function withBreakRoomAngle( strategy, angle, requirements = {} ) {
	return {
		...requirements,
		flagsAll: [
			...( requirements.flagsAll || [] ),
			`breakRoomStrategy${ strategy }`,
			angle,
		],
	};
}

const breakRoomStrategyFlagIds = [
	'breakRoomStrategyTruth',
	'breakRoomStrategyScheme',
	'breakRoomStrategyNeutral',
];

const breakRoomAngleFlagIds = [
	'breakRoomTruthAvoidRumor',
	'breakRoomTruthContainDamage',
	'breakRoomSchemeSpreadFrank',
	'breakRoomSchemeUseDevon',
	'breakRoomSchemeUseBottle',
	'breakRoomNeutralInspectRoom',
	'breakRoomNeutralWatchMovement',
	'breakRoomNeutralGatherChatter',
];

const noBreakRoomStrategySelected = {
	flagsNone: breakRoomStrategyFlagIds,
};

const breakRoomStrategySelected = {
	flagsAny: breakRoomStrategyFlagIds,
};

const breakRoomAngleSelected = {
	flagsAny: breakRoomAngleFlagIds,
};

function breakRoomStrategyNeedsAngle( strategy ) {
	return {
		flagsAll: [
			`breakRoomStrategy${ strategy }`,
		],
		flagsNone: breakRoomAngleFlagIds,
	};
}

const breakRoom = {
	id: 'break_room',
	location: 'Break Room',
	title: 'The break room is where facts go to get microwaved.',
	body: ( state ) => {
		const body = [
			'Devon is here, stirring coffee like he is auditioning for the role of Person Who Knows Too Much.',
			'The fridge hums with the dead-eyed neutrality of an appliance that has seen crimes.',
		];

		if ( state.facts.kitchenBottleMissing ) {
			body.push( 'The top of the fridge looks weirdly clean now. That is not normally a sentence with tactical consequences, yet here everyone is.' );
		} else if ( state.facts.kitchenBottleSeen ) {
			body.push( 'Now that you know where to look, the half-pint bottle on top of the fridge feels less hidden and more like it is daring you to become worse.' );
		}

		if ( state.flags.kitchenFeelsOff ) {
			body.push( 'Someone has noticed the kitchen is not exactly how they left it.' );
		}

		return body;
	},
	internalThought: ( state ) => {
		const thoughts = [
			'Anything you say near Devon may travel. That is dangerous. That is also useful. Office gossip: nature’s cursed delivery network.',
		];

		if ( state.facts.playerHasBottle ) {
			thoughts.push( 'The bottle is no longer office scenery. It is now your problem, which is traditionally how evidence becomes exciting and stupid.' );
		} else if ( state.facts.kitchenBottleSeen ) {
			thoughts.push( 'The bottle is real, reachable, and inappropriate enough to become a story if someone points at it correctly.' );
		}

		return thoughts;
	},
	choices: [
		{
			id: 'break_room_strategy_truth',
			text: 'Strategy: Tell the truth.',
			category: 'positive',
			advanceTurn: false,
			requirements: noBreakRoomStrategySelected,
			resultText: 'You decide the break room needs less rumor, which is adorable and possibly useful.',
			effects: {
				flags: getBreakRoomStrategyFlags( 'truth' ),
				signal: 'Truth choices in the break room can slow rumor spread and contain damage.',
			},
		},
		{
			id: 'break_room_strategy_scheme',
			text: 'Strategy: Scheme.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: noBreakRoomStrategySelected,
			resultText: 'You decide the break room can distribute a story faster than any calendar invite.',
			effects: {
				flags: getBreakRoomStrategyFlags( 'scheme' ),
				signal: 'Scheme choices in the break room use Devon, the Frank story, or the bottle.',
			},
		},
		{
			id: 'break_room_strategy_neutral',
			text: 'Strategy: Stay neutral.',
			category: 'info',
			advanceTurn: false,
			requirements: noBreakRoomStrategySelected,
			resultText: 'You decide to inspect the room before becoming the thing it talks about.',
			effects: {
				flags: getBreakRoomStrategyFlags( 'neutral' ),
				signal: 'Neutral choices in the break room reveal the room, office movement, and chatter.',
			},
		},
		{
			id: 'break_room_truth_angle_avoid_rumor',
			text: 'Choose angle: Avoid Rumor Spread.',
			category: 'positive',
			advanceTurn: false,
			requirements: breakRoomStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getBreakRoomAngleFlags( 'breakRoomTruthAvoidRumor' ),
				signal: 'Avoid Rumor Spread focuses on keeping Devon boring.',
			},
		},
		{
			id: 'break_room_truth_angle_contain_damage',
			text: 'Choose angle: Contain Damage.',
			category: 'positive',
			advanceTurn: false,
			requirements: breakRoomStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getBreakRoomAngleFlags( 'breakRoomTruthContainDamage' ),
				signal: 'Contain Damage focuses on giving the rumor less fuel.',
			},
		},
		{
			id: 'break_room_scheme_angle_spread_frank',
			text: 'Choose angle: Spread Frank Story.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: breakRoomStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getBreakRoomAngleFlags( 'breakRoomSchemeSpreadFrank' ),
				signal: 'Spread Frank Story focuses on pushing Frank suspicion through chatter.',
			},
		},
		{
			id: 'break_room_scheme_angle_use_devon',
			text: 'Choose angle: Use Devon as Chatter.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: breakRoomStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getBreakRoomAngleFlags( 'breakRoomSchemeUseDevon' ),
				signal: 'Use Devon as Chatter focuses on rumor testing and controlled leaks.',
			},
		},
		{
			id: 'break_room_scheme_angle_use_bottle',
			text: 'Choose angle: Take / Use Bottle.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: breakRoomStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getBreakRoomAngleFlags( 'breakRoomSchemeUseBottle' ),
				signal: 'Take / Use Bottle focuses on turning scenery into evidence.',
			},
		},
		{
			id: 'break_room_neutral_angle_inspect',
			text: 'Choose angle: Inspect Room.',
			category: 'info',
			advanceTurn: false,
			requirements: breakRoomStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getBreakRoomAngleFlags( 'breakRoomNeutralInspectRoom' ),
				signal: 'Inspect Room focuses on what is physically available.',
			},
		},
		{
			id: 'break_room_neutral_angle_watch_movement',
			text: 'Choose angle: Watch Office Movement.',
			category: 'info',
			advanceTurn: false,
			requirements: breakRoomStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getBreakRoomAngleFlags( 'breakRoomNeutralWatchMovement' ),
				signal: 'Watch Office Movement focuses on where Devon goes next.',
			},
		},
		{
			id: 'break_room_neutral_angle_gather_chatter',
			text: 'Choose angle: Gather Chatter.',
			category: 'info',
			advanceTurn: false,
			requirements: breakRoomStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getBreakRoomAngleFlags( 'breakRoomNeutralGatherChatter' ),
				signal: 'Gather Chatter focuses on what Devon knows and how rumor is moving.',
			},
		},
		{
			id: 'inspect_break_room_fridge',
			text: 'Inspect the top of the fridge.',
			category: 'info',
			once: true,
			requirements: withBreakRoomAngle( 'Neutral', 'breakRoomNeutralInspectRoom', {
				factsNone: [
					'kitchenBottleSeen',
					'kitchenBottleMissing',
				],
			} ),
			resultText: [
				'You look past the motivational mug nobody uses and the dusty stack of paper plates.',
				'Tucked on top of the fridge is a small half-pint bottle of cheap brown liquor.',
				'It is hidden just well enough to prove someone meant to hide it, and badly enough to prove this office hires optimists.',
			],
			effects: {
				facts: {
					kitchenBottleSeen: true,
				},
				signal: 'You found a bottle on top of the break room fridge. It is not evidence yet. It is opportunity pretending to be glass.',
			},
		},
		{
			id: 'take_kitchen_bottle',
			text: 'Take the bottle from the top of the fridge.',
			category: 'underhanded',
			once: true,
			requirements: withBreakRoomAngle( 'Scheme', 'breakRoomSchemeUseBottle', {
				factsAll: [
					'kitchenBottleSeen',
				],
				factsNone: [
					'playerHasBottle',
					'kitchenBottleMissing',
				],
			} ),
			resultText: [
				'You take the bottle and slide it into your bag.',
				'It makes the smallest possible glass sound against your keys.',
				'Naturally, that sounds deafening.',
			],
			effects: {
				facts: {
					playerHasBottle: true,
					kitchenBottleMissing: true,
				},
				flags: {
					kitchenFeelsOff: true,
				},
				hiddenEvents: [
					'celia_may_have_seen_bottle_bag',
				],
				bars: {
					managementEscalates: 25,
				},
				queueVisibleAftermath: [
					'kitchen_bottle_taken_celia_bag',
					'kitchen_bottle_missing',
				],
				signal: 'The bottle is in your bag. Useful, suspicious, and still waiting for a story to attach itself to.',
			},
		},
		{
			id: 'devon_ask_who_saw',
			text: 'Ask Devon who has seen the email.',
			category: 'info',
			once: true,
			requirements: withBreakRoomAngle( 'Neutral', 'breakRoomNeutralGatherChatter' ),
			resultText: 'Devon smiles too quickly. He has seen enough to be useful and enough to be a problem.',
			effects: {
				bars: {
					devonLeak: 25,
					celiaFindsOut: 25,
				},
				flags: {
					knowsDevonSawEmail: true,
					show_devonLeak: true,
				},
				signal: 'Devon has part of the email. Parts become stories. Stories become fires.',
			},
			nextScene: 'hub',
		},
		{
			id: 'devon_saw_or_heard',
			text: 'Ask whether Devon actually saw the email or only heard about it.',
			category: 'info',
			once: true,
			requirements: withBreakRoomAngle( 'Neutral', 'breakRoomNeutralGatherChatter' ),
			resultText: 'Devon saw a fragment and heard the rest from someone else. That is not truth. That is rumor starter dough.',
			effects: {
				bars: {
					devonLeak: 25,
				},
				flags: {
					devonHasPartialVersion: true,
					devonCanCarryFalseDetail: true,
					devonCanSupportSystemConfusion: true,
					show_devonLeak: true,
				},
				unlocks: [
					'devon_false_detail',
					'celia_people_exaggerating',
				],
				signal: 'Devon has a partial version. Partial versions are where lies rent office space.',
			},
			nextScene: 'hub',
		},
		{
			id: 'devon_watch_after_leaving',
			text: 'Watch who Devon talks to after leaving the break room.',
			category: 'info',
			once: true,
			requirements: withBreakRoomAngle( 'Neutral', 'breakRoomNeutralWatchMovement', {
				barsMin: {
					devonLeak: 25,
				},
			} ),
			resultText: 'Devon drifts toward Celia’s side of the office. He moves like a man carrying a lit match and calling it news.',
			effects: {
				bars: {
					celiaFindsOut: 25,
				},
				flags: {
					devonMayReachCelia: true,
				},
				signal: 'Devon may reach Celia. Rumor now has legs and terrible shoes.',
			},
			nextScene: 'hub',
		},
		{
			id: 'devon_frank_pressure',
			text: 'Quietly mention that Frank has been under pressure lately.',
			category: 'underhanded',
			once: true,
			requirements: withBreakRoomAngle( 'Scheme', 'breakRoomSchemeSpreadFrank', {
				barsMin: {
					frameFrank: 25,
				},
			} ),
			resultText: 'Devon does not promise to repeat it. Which is how Devon promises to repeat it.',
			effects: {
				bars: {
					frameFrank: 25,
					devonLeak: 25,
					managementEscalates: 10,
				},
				flags: {
					devonCarryingFrankStory: true,
					officeChatterStarted: true,
				},
				hiddenEvents: [
					'devon_spreads_frank_story',
				],
				queueVisibleAftermath: [
					'devon_frank_story_travels',
					'printer_chatter_frank',
				],
				signal: 'Devon now carries the Frank story. Handle with tongs.',
			},
			nextScene: 'hub',
		},
		{
			id: 'create_tim_lunch_confusion',
			text: 'Create confusion around Tim’s carefully labeled lunch.',
			category: 'underhanded',
			requirements: withBreakRoomAngle( 'Scheme', 'breakRoomSchemeUseDevon', {
				phaseMin: 'narrative_building',
				phaseMax: 'pressure_rising',
				flagsAll: [
					'knowsTimFoodVulnerability',
				],
			} ),
			once: true,
			resultText: 'The fridge becomes a small bureaucratic disaster. Tim’s lunch situation is no longer clean.',
			effects: {
				bars: {
					sidelineTim: 25,
					timSuspectsYou: 25,
				},
				npc: {
					timLunchCompromised: true,
				},
				flags: {
					timLunchCompromised: true,
				},
				unlocks: [
					'remove_bathroom_supplies',
				],
				signal: 'Tim’s lunch is compromised. This is exactly as classy as it sounds.',
			},
			nextScene: 'hub',
		},
		{
			id: 'devon_false_detail',
			text: 'Feed Devon one controlled false detail and see where it appears.',
			category: 'underhanded',
			once: true,
			requirements: withBreakRoomAngle( 'Scheme', 'breakRoomSchemeUseDevon', {
				flagsAll: [
					'devonCanCarryFalseDetail',
				],
			} ),
			resultText: 'Devon accepts the detail with the solemnity of a man receiving a cursed heirloom.',
			effects: {
				bars: {
					devonLeak: 25,
					distractTim: 25,
					timSuspectsYou: 25,
				},
				flags: {
					devonHasFalseDetail: true,
					show_devonLeak: true,
				},
				signal: 'Devon is now a rumor test. Unfortunately, the test is also airborne.',
			},
			nextScene: 'hub',
		},
		{
			id: 'devon_contain_rumor',
			text: 'Give Devon a boring version to slow the rumor down.',
			category: 'cleanup',
			once: true,
			requirements: withBreakRoomAngle( 'Truth', 'breakRoomTruthContainDamage', {
				barsMin: {
					devonLeak: 25,
				},
			} ),
			resultText: 'Devon hates the boring version, which is how you know it might work. The rumor loses flavor, not velocity.',
			effects: {
				bars: {
					devonLeak: -25,
					celiaFindsOut: -25,
					blameSystem: 25,
				},
				signal: 'You bored Devon on purpose. A dark art, but a useful one.',
			},
			nextScene: 'hub',
		},
		{
			id: 'devon_spread_final_frank',
			text: 'Use Devon to push the final Frank rumor.',
			category: 'commitment',
			requirements: withBreakRoomAngle( 'Scheme', 'breakRoomSchemeSpreadFrank', {
				phaseMin: 'pressure_rising',
				barsMin: {
					frameFrank: 50,
					devonLeak: 25,
				},
			} ),
			once: true,
			resultText: 'Devon walks away with a version of the story that has your fingerprints and his volume.',
			effects: {
				bars: {
					frameFrank: 35,
					devonLeak: 25,
					managementEscalates: 25,
				},
				flags: {
					officeChatterStarted: true,
					devonSpreadFrankStory: true,
				},
				hiddenEvents: [
					'devon_spreads_frank_story',
				],
				queueVisibleAftermath: [
					'printer_chatter_frank',
				],
				signal: 'The Frank story is now traveling without supervision. Bold. Horrifying.',
			},
			nextScene: 'hub',
		},
		{
			id: 'break_room_strategy_think_again',
			text: 'Think again.',
			category: 'info',
			advanceTurn: false,
			requirements: breakRoomStrategySelected,
			resultText: 'You reconsider before the break room turns your plan into communal property.',
			effects: {
				flags: {
					breakRoomStrategyTruth: false,
					breakRoomStrategyScheme: false,
					breakRoomStrategyNeutral: false,
					...getBreakRoomAngleFlags(),
				},
				signal: 'You reconsider your break room approach.',
			},
		},
		{
			id: 'break_room_choose_different_angle',
			text: 'Choose a different angle.',
			category: 'info',
			advanceTurn: false,
			requirements: breakRoomAngleSelected,
			resultText: 'You keep the same break room approach, but change what you are trying to move through it.',
			effects: {
				flags: getBreakRoomAngleFlags(),
				signal: 'You choose a different break room angle.',
			},
		},
	],
};

export default breakRoom;
