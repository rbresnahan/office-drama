import { NPC_ORDER, createNpcRoster } from './npcs.js';

function clone(value) {
	return JSON.parse(JSON.stringify(value));
}

function pickRandom(items, rng = Math.random) {
	if (!Array.isArray(items) || items.length === 0) {
		return null;
	}

	const index = Math.floor(rng() * items.length);
	return items[index];
}

function shuffle(items, rng = Math.random) {
	const copy = [ ...items ];

	for (let index = copy.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(rng() * (index + 1));
		const current = copy[index];
		copy[index] = copy[swapIndex];
		copy[swapIndex] = current;
	}

	return copy;
}

function createRecipientPriority(roster, targetId) {
	const target = roster.find((npc) => npc.id === targetId);
	const priority = [];

	if (target && target.primaryAllyId && target.primaryAllyId !== 'player') {
		priority.push(target.primaryAllyId);
	}

	if (target && target.secondaryAllyId && target.secondaryAllyId !== 'player') {
		priority.push(target.secondaryAllyId);
	}

	const others = roster
		.filter((npc) => npc.id !== targetId)
		.map((npc) => npc.id)
		.filter((id) => !priority.includes(id));

	return [ ...priority, ...others ];
}

function markRead(npc, isRead = true) {
	npc.deliveryState = isRead ? 'received_read' : 'received_unread';
	npc.knowledgeState = isRead ? 'confirmed' : 'none';
}

function setSubjectState(npc, deliveryState, awarenessState) {
	npc.isSubject = true;
	npc.deliveryState = deliveryState;
	npc.subjectAwarenessState = awarenessState;
	npc.knowledgeState = deliveryState === 'received_read' ? 'confirmed' : 'none';
}

export const GAME_PHASES = {
	containment: 'containment',
	defensive: 'defensive',
	allHands: 'all_hands',
	resolved: 'resolved',
};

export const OFFICE_FOCUS_STATES = {
	background: 'background',
	active: 'active',
	dominant: 'dominant',
};

export const DELIVERY_PATTERNS = {
	wide_including_subject: {
		id: 'wide_including_subject',
		label: 'Wide Including Subject',
		description: 'Most or all of the office got the email, including the subject.',
		startingOfficeFocus: OFFICE_FOCUS_STATES.active,
		startingGamePhase: GAME_PHASES.containment,
	},
	wide_excluding_subject: {
		id: 'wide_excluding_subject',
		label: 'Wide Excluding Subject',
		description: 'Most or all of the office got the email, but the subject did not.',
		startingOfficeFocus: OFFICE_FOCUS_STATES.active,
		startingGamePhase: GAME_PHASES.containment,
	},
	limited_group: {
		id: 'limited_group',
		label: 'Limited Group',
		description: 'Only a few coworkers got the email.',
		startingOfficeFocus: OFFICE_FOCUS_STATES.background,
		startingGamePhase: GAME_PHASES.containment,
	},
	subject_only_unread: {
		id: 'subject_only_unread',
		label: 'Subject Only Unread',
		description: 'Only the subject got the email, and they have not opened it yet.',
		startingOfficeFocus: OFFICE_FOCUS_STATES.background,
		startingGamePhase: GAME_PHASES.containment,
	},
	messy_partial: {
		id: 'messy_partial',
		label: 'Messy Partial',
		description: 'A mixed subset got the email, creating awkward spread routes.',
		startingOfficeFocus: OFFICE_FOCUS_STATES.background,
		startingGamePhase: GAME_PHASES.containment,
	},
};

export function chooseEmailTargetId(rng = Math.random) {
	return pickRandom(NPC_ORDER, rng);
}

export function chooseDeliveryPatternId(rng = Math.random) {
	return pickRandom(Object.keys(DELIVERY_PATTERNS), rng);
}

export function createRunSetup({
	targetId = null,
	patternId = null,
	rng = Math.random,
} = {}) {
	const roster = createNpcRoster();
	const resolvedTargetId = targetId || chooseEmailTargetId(rng);
	const resolvedPatternId = patternId || chooseDeliveryPatternId(rng);
	const pattern = DELIVERY_PATTERNS[resolvedPatternId];
	const recipientPriority = createRecipientPriority(roster, resolvedTargetId);

	const targetNpc = roster.find((npc) => npc.id === resolvedTargetId);

	if (!targetNpc || !pattern) {
		throw new Error('Invalid run setup. Target or pattern is missing.');
	}

	const recipientLookup = new Set();

	switch (resolvedPatternId) {
		case 'wide_including_subject': {
			roster.forEach((npc) => {
				if (npc.id === resolvedTargetId) {
					setSubjectState(npc, 'received_unread', 'at_risk');
					return;
				}

				markRead(npc, true);
				recipientLookup.add(npc.id);
			});
			break;
		}

		case 'wide_excluding_subject': {
			roster.forEach((npc) => {
				if (npc.id === resolvedTargetId) {
					setSubjectState(npc, 'not_received', 'unaware');
					return;
				}

				markRead(npc, true);
				recipientLookup.add(npc.id);
			});
			break;
		}

		case 'limited_group': {
			setSubjectState(targetNpc, 'not_received', 'unaware');

			recipientPriority
				.slice(0, 2)
				.forEach((id) => {
					const npc = roster.find((entry) => entry.id === id);

					if (npc) {
						markRead(npc, true);
						recipientLookup.add(id);
					}
				});
			break;
		}

		case 'subject_only_unread': {
			setSubjectState(targetNpc, 'received_unread', 'at_risk');
			break;
		}

		case 'messy_partial': {
			setSubjectState(targetNpc, 'not_received', 'unaware');

			shuffle(recipientPriority, rng)
				.slice(0, 3)
				.forEach((id, index) => {
					const npc = roster.find((entry) => entry.id === id);

					if (!npc) {
						return;
					}

					markRead(npc, index === 0);
					recipientLookup.add(id);
				});
			break;
		}

		default: {
			setSubjectState(targetNpc, 'not_received', 'unaware');
			break;
		}
	}

	if (!targetNpc.isSubject) {
		targetNpc.isSubject = true;
	}

	return {
		emailTargetId: resolvedTargetId,
		deliveryPatternId: resolvedPatternId,
		officeFocusState: pattern.startingOfficeFocus,
		gamePhase: pattern.startingGamePhase,
		fairIntervention: {
			pending: targetNpc.deliveryState === 'received_unread',
			minimumTurnsRemaining: targetNpc.deliveryState === 'received_unread' ? 1 : 0,
			subjectCanAutoRead: false,
		},
		npcs: roster,
		recipientIds: [ ...recipientLookup ],
		targetRecipientPriority: clone(recipientPriority),
	};
}