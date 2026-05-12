const intro = {
	id: 'intro',
	location: 'Before The Damage Control Begins',
	kicker: 'Monday · 9:00 AM',
	title: 'Monday starts with an email you should not send.',
	body: ( state ) => {
		if ( state.flags.openingRecipientListSeen ) {
			return [
				'The office is quiet, but not normal quiet. The dangerous kind. Keyboard taps sound smaller. The printer sounds guilty. Somewhere, someone clears their throat with legal implications.',
				'The recipient list is still open on your screen. Celia was not the only person who could have seen it. Betty might have seen the room react. Lisa might already be turning this into process. Everyone else is still only a problem in theory, which is the last comfortable stage before disaster becomes a seating chart.',
				'Current objective: find out who has seen the email.',
			];
		}

		if ( state.flags.openingEmailSent ) {
			return [
				'The message leaves your outbox with the tiny confidence of a machine that does not understand consequences.',
				'Nothing happens for one second.',
				'Then your eyes move back to the recipient list.',
			];
		}

		if ( state.flags.openingEmailRead ) {
			return [
				'The email is still on the screen. A promotion announcement. A harmless little office ritual wrapped in corporate optimism and bullet points.',
				'Your reply is less harmless. It is a private complaint about Celia dressed up as a joke, which is how bad decisions sneak past security.',
				'It feels good for half a second. That is how the trap gets you. The send button is sitting there like it has never ruined a life before.',
			];
		}

		return [
			'Black screen.',
			'Monday. 9:00 AM.',
			'Traffic was stupid, coffee was weak, and your inbox already looks like it was assembled by raccoons with middle-management certificates.',
			'A promotion email is open on your screen. Celia is mentioned. So is the kind of cheerful office language that makes everyone pretend promotions are about teamwork instead of hierarchy with balloons.',
		];
	},
	internalThought: ( state ) => {
		if ( state.flags.openingRecipientListSeen ) {
			return [
				'The email has been sent. It was a mistake. Other people may have seen it. You need information before the office writes its own version of the story.',
				'For now, keep the world small: your computer, Betty, Lisa. Do not sprint into the full office like a fire alarm wearing pants.',
			];
		}

		if ( state.flags.openingEmailSent ) {
			return [
				'There is a tiny gap between action and consequence. Humans use this gap to invent hope. Computers use it to deliver evidence.',
			];
		}

		if ( state.flags.openingEmailRead ) {
			return [
				'This is the kind of reply you write to feel sane and delete to stay employed.',
				'Deleting would be wise. Today is apparently not about wisdom.',
			];
		}

		return [
			'Green bars are stories, leverage, or containment routes you are building.',
			'Red bars are people and systems closing in on you.',
			'Movement does not cost a turn. Interactions do. Bad decisions remain extremely available.',
		];
	},
	choices: [
		{
			id: 'opening_read_email',
			text: 'Read the promotion email.',
			category: 'info',
			once: true,
			advanceTurn: false,
			resultText: 'You read the promotion email, then the reply you should absolutely not send. The sentence about Celia has teeth. Tiny, career-shaped teeth.',
			effects: {
				flags: {
					openingEmailRead: true,
				},
				signal: 'The promotion email is harmless. Your reply is not.',
			},
			nextScene: 'intro',
		},
		{
			id: 'opening_click_send',
			text: 'Click Send.',
			category: 'danger',
			once: true,
			advanceTurn: false,
			requirements: {
				flagsAll: [
					'openingEmailRead',
				],
			},
			resultText: 'The send button clicks. For one second, nothing happens. That second is overqualified for the job.',
			effects: {
				flags: {
					openingEmailSent: true,
				},
				signal: 'The bad email has left your outbox.',
			},
			nextScene: 'intro',
		},
		{
			id: 'opening_notice_recipients',
			text: 'Look at the recipient list.',
			category: 'danger',
			once: true,
			advanceTurn: false,
			requirements: {
				flagsAll: [
					'openingEmailSent',
				],
			},
			resultText: 'You notice the recipient list. That was not supposed to go to everyone. The office does not explode. Worse: it stays quiet.',
			effects: {
				flags: {
					openingRecipientListSeen: true,
				},
				signal: 'Current objective: find out who has seen the email.',
			},
			nextScene: 'intro',
		},
		{
			id: 'start_damage_control',
			text: 'Start damage control: find out who saw it.',
			category: 'move',
			advanceTurn: false,
			requirements: {
				flagsAll: [
					'openingRecipientListSeen',
				],
			},
			effects: {
				flags: {
					guidedOpeningStarted: true,
				},
				unlocks: [
					'opening_reread_email',
				],
				signal: 'Current objective: find out who has seen the email.',
			},
			nextScene: 'hub',
		},
	],
};

export default intro;
