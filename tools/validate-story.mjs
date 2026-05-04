#!/usr/bin/env node

import { OFFICE_PANIC_STORY } from '../assets/stories/demo-story.js';

const strictMode = process.argv.includes( '--strict' );

const issues = {
	errors: [],
	warnings: [],
};

const specialSceneIds = new Set( [
	'__return__',
] );

const textLikeTypes = new Set( [
	'string',
	'function',
] );

function addError( message ) {
	issues.errors.push( message );
}

function addWarning( message ) {
	issues.warnings.push( message );
}

function isPlainObject( value ) {
	return Boolean(
		value &&
		typeof value === 'object' &&
		! Array.isArray( value )
	);
}

function isNonEmptyString( value ) {
	return typeof value === 'string' && value.trim().length > 0;
}

function isTextLike( value ) {
	if ( Array.isArray( value ) ) {
		return value.every( ( item ) => typeof item === 'string' );
	}

	return textLikeTypes.has( typeof value );
}

function formatChoiceLocation( sceneId, choice ) {
	if ( choice && choice.id ) {
		return `${ sceneId } → ${ choice.id }`;
	}

	return sceneId;
}

function getSceneIds( story ) {
	if ( ! isPlainObject( story.scenes ) ) {
		return [];
	}

	return Object.keys( story.scenes );
}

function getBarIds( story ) {
	const barIds = new Set();

	if ( ! isPlainObject( story.bars ) ) {
		return barIds;
	}

	for ( const groupName of Object.keys( story.bars ) ) {
		const group = story.bars[ groupName ];

		if ( ! Array.isArray( group ) ) {
			continue;
		}

		for ( const bar of group ) {
			if ( bar && isNonEmptyString( bar.id ) ) {
				barIds.add( bar.id );
			}
		}
	}

	return barIds;
}

function getAftermathIds( story ) {
	if ( ! isPlainObject( story.visibleAftermathBeats ) ) {
		return new Set();
	}

	return new Set( Object.keys( story.visibleAftermathBeats ) );
}

function collectChoices( story ) {
	const choices = [];

	for ( const [ sceneKey, scene ] of Object.entries( story.scenes || {} ) ) {
		if ( ! Array.isArray( scene.choices ) ) {
			continue;
		}

		for ( const choice of scene.choices ) {
			choices.push( {
				sceneKey,
				scene,
				choice,
			} );
		}
	}

	return choices;
}

function collectChoiceIds( choices ) {
	const choiceIds = new Set();
	const duplicateChoiceIds = new Set();

	for ( const { sceneKey, choice } of choices ) {
		if ( ! choice || ! isNonEmptyString( choice.id ) ) {
			addError( `Choice in scene "${ sceneKey }" is missing a valid id.` );
			continue;
		}

		if ( choiceIds.has( choice.id ) ) {
			duplicateChoiceIds.add( choice.id );
		}

		choiceIds.add( choice.id );
	}

	for ( const choiceId of duplicateChoiceIds ) {
		addError( `Duplicate choice id found: "${ choiceId }". Choice ids should be globally unique.` );
	}

	return choiceIds;
}

function validateTopLevelShape( story ) {
	const requiredStringFields = [
		'id',
		'title',
		'startSceneId',
		'hubSceneId',
		'allHandsIntroSceneId',
		'finaleSceneId',
		'emailSubject',
		'emailSummary',
		'initialSignal',
	];

	for ( const field of requiredStringFields ) {
		if ( ! isNonEmptyString( story[ field ] ) ) {
			addError( `Story is missing required string field "${ field }".` );
		}
	}

	if ( typeof story.maxTurns !== 'number' ) {
		addError( 'Story field "maxTurns" should be a number.' );
	}

	if ( typeof story.allHandsPressureThreshold !== 'number' ) {
		addError( 'Story field "allHandsPressureThreshold" should be a number.' );
	}

	if ( ! isPlainObject( story.visibleAftermathBeats ) ) {
		addError( 'Story field "visibleAftermathBeats" should be an object.' );
	}

	if ( ! Array.isArray( story.schedule ) ) {
		addError( 'Story field "schedule" should be an array.' );
	}

	if ( ! isPlainObject( story.bars ) ) {
		addError( 'Story field "bars" should be an object.' );
	}

	if ( ! Array.isArray( story.backlashRules ) ) {
		addError( 'Story field "backlashRules" should be an array.' );
	}

	if ( ! Array.isArray( story.forcedRules ) ) {
		addError( 'Story field "forcedRules" should be an array.' );
	}

	if ( ! isPlainObject( story.scenes ) ) {
		addError( 'Story field "scenes" should be an object.' );
	}

	if ( typeof story.resolveFinale !== 'function' ) {
		addError( 'Story field "resolveFinale" should be a function.' );
	}
}

