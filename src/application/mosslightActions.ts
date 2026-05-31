import { activeSeasonalEvent } from '../engines/seasonalEngine';
import { collectDiscovery, rollPremiumDiscovery } from '../engines/discoveryEngine';
import { createNotification, markNotificationRead } from '../engines/notificationEngine';
import { applyEcosystemXp, applyExpansionUnlocks, completeExpansionAnimation, sanctuaryLevel } from '../engines/progressionEngine';
import { archiveHabit, completeHabit, createHabit, deleteHabit, editHabit, skipHabit, scheduleHabit } from '../engines/habitEngine';
import { blockUser, createFriendActivity, createFriendRequest, removeFriend, respondToFriendRequest } from '../engines/friendEngine';
import { FriendGiftKind, Habit, HabitDifficulty, MosslightState, NotificationKind } from '../domain/types';
import { nowISO, todayISO } from '../utils/date';

function withProfileProgress(state: MosslightState): MosslightState {
  const level = sanctuaryLevel(state.ecosystems);
  const xp = Object.values(state.ecosystems).reduce((sum, ecosystem) => sum + ecosystem.xp, 0);
  const expansionResult = applyExpansionUnlocks(state.expansions, level);
  const expansionNotifications = expansionResult.unlocked
    .map((area) => createNotification(state.profile.notificationPreferences, 'expansion', `${area.name} revealed`, `${area.name} has emerged from the fog. Rewards: ${area.rewards.join(', ')}.`))
    .filter(Boolean) as MosslightState['notifications'];
  return {
    ...state,
    expansions: expansionResult.expansions,
    notifications: [...expansionNotifications, ...state.notifications],
    profile: { ...state.profile, sanctuaryLevel: level, sanctuaryXp: xp, updatedAt: nowISO() }
  };
}

export function addHabitAction(state: MosslightState, input: { title: string; category: string; ecosystemId: Habit['ecosystemId']; difficulty: HabitDifficulty; targetLabel: string; reminderTime?: string }): MosslightState {
  const habit = createHabit({ userId: state.profile.id, ...input });
  const notification = createNotification(state.profile.notificationPreferences, 'habit_reminder', `${habit.title} scheduled`, `A gentle reminder is set for ${habit.reminder.time}.`);
  return { ...state, habits: [habit, ...state.habits], notifications: notification ? [notification, ...state.notifications] : state.notifications };
}

export function editHabitAction(state: MosslightState, habitId: string, patch: Parameters<typeof editHabit>[1]): MosslightState {
  return { ...state, habits: state.habits.map((habit) => habit.id === habitId ? editHabit(habit, patch) : habit) };
}

export function scheduleHabitAction(state: MosslightState, habitId: string, frequency: Habit['frequency'], reminder: Habit['reminder']): MosslightState {
  return { ...state, habits: state.habits.map((habit) => habit.id === habitId ? scheduleHabit(habit, frequency, reminder) : habit) };
}

export function archiveHabitAction(state: MosslightState, habitId: string): MosslightState {
  return { ...state, habits: state.habits.map((habit) => habit.id === habitId ? archiveHabit(habit) : habit) };
}

export function deleteHabitAction(state: MosslightState, habitId: string): MosslightState {
  return { ...state, habits: state.habits.map((habit) => habit.id === habitId ? deleteHabit(habit) : habit) };
}

export function completeHabitAction(state: MosslightState, habitId: string, date = todayISO()): MosslightState {
  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit) throw new Error('Habit not found.');
  const completion = completeHabit(habit, state.habitEntries, date);
  const ecosystem = applyEcosystemXp(state.ecosystems[habit.ecosystemId], completion.entry.growthAwarded);
  const discovery = rollPremiumDiscovery({ premiumUntil: state.profile.premiumUntil, ecosystemId: habit.ecosystemId, ecosystemLevel: ecosystem.level, existingDiscoveries: state.discoveries });
  const discoveryNotification = discovery ? createNotification(state.profile.notificationPreferences, 'discovery', `${discovery.name} appeared`, 'A rare premium discovery is waiting in your sanctuary inventory.') : undefined;
  const milestoneNotification = ecosystem.level > state.ecosystems[habit.ecosystemId].level ? createNotification(state.profile.notificationPreferences, 'milestone', `${ecosystem.id} reached Level ${ecosystem.level}`, 'Your daily actions are changing the sanctuary.') : undefined;
  const nextState = {
    ...state,
    habits: state.habits.map((item) => item.id === habitId ? completion.habit : item),
    habitEntries: [completion.entry, ...state.habitEntries],
    ecosystems: { ...state.ecosystems, [habit.ecosystemId]: discovery ? { ...ecosystem, discoveries: [...ecosystem.discoveries, discovery.id] } : ecosystem },
    discoveries: discovery ? [discovery, ...state.discoveries] : state.discoveries,
    notifications: [discoveryNotification, milestoneNotification].filter(Boolean).concat(state.notifications) as MosslightState['notifications']
  };
  return withProfileProgress(nextState);
}

