export function deepClone(value) {
	if (typeof structuredClone === 'function') {
		return structuredClone(value);
	}

	return JSON.parse(JSON.stringify(value));
}

export function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

export function resolveValue(value, state) {
	if (typeof value === 'function') {
		return value(state);
	}

	return value;
}

function getPathSegments(path) {
	if (Array.isArray(path)) {
		return path;
	}

	return String(path).split('.').filter(Boolean);
}

function getAtPath(target, path) {
	const segments = getPathSegments(path);
	let current = target;

	for (const segment of segments) {
		if (current == null) {
			return undefined;
		}

		current = current[segment];
	}

	return current;
}

function setAtPath(target, path, value) {
	const segments = getPathSegments(path);
	let current = target;

	for (let index = 0; index < segments.length - 1; index += 1) {
		const segment = segments[index];

		if (typeof current[segment] !== 'object' || current[segment] === null) {
			current[segment] = {};
		}

		current = current[segment];
	}

	current[segments[segments.length - 1]] = value;
}

const KNOWLEDGE_RANK = {
	none: 0,
	heard: 1,
	suspects: 2,
	repeated: 2,
	confirmed: 3,
	involved: 4,
};

function normalizeKnowledge(knowledge = {}) {
	const normalized = {};

	Object.entries(knowledge).forEach(([ issueId, value ]) => {
		if (typeof value === 'string') {
			normalized[issueId] = {
				level: value,
				confidence: value === 'confirmed' ? 80 : value === 'suspects' ? 65 : 55,
				source: 'seed',
			};
			return;
		}

		normalized[issueId] = {
			level: value.level || 'heard',
			confidence: typeof value.confidence === 'number' ? value.confidence : 55,
			source: value.source || 'seed',
		};
	});

	return normalized;
}

function knowledgeLevelRank(level = 'none') {
	return KNOWLEDGE_RANK[level] || 0;
}

function normalizeLogicCategories(categories = []) {
	return categories.map((category) => ({
		id: category.id,
		label: category.label || category.id,
		values: Array.isArray(category.values)
			? category.values.map((value) => {
				if (typeof value === 'string') {
					return {
						id: value,
						label: value,
					};
				}

				return {
					id: value.id,
					label: value.label || value.id,
				};
			})
			: [],
	}));
}

function createLogicState(seed = {}, actors = []) {
	const categories = normalizeLogicCategories(seed.categories || []);
	const logicActors = Array.isArray(seed.actors) && seed.actors.length
		? seed.actors.map((actor) => {
			if (typeof actor === 'string') {
				return {
					id: actor,
					label: actor,
				};
			}

			return {
				id: actor.id,
				label: actor.label || actor.id,
			};
		})
		: actors.map((actor) => ({
			id: actor.id,
			label: actor.name,
		}));

	const notebook = {};

	logicActors.forEach((actor) => {
		notebook[actor.id] = notebook[actor.id] || {};

		categories.forEach((category) => {
			notebook[actor.id][category.id] = notebook[actor.id][category.id] || {};

			category.values.forEach((value) => {
				const seededMark = seed.notebook
					&& seed.notebook[actor.id]
					&& seed.notebook[actor.id][category.id]
					? seed.notebook[actor.id][category.id][value.id]
					: null;

				notebook[actor.id][category.id][value.id] = seededMark || 'unknown';
			});
		});
	});

	const logic = {
		title: seed.title || 'Office Logic Board',
		helpText: seed.helpText || 'Click a cell to cycle blank → match → exclude.',
		categories,
		actors: logicActors,
		truths: deepClone(seed.truths || {}),
		notebook,
		progress: {
			correctMatches: 0,
			totalMatches: logicActors.length * categories.length,
			incorrectMatches: 0,
			solved: false,
		},
	};

	applyLogicPresentation(logic);
	return logic;
}

function deriveConnections(seed = {}) {
	if (Array.isArray(seed.connections) && seed.connections.length) {
		return [ ...seed.connections ];
	}

	const derived = [ seed.primaryAllyId, seed.secondaryAllyId ]
		.filter(Boolean)
		.filter((id) => id !== 'player');

	return Array.from(new Set(derived));
}

function deriveDisposition(seed = {}) {
	if (typeof seed.disposition === 'number') {
		return seed.disposition;
	}

	if (typeof seed.playerLikability === 'number') {
		return clamp(seed.playerLikability - 50, -100, 100);
	}

	return 0;
}

function deriveSuspicion(seed = {}) {
	if (typeof seed.suspicion === 'number') {
		return seed.suspicion;
	}

	if (typeof seed.playerSuspicion === 'number') {
		return seed.playerSuspicion;
	}

	return 0;
}

