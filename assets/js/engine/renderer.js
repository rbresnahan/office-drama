function escapeHtml( value ) {
	return String( value )
		.replaceAll( '&', '&amp;' )
		.replaceAll( '<', '&lt;' )
		.replaceAll( '>', '&gt;' )
		.replaceAll( '"', '&quot;' )
		.replaceAll( "'", '&#039;' );
}

const OFFICE_CLOCK_TIMES = [
	'9:00 AM',
	'9:37 AM',
	'10:13 AM',
	'10:52 AM',
	'11:27 AM',
	'12:00 PM',
	'12:46 PM',
	'1:45 PM',
	'2:31 PM',
	'3:18 PM',
	'4:07 PM',
	'5:00 PM',
];

const CHARACTER_PROFILES = {
	betty: {
		name: 'Betty',
		role: 'Executive Assistant',
		icon: '♙',
		summary: [
			'Betty keeps the office running smoothly and everyone in their place.',
			'She is observant, discreet, and much more dangerous than the candy dish suggests.',
		],
		notices: [
			'She has not looked up at you yet.',
			'Her calendar shows a 3 PM meeting.',
		],
	},
	celia: {
		name: 'Celia',
		role: 'Email Subject / Current Problem',
		icon: '◇',
		summary: [
			'Celia has fragments, not necessarily the full message.',
			'If she gets the original, the room changes temperature fast.',
		],
		notices: [
			'She has not looked directly at you yet.',
			'Devon may be drifting toward her side of the office.',
		],
	},
	frank: {
		name: 'Frank',
		role: 'Potential Scapegoat',
		icon: '▣',
		summary: [
			'Frank is irritated, busy, and currently useful because his absence can become a story.',
			'If he realizes he is being aimed at, he will not stay furniture.',
		],
		notices: [
			'His desk has been empty at suspiciously useful times.',
			'His bag may be unattended.',
		],
	},
	tim: {
		name: 'Tim',
		role: 'Timeline Goblin',
		icon: '⌁',
		summary: [
			'Tim notices patterns and turns vibes into timelines.',
			'His helpfulness can be redirected, but every question tells him what you fear.',
		],
		notices: [
			'His lunch routine looks weirdly important.',
			'He may be checking recall details.',
		],
	},
	lisa: {
		name: 'Lisa',
		role: 'Office Manager',
		icon: '✦',
		summary: [
			'Lisa handles access, calls, scheduling, and the slow conversion of drama into process.',
			'If she starts documenting, the paper trail grows teeth.',
		],
		notices: [
			'Her notebook is open.',
			'The all-hands invite has her attention.',
		],
	},
	devin: {
		name: 'Devin',
		role: 'Rumor Distribution Network',
		icon: '◈',
		summary: [
			'Devin has the energy of a person who calls gossip “context.”',
			'Anything he hears may travel, which is dangerous and therefore useful.',
		],
		notices: [
			'He may have seen only a fragment.',
			'Fragments are where lies rent office space.',
		],
	},
};

const SCENE_CHARACTER_IDS = {
	betty_desk: 'betty',
	celia_area: 'celia',
	frank_desk: 'frank',
	tim_desk: 'tim',
	lisa_area: 'lisa',
	break_room: 'devin',
};

let activeIntelPanelId = 'story';
let lastRenderedSceneId = null;
let latestGame = null;
let latestPanels = [];

function normalizeParagraphs( value, state ) {
	const resolved = typeof value === 'function' ? value( state ) : value;

	if ( Array.isArray( resolved ) ) {
		return resolved.filter( ( paragraph ) => typeof paragraph === 'string' && paragraph.trim() );
	}

	if ( typeof resolved === 'string' && resolved.trim() ) {
		return [ resolved ];
	}

	return [];
}

function renderParagraphs( paragraphs ) {
	return paragraphs.map( ( paragraph ) => `<p>${ escapeHtml( paragraph ) }</p>` ).join( '' );
}

