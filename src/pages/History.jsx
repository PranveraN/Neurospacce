import { useState, useEffect, useCallback, useRef } from 'react'
import {
  BookOpen, TrendingUp, Activity, Download, ChevronDown,
  Calendar, BarChart2, Clock, FileText, Sparkles, X,
  CheckCircle, Flame, Brain, MessageSquare,
} from 'lucide-react'
import { useMood } from '../contexts/MoodContext'
import { useAuth } from '../contexts/AuthContext'
import { getActivity } from '../lib/activityLog'
import { supabase } from '../lib/supabase'
import BackButton from '../components/BackButton'

/* ─── Constants ──────────────────────────────────────────────────────────── */

const DARK   = '#07041a'
const CARD   = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.18)' }
const ACTIVE = { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: 'white', border: '1px solid transparent', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }

const MOOD_LABEL = { happy: 'Lumtur', calm: 'I qetë', neutral: 'Neutral', sad: 'I trishtë', anxious: 'Me ankth' }
const MOOD_COLOR = { happy: '#fbbf24', calm: '#34d399', neutral: '#818cf8', sad: '#60a5fa', anxious: '#f87171' }
const MOOD_EMOJI = { happy: '😊', calm: '😌', neutral: '😐', sad: '😔', anxious: '😰' }

const MONTHS_SQ = ['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor']

const PERIODS = [
  { id: 'today', label: 'Sot',       days: 0  },
  { id: 'week',  label: 'Kjo javë',  days: 7  },
  { id: 'month', label: 'Ky muaj',   days: 30 },
  { id: '3m',    label: '3 muajt',   days: 90 },
  { id: 'all',   label: 'Gjithçka',  days: -1 },
]

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getStartDate(periodId) {
  const p = PERIODS.find(p => p.id === periodId)
  if (!p || p.days < 0) return new Date(0)
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  if (p.days === 0) return d
  d.setDate(d.getDate() - p.days)
  return d
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return `${d.getDate()} ${MONTHS_SQ[d.getMonth()]} ${d.getFullYear()}`
}

function fmtShort(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return `${d.getDate()} ${MONTHS_SQ[d.getMonth()]}`
}

function fmtTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })
}

function countWords(entries) {
  return entries.reduce((a, e) => a + (e.text || '').split(/\s+/).filter(Boolean).length, 0)
}

function calcJournalStreak(entries) {
  if (!entries.length) return 0
  const days = [...new Set(entries.map(e => e.isoDate).filter(Boolean))].sort().reverse()
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((new Date(days[i - 1]) - new Date(days[i])) / 86400000)
    if (diff === 1) streak++
    else break
  }
  return streak
}

function avgMoodScore(moodData) {
  if (!moodData.length) return null
  const s = moodData.reduce((a, b) => a + (b.mood || 0), 0) / moodData.length
  return s.toFixed(1)
}

/* ─── AI Advice generator ────────────────────────────────────────────────── */

