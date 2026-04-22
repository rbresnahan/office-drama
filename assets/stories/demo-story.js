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

const canReachFinale = when.or(
	when.flag('finaleUnlocked'),
	when.turnAtLeast(5),
	when.issueState('celia-finding-out', 'reactivated')
);

function getEnding(state) {
	const replyAll = read.issueById(state, 'reply-all');
	const hrAttention = read.issueById(state, 'hr-attention');
	const celiaIssue = read.issueById(state, 'celia-finding-out');
	const residue = read.issueById(state, 'dirty-residue');
	const dirtyPlay = Number(read.path(state, 'flags.dirtyPlayCount')) || 0;
	const celiaWarned = read.flag(state, 'celiaWarned');
	const frankBriefed = read.flag(state, 'frankBriefed');
	const finalAction = read.path(state, 'flags.finalAction');
	const logicSolved = read.logicSolved(state);
	const replyContainment = replyAll ? replyAll.containment : 0;
	const hrContainment = hrAttention ? hrAttention.containment : 0;
	const residueSeverity = residue ? residue.severity : 0;
	const celiaState = celiaIssue ? celiaIssue.lifecycleState : 'warming';

	if (finalAction === 'own-it') {
		if (dirtyPlay === 0 && celiaWarned && frankBriefed && logicSolved) {
			return {
				title: 'Ending: You Finally Read the Room Correctly',
				text: paragraphs(
					'You move first, tell the truth cleanly, and do it with the right sequence because you actually understood the office instead of just reacting to it.',
					'Betty loses the fun, Tim stabilizes, Frank gets process, Celia gets directness. For once, your social model was better than the gossip engine.'
				),
			};
		}

		if (dirtyPlay === 0 && celiaWarned && frankBriefed) {
			return {
				title: 'Ending: Brutal Professionalism',
				text: paragraphs(
					'You get in front of the story before the office can finish sharpening it for you. Celia hears it from your mouth, Frank gets the clean version, and the meeting becomes damage control instead of theater.',
					'Nobody enjoys it. That is the point. The fallout is real, your credibility survives, and the office has to settle for the boring truth instead of the juicier one.'
				),
			};
		}

		return {
			title: 'Ending: Honest, Late, and Painful',
			text: paragraphs(
				'You own it, but not before the message has already lived several lives without you. HR still takes notes. Celia still looks at you like she is measuring structural failure.',
				'You keep some dignity. You just pay retail for it.'
			),
		};
	}

	if (finalAction === 'bury-it') {
		if (replyContainment >= 70 && residueSeverity < 50 && hrContainment >= 55) {
			return {
				title: 'Ending: Temporary Containment',
				text: paragraphs(
					'The recall works well enough, the printer copies disappear, and the room decides to act like the whole thing was a systems hiccup plus one idiot minute. You are the idiot minute.',
					'You survive the day. The email does not. Your relationships do not come out clean, but the building is not on fire by five.'
				),
			};
		}

		return {
			title: 'Ending: Leaky Lid',
			text: paragraphs(
				'You get the crisis under a lid, but not into a coffin. Too many people heard enough, and the office keeps one eye on you even while pretending to move on.',
				'Containment works. Erasure does not. That distinction matters more than you wanted it to.'
			),
		};
	}

	if (finalAction === 'blame-tim') {
		if (dirtyPlay >= 1 && residueSeverity >= 50) {
			return {
				title: 'Ending: Poisoned Escape',
				text: paragraphs(
					'You give the office a smaller villain and let it enjoy the convenience. Tim takes the hit because he is nervous, isolated, and easy to fold into the story.',
					'It works well enough to save you today. It also leaves behind exactly the kind of stain that keeps coming back in management conversations you are not in.'
				),
			};
		}

		return {
			title: 'Ending: Thin Scapegoat',
			text: paragraphs(
				'You try to pin the momentum on Tim, but the office can smell when a story is only useful and not quite true. Some people buy it anyway, which is its own kind of indictment.',
				'You are not cleared. You are merely not the only suspect-shaped object in the room.'
			),
		};
	}

	if (finalAction === 'take-the-hit-quietly') {
		return {
			title: 'Ending: HR File, Minimal Drama',
			text: paragraphs(
				'You do not make it elegant. You just stop making it worse. Frank logs it, Celia stays cold, and the office loses interest because you refused to hand it better entertainment.',
				'This is not a win exactly. It is a controlled bruise instead of a public arterial spray.'
			),
		};
	}

	if (finalAction === 'walk') {
		if (celiaState === 'reactivated' || replyContainment < 45) {
			return {
				title: 'Ending: Vacuum of Meaning',
				text: paragraphs(
					'You leave the floor before the meeting, which means the office gets to write the rest without your interference. People are rarely kind when improvising someone else\'s motive.',
					'The crisis keeps moving after you. Walking spared your nerves, not your reputation.'
				),
			};
		}

		return {
			title: 'Ending: Cowardice with Good Timing',
			text: paragraphs(
				'You disappear after doing just enough to keep the whole thing from exploding on impact. The office still talks, but now it talks in a lower register and without you there to make it worse.',
				'It is not admirable. It is not even satisfying. It is, however, effective in a small cowardly way.'
			),
		};
	}

	return {
		title: 'Ending: Unresolved',
		text: 'The meeting starts before you commit to a version of events. The office is more than capable of inventing one without your help.',
	};
}

