import { storyConfig } from '../stories/demo-story.js';
import { Renderer } from './engine/renderer.js';
import { Game } from './engine/game.js';

const renderer = new Renderer({
	storyEl: document.getElementById('story'),
	choicesEl: document.getElementById('choices'),
	statusEl: document.getElementById('status-panel'),
	signalEl: document.getElementById('latest-signal'),
	sectionEls: {
		a: document.getElementById('section-a-panel'),
		b: document.getElementById('section-b-panel'),
		c: document.getElementById('section-c-panel'),
		d: document.getElementById('section-d-panel'),
	},
	sectionTitleEls: {
		a: document.getElementById('section-a-title'),
		b: document.getElementById('section-b-title'),
		c: document.getElementById('section-c-title'),
		d: document.getElementById('section-d-title'),
	},
	titleEl: document.getElementById('app-title'),
	subtitleEl: document.getElementById('app-subtitle'),
	eyebrowEl: document.getElementById('app-eyebrow'),
});

const game = new Game({
	storyConfig,
	renderer,
});

game.start();