import { applyChoiceEffects } from './effects.js';
import { requirementsMet } from './guards.js';
import { createInitialState, getCurrentPhase } from './state.js';

const RETURN_TO_PREVIOUS_SCENE = '__return__';
const VISIBLE_AFTERMATH_SCENE_ID = '__visible_aftermath__';

function getHubSceneId( story ) {
	return story.hubSceneId || story.startSceneId;
}

function getChoiceCategory( choice ) {
	const category = Array.isArray( choice.category ) ? choice.category[ 0 ] : choice.category;

	return category || 'neutral';
}

function cloneState( sourceState ) {
	return JSON.parse( JSON.stringify( sourceState ) );
}

function isStrategyParentChoice( choice ) {
	return Boolean( choice && /_strategy_(truth|scheme|neutral)$/.test( choice.id || '' ) );
}

function isStrategyThinkAgainChoice( choice ) {
	return Boolean( choice && /_strategy_think_again$/.test( choice.id || '' ) );
}

function isStrategyAngleChoice( choice ) {
	return Boolean( choice && String( choice.text || '' ).startsWith( 'Choose angle:' ) );
}

function isMenuChoice( choice ) {
	const text = choice.text || '';

	return (
		isStrategyParentChoice( choice ) ||
		isStrategyThinkAgainChoice( choice ) ||
		text.startsWith( 'Choose angle:' ) ||
		text === 'Choose a different angle.'
	);
}

function isRealFollowUpChoice( choice ) {
	return getChoiceCategory( choice ) !== 'move' && ! isMenuChoice( choice );
}

function getStrategyParentChoices( scene ) {
	return ( scene.choices || [] ).filter( isStrategyParentChoice );
}

function isStrategyScene( scene ) {
	return getStrategyParentChoices( scene ).length > 0;
}

function getMenuEffectFlagIds( scene ) {
	const flagIds = new Set();

	( scene.choices || [] ).forEach( ( choice ) => {
		const flags = choice.effects && choice.effects.flags;

		if ( ! isMenuChoice( choice ) || ! flags ) {
			return;
		}

		Object.entries( flags ).forEach( ( [ flagId, value ] ) => {
			if ( typeof value === 'boolean' ) {
				flagIds.add( flagId );
			}
		} );
	} );

	return flagIds;
}

function clearTemporaryStrategyState( scene, targetState ) {
	getMenuEffectFlagIds( scene ).forEach( ( flagId ) => {
		targetState.flags[ flagId ] = false;
	} );
}

function applyChoiceEffectsForCandidate( scene, candidateState, choice ) {
	if ( isStrategyParentChoice( choice ) ) {
		clearTemporaryStrategyState( scene, candidateState );
	}

	applyChoiceEffects( candidateState, choice );
}

function isVisibleAftermathScene( scene ) {
	return Boolean( scene && scene.id === VISIBLE_AFTERMATH_SCENE_ID );
}

function getVisibleAftermathBeat( story, state ) {
	const aftermathQueue = Array.isArray( state.visibleAftermathQueue ) ? state.visibleAftermathQueue : [];
	const aftermathId = aftermathQueue[ 0 ];

	if ( ! aftermathId || ! story.visibleAftermathBeats ) {
		return null;
	}

	return story.visibleAftermathBeats[ aftermathId ] || null;
}

function createVisibleAftermathScene( story, state ) {
	const beat = getVisibleAftermathBeat( story, state ) || {};

	return {
		id: VISIBLE_AFTERMATH_SCENE_ID,
		location: beat.location || 'Aftermath',
		kicker: beat.kicker || 'Aftermath',
		title: beat.title || 'The office keeps moving.',
		body: beat.body || [
			'The room shifts after you leave.',
		],
		internalThought: beat.internalThought || [],
		afterCurrentAction: true,
		disableLeave: true,
		choices: [
			{
				id: 'continue_visible_aftermath',
				text: beat.continueText || 'Continue.',
				category: 'move',
				advanceTurn: false,
				nextScene: RETURN_TO_PREVIOUS_SCENE,
				isSynthetic: true,
			},
		],
	};
}

function isBacklashScene( scene ) {
	return Boolean(
		scene &&
		(
			scene.forced === true ||
			scene.location === 'Backlash' ||
			String( scene.id || '' ).startsWith( 'backlash_' )
		)
	);
}

function isFinaleScene( story, scene ) {
	return Boolean( scene && scene.id === story.finaleSceneId );
}

function isAllHandsIntroScene( story, scene ) {
	return Boolean( story.allHandsIntroSceneId && scene && scene.id === story.allHandsIntroSceneId );
}

