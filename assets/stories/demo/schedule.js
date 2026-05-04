export const schedule = [
	{
		id: 'start',
		label: 'Start',
		time: '9:00 AM',
		turn: 1,
	},
	{
		id: 'morning_meeting',
		label: 'Morning Meeting',
		time: '10:13 AM',
		turn: 3,
		sceneId: 'schedule_morning_meeting',
		signal: 'The morning meeting interrupts the day. People are pretending the bad email is not in the room.',
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
		label: 'Afternoon Meeting',
		time: '3:18 PM',
		turn: 10,
		sceneId: 'schedule_afternoon_meeting',
		signal: 'The afternoon meeting window tightens the room. The day is running out of places to hide.',
	},
	{
		id: 'all_hands',
		label: 'All-Hands',
		time: '5:00 PM',
		turn: 12,
	},
];