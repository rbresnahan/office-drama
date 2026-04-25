import { APP_DATA, DEFAULT_ISSUE_TUNING, DEFAULT_MEMORY_TUNING } from '../../data.js';
import {
	choice,
	endingNode,
	fx,
	paragraphs,
	read,
	scene,
	status,
	when,
} from '../js/engine/story-helpers.js';
import { createRelationshipSeeds } from './relationships.js';
import { createRunSetup } from './run-setup.js';

const EMAIL_ISSUE_ID = 'reply-all';
const SUBJECT_FINDING_OUT_ID = 'subject-finding-out';
const HR_ISSUE_ID = 'hr-attention';
const DIRTY_RESIDUE_ID = 'dirty-residue';
const TIM_COMPROMISED_ID = 'tim-compromised';
const BETTY_TIM_FRICTION_ID = 'betty-tim-friction';
const MEETING_TURN_LIMIT = 6;

const LOCATION_BY_ID = {
	betty: 'Break room',
	tim: 'Printer bay',
	devon: 'IT room',
	frank: 'HR',
	celia: 'Conference room',
	lisa: 'Front desk',
};

const PRESSURE_POINT_TRUTHS = {
	betty: {
		pressurePoint: 'gossip',
		bestApproach: 'distract',
	},
	tim: {
		pressurePoint: 'uncertainty',
		bestApproach: 'reassure',
	},
	devon: {
		pressurePoint: 'disruption',
		bestApproach: 'verify',
	},
	frank: {
		pressurePoint: 'liability',
		bestApproach: 'confess',
	},
};

const runSetup = createRunSetup();
const subjectId = runSetup.emailTargetId;
const subjectSeed = runSetup.npcs.find((npc) => npc.id === subjectId);
const subjectName = subjectSeed ? subjectSeed.name : 'the wrong coworker';
const recipientMap = new Map(runSetup.npcs.map((npc) => [ npc.id, npc ]));
const recipientNames = runSetup.recipientIds
	.map((id) => recipientMap.get(id)?.name)
	.filter(Boolean);

const canReachFinale = when.or(
	when.flag('finaleUnlocked'),
	when.turnAtLeast(5),
	(state) => read.path(state, 'gamePhase') === 'defensive',
	when.issueState(SUBJECT_FINDING_OUT_ID, 'reactivated')
);

