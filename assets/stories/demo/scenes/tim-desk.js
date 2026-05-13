function getTimStrategyFlags( strategy ) {
	return {
		timStrategyTruth: strategy === 'truth',
		timStrategyScheme: strategy === 'scheme',
		timStrategyNeutral: strategy === 'neutral',
	};
}

function getTimAngleFlags( selectedAngle ) {
	return Object.fromEntries(
		timAngleFlagIds.map( ( angle ) => [ angle, angle === selectedAngle ] )
	);
}

function withTimAngle( strategy, angle, requirements = {} ) {
	return {
		...requirements,
		flagsAll: [
			...( requirements.flagsAll || [] ),
			`timStrategy${ strategy }`,
			angle,
		],
	};
}

const timStrategyFlagIds = [
	'timStrategyTruth',
	'timStrategyScheme',
	'timStrategyNeutral',
];

const timAngleFlagIds = [
	'timTruthCalmDown',
	'timTruthExplainRecall',
	'timTruthReduceTimeline',
	'timSchemeRedirect',
	'timSchemeFrameFrank',
	'timSchemeBuryInWork',
	'timNeutralGatherTimeline',
	'timNeutralAskRecallLogs',
	'timNeutralWatchNotes',
];

const noTimStrategySelected = {
	flagsNone: timStrategyFlagIds,
};

const timStrategySelected = {
	flagsAny: timStrategyFlagIds,
};

const timAngleSelected = {
	flagsAny: timAngleFlagIds,
};

function timStrategyNeedsAngle( strategy ) {
	return {
		flagsAll: [
			`timStrategy${ strategy }`,
		],
		flagsNone: timAngleFlagIds,
	};
}

