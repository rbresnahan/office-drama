export function resolveFinale( state ) {
	const b = state.bars;
	const facts = state.facts || {};
	const hiddenEvents = Array.isArray( state.hiddenEvents ) ? state.hiddenEvents : [];
	const body = [];

	const hasHiddenEvent = ( hiddenEvent ) => hiddenEvents.includes( hiddenEvent );

	const addBodyLine = ( line ) => {
		if ( ! body.includes( line ) ) {
			body.push( line );
		}
	};

	const timRouteComplete = Boolean(
		state.npc.timMissesMeeting ||
		facts.timAteCompromisedLunch ||
		state.flags.timAteCompromisedLunch ||
		b.sidelineTim >= 100
	);

	const timRoutePartial = Boolean(
		! timRouteComplete &&
		(
			state.flags.knowsTimFoodVulnerability ||
			state.flags.timLunchCompromised ||
			facts.bathroomSuppliesMissing ||
			b.sidelineTim >= 50
		)
	);

	const frankRouteComplete = Boolean(
		facts.bottlePlantedFrank ||
		b.frameFrank >= 100
	);

	const frankRoutePartial = Boolean(
		! frankRouteComplete &&
		(
			facts.playerHasBottle ||
			facts.kitchenBottleMissing ||
			hasHiddenEvent( 'celia_may_have_seen_bottle_bag' ) ||
			b.frameFrank >= 50
		)
	);

	const chaosRouteComplete = Boolean(
		facts.bathroomSuppliesMissing ||
		facts.closetToiletPaperMissing ||
		hasHiddenEvent( 'bathroom_user_finds_missing_supplies' ) ||
		hasHiddenEvent( 'closet_toilet_paper_missing' )
	);

	const chaosRoutePartial = Boolean(
		! chaosRouteComplete &&
		(
			facts.closetToiletPaperReduced ||
			facts.playerHasToiletPaperRoll ||
			hasHiddenEvent( 'closet_roll_taken_unseen' ) ||
			b.bettyKlepto >= 25
		)
	);

	const completedRouteCount = [
		timRouteComplete,
		frankRouteComplete,
		chaosRouteComplete,
	].filter( Boolean ).length;

	const partialRouteCount = [
		timRoutePartial,
		frankRoutePartial,
		chaosRoutePartial,
	].filter( Boolean ).length;

	const highestRed = Math.max(
		b.timSuspectsYou,
		b.celiaFindsOut,
		b.frankRetaliates,
		b.bettyLosesTrust,
		b.managementEscalates
	);

	const highestGreen = Math.max(
		b.frameFrank,
		b.warmBetty,
		b.distractTim,
		b.containCelia,
		b.blameSystem,
		b.sidelineTim
	);

	let title = 'The room decides what story survived.';

	if ( b.managementEscalates >= 100 ) {
		title = 'This is not just office drama anymore.';
		addBodyLine( 'Lisa has enough structure around the incident that leadership treats it as formal. The room still talks, but the paperwork talks louder.' );
	} else if ( completedRouteCount >= 2 && highestRed < 100 ) {
		title = 'The room has too many problems to hold one clean accusation.';
		addBodyLine( 'By the time the all-hands starts, the office is carrying more than one disaster. That helps you because attention splits. It hurts you because patterns multiply.' );
	} else if ( frankRouteComplete && b.frankRetaliates < 100 ) {
		title = 'Frank becomes the story.';
		addBodyLine( 'By the time the meeting starts, Frank is no longer just Frank. He is a theory people can point at.' );
	} else if ( timRouteComplete ) {
		title = 'Tim is missing when the room needs him.';
		addBodyLine( 'The meeting starts with a Tim-shaped hole in the timeline. That hole is not innocence, but it is space, and today space is the closest thing you have to mercy.' );
	} else if ( chaosRouteComplete && b.managementEscalates < 100 ) {
		title = 'The office is too distracted to form one clean story.';
		addBodyLine( 'The all-hands opens with the room already irritated by smaller disasters. Nobody wants to talk about missing supplies, which is exactly why missing supplies keep taking up oxygen.' );
	} else if ( b.warmBetty >= 100 && b.bettyLosesTrust <= 50 ) {
		title = 'Betty speaks before the room hardens.';
		addBodyLine( 'Betty does not excuse the email. She does something more useful: she makes you sound human before Tim can make you sound procedural.' );
	} else if ( b.timSuspectsYou >= 100 && ! state.npc.timMissesMeeting ) {
		title = 'Tim brings the timeline.';
		addBodyLine( 'Tim does not raise his voice. He does not have to. He places the timeline in the room and lets it do what timelines do.' );
	} else {
		title = 'You survive the opening impact.';
		addBodyLine( 'The meeting begins messy. That helps. Clean rooms are where clean accusations win.' );
	}

	const routeRead = [
		timRouteComplete ? 'Tim route: landed' : timRoutePartial ? 'Tim route: incomplete' : 'Tim route: untouched',
		frankRouteComplete ? 'Frank route: landed' : frankRoutePartial ? 'Frank route: incomplete' : 'Frank route: untouched',
		chaosRouteComplete ? 'Chaos route: landed' : chaosRoutePartial ? 'Chaos route: incomplete' : 'Chaos route: untouched',
	].join( '. ' );

	addBodyLine( `End-state read: ${ routeRead }.` );

	if ( completedRouteCount >= 2 ) {
		addBodyLine( 'Your best protection is not one perfect lie. It is the fact that the room now has too many plausible problems competing for oxygen.' );
	} else if ( completedRouteCount === 1 ) {
		addBodyLine( 'One route fully lands. That gives the room a story, but it also makes that story carry all the weight.' );
	} else if ( partialRouteCount > 0 ) {
		addBodyLine( 'You have fragments of plans, not a completed route. Fragments still matter, but they do not protect you like structure does.' );
	} else {
		addBodyLine( 'You reach the all-hands without a completed route. The office does not have to work very hard to keep looking at you.' );
	}

	if ( timRouteComplete ) {
		addBodyLine( 'Tim misses the most important stretch of the meeting. His absence creates space where facts should have been. You use that space because of course you do.' );
	} else if ( timRoutePartial ) {
		addBodyLine( 'The Tim route never fully lands. He is distracted, suspicious, or uncomfortable, but not removed. A half-disrupted Tim is still Tim, and Tim comes with footnotes.' );
	} else if ( b.distractTim >= 75 ) {
		addBodyLine( 'Tim has facts, but the facts point in too many directions. He suspects you, but suspicion is not the same as a clean public kill shot.' );
	} else if ( b.timSuspectsYou >= 75 ) {
		addBodyLine( 'Tim watches you during the meeting instead of the speaker. That is not great. That is the opposite of great wearing business casual.' );
	}

	if ( state.flags.timHasNotes && b.distractTim < 75 && ! timRouteComplete ) {
		addBodyLine( 'Tim brought notes. That is the problem with procedural people: eventually they become furniture with receipts.' );
	}

	if ( frankRouteComplete ) {
		addBodyLine( 'The Frank story has physical evidence now. Maybe it is not airtight, but it is tangible, and tangible things make nervous rooms feel smarter than they are.' );
	} else if ( frankRoutePartial ) {
		addBodyLine( 'The Frank story has smoke but not enough fire. People can imagine him as the problem, but nobody has quite enough to point without feeling exposed.' );
	} else if ( b.frameFrank >= 75 ) {
		addBodyLine( 'Frank takes heat. Maybe not all of it, but enough that your name is not the only name in the room.' );
	}

	if ( b.frankRetaliates >= 100 ) {
		addBodyLine( 'Frank does not go down quietly. He asks why you were the first person to mention his desk. The silence after that has teeth.' );
	} else if ( b.frankRetaliates >= 75 ) {
		addBodyLine( 'Frank knows he was aimed at something. He does not have the whole map, but he has your scent on the paper.' );
	}

	if ( facts.playerHasBottle && ! facts.bottlePlantedFrank ) {
		addBodyLine( 'The bottle never becomes evidence against Frank because it stays with you. That is not a prop anymore. That is a liability with a cap on it.' );
	}

	if ( hasHiddenEvent( 'celia_may_have_seen_bottle_bag' ) && ! facts.bottlePlantedFrank ) {
		addBodyLine( 'Celia may have seen the bag moment. She does not have the whole story, but she has a weird piece of it, and weird pieces are how people start digging.' );
	}

	if ( chaosRouteComplete ) {
		addBodyLine( 'The missing supplies create a side scandal stupid enough to be useful. Nobody wants to discuss bathroom logistics in an all-hands, which is precisely why the topic keeps trying to enter the room wearing tap shoes.' );
	} else if ( chaosRoutePartial ) {
		addBodyLine( 'The chaos route remains small but present. One missing roll does not derail a meeting, but it does add the kind of background weirdness that makes every other story less clean.' );
	}

	if ( hasHiddenEvent( 'lisa_may_connect_missing_supplies' ) ) {
		addBodyLine( 'Lisa has started connecting the supply issue to the day’s larger weirdness. That makes the chaos useful as cover and dangerous as pattern.' );
	}

	if ( hasHiddenEvent( 'betty_may_be_tied_to_missing_supplies' ) ) {
		addBodyLine( 'Betty’s name gets too close to the missing-supplies problem. If she realizes who nudged it there, any help she might have given you curdles fast.' );
	}

	if ( b.warmBetty >= 75 && b.bettyLosesTrust <= 50 ) {
		addBodyLine( 'Betty helps. Not enough to erase what happened, but enough to keep the room from turning you into one clean villain.' );
	} else if ( b.bettyLosesTrust >= 75 ) {
		addBodyLine( 'Betty does not defend you. Worse, she looks like someone who almost did.' );
	}

	if ( state.flags.knowsBettyWatchesKitchen && b.bettyLosesTrust >= 50 ) {
		addBodyLine( 'Betty noticed more movement than you hoped. The office traffic you used as cover may become the map she uses against you.' );
	}

	if ( b.celiaFindsOut >= 100 && b.containCelia < 75 ) {
		addBodyLine( 'Celia has the full message and the room knows she has it. Every soft explanation you built now sounds like packaging around something rotten.' );
	} else if ( b.containCelia >= 75 ) {
		addBodyLine( 'Celia is hurt, but she does not become the center of the room. That is not forgiveness. That is containment.' );
	} else if ( b.celiaFindsOut >= 50 ) {
		addBodyLine( 'Celia knows enough to be dangerous later. The meeting ends, but the consequence does not.' );
	}

	if ( state.flags.devonMayReachCelia && b.devonLeak >= 50 ) {
		addBodyLine( 'Devon carried the story toward Celia before anyone could fully control it. The rumor now has fingerprints from more than one person, which is useful until someone dusts for yours.' );
	}

	if ( b.blameSystem >= 75 ) {
		addBodyLine( 'The system-blame route works enough to dilute the focus. Suddenly people are saying “recall behavior” and “forwarding confusion” instead of only saying your name.' );
	}

	if ( b.bettyKlepto >= 75 ) {
		addBodyLine( 'The Betty-takes-things story creates cover for missing objects, but it leaves a social bruise. If Betty connects the bruise to you, that bruise gets a mouth.' );
	}

	if ( b.devonLeak >= 75 ) {
		addBodyLine( 'Devon becomes part of the explanation for why the story spread. Unfortunately, Devon is also the sort of person who explains explanations.' );
	}

	if ( b.lisaOverreacting >= 75 ) {
		addBodyLine( 'Lisa absorbs some blame for escalation. That helps you socially and hurts you structurally, because Lisa keeps records.' );
	}

	if ( b.celiaDramatic >= 75 && b.celiaFindsOut < 100 ) {
		addBodyLine( 'Some people think Celia may be reacting to fragments. It is ugly. It is useful. Those two facts keep shaking hands.' );
	}

	if ( completedRouteCount >= 2 && highestRed < 100 ) {
		addBodyLine( 'You built more than one live problem before the meeting. That gives the room options, and options slow accusations down. It also means there are more strings leading back to you if anyone starts pulling.' );
	} else if ( completedRouteCount >= 2 && highestRed >= 100 ) {
		addBodyLine( 'You built more than one live problem, but the pressure got hot enough that the room starts noticing the architecture. Multiple fires are useful only until someone asks who bought the matches.' );
	} else if ( completedRouteCount === 0 && partialRouteCount >= 2 ) {
		addBodyLine( 'You started several fires and fully controlled none of them. The room is smoky, but smoke without direction can reveal as much as it hides.' );
	} else if ( completedRouteCount === 0 && partialRouteCount === 0 ) {
		addBodyLine( 'You arrive at the all-hands with no strong route, no clean shield, and no useful chaos. The room does not need to solve you. You have helpfully remained obvious.' );
	}

	if ( highestGreen >= 100 && highestRed < 100 ) {
		addBodyLine( 'You do not win cleanly, because clean wins are for people who did not send the email. But one story survives strongly enough to carry you out of the room.' );
	} else if ( highestRed >= 100 && highestGreen < 75 ) {
		addBodyLine( 'You had pieces of plans, not a plan. The room notices. Rooms are rude like that.' );
	} else if ( highestRed >= 100 && highestGreen >= 75 ) {
		addBodyLine( 'You survive only because your cover story is strong enough to fight the evidence instead of erase it. That is not comfort. That is a knife block with one empty slot.' );
	} else {
		addBodyLine( 'You survive, but the version of you that leaves the meeting is not the same version that entered. That may be strategy. That may be damage. Office life loves a two-for-one.' );
	}

	return {
		kicker: 'All-Hands Finale',
		title,
		body,
		internalThought: [
			'Final board state decides the ending. Strong green bars create survivable stories. High red bars decide who sees through them.',
			'Phase 8 polish: the finale now gives a clearer route status read before explaining consequences.',
		],
	};
}