function listNames(names = []) {
	if (names.length === 0) {
		return 'nobody useful';
	}

	if (names.length === 1) {
		return names[0];
	}

	if (names.length === 2) {
		return `${names[0]} and ${names[1]}`;
	}

	return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

function buildEmailBodyText(target) {
	return `You wrote that ${target} has been coasting on fake empathy, private politeness, and other people's cleanup work.`;
}

function buildDistributionText(names) {
	if (names.length === 0) {
		return `Recall mostly worked, but you do not trust that as much as you wish you did.`;
	}

	return `The current known blast radius includes ${listNames(names)}.`;
}

function mapNpcSeedToActor(seed) {
	const deliveryKnowledge = {};

	if (seed.deliveryState === 'received_read') {
		deliveryKnowledge[EMAIL_ISSUE_ID] = {
			level: 'confirmed',
			confidence: seed.isSubject ? 94 : 82,
			source: 'email',
		};
	}

	return {
		id: seed.id,
		name: seed.name,
		role: seed.role,
		location: LOCATION_BY_ID[seed.id] || 'Office',
		playerLikability: seed.playerLikability,
		playerSuspicion: seed.playerSuspicion,
		mood: seed.mood,
		deliveryState: seed.deliveryState,
		knowledgeState: seed.knowledgeState,
		isSubject: seed.isSubject,
		subjectAwarenessState: seed.subjectAwarenessState,
		primaryAllyId: seed.primaryAllyId,
		secondaryAllyId: seed.secondaryAllyId,
		rivalId: seed.rivalId,
		traits: seed.traits,
		disposition: seed.playerLikability - 50,
		stability: Math.round(((seed.traits.courage || 50) + (seed.traits.ruleFollowing || 50)) / 2),
		suspicion: seed.playerSuspicion,
		talkativeness: seed.traits.gossipAppetite,
		pressure: seed.subjectAwarenessState === 'at_risk' ? 35 : 0,
		connections: [ seed.primaryAllyId, seed.secondaryAllyId ].filter((id) => id && id !== 'player'),
		knowledge: deliveryKnowledge,
	};
}

function mapRelationshipSeedToLegacy(seed) {
	const baseValue = seed.bondStrength - 50;
	const relationships = [
		{
			from: seed.leftId,
			to: seed.rightId,
			value: baseValue,
			pairId: seed.pairId,
			bondStrength: seed.bondStrength,
			sentimentTransferStrength: seed.sentimentTransferStrength,
			isMutual: seed.isMutual,
			isActive: seed.isActive,
			strain: seed.strain,
			isolatedUntilTurn: seed.isolatedUntilTurn,
		},
	];

	if (seed.isMutual === true) {
		relationships.push({
			from: seed.rightId,
			to: seed.leftId,
			value: baseValue,
			pairId: `${seed.pairId}_reverse`,
			bondStrength: seed.bondStrength,
			sentimentTransferStrength: seed.sentimentTransferStrength,
			isMutual: seed.isMutual,
			isActive: seed.isActive,
			strain: seed.strain,
			isolatedUntilTurn: seed.isolatedUntilTurn,
		});
	}

	return relationships;
}

function createInitialIssues() {
	const linkedActors = Array.from(new Set([ subjectId, ...runSetup.recipientIds ])).filter(Boolean);

	return [
		{
			id: EMAIL_ISSUE_ID,
			title: 'Reply-all email',
			truthText: `A bad email about ${subjectName} escaped into the office and is now moving faster than you are.`,
			severity: 88,
			spreadRisk: runSetup.recipientIds.length >= 4 ? 74 : runSetup.recipientIds.length >= 2 ? 58 : 42,
			precision: 92,
			containment: 18,
			lifecycleState: 'active',
			linkedActors,
			summaryStages: [
				{
					label: 'focused',
					minPrecision: 75,
					text: `Your gossip email about ${subjectName} is loose in the office, and at least one person is already enjoying it.`,
				},
				{
					label: 'blurred',
					minPrecision: 40,
					text: `The wrong people have the message, and the room is starting to form theories about ${subjectName} faster than facts.`,
				},
				{
					label: 'vague',
					minPrecision: 0,
					text: `A bad message about ${subjectName} is moving through the office and changing shape as it goes.`,
				},
			],
		},
		{
			id: SUBJECT_FINDING_OUT_ID,
			title: `${subjectName} finding out`,
			truthText: `${subjectName} is still outside the core loop, but not for long.`,
			severity: 94,
			spreadRisk: 52,
			precision: 84,
			containment: 36,
			lifecycleState: 'warming',
			linkedActors: [ subjectId, subjectSeed?.primaryAllyId, subjectSeed?.secondaryAllyId ].filter(Boolean),
			summaryStages: [
				{
					label: 'focused',
					minPrecision: 75,
					text: `${subjectName} does not know yet, but the number of ways they can hear it is multiplying.`,
				},
				{
					label: 'blurred',
					minPrecision: 40,
					text: `${subjectName} is near the edge of the story now. One bad hallway conversation could finish the trip.`,
				},
				{
					label: 'vague',
					minPrecision: 0,
					text: `The target is no longer safely outside the fallout.`,
				},
			],
		},
		{
			id: HR_ISSUE_ID,
			title: 'HR attention',
			truthText: 'Frank does not need to care much for this to become official.',
			severity: 82,
			spreadRisk: 36,
			precision: 78,
			containment: 62,
			lifecycleState: 'warming',
			linkedActors: ['frank'],
			summaryStages: [
				{
					label: 'focused',
					minPrecision: 75,
					text: 'HR has not fully stepped in, but the threshold is getting lower every minute.',
				},
				{
					label: 'blurred',
					minPrecision: 40,
					text: 'Policy is drifting closer. That is rarely a compliment.',
				},
				{
					label: 'vague',
					text: 'The problem is developing paperwork teeth.',
				},
			],
		},
		{
			id: DIRTY_RESIDUE_ID,
			title: 'Dirty residue',
			truthText: 'The office may forgive the email before it forgives whatever you do to hide it.',
			severity: 12,
			spreadRisk: 20,
			precision: 72,
			containment: 80,
			lifecycleState: 'warming',
			linkedActors: ['tim', 'frank'],
			summaryStages: [
				{
					label: 'focused',
					minPrecision: 75,
					text: 'You have not crossed into really ugly tactics yet, but the door is open.',
				},
				{
					label: 'blurred',
					minPrecision: 40,
					text: 'Containment is starting to cost character, not just effort.',
				},
				{
					label: 'vague',
					text: 'The cure is starting to smell worse than the wound.',
				},
			],
		},
		{
			id: TIM_COMPROMISED_ID,
			title: 'Tim compromised',
			truthText: 'Tim is nervous enough to become a tool, a leak, or a casualty depending on what you do.',
			severity: 30,
			spreadRisk: 18,
			precision: 70,
			containment: 90,
			lifecycleState: 'warming',
			linkedActors: ['tim', 'frank'],
			summaryStages: [
				{
					label: 'focused',
					minPrecision: 75,
					text: 'Tim is still mostly fine, which means you still have the chance to leave him that way.',
				},
				{
					label: 'blurred',
					minPrecision: 40,
					text: 'Tim is becoming part of the strategy whether he deserves it or not.',
				},
				{
					label: 'vague',
					text: 'Someone weaker than you is being drawn into the blast radius.',
				},
			],
		},
	];
}

function getSubjectActor(state) {
	return read.actorById(state, state.emailTargetId || read.path(state, 'flags.emailTargetId'));
}

function getSubjectName(state) {
	const actor = getSubjectActor(state);
	return actor ? actor.name : subjectName;
}

function getAveragePlayerSuspicion(state) {
	const actors = Array.isArray(state.actors) ? state.actors : [];

	if (!actors.length) {
		return 0;
	}

	const total = actors.reduce((sum, actor) => {
		return sum + (Number(actor.playerSuspicion ?? actor.suspicion) || 0);
	}, 0);

	return Math.round(total / actors.length);
}

function getEarnedMeetingActions(state) {
	return Array.isArray(state.earnedMeetingActions) ? state.earnedMeetingActions : [];
}

function hasEarnedMeetingAction(state, actionId) {
	return getEarnedMeetingActions(state).includes(actionId);
}

function syncEarnedMeetingActions(state) {
	const actions = [];
	const flags = state.flags || {};

	if (flags.timSetUp === true) {
		actions.push('accuse_tim_drunk');
	}

	if (
		flags.frankBriefed === true
		|| flags.recallEnabled === true
		|| flags.printerCopiesRemoved === true
	) {
		actions.push('procedural_containment');
	}

	if (flags.targetWarned === true) {
		actions.push('controlled_confession');
	}

	state.earnedMeetingActions = actions;
	return actions;
}

function getKnowledgeWeight(actor, issueId) {
	const knowledge = actor && actor.knowledge ? actor.knowledge[issueId] : null;

	if (!knowledge) {
		return 0;
	}

	switch (knowledge.level) {
		case 'confirmed':
			return 24;
		case 'suspects':
			return 16;
		case 'heard':
			return 8;
		default:
			return 0;
	}
}

function getRecipientPriority(state, helpers, senderId) {
	const sender = helpers.findActorById(senderId);

	if (!sender) {
		return [];
	}

	const allActors = Array.isArray(state.actors) ? state.actors : [];
	const priorityIds = [];

	(sender.connections || []).forEach((id) => {
		if (id && !priorityIds.includes(id) && id !== senderId) {
			priorityIds.push(id);
		}
	});

	allActors.forEach((actor) => {
		if (actor.id === senderId || priorityIds.includes(actor.id)) {
			return;
		}

		const relationship = helpers.findRelationship(senderId, actor.id);

		if (relationship && relationship.isActive !== false) {
			priorityIds.push(actor.id);
		}
	});

	allActors.forEach((actor) => {
		if (actor.id !== senderId && !priorityIds.includes(actor.id)) {
			priorityIds.push(actor.id);
		}
	});

	return priorityIds;
}

function resolveNextKnowledgeLevel(currentLevel, senderLevel) {
	if (!currentLevel || currentLevel === 'none') {
		return senderLevel === 'confirmed' ? 'suspects' : 'heard';
	}

	if (currentLevel === 'heard') {
		return senderLevel === 'confirmed' ? 'confirmed' : 'suspects';
	}

	if (currentLevel === 'suspects') {
		return 'confirmed';
	}

	return currentLevel;
}

function updateOfficeFocus(state, helpers) {
	const knowerCount = helpers.countActorsKnowingIssue(EMAIL_ISSUE_ID, 'heard');
	const confirmedCount = helpers.countActorsKnowingIssue(EMAIL_ISSUE_ID, 'confirmed');

	if (state.gamePhase === 'defensive' || confirmedCount >= 3 || knowerCount >= 5) {
		state.officeFocusState = 'dominant';
		return;
	}

	if (knowerCount >= 3) {
		state.officeFocusState = 'active';
		return;
	}

	state.officeFocusState = 'background';
}

function officeSpreadStep(state, helpers) {
	const issue = helpers.findIssueById(EMAIL_ISSUE_ID);

	if (!issue) {
		return [];
	}

	const messages = [];
	const focus = state.officeFocusState || 'background';
	const maxTransfers = focus === 'dominant' ? 2 : 1;
	const eligible = (Array.isArray(state.actors) ? state.actors : [])
		.filter((actor) => helpers.actorKnowsIssue(actor.id, EMAIL_ISSUE_ID, 'heard'))
		.filter((actor) => actor.deliveryState !== 'received_unread')
		.map((actor) => ({
			actor,
			score: (actor.talkativeness || 0) + getKnowledgeWeight(actor, EMAIL_ISSUE_ID) + Math.floor((actor.playerSuspicion || actor.suspicion || 0) / 4),
		}))
		.filter((entry) => entry.score >= 40)
		.sort((left, right) => right.score - left.score);

	let transfers = 0;

	eligible.forEach(({ actor }) => {
		if (transfers >= maxTransfers) {
			return;
		}

		const senderKnowledge = actor.knowledge?.[EMAIL_ISSUE_ID];

		if (!senderKnowledge) {
			return;
		}

		const candidates = getRecipientPriority(state, helpers, actor.id);
		const recipientId = candidates.find((candidateId) => {
			return !helpers.actorKnowsIssue(candidateId, EMAIL_ISSUE_ID, 'heard');
		});

		if (!recipientId) {
			return;
		}

		const recipient = helpers.findActorById(recipientId);

		if (!recipient) {
			return;
		}

		const nextLevel = resolveNextKnowledgeLevel(recipient.knowledgeState, senderKnowledge.level);
		const confidence = senderKnowledge.level === 'confirmed' ? 74 : 60;

		if (recipient.isSubject === true) {
			helpers.setActorKnowledge(recipient.id, EMAIL_ISSUE_ID, 'confirmed', 92, actor.id);
			recipient.subjectAwarenessState = 'confirmed';
			state.gamePhase = 'defensive';
			state.fairIntervention.pending = false;
			messages.push(`${actor.name} is the one who finally puts ${recipient.name} fully into the loop.`);
		} else {
			helpers.setActorKnowledge(recipient.id, EMAIL_ISSUE_ID, nextLevel, confidence, actor.id);
			messages.push(`${actor.name} lets enough slip that ${recipient.name} is now in the loop.`);
		}

		transfers += 1;
	});

	if (transfers > 0) {
		helpers.adjustIssue(EMAIL_ISSUE_ID, 'containment', -(transfers * 8), 'add');
		helpers.adjustIssue(EMAIL_ISSUE_ID, 'spreadRisk', transfers * 4, 'add');
	}

	updateOfficeFocus(state, helpers);
	return messages;
}

function getEnding(state) {
	const replyAll = read.issueById(state, EMAIL_ISSUE_ID);
	const hrAttention = read.issueById(state, HR_ISSUE_ID);
	const subjectIssue = read.issueById(state, SUBJECT_FINDING_OUT_ID);
	const residue = read.issueById(state, DIRTY_RESIDUE_ID);
	const timCompromised = read.issueById(state, TIM_COMPROMISED_ID);
	const bettyTimFriction = read.issueById(state, BETTY_TIM_FRICTION_ID);
	const tim = read.actorById(state, 'tim');
	const frank = read.actorById(state, 'frank');
	const dirtyPlay = Number(read.path(state, 'flags.dirtyPlayCount')) || 0;
	const subjectWarned = read.flag(state, 'targetWarned');
	const frankBriefed = read.flag(state, 'frankBriefed');
	const finalAction = read.path(state, 'flags.finalAction');
	const logicSolved = read.logicSolved(state);
	const replyContainment = replyAll ? replyAll.containment : 0;
	const hrContainment = hrAttention ? hrAttention.containment : 0;
	const residueSeverity = residue ? residue.severity : 0;
	const subjectState = subjectIssue ? subjectIssue.lifecycleState : 'warming';
	const averageSuspicion = getAveragePlayerSuspicion(state);
	const endingTarget = getSubjectName(state);

	if (finalAction === 'own-it') {
		if (dirtyPlay === 0 && subjectWarned && frankBriefed && logicSolved) {
			return {
				title: 'Ending: You Finally Read the Room Correctly',
				text: paragraphs(
					`You move first, tell the truth cleanly, and do it with the right sequence because you actually understood the office instead of just reacting to it around ${endingTarget}.`,
					`The room loses some appetite for theater. For once, your social model was better than the gossip engine.`
				),
			};
		}

		if (dirtyPlay === 0 && subjectWarned && frankBriefed) {
			return {
				title: 'Ending: Brutal Professionalism',
				text: paragraphs(
					`You get in front of the story before the office can finish sharpening it for you. ${endingTarget} hears it from your mouth, Frank gets the clean version, and the meeting becomes damage control instead of theater.`,
					'Nobody enjoys it. That is the point. The fallout is real, but your credibility survives.'
				),
			};
		}

		return {
			title: 'Ending: Honest, Late, and Painful',
			text: paragraphs(
				`You own it, but not before the message has already lived several lives without you. ${endingTarget} still looks at you like they are measuring structural failure.`,
				'You keep some dignity. You just pay retail for it.'
			),
		};
	}

	if (finalAction === 'procedural-containment' || finalAction === 'bury-it') {
		if (replyContainment >= 70 && residueSeverity < 50 && hrContainment >= 55) {
			return {
				title: 'Ending: Temporary Containment',
				text: paragraphs(
					`Frank accepts the procedural version, the room follows the safer story, and the whole thing starts looking like a containment failure instead of a public bloodletting about ${endingTarget}.`,
					'You survive the day. The email does not. Your relationships do not come out clean, but the building is not on fire by five.'
				),
			};
		}

		return {
			title: 'Ending: Leaky Lid',
			text: paragraphs(
				`You try to force the meeting into process and procedure, but the room still wants blood. Enough of the office accepts the smaller story that you survive, but too many people heard enough about ${endingTarget} for this to feel clean.`,
				'Containment works. Erasure does not. That distinction matters more than you wanted it to.'
			),
		};
	}

	if (finalAction === 'accuse-tim-drunk' || finalAction === 'blame-tim') {
		let support = 0;
		let resistance = 0;

		if (read.flag(state, 'timSetUp')) {
			support += 2;
		}

		if (timCompromised && timCompromised.lifecycleState === 'active') {
			support += 1;
		}

		if (bettyTimFriction && bettyTimFriction.lifecycleState === 'active') {
			support += 1;
		}

		if (read.flag(state, 'bettyDistracted')) {
			support += 1;
		}

		if (frankBriefed && averageSuspicion < 40) {
			support += 1;
		}

		if (averageSuspicion >= 45) {
			resistance += 2;
		}

		if (dirtyPlay >= 3) {
			resistance += 1;
		}

		if (tim && tim.stability >= 60) {
			resistance += 1;
		}

		if (frank && (Number(frank.playerSuspicion ?? frank.suspicion) || 0) >= 40) {
			resistance += 1;
		}

		if (support >= resistance + 2) {
			return {
				title: 'Ending: Tim Takes the Fall',
				text: paragraphs(
					`You point at Tim, and the room decides it wants that story badly enough to carry it. The bottle, the nerves, and the seeds you planted earlier line up just enough that the meeting pivots away from ${endingTarget} and onto him.`,
					'It works. It is also rotten, and everyone involved will be living with that long after the chairs are folded back up.'
				),
			};
		}

		if (support >= resistance) {
			return {
				title: 'Ending: The Room Wants to Believe It',
				text: paragraphs(
					`You accuse Tim of drinking at work, and the room hesitates just long enough for doubt to become its own shelter. Some people buy it. Some do not. What matters is that the meeting stops being cleanly about you or ${endingTarget}.`,
					'You survive by making the room settle for a story that is useful before it is true.'
				),
			};
		}

		return {
			title: 'Ending: Transparent Smear',
			text: paragraphs(
				`You try to hang the meeting on Tim, but the room can feel the desperation in it. The accusation lands with a thud, and now the office gets to keep both stories at once: the email about ${endingTarget}, and the fact that you reached for a human shield when the lights got bright.`,
				'Not only does Tim fail to save you, the move itself becomes part of the case against you.'
			),
		};
	}

	if (finalAction === 'take-the-hit-quietly') {
		return {
			title: 'Ending: HR File, Minimal Drama',
			text: paragraphs(
				`You do not make it elegant. You just stop making it worse. Frank logs it, ${endingTarget} stays cold, and the office loses interest because you refused to hand it better entertainment.`,
				'This is not a win exactly. It is a controlled bruise instead of a public arterial spray.'
			),
		};
	}

	return {
		title: 'Ending: Unresolved',
		text: `The meeting starts before you commit to a version of events about ${endingTarget}. The office is more than capable of inventing one without your help.`,
	};
}

function officeWorldStep(state, helpers) {
	const replyAll = helpers.findIssueById(EMAIL_ISSUE_ID);
	const subjectFindingOut = helpers.findIssueById(SUBJECT_FINDING_OUT_ID);
	const hrAttention = helpers.findIssueById(HR_ISSUE_ID);
	const dirtyResidue = helpers.findIssueById(DIRTY_RESIDUE_ID);
	const timCompromised = helpers.findIssueById(TIM_COMPROMISED_ID);
	const bettyTimFriction = helpers.findIssueById(BETTY_TIM_FRICTION_ID);
	const bettyTowardTim = helpers.findRelationship('betty', 'tim');
	const knowerCount = helpers.countActorsKnowingIssue(EMAIL_ISSUE_ID, 'heard');
	const currentTargetId = state.emailTargetId || read.path(state, 'flags.emailTargetId') || subjectId;
	const target = helpers.findActorById(currentTargetId);
	const targetName = target ? target.name : subjectName;

	syncEarnedMeetingActions(state);

	if (
		state.turn >= MEETING_TURN_LIMIT
		&& state.flags.meetingStarted !== true
		&& state.gamePhase !== 'resolved'
	) {
		state.flags.meetingStarted = true;
		state.flags.finaleUnlocked = true;
		state.gamePhase = 'all_hands';
		helpers.addEvent('Time is up. There is no more room to work. The only move left is to attend the meeting.');
	}

	if (state.flags.meetingStarted === true && state.gamePhase !== 'resolved') {
		state.flags.finaleUnlocked = true;
		state.gamePhase = 'all_hands';
	}

	if (
		state.fairIntervention
		&& state.fairIntervention.pending === true
		&& state.fairIntervention.subjectCanAutoRead === true
		&& target
		&& target.deliveryState === 'received_unread'
	) {
		target.deliveryState = 'received_read';
		target.subjectAwarenessState = 'confirmed';
		state.fairIntervention.pending = false;
		state.fairIntervention.subjectCanAutoRead = true;
		state.gamePhase = 'defensive';
		helpers.setActorKnowledge(currentTargetId, EMAIL_ISSUE_ID, 'confirmed', 94, 'opened email');
		helpers.addEvent(`${targetName} finally opens the email. The run shifts from containment to fallout.`);
	}

	if (replyAll && knowerCount >= 3 && subjectFindingOut && subjectFindingOut.lifecycleState === 'warming') {
		helpers.setIssueLifecycle(SUBJECT_FINDING_OUT_ID, 'active');
		helpers.addEvent(`Enough side conversations are happening that ${targetName} finding out is no longer hypothetical.`);
	}

	if (target && helpers.actorKnowsIssue(currentTargetId, EMAIL_ISSUE_ID, 'heard')) {
		target.subjectAwarenessState = 'confirmed';
		state.gamePhase = 'defensive';

		if (subjectFindingOut) {
			helpers.setIssueLifecycle(SUBJECT_FINDING_OUT_ID, 'reactivated');
			helpers.adjustIssue(SUBJECT_FINDING_OUT_ID, 'containment', -18, 'add');
		}

		helpers.addEvent(`${targetName} is no longer outside the blast radius.`);
	}

	if (
		hrAttention
		&& hrAttention.lifecycleState === 'warming'
		&& (
			helpers.actorKnowsIssue('frank', EMAIL_ISSUE_ID, 'heard')
			|| (read.path(state, 'flags.dirtyPlayCount') || 0) >= 1
		)
	) {
		helpers.setIssueLifecycle(HR_ISSUE_ID, 'active');
		helpers.addEvent('HR has stopped being theoretical and started becoming a calendar problem.');
	}

	if (read.flag(state, 'recallEnabled') === true && replyAll) {
		helpers.containIssue(EMAIL_ISSUE_ID, 6);
		helpers.adjustIssue(EMAIL_ISSUE_ID, 'spreadRisk', -4, 'add');
	}

	if (dirtyResidue && dirtyResidue.lifecycleState === 'active' && dirtyResidue.severity >= 60 && hrAttention) {
		helpers.adjustIssue(HR_ISSUE_ID, 'spreadRisk', 6, 'add');
		helpers.adjustIssue(HR_ISSUE_ID, 'containment', -6, 'add');
	}

	if (timCompromised && timCompromised.lifecycleState === 'active') {
		helpers.adjustActor('tim', 'stability', -6, 'add');
		helpers.adjustActor('tim', 'suspicion', 8, 'add');
	}

	if (bettyTowardTim && bettyTowardTim.value <= -25 && !bettyTimFriction) {
		helpers.addIssue({
			id: BETTY_TIM_FRICTION_ID,
			title: 'Betty and Tim friction',
			truthText: 'A side conflict is now feeding the main crisis.',
			severity: 44,
			spreadRisk: 38,
			precision: 72,
			containment: 46,
			lifecycleState: 'active',
			linkedActors: ['betty', 'tim'],
			summaryStages: [
				{
					label: 'focused',
					minPrecision: 60,
					text: 'Betty has turned on Tim hard enough that nearby people are starting to notice.',
				},
				{
					label: 'blurred',
					minPrecision: 25,
					text: 'A side conflict is now creating extra office heat.',
				},
				{
					label: 'vague',
					minPrecision: 0,
					text: 'Someone who used to be manageable is now making the room noisier.',
				},
			],
		});
		helpers.addEvent('Betty and Tim are now visibly in friction. Small fires are spawning off the main one.');
	}

	if (bettyTimFriction && bettyTimFriction.lifecycleState === 'active') {
		helpers.adjustIssue(EMAIL_ISSUE_ID, 'spreadRisk', 4, 'add');
		helpers.adjustActor('tim', 'suspicion', 5, 'add');
		helpers.adjustActor('betty', 'stability', -4, 'add');
	}

	if (state.turn >= (MEETING_TURN_LIMIT - 1) || state.officeFocusState === 'dominant' || state.gamePhase === 'defensive') {
		state.flags.finaleUnlocked = true;
	}
}

function buildInitialState() {
	const relationshipSeeds = createRelationshipSeeds();
	const actors = runSetup.npcs.map(mapNpcSeedToActor);
	const relationships = relationshipSeeds.flatMap(mapRelationshipSeedToLegacy);
	const emailBodyText = buildEmailBodyText(subjectName);
	const distributionText = buildDistributionText(recipientNames);

	return {
		turn: 0,
		emailTargetId: runSetup.emailTargetId,
		deliveryPatternId: runSetup.deliveryPatternId,
		officeFocusState: runSetup.officeFocusState,
		gamePhase: runSetup.gamePhase,
		fairIntervention: runSetup.fairIntervention,
		earnedMeetingActions: [],
		stats: {
			stress: 2,
			maxStress: 6,
		},
		flags: {
			finaleUnlocked: false,
			targetWarned: false,
			frankBriefed: false,
			recallEnabled: false,
			dirtyPlayCount: 0,
			finalAction: null,
			emailTargetId: runSetup.emailTargetId,
			deliveryPatternId: runSetup.deliveryPatternId,
			meetingStarted: false,
			finalMeetingActionTaken: false,
		},
		logic: {
			title: 'Office Logic Board',
			helpText: 'Each coworker has one real Pressure Point and one real Best Approach. Click cells to mark your read.',
			actors: [
				{ id: 'betty', label: 'Betty' },
				{ id: 'tim', label: 'Tim' },
				{ id: 'devon', label: 'Devon' },
				{ id: 'frank', label: 'Frank' },
			],
			categories: [
				{
					id: 'pressurePoint',
					label: 'Pressure Point',
					values: [
						{ id: 'gossip', label: 'Gossip' },
						{ id: 'uncertainty', label: 'Uncertainty' },
						{ id: 'disruption', label: 'Disruption' },
						{ id: 'liability', label: 'Liability' },
					],
				},
				{
					id: 'bestApproach',
					label: 'Best Approach',
					values: [
						{ id: 'distract', label: 'Distract' },
						{ id: 'reassure', label: 'Reassure' },
						{ id: 'verify', label: 'Verify' },
						{ id: 'confess', label: 'Confess' },
					],
				},
			],
			truths: PRESSURE_POINT_TRUTHS,
		},
		relationships,
		evidence: [
			{
				id: 'draft-copy',
				title: 'Draft in Sent Items',
				text: 'The actual email is still in your sent folder. So is the original wording you wish you had never typed.',
				tags: ['email:sent', 'issue:reply-all'],
				source: 'mailbox',
				verified: true,
				anchorMemoryKey: 'email-body',
			},
		],
		memories: [
			{
				key: 'email-body',
				label: `What you actually wrote about ${subjectName}.`,
				truthText: buildEmailBodyText(subjectName),
				source: 'typed',
				importance: 'high',
				canCorrupt: true,
				stability: 84,
				confidence: 80,
				preserved: true,
				stages: [
					{
						label: 'fresh',
						minStability: 70,
						text: buildEmailBodyText(subjectName),
						recallTags: ['email:exact', `${subjectId}:target`],
					},
					{
						label: 'fading',
						minStability: 40,
						text: `You accused ${subjectName} of coasting on performance and making other people clean up the mess.`,
						recallTags: ['email:mean', `${subjectId}:target`],
					},
					{
						label: 'hazy',
						minStability: 10,
						text: `You sent something petty and career-limiting about ${subjectName}.`,
						recallTags: ['email:bad'],
					},
				],
				corruptedStage: {
					label: 'corrupted',
					text: `Maybe the message about ${subjectName} was harsher than you remember. Maybe it sounded deliberate.`,
					recallTags: ['email:bad', `${subjectId}:target`],
				},
				lostStage: {
					text: `You know you crossed a line with ${subjectName}. The exact shape of it refuses to hold still.`,
					recallTags: ['email:bad'],
				},
			},
			{
				key: 'distribution-list',
				label: 'Who was on the thread when it escaped.',
				truthText: distributionText,
				source: 'seen',
				importance: 'high',
				canCorrupt: true,
				stability: 72,
				confidence: 68,
				stages: [
					{
						label: 'fresh',
						minStability: 65,
						text: distributionText,
						recallTags: [ `${subjectId}:target`, 'distribution:current' ],
					},
					{
						label: 'fading',
						minStability: 35,
						text: `${subjectName} is still not safe. Neither is your confidence about who all got it.`,
						recallTags: ['someone:knows'],
					},
					{
						label: 'hazy',
						minStability: 10,
						text: 'At least one wrong person saw it, and that is already enough.',
						recallTags: ['someone:knows'],
					},
				],
				corruptedStage: {
					label: 'corrupted',
					text: `You are no longer sure where the message about ${subjectName} really stopped.`,
					recallTags: ['someone:knows'],
				},
				lostStage: {
					text: 'You know the message escaped the intended room. The exact perimeter is gone.',
					recallTags: ['someone:knows'],
				},
			},
		],
		issues: createInitialIssues(),
		actors,
		signals: [
			`You sent a bad email about ${subjectName}. Recall only partly worked.`,
		],
	};
}

export const storyConfig = {
	meta: {
		title: APP_DATA.title,
		eyebrow: APP_DATA.eyebrow,
		subtitle: APP_DATA.subtitle,
	},
	startNode: 'bullpen',
	turnRules: {
		maxTurns: MEETING_TURN_LIMIT,
		signalLimit: DEFAULT_MEMORY_TUNING.signalLimit,
		memoryDecay: DEFAULT_MEMORY_TUNING,
		issueDecay: DEFAULT_ISSUE_TUNING,
		spreadStep: officeSpreadStep,
		worldStep: officeWorldStep,
		events: [
			{
				id: 'turn-2',
				at: 2,
				text: 'Slack is quieter now. That is worse. It means people have switched to side conversations.',
			},
			{
				id: 'turn-4',
				at: 4,
				text: 'The office is running out of denial and moving into policy.',
				effects: [
					fx.issueLifecycle(HR_ISSUE_ID, 'active'),
				],
			},
			{
				id: 'turn-6',
				at: 6,
				text: 'The all-hands is starting. Whatever version of the story survives now is the one the office gets to keep.',
				effects: [
					fx.set('flags.finaleUnlocked', true),
				],
			},
		],
	},
	initialState: buildInitialState(),
	display: {
		status: [
			status('Turn', (state) => String(state.turn)),
			status('Stress', (state) => `${state.stats.stress} / ${state.stats.maxStress}`),
			status('Target', (state) => getSubjectName(state)),
			status('Phase', (state) => state.gamePhase || 'containment'),
			status('Focus', (state) => state.officeFocusState || 'background'),
			status('All-hands', (state, context) => {
				if (state.flags.finaleUnlocked === true) {
					return 'Starting now';
				}

				return `${context.turnsUntilFinale} move${context.turnsUntilFinale === 1 ? '' : 's'} left`;
			}),
		],
		sections: [
			{
				title: 'Run Overview',
				type: 'custom',
				render(state) {
					const target = getSubjectActor(state);
					const targetName = getSubjectName(state);
					const recipients = (Array.isArray(state.actors) ? state.actors : [])
						.filter((actor) => actor.deliveryState && actor.deliveryState !== 'not_received')
						.map((actor) => actor.name);

					const intervention = state.fairIntervention?.pending === true
						? state.fairIntervention.subjectCanAutoRead === true
							? 'window closing'
							: 'still protected'
						: state.gamePhase === 'defensive'
							? 'already defensive'
							: 'not needed';

					return `
						<div class="overview-grid">
							<div class="overview-card">
								<div class="overview-card__line">
									<strong>Target</strong>
									<span class="badge badge--critical">${targetName}</span>
								</div>
								<div class="overview-copy">
									${target ? `Awareness: ${target.subjectAwarenessState || 'unaware'}. Delivery: ${target.deliveryState || 'not_received'}.` : 'No target loaded.'}
								</div>
							</div>
							<div class="overview-card">
								<div class="overview-card__line">
									<strong>Spread</strong>
									<span class="badge badge--watch">${state.officeFocusState || 'background'}</span>
								</div>
								<div class="overview-copy">
									Recipients in play: ${recipients.length ? recipients.join(', ') : 'none confirmed yet'}.
								</div>
							</div>
							<div class="overview-card">
								<div class="overview-card__line">
									<strong>Intervention</strong>
									<span class="badge badge--tracked">${intervention}</span>
								</div>
								<div class="overview-copy">
									Dirty play: ${state.flags?.dirtyPlayCount || 0}. Phase: ${state.gamePhase || 'containment'}.
								</div>
							</div>
						</div>
					`;
				},
			},
			{
				title: 'Office Floor',
				type: 'issues',
			},
			{
				title: 'Read on People',
				type: 'actors',
			},
			{
				title: 'Memory & Evidence',
				type: 'custom',
				render(state) {
					const memories = [...(state.memories || [])]
						.sort((left, right) => (right.stability || 0) - (left.stability || 0))
						.slice(0, 2);

					const evidence = (state.evidence || []).slice(0, 2);

					const memoryMarkup = memories.length
						? memories.map((memory) => `
							<div class="memory-item memory-item--${memory.stage}">
								<div class="memory-card__line">
									<span class="memory-card__name">${memory.label}</span>
									<span class="badge badge--${memory.stage}">${memory.stage}</span>
								</div>
								<div>${memory.currentText}</div>
							</div>
						`).join('')
						: '<div class="memory-empty">Nothing solid is left in your head yet.</div>';

					const evidenceMarkup = evidence.length
						? evidence.map((item) => `
							<div class="evidence-item">
								<div class="item-row">
									<span class="badge badge--meta">${item.source}</span>
									${item.verified === true ? '<span class="badge badge--verified">verified</span>' : ''}
								</div>
								<div><strong>${item.title}</strong></div>
								<div>${item.text}</div>
							</div>
						`).join('')
						: '<div class="evidence-empty">Nothing secured yet.</div>';

					return `
						<div class="memory-evidence-stack">
							${memoryMarkup}
							${evidenceMarkup}
						</div>
					`;
				},
			},
		],
	},
	nodes: {
		bullpen: scene({
			kicker: 'Open Office Floor',
			title: 'The email is already alive now.',
			text(state) {
				const issue = read.issueById(state, EMAIL_ISSUE_ID);
				const memory = read.memoryByKey(state, 'email-body');
				const distribution = read.memoryByKey(state, 'distribution-list');

				return paragraphs(
					'You are back at your desk, pretending your monitor can protect you from the social physics you just released into the building.',
					issue ? `Right now the problem feels like this: ${issue.currentText}` : null,
					memory ? `You still remember the message clearly enough to hate yourself with specificity: ${memory.currentText}` : null,
					distribution ? `Your current model of the blast radius: ${distribution.currentText}` : null,
					`This is the whole day now. Contain it, redirect it, or watch the office turn your worst minute about ${getSubjectName(state)} into policy.`
				);
			},
			choices: [
				choice('Go to the break room and deal with Betty first.', 'break-room'),
				choice('Go to the printer bay before paper makes this worse.', 'printer-bay'),
				choice('Go to IT and see what Devon can still do.', 'it-room'),
				choice('Go to HR before HR comes to you.', 'hr'),
				choice((state) => `Go toward ${getSubjectName(state)} before someone else beats you there.`, 'subject-office'),
				choice('The meeting is here. Force a version of the story.', 'finale', {
					condition: canReachFinale,
				}),
			],
		}),

		'break-room': scene({
			kicker: 'Break Room',
			title: 'Betty is a fuse with lipstick.',
			text(state) {
				const betty = read.actorById(state, 'betty');

				return paragraphs(
					'Betty is stirring coffee she is not going to drink. That means she is staying put long enough to spread information recreationally.',
					betty ? `Current read: ${betty.currentSummary}` : null,
					'You do not need her loyalty. You need her to find a more entertaining problem than yours.'
				);
			},
			choices: [
				choice('Ask Betty to delete the message and keep your name out of it.', 'break-room', {
					condition: when.not(when.flag('bettySoftened')),
					feedback: 'Betty smiles in a way that suggests leverage has just changed hands, but she does pocket the thrill for now.',
					effects: [
						fx.set('flags.bettySoftened', true),
						fx.actorAdd('betty', 'playerLikability', 8),
						fx.actorAdd('betty', 'playerSuspicion', 6),
						fx.issueContain(EMAIL_ISSUE_ID, 14),
						fx.issuePrecision(EMAIL_ISSUE_ID, 6),
					],
				}),
				choice('Feed Betty a side rumor about Tim being shaky on the layoffs list.', 'break-room', {
					condition: when.not(when.flag('bettyDistracted')),
					feedback: 'Betty immediately pivots to a shinier cruelty vector. Efficient. Gross. Effective.',
					reaction: {
						resultType: 'mixed',
						npcText: 'Betty immediately pivots to a shinier cruelty vector. Efficient. Gross. Effective.',
						outcomeText: 'Betty stops feeding the main fire for now, but you create dirty residue and damage the Betty-Tim relationship.',
					},
					effects: [
						fx.set('flags.bettyDistracted', true),
						fx.add('stats.stress', 1),
						fx.add('flags.dirtyPlayCount', 1),
						fx.issueContain(EMAIL_ISSUE_ID, 18),
						fx.issueAdd(DIRTY_RESIDUE_ID, 'severity', 22),
						fx.issueLifecycle(DIRTY_RESIDUE_ID, 'active'),
						fx.actorAdd('betty', 'playerLikability', -8),
						fx.actorAdd('betty', 'playerSuspicion', 10),
						{ type: 'relationshipAdd', from: 'betty', to: 'tim', value: -48 },
						{ type: 'relationshipAdd', from: 'tim', to: 'betty', value: -18 },
					],
				}),
				choice((state) => `Tell Betty ${getSubjectName(state)} is about to hear it anyway, so she should stop freelancing.`, 'break-room', {
					condition: when.flag('targetWarned'),
					feedback: 'Nothing dries up casual gossip like a target who already knows.',
					effects: [
						fx.issueContain(EMAIL_ISSUE_ID, 10),
						fx.actorAdd('betty', 'stability', -4),
					],
				}),
				choice('Head to the printer bay.', 'printer-bay'),
				choice('Go back to the bullpen.', 'bullpen'),
				choice('Go to the band of fluorescent judgment.', 'finale', {
					condition: canReachFinale,
				}),
			],
		}),

		'printer-bay': scene({
			kicker: 'Printer Bay',
			title: 'Paper is slower than email and somehow worse.',
			text(state) {
				const tim = read.actorById(state, 'tim');
				const compromised = read.issueById(state, TIM_COMPROMISED_ID);

				return paragraphs(
					'Printers are where private stupidity becomes shared office furniture. Tim is here, hovering near the tray with the expression of a man who knows something and wishes he did not.',
					tim ? `Current read on Tim: ${tim.currentSummary}` : null,
					compromised ? `His trajectory feels like this: ${compromised.currentText}` : null
				);
			},
			choices: [
				choice('Grab the printed copies and shred them.', 'printer-bay', {
					condition: when.not(when.flag('printerCopiesRemoved')),
					feedback: 'Paper is stupidly powerful. So is removing it before someone waves it around.',
					effects: [
						fx.set('flags.printerCopiesRemoved', true),
						fx.issueContain(EMAIL_ISSUE_ID, 16),
						fx.issueContain(SUBJECT_FINDING_OUT_ID, 8),
						fx.evidence({
							id: 'shredded-copy',
							title: 'Shredded printout',
							text: 'You killed the easiest physical copy before it could start doing laps.',
							tags: ['issue:reply-all', 'paper:removed'],
							source: 'printer bay',
							verified: true,
						}),
					],
				}),
				choice('Tell Tim the email is handled and he should stay out of it.', 'printer-bay', {
					feedback: 'Tim wants out of the blast radius more than he wants truth. That is useful.',
					reaction: {
						resultType: 'success',
						npcText: 'Tim wants out of the blast radius more than he wants truth. That is useful.',
						outcomeText: 'Tim settles down, likes you a bit more, and becomes less likely to make the situation worse right now.',
					},
					effects: [
						fx.actorAdd('tim', 'playerLikability', 12),
						fx.actorAdd('tim', 'stability', 10),
						fx.issueContain(EMAIL_ISSUE_ID, 10),
					],
				}),
				choice('Jam the printer so no one else gets a clean copy.', 'printer-bay', {
					condition: when.not(when.flag('printerJammed')),
					feedback: 'You buy time the dumb mechanical way.',
					reaction: {
						resultType: 'mixed',
						npcText: 'You buy time the dumb mechanical way.',
						outcomeText: 'The email becomes harder to spread physically, but you leave behind dirty residue and make Tim more suspicious.',
					},
					effects: [
						fx.set('flags.printerJammed', true),
						fx.add('flags.dirtyPlayCount', 1),
						fx.issueContain(EMAIL_ISSUE_ID, 12),
						fx.issueAdd(DIRTY_RESIDUE_ID, 'severity', 14),
						fx.issueLifecycle(DIRTY_RESIDUE_ID, 'active'),
						fx.actorAdd('tim', 'playerSuspicion', 12),
					],
				}),
				choice('Slip a flask into Tim\'s drawer so he misses the meeting.', 'printer-bay', {
					condition: when.and(
						when.not(when.flag('timSetUp')),
						when.turnAtLeast(2)
					),
					feedback: 'There it is: the quick ugly option. Effective on paper. Rotten in the bloodstream.',
					reaction: {
						resultType: 'mixed',
						npcText: 'There it is: the quick ugly option. Effective on paper. Rotten in the bloodstream.',
						outcomeText: 'Tim becomes easier to throw under the bus later, but the move is dirty, raises residue, and increases suspicion around the room.',
					},
					effects: [
						fx.set('flags.timSetUp', true),
						fx.add('flags.dirtyPlayCount', 1),
						fx.issueLifecycle(TIM_COMPROMISED_ID, 'active'),
						fx.issueAdd(TIM_COMPROMISED_ID, 'severity', 34),
						fx.issueAdd(DIRTY_RESIDUE_ID, 'severity', 30),
						fx.issueLifecycle(DIRTY_RESIDUE_ID, 'active'),
						fx.issueContain(EMAIL_ISSUE_ID, 14),
						fx.actorAdd('tim', 'stability', -18),
						fx.actorAdd('tim', 'playerSuspicion', 26),
						fx.actorAdd('frank', 'playerSuspicion', 8),
					],
				}),
				choice('Go to IT.', 'it-room'),
				choice('Go back to the bullpen.', 'bullpen'),
			],
		}),

		'it-room': scene({
			kicker: 'IT Room',
			title: 'Devon can still touch the pipes.',
			text(state) {
				const devon = read.actorById(state, 'devon');
				const replyAll = read.issueById(state, EMAIL_ISSUE_ID);

				return paragraphs(
					'It is not a miracle. It is systems triage with a witness problem.',
					devon ? `Current read on Devon: ${devon.currentSummary}` : null,
					replyAll ? `Operationally, the problem still looks like this: ${replyAll.currentText}` : null
				);
			},
			choices: [
				choice('Ask Devon for a legitimate recall and kill-switch on forwarding.', 'it-room', {
					condition: when.not(when.flag('recallEnabled')),
					feedback: 'Devon does not like you more, but he likes preventable chaos less.',
					reaction: {
						resultType: 'success',
						npcText: 'Devon does not like you more, but he likes preventable chaos less.',
						outcomeText: 'Recall is now enabled. Spread risk drops, containment improves, and Devon now understands the situation more clearly.',
					},
					effects: [
						fx.set('flags.recallEnabled', true),
						fx.issueContain(EMAIL_ISSUE_ID, 20),
						fx.issueAdd(EMAIL_ISSUE_ID, 'spreadRisk', -10),
						fx.actorAdd('devon', 'playerLikability', 8),
						fx.actorKnowledge('devon', EMAIL_ISSUE_ID, 'confirmed', 82, 'mail logs'),
					],
				}),
				choice('Ask Devon to purge logs that would prove timing and recipients.', 'it-room', {
					condition: when.not(when.flag('logsPurged')),
					feedback: 'Devon hates this, which means he is correctly identifying it as a bad idea.',
					reaction: {
						resultType: 'mixed',
						npcText: 'Devon hates this, which means he is correctly identifying it as a bad idea.',
						outcomeText: 'You reduce some immediate exposure, but Devon trusts you less, your suspicion rises with him, and dirty residue gets worse.',
					},
					effects: [
						fx.set('flags.logsPurged', true),
						fx.add('flags.dirtyPlayCount', 1),
						fx.issueContain(EMAIL_ISSUE_ID, 16),
						fx.issueContain(SUBJECT_FINDING_OUT_ID, 10),
						fx.issueAdd(DIRTY_RESIDUE_ID, 'severity', 26),
						fx.issueLifecycle(DIRTY_RESIDUE_ID, 'active'),
						fx.issueAdd(HR_ISSUE_ID, 'spreadRisk', 10),
						fx.actorAdd('devon', 'playerLikability', -14),
						fx.actorAdd('devon', 'playerSuspicion', 22),
					],
				}),
				choice('Show Devon the draft so you both stop arguing about what was actually said.', 'it-room', {
					condition: when.not(when.flag('devonSawDraft')),
					feedback: 'Specificity calms technical people and terrifies everyone else.',
					effects: [
						fx.set('flags.devonSawDraft', true),
						fx.reinforceMemory('email-body', 12),
						fx.actorAdd('devon', 'playerLikability', 6),
						fx.issuePrecision(EMAIL_ISSUE_ID, 10),
					],
				}),
				choice('Go to HR.', 'hr'),
				choice('Go back to the bullpen.', 'bullpen'),
			],
		}),

		hr: scene({
			kicker: 'HR',
			title: 'Frank is not a person. He is process wearing loafers.',
			text(state) {
				const frank = read.actorById(state, 'frank');
				const hrIssue = read.issueById(state, HR_ISSUE_ID);

				return paragraphs(
					'Frank has the calm of a man who will let you panic at full volume and then summarize it in a paragraph for legal preservation.',
					frank ? `Current read on Frank: ${frank.currentSummary}` : null,
					hrIssue ? `Policy pressure currently feels like this: ${hrIssue.currentText}` : null
				);
			},
			choices: [
				choice('Preemptively tell Frank you sent the email and you are containing it.', 'hr', {
					condition: when.not(when.flag('frankBriefed')),
					feedback: 'You trade drama for paperwork. Sometimes that is the adult move. Sometimes it is just less embarrassing.',
					reaction: {
						resultType: 'success',
						npcText: 'You trade drama for paperwork. Sometimes that is the adult move. Sometimes it is just less embarrassing.',
						outcomeText: 'Frank is now briefed, HR pressure becomes more structured, and you gain some credibility with him instead of letting him hear it from the hallway.',
					},
					effects: [
						fx.set('flags.frankBriefed', true),
						fx.actorKnowledge('frank', EMAIL_ISSUE_ID, 'confirmed', 78, 'you'),
						fx.issueLifecycle(HR_ISSUE_ID, 'active'),
						fx.issueContain(EMAIL_ISSUE_ID, 8),
						fx.issueContain(HR_ISSUE_ID, 10),
						fx.actorAdd('frank', 'playerLikability', 6),
					],
				}),
				choice('Hint that Tim may have turned a bad email into a broader compliance issue.', 'hr', {
					condition: when.flag('timSetUp'),
					feedback: 'You move Frank\'s flashlight onto Tim. It is ugly and it works exactly because it is ugly.',
					effects: [
						fx.issueAdd(DIRTY_RESIDUE_ID, 'severity', 18),
						fx.issueLifecycle(DIRTY_RESIDUE_ID, 'active'),
						fx.issueContain(EMAIL_ISSUE_ID, 10),
						fx.issueLifecycle(TIM_COMPROMISED_ID, 'active'),
						fx.actorAdd('frank', 'playerSuspicion', 16),
					],
				}),
				choice('Say nothing useful and see whether Frank already knows.', 'hr', {
					feedback(state) {
						return read.actorKnowsIssue(state, 'frank', EMAIL_ISSUE_ID, 'heard')
							? 'Frank knows enough to make silence look strategic.'
							: 'Frank mostly sees a person trying not to become an incident report.';
					},
					effects(state) {
						if (read.actorKnowsIssue(state, 'frank', EMAIL_ISSUE_ID, 'heard')) {
							return [
								fx.issueAdd(HR_ISSUE_ID, 'spreadRisk', 10),
								fx.actorAdd('frank', 'playerSuspicion', 10),
							];
						}

						return [
							fx.actorAdd('frank', 'playerSuspicion', 4),
						];
					},
				}),
				choice((state) => `Go to ${getSubjectName(state)} before HR becomes the secondary problem.`, 'subject-office'),
				choice('Go back to the bullpen.', 'bullpen'),
			],
		}),

		'subject-office': scene({
			kicker: 'Target Lane',
			title(state) {
				return `You can still choose who tells ${getSubjectName(state)}. That window is shutting.`;
			},
			text(state) {
				const subjectIssue = read.issueById(state, SUBJECT_FINDING_OUT_ID);
				const target = getSubjectActor(state);
				const currentName = getSubjectName(state);

				return paragraphs(
					`${currentName} is still doing normal work, which would be comforting if normal work were not about to be weaponized into social timing.`,
					subjectIssue ? `The situation around them currently feels like this: ${subjectIssue.currentText}` : null,
					target ? `Current read on ${currentName}: ${target.currentSummary}` : null
				);
			},
			choices: [
				choice((state) => `Tell ${getSubjectName(state)} directly before the office can decorate it.`, 'subject-office', {
					condition: when.not(when.flag('targetWarned')),
					feedback(state) {
						return `${getSubjectName(state)} goes still. It is somehow more frightening than yelling.`;
					},
					reaction(state) {
						return {
							resultType: 'mixed',
							npcText: `${getSubjectName(state)} goes still. It is somehow more frightening than yelling.`,
							outcomeText: 'You control how the target finds out, which helps containment, but the run now shifts into defensive mode because clean prevention is over.',
						};
					},
					effects(state) {
						return [
							fx.set('flags.targetWarned', true),
							fx.actorKnowledge(state.emailTargetId, EMAIL_ISSUE_ID, 'confirmed', 86, 'you'),
							fx.issueContain(EMAIL_ISSUE_ID, 12),
							fx.issueContain(SUBJECT_FINDING_OUT_ID, 24),
							fx.issueLifecycle(SUBJECT_FINDING_OUT_ID, 'contained'),
							fx.set('gamePhase', 'defensive'),
						];
					},
				}),
				choice((state) => `Apologize to ${getSubjectName(state)} without minimizing it.`, 'subject-office', {
					condition: when.flag('targetWarned'),
					feedback: 'For one second the room contains two adults instead of one adult and one flailing liability.',
					effects(state) {
						return [
							fx.actorAdd(state.emailTargetId, 'playerLikability', 8),
							fx.issueContain(SUBJECT_FINDING_OUT_ID, 10),
							fx.issueContain(EMAIL_ISSUE_ID, 6),
						];
					},
				}),
				choice((state) => `Tell ${getSubjectName(state)} the wording was uglier than the office version will eventually be.`, 'subject-office', {
					condition: when.and(
						when.flag('targetWarned'),
						when.not(when.flag('toldTargetExactWords'))
					),
					feedback: 'Specificity hurts, but it also prevents imagination from doing your job for it.',
					effects(state) {
						return [
							fx.set('flags.toldTargetExactWords', true),
							fx.reinforceMemory('email-body', 10),
							fx.issuePrecision(EMAIL_ISSUE_ID, 12),
							fx.actorAdd(state.emailTargetId, 'playerLikability', 4),
						];
					},
				}),
				choice('Retreat to the bullpen and take stock.', 'bullpen'),
				choice('The meeting is happening. Stop stalling.', 'finale', {
					condition: canReachFinale,
				}),
			],
		}),

		finale: scene({
			kicker: 'All-Hands',
			title: 'Now the office picks a story unless you do.',
			text(state) {
				const replyAll = read.issueById(state, EMAIL_ISSUE_ID);
				const hrAttention = read.issueById(state, HR_ISSUE_ID);
				const dirtyResidue = read.issueById(state, DIRTY_RESIDUE_ID);
				const earnedActions = getEarnedMeetingActions(state);

				return paragraphs(
					'Everyone is here physically or almost here socially, which is basically the same thing in an office. This is the moment where all your containment either becomes narrative control or turns out to have been elaborate denial.',
					replyAll ? `Main issue: ${replyAll.currentText}` : null,
					hrAttention ? `HR pressure: ${hrAttention.currentText}` : null,
					dirtyResidue ? `What your tactics are doing to you: ${dirtyResidue.currentText}` : null,
					earnedActions.length ? `Leverage you earned before walking in: ${earnedActions.join(', ')}.` : 'You are entering the meeting mostly with baseline options.'
				);
			},
			choices: [
				choice((state) => `Stand up and own the email about ${getSubjectName(state)} before anyone can weaponize it harder.`, 'ending', {
					feedback: 'You choose exposure with your name still attached.',
					effects: [
						fx.set('flags.finalMeetingActionTaken', true),
						fx.set('flags.finalAction', 'own-it'),
					],
				}),
				choice('Ask Frank to frame this as containment and policy, not public theater.', 'ending', {
					condition: (state) => hasEarnedMeetingAction(state, 'procedural_containment'),
					feedback: 'You push the room toward process, hoping procedure can beat appetite.',
					effects: [
						fx.set('flags.finalMeetingActionTaken', true),
						fx.set('flags.finalAction', 'procedural-containment'),
					],
				}),
				choice('Accuse Tim of drinking at work and force the room to look at him instead.', 'ending', {
					condition: (state) => hasEarnedMeetingAction(state, 'accuse_tim_drunk'),
					feedback: 'You point at Tim and try to make the bottle the story.',
					effects: [
						fx.set('flags.finalMeetingActionTaken', true),
						fx.set('flags.finalAction', 'accuse-tim-drunk'),
					],
				}),
				choice('Say as little as possible and take the HR hit quietly.', 'ending', {
					feedback: 'You decide not to hand the room anything bigger than the incident itself.',
					effects: [
						fx.set('flags.finalMeetingActionTaken', true),
						fx.set('flags.finalAction', 'take-the-hit-quietly'),
					],
				}),
			],
		}),

		ending: endingNode(getEnding, {
			kicker: 'Day End',
			restartText: 'Run the morning again.',
		}),
	},
};