function officeWorldStep(state, helpers) {
	const replyAll = helpers.findIssueById('reply-all');
	const celiaFindingOut = helpers.findIssueById('celia-finding-out');
	const hrAttention = helpers.findIssueById('hr-attention');
	const dirtyResidue = helpers.findIssueById('dirty-residue');
	const timCompromised = helpers.findIssueById('tim-compromised');
	const bettyTimFriction = helpers.findIssueById('betty-tim-friction');
	const bettyTowardTim = helpers.findRelationship('betty', 'tim');
	const knowerCount = helpers.countActorsKnowingIssue('reply-all', 'heard');

	if (replyAll && knowerCount >= 3 && celiaFindingOut && celiaFindingOut.lifecycleState === 'warming') {
		helpers.setIssueLifecycle('celia-finding-out', 'active');
		helpers.addEvent('Enough side conversations are happening that Celia finding out is no longer hypothetical.');
	}

	if (helpers.actorKnowsIssue('celia', 'reply-all', 'heard')) {
		helpers.setIssueLifecycle('celia-finding-out', 'reactivated');
		helpers.adjustIssue('celia-finding-out', 'containment', -18, 'add');
		helpers.addEvent('Celia is no longer outside the blast radius.');
	}

	if (
		hrAttention &&
		hrAttention.lifecycleState === 'warming' &&
		(
			helpers.actorKnowsIssue('frank', 'reply-all', 'heard') ||
			(read.path(state, 'flags.dirtyPlayCount') || 0) >= 1
		)
	) {
		helpers.setIssueLifecycle('hr-attention', 'active');
		helpers.addEvent('HR has stopped being theoretical and started becoming a calendar problem.');
	}

	if (read.flag(state, 'recallEnabled') === true && replyAll) {
		helpers.containIssue('reply-all', 6);
		helpers.adjustIssue('reply-all', 'spreadRisk', -4, 'add');
	}

	if (dirtyResidue && dirtyResidue.lifecycleState === 'active' && dirtyResidue.severity >= 60 && hrAttention) {
		helpers.adjustIssue('hr-attention', 'spreadRisk', 6, 'add');
		helpers.adjustIssue('hr-attention', 'containment', -6, 'add');
	}

	if (timCompromised && timCompromised.lifecycleState === 'active') {
		helpers.adjustActor('tim', 'stability', -6, 'add');
		helpers.adjustActor('tim', 'suspicion', 8, 'add');
	}

	if (
		bettyTowardTim &&
		bettyTowardTim.value <= -25 &&
		!bettyTimFriction
	) {
		helpers.addIssue({
			id: 'betty-tim-friction',
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
		helpers.adjustIssue('reply-all', 'spreadRisk', 4, 'add');
		helpers.adjustActor('tim', 'suspicion', 5, 'add');
		helpers.adjustActor('betty', 'stability', -4, 'add');
	}

	if (state.turn >= 4 && knowerCount >= 4 && !helpers.actorKnowsIssue('frank', 'reply-all', 'heard')) {
		helpers.setActorKnowledge('frank', 'reply-all', 'heard', 60, 'hallway chatter');
		helpers.addEvent('Frank hears enough hallway static to know something is wrong.');
	}

	if (state.turn >= 5) {
		state.flags.finaleUnlocked = true;
	}
}

export const storyConfig = {
	meta: {
		title: APP_DATA.title,
		eyebrow: APP_DATA.eyebrow,
		subtitle: APP_DATA.subtitle,
	},
	startNode: 'bullpen',
	turnRules: {
		maxTurns: 6,
		signalLimit: DEFAULT_MEMORY_TUNING.signalLimit,
		memoryDecay: DEFAULT_MEMORY_TUNING,
		issueDecay: DEFAULT_ISSUE_TUNING,
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
					fx.issueLifecycle('hr-attention', 'active'),
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
	initialState: {
		turn: 0,
		stats: {
			stress: 2,
			maxStress: 6,
		},
		flags: {
			finaleUnlocked: false,
			celiaWarned: false,
			frankBriefed: false,
			recallEnabled: false,
			dirtyPlayCount: 0,
			finalAction: null,
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
			truths: {
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
			},
		},
		relationships: [
			{ from: 'betty', to: 'tim', value: 22 },
			{ from: 'tim', to: 'betty', value: 10 },
			{ from: 'betty', to: 'celia', value: -12 },
			{ from: 'tim', to: 'frank', value: -4 },
			{ from: 'devon', to: 'frank', value: 8 },
			{ from: 'frank', to: 'celia', value: 16 },
		],
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
				label: 'What you actually wrote about Celia.',
				truthText: 'You wrote that Celia got promoted by weaponizing fake empathy and making other people clean up her work.',
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
						text: 'You wrote that Celia got promoted by weaponizing fake empathy and making other people clean up her work.',
						recallTags: ['email:exact', 'celia:target'],
					},
					{
						label: 'fading',
						minStability: 40,
						text: 'You accused Celia of being performative and getting promoted at other people\'s expense.',
						recallTags: ['email:mean', 'celia:target'],
					},
					{
						label: 'hazy',
						minStability: 10,
						text: 'You sent something petty and career-limiting about Celia.',
						recallTags: ['email:bad'],
					},
				],
				corruptedStage: {
					label: 'corrupted',
					text: 'Maybe the message was harsher than you remember. Maybe it sounded deliberate.',
					recallTags: ['email:bad', 'celia:target'],
				},
				lostStage: {
					text: 'You know you crossed a line. The exact shape of it refuses to hold still.',
					recallTags: ['email:bad'],
				},
			},
			{
				key: 'distribution-list',
				label: 'Who was on the thread when it escaped.',
				truthText: 'Betty was definitely on the thread. Tim and Devon probably were. Frank was not meant to be.',
				source: 'seen',
				importance: 'high',
				canCorrupt: true,
				stability: 72,
				confidence: 68,
				stages: [
					{
						label: 'fresh',
						minStability: 65,
						text: 'Betty definitely saw it. Tim and Devon were on the list. Frank was supposed to be outside it.',
						recallTags: ['betty:knows', 'tim:possible', 'devon:possible'],
					},
					{
						label: 'fading',
						minStability: 35,
						text: 'Betty saw it. Tim or Devon probably did too. HR might still be outside the blast radius.',
						recallTags: ['betty:knows', 'tim:possible'],
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
					text: 'Frank may have been on the original thread after all.',
					recallTags: ['frank:maybe'],
				},
				lostStage: {
					text: 'You know the message escaped the intended room. The exact perimeter is gone.',
					recallTags: ['someone:knows'],
				},
			},
		],
		issues: [
			{
				id: 'reply-all',
				title: 'Reply-all email',
				truthText: 'A gossip email about Celia escaped into the office and is now moving faster than you are.',
				severity: 88,
				spreadRisk: 74,
				precision: 92,
				containment: 18,
				lifecycleState: 'active',
				linkedActors: ['betty', 'tim', 'devon', 'celia'],
				summaryStages: [
					{
						label: 'focused',
						minPrecision: 75,
						text: 'Your gossip email about Celia is loose in the office, and at least one person is already enjoying it.',
					},
					{
						label: 'blurred',
						minPrecision: 40,
						text: 'The wrong people have the message, and the room is starting to form theories faster than facts.',
					},
					{
						label: 'vague',
						minPrecision: 0,
						text: 'A bad message is moving through the office and changing shape as it goes.',
					},
				],
			},
			{
				id: 'celia-finding-out',
				title: 'Celia finding out',
				truthText: 'The target is still outside the core loop, but not for long.',
				severity: 94,
				spreadRisk: 52,
				precision: 84,
				containment: 36,
				lifecycleState: 'warming',
				linkedActors: ['celia', 'betty', 'frank'],
				summaryStages: [
					{
						label: 'focused',
						minPrecision: 75,
						text: 'Celia does not know yet, but the number of ways she can hear it is multiplying.',
					},
					{
						label: 'blurred',
						minPrecision: 40,
						text: 'Celia is near the edge of the story now. One bad hallway conversation could finish the trip.',
					},
					{
						label: 'vague',
						minPrecision: 0,
						text: 'The target is no longer safely outside the fallout.',
					},
				],
			},
			{
				id: 'hr-attention',
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
				id: 'dirty-residue',
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
				id: 'tim-compromised',
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
		],
		actors: [
			{
				id: 'betty',
				name: 'Betty',
				role: 'Operations coordinator',
				location: 'Break room',
				disposition: -5,
				stability: 54,
				suspicion: 18,
				talkativeness: 86,
				connections: ['tim', 'celia', 'frank'],
				knowledge: {
					'reply-all': {
						level: 'confirmed',
						confidence: 88,
						source: 'thread',
					},
				},
			},
			{
				id: 'tim',
				name: 'Tim',
				role: 'Analyst',
				location: 'Printer bay',
				disposition: 8,
				stability: 48,
				suspicion: 10,
				talkativeness: 42,
				connections: ['betty', 'frank', 'devon'],
				knowledge: {},
			},
			{
				id: 'devon',
				name: 'Devon',
				role: 'IT admin',
				location: 'IT room',
				disposition: 4,
				stability: 70,
				suspicion: 12,
				talkativeness: 24,
				connections: ['tim', 'frank'],
				knowledge: {
					'reply-all': {
						level: 'heard',
						confidence: 52,
						source: 'mail logs',
					},
				},
			},
			{
				id: 'frank',
				name: 'Frank',
				role: 'HR manager',
				location: 'HR',
				disposition: -10,
				stability: 80,
				suspicion: 20,
				talkativeness: 18,
				connections: ['celia', 'betty'],
				knowledge: {},
			},
			{
				id: 'celia',
				name: 'Celia',
				role: 'Director of ops',
				location: 'Conference room',
				disposition: 6,
				stability: 78,
				suspicion: 6,
				talkativeness: 30,
				connections: ['frank', 'betty'],
				knowledge: {},
			},
		],
		signals: [
			'You have one office morning to keep a stupid email from turning into institutional memory.',
		],
	},
	display: {
		status: [
			status('Turn', (state) => String(state.turn)),
			status('Stress', (state) => `${state.stats.stress} / ${state.stats.maxStress}`),
			status('Read', (state) => {
				const progress = read.logicProgress(state);

				if (!progress) {
					return '0 / 0';
				}

				return `${progress.correctMatches} / ${progress.totalMatches}`;
			}),
			status('All-hands', (state, context) => {
				if (state.flags.finaleUnlocked === true) {
					return 'Starting now';
				}

				return `${context.turnsUntilFinale} move${context.turnsUntilFinale === 1 ? '' : 's'} left`;
			}),
		],
		sections: [
			{
				title: 'Issues',
				type: 'issues',
			},
			{
				title: 'Coworkers',
				type: 'actors',
			},
			{
				title: 'Logic Board',
				type: 'logic',
			},
			{
				title: 'Memory',
				type: 'memories',
			},
		],
	},
	nodes: {
		bullpen: scene({
			kicker: 'Open Office Floor',
			title: 'The email is already alive now.',
			text(state) {
				const issue = read.issueById(state, 'reply-all');
				const memory = read.memoryByKey(state, 'email-body');
				const distribution = read.memoryByKey(state, 'distribution-list');

				return paragraphs(
					'You are back at your desk, pretending your monitor can protect you from the social physics you just released into the building.',
					issue ? `Right now the problem feels like this: ${issue.currentText}` : null,
					memory ? `You still remember the message clearly enough to hate yourself with specificity: ${memory.currentText}` : null,
					distribution ? `Your current model of the blast radius: ${distribution.currentText}` : null,
					'This is the whole day now. Contain it, redirect it, or watch the office turn your worst minute into policy.'
				);
			},
			choices: [
				choice('Go to the break room and deal with Betty first.', 'break-room'),
				choice('Go to the printer bay before paper makes this worse.', 'printer-bay'),
				choice('Go to IT and see what Devon can still do.', 'it-room'),
				choice('Go to HR before HR comes to you.', 'hr'),
				choice('Go toward Celia before someone else beats you there.', 'celia-office'),
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
				const bt = read.relationshipByPair(state, 'betty', 'tim');

				return paragraphs(
					'Betty is stirring coffee she is not going to drink. That means she is staying put long enough to spread information recreationally.',
					betty ? `Current read: ${betty.currentSummary}` : null,
					bt ? `Betty toward Tim currently reads as: ${bt.currentSummary}.` : null,
					'You do not need her loyalty. You need her to find a more entertaining problem than yours.'
				);
			},
			choices: [
				choice('Ask Betty to delete the message and keep your name out of it.', 'break-room', {
					condition: when.not(when.flag('bettySoftened')),
					feedback: 'Betty smiles in a way that suggests leverage has just changed hands, but she does pocket the thrill for now.',
					effects: [
						fx.set('flags.bettySoftened', true),
						fx.actorAdd('betty', 'disposition', 14),
						fx.actorAdd('betty', 'suspicion', 6),
						fx.issueContain('reply-all', 14),
						fx.issuePrecision('reply-all', 6),
					],
				}),
				choice('Feed Betty a side rumor about Tim being shaky on the layoffs list.', 'break-room', {
					condition: when.not(when.flag('bettyDistracted')),
					feedback: 'Betty immediately pivots to a shinier cruelty vector. Efficient. Gross. Effective.',
					effects: [
						fx.set('flags.bettyDistracted', true),
						fx.add('stats.stress', 1),
						fx.add('flags.dirtyPlayCount', 1),
						fx.issueContain('reply-all', 18),
						fx.issueAdd('dirty-residue', 'severity', 22),
						fx.issueLifecycle('dirty-residue', 'active'),
						fx.actorAdd('betty', 'disposition', -8),
						fx.actorAdd('betty', 'suspicion', 10),
						fx.relationshipAdd('betty', 'tim', -48),
						fx.relationshipAdd('tim', 'betty', -18),
					],
				}),
				choice('Tell Betty Celia is about to hear it anyway, so she should stop freelancing.', 'break-room', {
					condition: when.flag('celiaWarned'),
					feedback: 'Nothing dries up casual gossip like a target who already knows.',
					effects: [
						fx.issueContain('reply-all', 10),
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
				const compromised = read.issueById(state, 'tim-compromised');

				return paragraphs(
					'Printers are where private stupidity becomes shared office furniture. Tim is here, hovering near the tray with the expression of a man who knows something and wishes he did not.',
					tim ? `Current read on Tim: ${tim.currentSummary}` : null,
					compromised ? `His trajectory feels like this: ${compromised.currentText}` : null,
					'If you are paying attention, Tim reads like uncertainty with shoes on.'
				);
			},
			choices: [
				choice('Grab the printed copies and shred them.', 'printer-bay', {
					condition: when.not(when.flag('printerCopiesRemoved')),
					feedback: 'Paper is stupidly powerful. So is removing it before someone waves it around.',
					effects: [
						fx.set('flags.printerCopiesRemoved', true),
						fx.issueContain('reply-all', 16),
						fx.issueContain('celia-finding-out', 8),
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
					effects: [
						fx.actorAdd('tim', 'disposition', 12),
						fx.actorAdd('tim', 'stability', 10),
						fx.issueContain('reply-all', 10),
						fx.relationshipAdd('tim', 'betty', -6),
					],
				}),
				choice('Jam the printer so no one else gets a clean copy.', 'printer-bay', {
					condition: when.not(when.flag('printerJammed')),
					feedback: 'You buy time the dumb mechanical way.',
					effects: [
						fx.set('flags.printerJammed', true),
						fx.add('flags.dirtyPlayCount', 1),
						fx.issueContain('reply-all', 12),
						fx.issueAdd('dirty-residue', 'severity', 14),
						fx.issueLifecycle('dirty-residue', 'active'),
						fx.actorAdd('tim', 'suspicion', 12),
					],
				}),
				choice('Slip a flask into Tim\'s drawer so he misses the meeting.', 'printer-bay', {
					condition: when.and(
						when.not(when.flag('timSetUp')),
						when.turnAtLeast(2)
					),
					feedback: 'There it is: the quick ugly option. Effective on paper. Rotten in the bloodstream.',
					effects: [
						fx.set('flags.timSetUp', true),
						fx.add('flags.dirtyPlayCount', 1),
						fx.issueLifecycle('tim-compromised', 'active'),
						fx.issueAdd('tim-compromised', 'severity', 34),
						fx.issueAdd('dirty-residue', 'severity', 30),
						fx.issueLifecycle('dirty-residue', 'active'),
						fx.issueContain('reply-all', 14),
						fx.actorAdd('tim', 'stability', -18),
						fx.actorAdd('tim', 'suspicion', 26),
						fx.actorAdd('frank', 'suspicion', 8),
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
				const replyAll = read.issueById(state, 'reply-all');

				return paragraphs(
					'Devon already looks tired of people discovering technology only when they need a miracle. This is not a miracle. It is systems triage with a witness problem.',
					devon ? `Current read on Devon: ${devon.currentSummary}` : null,
					replyAll ? `Operationally, the problem still looks like this: ${replyAll.currentText}` : null,
					'Specificity calms him. Vagueness wastes his morning.'
				);
			},
			choices: [
				choice('Ask Devon for a legitimate recall and kill-switch on forwarding.', 'it-room', {
					condition: when.not(when.flag('recallEnabled')),
					feedback: 'Devon does not like you more, but he likes preventable chaos less.',
					effects: [
						fx.set('flags.recallEnabled', true),
						fx.issueContain('reply-all', 20),
						fx.issueAdd('reply-all', 'spreadRisk', -10),
						fx.actorAdd('devon', 'disposition', 8),
						fx.actorKnowledge('devon', 'reply-all', 'confirmed', 82, 'mail logs'),
					],
				}),
				choice('Ask Devon to purge logs that would prove timing and recipients.', 'it-room', {
					condition: when.not(when.flag('logsPurged')),
					feedback: 'Devon hates this, which means he is correctly identifying it as a bad idea.',
					effects: [
						fx.set('flags.logsPurged', true),
						fx.add('flags.dirtyPlayCount', 1),
						fx.issueContain('reply-all', 16),
						fx.issueContain('celia-finding-out', 10),
						fx.issueAdd('dirty-residue', 'severity', 26),
						fx.issueLifecycle('dirty-residue', 'active'),
						fx.issueAdd('hr-attention', 'spreadRisk', 10),
						fx.actorAdd('devon', 'disposition', -14),
						fx.actorAdd('devon', 'suspicion', 22),
					],
				}),
				choice('Show Devon the draft so you both stop arguing about what was actually said.', 'it-room', {
					condition: when.not(when.flag('devonSawDraft')),
					feedback: 'Specificity calms technical people and terrifies everyone else.',
					effects: [
						fx.set('flags.devonSawDraft', true),
						fx.reinforceMemory('email-body', 12),
						fx.actorAdd('devon', 'disposition', 6),
						fx.issuePrecision('reply-all', 10),
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
				const hrIssue = read.issueById(state, 'hr-attention');

				return paragraphs(
					'Frank has the calm of a man who will let you panic at full volume and then summarize it in a paragraph for legal preservation.',
					frank ? `Current read on Frank: ${frank.currentSummary}` : null,
					hrIssue ? `Policy pressure currently feels like this: ${hrIssue.currentText}` : null,
					'With Frank, confession beats improvisation. Liability is the only language he actually trusts.'
				);
			},
			choices: [
				choice('Preemptively tell Frank you sent the email and you are containing it.', 'hr', {
					condition: when.not(when.flag('frankBriefed')),
					feedback: 'You trade drama for paperwork. Sometimes that is the adult move. Sometimes it is just less embarrassing.',
					effects: [
						fx.set('flags.frankBriefed', true),
						fx.actorKnowledge('frank', 'reply-all', 'confirmed', 78, 'you'),
						fx.issueLifecycle('hr-attention', 'active'),
						fx.issueContain('reply-all', 8),
						fx.issueContain('hr-attention', 10),
						fx.actorAdd('frank', 'disposition', 6),
					],
				}),
				choice('Hint that Tim may have turned a bad email into a broader compliance issue.', 'hr', {
					condition: when.flag('timSetUp'),
					feedback: 'You move Frank\'s flashlight onto Tim. It is ugly and it works exactly because it is ugly.',
					effects: [
						fx.issueAdd('dirty-residue', 'severity', 18),
						fx.issueLifecycle('dirty-residue', 'active'),
						fx.issueContain('reply-all', 10),
						fx.issueLifecycle('tim-compromised', 'active'),
						fx.actorAdd('frank', 'suspicion', 16),
					],
				}),
				choice('Say nothing useful and see whether Frank already knows.', 'hr', {
					feedback(state) {
						return read.actorKnowsIssue(state, 'frank', 'reply-all', 'heard')
							? 'Frank knows enough to make silence look strategic.'
							: 'Frank mostly sees a person trying not to become an incident report.';
					},
					effects(state) {
						if (read.actorKnowsIssue(state, 'frank', 'reply-all', 'heard')) {
							return [
								fx.issueAdd('hr-attention', 'spreadRisk', 10),
								fx.actorAdd('frank', 'suspicion', 10),
							];
						}

						return [
							fx.actorAdd('frank', 'suspicion', 4),
						];
					},
				}),
				choice('Go to Celia before HR becomes the secondary problem.', 'celia-office'),
				choice('Go back to the bullpen.', 'bullpen'),
			],
		}),

		'celia-office': scene({
			kicker: 'Outside Conference Room B',
			title: 'You can still choose who tells Celia. That window is shutting.',
			text(state) {
				const celiaIssue = read.issueById(state, 'celia-finding-out');
				const celia = read.actorById(state, 'celia');

				return paragraphs(
					'Celia is reviewing meeting notes and has no idea how close she is to becoming the center of everyone else\'s coping mechanism.',
					celiaIssue ? `The situation around her currently feels like this: ${celiaIssue.currentText}` : null,
					celia ? `Current read on Celia: ${celia.currentSummary}` : null
				);
			},
			choices: [
				choice('Tell Celia directly before the office can decorate it.', 'celia-office', {
					condition: when.not(when.flag('celiaWarned')),
					feedback: 'Celia goes still. It is somehow more frightening than yelling.',
					effects: [
						fx.set('flags.celiaWarned', true),
						fx.actorKnowledge('celia', 'reply-all', 'confirmed', 86, 'you'),
						fx.issueContain('reply-all', 12),
						fx.issueContain('celia-finding-out', 24),
						fx.issueLifecycle('celia-finding-out', 'contained'),
						fx.actorAdd('celia', 'disposition', -10),
					],
				}),
				choice('Apologize without minimizing it.', 'celia-office', {
					condition: when.flag('celiaWarned'),
					feedback: 'For one second the room contains two adults instead of one adult and one flailing liability.',
					effects: [
						fx.actorAdd('celia', 'disposition', 8),
						fx.issueContain('celia-finding-out', 10),
						fx.issueContain('reply-all', 6),
					],
				}),
				choice('Tell Celia the wording was uglier than the office version will eventually be.', 'celia-office', {
					condition: when.and(
						when.flag('celiaWarned'),
						when.not(when.flag('toldCeliaExactWords'))
					),
					feedback: 'Specificity hurts, but it also prevents imagination from doing your job for it.',
					effects: [
						fx.set('flags.toldCeliaExactWords', true),
						fx.reinforceMemory('email-body', 10),
						fx.issuePrecision('reply-all', 12),
						fx.actorAdd('celia', 'disposition', 4),
					],
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
				const replyAll = read.issueById(state, 'reply-all');
				const hrAttention = read.issueById(state, 'hr-attention');
				const dirtyResidue = read.issueById(state, 'dirty-residue');
				const logicSolved = read.logicSolved(state);

				return paragraphs(
					'Everyone is here physically or almost here socially, which is basically the same thing in an office. This is the moment where all your containment either becomes narrative control or turns out to have been elaborate denial.',
					replyAll ? `Main issue: ${replyAll.currentText}` : null,
					hrAttention ? `HR pressure: ${hrAttention.currentText}` : null,
					dirtyResidue ? `What your tactics are doing to you: ${dirtyResidue.currentText}` : null,
					logicSolved ? 'You have a full read on the room.' : 'Your logic board is still incomplete. You are acting with partial certainty.'
				);
			},
			choices: [
				choice('Stand up and own the email before anyone can weaponize it harder.', 'ending', {
					feedback: 'You choose exposure with your name still attached.',
					effects: [
						fx.set('flags.finalAction', 'own-it'),
					],
				}),
				choice('Lean on recall, missing copies, and procedural fog to bury it.', 'ending', {
					condition: when.or(
						when.flag('recallEnabled'),
						when.flag('printerCopiesRemoved')
					),
					feedback: 'You choose containment over confession and hope the room is tired enough to accept it.',
					effects: [
						fx.set('flags.finalAction', 'bury-it'),
					],
				}),
				choice('Let Tim absorb the social blast and step aside.', 'ending', {
					condition: when.or(
						when.flag('timSetUp'),
						when.issueState('tim-compromised', 'active')
					),
					feedback: 'You choose a smaller victim and a dirtier mirror.',
					effects: [
						fx.set('flags.finalAction', 'blame-tim'),
					],
				}),
				choice('Take the HR hit quietly and refuse to make new damage.', 'ending', {
					feedback: 'You choose paperwork, shame, and the smallest possible radius.',
					effects: [
						fx.set('flags.finalAction', 'take-the-hit-quietly'),
					],
				}),
				choice('Leave the floor before the room closes over you.', 'ending', {
					feedback: 'You choose absence and let everyone else finish the architecture.',
					effects: [
						fx.set('flags.finalAction', 'walk'),
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