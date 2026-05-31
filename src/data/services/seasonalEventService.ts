import { seasonalRefreshAction } from '../../application/mosslightActions';
import { seasonalEvents } from '../../domain/catalog';
import { MosslightState, SeasonId } from '../../domain/types';
import { activeSeasonalEvent, currentSeason } from '../../engines/seasonalEngine';

export const seasonalEventService = {
  all: () => seasonalEvents,
  currentSeason,
  active: activeSeasonalEvent,
  bySeason: (season: SeasonId) => seasonalEvents.filter((event) => event.season === season),
  refresh: (state: MosslightState) => seasonalRefreshAction(state)
};
