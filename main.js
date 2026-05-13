import { startApp } from './assets/js/app.js';
import { OFFICE_PANIC_STORY } from './assets/stories/demo-story.js';

// Temporary playtesting guard.
// Set to false or remove before release.
const ENABLE_TESTING_NAVIGATION_GUARD = true;

if ( ENABLE_TESTING_NAVIGATION_GUARD ) {
	window.addEventListener( 'beforeunload', ( event ) => {
		event.preventDefault();

		// Required for browser-native "Leave site?" confirmation.
		// Modern browsers ignore custom text and show their own message.
		event.returnValue = '';
	} );
}

startApp( OFFICE_PANIC_STORY );