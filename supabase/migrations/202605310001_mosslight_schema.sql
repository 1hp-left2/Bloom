-- Mosslight Supabase schema: peaceful habit growth without punitive resets.
create type public.ecosystem_kind as enum ('forest', 'garden', 'pond', 'meadow');
create type public.habit_difficulty as enum ('easy', 'medium', 'hard');
create type public.friend_gift_kind as enum ('water_drop', 'sunshine_boost', 'encouragement_note');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'New Gardener',
  avatar_emoji text not null default '🌱',
  sanctuary_name text not null default 'Mosslight Clearing',
  current_streak integer not null default 0 check (current_streak >= 0),
  sanctuary_growth integer not null default 0 check (sanctuary_growth >= 0),
  premium_until timestamptz,
  reduced_motion boolean not null default false,
  high_contrast boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ecosystems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind public.ecosystem_kind not null,
  growth integer not null default 0 check (growth >= 0),
  level integer not null default 1 check (level >= 1),
  gentle_neglect_score integer not null default 0 check (gentle_neglect_score >= 0),
  unique (user_id, kind)
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ecosystem_id uuid not null references public.ecosystems(id) on delete cascade,
  title text not null,
  difficulty public.habit_difficulty not null default 'easy',
  target_label text not null default '1 session',
  reminder_time time,
  frequency jsonb not null default '{"days":[1,2,3,4,5,6,7]}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  completed_on date not null default current_date,
  growth_awarded integer not null check (growth_awarded > 0),
  streak_multiplier numeric(4,2) not null default 1.00,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create table public.sanctuary_discoveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ecosystem_id uuid references public.ecosystems(id) on delete set null,
  discovery_name text not null,
  rarity text not null default 'common',
  discovered_at timestamptz not null default now()
);

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

create table public.friend_gifts (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  gift_kind public.friend_gift_kind not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.ecosystems enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.sanctuary_discoveries enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_gifts enable row level security;

create policy "profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "profiles are editable by owner" on public.profiles for update using (auth.uid() = id);
create policy "ecosystems owned by user" on public.ecosystems for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits owned by user" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "completions owned by user" on public.habit_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "discoveries owned by user" on public.sanctuary_discoveries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "friendships visible to participants" on public.friendships for select using (auth.uid() in (requester_id, addressee_id));
create policy "friendships created by requester" on public.friendships for insert with check (auth.uid() = requester_id);
create policy "friend gifts visible to participants" on public.friend_gifts for select using (auth.uid() in (sender_id, recipient_id));
create policy "friend gifts sent by user" on public.friend_gifts for insert with check (auth.uid() = sender_id);
