const intro = {
	id: 'intro',
	location: 'Before The Damage Control Begins',
	kicker: 'Intro',
	title: 'You sent the bad email.',
	body: [
		'The recall only partly worked.',
		'That means this is no longer a simple mistake. It is now a social physics problem with names, fragments, witnesses, and one all-hands meeting waiting at the end of the day.',
		'The bad email was about Celia. Some people may have seen the whole thing. Some may have seen pieces. Some may only know that something ugly happened, which is sometimes worse because imagination gets overtime pay.',
		'Your job is not to become innocent. That ship has sailed, hit a copier, and backed into HR. Your job is to survive the office narrative before the room decides what happened for you.',
	],
	internalThought: [
		'Green bars are stories, leverage, or containment routes you are building.',
		'Red bars are people and systems closing in on you.',
		'Movement does not cost a turn. Interactions do. Bad decisions remain extremely available.',
	],
	choices: [
		{
			id: 'start_damage_control',
			text: 'Start damage control.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'hub',
		},
	],
};

export default intro;