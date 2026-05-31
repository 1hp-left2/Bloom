# Mosslight

Mosslight is a mobile-first Expo + React Native habit sanctuary. Daily habits nurture four ecosystems—Forest, Flower Garden, Pond, and Wildlife Meadow—so progress feels like tending a warm storybook world instead of completing a productivity checklist.

## Product pillars

- **Sanctuary first:** the living map is the core product surface.
- **Gentle growth:** missed habits may show soft weeds or fewer butterflies, but they never delete progress or shame the user.
- **Cozy non-competitive social:** friends can visit, leave water drops, sunshine boosts, and encouragement notes without follower counts or leaderboards.
- **Premium is cosmetic:** paid features add themes, rare species, analytics, and decorations without gating core progression.

## Tech stack

- React Native + Expo + TypeScript frontend
- Supabase backend with PostgreSQL, Auth, real-time sync, and row level security
- Offline-first storage planned through AsyncStorage and sync queues
- Push notifications through Expo Notifications

## Scripts

```bash
npm install
npm run start
npm run typecheck
npm run test:logic
```

> Note: this environment returned a registry `403 Forbidden` during `npm install`, so dependencies were not installed here.
