import { createGame } from './engine/game.js';
import { render } from './engine/renderer.js';

function prefersReducedMotion() {
	return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
}

function isMobileViewport() {
	return window.matchMedia( '(max-width: 900px)' ).matches;
}

function resetLocalScrollAreas() {
	document.querySelectorAll( '.intel-card__scroll, .choices-panel--stacked' ).forEach( ( element ) => {
		element.scrollTop = 0;
	} );
}

function scrollBackToTop() {
	if ( ! isMobileViewport() ) {
		return;
	}

	requestAnimationFrame( () => {
		resetLocalScrollAreas();

		window.scrollTo( {
			top: 0,
			behavior: prefersReducedMotion() ? 'auto' : 'smooth',
		} );
	} );
}

export function startApp( story ) {
	const game = createGame( story );

	document.addEventListener( 'click', ( event ) => {
		const choiceButton = event.target.closest( '[data-choice-id]' );

		if ( ! choiceButton ) {
			return;
		}

		game.choose( choiceButton.dataset.choiceId );
		render( game );
		scrollBackToTop();
	} );

	const restartButton = document.querySelector( '#restart-game' );

	if ( restartButton ) {
		restartButton.addEventListener( 'click', () => {
			game.restart();
			render( game );
			scrollBackToTop();
		} );
	}

	render( game );
}