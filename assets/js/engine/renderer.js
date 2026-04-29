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

function normalizeParagraphs( value, state ) {
	const resolved = typeof value === 'function' ? value( state ) : value;

	if ( Array.isArray( resolved ) ) {
		return resolved;
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

function renderBars( container, bars, state, type ) {
	if ( ! container ) {
		return;
	}

	const html = bars
		.filter( ( bar ) => {
			const value = state.bars[ bar.id ] || 0;

			return value >= 25;
		} )
		.map( ( bar ) => {
			const value = state.bars[ bar.id ] || 0;

			return `
				<div class="progress-card progress-card--${ type }">
					<div class="progress-card__header">
						<span>${ escapeHtml( bar.label ) }</span>
						<span class="progress-card__value">${ value }%</span>
					</div>
					<div class="progress-track" aria-hidden="true">
						<div class="progress-fill" style="width: ${ value }%;"></div>
					</div>
				</div>
			`;
		} )
		.join( '' );

	container.innerHTML = html || '<p class="empty-state">Nothing active yet.</p>';
}

function renderStory( content ) {
	const storyContainer = document.querySelector( '#story' );

	if ( ! storyContainer ) {
		return;
	}

	storyContainer.innerHTML = `
		${ content.kicker ? `<div class="story-kicker">${ escapeHtml( content.kicker ) }</div>` : '' }
		<h2 class="story-title">${ escapeHtml( content.title ) }</h2>
		<div class="story-body">
			${ renderParagraphs( content.body ) }
		</div>
	`;
}

function renderInternalThought( internalThought ) {
	const internalThoughtContainer = document.querySelector( '#internal-thought' );

	if ( ! internalThoughtContainer ) {
		return;
	}

	if ( ! internalThought.length ) {
		internalThoughtContainer.classList.add( 'internal-thought-card--hidden' );
		internalThoughtContainer.innerHTML = '';
		return;
	}

	internalThoughtContainer.classList.remove( 'internal-thought-card--hidden' );
	internalThoughtContainer.innerHTML = `
		<div class="internal-thought-card__label">Internal Thought</div>
		<div class="internal-thought-card__body">
			${ renderParagraphs( internalThought ) }
		</div>
	`;
}

function renderChoices( game, scene ) {
	const choicesContainer = document.querySelector( '#choices' );

	if ( ! choicesContainer ) {
		return;
	}

	if ( scene.id === game.story.finaleSceneId ) {
		choicesContainer.innerHTML = '';
		return;
	}

	const choices = game.getAvailableChoices( scene );

	if ( ! choices.length ) {
		choicesContainer.innerHTML = '<p class="empty-state">No useful moves are available here. That is rarely comforting.</p>';
		return;
	}

	choicesContainer.innerHTML = choices
		.map( ( choice ) => {
			const category = Array.isArray( choice.category ) ? choice.category[ 0 ] : choice.category;

			return `
				<button class="choice-button choice-button--${ escapeHtml( category || 'neutral' ) }" type="button" data-choice-id="${ escapeHtml( choice.id ) }">
					<span>${ escapeHtml( choice.text ) }</span>
				</button>
			`;
		} )
		.join( '' );
}

function renderFeedback( state ) {
	const feedback = document.querySelector( '#action-feedback' );

	if ( ! feedback ) {
		return;
	}

	const feedbackParagraphs = normalizeParagraphs( state.feedback, state );

	if ( ! feedbackParagraphs.length ) {
		feedback.classList.add( 'reaction-card--hidden' );
		feedback.textContent = '';
		return;
	}

	feedback.classList.remove( 'reaction-card--hidden' );
	feedback.innerHTML = renderParagraphs( feedbackParagraphs );
}

function renderHeader( game, state ) {
	const phaseLabel = document.querySelector( '#phase-label' );
	const turnCount = document.querySelector( '#turn-count' );
	const clockLabel = document.querySelector( '#clock-label' );
	const latestSignal = document.querySelector( '#latest-signal .signal-strip__text' );
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

	if ( latestSignal ) {
		latestSignal.textContent = state.latestSignal || 'The bad email is loose. The all-hands is coming.';
	}
}

export function render( game ) {
	const state = game.getState();
	const scene = game.getCurrentScene();
	const content = getResolvedSceneContent( game, scene, state );

	renderHeader( game, state );
	renderBars( document.querySelector( '#green-bars' ), game.story.bars.green, state, 'green' );
	renderBars( document.querySelector( '#red-bars' ), game.story.bars.red, state, 'red' );
	renderStory( content );
	renderInternalThought( content.internalThought );
	renderFeedback( state );
	renderChoices( game, scene );
}