function deriveStability(seed = {}) {
	if (typeof seed.stability === 'number') {
		return seed.stability;
	}

	const courage = Number(seed?.traits?.courage);
	const ruleFollowing = Number(seed?.traits?.ruleFollowing);

	if (!Number.isNaN(courage) || !Number.isNaN(ruleFollowing)) {
		const values = [ courage, ruleFollowing ].filter((value) => Number.isFinite(value));
		const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 60;

		return clamp(Math.round(average), 0, 100);
	}

	return 60;
}

function deriveTalkativeness(seed = {}) {
	if (typeof seed.talkativeness === 'number') {
		return seed.talkativeness;
	}

	const gossipAppetite = Number(seed?.traits?.gossipAppetite);

	if (Number.isFinite(gossipAppetite)) {
		return clamp(gossipAppetite, 0, 100);
	}

	return 50;
}

export function createInitialState(baseInitialState = {}) {
	const state = deepClone(baseInitialState);

	state.turn = Number(state.turn) || 0;
	state.stats = state.stats || {};
	state.flags = state.flags || {};
	state.emailTargetId = state.emailTargetId || state.flags.emailTargetId || null;
	state.deliveryPatternId = state.deliveryPatternId || state.flags.deliveryPatternId || null;
	state.officeFocusState = state.officeFocusState || 'background';
	state.gamePhase = state.gamePhase || 'containment';
	state.fairIntervention = state.fairIntervention || {
		pending: false,
		minimumTurnsRemaining: 0,
		subjectCanAutoRead: false,
	};
	state.evidence = Array.isArray(state.evidence) ? state.evidence : [];
	state.memories = Array.isArray(state.memories) ? state.memories.map(createMemoryFromSeed) : [];
	state.issues = Array.isArray(state.issues) ? state.issues.map(createIssueFromSeed) : [];
	state.actors = Array.isArray(state.actors) ? state.actors.map(createActorFromSeed) : [];
	state.relationships = Array.isArray(state.relationships) ? state.relationships.map(createRelationshipFromSeed) : [];
	state.logic = createLogicState(state.logic || {}, state.actors);
	state.beliefs = state.beliefs || {};
	state.signals = Array.isArray(state.signals) ? state.signals : [];
	state.firedTurnEvents = Array.isArray(state.firedTurnEvents) ? state.firedTurnEvents : [];
	state.turnSnapshots = Array.isArray(state.turnSnapshots) ? state.turnSnapshots : [];
	state.ending = state.ending || null;

	state.memories.forEach((memory) => {
		applyMemoryPresentation(memory);
	});

	state.issues.forEach((issue) => {
		applyIssuePresentation(issue);
	});

	state.actors.forEach((actor) => {
		applyActorPresentation(actor);
	});

	state.relationships.forEach((relationship) => {
		applyRelationshipPresentation(relationship);
	});

	return state;
}

export function createMemoryFromSeed(seed = {}) {
	const memory = {
		key: seed.key,
		label: seed.label || seed.key || 'Memory fragment',
		truthText: seed.truthText || '',
		stages: deepClone(seed.stages || []),
		corruptedStage: seed.corruptedStage ? deepClone(seed.corruptedStage) : null,
		lostStage: seed.lostStage ? deepClone(seed.lostStage) : null,
		stability: typeof seed.stability === 'number' ? seed.stability : 100,
		confidence: typeof seed.confidence === 'number' ? seed.confidence : 60,
		importance: seed.importance || 'medium',
		source: seed.source || 'seen',
		canCorrupt: seed.canCorrupt !== false,
		preserved: seed.preserved === true,
		corrupted: seed.corrupted === true,
		falseCueCount: Number(seed.falseCueCount) || 0,
		age: Number(seed.age) || 0,
		currentText: '',
		currentTags: [],
		stage: 'fresh',
	};

	applyMemoryPresentation(memory);
	return memory;
}

export function createIssueFromSeed(seed = {}) {
	const issue = {
		id: seed.id,
		title: seed.title || seed.id || 'Problem',
		truthText: seed.truthText || '',
		summaryStages: Array.isArray(seed.summaryStages) ? deepClone(seed.summaryStages) : [],
		severity: typeof seed.severity === 'number' ? seed.severity : 50,
		spreadRisk: typeof seed.spreadRisk === 'number' ? seed.spreadRisk : 40,
		precision: typeof seed.precision === 'number' ? seed.precision : 80,
		containment: typeof seed.containment === 'number' ? seed.containment : 20,
		lifecycleState: seed.lifecycleState || 'active',
		linkedActors: Array.isArray(seed.linkedActors) ? [ ...seed.linkedActors ] : [],
		visible: seed.visible !== false,
		currentText: '',
		stage: 'focused',
	};

	applyIssuePresentation(issue);
	return issue;
}

