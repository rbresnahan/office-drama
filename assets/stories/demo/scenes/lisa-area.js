const lisaArea = {
	id: 'lisa_area',
	location: 'Lisa’s Area',
	title: 'Lisa is already using the word “process.”',
	body: ( state ) => {
		const body = [
			'Lisa has a notebook open. Not a cute notebook. A notebook that will survive discovery.',
			'Her calendar is open to the all-hands invite. The title has not changed, but the room around it has.',
		];

		if ( Array.isArray( state.hiddenEvents ) && state.hiddenEvents.includes( 'lisa_may_connect_missing_supplies' ) ) {
			body.push( 'A sticky note near her keyboard says “supplies?” with a question mark that feels legally active.' );
		}

		return body;
	},
	internalThought: [
		'Lisa can make this official. You can cooperate, redirect her, or turn her into the reason this became bigger than it needed to be.',
	],
	choices: [
		{
			id: 'lisa_ask_agenda',
			text: 'Ask why the all-hands invite changed.',
			category: 'info',
			once: true,
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
			requirements: {
				barsMin: {
					managementEscalates: 25,
				},
			},
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
			requirements: {
				phaseMin: 'narrative_building',
				flagsAny: [
					'knowsAllHandsAgendaShifted',
					'knowsManagementPressure',
				],
			},
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
			requirements: {
				phaseMin: 'pressure_rising',
				flagsAll: [
					'knowsAllHandsAgendaShifted',
					'knowsManagementPressure',
				],
				barsMin: {
					blameSystem: 50,
				},
			},
			resultText: 'Lisa hears “system issue” and starts building a process-shaped container around your personal disaster.',
			effects: {
				bars: {
					blameSystem: 25,
					managementEscalates: 25,
				},
				flags: {
					systemAngleWithLisa: true,
				},
				signal: 'The system route is stronger. So is the chance this becomes formal. Tiny tradeoff. Huge paperwork.',
			},
			nextScene: 'hub',
		},
	],
};

export default lisaArea;