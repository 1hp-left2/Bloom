import { addHabitAction, archiveHabitAction, completeHabitAction, deleteHabitAction, editHabitAction, scheduleHabitAction, skipHabitAction } from '../../application/mosslightActions';
import { Habit, HabitDifficulty, MosslightState } from '../../domain/types';

export const habitService = {
  active: (state: MosslightState) => state.habits.filter((habit) => habit.status === 'active'),
  create: (state: MosslightState, input: { title: string; category: string; ecosystemId: Habit['ecosystemId']; difficulty: HabitDifficulty; targetLabel: string; reminderTime?: string }) => addHabitAction(state, input),
  edit: (state: MosslightState, habitId: string, patch: Parameters<typeof editHabitAction>[2]) => editHabitAction(state, habitId, patch),
  schedule: (state: MosslightState, habitId: string, frequency: Habit['frequency'], reminder: Habit['reminder']) => scheduleHabitAction(state, habitId, frequency, reminder),
  complete: (state: MosslightState, habitId: string) => completeHabitAction(state, habitId),
  skip: (state: MosslightState, habitId: string) => skipHabitAction(state, habitId),
  archive: (state: MosslightState, habitId: string) => archiveHabitAction(state, habitId),
  delete: (state: MosslightState, habitId: string) => deleteHabitAction(state, habitId)
};
