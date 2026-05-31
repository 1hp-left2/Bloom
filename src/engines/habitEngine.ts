import { Habit, HabitDifficulty, HabitEntry, WeeklyHistory, MonthlyHistory } from '../domain/types';
import { addDaysISO, createId, daysBetween, nowISO, todayISO } from '../utils/date';
import { calculateGrowth } from './progressionEngine';

export function createHabit(input: {
  userId: string;
  title: string;
  category: string;
  ecosystemId: Habit['ecosystemId'];
  difficulty: HabitDifficulty;
  targetLabel: string;
  reminderTime?: string;
}): Habit {
  const timestamp = nowISO();
  return {
    id: createId('habit'),
    userId: input.userId,
    title: input.title.trim(),
    category: input.category,
    ecosystemId: input.ecosystemId,
    difficulty: input.difficulty,
    targetLabel: input.targetLabel.trim() || '1 session',
    frequency: { daysOfWeek: [1, 2, 3, 4, 5, 6, 7] },
    reminder: { enabled: Boolean(input.reminderTime), time: input.reminderTime ?? '08:00', notificationIds: [] },
    status: 'active',
    streak: 0,
    bestStreak: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function editHabit(habit: Habit, patch: Partial<Pick<Habit, 'title' | 'category' | 'ecosystemId' | 'difficulty' | 'targetLabel' | 'frequency' | 'reminder'>>): Habit {
  return { ...habit, ...patch, title: patch.title?.trim() ?? habit.title, updatedAt: nowISO() };
}

export function archiveHabit(habit: Habit): Habit {
  return { ...habit, status: 'archived', archivedAt: nowISO(), updatedAt: nowISO() };
}

export function deleteHabit(habit: Habit): Habit {
  return { ...habit, status: 'deleted', deletedAt: nowISO(), updatedAt: nowISO() };
}

export function scheduleHabit(habit: Habit, frequency: Habit['frequency'], reminder: Habit['reminder']): Habit {
  return editHabit(habit, { frequency, reminder });
}

export function completeHabit(habit: Habit, entries: HabitEntry[], date = todayISO()): { habit: Habit; entry: HabitEntry } {
  const alreadyCompleted = entries.some((entry) => entry.habitId === habit.id && entry.date === date && entry.kind === 'complete');
  if (alreadyCompleted) {
    throw new Error('This habit has already nurtured the sanctuary today.');
  }
  const previousCompletion = entries.filter((entry) => entry.habitId === habit.id && entry.kind === 'complete').sort((a, b) => b.date.localeCompare(a.date))[0];
  const nextStreak = previousCompletion && daysBetween(previousCompletion.date, date) === 1 ? previousCompletion.streakAfter + 1 : 1;
  const growthAwarded = calculateGrowth(habit.difficulty, nextStreak);
  const updatedHabit = { ...habit, streak: nextStreak, bestStreak: Math.max(habit.bestStreak, nextStreak), updatedAt: nowISO() };
  return {
    habit: updatedHabit,
    entry: {
      id: createId('entry'),
      habitId: habit.id,
      userId: habit.userId,
      date,
      kind: 'complete',
      growthAwarded,
      streakAfter: nextStreak,
      createdAt: nowISO()
    }
  };
}

export function skipHabit(habit: Habit, date = todayISO(), note = 'Skipped gently'): HabitEntry {
  return {
    id: createId('entry'),
    habitId: habit.id,
    userId: habit.userId,
    date,
    kind: 'skip',
    growthAwarded: 0,
    streakAfter: habit.streak,
    createdAt: nowISO(),
    note
  };
}

export function weeklyHistory(entries: HabitEntry[], date = todayISO()): WeeklyHistory {
  return Array.from({ length: 7 }).map((_, index) => {
    const day = addDaysISO(date, index - 6);
    const dayEntries = entries.filter((entry) => entry.date === day);
    return {
      date: day,
      completed: dayEntries.filter((entry) => entry.kind === 'complete').length,
      skipped: dayEntries.filter((entry) => entry.kind === 'skip').length,
      growth: dayEntries.reduce((sum, entry) => sum + entry.growthAwarded, 0)
    };
  });
}

export function monthlyHistory(entries: HabitEntry[], date = todayISO()): MonthlyHistory {
  return Array.from({ length: 4 }).map((_, index) => {
    const weekStart = addDaysISO(date, -27 + index * 7);
    const weekEnd = addDaysISO(weekStart, 6);
    const weekEntries = entries.filter((entry) => entry.date >= weekStart && entry.date <= weekEnd);
    return {
      weekStart,
      completed: weekEntries.filter((entry) => entry.kind === 'complete').length,
      skipped: weekEntries.filter((entry) => entry.kind === 'skip').length,
      growth: weekEntries.reduce((sum, entry) => sum + entry.growthAwarded, 0)
    };
  });
}