export function createActorFromSeed(seed = {}) {
	const actor = {
		id: seed.id,
		name: seed.name || seed.id || 'Coworker',
		role: seed.role || 'Staff',
		location: seed.location || 'Office',
		disposition: deriveDisposition(seed),
		stability: deriveStability(seed),
		suspicion: deriveSuspicion(seed),
		talkativeness: deriveTalkativeness(seed),
		pressure: typeof seed.pressure === 'number' ? seed.pressure : 0,
		connections: deriveConnections(seed),
		knowledge: normalizeKnowledge(seed.knowledge),
		beliefs: seed.beliefs ? deepClone(seed.beliefs) : {},
		playerLikability: typeof seed.playerLikability === 'number' ? seed.playerLikability : clamp(deriveDisposition(seed) + 50, 0, 100),
		playerSuspicion: typeof seed.playerSuspicion === 'number' ? seed.playerSuspicion : deriveSuspicion(seed),
		mood: seed.mood || null,
		deliveryState: seed.deliveryState || 'not_received',
		knowledgeState: seed.knowledgeState || 'none',
		isSubject: seed.isSubject === true,
		subjectAwarenessState: seed.subjectAwarenessState || 'unaware',
		primaryAllyId: seed.primaryAllyId || null,
		secondaryAllyId: seed.secondaryAllyId || null,
		rivalId: seed.rivalId || null,
		traits: deepClone(seed.traits || {}),
		currentMood: 'guarded',
		currentSummary: '',
	};

	applyActorPresentation(actor);
	return actor;
}

export function createRelationshipFromSeed(seed = {}) {
	const leftId = seed.leftId || seed.from;
	const rightId = seed.rightId || seed.to;
	const bondStrength = typeof seed.bondStrength === 'number' ? seed.bondStrength : null;
	const relationship = {
		id: seed.id || seed.pairId || `${leftId}:${rightId}`,
		pairId: seed.pairId || null,
		leftId: leftId || null,
		rightId: rightId || null,
		from: leftId || seed.from,
		to: rightId || seed.to,
		value: typeof seed.value === 'number' ? seed.value : (bondStrength !== null ? clamp(bondStrength - 50, -100, 100) : 0),
		bondStrength,
		sentimentTransferStrength: typeof seed.sentimentTransferStrength === 'number' ? seed.sentimentTransferStrength : null,
		isMutual: seed.isMutual !== false,
		isActive: seed.isActive !== false,
		strain: typeof seed.strain === 'number' ? seed.strain : 0,
		isolatedUntilTurn: seed.isolatedUntilTurn ?? null,
		currentLabel: 'neutral',
		currentSummary: '',
	};

	applyRelationshipPresentation(relationship);
	return relationship;
}

export function findMemoryByKey(state, key) {
	return state.memories.find((memory) => memory.key === key) || null;
}

export function findIssueById(state, id) {
	return state.issues.find((issue) => issue.id === id) || null;
}

export function findActorById(state, id) {
	return state.actors.find((actor) => actor.id === id) || null;
}

export function findRelationship(state, from, to) {
	return state.relationships.find((relationship) => {
		const directMatch = relationship.from === from && relationship.to === to;
		const pairMatch = relationship.leftId === from && relationship.rightId === to;
		const reversePairMatch = relationship.isMutual === true && relationship.leftId === to && relationship.rightId === from;
		const reverseLegacyMatch = relationship.isMutual === true && relationship.from === to && relationship.to === from;

		return directMatch || pairMatch || reversePairMatch || reverseLegacyMatch;
	}) || null;
}

function ensureRelationship(state, from, to) {
	const existing = findRelationship(state, from, to);

	if (existing) {
		return existing;
	}

	const relationship = createRelationshipFromSeed({ from, to, value: 0, isMutual: false });
	state.relationships.push(relationship);
	return relationship;
}

export function addMemory(state, seed) {
	const existing = findMemoryByKey(state, seed.key);

	if (existing) {
		reinforceMemory(state, seed.key, 10);
		return existing;
	}

	const memory = createMemoryFromSeed(seed);
	state.memories.unshift(memory);
	return memory;
}

export function addIssue(state, seed) {
	const existing = findIssueById(state, seed.id);

	if (existing) {
		return existing;
	}

	const issue = createIssueFromSeed(seed);
	state.issues.unshift(issue);
	return issue;
}

