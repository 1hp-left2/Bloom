import { AppNotification, NotificationKind, NotificationPreference } from '../domain/types';
import { createId, nowISO } from '../utils/date';

export function notificationEnabled(preferences: NotificationPreference[], kind: NotificationKind): boolean {
  return preferences.find((preference) => preference.kind === kind)?.enabled ?? true;
}

export function createNotification(preferences: NotificationPreference[], kind: NotificationKind, title: string, body: string): AppNotification | undefined {
  if (!notificationEnabled(preferences, kind)) return undefined;
  return { id: createId('notification'), kind, title, body, read: false, createdAt: nowISO() };
}

export function markNotificationRead(notifications: AppNotification[], id: string): AppNotification[] {
  return notifications.map((notification) => notification.id === id ? { ...notification, read: true } : notification);
}
