function getCeliaStrategyFlags( strategy ) {
	return {
		celiaStrategyTruth: strategy === 'truth',
		celiaStrategyScheme: strategy === 'scheme',
		celiaStrategyNeutral: strategy === 'neutral',
	};
}

function getCeliaAngleFlags( selectedAngle ) {
	return Object.fromEntries(
		celiaAngleFlagIds.map( ( angle ) => [ angle, angle === selectedAngle ] )
	);
}

function withCeliaAngle( strategy, angle, requirements = {} ) {
	return {
		...requirements,
		flagsAll: [
			...( requirements.flagsAll || [] ),
			`celiaStrategy${ strategy }`,
			angle,
		],
	};
}

const celiaStrategyFlagIds = [
	'celiaStrategyTruth',
	'celiaStrategyScheme',
	'celiaStrategyNeutral',
];

const celiaAngleFlagIds = [
	'celiaTruthRepairDamage',
	'celiaTruthDelayDiscovery',
	'celiaTruthApologizeCarefully',
	'celiaSchemeControlContext',
	'celiaSchemeRedirectBlame',
	'celiaSchemeMinimizeEmail',
	'celiaNeutralLearnKnows',
	'celiaNeutralWatchReaction',
	'celiaNeutralAvoidCommitment',
];

const noCeliaStrategySelected = {
	flagsNone: celiaStrategyFlagIds,
};

const celiaStrategySelected = {
	flagsAny: celiaStrategyFlagIds,
};

const celiaAngleSelected = {
	flagsAny: celiaAngleFlagIds,
};

