import { storyConfig } from '../stories/demo-story.js';
import { Renderer } from './engine/renderer.js';
import { Game } from './engine/game.js';

const renderer = new Renderer({
	storyEl: document.getElementById('story'),
	choicesEl: document.getElementById('choices'),
	statsEl: document.getElementById('stats'),
	inventoryEl: document.getElementById('inventory'),
	flagsEl: document.getElementById('flags'),
	feedbackEl: document.getElementById('feedback'),
	logEl: document.getElementById('log'),
});

const game = new Game({
	storyConfig,
	renderer,
});

game.start();