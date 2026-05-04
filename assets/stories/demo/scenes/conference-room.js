function getScheduleRows( state ) {
	const turn = Number.isFinite( state.turn ) ? state.turn : 1;

	return [
		{
			label: 'Start',
			time: '9:00 AM',
			status: turn <= 1 ? 'Now' : 'Passed',
		},
		{
			label: 'Stand Up',
			time: '10:13 AM',
			status: turn < 3 ? 'Upcoming' : 'Passed',
		},
		{
			label: 'Lunch',
			time: '12:00 PM',
			status: turn < 6 ? 'Upcoming' : 'Passed',
		},
		{
			label: 'Catch Up',
			time: '3:18 PM',
			status: turn < 10 ? 'Upcoming' : 'Passed',
		},
		{
			label: 'All-Hands',
			time: '5:00 PM',
			status: turn < 12 ? 'Upcoming' : 'Now',
		},
	];
}

function formatScheduleRows( state ) {
	return getScheduleRows( state ).map(
		( item ) => `${ item.time } — ${ item.label } — ${ item.status }`
	);
}

function getScheduleRead( state ) {
	const turn = Number.isFinite( state.turn ) ? state.turn : 1;

	if ( turn < 3 ) {
		return 'The next thing on the board is the Stand Up. It looks pointless, which is how meetings avoid suspicion.';
	}

	if ( turn < 6 ) {
		return 'The Stand Up has passed. Lunch is next, which means the office will split into smaller rumor delivery zones.';
	}

	if ( turn < 10 ) {
		return 'Lunch has passed. The 3:18 PM Catch Up is next, because apparently the day needed a smaller meeting before the larger disaster.';
	}

	if ( turn < 12 ) {
		return 'Only the All-Hands remains. It sits at 5:00 PM with the calm confidence of a trap that sent an invite.';
	}

	return 'The useful part of the schedule is over. The rest is consequence.';
}

const conferenceRoom = {
	id: 'conference_room',
	location: 'Conference Room',
	kicker: 'Schedule Board',
	title: 'The day has a schedule. Rude.',
	body: ( state ) => [
		'The conference room is empty for now, but the schedule board is not. It has the smug confidence of something that knows where everyone will be later.',
		...formatScheduleRows( state ),
		getScheduleRead( state ),
	],
	internalThought: [
		'The schedule matters because it controls forced proximity.',
		'People can ignore drama at their desks. They cannot ignore it as easily in a conference room with bad chairs and shared eye contact.',
	],
	choices: [
		{
			id: 'conference_room_return_hub',
			text: 'Return to the open office.',
			category: 'move',
			advanceTurn: false,
			nextScene: 'hub',
		},
	],
};

export default conferenceRoom;