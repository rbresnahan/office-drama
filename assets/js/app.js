import { createGame } from "./engine/game.js";
import { demoStory } from "./stories/demo-story.js";

const elements = {
	card: document.getElementById("game-card"),
	title: document.getElementById("scene-title"),
	text: document.getElementById("scene-text"),
	choices: document.getElementById("choices"),
	restartButton: document.getElementById("restart-button"),
};

const game = createGame(demoStory, elements);

game.start();

elements.restartButton.addEventListener("click", function () {
	game.restart();
});