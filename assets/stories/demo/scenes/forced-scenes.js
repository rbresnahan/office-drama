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

export const forcedDevonLisaAskingFrank = {
	id: 'forced_devon_lisa_asking_frank',
	location: 'Forced Interaction',
	kicker: 'Forced Event',
	forced: true,
	title: 'Devon catches you between desks.',
	body: [
		'Devon appears beside a filing cabinet with the careful casualness of a person trying to look like furniture.',
		'He says Lisa has been asking whether Frank seemed off today. He says it like a weather report. He watches you like weather can confess.',
	],
	internalThought: [
		'Betty carried the Frank suspicion to Lisa. Devon is carrying the echo back to you.',
		'The story has moved. That is useful. Movement also leaves tracks.',
	],
	choices: [
		{
			id: 'forced_devon_lisa_slow_him_down',
			text: 'Tell Devon Lisa is probably just doing her process thing.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'Devon looks mildly disappointed by the boring answer, which means the boring answer did its job.',
			effects: {
				bars: {
					devonLeak: -25,
					frameFrank: -25,
					frankRetaliates: -25,
					managementEscalates: 25,
				},
				flags: {
					devonLisaAskingFrankHandled: true,
				},
				signal: 'Devon has less story to carry. Lisa still has a process-shaped reason to keep asking.',
			},
			nextScene: '__return__',
		},
		{
			id: 'forced_devon_lisa_nudge_frank',
			text: 'Say Lisa is right to check whether Frank is under pressure.',
			category: 'underhanded',
			advanceTurn: false,
			once: true,
			resultText: 'Devon nods with the solemn gravity of a man about to make everything worse in three separate conversations.',
			effects: {
				bars: {
					devonLeak: 25,
					frameFrank: 25,
					frankRetaliates: 25,
					managementEscalates: 25,
				},
				flags: {
					devonLisaAskingFrankHandled: true,
				},
				signal: 'The Frank story gains speed, volume, and a small flashing warning light.',
			},
			nextScene: '__return__',
		},
	],
};

export const forcedDevonFrankStoryMutated = {
	id: 'forced_devon_frank_story_mutated',
	location: 'Forced Interaction',
	kicker: 'Forced Event',
	forced: true,
	title: 'Devon repeats the story back wrong.',
	body: [
		'Devon intercepts you near the hallway and lowers his voice to the exact volume everyone can still hear.',
		'He says Frank was “maybe hiding evidence from Lisa,” which is not what you said. It is, however, what your story has become after one trip through Devon.',
	],
	internalThought: [
		'The Frank rumor is now self-editing. That can bury you or bury Frank. Possibly both, if the office is feeling efficient.',
		'You can trim the mutation, or you can pretend it was always shaped like this.',
	],
	choices: [
		{
			id: 'forced_devon_mutation_correct_detail',
			text: 'Correct Devon just enough to make the rumor less weird.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'Devon accepts the correction with visible sadness. Accuracy is hard on his favorite hobbies.',
			effects: {
				bars: {
					devonLeak: -25,
					frameFrank: -25,
					frankRetaliates: -25,
					timSuspectsYou: 25,
				},
				flags: {
					devonFrankStoryMutatedHandled: true,
				},
				signal: 'The rumor gets less dramatic. Tim may still wonder why you are editing it so carefully.',
			},
			nextScene: '__return__',
		},
		{
			id: 'forced_devon_mutation_let_it_run',
			text: 'Let Devon keep the uglier version.',
			category: 'underhanded',
			advanceTurn: false,
			once: true,
			resultText: 'You do not correct him. The silence does work on your behalf, which is a horrible thing silence can do.',
			effects: {
				bars: {
					devonLeak: 25,
					frameFrank: 25,
					frankRetaliates: 25,
					timSuspectsYou: 25,
				},
				flags: {
					devonFrankStoryMutatedHandled: true,
				},
				signal: 'The mutated Frank story keeps moving. It is stronger now, and less obedient.',
			},
			nextScene: '__return__',
		},
	],
};

