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

	knowsTag(state, tag) {
		return hasMemoryTag(state, tag) || evidenceCountByTag(state, tag) > 0;
	},
};