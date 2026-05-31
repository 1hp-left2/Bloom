export type EcosystemId = 'forest' | 'garden' | 'pond' | 'meadow';
export type HabitDifficulty = 'easy' | 'medium' | 'hard';

export const growthByDifficulty: Record<HabitDifficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30
};

export function streakMultiplier(streakDays: number): number {
  if (streakDays >= 365) return 3;
  if (streakDays >= 90) return 2;
  if (streakDays >= 30) return 1.5;
  if (streakDays >= 14) return 1.25;
  if (streakDays >= 7) return 1.1;
  return 1;
}

export function calculateGrowth(difficulty: HabitDifficulty, streakDays: number): number {
  return Math.round(growthByDifficulty[difficulty] * streakMultiplier(streakDays));
}

export function levelFromGrowth(growth: number): number {
  return Math.max(1, Math.floor(growth / 100) + 1);
}

export const ecosystemProgression: Record<EcosystemId, Array<{ level: number; reward: string }>> = {
  forest: [
    { level: 1, reward: 'Sapling' },
    { level: 3, reward: 'Small Tree' },
    { level: 5, reward: 'Mushrooms' },
    { level: 10, reward: 'Forest Clearing' },
    { level: 15, reward: 'Foxes' },
    { level: 20, reward: 'Dense Woodland' },
    { level: 30, reward: 'Ancient Forest' }
  ],
  garden: [
    { level: 1, reward: 'Single Flower' },
    { level: 3, reward: 'Flower Patch' },
    { level: 5, reward: 'Butterflies' },
    { level: 10, reward: 'Rare Flowers' },
    { level: 15, reward: 'Garden Paths' },
    { level: 20, reward: 'Botanical Garden' },
    { level: 30, reward: 'Legendary Blossoms' }
  ],
  pond: [
    { level: 1, reward: 'Puddle' },
    { level: 3, reward: 'Pond' },
    { level: 5, reward: 'Frog' },
    { level: 10, reward: 'Fish' },
    { level: 15, reward: 'Waterfall' },
    { level: 20, reward: 'Large Lake' },
    { level: 30, reward: 'Crystal Oasis' }
  ],
  meadow: [
    { level: 1, reward: 'Grassland' },
    { level: 3, reward: 'Wildflowers' },
    { level: 5, reward: 'Butterflies' },
    { level: 10, reward: 'Birds' },
    { level: 15, reward: 'Fireflies' },
    { level: 20, reward: 'Deer' },
    { level: 30, reward: 'Wildlife Sanctuary' }
  ]
};

export const expansionMilestones = [
  { level: 1, name: 'Starter Garden' },
  { level: 5, name: 'Forest Edge' },
  { level: 10, name: 'Stone Bridge' },
  { level: 15, name: 'Hidden Grove' },
  { level: 20, name: 'Lakeside District' },
  { level: 30, name: 'Mountain Trail' },
  { level: 50, name: 'Nature Reserve' },
  { level: 75, name: 'Mosslight Valley' },
  { level: 100, name: 'Living Paradise' }
];

export function unlockedRewards(ecosystem: EcosystemId, level: number): string[] {
  return ecosystemProgression[ecosystem]
    .filter((item) => item.level <= level)
    .map((item) => item.reward);
}

export function nextExpansion(level: number): { level: number; name: string } | undefined {
  return expansionMilestones.find((milestone) => milestone.level > level);
}
