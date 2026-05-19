import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/Toast'

const MoodContext = createContext(null)

const MOOD_THEMES = {
  happy:   { start: '#fbbf24', end: '#f59e0b', bg: '#fffbeb', label: 'I ndritur' },
  calm:    { start: '#34d399', end: '#10b981', bg: '#f0fdf5', label: 'I qetë'   },
  neutral: { start: '#818cf8', end: '#6366f1', bg: '#f5f0ff', label: 'Neutral'  },
  sad:     { start: '#60a5fa', end: '#3b82f6', bg: '#eff8ff', label: 'I trishtë'},
  anxious: { start: '#f87171', end: '#ef4444', bg: '#fff5f5', label: 'Me ankth' },
}

const MOOD_EMOJIS = {
  happy: '😊', calm: '😌', neutral: '😐', sad: '😔', anxious: '😰',
}

const AI_MESSAGES = {
  happy:   'Sot je në një gjendje të shkëlqyer! Shfrytëzo këtë energji pozitive për diçka kuptimplote.',
  calm:    'Qetësia jote sot është një dhuratë. Vazhdo me të njëjtin ritëm të qetë.',
  neutral: 'Çdo ditë s\'duhet të jetë spektakolare. Neutralja ka vlerën e saj.',
  sad:     'Trishtimi është i natyrshëm. Jam këtu me ty — merr frymë ngadalë.',
  anxious: 'Kam kuptuar se je i shqetësuar. Le të bëjmë bashkë një ushtrim të thjeshtë frymëmarrjeje.',
}

const DAYS = ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht']

function ls(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function lsSave(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function calcStreak(history) {
  if (!history.length) return 0
  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date))
  let streak = 0
  let cursor = new Date(); cursor.setHours(0, 0, 0, 0)
  for (const entry of sorted) {
    const d = new Date(entry.date); d.setHours(0, 0, 0, 0)
    const diff = Math.round((cursor - d) / 86400000)
    if (diff <= 1) { streak++; cursor = d } else break
  }
  return streak
}

function rowToHistoryEntry(row) {
  const d = new Date(row.iso_date + 'T12:00:00')
  return { day: DAYS[d.getDay()], mood: row.score, date: row.iso_date, moodKey: row.mood }
}

export function MoodProvider({ children }) {
  const { user } = useAuth()
  const toast    = useToast()

  const [currentMood, setCurrentMoodState] = useState(() => ls('ns_mood_current', 'neutral'))
  const [moodScore,   setMoodScoreState]   = useState(() => ls('ns_mood_score',   6))
  const [moodHistory, setMoodHistoryState] = useState(() => ls('ns_mood_history', []))
  const [streak,      setStreak]           = useState(() => calcStreak(ls('ns_mood_history', [])))

  const theme = MOOD_THEMES[currentMood] || MOOD_THEMES.neutral

  useEffect(() => {
    document.documentElement.style.setProperty('--mood-color-start', theme.start)
    document.documentElement.style.setProperty('--mood-color-end',   theme.end)
  }, [currentMood, theme])

  // Load mood history from Supabase on login
  useEffect(() => {
    if (!user) return
    supabase
      .from('mood_entries')
      .select('mood, score, iso_date')
      .eq('user_id', user.id)
      .order('iso_date', { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (error || !data?.length) return
        const history = data.map(rowToHistoryEntry)
        setMoodHistoryState(history)
        lsSave('ns_mood_history', history)
        setStreak(calcStreak(history))
        // Set current mood from most recent entry
        const latest = data[0]
        setCurrentMoodState(latest.mood)
        setMoodScoreState(latest.score)
        lsSave('ns_mood_current', latest.mood)
        lsSave('ns_mood_score', latest.score)
      })
  }, [user?.id])

  function setCurrentMood(mood) {
    setCurrentMoodState(mood)
    lsSave('ns_mood_current', mood)
  }

  function setMoodScore(score) {
    setMoodScoreState(score)
    lsSave('ns_mood_score', score)
  }

  function setMoodHistory(updater) {
    setMoodHistoryState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      lsSave('ns_mood_history', next)
      setStreak(calcStreak(next))
      return next
    })
  }

  const logMood = useCallback(async (mood, score) => {
    setCurrentMood(mood)
    const s       = score ?? moodScore
    const today   = new Date().toISOString().slice(0, 10)
    const dayLabel = DAYS[new Date().getDay()]

    setMoodScore(s)
    setMoodHistory(prev => {
      const next  = [...prev]
      const idx   = next.findIndex(d => d.date === today)
      const entry = { day: dayLabel, mood: s, date: today, moodKey: mood }
      if (idx >= 0) next[idx] = entry
      else { next.push(entry); if (next.length > 30) next.shift() }
      return next
    })

    // Sync to Supabase if logged in (best-effort — local state already updated above)
    if (user) {
      try {
        const { error } = await supabase
          .from('mood_entries')
          .upsert(
            { user_id: user.id, mood, score: s, iso_date: today },
            { onConflict: 'user_id,iso_date' }
          )
        if (error) toast('Humori u ruajt lokalisht, por nuk u sinkronizua.', 'info')
      } catch {
        toast('Humori u ruajt lokalisht, por nuk u sinkronizua.', 'info')
      }
    }
  }, [user, moodScore])

  return (
    <MoodContext.Provider value={{
      currentMood, setCurrentMood,
      moodScore,   setMoodScore,
      moodHistory,
      streak,
      theme,
      emoji:     MOOD_EMOJIS[currentMood],
      aiMessage: AI_MESSAGES[currentMood],
      logMood,
      MOOD_THEMES, MOOD_EMOJIS,
    }}>
      {children}
    </MoodContext.Provider>
  )
}

export const useMood = () => useContext(MoodContext)
