import { rareDiscoveryCatalog } from '../domain/catalog';
import { Discovery, EcosystemId } from '../domain/types';
import { createId, nowISO } from '../utils/date';

export function isPremium(premiumUntil?: string): boolean {
  return Boolean(premiumUntil && new Date(premiumUntil).getTime() > Date.now());
}

export function rollPremiumDiscovery(params: {
  premiumUntil?: string;
  ecosystemId: EcosystemId;
  ecosystemLevel: number;
  existingDiscoveries: Discovery[];
  random?: number;
}): Discovery | undefined {
  if (!isPremium(params.premiumUntil)) return undefined;
  const candidates = rareDiscoveryCatalog.filter((item) => item.ecosystemId === params.ecosystemId && !params.existingDiscoveries.some((discovery) => discovery.name === item.name));
  const roll = params.random ?? Math.random();
  let threshold = 0;
  for (const candidate of candidates) {
    const levelBonus = Math.min(0.04, params.ecosystemLevel * 0.002);
    threshold += candidate.baseProbability + levelBonus;
    if (roll <= threshold) {
      return {
        id: createId('discovery'),
        name: candidate.name,
        ecosystemId: candidate.ecosystemId,
        rarity: candidate.rarity,
        premiumOnly: true,
        artworkRef: candidate.artworkRef,
        encounteredAt: nowISO(),
        replayToken: createId('replay')
      };
    }
  }
  return undefined;
}

export function collectDiscovery(discoveries: Discovery[], discoveryId: string): Discovery[] {
  return discoveries.map((discovery) => discovery.id === discoveryId && !discovery.collectedAt ? { ...discovery, collectedAt: nowISO() } : discovery);
}