export const forcedFrankHearsHisName = {
	id: 'forced_frank_hears_his_name',
	location: 'Forced Interaction',
	kicker: 'Forced Event',
	forced: true,
	title: 'Frank hears his name moving.',
	body: [
		'Frank catches you near the edge of the open office, not blocking your path exactly, but close enough that leaving would become an answer.',
		'He says people keep stopping when he walks up. Lisa asked him one too-normal question. Betty looked sorry before she looked busy. He does not say you did anything. He does not have to know that much to know he is being aimed at.',
	],
	internalThought: [
		'Frank is not a theory anymore. Frank is a person noticing the shape of the theory.',
		'He does not know the whole route. He knows enough to push back against being turned into one.',
	],
	choices: [
		{
			id: 'forced_frank_boring_explanation',
			text: 'Calm him down with a boring, plausible explanation.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'You make it sound like ordinary office static: Lisa checking process, Betty overreading tone, everyone tired. Frank does not relax, but he stops sharpening every word.',
			effects: {
				bars: {
					frankRetaliates: -25,
					frameFrank: -25,
					managementEscalates: 25,
				},
				flags: {
					frankHearsHisNameHandled: true,
				},
				signal: 'Frank cools slightly. The formal office machinery still has a reason to keep turning.',
			},
			nextScene: '__return__',
		},
		{
			id: 'forced_frank_deflect_process',
			text: 'Deflect toward office rumor and process confusion.',
			category: 'underhanded',
			advanceTurn: false,
			once: true,
			resultText: 'You blame the day itself: recall confusion, hallway guesses, Lisa trying to make a clean timeline. Frank hears the explanation. He also hears you choosing every word.',
			effects: {
				bars: {
					frameFrank: 25,
					frankRetaliates: 25,
					managementEscalates: 25,
				},
				flags: {
					frankHearsHisNameHandled: true,
				},
				signal: 'The Frank story gets more structure. Frank gets more reason to hate the architecture.',
			},
			nextScene: '__return__',
		},
		{
			id: 'forced_frank_admit_questions',
			text: 'Admit people are asking, but avoid specifics.',
			category: 'neutral',
			advanceTurn: false,
			once: true,
			resultText: 'You give him the shape without the names. Yes, people are asking. No, you do not know exactly why. Frank watches the missing pieces more closely than the pieces you offered.',
			effects: {
				bars: {
					frankRetaliates: -25,
					timSuspectsYou: 25,
					managementEscalates: 25,
				},
				flags: {
					frankHearsHisNameHandled: true,
				},
				signal: 'Frank has enough honesty to slow down. Tim may notice how carefully the honesty stopped.',
			},
			nextScene: '__return__',
		},
	],
};

export const forcedTimTimelineQuestion = {
	id: 'forced_tim_timeline_question',
	location: 'Forced Interaction',
	kicker: 'Forced Event',
	forced: true,
	title: 'Tim has one timing question.',
	body: [
		'Tim steps beside you with his notebook closed over one finger, holding his place like the page might leave if unsupervised.',
		'He says he is reconciling the recall logs, Frank’s absence, and who suggested which explanation first. Then he asks where you were between the recall notice and the first person saying Frank’s name.',
	],
	internalThought: [
		'This is not an accusation. That would be easier.',
		'Tim has built a small procedural machine, and now he is checking whether you fit inside it.',
	],
	choices: [
		{
			id: 'forced_tim_boring_timestamp',
			text: 'Give Tim one boring timestamp.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'You give him a clean time and nothing decorative. Tim writes it down, which somehow feels both better and worse.',
			effects: {
				bars: {
					timSuspectsYou: -25,
					distractTim: -25,
					managementEscalates: 25,
				},
				flags: {
					timTimelineQuestionHandled: true,
				},
				signal: 'Tim has one fewer loose edge. The timeline also looks formal enough to invite management.',
			},
			nextScene: '__return__',
		},
		{
			id: 'forced_tim_recall_ambiguity',
			text: 'Redirect him toward recall and process ambiguity.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'You keep the answer inside systems: recall delays, log timing, people reacting to partial information. Tim accepts the category. He does not stop watching the person offering it.',
			effects: {
				bars: {
					blameSystem: 25,
					distractTim: 25,
					timSuspectsYou: 25,
				},
				flags: {
					timTimelineQuestionHandled: true,
				},
				signal: 'The system story gets more useful. Tim notices how useful you need it to be.',
			},
			nextScene: '__return__',
		},
		{
			id: 'forced_tim_frank_timing',
			text: 'Point him back toward Frank’s timing.',
			category: 'underhanded',
			advanceTurn: false,
			once: true,
			resultText: 'You keep it procedural: Frank was away, the timing was odd, people are just trying to account for movement. Tim writes down the word movement like it owes him money.',
			effects: {
				bars: {
					frameFrank: 25,
					distractTim: 25,
					timSuspectsYou: 25,
					frankRetaliates: 25,
				},
				flags: {
					timTimelineQuestionHandled: true,
				},
				signal: 'Tim turns back toward Frank’s timing. Frank may notice the room doing math around him.',
			},
			nextScene: '__return__',
		},
	],
};
