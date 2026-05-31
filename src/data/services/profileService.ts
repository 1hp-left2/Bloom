import { premiumAction, toggleAccessibilityAction } from '../../application/mosslightActions';
import { MosslightState } from '../../domain/types';

export const profileService = {
  get: (state: MosslightState) => state.profile,
  activatePremium: (state: MosslightState) => premiumAction(state),
  toggleAccessibility: (state: MosslightState, key: keyof MosslightState['profile']['accessibility']) => toggleAccessibilityAction(state, key)
};
