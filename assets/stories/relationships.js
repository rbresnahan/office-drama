function clone(value) {
	return JSON.parse(JSON.stringify(value));
}

export const RELATIONSHIP_SEEDS = [
	{
		pairId: 'betty_tim',
		leftId: 'betty',
		rightId: 'tim',
		bondStrength: 90,
		sentimentTransferStrength: 80,
		isMutual: true,
		isActive: true,
		strain: 0,
		isolatedUntilTurn: null,
	},
	{
		pairId: 'frank_celia',
		leftId: 'frank',
		rightId: 'celia',
		bondStrength: 75,
		sentimentTransferStrength: 60,
		isMutual: true,
		isActive: true,
		strain: 0,
		isolatedUntilTurn: null,
	},
	{
		pairId: 'lisa_player',
		leftId: 'lisa',
		rightId: 'player',
		bondStrength: 80,
		sentimentTransferStrength: 70,
		isMutual: true,
		isActive: true,
		strain: 0,
		isolatedUntilTurn: null,
	},
	{
		pairId: 'devon_office',
		leftId: 'devon',
		rightId: 'office',
		bondStrength: 20,
		sentimentTransferStrength: 15,
		isMutual: false,
		isActive: true,
		strain: 0,
		isolatedUntilTurn: null,
	},
];

export function createRelationshipSeeds() {
	return RELATIONSHIP_SEEDS.map((seed) => clone(seed));
}