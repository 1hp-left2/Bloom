import { collectDiscoveryAction } from '../../application/mosslightActions';
import { EcosystemId, MosslightState } from '../../domain/types';
import { isPremium } from '../../engines/discoveryEngine';

export const discoveryService = {
  inventory: (state: MosslightState) => state.discoveries.filter((discovery) => discovery.collectedAt),
  history: (state: MosslightState) => state.discoveries,
  byEcosystem: (state: MosslightState, ecosystemId: EcosystemId) => state.discoveries.filter((discovery) => discovery.ecosystemId === ecosystemId),
  premiumEligible: (state: MosslightState) => isPremium(state.profile.premiumUntil),
  collect: (state: MosslightState, discoveryId: string) => collectDiscoveryAction(state, discoveryId)
};
