import { resolveValue } from './state.js';

function getChoiceCondition(choice) {
	return choice.condition || choice.availableIf;
}

function getChoiceDisabledCondition(choice) {
	return choice.disabledCondition || choice.disabledIf;
}

export function isChoiceAvailable(choice, state) {
	const condition = getChoiceCondition(choice);

	if (!condition) {
		return true;
	}

	return resolveValue(condition, state) !== false;
}

export function isChoiceDisabled(choice, state) {
	const disabledCondition = getChoiceDisabledCondition(choice);

	if (!disabledCondition) {
		return false;
	}

	return resolveValue(disabledCondition, state) === true;
}

export function getProcessedChoices(node, state) {
	if (!node.choices || !Array.isArray(node.choices)) {
		return [];
	}

	return node.choices
		.map((choice) => {
			const available = isChoiceAvailable(choice, state);
			const hidden = !available && choice.hideWhenUnavailable === true;

			if (hidden) {
				return null;
			}

			const disabled = available ? isChoiceDisabled(choice, state) : true;

			return {
				...choice,
				available,
				disabled,
				text: resolveValue(choice.text, state) || 'Continue',
				unavailableText: resolveValue(choice.unavailableText, state) || '',
			};
		})
		.filter(Boolean);
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
	resolveValue: resolveStateValue,
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
			const redirectOnce = rule.redirectOnce === true || rule.once === true;

			if (redirectOnce && alreadyTriggered) {
				continue;
			}

			if (!rule.condition || resolveStateValue(rule.condition)) {
				addEvent(resolveStateValue(rule.feedback));
				applyEffects(resolveStateValue(rule.effects));

				if (redirectOnce) {
					triggeredRedirects[redirectKey] = true;
				}

				const targetNode = rule.next || rule.to;

				if (targetNode && targetNode !== currentNodeId) {
					currentNodeId = resolveStateValue(targetNode);
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