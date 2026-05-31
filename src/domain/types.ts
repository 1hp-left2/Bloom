export type EcosystemId = 'forest' | 'garden' | 'pond' | 'meadow';
export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type HabitStatus = 'active' | 'archived' | 'deleted';
export type CompletionKind = 'complete' | 'skip';
export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';
export type FriendRequestStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
export type FriendGiftKind = 'water_drop' | 'sunshine_boost' | 'encouragement_note';
export type NotificationKind = 'daily_reminder' | 'habit_reminder' | 'milestone' | 'expansion' | 'discovery' | 'friend' | 'seasonal';

export type Frequency = {
  daysOfWeek: number[];
};

export type ReminderPreference = {
  enabled: boolean;
  time: string;
  notificationIds: string[];
};

export type Habit = {
  id: string;
  userId: string;
  title: string;
  category: string;
  ecosystemId: EcosystemId;
  difficulty: HabitDifficulty;
  targetLabel: string;
  frequency: Frequency;
  reminder: ReminderPreference;
  status: HabitStatus;
  streak: number;
  bestStreak: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  deletedAt?: string;
};

export type HabitEntry = {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  kind: CompletionKind;
  growthAwarded: number;
  streakAfter: number;
  createdAt: string;
  note?: string;
};

export type EcosystemUnlock = {
  level: number;
  name: string;
  unlockedAt: string;
};

export type Decoration = {
  id: string;
  name: string;
  ecosystemId: EcosystemId;
  artworkRef: string;
  acquiredAt: string;
};

export type EcosystemState = {
  id: EcosystemId;
  userId: string;
  level: number;
  xp: number;
  unlocks: EcosystemUnlock[];
  decorations: Decoration[];
  discoveries: string[];
  gentleNeglectScore: number;
  updatedAt: string;
};

export type Discovery = {
  id: string;
  name: string;
  ecosystemId: EcosystemId;
  rarity: 'rare' | 'legendary';
  premiumOnly: true;
  artworkRef: string;
  encounteredAt: string;
  collectedAt?: string;
  replayToken: string;
};

export type ExpansionArea = {
  id: string;
  levelRequired: number;
  name: string;
  owned: boolean;
  fogState: 'hidden' | 'revealing' | 'revealed';
  rewards: string[];
  unlockedAt?: string;
  animationState: 'idle' | 'queued' | 'playing' | 'complete';
};

export type FriendProfile = {
  id: string;
  displayName: string;
  sanctuaryName: string;
  avatarEmoji: string;
  blocked: boolean;
};

export type FriendRequest = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendRequestStatus;
  createdAt: string;
  respondedAt?: string;
};

export type FriendActivity = {
  id: string;
  friendId: string;
  kind: FriendGiftKind | 'visit' | 'milestone';
  message: string;
  createdAt: string;
};

export type NotificationPreference = {
  kind: NotificationKind;
  enabled: boolean;
};

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type AccessibilitySettings = {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  haptics: boolean;
  colorBlindSafe: boolean;
};

export type Profile = {
  id: string;
  displayName: string;
  sanctuaryName: string;
  avatarEmoji: string;
  premiumUntil?: string;
  sanctuaryLevel: number;
  sanctuaryXp: number;
  currentStreak: number;
  bestStreak: number;
  notificationPreferences: NotificationPreference[];
  accessibility: AccessibilitySettings;
  createdAt: string;
  updatedAt: string;
};

export type SeasonalEvent = {
  id: string;
  season: SeasonId;
  title: string;
  startsOn: string;
  endsOn: string;
  plants: string[];
  colors: string[];
  wildlife: string[];
  decorations: string[];
  ambientEffects: string[];
};

export type MosslightState = {
  profile: Profile;
  habits: Habit[];
  habitEntries: HabitEntry[];
  ecosystems: Record<EcosystemId, EcosystemState>;
  discoveries: Discovery[];
  expansions: ExpansionArea[];
  friends: FriendProfile[];
  friendRequests: FriendRequest[];
  friendActivities: FriendActivity[];
  notifications: AppNotification[];
  seasonalEvents: SeasonalEvent[];
  lastSyncedAt?: string;
};

export type WeeklyHistory = Array<{ date: string; completed: number; skipped: number; growth: number }>;
export type MonthlyHistory = Array<{ weekStart: string; completed: number; skipped: number; growth: number }>;