function celiaStrategyNeedsAngle( strategy ) {
	return {
		flagsAll: [
			`celiaStrategy${ strategy }`,
		],
		flagsNone: celiaAngleFlagIds,
	};
}

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

		if ( state.flags.celiaScanningRoom ) {
			body.push( 'Celia looks from her screen to the room, then back again.' );
		}

		return body;
	},
	internalThought: [
		'Celia is the subject of the email. If you talk now, you may control the first version she hears. If you wait, someone else gets there first.',
	],
	choices: [
		{
			id: 'celia_strategy_truth',
			text: 'Strategy: Tell the truth.',
			category: 'positive',
			advanceTurn: false,
			requirements: noCeliaStrategySelected,
			resultText: 'You decide the truth might still be smaller if you say it before the room does.',
			effects: {
				flags: getCeliaStrategyFlags( 'truth' ),
				signal: 'Truth choices with Celia can repair damage, delay discovery, or apologize carefully.',
			},
		},
		{
			id: 'celia_strategy_scheme',
			text: 'Strategy: Scheme.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: noCeliaStrategySelected,
			resultText: 'You decide Celia needs context before context becomes evidence.',
			effects: {
				flags: getCeliaStrategyFlags( 'scheme' ),
				signal: 'Scheme choices with Celia can control context, redirect blame, or minimize the email.',
			},
		},
		{
			id: 'celia_strategy_neutral',
			text: 'Strategy: Stay neutral.',
			category: 'info',
			advanceTurn: false,
			requirements: noCeliaStrategySelected,
			resultText: 'You decide to learn what Celia knows without confessing to the shape of the room.',
			effects: {
				flags: getCeliaStrategyFlags( 'neutral' ),
				signal: 'Neutral choices with Celia reveal what she knows, how she reacts, and whether you can avoid commitment.',
			},
		},
		{
			id: 'celia_truth_angle_repair_damage',
			text: 'Choose angle: Repair Damage.',
			category: 'positive',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaTruthRepairDamage' ),
				signal: 'Repair Damage focuses on direct stabilization.',
			},
		},
		{
			id: 'celia_truth_angle_delay_discovery',
			text: 'Choose angle: Delay Full Discovery.',
			category: 'positive',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaTruthDelayDiscovery' ),
				signal: 'Delay Full Discovery focuses on acting before Celia sees the whole thread.',
			},
		},
		{
			id: 'celia_truth_angle_apologize',
			text: 'Choose angle: Apologize Carefully.',
			category: 'positive',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaTruthApologizeCarefully' ),
				signal: 'Apologize Carefully focuses on owning enough without widening the wound.',
			},
		},
		{
			id: 'celia_scheme_angle_control_context',
			text: 'Choose angle: Control Context.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaSchemeControlContext' ),
				signal: 'Control Context focuses on fragment handling and timing.',
			},
		},
		{
			id: 'celia_scheme_angle_redirect_blame',
			text: 'Choose angle: Redirect Blame.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaSchemeRedirectBlame' ),
				signal: 'Redirect Blame focuses on making the rumor source matter more than you.',
			},
		},
		{
			id: 'celia_scheme_angle_minimize_email',
			text: 'Choose angle: Minimize the Email.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaSchemeMinimizeEmail' ),
				signal: 'Minimize the Email focuses on exaggeration and fragment spin.',
			},
		},
		{
			id: 'celia_neutral_angle_learn_knows',
			text: 'Choose angle: Learn What She Knows.',
			category: 'info',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaNeutralLearnKnows' ),
				signal: 'Learn What She Knows focuses on rumor state and inbox state.',
			},
		},
		{
			id: 'celia_neutral_angle_watch_reaction',
			text: 'Choose angle: Watch Her Reaction.',
			category: 'info',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaNeutralWatchReaction' ),
				signal: 'Watch Her Reaction focuses on body language before commitment.',
			},
		},
		{
			id: 'celia_neutral_angle_avoid_commitment',
			text: 'Choose angle: Avoid Commitment.',
			category: 'info',
			advanceTurn: false,
			requirements: celiaStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getCeliaAngleFlags( 'celiaNeutralAvoidCommitment' ),
				signal: 'Avoid Commitment focuses on not becoming the center of Celia’s next question.',
			},
		},
		{
			id: 'celia_watch_email',
			text: 'Watch whether Celia has opened the thread yet.',
			category: 'info',
			once: true,
			requirements: withCeliaAngle( 'Neutral', 'celiaNeutralLearnKnows' ),
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
			requirements: withCeliaAngle( 'Truth', 'celiaTruthApologizeCarefully' ),
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
			requirements: withCeliaAngle( 'Neutral', 'celiaNeutralWatchReaction' ),
			resultText: 'Celia says Devon has been weird. That narrows nothing and widens everything.',
			effects: {
				flags: {
					knowsCeliaHasHeardRumor: true,
					celiaHeardFragments: true,
					celiaScanningRoom: true,
				},
				bars: {
					containCelia: 25,
				},
				queueVisibleAftermath: [
					'celia_scans_room',
				],
				signal: 'Celia has heard a rumor, not the full blast. The window is small.',
			},
			nextScene: 'hub',
		},
		{
			id: 'celia_people_exaggerating',
			text: 'Tell Celia people are exaggerating fragments of the email.',
			category: 'underhanded',
			once: true,
			requirements: withCeliaAngle( 'Scheme', 'celiaSchemeMinimizeEmail', {
				barsMin: {
					blameSystem: 25,
				},
				flagsAny: [
					'knowsCeliaHasNotSeenFullEmail',
					'celiaHeardFragments',
					'devonHasPartialVersion',
				],
			} ),
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
					celiaScanningRoom: true,
				},
				queueVisibleAftermath: [
					'celia_scans_room',
				],
				signal: 'You pushed the fragment story. If the full email appears, this gets ugly fast.',
			},
			nextScene: 'hub',
		},
		{
			id: 'celia_give_space',
			text: 'Give Celia space and do not make yourself the center.',
			category: 'neutral',
			once: true,
			requirements: withCeliaAngle( 'Neutral', 'celiaNeutralAvoidCommitment' ),
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
			requirements: withCeliaAngle( 'Truth', 'celiaTruthRepairDamage', {
				phaseMin: 'pressure_rising',
				barsMin: {
					containCelia: 50,
				},
			} ),
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
		{
			id: 'celia_strategy_think_again',
			text: 'Think again.',
			category: 'info',
			advanceTurn: false,
			requirements: celiaStrategySelected,
			resultText: 'You reconsider before Celia becomes the first person to hear the wrong version from you.',
			effects: {
				flags: {
					celiaStrategyTruth: false,
					celiaStrategyScheme: false,
					celiaStrategyNeutral: false,
					...getCeliaAngleFlags(),
				},
				signal: 'You reconsider your approach with Celia.',
			},
		},
		{
			id: 'celia_choose_different_angle',
			text: 'Choose a different angle.',
			category: 'info',
			advanceTurn: false,
			requirements: celiaAngleSelected,
			resultText: 'You keep the same approach with Celia, but change what you are trying to manage.',
			effects: {
				flags: getCeliaAngleFlags(),
				signal: 'You choose a different Celia angle.',
			},
		},
	],
};

export default celiaArea;
