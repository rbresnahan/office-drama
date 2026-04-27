import { applyChoiceEffects } from './effects.js';
import { requirementsMet } from './guards.js';
import { createInitialState, getCurrentPhase } from './state.js';

export function createGame( story ) {
	let state = createInitialState( story );

	function getState() {
		return state;
	}

	function restart() {
		state = createInitialState( story );
	}

	function getScene( sceneId ) {
		return story.scenes[ sceneId ] || story.scenes[ story.startSceneId ];
	}

	function getCurrentScene() {
		if ( state.finaleStarted || state.turn > state.maxTurns ) {
			return getScene( story.finaleSceneId );
		}

		return getScene( state.currentSceneId );
	}

	function getAvailableChoices( scene = getCurrentScene() ) {
		return ( scene.choices || [] ).filter( ( choice ) => {
			if ( choice.once && state.usedChoices.includes( choice.id ) ) {
				return false;
			}

			return requirementsMet( choice.requirements || {}, state );
		} );
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

		if ( matchingRule.effects ) {
			if ( matchingRule.effects.flags ) {
				Object.assign( state.flags, matchingRule.effects.flags );
			}

			if ( matchingRule.effects.npc ) {
				Object.assign( state.npc, matchingRule.effects.npc );
			}

			if ( matchingRule.effects.signal ) {
				state.latestSignal = matchingRule.effects.signal;
			}
		}

		return matchingRule.sceneId;
	}

	function choose( choiceId ) {
		const scene = getCurrentScene();
		const availableChoices = getAvailableChoices( scene );
		const choice = availableChoices.find( ( availableChoice ) => availableChoice.id === choiceId );

		if ( ! choice ) {
			return;
		}

		applyChoiceEffects( state, choice );

		if ( state.turn > state.maxTurns ) {
			state.finaleStarted = true;
			state.currentSceneId = story.finaleSceneId;
			return;
		}

		const backlashSceneId = getTriggeredBacklashSceneId();

		if ( backlashSceneId ) {
			state.currentSceneId = backlashSceneId;
			return;
		}

		state.currentSceneId = choice.nextScene || story.startSceneId;
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

	return {
		getState,
		getScene,
		getCurrentScene,
		getAvailableChoices,
		getFinaleResult,
		getPhase,
		choose,
		restart,
		story,
	};
}