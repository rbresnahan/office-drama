const {
	map,
	locations,
	clues,
	talks,
	pressureEvents,
	initialLog,
} = window.GAME_DATA;

const elements = {
	locationName: document.getElementById("location-name"),
	locationDescription: document.getElementById("location-description"),
	locationNpc: document.getElementById("location-npc"),
	pressureFill: document.getElementById("pressure-fill"),
	pressureText: document.getElementById("pressure-text"),
	truthStatus: document.getElementById("truth-status"),
	escapeStatus: document.getElementById("escape-status"),
	movementButtons: document.getElementById("movement-buttons"),
	searchButton: document.getElementById("search-button"),
	talkButton: document.getElementById("talk-button"),
	waitButton: document.getElementById("wait-button"),
	escapeButton: document.getElementById("escape-button"),
	clueList: document.getElementById("clue-list"),
	logList: document.getElementById("log-list"),
	endingPanel: document.getElementById("ending-panel"),
	endingTitle: document.getElementById("ending-title"),
	endingText: document.getElementById("ending-text"),
	restartButton: document.getElementById("restart-button"),
	scenarioSection: document.getElementById("scenario-section"),
	moveSection: document.getElementById("move-section"),
	actionsSection: document.getElementById("actions-section"),
};

let state = createInitialState();

function createInitialState() {
	return {
		currentLocation: "diner",
		pressure: 0,
		maxPressure: 6,
		foundClues: [],
		talkedTo: [],
		searchedLocations: [],
		log: [...initialLog],
		escapeUnlocked: false,
		truthDiscovered: false,
		truthRevealLogged: false,
		firedPressureEvents: [],
		gameOver: false,
		endingTitle: "",
		endingText: "",
	};
}

function render() {
	const location = locations[state.currentLocation];
	const connectedLocations = map[state.currentLocation];

	elements.locationName.textContent = location.name;
	elements.locationDescription.textContent = location.description;

	renderLocationNpc(location);
	renderPressure();
	renderStatusPills();
	renderMovementButtons(connectedLocations);
	renderActionButtons(location);
	renderClues();
	renderLog();
	renderGameStateSections();
	renderEnding();
}

function renderLocationNpc(location) {
	if (location.npc === null) {
		elements.locationNpc.textContent = "Present: No one.";
		return;
	}

	elements.locationNpc.textContent = `Present: ${talks[location.npc].name}.`;
}

function renderPressure() {
	const percent = (state.pressure / state.maxPressure) * 100;
	elements.pressureFill.style.width = `${Math.min(percent, 100)}%`;
	elements.pressureText.textContent = `${state.pressure} / ${state.maxPressure}`;
}

function renderStatusPills() {
	if (state.truthDiscovered === true) {
		elements.truthStatus.textContent = "Truth pieced together.";
		elements.truthStatus.style.background = "var(--success-bg)";
		elements.truthStatus.style.borderColor = "var(--success-border)";
	} else {
		elements.truthStatus.textContent = "Truth not pieced together.";
		elements.truthStatus.style.background = "var(--panel-alt)";
		elements.truthStatus.style.borderColor = "var(--border)";
	}

	if (state.escapeUnlocked === true) {
		elements.escapeStatus.textContent = "West road identified.";
		elements.escapeStatus.style.background = "var(--warn-bg)";
		elements.escapeStatus.style.borderColor = "var(--warn-border)";
	} else {
		elements.escapeStatus.textContent = "Escape route unknown.";
		elements.escapeStatus.style.background = "var(--panel-alt)";
		elements.escapeStatus.style.borderColor = "var(--border)";
	}
}

function renderMovementButtons(connectedLocations) {
	elements.movementButtons.innerHTML = "";

	connectedLocations.forEach((locationId) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "action-button move-button";
		button.textContent = `Go to ${locations[locationId].name}`;
		button.disabled = state.gameOver === true;
		button.addEventListener("click", () => {
			moveTo(locationId);
		});
		elements.movementButtons.appendChild(button);
	});
}

function renderActionButtons(location) {
	const hasNpc = location.npc !== null;

	elements.searchButton.disabled = state.gameOver === true;
	elements.waitButton.disabled = state.gameOver === true;
	elements.talkButton.disabled = state.gameOver === true || hasNpc === false;
	elements.escapeButton.disabled = state.gameOver === true || state.escapeUnlocked === false;
}

function renderClues() {
	elements.clueList.innerHTML = "";

	if (state.foundClues.length === 0) {
		const emptyItem = document.createElement("li");
		emptyItem.textContent = "No clues yet.";
		elements.clueList.appendChild(emptyItem);
		return;
	}

	state.foundClues.forEach((clueId) => {
		const item = document.createElement("li");
		item.innerHTML = `<strong>${clues[clueId].title}</strong><br>${clues[clueId].text}`;
		elements.clueList.appendChild(item);
	});
}

function renderLog() {
	elements.logList.innerHTML = "";

	const latestEntries = state.log.slice(-12).reverse();

	latestEntries.forEach((entry) => {
		const item = document.createElement("li");
		item.textContent = entry;
		elements.logList.appendChild(item);
	});
}

