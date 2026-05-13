import { getPhaseForTurn } from './story-helpers.js';

export function createInitialState( story ) {
	const bars = {};
	const barThreads = {};
	const facts = {};

	story.bars.green.forEach( ( bar ) => {
		bars[ bar.id ] = Number.isInteger( bar.initial ) ? bar.initial : 0;
		barThreads[ bar.id ] = {
			id: bar.id,
			label: bar.label,
			type: 'green',
			optional: Boolean( bar.optional ),
			capUntil: bar.capUntil || null,
		};
	} );

	story.bars.red.forEach( ( bar ) => {
		bars[ bar.id ] = Number.isInteger( bar.initial ) ? bar.initial : 0;
		barThreads[ bar.id ] = {
			id: bar.id,
			label: bar.label,
			type: 'red',
			optional: Boolean( bar.optional ),
			capUntil: bar.capUntil || null,
		};
	} );

	return {
		turn: 1,
		maxTurns: story.maxTurns || 24,
		currentSceneId: story.startSceneId,
		pendingReturnSceneId: '',
		finaleStarted: false,
		bars,
		flags: facts,
		facts,
		barThreads,
		hiddenEvents: [],
		npc: {},
		unlocked: [],
		locked: [],
		usedChoices: [],
		usedScenes: [],
		backlashTriggered: {},
		forcedTriggered: {},
		scheduleTriggered: {},
		visibleAftermathQueue: [],
		latestSignal: story.initialSignal || '',
		feedback: '',
		history: [],
	};
}

export function getCurrentPhase( state ) {
	if ( state.finaleStarted ) {
		return getPhaseForTurn( state.maxTurns + 1 );
	}

	if ( state.turn > state.maxTurns ) {
		return getPhaseForTurn( state.maxTurns );
	}

	return getPhaseForTurn( state.turn );
}

export function clampBarValue( value ) {
	if ( value < 0 ) {
		return 0;
	}

	if ( value > 100 ) {
		return 100;
	}

	return value;
}

function anyStateValuePresent( source = {}, values = [] ) {
	return values.some( ( value ) => Boolean( source[ value ] ) );
}

function isBarCapUnlocked( state, capUntil = {} ) {
	const flags = state.flags || {};
	const facts = state.facts || flags;

	if ( Array.isArray( capUntil.flagsAny ) && anyStateValuePresent( flags, capUntil.flagsAny ) ) {
		return true;
	}

	if ( Array.isArray( capUntil.factsAny ) && anyStateValuePresent( facts, capUntil.factsAny ) ) {
		return true;
	}

	return false;
}

export function changeBar( state, barId, amount ) {
	const current = state.bars[ barId ] || 0;
	const capUntil = state.barThreads && state.barThreads[ barId ] && state.barThreads[ barId ].capUntil;
	let nextValue = clampBarValue( current + amount );

	if ( capUntil && ! isBarCapUnlocked( state, capUntil ) && nextValue > capUntil.value ) {
		nextValue = capUntil.value;
	}

	state.bars[ barId ] = nextValue;
}

export function setListValue( list, value ) {
	if ( ! list.includes( value ) ) {
		list.push( value );
	}
}

export function removeListValue( list, value ) {
	const index = list.indexOf( value );

	if ( index >= 0 ) {
		list.splice( index, 1 );
	}
}
