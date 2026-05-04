const hub = {
	id: 'hub',
	location: 'Open Office Floor',
	kicker: 'Choose Your Next Move',
	title: 'The bad email was about Celia.',
	body: [
		'You sent a damaging gossip email about Celia. The recall only partly worked.',
		'Some people may have seen the whole thing. Some may have seen fragments. Some only know that something ugly happened, which is sometimes worse because imagination gets overtime pay.',
		'Betty keeps glancing up. Tim is doing quiet math with his face. Frank is somewhere between annoyed and unaware. Celia has not looked at you yet. Devon is probably already narrating this to someone.',
	],
	internalThought: ( state ) => {
		const thoughts = [];

		if ( state.bars.frameFrank >= 50 ) {
			thoughts.push( 'The Frank story has shape now. One more strong push could make people start interpreting his normal behavior as suspicious.' );
		} else {
			thoughts.push( 'Frank is available as a target, but nobody has enough reason to look at him yet.' );
		}

		if ( state.bars.warmBetty >= 50 ) {
			thoughts.push( 'Betty might help you, but only if she still believes you are scared instead of strategic.' );
		}

		if ( state.flags.knowsBettyWatchesKitchen ) {
			thoughts.push( 'Betty notices office traffic. That makes her useful as a witness and dangerous as a witness.' );
		}

		if ( state.flags.timHasNotes ) {
			thoughts.push( 'Tim has meeting notes. That means his threat is no longer just memory; it has bullet points.' );
		}

		if ( state.bars.timSuspectsYou >= 50 ) {
			thoughts.push( 'Tim is getting close to the timeline. Every sloppy sentence now has teeth.' );
		}

		if ( state.bars.celiaFindsOut >= 50 ) {
			thoughts.push( 'Celia is closer to the full shape of the insult. If she gets the exact message, the room changes.' );
		}

		if ( state.flags.knowsManagementPressure ) {
			thoughts.push( 'Lisa knows the all-hands may turn formal. That makes every social move feel a little more like evidence.' );
		}

		if ( state.facts.closetToiletPaperReduced ) {
			thoughts.push( 'There is now slightly less toilet paper in the supply closet. The fact that this matters says unkind things about the day.' );
		}

		if ( state.facts.bathroomSuppliesMissing ) {
			thoughts.push( 'Bathroom supply problems are now loaded into the office like a delayed-action complaint grenade.' );
		}

		return thoughts;
	},
	choices: [
		{
			id: 'go_betty',
			text: 'Go to Betty’s desk.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'betty_desk',
		},
		{
			id: 'go_tim',
			text: 'Go to Tim’s desk.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'tim_desk',
		},
		{
			id: 'go_frank',
			text: 'Check Frank’s desk.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'frank_desk',
		},
		{
			id: 'go_celia',
			text: 'Go near Celia’s area.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'celia_area',
		},
		{
			id: 'go_break_room',
			text: 'Go to the break room.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'break_room',
		},
		{
			id: 'go_supply_closet',
			text: 'Check the supply closet.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'supply_closet',
		},
		{
			id: 'go_lisa',
			text: 'Check in with Lisa.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'lisa_area',
		},
		{
			id: 'go_bathroom',
			text: 'Pass by the bathroom hallway.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'bathroom_hallway',
		},
	],
};

export default hub;