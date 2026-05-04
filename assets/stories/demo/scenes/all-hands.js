export const allHandsIntro = {
	id: 'all_hands_intro',
	location: 'All-Hands',
	kicker: 'Forced Event',
	forced: true,
	title: 'The all-hands begins.',
	body: [
		'The room gathers with the quiet discipline of people pretending they are not excited by a disaster.',
		'Lisa has her notebook. Tim has whatever timeline survived your interference. Betty has a face that says she knows more than she intends to say. Frank looks like a man calculating whether anger or silence is more expensive. Celia is the reason nobody is making jokes out loud.',
		'Whatever story has the most support now gets the microphone. Whatever threat got too hot gets teeth. The office does not need the truth. It needs a version it can stand around without feeling stupid.',
	],
	internalThought: [
		'This is the handoff from tactics to consequence.',
		'The final board state decides which story survives the room.',
	],
	choices: [
		{
			id: 'enter_all_hands',
			text: 'Step into the all-hands.',
			category: 'commitment',
			advanceTurn: false,
			nextScene: 'final_all_hands',
		},
	],
};

export const finalAllHands = {
	id: 'final_all_hands',
	location: 'All-Hands',
	kicker: 'Finale',
	title: 'The all-hands begins.',
	body: [
		'This fallback text should be replaced by the finale resolver.',
	],
	choices: [],
};