function renderGameStateSections() {
	const isHidden = state.gameOver === true;

	elements.scenarioSection.classList.toggle("hidden", isHidden);
	elements.moveSection.classList.toggle("hidden", isHidden);
	elements.actionsSection.classList.toggle("hidden", isHidden);
}

function renderEnding() {
	if (state.gameOver === true) {
		elements.endingPanel.classList.remove("hidden");
		elements.endingTitle.textContent = state.endingTitle;
		elements.endingText.textContent = state.endingText;
		return;
	}

	elements.endingPanel.classList.add("hidden");
}

function addLog(message) {
	state.log.push(message);
}

function moveTo(locationId) {
	if (state.gameOver === true) {
		return;
	}

	const currentName = locations[state.currentLocation].name;
	const nextName = locations[locationId].name;

	state.currentLocation = locationId;
	addLog(`You leave the ${currentName} and head to the ${nextName}.`);

	resolveTurn();
}

function searchCurrentLocation() {
	if (state.gameOver === true) {
		return;
	}

	const location = locations[state.currentLocation];
	const alreadySearched = state.searchedLocations.includes(location.id);

	if (alreadySearched === true) {
		addLog(`You search the ${location.name} again and find nothing new.`);
		resolveTurn();
		return;
	}

	state.searchedLocations.push(location.id);

	if (location.clue === null) {
		addLog(`You search the ${location.name} carefully, but turn up nothing useful.`);
		resolveTurn();
		return;
	}

	if (state.foundClues.includes(location.clue) === false) {
		state.foundClues.push(location.clue);
		addLog(`You search the ${location.name} and uncover a clue: ${clues[location.clue].title}.`);
	} else {
		addLog(`You search the ${location.name}, but anything useful has already been taken from it.`);
	}

	resolveTurn();
}

function talkToNpc() {
	if (state.gameOver === true) {
		return;
	}

	const location = locations[state.currentLocation];

	if (location.npc === null) {
		addLog("There is no one here to talk to.");
		resolveTurn();
		return;
	}

	const npcId = location.npc;
	const alreadyTalked = state.talkedTo.includes(npcId);
	const talkData = talks[npcId];

	if (alreadyTalked === true) {
		addLog(talkData.repeat);
	} else {
		state.talkedTo.push(npcId);
		addLog(talkData.first);
	}

	talkData.onTalk(state);

	resolveTurn();
}

function waitTurn() {
	if (state.gameOver === true) {
		return;
	}

	addLog("You wait, listen, and let the storm spend another piece of the night.");
	resolveTurn();
}

function attemptEscape() {
	if (state.gameOver === true || state.escapeUnlocked === false) {
		return;
	}

	if (state.truthDiscovered === true) {
		setEnding(
			"Escape With the Truth",
			"You take the west road before it closes, carrying enough truth to know the blackout was sabotage and not bad luck."
		);
	} else {
		setEnding(
			"Escape With Fragments",
			"You get out alive, but leave with only scattered pieces. The full story stays behind in the storm."
		);
	}

	render();
}

function resolveTurn() {
	updateTruthStatus();
	advancePressure();
	checkEnding();
	render();
}

function updateTruthStatus() {
	const truthClueCount = state.foundClues.filter((clueId) => {
		return clues[clueId].revealsTruth === true;
	}).length;

	if (truthClueCount >= 2 && state.truthDiscovered === false) {
		state.truthDiscovered = true;

		if (state.truthRevealLogged === false) {
			addLog("The pieces lock together. The generator did not fail. Someone sabotaged it.");
			state.truthRevealLogged = true;
		}
	}
}

function advancePressure() {
	state.pressure += 1;

	pressureEvents.forEach((eventData) => {
		const eventAlreadyFired = state.firedPressureEvents.includes(eventData.at);

		if (state.pressure === eventData.at && eventAlreadyFired === false) {
			state.firedPressureEvents.push(eventData.at);
			addLog(eventData.text);
		}
	});
}

function checkEnding() {
	if (state.gameOver === true) {
		return;
	}

	if (state.pressure < state.maxPressure) {
		return;
	}

	if (state.truthDiscovered === true && state.escapeUnlocked === true) {
		setEnding(
			"Last-Chance Escape",
			"As Morrow's Crossing starts to buckle under darkness and fear, you force your way out with the truth mostly intact."
		);
		return;
	}

	if (state.escapeUnlocked === true) {
		setEnding(
			"Survived, But Unsure",
			"You slip out before the town fully collapses, but you never learn enough to know who lit the fuse."
		);
		return;
	}

	setEnding(
		"Town Overwhelmed",
		"The storm, the blackout, and the panic overtake the town before you can act decisively."
	);
}

function setEnding(title, text) {
	state.gameOver = true;
	state.endingTitle = title;
	state.endingText = text;
	addLog(`Ending reached: ${title}.`);
}

function restartRun() {
	state = createInitialState();
	render();
}

elements.searchButton.addEventListener("click", searchCurrentLocation);
elements.talkButton.addEventListener("click", talkToNpc);
elements.waitButton.addEventListener("click", waitTurn);
elements.escapeButton.addEventListener("click", attemptEscape);
elements.restartButton.addEventListener("click", restartRun);

render();