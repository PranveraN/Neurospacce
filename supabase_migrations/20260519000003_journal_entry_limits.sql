-- ============================================================
-- NeuroSpace — Journal Entry Limits by Plan
-- Migration: 20260519000003
--
-- Free users: 15 journal entries per day (soft limit via check_and_use)
-- Pro/Premium/Admin: effectively unlimited (999/day)
-- This replaces the previous "999 for all" constant.
-- ============================================================

-- Replace check_and_use to honour plan-based journal limits.
-- Only the journal_entry case changes; all other cases are identical.
create or replace function public.check_and_use(p_feature text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid  := auth.uid();
  v_plan    text;
  v_limit   int;
  v_count   int;
  v_period  text := 'daily';
  v_reset   date := current_date;
begin
  if v_user_id is null then
    return json_build_object('allowed', false, 'reason', 'unauthenticated');
  end if;

  select plan into v_plan from public.profiles where id = v_user_id;
  v_plan := coalesce(v_plan, 'free');

  if v_plan = 'admin' then
    return json_build_object('allowed', true, 'count', 0, 'remaining', -1, 'limit', -1, 'plan', v_plan);
  end if;

  v_limit := case
    when p_feature = 'appointment' then
      case v_plan when 'pro' then 4 when 'premium' then 8 else 0 end
    when p_feature = 'private_question' then
      case v_plan when 'pro' then 15 when 'premium' then 999 else 0 end
    when p_feature = 'mini_session' then
      case v_plan when 'pro' then 2 when 'premium' then 5 else 0 end
    when p_feature = 'journal_entry' then
      case v_plan when 'free' then 15 else 999 end
    else 999
  end;

  if p_feature in ('appointment', 'private_question', 'mini_session') then
    v_period := 'monthly';
    v_reset  := date_trunc('month', current_date)::date;
  end if;

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

  update public.feature_usage
  set count = count + 1
  where user_id = v_user_id and feature = p_feature and reset_at = v_reset;

  return json_build_object(
    'allowed', true,
    'count', v_count + 1,
    'remaining', v_limit - v_count - 1,
    'limit', v_limit,
    'plan', v_plan
  );
end;
$$;

grant execute on function public.check_and_use(text) to authenticated;
