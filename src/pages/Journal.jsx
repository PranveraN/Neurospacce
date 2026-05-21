import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PenLine, Sparkles, X, ChevronDown, Lock, Calendar, RefreshCw, Trash2, ArrowRight } from 'lucide-react'
import BackButton from '../components/BackButton'
import { useMood } from '../contexts/MoodContext'
import { useAuth } from '../contexts/AuthContext'
import { usePlan } from '../hooks/usePlan'
import { UpgradeBanner, PaywallOverlay } from '../components/paywall/UpgradePrompt'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/Toast'

const PROMPTS = [
  'Si u ndjeva sot dhe pse?',
  'Cila ishte gjëja që bëra mirë sot?',
  'Çfarë do të ndryshoja nga sot?',
  'Çfarë jam mirënjohës sot?',
  'Cili mendim më preokupoi shumë?',
]

// Map Supabase row → component shape
function rowToEntry(row) {
  return {
    id:         row.id,
    isoDate:    row.iso_date,
    date:       new Date(row.iso_date + 'T12:00:00').toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' }),
    moodLabel:  row.mood_label || 'Neutral',
    moodColor:  row.mood_color || '#818cf8',
    text:       row.text,
    aiAnalysis: row.ai_analysis || null,
  }
}

function calcJournalStreak(entries) {
  if (!entries.length) return 0
  const days = [...new Set(entries.map(e => e.isoDate).filter(Boolean))].sort().reverse()
  if (!days.length) return 1
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((new Date(days[i - 1]) - new Date(days[i])) / 86400000)
    if (diff === 1) streak++
    else break
  }
  return streak
}
function countWords(entries) {
  return entries.reduce((acc, e) => acc + e.text.split(/\s+/).filter(Boolean).length, 0)
}
function fmtWords(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
}

