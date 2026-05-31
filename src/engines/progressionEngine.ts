import { ecosystemProgression, expansionCatalog, growthByDifficulty } from '../domain/catalog';
import { EcosystemId, EcosystemState, ExpansionArea, HabitDifficulty } from '../domain/types';
import { nowISO } from '../utils/date';

export function streakMultiplier(streakDays: number): number {
  if (streakDays >= 365) return 3;
  if (streakDays >= 90) return 2;
  if (streakDays >= 30) return 1.5;
  if (streakDays >= 14) return 1.25;
  if (streakDays >= 7) return 1.1;
  return 1;
}

export function calculateGrowth(difficulty: HabitDifficulty, streakDays: number): number {
  return Math.round(growthByDifficulty[difficulty] * streakMultiplier(streakDays));
}

export function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function sanctuaryLevel(ecosystems: Record<EcosystemId, EcosystemState>): number {
  const totalXp = Object.values(ecosystems).reduce((sum, ecosystem) => sum + ecosystem.xp, 0);
  return levelFromXp(totalXp);
}

export function applyEcosystemXp(ecosystem: EcosystemState, xp: number): EcosystemState {
  const nextXp = ecosystem.xp + xp;
  const nextLevel = levelFromXp(nextXp);
  const timestamp = nowISO();
  const existing = new Set(ecosystem.unlocks.map((unlock) => unlock.name));
  const newUnlocks = ecosystemProgression[ecosystem.id]
    .filter((unlock) => unlock.level <= nextLevel && !existing.has(unlock.name))
    .map((unlock) => ({ ...unlock, unlockedAt: timestamp }));

  return {
    ...ecosystem,
    xp: nextXp,
    level: nextLevel,
    unlocks: [...ecosystem.unlocks, ...newUnlocks],
    gentleNeglectScore: Math.max(0, ecosystem.gentleNeglectScore - 1),
    updatedAt: timestamp
  };
}

export function createInitialExpansions(): ExpansionArea[] {
  return expansionCatalog.map((area) => ({
    id: area.name.toLowerCase().replace(/\s+/g, '_'),
    levelRequired: area.levelRequired,
    name: area.name,
    rewards: area.rewards,
    owned: area.levelRequired === 1,
    fogState: area.levelRequired === 1 ? 'revealed' : 'hidden',
    unlockedAt: area.levelRequired === 1 ? nowISO() : undefined,
    animationState: area.levelRequired === 1 ? 'complete' : 'idle'
  }));
}

export function applyExpansionUnlocks(expansions: ExpansionArea[], level: number): { expansions: ExpansionArea[]; unlocked: ExpansionArea[] } {
  const timestamp = nowISO();
  const unlocked: ExpansionArea[] = [];
  const next = expansions.map((area) => {
    if (!area.owned && area.levelRequired <= level) {
      const updated = { ...area, owned: true, fogState: 'revealing' as const, unlockedAt: timestamp, animationState: 'queued' as const };
      unlocked.push(updated);
      return updated;
    }
    return area;
  });
  return { expansions: next, unlocked };
}

export function completeExpansionAnimation(expansions: ExpansionArea[], areaId: string): ExpansionArea[] {
  return expansions.map((area) => area.id === areaId ? { ...area, fogState: 'revealed', animationState: 'complete' } : area);
}
