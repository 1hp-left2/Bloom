import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Habit, ecosystems } from '../data/mosslightContent';
import { calculateGrowth } from '../game/mosslight';
import { palette, radii, shadows, spacing } from '../styles/theme';

type Props = {
  habit: Habit;
  streak: number;
  onComplete: (habit: Habit) => void;
};

export function HabitCard({ habit, streak, onComplete }: Props) {
  const ecosystem = ecosystems.find((item) => item.id === habit.ecosystem);
  return (
    <Pressable
      onPress={() => onComplete(habit)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, habit.completed && styles.completed]}
      accessibilityRole="button"
      accessibilityLabel={`${habit.title}, ${habit.progress}. ${habit.completed ? 'Already nurtured today' : 'Tap to nurture'}`}
    >
      <Text style={styles.icon}>{habit.icon}</Text>
      <View style={styles.copy}>
        <Text style={styles.title}>{habit.title}</Text>
        <Text style={styles.meta}>{ecosystem?.label} • +{calculateGrowth(habit.difficulty, streak)} growth</Text>
      </View>
      <View style={styles.trailing}>
        <Text style={styles.progress}>{habit.progress}</Text>
        <Text style={[styles.check, habit.completed && styles.checkDone]}>{habit.completed ? '✓' : '○'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 68,
    borderRadius: radii.card,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: '#E3DBC9',
    padding: spacing(1.25),
    marginBottom: spacing(1),
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.25),
    ...shadows.soft
  },
  pressed: { transform: [{ scale: 0.98 }] },
  completed: { backgroundColor: '#F2F4E7' },
  icon: { fontSize: 28 },
  copy: { flex: 1 },
  title: { color: palette.dark, fontWeight: '800', fontSize: 16 },
  meta: { color: palette.dark, opacity: 0.62, marginTop: 3, fontSize: 12 },
  trailing: { alignItems: 'flex-end', gap: 4 },
  progress: { color: palette.dark, opacity: 0.72, fontSize: 12 },
  check: { color: palette.sage, fontSize: 24, fontWeight: '900' },
  checkDone: { color: palette.forest }
});
