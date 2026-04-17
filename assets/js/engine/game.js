import {
	createStateStore,
	checkConditions,
	applyEffects,
} from "./state.js";
import {
	renderScene,
	renderMissingScene,
} from "./renderer.js";

function createGame(story, elements) {
	const stateStore = createStateStore(story.initialState || {});
	let currentSceneId = story.startScene;

	function getScene(sceneId) {
		return story.scenes[sceneId];
	}

	function getVisibleChoices(scene) {
		return (scene.choices || []).filter(function (choice) {
			return checkConditions(choice.conditions || [], stateStore.getState());
		});
	}

	function goToScene(sceneId) {
		currentSceneId = sceneId;
		render();
	}

	function choose(choice) {
		applyEffects(choice.effects || [], stateStore.getMutableState());
		goToScene(choice.nextScene);
	}

	function render() {
		const scene = getScene(currentSceneId);

		if (!scene) {
			renderMissingScene(elements, currentSceneId);
			return;
		}

		renderScene({
			elements,
			scene,
			state: stateStore.getState(),
			choices: getVisibleChoices(scene),
			onChoiceSelected: choose,
		});
	}

	function restart() {
		stateStore.reset();
		currentSceneId = story.startScene;
		render();
	}

	function start() {
		restart();
	}

	return {
		start,
		restart,
		getState: function () {
			return stateStore.getState();
		},
		getCurrentSceneId: function () {
			return currentSceneId;
		},
	};
}

export { createGame };