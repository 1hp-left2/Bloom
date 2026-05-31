import AsyncStorage from '@react-native-async-storage/async-storage';
import { MosslightState } from '../../domain/types';
import { createInitialState } from '../initialState';

const STORAGE_KEY = 'mosslight:v1:state';

export type RepositoryResult<T> = { data?: T; error?: string };

export class MosslightRepository {
  async load(): Promise<RepositoryResult<MosslightState>> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initialState = createInitialState();
        await this.save(initialState);
        return { data: initialState };
      }
      return { data: JSON.parse(raw) as MosslightState };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to load Mosslight sanctuary.' };
    }
  }

  async save(state: MosslightState): Promise<RepositoryResult<MosslightState>> {
    try {
      const snapshot = { ...state, lastSyncedAt: new Date().toISOString() };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      return { data: snapshot };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to save Mosslight sanctuary.' };
    }
  }

  async reset(): Promise<RepositoryResult<MosslightState>> {
    try {
      const state = createInitialState();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { data: state };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to reset Mosslight sanctuary.' };
    }
  }
}

export const mosslightRepository = new MosslightRepository();