function validateConfiguredSceneIds( story, sceneIds ) {
	const configuredSceneFields = [
		'startSceneId',
		'hubSceneId',
		'allHandsIntroSceneId',
		'finaleSceneId',
	];

	for ( const field of configuredSceneFields ) {
		const sceneId = story[ field ];

		if ( ! sceneIds.has( sceneId ) ) {
			addError( `Configured scene field "${ field }" points to missing scene "${ sceneId }".` );
		}
	}
}

function validateBars( story ) {
	if ( ! isPlainObject( story.bars ) ) {
		return;
	}

	for ( const groupName of Object.keys( story.bars ) ) {
		const group = story.bars[ groupName ];

		if ( ! Array.isArray( group ) ) {
			addError( `Bar group "${ groupName }" should be an array.` );
			continue;
		}

		const seenBarIds = new Set();

		for ( const bar of group ) {
			if ( ! isPlainObject( bar ) ) {
				addError( `Bar group "${ groupName }" contains a non-object bar entry.` );
				continue;
			}

			if ( ! isNonEmptyString( bar.id ) ) {
				addError( `Bar group "${ groupName }" contains a bar without a valid id.` );
			}

			if ( ! isNonEmptyString( bar.label ) ) {
				addError( `Bar "${ bar.id || 'unknown' }" is missing a valid label.` );
			}

			if ( typeof bar.initial !== 'number' ) {
				addError( `Bar "${ bar.id || 'unknown' }" is missing numeric initial value.` );
			}

			if ( bar.id && seenBarIds.has( bar.id ) ) {
				addError( `Duplicate bar id "${ bar.id }" found inside "${ groupName }".` );
			}

			if ( bar.id ) {
				seenBarIds.add( bar.id );
			}
		}
	}
}

function validateAftermath( story ) {
	if ( ! isPlainObject( story.visibleAftermathBeats ) ) {
		return;
	}

	for ( const [ aftermathKey, aftermath ] of Object.entries( story.visibleAftermathBeats ) ) {
		if ( ! isPlainObject( aftermath ) ) {
			addError( `Aftermath "${ aftermathKey }" should be an object.` );
			continue;
		}

		if ( aftermath.id !== aftermathKey ) {
			addWarning( `Aftermath key "${ aftermathKey }" has internal id "${ aftermath.id }". These should usually match.` );
		}

		if ( ! isNonEmptyString( aftermath.location ) ) {
			addWarning( `Aftermath "${ aftermathKey }" is missing location text.` );
		}

		if ( ! isNonEmptyString( aftermath.title ) ) {
			addError( `Aftermath "${ aftermathKey }" is missing title text.` );
		}

		if ( ! isTextLike( aftermath.body ) ) {
			addError( `Aftermath "${ aftermathKey }" has invalid body. Use a string, string array, or function.` );
		}

		if ( aftermath.internalThought && ! isTextLike( aftermath.internalThought ) ) {
			addError( `Aftermath "${ aftermathKey }" has invalid internalThought. Use a string, string array, or function.` );
		}
	}
}

function validateSchedule( story, sceneIds ) {
	if ( ! Array.isArray( story.schedule ) ) {
		return;
	}

	const scheduleIds = new Set();

	for ( const event of story.schedule ) {
		if ( ! isPlainObject( event ) ) {
			addError( 'Schedule contains a non-object entry.' );
			continue;
		}

		if ( ! isNonEmptyString( event.id ) ) {
			addError( 'Schedule event is missing a valid id.' );
		}

		if ( event.id && scheduleIds.has( event.id ) ) {
			addError( `Duplicate schedule event id "${ event.id }".` );
		}

		if ( event.id ) {
			scheduleIds.add( event.id );
		}

		if ( ! isNonEmptyString( event.label ) ) {
			addWarning( `Schedule event "${ event.id || 'unknown' }" is missing label.` );
		}

		if ( ! isNonEmptyString( event.time ) ) {
			addWarning( `Schedule event "${ event.id || 'unknown' }" is missing time.` );
		}

		if ( typeof event.turn !== 'number' ) {
			addError( `Schedule event "${ event.id || 'unknown' }" is missing numeric turn.` );
		}

		if ( event.sceneId && ! sceneIds.has( event.sceneId ) ) {
			addError( `Schedule event "${ event.id }" points to missing scene "${ event.sceneId }".` );
		}
	}
}

