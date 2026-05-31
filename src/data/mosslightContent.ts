import { EcosystemId } from '../game/mosslight';
import { palette } from '../styles/theme';

export type Habit = {
  id: string;
  title: string;
  ecosystem: EcosystemId;
  difficulty: 'easy' | 'medium' | 'hard';
  progress: string;
  completed: boolean;
  icon: string;
};

export const ecosystems: Array<{
  id: EcosystemId;
  label: string;
  level: number;
  growth: number;
  color: string;
  icon: string;
  description: string;
}> = [
  { id: 'forest', label: 'Forest', level: 12, growth: 1180, color: palette.forest, icon: '🌲', description: 'Exercise, walking, running, and sports grow trees, mushrooms, foxes, birds, and soft woodland paths.' },
  { id: 'garden', label: 'Flower Garden', level: 8, growth: 760, color: palette.blush, icon: '🌸', description: 'Reading, studying, journaling, and learning bloom into flowers, blossoms, decorations, and rare plants.' },
  { id: 'pond', label: 'Pond', level: 7, growth: 690, color: palette.pond, icon: '💧', description: 'Water, sleep, and nutrition invite fish, frogs, lily pads, waterfalls, and clear reflections.' },
  { id: 'meadow', label: 'Wildlife Meadow', level: 6, growth: 520, color: palette.lavender, icon: '🦋', description: 'Meditation, gratitude, reflection, and mindfulness call butterflies, rabbits, fireflies, and deer.' }
];

export const todayHabits: Habit[] = [
  { id: 'water', title: 'Drink Water', ecosystem: 'pond', difficulty: 'easy', progress: '0/8 cups', completed: false, icon: '💧' },
  { id: 'read', title: 'Read 20 Minutes', ecosystem: 'garden', difficulty: 'medium', progress: '20/20 min', completed: true, icon: '🌸' },
  { id: 'exercise', title: 'Exercise', ecosystem: 'forest', difficulty: 'hard', progress: '0/1 session', completed: false, icon: '🌲' },
  { id: 'meditate', title: 'Meditate', ecosystem: 'meadow', difficulty: 'easy', progress: '0/10 min', completed: false, icon: '🦋' }
];

export const rareDiscoveries = ['Golden Butterfly', 'Albino Deer', 'Moonlight Flower', 'Ancient Oak', 'Firefly Swarm', 'Crystal Lily'];

export const friends = [
  { name: "Luna's Garden", level: 18, note: 'Left you sunshine', avatar: '🦊' },
  { name: "Kai's Sanctuary", level: 15, note: 'New waterfall', avatar: '🐸' },
  { name: "Milo's Meadow", level: 12, note: 'Firefly night', avatar: '🐰' },
  { name: "Sage's World", level: 10, note: 'Needs water drops', avatar: '🦌' }
];

export const shopItems = [
  { title: 'Moon Fern', price: '500', tag: 'Plants', icon: '🌿' },
  { title: 'Firefly Bush', price: '650', tag: 'Decor', icon: '✨' },
  { title: 'Stone Path', price: '300', tag: 'Decor', icon: '🪨' },
  { title: 'Rainbow Tree', price: 'Premium', tag: 'Plants', icon: '🌳' },
  { title: 'Lotus Pond', price: 'Premium', tag: 'Water', icon: '🪷' },
  { title: 'Wind Lantern', price: 'Premium', tag: 'Decor', icon: '🏮' }
];

export const onboarding = [
  { headline: 'Small habits. Gentle growth.', body: 'Begin with a tiny clearing and let everyday care become a living sanctuary.', icon: '🌱' },
  { headline: 'Every habit helps nature thrive.', body: 'Fitness feeds forests, learning grows gardens, wellness fills ponds, and mindfulness welcomes wildlife.', icon: '🌿' },
  { headline: 'Build your own sanctuary.', body: 'Unlock handcrafted habitats, rare discoveries, seasonal moments, and soft surprises.', icon: '🗺️' },
  { headline: 'Grow together.', body: 'Visit friend gardens, leave water drops or sunshine, and celebrate without rankings.', icon: '🤝' }
];
