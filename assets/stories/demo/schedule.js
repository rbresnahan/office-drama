export const schedule = [
	{
		id: 'start',
		label: 'Start',
		time: '9:00 AM',
		turn: 1,
	},
	{
		id: 'morning_meeting',
		label: 'Stand Up',
		time: '10:13 AM',
		turn: 3,
		sceneId: 'schedule_morning_meeting',
		signal: 'The stand up starts in the conference room. People are pretending this is about priorities and not the bad email.',
	},
	{
		id: 'lunch',
		label: 'Lunch',
		time: '12:00 PM',
		turn: 6,
		sceneId: 'schedule_lunch',
		signal: 'Lunch begins. Food creates movement. Movement creates witnesses. Terrible ecosystem.',
	},
	{
		id: 'afternoon_meeting',
		label: 'Afternoon Checkup',
		time: '3:18 PM',
		turn: 10,
		sceneId: 'schedule_afternoon_meeting',
		signal: 'The afternoon checkup starts in the conference room. The day is running out of places to hide.',
	},
	{
		id: 'all_hands',
		label: 'All-Hands',
		time: '5:00 PM',
		turn: 12,
	},
];