const timDesk = {
	id: 'tim_desk',
	location: 'Tim’s Desk',
	title: 'Tim has the expression of a man assembling a timeline.',
	body: ( state ) => {
		const body = [
			'Tim does not look angry. That is worse. Angry people react. Tim collects.',
			'His screen has three windows open. None of them look fun. A lunch bag with his name written in aggressive block letters sits beside his monitor.',
		];

		if ( state.npc.timState === 'taking_notes' || state.flags.timComparingTimes ) {
			body.push( 'A sticky note beside Tim’s keyboard has three times written on it.' );
		}

		return body;
	},
	internalThought: [
		'If you send Tim toward the wrong technical question, you may buy time. If you learn his routines, you may unlock worse options. But every question you ask tells him what you are afraid of.',
	],
	choices: [
		{
			id: 'tim_strategy_truth',
			text: 'Strategy: Tell the truth.',
			category: 'positive',
			advanceTurn: false,
			requirements: noTimStrategySelected,
			resultText: 'You decide to give Tim truth small enough that it cannot become a full timeline.',
			effects: {
				flags: getTimStrategyFlags( 'truth' ),
				signal: 'Truth choices with Tim can calm suspicion, explain recall confusion, or reduce timeline threat.',
			},
		},
		{
			id: 'tim_strategy_scheme',
			text: 'Strategy: Scheme.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: noTimStrategySelected,
			resultText: 'You decide Tim’s curiosity needs a different assignment.',
			effects: {
				flags: getTimStrategyFlags( 'scheme' ),
				signal: 'Scheme choices with Tim can redirect him, point him at Frank, or bury him in work.',
			},
		},
		{
			id: 'tim_strategy_neutral',
			text: 'Strategy: Stay neutral.',
			category: 'info',
			advanceTurn: false,
			requirements: noTimStrategySelected,
			resultText: 'You decide to collect Tim-shaped information before becoming Tim-shaped evidence.',
			effects: {
				flags: getTimStrategyFlags( 'neutral' ),
				signal: 'Neutral choices with Tim reveal timelines, recall logs, and what he is writing down.',
			},
		},
		{
			id: 'tim_truth_angle_calm_down',
			text: 'Choose angle: Calm Tim Down.',
			category: 'positive',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getTimAngleFlags( 'timTruthCalmDown' ),
				signal: 'Calm Tim Down focuses on lowering suspicion without feeding him new leads.',
			},
		},
		{
			id: 'tim_truth_angle_explain_recall',
			text: 'Choose angle: Explain Recall Confusion.',
			category: 'positive',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getTimAngleFlags( 'timTruthExplainRecall' ),
				signal: 'Explain Recall Confusion focuses on boring system details that can slow Tim down.',
			},
		},
		{
			id: 'tim_truth_angle_reduce_timeline',
			text: 'Choose angle: Reduce Timeline Threat.',
			category: 'positive',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Truth' ),
			effects: {
				flags: getTimAngleFlags( 'timTruthReduceTimeline' ),
				signal: 'Reduce Timeline Threat focuses on shrinking what Tim can prove.',
			},
		},
		{
			id: 'tim_scheme_angle_redirect',
			text: 'Choose angle: Redirect Tim.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getTimAngleFlags( 'timSchemeRedirect' ),
				signal: 'Redirect Tim focuses on sending his attention toward side work and false motion.',
			},
		},
		{
			id: 'tim_scheme_angle_frame_frank',
			text: 'Choose angle: Frame Frank.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getTimAngleFlags( 'timSchemeFrameFrank' ),
				signal: 'Frame Frank focuses Tim on Frank’s movement and timing.',
			},
		},
		{
			id: 'tim_scheme_angle_bury_work',
			text: 'Choose angle: Bury Tim in Work.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Scheme' ),
			effects: {
				flags: getTimAngleFlags( 'timSchemeBuryInWork' ),
				signal: 'Bury Tim in Work focuses on distractions and workload drag.',
			},
		},
		{
			id: 'tim_neutral_angle_gather_timeline',
			text: 'Choose angle: Gather Timeline Info.',
			category: 'info',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getTimAngleFlags( 'timNeutralGatherTimeline' ),
				signal: 'Gather Timeline Info focuses on learning what Tim can already prove.',
			},
		},
		{
			id: 'tim_neutral_angle_recall_logs',
			text: 'Choose angle: Ask About Recall Logs.',
			category: 'info',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getTimAngleFlags( 'timNeutralAskRecallLogs' ),
				signal: 'Ask About Recall Logs focuses on system evidence and audit trails.',
			},
		},
		{
			id: 'tim_neutral_angle_watch_notes',
			text: 'Choose angle: Watch Tim’s Notes.',
			category: 'info',
			advanceTurn: false,
			requirements: timStrategyNeedsAngle( 'Neutral' ),
			effects: {
				flags: getTimAngleFlags( 'timNeutralWatchNotes' ),
				signal: 'Watch Tim’s Notes focuses on what Tim is collecting before you interfere.',
			},
		},
		{
			id: 'tim_notice_labeled_lunch',
			text: 'Notice the carefully labeled lunch bag beside Tim’s monitor.',
			category: 'info',
			once: true,
			requirements: withTimAngle( 'Neutral', 'timNeutralWatchNotes' ),
			resultText: 'The label is too careful to be normal. Tim has built a tiny food perimeter around his day.',
			effects: {
				flags: {
					sawTimLabeledFood: true,
					knowsTimLunchRoutine: true,
				},
				unlocks: [
					'betty_ask_tim_lunch',
				],
				signal: 'Tim’s lunch routine looks weirdly important. Weirdly important things are doors with snacks on them.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_small_talk_meeting_prep',
			text: 'Make boring small talk about Tim’s meeting prep.',
			category: 'info',
			once: true,
			requirements: withTimAngle( 'Neutral', 'timNeutralGatherTimeline' ),
			resultText: 'Tim says he barely had time to prep, then taps a notebook with one finger. The notebook looks organized enough to hurt you.',
			effects: {
				flags: {
					timHasNotes: true,
					timChecksRecallLogs: true,
				},
				npc: {
					timState: 'taking_notes',
				},
				unlocks: [
					'tim_distract_from_notes',
				],
				signal: 'Tim has notes and is checking recall details. Paper is now an enemy faction.',
			},
			nextScene: 'hub',
		},
		{
			id: 'ask_tim_recall_logs',
			text: 'Ask Tim whether email recall logs are reliable.',
			category: 'info',
			once: true,
			requirements: withTimAngle( 'Neutral', 'timNeutralAskRecallLogs' ),
			resultText: 'Tim says recall is not magic. Then he looks at you like he wishes it were, because magic would be easier to audit.',
			effects: {
				bars: {
					blameSystem: 25,
					distractTim: 25,
					timSuspectsYou: 25,
				},
				flags: {
					knowsRecallLogsMatter: true,
					timChecksRecallLogs: true,
					timComparingTimes: true,
				},
				npc: {
					timState: 'taking_notes',
				},
				queueVisibleAftermath: [
					'tim_starts_notes',
				],
				signal: 'The system-blame route is alive, but Tim noticed where you pointed.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_mention_frank_away',
			text: 'Mention that Frank was away from his desk around the wrong time.',
			category: 'underhanded',
			once: true,
			requirements: withTimAngle( 'Scheme', 'timSchemeFrameFrank', {
				phaseMin: 'narrative_building',
				barsMin: {
					frameFrank: 10,
				},
			} ),
			resultText: 'Tim writes nothing down. Somehow that is more threatening than writing it down.',
			effects: {
				bars: {
					frameFrank: 25,
					distractTim: 25,
					timSuspectsYou: 10,
				},
				flags: {
					timCheckingFrank: true,
					timComparingTimes: true,
				},
				npc: {
					timState: 'taking_notes',
				},
				hiddenEvents: [
					'tim_started_timeline_check',
				],
				unlocks: [
					'plant_bottle_frank',
				],
				queueVisibleAftermath: [
					'tim_starts_timeline_check',
				],
				signal: 'Tim is checking Frank now. He is also checking you. Multitasking: the enemy.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_distract_from_notes',
			text: 'Ask a technical question that pulls Tim away from his meeting notes.',
			category: 'underhanded',
			once: true,
			requirements: withTimAngle( 'Scheme', 'timSchemeBuryInWork', {
				flagsAll: [
					'timHasNotes',
				],
			} ),
			resultText: 'Tim opens another window. The notes stay on his desk, but his attention splits. Split attention is not safety. It is a coupon for time.',
			effects: {
				bars: {
					distractTim: 25,
					timSuspectsYou: 25,
				},
				flags: {
					timNotesDistracted: true,
				},
				signal: 'Tim’s notes lost some momentum. Tim did not.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_give_boring_truth',
			text: 'Give Tim one boring true detail about the recall.',
			category: 'cleanup',
			once: true,
			requirements: withTimAngle( 'Truth', 'timTruthExplainRecall', {
				barsMin: {
					timSuspectsYou: 25,
				},
			} ),
			resultText: 'Tim accepts the detail because boring truths have a smell. Unfortunately, he likes smells.',
			effects: {
				bars: {
					timSuspectsYou: -25,
					distractTim: -25,
					blameSystem: 25,
				},
				signal: 'You gave Tim something true enough to slow him down, but the false trail lost some fog.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_nudge_lunch',
			text: 'Nudge Tim toward eating before the all-hands window closes.',
			category: 'commitment',
			once: true,
			requirements: withTimAngle( 'Scheme', 'timSchemeRedirect', {
				phaseMin: 'pressure_rising',
				phaseMax: 'pressure_rising',
				flagsAll: [
					'knowsTimFoodVulnerability',
					'timLunchCompromised',
					'bathroomSuppliesMissing',
				],
				barsMin: {
					sidelineTim: 75,
				},
			} ),
			resultText: 'Tim checks the clock, checks his lunch, and makes a decision his digestive system will file an appeal against. There is still enough time for the problem to mature. Horrible sentence. Accurate sentence.',
			effects: {
				bars: {
					sidelineTim: 25,
					timSuspectsYou: 25,
					managementEscalates: 25,
				},
				flags: {
					timAteCompromisedLunch: true,
					timDigestiveClockStarted: true,
				},
				npc: {
					timMissesMeeting: true,
				},
				signal: 'Tim ate during the danger window. The all-hands may now be missing its timeline goblin.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_nudge_lunch_too_late',
			text: 'Try to nudge Tim toward eating right before the all-hands.',
			category: 'commitment',
			once: true,
			requirements: withTimAngle( 'Scheme', 'timSchemeRedirect', {
				phaseMin: 'final_setup',
				flagsAll: [
					'knowsTimFoodVulnerability',
					'timLunchCompromised',
					'bathroomSuppliesMissing',
				],
				usedChoicesNone: [
					'tim_nudge_lunch',
				],
				barsMin: {
					sidelineTim: 75,
				},
			} ),
			resultText: 'Tim looks at the clock and decides to wait. Apparently even sabotage has scheduling requirements. Rude, but fair.',
			effects: {
				bars: {
					timSuspectsYou: 25,
					managementEscalates: 25,
					sidelineTim: -25,
				},
				flags: {
					timLunchWindowMissed: true,
				},
				signal: 'You missed the timing window. Tim still has the lunch problem, but not soon enough to remove him from the meeting.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_strategy_think_again',
			text: 'Think again.',
			category: 'info',
			advanceTurn: false,
			requirements: timStrategySelected,
			resultText: 'You reconsider before Tim turns your approach into a timestamp.',
			effects: {
				flags: {
					timStrategyTruth: false,
					timStrategyScheme: false,
					timStrategyNeutral: false,
					...getTimAngleFlags(),
				},
				signal: 'You reconsider your approach with Tim.',
			},
		},
		{
			id: 'tim_choose_different_angle',
			text: 'Choose a different angle.',
			category: 'info',
			advanceTurn: false,
			requirements: timAngleSelected,
			resultText: 'You keep the same approach with Tim, but stop feeding the current line of thought.',
			effects: {
				flags: getTimAngleFlags(),
				signal: 'You choose a different Tim angle.',
			},
		},
	],
};

export default timDesk;
