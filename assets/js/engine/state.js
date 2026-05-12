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
		};
	} );

	story.bars.red.forEach( ( bar ) => {
		bars[ bar.id ] = Number.isInteger( bar.initial ) ? bar.initial : 0;
		barThreads[ bar.id ] = {
			id: bar.id,
			label: bar.label,
			type: 'red',
			optional: Boolean( bar.optional ),
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

export function changeBar( state, barId, amount ) {
	const current = state.bars[ barId ] || 0;
	state.bars[ barId ] = clampBarValue( current + amount );
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
