export const backlashRules = [
	{
		id: 'celia_backlash_rule',
		sceneId: 'backlash_celia',
		requirements: {
			barsMin: {
				celiaFindsOut: 100,
			},
		},
		effects: {
			flags: {
				celiaHasFullEmail: true,
			},
			signal: 'Celia has the full message now. That is not a vibe. That is evidence.',
		},
	},
	{
		id: 'tim_backlash_rule',
		sceneId: 'backlash_tim',
		requirements: {
			barsMin: {
				timSuspectsYou: 75,
			},
		},
		effects: {
			flags: {
				timConfrontedYou: true,
			},
			signal: 'Tim has stopped asking broad questions. He is asking precise ones now.',
		},
	},
	{
		id: 'frank_backlash_rule',
		sceneId: 'backlash_frank',
		requirements: {
			barsMin: {
				frankRetaliates: 75,
				frameFrank: 50,
			},
		},
		effects: {
			flags: {
				frankKnowsHeIsTargeted: true,
			},
			signal: 'Frank can feel the room turning. He is looking for the hand on the wheel.',
		},
	},
	{
		id: 'betty_backlash_rule',
		sceneId: 'backlash_betty',
		requirements: {
			barsMin: {
				bettyLosesTrust: 75,
			},
		},
		effects: {
			flags: {
				bettyConfrontedYou: true,
			},
			signal: 'Betty is not confused anymore. That is bad, because confused Betty was useful.',
		},
	},
	{
		id: 'management_backlash_rule',
		sceneId: 'backlash_lisa',
		requirements: {
			barsMin: {
				managementEscalates: 75,
			},
		},
		effects: {
			flags: {
				lisaIsDocumenting: true,
			},
			signal: 'Lisa has started documenting. The word “process” has entered the chat.',
		},
	},
];