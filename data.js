window.GAME_DATA = {
	map: {
		diner: ["motel", "sheriff_office"],
		motel: ["diner", "radio_tower"],
		sheriff_office: ["diner"],
		radio_tower: ["motel"],
	},

	locations: {
		diner: {
			id: "diner",
			name: "Ash Creek Diner",
			description: "Hot coffee, cold stares, and the kind of silence people use when they have already decided what not to say.",
			npc: "clerk",
			clue: "witness_argument",
		},
		motel: {
			id: "motel",
			name: "Morrow Inn",
			description: "Neon buzzing in the rain, damp carpet underfoot, and a front desk that looks recently disturbed.",
			npc: "drifter",
			clue: "fuel_ledger",
		},
		sheriff_office: {
			id: "sheriff_office",
			name: "Sheriff Office",
			description: "A dim office trying too hard to feel official while the town starts to come apart outside.",
			npc: "deputy",
			clue: null,
		},
		radio_tower: {
			id: "radio_tower",
			name: "Radio Tower",
			description: "The wind hits the tower like a grudge. Metal sings, cables whip, and the machinery looks tampered with.",
			npc: null,
			clue: "tool_marks",
		},
	},

	clues: {
		witness_argument: {
			id: "witness_argument",
			title: "Witness Statement",
			text: "Someone at the diner heard shouting behind the building shortly before the blackout rolled across town.",
			revealsTruth: false,
		},
		fuel_ledger: {
			id: "fuel_ledger",
			title: "Tampered Fuel Ledger",
			text: "The motel desk ledger includes a fuel entry that was scratched out and rewritten in a hurry.",
			revealsTruth: true,
		},
		tool_marks: {
			id: "tool_marks",
			title: "Fresh Tool Marks",
			text: "Fresh gouges scar the generator housing. This was sabotage, not mechanical failure.",
			revealsTruth: true,
		},
	},

	talks: {
		clerk: {
			name: "Mina Hart, Diner Clerk",
			first: "Mina keeps drying the same glass and finally admits she heard two voices arguing behind the diner before the lights failed.",
			repeat: "Mina glances toward the windows and says she has already told you more than is healthy in a town this size.",
			onTalk(state) {
				state.log.push("Mina is scared, but not surprised. That is a bad sign.");
			},
		},
		drifter: {
			name: "Rook, Drifter",
			first: "Rook says generators do not just die like that and tells you the tower is where careless people leave evidence.",
			repeat: "Rook says the storm is loud, but guilt is louder if you know how to listen for it.",
			onTalk(state) {
				state.log.push("Rook keeps glancing toward the radio tower.");
			},
		},
		deputy: {
			name: "Deputy Vale",
			first: "Vale says the west road is still barely open if you move before fear turns the whole town stupid. He does not sound eager to help, just eager to contain this.",
			repeat: "Vale says if you plan to leave, do it before the storm and the people both get worse.",
			onTalk(state) {
				if (state.escapeUnlocked === false) {
					state.escapeUnlocked = true;
					state.log.push("You now know the west road is still passable, at least for the moment.");
				}
			},
		},
	},

	pressureEvents: [
		{
			at: 2,
			text: "The storm leans harder into town. Loose signs rattle, doors get bolted, and people stop pretending this is temporary.",
		},
		{
			at: 3,
			text: "The radio signal collapses into static. Outside help just became a much weaker fantasy.",
		},
		{
			at: 5,
			text: "Half the town drops into darkness. Panic starts moving faster than reason.",
		},
	],

	initialLog: [
		"You rolled into Morrow's Crossing just before the storm sealed the road behind you.",
		"The lights failed across town minutes later.",
		"Nothing about the blackout feels natural.",
	],
};