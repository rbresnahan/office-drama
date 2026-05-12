function afterOpening( requirements = {} ) {
	return {
		...requirements,
		flagsAll: [
			...( requirements.flagsAll || [] ),
			'openingFirstInteractionComplete',
		],
	};
}

const lisaArea = {
	id: 'lisa_area',
	location: 'Lisa’s Area',
	title: 'Lisa is already using the word “process.”',
	body: ( state ) => {
		const body = [
			'Lisa has a notebook open. Not a cute notebook. A notebook that will survive discovery.',
			'Her calendar is open to the all-hands invite. The title has not changed, but the room around it has.',
		];

		if ( ! state.flags.openingFirstInteractionComplete ) {
			body.push( 'She has not said anything to you yet. This is either mercy, professionalism, or the quiet part before paperwork.' );
		}

		if ( Array.isArray( state.hiddenEvents ) && state.hiddenEvents.includes( 'lisa_may_connect_missing_supplies' ) ) {
			body.push( 'A sticky note near her keyboard says “supplies?” with a question mark that feels legally active.' );
		}

		return body;
	},
	internalThought: ( state ) => {
		if ( ! state.flags.openingFirstInteractionComplete ) {
			return [
				'Lisa is the official route. That makes her useful, dangerous, and deeply allergic to improvisation.',
				'This first conversation can turn the mess into process, buy time, or start a system-blame route before the office turns personal.',
			];
		}

		return [
			'Lisa can make this official. You can cooperate, redirect her, or turn her into the reason this became bigger than it needed to be.',
		];
	},
	choices: [
		{
			id: 'opening_lisa_who_reported',
			text: 'Ask Lisa whether anyone has reported the email yet.',
			category: 'info',
			once: true,
			requirements: {
				flagsAll: [
					'guidedOpeningStarted',
				],
				flagsNone: [
					'openingFirstInteractionComplete',
				],
			},
			resultText: 'Lisa says no one has filed anything formal. The word “formal” lands on the desk like a stapler dropped from a height.',
			effects: {
				bars: {
					managementEscalates: 25,
				},
				flags: {
					openingFirstInteractionComplete: true,
					knowsLisaTalkedToManagement: true,
					knowsManagementPressure: true,
				},
				unlocks: [
					'lisa_ask_agenda',
					'lisa_process_explanation',
				],
				signal: 'No formal complaint yet. Lisa has introduced the concept, which is rude but useful.',
			},
			nextScene: 'hub',
		},
		{
			id: 'opening_lisa_process_cleanup',
			text: 'Own the mistake in boring process language.',
			category: 'cleanup',
			once: true,
			requirements: {
				flagsAll: [
					'guidedOpeningStarted',
				],
				flagsNone: [
					'openingFirstInteractionComplete',
				],
			},
			resultText: 'You say “reply-all mistake” and “corrective follow-up” with the dead-eyed calm of someone trying to tranquilize a spreadsheet. Lisa writes it down. That is not comfort. It is containment.',
			effects: {
				bars: {
					containCelia: 25,
					managementEscalates: 25,
				},
				flags: {
					openingFirstInteractionComplete: true,
					lisaCanDelayEscalation: true,
					knowsManagementPressure: true,
				},
				unlocks: [
					'lisa_process_explanation',
				],
				signal: 'You created a boring container for the problem. Boring is not innocence, but it buys minutes.',
			},
			nextScene: 'hub',
		},
		{
			id: 'opening_lisa_system_angle',
			text: 'Ask whether email recall logs can show who opened it.',
			category: 'underhanded',
			once: true,
			requirements: {
				flagsAll: [
					'guidedOpeningStarted',
				],
				flagsNone: [
					'openingFirstInteractionComplete',
				],
			},
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
				},
				unlocks: [
					'lisa_push_system_failure',
					'ask_tim_recall_logs',
				],
				signal: 'The recall-log route exists. So does the suspicion created by asking about it.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_ask_agenda',
			text: 'Ask why the all-hands invite changed.',
			category: 'info',
			once: true,
			requirements: afterOpening(),
			resultText: 'Lisa says leadership wants to address communication norms. Congratulations, you have become a norm.',
			effects: {
				bars: {
					managementEscalates: 25,
				},
				flags: {
					knowsLisaTalkedToManagement: true,
					knowsAllHandsAgendaShifted: true,
					knowsManagementPressure: true,
				},
				unlocks: [
					'lisa_overreacting_seed',
					'lisa_push_system_failure',
				],
				signal: 'Management is aware enough to be dangerous.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_process_explanation',
			text: 'Give Lisa a boring process-focused explanation.',
			category: 'cleanup',
			once: true,
			requirements: afterOpening( {
				barsMin: {
					managementEscalates: 25,
				},
			} ),
			resultText: 'Lisa writes less than you feared. Less is not nothing, but it is less.',
			effects: {
				bars: {
					managementEscalates: -25,
					blameSystem: -25,
				},
				flags: {
					lisaCanDelayEscalation: true,
				},
				signal: 'You lowered formal risk by becoming boring, but the system-blame route lost leverage.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_overreacting_seed',
			text: 'Suggest Lisa may be making this bigger than it needs to be.',
			category: 'underhanded',
			once: true,
			requirements: afterOpening( {
				phaseMin: 'narrative_building',
				flagsAny: [
					'knowsAllHandsAgendaShifted',
					'knowsManagementPressure',
				],
			} ),
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
			text: 'Push the system-failure angle through Lisa.',
			category: 'commitment',
			once: true,
			requirements: afterOpening( {
				phaseMin: 'pressure_rising',
				flagsAll: [
					'knowsAllHandsAgendaShifted',
					'knowsManagementPressure',
				],
				barsMin: {
					blameSystem: 50,
				},
			} ),
			resultText: 'Lisa hears “system issue” and starts building a process-shaped container around your personal disaster.',
			effects: {
				bars: {
					blameSystem: 25,
					managementEscalates: 25,
				},
				flags: {
					systemAngleWithLisa: true,
				},
				hiddenEvents: [
					'lisa_documents_system_angle',
				],
				queueVisibleAftermath: [
					'lisa_quietly_documents',
				],
				signal: 'The system route is stronger. So is the chance this becomes formal. Tiny tradeoff. Huge paperwork.',
			},
			nextScene: 'hub',
		},
	],
};

export default lisaArea;