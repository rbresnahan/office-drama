import { storyConfig } from './config.js';
import { bars } from './bars.js';
import { schedule } from './schedule.js';
import { visibleAftermathBeats } from './aftermath.js';
import { backlashRules } from './backlash-rules.js';
import { forcedRules } from './forced-rules.js';

import intro from './scenes/intro.js';
import hub from './scenes/hub.js';
import conferenceRoom from './scenes/conference-room.js';
import {
	scheduleAfternoonMeeting,
	scheduleLunch,
	scheduleMorningMeeting,
} from './scenes/scheduled-events.js';
import {
	forcedCeliaLooksUp,
	forcedDevonFrankStoryMutated,
	forcedDevonLisaAskingFrank,
	forcedFrankHearsHisName,
	forcedLisaProcessCheck,
	forcedTimTimelineQuestion,
} from './scenes/forced-scenes.js';
import bettyDesk from './scenes/betty-desk.js';
import timDesk from './scenes/tim-desk.js';
import frankDesk from './scenes/frank-desk.js';
import breakRoom from './scenes/break-room.js';
import supplyCloset from './scenes/supply-closet.js';
import celiaArea from './scenes/celia-area.js';
import lisaArea from './scenes/lisa-area.js';
import bathroomHallway from './scenes/bathroom-hallway.js';
import {
	backlashBetty,
	backlashCelia,
	backlashFrank,
	backlashLisa,
	backlashTim,
} from './scenes/backlash-scenes.js';
import {
	allHandsIntro,
	finalAllHands,
} from './scenes/all-hands.js';
import { resolveFinale } from './finale/resolve-finale.js';

export const OFFICE_PANIC_STORY = {
	...storyConfig,
	visibleAftermathBeats,
	schedule,
	bars,
	backlashRules,
	forcedRules,
	scenes: {
		intro,
		hub,
		conference_room: conferenceRoom,
		schedule_morning_meeting: scheduleMorningMeeting,
		schedule_lunch: scheduleLunch,
		schedule_afternoon_meeting: scheduleAfternoonMeeting,
		forced_lisa_process_check: forcedLisaProcessCheck,
		forced_celia_looks_up: forcedCeliaLooksUp,
		forced_devon_lisa_asking_frank: forcedDevonLisaAskingFrank,
		forced_devon_frank_story_mutated: forcedDevonFrankStoryMutated,
		forced_frank_hears_his_name: forcedFrankHearsHisName,
		forced_tim_timeline_question: forcedTimTimelineQuestion,
		betty_desk: bettyDesk,
		tim_desk: timDesk,
		frank_desk: frankDesk,
		break_room: breakRoom,
		supply_closet: supplyCloset,
		celia_area: celiaArea,
		lisa_area: lisaArea,
		bathroom_hallway: bathroomHallway,
		backlash_tim: backlashTim,
		backlash_frank: backlashFrank,
		backlash_betty: backlashBetty,
		backlash_celia: backlashCelia,
		backlash_lisa: backlashLisa,
		all_hands_intro: allHandsIntro,
		final_all_hands: finalAllHands,
	},
	resolveFinale,
};
