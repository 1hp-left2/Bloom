import { ecosystemProgression } from '../../domain/catalog';
import { EcosystemId, MosslightState } from '../../domain/types';

export const ecosystemService = {
  all: (state: MosslightState) => Object.values(state.ecosystems),
  byId: (state: MosslightState, id: EcosystemId) => state.ecosystems[id],
  nextUnlock: (state: MosslightState, id: EcosystemId) => ecosystemProgression[id].find((unlock) => unlock.level > state.ecosystems[id].level),
  totalXp: (state: MosslightState) => Object.values(state.ecosystems).reduce((sum, ecosystem) => sum + ecosystem.xp, 0)
};
