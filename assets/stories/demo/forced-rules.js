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
];