import { applyEffects } from './effects.js';
import { getProcessedChoices, processNodeRedirects } from './guards.js';
import {
	addSignal,
	countEvidenceByTag,
	createInitialState,
	decayMemories,
	hasEvidence,
	knowsTag,
	resolveValue,
} from './state.js';

export class Game {
	constructor({ storyConfig, renderer }) {
		this.storyConfig = storyConfig;
		this.renderer = renderer;

		this.meta = storyConfig.meta || {};
		this.nodes = storyConfig.nodes || {};
		this.startNode = storyConfig.startNode || 'start';
		this.baseInitialState = storyConfig.initialState || {};
		this.displayConfig = storyConfig.display || {};
		this.turnRules = storyConfig.turnRules || {};

		this.validateStoryConfig();

		this.state = createInitialState(this.baseInitialState);
		this.currentNodeId = this.startNode;
		this.visitedNodes = {};
		this.triggeredRedirects = {};
	}

	start() {
		this.renderer.setDocumentTitle(this.meta.title);
		this.renderer.renderMeta(this.meta);
		this.enterNode(this.currentNodeId, { advanceTurn: false });
		this.render();
	}

	reset() {
		this.state = createInitialState(this.baseInitialState);
		this.currentNodeId = this.startNode;
		this.visitedNodes = {};
		this.triggeredRedirects = {};
		this.renderer.renderMeta(this.meta);
		this.enterNode(this.currentNodeId, { advanceTurn: false });
		this.render();
	}

	addEvent(message) {
		const limit = this.turnRules.signalLimit || 6;
		addSignal(this.state, message, limit);
	}

	applyEffects(effects) {
		applyEffects(this.state, effects, {
			signalLimit: this.turnRules.signalLimit || 6,
		});
	}

	resolve(value) {
		return resolveValue(value, this.state);
	}

	advanceTurn() {
		this.state.turn += 1;

		const memorySignals = decayMemories(this.state, this.turnRules.memoryDecay || {});
		memorySignals.forEach((message) => {
			this.addEvent(message);
		});

		(this.turnRules.events || []).forEach((eventData) => {
			const key = eventData.id || String(eventData.at);
			const alreadyFired = this.state.firedTurnEvents.includes(key);

			if (alreadyFired) {
				return;
			}

			if (this.state.turn >= eventData.at) {
				this.state.firedTurnEvents.push(key);
				this.addEvent(this.resolve(eventData.text));
				this.applyEffects(this.resolve(eventData.effects));
			}
		});
	}

	enterNode(nodeId, options = {}) {
		const shouldAdvanceTurn = options.advanceTurn === true;

		if (shouldAdvanceTurn) {
			this.advanceTurn();
		}

		this.currentNodeId = processNodeRedirects({
			nodeId,
			nodes: this.nodes,
			state: this.state,
			triggeredRedirects: this.triggeredRedirects,
			resolveValue: (value) => this.resolve(value),
			addEvent: (message) => this.addEvent(message),
			applyEffects: (effects) => this.applyEffects(effects),
		});

		const node = this.nodes[this.currentNodeId];

		if (!node) {
			return;
		}

		const entryConfig = node.entry || {};
		const entryOnce = node.entryOnce === true || entryConfig.once === true;
		const entryEffects = node.entryEffects ?? entryConfig.effects;
		const entryFeedback = node.entryFeedback ?? entryConfig.feedback;

		const wasVisited = this.visitedNodes[this.currentNodeId] === true;

		if (entryOnce && wasVisited) {
			this.visitedNodes[this.currentNodeId] = true;
			return;
		}

		this.applyEffects(this.resolve(entryEffects));
		this.addEvent(this.resolve(entryFeedback));
		this.visitedNodes[this.currentNodeId] = true;
	}

	getCurrentNode() {
		return this.nodes[this.currentNodeId];
	}

	getCurrentNodeView() {
		const node = this.getCurrentNode();

		if (!node) {
			return {
				title: '',
				text: '',
				kicker: '',
			};
		}

		return {
			title: this.resolve(node.title) || '',
			text: this.resolve(node.text ?? node.body) || '',
			kicker: this.resolve(node.kicker) || '',
		};
	}

	getCurrentChoices() {
		const node = this.getCurrentNode();

		if (!node) {
			return [];
		}

		return getProcessedChoices(node, this.state);
	}

	choose(choice) {
		if (!choice || choice.available === false || choice.disabled === true) {
			return;
		}

		this.addEvent(this.resolve(choice.feedback));
		this.applyEffects(this.resolve(choice.effects));

		const targetNode = choice.next || choice.to;

		if (targetNode === 'restart') {
			this.reset();
			return;
		}

		const nextNodeId = this.resolve(targetNode) || this.currentNodeId;
		const consumesTurn = choice.consumesTurn !== false;
		this.enterNode(nextNodeId, { advanceTurn: consumesTurn });
		this.render();
	}

	render() {
		const node = this.getCurrentNode();

		if (!node) {
			this.renderer.showError(`Error: Story node "${this.currentNodeId}" not found.`);
			return;
		}

		this.renderer.renderStatePanel({
			state: this.state,
			displayConfig: this.displayConfig,
			context: {
				maxTurns: this.turnRules.maxTurns || 0,
				turnsUntilFinale: Math.max((this.turnRules.maxTurns || 0) - this.state.turn, 0),
				hasEvidence: (id) => hasEvidence(this.state, id),
				knowsTag: (tag) => knowsTag(this.state, tag),
				countEvidenceByTag: (tag) => countEvidenceByTag(this.state, tag),
			},
		});

		this.renderer.renderNode({
			nodeView: this.getCurrentNodeView(),
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