function getClockTime( state ) {
	if ( state.finaleStarted ) {
		return OFFICE_CLOCK_TIMES[ OFFICE_CLOCK_TIMES.length - 1 ];
	}

	const maxTurns = state.maxTurns || OFFICE_CLOCK_TIMES.length;
	const currentTurn = Math.min( Math.max( state.turn || 1, 1 ), maxTurns );
	const clockIndex = Math.min( currentTurn - 1, OFFICE_CLOCK_TIMES.length - 1 );

	return OFFICE_CLOCK_TIMES[ clockIndex ];
}

function getClockLabel( state, clockTime ) {
	if ( state.finaleStarted || clockTime === '5:00 PM' ) {
		return 'All-Hands';
	}

	if ( clockTime === '12:00 PM' ) {
		return 'Lunch';
	}

	if ( clockTime === '9:00 AM' ) {
		return 'Start';
	}

	return 'Office Time';
}

function getClockProgress( state ) {
	if ( state.finaleStarted ) {
		return 100;
	}

	const maxTurns = Math.max( state.maxTurns || OFFICE_CLOCK_TIMES.length, 1 );
	const currentTurn = Math.min( Math.max( state.turn || 1, 1 ), maxTurns );

	return Math.round( ( ( currentTurn - 1 ) / Math.max( maxTurns - 1, 1 ) ) * 100 );
}

function getResolvedSceneContent( game, scene, state ) {
	let kicker = scene.kicker || scene.location || '';
	let title = scene.title || '';
	let body = normalizeParagraphs( scene.body, state );
	let internalThought = normalizeParagraphs( scene.internalThought, state );

	if ( scene.id === game.story.finaleSceneId ) {
		const finale = game.getFinaleResult();

		kicker = finale.kicker;
		title = finale.title;
		body = finale.body;
		internalThought = finale.internalThought || [];
	}

	return {
		kicker,
		title,
		body,
		internalThought,
	};
}

function getSceneCharacterId( scene ) {
	return SCENE_CHARACTER_IDS[ scene.id ] || null;
}

function getStatusBars( bars, state ) {
	return bars
		.map( ( bar ) => ( {
			...bar,
			value: state.bars[ bar.id ] || 0,
		} ) )
		.filter( ( bar ) => bar.value >= 25 )
		.sort( ( a, b ) => b.value - a.value );
}

function getTopStatusBar( bars, state ) {
	return getStatusBars( bars, state )[ 0 ] || null;
}

function getHeatLabel( value ) {
	if ( value >= 75 ) {
		return 'High';
	}

	if ( value >= 40 ) {
		return 'Moderate';
	}

	if ( value >= 25 ) {
		return 'Low';
	}

	return 'Quiet';
}

function getChoiceIcon( choice ) {
	const id = choice.id || '';
	const text = choice.text || '';

	if ( id.includes( 'betty' ) || text.includes( 'Betty' ) ) {
		return '▤';
	}

	if ( id.includes( 'tim' ) || text.includes( 'Tim' ) ) {
		return '◎';
	}

	if ( id.includes( 'frank' ) || text.includes( 'Frank' ) ) {
		return '▣';
	}

	if ( id.includes( 'celia' ) || text.includes( 'Celia' ) ) {
		return '♢';
	}

	if ( id.includes( 'lisa' ) || text.includes( 'Lisa' ) ) {
		return '♙';
	}

	if ( id.includes( 'bathroom' ) || text.includes( 'bathroom' ) ) {
		return '⇥';
	}

	if ( id.includes( 'break' ) || text.includes( 'break room' ) || text.includes( 'lunch' ) ) {
		return '☕';
	}

	if ( id.includes( 'email' ) || text.includes( 'email' ) || text.includes( 'recall' ) ) {
		return '✉';
	}

	if ( id.includes( 'watch' ) || text.includes( 'Watch' ) ) {
		return '◉';
	}

	if ( id.includes( 'ask' ) || text.includes( 'Ask' ) ) {
		return '?';
	}

	return '›';
}

