const supplyCloset = {
	id: 'supply_closet',
	location: 'Supply Closet',
	title: 'The supply closet is where office dignity goes to be stored in bulk.',
	body: ( state ) => {
		const body = [
			'The closet smells like cardboard, toner, and decisions no one wants to explain to procurement.',
			'A metal shelf leans slightly under printer paper, cleaning wipes, and the abandoned dreams of ergonomic reform.',
		];

		if ( state.facts.closetToiletPaperMissing ) {
			body.push( 'The toilet paper shelf is now aggressively empty. Empty shelves have a way of becoming questions with witnesses.' );
		} else if ( state.facts.closetToiletPaperReduced ) {
			body.push( 'The stack of toilet paper is smaller than it was. Not gone. Just reduced enough to make you aware of inventory as a moral category.' );
		} else if ( state.facts.closetToiletPaperSeen ) {
			body.push( 'A few rolls of toilet paper sit behind a sad box of printer toner. They are boring, useful, and somehow now part of strategy.' );
		}

		return body;
	},
	internalThought: ( state ) => {
		const thoughts = [
			'This is not a glamorous room. That is why it is dangerous. Boring rooms hold practical leverage.',
		];

		if ( state.facts.closetToiletPaperSeen && ! state.facts.closetToiletPaperMissing && ! state.facts.closetToiletPaperReduced ) {
			thoughts.push( 'One roll is subtle. All the rolls is a cry for help with inventory consequences.' );
		}

		if ( state.facts.closetToiletPaperMissing ) {
			thoughts.push( 'The backup supply is gone. If the bathroom becomes a problem now, the problem has nowhere soft to land.' );
		}

		return thoughts;
	},
	choices: [
		{
			id: 'inspect_closet_shelves',
			text: 'Inspect the storage shelves.',
			category: 'info',
			advanceTurn: false,
			once: true,
			requirements: {
				factsNone: [
					'closetToiletPaperSeen',
					'closetToiletPaperReduced',
					'closetToiletPaperMissing',
				],
			},
			resultText: [
				'You check behind the printer paper and find a few rolls of toilet paper stacked behind a sad box of toner.',
				'It is not hidden exactly.',
				'It is just stored with the confidence that no adult would weaponize it.',
			],
			effects: {
				facts: {
					closetToiletPaperSeen: true,
				},
				signal: 'The supply closet has backup toilet paper. Congratulations, you found the least dignified lever in the building.',
			},
		},
		{
			id: 'take_one_closet_roll',
			text: 'Take one roll of toilet paper.',
			category: 'underhanded',
			once: true,
			requirements: {
				factsAll: [
					'closetToiletPaperSeen',
				],
				factsNone: [
					'closetToiletPaperReduced',
					'closetToiletPaperMissing',
				],
			},
			resultText: [
				'You take one roll and slide it into your bag.',
				'It is small enough to be plausible and dumb enough to be suspicious if discovered.',
				'The closet remains quiet. Coward.',
			],
			effects: {
				facts: {
					playerHasToiletPaperRoll: true,
					closetToiletPaperReduced: true,
				},
				hiddenEvents: [
					'closet_roll_taken_unseen',
				],
				bars: {
					bettyKlepto: 25,
				},
				queueVisibleAftermath: [
					'closet_one_roll_taken',
				],
				signal: 'You took one roll from the supply closet. Tiny chaos acquired.',
			},
		},
		{
			id: 'take_all_closet_rolls',
			text: 'Take all the backup rolls.',
			category: 'underhanded',
			once: true,
			requirements: {
				factsAll: [
					'closetToiletPaperSeen',
				],
				factsNone: [
					'closetToiletPaperReduced',
					'closetToiletPaperMissing',
				],
			},
			resultText: [
				'You take all the rolls.',
				'There is no elegant version of this.',
				'The shelf is empty now, and the office has moved one step closer to becoming a facilities-themed hostage situation.',
			],
			effects: {
				facts: {
					playerHasToiletPaperCache: true,
					closetToiletPaperMissing: true,
					bathroomSuppliesMissing: true,
				},
				hiddenEvents: [
					'closet_toilet_paper_missing',
					'lisa_may_connect_missing_supplies',
				],
				bars: {
					bettyKlepto: 25,
					managementEscalates: 25,
				},
				unlocks: [
					'blame_betty_supplies',
					'tim_nudge_lunch',
				],
				queueVisibleAftermath: [
					'closet_all_rolls_taken',
				],
				signal: 'The backup toilet paper is gone. This is either leverage or a cry for help with plot structure.',
			},
		},
		{
			id: 'closet_leave_supplies_alone',
			text: 'Leave the supplies alone.',
			category: 'neutral',
			advanceTurn: false,
			once: true,
			resultText: 'You leave the supplies alone. For one bright second, civilization holds.',
			effects: {
				signal: 'You did not steal from the supply closet. Somewhere, a facilities manager does not know they owe you nothing.',
			},
			nextScene: 'hub',
		},
	],
};

export default supplyCloset;