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
				confidence: value === 'confirmed' ? 80 : 55,
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

export function createInitialState(baseInitialState = {}) {
	const state = deepClone(baseInitialState);

	state.turn = Number(state.turn) || 0;
	state.stats = state.stats || {};
	state.flags = state.flags || {};
	state.evidence = Array.isArray(state.evidence) ? state.evidence : [];
	state.memories = Array.isArray(state.memories) ? state.memories.map(createMemoryFromSeed) : [];
	state.issues = Array.isArray(state.issues) ? state.issues.map(createIssueFromSeed) : [];
	state.actors = Array.isArray(state.actors) ? state.actors.map(createActorFromSeed) : [];
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
		disposition: typeof seed.disposition === 'number' ? seed.disposition : 0,
		stability: typeof seed.stability === 'number' ? seed.stability : 60,
		suspicion: typeof seed.suspicion === 'number' ? seed.suspicion : 0,
		talkativeness: typeof seed.talkativeness === 'number' ? seed.talkativeness : 50,
		pressure: typeof seed.pressure === 'number' ? seed.pressure : 0,
		connections: Array.isArray(seed.connections) ? [ ...seed.connections ] : [],
		knowledge: normalizeKnowledge(seed.knowledge),
		beliefs: seed.beliefs ? deepClone(seed.beliefs) : {},
		currentMood: 'guarded',
		currentSummary: '',
	};

	applyActorPresentation(actor);
	return actor;
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

	if (typeof actor.suspicion === 'number') {
		actor.suspicion = clamp(actor.suspicion, 0, 100);
	}

	if (typeof actor.stability === 'number') {
		actor.stability = clamp(actor.stability, 0, 100);
	}

	if (typeof actor.pressure === 'number') {
		actor.pressure = clamp(actor.pressure, 0, 100);
	}

	applyActorPresentation(actor);
	return actor;
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

	if (actor.suspicion >= 70) {
		mood = 'watchful';
		summary = 'Tracking motives, timing, and anything that smells wrong.';
	} else if (actor.disposition <= -25) {
		mood = 'hostile';
		summary = 'Ready to make your day worse if given an excuse.';
	} else if (actor.disposition >= 25 && actor.stability >= 55) {
		mood = 'open';
		summary = 'Still reachable if you do not push too hard.';
	} else if (actor.stability <= 35) {
		mood = 'shaken';
		summary = 'Unsteady enough to talk, react, or make this bigger.';
	} else if (actor.pressure <= 15 && actor.suspicion <= 20) {
		mood = 'settled';
		summary = 'Not calm exactly, but not looking for blood either.';
	}

	actor.currentMood = mood;
	actor.currentSummary = summary;
}