function generateAdvice(moodData, journalData, activityData) {
  const avg       = moodData.length ? moodData.reduce((a, b) => a + (b.mood || 0), 0) / moodData.length : null
  const jFreq     = journalData.length
  const actCount  = activityData.length
  const moodKeys  = moodData.map(m => m.moodKey).filter(Boolean)
  const dominant  = moodKeys.reduce((acc, k) => { acc[k] = (acc[k] || 0) + 1; return acc }, {})
  const topMood   = Object.entries(dominant).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral'

  const summary = avg === null
    ? 'Nuk ka të dhëna të mjaftueshme për këtë periudhë. Fillo të regjistrosh humorin tënd çdo ditë.'
    : avg >= 7.5
      ? `Humori mesatar ${avg}/10 — po kalon një periudhë shumë të mirë! Emocioni kryesor: ${MOOD_LABEL[topMood] || topMood}. Vazhdo me ritmin e njëjtë.`
      : avg >= 5.5
        ? `Humori mesatar ${avg}/10 — periudhë e ekuilibruar. Emocioni kryesor: ${MOOD_LABEL[topMood] || topMood}. Ka hapësirë për rritje.`
        : `Humori mesatar ${avg}/10 — periudhë pak e vështirë. Nuk je vetëm — kjo është e natyrshme. Merr njëfarë kohe për veten.`

  const tips = []

  if (avg !== null && avg < 5) {
    tips.push('Provoni teknikën e frymëmarrjes 4-7-8: thithi 4 sekonda, mbaj 7, nxirr 8. Bëje 3 herë.')
    tips.push('Shkruaj çdo ditë 3 gjëra për të cilat jeni mirënjohës — edhe të vogla.')
    tips.push('Lëvizja fizike (ecje 20 min) ka efekt klinik të dëshmuar në uljen e ankthit.')
  } else if (avg !== null && avg < 7) {
    tips.push('Rutina e mëngjesit pa telefon për 15 min ndihmon të stabilizosh humorin e ditës.')
    tips.push('Lidhu me një person të besuar kur ndihesh nën presion — izolimi e rëndon gjendjen.')
    tips.push('Vendos kufij të qartë ndaj situatave që të ngarkojnë emocionalisht.')
  } else {
    tips.push('Ruaj energjinë pozitive duke ndihmuar dikë — gjeneralizimi i mirëqenies forcon kreativitetin.')
    tips.push('Dokumento çfarë funksionoi mirë këtë periudhë — kjo të ndihmon ta rikrijosh.')
    tips.push('Vendos një qëllim të ri të vogël që ta sfidosh veten kur je në formë të mirë.')
  }

  if (jFreq === 0) {
    tips.push('Shkrimi 5-10 min në ditë zvogëlon stresin me 25% sipas studimeve klinike. Provo ditarin!')
  } else if (jFreq < 3) {
    tips.push('Inkurajohu të shkruash më shpesh — edhe disa rreshta çdo ditë ndërtojnë ndërgjegjësinë.')
  }

  if (actCount < 2) {
    tips.push('Hap aplikacionin çdo ditë — edhe 2 minuta me teknikat e mindfulness japin rezultate.')
  }

  return { summary, tips: tips.slice(0, 4) }
}

/* ─── Print Report Component ─────────────────────────────────────────────── */

