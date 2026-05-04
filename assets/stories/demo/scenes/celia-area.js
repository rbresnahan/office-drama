const celiaArea = {
	id: 'celia_area',
	location: 'Celia’s Area',
	title: 'Celia has not looked at you yet.',
	body: ( state ) => {
		const body = [
			'That could mean she does not know. It could also mean she knows exactly enough.',
			'Her monitor glows. Her hands are still. The silence around her feels like a meeting invite you cannot decline.',
		];

		if ( Array.isArray( state.hiddenEvents ) && state.hiddenEvents.includes( 'celia_may_have_seen_bottle_bag' ) ) {
			body.push( 'Her eyes flick briefly toward your bag before returning to her screen. It is too quick to be an accusation and too specific to be nothing.' );
		}

		return body;
	},
	internalThought: [
		'Celia is the subject of the email. If you talk now, you may control the first version she hears. If you wait, someone else gets there first.',
	],
	choices: [
		{
			id: 'celia_watch_email',
			text: 'Watch whether Celia has opened the thread yet.',
			category: 'info',
			once: true,
			resultText: 'Celia keeps looking at her inbox but has not opened the thread. She has fragments, not the full blade.',
			effects: {
				flags: {
					knowsCeliaHasNotSeenFullEmail: true,
					celiaHeardFragments: true,
				},
				bars: {
					containCelia: 25,
				},
				unlocks: [
					'celia_people_exaggerating',
					'celia_direct_apology',
				],
				signal: 'Celia has fragments, not the full message. The window is small and already closing.',
			},
			nextScene: 'hub',
		},
		{
			id: 'celia_apologize_vague',
			text: 'Apologize before she asks, but keep it vague.',
			category: 'positive',
			once: true,
			resultText: 'Celia hears the apology. She also hears the empty spaces inside it.',
			effects: {
				bars: {
					containCelia: 25,
					celiaFindsOut: 25,
				},
				flags: {
					celiaHeardApology: true,
				},
				signal: 'Celia knows there is something to apologize for. That helps and hurts. Classic.',
			},
			nextScene: 'hub',
		},
		{
			id: 'celia_ask_heard_anything',
			text: 'Ask whether she has heard anything weird today.',
			category: 'info',
			once: true,
			resultText: 'Celia says Devon has been weird. That narrows nothing and widens everything.',
			effects: {
				flags: {
					knowsCeliaHasHeardRumor: true,
					celiaHeardFragments: true,
				},
				bars: {
					containCelia: 25,
				},
				signal: 'Celia has heard a rumor, not the full blast. The window is small.',
			},
			nextScene: 'hub',
		},
		{
			id: 'celia_people_exaggerating',
			text: 'Tell Celia people are exaggerating fragments of the email.',
			category: 'underhanded',
			once: true,
			requirements: {
				barsMin: {
					blameSystem: 25,
				},
				flagsAny: [
					'knowsCeliaHasNotSeenFullEmail',
					'celiaHeardFragments',
					'devonHasPartialVersion',
				],
			},
			resultText: 'Celia’s face closes a little. You gave her a reason to doubt the rumor. You also gave her a reason to find the original.',
			effects: {
				bars: {
					containCelia: 25,
					celiaDramatic: 25,
					celiaFindsOut: 25,
					timSuspectsYou: 25,
				},
				flags: {
					show_celiaDramatic: true,
				},
				signal: 'You pushed the fragment story. If the full email appears, this gets ugly fast.',
			},
			nextScene: 'hub',
		},
		{
			id: 'celia_give_space',
			text: 'Give Celia space and do not make yourself the center.',
			category: 'neutral',
			once: true,
			resultText: 'You leave her alone. It feels mature, which is inconvenient because maturity does not always win meetings.',
			effects: {
				bars: {
					containCelia: 25,
				},
				signal: 'You did not make Celia worse. That counts as progress in this cursed terrarium.',
			},
			nextScene: 'hub',
		},
		{
			id: 'celia_direct_apology',
			text: 'Apologize directly enough that she knows you are not hiding behind fragments.',
			category: 'commitment',
			once: true,
			requirements: {
				phaseMin: 'pressure_rising',
				barsMin: {
					containCelia: 50,
				},
			},
			resultText: 'Celia does not forgive you. But she stops watching you like you are still trying to sell her a smaller wound.',
			effects: {
				bars: {
					containCelia: 25,
					celiaFindsOut: 25,
					bettyLosesTrust: -25,
				},
				flags: {
					celiaHeardDirectApology: true,
				},
				signal: 'Direct apology stabilized Celia slightly. It also put more truth in the room.',
			},
			nextScene: 'hub',
		},
	],
};

export default celiaArea;