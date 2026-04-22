import {
	addEvidence,
	addIssue,
	addMemory,
	addSignal,
	adjustActor,
	adjustIssue,
	clearBelief,
	commitBelief,
	containIssue,
	distortMemory,
	exposeIssue,
	findActorById,
	hasEvidence,
	preserveMemory,
	reinforceMemory,
	resolveValue,
	setActorBelief,
	setActorKnowledge,
	setIssueLifecycle,
	shiftIssuePrecision,
} from './state.js';

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

function normalizeEffects(effects) {
	if (!effects) {
		return [];
	}

	if (Array.isArray(effects)) {
		return effects;
	}

	return [effects];
}

export function applyEffects(state, effects, options = {}) {
	const normalizedEffects = normalizeEffects(effects);
	const signalLimit = typeof options.signalLimit === 'number' ? options.signalLimit : 6;
	const resolve = (value) => resolveValue(value, state);

	normalizedEffects.forEach((effect) => {
		if (!effect) {
			return;
		}

		if (!effect.type) {
			Object.keys(effect).forEach((key) => {
				setAtPath(state, key, resolve(effect[key]));
			});
			return;
		}

		switch (effect.type) {
			case 'set': {
				setAtPath(state, effect.path, resolve(effect.value));
				break;
			}

			case 'add': {
				const currentValue = Number(getAtPath(state, effect.path)) || 0;
				setAtPath(state, effect.path, currentValue + Number(resolve(effect.value) || 0));
				break;
			}

			case 'toggle': {
				const currentValue = Boolean(getAtPath(state, effect.path));
				setAtPath(state, effect.path, !currentValue);
				break;
			}

			case 'addMemory': {
				addMemory(state, resolve(effect.memory));
				break;
			}

			case 'reinforceMemory': {
				reinforceMemory(state, resolve(effect.key), Number(resolve(effect.amount) || 10));
				break;
			}

			case 'preserveMemory': {
				preserveMemory(state, resolve(effect.key));
				break;
			}

			case 'distortMemory': {
				distortMemory(state, resolve(effect.key), resolve(effect.falseStage));
				break;
			}

			case 'addIssue': {
				addIssue(state, resolve(effect.issue));
				break;
			}

			case 'issueSet': {
				adjustIssue(state, resolve(effect.id), resolve(effect.path), resolve(effect.value), 'set');
				break;
			}

			case 'issueAdd': {
				adjustIssue(state, resolve(effect.id), resolve(effect.path), resolve(effect.value), 'add');
				break;
			}

			case 'issueContain': {
				containIssue(state, resolve(effect.id), Number(resolve(effect.amount) || 0));
				break;
			}

			case 'issueExpose': {
				exposeIssue(state, resolve(effect.id), Number(resolve(effect.amount) || 0));
				break;
			}

			case 'issueLifecycle': {
				setIssueLifecycle(state, resolve(effect.id), resolve(effect.lifecycleState));
				break;
			}

			case 'issuePrecision': {
				shiftIssuePrecision(state, resolve(effect.id), Number(resolve(effect.amount) || 0));
				break;
			}

			case 'actorSet': {
				adjustActor(state, resolve(effect.id), resolve(effect.path), resolve(effect.value), 'set');
				break;
			}

			case 'actorAdd': {
				adjustActor(state, resolve(effect.id), resolve(effect.path), resolve(effect.value), 'add');
				break;
			}

			case 'actorKnowledge': {
				setActorKnowledge(
					state,
					resolve(effect.id),
					resolve(effect.issueId),
					resolve(effect.level),
					Number(resolve(effect.confidence) || 50),
					resolve(effect.source) || 'player'
				);
				break;
			}

			case 'actorBelief': {
				setActorBelief(
					state,
					resolve(effect.id),
					resolve(effect.key),
					resolve(effect.label),
					Number(resolve(effect.confidence) || 60)
				);
				break;
			}

			case 'addEvidence': {
				const evidence = resolve(effect.evidence);
				const added = addEvidence(state, evidence);

				if (added && evidence && typeof evidence.anchorMemoryKey === 'string') {
					preserveMemory(state, evidence.anchorMemoryKey);
				}
				break;
			}

			case 'commitBelief': {
				commitBelief(state, resolve(effect.key), resolve(effect.label));
				break;
			}

			case 'clearBelief': {
				clearBelief(state, resolve(effect.key));
				break;
			}

			case 'addSignal': {
				addSignal(state, resolve(effect.message), signalLimit);
				break;
			}

			case 'ifMissingEvidence': {
				const evidenceId = resolve(effect.id);

				if (!hasEvidence(state, evidenceId)) {
					applyEffects(state, resolve(effect.effects), options);
				}
				break;
			}

			case 'ifActorMissingKnowledge': {
				const actor = findActorById(state, resolve(effect.id));
				const issueId = resolve(effect.issueId);
				const actorKnowledge = actor && actor.knowledge ? actor.knowledge[issueId] : null;

				if (!actorKnowledge || actorKnowledge.level === 'none') {
					applyEffects(state, resolve(effect.effects), options);
				}
				break;
			}

			default: {
				break;
			}
		}
	});
}