export function skipHabitAction(state: MosslightState, habitId: string, date = todayISO()): MosslightState {
  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit) throw new Error('Habit not found.');
  const alreadySkipped = state.habitEntries.some((entry) => entry.habitId === habitId && entry.date === date && entry.kind === 'skip');
  if (alreadySkipped) throw new Error('This habit has already been gently skipped today.');
  const entry = skipHabit(habit, date);
  const ecosystem = state.ecosystems[habit.ecosystemId];
  return { ...state, habitEntries: [entry, ...state.habitEntries], ecosystems: { ...state.ecosystems, [habit.ecosystemId]: { ...ecosystem, gentleNeglectScore: ecosystem.gentleNeglectScore + 1, updatedAt: nowISO() } } };
}

export function collectDiscoveryAction(state: MosslightState, discoveryId: string): MosslightState {
  return { ...state, discoveries: collectDiscovery(state.discoveries, discoveryId) };
}

export function completeExpansionAnimationAction(state: MosslightState, areaId: string): MosslightState {
  return { ...state, expansions: completeExpansionAnimation(state.expansions, areaId) };
}

export function sendFriendRequestAction(state: MosslightState, addresseeId: string): MosslightState {
  return { ...state, friendRequests: [createFriendRequest(state.profile.id, addresseeId), ...state.friendRequests] };
}

export function respondFriendRequestAction(state: MosslightState, requestId: string, accept: boolean): MosslightState {
  return { ...state, friendRequests: state.friendRequests.map((request) => request.id === requestId ? respondToFriendRequest(request, accept) : request) };
}

export function removeFriendAction(state: MosslightState, friendId: string): MosslightState {
  return { ...state, friends: removeFriend(state.friends, friendId) };
}

export function blockUserAction(state: MosslightState, friendId: string): MosslightState {
  return { ...state, friends: blockUser(state.friends, friendId) };
}

export function friendInteractionAction(state: MosslightState, friendId: string, kind: FriendGiftKind | 'visit', message: string): MosslightState {
  const activity = createFriendActivity(friendId, kind, message);
  const notification = createNotification(state.profile.notificationPreferences, 'friend', 'Friend garden updated', message);
  return { ...state, friendActivities: [activity, ...state.friendActivities], notifications: notification ? [notification, ...state.notifications] : state.notifications };
}

export function toggleNotificationPreferenceAction(state: MosslightState, kind: NotificationKind): MosslightState {
  return { ...state, profile: { ...state.profile, notificationPreferences: state.profile.notificationPreferences.map((preference) => preference.kind === kind ? { ...preference, enabled: !preference.enabled } : preference), updatedAt: nowISO() } };
}

export function markNotificationReadAction(state: MosslightState, notificationId: string): MosslightState {
  return { ...state, notifications: markNotificationRead(state.notifications, notificationId) };
}

export function toggleAccessibilityAction(state: MosslightState, key: keyof MosslightState['profile']['accessibility']): MosslightState {
  return { ...state, profile: { ...state.profile, accessibility: { ...state.profile.accessibility, [key]: !state.profile.accessibility[key] }, updatedAt: nowISO() } };
}

export function premiumAction(state: MosslightState): MosslightState {
  const nextYear = new Date();
  nextYear.setUTCFullYear(nextYear.getUTCFullYear() + 1);
  return { ...state, profile: { ...state.profile, premiumUntil: nextYear.toISOString(), updatedAt: nowISO() } };
}

export function seasonalRefreshAction(state: MosslightState): MosslightState {
  const event = activeSeasonalEvent();
  const notification = createNotification(state.profile.notificationPreferences, 'seasonal', event.title, `${event.ambientEffects.join(' and ')} have arrived in Mosslight.`);
  return { ...state, notifications: notification ? [notification, ...state.notifications] : state.notifications };
}
