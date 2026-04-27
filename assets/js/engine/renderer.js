import { categoryLabel } from './story-helpers.js';

function escapeHtml( value ) {
	return String( value )
		.replaceAll( '&', '&amp;' )
		.replaceAll( '<', '&lt;' )
		.replaceAll( '>', '&gt;' )
		.replaceAll( '"', '&quot;' )
		.replaceAll( "'", '&#039;' );
}

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

function renderStory( game, scene, state ) {
	const storyContainer = document.querySelector( '#story' );

	if ( ! storyContainer ) {
		return;
	}

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

	storyContainer.innerHTML = `
		${ kicker ? `<div class="story-kicker">${ escapeHtml( kicker ) }</div>` : '' }
		<h2 class="story-title">${ escapeHtml( title ) }</h2>
		<div class="story-body">
			${ renderParagraphs( body ) }
			${ internalThought.length ? `<div class="internal-thought">${ renderParagraphs( internalThought ) }</div>` : '' }
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
			const label = categoryLabel( category );

			return `
				<button class="choice-button choice-button--${ escapeHtml( category || 'neutral' ) }" type="button" data-choice-id="${ escapeHtml( choice.id ) }">
					<span class="choice-button__category">${ escapeHtml( label ) }</span>
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

	if ( ! state.feedback ) {
		feedback.classList.add( 'reaction-card--hidden' );
		feedback.textContent = '';
		return;
	}

	feedback.classList.remove( 'reaction-card--hidden' );
	feedback.textContent = state.feedback;
}

function renderHeader( game, state ) {
	const phaseLabel = document.querySelector( '#phase-label' );
	const turnCount = document.querySelector( '#turn-count' );
	const latestSignal = document.querySelector( '#latest-signal .signal-strip__text' );
	const phase = game.getPhase();

	if ( phaseLabel ) {
		phaseLabel.textContent = phase.label;
	}

	if ( turnCount ) {
		const currentTurn = Math.min( state.turn, state.maxTurns );
		turnCount.textContent = state.finaleStarted ? 'All-Hands' : `Turn ${ currentTurn } / ${ state.maxTurns }`;
	}

	if ( latestSignal ) {
		latestSignal.textContent = state.latestSignal || 'The bad email is loose. The all-hands is coming.';
	}
}

export function render( game ) {
	const state = game.getState();
	const scene = game.getCurrentScene();

	renderHeader( game, state );
	renderBars( document.querySelector( '#green-bars' ), game.story.bars.green, state, 'green' );
	renderBars( document.querySelector( '#red-bars' ), game.story.bars.red, state, 'red' );
	renderStory( game, scene, state );
	renderFeedback( state );
	renderChoices( game, scene );
}