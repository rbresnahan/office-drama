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

export function createInitialState(baseInitialState = {}) {
	const state = deepClone(baseInitialState);

	state.turn = Number(state.turn) || 0;
	state.stats = state.stats || {};
	state.flags = state.flags || {};
	state.evidence = Array.isArray(state.evidence) ? state.evidence : [];
	state.memories = Array.isArray(state.memories) ? state.memories.map(createMemoryFromSeed) : [];
	state.beliefs = state.beliefs || {};
	state.signals = Array.isArray(state.signals) ? state.signals : [];
	state.firedTurnEvents = Array.isArray(state.firedTurnEvents) ? state.firedTurnEvents : [];
	state.ending = state.ending || null;

	state.memories.forEach((memory) => {
		applyMemoryPresentation(memory);
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

export function findMemoryByKey(state, key) {
	return state.memories.find((memory) => memory.key === key) || null;
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
				changes.push('A repeated story settles into your head like it belongs there.');
			} else if (memory.stage === 'lost') {
				changes.push('A memory caves in until only the shape of it remains.');
			} else if (previousStage !== memory.stage) {
				changes.push('A detail slips. The memory is still there, but less of it is yours.');
			}
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