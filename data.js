export const APP_DATA = {
	title: 'Reply All',
	eyebrow: 'Delay discovery. Shape the room. Survive the reveal.',
	subtitle:
		'You sent a bad email about one coworker. Recall only partly worked. Keep them from finding out too early—and if they do, survive the fallout.',
};

export const DEFAULT_MEMORY_TUNING = {
	baseDecay: 10,
	stressMultiplier: 2,
	preservedDecay: 3,
	highImportanceAdjustment: -2,
	signalLimit: 8,
};

export const DEFAULT_ISSUE_TUNING = {
	basePrecisionDecay: 6,
	overloadPrecisionPenalty: 4,
	containmentDecay: 5,
	maxTransfersPerIssue: 2,
};