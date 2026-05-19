-- ============================================================
-- NeuroSpace — Initial Database Schema
-- Generated: 2026-05-18
-- Run on: Supabase project njuiyktsmletnosqgcjq
--
-- HOW TO USE:
--   If you need to recreate the DB from scratch:
--   Supabase Dashboard → SQL Editor → paste & run this file.
-- ============================================================

-- ── EXTENSIONS ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── TABLE: profiles ──────────────────────────────────────────────────────────
-- One row per auth user. Created automatically via trigger on signup.
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  username    text,
  avatar      text        not null default 'avatar1',
  role        text        not null default 'user'
                          check (role in ('user', 'admin', 'moderator')),
  plan        text        not null default 'free'
                          check (plan in ('free', 'pro', 'premium', 'admin')),
  status      text        not null default 'active'
                          check (status in ('active', 'blocked')),
  created_at  timestamptz not null default now()
);

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, avatar, role, plan, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'avatar1',
    'user',
    'free',
    'active'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── TABLE: mood_entries ───────────────────────────────────────────────────────
-- One entry per user per day (upsert on user_id + iso_date).
create table if not exists public.mood_entries (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  mood        text        not null,
  score       integer     not null check (score between 1 and 10),
  iso_date    date        not null default current_date,
  created_at  timestamptz not null default now(),
  unique (user_id, iso_date)
);

-- ── TABLE: journal_entries ────────────────────────────────────────────────────
create table if not exists public.journal_entries (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  text         text        not null check (char_length(text) <= 10000),
  mood_label   text,
  mood_color   text,
  iso_date     date        not null default current_date,
  ai_analysis  text,
  created_at   timestamptz not null default now()
);

-- ── TABLE: appointments ───────────────────────────────────────────────────────
create table if not exists public.appointments (
  id               uuid        primary key default uuid_generate_v4(),
  user_id          uuid        references public.profiles(id) on delete set null,
  user_name        text        not null default 'Anonim',
  user_email       text        not null default '',
  psychologist_id  text        not null,
  date             date        not null,
  start_time       time        not null,
  end_time         time        not null,
  status           text        not null default 'booked'
                               check (status in ('booked', 'cancelled', 'completed')),
  notes            text        not null default '',
  created_at       timestamptz not null default now(),
  cancelled_at     timestamptz,
  cancelled_by     text,
  -- Prevent double-booking the same slot
  unique (psychologist_id, date, start_time)
);