export function reinforceMemory(state, key, amount = 10) {
	const memory = findMemoryByKey(state, key);

	if (!memory) {
		return null;
	}

	memory.stability = clamp(memory.stability + amount, 0, 100);
	memory.confidence = clamp(memory.confidence + 8, 0, 100);

	if (memory.corrupted === true && memory.stability >= 65 && memory.falseCueCount === 0) {
		memory.corrupted = false;
	}

	applyMemoryPresentation(memory);
	return memory;
}

export function preserveMemory(state, key) {
	const memory = findMemoryByKey(state, key);

	if (!memory) {
		return null;
	}

	memory.preserved = true;
	memory.stability = clamp(memory.stability + 20, 0, 100);
	memory.confidence = clamp(memory.confidence + 10, 0, 100);
	applyMemoryPresentation(memory);
	return memory;
}

export function distortMemory(state, key, falseStage) {
	const memory = findMemoryByKey(state, key);

	if (!memory) {
		return null;
	}

	memory.falseCueCount += 1;
	memory.corruptedStage = deepClone(falseStage);
	memory.confidence = clamp(memory.confidence + 12, 0, 100);

	if (memory.stability <= 55) {
		memory.corrupted = true;
	}

	applyMemoryPresentation(memory);
	return memory;
}

export function addEvidence(state, evidence) {
	if (state.evidence.some((item) => item.id === evidence.id)) {
		return null;
	}

	const entry = {
		id: evidence.id,
		title: evidence.title,
		text: evidence.text,
		tags: Array.isArray(evidence.tags) ? [ ...evidence.tags ] : [],
		source: evidence.source || 'unknown',
		verified: evidence.verified === true,
	};

	state.evidence.unshift(entry);
	return entry;
}

export function commitBelief(state, key, label) {
	state.beliefs[key] = {
		key,
		label,
		value: true,
	};
}

export function clearBelief(state, key) {
	delete state.beliefs[key];
}

export function setActorBelief(state, actorId, key, label, confidence = 60) {
	const actor = findActorById(state, actorId);

	if (!actor) {
		return null;
	}

	actor.beliefs[key] = {
		key,
		label,
		confidence,
	};
	applyActorPresentation(actor);
	return actor;
}

export function actorKnowsIssue(state, actorId, issueId, minimumLevel = 'heard') {
	const actor = findActorById(state, actorId);

	if (!actor) {
		return false;
	}

	const entry = actor.knowledge[issueId];

	if (!entry) {
		return false;
	}

	return knowledgeLevelRank(entry.level) >= knowledgeLevelRank(minimumLevel);
}

export function setActorKnowledge(state, actorId, issueId, level = 'heard', confidence = 55, source = 'unknown') {
	const actor = findActorById(state, actorId);

	if (!actor) {
		return null;
	}

	const current = actor.knowledge[issueId];
	const incomingRank = knowledgeLevelRank(level);
	const currentRank = current ? knowledgeLevelRank(current.level) : 0;

	if (!current || incomingRank >= currentRank) {
		actor.knowledge[issueId] = {
			level,
			confidence: Math.max(Number(confidence) || 0, current ? current.confidence : 0),
			source,
		};
	} else {
		actor.knowledge[issueId].confidence = Math.max(actor.knowledge[issueId].confidence, Number(confidence) || 0);
	}

	actor.knowledgeState = actor.knowledge[issueId].level;
	applyActorPresentation(actor);
	return actor.knowledge[issueId];
}

export function adjustActor(state, actorId, path, value, mode = 'set') {
	const actor = findActorById(state, actorId);

	if (!actor) {
		return null;
	}

	const targetPath = getPathSegments(path);

	if (mode === 'add') {
		const currentValue = Number(getAtPath(actor, targetPath)) || 0;
		setAtPath(actor, targetPath, currentValue + Number(value || 0));
	} else {
		setAtPath(actor, targetPath, value);
	}

	if (typeof actor.disposition === 'number') {
		actor.disposition = clamp(actor.disposition, -100, 100);
	}

	if (typeof actor.playerLikability === 'number') {
		actor.playerLikability = clamp(actor.playerLikability, 0, 100);
	}

	if (typeof actor.suspicion === 'number') {
		actor.suspicion = clamp(actor.suspicion, 0, 100);
	}

	if (typeof actor.playerSuspicion === 'number') {
		actor.playerSuspicion = clamp(actor.playerSuspicion, 0, 100);
	}

	if (typeof actor.stability === 'number') {
		actor.stability = clamp(actor.stability, 0, 100);
	}

	if (typeof actor.pressure === 'number') {
		actor.pressure = clamp(actor.pressure, 0, 100);
	}

	if (path === 'playerLikability' && typeof actor.playerLikability === 'number') {
		actor.disposition = clamp(actor.playerLikability - 50, -100, 100);
	}

	if (path === 'playerSuspicion' && typeof actor.playerSuspicion === 'number') {
		actor.suspicion = actor.playerSuspicion;
	}

	applyActorPresentation(actor);
	return actor;
}