function validateRules( rules, label, sceneIds, barIds ) {
	if ( ! Array.isArray( rules ) ) {
		return;
	}

	const ruleIds = new Set();

	for ( const rule of rules ) {
		if ( ! isPlainObject( rule ) ) {
			addError( `${ label } contains a non-object rule.` );
			continue;
		}

		if ( ! isNonEmptyString( rule.id ) ) {
			addError( `${ label } contains a rule without a valid id.` );
		}

		if ( rule.id && ruleIds.has( rule.id ) ) {
			addError( `Duplicate ${ label } id "${ rule.id }".` );
		}

		if ( rule.id ) {
			ruleIds.add( rule.id );
		}

		if ( ! isNonEmptyString( rule.sceneId ) ) {
			addError( `${ label } rule "${ rule.id || 'unknown' }" is missing sceneId.` );
		} else if ( ! sceneIds.has( rule.sceneId ) ) {
			addError( `${ label } rule "${ rule.id }" points to missing scene "${ rule.sceneId }".` );
		}

		validateRequirementBars( rule.requirements, barIds, `${ label } rule "${ rule.id || 'unknown' }"` );
		validateEffectBars( rule.effects, barIds, `${ label } rule "${ rule.id || 'unknown' }"` );
	}
}

function validateSceneObjects( story ) {
	for ( const [ sceneKey, scene ] of Object.entries( story.scenes || {} ) ) {
		if ( ! isPlainObject( scene ) ) {
			addError( `Scene "${ sceneKey }" should be an object.` );
			continue;
		}

		if ( ! isNonEmptyString( scene.id ) ) {
			addError( `Scene "${ sceneKey }" is missing a valid id.` );
		}

		if ( scene.id && scene.id !== sceneKey ) {
			addWarning( `Scene key "${ sceneKey }" has internal id "${ scene.id }". These should usually match.` );
		}

		if ( ! isNonEmptyString( scene.location ) ) {
			addWarning( `Scene "${ sceneKey }" is missing location text.` );
		}

		if ( ! isNonEmptyString( scene.title ) ) {
			addError( `Scene "${ sceneKey }" is missing title text.` );
		}

		if ( scene.body && ! isTextLike( scene.body ) ) {
			addError( `Scene "${ sceneKey }" has invalid body. Use a string, string array, or function.` );
		}

		if ( scene.internalThought && ! isTextLike( scene.internalThought ) ) {
			addError( `Scene "${ sceneKey }" has invalid internalThought. Use a string, string array, or function.` );
		}

		if ( scene.choices && ! Array.isArray( scene.choices ) ) {
			addError( `Scene "${ sceneKey }" has choices, but choices is not an array.` );
		}
	}
}

function validateRequirementBars( requirements, barIds, location ) {
	if ( ! isPlainObject( requirements ) ) {
		return;
	}

	for ( const key of [ 'barsMin', 'barsMax' ] ) {
		if ( ! isPlainObject( requirements[ key ] ) ) {
			continue;
		}

		for ( const barId of Object.keys( requirements[ key ] ) ) {
			if ( ! barIds.has( barId ) ) {
				addError( `${ location } references unknown bar "${ barId }" in requirements.${ key }.` );
			}
		}
	}
}

function validateEffectBars( effects, barIds, location ) {
	if ( ! isPlainObject( effects ) || ! isPlainObject( effects.bars ) ) {
		return;
	}

	for ( const barId of Object.keys( effects.bars ) ) {
		if ( ! barIds.has( barId ) ) {
			addError( `${ location } references unknown bar "${ barId }" in effects.bars.` );
		}
	}
}

function validateChoiceSceneTargets( choices, sceneIds ) {
	for ( const { sceneKey, choice } of choices ) {
		if ( ! choice || ! isPlainObject( choice ) ) {
			addError( `Scene "${ sceneKey }" contains a non-object choice.` );
			continue;
		}

		const location = formatChoiceLocation( sceneKey, choice );

		if ( choice.nextScene && ! specialSceneIds.has( choice.nextScene ) && ! sceneIds.has( choice.nextScene ) ) {
			addError( `${ location } points to missing nextScene "${ choice.nextScene }".` );
		}

		if ( choice.category && typeof choice.category !== 'string' ) {
			addError( `${ location } has non-string category.` );
		}

		if ( choice.text && typeof choice.text !== 'string' ) {
			addError( `${ location } has non-string button text.` );
		}

		if ( ! choice.text ) {
			addWarning( `${ location } is missing button text.` );
		}

		if ( choice.resultText && ! isTextLike( choice.resultText ) ) {
			addError( `${ location } has invalid resultText. Use a string, string array, or function.` );
		}
	}
}