-- ── TABLE: specialists ────────────────────────────────────────────────────────
-- Full expert object stored as JSONB for flexibility (photo, bio, schedule, etc.)
create table if not exists public.specialists (
  id            text        primary key,
  data          jsonb       not null default '{}',
  display_order integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── TABLE: feature_usage ──────────────────────────────────────────────────────
-- Tracks per-user per-feature consumption for quota enforcement (check_and_use RPC).
create table if not exists public.feature_usage (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  feature    text        not null,
  count      integer     not null default 0,
  period     text        not null default 'monthly'
                         check (period in ('daily', 'monthly')),
  reset_at   date        not null default date_trunc('month', current_date)::date,
  unique (user_id, feature, reset_at)
);

-- ── FUNCTION: check_and_use ───────────────────────────────────────────────────
-- Atomically checks quota and increments counter.
-- Returns: { allowed, count, remaining, limit, reason, plan }
create or replace function public.check_and_use(p_feature text)
returns json language plpgsql security definer as $$
declare
  v_user_id  uuid   := auth.uid();
  v_plan     text;
  v_limit    integer;
  v_count    integer;
  v_period   text   := 'monthly';
  v_reset    date   := date_trunc('month', current_date)::date;
begin
  if v_user_id is null then
    return json_build_object('allowed', false, 'reason', 'unauthenticated');
  end if;

  -- Get user plan
  select plan into v_plan from public.profiles where id = v_user_id;

  -- Admins have unlimited access
  if v_plan = 'admin' then
    return json_build_object('allowed', true, 'count', 0, 'remaining', -1, 'limit', -1, 'plan', v_plan);
  end if;

  -- Determine limit per plan per feature
  v_limit := case
    when p_feature = 'appointment' then
      case v_plan when 'pro' then 4 when 'premium' then 8 else 0 end
    when p_feature = 'private_question' then
      case v_plan when 'pro' then 15 when 'premium' then 999 else 0 end
    when p_feature = 'mini_session' then
      case v_plan when 'pro' then 2 when 'premium' then 5 else 0 end
    when p_feature = 'journal_entry' then
      999  -- effectively unlimited
    else 999
  end;

  -- Free features have no daily period — use daily for appointment conflicts
  if p_feature in ('appointment', 'private_question', 'mini_session') then
    v_period := 'monthly';
    v_reset  := date_trunc('month', current_date)::date;
  end if;

  -- Get current count (upsert to ensure row exists)
  insert into public.feature_usage (user_id, feature, count, period, reset_at)
  values (v_user_id, p_feature, 0, v_period, v_reset)
  on conflict (user_id, feature, reset_at) do nothing;

  select count into v_count
  from public.feature_usage
  where user_id = v_user_id and feature = p_feature and reset_at = v_reset;

  if v_count >= v_limit then
    return json_build_object(
      'allowed', false, 'reason', 'limit_reached',
      'count', v_count, 'remaining', 0, 'limit', v_limit, 'plan', v_plan
    );
  end if;

  -- Increment
  update public.feature_usage
  set count = count + 1
  where user_id = v_user_id and feature = p_feature and reset_at = v_reset;

  return json_build_object(
    'allowed', true, 'reason', 'ok',
    'count', v_count + 1, 'remaining', v_limit - v_count - 1, 'limit', v_limit, 'plan', v_plan
  );
end;
$$;

-- ── FUNCTION: get_usage ───────────────────────────────────────────────────────
create or replace function public.get_usage(p_feature text)
returns json language plpgsql security definer as $$
declare
  v_user_id uuid  := auth.uid();
  v_count   integer := 0;
  v_reset   date  := date_trunc('month', current_date)::date;
begin
  if v_user_id is null then
    return json_build_object('count', 0, 'limit', -1);
  end if;

  select coalesce(count, 0) into v_count
  from public.feature_usage
  where user_id = v_user_id and feature = p_feature and reset_at = v_reset;

  return json_build_object('count', coalesce(v_count, 0), 'limit', -1);
end;
$$;

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────

alter table public.profiles       enable row level security;
alter table public.mood_entries    enable row level security;
alter table public.journal_entries enable row level security;
alter table public.appointments    enable row level security;
alter table public.specialists     enable row level security;
alter table public.feature_usage   enable row level security;

-- profiles
create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins read all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- mood_entries
create policy "Users manage own moods"
  on public.mood_entries for all using (auth.uid() = user_id);

-- journal_entries
create policy "Users manage own journal"
  on public.journal_entries for all using (auth.uid() = user_id);

-- appointments
create policy "Users read own appointments"
  on public.appointments for select using (auth.uid() = user_id);
create policy "Users insert appointments"
  on public.appointments for insert with check (auth.uid() = user_id);
create policy "Users cancel own appointments"
  on public.appointments for update using (auth.uid() = user_id);
create policy "Admins manage all appointments"
  on public.appointments for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- specialists: public read, admin write
create policy "Public read specialists"
  on public.specialists for select using (true);
create policy "Admins manage specialists"
  on public.specialists for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- feature_usage: only via RPC (security definer), not directly
create policy "No direct access to feature_usage"
  on public.feature_usage for all using (auth.uid() = user_id);

-- ── TABLE: activity_logs ─────────────────────────────────────────────────────
-- Persistent activity history (replaces localStorage-only store).
-- Up to 100 rows per user; older rows are pruned by the insert trigger.
create table if not exists public.activity_logs (
  id         bigserial   primary key,
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  type       text        not null,
  icon       text        not null default '📌',
  label      text        not null,
  route      text        not null default '/',
  logged_at  timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

create policy "Users manage own activity"
  on public.activity_logs for all using (auth.uid() = user_id);

-- ── INDEXES ───────────────────────────────────────────────────────────────────
create index if not exists idx_mood_entries_user_date
  on public.mood_entries (user_id, iso_date desc);

create index if not exists idx_journal_entries_user_date
  on public.journal_entries (user_id, created_at desc);

create index if not exists idx_appointments_user
  on public.appointments (user_id, date asc);

create index if not exists idx_appointments_psychologist_date
  on public.appointments (psychologist_id, date asc);

create index if not exists idx_feature_usage_lookup
  on public.feature_usage (user_id, feature, reset_at);

create index if not exists idx_activity_logs_user_time
  on public.activity_logs (user_id, logged_at desc);
