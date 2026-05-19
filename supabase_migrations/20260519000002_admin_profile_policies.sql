-- ============================================================
-- NeuroSpace — Admin Profile Management Policies
-- Migration: 20260519000002
--
-- The initial schema only gave admins SELECT on profiles.
-- blockUser / unblockUser / changeRole / changePlan / deleteUser
-- all fail at the DB level without UPDATE and DELETE policies.
-- ============================================================

-- Admins can update any user's profile (role, plan, status, etc.)
create policy "Admins update any profile"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can delete any profile (soft removal; auth.users row
-- requires a service-role Edge Function to fully purge)
create policy "Admins delete any profile"
  on public.profiles for delete
  using (public.is_admin());