function isScheduleScene( scene ) {
	return Boolean( scene && scene.scheduleEvent === true );
}

function isNormalLocationScene( story, scene ) {
	if ( ! scene ) {
		return false;
	}

	if ( scene.id === story.startSceneId ) {
		return false;
	}

	if ( scene.id === getHubSceneId( story ) ) {
		return false;
	}

	if ( isFinaleScene( story, scene ) ) {
		return false;
	}

	if ( isAllHandsIntroScene( story, scene ) ) {
		return false;
	}

	if ( isBacklashScene( scene ) ) {
		return false;
	}

	if ( isScheduleScene( scene ) ) {
		return false;
	}

	if ( isVisibleAftermathScene( scene ) ) {
		return false;
	}

	return true;
}

function createLeaveChoice( scene, story ) {
	return {
		id: `leave_${ scene.id }`,
		text: 'Leave and return to the open office.',
		category: 'move',
		advanceTurn: false,
		nextScene: getHubSceneId( story ),
		isSynthetic: true,
	};
}

function shouldAddLeaveChoice( story, scene ) {
	if ( ! isNormalLocationScene( story, scene ) ) {
		return false;
	}

	if ( scene.disableLeave === true ) {
		return false;
	}

	return true;
}

function getEnvironmentalPressure( story, state ) {
	const redBars = story.bars.red || [];

	if ( ! redBars.length ) {
		return 0;
	}

	return Math.max( ...redBars.map( ( bar ) => state.bars[ bar.id ] || 0 ) );
}

function shouldStartFinale( story, state ) {
	if ( state.finaleStarted ) {
		return true;
	}

	if ( state.turn < state.maxTurns ) {
		return false;
	}

	return true;
}

function startFinale( story, state ) {
	state.finaleStarted = true;
	state.currentSceneId = story.allHandsIntroSceneId || story.finaleSceneId;
}

function shouldStayInCurrentLocation( story, scene, choice ) {
	if ( ! isNormalLocationScene( story, scene ) ) {
		return false;
	}

	if ( choice.stayInScene === false ) {
		return false;
	}

	if ( getChoiceCategory( choice ) === 'move' ) {
		return false;
	}

	return ! choice.nextScene || choice.nextScene === getHubSceneId( story );
}

function resolveReturnSceneId( story, state ) {
	const returnSceneId = state.pendingReturnSceneId || getHubSceneId( story );

	state.pendingReturnSceneId = '';

	return returnSceneId;
}

function getNextSceneId( story, state, scene, choice ) {
	if ( choice.nextScene === RETURN_TO_PREVIOUS_SCENE ) {
		return resolveReturnSceneId( story, state );
	}

	if ( shouldStayInCurrentLocation( story, scene, choice ) ) {
		return scene.id;
	}

	return choice.nextScene || getHubSceneId( story );
}

function getStoryScene( story, sceneId ) {
	return story.scenes[ sceneId ] || story.scenes[ story.startSceneId ];
}

function getAvailableStoryChoicesForState( scene, candidateState ) {
	return ( scene.choices || [] ).filter( ( choice ) => {
		if ( choice.once && candidateState.usedChoices.includes( choice.id ) ) {
			return false;
		}

		return requirementsMet( choice.requirements || {}, candidateState );
	} );
}

function hasAvailableRealFollowUp( story, scene, candidateState, seenMenuChoices = new Set() ) {
	const choices = getAvailableStoryChoicesForState( scene, candidateState );

	if ( choices.some( isRealFollowUpChoice ) ) {
		return true;
	}

	return choices.some( ( choice ) => {
		if ( ! isStrategyAngleChoice( choice ) ) {
			return false;
		}

		if ( seenMenuChoices.has( choice.id ) ) {
			return false;
		}

		const nextState = cloneState( candidateState );
		const nextSeenMenuChoices = new Set( seenMenuChoices );
		nextSeenMenuChoices.add( choice.id );
		applyChoiceEffectsForCandidate( scene, nextState, choice );

		const nextSceneId = getNextSceneId( story, nextState, scene, choice );
		const nextScene = getStoryScene( story, nextSceneId );

		return hasAvailableRealFollowUp( story, nextScene, nextState, nextSeenMenuChoices );
	} );
}

function applyRuleEffects( state, rule ) {
	if ( ! rule.effects ) {
		return;
	}

	if ( rule.effects.flags ) {
		Object.assign( state.flags, rule.effects.flags );
	}

	if ( rule.effects.npc ) {
		Object.assign( state.npc, rule.effects.npc );
	}

	if ( rule.effects.signal ) {
		state.latestSignal = rule.effects.signal;
	}
}

