import { markNotificationReadAction, toggleNotificationPreferenceAction } from '../../application/mosslightActions';
import { MosslightState, NotificationKind } from '../../domain/types';

export const notificationService = {
  unread: (state: MosslightState) => state.notifications.filter((notification) => !notification.read),
  preferences: (state: MosslightState) => state.profile.notificationPreferences,
  togglePreference: (state: MosslightState, kind: NotificationKind) => toggleNotificationPreferenceAction(state, kind),
  markRead: (state: MosslightState, notificationId: string) => markNotificationReadAction(state, notificationId)
};
