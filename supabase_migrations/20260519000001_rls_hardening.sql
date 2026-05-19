-- ============================================================
-- NeuroSpace — RLS Hardening
-- Migration: 20260519000001
--
-- Fixes three security/correctness bugs in the initial schema:
--
--   1. Infinite recursion — admin policies on profiles, appointments,
--      and specialists all contained a subquery against public.profiles.
--      When triggered on the profiles table itself that causes PostgreSQL
--      to recurse until it errors. Fix: a security-definer helper
--      is_admin() that reads profiles with RLS bypassed.
--
--   2. Slot-availability broken — fetchDayBookings / fetchMonthBookings
--      query appointments to find already-booked slots for a psychologist.
--      The existing SELECT policy only exposes a user's own rows, so every
--      slot appeared free to every other user, allowing double-booking.
--      Fix: two security-definer RPCs that return only the non-PII columns
--      (start_time / end_time / status / date) needed for availability math.
--
--   3. Guest appointment inserts rejected — user_id is nullable to support
--      unauthenticated bookings, but the INSERT WITH CHECK evaluated
--      auth.uid() = user_id as NULL = NULL → NULL (falsy), blocking guests.
--      Fix: extend the check to explicitly allow null/null pairs.
-- ============================================================

-- ── 1. ADMIN HELPER (breaks recursion) ───────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Recreate admin policy on profiles using the helper
drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Recreate admin policy on appointments using the helper
drop policy if exists "Admins manage all appointments" on public.appointments;
create policy "Admins manage all appointments"
  on public.appointments for all
  using (public.is_admin())
  with check (public.is_admin());

-- Recreate admin policy on specialists using the helper
drop policy if exists "Admins manage specialists" on public.specialists;
create policy "Admins manage specialists"
  on public.specialists for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── 2. SLOT-AVAILABILITY RPCs ─────────────────────────────────────────────────

-- Returns booked (non-cancelled) slots for one psychologist on one day.
-- Called by fetchDayBookings in appointmentsService.js.
-- Only exposes start_time / end_time / status — no user PII.
create or replace function public.get_booked_slots(
  p_psychologist_id text,
  p_date            date
)
returns table (start_time time, end_time time, status text)
language sql
security definer
stable
set search_path = public
as $$
  select a.start_time, a.end_time, a.status
  from public.appointments a
  where a.psychologist_id = p_psychologist_id
    and a.date             = p_date
    and a.status          != 'cancelled';
$$;

-- Returns booked (non-cancelled) slots for one psychologist across a date range.
-- Called by fetchMonthBookings in appointmentsService.js.
create or replace function public.get_month_bookings(
  p_psychologist_id text,
  p_from            date,
  p_to              date
)
returns table (date date, start_time time, end_time time)
language sql
security definer
stable
set search_path = public
as $$
  select a.date, a.start_time, a.end_time
  from public.appointments a
  where a.psychologist_id = p_psychologist_id
    and a.date            >= p_from
    and a.date            <= p_to
    and a.status          != 'cancelled';
$$;

-- ── 3. GUEST APPOINTMENT INSERT ───────────────────────────────────────────────

drop policy if exists "Users insert appointments" on public.appointments;
create policy "Users insert appointments"
  on public.appointments for insert
  with check (
    -- Authenticated user booking under their own account
    (auth.uid() is not null and auth.uid() = user_id)
    or
    -- Guest booking: caller is anonymous, user_id must be null
    (auth.uid() is null and user_id is null)
  );

-- ── 4. GRANTS ─────────────────────────────────────────────────────────────────

grant execute on function public.is_admin()
  to authenticated;

grant execute on function public.get_booked_slots(text, date)
  to authenticated, anon;

grant execute on function public.get_month_bookings(text, date, date)
  to authenticated, anon;
