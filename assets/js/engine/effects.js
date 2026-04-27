import { changeBar, removeListValue, setListValue } from './state.js';

function applyMapValues( target, values = {} ) {
	Object.entries( values ).forEach( ( [ key, value ] ) => {
		target[ key ] = value;
	} );
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

	if ( effects.unsetFlags ) {
		effects.unsetFlags.forEach( ( flag ) => {
			delete state.flags[ flag ];
		} );
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

	if ( effects.signal ) {
		state.latestSignal = effects.signal;
	}

	state.feedback = choice.resultText || '';

	if ( choice.advanceTurn !== false ) {
		state.turn += 1;
	}
}