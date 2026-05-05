export const scheduleMorningMeeting = {
	id: 'schedule_morning_meeting',
	location: 'Conference Room',
	kicker: 'Scheduled Event',
	forced: true,
	scheduleEvent: true,
	title: 'The stand up tries to justify itself.',
	body: [
		'The conference room pulls everyone in for the Stand Up, because apparently the calendar also wants a statement.',
		'Lisa reviews priorities. Tim writes something down. Betty watches who reacts to which words. Celia is quiet in a way that makes the room more aware of its own breathing.',
		'Nobody says “the email.” That does not mean the email is absent. It is sitting in the meeting like an unpaid consultant.',
	],
	internalThought: [
		'This is the first scheduled pressure checkpoint. It did not come out of nowhere. It came from the conference room schedule, which is worse because it was preventable.',
		'You need routes, not vibes. Vibes are how people end up saying “I just feel like something is off,” which is office poison in mist form.',
	],
	choices: [
		{
			id: 'morning_meeting_stay_quiet',
			text: 'Stay quiet and let the stand up pass.',
			category: 'neutral',
			advanceTurn: false,
			once: true,
			resultText: 'You stay quiet. It is not brave, but it avoids giving Tim a fresh sentence to pin to the wall.',
			effects: {
				signal: 'The stand up passes without a clean accusation. For now, silence did not betray you.',
			},
			nextScene: '__return__',
		},
		{
			id: 'morning_meeting_push_system',
			text: 'Lightly mention email recall confusion as a general process issue.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'You make the recall sound like a process topic instead of a you topic. Lisa hears process. Tim hears direction.',
			effects: {
				bars: {
					blameSystem: 25,
					timSuspectsYou: 25,
				},
				flags: {
					morningSystemAngleRaised: true,
				},
				signal: 'System blame picked up structure, but Tim noticed your hand near the steering wheel.',
			},
			nextScene: '__return__',
		},
	],
};

export const scheduleLunch = {
	id: 'schedule_lunch',
	location: 'Lunch',
	kicker: 'Scheduled Event',
	forced: true,
	scheduleEvent: true,
	title: 'Lunch opens the map.',
	body: [
		'Lunch does what lunch always does: breaks the office into smaller rooms where people say larger things.',
		'The break room gets crowded. Tim checks his labeled food like a man verifying a treaty. Devon floats near the fridge with the spiritual discipline of a raccoon near a campground.',
		'People move. People notice movement. People later pretend they did not notice movement until it becomes useful.',
	],
	internalThought: [
		'Lunch is a timing window. If Tim’s routine matters, this is where it starts mattering loudly.',
		'The break room is dangerous because it looks casual. Casual is where people say the part they would not put in writing.',
	],
	choices: [
		{
			id: 'lunch_keep_moving',
			text: 'Keep moving and do not become part of a lunch cluster.',
			category: 'neutral',
			advanceTurn: false,
			once: true,
			resultText: 'You keep moving. Nobody gets a long look at you, which is almost the same as being subtle if nobody checks the tape.',
			effects: {
				signal: 'Lunch movement creates cover. It also creates witnesses. Office physics remain annoying.',
			},
			nextScene: '__return__',
		},
		{
			id: 'lunch_watch_tim',
			text: 'Watch whether Tim protects his lunch routine.',
			category: 'info',
			advanceTurn: false,
			once: true,
			resultText: 'Tim checks labels, containers, and the fridge shelf like the lunch bag has clearance levels.',
			effects: {
				flags: {
					knowsTimLunchRoutine: true,
				},
				unlocks: [
					'betty_ask_tim_lunch',
				],
				signal: 'Tim’s lunch routine is definitely a system. Systems can be disrupted. Terrible thought. Useful thought.',
			},
			nextScene: '__return__',
		},
	],
};

export const scheduleAfternoonMeeting = {
	id: 'schedule_afternoon_meeting',
	location: 'Conference Room',
	kicker: 'Scheduled Event',
	forced: true,
	scheduleEvent: true,
	title: 'The afternoon checkup is not helping.',
	body: [
		'The conference room collects everyone again for the Afternoon Checkup, a meeting title with the emotional honesty of a wet napkin.',
		'By afternoon, the office has stopped pretending the day is normal. It is still doing work, technically, in the same way a burning toaster is still an appliance.',
		'Lisa references the all-hands. Betty notices who stiffens. Tim looks like he has either found a pattern or badly wants one. Celia has become a silence with a chair.',
		'There is less day left than problem.',
	],
	internalThought: [
		'This is the last scheduled checkpoint before the all-hands pressure gate.',
		'Loose stories need commitment now. Half-built lies are just clues wearing rented shoes.',
	],
	choices: [
		{
			id: 'afternoon_meeting_stabilize',
			text: 'Stay boring and avoid adding new contradictions.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'You become operationally dull. It is emotionally unsatisfying and tactically useful.',
			effects: {
				bars: {
					managementEscalates: -25,
				},
				signal: 'You lowered the formal temperature slightly. The room still remembers heat.',
			},
			nextScene: '__return__',
		},
		{
			id: 'afternoon_meeting_commit_cover',
			text: 'Commit harder to the strongest surviving cover story.',
			category: 'commitment',
			advanceTurn: false,
			once: true,
			resultText: 'You stop keeping every route open. That makes one story stronger and every abandoned story resentful.',
			effects: {
				bars: {
					blameSystem: 25,
					managementEscalates: 25,
				},
				flags: {
					committedLateCoverStory: true,
				},
				signal: 'You committed late. The cover story has more shape now, and less room to dodge.',
			},
			nextScene: '__return__',
		},
	],
};
