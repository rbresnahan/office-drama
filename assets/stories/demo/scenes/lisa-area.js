function afterOpening( requirements = {} ) {
	return {
		...requirements,
		flagsAll: [
			...( requirements.flagsAll || [] ),
			'openingFirstInteractionComplete',
		],
	};
}

function getLisaStrategyFlags( strategy ) {
	return {
		lisaStrategyTruth: strategy === 'truth',
		lisaStrategyScheme: strategy === 'scheme',
		lisaStrategyNeutral: strategy === 'neutral',
	};
}

function withLisaStrategy( strategy, requirements = {} ) {
	return {
		...requirements,
		flagsAll: [
			...( requirements.flagsAll || [] ),
			`lisaStrategy${ strategy }`,
		],
	};
}

const openingLisaRequirement = {
	flagsAll: [
		'guidedOpeningStarted',
	],
	flagsNone: [
		'openingFirstInteractionComplete',
	],
};

const lisaStrategyFlagIds = [
	'lisaStrategyTruth',
	'lisaStrategyScheme',
	'lisaStrategyNeutral',
];

const noLisaStrategySelected = {
	flagsNone: lisaStrategyFlagIds,
};

const lisaStrategySelected = {
	flagsAny: lisaStrategyFlagIds,
};

const lisaArea = {
	id: 'lisa_area',
	location: 'Lisa’s Area',
	title: 'Lisa is already using the word “process.”',
	body: ( state ) => {
		if ( ! state.flags.openingFirstInteractionComplete ) {
			return [
				'Lisa is organizing something at her desk.',
				'She has the calm expression of someone who already knows there is a problem and has mentally opened a folder for it.',
				'Her calendar is open. Her notebook is open. Unfortunately, so is the possibility that this becomes official before lunch.',
			];
		}

		const body = [
			'Lisa has a notebook open. Not a cute notebook. A notebook that will survive discovery.',
			'Her calendar is open to the all-hands invite. The title has not changed, but the room around it has.',
		];

		if ( Array.isArray( state.hiddenEvents ) && state.hiddenEvents.includes( 'lisa_may_connect_missing_supplies' ) ) {
			body.push( 'A sticky note near her keyboard says “supplies?” with a question mark that feels legally active.' );
		}

		if ( state.npc.bettyLocation === 'lisa_area' ) {
			body.push( 'Betty is near Lisa now. They stop talking when you get close.' );
		}

		if ( state.flags.lisaCheckingSchedule ) {
			body.push( 'Lisa’s calendar is open. The all-hands invite sits selected.' );
		}

		return body;
	},
	internalThought: ( state ) => {
		if ( state.flags.lisaStrategyTruth ) {
			return [
				'Tell the truth: repair damage, ask for help, and accept that Lisa may convert your panic into documentation.',
				'Lisa can contain a problem. Lisa can also preserve a problem forever in a shared drive with permissions.',
			];
		}

		if ( state.flags.lisaStrategyScheme ) {
			return [
				'Scheme: use Lisa’s process brain to learn who controls schedules, complaints, and timelines.',
				'The danger is that Lisa notices the pattern before the pattern points somewhere useful.',
			];
		}

		if ( state.flags.lisaStrategyNeutral ) {
			return [
				'Stay neutral: ask about the day, the meetings, and who is in the office without admitting why you care.',
				'Neutral keeps routes open. It also makes you sound like someone casing a building made of calendars.',
			];
		}

		if ( ! state.flags.openingFirstInteractionComplete ) {
			return [
				'Lisa is the official route. That makes her useful, dangerous, and deeply allergic to improvisation.',
				'Pick an approach: tell the truth, scheme, or stay neutral. With Lisa, every path has paperwork hiding under it.',
			];
		}

		return [
			'Lisa can make this official. You can cooperate, redirect her, or turn her into the reason this became bigger than it needed to be.',
		];
	},
	choices: [
		{
			id: 'lisa_strategy_truth',
			text: 'Strategy: Tell the truth.',
			category: 'positive',
			advanceTurn: false,
			requirements: noLisaStrategySelected,
			resultText: 'You decide to use honesty before the paperwork learns to walk upright.',
			effects: {
				flags: getLisaStrategyFlags( 'truth' ),
				signal: 'Truth choices can repair damage and reveal formal risk, but Lisa may escalate the issue.',
			},
		},
		{
			id: 'lisa_strategy_scheme',
			text: 'Strategy: Scheme.',
			category: 'underhanded',
			advanceTurn: false,
			requirements: noLisaStrategySelected,
			resultText: 'You decide to use process as camouflage. Bold choice. Also the kind of thing process was invented to catch.',
			effects: {
				flags: getLisaStrategyFlags( 'scheme' ),
				signal: 'Scheme choices can unlock schedule and blame routes, but they make Lisa more suspicious.',
			},
		},
		{
			id: 'lisa_strategy_neutral',
			text: 'Strategy: Stay neutral.',
			category: 'info',
			advanceTurn: false,
			requirements: noLisaStrategySelected,
			resultText: 'You decide to ask office-shaped questions and pretend they are normal. Office culture was built for this exact nonsense.',
			effects: {
				flags: getLisaStrategyFlags( 'neutral' ),
				signal: 'Neutral choices reveal meetings, office movement, and NPC routes while keeping truth and scheme paths open.',
			},
		},
		{
			id: 'opening_lisa_truth_mistake',
			text: 'Tell the truth: admit the email was sent by mistake.',
			category: 'positive',
			once: true,
			requirements: withLisaStrategy( 'Truth', openingLisaRequirement ),
			resultText: 'Lisa writes down “reply-all mistake” with the steady hand of someone building a bridge you may later be thrown from. Still, she does not call anyone yet.',
			effects: {
				bars: {
					containCelia: 25,
					managementEscalates: 25,
				},
				flags: {
					openingFirstInteractionComplete: true,
					lisaCanDelayEscalation: true,
					knowsManagementPressure: true,
					lisaCheckingSchedule: true,
				},
				npc: {
					lisaState: 'checking_calendar',
				},
				unlocks: [
					'lisa_ask_agenda',
					'lisa_process_explanation',
				],
				queueVisibleAftermath: [
					'lisa_opens_calendar',
				],
				signal: 'Lisa can contain the situation for now, but the formal risk is awake.',
			},
			nextScene: 'hub',
		},
		{
			id: 'opening_lisa_scheme_logs',
			text: 'Scheme: ask whether recall logs show who opened it.',
			category: 'underhanded',
			once: true,
			requirements: withLisaStrategy( 'Scheme', openingLisaRequirement ),
			resultText: 'Lisa says logs may exist, then immediately regrets saying something interesting. You now know the system route is real. You also know asking about logs makes you look like a person with something to bury. Because you are.',
			effects: {
				bars: {
					blameSystem: 25,
					timSuspectsYou: 25,
					managementEscalates: 25,
				},
				flags: {
					openingFirstInteractionComplete: true,
					knowsAllHandsAgendaShifted: true,
					knowsManagementPressure: true,
					knowsRecallLogsExist: true,
					timComparingTimes: true,
				},
				npc: {
					timState: 'taking_notes',
				},
				unlocks: [
					'lisa_push_system_failure',
					'ask_tim_recall_logs',
				],
				queueVisibleAftermath: [
					'tim_starts_notes',
				],
				signal: 'The recall-log route exists. So does the suspicion created by asking about it.',
			},
			nextScene: 'hub',
		},
		{
			id: 'opening_lisa_neutral_reported',
			text: 'Stay neutral: ask whether anyone has reported anything unusual.',
			category: 'info',
			once: true,
			requirements: withLisaStrategy( 'Neutral', openingLisaRequirement ),
			resultText: 'Lisa says no one has filed anything formal. The word “formal” lands on the desk like a stapler dropped from a height.',
			effects: {
				bars: {
					managementEscalates: 25,
				},
				flags: {
					openingFirstInteractionComplete: true,
					knowsLisaTalkedToManagement: true,
					knowsManagementPressure: true,
					lisaCheckingSchedule: true,
				},
				npc: {
					lisaState: 'checking_calendar',
				},
				unlocks: [
					'lisa_ask_agenda',
					'lisa_process_explanation',
				],
				queueVisibleAftermath: [
					'lisa_opens_calendar',
				],
				signal: 'No formal complaint yet. Lisa has introduced the concept, which is rude but useful.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_ask_agenda',
			text: 'Tell the truth: ask how bad this looks.',
			category: 'positive',
			once: true,
			requirements: withLisaStrategy( 'Truth', afterOpening() ),
			resultText: 'Lisa says leadership wants to address communication norms. Congratulations, you have become a norm.',
			effects: {
				bars: {
					managementEscalates: 25,
				},
				flags: {
					knowsLisaTalkedToManagement: true,
					knowsAllHandsAgendaShifted: true,
					knowsManagementPressure: true,
					bossDoorClosed: true,
				},
				unlocks: [
					'lisa_overreacting_seed',
					'lisa_push_system_failure',
				],
				queueVisibleAftermath: [
					'boss_door_closes',
				],
				signal: 'Management is aware enough to be dangerous.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_truth_boss_seen',
			text: 'Tell the truth: ask whether the boss has seen it.',
			category: 'positive',
			once: true,
			requirements: withLisaStrategy( 'Truth', afterOpening() ),
			resultText: 'Lisa says the boss has not said anything yet. Yet enters the room, removes its coat, and gets comfortable.',
			effects: {
				bars: {
					containCelia: 25,
					managementEscalates: 25,
				},
				flags: {
					knowsBossMayNotHaveSeenEmail: true,
					knowsManagementPressure: true,
					lisaCheckingSchedule: true,
				},
				npc: {
					lisaState: 'checking_calendar',
				},
				queueVisibleAftermath: [
					'lisa_opens_calendar',
				],
				signal: 'The boss may not have seen it yet. That gives you time, which is not the same as safety.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_truth_contain_help',
			text: 'Tell the truth: ask for help containing the situation.',
			category: 'positive',
			once: true,
			requirements: withLisaStrategy( 'Truth', afterOpening() ),
			resultText: 'Lisa says the safest path is a short corrective message and no hallway campaigning. Rude to your schemes. Excellent for your blood pressure.',
			effects: {
				bars: {
					containCelia: 25,
					managementEscalates: -25,
				},
				flags: {
					lisaSuggestedCorrectiveMessage: true,
					lisaCanDelayEscalation: true,
				},
				signal: 'Lisa can help contain this if you stop making it interesting. A bold and terrible condition.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_process_explanation',
			text: 'Tell the truth: give Lisa a boring process-focused explanation.',
			category: 'cleanup',
			once: true,
			requirements: withLisaStrategy( 'Truth', afterOpening( {
				barsMin: {
					managementEscalates: 25,
				},
			} ) ),
			resultText: 'Lisa writes less than you feared. Less is not nothing, but it is less.',
			effects: {
				bars: {
					managementEscalates: -25,
					blameSystem: -25,
				},
				flags: {
					lisaCanDelayEscalation: true,
					lisaCheckingSchedule: true,
				},
				npc: {
					lisaState: 'checking_calendar',
				},
				queueVisibleAftermath: [
					'lisa_opens_calendar',
				],
				signal: 'You lowered formal risk by becoming boring, but the system-blame route lost leverage.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_scheme_frank_complained',
			text: 'Scheme: ask whether Frank has complained about you recently.',
			category: 'underhanded',
			once: true,
			requirements: withLisaStrategy( 'Scheme', afterOpening() ),
			resultText: 'Lisa looks up slowly. That was not subtle. Still, she says Frank has been “frustrated with communication lately,” which is bureaucratic music to your awful little ears.',
			effects: {
				bars: {
					frameFrank: 25,
					managementEscalates: 25,
				},
				flags: {
					knowsFrankComplainedAboutCommunication: true,
					knowsFrankUnderPressure: true,
				},
				unlocks: [
					'tim_mention_frank_away',
				],
				signal: 'Frank has complained about communication. That can support a frame, if you enjoy juggling knives.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_scheme_misread_email',
			text: 'Scheme: suggest someone may have misread the email.',
			category: 'underhanded',
			once: true,
			requirements: withLisaStrategy( 'Scheme', afterOpening() ),
			resultText: 'Lisa says tone is difficult in email. She says it like a person laying down a tarp before painting over blood.',
			effects: {
				bars: {
					blameSystem: 25,
					managementEscalates: 25,
				},
				flags: {
					misreadEmailAngle: true,
				},
				signal: 'The misread-email angle can soften intent, but it invites review of what was actually written. Fun trap.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_scheme_schedule_control',
			text: 'Scheme: ask who controls the meeting schedule.',
			category: 'underhanded',
			once: true,
			requirements: withLisaStrategy( 'Scheme', afterOpening() ),
			resultText: 'Lisa says she manages the calendar, but leadership can change priorities. Translation: Lisa holds the map, management holds the trapdoor.',
			effects: {
				bars: {
					managementEscalates: 25,
				},
				flags: {
					knowsLisaControlsSchedule: true,
					knowsAllHandsAgendaShifted: true,
					lisaCheckingSchedule: true,
				},
				npc: {
					lisaState: 'checking_calendar',
				},
				unlocks: [
					'lisa_push_system_failure',
				],
				queueVisibleAftermath: [
					'lisa_opens_calendar',
				],
				signal: 'Lisa controls schedule logistics. Leadership controls escalation. Both are problems with chairs.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_scheme_tim_concerns',
			text: 'Scheme: try to learn whether Tim has raised concerns.',
			category: 'underhanded',
			once: true,
			requirements: withLisaStrategy( 'Scheme', afterOpening() ),
			resultText: 'Lisa says Tim asked whether recall notices are tracked. She does not say why. She does not need to. Tim has found a shovel and is calling it procedure.',
			effects: {
				bars: {
					timSuspectsYou: 25,
				},
				flags: {
					knowsTimInvestigating: true,
					knowsRecallLogsExist: true,
					timComparingTimes: true,
				},
				npc: {
					timState: 'taking_notes',
				},
				unlocks: [
					'ask_tim_recall_logs',
				],
				queueVisibleAftermath: [
					'tim_starts_notes',
				],
				signal: 'Tim may be checking recall details. The timeline threat is no longer theoretical.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_overreacting_seed',
			text: 'Scheme: suggest Lisa may be making this bigger than it needs to be.',
			category: 'underhanded',
			once: true,
			requirements: withLisaStrategy( 'Scheme', afterOpening( {
				phaseMin: 'narrative_building',
				flagsAny: [
					'knowsAllHandsAgendaShifted',
					'knowsManagementPressure',
				],
			} ) ),
			resultText: 'The idea lands nearby, not directly. That is usually how cowardly useful ideas land.',
			effects: {
				bars: {
					lisaOverreacting: 25,
					managementEscalates: 25,
					timSuspectsYou: 25,
				},
				flags: {
					show_lisaOverreacting: true,
				},
				signal: 'Lisa can now be blamed for escalation. Lisa will not love that journey.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_push_system_failure',
			text: 'Scheme: push the system-failure angle through Lisa.',
			category: 'commitment',
			once: true,
			requirements: withLisaStrategy( 'Scheme', afterOpening( {
				phaseMin: 'pressure_rising',
				flagsAll: [
					'knowsAllHandsAgendaShifted',
					'knowsManagementPressure',
				],
				barsMin: {
					blameSystem: 50,
				},
			} ) ),
			resultText: 'Lisa hears “system issue” and starts building a process-shaped container around your personal disaster.',
			effects: {
				bars: {
					blameSystem: 25,
					managementEscalates: 25,
				},
				flags: {
					systemAngleWithLisa: true,
					lisaCheckingSchedule: true,
				},
				npc: {
					lisaState: 'checking_calendar',
				},
				hiddenEvents: [
					'lisa_documents_system_angle',
				],
				queueVisibleAftermath: [
					'lisa_quietly_documents',
					'lisa_opens_calendar',
				],
				signal: 'The system route is stronger. So is the chance this becomes formal. Tiny tradeoff. Huge paperwork.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_neutral_unusual_today',
			text: 'Stay neutral: ask if anything unusual is happening today.',
			category: 'info',
			once: true,
			requirements: withLisaStrategy( 'Neutral', afterOpening() ),
			resultText: 'Lisa says there has been “some chatter.” The office has elevated gossip into weather. You are the humidity.',
			effects: {
				bars: {
					managementEscalates: 25,
				},
				flags: {
					knowsOfficeChatterStarted: true,
				},
				signal: 'There is already chatter. It is not formal yet, but it has legs.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_neutral_meetings_later',
			text: 'Stay neutral: ask whether there are meetings later.',
			category: 'info',
			once: true,
			requirements: withLisaStrategy( 'Neutral', afterOpening() ),
			resultText: 'Lisa says there is a 10:13 Stand Up, lunch at noon, a 3:18 Catch Up, and the 5:00 All-Hands. The calendar is now a threat display.',
			effects: {
				flags: {
					knowsOfficeSchedule: true,
					knowsAllHandsAgendaShifted: true,
				},
				signal: 'The day has landmarks now: Stand Up, lunch, Catch Up, All-Hands. You can plan around pressure instead of being surprised by it.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_neutral_who_is_in',
			text: 'Stay neutral: ask who is currently in the office.',
			category: 'info',
			once: true,
			requirements: withLisaStrategy( 'Neutral', afterOpening() ),
			resultText: 'Lisa says Betty, Tim, Frank, Celia, and Devon are all in. That is not a staff list. That is a suspect menu.',
			effects: {
				flags: {
					knowsOfficeOccupants: true,
					knowsDevonInOffice: true,
				},
				signal: 'You know who is in play: Betty, Tim, Frank, Celia, and Devon.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_neutral_understand_situation',
			text: 'Stay neutral: say you are trying to understand the situation.',
			category: 'info',
			once: true,
			requirements: withLisaStrategy( 'Neutral', afterOpening() ),
			resultText: 'Lisa accepts the sentence because it contains no obvious lie. Unfortunately, it also contains no obvious truth. Office neutrality: somehow both boring and incriminating.',
			effects: {
				bars: {
					managementEscalates: 25,
				},
				flags: {
					keptOptionsOpenWithLisa: true,
				},
				signal: 'You kept truth and scheme paths open, but Lisa can tell you are not just casually curious.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_strategy_think_again',
			text: 'Think again.',
			category: 'info',
			advanceTurn: false,
			requirements: lisaStrategySelected,
			resultText: 'You reconsider before handing Lisa a version of the story with a paper trail attached.',
			effects: {
				flags: {
					lisaStrategyTruth: false,
					lisaStrategyScheme: false,
					lisaStrategyNeutral: false,
				},
				signal: 'You reconsider your approach with Lisa.',
			},
		},
	],
};

export default lisaArea;
