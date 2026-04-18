import { createInitialState, resolveValue } from './state.js';
import { applyEffects } from './effects.js';
import { getProcessedChoices } from './guards.js';
import { processNodeRedirects } from './guards.js';

export class Game {
	constructor({ storyConfig, renderer }) {
		this.storyConfig = storyConfig;
		this.renderer = renderer;

		this.meta = storyConfig.meta || {};
		this.nodes = storyConfig.nodes || {};
		this.startNode = storyConfig.startNode || 'start';
		this.baseInitialState = storyConfig.initialState || {};
		this.displayConfig = storyConfig.display || {};

		this.validateStoryConfig();

		this.state = createInitialState(this.baseInitialState);
		this.currentNodeId = this.startNode;
		this.latestFeedback = '';
		this.eventLog = [];
		this.visitedNodes = {};
		this.triggeredRedirects = {};
	}

	start() {
		this.renderer.setDocumentTitle(this.meta.title);
		this.enterNode(this.currentNodeId);
		this.render();
	}

	reset() {
		this.state = createInitialState(this.baseInitialState);
		this.currentNodeId = this.startNode;
		this.latestFeedback = '';
		this.eventLog = [];
		this.visitedNodes = {};
		this.triggeredRedirects = {};
		this.enterNode(this.currentNodeId);
		this.render();
	}

	addEvent(message) {
		if (!message) {
			return;
		}

		this.latestFeedback = message;
		this.eventLog.push(message);
	}

	enterNode(nodeId) {
		this.currentNodeId = processNodeRedirects({
			nodeId,
			nodes: this.nodes,
			state: this.state,
			triggeredRedirects: this.triggeredRedirects,
			resolveValue: (value) => resolveValue(value, this.state),
			addEvent: (message) => this.addEvent(message),
			applyEffects: (effects) => applyEffects(this.state, effects),
		});

		const node = this.nodes[this.currentNodeId];

		if (!node) {
			return;
		}

		const wasVisited = this.visitedNodes[this.currentNodeId] === true;

		if (node.entryOnce && wasVisited) {
			this.visitedNodes[this.currentNodeId] = true;
			return;
		}

		const entryEffects = resolveValue(node.entryEffects, this.state);
		const entryFeedback = resolveValue(node.entryFeedback, this.state);

		applyEffects(this.state, entryEffects);
		this.addEvent(entryFeedback);

		this.visitedNodes[this.currentNodeId] = true;
	}

	getCurrentNode() {
		return this.nodes[this.currentNodeId];
	}

	getCurrentNodeText() {
		const node = this.getCurrentNode();

		if (!node) {
			return '';
		}

		return resolveValue(node.text, this.state) || '';
	}

	getCurrentChoices() {
		const node = this.getCurrentNode();

		if (!node) {
			return [];
		}

		return getProcessedChoices(node, this.state);
	}

	choose(choice) {
		this.addEvent(choice.feedback);
		applyEffects(this.state, choice.effects);

		if (!choice.next) {
			this.render();
			return;
		}

		this.currentNodeId = choice.next;
		this.enterNode(this.currentNodeId);
		this.render();
	}

	render() {
		if (this.currentNodeId === 'restart') {
			this.reset();
			return;
		}

		const node = this.getCurrentNode();

		if (!node) {
			this.renderer.showError(`Error: Story node "${this.currentNodeId}" not found.`);
			return;
		}

		this.renderer.renderStatePanel({
			state: this.state,
			displayConfig: this.displayConfig,
			latestFeedback: this.latestFeedback,
			eventLog: this.eventLog,
		});

		this.renderer.renderNode({
			text: this.getCurrentNodeText(),
			choices: this.getCurrentChoices(),
			onChoice: (choice) => this.choose(choice),
		});
	}

	validateStoryConfig() {
		if (!this.storyConfig || typeof this.storyConfig !== 'object') {
			throw new Error('storyConfig is missing or invalid.');
		}

		if (!this.startNode) {
			throw new Error('startNode is missing.');
		}

		if (!this.nodes || typeof this.nodes !== 'object') {
			throw new Error('nodes are missing or invalid.');
		}

		if (!this.nodes[this.startNode]) {
			throw new Error(`startNode "${this.startNode}" does not exist in nodes.`);
		}
	}
}