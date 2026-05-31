import { ecosystemProgression, notificationKinds, seasonalEvents } from '../domain/catalog';
import { EcosystemId, EcosystemState, MosslightState, Profile } from '../domain/types';
import { createInitialExpansions } from '../engines/progressionEngine';
import { createHabit } from '../engines/habitEngine';
import { nowISO } from '../utils/date';

const userId = 'local_user';
const timestamp = nowISO();

export function createInitialProfile(): Profile {
  return {
    id: userId,
    displayName: 'New Gardener',
    sanctuaryName: 'Mosslight Clearing',
    avatarEmoji: '🌱',
    premiumUntil: undefined,
    sanctuaryLevel: 1,
    sanctuaryXp: 0,
    currentStreak: 0,
    bestStreak: 0,
    notificationPreferences: notificationKinds.map((kind) => ({ kind, enabled: true })),
    accessibility: { reducedMotion: false, highContrast: false, largeText: false, haptics: true, colorBlindSafe: false },
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function createInitialEcosystems(profileId: string): Record<EcosystemId, EcosystemState> {
  return (['forest', 'garden', 'pond', 'meadow'] as EcosystemId[]).reduce((record, id) => {
    record[id] = {
      id,
      userId: profileId,
      level: 1,
      xp: 0,
      unlocks: ecosystemProgression[id].filter((unlock) => unlock.level === 1).map((unlock) => ({ ...unlock, unlockedAt: timestamp })),
      decorations: [],
      discoveries: [],
      gentleNeglectScore: 0,
      updatedAt: timestamp
    };
    return record;
  }, {} as Record<EcosystemId, EcosystemState>);
}

export function createInitialState(): MosslightState {
  const profile = createInitialProfile();
  const habits = [
    createHabit({ userId: profile.id, title: 'Drink Water', category: 'Water Intake', ecosystemId: 'pond', difficulty: 'easy', targetLabel: '8 cups', reminderTime: '09:00' }),
    createHabit({ userId: profile.id, title: 'Read 20 Minutes', category: 'Reading', ecosystemId: 'garden', difficulty: 'medium', targetLabel: '20 min', reminderTime: '20:00' }),
    createHabit({ userId: profile.id, title: 'Move Your Body', category: 'Exercise', ecosystemId: 'forest', difficulty: 'hard', targetLabel: '1 session', reminderTime: '07:30' })
  ];
  return {
    profile,
    habits,
    habitEntries: [],
    ecosystems: createInitialEcosystems(profile.id),
    discoveries: [],
    expansions: createInitialExpansions(),
    friends: [],
    friendRequests: [],
    friendActivities: [],
    notifications: [],
    seasonalEvents
  };
}
