// ================================================================
// NeuroSphera — Self-Evolution State Hook
// All state persisted in localStorage, keyed by ns_evo_*
// ================================================================
import { useState, useCallback, useEffect } from 'react'
import { XP_REWARDS, getLevelFromXP, BADGES } from '../data/evolutionData'

const KEY = {
  xp:           'ns_evo_xp',
  streak:       'ns_evo_streak',
  lastActive:   'ns_evo_last_active',
  email:        'ns_evo_email',
  archetype:    'ns_evo_archetype',
  archetypeHistory: 'ns_evo_arch_history',
  checkins:     'ns_evo_checkins',
  completed:    'ns_evo_completed_challenges',
  badges:       'ns_evo_badges',
  events:       'ns_evo_events',
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function useEvolution() {
  const [xp,          setXpState]      = useState(() => load(KEY.xp, 0))
  const [streak,      setStreakState]   = useState(() => load(KEY.streak, 0))
  const [lastActive,  setLastActive]   = useState(() => load(KEY.lastActive, null))
  const [email,       setEmailState]   = useState(() => load(KEY.email, ''))
  const [archetype,   setArchState]    = useState(() => load(KEY.archetype, null))
  const [archetypeHistory, setArchHistory] = useState(() => load(KEY.archetypeHistory, []))
  const [checkins,    setCheckins]     = useState(() => load(KEY.checkins, []))
  const [completed,   setCompleted]    = useState(() => load(KEY.completed, []))
  const [badges,      setBadges]       = useState(() => load(KEY.badges, []))
  const [events,      setEvents]       = useState(() => load(KEY.events, []))

  // ── Update streak on mount ──────────────────────────────────────
  useEffect(() => {
    const today = todayStr()
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (lastActive === today) return // already logged today
    if (lastActive === yesterday) {
      const newStreak = streak + 1
      setStreakState(newStreak)
      save(KEY.streak, newStreak)
    } else if (lastActive !== null && lastActive !== today) {
      // broke streak
      setStreakState(0)
      save(KEY.streak, 0)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── XP helpers ─────────────────────────────────────────────────
  const addXP = useCallback((amount, reason) => {
    setXpState((prev) => {
      const next = prev + amount
      save(KEY.xp, next)
      const prevLevel = getLevelFromXP(prev).level
      const nextLevel = getLevelFromXP(next).level
      if (nextLevel > prevLevel) {
        // level-up event
        addEvent({ type: 'levelup', level: nextLevel, date: todayStr() })
      }
      return next
    })
    addEvent({ type: 'xp', amount, reason, date: todayStr() })
    touchActivity()
  }, []) // eslint-disable-line

  // ── Activity tracking ───────────────────────────────────────────
  const touchActivity = useCallback(() => {
    const today = todayStr()
    if (lastActive === today) return
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const newStreak = lastActive === yesterday ? streak + 1 : 1
    setStreakState(newStreak)
    save(KEY.streak, newStreak)
    setLastActive(today)
    save(KEY.lastActive, today)
    // Streak XP bonus
    if (newStreak % 7 === 0) addXP(XP_REWARDS.streak7days, 'streak_7')
    else if (newStreak % 30 === 0) addXP(XP_REWARDS.streak30days, 'streak_30')
    else addXP(XP_REWARDS.streakDay, 'streak_day')
    // Badge checks
    if (newStreak >= 3)  grantBadge('streak_3')
    if (newStreak >= 7)  grantBadge('streak_7')
    if (newStreak >= 30) grantBadge('streak_30')
  }, [lastActive, streak]) // eslint-disable-line

  // ── Email ───────────────────────────────────────────────────────
  const saveEmail = useCallback((emailVal) => {
    setEmailState(emailVal)
    save(KEY.email, emailVal)
    touchActivity()
  }, [touchActivity])

  // ── Archetype ───────────────────────────────────────────────────
  const saveArchetype = useCallback((result) => {
    const code = result.code
    const entry = { code, date: todayStr(), scores: result.scores, metrics: result.metrics }
    setArchState(result)
    save(KEY.archetype, result)
    setArchHistory((prev) => {
      const next = [entry, ...prev].slice(0, 20)
      save(KEY.archetypeHistory, next)
      return next
    })
    // XP
    const isRetake = load(KEY.archetypeHistory, []).length > 0
    addXP(isRetake ? XP_REWARDS.retakeTest : XP_REWARDS.completePersonaMatrix, 'test_complete')
    grantBadge('first_test')
    if (isRetake) grantBadge('retake')
  }, [addXP]) // eslint-disable-line

  // ── Daily check-in ──────────────────────────────────────────────
  const recordCheckin = useCallback((mood) => {
    const today = todayStr()
    setCheckins((prev) => {
      const filtered = prev.filter((c) => c.date !== today)
      const next = [{ date: today, mood }, ...filtered].slice(0, 90)
      save(KEY.checkins, next)
      return next
    })
    addXP(XP_REWARDS.dailyCheckin, 'checkin')
  }, [addXP])

  // ── Challenges ─────────────────────────────────────────────────
  const completeChallenge = useCallback((challengeId) => {
    const today = todayStr()
    const entry = `${today}_${challengeId}`
    setCompleted((prev) => {
      if (prev.includes(entry)) return prev
      const next = [entry, ...prev].slice(0, 500)
      save(KEY.completed, next)
      // Badge
      const count = next.filter((e) => e.includes('_ch')).length
      if (count >= 10) grantBadge('challenges_10')
      return next
    })
    addXP(XP_REWARDS.dailyChallenge, 'challenge')
  }, [addXP]) // eslint-disable-line

  function isChallengeCompleted(challengeId) {
    const today = todayStr()
    return completed.includes(`${today}_${challengeId}`)
  }

  // ── Badges ──────────────────────────────────────────────────────
  const grantBadge = useCallback((badgeId) => {
    setBadges((prev) => {
      if (prev.includes(badgeId)) return prev
      const next = [...prev, badgeId]
      save(KEY.badges, next)
      return next
    })
  }, [])

  // ── Events log ─────────────────────────────────────────────────
  const addEvent = useCallback((ev) => {
    setEvents((prev) => {
      const next = [ev, ...prev].slice(0, 200)
      save(KEY.events, next)
      return next
    })
  }, [])

  // ── Share ───────────────────────────────────────────────────────
  const recordShare = useCallback(() => {
    addXP(XP_REWARDS.shareResult, 'share')
    grantBadge('sharer')
  }, [addXP, grantBadge])

  // ── Weekly check-in mood avg ────────────────────────────────────
  const weeklyMoodAvg = (() => {
    const cutoff = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
    const week = checkins.filter((c) => c.date >= cutoff)
    if (!week.length) return null
    return Math.round((week.reduce((a, b) => a + b.mood, 0) / week.length) * 10) / 10
  })()

  // ── Today check-in ──────────────────────────────────────────────
  const todayCheckin = checkins.find((c) => c.date === todayStr()) || null

  return {
    xp, streak, email, archetype, archetypeHistory,
    checkins, completed, badges, events,
    weeklyMoodAvg, todayCheckin,
    saveEmail, saveArchetype, recordCheckin,
    completeChallenge, isChallengeCompleted,
    grantBadge, recordShare, addXP,
    hasEmail: !!email,
    hasArchetype: !!archetype,
  }
}
