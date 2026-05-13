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
			id: 'inspect_break_room_fridge',
			text: 'Inspect the top of the fridge.',
			category: 'info',
			advanceTurn: false,
			once: true,
			requirements: {
				factsNone: [
					'kitchenBottleSeen',
					'kitchenBottleMissing',
				],
			},
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
			requirements: {
				factsAll: [
					'kitchenBottleSeen',
				],
				factsNone: [
					'playerHasBottle',
					'kitchenBottleMissing',
				],
			},
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
				hiddenEvents: [
					'celia_may_have_seen_bottle_bag',
				],
				bars: {
					managementEscalates: 25,
				},
				queueVisibleAftermath: [
					'kitchen_bottle_taken_celia_bag',
				],
				signal: 'The bottle is in your bag. Useful, suspicious, and still waiting for a story to attach itself to.',
			},
		},
		{
			id: 'devon_ask_who_saw',
			text: 'Ask Devon who has seen the email.',
			category: 'info',
			once: true,
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
			requirements: {
				barsMin: {
					devonLeak: 25,
				},
			},
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
			requirements: {
				barsMin: {
					frameFrank: 25,
				},
			},
			resultText: 'Devon does not promise to repeat it. Which is how Devon promises to repeat it.',
			effects: {
				bars: {
					frameFrank: 25,
					devonLeak: 25,
					frankRetaliates: 25,
				},
				flags: {
					devonCarryingFrankStory: true,
				},
				hiddenEvents: [
					'devon_spreads_frank_story',
				],
				queueVisibleAftermath: [
					'devon_frank_story_travels',
				],
				signal: 'Devon now carries the Frank story. Handle with tongs.',
			},
			nextScene: 'hub',
		},
		{
			id: 'create_tim_lunch_confusion',
			text: 'Create confusion around Tim’s carefully labeled lunch.',
			category: 'underhanded',
			requirements: {
				phaseMin: 'narrative_building',
				phaseMax: 'pressure_rising',
				flagsAll: [
					'knowsTimFoodVulnerability',
				],
			},
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
			requirements: {
				flagsAll: [
					'devonCanCarryFalseDetail',
				],
			},
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
			requirements: {
				barsMin: {
					devonLeak: 25,
				},
			},
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
			requirements: {
				phaseMin: 'pressure_rising',
				barsMin: {
					frameFrank: 75,
					devonLeak: 25,
				},
			},
			once: true,
			resultText: 'Devon walks away with a version of the story that has your fingerprints and his volume.',
			effects: {
				bars: {
					frameFrank: 25,
					devonLeak: 25,
					frankRetaliates: 25,
					managementEscalates: 25,
				},
				signal: 'The Frank story is now traveling without supervision. Bold. Horrifying.',
			},
			nextScene: 'hub',
		},
	],
};

export default breakRoom;
