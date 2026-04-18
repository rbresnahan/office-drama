export class Renderer {
	constructor(elements) {
		this.storyEl = elements.storyEl;
		this.choicesEl = elements.choicesEl;
		this.statsEl = elements.statsEl;
		this.inventoryEl = elements.inventoryEl;
		this.flagsEl = elements.flagsEl;
		this.feedbackEl = elements.feedbackEl;
		this.logEl = elements.logEl;
	}

	setDocumentTitle(title) {
		if (title) {
			document.title = title;
		}
	}

	showError(message) {
		this.storyEl.textContent = message;
		this.choicesEl.innerHTML = '';
	}

	renderStatePanel({ state, displayConfig, latestFeedback, eventLog }) {
		this.renderStats(state, displayConfig.stats || []);
		this.renderInventory(state, displayConfig.inventory || []);
		this.renderFlags(state, displayConfig.flags || []);
		this.renderFeedback(latestFeedback);
		this.renderLog(eventLog);
	}

	renderStats(state, stats) {
		this.statsEl.innerHTML = '';

		if (!stats.length) {
			return;
		}

		const items = stats.map((key) => {
			return this.createPill(`${key}: ${state[key]}`);
		});

		this.statsEl.appendChild(this.createStatusGroup('Stats', items));
	}

	renderInventory(state, inventory) {
		this.inventoryEl.innerHTML = '';

		if (!inventory.length) {
			return;
		}

		const activeItems = inventory
			.filter((item) => state[item.key])
			.map((item) => this.createPill(item.label));

		if (!activeItems.length) {
			this.inventoryEl.appendChild(
				this.createStatusGroup('Inventory', [this.createEmptyText('Nothing yet.')])
			);
			return;
		}

		this.inventoryEl.appendChild(this.createStatusGroup('Inventory', activeItems));
	}

	renderFlags(state, flags) {
		this.flagsEl.innerHTML = '';

		if (!flags.length) {
			return;
		}

		const activeFlags = flags
			.filter((flag) => state[flag.key])
			.map((flag) => this.createPill(flag.label));

		if (!activeFlags.length) {
			this.flagsEl.appendChild(
				this.createStatusGroup('Flags', [this.createEmptyText('No known flags.')])
			);
			return;
		}

		this.flagsEl.appendChild(this.createStatusGroup('Flags', activeFlags));
	}

	renderFeedback(latestFeedback) {
		if (!latestFeedback) {
			this.feedbackEl.className = 'feedback-empty';
			this.feedbackEl.textContent = 'Nothing yet.';
			return;
		}

		this.feedbackEl.className = 'feedback-text';
		this.feedbackEl.textContent = latestFeedback;
	}

	renderLog(eventLog) {
		if (!eventLog.length) {
			this.logEl.className = 'log-empty';
			this.logEl.textContent = 'No events recorded yet.';
			return;
		}

		this.logEl.className = 'log-list';
		this.logEl.innerHTML = '';

		eventLog
			.slice()
			.reverse()
			.forEach((entry) => {
				const entryEl = document.createElement('div');
				entryEl.className = 'log-entry';
				entryEl.textContent = entry;
				this.logEl.appendChild(entryEl);
			});
	}

	renderNode({ text, choices, onChoice }) {
		this.storyEl.textContent = text;
		this.choicesEl.innerHTML = '';

		choices.forEach((choice) => {
			const button = document.createElement('button');

			const choiceText = document.createElement('span');
			choiceText.className = 'choice-text';
			choiceText.textContent = choice.text || 'Continue';
			button.appendChild(choiceText);

			if (!choice.available && choice.unavailableText) {
				const choiceNote = document.createElement('span');
				choiceNote.className = 'choice-note';
				choiceNote.textContent = choice.unavailableText;
				button.appendChild(choiceNote);
			}

			if (!choice.available) {
				button.disabled = true;
			}

			button.addEventListener('click', () => {
				if (!choice.available) {
					return;
				}

				onChoice(choice);
			});

			this.choicesEl.appendChild(button);
		});
	}

	createStatusGroup(label, nodes) {
		const wrapper = document.createElement('div');
		wrapper.className = 'status-group';

		const labelEl = document.createElement('div');
		labelEl.className = 'status-label';
		labelEl.textContent = label;
		wrapper.appendChild(labelEl);

		if (nodes.length === 1 && nodes[0].classList.contains('status-empty')) {
			wrapper.appendChild(nodes[0]);
			return wrapper;
		}

		const list = document.createElement('div');
		list.className = 'status-list';

		nodes.forEach((node) => {
			list.appendChild(node);
		});

		wrapper.appendChild(list);

		return wrapper;
	}

	createPill(text) {
		const pill = document.createElement('span');
		pill.className = 'status-pill';
		pill.textContent = text;
		return pill;
	}

	createEmptyText(text) {
		const empty = document.createElement('div');
		empty.className = 'status-empty';
		empty.textContent = text;
		return empty;
	}
}