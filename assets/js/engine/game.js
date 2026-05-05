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

function hasPredeterminedAllHandsTrigger( state ) {
	return Boolean(
		state.flags.celiaHasFullEmail ||
		state.flags.lisaIsDocumenting ||
		state.flags.timConfrontedYou ||
		state.flags.frankKnowsHeIsTargeted ||
		state.flags.allHandsForced
	);
}

function shouldStartFinale( story, state ) {
	if ( state.finaleStarted ) {
		return true;
	}

	if ( state.turn <= state.maxTurns ) {
		return false;
	}

	const pressureThreshold = Number.isInteger( story.allHandsPressureThreshold ) ? story.allHandsPressureThreshold : 75;
	const environmentalPressure = getEnvironmentalPressure( story, state );

	return environmentalPressure >= pressureThreshold || hasPredeterminedAllHandsTrigger( state );
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
		const choices = ( scene.choices || [] ).filter( ( choice ) => {
			if ( choice.once && state.usedChoices.includes( choice.id ) ) {
				return false;
			}

			return requirementsMet( choice.requirements || {}, state );
		} );

		if ( shouldAddLeaveChoice( story, scene ) ) {
			return [ ...choices, createLeaveChoice( scene, story ) ];
		}

		return choices;
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

		applyChoiceEffects( state, choice );

		if ( isVisibleAftermathScene( scene ) ) {
			clearCurrentVisibleAftermath();
			state.currentSceneId = getNextSceneId( story, state, scene, choice );
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

		if ( shouldStartFinale( story, state ) ) {
			state.finaleStarted = true;
			state.currentSceneId = story.allHandsIntroSceneId || story.finaleSceneId;
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
		getFinaleResult,
		getPhase,
		getPressure,
		choose,
		restart,
		story,
	};
}
