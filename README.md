# Mosslight

Mosslight is a mobile-first Expo + React Native habit sanctuary. Daily habits nurture four ecosystems—Forest, Flower Garden, Pond, and Wildlife Meadow—so progress feels like tending a warm storybook world instead of completing a productivity checklist.

## Product pillars

- **Sanctuary first:** the living map is the core product surface.
- **Gentle growth:** missed habits may show soft weeds or fewer butterflies, but they never delete progress or shame the user.
- **Cozy non-competitive social:** friends can visit, leave water drops, sunshine boosts, and encouragement notes without follower counts or leaderboards.
- **Premium is cosmetic plus rare delight:** paid features add themes, advanced analytics, decorations, wildlife, and premium-exclusive rare discovery encounters without gating core progression.

## Architecture

The MVP is organized around clean architecture boundaries:

- `src/domain`: product types and content catalogs.
- `src/engines`: business rules for habits, sanctuary progression, discoveries, expansions, friends, notifications, and seasons.
- `src/data`: repositories, first-run state initialization, and production services for habits, ecosystems, discoveries, friends, notifications, profile, and seasons.
- `src/application`: persisted app actions and the `useMosslight` state hook.
- `src/components`: reusable UI components.
- `src/audit`: production audit findings and remaining launch blockers.
- `supabase/migrations`: backend schema and row-level security.

## Production capabilities in this MVP

- Persistent local sanctuary state through a repository layer.
- Habit create/edit/schedule/complete/skip/archive/delete lifecycle.
- Streak tracking, XP awards, weekly history, and monthly history.
- Ecosystem XP, levels, unlock calculation, decorations/discovery slots, and gentle-neglect scoring.
- Sanctuary level recalculation and expansion fog ownership/animation states.
- Premium-gated rare discovery probability, collection, artwork references, replay tokens, and notifications.
- Friend request/activity primitives, visits, water drops, sunshine boosts, encouragement notes, remove, and block actions.
- Notification preferences, unread state, read handling, milestone/expansion/discovery/friend/seasonal alerts.
- Seasonal content architecture for plants, colors, wildlife, decorations, and ambient effects.
- Accessibility settings for reduced motion, high contrast, large text, haptics, and color-blind-safe mode.
- Loading, saving, error, and empty states.

## Tech stack

- React Native + Expo + TypeScript frontend
- Supabase backend with PostgreSQL, Auth, real-time sync, and row level security
- Offline-first storage through AsyncStorage-backed repository
- Push notification integration prepared through notification domain/preferences

## Scripts

```bash
npm install
npm run start
npm run typecheck
npm run test:logic
```

> Note: this environment returned a registry `403 Forbidden` during `npm install`, so package installation and runtime device verification were blocked here. Type checking is supported with local native module shims until dependencies are installed.
