function cloneValue(value) {
	return JSON.parse(JSON.stringify(value));
}

function createStateStore(initialState) {
	const baseState = cloneValue(initialState);
	let currentState = cloneValue(baseState);

	return {
		reset: function () {
			currentState = cloneValue(baseState);
		},
		getState: function () {
			return cloneValue(currentState);
		},
		getMutableState: function () {
			return currentState;
		},
	};
}

function checkCondition(condition, state) {
	const { key, equals, notEquals, greaterThan, lessThan } = condition;
	const value = state[key];

	if (typeof equals !== "undefined" && value !== equals) {
		return false;
	}

	if (typeof notEquals !== "undefined" && value === notEquals) {
		return false;
	}

	if (typeof greaterThan !== "undefined" && !(value > greaterThan)) {
		return false;
	}

	if (typeof lessThan !== "undefined" && !(value < lessThan)) {
		return false;
	}

	return true;
}

function checkConditions(conditions, state) {
	return conditions.every(function (condition) {
		return checkCondition(condition, state);
	});
}

function applyEffect(effect, state) {
	const { type, key, value } = effect;

	switch (type) {
		case "set":
			state[key] = value;
			break;

		case "increment":
			state[key] = (state[key] || 0) + value;
			break;

		case "decrement":
			state[key] = (state[key] || 0) - value;
			break;

		case "push":
			if (!Array.isArray(state[key])) {
				state[key] = [];
			}

			state[key].push(value);
			break;

		case "remove":
			if (Array.isArray(state[key])) {
				state[key] = state[key].filter(function (item) {
					return item !== value;
				});
			}
			break;

		default:
			console.warn("Unknown effect type:", type);
	}
}

function applyEffects(effects, state) {
	effects.forEach(function (effect) {
		applyEffect(effect, state);
	});
}

export {
	createStateStore,
	checkConditions,
	applyEffects,
};