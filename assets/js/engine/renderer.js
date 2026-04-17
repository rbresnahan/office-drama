function renderText(textElement, text, state) {
	if (typeof text === "function") {
		textElement.innerHTML = text(state);
		return;
	}

	textElement.innerHTML = text;
}

function renderChoices(choicesElement, choices, onChoiceSelected) {
	choicesElement.innerHTML = "";

	if (!choices.length) {
		return;
	}

	choices.forEach(function (choice) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "choice-button";
		button.textContent = choice.text;

		button.addEventListener("click", function () {
			onChoiceSelected(choice);
		});

		choicesElement.appendChild(button);
	});
}

function renderScene(config) {
	const {
		elements,
		scene,
		state,
		choices,
		onChoiceSelected,
	} = config;

	elements.title.textContent = scene.title;
	renderText(elements.text, scene.text, state);
	renderChoices(elements.choices, choices, onChoiceSelected);

	if (scene.ending) {
		elements.card.classList.add("ending");
	} else {
		elements.card.classList.remove("ending");
	}
}

function renderMissingScene(elements, sceneId) {
	elements.title.textContent = "Missing Scene";
	elements.text.innerHTML = `<p>Scene "${sceneId}" was not found.</p>`;
	elements.choices.innerHTML = "";
	elements.card.classList.remove("ending");
}

export {
	renderScene,
	renderMissingScene,
};