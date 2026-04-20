import { APP_DATA, DEFAULT_MEMORY_TUNING } from '../../data.js';
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
	when.flag('reportMade')
);

const canPressMayor = when.or(
	when.knowsTag('vehicle:white'),
	when.evidence('mara-note'),
	when.evidence('security-still')
);

function getEnding(state) {
	const whiteAnchors =
		(read.hasEvidence(state, 'paint-chip') ? 1 : 0) +
		(read.hasEvidence(state, 'mara-note') ? 1 : 0) +
		(read.hasEvidence(state, 'security-still') ? 1 : 0) +
		(read.path(state, 'flags.reportColor') === 'white' ? 1 : 0);

	const blackAnchors =
		(read.path(state, 'flags.reportColor') === 'black' ? 1 : 0) +
		(read.hasBelief(state, 'trust-mayor') ? 1 : 0);

	const action = read.path(state, 'flags.finalAction');

	if (action === 'publish-with-mara') {
		if (whiteAnchors >= 2) {
			return {
				title: 'Ending: Exposure',
				text: paragraphs(
					'Mara runs the story before dawn with the paint chip, the note, and the still. The town does what towns do when the lie is too expensive to keep: it acts shocked, then hungry. Mayor Harlow goes pale on the band shell steps. The truth that survives is ugly, partial, and enough.',
					'You still cannot trust every corner of your own head. You just no longer have to carry the whole thing alone.'
				),
			};
		}

		return {
			title: 'Ending: Ragged Truth',
			text: paragraphs(
				'Mara prints something real but thin. It hurts Harlow without killing him. By noon, half the town treats you like a witness and the other half like a sick man who contaminated the story with his own gaps.',
				'You got a blade into the lie, but not deep enough to stop it from moving.'
			),
		};
	}

	if (action === 'stand-with-ruiz') {
		if (whiteAnchors >= 1 && read.flag(state, 'ruizHasEvidence') === true) {
			return {
				title: 'Ending: Partial Record',
				text: paragraphs(
					'Ruiz takes what you can actually hand him and discards the parts your voice cannot support. It is not heroic. It is procedural, slow, and painfully incomplete. But it survives the morning.',
					'The case stays open. Harlow stops smiling quite so easily. You do not get certainty. You get a paper trail, which in this town might be the next best thing.'
				),
			};
		}

		return {
			title: 'Ending: Thin Statement',
			text: paragraphs(
				'Ruiz writes down uncertainty and little else. You refuse to force detail where you no longer have it. The report is honest and nearly useless.',
				'Nothing explodes. Nothing is solved. But for once, you do not turn doubt into a lie just to stop feeling it.'
			),
		};
	}

	if (action === 'protect-harlow') {
		if (whiteAnchors >= 1) {
			return {
				title: 'Ending: Complicity',
				text: paragraphs(
					'Harlow thanks you in the soft voice people use when buying silence. The evidence disappears into municipal hands. The official story firms up without the pieces that could have broken it.',
					'You walk away safer, and far dirtier than you were when the lights first went out.'
				),
			};
		}

		return {
			title: 'Ending: Comfortable Lie',
			text: paragraphs(
				'Harlow does not even need to hide much. You hand him confusion and call it cooperation. By morning the town has a neat version of events, and it fits because you helped it fit.',
				'It is a clean ending for everyone except you.'
			),
		};
	}

	if (action === 'blame-drifter') {
		if (blackAnchors >= 1) {
			return {
				title: 'Ending: False Resolution',
				text: paragraphs(
					'You give the town the kind of villain it already wanted: faceless, passing through, impossible to verify by morning. It lands because your story is confident, not because it is true.',
					'People thank you for helping them stop looking. That is the worst part.'
				),
			};
		}

		return {
			title: 'Ending: Reckless Guess',
			text: paragraphs(
				'You force a name onto a shape that never held still long enough to deserve it. Even the town senses the weakness. The accusation dies, but the damage of making it does not.',
				'You do not solve anything. You only prove how badly a frightened mind wants a culprit.'
			),
		};
	}

	if (action === 'leave-town') {
		if (whiteAnchors >= 1) {
			return {
				title: 'Ending: Flight',
				text: paragraphs(
					'You leave with more than a feeling and less than a case. Somewhere behind you, the town keeps choosing which scraps to keep and which to bury.',
					'You preserve yourself. Whether you preserved the truth is another matter entirely.'
				),
			};
		}

		return {
			title: 'Ending: Fog',
			text: paragraphs(
				'You walk out before the story can harden around you. By sunrise, even the outline of it is changing. The town becomes just another place where something happened and no one agreed on what.',
				'Maybe leaving was survival. Maybe it was surrender. Your head does not volunteer the answer.'
			),
		};
	}

	return {
		title: 'Ending: Unresolved',
		text: 'The night ends without commitment. That sounds peaceful until you realize indecision is just another way a lie can survive.',
	};
}

