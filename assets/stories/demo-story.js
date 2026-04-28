export const OFFICE_PANIC_STORY = {
	id: 'office_panic_demo',
	title: 'Office Panic',
	maxTurns: 12,
	startSceneId: 'hub',
	finaleSceneId: 'final_all_hands',
	emailSubject: 'Celia',
	emailSummary: 'You sent a damaging gossip email about Celia. The recall only partly worked.',
	initialSignal: 'You sent a bad email about Celia. Recall only partly worked. Office physics are now in charge.',

	bars: {
		green: [
			{ id: 'frameFrank', label: 'Frame Frank', initial: 0 },
			{ id: 'warmBetty', label: 'Warm Betty', initial: 0 },
			{ id: 'distractTim', label: 'Distract Tim', initial: 0 },
			{ id: 'containCelia', label: 'Contain Celia', initial: 0 },
			{ id: 'blameSystem', label: 'Blame the System', initial: 0 },
			{ id: 'sidelineTim', label: 'Sideline Tim', initial: 0 },
			{ id: 'bettyKlepto', label: 'Betty Klepto Story', initial: 0, optional: true },
			{ id: 'devonLeak', label: 'Devon Is the Leak', initial: 0, optional: true },
			{ id: 'lisaOverreacting', label: 'Lisa Is Overreacting', initial: 0, optional: true },
			{ id: 'celiaDramatic', label: 'Celia Is Dramatic', initial: 0, optional: true },
		],
		red: [
			{ id: 'timSuspectsYou', label: 'Tim Suspects You', initial: 0 },
			{ id: 'celiaFindsOut', label: 'Celia Finds Out', initial: 0 },
			{ id: 'frankRetaliates', label: 'Frank Retaliates', initial: 0 },
			{ id: 'bettyLosesTrust', label: 'Betty Loses Trust', initial: 0 },
			{ id: 'managementEscalates', label: 'Management Escalates', initial: 0 },
		],
	},

	backlashRules: [
		{
			id: 'celia_backlash_rule',
			sceneId: 'backlash_celia',
			requirements: {
				barsMin: {
					celiaFindsOut: 100,
				},
			},
			effects: {
				flags: {
					celiaHasFullEmail: true,
				},
				signal: 'Celia has the full message now. That is not a vibe. That is evidence.',
			},
		},
		{
			id: 'tim_backlash_rule',
			sceneId: 'backlash_tim',
			requirements: {
				barsMin: {
					timSuspectsYou: 75,
				},
			},
			effects: {
				flags: {
					timConfrontedYou: true,
				},
				signal: 'Tim has stopped asking broad questions. He is asking precise ones now.',
			},
		},
		{
			id: 'frank_backlash_rule',
			sceneId: 'backlash_frank',
			requirements: {
				barsMin: {
					frankRetaliates: 75,
					frameFrank: 50,
				},
			},
			effects: {
				flags: {
					frankKnowsHeIsTargeted: true,
				},
				signal: 'Frank can feel the room turning. He is looking for the hand on the wheel.',
			},
		},
		{
			id: 'betty_backlash_rule',
			sceneId: 'backlash_betty',
			requirements: {
				barsMin: {
					bettyLosesTrust: 75,
				},
			},
			effects: {
				flags: {
					bettyConfrontedYou: true,
				},
				signal: 'Betty is not confused anymore. That is bad, because confused Betty was useful.',
			},
		},
		{
			id: 'management_backlash_rule',
			sceneId: 'backlash_lisa',
			requirements: {
				barsMin: {
					managementEscalates: 75,
				},
			},
			effects: {
				flags: {
					lisaIsDocumenting: true,
				},
				signal: 'Lisa has started documenting. The word “process” has entered the chat.',
			},
		},
	],

	scenes: {
		hub: {
			id: 'hub',
			location: 'Open Office Floor',
			kicker: 'Choose Your Next Move',
			title: 'The bad email was about Celia.',
			body: [
				'You sent a damaging gossip email about Celia. The recall only partly worked.',
				'Some people may have seen the whole thing. Some may have seen fragments. Some only know that something ugly happened, which is sometimes worse because imagination gets overtime pay.',
				'Betty keeps glancing up. Tim is doing quiet math with his face. Frank is somewhere between annoyed and unaware. Celia has not looked at you yet. Devon is probably already narrating this to someone.',
			],
			internalThought: ( state ) => {
				const thoughts = [];

				if ( state.bars.frameFrank >= 50 ) {
					thoughts.push( 'The Frank story has shape now. One more strong push could make people start interpreting his normal behavior as suspicious.' );
				} else {
					thoughts.push( 'Frank is available as a target, but nobody has enough reason to look at him yet.' );
				}

				if ( state.bars.warmBetty >= 50 ) {
					thoughts.push( 'Betty might help you, but only if she still believes you are scared instead of strategic.' );
				}

				if ( state.flags.knowsBettyWatchesKitchen ) {
					thoughts.push( 'Betty notices office traffic. That makes her useful as a witness and dangerous as a witness.' );
				}

				if ( state.flags.timHasNotes ) {
					thoughts.push( 'Tim has meeting notes. That means his threat is no longer just memory; it has bullet points.' );
				}

				if ( state.bars.timSuspectsYou >= 50 ) {
					thoughts.push( 'Tim is getting close to the timeline. Every sloppy sentence now has teeth.' );
				}

				if ( state.bars.celiaFindsOut >= 50 ) {
					thoughts.push( 'Celia is closer to the full shape of the insult. If she gets the exact message, the room changes.' );
				}

				if ( state.flags.knowsManagementPressure ) {
					thoughts.push( 'Lisa knows the all-hands may turn formal. That makes every social move feel a little more like evidence.' );
				}

				return thoughts;
			},
			choices: [
				{
					id: 'go_betty',
					text: 'Go to Betty’s desk.',
					category: 'move',
					advanceTurn: false,
					nextScene: 'betty_desk',
				},
				{
					id: 'go_tim',
					text: 'Go to Tim’s desk.',
					category: 'move',
					advanceTurn: false,
					nextScene: 'tim_desk',
				},
				{
					id: 'go_frank',
					text: 'Check Frank’s desk.',
					category: 'move',
					advanceTurn: false,
					nextScene: 'frank_desk',
				},
				{
					id: 'go_celia',
					text: 'Go near Celia’s area.',
					category: 'move',
					advanceTurn: false,
					nextScene: 'celia_area',
				},
				{
					id: 'go_break_room',
					text: 'Go to the break room.',
					category: 'move',
					advanceTurn: false,
					nextScene: 'break_room',
				},
				{
					id: 'go_lisa',
					text: 'Check in with Lisa.',
					category: 'move',
					advanceTurn: false,
					nextScene: 'lisa_area',
				},
				{
					id: 'go_bathroom',
					text: 'Pass by the bathroom hallway.',
					category: 'move',
					advanceTurn: false,
					nextScene: 'bathroom_hallway',
				},
			],
		},

		betty_desk: {
			id: 'betty_desk',
			location: 'Betty’s Desk',
			title: 'Betty is watching the room more than her screen.',
			body: [
				'Betty has the posture of someone trying not to look involved. That usually means she is involved emotionally, which is almost as useful as being involved factually.',
				'Her desk gives her a clean view of the kitchen, the printer, and most of the people pretending not to panic.',
			],
			internalThought: [
				'If you seem scared, Betty may soften. If you mention Frank, she may start watching him. If you ask what she saw, you may learn office movement patterns. If you push too hard, she may realize you are recruiting her.',
			],
			choices: [
				{
					id: 'betty_feel_awful',
					text: 'Tell Betty you feel awful and do not know what to do.',
					category: 'positive',
					once: true,
					resultText: 'Betty studies your face. She does not forgive you. But she does not leave either.',
					effects: {
						bars: {
							warmBetty: 25,
						},
						flags: {
							bettyHeardRemorse: true,
						},
						unlocks: [
							'betty_give_small_truth',
						],
						signal: 'Betty sees panic. Panic is not innocence, but it is better than calculation.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_give_small_truth',
					text: 'Give Betty one small truth so the bigger lie has somewhere to hide.',
					category: 'positive',
					once: true,
					requirements: {
						usedChoicesAll: [
							'betty_feel_awful',
						],
						barsMax: {
							bettyLosesTrust: 50,
						},
					},
					resultText: 'Betty listens because the truth sounds expensive. You give her just enough of it to buy credibility.',
					effects: {
						bars: {
							warmBetty: 25,
							celiaFindsOut: 25,
						},
						flags: {
							bettyHeardSmallTruth: true,
						},
						signal: 'Betty trusts you more, but the truth is now closer to Celia.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_ask_advice',
					text: 'Ask Betty what the right thing to do is, without asking her to fix it.',
					category: 'positive',
					once: true,
					requirements: {
						usedChoicesAll: [
							'betty_feel_awful',
						],
						barsMax: {
							bettyLosesTrust: 50,
						},
					},
					resultText: 'Betty gives advice instead of an escape route. Annoying. Also useful. Also probably healthier, which feels off-brand for today.',
					effects: {
						bars: {
							warmBetty: 25,
							containCelia: 25,
						},
						flags: {
							bettyGaveAdvice: true,
						},
						signal: 'Betty thinks you may still choose the decent route. Dangerous misunderstanding, potentially useful.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_discover_kitchen_watch',
					text: 'Ask whether she saw anyone go into the kitchen or break room.',
					category: 'info',
					once: true,
					resultText: 'Betty says Tim was near the fridge earlier, but Devon was hovering too. Betty notices more traffic than she admits.',
					effects: {
						flags: {
							knowsBettyWatchesKitchen: true,
							bettyNoticesOfficeMovement: true,
						},
						unlocks: [
							'betty_ask_who_moved_where',
							'create_tim_lunch_confusion',
						],
						signal: 'Betty watches office traffic. That makes her a witness, which is useful until it is not.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_ask_who_moved_where',
					text: 'Ask Betty who moved around after the email recall failed.',
					category: 'info',
					once: true,
					requirements: {
						flagsAll: [
							'knowsBettyWatchesKitchen',
						],
					},
					resultText: 'Betty remembers Frank leaving his desk and Devon drifting toward the break room. She says it casually, which is how useful facts sneak in.',
					effects: {
						flags: {
							bettySawFrankAway: true,
							sawFrankDeskEmpty: true,
						},
						bars: {
							frameFrank: 25,
						},
						unlocks: [
							'tim_mention_frank_away',
						],
						signal: 'Betty saw Frank away from his desk. The Frank story has a location now.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_ask_frank_strange',
					text: 'Ask Betty if Frank has seemed strange today.',
					category: 'underhanded',
					once: true,
					resultText: 'Betty frowns. Not because she believes you. Because now she has a shape to put her worry into.',
					effects: {
						bars: {
							frameFrank: 25,
							frankRetaliates: 25,
						},
						flags: {
							bettyHeardFrankSuspicion: true,
							knowsFrankUnderPressure: true,
						},
						unlocks: [
							'tim_mention_frank_away',
							'devon_frank_pressure',
						],
						signal: 'Frank has entered Betty’s mental suspect board. Tiny corkboard. Big problem.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_ask_tim_knows',
					text: 'Ask Betty whether Tim has been asking questions.',
					category: 'info',
					once: true,
					resultText: 'Betty lowers her voice. Tim asked who saw the email before the recall finished.',
					effects: {
						bars: {
							distractTim: 25,
						},
						flags: {
							knowsTimInvestigating: true,
						},
						unlocks: [
							'ask_tim_recall_logs',
						],
						signal: 'Tim is building the timeline. That is his whole terrible little hobby now.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_ask_tim_lunch',
					text: 'Ask why Tim labels his lunch like it contains state secrets.',
					category: 'info',
					once: true,
					requirements: {
						flagsNone: [
							'knowsTimFoodVulnerability',
						],
					},
					resultText: 'Betty says Tim is careful about food because one wrong lunch turns him into a workplace evacuation drill.',
					effects: {
						bars: {
							sidelineTim: 25,
						},
						flags: {
							knowsTimFoodVulnerability: true,
							knowsTimLunchRoutine: true,
							show_sidelineTim: true,
						},
						unlocks: [
							'create_tim_lunch_confusion',
						],
						signal: 'You learned Tim has a lunch vulnerability. The goblin door has opened.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_missing_items_seed',
					text: 'Mention that small office things keep disappearing lately.',
					category: 'underhanded',
					once: true,
					requirements: {
						phaseMin: 'narrative_building',
					},
					resultText: 'Betty blinks like she is trying to remember whether she borrowed something. Useful. Ugly, but useful.',
					effects: {
						bars: {
							bettyKlepto: 25,
							bettyLosesTrust: 25,
						},
						flags: {
							show_bettyKlepto: true,
						},
						signal: 'The Betty-takes-things story has a pulse. Congratulations, gremlin.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_cleanup_frank',
					text: 'Walk back the Frank comment before Betty repeats it.',
					category: 'cleanup',
					once: true,
					requirements: {
						barsMin: {
							frameFrank: 25,
						},
					},
					resultText: 'You soften the Frank angle. Betty relaxes a fraction. The Frank route loses heat.',
					effects: {
						bars: {
							frameFrank: -25,
							frankRetaliates: -25,
							bettyLosesTrust: -25,
						},
						signal: 'You lowered the Frank temperature. Boring, responsible, annoyingly useful.',
					},
					nextScene: 'hub',
				},
				{
					id: 'betty_commit_defend',
					text: 'Ask Betty to speak up for you at the all-hands.',
					category: 'commitment',
					once: true,
					requirements: {
						phaseMin: 'pressure_rising',
						barsMin: {
							warmBetty: 75,
						},
						barsMax: {
							bettyLosesTrust: 50,
						},
					},
					resultText: 'Betty hates that you asked. She hates more that she is considering it.',
					effects: {
						bars: {
							warmBetty: 25,
						},
						flags: {
							bettyWillDefend: true,
						},
						signal: 'Betty may defend you. Try not to visibly become worse as a person.',
					},
					nextScene: 'hub',
				},
			],
		},

		tim_desk: {
			id: 'tim_desk',
			location: 'Tim’s Desk',
			title: 'Tim has the expression of a man assembling a timeline.',
			body: [
				'Tim does not look angry. That is worse. Angry people react. Tim collects.',
				'His screen has three windows open. None of them look fun. A lunch bag with his name written in aggressive block letters sits beside his monitor.',
			],
			internalThought: [
				'If you send Tim toward the wrong technical question, you may buy time. If you learn his routines, you may unlock worse options. But every question you ask tells him what you are afraid of.',
			],
			choices: [
				{
					id: 'tim_notice_labeled_lunch',
					text: 'Notice the carefully labeled lunch bag beside Tim’s monitor.',
					category: 'info',
					once: true,
					resultText: 'The label is too careful to be normal. Tim has built a tiny food perimeter around his day.',
					effects: {
						flags: {
							sawTimLabeledFood: true,
							knowsTimLunchRoutine: true,
						},
						unlocks: [
							'betty_ask_tim_lunch',
						],
						signal: 'Tim’s lunch routine looks weirdly important. Weirdly important things are doors with snacks on them.',
					},
					nextScene: 'hub',
				},
				{
					id: 'tim_small_talk_meeting_prep',
					text: 'Make boring small talk about Tim’s meeting prep.',
					category: 'info',
					once: true,
					resultText: 'Tim says he barely had time to prep, then taps a notebook with one finger. The notebook looks organized enough to hurt you.',
					effects: {
						flags: {
							timHasNotes: true,
							timChecksRecallLogs: true,
						},
						unlocks: [
							'tim_distract_from_notes',
						],
						signal: 'Tim has notes and is checking recall details. Paper is now an enemy faction.',
					},
					nextScene: 'hub',
				},
				{
					id: 'ask_tim_recall_logs',
					text: 'Ask Tim whether email recall logs are reliable.',
					category: 'info',
					once: true,
					resultText: 'Tim says recall is not magic. Then he looks at you like he wishes it were, because magic would be easier to audit.',
					effects: {
						bars: {
							blameSystem: 25,
							distractTim: 25,
							timSuspectsYou: 25,
						},
						flags: {
							knowsRecallLogsMatter: true,
							timChecksRecallLogs: true,
						},
						signal: 'The system-blame route is alive, but Tim noticed where you pointed.',
					},
					nextScene: 'hub',
				},
				{
					id: 'tim_mention_frank_away',
					text: 'Mention that Frank was away from his desk around the wrong time.',
					category: 'underhanded',
					once: true,
					requirements: {
						barsMin: {
							frameFrank: 25,
						},
					},
					resultText: 'Tim writes nothing down. Somehow that is more threatening than writing it down.',
					effects: {
						bars: {
							frameFrank: 25,
							distractTim: 25,
							timSuspectsYou: 25,
						},
						flags: {
							timCheckingFrank: true,
						},
						unlocks: [
							'plant_bottle_frank',
						],
						signal: 'Tim is checking Frank now. He is also checking you. Multitasking: the enemy.',
					},
					nextScene: 'hub',
				},
				{
					id: 'tim_distract_from_notes',
					text: 'Ask a technical question that pulls Tim away from his meeting notes.',
					category: 'underhanded',
					once: true,
					requirements: {
						flagsAll: [
							'timHasNotes',
						],
					},
					resultText: 'Tim opens another window. The notes stay on his desk, but his attention splits. Split attention is not safety. It is a coupon for time.',
					effects: {
						bars: {
							distractTim: 25,
							timSuspectsYou: 25,
						},
						flags: {
							timNotesDistracted: true,
						},
						signal: 'Tim’s notes lost some momentum. Tim did not.',
					},
					nextScene: 'hub',
				},
				{
					id: 'tim_give_boring_truth',
					text: 'Give Tim one boring true detail about the recall.',
					category: 'cleanup',
					once: true,
					requirements: {
						barsMin: {
							timSuspectsYou: 25,
						},
					},
					resultText: 'Tim accepts the detail because boring truths have a smell. Unfortunately, he likes smells.',
					effects: {
						bars: {
							timSuspectsYou: -25,
							distractTim: -25,
							blameSystem: 25,
						},
						signal: 'You gave Tim something true enough to slow him down, but the false trail lost some fog.',
					},
					nextScene: 'hub',
				},
				{
					id: 'tim_nudge_lunch',
					text: 'Nudge Tim toward eating before the all-hands.',
					category: 'commitment',
					once: true,
					requirements: {
						phaseMin: 'final_setup',
						flagsAll: [
							'knowsTimFoodVulnerability',
							'timLunchCompromised',
							'bathroomSuppliesMissing',
						],
						barsMin: {
							sidelineTim: 75,
						},
					},
					resultText: 'Tim checks the clock, checks his lunch, and makes a decision his digestive system will file an appeal against.',
					effects: {
						bars: {
							sidelineTim: 25,
							timSuspectsYou: 25,
							managementEscalates: 25,
						},
						npc: {
							timMissesMeeting: true,
						},
						signal: 'Tim may miss the meeting. The ethics committee would like a word, but it is currently unavailable.',
					},
					nextScene: 'hub',
				},
			],
		},

		frank_desk: {
			id: 'frank_desk',
			location: 'Frank’s Desk',
			title: 'Frank’s desk is empty.',
			body: [
				'The chair is pushed in. His mug is still here. His desk has the private dullness of someone who never expected to become a plot device.',
				'The empty desk matters only if someone later has a reason to care that it was empty.',
			],
			internalThought: [
				'If the bottle appears after people are already suspicious, it becomes evidence. If it appears before that, it becomes a mystery. Mysteries invite Tim. Tim is bad.',
			],
			choices: [
				{
					id: 'frank_watch_desk',
					text: 'Watch the desk long enough to confirm Frank is away.',
					category: 'info',
					once: true,
					resultText: 'Frank does not come back. Opportunity arrives wearing cheap office carpet.',
					effects: {
						npc: {
							frankAwayFromDesk: true,
						},
						flags: {
							frankAwayFromDesk: true,
							confirmedFrankAway: true,
							sawFrankDeskEmpty: true,
						},
						unlocks: [
							'plant_bottle_frank',
						],
						signal: 'Frank is away from his desk. That opens doors you probably should not walk through.',
					},
					nextScene: 'hub',
				},
				{
					id: 'frank_notice_bag',
					text: 'Notice Frank left his bag half-open beside the desk.',
					category: 'info',
					once: true,
					requirements: {
						flagsAll: [
							'sawFrankDeskEmpty',
						],
					},
					resultText: 'The bag is not evidence. It is an invitation to become the kind of person who calls opportunity evidence.',
					effects: {
						flags: {
							frankLeftBagOut: true,
						},
						bars: {
							frameFrank: 25,
							frankRetaliates: 25,
						},
						signal: 'Frank left something unattended. The Frank route gained texture and risk.',
					},
					nextScene: 'hub',
				},
				{
					id: 'plant_bottle_frank',
					text: 'Plant the bottle in Frank’s drawer.',
					category: 'commitment',
					requirements: {
						phaseMin: 'narrative_building',
						barsMin: {
							frameFrank: 50,
						},
						flagsAll: [
							'confirmedFrankAway',
							'sawFrankDeskEmpty',
						],
						npc: {
							frankAwayFromDesk: true,
						},
						usedChoicesNone: [
							'frank_ask_for_help',
						],
					},
					once: true,
					resultText: 'The bottle fits too easily. A good lie should resist a little. This one slides into place like the drawer was waiting for it.',
					effects: {
						bars: {
							frameFrank: 25,
							frankRetaliates: 25,
							managementEscalates: 25,
						},
						flags: {
							bottlePlantedFrank: true,
						},
						unlocks: [
							'tell_tim_about_franks_desk',
							'devon_discover_bottle',
						],
						locks: [
							'frank_ask_for_help',
						],
						signal: 'The bottle is planted. The Frank story now has physical teeth.',
					},
					nextScene: 'hub',
				},
				{
					id: 'frank_ask_for_help',
					text: 'Find Frank and ask what he has heard.',
					category: 'positive',
					once: true,
					requirements: {
						usedChoicesNone: [
							'plant_bottle_frank',
						],
					},
					resultText: 'Frank is irritated, but not hostile. That helps. It also steals oxygen from the version of the story where Frank is your perfect scapegoat.',
					effects: {
						bars: {
							frankRetaliates: -25,
							timSuspectsYou: -25,
							frameFrank: -25,
						},
						flags: {
							frankTalkedHonestly: true,
						},
						locks: [
							'plant_bottle_frank',
						],
						signal: 'You cooled Frank down, but the Frank-frame story weakened. No free lunch, office goblin.',
					},
					nextScene: 'hub',
				},
				{
					id: 'frank_keep_close',
					text: 'Keep Frank friendly while his name keeps circulating.',
					category: 'cleanup',
					once: true,
					requirements: {
						usedChoicesAll: [
							'frank_ask_for_help',
						],
						barsMin: {
							frameFrank: 25,
						},
						usedChoicesNone: [
							'plant_bottle_frank',
						],
					},
					resultText: 'Frank accepts the friendly tone. Tim may not. There is something suspicious about standing beside a fire while holding a cup of water and a book of matches.',
					effects: {
						bars: {
							frankRetaliates: -25,
							frameFrank: -25,
							timSuspectsYou: 25,
						},
						signal: 'Frank cools down, but Tim notices the shape of the contradiction.',
					},
					nextScene: 'hub',
				},
				{
					id: 'frank_walk_away',
					text: 'Walk away and seed suspicion elsewhere first.',
					category: 'neutral',
					once: true,
					resultText: 'You leave the desk untouched. For once, restraint does not make a dramatic sound.',
					effects: {
						signal: 'You backed away from Frank’s desk. The opportunity remains, for better or worse.',
					},
					nextScene: 'hub',
				},
			],
		},

		break_room: {
			id: 'break_room',
			location: 'Break Room',
			title: 'The break room is where facts go to get microwaved.',
			body: [
				'Devon is here, stirring coffee like he is auditioning for the role of Person Who Knows Too Much.',
				'The fridge hums with the dead-eyed neutrality of an appliance that has seen crimes.',
			],
			internalThought: [
				'Anything you say near Devon may travel. That is dangerous. That is also useful. Office gossip: nature’s cursed delivery network.',
			],
			choices: [
				{
					id: 'devon_ask_who_saw',
					text: 'Ask Devon who has seen the email.',
					category: 'info',
					once: true,
					resultText: 'Devon smiles too quickly. He has seen enough to be useful and enough to be a problem.',
					effects: {
						bars: {
							devonLeak: 25,
							celiaFindsOut: 25,
						},
						flags: {
							knowsDevonSawEmail: true,
							show_devonLeak: true,
						},
						signal: 'Devon has part of the email. Parts become stories. Stories become fires.',
					},
					nextScene: 'hub',
				},
				{
					id: 'devon_saw_or_heard',
					text: 'Ask whether Devon actually saw the email or only heard about it.',
					category: 'info',
					once: true,
					resultText: 'Devon saw a fragment and heard the rest from someone else. That is not truth. That is rumor starter dough.',
					effects: {
						bars: {
							devonLeak: 25,
						},
						flags: {
							devonHasPartialVersion: true,
							devonCanCarryFalseDetail: true,
							devonCanSupportSystemConfusion: true,
							show_devonLeak: true,
						},
						unlocks: [
							'devon_false_detail',
							'celia_people_exaggerating',
						],
						signal: 'Devon has a partial version. Partial versions are where lies rent office space.',
					},
					nextScene: 'hub',
				},
				{
					id: 'devon_watch_after_leaving',
					text: 'Watch who Devon talks to after leaving the break room.',
					category: 'info',
					once: true,
					requirements: {
						barsMin: {
							devonLeak: 25,
						},
					},
					resultText: 'Devon drifts toward Celia’s side of the office. He moves like a man carrying a lit match and calling it news.',
					effects: {
						bars: {
							celiaFindsOut: 25,
						},
						flags: {
							devonMayReachCelia: true,
						},
						signal: 'Devon may reach Celia. Rumor now has legs and terrible shoes.',
					},
					nextScene: 'hub',
				},
				{
					id: 'devon_frank_pressure',
					text: 'Quietly mention that Frank has been under pressure lately.',
					category: 'underhanded',
					once: true,
					requirements: {
						barsMin: {
							frameFrank: 25,
						},
					},
					resultText: 'Devon does not promise to repeat it. Which is how Devon promises to repeat it.',
					effects: {
						bars: {
							frameFrank: 25,
							devonLeak: 25,
							frankRetaliates: 25,
						},
						signal: 'Devon now carries the Frank story. Handle with tongs.',
					},
					nextScene: 'hub',
				},
				{
					id: 'create_tim_lunch_confusion',
					text: 'Create confusion around Tim’s carefully labeled lunch.',
					category: 'underhanded',
					requirements: {
						phaseMin: 'narrative_building',
						flagsAll: [
							'knowsTimFoodVulnerability',
						],
					},
					once: true,
					resultText: 'The fridge becomes a small bureaucratic disaster. Tim’s lunch situation is no longer clean.',
					effects: {
						bars: {
							sidelineTim: 25,
							timSuspectsYou: 25,
						},
						npc: {
							timLunchCompromised: true,
						},
						flags: {
							timLunchCompromised: true,
						},
						unlocks: [
							'remove_bathroom_supplies',
						],
						signal: 'Tim’s lunch is compromised. This is exactly as classy as it sounds.',
					},
					nextScene: 'hub',
				},
				{
					id: 'devon_false_detail',
					text: 'Feed Devon one controlled false detail and see where it appears.',
					category: 'underhanded',
					once: true,
					requirements: {
						flagsAll: [
							'devonCanCarryFalseDetail',
						],
					},
					resultText: 'Devon accepts the detail with the solemnity of a man receiving a cursed heirloom.',
					effects: {
						bars: {
							devonLeak: 25,
							distractTim: 25,
							timSuspectsYou: 25,
						},
						flags: {
							devonHasFalseDetail: true,
							show_devonLeak: true,
						},
						signal: 'Devon is now a rumor test. Unfortunately, the test is also airborne.',
					},
					nextScene: 'hub',
				},
				{
					id: 'devon_contain_rumor',
					text: 'Give Devon a boring version to slow the rumor down.',
					category: 'cleanup',
					once: true,
					requirements: {
						barsMin: {
							devonLeak: 25,
						},
					},
					resultText: 'Devon hates the boring version, which is how you know it might work. The rumor loses flavor, not velocity.',
					effects: {
						bars: {
							devonLeak: -25,
							celiaFindsOut: -25,
							blameSystem: 25,
						},
						signal: 'You bored Devon on purpose. A dark art, but a useful one.',
					},
					nextScene: 'hub',
				},
				{
					id: 'devon_spread_final_frank',
					text: 'Use Devon to push the final Frank rumor.',
					category: 'commitment',
					requirements: {
						phaseMin: 'pressure_rising',
						barsMin: {
							frameFrank: 75,
							devonLeak: 25,
						},
					},
					once: true,
					resultText: 'Devon walks away with a version of the story that has your fingerprints and his volume.',
					effects: {
						bars: {
							frameFrank: 25,
							devonLeak: 25,
							frankRetaliates: 25,
							managementEscalates: 25,
						},
						signal: 'The Frank story is now traveling without supervision. Bold. Horrifying.',
					},
					nextScene: 'hub',
				},
			],
		},

		celia_area: {
			id: 'celia_area',
			location: 'Celia’s Area',
			title: 'Celia has not looked at you yet.',
			body: [
				'That could mean she does not know. It could also mean she knows exactly enough.',
				'Her monitor glows. Her hands are still. The silence around her feels like a meeting invite you cannot decline.',
			],
			internalThought: [
				'Celia is the subject of the email. If you talk now, you may control the first version she hears. If you wait, someone else gets there first.',
			],
			choices: [
				{
					id: 'celia_watch_email',
					text: 'Watch whether Celia has opened the thread yet.',
					category: 'info',
					once: true,
					resultText: 'Celia keeps looking at her inbox but has not opened the thread. She has fragments, not the full blade.',
					effects: {
						flags: {
							knowsCeliaHasNotSeenFullEmail: true,
							celiaHeardFragments: true,
						},
						bars: {
							containCelia: 25,
						},
						unlocks: [
							'celia_people_exaggerating',
							'celia_direct_apology',
						],
						signal: 'Celia has fragments, not the full message. The window is small and already closing.',
					},
					nextScene: 'hub',
				},
				{
					id: 'celia_apologize_vague',
					text: 'Apologize before she asks, but keep it vague.',
					category: 'positive',
					once: true,
					resultText: 'Celia hears the apology. She also hears the empty spaces inside it.',
					effects: {
						bars: {
							containCelia: 25,
							celiaFindsOut: 25,
						},
						flags: {
							celiaHeardApology: true,
						},
						signal: 'Celia knows there is something to apologize for. That helps and hurts. Classic.',
					},
					nextScene: 'hub',
				},
				{
					id: 'celia_ask_heard_anything',
					text: 'Ask whether she has heard anything weird today.',
					category: 'info',
					once: true,
					resultText: 'Celia says Devon has been weird. That narrows nothing and widens everything.',
					effects: {
						flags: {
							knowsCeliaHasHeardRumor: true,
							celiaHeardFragments: true,
						},
						bars: {
							containCelia: 25,
						},
						signal: 'Celia has heard a rumor, not the full blast. The window is small.',
					},
					nextScene: 'hub',
				},
				{
					id: 'celia_people_exaggerating',
					text: 'Tell Celia people are exaggerating fragments of the email.',
					category: 'underhanded',
					once: true,
					requirements: {
						barsMin: {
							blameSystem: 25,
						},
						flagsAny: [
							'knowsCeliaHasNotSeenFullEmail',
							'celiaHeardFragments',
							'devonHasPartialVersion',
						],
					},
					resultText: 'Celia’s face closes a little. You gave her a reason to doubt the rumor. You also gave her a reason to find the original.',
					effects: {
						bars: {
							containCelia: 25,
							celiaDramatic: 25,
							celiaFindsOut: 25,
							timSuspectsYou: 25,
						},
						flags: {
							show_celiaDramatic: true,
						},
						signal: 'You pushed the fragment story. If the full email appears, this gets ugly fast.',
					},
					nextScene: 'hub',
				},
				{
					id: 'celia_give_space',
					text: 'Give Celia space and do not make yourself the center.',
					category: 'neutral',
					once: true,
					resultText: 'You leave her alone. It feels mature, which is inconvenient because maturity does not always win meetings.',
					effects: {
						bars: {
							containCelia: 25,
						},
						signal: 'You did not make Celia worse. That counts as progress in this cursed terrarium.',
					},
					nextScene: 'hub',
				},
				{
					id: 'celia_direct_apology',
					text: 'Apologize directly enough that she knows you are not hiding behind fragments.',
					category: 'commitment',
					once: true,
					requirements: {
						phaseMin: 'pressure_rising',
						barsMin: {
							containCelia: 50,
						},
					},
					resultText: 'Celia does not forgive you. But she stops watching you like you are still trying to sell her a smaller wound.',
					effects: {
						bars: {
							containCelia: 25,
							celiaFindsOut: 25,
							bettyLosesTrust: -25,
						},
						flags: {
							celiaHeardDirectApology: true,
						},
						signal: 'Direct apology stabilized Celia slightly. It also put more truth in the room.',
					},
					nextScene: 'hub',
				},
			],
		},

		lisa_area: {
			id: 'lisa_area',
			location: 'Lisa’s Area',
			title: 'Lisa is already using the word “process.”',
			body: [
				'Lisa has a notebook open. Not a cute notebook. A notebook that will survive discovery.',
				'Her calendar is open to the all-hands invite. The title has not changed, but the room around it has.',
			],
			internalThought: [
				'Lisa can make this official. You can cooperate, redirect her, or turn her into the reason this became bigger than it needed to be.',
			],
			choices: [
				{
					id: 'lisa_ask_agenda',
					text: 'Ask why the all-hands invite changed.',
					category: 'info',
					once: true,
					resultText: 'Lisa says leadership wants to address communication norms. Congratulations, you have become a norm.',
					effects: {
						bars: {
							managementEscalates: 25,
						},
						flags: {
							knowsLisaTalkedToManagement: true,
							knowsAllHandsAgendaShifted: true,
							knowsManagementPressure: true,
						},
						unlocks: [
							'lisa_overreacting_seed',
							'lisa_push_system_failure',
						],
						signal: 'Management is aware enough to be dangerous.',
					},
					nextScene: 'hub',
				},
				{
					id: 'lisa_process_explanation',
					text: 'Give Lisa a boring process-focused explanation.',
					category: 'cleanup',
					once: true,
					requirements: {
						barsMin: {
							managementEscalates: 25,
						},
					},
					resultText: 'Lisa writes less than you feared. Less is not nothing, but it is less.',
					effects: {
						bars: {
							managementEscalates: -25,
							blameSystem: -25,
						},
						flags: {
							lisaCanDelayEscalation: true,
						},
						signal: 'You lowered formal risk by becoming boring, but the system-blame route lost leverage.',
					},
					nextScene: 'hub',
				},
				{
					id: 'lisa_overreacting_seed',
					text: 'Suggest Lisa may be making this bigger than it needs to be.',
					category: 'underhanded',
					once: true,
					requirements: {
						phaseMin: 'narrative_building',
						flagsAny: [
							'knowsAllHandsAgendaShifted',
							'knowsManagementPressure',
						],
					},
					resultText: 'The idea lands nearby, not directly. That is usually how cowardly useful ideas land.',
					effects: {
						bars: {
							lisaOverreacting: 25,
							managementEscalates: 25,
							timSuspectsYou: 25,
						},
						flags: {
							show_lisaOverreacting: true,
						},
						signal: 'Lisa can now be blamed for escalation. Lisa will not love that journey.',
					},
					nextScene: 'hub',
				},
				{
					id: 'lisa_push_system_failure',
					text: 'Push the system-failure angle through Lisa.',
					category: 'commitment',
					once: true,
					requirements: {
						phaseMin: 'pressure_rising',
						flagsAll: [
							'knowsAllHandsAgendaShifted',
							'knowsManagementPressure',
						],
						barsMin: {
							blameSystem: 50,
						},
					},
					resultText: 'Lisa hears “system issue” and starts building a process-shaped container around your personal disaster.',
					effects: {
						bars: {
							blameSystem: 25,
							managementEscalates: 25,
						},
						flags: {
							systemAngleWithLisa: true,
						},
						signal: 'The system route is stronger. So is the chance this becomes formal. Tiny tradeoff. Huge paperwork.',
					},
					nextScene: 'hub',
				},
			],
		},

		bathroom_hallway: {
			id: 'bathroom_hallway',
			location: 'Bathroom Hallway',
			title: 'The bathroom hallway is quiet in a way that feels legally inadvisable.',
			body: [
				'The supply cabinet is slightly open. The bathroom door swings shut with a soft institutional click.',
			],
			internalThought: [
				'This is where petty office strategy starts smelling like actual misconduct. Useful? Maybe. Gross? Absolutely.',
			],
			choices: [
				{
					id: 'bathroom_check_supplies',
					text: 'Check whether the bathroom supplies are stocked.',
					category: 'info',
					once: true,
					resultText: 'Everything is stocked. For now. The phrase “for now” should probably concern you.',
					effects: {
						flags: {
							bathroomSuppliesKnown: true,
						},
						signal: 'Bathroom supplies are available. This knowledge is cursed.',
					},
					nextScene: 'hub',
				},
				{
					id: 'remove_bathroom_supplies',
					text: 'Remove the bathroom backup supplies before Tim eats.',
					category: 'underhanded',
					requirements: {
						phaseMin: 'narrative_building',
						flagsAll: [
							'knowsTimFoodVulnerability',
							'timLunchCompromised',
						],
					},
					once: true,
					resultText: 'The hallway remains quiet. That makes it worse. Quiet hallways are where consequences take notes.',
					effects: {
						bars: {
							sidelineTim: 25,
							managementEscalates: 25,
							bettyKlepto: 25,
						},
						flags: {
							bathroomSuppliesMissing: true,
							show_bettyKlepto: true,
						},
						unlocks: [
							'blame_betty_supplies',
							'tim_nudge_lunch',
						],
						signal: 'Bathroom supplies are missing. Tim’s future has narrowed.',
					},
					nextScene: 'hub',
				},
				{
					id: 'blame_betty_supplies',
					text: 'Let the missing supplies point toward Betty’s “borrowing” habit.',
					category: 'underhanded',
					once: true,
					requirements: {
						flagsAll: [
							'bathroomSuppliesMissing',
						],
						barsMin: {
							bettyKlepto: 50,
						},
					},
					resultText: 'The missing supplies now have a possible author. It is not a good author, but it is not you.',
					effects: {
						bars: {
							bettyKlepto: 25,
							bettyLosesTrust: 25,
							managementEscalates: 25,
						},
						signal: 'Betty can now be tied to missing supplies. This is layered awful. Structurally sound, morally condemned.',
					},
					nextScene: 'hub',
				},
				{
					id: 'bathroom_walk_away',
					text: 'Walk away and do not become the bathroom villain.',
					category: 'neutral',
					once: true,
					resultText: 'You walk away. Somewhere, a tiny remaining adult inside you gives a weak thumbs-up.',
					effects: {
						signal: 'You avoided the bathroom scheme. A rare win for basic decency.',
					},
					nextScene: 'hub',
				},
			],
		},

		backlash_tim: {
			id: 'backlash_tim',
			location: 'Backlash',
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
		},

		backlash_frank: {
			id: 'backlash_frank',
			location: 'Backlash',
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
		},

		backlash_betty: {
			id: 'backlash_betty',
			location: 'Backlash',
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
		},

		backlash_celia: {
			id: 'backlash_celia',
			location: 'Backlash',
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
		},

		backlash_lisa: {
			id: 'backlash_lisa',
			location: 'Backlash',
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
		},

		final_all_hands: {
			id: 'final_all_hands',
			location: 'All-Hands',
			kicker: 'Finale',
			title: 'The all-hands begins.',
			body: [
				'This fallback text should be replaced by the finale resolver.',
			],
			choices: [],
		},
	},

	resolveFinale( state ) {
		const b = state.bars;
		const body = [];

		let title = 'The room decides what story survived.';

		if ( b.managementEscalates >= 100 ) {
			title = 'This is not just office drama anymore.';
			body.push( 'Lisa has enough structure around the incident that leadership treats it as formal. The room still talks, but the paperwork talks louder.' );
		} else if ( b.frameFrank >= 100 && b.frankRetaliates < 100 ) {
			title = 'Frank becomes the story.';
			body.push( 'By the time the meeting starts, Frank is no longer just Frank. He is a theory people can point at.' );
		} else if ( b.warmBetty >= 100 && b.bettyLosesTrust <= 50 ) {
			title = 'Betty speaks before the room hardens.';
			body.push( 'Betty does not excuse the email. She does something more useful: she makes you sound human before Tim can make you sound procedural.' );
		} else if ( b.timSuspectsYou >= 100 && ! state.npc.timMissesMeeting ) {
			title = 'Tim brings the timeline.';
			body.push( 'Tim does not raise his voice. He does not have to. He places the timeline in the room and lets it do what timelines do.' );
		} else {
			title = 'You survive the opening impact.';
			body.push( 'The meeting begins messy. That helps. Clean rooms are where clean accusations win.' );
		}

		if ( state.npc.timMissesMeeting || b.sidelineTim >= 100 ) {
			body.push( 'Tim misses the most important stretch of the meeting. His absence creates space where facts should have been. You use that space because of course you do.' );
		} else if ( b.distractTim >= 75 ) {
			body.push( 'Tim has facts, but the facts point in too many directions. He suspects you, but suspicion is not the same as a clean public kill shot.' );
		} else if ( b.timSuspectsYou >= 75 ) {
			body.push( 'Tim watches you during the meeting instead of the speaker. That is not great. That is the opposite of great wearing business casual.' );
		}

		if ( state.flags.timHasNotes && b.distractTim < 75 && ! state.npc.timMissesMeeting ) {
			body.push( 'Tim brought notes. That is the problem with procedural people: eventually they become furniture with receipts.' );
		}

		if ( b.frameFrank >= 75 ) {
			body.push( 'Frank takes heat. Maybe not all of it, but enough that your name is not the only name in the room.' );
		}

		if ( b.frankRetaliates >= 100 ) {
			body.push( 'Frank does not go down quietly. He asks why you were the first person to mention his desk. The silence after that has teeth.' );
		} else if ( b.frankRetaliates >= 75 ) {
			body.push( 'Frank knows he was aimed at something. He does not have the whole map, but he has your scent on the paper.' );
		}

		if ( b.warmBetty >= 75 && b.bettyLosesTrust <= 50 ) {
			body.push( 'Betty helps. Not enough to erase what happened, but enough to keep the room from turning you into one clean villain.' );
		} else if ( b.bettyLosesTrust >= 75 ) {
			body.push( 'Betty does not defend you. Worse, she looks like someone who almost did.' );
		}

		if ( state.flags.knowsBettyWatchesKitchen && b.bettyLosesTrust >= 50 ) {
			body.push( 'Betty noticed more movement than you hoped. The office traffic you used as cover may become the map she uses against you.' );
		}

		if ( b.celiaFindsOut >= 100 && b.containCelia < 75 ) {
			body.push( 'Celia has the full message and the room knows she has it. Every soft explanation you built now sounds like packaging around something rotten.' );
		} else if ( b.containCelia >= 75 ) {
			body.push( 'Celia is hurt, but she does not become the center of the room. That is not forgiveness. That is containment.' );
		} else if ( b.celiaFindsOut >= 50 ) {
			body.push( 'Celia knows enough to be dangerous later. The meeting ends, but the consequence does not.' );
		}

		if ( state.flags.devonMayReachCelia && b.devonLeak >= 50 ) {
			body.push( 'Devon carried the story toward Celia before anyone could fully control it. The rumor now has fingerprints from more than one person, which is useful until someone dusts for yours.' );
		}

		if ( b.blameSystem >= 75 ) {
			body.push( 'The system-blame route works enough to dilute the focus. Suddenly people are saying “recall behavior” and “forwarding confusion” instead of only saying your name.' );
		}

		if ( b.bettyKlepto >= 75 ) {
			body.push( 'The Betty-takes-things story creates cover for missing objects, but it leaves a social bruise. If Betty connects the bruise to you, that bruise gets a mouth.' );
		}

		if ( b.devonLeak >= 75 ) {
			body.push( 'Devon becomes part of the explanation for why the story spread. Unfortunately, Devon is also the sort of person who explains explanations.' );
		}

		if ( b.lisaOverreacting >= 75 ) {
			body.push( 'Lisa absorbs some blame for escalation. That helps you socially and hurts you structurally, because Lisa keeps records.' );
		}

		if ( b.celiaDramatic >= 75 && b.celiaFindsOut < 100 ) {
			body.push( 'Some people think Celia may be reacting to fragments. It is ugly. It is useful. Those two facts keep shaking hands.' );
		}

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

		if ( highestGreen >= 100 && highestRed < 100 ) {
			body.push( 'You do not win cleanly, because clean wins are for people who did not send the email. But one story survives strongly enough to carry you out of the room.' );
		} else if ( highestRed >= 100 && highestGreen < 75 ) {
			body.push( 'You had pieces of plans, not a plan. The room notices. Rooms are rude like that.' );
		} else {
			body.push( 'You survive, but the version of you that leaves the meeting is not the same version that entered. That may be strategy. That may be damage. Office life loves a two-for-one.' );
		}

		return {
			kicker: 'All-Hands Finale',
			title,
			body,
			internalThought: [
				'Final board state decides the ending. Strong green bars create survivable stories. High red bars decide who sees through them.',
			],
		};
	},
};