function AIReflectModal({ text, onClose, theme }) {
  const [loading, setLoading]   = useState(true)
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
      setAnalysis({
        emotions:  ['Ndërgjegjësi', 'Dëshirë', 'Reflektim'],
        thoughts:  'Shkrimi yt tregon ndërgjegjësi të lartë emocionale — ky është hapi i parë i rritjes.',
        suggestion:'Provo teknikën ACT Defusion: "Kam mendimin se..." dhe lëre të kalojë si re.',
        positives: 'Fakti që shkruan tregon kujdes për veten — kjo është fuqi, jo dobësi.',
      })
    }, 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl p-6 animate-slide-up"
        style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5 md:hidden" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)` }}>
              <Sparkles size={15} style={{ color: theme.start }} />
            </div>
            <h3 className="font-black text-lg text-gray-800">AI Reflect</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            <X size={14} />
          </button>
        </div>
        {loading ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: `linear-gradient(135deg, ${theme.start}33, ${theme.end}33)` }}>
              <Sparkles size={24} style={{ color: theme.start }} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Duke analizuar shkrimin tënd...</p>
            <div className="flex gap-1.5">
              {[0, 150, 300].map(d => (
                <div key={d} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-purple-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Emocionet</p>
              <div className="flex flex-wrap gap-2">
                {analysis.emotions.map(e => (
                  <span key={e} className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Mendimet</p>
              <p className="text-sm text-gray-700">{analysis.thoughts}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Pozitivja</p>
              <p className="text-sm text-gray-700">{analysis.positives}</p>
            </div>
            <div className="rounded-2xl p-4 border" style={{ borderColor: theme.start + '33' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: theme.start }}>Sugjerimi</p>
              <p className="text-sm text-gray-700 leading-relaxed">{analysis.suggestion}</p>
            </div>
            <button onClick={onClose} className="w-full py-3 rounded-2xl text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
              Faleminderit ✓
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function EntryCard({ entry, theme, onAIReflect, onDelete }) {
  const [expanded, setExpanded]   = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [deleting, setDeleting]   = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await onDelete(entry.id)
    setDeleting(false)
  }

  return (
    <div className="glass rounded-3xl p-4 shadow-card">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.moodColor }} />
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-700">{entry.date}</p>
          <p className="text-[10px] font-semibold" style={{ color: entry.moodColor }}>{entry.moodLabel}</p>
        </div>
        <Lock size={11} className="text-gray-300" />
        <button onClick={() => setExpanded(!expanded)} className="text-gray-300 hover:text-gray-500 transition-colors">
          <ChevronDown size={15} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <p className={`text-sm text-gray-600 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>{entry.text}</p>
      {expanded && (
        <div className="mt-3 animate-fade-in space-y-2">
          {entry.aiAnalysis && (
            <div className="bg-purple-50 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-purple-500" />
                <p className="text-xs font-bold text-purple-600">AI Insight</p>
              </div>
              <p className="text-xs text-gray-600">{entry.aiAnalysis.suggestion}</p>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => onAIReflect(entry.text)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-purple-50"
              style={{ borderColor: theme.start + '44', color: theme.start }}>
              <RefreshCw size={12} /> Ri-analizo me AI
            </button>
            {!confirmDel ? (
              <button onClick={() => setConfirmDel(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                <Trash2 size={12} /> Fshi
              </button>
            ) : (
              <div className="flex gap-1">
                <button onClick={() => setConfirmDel(false)}
                  className="px-2 py-1 rounded-lg text-xs font-bold border border-gray-200 text-gray-500">
                  Jo
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-red-500 text-white disabled:opacity-60">
                  {deleting ? '...' : 'Po, fshi'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Journal() {
  const { theme, currentMood, MOOD_THEMES } = useMood()
  const { user, accessToken }                         = useAuth()
  const { canUse, consumeFeature, isPro, isPremium }  = usePlan()

  const toast = useToast()

  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [text, setText]         = useState('')
  const [showAI, setShowAI]         = useState(false)
  const [showAIPaywall, setAIPaywall] = useState(false)
  const [showHistPaywall, setHistPaywall] = useState(false)
  const [aiText, setAiText]         = useState('')
  const [saved, setSaved]           = useState(false)
  const [promptIdx, setPromptIdx] = useState(0)
  const [atLimit, setAtLimit]   = useState(false)

  const canAIReflect = canUse('journalAI')
  const moodTheme    = MOOD_THEMES[currentMood] || theme

  // ── Fetch entries — raw fetch bypasses supabase-js lock ────────────────────
  const fetchEntries = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    try {
      const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
      const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
      const token    = accessToken || SUPA_KEY

      const ac  = new AbortController()
      const tid = setTimeout(() => ac.abort(), 10000)
      let rows = []
      try {
        const res = await fetch(
          `${SUPA_URL}/rest/v1/journal_entries?user_id=eq.${user.id}&order=created_at.desc&select=*`,
          {
            headers: {
              apikey:        SUPA_KEY,
              Authorization: `Bearer ${token}`,
              Accept:        'application/json',
            },
            signal: ac.signal,
          }
        )
        if (res.ok) rows = await res.json()
        else if (import.meta.env.DEV) console.warn('[Journal] fetch HTTP', res.status)
      } finally {
        clearTimeout(tid)
      }
      setEntries(rows.map(rowToEntry))
    } catch (err) {
      if (err.name !== 'AbortError' && import.meta.env.DEV) console.warn('[Journal] fetch:', err.message)
    } finally {
      setLoading(false)
    }
  }, [user, accessToken])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  // ── Save new entry ──────────────────────────────────────────────────────────
  async function saveEntry() {
    if (!text.trim() || !user || saving) return
    if (text.length > 5000) return

    // Server-side limit check
    const result = await consumeFeature('journal_entry')
    if (!result.allowed) { setAtLimit(true); return }

    setSaving(true)
    const today = new Date().toISOString().slice(0, 10)
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id:    user.id,
        text:       text.trim(),
        mood_label: moodTheme.label || 'Neutral',
        mood_color: moodTheme.start || '#818cf8',
        iso_date:   today,
      })
      .select()
      .single()

    setSaving(false)
    if (error) {
      toast('Shënimi nuk u ruajt. Provo përsëri.', 'error')
    } else if (data) {
      setEntries(prev => [rowToEntry(data), ...prev])
      setSaved(true)
      setTimeout(() => { setText(''); setSaved(false) }, 1200)
    }
  }

  // ── Delete entry ────────────────────────────────────────────────────────────
  async function deleteEntry(id) {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id).eq('user_id', user.id)
    if (error) { toast('Shënimi nuk u fshi. Provo përsëri.', 'error'); return }
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const canViewFullHistory = isPro || isPremium

  function openAI(t = text) {
    if (!t.trim()) return
    if (!canAIReflect) { setAIPaywall(true); return }
    setAiText(t); setShowAI(true)
  }

  const journalStreak    = calcJournalStreak(entries)
  const totalWords       = countWords(entries)
  const visibleEntries   = canViewFullHistory ? entries : entries.slice(0, 5)
  const hiddenCount      = canViewFullHistory ? 0 : Math.max(0, entries.length - 5)

  return (
    <div className="animate-fade-in">
      <BackButton fallback="/home" />
      {showAI         && <AIReflectModal text={aiText} onClose={() => setShowAI(false)} theme={theme} />}
      {showAIPaywall  && <PaywallOverlay reason="journalAI"       onClose={() => setAIPaywall(false)} />}
      {showHistPaywall && <PaywallOverlay reason="journalUnlimited" onClose={() => setHistPaywall(false)} />}

      {/* Header */}
      <div className="px-5 pt-14 md:pt-6 pb-6 text-white md:rounded-3xl mb-4"
        style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
        <div className="flex items-center gap-3 mb-4">
          <PenLine size={20} />
          <div>
            <h1 className="text-xl font-black">Ditari</h1>
            <p className="text-white/70 text-xs">Hapësira jote private e reflektimit</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { v: entries.length, l: 'Hyrje' },
            { v: `${journalStreak}d`, l: 'Streak' },
            { v: fmtWords(totalWords), l: 'Fjalë' },
          ].map(s => (
            <div key={s.l} className="bg-white/15 rounded-xl py-2">
              <p className="font-black text-lg">{s.v}</p>
              <p className="text-[10px] opacity-70">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-0 space-y-4">
        {/* Write area */}
        <div className="glass rounded-3xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hyrje e re</p>
            <button onClick={() => setPromptIdx(i => (i + 1) % PROMPTS.length)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-white"
              style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
              <RefreshCw size={11} /> Ide e re
            </button>
          </div>
          <div className="bg-purple-50 rounded-2xl px-4 py-2.5 mb-3 flex items-start gap-2">
            <Sparkles size={13} className="text-purple-400 mt-0.5 shrink-0" />
            <p className="text-xs text-purple-600 font-semibold italic">"{PROMPTS[promptIdx]}"</p>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value.slice(0, 5000))}
            placeholder="Shkruaj lirshëm — kjo hapësirë është vetëm jote..."
            rows={5}
            className="w-full bg-transparent resize-none text-base md:text-sm text-gray-700 placeholder-gray-300 outline-none leading-relaxed" />
          <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Lock size={11} className="text-gray-300" />
              <span className="text-[10px] text-gray-400">{text.split(/\s+/).filter(Boolean).length} fjalë</span>
              {text.length > 4000 && (
                <span className={`text-[10px] font-bold ml-2 ${text.length >= 5000 ? 'text-red-400' : 'text-orange-400'}`}>
                  {text.length}/5000
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {canAIReflect ? (
                <button onClick={() => openAI()} disabled={!text.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border disabled:opacity-40"
                  style={{ borderColor: theme.start + '55', color: theme.start }}>
                  <Sparkles size={11} /> AI Reflect
                </button>
              ) : (
                <button onClick={() => setAIPaywall(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-violet-200 text-violet-400 hover:bg-violet-50 transition-colors">
                  <Lock size={11} /> AI Reflect <span className="ml-0.5 text-[9px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-black">PRO</span>
                </button>
              )}
              <button onClick={saveEntry} disabled={!text.trim() || atLimit || saving}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-40 transition-colors"
                style={saved ? { background: '#22c55e' } : { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
                {saving ? '...' : saved ? '✓ Ruajtur' : 'Ruaj'}
              </button>
            </div>
          </div>
        </div>

        {/* Past entries */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: theme.start }} />
              <p className="font-bold text-gray-800 text-sm">Hyrjet e kaluara</p>
            </div>
            <span className="text-xs text-gray-400">{entries.length} gjithsej</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass rounded-3xl p-4 shadow-card animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {visibleEntries.map(e => (
                <EntryCard key={e.id} entry={e} theme={theme} onAIReflect={openAI} onDelete={deleteEntry} />
              ))}

              {/* Paywall card for hidden older entries */}
              {hiddenCount > 0 && (
                <button onClick={() => setHistPaywall(true)}
                  className="w-full glass rounded-3xl p-5 shadow-card border-2 border-dashed border-violet-200 hover:border-violet-400 transition-colors text-center group">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'linear-gradient(135deg,#7c3aed22,#6366f122)' }}>
                    <Lock size={18} className="text-violet-500" />
                  </div>
                  <p className="font-black text-gray-800 mb-1">+{hiddenCount} hyrje të mëparshme</p>
                  <p className="text-xs text-gray-400 mb-3">Shiko historikun e plotë me planin Pro</p>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity group-hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                    <Sparkles size={11} /> Zbulo Pro <ArrowRight size={11} />
                  </span>
                </button>
              )}

              {entries.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <PenLine size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Ende nuk ke hyrje. Fillo të shkruash!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {atLimit && <UpgradeBanner reason="journalUnlimited" />}
        <div className="h-4" />
      </div>
    </div>
  )
}