export function adjustRelationship(state, from, to, value, mode = 'add') {
	const relationship = ensureRelationship(state, from, to);

	if (mode === 'set') {
		relationship.value = Number(value) || 0;
	} else {
		relationship.value = (Number(relationship.value) || 0) + (Number(value) || 0);
	}

	relationship.value = clamp(relationship.value, -100, 100);
	applyRelationshipPresentation(relationship);
	return relationship;
}

export function adjustIssue(state, issueId, path, value, mode = 'set') {
	const issue = findIssueById(state, issueId);

	if (!issue) {
		return null;
	}

	const targetPath = getPathSegments(path);

	if (mode === 'add') {
		const currentValue = Number(getAtPath(issue, targetPath)) || 0;
		setAtPath(issue, targetPath, currentValue + Number(value || 0));
	} else {
		setAtPath(issue, targetPath, value);
	}

	issue.severity = clamp(issue.severity, 0, 100);
	issue.spreadRisk = clamp(issue.spreadRisk, 0, 100);
	issue.precision = clamp(issue.precision, 0, 100);
	issue.containment = clamp(issue.containment, 0, 100);
	applyIssuePresentation(issue);
	return issue;
}

export function containIssue(state, issueId, amount = 10) {
	const issue = findIssueById(state, issueId);

	if (!issue) {
		return null;
	}

	issue.containment = clamp(issue.containment + amount, 0, 100);
	issue.spreadRisk = clamp(issue.spreadRisk - Math.ceil(amount / 2), 0, 100);

	if (issue.containment >= 70 && issue.lifecycleState === 'active') {
		issue.lifecycleState = 'contained';
	}

	applyIssuePresentation(issue);
	return issue;
}

export function exposeIssue(state, issueId, amount = 10) {
	const issue = findIssueById(state, issueId);

	if (!issue) {
		return null;
	}

	issue.containment = clamp(issue.containment - amount, 0, 100);
	issue.spreadRisk = clamp(issue.spreadRisk + Math.ceil(amount / 2), 0, 100);

	if ([ 'warming', 'latent', 'contained' ].includes(issue.lifecycleState)) {
		issue.lifecycleState = issue.containment < 45 ? 'reactivated' : 'active';
	}

	applyIssuePresentation(issue);
	return issue;
}

export function setIssueLifecycle(state, issueId, lifecycleState) {
	const issue = findIssueById(state, issueId);

	if (!issue) {
		return null;
	}

	issue.lifecycleState = lifecycleState;
	applyIssuePresentation(issue);
	return issue;
}

export function shiftIssuePrecision(state, issueId, amount) {
	const issue = findIssueById(state, issueId);

	if (!issue) {
		return null;
	}

	issue.precision = clamp(issue.precision + amount, 0, 100);
	applyIssuePresentation(issue);
	return issue;
}

export function getLogicCell(state, actorId, categoryId, valueId) {
	if (!state.logic || !state.logic.notebook[actorId] || !state.logic.notebook[actorId][categoryId]) {
		return 'unknown';
	}

	return state.logic.notebook[actorId][categoryId][valueId] || 'unknown';
}

export function setLogicCell(state, actorId, categoryId, valueId, mark = 'unknown') {
	if (!state.logic || !state.logic.notebook[actorId] || !state.logic.notebook[actorId][categoryId]) {
		return null;
	}

	state.logic.notebook[actorId][categoryId][valueId] = mark;
	applyLogicPresentation(state.logic);
	return mark;
}

export function cycleLogicCell(state, actorId, categoryId, valueId) {
	const current = getLogicCell(state, actorId, categoryId, valueId);
	const next = current === 'unknown'
		? 'match'
		: current === 'match'
			? 'exclude'
			: 'unknown';

	return setLogicCell(state, actorId, categoryId, valueId, next);
}

export function isLogicSolved(state) {
	return Boolean(state.logic && state.logic.progress && state.logic.progress.solved);
}

export function getLogicProgress(state) {
	return state.logic && state.logic.progress ? state.logic.progress : null;
}