function getChoiceCategory( choice ) {
	const category = Array.isArray( choice.category ) ? choice.category[ 0 ] : choice.category;

	return category || 'neutral';
}

function isMainNavigationChoiceSet( choices ) {
	return choices.length > 0 && choices.every( ( choice ) => getChoiceCategory( choice ) === 'move' );
}

function shouldShowMoreButton( panel ) {
	const textLength = panel.body.join( ' ' ).length + panel.notices.join( ' ' ).length;

	return panel.body.length > 1 || panel.notices.length > 0 || textLength > 260;
}

function buildStoryPanel( content ) {
	return {
		id: 'story',
		label: 'Story',
		icon: '▱',
		eyebrow: content.kicker || 'Current Story',
		title: content.title,
		body: content.body,
		variant: 'story',
		notices: [],
	};
}

function buildPeoplePanel( scene, content, characterId ) {
	if ( ! characterId || ! CHARACTER_PROFILES[ characterId ] ) {
		return null;
	}

	const profile = CHARACTER_PROFILES[ characterId ];
	const body = content.body.length ? content.body : profile.summary;

	return {
		id: 'people',
		label: profile.name,
		icon: profile.icon,
		eyebrow: `${ profile.name } Intel`,
		title: scene.location || profile.name,
		subtitle: profile.role,
		body,
		variant: 'people',
		notices: profile.notices,
	};
}

function buildChatterPanel( state ) {
	const feedbackParagraphs = normalizeParagraphs( state.feedback, state );
	const signal = state.latestSignal || 'The bad email is loose. The all-hands is coming.';
	const hasFeedback = feedbackParagraphs.length > 0;

	return {
		id: 'chatter',
		label: 'Chatter',
		icon: '☰',
		eyebrow: hasFeedback ? 'Latest Result' : 'Office Chatter',
		title: hasFeedback ? 'The room reacts.' : 'Chatter',
		body: hasFeedback ? feedbackParagraphs : [ signal ],
		variant: 'chatter',
		notices: hasFeedback ? [ signal ] : [],
	};
}

function buildThoughtPanel( content ) {
	return {
		id: 'thought',
		label: 'Thought',
		icon: '✣',
		eyebrow: 'Internal Thought',
		title: 'What you are thinking',
		body: content.internalThought.length ? content.internalThought : [ 'No useful thought has formed yet. This is not ideal, but it is honest.' ],
		variant: 'thought',
		notices: [],
	};
}

function buildIntelPanels( game, scene, state, content ) {
	const characterId = getSceneCharacterId( scene );
	const panels = [ buildStoryPanel( content ) ];
	const peoplePanel = buildPeoplePanel( scene, content, characterId );

	if ( peoplePanel ) {
		panels.push( peoplePanel );
	}

	panels.push( buildChatterPanel( state ) );
	panels.push( buildThoughtPanel( content ) );

	return panels;
}

function getDefaultIntelPanelId( scene, state ) {
	const feedbackParagraphs = normalizeParagraphs( state.feedback, state );

	if ( feedbackParagraphs.length && scene.id === 'hub' ) {
		return 'chatter';
	}

	if ( getSceneCharacterId( scene ) ) {
		return 'people';
	}

	return 'story';
}

function renderIntelTabs( panels ) {
	const tabsContainer = document.querySelector( '#intel-tabs' );

	if ( ! tabsContainer ) {
		return;
	}

	tabsContainer.innerHTML = panels
		.map( ( panel ) => `
			<button
				class="intel-tab${ panel.id === activeIntelPanelId ? ' intel-tab--active' : '' }"
				type="button"
				role="tab"
				aria-selected="${ panel.id === activeIntelPanelId ? 'true' : 'false' }"
				data-intel-panel="${ escapeHtml( panel.id ) }"
			>
				<span class="intel-tab__icon" aria-hidden="true">${ escapeHtml( panel.icon ) }</span>
				<span>${ escapeHtml( panel.label ) }</span>
			</button>
		` )
		.join( '' );
}

