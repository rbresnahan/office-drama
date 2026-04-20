export class Renderer {
	constructor(elements) {
		this.storyEl = elements.storyEl;
		this.choicesEl = elements.choicesEl;
		this.statsEl = elements.statsEl;
		this.inventoryEl = elements.inventoryEl;
		this.flagsEl = elements.flagsEl;
		this.feedbackEl = elements.feedbackEl;
		this.logEl = elements.logEl;
		this.titleEl = elements.titleEl;
		this.subtitleEl = elements.subtitleEl;
		this.eyebrowEl = elements.eyebrowEl;
	}

	setDocumentTitle(title) {
		if (title) {
			document.title = title;
		}
	}

	renderMeta(meta = {}) {
		if (this.titleEl && meta.title) {
			this.titleEl.textContent = meta.title;
		}

		if (this.subtitleEl && meta.subtitle) {
			this.subtitleEl.textContent = meta.subtitle;
		}

		if (this.eyebrowEl && meta.eyebrow) {
			this.eyebrowEl.textContent = meta.eyebrow;
		}
	}

	showError(message) {
		this.storyEl.innerHTML = `<p class="error-text">${this.escapeHtml(message)}</p>`;
		this.choicesEl.innerHTML = '';
	}

	renderStatePanel({ state, displayConfig, context }) {
		this.renderStats(state, displayConfig.status || [], context);
		this.renderEvidence(state.evidence || []);
		this.renderBeliefs(state.beliefs || {});
		this.renderSignals(state.signals || []);
		this.renderMemories(state.memories || []);
	}

	renderStats(state, statusItems, context) {
		this.statsEl.innerHTML = '';

		if (!statusItems.length) {
			this.statsEl.innerHTML = '<div class="status-empty">No status configured.</div>';
			return;
		}

		const wrapper = document.createElement('div');
		wrapper.className = 'status-group';

		const list = document.createElement('div');
		list.className = 'status-list';

		statusItems.forEach((item) => {
			const pill = document.createElement('span');
			pill.className = 'status-pill';
			pill.textContent = `${item.label}: ${item.getValue(state, context)}`;
			list.appendChild(pill);
		});

		wrapper.appendChild(list);
		this.statsEl.appendChild(wrapper);
	}

	renderEvidence(evidence) {
		this.inventoryEl.innerHTML = '';

		if (!evidence.length) {
			this.inventoryEl.innerHTML = '<div class="evidence-empty">Nothing secured yet.</div>';
			return;
		}

		const list = document.createElement('div');
		list.className = 'evidence-list';

		evidence.forEach((item) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'evidence-item';
			wrapper.innerHTML = `
				<div class="item-row">
					<span class="badge">${this.escapeHtml(item.source)}</span>
					${item.verified === true ? '<span class="badge badge--fresh">verified</span>' : ''}
				</div>
				<div><strong>${this.escapeHtml(item.title)}</strong></div>
				<div>${this.escapeHtml(item.text)}</div>
			`;
			list.appendChild(wrapper);
		});

		this.inventoryEl.appendChild(list);
	}

	renderBeliefs(beliefs) {
		this.flagsEl.innerHTML = '';
		const entries = Object.values(beliefs || {});

		if (!entries.length) {
			this.flagsEl.innerHTML = '<div class="belief-empty">No committed interpretation yet.</div>';
			return;
		}

		const list = document.createElement('div');
		list.className = 'belief-list';

		entries.forEach((belief) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'belief-item';
			wrapper.textContent = belief.label;
			list.appendChild(wrapper);
		});

		this.flagsEl.appendChild(list);
	}

	renderSignals(signals) {
		this.feedbackEl.innerHTML = '';

		if (!signals.length) {
			this.feedbackEl.innerHTML = '<div class="signal-empty">Nothing has shifted recently.</div>';
			return;
		}

		const list = document.createElement('div');
		list.className = 'signal-list';

		signals.forEach((signal) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'signal-item';
			wrapper.textContent = signal;
			list.appendChild(wrapper);
		});

		this.feedbackEl.appendChild(list);
	}

	renderMemories(memories) {
		this.logEl.innerHTML = '';

		if (!memories.length) {
			this.logEl.innerHTML = '<div class="memory-empty">Nothing solid is left in your head yet.</div>';
			return;
		}

		const sortedMemories = [ ...memories ].sort((a, b) => b.stability - a.stability);
		const list = document.createElement('div');
		list.className = 'memory-list';

		sortedMemories.forEach((memory) => {
			const wrapper = document.createElement('div');
			wrapper.className = `memory-item memory-item--${memory.stage}`;
			wrapper.innerHTML = `
				<div class="item-row">
					<span class="badge badge--${memory.stage}">${this.escapeHtml(memory.stage)}</span>
					${memory.preserved === true ? '<span class="badge badge--anchor">anchored</span>' : ''}
				</div>
				<div>${this.escapeHtml(memory.currentText)}</div>
				<div class="item-meta">${this.escapeHtml(memory.label)}</div>
			`;
			list.appendChild(wrapper);
		});

		this.logEl.appendChild(list);
	}

	renderNode({ nodeView, choices, onChoice }) {
		const kickerMarkup = nodeView.kicker
			? `<div class="story-kicker">${this.escapeHtml(nodeView.kicker)}</div>`
			: '';

		const paragraphs = String(nodeView.text || '')
			.split(/\n{2,}/)
			.filter(Boolean)
			.map((paragraph) => `<p>${this.escapeHtml(paragraph)}</p>`)
			.join('');

		this.storyEl.innerHTML = `
			${kickerMarkup}
			<h2 class="story-title">${this.escapeHtml(nodeView.title || '')}</h2>
			<div class="story-body">${paragraphs}</div>
		`;

		this.choicesEl.innerHTML = '';

		choices.forEach((choice) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'choice-button';
			button.disabled = choice.available === false || choice.disabled === true;

			const choiceText = document.createElement('span');
			choiceText.className = 'choice-text';
			choiceText.textContent = choice.text || 'Continue';
			button.appendChild(choiceText);

			if ((choice.available === false || choice.disabled === true) && choice.unavailableText) {
				const choiceNote = document.createElement('span');
				choiceNote.className = 'choice-note';
				choiceNote.textContent = choice.unavailableText;
				button.appendChild(choiceNote);
			}

			button.addEventListener('click', () => {
				if (choice.available === false || choice.disabled === true) {
					return;
				}

				onChoice(choice);
			});

			this.choicesEl.appendChild(button);
		});
	}

	escapeHtml(value) {
		return String(value)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#039;');
	}
}