import { changeBar, removeListValue, setListValue } from './state.js';

function applyMapValues( target, values = {} ) {
	Object.entries( values ).forEach( ( [ key, value ] ) => {
		target[ key ] = value;
	} );
}

function unsetMapValues( target, values = [] ) {
	values.forEach( ( key ) => {
		delete target[ key ];
	} );
}

function normalizeList( value = [] ) {
	if ( Array.isArray( value ) ) {
		return value;
	}

	if ( typeof value === 'string' && value.trim() ) {
		return [ value ];
	}

	return [];
}

function getFactState( state ) {
	return state.facts || state.flags;
}

function applyUnlocks( state, unlocks = [] ) {
	unlocks.forEach( ( unlock ) => {
		setListValue( state.unlocked, unlock );
		removeListValue( state.locked, unlock );
	} );
}

function applyLocks( state, locks = [] ) {
	locks.forEach( ( lock ) => {
		setListValue( state.locked, lock );
		removeListValue( state.unlocked, lock );
	} );
}

function queueVisibleAftermath( state, aftermathIds = [] ) {
	if ( ! Array.isArray( state.visibleAftermathQueue ) ) {
		state.visibleAftermathQueue = [];
	}

	normalizeList( aftermathIds ).forEach( ( aftermathId ) => {
		setListValue( state.visibleAftermathQueue, aftermathId );
	} );
}

function addHiddenEvents( state, hiddenEvents = [] ) {
	if ( ! Array.isArray( state.hiddenEvents ) ) {
		state.hiddenEvents = [];
	}

	normalizeList( hiddenEvents ).forEach( ( hiddenEvent ) => {
		setListValue( state.hiddenEvents, hiddenEvent );
	} );
}

function removeHiddenEvents( state, hiddenEvents = [] ) {
	if ( ! Array.isArray( state.hiddenEvents ) ) {
		state.hiddenEvents = [];
	}

	normalizeList( hiddenEvents ).forEach( ( hiddenEvent ) => {
		removeListValue( state.hiddenEvents, hiddenEvent );
	} );
}

export function applyChoiceEffects( state, choice ) {
	const effects = choice.effects || {};

	state.usedChoices.push( choice.id );

	state.history.push( {
		turn: state.turn,
		sceneId: state.currentSceneId,
		choiceId: choice.id,
		choiceText: choice.text,
	} );

	if ( effects.bars ) {
		Object.entries( effects.bars ).forEach( ( [ barId, amount ] ) => {
			changeBar( state, barId, amount );
		} );
	}

	if ( effects.flags ) {
		applyMapValues( state.flags, effects.flags );
	}

	if ( effects.facts ) {
		applyMapValues( getFactState( state ), effects.facts );
	}

	if ( effects.unsetFlags ) {
		unsetMapValues( state.flags, effects.unsetFlags );
	}

	if ( effects.unsetFacts ) {
		unsetMapValues( getFactState( state ), effects.unsetFacts );
	}

	if ( effects.npc ) {
		applyMapValues( state.npc, effects.npc );
	}

	if ( effects.unlocks ) {
		applyUnlocks( state, effects.unlocks );
	}

	if ( effects.locks ) {
		applyLocks( state, effects.locks );
	}

	if ( effects.queueVisibleAftermath ) {
		queueVisibleAftermath( state, effects.queueVisibleAftermath );
	}

	if ( effects.hiddenEvents ) {
		addHiddenEvents( state, effects.hiddenEvents );
	}

	if ( effects.removeHiddenEvents ) {
		removeHiddenEvents( state, effects.removeHiddenEvents );
	}

	if ( effects.signal ) {
		state.latestSignal = effects.signal;
	}

	state.feedback = choice.resultText || '';

	if ( choice.advanceTurn !== false ) {
		state.turn += 1;
	}
}