export function hasEvidence(state, id) {
	return state.evidence.some((item) => item.id === id);
}

export function countEvidenceByTag(state, tag) {
	return state.evidence.filter((item) => Array.isArray(item.tags) && item.tags.includes(tag)).length;
}

export function knowsTag(state, tag) {
	const memoryMatch = state.memories.some((memory) => {
		if (memory.stage === 'lost') {
			return false;
		}

		return Array.isArray(memory.currentTags) && memory.currentTags.includes(tag);
	});

	if (memoryMatch === true) {
		return true;
	}

	return countEvidenceByTag(state, tag) > 0;
}

export function addSignal(state, message, limit = 6) {
	if (!message || typeof message !== 'string' || message.trim() === '') {
		return;
	}

	state.signals.unshift(message.trim());
	state.signals = state.signals.slice(0, limit);
}

export function countActorsKnowingIssue(state, issueId, minimumLevel = 'heard') {
	return state.actors.filter((actor) => actorKnowsIssue(state, actor.id, issueId, minimumLevel)).length;
}

export function decayMemories(state, tuning = {}) {
	const changes = [];
	const baseDecay = typeof tuning.baseDecay === 'number' ? tuning.baseDecay : 18;
	const stressMultiplier = typeof tuning.stressMultiplier === 'number' ? tuning.stressMultiplier : 4;
	const preservedDecay = typeof tuning.preservedDecay === 'number' ? tuning.preservedDecay : 4;
	const highImportanceAdjustment = typeof tuning.highImportanceAdjustment === 'number'
		? tuning.highImportanceAdjustment
		: -3;

	state.memories.forEach((memory) => {
		const previousStage = memory.stage;
		const previousText = memory.currentText;
		memory.age += 1;

		let decay = baseDecay + ((Number(state.stats.stress) || 0) * stressMultiplier);

		if (memory.preserved === true) {
			decay = preservedDecay;
		}

		if (memory.importance === 'high') {
			decay += highImportanceAdjustment;
		}

		memory.stability = clamp(memory.stability - decay, 0, 100);

		if (
			memory.preserved === false &&
			memory.canCorrupt === true &&
			memory.corrupted === false &&
			memory.falseCueCount > 0 &&
			memory.stability <= 40
		) {
			memory.corrupted = true;
		}

		applyMemoryPresentation(memory);

		if (previousText !== memory.currentText) {
			if (memory.stage === 'corrupted') {
				changes.push('A repeated version of the story starts feeling more natural than the original one.');
			} else if (memory.stage === 'lost') {
				changes.push('A memory gives way and leaves you with shape instead of detail.');
			} else if (previousStage !== memory.stage) {
				changes.push('A detail slips. You still have the outline, just not the clean edge.');
			}
		}
	});

	return changes;
}

export function decayIssues(state, tuning = {}) {
	const changes = [];
	const basePrecisionDecay = typeof tuning.basePrecisionDecay === 'number' ? tuning.basePrecisionDecay : 6;
	const overloadPenalty = typeof tuning.overloadPrecisionPenalty === 'number' ? tuning.overloadPrecisionPenalty : 4;
	const containmentDecay = typeof tuning.containmentDecay === 'number' ? tuning.containmentDecay : 5;
	const unresolvedCount = state.issues.filter((issue) => ![ 'resolved', 'dormant' ].includes(issue.lifecycleState)).length;
	const overload = Math.max(unresolvedCount - 1, 0) * overloadPenalty;

	state.issues.forEach((issue) => {
		if (!issue.visible) {
			return;
		}

		const previousStage = issue.stage;
		const previousLifecycle = issue.lifecycleState;
		const previousText = issue.currentText;
		let precisionDecay = basePrecisionDecay + overload + Math.floor((Number(state.stats.stress) || 0) / 2);

		if (issue.containment >= 70) {
			precisionDecay = Math.max(precisionDecay - 3, 1);
		}

		if (issue.lifecycleState === 'contained') {
			precisionDecay = Math.max(precisionDecay - 2, 1);
		}

		if (![ 'resolved', 'dormant' ].includes(issue.lifecycleState)) {
			issue.precision = clamp(issue.precision - precisionDecay, 0, 100);
			issue.containment = clamp(issue.containment - containmentDecay, 0, 100);
		}

		if (issue.lifecycleState === 'active' && issue.containment >= 70) {
			issue.lifecycleState = 'contained';
		}

		if (issue.lifecycleState === 'contained' && issue.containment < 45) {
			issue.lifecycleState = 'reactivated';
		}

		applyIssuePresentation(issue);

		if (previousLifecycle !== issue.lifecycleState) {
			if (issue.lifecycleState === 'contained') {
				changes.push(`"${issue.title}" cools down, but only barely.`);
			} else if (issue.lifecycleState === 'reactivated') {
				changes.push(`"${issue.title}" starts moving again behind your back.`);
			}
		}

		if (previousText !== issue.currentText || previousStage !== issue.stage) {
			changes.push('The shape of a problem gets blurrier while the office gets louder.');
		}
	});

	return changes;
}