function PrintReport({ pRef, user, periodLabel, moodData, journalData, activityData, advice }) {
  const avg = avgMoodScore(moodData)
  const totalWords = countWords(journalData)
  const today = new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div ref={pRef} id="ns-print-report" className="hidden print:block">
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1e1b4b', maxWidth: 720, margin: '0 auto', padding: '40px 32px', background: 'white' }}>

        {/* Header */}
        <div style={{ borderBottom: '3px solid #7c3aed', paddingBottom: 20, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#7c3aed', letterSpacing: -0.5 }}>🧠 NeuroSpace</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Raport Personal i Mirëqenies Mendore</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{user?.username || user?.email?.split('@')[0] || 'Përdoruesi'}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Gjeneruar: {today}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Periudha: {periodLabel}</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Shënime ditari', value: journalData.length },
            { label: 'Humor mesatar', value: avg ? `${avg}/10` : 'N/A' },
            { label: 'Aktivitete', value: activityData.length },
            { label: 'Fjalë shkruara', value: totalWords },
          ].map(s => (
            <div key={s.label} style={{ background: '#f5f3ff', borderRadius: 10, padding: '12px 14px', border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#7c3aed' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* AI Summary */}
        <div style={{ background: '#f5f3ff', borderRadius: 12, padding: '16px 18px', marginBottom: 24, border: '1px solid #c4b5fd' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>✦ Analiza AI</div>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>{advice.summary}</p>
        </div>

        {/* Mood history */}
        {moodData.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#374151', marginBottom: 12, borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>
              📊 Historia e Humorit
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {moodData.slice(0, 20).map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, background: '#f9fafb', borderRadius: 6, padding: '4px 8px', border: '1px solid #e5e7eb' }}>
                  <span>{MOOD_EMOJI[m.moodKey] || '😐'}</span>
                  <span style={{ color: '#6b7280' }}>{fmtShort(m.date)}</span>
                  <span style={{ fontWeight: 700, color: MOOD_COLOR[m.moodKey] || '#818cf8' }}>{m.mood}/10</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journal entries */}
        {journalData.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#374151', marginBottom: 12, borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>
              📓 Shënimet e Ditarit
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {journalData.slice(0, 8).map((e, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${e.moodColor || '#818cf8'}`, paddingLeft: 12, paddingTop: 4, paddingBottom: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 3 }}>{fmtDate(e.isoDate)} · {e.moodLabel || 'Neutral'}</div>
                  <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.55, margin: 0 }}>
                    {e.text?.length > 300 ? e.text.slice(0, 300) + '...' : e.text}
                  </p>
                </div>
              ))}
              {journalData.length > 8 && (
                <p style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>...dhe {journalData.length - 8} shënime të tjera.</p>
              )}
            </div>
          </div>
        )}

        {/* Tips */}
        <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '16px 18px', marginBottom: 24, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>✦ Këshilla të Personalizuara</div>
          {advice.tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13, marginTop: 1, shrink: 0 }}>→</span>
              <p style={{ fontSize: 12, color: '#166534', lineHeight: 1.55, margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 10, color: '#9ca3af' }}>NeuroSpace · Konfidencial · Vetëm për përdorim personal</div>
          <div style={{ fontSize: 10, color: '#9ca3af' }}>neurospace.app</div>
        </div>
      </div>
    </div>
  )
}

/* ─── Report Modal ────────────────────────────────────────────────────────── */

function ReportModal({ onClose, onPrint, period, setPeriod }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl" style={{ background: '#100828', border: '1px solid rgba(139,92,246,0.35)' }}>

        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              <FileText size={18} color="white" />
            </div>
            <h3 className="font-black text-white text-lg leading-tight">Shkarko Raportin</h3>
            <p className="text-white/40 text-xs mt-0.5">Zgjidh periudhën e historisë</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            <X size={14} />
          </button>
        </div>

        <div className="px-6 pb-2 space-y-2">
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-sm font-semibold"
              style={period === p.id
                ? { background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.55)', color: '#c4b5fd' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }
              }>
              {p.label}
              {period === p.id && <CheckCircle size={15} style={{ color: '#a78bfa' }} />}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-2">
          <button onClick={onPrint}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-black text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 8px 24px rgba(124,58,237,0.40)' }}>
            <Download size={16} /> Shkarko si PDF
          </button>
          <button onClick={onClose}
            className="w-full py-2.5 rounded-2xl text-white/40 text-sm font-semibold hover:text-white/60 transition-colors">
            Anulo
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function History() {
  const { moodHistory } = useMood()
  const { user }        = useAuth()

  const [tab,       setTab]       = useState('journal')
  const [period,    setPeriod]    = useState('week')
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [journalEntries, setJournal] = useState([])
  const [loading,   setLoading]   = useState(true)

  const printRef = useRef(null)

  // Fetch journal from Supabase
  const fetchJournal = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error && data) {
      setJournal(data.map(row => ({
        id:         row.id,
        isoDate:    row.iso_date,
        date:       fmtDate(row.iso_date),
        moodLabel:  row.mood_label || 'Neutral',
        moodColor:  row.mood_color || '#818cf8',
        text:       row.text,
        aiAnalysis: row.ai_analysis || null,
      })))
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchJournal() }, [fetchJournal])

  // Activity log
  const activityLog = getActivity(user?.id)

  // Period filter
  const startDate = getStartDate(period)
  const filteredJournal  = journalEntries.filter(e  => e.isoDate && new Date(e.isoDate + 'T12:00:00') >= startDate)
  const filteredMood     = moodHistory.filter(m   => m.date  && new Date(m.date  + 'T12:00:00') >= startDate)
  const filteredActivity = activityLog.filter(a   => a.time  && new Date(a.time) >= startDate)

  const periodLabel = PERIODS.find(p => p.id === period)?.label || 'Kjo javë'
  const avg         = avgMoodScore(filteredMood)
  const totalWords  = countWords(filteredJournal)
  const jStreak     = calcJournalStreak(filteredJournal)

  const advice = generateAdvice(filteredMood, filteredJournal, filteredActivity)

  function handlePrint() {
    window.print()
    setShowModal(false)
  }

  const TABS = [
    { id: 'journal',  icon: BookOpen,    label: 'Ditari',    count: filteredJournal.length  },
    { id: 'mood',     icon: TrendingUp,  label: 'Humori',    count: filteredMood.length     },
    { id: 'activity', icon: Activity,    label: 'Aktiviteti', count: filteredActivity.length },
  ]

  return (
    <>
      {/* Print report — hidden in browser, visible only when printing */}
      <PrintReport
        pRef={printRef}
        user={user}
        periodLabel={periodLabel}
        moodData={filteredMood}
        journalData={filteredJournal}
        activityData={filteredActivity}
        advice={advice}
      />

      {/* Report modal */}
      {showModal && (
        <ReportModal
          onClose={() => setShowModal(false)}
          onPrint={handlePrint}
          period={period}
          setPeriod={setPeriod}
        />
      )}

      <div className="min-h-screen" style={{ background: DARK }}>
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-32">

          <BackButton fallback="/home" />

          {/* ── Page header ── */}
          <div className="mb-6 mt-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-black text-white text-2xl leading-tight">Historia Jote</h1>
                <p className="text-white/40 text-sm mt-1">Ditari · Humori · Aktiviteti — në një vend</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-xs font-bold transition-all hover:opacity-90 active:scale-95 shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
                <Download size={14} /> Shkarko PDF
              </button>
            </div>
          </div>

          {/* ── Period selector ── */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5 widget-scroll">
            {PERIODS.map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)}
                className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={period === p.id ? ACTIVE : { ...CARD, color: 'rgba(255,255,255,0.50)' }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* ── Stats strip ── */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { icon: BookOpen,   value: filteredJournal.length,  label: 'Shënime',  color: '#a78bfa' },
              { icon: TrendingUp, value: avg ?? '—',              label: avg ? '/10' : 'Humor', color: '#34d399' },
              { icon: Flame,      value: jStreak,                 label: 'Ditë radhazi', color: '#fb923c' },
              { icon: Brain,      value: totalWords > 999 ? (totalWords/1000).toFixed(1)+'k' : totalWords, label: 'Fjalë', color: '#60a5fa' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="rounded-2xl py-3 px-2 text-center" style={CARD}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                  style={{ background: color + '22' }}>
                  <Icon size={13} style={{ color }} />
                </div>
                <p className="font-black text-white text-base leading-none">{value}</p>
                <p className="text-[9px] text-white/35 font-medium mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* ── AI Insight strip ── */}
          <div className="rounded-2xl px-4 py-3.5 mb-5 flex items-start gap-3"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'rgba(124,58,237,0.25)' }}>
              <Sparkles size={14} style={{ color: '#c4b5fd' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Analiza AI · {periodLabel}</p>
              <p className="text-[12.5px] text-white/65 leading-relaxed">{advice.summary}</p>
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div className="flex gap-1.5 mb-5 p-1 rounded-2xl" style={CARD}>
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={tab === t.id ? ACTIVE : { color: 'rgba(255,255,255,0.40)' }}>
                  <Icon size={13} />
                  {t.label}
                  {t.count > 0 && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none"
                      style={{ background: tab === t.id ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)', color: tab === t.id ? 'white' : 'rgba(255,255,255,0.4)' }}>
                      {t.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Tab: Ditari ── */}
          {tab === 'journal' && (
            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                  <p className="text-white/40 text-sm">Duke ngarkuar shënimet...</p>
                </div>
              ) : filteredJournal.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-3">📓</div>
                  <p className="text-white/50 font-semibold text-sm">Nuk ka shënime për {periodLabel.toLowerCase()}.</p>
                  <a href="/journal" className="inline-block mt-3 text-violet-400 text-xs font-bold hover:underline">
                    Shto shënim të ri →
                  </a>
                </div>
              ) : filteredJournal.map(e => (
                <div key={e.id} className="rounded-3xl overflow-hidden transition-all" style={CARD}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                    onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: e.moodColor }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white/45">{e.date}</p>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: e.moodColor }}>{e.moodLabel}</p>
                    </div>
                    <p className="text-[12px] text-white/55 flex-1 min-w-0 line-clamp-1 text-right pr-2">
                      {e.text?.slice(0, 60)}...
                    </p>
                    <ChevronDown size={14} className="text-white/30 shrink-0 transition-transform"
                      style={{ transform: expandedId === e.id ? 'rotate(180deg)' : 'none' }} />
                  </button>
                  {expandedId === e.id && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                      <p className="text-[13px] text-white/65 leading-relaxed">{e.text}</p>
                      {e.aiAnalysis?.suggestion && (
                        <div className="mt-3 rounded-2xl px-3 py-2.5"
                          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.20)' }}>
                          <p className="text-[10px] font-bold text-violet-400 mb-1 flex items-center gap-1">
                            <Sparkles size={10} /> AI Insight
                          </p>
                          <p className="text-[11px] text-white/55">{e.aiAnalysis.suggestion}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Tab: Humori ── */}
          {tab === 'mood' && (
            <div className="space-y-3">
              {filteredMood.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-3">📊</div>
                  <p className="text-white/50 font-semibold text-sm">Nuk ka të dhëna të humorit për {periodLabel.toLowerCase()}.</p>
                  <a href="/mood" className="inline-block mt-3 text-violet-400 text-xs font-bold hover:underline">
                    Regjistro humorin sot →
                  </a>
                </div>
              ) : (
                <>
                  {/* Mini chart */}
                  <div className="rounded-3xl p-5" style={CARD}>
                    <div className="flex items-end justify-between gap-1.5 h-24">
                      {filteredMood.slice(-14).map((m, i) => {
                        const h = ((m.mood || 5) / 10) * 100
                        const col = MOOD_COLOR[m.moodKey] || '#818cf8'
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              {m.mood}/10
                            </div>
                            <div className="w-full rounded-t-md transition-all"
                              style={{ height: `${h}%`, background: col + 'cc', minHeight: 4 }} />
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[10px] text-white/30">Ultimi 14 ditë</p>
                      <p className="text-[11px] font-black" style={{ color: '#a78bfa' }}>
                        Mesatarja: <span className="text-white">{avg}/10</span>
                      </p>
                    </div>
                  </div>

                  {/* List */}
                  {filteredMood.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={CARD}>
                      <span className="text-xl">{MOOD_EMOJI[m.moodKey] || '😐'}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white/70">{fmtDate(m.date)}</p>
                        <p className="text-[11px] mt-0.5 font-semibold" style={{ color: MOOD_COLOR[m.moodKey] || '#818cf8' }}>
                          {MOOD_LABEL[m.moodKey] || 'Neutral'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${(m.mood / 10) * 100}%`, background: MOOD_COLOR[m.moodKey] || '#818cf8' }} />
                        </div>
                        <span className="text-xs font-black text-white/70 w-8 text-right">{m.mood}/10</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ── Tab: Aktiviteti ── */}
          {tab === 'activity' && (
            <div className="space-y-2">
              {filteredActivity.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-3">⚡</div>
                  <p className="text-white/50 font-semibold text-sm">Nuk ka aktivitet për {periodLabel.toLowerCase()}.</p>
                </div>
              ) : filteredActivity.map(a => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={CARD}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-white/75 leading-tight">{a.label}</p>
                  </div>
                  <div className="flex items-center gap-1 text-white/25 shrink-0">
                    <Clock size={10} />
                    <span className="text-[10px] font-medium">{fmtTime(a.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tips section ── */}
          {advice.tips.length > 0 && (
            <div className="mt-8 rounded-3xl p-5" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.18)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.18)' }}>
                  <MessageSquare size={13} style={{ color: '#34d399' }} />
                </div>
                <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Këshilla për ty</p>
              </div>
              <div className="space-y-3">
                {advice.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-black text-sm mt-0.5 shrink-0">→</span>
                    <p className="text-[12.5px] text-white/60 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
