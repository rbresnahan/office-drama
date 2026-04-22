import { applyEffects } from './effects.js';
import { getProcessedChoices, processNodeRedirects } from './guards.js';
import {
	addSignal,
	countActorsKnowingIssue,
	countEvidenceByTag,
	createInitialState,
	decayIssues,
	decayMemories,
	findActorById,
	findIssueById,
	hasEvidence,
	knowsTag,
	propagateIssues,
	resolveValue,
	actorKnowsIssue,
	setActorKnowledge,
	adjustActor,
	adjustIssue,
	containIssue,
	exposeIssue,
	setIssueLifecycle,
	shiftIssuePrecision,
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

	getWorldHelpers() {
		return {
			findActorById: (id) => findActorById(this.state, id),
			findIssueById: (id) => findIssueById(this.state, id),
			actorKnowsIssue: (actorId, issueId, minimumLevel = 'heard') => actorKnowsIssue(this.state, actorId, issueId, minimumLevel),
			setActorKnowledge: (actorId, issueId, level = 'heard', confidence = 55, source = 'script') => {
				return setActorKnowledge(this.state, actorId, issueId, level, confidence, source);
			},
			adjustActor: (actorId, path, value, mode = 'set') => adjustActor(this.state, actorId, path, value, mode),
			adjustIssue: (issueId, path, value, mode = 'set') => adjustIssue(this.state, issueId, path, value, mode),
			containIssue: (issueId, amount = 10) => containIssue(this.state, issueId, amount),
			exposeIssue: (issueId, amount = 10) => exposeIssue(this.state, issueId, amount),
			setIssueLifecycle: (issueId, lifecycleState) => setIssueLifecycle(this.state, issueId, lifecycleState),
			shiftIssuePrecision: (issueId, amount) => shiftIssuePrecision(this.state, issueId, amount),
			countActorsKnowingIssue: (issueId, minimumLevel = 'heard') => countActorsKnowingIssue(this.state, issueId, minimumLevel),
			addEvent: (message) => this.addEvent(message),
			applyEffects: (effects) => this.applyEffects(effects),
		};
	}

	advanceTurn() {
		this.state.turn += 1;

		const memorySignals = decayMemories(this.state, this.turnRules.memoryDecay || {});
		memorySignals.forEach((message) => {
			this.addEvent(message);
		});

		const issueSignals = decayIssues(this.state, this.turnRules.issueDecay || {});
		issueSignals.forEach((message) => {
			this.addEvent(message);
		});

		const propagationSignals = propagateIssues(this.state, this.turnRules.issueDecay || {});
		propagationSignals.forEach((message) => {
			this.addEvent(message);
		});

		if (typeof this.turnRules.worldStep === 'function') {
			this.turnRules.worldStep(this.state, this.getWorldHelpers());
		}

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
				countActorsKnowingIssue: (issueId, minimumLevel = 'heard') => countActorsKnowingIssue(this.state, issueId, minimumLevel),
			},
		});

		this.renderer.renderNode({
			nodeView: this.getCurrentNodeView(),
			choices: this.getCurrentChoices(),
			onChoice: (selectedChoice) => this.choose(selectedChoice),
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