function ruleAllowsCurrentScene( rule, currentScene ) {
	if ( ! currentScene ) {
		return true;
	}

	if ( Array.isArray( rule.excludeSceneIds ) && rule.excludeSceneIds.includes( currentScene.id ) ) {
		return false;
	}

	if ( Array.isArray( rule.includeSceneIds ) && ! rule.includeSceneIds.includes( currentScene.id ) ) {
		return false;
	}

	return true;
}

function getScheduleEventSceneId( story, state ) {
	const scheduleItems = Array.isArray( story.schedule ) ? story.schedule : [];
	const matchingItem = scheduleItems.find( ( item ) => {
		if ( ! item.sceneId ) {
			return false;
		}

		if ( state.scheduleTriggered[ item.id ] ) {
			return false;
		}

		return state.turn >= item.turn;
	} );

	if ( ! matchingItem ) {
		return '';
	}

	state.scheduleTriggered[ matchingItem.id ] = true;

	if ( matchingItem.signal ) {
		state.latestSignal = matchingItem.signal;
	}

	return matchingItem.sceneId;
}

function hasPendingVisibleAftermath( story, state ) {
	const aftermathQueue = Array.isArray( state.visibleAftermathQueue ) ? state.visibleAftermathQueue : [];

	return aftermathQueue.some( ( aftermathId ) => {
		return Boolean( story.visibleAftermathBeats && story.visibleAftermathBeats[ aftermathId ] );
	} );
}

function shouldTriggerVisibleAftermath( story, state, scene, choice ) {
	if ( ! hasPendingVisibleAftermath( story, state ) ) {
		return false;
	}

	if ( ! isNormalLocationScene( story, scene ) ) {
		return false;
	}

	return getChoiceCategory( choice ) === 'move';
}

