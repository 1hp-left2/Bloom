# Mosslight Production Audit

## Findings from scaffold

- Placeholder screens: Home, Sanctuary, Friends, Shop, and Profile were static sections without durable actions or route-level state.
- Fake data: ecosystem levels, habits, discoveries, friends, and shop content were local fixtures rather than persisted domain state.
- Hardcoded values: current streak, sanctuary level, discoveries, friend gardens, and premium state were fixed in the UI.
- Missing state management: habit completion only changed local React state and did not recalculate ecosystem progression or persist.
- Missing persistence: no repository existed for loading or saving habits, ecosystems, discoveries, expansions, notifications, or profile settings.
- Broken navigation paths: requested app pages were listed but buttons did not connect to useful flows.
- Unimplemented buttons: habit edit/archive, friend interactions, notifications, premium, accessibility, and expansion reveal actions were non-functional or absent.
- Missing loading/error/empty states: startup, persistence failures, empty habits, empty friends, empty discoveries, and notification states were not represented.
- Missing accessibility support: some labels existed, but no user-level reduced motion, high contrast, large text, haptics, or color-blind-safe controls were wired to app state.

## Implemented corrections

- Introduced clean architecture boundaries: domain types/catalog, engines for business rules, repository persistence, application actions, and UI screens.
- Replaced mock fixture dependency with persisted `MosslightState` initialized on first run and saved through `MosslightRepository`.
- Added production sanctuary progression: completed habits award XP, update ecosystem levels/unlocks, recalculate sanctuary level, clear expansion fog, and create milestone notifications.
- Added habit lifecycle actions: create, edit, schedule, complete, skip, archive, delete, streak tracking, growth contributions, weekly history, and monthly history.
- Added premium discovery engine with probability, inventory collection, history fields, unique artwork references, replay tokens, and notifications.
- Added expansion engine with milestone catalog, ownership tracking, fog states, animation states, rewards, and expansion notifications.
- Added friend request, interaction, remove, block, and recent activity logic without leaderboards or popularity metrics.
- Added notification preferences, notification creation, unread counts, and read handling.
- Added seasonal content engine that influences colors, wildlife/decorations copy, and ambient effects.
- Added accessibility settings for reduced motion, high contrast, large text, haptics, and color-blind-safe mode.
- Added loading, saving, error, and empty states throughout the mobile UI.

## Remaining technical debt

- Replace local-only repository with authenticated Supabase synchronization when project credentials are available.
- Add native push scheduling integration once Expo dependencies can be installed and device permissions can be tested.
- Replace emoji-based art references with final handcrafted vector/raster assets.
- Add full native navigation stacks for every detail page after dependency installation succeeds.
- Add end-to-end tests on device/simulator once dependencies are installable.

## Launch blockers

- npm registry access is currently blocked by `403 Forbidden`, preventing dependency installation and runtime verification.
- Supabase URL/key, OAuth provider configuration, Apple/Google auth setup, and subscription provider credentials are not available in this environment.
- App Store/Play Store subscription validation and privacy policy flows still require external service configuration.