export function propagateIssues(state, tuning = {}) {
	const changes = [];
	const maxTransfersPerIssue = typeof tuning.maxTransfersPerIssue === 'number' ? tuning.maxTransfersPerIssue : 2;

	state.issues.forEach((issue) => {
		if (![ 'active', 'reactivated', 'warming', 'contained' ].includes(issue.lifecycleState)) {
			return;
		}

		const spreadPotential = issue.spreadRisk - issue.containment + Math.max(issue.severity - 50, 0) / 2;

		if (spreadPotential <= 20) {
			return;
		}

		const transferBudget = clamp(Math.ceil(spreadPotential / 40), 0, maxTransfersPerIssue);

		if (transferBudget <= 0) {
			return;
		}

		const knowers = state.actors
			.filter((actor) => actorKnowsIssue(state, actor.id, issue.id, 'heard'))
			.sort((left, right) => {
				const leftScore = left.talkativeness + Math.floor(left.suspicion / 3) + Math.floor((100 - left.stability) / 4);
				const rightScore = right.talkativeness + Math.floor(right.suspicion / 3) + Math.floor((100 - right.stability) / 4);
				return rightScore - leftScore;
			});

		let transfers = 0;

		knowers.forEach((knower) => {
			if (transfers >= transferBudget) {
				return;
			}

			const canLeak = (knower.talkativeness + Math.floor(knower.suspicion / 3) + Math.floor((100 - knower.stability) / 4)) >= 55;

			if (!canLeak) {
				return;
			}

			knower.connections.forEach((targetId) => {
				if (transfers >= transferBudget) {
					return;
				}

				const target = findActorById(state, targetId);

				if (!target || actorKnowsIssue(state, targetId, issue.id, 'heard')) {
					return;
				}

				setActorKnowledge(
					state,
					targetId,
					issue.id,
					'heard',
					clamp(Math.min(issue.precision, 85) - 10, 20, 85),
					knower.id
				);
				transfers += 1;
				changes.push(`${knower.name} lets enough slip that ${target.name} is now in the loop.`);
			});
		});

		if (transfers > 0) {
			issue.containment = clamp(issue.containment - (transfers * 8), 0, 100);
			issue.spreadRisk = clamp(issue.spreadRisk + (transfers * 4), 0, 100);

			if ([ 'warming', 'contained' ].includes(issue.lifecycleState)) {
				issue.lifecycleState = issue.containment < 45 ? 'reactivated' : 'active';
			}

			applyIssuePresentation(issue);
		}
	});

	return changes;
}

export function applyMemoryPresentation(memory) {
	if (
		memory.corrupted === true &&
		memory.corruptedStage &&
		typeof memory.corruptedStage.text === 'string'
	) {
		memory.stage = 'corrupted';
		memory.currentText = memory.corruptedStage.text;
		memory.currentTags = Array.isArray(memory.corruptedStage.recallTags)
			? [ ...memory.corruptedStage.recallTags ]
			: [];
		return;
	}

	if (memory.stability <= 0) {
		memory.stage = 'lost';
		memory.currentText = memory.lostStage && memory.lostStage.text
			? memory.lostStage.text
			: 'There was something here once, but it will not come back cleanly.';
		memory.currentTags = memory.lostStage && Array.isArray(memory.lostStage.recallTags)
			? [ ...memory.lostStage.recallTags ]
			: [];
		return;
	}

	const orderedStages = [ ...memory.stages ].sort((a, b) => b.minStability - a.minStability);

	for (const stage of orderedStages) {
		if (memory.stability >= stage.minStability) {
			memory.stage = stage.label;
			memory.currentText = stage.text;
			memory.currentTags = Array.isArray(stage.recallTags) ? [ ...stage.recallTags ] : [];
			return;
		}
	}

	const fallbackStage = orderedStages[orderedStages.length - 1] || {
		label: 'fading',
		text: memory.truthText || memory.label,
		recallTags: [],
	};

	memory.stage = fallbackStage.label;
	memory.currentText = fallbackStage.text;
	memory.currentTags = Array.isArray(fallbackStage.recallTags) ? [ ...fallbackStage.recallTags ] : [];
}

