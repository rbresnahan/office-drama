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

function hasEvidence(state, id) {
	return Array.isArray(state.evidence) && state.evidence.some((item) => item.id === id);
}

function hasBelief(state, key) {
	return Boolean(state.beliefs && state.beliefs[key]);
}

function evidenceCountByTag(state, tag) {
	if (!Array.isArray(state.evidence)) {
		return 0;
	}

	return state.evidence.filter((item) => Array.isArray(item.tags) && item.tags.includes(tag)).length;
}

function memoryByKey(state, key) {
	if (!Array.isArray(state.memories)) {
		return null;
	}

	return state.memories.find((memory) => memory.key === key) || null;
}

function issueById(state, id) {
	if (!Array.isArray(state.issues)) {
		return null;
	}

	return state.issues.find((issue) => issue.id === id) || null;
}

function actorById(state, id) {
	if (!Array.isArray(state.actors)) {
		return null;
	}

	return state.actors.find((actor) => actor.id === id) || null;
}

function relationshipByPair(state, from, to) {
	if (!Array.isArray(state.relationships)) {
		return null;
	}

	return state.relationships.find((relationship) => relationship.from === from && relationship.to === to) || null;
}

function actorKnowledgeRank(level = 'none') {
	const map = {
		none: 0,
		heard: 1,
		repeated: 2,
		confirmed: 3,
		involved: 4,
	};

	return map[level] || 0;
}

function actorKnowsIssue(state, actorId, issueId, minimumLevel = 'heard') {
	const actor = actorById(state, actorId);

	if (!actor || !actor.knowledge || !actor.knowledge[issueId]) {
		return false;
	}

	return actorKnowledgeRank(actor.knowledge[issueId].level) >= actorKnowledgeRank(minimumLevel);
}

function hasMemoryTag(state, tag) {
	if (!Array.isArray(state.memories)) {
		return false;
	}

	return state.memories.some((memory) => {
		if (memory.stage === 'lost') {
			return false;
		}

		return Array.isArray(memory.currentTags) && memory.currentTags.includes(tag);
	});
}

export function paragraphs(...parts) {
	return parts
		.flat(Infinity)
		.filter((part) => part !== null && part !== undefined && part !== false && part !== '')
		.join('\n\n');
}

export function scene(config = {}) {
	return config;
}

export function choice(text, next, options = {}) {
	return {
		text,
		next,
		...options,
	};
}

export function restartChoice(text = 'Begin again.', options = {}) {
	return choice(text, 'restart', {
		consumesTurn: false,
		...options,
	});
}

export function endingNode(resolveEnding, options = {}) {
	return scene({
		kicker: options.kicker || 'Run Complete',
		title(state) {
			return resolveEnding(state).title;
		},
		text(state) {
			return resolveEnding(state).text;
		},
		choices: [
			restartChoice(options.restartText || 'Begin again.'),
		],
	});
}

export function status(label, getValue) {
	return {
		label,
		getValue,
	};
}

export const fx = {
	set(path, value) {
		return {
			type: 'set',
			path,
			value,
		};
	},

	add(path, value) {
		return {
			type: 'add',
			path,
			value,
		};
	},

	toggle(path) {
		return {
			type: 'toggle',
			path,
		};
	},

	addMemory(memory) {
		return {
			type: 'addMemory',
			memory,
		};
	},

	reinforceMemory(key, amount = 10) {
		return {
			type: 'reinforceMemory',
			key,
			amount,
		};
	},

	preserveMemory(key) {
		return {
			type: 'preserveMemory',
			key,
		};
	},

	distortMemory(key, falseStage) {
		return {
			type: 'distortMemory',
			key,
			falseStage,
		};
	},

	issue(issue) {
		return {
			type: 'addIssue',
			issue,
		};
	},

	issueSet(id, path, value) {
		return {
			type: 'issueSet',
			id,
			path,
			value,
		};
	},

	issueAdd(id, path, value) {
		return {
			type: 'issueAdd',
			id,
			path,
			value,
		};
	},

	issueContain(id, amount = 10) {
		return {
			type: 'issueContain',
			id,
			amount,
		};
	},

	issueExpose(id, amount = 10) {
		return {
			type: 'issueExpose',
			id,
			amount,
		};
	},

	issueLifecycle(id, lifecycleState) {
		return {
			type: 'issueLifecycle',
			id,
			lifecycleState,
		};
	},

	issuePrecision(id, amount) {
		return {
			type: 'issuePrecision',
			id,
			amount,
		};
	},

	actorSet(id, path, value) {
		return {
			type: 'actorSet',
			id,
			path,
			value,
		};
	},

	actorAdd(id, path, value) {
		return {
			type: 'actorAdd',
			id,
			path,
			value,
		};
	},

	relationshipSet(from, to, value) {
		return {
			type: 'relationshipSet',
			from,
			to,
			value,
		};
	},

	relationshipAdd(from, to, value) {
		return {
			type: 'relationshipAdd',
			from,
			to,
			value,
		};
	},

	actorKnowledge(id, issueId, level = 'heard', confidence = 55, source = 'player') {
		return {
			type: 'actorKnowledge',
			id,
			issueId,
			level,
			confidence,
			source,
		};
	},

	actorBelief(id, key, label, confidence = 60) {
		return {
			type: 'actorBelief',
			id,
			key,
			label,
			confidence,
		};
	},

	evidence(evidence) {
		return {
			type: 'addEvidence',
			evidence,
		};
	},

	belief(key, label) {
		return {
			type: 'commitBelief',
			key,
			label,
		};
	},

	clearBelief(key) {
		return {
			type: 'clearBelief',
			key,
		};
	},

	signal(message) {
		return {
			type: 'addSignal',
			message,
		};
	},

	ifMissingEvidence(id, effects) {
		return {
			type: 'ifMissingEvidence',
			id,
			effects,
		};
	},

	ifActorMissingKnowledge(id, issueId, effects) {
		return {
			type: 'ifActorMissingKnowledge',
			id,
			issueId,
			effects,
		};
	},
};

