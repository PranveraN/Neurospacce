import { useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { PLANS, FEATURES } from '../data/plansData'

/**
 * Plan enforcement hook.
 *
 * canUse(featureKey)      — synchronous, checks feature access by plan (plan comes from Supabase DB)
 * consumeFeature(feature) — async, calls PostgreSQL function server-side; returns { allowed, remaining, count, limit, reason }
 * getUsage(feature)       — async, returns { count, limit } for display
 *
 * Limits are defined ONLY in the PostgreSQL function check_and_use().
 * Frontend cannot override them.
 */
export function usePlan() {
  const { user } = useAuth()
  const planId   = user?.plan || 'free'
  const plan     = PLANS[planId] || PLANS.free
  const isAdmin  = user?.role === 'admin'
  const isPro     = planId === 'pro'     || planId === 'premium' || isAdmin
  const isPremium = planId === 'premium' || isAdmin

  /**
   * Synchronous feature gate. Plan value comes from Supabase DB, not localStorage.
   * @param {string} featureKey
   * @returns {boolean}
   */
  function canUse(featureKey) {
    if (isAdmin) return true
    const row = FEATURES[featureKey]
    if (!row) return true
    return row[planId] === true
  }

  /**
   * Server-side atomic quota check + increment via `check_and_use` RPC.
   * Paid quota features (appointment, private_question, mini_session) fail-closed on RPC error.
   * @param {string} feature
   * @returns {Promise<{ allowed: boolean, remaining?: number, count?: number, limit?: number, reason?: string }>}
   */
  const consumeFeature = useCallback(async (feature) => {
    if (!user) return { allowed: false, reason: 'unauthenticated' }
    if (isAdmin) return { allowed: true, remaining: -1, count: 0, limit: -1 }

    // Features where RPC failure MUST block the action — these are paid quota items.
    // All other features (journal, mood, etc.) can fail-open safely.
    const PAID_QUOTA_FEATURES = new Set(['appointment', 'private_question', 'mini_session'])
    const mustEnforce = PAID_QUOTA_FEATURES.has(feature)

    try {
      const { data, error } = await supabase.rpc('check_and_use', { p_feature: feature })
      if (error) {
        console.warn('[usePlan] consumeFeature RPC error:', error.message)
        if (mustEnforce) {
          return { allowed: false, reason: 'service_unavailable', count: 0, limit: 0 }
        }
        return { allowed: true, reason: 'server_error_fallback', count: 0, limit: -1 }
      }
      if (!data || typeof data !== 'object') {
        if (mustEnforce) {
          return { allowed: false, reason: 'service_unavailable', count: 0, limit: 0 }
        }
        return { allowed: true, count: 0, limit: -1 }
      }
      return data
    } catch (e) {
      console.warn('[usePlan] consumeFeature exception:', e.message)
      if (mustEnforce) {
        return { allowed: false, reason: 'service_unavailable', count: 0, limit: 0 }
      }
      return { allowed: true, reason: 'server_error_fallback', count: 0, limit: -1 }
    }
  }, [user, isAdmin])

  /**
   * @param {string} feature
   * @returns {Promise<{ count: number, limit: number }>} limit === -1 means unlimited
   */
  const getUsage = useCallback(async (feature) => {
    if (!user) return { count: 0, limit: -1 }
    if (isAdmin) return { count: 0, limit: -1 }
    try {
      const { data, error } = await supabase.rpc('get_usage', { p_feature: feature })
      if (error || !data) return { count: 0, limit: -1 }
      return data
    } catch { return { count: 0, limit: -1 } }
  }, [user, isAdmin])

  return { plan, planId, canUse, consumeFeature, getUsage, isPro, isPremium, isAdmin }
}