function renderNotices( notices ) {
	if ( ! notices.length ) {
		return '';
	}

	return `
		<div class="intel-notices">
			<div class="intel-notices__label">Notices</div>
			${ notices
				.map( ( notice, index ) => `
					<div class="intel-notice">
						<span class="intel-notice__icon" aria-hidden="true">${ index === 0 ? '◉' : '▧' }</span>
						<span>${ escapeHtml( notice ) }</span>
					</div>
				` )
				.join( '' ) }
		</div>
	`;
}

function renderPanelDots( panels ) {
	return `
		<div class="intel-dots" aria-hidden="true">
			${ panels
				.map( ( panel ) => `<span class="intel-dot${ panel.id === activeIntelPanelId ? ' intel-dot--active' : '' }"></span>` )
				.join( '' ) }
		</div>
	`;
}

function renderExpandButton( panel ) {
	return `
		<button
			class="intel-expand-button"
			type="button"
			data-intel-more
			aria-label="Read full ${ escapeHtml( panel.title ) }"
		>
			<span class="intel-expand-button__label">Read full</span>
			<span class="intel-expand-button__icon" aria-hidden="true">↗</span>
		</button>
	`;
}

function renderIntelPanel( panels ) {
	const panelContainer = document.querySelector( '#intel-panel' );

	if ( ! panelContainer ) {
		return;
	}

	const activePanel = panels.find( ( panel ) => panel.id === activeIntelPanelId ) || panels[ 0 ];

	panelContainer.innerHTML = `
		<button class="intel-arrow intel-arrow--previous" type="button" data-intel-direction="previous" aria-label="Previous intel panel">‹</button>

		<div class="intel-card intel-card--${ escapeHtml( activePanel.variant ) }">
			<div class="intel-card__content">
				<div class="intel-card__copy">
					<div class="intel-card__header">
						<div>
							<div class="section-label">${ escapeHtml( activePanel.eyebrow ) }</div>
							<h2 class="intel-card__title">${ escapeHtml( activePanel.title ) }</h2>
							${ activePanel.subtitle ? `<p class="intel-card__subtitle">${ escapeHtml( activePanel.subtitle ) }</p>` : '' }
						</div>

						${ renderExpandButton( activePanel ) }
					</div>

					<div class="intel-card__scroll" tabindex="0">
						<div class="intel-card__body">
							${ renderParagraphs( activePanel.body ) }
						</div>

						${ renderNotices( activePanel.notices ) }
					</div>
				</div>
			</div>

			${ renderPanelDots( panels ) }
		</div>

		<button class="intel-arrow intel-arrow--next" type="button" data-intel-direction="next" aria-label="Next intel panel">›</button>
	`;
}

function renderChoices( game, scene ) {
	const choicesContainer = document.querySelector( '#choices' );

	if ( ! choicesContainer ) {
		return;
	}

	if ( scene.id === game.story.finaleSceneId ) {
		choicesContainer.className = 'choices-panel';
		choicesContainer.innerHTML = '';
		return;
	}

	const choices = game.getAvailableChoices( scene );
	const isMainNavigation = isMainNavigationChoiceSet( choices );

	choicesContainer.className = `choices-panel ${ isMainNavigation ? 'choices-panel--grid' : 'choices-panel--stacked' }`;

	if ( ! choices.length ) {
		choicesContainer.innerHTML = '<p class="empty-state">No useful moves are available here. That is rarely comforting.</p>';
		return;
	}

	choicesContainer.innerHTML = choices
		.map( ( choice ) => {
			const category = getChoiceCategory( choice );

			return `
				<button class="choice-button choice-button--${ escapeHtml( category ) }" type="button" data-choice-id="${ escapeHtml( choice.id ) }">
					<span class="choice-button__icon" aria-hidden="true">${ escapeHtml( getChoiceIcon( choice ) ) }</span>
					<span class="choice-button__text">${ escapeHtml( choice.text ) }</span>
					<span class="choice-button__chevron" aria-hidden="true">›</span>
				</button>
			`;
		} )
		.join( '' );
}