export const when = {
	always() {
		return true;
	},

	never() {
		return false;
	},

	path(path, expected = true) {
		return (state) => getAtPath(state, path) === expected;
	},

	flag(key, expected = true) {
		return (state) => {
			return Boolean(state.flags && state.flags[key]) === expected;
		};
	},

	evidence(id) {
		return (state) => hasEvidence(state, id);
	},

	evidenceTagged(tag) {
		return (state) => evidenceCountByTag(state, tag) > 0;
	},

	belief(key) {
		return (state) => hasBelief(state, key);
	},

	memoryTag(tag) {
		return (state) => hasMemoryTag(state, tag);
	},

	knowsTag(tag) {
		return (state) => hasMemoryTag(state, tag) || evidenceCountByTag(state, tag) > 0;
	},

	issueState(issueId, expectedState) {
		return (state) => {
			const issue = issueById(state, issueId);
			return Boolean(issue && issue.lifecycleState === expectedState);
		};
	},

	issueContainmentAtLeast(issueId, minimum) {
		return (state) => {
			const issue = issueById(state, issueId);
			return Boolean(issue && issue.containment >= minimum);
		};
	},

	issueContainmentAtMost(issueId, maximum) {
		return (state) => {
			const issue = issueById(state, issueId);
			return Boolean(issue && issue.containment <= maximum);
		};
	},

	issuePrecisionAtLeast(issueId, minimum) {
		return (state) => {
			const issue = issueById(state, issueId);
			return Boolean(issue && issue.precision >= minimum);
		};
	},

	actorDispositionAtLeast(actorId, minimum) {
		return (state) => {
			const actor = actorById(state, actorId);
			return Boolean(actor && actor.disposition >= minimum);
		};
	},

	actorSuspicionAtLeast(actorId, minimum) {
		return (state) => {
			const actor = actorById(state, actorId);
			return Boolean(actor && actor.suspicion >= minimum);
		};
	},

	actorStabilityAtMost(actorId, maximum) {
		return (state) => {
			const actor = actorById(state, actorId);
			return Boolean(actor && actor.stability <= maximum);
		};
	},

	relationshipAtLeast(from, to, minimum) {
		return (state) => {
			const relationship = relationshipByPair(state, from, to);
			return Boolean(relationship && relationship.value >= minimum);
		};
	},

	relationshipAtMost(from, to, maximum) {
		return (state) => {
			const relationship = relationshipByPair(state, from, to);
			return Boolean(relationship && relationship.value <= maximum);
		};
	},

	actorKnowsIssue(actorId, issueId, minimumLevel = 'heard') {
		return (state) => actorKnowsIssue(state, actorId, issueId, minimumLevel);
	},

	logicSolved() {
		return (state) => Boolean(state.logic && state.logic.progress && state.logic.progress.solved);
	},

	turnAtLeast(count) {
		return (state) => Number(state.turn) >= count;
	},

	and(...predicates) {
		return (state) => predicates.every((predicate) => predicate(state));
	},

	or(...predicates) {
		return (state) => predicates.some((predicate) => predicate(state));
	},

	not(predicate) {
		return (state) => predicate(state) === false;
	},
};

export const read = {
	path(state, path) {
		return getAtPath(state, path);
	},

	flag(state, key) {
		return Boolean(state.flags && state.flags[key]);
	},

	hasEvidence(state, id) {
		return hasEvidence(state, id);
	},

	hasBelief(state, key) {
		return hasBelief(state, key);
	},

	evidenceCountByTag(state, tag) {
		return evidenceCountByTag(state, tag);
	},

	memoryByKey(state, key) {
		return memoryByKey(state, key);
	},

	issueById(state, id) {
		return issueById(state, id);
	},

	actorById(state, id) {
		return actorById(state, id);
	},

	relationshipByPair(state, from, to) {
		return relationshipByPair(state, from, to);
	},

	actorKnowsIssue(state, actorId, issueId, minimumLevel = 'heard') {
		return actorKnowsIssue(state, actorId, issueId, minimumLevel);
	},

	logicSolved(state) {
		return Boolean(state.logic && state.logic.progress && state.logic.progress.solved);
	},

	logicProgress(state) {
		return state.logic && state.logic.progress ? state.logic.progress : null;
	},

	knowsTag(state, tag) {
		return hasMemoryTag(state, tag) || evidenceCountByTag(state, tag) > 0;
	},
};