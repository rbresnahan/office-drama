import { createGame } from './engine/game.js';
import { render } from './engine/renderer.js';

export function startApp( story ) {
	const game = createGame( story );

	document.addEventListener( 'click', ( event ) => {
		const choiceButton = event.target.closest( '[data-choice-id]' );

		if ( ! choiceButton ) {
			return;
		}

		game.choose( choiceButton.dataset.choiceId );
		render( game );
	} );

	const restartButton = document.querySelector( '#restart-game' );

	if ( restartButton ) {
		restartButton.addEventListener( 'click', () => {
			game.restart();
			render( game );
		} );
	}

	render( game );
}