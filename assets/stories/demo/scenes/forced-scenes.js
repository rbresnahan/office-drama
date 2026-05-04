export const forcedLisaProcessCheck = {
	id: 'forced_lisa_process_check',
	location: 'Forced Interaction',
	kicker: 'Forced Event',
	forced: true,
	title: 'Lisa steps into your path.',
	body: [
		'Lisa catches you between places, which is how office managers remind you that the hallway is not neutral territory.',
		'She says leadership wants a cleaner account before the all-hands. She does not say “because of you.” She does not need to. The sentence has furniture.',
	],
	internalThought: [
		'Lisa is not gossip. Lisa is process with shoes.',
		'If she starts documenting too early, the game changes from social maneuvering to paper trail survival.',
	],
	choices: [
		{
			id: 'forced_lisa_give_clean_account',
			text: 'Give Lisa a clean, boring account and do not improvise.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'Lisa accepts the clean version because it is boring enough to file. Boring is not innocence, but it is sometimes shelter.',
			effects: {
				bars: {
					managementEscalates: -25,
					blameSystem: -25,
				},
				flags: {
					lisaProcessCheckHandled: true,
				},
				signal: 'Lisa backs off slightly. The formal route cools, but the system-blame story loses some scaffolding.',
			},
			nextScene: '__return__',
		},
		{
			id: 'forced_lisa_redirect_process',
			text: 'Redirect Lisa toward recall failure and process confusion.',
			category: 'underhanded',
			advanceTurn: false,
			once: true,
			resultText: 'Lisa accepts the process angle because process can be reviewed. That helps until the review includes you.',
			effects: {
				bars: {
					blameSystem: 25,
					managementEscalates: 25,
				},
				flags: {
					lisaProcessCheckHandled: true,
					lisaProcessRedirected: true,
				},
				signal: 'The system story gets stronger, but Lisa is closer to making the whole thing official.',
			},
			nextScene: '__return__',
		},
	],
};

export const forcedCeliaLooksUp = {
	id: 'forced_celia_looks_up',
	location: 'Forced Interaction',
	kicker: 'Forced Event',
	forced: true,
	title: 'Celia looks up.',
	body: [
		'Celia looks up from her screen and holds your face for half a second too long.',
		'It is not a confrontation. Not yet. It is worse in a smaller way: recognition without a script.',
	],
	internalThought: [
		'Celia may not have the full email yet, but she has enough shape to start asking the right wrong questions.',
		'If someone gets to her first, your version becomes the response instead of the frame.',
	],
	choices: [
		{
			id: 'forced_celia_soft_apology',
			text: 'Give Celia a small human apology without explaining.',
			category: 'positive',
			advanceTurn: false,
			once: true,
			resultText: 'Celia does not soften, exactly. But she hears a sentence that is not trying to sell her anything.',
			effects: {
				bars: {
					containCelia: 25,
					celiaFindsOut: -25,
				},
				flags: {
					celiaLookedUpHandled: true,
				},
				signal: 'Celia is not contained, but the room did not get sharper around her yet.',
			},
			nextScene: '__return__',
		},
		{
			id: 'forced_celia_act_normal',
			text: 'Act normal and let the moment pass.',
			category: 'neutral',
			advanceTurn: false,
			once: true,
			resultText: 'You act normal. It is a performance with weak lighting and too much audience participation.',
			effects: {
				bars: {
					celiaFindsOut: 25,
					timSuspectsYou: 25,
				},
				flags: {
					celiaLookedUpHandled: true,
				},
				signal: 'Celia noticed the performance. Tim may have noticed you performing it.',
			},
			nextScene: '__return__',
		},
	],
};