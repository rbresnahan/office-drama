const timDesk = {
	id: 'tim_desk',
	location: 'Tim’s Desk',
	title: 'Tim has the expression of a man assembling a timeline.',
	body: [
		'Tim does not look angry. That is worse. Angry people react. Tim collects.',
		'His screen has three windows open. None of them look fun. A lunch bag with his name written in aggressive block letters sits beside his monitor.',
	],
	internalThought: [
		'If you send Tim toward the wrong technical question, you may buy time. If you learn his routines, you may unlock worse options. But every question you ask tells him what you are afraid of.',
	],
	choices: [
		{
			id: 'tim_notice_labeled_lunch',
			text: 'Notice the carefully labeled lunch bag beside Tim’s monitor.',
			category: 'info',
			once: true,
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
			resultText: 'Tim says he barely had time to prep, then taps a notebook with one finger. The notebook looks organized enough to hurt you.',
			effects: {
				flags: {
					timHasNotes: true,
					timChecksRecallLogs: true,
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
				},
				signal: 'The system-blame route is alive, but Tim noticed where you pointed.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_mention_frank_away',
			text: 'Mention that Frank was away from his desk around the wrong time.',
			category: 'underhanded',
			once: true,
			requirements: {
				barsMin: {
					frameFrank: 25,
				},
			},
			resultText: 'Tim writes nothing down. Somehow that is more threatening than writing it down.',
			effects: {
				bars: {
					frameFrank: 25,
					distractTim: 25,
					timSuspectsYou: 25,
				},
				flags: {
					timCheckingFrank: true,
				},
				unlocks: [
					'plant_bottle_frank',
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
			requirements: {
				flagsAll: [
					'timHasNotes',
				],
			},
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
			requirements: {
				barsMin: {
					timSuspectsYou: 25,
				},
			},
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
			requirements: {
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
			},
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
			requirements: {
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
			},
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
	],
};

export default timDesk;