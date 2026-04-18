export function applyEffects(state, effects) {
	if (!effects) {
		return;
	}

	Object.keys(effects).forEach((key) => {
		const instruction = effects[key];

		if (
			typeof instruction === 'object' &&
			instruction !== null &&
			!Array.isArray(instruction)
		) {
			if (Object.prototype.hasOwnProperty.call(instruction, 'set')) {
				state[key] = instruction.set;
				return;
			}

			if (Object.prototype.hasOwnProperty.call(instruction, 'add')) {
				const currentValue = Number(state[key]) || 0;
				state[key] = currentValue + instruction.add;
				return;
			}

			if (Object.prototype.hasOwnProperty.call(instruction, 'toggle')) {
				state[key] = !state[key];
				return;
			}

			return;
		}

		state[key] = instruction;
	});
}