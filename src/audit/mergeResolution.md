# Merge Resolution Audit

## Conflict scan

The current branch was audited for unresolved conflict markers in the requested files:

- `App.tsx`
- `README.md`
- `src/components/HabitCard.tsx`
- `src/components/SanctuaryIllustration.tsx`
- `src/game/mosslight.ts`
- `supabase/migrations/202605310001_mosslight_schema.sql`
- `tests/mosslightLogic.test.cjs`

No standard Git conflict marker lines remain in the working tree.

## Resolution decisions

- Kept the most complete React Native application shell in `App.tsx`, including persisted state loading, saving indicators, error states, home/sanctuary/habits/friends/profile flows, premium activation, notification preferences, seasonal refresh, and accessibility toggles.
- Kept the expanded README architecture and launch-blocker documentation so future maintainers can distinguish implemented production code from environment-dependent integrations.
- Kept the production `HabitCard` with complete/skip/edit/archive actions, schedule metadata, streak display, accessible labels, and persisted entry awareness.
- Kept the state-driven `SanctuaryIllustration` with ecosystem levels, XP, fog-of-discovery expansion state, seasonal colors, ambient effects, and reduced-motion support.
- Kept `src/game/mosslight.ts` as a compatibility export surface so callers can import the complete production engines without duplicating logic.
- Kept all Supabase schema additions, including original habit/ecosystem/friend tables plus expansion areas, app notifications, notification preferences, seasonal events, premium discovery metadata, friend blocking metadata, and RLS policies.
- Kept and updated source-level test coverage for growth economy, streak multipliers, expansion milestones, premium discovery gating, ecosystem XP application, and expansion unlock application.

## Post-merge audit

- TypeScript compilation passes with the repository's local native shims.
- Logic smoke tests pass.
- A full dependency install remains blocked by the external npm registry returning `403 Forbidden` for `@expo/vector-icons`, so runtime device verification is still an environment launch blocker rather than a merge conflict issue.