function renderStatusSummary( game, state ) {
	const plansContainer = document.querySelector( '#plans-summary' );
	const watchingContainer = document.querySelector( '#watching-summary' );
	const heatContainer = document.querySelector( '#heat-summary' );

	const topPlan = getTopStatusBar( game.story.bars.green, state );
	const topWatching = getTopStatusBar( game.story.bars.red, state );
	const topHeatValue = Math.max( ...game.story.bars.red.map( ( bar ) => state.bars[ bar.id ] || 0 ), 0 );
	const heatLabel = getHeatLabel( topHeatValue );

	if ( plansContainer ) {
		plansContainer.innerHTML = topPlan
			? `
				<div class="status-summary__heading">Plans</div>
				<div class="status-summary__row">
					<strong>${ escapeHtml( topPlan.label ) }</strong>
					<span>${ topPlan.value }%</span>
				</div>
				<div class="progress-track" aria-hidden="true">
					<div class="progress-fill progress-fill--green" style="width: ${ topPlan.value }%;"></div>
				</div>
			`
			: `
				<div class="status-summary__heading">Plans</div>
				<p class="empty-state empty-state--compact">Nothing active yet.</p>
			`;
	}

	if ( watchingContainer ) {
		watchingContainer.innerHTML = topWatching
			? `
				<div class="status-summary__heading">Watching You</div>
				<div class="status-summary__row">
					<strong>${ escapeHtml( topWatching.label.replace( /\s*(Suspects You|Finds Out|Retaliates|Loses Trust|Escalates)$/i, '' ) ) }</strong>
					<span>${ topWatching.value }%</span>
				</div>
				<div class="watch-meter" aria-label="${ escapeHtml( topWatching.label ) } at ${ topWatching.value } percent">
					${ [ 20, 40, 60, 80, 100 ].map( ( point ) => `<span class="watch-meter__eye${ topWatching.value >= point ? ' watch-meter__eye--active' : '' }">●</span>` ).join( '' ) }
				</div>
			`
			: `
				<div class="status-summary__heading">Watching You</div>
				<p class="empty-state empty-state--compact">Nothing active yet.</p>
			`;
	}

	if ( heatContainer ) {
		heatContainer.innerHTML = `
			<div class="status-summary__heading status-summary__heading--heat">Heat</div>
			<div class="status-summary__row">
				<strong>${ escapeHtml( heatLabel ) }</strong>
				<span>${ topHeatValue }%</span>
			</div>
			<div class="progress-track" aria-hidden="true">
				<div class="progress-fill progress-fill--red" style="width: ${ topHeatValue }%;"></div>
			</div>
		`;
	}
}

function renderHeader( game, state ) {
	const phaseLabel = document.querySelector( '#phase-label' );
	const turnCount = document.querySelector( '#turn-count' );
	const clockLabel = document.querySelector( '#clock-label' );
	const timeTrack = document.querySelector( '#office-time-track' );
	const phase = game.getPhase();
	const clockTime = getClockTime( state );

	if ( phaseLabel ) {
		phaseLabel.textContent = phase.label;
	}

	if ( turnCount ) {
		turnCount.textContent = clockTime;
	}

	if ( clockLabel ) {
		clockLabel.textContent = getClockLabel( state, clockTime );
	}

	if ( timeTrack ) {
		timeTrack.style.setProperty( '--clock-progress', `${ getClockProgress( state ) }%` );
	}
}

function closeIntelModal() {
	const existingModal = document.querySelector( '#intel-modal' );

	if ( existingModal ) {
		existingModal.remove();
	}

	document.body.classList.remove( 'has-intel-modal' );
	document.removeEventListener( 'keydown', handleIntelModalKeydown );
}

