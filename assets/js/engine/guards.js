export function isChoiceAvailable(choice, state) {
	if (!choice.condition) {
		return true;
	}

	return choice.condition(state);
}

export function getProcessedChoices(node, state) {
	if (!node.choices || !Array.isArray(node.choices)) {
		return [];
	}

	return node.choices
		.map((choice) => {
			const available = isChoiceAvailable(choice, state);
			const hideWhenUnavailable = choice.hideWhenUnavailable === true;

			return {
				...choice,
				available,
				hidden: !available && hideWhenUnavailable,
			};
		})
		.filter((choice) => !choice.hidden);
}

function getRedirectRules(node) {
	if (!node.redirect) {
		return [];
	}

	if (Array.isArray(node.redirect)) {
		return node.redirect;
	}

	return [node.redirect];
}

function buildRedirectKey(nodeId, index) {
	return `${nodeId}:${index}`;
}

export function processNodeRedirects({
	nodeId,
	nodes,
	state,
	triggeredRedirects,
	resolveValue,
	addEvent,
	applyEffects,
	maxDepth = 25,
}) {
	let currentNodeId = nodeId;
	let depth = 0;

	while (depth < maxDepth) {
		const node = nodes[currentNodeId];

		if (!node) {
			return currentNodeId;
		}

		const redirectRules = getRedirectRules(node);
		let redirected = false;

		for (let index = 0; index < redirectRules.length; index += 1) {
			const rule = redirectRules[index];
			const redirectKey = buildRedirectKey(currentNodeId, index);
			const alreadyTriggered = triggeredRedirects[redirectKey] === true;
			const redirectOnce = rule.redirectOnce === true;

			if (redirectOnce && alreadyTriggered) {
				continue;
			}

			if (!rule.condition || rule.condition(state)) {
				addEvent(resolveValue(rule.feedback, state));
				applyEffects(resolveValue(rule.effects, state));

				if (redirectOnce) {
					triggeredRedirects[redirectKey] = true;
				}

				if (rule.next && rule.next !== currentNodeId) {
					currentNodeId = rule.next;
					redirected = true;
					break;
				}
			}
		}

		if (!redirected) {
			return currentNodeId;
		}

		depth += 1;
	}

	throw new Error('Redirect loop detected. Check your node redirect rules.');
}