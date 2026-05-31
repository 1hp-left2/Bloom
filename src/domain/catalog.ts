import { EcosystemId, HabitDifficulty, NotificationKind, SeasonId, SeasonalEvent } from './types';

export const ecosystemLabels: Record<EcosystemId, string> = {
  forest: 'Forest',
  garden: 'Flower Garden',
  pond: 'Pond',
  meadow: 'Wildlife Meadow'
};

export const ecosystemIcons: Record<EcosystemId, string> = {
  forest: '🌲',
  garden: '🌸',
  pond: '💧',
  meadow: '🦋'
};

export const habitCategories: Array<{ label: string; ecosystemId: EcosystemId }> = [
  { label: 'Exercise', ecosystemId: 'forest' },
  { label: 'Walking', ecosystemId: 'forest' },
  { label: 'Running', ecosystemId: 'forest' },
  { label: 'Sports', ecosystemId: 'forest' },
  { label: 'Reading', ecosystemId: 'garden' },
  { label: 'Studying', ecosystemId: 'garden' },
  { label: 'Journaling', ecosystemId: 'garden' },
  { label: 'Learning', ecosystemId: 'garden' },
  { label: 'Water Intake', ecosystemId: 'pond' },
  { label: 'Sleep', ecosystemId: 'pond' },
  { label: 'Nutrition', ecosystemId: 'pond' },
  { label: 'Meditation', ecosystemId: 'meadow' },
  { label: 'Gratitude', ecosystemId: 'meadow' },
  { label: 'Reflection', ecosystemId: 'meadow' },
  { label: 'Mindfulness', ecosystemId: 'meadow' }
];

export const growthByDifficulty: Record<HabitDifficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30
};

export const ecosystemProgression: Record<EcosystemId, Array<{ level: number; name: string }>> = {
  forest: [
    { level: 1, name: 'Sapling' },
    { level: 3, name: 'Small Tree' },
    { level: 5, name: 'Mushrooms' },
    { level: 10, name: 'Forest Clearing' },
    { level: 15, name: 'Foxes' },
    { level: 20, name: 'Dense Woodland' },
    { level: 30, name: 'Ancient Forest' }
  ],
  garden: [
    { level: 1, name: 'Single Flower' },
    { level: 3, name: 'Flower Patch' },
    { level: 5, name: 'Butterflies' },
    { level: 10, name: 'Rare Flowers' },
    { level: 15, name: 'Garden Paths' },
    { level: 20, name: 'Botanical Garden' },
    { level: 30, name: 'Legendary Blossoms' }
  ],
  pond: [
    { level: 1, name: 'Puddle' },
    { level: 3, name: 'Pond' },
    { level: 5, name: 'Frog' },
    { level: 10, name: 'Fish' },
    { level: 15, name: 'Waterfall' },
    { level: 20, name: 'Large Lake' },
    { level: 30, name: 'Crystal Oasis' }
  ],
  meadow: [
    { level: 1, name: 'Grassland' },
    { level: 3, name: 'Wildflowers' },
    { level: 5, name: 'Butterflies' },
    { level: 10, name: 'Birds' },
    { level: 15, name: 'Fireflies' },
    { level: 20, name: 'Deer' },
    { level: 30, name: 'Wildlife Sanctuary' }
  ]
};

export const expansionCatalog = [
  { levelRequired: 1, name: 'Starter Garden', rewards: ['Tiny clearing', 'First moss path'] },
  { levelRequired: 5, name: 'Forest Edge', rewards: ['Forest border', 'Sparrow perch'] },
  { levelRequired: 10, name: 'Stone Bridge', rewards: ['Stone bridge', 'Creek bend'] },
  { levelRequired: 15, name: 'Hidden Grove', rewards: ['Secret grove', 'Lantern stump'] },
  { levelRequired: 20, name: 'Lakeside District', rewards: ['Lake shore', 'Reed clusters'] },
  { levelRequired: 30, name: 'Mountain Trail', rewards: ['Mountain path', 'Pine overlook'] },
  { levelRequired: 50, name: 'Nature Reserve', rewards: ['Large reserve', 'Ranger sign'] },
  { levelRequired: 75, name: 'Mosslight Valley', rewards: ['Valley panorama', 'Valley wildlife'] },
  { levelRequired: 100, name: 'Living Paradise', rewards: ['Full paradise', 'Sanctuary halo'] }
];

export const rareDiscoveryCatalog = [
  { name: 'Golden Butterfly', ecosystemId: 'meadow' as EcosystemId, rarity: 'rare' as const, artworkRef: 'art/discoveries/golden-butterfly.svg', baseProbability: 0.08 },
  { name: 'Albino Deer', ecosystemId: 'meadow' as EcosystemId, rarity: 'legendary' as const, artworkRef: 'art/discoveries/albino-deer.svg', baseProbability: 0.025 },
  { name: 'Moonlight Flower', ecosystemId: 'garden' as EcosystemId, rarity: 'rare' as const, artworkRef: 'art/discoveries/moonlight-flower.svg', baseProbability: 0.06 },
  { name: 'Ancient Oak', ecosystemId: 'forest' as EcosystemId, rarity: 'legendary' as const, artworkRef: 'art/discoveries/ancient-oak.svg', baseProbability: 0.025 },
  { name: 'Crystal Lily', ecosystemId: 'pond' as EcosystemId, rarity: 'rare' as const, artworkRef: 'art/discoveries/crystal-lily.svg', baseProbability: 0.05 }
];

export const notificationKinds: NotificationKind[] = ['daily_reminder', 'habit_reminder', 'milestone', 'expansion', 'discovery', 'friend', 'seasonal'];

export const seasonalEvents: SeasonalEvent[] = [
  { id: 'spring_cherry_blossom', season: 'spring', title: 'Cherry Blossom Festival', startsOn: '03-01', endsOn: '05-31', plants: ['Cherry blossoms', 'Moon ferns'], colors: ['#E9B7B7', '#A7BE9B'], wildlife: ['Butterflies', 'Songbirds'], decorations: ['Petal lantern', 'Picnic blanket'], ambientEffects: ['petals', 'soft breeze'] },
  { id: 'summer_firefly_nights', season: 'summer', title: 'Summer Firefly Nights', startsOn: '06-01', endsOn: '08-31', plants: ['Lotus', 'Sun grass'], colors: ['#A7D8DE', '#D7A84D'], wildlife: ['Fireflies', 'Frogs'], decorations: ['Wind chime', 'Reed lamp'], ambientEffects: ['fireflies', 'water ripples'] },
  { id: 'autumn_harvest', season: 'autumn', title: 'Harvest Festival', startsOn: '09-01', endsOn: '11-30', plants: ['Maple leaves', 'Amber mushrooms'], colors: ['#D7A84D', '#9A6B45'], wildlife: ['Foxes', 'Owls'], decorations: ['Harvest basket', 'Leaf arch'], ambientEffects: ['falling leaves', 'warm haze'] },
  { id: 'winter_wonderland', season: 'winter', title: 'Winter Wonderland', startsOn: '12-01', endsOn: '02-28', plants: ['Snow moss', 'Frost pine'], colors: ['#F7F4EA', '#A7D8DE'], wildlife: ['Deer', 'Robins'], decorations: ['Snow lantern', 'Cozy bench'], ambientEffects: ['snow drift', 'frost sparkle'] }
];

export function seasonForDate(date = new Date()): SeasonId {
  const month = date.getUTCMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}