export function applyIssuePresentation(issue) {
	const orderedStages = [ ...issue.summaryStages ].sort((a, b) => b.minPrecision - a.minPrecision);

	if ([ 'resolved', 'dormant' ].includes(issue.lifecycleState)) {
		issue.stage = issue.lifecycleState;
		issue.currentText = issue.lifecycleState === 'resolved'
			? `"${issue.title}" is quiet for now.`
			: `"${issue.title}" is not moving right now.`;
		return;
	}

	for (const stage of orderedStages) {
		if (issue.precision >= stage.minPrecision) {
			issue.stage = stage.label;
			issue.currentText = stage.text;
			return;
		}
	}

	issue.stage = 'vague';
	issue.currentText = issue.truthText || issue.title;
}

export function applyActorPresentation(actor) {
	let mood = 'guarded';
	let summary = 'Watching the room and choosing words carefully.';

	if (actor.isSubject === true) {
		if (actor.subjectAwarenessState === 'confirmed') {
			mood = 'hostile';
			summary = 'They know the email is about them. Clean containment is over.';
		} else if (actor.subjectAwarenessState === 'suspicious' || actor.subjectAwarenessState === 'at_risk') {
			mood = 'watchful';
			summary = 'One bad beat away from realizing the room is behaving strangely around them.';
		}
	}

	if (actor.deliveryState === 'received_unread' && actor.isSubject !== true) {
		mood = 'watchful';
		summary = 'They have the message but have not opened it yet.';
	}

	if (actor.deliveryState === 'received_read' && actor.isSubject !== true) {
		summary = 'They have seen the email and are now part of the spread risk.';
	}

	if (actor.playerSuspicion >= 70 || actor.suspicion >= 70) {
		mood = 'watchful';
		summary = 'Tracking motives, timing, and anything that smells wrong.';
	} else if (actor.playerLikability <= 25 || actor.disposition <= -25) {
		mood = 'hostile';
		summary = 'Ready to make your day worse if given an excuse.';
	} else if ((actor.playerLikability >= 65 || actor.disposition >= 25) && actor.stability >= 55) {
		mood = 'open';
		summary = 'Still reachable if you do not push too hard.';
	} else if (actor.stability <= 35) {
		mood = 'shaken';
		summary = 'Unsteady enough to talk, react, or make this bigger.';
	} else if (actor.pressure <= 15 && actor.playerSuspicion <= 20 && actor.suspicion <= 20) {
		mood = 'settled';
		summary = 'Not calm exactly, but not looking for blood either.';
	}

	actor.currentMood = mood;
	actor.currentSummary = summary;
}

function applyRelationshipPresentation(relationship) {
	let label = 'neutral';
	let summary = 'No strong lean.';
	const effectiveValue = clamp((Number(relationship.value) || 0) - (Number(relationship.strain) || 0), -100, 100);

	if (relationship.isActive === false) {
		label = 'inactive';
		summary = 'Currently offline as a reliable path.';
	} else if (effectiveValue <= -60) {
		label = 'hostile';
		summary = 'Actively adversarial.';
	} else if (effectiveValue <= -20) {
		label = 'strained';
		summary = 'Cold enough to create friction.';
	} else if (effectiveValue >= 60) {
		label = 'allied';
		summary = 'Likely to protect or support.';
	} else if (effectiveValue >= 20) {
		label = 'warm';
		summary = 'Generally favorable.';
	}

	relationship.currentLabel = label;
	relationship.currentSummary = summary;
}

function applyLogicPresentation(logic) {
	const truths = logic.truths || {};
	let correctMatches = 0;
	let incorrectMatches = 0;
	let solved = true;

	logic.actors.forEach((actor) => {
		logic.categories.forEach((category) => {
			const truthValue = truths?.[actor.id]?.[category.id];
			let rowHasCorrectMatch = false;
			let rowMatchCount = 0;

			category.values.forEach((value) => {
				const mark = logic.notebook?.[actor.id]?.[category.id]?.[value.id] || 'unknown';

				if (mark === 'match') {
					rowMatchCount += 1;

					if (value.id === truthValue) {
						correctMatches += 1;
						rowHasCorrectMatch = true;
					} else {
						incorrectMatches += 1;
					}
				}
			});

			if (rowMatchCount !== 1 || rowHasCorrectMatch !== true) {
				solved = false;
			}
		});
	});

	logic.progress = {
		correctMatches,
		totalMatches: logic.actors.length * logic.categories.length,
		incorrectMatches,
		solved,
	};
}