export const storyConfig = {
	meta: {
		title: APP_DATA.title,
		eyebrow: APP_DATA.eyebrow,
		subtitle: APP_DATA.subtitle,
	},
	startNode: 'intro',
	turnRules: {
		maxTurns: 5,
		signalLimit: DEFAULT_MEMORY_TUNING.signalLimit,
		memoryDecay: DEFAULT_MEMORY_TUNING,
		events: [
			{
				id: 'turn-2',
				at: 2,
				text: 'The storm leans harder into town. People stop pretending the night will fix itself.',
			},
			{
				id: 'turn-4',
				at: 4,
				text: 'The town is closing ranks. Whatever version of the story you mean to act on, it has to be soon.',
				effects: [
					fx.set('flags.finaleUnlocked', true),
				],
			},
		],
	},
	initialState: {
		turn: 0,
		stats: {
			stress: 1,
			maxStress: 4,
		},
		flags: {
			finaleUnlocked: false,
			reportMade: false,
			reportColor: null,
			heardMayor: false,
			talkedToMara: false,
			ruizHasEvidence: false,
			finalAction: null,
		},
		evidence: [],
		beliefs: {},
		signals: [
			'You came into town with one useful memory and no guarantee it will stay useful.',
		],
		memories: [
			{
				key: 'hit-and-run',
				label: 'The accident before town.',
				truthText: 'A white SUV hit someone and sped away.',
				source: 'seen',
				importance: 'high',
				canCorrupt: true,
				stability: 100,
				confidence: 72,
				stages: [
					{
						label: 'fresh',
						minStability: 70,
						text: 'A white SUV hit someone and sped away.',
						recallTags: ['event:hit-and-run', 'vehicle:white', 'vehicle:suv'],
					},
					{
						label: 'fading',
						minStability: 45,
						text: 'An SUV hit someone and left.',
						recallTags: ['event:hit-and-run', 'vehicle:suv'],
					},
					{
						label: 'hazy',
						minStability: 15,
						text: 'A vehicle hit someone.',
						recallTags: ['event:accident'],
					},
				],
				corruptedStage: {
					label: 'corrupted',
					text: 'A black sedan hit someone and fled toward the highway.',
					recallTags: ['event:hit-and-run', 'vehicle:black', 'vehicle:sedan'],
				},
				lostStage: {
					text: 'There was an accident. The rest keeps slipping out of reach.',
					recallTags: ['event:accident'],
				},
			},
		],
	},
	display: {
		status: [
			status('Turn', (state) => String(state.turn)),
			status('Stress', (state) => `${state.stats.stress} / ${state.stats.maxStress}`),
			status('Town', (state, context) => {
				if (state.flags.finaleUnlocked === true) {
					return 'Closing in';
				}

				return `${context.turnsUntilFinale} move${context.turnsUntilFinale === 1 ? '' : 's'} until the town hardens around a story.`;
			}),
		],
	},
	nodes: {
		intro: scene({
			kicker: 'Town Edge',
			title: 'You still have the crash. For now.',
			text(state) {
				const memory = read.memoryByKey(state, 'hit-and-run');

				return paragraphs(
					'The power is out clear through Brackenridge. Storefront glass holds dead reflections. The only thing in your head with any bite left is the scene before town.',
					memory ? `Right now, it still feels like this: ${memory.currentText}` : 'Something happened before you got here, but the edges are already going soft.',
					'If you are going to use what you know, you need to decide what to preserve before the night starts rewriting it for you.'
				);
			},
			choices: [
				choice('Go back toward the roadside where it happened.', 'crash-site'),
				choice('Head into the diner where the generator is still humming.', 'diner'),
				choice('Walk to the square where Mayor Harlow is gathering the town.', 'square'),
				choice('Find the police station before the memory gets any worse.', 'station'),
			],
		}),

		'crash-site': scene({
			kicker: 'Roadside Culvert',
			title: 'Metal, rain, and the shape of impact.',
			text(state) {
				if (read.hasEvidence(state, 'paint-chip')) {
					return paragraphs(
						'The ditch still smells like hot metal and wet dirt.',
						'The white paint chip in your pocket is steadier than the memory you pulled it from. That alone tells you something ugly about the night.'
					);
				}

				return paragraphs(
					'Skid marks drag toward the culvert and vanish into darkness.',
					'There is dried blood where someone went down, and a scatter of debris where the vehicle clipped the shoulder before it took off.'
				);
			},
			choices: [
				choice('Pocket the paint chip caught in the gravel.', 'crash-site', {
					condition: when.not(when.evidence('paint-chip')),
					feedback: 'You secure a paint chip. The color survives outside your head now.',
					effects: [
						fx.evidence({
							id: 'paint-chip',
							title: 'White paint chip',
							text: 'A flake of white automotive paint from the crash site.',
							tags: ['vehicle:white', 'vehicle:suv', 'evidence:crash'],
							source: 'crash site',
							verified: true,
							anchorMemoryKey: 'hit-and-run',
						}),
						fx.reinforceMemory('hit-and-run', 20),
					],
				}),
				choice('Study the skid marks and replay the impact.', 'crash-site', {
					feedback: 'You replay the impact until a few edges sharpen.',
					effects: [
						fx.reinforceMemory('hit-and-run', 10),
						fx.add('stats.stress', 1),
					],
				}),
				choice('Go to the diner.', 'diner'),
				choice('Take what you have to the station.', 'station'),
				choice('Cut through the dark square.', 'square'),
				choice('The town is hardening around a story. Go to the band shell.', 'finale', {
					condition: canReachFinale,
				}),
			],
		}),

		diner: scene({
			kicker: "Mara's Diner",
			title: 'Light, coffee, and a woman who notices too much.',
			text(state) {
				if (read.flag(state, 'talkedToMara')) {
					return paragraphs(
						'Mara keeps the register closed and the coffee hot. The generator rattles under the floorboards like a tired jaw.',
						'Now that you have spoken, she is watching you the way people watch a witness who might fall apart or finally say the thing that matters.'
					);
				}

				return paragraphs(
					'The diner is the only lit room on Main. Mara has candles on the counter and a face that says she has already heard three bad versions of tonight.',
					'She looks at you once and decides you are either useful or in trouble. Maybe both.'
				);
			},
			choices: [
				choice('Tell Mara what you think you saw.', 'diner', {
					condition: when.not(when.flag('talkedToMara')),
					feedback(state) {
						if (read.knowsTag(state, 'vehicle:white')) {
							return 'Mara writes down what the town would rather you forget.';
						}

						return 'You can tell Mara it was bad. You cannot keep the color still long enough to say it cleanly.';
					},
					effects(state) {
						const effects = [
							fx.set('flags.talkedToMara', true),
							fx.belief('trust-mara', 'Mara is trying to help.'),
						];

						if (read.knowsTag(state, 'vehicle:white')) {
							effects.push(
								fx.evidence({
									id: 'mara-note',
									title: "Mara's napkin note",
									text: "Council SUV 14 is white. It is usually tied to the mayor's office.",
									tags: ['vehicle:white', 'vehicle:suv', 'mayor:connected'],
									source: 'Mara',
									verified: false,
								})
							);
						}

						return effects;
					},
				}),
				choice('Take the blurred security still from the cork board.', 'diner', {
					condition: when.and(
						when.flag('talkedToMara'),
						when.not(when.evidence('security-still'))
					),
					feedback: 'The still is blurry, but blur beats absence.',
					effects: [
						fx.evidence({
							id: 'security-still',
							title: 'Blurred security still',
							text: 'A pale SUV shape caught leaving the square at speed. The plate is useless, the body type is not.',
							tags: ['vehicle:white', 'vehicle:suv', 'evidence:camera'],
							source: 'diner camera',
							verified: true,
							anchorMemoryKey: 'hit-and-run',
						}),
					],
				}),
				choice("Take Mara's help and go to the station.", 'station'),
				choice('Leave for the square.', 'square'),
				choice('Go back to the crash site.', 'crash-site'),
				choice('The town is hardening around a story. Go to the band shell.', 'finale', {
					condition: canReachFinale,
				}),
			],
		}),

		square: scene({
			kicker: 'Main Square',
			title: 'Mayor Harlow is already writing the night for everyone else.',
			text(state) {
				if (read.flag(state, 'heardMayor')) {
					return paragraphs(
						'Harlow is still working the crowd with both hands visible and his concern carefully measured.',
						read.hasBelief(state, 'trust-mayor')
							? 'Now that his version is in your head, it keeps offering itself as the one that would make the night easier.'
							: 'You have already heard his clean version of events. Clean is not the same thing as true.'
					);
				}

				return paragraphs(
					'Mayor Harlow stands under the band shell with a flashlight and the kind of voice that assumes people need him more than facts.',
					'The town is waiting for a story it can live with. He looks ready to hand them one.'
				);
			},
			choices: [
				choice('Let Harlow tell you what happened.', 'square', {
					condition: when.not(when.flag('heardMayor')),
					feedback: 'Harlow says it plainly enough that your mind starts to treat the lie like a handrail.',
					effects: [
						fx.set('flags.heardMayor', true),
						fx.belief('trust-mayor', 'Mayor Harlow is protecting me.'),
						fx.distortMemory('hit-and-run', {
							label: 'corrupted',
							text: 'A black sedan hit someone and fled toward the highway.',
							recallTags: ['event:hit-and-run', 'vehicle:black', 'vehicle:sedan'],
						}),
						fx.add('stats.stress', 1),
					],
				}),
				choice('Ask Harlow why so many people keep mentioning council vehicles.', 'square', {
					condition: canPressMayor,
					feedback: 'His smile tightens. For the first time tonight, the mayor looks like a man who could lose.',
					effects: [
						fx.add('stats.stress', 1),
					],
				}),
				choice('Slip away to the diner.', 'diner'),
				choice('Go to the station.', 'station'),
				choice('Head back toward the crash site.', 'crash-site'),
				choice('Step onto the band shell and force the night to choose a story.', 'finale', {
					condition: canReachFinale,
				}),
			],
		}),

		station: scene({
			kicker: 'Police Station',
			title: 'This is where memory becomes record or mistake.',
			text(state) {
				if (read.flag(state, 'reportMade')) {
					if (read.path(state, 'flags.reportColor') === 'white') {
						return paragraphs(
							'Detective Ruiz has your statement in front of him and a face that says he trusts paper more than people.',
							'He heard "white SUV." Whether he believes you depends on what you can put on the desk besides your own voice.'
						);
					}

					if (read.path(state, 'flags.reportColor') === 'black') {
						return paragraphs(
							'Ruiz wrote down "black sedan" because you said it like you meant it.',
							'He has seen confident witnesses be wrong before. The problem is that the town loves confidence even when the facts do not.'
						);
					}

					return paragraphs(
						'Ruiz has a short, honest statement and very little else.',
						'Uncertainty does not travel as well as a clean lie, but it does less damage on the way.'
					);
				}

				return paragraphs(
					'Detective Ruiz is working by lantern light and paperwork. He looks exhausted enough to be useful.',
					'This is the room where your version of the night can become a record or a mistake.'
				);
			},
			choices: [
				choice('Tell Ruiz, "It was a white SUV."', 'station', {
					condition: when.not(when.flag('reportMade')),
					disabledIf: when.not(when.knowsTag('vehicle:white')),
					unavailableText: 'You reach for the color, but it will not stay put long enough to say it out loud.',
					feedback: 'Ruiz writes down white SUV and waits for something sturdier than your certainty.',
					effects: [
						fx.set('flags.reportMade', true),
						fx.set('flags.reportColor', 'white'),
						fx.add('stats.stress', -1),
					],
				}),
				choice('Tell Ruiz, "It was a black sedan."', 'station', {
					condition: when.not(when.flag('reportMade')),
					disabledIf: when.not(when.knowsTag('vehicle:black')),
					unavailableText: 'A darker version of the night presses at you, but it is still too slippery to claim.',
					feedback: 'Ruiz writes down black sedan. The statement sounds cleaner than your head feels.',
					effects: [
						fx.set('flags.reportMade', true),
						fx.set('flags.reportColor', 'black'),
						fx.add('stats.stress', -1),
					],
				}),
				choice('Tell Ruiz, "I do not remember enough to say."', 'station', {
					condition: when.not(when.flag('reportMade')),
					feedback: 'You choose uncertainty over invention. It feels worse now and may age better.',
					effects: [
						fx.set('flags.reportMade', true),
						fx.set('flags.reportColor', 'uncertain'),
					],
				}),
				choice("Put your surviving evidence on Ruiz's desk.", 'station', {
					condition: when.or(
						when.evidence('paint-chip'),
						when.evidence('mara-note'),
						when.evidence('security-still')
					),
					disabledIf: when.flag('ruizHasEvidence'),
					unavailableText: 'Ruiz already has what you were able to save from yourself.',
					feedback: 'Physical evidence lands better than memory ever will.',
					effects: [
						fx.set('flags.ruizHasEvidence', true),
					],
				}),
				choice('Go back to the diner.', 'diner'),
				choice('Head to the square.', 'square'),
				choice('Return to the roadside.', 'crash-site'),
				choice('Go to the band shell and choose what this night becomes.', 'finale', {
					condition: canReachFinale,
				}),
			],
		}),

		finale: scene({
			kicker: 'Band Shell',
			title: 'The town is ready to keep whichever version hurts least.',
			text(state) {
				return paragraphs(
					'The crowd has thinned into the kind of people who stay when a story is about to harden into fact.',
					'Harlow is nearby. Ruiz is nearby. Mara is nearby. So is the version of you that will have to live with whatever you choose next.',
					read.hasBelief(state, 'trust-mayor')
						? "Harlow's version still offers itself as the painless way out."
						: null,
					read.hasBelief(state, 'trust-mara')
						? 'Mara keeps looking at you like truth does not have to be neat to be worth saving.'
						: null
				);
			},
			choices: [
				choice('Give everything to Mara and let her publish tonight.', 'ending', {
					condition: when.or(
						when.evidence('paint-chip'),
						when.evidence('mara-note'),
						when.evidence('security-still')
					),
					feedback: 'You choose exposure over control.',
					effects: [
						fx.set('flags.finalAction', 'publish-with-mara'),
					],
				}),
				choice('Stand with Ruiz, hand over what survives, and admit what does not.', 'ending', {
					condition: when.or(
						when.flag('reportMade'),
						when.evidence('paint-chip'),
						when.evidence('security-still')
					),
					feedback: 'You choose a record, however incomplete.',
					effects: [
						fx.set('flags.finalAction', 'stand-with-ruiz'),
					],
				}),
				choice('Hand the evidence to Harlow and ask him to make it disappear.', 'ending', {
					feedback: 'You choose safety over truth.',
					effects: [
						fx.set('flags.finalAction', 'protect-harlow'),
					],
				}),
				choice('Name the highway drifter and let the town stop looking.', 'ending', {
					condition: when.or(
						when.belief('trust-mayor'),
						when.path('flags.reportColor', 'black')
					),
					feedback: 'You hand the town a suspect-shaped relief valve.',
					effects: [
						fx.set('flags.finalAction', 'blame-drifter'),
					],
				}),
				choice('Walk out of town before the memory changes again.', 'ending', {
					feedback: 'You choose survival and whatever that costs.',
					effects: [
						fx.set('flags.finalAction', 'leave-town'),
					],
				}),
			],
		}),

		ending: endingNode(getEnding),
	},
};