import { getCurrentPhase } from './state.js';
import { getPhaseIndex } from './story-helpers.js';

function hasAll( source, values = [] ) {
	return values.every( ( value ) => Boolean( source[ value ] ) );
}

function hasNone( source, values = [] ) {
	return values.every( ( value ) => ! source[ value ] );
}

function hasAny( source, values = [] ) {
	return values.some( ( value ) => Boolean( source[ value ] ) );
}

function listHasAll( source, values = [] ) {
	return values.every( ( value ) => source.includes( value ) );
}

function listHasNone( source, values = [] ) {
	return values.every( ( value ) => ! source.includes( value ) );
}

function barsMeetMinimums( state, barsMin = {} ) {
	return Object.entries( barsMin ).every( ( [ barId, minimum ] ) => {
		return ( state.bars[ barId ] || 0 ) >= minimum;
	} );
}

function barsMeetMaximums( state, barsMax = {} ) {
	return Object.entries( barsMax ).every( ( [ barId, maximum ] ) => {
		return ( state.bars[ barId ] || 0 ) <= maximum;
	} );
}

function npcStateMatches( state, npc = {} ) {
	return Object.entries( npc ).every( ( [ key, expected ] ) => {
		return state.npc[ key ] === expected;
	} );
}

export function requirementsMet( requirements = {}, state ) {
	const currentPhase = getCurrentPhase( state );
	const currentPhaseIndex = getPhaseIndex( currentPhase.id );

	if ( requirements.phaseMin && currentPhaseIndex < getPhaseIndex( requirements.phaseMin ) ) {
		return false;
	}

	if ( requirements.phaseMax && currentPhaseIndex > getPhaseIndex( requirements.phaseMax ) ) {
		return false;
	}

	if ( Array.isArray( requirements.phases ) && ! requirements.phases.includes( currentPhase.id ) ) {
		return false;
	}

	if ( requirements.flagsAll && ! hasAll( state.flags, requirements.flagsAll ) ) {
		return false;
	}

	if ( requirements.flagsAny && ! hasAny( state.flags, requirements.flagsAny ) ) {
		return false;
	}

	if ( requirements.flagsNone && ! hasNone( state.flags, requirements.flagsNone ) ) {
		return false;
	}

	if ( requirements.npc && ! npcStateMatches( state, requirements.npc ) ) {
		return false;
	}

	if ( requirements.barsMin && ! barsMeetMinimums( state, requirements.barsMin ) ) {
		return false;
	}

	if ( requirements.barsMax && ! barsMeetMaximums( state, requirements.barsMax ) ) {
		return false;
	}

	if ( requirements.unlockedAll && ! listHasAll( state.unlocked, requirements.unlockedAll ) ) {
		return false;
	}

	if ( requirements.unlockedNone && ! listHasNone( state.unlocked, requirements.unlockedNone ) ) {
		return false;
	}

	if ( requirements.lockedNone && ! listHasNone( state.locked, requirements.lockedNone ) ) {
		return false;
	}

	if ( requirements.usedChoicesAll && ! listHasAll( state.usedChoices, requirements.usedChoicesAll ) ) {
		return false;
	}

	if ( requirements.usedChoicesNone && ! listHasNone( state.usedChoices, requirements.usedChoicesNone ) ) {
		return false;
	}

	return true;
}