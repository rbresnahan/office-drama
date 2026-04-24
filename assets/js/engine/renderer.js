export class Renderer {
	constructor(elements) {
		this.storyEl = elements.storyEl;
		this.choicesEl = elements.choicesEl;
		this.statusEl = elements.statusEl;
		this.signalEl = elements.signalEl;
		this.sectionEls = elements.sectionEls || {};
		this.sectionTitleEls = elements.sectionTitleEls || {};
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
		if (this.storyEl) {
			this.storyEl.innerHTML = `<p class="error-text">${this.escapeHtml(message)}</p>`;
		}

		if (this.choicesEl) {
			this.choicesEl.innerHTML = '';
		}
	}

	renderStatePanel({ state, displayConfig, context }) {
		this.renderStatus(state, displayConfig.status || [], context);
		this.renderLatestSignal(state.signals || []);

		const sections = Array.isArray(displayConfig.sections) ? displayConfig.sections : [];
		const slots = ['a', 'b', 'c', 'd'];

		slots.forEach((slot, index) => {
			const config = sections[index] || null;
			this.renderSection(slot, config, state, context);
		});
	}

	renderStatus(state, statusItems, context) {
		if (!this.statusEl) {
			return;
		}

		this.statusEl.innerHTML = '';

		if (!statusItems.length) {
			this.statusEl.innerHTML = '<div class="status-empty">No status configured.</div>';
			return;
		}

		const wrapper = document.createElement('div');
		wrapper.className = 'status-strip';

		const label = document.createElement('span');
		label.className = 'status-inline__label';
		label.textContent = 'Status:';
		wrapper.appendChild(label);

		const list = document.createElement('div');
		list.className = 'status-list';

		statusItems.forEach((item) => {
			const pill = document.createElement('span');
			pill.className = 'status-pill';
			pill.textContent = `${item.label}: ${item.getValue(state, context)}`;
			list.appendChild(pill);
		});

		wrapper.appendChild(list);
		this.statusEl.appendChild(wrapper);
	}

	renderLatestSignal(signals) {
		if (!this.signalEl) {
			return;
		}

		const latest = Array.isArray(signals) && signals.length
			? signals[0]
			: 'Nothing has shifted recently.';

		this.signalEl.innerHTML = `
			<span class="signal-strip__label">Latest</span>
			<span class="signal-strip__text">${this.escapeHtml(latest)}</span>
		`;
	}

	renderSection(slot, config, state, context) {
		const panelEl = this.sectionEls[slot];
		const titleEl = this.sectionTitleEls[slot];

		if (!panelEl || !titleEl) {
			return;
		}

		if (!config) {
			titleEl.textContent = 'Panel';
			panelEl.innerHTML = '<div class="status-empty">Nothing configured.</div>';
			return;
		}

		titleEl.textContent = config.title || 'Panel';

		switch (config.type) {
			case 'issues':
				this.renderIssues(panelEl, state.issues || []);
				break;

			case 'actors':
				this.renderActors(panelEl, state.actors || []);
				break;

			case 'logic':
				this.renderLogic(panelEl, state.logic || null, context);
				break;

			case 'memories':
				this.renderMemories(panelEl, state.memories || []);
				break;

			case 'evidence':
				this.renderEvidence(panelEl, state.evidence || []);
				break;

			case 'beliefs':
				this.renderBeliefs(panelEl, state.beliefs || {});
				break;

			case 'custom': {
				const markup = typeof config.render === 'function' ? config.render(state, context) : '';
				panelEl.innerHTML = markup || '<div class="status-empty">Nothing to show.</div>';
				break;
			}

			default:
				panelEl.innerHTML = '<div class="status-empty">Unknown panel type.</div>';
		}
	}

	renderIssues(targetEl, issues) {
		targetEl.innerHTML = '';
		const visibleIssues = issues.filter((issue) => issue.visible !== false);

		if (!visibleIssues.length) {
			targetEl.innerHTML = '<div class="issue-empty">Nothing unstable right now.</div>';
			return;
		}

		const list = document.createElement('div');
		list.className = 'issue-list';

		visibleIssues
			.sort((left, right) => right.severity - left.severity)
			.forEach((issue) => {
				const wrapper = document.createElement('div');
				wrapper.className = `issue-item issue-item--${issue.lifecycleState}`;

				const severityLabel = issue.severity >= 75 ? 'critical' : 'tracked';
				const severityClass = issue.severity >= 75 ? 'badge--critical' : 'badge--tracked';

				wrapper.innerHTML = `
					<div class="issue-card__line">
						<span class="issue-card__name">${this.escapeHtml(issue.title)}</span>
						<span class="badge badge--${this.escapeHtml(issue.lifecycleState)}">${this.escapeHtml(issue.lifecycleState)}</span>
						<span class="badge ${severityClass}">${severityLabel}</span>
					</div>
					<div>${this.escapeHtml(issue.currentText)}</div>
					<div class="meter-row">
						<span>severity ${this.escapeHtml(String(issue.severity))}</span>
						<span>spread ${this.escapeHtml(String(issue.spreadRisk))}</span>
						<span>contain ${this.escapeHtml(String(issue.containment))}</span>
					</div>
				`;

				list.appendChild(wrapper);
			});

		targetEl.appendChild(list);
	}

	renderActors(targetEl, actors) {
		targetEl.innerHTML = '';

		if (!actors.length) {
			targetEl.innerHTML = '<div class="actor-empty">No actors configured.</div>';
			return;
		}

		const list = document.createElement('div');
		list.className = 'actor-list';

		actors.forEach((actor) => {
			const wrapper = document.createElement('div');
			wrapper.className = `actor-item actor-item--${actor.isSubject === true ? 'subject' : 'standard'}`;

			const moodClass = this.getMoodBadgeClass(actor.currentMood);
			const deliveryLabel = actor.deliveryState || 'not_received';
			const knowledgeLabel = actor.knowledgeState || 'none';
			const subjectBadge = actor.isSubject === true
				? '<span class="badge badge--critical">target</span>'
				: '';

			const subjectState = actor.isSubject === true
				? `<span class="badge badge--watch">${this.escapeHtml(actor.subjectAwarenessState || 'unaware')}</span>`
				: '';

			wrapper.innerHTML = `
				<div class="actor-card__line">
					<div class="actor-card__headline">
						<strong>${this.escapeHtml(actor.name)}</strong>
						<span class="actor-card__role">${this.escapeHtml(actor.role || 'Staff')}</span>
					</div>
					<div class="actor-card__badges">
						${subjectBadge}
						${subjectState}
						<span class="badge ${this.escapeHtml(moodClass)}">${this.escapeHtml(actor.currentMood || 'guarded')}</span>
					</div>
				</div>
				<div class="actor-compact-note">${this.escapeHtml(actor.currentSummary || '')}</div>
				<div class="meter-row">
					<span>like ${this.escapeHtml(String(actor.playerLikability ?? '0'))}</span>
					<span>suspicion ${this.escapeHtml(String(actor.playerSuspicion ?? actor.suspicion ?? '0'))}</span>
					<span>${this.escapeHtml(deliveryLabel)}</span>
					<span>${this.escapeHtml(knowledgeLabel)}</span>
				</div>
			`;

			list.appendChild(wrapper);
		});

		targetEl.appendChild(list);
	}

	renderLogic(targetEl, logic, context) {
		targetEl.innerHTML = '';

		if (!logic || !Array.isArray(logic.categories) || !logic.categories.length) {
			targetEl.innerHTML = '<div class="status-empty">No logic board configured.</div>';
			return;
		}

		const board = document.createElement('div');
		board.className = 'logic-board';

		if (logic.helpText) {
			const help = document.createElement('div');
			help.className = 'logic-help';
			help.textContent = logic.helpText;
			board.appendChild(help);
		}

		logic.categories.forEach((category) => {
			const categoryWrap = document.createElement('div');
			categoryWrap.className = 'logic-category';

			const title = document.createElement('div');
			title.className = 'logic-category__title';
			title.textContent = category.label;
			categoryWrap.appendChild(title);

			const grid = document.createElement('div');
			grid.className = 'logic-grid';

			const corner = document.createElement('div');
			corner.className = 'logic-grid__corner';
			grid.appendChild(corner);

			category.values.forEach((value) => {
				const head = document.createElement('div');
				head.className = 'logic-grid__head';
				head.textContent = value.label;
				grid.appendChild(head);
			});

			logic.actors.forEach((actor) => {
				const rowLabel = document.createElement('div');
				rowLabel.className = 'logic-grid__row-label';
				rowLabel.textContent = actor.label;
				grid.appendChild(rowLabel);

				category.values.forEach((value) => {
					const mark = logic.notebook?.[actor.id]?.[category.id]?.[value.id] || 'unknown';
					const button = document.createElement('button');
					button.type = 'button';
					button.className = `logic-cell logic-cell--${mark}`;
					button.textContent = mark === 'match' ? '●' : mark === 'exclude' ? '×' : '';
					button.setAttribute(
						'aria-label',
						`${actor.label}, ${category.label}, ${value.label}, ${mark}`
					);

					button.addEventListener('click', () => {
						if (context && typeof context.onLogicCell === 'function') {
							context.onLogicCell(actor.id, category.id, value.id);
						}
					});

					grid.appendChild(button);
				});
			});

			categoryWrap.appendChild(grid);
			board.appendChild(categoryWrap);
		});

		if (logic.progress) {
			const footer = document.createElement('div');
			footer.className = 'logic-footer';
			footer.innerHTML = `
				<span class="badge badge--tracked">correct ${this.escapeHtml(String(logic.progress.correctMatches))} / ${this.escapeHtml(String(logic.progress.totalMatches))}</span>
				<span class="badge badge--critical">wrong ${this.escapeHtml(String(logic.progress.incorrectMatches))}</span>
				${logic.progress.solved ? '<span class="badge badge--fresh">solved</span>' : ''}
			`;
			board.appendChild(footer);
		}

		targetEl.appendChild(board);
	}

	renderEvidence(targetEl, evidence) {
		targetEl.innerHTML = '';

		if (!evidence.length) {
			targetEl.innerHTML = '<div class="evidence-empty">Nothing secured yet.</div>';
			return;
		}

		const list = document.createElement('div');
		list.className = 'evidence-list';

		evidence.forEach((item) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'evidence-item';
			wrapper.innerHTML = `
				<div class="item-row">
					<span class="badge badge--meta">${this.escapeHtml(item.source)}</span>
					${item.verified === true ? '<span class="badge badge--verified">verified</span>' : ''}
				</div>
				<div><strong>${this.escapeHtml(item.title)}</strong></div>
				<div>${this.escapeHtml(item.text)}</div>
			`;
			list.appendChild(wrapper);
		});

		targetEl.appendChild(list);
	}

	renderBeliefs(targetEl, beliefs) {
		targetEl.innerHTML = '';
		const entries = Object.values(beliefs || {});

		if (!entries.length) {
			targetEl.innerHTML = '<div class="belief-empty">No committed interpretation yet.</div>';
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

		targetEl.appendChild(list);
	}

	renderMemories(targetEl, memories) {
		targetEl.innerHTML = '';

		if (!memories.length) {
			targetEl.innerHTML = '<div class="memory-empty">Nothing solid is left in your head yet.</div>';
			return;
		}

		const sortedMemories = [...memories].sort((a, b) => b.stability - a.stability);
		const list = document.createElement('div');
		list.className = 'memory-list';

		sortedMemories.forEach((memory) => {
			const wrapper = document.createElement('div');
			wrapper.className = `memory-item memory-item--${memory.stage}`;
			wrapper.innerHTML = `
				<div class="memory-card__line">
					<span class="memory-card__name">${this.escapeHtml(memory.label)}</span>
					<span class="badge badge--${this.escapeHtml(memory.stage)}">${this.escapeHtml(memory.stage)}</span>
					${memory.preserved === true ? '<span class="badge badge--anchor">anchored</span>' : ''}
				</div>
				<div>${this.escapeHtml(memory.currentText)}</div>
			`;

			list.appendChild(wrapper);
		});

		targetEl.appendChild(list);
	}

	renderNode({ nodeView, choices, onChoice }) {
		if (this.storyEl) {
			const kickerHtml = nodeView.kicker
				? `<div class="story-kicker">${this.escapeHtml(nodeView.kicker)}</div>`
				: '';

			const paragraphs = String(nodeView.text || '')
				.split(/\n{2,}/)
				.filter(Boolean)
				.map((paragraph) => `<p>${this.escapeHtml(paragraph)}</p>`)
				.join('');

			this.storyEl.innerHTML = `
				${kickerHtml}
				<h2 class="story-title">${this.escapeHtml(nodeView.title || '')}</h2>
				<div class="story-body">${paragraphs}</div>
			`;
		}

		if (this.choicesEl) {
			this.choicesEl.innerHTML = '';

			choices.forEach((choice) => {
				const button = document.createElement('button');
				button.type = 'button';
				button.className = 'choice-button';
				button.disabled = choice.disabled === true;

				const note = choice.available === false && choice.unavailableText
					? choice.unavailableText
					: choice.note || '';

				button.innerHTML = `
					<span class="choice-text">${this.escapeHtml(choice.text || 'Continue')}</span>
					${note ? `<span class="choice-note">${this.escapeHtml(note)}</span>` : ''}
				`;

				button.addEventListener('click', () => onChoice(choice));
				this.choicesEl.appendChild(button);
			});
		}
	}

	getMoodBadgeClass(mood) {
		switch (mood) {
			case 'open':
				return 'badge--mood-open';
			case 'settled':
				return 'badge--mood-settled';
			case 'watchful':
				return 'badge--mood-watchful';
			case 'hostile':
				return 'badge--mood-hostile';
			case 'shaken':
				return 'badge--mood-shaken';
			case 'guarded':
			default:
				return 'badge--mood-guarded';
		}
	}

	escapeHtml(value) {
		return String(value ?? '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}
}