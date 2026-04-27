export const PHASES = [
	{
		id: 'damage_control',
		label: 'Damage Control',
		minTurn: 1,
		maxTurn: 3,
	},
	{
		id: 'narrative_building',
		label: 'Narrative Building',
		minTurn: 4,
		maxTurn: 7,
	},
	{
		id: 'pressure_rising',
		label: 'Pressure Rising',
		minTurn: 8,
		maxTurn: 10,
	},
	{
		id: 'final_setup',
		label: 'Final Setup',
		minTurn: 11,
		maxTurn: 12,
	},
	{
		id: 'finale',
		label: 'All-Hands',
		minTurn: 13,
		maxTurn: Number.POSITIVE_INFINITY,
	},
];

export const CHOICE_CATEGORIES = {
	POSITIVE: 'positive',
	UNDERHANDED: 'underhanded',
	NEUTRAL: 'neutral',
	INFO: 'info',
	CLEANUP: 'cleanup',
	COMMITMENT: 'commitment',
	PIVOT: 'pivot',
	MOVE: 'move',
};

export function getPhaseForTurn( turn ) {
	return PHASES.find( ( phase ) => turn >= phase.minTurn && turn <= phase.maxTurn ) || PHASES[ PHASES.length - 1 ];
}

export function getPhaseIndex( phaseId ) {
	return PHASES.findIndex( ( phase ) => phase.id === phaseId );
}

export function categoryLabel( category ) {
	const labels = {
		positive: 'Positive',
		underhanded: 'Underhanded',
		neutral: 'Neutral',
		info: 'Info',
		cleanup: 'Cleanup',
		commitment: 'Commit',
		pivot: 'Pivot',
		move: 'Move',
	};

	return labels[ category ] || 'Choice';
}