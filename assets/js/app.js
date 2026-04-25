import { storyConfig } from '../stories/demo-story.js';
import { Renderer } from './engine/renderer.js';
import { Game } from './engine/game.js';

const renderer = new Renderer({
	storyEl: document.getElementById('story'),
	choicesEl: document.getElementById('choices'),
	statusEl: document.getElementById('status-panel'),
	signalEl: document.getElementById('latest-signal'),
	actionFeedbackEl: document.getElementById('action-feedback'),
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

function setupTermsPanel() {
	const toggleButton = document.getElementById('terms-toggle');
	const closeButton = document.getElementById('terms-close');
	const panel = document.getElementById('terms-panel');
	const backdrop = document.getElementById('terms-backdrop');

	if (!toggleButton || !closeButton || !panel || !backdrop) {
		return;
	}

	const openPanel = () => {
		panel.classList.remove('help-panel--hidden');
		backdrop.classList.remove('help-backdrop--hidden');
		panel.setAttribute('aria-hidden', 'false');
		toggleButton.setAttribute('aria-expanded', 'true');
		document.body.classList.add('help-open');
	};

	const closePanel = () => {
		panel.classList.add('help-panel--hidden');
		backdrop.classList.add('help-backdrop--hidden');
		panel.setAttribute('aria-hidden', 'true');
		toggleButton.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('help-open');
	};

	toggleButton.addEventListener('click', () => {
		const isHidden = panel.classList.contains('help-panel--hidden');

		if (isHidden) {
			openPanel();
			return;
		}

		closePanel();
	});

	closeButton.addEventListener('click', closePanel);
	backdrop.addEventListener('click', closePanel);

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !panel.classList.contains('help-panel--hidden')) {
			closePanel();
		}
	});
}

function setupSidebarPanels() {
	const storageKey = 'reply-all-sidebar-panels';
	const sections = Array.from(document.querySelectorAll('.sidebar-collapsible'));
	const toggleAllButton = document.getElementById('sidebar-toggle-all');

	if (!sections.length) {
		return;
	}

	let storedState = {};

	try {
		storedState = JSON.parse(localStorage.getItem(storageKey) || '{}');
	} catch (error) {
		storedState = {};
	}

	const applyPanelState = (section, isOpen) => {
		const toggle = section.querySelector('.sidebar-toggle');
		const panelBody = section.querySelector('.panel-body');

		if (!toggle || !panelBody) {
			return;
		}

		section.classList.toggle('is-collapsed', !isOpen);
		toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		panelBody.hidden = !isOpen;
	};

	const getStateSnapshot = () => {
		const state = {};

		sections.forEach((section) => {
			const key = section.dataset.panelKey;

			if (!key) {
				return;
			}

			state[key] = !section.classList.contains('is-collapsed');
		});

		return state;
	};

	const persistState = () => {
		localStorage.setItem(storageKey, JSON.stringify(getStateSnapshot()));
	};

	const updateToggleAllButton = () => {
		if (!toggleAllButton) {
			return;
		}

		const allOpen = sections.every((section) => !section.classList.contains('is-collapsed'));

		toggleAllButton.textContent = allOpen ? 'Collapse all' : 'Expand all';
		toggleAllButton.setAttribute('aria-expanded', allOpen ? 'true' : 'false');
	};

	sections.forEach((section) => {
		const key = section.dataset.panelKey;
		const toggle = section.querySelector('.sidebar-toggle');

		if (!key || !toggle) {
			return;
		}

		const defaultExpanded = toggle.getAttribute('aria-expanded') !== 'false';
		const initialExpanded = Object.prototype.hasOwnProperty.call(storedState, key)
			? storedState[key] === true
			: defaultExpanded;

		applyPanelState(section, initialExpanded);

		toggle.addEventListener('click', () => {
			const shouldOpen = section.classList.contains('is-collapsed');
			applyPanelState(section, shouldOpen);
			persistState();
			updateToggleAllButton();
		});
	});

	if (toggleAllButton) {
		toggleAllButton.addEventListener('click', () => {
			const allOpen = sections.every((section) => !section.classList.contains('is-collapsed'));
			const shouldOpenAll = !allOpen;

			sections.forEach((section) => {
				applyPanelState(section, shouldOpenAll);
			});

			persistState();
			updateToggleAllButton();
		});
	}

	updateToggleAllButton();
}

game.start();
setupTermsPanel();
setupSidebarPanels();