import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ecosystemIcons, ecosystemLabels } from '../domain/catalog';
import { Habit, HabitEntry } from '../domain/types';
import { calculateGrowth } from '../engines/progressionEngine';
import { todayISO } from '../utils/date';
import { palette, radii, shadows, spacing } from '../styles/theme';

type Props = {
  habit: Habit;
  entries: HabitEntry[];
  onComplete: (habit: Habit) => void;
  onSkip: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onArchive: (habit: Habit) => void;
};

export function HabitCard({ habit, entries, onComplete, onSkip, onEdit, onArchive }: Props) {
  const today = todayISO();
  const completedToday = entries.some((entry) => entry.habitId === habit.id && entry.date === today && entry.kind === 'complete');
  const skippedToday = entries.some((entry) => entry.habitId === habit.id && entry.date === today && entry.kind === 'skip');
  const growth = calculateGrowth(habit.difficulty, Math.max(1, habit.streak + 1));
  return (
    <View style={[styles.card, completedToday && styles.completed, skippedToday && styles.skipped]} accessibilityLabel={`${habit.title}, ${ecosystemLabels[habit.ecosystemId]}, streak ${habit.streak}`}>
      <Text style={styles.icon}>{ecosystemIcons[habit.ecosystemId]}</Text>
      <View style={styles.copy}>
        <Text style={styles.title}>{habit.title}</Text>
        <Text style={styles.meta}>{ecosystemLabels[habit.ecosystemId]} • {habit.category} • +{growth} XP</Text>
        <Text style={styles.meta}>Target {habit.targetLabel} • Reminder {habit.reminder.enabled ? habit.reminder.time : 'off'}</Text>
        <View style={styles.actions}>
          <Action label={completedToday ? 'Nurtured' : 'Complete'} disabled={completedToday || skippedToday} onPress={() => onComplete(habit)} />
          <Action label={skippedToday ? 'Skipped' : 'Skip'} disabled={completedToday || skippedToday} onPress={() => onSkip(habit)} />
          <Action label="Edit" onPress={() => onEdit(habit)} />
          <Action label="Archive" tone="quiet" onPress={() => onArchive(habit)} />
        </View>
      </View>
      <View style={styles.streak}><Text style={styles.streakValue}>{habit.streak}</Text><Text style={styles.streakLabel}>streak</Text></View>
    </View>
  );
}

function Action({ label, onPress, disabled, tone = 'solid' }: { label: string; onPress: () => void; disabled?: boolean; tone?: 'solid' | 'quiet' }) {
  return <Pressable onPress={onPress} disabled={disabled} style={[styles.action, tone === 'quiet' && styles.quietAction, disabled && styles.disabled]} accessibilityRole="button"><Text style={[styles.actionText, tone === 'quiet' && styles.quietText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  card: { minHeight: 104, borderRadius: radii.card, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E3DBC9', padding: spacing(1.25), marginBottom: spacing(1), flexDirection: 'row', alignItems: 'flex-start', gap: spacing(1.25), ...shadows.soft },
  completed: { backgroundColor: '#F2F4E7' },
  skipped: { backgroundColor: '#F8F1E5' },
  icon: { fontSize: 30 },
  copy: { flex: 1 },
  title: { color: palette.dark, fontWeight: '800', fontSize: 16 },
  meta: { color: palette.dark, opacity: 0.62, marginTop: 3, fontSize: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing(1) },
  action: { backgroundColor: palette.forest, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7 },
  quietAction: { backgroundColor: '#EEF3E6' },
  disabled: { opacity: 0.42 },
  actionText: { color: palette.white, fontWeight: '900', fontSize: 12 },
  quietText: { color: palette.forest },
  streak: { alignItems: 'center', minWidth: 46 },
  streakValue: { color: palette.forest, fontSize: 20, fontWeight: '900' },
  streakLabel: { color: palette.dark, opacity: 0.56, fontSize: 10 }
});