function handleIntelModalKeydown( event ) {
	if ( event.key === 'Escape' ) {
		closeIntelModal();
	}
}

function openIntelModal( panel ) {
	closeIntelModal();

	const modalMarkup = `
		<div id="intel-modal" class="intel-modal" role="dialog" aria-modal="true" aria-labelledby="intel-modal-title">
			<div class="intel-modal__backdrop" data-intel-modal-close></div>

			<div class="intel-modal__dialog">
				<div class="intel-modal__header">
					<div>
						<div class="section-label">${ escapeHtml( panel.eyebrow ) }</div>
						<h2 id="intel-modal-title" class="intel-modal__title">${ escapeHtml( panel.title ) }</h2>
						${ panel.subtitle ? `<p class="intel-card__subtitle">${ escapeHtml( panel.subtitle ) }</p>` : '' }
					</div>

					<button class="intel-modal__close" type="button" data-intel-modal-close aria-label="Close intel panel">×</button>
				</div>

				<div class="intel-modal__body">
					${ renderParagraphs( panel.body ) }
					${ renderNotices( panel.notices ) }
				</div>
			</div>
		</div>
	`;

	document.body.insertAdjacentHTML( 'beforeend', modalMarkup );
	document.body.classList.add( 'has-intel-modal' );
	document.addEventListener( 'keydown', handleIntelModalKeydown );

	document.querySelectorAll( '[data-intel-modal-close]' ).forEach( ( closeButton ) => {
		closeButton.addEventListener( 'click', closeIntelModal );
	} );
}

function activateIntelPanel( panelId ) {
	activeIntelPanelId = panelId;

	if ( latestGame ) {
		render( latestGame );
	}
}

function activateAdjacentIntelPanel( direction ) {
	if ( ! latestGame ) {
		return;
	}

	const state = latestGame.getState();
	const scene = latestGame.getCurrentScene();
	const content = getResolvedSceneContent( latestGame, scene, state );
	const panels = buildIntelPanels( latestGame, scene, state, content );
	const currentIndex = Math.max( panels.findIndex( ( panel ) => panel.id === activeIntelPanelId ), 0 );
	const offset = direction === 'previous' ? -1 : 1;
	const nextIndex = ( currentIndex + offset + panels.length ) % panels.length;

	activateIntelPanel( panels[ nextIndex ].id );
}

function bindIntelControls() {
	document.querySelectorAll( '[data-intel-panel]' ).forEach( ( button ) => {
		button.addEventListener( 'click', () => {
			activateIntelPanel( button.dataset.intelPanel );
		} );
	} );

	document.querySelectorAll( '[data-intel-direction]' ).forEach( ( button ) => {
		button.addEventListener( 'click', () => {
			activateAdjacentIntelPanel( button.dataset.intelDirection );
		} );
	} );

	document.querySelectorAll( '[data-intel-more]' ).forEach( ( button ) => {
		button.addEventListener( 'click', () => {
			const activePanel = latestPanels.find( ( panel ) => panel.id === activeIntelPanelId ) || latestPanels[ 0 ];

			if ( activePanel ) {
				openIntelModal( activePanel );
			}
		} );
	} );
}

export function render( game ) {
	latestGame = game;

	const state = game.getState();
	const scene = game.getCurrentScene();
	const content = getResolvedSceneContent( game, scene, state );

	if ( scene.id !== lastRenderedSceneId ) {
		activeIntelPanelId = getDefaultIntelPanelId( scene, state );
		lastRenderedSceneId = scene.id;
	}

	const panels = buildIntelPanels( game, scene, state, content );

	if ( ! panels.some( ( panel ) => panel.id === activeIntelPanelId ) ) {
		activeIntelPanelId = panels[ 0 ].id;
	}

	latestPanels = panels;

	renderHeader( game, state );
	renderIntelTabs( panels );
	renderIntelPanel( panels );
	renderChoices( game, scene );
	renderStatusSummary( game, state );
	bindIntelControls();
}
