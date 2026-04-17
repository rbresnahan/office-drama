const demoStory = {
	startScene: "intro",
	initialState: {
		hasKey: false,
		health: 3,
		searchedYard: false,
	},
	scenes: {
		intro: {
			id: "intro",
			title: "The Rusted Gate",
			text: function (state) {
				return `
					<p>You stand before a rusted gate at the edge of a dead estate.</p>
					<p>Your health is <strong>${state.health}</strong>.</p>
					<p>The wind smells like wet leaves and bad decisions.</p>
				`;
			},
			choices: [
				{
					text: "Climb the gate.",
					nextScene: "courtyard",
					effects: [
						{ type: "decrement", key: "health", value: 1 },
					],
				},
				{
					text: "Search the ground near the gate.",
					nextScene: "path",
					effects: [
						{ type: "set", key: "hasKey", value: true },
					],
				},
			],
		},
		path: {
			id: "path",
			title: "The Hidden Key",
			text: function (state) {
				return `
					<p>You crouch near the weeds and find a small iron key buried in the mud.</p>
					<p>Health: <strong>${state.health}</strong>.</p>
					<p>Not bad. Grim place, useful trash.</p>
				`;
			},
			choices: [
				{
					text: "Unlock the gate and enter the courtyard.",
					nextScene: "courtyard",
				},
			],
		},
		courtyard: {
			id: "courtyard",
			title: "The Courtyard",
			text: function (state) {
				const keyText = state.hasKey
					? "<p>The iron key feels heavy in your pocket.</p>"
					: "<p>Your shoulder aches from climbing the gate like a raccoon with bills to pay.</p>";

				return `
					<p>You step into the courtyard. A manor door waits ahead. A side shed sags to your left.</p>
					${keyText}
					<p>Health: <strong>${state.health}</strong>.</p>
				`;
			},
			choices: [
				{
					text: "Try the manor door.",
					nextScene: "manorDoor",
				},
				{
					text: "Search the shed.",
					nextScene: "shed",
					effects: [
						{ type: "set", key: "searchedYard", value: true },
					],
				},
			],
		},
		shed: {
			id: "shed",
			title: "The Shed",
			text: function (state) {
				return `
					<p>The shed is mostly rotten tools and spider webs.</p>
					<p>Behind a broken crate, you find a sturdy lantern.</p>
					<p>You suddenly feel smarter than this place deserves.</p>
					<p>Health: <strong>${state.health}</strong>.</p>
				`;
			},
			choices: [
				{
					text: "Return to the courtyard.",
					nextScene: "courtyard",
				},
			],
		},
		manorDoor: {
			id: "manorDoor",
			title: "The Manor Door",
			text: function (state) {
				const extraText = state.searchedYard
					? "<p>Because you searched the shed, you feel ready for whatever stale nonsense is inside.</p>"
					: "<p>You have a strong sense this is how people end up as cautionary tales.</p>";

				return `
					<p>The heavy front door groans when you touch it.</p>
					${extraText}
				`;
			},
			choices: [
				{
					text: "Open the door with the key.",
					nextScene: "goodEnding",
					conditions: [
						{ key: "hasKey", equals: true },
					],
				},
				{
					text: "Force the locked door open with your shoulder.",
					nextScene: "badEnding",
					conditions: [
						{ key: "hasKey", equals: false },
						{ key: "health", greaterThan: 0 },
					],
					effects: [
						{ type: "decrement", key: "health", value: 1 },
					],
				},
				{
					text: "Give up and leave while you still can.",
					nextScene: "leaveEnding",
				},
			],
		},
		goodEnding: {
			id: "goodEnding",
			title: "Inside the Manor",
			text: function (state) {
				const shedBonus = state.searchedYard
					? "<p>Lantern in hand, you step into the dark like you actually planned this.</p>"
					: "<p>You step into the dark and immediately regret not preparing better.</p>";

				return `
					<p>The key turns. The lock yields.</p>
					${shedBonus}
					<p>You have reached one ending.</p>
				`;
			},
			choices: [],
			ending: true,
		},
		badEnding: {
			id: "badEnding",
			title: "Shoulder First, Wisdom Last",
			text: function (state) {
				return `
					<p>You slam into the door. It does not care.</p>
					<p>Your health drops to <strong>${state.health}</strong>, and your dignity is somewhere lower.</p>
					<p>You stagger back into the courtyard and decide this haunted dump can keep its secrets.</p>
					<p>You have reached one ending.</p>
				`;
			},
			choices: [],
			ending: true,
		},
		leaveEnding: {
			id: "leaveEnding",
			title: "A Rare Good Decision",
			text: `
				<p>You turn around, leave the estate behind, and survive by doing something almost nobody in these stories does:</p>
				<p>You mind your own business.</p>
				<p>You have reached one ending.</p>
			`,
			choices: [],
			ending: true,
		},
	},
};

export { demoStory };