function validateChoiceReferences( choices, choiceIds ) {
	for ( const { sceneKey, choice } of choices ) {
		if ( ! choice || ! isPlainObject( choice ) ) {
			continue;
		}

		const location = formatChoiceLocation( sceneKey, choice );
		const requirements = choice.requirements || {};

		validateChoiceIdArray( requirements.usedChoicesAll, choiceIds, `${ location } requirements.usedChoicesAll` );
		validateChoiceIdArray( requirements.usedChoicesAny, choiceIds, `${ location } requirements.usedChoicesAny` );
		validateChoiceIdArray( requirements.usedChoicesNone, choiceIds, `${ location } requirements.usedChoicesNone` );

		if ( choice.effects ) {
			validateChoiceIdArray( choice.effects.unlocks, choiceIds, `${ location } effects.unlocks`, true );
			validateChoiceIdArray( choice.effects.locks, choiceIds, `${ location } effects.locks`, true );
		}
	}
}

function validateChoiceIdArray( value, choiceIds, location, warningOnly = false ) {
	if ( value === undefined ) {
		return;
	}

	if ( ! Array.isArray( value ) ) {
		addError( `${ location } should be an array.` );
		return;
	}

	for ( const choiceId of value ) {
		if ( ! choiceIds.has( choiceId ) ) {
			const message = `${ location } references unknown choice id "${ choiceId }".`;

			if ( warningOnly ) {
				addWarning( message );
			} else {
				addError( message );
			}
		}
	}
}

function validateChoiceEffects( choices, barIds, aftermathIds ) {
	for ( const { sceneKey, choice } of choices ) {
		if ( ! choice || ! isPlainObject( choice ) ) {
			continue;
		}

		const location = formatChoiceLocation( sceneKey, choice );
		const effects = choice.effects;

		validateRequirementBars( choice.requirements, barIds, location );
		validateEffectBars( effects, barIds, location );

		if ( ! isPlainObject( effects ) ) {
			continue;
		}

		if ( effects.queueVisibleAftermath !== undefined ) {
			if ( ! Array.isArray( effects.queueVisibleAftermath ) ) {
				addError( `${ location } effects.queueVisibleAftermath should be an array.` );
			} else {
				for ( const aftermathId of effects.queueVisibleAftermath ) {
					if ( ! aftermathIds.has( aftermathId ) ) {
						addError( `${ location } queues missing aftermath "${ aftermathId }".` );
					}
				}
			}
		}

		for ( const key of [ 'hiddenEvents', 'unlocks', 'locks', 'unsetFacts' ] ) {
			if ( effects[ key ] !== undefined && ! Array.isArray( effects[ key ] ) ) {
				addError( `${ location } effects.${ key } should be an array.` );
			}
		}

		for ( const key of [ 'facts', 'flags', 'npc' ] ) {
			if ( effects[ key ] !== undefined && ! isPlainObject( effects[ key ] ) ) {
				addError( `${ location } effects.${ key } should be an object.` );
			}
		}
	}
}

function printReport() {
	const errorCount = issues.errors.length;
	const warningCount = issues.warnings.length;

	console.log( '' );
	console.log( 'Office Panic story validation' );
	console.log( '=============================' );
	console.log( `Errors: ${ errorCount }` );
	console.log( `Warnings: ${ warningCount }` );

	if ( errorCount > 0 ) {
		console.log( '' );
		console.log( 'Errors' );
		console.log( '------' );

		for ( const error of issues.errors ) {
			console.log( `- ${ error }` );
		}
	}

	if ( warningCount > 0 ) {
		console.log( '' );
		console.log( 'Warnings' );
		console.log( '--------' );

		for ( const warning of issues.warnings ) {
			console.log( `- ${ warning }` );
		}
	}

	if ( errorCount === 0 && warningCount === 0 ) {
		console.log( '' );
		console.log( 'Clean. The story object passed validation.' );
	}

	if ( errorCount === 0 && warningCount > 0 && ! strictMode ) {
		console.log( '' );
		console.log( 'Passed with warnings. Use npm run validate:story:strict to fail on warnings too.' );
	}

	console.log( '' );
}

function main() {
	const story = OFFICE_PANIC_STORY;

	validateTopLevelShape( story );

	const sceneIds = new Set( getSceneIds( story ) );
	const barIds = getBarIds( story );
	const aftermathIds = getAftermathIds( story );
	const choices = collectChoices( story );
	const choiceIds = collectChoiceIds( choices );

	validateConfiguredSceneIds( story, sceneIds );
	validateBars( story );
	validateAftermath( story );
	validateSchedule( story, sceneIds );
	validateRules( story.backlashRules, 'Backlash rule', sceneIds, barIds );
	validateRules( story.forcedRules, 'Forced rule', sceneIds, barIds );
	validateSceneObjects( story );
	validateChoiceSceneTargets( choices, sceneIds );
	validateChoiceReferences( choices, choiceIds );
	validateChoiceEffects( choices, barIds, aftermathIds );

	printReport();

	if ( issues.errors.length > 0 ) {
		process.exit( 1 );
	}

	if ( strictMode && issues.warnings.length > 0 ) {
		process.exit( 1 );
	}
}

main();