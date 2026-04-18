export const storyConfig = {
	meta: {
		id: 'demo-story',
		title: 'The Stone Room',
		author: 'Ryan',
		description: 'A tiny branching adventure sandbox.',
	},

	startNode: 'title',

	initialState: {
		courage: 0,
		trust: 0,
		health: 3,
		hasKey: false,
		spokeToStranger: false,
		sawHallwayFigure: false,
		hallwayEntered: false,
		confrontationSeen: false,
	},

	display: {
		stats: ['health', 'courage', 'trust'],
		inventory: [
			{
				key: 'hasKey',
				label: 'Iron Key',
			},
		],
		flags: [
			{
				key: 'spokeToStranger',
				label: 'Spoke to Stranger',
			},
			{
				key: 'sawHallwayFigure',
				label: 'Saw Hallway Figure',
			},
		],
	},

	nodes: {
		title: {
			text: 'Welcome to Choose Your Own Adventure.\n\nYou wake in darkness with no memory of how you got here.',
			entryFeedback: 'A low hum presses against the silence.',
			entryOnce: true,
			choices: [
				{
					text: 'Start Game',
					feedback: 'You steady yourself and take in the dark room.',
					next: 'start',
				},
			],
		},

		start: {
			redirect: [
				{
					condition: function (currentState) {
						return currentState.health <= 0;
					},
					next: 'ending_death',
					feedback: 'Your body gives out before you can even get your bearings.',
				},
				{
					condition: function (currentState) {
						return currentState.hasKey;
					},
					next: 'start_keyed',
					feedback: 'The room feels different now that you know what matters.',
				},
			],
			text: 'You wake in a locked stone room.\nA wooden door stands to the north. A small table sits in the corner.',
			entryFeedback: 'The air is cold enough to make the stone sweat.',
			choices: [
				{
					text: 'Search the table.',
					feedback: 'You move to the corner table and search it carefully.',
					next: 'table',
				},
				{
					text: 'Try the door.',
					feedback: 'You test the door and listen for movement beyond it.',
					next: 'door',
				},
			],
		},

		start_keyed: {
			text: 'You stand again in the stone room, but now the table means nothing. The key is already in your hand, and the door seems more honest than the room.',
			entryFeedback: 'The useless table now looks like part of a joke you already survived.',
			choices: [
				{
					text: 'Try the door.',
					feedback: 'You go straight for the only thing in this room that leads anywhere.',
					next: 'door',
				},
			],
		},

		table: {
			text: 'You search the table and find a small iron key tucked beneath a cracked bowl.',
			entryFeedback: 'Dust and ceramic grit cling to your fingertips.',
			choices: [
				{
					text: 'Take the key and go to the door.',
					feedback: 'You take the iron key and close your fist around it.',
					effects: {
						hasKey: { set: true },
					},
					next: 'door',
				},
				{
					text: 'Leave it and step away.',
					feedback: 'You leave the key where it is. Could be stupid. Could be noble. Hard to say.',
					next: 'door',
				},
			],
		},

		door: {
			text: 'You stand before the wooden door. From the other side, you hear slow footsteps.',
			entryFeedback: 'The footsteps pause just beyond the wood.',
			choices: [
				{
					text: 'Unlock and open the door.',
					condition: function (currentState) {
						return currentState.hasKey;
					},
					unavailableText: 'You need a key.',
					feedback: 'The key turns with a heavy click. The door groans open.',
					effects: {
						courage: { add: 1 },
						sawHallwayFigure: { set: true },
					},
					next: 'hallway',
				},
				{
					text: 'Bang on the door and call for help.',
					feedback: 'You pound on the wood and raise your voice. Someone answers.',
					effects: {
						trust: { add: 1 },
						spokeToStranger: { set: true },
					},
					next: 'stranger',
				},
				{
					text: 'Back away and wait in silence.',
					feedback: 'You retreat from the door and let fear make the next decision.',
					next: 'ending_coward',
				},
			],
		},

		stranger: {
			text: 'A voice answers from the other side: "If I open this, can I trust you?"',
			entryFeedback: 'The voice is calm. That somehow makes it worse.',
			choices: [
				{
					text: 'Say: "Yes. I just want out."',
					feedback: 'Your voice sounds thin, but honest enough.',
					effects: {
						trust: { add: 1 },
					},
					next: 'trusted_exit',
				},
				{
					text: 'Lie: "I am armed."',
					feedback: 'The silence on the other side hardens. That did not help.',
					effects: {
						courage: { add: 1 },
						trust: { add: -1 },
					},
					next: 'ending_silence',
				},
				{
					text: 'Say nothing.',
					feedback: 'You hold your breath and offer nothing back.',
					next: 'ending_silence',
				},
			],
		},

		hallway: {
			redirect: [
				{
					condition: function (currentState) {
						return currentState.health <= 0;
					},
					next: 'ending_death',
					feedback: 'Your legs fail under you before the hallway can decide what to do with you.',
				},
				{
					condition: function (currentState) {
						return currentState.trust >= 2;
					},
					next: 'trusted_exit',
					feedback: 'The stranger studies you once and seems to make up their mind.',
				},
			],
			text: function (currentState) {
				if (currentState.sawHallwayFigure) {
					return 'The door opens into a narrow hallway. A hooded stranger waits beside a stairwell, as if they expected you.';
				}

				return 'The door opens into a narrow hallway. Something shifts in the dark near the stairwell.';
			},
			entryFeedback: function (currentState) {
				if (!currentState.hallwayEntered) {
					return 'The air grows colder as the hallway opens up around you.';
				}

				return 'The hallway seems to remember you.';
			},
			entryEffects: {
				hallwayEntered: { set: true },
			},
			choices: [
				{
					text: 'Approach the stranger.',
					condition: function (currentState) {
						return currentState.courage >= 1;
					},
					unavailableText: 'You are not steady enough yet.',
					feedback: 'You force yourself forward instead of running.',
					next: 'confrontation',
				},
				{
					text: 'Run down the stairs.',
					feedback: 'You bolt for the stairwell before anything can stop you.',
					next: 'ending_escape',
				},
				{
					text: 'Search the hallway wall for a switch.',
					condition: function (currentState) {
						return currentState.courage >= 1;
					},
					unavailableText: 'You do not have the nerve to fumble around in the dark.',
					feedback: 'Your fingers scrape broken stone until something sharp cuts your hand. Then — click.',
					effects: {
						health: { add: -1 },
					},
					next: 'ending_secret',
				},
			],
		},

		confrontation: {
			redirect: {
				condition: function (currentState) {
					return currentState.trust >= 2;
				},
				next: 'trusted_exit',
				feedback: 'Before you can speak, the stranger lifts a hand and waves you through.',
			},
			text: 'The stranger studies you for a long moment.\n"You were meant to choose," they say.',
			entryFeedback: function (currentState) {
				if (!currentState.confrontationSeen) {
					return 'You hear footsteps above. More than one set.';
				}

				return 'The stranger does not seem surprised to see you again.';
			},
			entryEffects: {
				confrontationSeen: { set: true },
			},
			choices: [
				{
					text: 'Ask what they mean.',
					feedback: 'You keep your hands low and demand an answer.',
					next: 'ending_truth',
				},
				{
					text: 'Attack first.',
					feedback: 'You lunge too early. Bad plan. Real bad.',
					effects: {
						health: { set: 0 },
					},
					next: 'ending_bad_attack',
				},
			],
		},

		trusted_exit: {
			text: function (currentState) {
				if (currentState.trust >= 2) {
					return 'The door opens. A stranger lets you pass.\nBecause you chose trust, they show you a hidden path out.';
				}

				return 'The door opens just enough for you to slip through.';
			},
			entryFeedback: 'A latch lifts somewhere in the dark.',
			choices: [
				{
					text: 'Continue.',
					feedback: 'The stranger steps aside and you move carefully past.',
					next: 'ending_trust',
				},
			],
		},

		ending_escape: {
			text: 'You flee down the stairs and burst into the cold night air.\nYou survived, but you will never know what waited behind you.\n\nEnding: Escape',
			entryFeedback: 'Night air hits your lungs like a second life.',
			choices: [
				{
					text: 'Play Again',
					feedback: 'The room waits for another version of you to wake up.',
					next: 'restart',
				},
			],
		},

		ending_truth: {
			text: 'The stranger removes their hood.\nIt is you, older and scarred.\n\nEnding: The Truth',
			entryFeedback: 'For one rotten second, the face in front of you is your own.',
			choices: [
				{
					text: 'Play Again',
					feedback: 'Maybe this time you ask different questions.',
					next: 'restart',
				},
			],
		},

		ending_bad_attack: {
			redirect: {
				condition: function (currentState) {
					return currentState.health <= 0;
				},
				next: 'ending_death',
				feedback: 'The fall finishes what panic started.',
			},
			text: 'You lunge wildly. The stranger sidesteps and you tumble down the stairs.\n\nEnding: Fool\'s Fall',
			entryFeedback: function (currentState) {
				if (currentState.health <= 0) {
					return 'Your wound is getting worse. Then gravity takes over.';
				}

				return 'Your footing gives out before your courage does.';
			},
			choices: [
				{
					text: 'Play Again',
					feedback: 'Turns out panic is not a combat style.',
					next: 'restart',
				},
			],
		},

		ending_trust: {
			text: 'The hidden path leads you safely out. Somewhere behind you, the house seals shut forever.\n\nEnding: Trust Rewarded',
			entryFeedback: 'Behind you, stone grinds shut like a final answer.',
			choices: [
				{
					text: 'Play Again',
					feedback: 'Trust bought you one clean escape.',
					next: 'restart',
				},
			],
		},

		ending_coward: {
			text: 'You wait too long. The room grows colder. The footsteps stop.\nNothing ever opens again.\n\nEnding: Stillness',
			entryFeedback: 'The silence settles in like wet cement.',
			choices: [
				{
					text: 'Play Again',
					feedback: 'Doing nothing is still a choice. It just usually sucks.',
					next: 'restart',
				},
			],
		},

		ending_silence: {
			text: 'The voice waits. You do not answer.\nEventually the footsteps fade, leaving you alone with your caution.\n\nEnding: Silence',
			entryFeedback: 'Whatever was out there decides you are not worth the trouble.',
			choices: [
				{
					text: 'Play Again',
					feedback: 'Silence protects you right up until it doesn’t.',
					next: 'restart',
				},
			],
		},

		ending_secret: {
			text: 'Your fingers find a hidden switch in the stone. A section of wall opens.\nBehind it: food, light, and a way out.\n\nEnding: Off Script',
			entryFeedback: 'The wall shifts aside with the patience of an old machine.',
			choices: [
				{
					text: 'Play Again',
					feedback: 'A little blood, a little luck, and suddenly you are off the rails.',
					next: 'restart',
				},
			],
		},

		ending_death: {
			text: 'Your body gives out before the house does. Stone, dark, breath, then none of it.\n\nEnding: Dead Before Dawn',
			entryFeedback: 'Everything narrows to cold and weight.',
			choices: [
				{
					text: 'Play Again',
					feedback: 'Death is educational, but only if you get another run.',
					next: 'restart',
				},
			],
		},
	},
};