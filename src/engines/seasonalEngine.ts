import { seasonalEvents, seasonForDate } from '../domain/catalog';
import { SeasonId, SeasonalEvent } from '../domain/types';

export function currentSeason(date = new Date()): SeasonId {
  return seasonForDate(date);
}

export function activeSeasonalEvent(date = new Date()): SeasonalEvent {
  const season = currentSeason(date);
  return seasonalEvents.find((event) => event.season === season) ?? seasonalEvents[0];
}
