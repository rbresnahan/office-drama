export const forcedRules = [
	{
		id: 'lisa_process_check_rule',
		sceneId: 'forced_lisa_process_check',
		excludeSceneIds: [
			'lisa_area',
			'forced_lisa_process_check',
		],
		requirements: {
			phaseMin: 'narrative_building',
			barsMin: {
				managementEscalates: 25,
			},
			flagsNone: [
				'lisaProcessCheckHandled',
				'lisaIsDocumenting',
			],
		},
		effects: {
			flags: {
				lisaProcessCheckPending: true,
			},
			signal: 'Lisa has stepped out of the office-manager background and into your personal weather system.',
		},
	},
	{
		id: 'celia_looks_up_rule',
		sceneId: 'forced_celia_looks_up',
		excludeSceneIds: [
			'celia_area',
			'forced_celia_looks_up',
		],
		requirements: {
			phaseMin: 'pressure_rising',
			barsMin: {
				celiaFindsOut: 50,
			},
			flagsNone: [
				'celiaLookedUpHandled',
				'celiaHasFullEmail',
			],
		},
		effects: {
			flags: {
				celiaLookedUpPending: true,
			},
			signal: 'Celia looks up. Not enough to accuse you. Enough to make every casual movement feel rehearsed.',
		},
	},
	{
		id: 'devon_lisa_asking_frank_rule',
		sceneId: 'forced_devon_lisa_asking_frank',
		excludeSceneIds: [
			'break_room',
			'forced_devon_lisa_asking_frank',
			'forced_devon_frank_story_mutated',
		],
		requirements: {
			phaseMin: 'pressure_rising',
			hiddenEventsAll: [
				'betty_told_lisa_frank_suspicion',
			],
			flagsAll: [
				'devonCarryingFrankStory',
			],
			barsMin: {
				frameFrank: 50,
			},
			flagsNone: [
				'devonLisaAskingFrankHandled',
			],
		},
		effects: {
			flags: {
				devonLisaAskingFrankPending: true,
			},
			signal: 'Devon has heard Lisa asking about Frank, which means your rumor has found management-adjacent shoes.',
		},
	},
	{
		id: 'devon_frank_story_mutated_rule',
		sceneId: 'forced_devon_frank_story_mutated',
		excludeSceneIds: [
			'break_room',
			'forced_devon_lisa_asking_frank',
			'forced_devon_frank_story_mutated',
		],
		requirements: {
			phaseMin: 'pressure_rising',
			hiddenEventsAll: [
				'devon_spreads_frank_story',
			],
			barsMin: {
				frameFrank: 50,
				devonLeak: 25,
			},
			flagsNone: [
				'devonFrankStoryMutatedHandled',
			],
		},
		effects: {
			flags: {
				devonFrankStoryMutatedPending: true,
			},
			signal: 'Devon has repeated the Frank story back with new details, which is how rumors apply for management positions.',
		},
	},
	{
		id: 'frank_hears_his_name_rule',
		sceneId: 'forced_frank_hears_his_name',
		excludeSceneIds: [
			'break_room',
			'frank_desk',
			'forced_frank_hears_his_name',
			'forced_devon_lisa_asking_frank',
			'forced_devon_frank_story_mutated',
		],
		requirements: {
			phaseMin: 'pressure_rising',
			barsMin: {
				frameFrank: 50,
				frankRetaliates: 50,
			},
			hiddenEventsAny: [
				'betty_told_lisa_frank_suspicion',
				'devon_spreads_frank_story',
				'frank_bottle_planted_offscreen_ripple',
			],
			flagsNone: [
				'frankHearsHisNameHandled',
				'frankTalkedHonestly',
			],
		},
		effects: {
			flags: {
				frankHearsHisNamePending: true,
			},
			signal: 'Frank has heard enough of his name moving around the office to start looking for the source.',
		},
	},
	{
		id: 'tim_timeline_question_rule',
		sceneId: 'forced_tim_timeline_question',
		excludeSceneIds: [
			'tim_desk',
			'forced_tim_timeline_question',
			'forced_devon_lisa_asking_frank',
			'forced_devon_frank_story_mutated',
			'forced_frank_hears_his_name',
		],
		requirements: {
			phaseMin: 'pressure_rising',
			barsMin: {
				timSuspectsYou: 50,
			},
			flagsAny: [
				'timChecksRecallLogs',
				'knowsRecallLogsMatter',
				'timCheckingFrank',
				'timHasNotes',
				'timNotesDistracted',
				'systemAngleWithLisa',
				'morningSystemAngleRaised',
			],
			flagsNone: [
				'timTimelineQuestionHandled',
				'timConfrontedYou',
			],
		},
		effects: {
			flags: {
				timTimelineQuestionPending: true,
			},
			signal: 'Tim has found one timing question clean enough to carry across the office.',
		},
	},
];