export function createGame( story ) {
	let state = createInitialState( story );

	function getState() {
		return state;
	}

	function restart() {
		state = createInitialState( story );
	}

	function getScene( sceneId ) {
		if ( sceneId === VISIBLE_AFTERMATH_SCENE_ID ) {
			return createVisibleAftermathScene( story, state );
		}

		return story.scenes[ sceneId ] || story.scenes[ story.startSceneId ];
	}

	function getCurrentScene() {
		if ( state.currentSceneId === VISIBLE_AFTERMATH_SCENE_ID ) {
			return getScene( VISIBLE_AFTERMATH_SCENE_ID );
		}

		if ( state.finaleStarted && state.currentSceneId === story.allHandsIntroSceneId ) {
			return getScene( story.allHandsIntroSceneId );
		}

		if ( state.finaleStarted ) {
			return getScene( story.finaleSceneId );
		}

		return getScene( state.currentSceneId );
	}

	function getAvailableChoices( scene = getCurrentScene() ) {
		const choices = getAvailableStoryChoicesForState( scene, state );
		const strategyParentChoices = getStrategyParentChoices( scene );
		const shouldRenderStrategyRow = strategyParentChoices.length > 0;
		const visibleChoices = shouldRenderStrategyRow
			? choices.filter( ( choice ) => ! isStrategyParentChoice( choice ) )
			: choices;

		let availableChoices = visibleChoices;

		if ( shouldRenderStrategyRow ) {
			const renderedStrategyChoices = strategyParentChoices.map( ( choice ) => ( {
				...choice,
				disabled: ! hasRealFollowUpForChoice( scene, choice.id ),
			} ) );

			availableChoices = [ ...renderedStrategyChoices, ...visibleChoices ];
		}

		if ( shouldAddLeaveChoice( story, scene ) ) {
			return [ ...availableChoices, createLeaveChoice( scene, story ) ];
		}

		return availableChoices;
	}

	function hasRealFollowUpForChoice( scene, choiceId ) {
		const choice = ( scene.choices || [] )
			.find( ( availableChoice ) => availableChoice.id === choiceId );

		if ( ! choice || ! isStrategyParentChoice( choice ) ) {
			return false;
		}

		const candidateState = cloneState( state );
		clearTemporaryStrategyState( scene, candidateState );

		if ( ! requirementsMet( choice.requirements || {}, candidateState ) ) {
			return false;
		}

		applyChoiceEffectsForCandidate( scene, candidateState, choice );

		const nextSceneId = getNextSceneId( story, candidateState, scene, choice );
		const nextScene = getStoryScene( story, nextSceneId );

		return hasAvailableRealFollowUp( story, nextScene, candidateState );
	}

	function getTriggeredBacklashSceneId() {
		const matchingRule = ( story.backlashRules || [] ).find( ( rule ) => {
			if ( state.backlashTriggered[ rule.id ] ) {
				return false;
			}

			return requirementsMet( rule.requirements || {}, state );
		} );

		if ( ! matchingRule ) {
			return '';
		}

		state.backlashTriggered[ matchingRule.id ] = true;
		applyRuleEffects( state, matchingRule );

		return matchingRule.sceneId;
	}

	function getTriggeredForcedSceneId( currentScene ) {
		if ( isBacklashScene( currentScene ) || isScheduleScene( currentScene ) || isAllHandsIntroScene( story, currentScene ) ) {
			return '';
		}

		const matchingRule = ( story.forcedRules || [] ).find( ( rule ) => {
			if ( state.forcedTriggered[ rule.id ] ) {
				return false;
			}

			if ( ! ruleAllowsCurrentScene( rule, currentScene ) ) {
				return false;
			}

			return requirementsMet( rule.requirements || {}, state );
		} );

		if ( ! matchingRule ) {
			return '';
		}

		state.forcedTriggered[ matchingRule.id ] = true;
		applyRuleEffects( state, matchingRule );

		return matchingRule.sceneId;
	}

	function triggerInterruptScene( sceneId, returnSceneId ) {
		state.pendingReturnSceneId = returnSceneId || getHubSceneId( story );
		state.currentSceneId = sceneId;
	}

	function clearCurrentVisibleAftermath() {
		if ( Array.isArray( state.visibleAftermathQueue ) && state.visibleAftermathQueue.length ) {
			state.visibleAftermathQueue.shift();
		}
	}

	function choose( choiceId ) {
		const scene = getCurrentScene();
		const availableChoices = getAvailableChoices( scene );
		const choice = availableChoices.find( ( availableChoice ) => availableChoice.id === choiceId );

		if ( ! choice ) {
			return;
		}

		if ( choice.disabled ) {
			return;
		}

		const shouldClearTemporaryStrategyAfterChoice = isStrategyScene( scene ) && isRealFollowUpChoice( choice );

		if ( isStrategyParentChoice( choice ) ) {
			clearTemporaryStrategyState( scene, state );
		}

		applyChoiceEffects( state, choice );

		if ( shouldClearTemporaryStrategyAfterChoice ) {
			clearTemporaryStrategyState( scene, state );
		}

		if ( isVisibleAftermathScene( scene ) ) {
			clearCurrentVisibleAftermath();
			state.currentSceneId = getNextSceneId( story, state, scene, choice );

			if ( shouldStartFinale( story, state ) ) {
				startFinale( story, state );
			}

			return;
		}

		if ( isAllHandsIntroScene( story, scene ) ) {
			state.finaleStarted = true;
			state.currentSceneId = choice.nextScene || story.finaleSceneId;
			return;
		}

		const nextSceneId = getNextSceneId( story, state, scene, choice );

		if ( shouldTriggerVisibleAftermath( story, state, scene, choice ) ) {
			triggerInterruptScene( VISIBLE_AFTERMATH_SCENE_ID, nextSceneId );
			return;
		}

		if ( shouldStartFinale( story, state ) ) {
			startFinale( story, state );
			return;
		}

		const backlashSceneId = getTriggeredBacklashSceneId();

		if ( backlashSceneId ) {
			triggerInterruptScene( backlashSceneId, nextSceneId );
			return;
		}

		const forcedSceneId = getTriggeredForcedSceneId( scene );

		if ( forcedSceneId ) {
			triggerInterruptScene( forcedSceneId, nextSceneId );
			return;
		}

		// Let authored immediate reactions resolve before calendar events take over.
		if ( hasPendingVisibleAftermath( story, state ) ) {
			state.currentSceneId = nextSceneId;
			return;
		}

		const scheduleSceneId = getScheduleEventSceneId( story, state );

		if ( scheduleSceneId ) {
			triggerInterruptScene( scheduleSceneId, nextSceneId );
			return;
		}

		state.currentSceneId = nextSceneId;
	}

	function getFinaleResult() {
		if ( typeof story.resolveFinale === 'function' ) {
			return story.resolveFinale( state );
		}

		return {
			kicker: 'All-Hands',
			title: 'The room decides what story survived.',
			body: [
				'The meeting starts. Every choice you made arrives before you do.',
			],
		};
	}

	function getPhase() {
		return getCurrentPhase( state );
	}

	function getPressure() {
		return getEnvironmentalPressure( story, state );
	}

	return {
		getState,
		getScene,
		getCurrentScene,
		getAvailableChoices,
		hasRealFollowUpForChoice,
		getFinaleResult,
		getPhase,
		getPressure,
		choose,
		restart,
		story,
	};
}
