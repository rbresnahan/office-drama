const bathroomHallway = {
	id: 'bathroom_hallway',
	location: 'Bathroom Hallway',
	title: 'The bathroom hallway is quiet in a way that feels legally inadvisable.',
	body: ( state ) => {
		const body = [
			'The supply cabinet is slightly open. The bathroom door swings shut with a soft institutional click.',
		];

		if ( state.facts.bathroomSuppliesMissing ) {
			body.push( 'The cabinet is no longer reassuring. It has the hollow look of a place that knows it cannot solve the next problem.' );
		} else if ( state.facts.bathroomSuppliesKnown ) {
			body.push( 'You now know exactly where the backups are. Knowledge really does want to become a bad decision today.' );
		}

		return body;
	},
	internalThought: [
		'This is where petty office strategy starts smelling like actual misconduct. Useful? Maybe. Gross? Absolutely.',
	],
	choices: [
		{
			id: 'bathroom_check_supplies',
			text: 'Inspect the stall and supply cabinet.',
			category: 'info',
			advanceTurn: false,
			once: true,
			requirements: {
				factsNone: [
					'bathroomSuppliesKnown',
					'bathroomSuppliesMissing',
				],
			},
			resultText: [
				'The bathroom has one roll in active service and backup supplies in the hallway cabinet.',
				'The situation is stable.',
				'Stable situations hate you today.',
			],
			effects: {
				facts: {
					bathroomSuppliesKnown: true,
				},
				signal: 'Bathroom supplies are available. This knowledge is cursed.',
			},
		},
		{
			id: 'remove_bathroom_supplies',
			text: 'Remove the bathroom backup supplies before Tim eats.',
			category: 'underhanded',
			requirements: {
				phaseMin: 'narrative_building',
				phaseMax: 'pressure_rising',
				factsAll: [
					'bathroomSuppliesKnown',
					'knowsTimFoodVulnerability',
					'timLunchCompromised',
				],
				factsNone: [
					'bathroomSuppliesMissing',
				],
			},
			once: true,
			resultText: 'The hallway remains quiet. That makes it worse. Quiet hallways are where consequences take notes.',
			effects: {
				bars: {
					sidelineTim: 25,
					managementEscalates: 25,
					bettyKlepto: 25,
				},
				facts: {
					bathroomSuppliesMissing: true,
				},
				hiddenEvents: [
					'bathroom_user_finds_missing_supplies',
					'lisa_may_connect_missing_supplies',
				],
				unlocks: [
					'blame_betty_supplies',
					'tim_nudge_lunch',
				],
				queueVisibleAftermath: [
					'bathroom_supplies_removed',
				],
				signal: 'Bathroom supplies are missing. Tim’s future has narrowed.',
			},
		},
		{
			id: 'blame_betty_supplies',
			text: 'Let the missing supplies point toward Betty’s “borrowing” habit.',
			category: 'underhanded',
			once: true,
			requirements: {
				factsAll: [
					'bathroomSuppliesMissing',
				],
				barsMin: {
					bettyKlepto: 50,
				},
			},
			resultText: 'The missing supplies now have a possible author. It is not a good author, but it is not you.',
			effects: {
				bars: {
					bettyKlepto: 25,
					bettyLosesTrust: 25,
					managementEscalates: 25,
				},
				hiddenEvents: [
					'betty_may_be_tied_to_missing_supplies',
				],
				signal: 'Betty can now be tied to missing supplies. This is layered awful. Structurally sound, morally condemned.',
			},
			nextScene: 'hub',
		},
		{
			id: 'bathroom_walk_away',
			text: 'Walk away and do not become the bathroom villain.',
			category: 'neutral',
			once: true,
			resultText: 'You walk away. Somewhere, a tiny remaining adult inside you gives a weak thumbs-up.',
			effects: {
				signal: 'You avoided the bathroom scheme. A rare win for basic decency.',
			},
			nextScene: 'hub',
		},
	],
};

export default bathroomHallway;