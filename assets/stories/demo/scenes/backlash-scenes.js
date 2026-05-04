export const backlashTim = {
	id: 'backlash_tim',
	location: 'Backlash',
	forced: true,
	title: 'Tim asks a precise question.',
	body: [
		'Tim appears beside you with the calm face of a man carrying a contradiction.',
		'He asks why your version of the recall timeline changed after Betty spoke to you.',
	],
	internalThought: [
		'This is not a vibe check. This is a structural inspection.',
	],
	choices: [
		{
			id: 'tim_backlash_truth',
			text: 'Give Tim one boring true correction.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'Tim accepts the correction, but not the innocence you tried to smuggle inside it.',
			effects: {
				bars: {
					timSuspectsYou: -25,
					distractTim: -25,
					blameSystem: 25,
				},
				signal: 'Tim slowed down, but the false trail weakened too.',
			},
			nextScene: 'hub',
		},
		{
			id: 'tim_backlash_deflect',
			text: 'Deflect toward system confusion.',
			category: 'underhanded',
			advanceTurn: false,
			once: true,
			resultText: 'Tim follows the system angle for now. He also notices you keep offering exits.',
			effects: {
				bars: {
					distractTim: 25,
					blameSystem: 25,
					timSuspectsYou: 25,
				},
				signal: 'You bought time from Tim and paid for it with suspicion.',
			},
			nextScene: 'hub',
		},
	],
};

export const backlashFrank = {
	id: 'backlash_frank',
	location: 'Backlash',
	forced: true,
	title: 'Frank knows the room is turning.',
	body: [
		'Frank catches you looking away from him too quickly.',
		'He says your name like he found it printed on the bottom of something broken.',
	],
	internalThought: [
		'Frank is not defending himself anymore. He is looking for who aimed the room at him.',
	],
	choices: [
		{
			id: 'frank_backlash_soften',
			text: 'Soften the Frank story before he detonates.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'Frank does not forgive the direction of travel, but he stops walking straight at you.',
			effects: {
				bars: {
					frameFrank: -25,
					frankRetaliates: -25,
				},
				signal: 'Frank cooled slightly. The scapegoat route lost strength.',
			},
			nextScene: 'hub',
		},
		{
			id: 'frank_backlash_double_down',
			text: 'Double down and make Frank look defensive.',
			category: 'commitment',
			advanceTurn: false,
			once: true,
			resultText: 'Frank’s anger becomes part of the picture. That helps until it starts talking.',
			effects: {
				bars: {
					frameFrank: 25,
					frankRetaliates: 25,
					managementEscalates: 25,
				},
				signal: 'You turned Frank’s anger into evidence. Evidence sometimes bites.',
			},
			nextScene: 'hub',
		},
	],
};

export const backlashBetty = {
	id: 'backlash_betty',
	location: 'Backlash',
	forced: true,
	title: 'Betty sees the pattern.',
	body: [
		'Betty steps close enough that she does not have to raise her voice.',
		'She says you keep giving people just enough truth to move them.',
	],
	internalThought: [
		'Betty was useful because she cared. Now she cares in the wrong direction.',
	],
	choices: [
		{
			id: 'betty_backlash_apologize',
			text: 'Apologize to Betty without asking for anything.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'Betty does not soften fully, but the apology lands better because it has no hook in it.',
			effects: {
				bars: {
					bettyLosesTrust: -25,
					warmBetty: 25,
					bettyKlepto: -25,
				},
				signal: 'Betty is hurt, not gone. The route that used her as cover weakened.',
			},
			nextScene: 'hub',
		},
		{
			id: 'betty_backlash_cut_loose',
			text: 'Let Betty go and stop trying to use her.',
			category: 'pivot',
			advanceTurn: false,
			once: true,
			resultText: 'You stop pulling on the Betty thread. The sweater is still ugly, but at least it stops unraveling there.',
			effects: {
				bars: {
					warmBetty: -25,
					bettyLosesTrust: -25,
				},
				signal: 'You abandoned Betty as a shield. That may be the least awful thing you do today.',
			},
			nextScene: 'hub',
		},
	],
};

export const backlashCelia = {
	id: 'backlash_celia',
	location: 'Backlash',
	forced: true,
	title: 'Celia has the full message.',
	body: [
		'Celia looks at you now.',
		'Not near you. At you.',
		'There is a printed copy of the email in her hand. The paper looks heavier than paper should.',
	],
	internalThought: [
		'You can still survive this, maybe. But the “she misunderstood” route just got hit by a truck.',
	],
	choices: [
		{
			id: 'celia_backlash_direct_apology',
			text: 'Apologize directly and stop minimizing.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'Celia does not forgive you. But for the first time, you stop making her carry the insult and your explanation at the same time.',
			effects: {
				bars: {
					containCelia: 25,
					celiaDramatic: -25,
					bettyLosesTrust: -25,
				},
				signal: 'You stopped minimizing Celia. Damage remains. Cruelty drops.',
			},
			nextScene: 'hub',
		},
		{
			id: 'celia_backlash_attack_context',
			text: 'Insist the message is being read without context.',
			category: 'underhanded',
			advanceTurn: false,
			once: true,
			resultText: 'Celia’s expression empties. The room may not hear this yet, but she will remember it perfectly.',
			effects: {
				bars: {
					celiaDramatic: 25,
					celiaFindsOut: 25,
					managementEscalates: 25,
					bettyLosesTrust: 25,
				},
				signal: 'You attacked the context after Celia got the message. That is a high-speed moral faceplant.',
			},
			nextScene: 'hub',
		},
	],
};

export const backlashLisa = {
	id: 'backlash_lisa',
	location: 'Backlash',
	forced: true,
	title: 'Lisa starts documenting.',
	body: [
		'Lisa closes her notebook, which is somehow worse than opening it.',
		'She says leadership needs a clear account before the all-hands.',
	],
	internalThought: [
		'Once this becomes formal, social maneuvering still matters, but it stops being the only game.',
	],
	choices: [
		{
			id: 'lisa_backlash_process',
			text: 'Give Lisa a clean process answer and stop adding drama.',
			category: 'cleanup',
			advanceTurn: false,
			once: true,
			resultText: 'Lisa writes down less than she could. That is not mercy. It is containment.',
			effects: {
				bars: {
					managementEscalates: -25,
					blameSystem: -25,
				},
				signal: 'You reduced formal risk slightly, but the system cover lost leverage.',
			},
			nextScene: 'hub',
		},
		{
			id: 'lisa_backlash_redirect',
			text: 'Redirect Lisa toward system failure and recall confusion.',
			category: 'underhanded',
			advanceTurn: false,
			once: true,
			resultText: 'Lisa accepts the system angle because systems can be reviewed. People can be reviewed too. Small issue.',
			effects: {
				bars: {
					blameSystem: 25,
					managementEscalates: 25,
				},
				signal: 'System blame is stronger. So is formal attention. Office alchemy.',
			},
			nextScene: 'hub',
		},
	],
};