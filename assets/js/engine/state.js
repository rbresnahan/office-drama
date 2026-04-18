export function createInitialState(baseInitialState = {}) {
	return {
		...baseInitialState,
	};
}

export function resolveValue(value, state) {
	if (typeof value === 'function') {
		return value(state);
	}

	return value;
}