import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Plus, Mic, CheckCircle, ArrowRight, X,
  Play, ChevronRight, Droplets,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useMood } from '../contexts/MoodContext'

/* ═══════════════════════════════════════════════
   CONSTANTS & DESIGN TOKENS
═══════════════════════════════════════════════ */

const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 24,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

const LABEL_CLS = 'text-[10px] font-bold tracking-[0.18em] uppercase'

/* orbit layout – fixed viewport so SVG lines are exact */
const OW = 490, OH = 268
const CX = 215, CY = 134  // planet center inside orbit canvas

const EMOTIONS = [
  { key: 'anxious',   emoji: '😟', label: 'Me ankth', pct: 40, color: '#f97316', x: 48,  y: 22  },
  { key: 'hopeful',   emoji: '💚', label: 'Shpresues', pct: 30, color: '#22c55e', x: 366, y: 28  },
  { key: 'motivated', emoji: '⭐', label: 'Motivuar',  pct: 50, color: '#eab308', x: 402, y: 140 },
  { key: 'calm',      emoji: '🌊', label: 'Qetë',      pct: 20, color: '#38bdf8', x: 272, y: 210 },
  { key: 'tired',     emoji: '😴', label: 'I lodhur',  pct: 60, color: '#a855f7', x: 32,  y: 158 },
]
const BUBBLE_HALF = 35   // half of emotion bubble width, for SVG line endpoint centering

const SUGGESTIONS = [
  { emoji: '🧘', label: 'Meditim i shpejtë',         dur: '5 min',  color: '#8b5cf6' },
  { emoji: '🌊', label: 'Ushtrim frymëmarrjeje',      dur: '3 min',  color: '#38bdf8' },
  { emoji: '🚶', label: 'Shëtitje e ndërgjegjshme',   dur: '10 min', color: '#22c55e' },
]

/* ═══════════════════════════════════════════════
   SHARED SUB-COMPONENTS
═══════════════════════════════════════════════ */

function CircularGauge({ value }) {
  const size = 100, sw = 8
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const off  = circ * (1 - value / 100)
  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <p className="text-[9px] font-bold text-white/35 uppercase tracking-[0.15em] text-center leading-tight">
        Intensiteti<br/>total
      </p>
      <div className="relative">
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="#38bdf8"/>
            </linearGradient>
          </defs>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={sw}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="url(#cg)" strokeWidth={sw}
            strokeDasharray={circ} strokeDashoffset={off}
            strokeLinecap="round"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-white leading-none">{value}%</span>
        </div>
      </div>
      <p className="text-[11px] text-white/40 font-medium">Mesatar</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MOOD ORBIT CARD
═══════════════════════════════════════════════ */

function MoodOrbitCard({ onDetailClick }) {
  const [sel, setSel]         = useState(null)
  const [gauge, setGauge]     = useState(72)

  function pickEmotion(e) {
    if (sel?.key === e.key) { setSel(null); setGauge(72); return }
    setSel(e)
    setGauge(Math.min(98, e.pct + 32))
  }

  return (
    <div className="rounded-3xl p-5 relative overflow-hidden" style={CARD}>
      {/* bg glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.07) 0%, transparent 65%)' }}/>

      <div className="flex items-start justify-between mb-1">
        <div>
          <p className={`${LABEL_CLS} text-purple-400`}>MOOD ORBIT</p>
          <p className="text-[12px] text-white/40 mt-0.5">Zgjedh dhe eksploro emocionet e tua</p>
        </div>
      </div>

      {/* orbit + gauge row */}
      <div className="flex items-center gap-4 mt-2">

        {/* ── ORBIT VISUALIZATION ── */}
        <div className="relative shrink-0" style={{ width: OW, height: OH }}>

          {/* SVG layer: orbit rings + connecting lines */}
          <svg className="absolute inset-0 pointer-events-none overflow-visible"
            width={OW} height={OH}>
            {/* Orbit ellipses */}
            <ellipse cx={CX} cy={CY} rx={86}  ry={66}  fill="none"
              stroke="rgba(139,92,246,0.18)" strokeWidth={1} strokeDasharray="5 5"/>
            <ellipse cx={CX} cy={CY} rx={138} ry={105} fill="none"
              stroke="rgba(139,92,246,0.10)" strokeWidth={1} strokeDasharray="3 7"/>

            {/* Connecting lines center → each emotion */}
            {EMOTIONS.map(e => (
              <line key={e.key}
                x1={CX} y1={CY}
                x2={e.x + BUBBLE_HALF} y2={e.y + BUBBLE_HALF}
                stroke={sel?.key === e.key ? e.color + 'aa' : 'rgba(255,255,255,0.10)'}
                strokeWidth={sel?.key === e.key ? 1.5 : 0.8}
                strokeDasharray="5 4"
              />
            ))}
          </svg>

          {/* Center planet */}
          <div
            className="absolute rounded-full animate-planet-pulse"
            style={{
              left: CX - 46, top: CY - 46, width: 92, height: 92,
              background: 'radial-gradient(circle at 32% 32%, #c4b5fd, #7c3aed 52%, #2e1065)',
            }}
          >
            {/* shine spot */}
            <div className="absolute rounded-full"
              style={{ width: 26, height: 16, top: 14, left: 16,
                background: 'rgba(255,255,255,0.3)', filter: 'blur(5px)', borderRadius: '50%' }}/>
          </div>

          {/* Emotion bubbles */}
          {EMOTIONS.map((e, i) => (
            <motion.button
              key={e.key}
              onClick={() => pickEmotion(e)}
              className="absolute flex flex-col items-center gap-0.5"
              style={{ left: e.x, top: e.y, width: 70 }}
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.45 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{
                  background: `${e.color}20`,
                  border: `1.5px solid ${e.color}55`,
                  boxShadow: sel?.key === e.key ? `0 0 18px ${e.color}77` : 'none',
                }}>
                {e.emoji}
              </div>
              <p className="text-[11px] font-bold leading-tight" style={{ color: e.color }}>{e.label}</p>
              <p className="text-[10px] text-white/45">{e.pct}%</p>
            </motion.button>
          ))}
        </div>

        {/* ── GAUGE ── */}
        <div className="ml-auto shrink-0 pr-2">
          <CircularGauge value={gauge}/>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onDetailClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white/70 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          Shiko detajet <ArrowRight size={13}/>
        </button>

        <AnimatePresence mode="wait">
          {sel && (
            <motion.div
              key={sel.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: `${sel.color}18`, border: `1px solid ${sel.color}44` }}
            >
              <span className="text-sm">{sel.emoji}</span>
              <span className="text-[13px] font-bold" style={{ color: sel.color }}>
                {sel.label} — {sel.pct}%
              </span>
              <button onClick={() => { setSel(null); setGauge(72) }}
                className="ml-1 opacity-40 hover:opacity-100 transition-opacity">
                <X size={12} color={sel.color}/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   LIVING JOURNAL CARD
═══════════════════════════════════════════════ */

function LivingJournalCard() {
  const [text,  setText]  = useState('')
  const [saved, setSaved] = useState(false)
  const { currentMood }   = useMood()

  const moodLabel = { anxious:'Me ankth', happy:'Lumtur', calm:'Qetë', sad:'I trishtë', neutral:'Neutral' }
  const moodColor = { anxious:'#f87171', happy:'#4ade80', calm:'#38bdf8', sad:'#818cf8', neutral:'#a78bfa' }
  const mc = moodColor[currentMood] || '#a78bfa'
  const ml = moodLabel[currentMood] || 'Neutral'

  function handleSave() {
    if (!text.trim()) return
    try {
      const arr = JSON.parse(localStorage.getItem('ns_journal_entries') || '[]')
      arr.unshift({ text, date: new Date().toISOString(), mood: currentMood })
      localStorage.setItem('ns_journal_entries', JSON.stringify(arr))
    } catch {}
    setSaved(true)
    setTimeout(() => { setSaved(false); setText('') }, 2500)
  }

  return (
    <div className="rounded-3xl p-5 relative overflow-hidden flex flex-col" style={{ ...CARD, minHeight: 280 }}>
      {/* atmospheric bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(120,40,20,0.18) 0%, transparent 60%),
                       linear-gradient(to bottom right, rgba(30,10,60,0.5), transparent 70%)`,
        }}/>
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(200,80,20,0.10), transparent)' }}/>

      <div className="relative z-10 flex flex-col h-full gap-3">
        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <p className={`${LABEL_CLS} text-purple-400`}>LIVING JOURNAL</p>
            <p className="text-[11px] text-white/35 mt-0.5">Hapësira jote e sigurt</p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: `${mc}18`, color: mc, border: `1px solid ${mc}44` }}>
            😟 Mood: {ml}
          </span>
        </div>

        {/* textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Çfarë ke në mendje sot?"
          className="flex-1 bg-transparent resize-none text-[13px] text-white/75 placeholder-white/20 outline-none leading-relaxed"
          rows={5}
        />

        {/* actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)' }}
          >
            <Mic size={15} className="text-white/50"/>
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[13px] transition-all"
            style={{
              background: saved ? 'rgba(34,197,94,0.18)' : 'rgba(34,197,94,0.12)',
              border: `1px solid ${saved ? 'rgba(34,197,94,0.55)' : 'rgba(34,197,94,0.28)'}`,
              color: '#4ade80',
            }}
          >
            <CheckCircle size={14}/>
            {saved ? 'U ruajt!' : 'Ruaj shënimin'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   AI MIRROR CARD
═══════════════════════════════════════════════ */

function AIMirrorCard({ onOpen }) {
  const { aiMessage } = useMood()

  const insightText = aiMessage || 'Duket si lodhje emocionale, jo dembelizëm.'
  const subText = 'Po i mban shumë brenda. Ndoshta është koha për t\'u lehtësuar.'

  return (
    <div className="rounded-3xl p-5 relative overflow-hidden flex flex-col" style={{ ...CARD, minHeight: 280 }}>
      {/* bg glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(139,92,246,0.12) 0%, transparent 65%)' }}/>

      <div className="relative z-10 w-full">
        <p className={`${LABEL_CLS} text-purple-400`}>AI MIRROR</p>
        <p className="text-[11px] text-white/35 mt-0.5 mb-4">Pasqyrimi yt ditor</p>
      </div>

      {/* animated energy rings */}
      <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: 140 }}>
        {/* outer ring */}
        <div className="absolute rounded-full animate-ai-spin-slow"
          style={{ width: 136, height: 136, border: '1.5px solid rgba(139,92,246,0.22)',
            borderTopColor: 'rgba(139,92,246,0.65)', boxShadow: '0 0 20px rgba(139,92,246,0.15)' }}/>
        {/* mid ring */}
        <div className="absolute rounded-full animate-ai-spin-ccw"
          style={{ width: 100, height: 100, border: '1.5px solid rgba(168,85,247,0.25)',
            borderBottomColor: 'rgba(236,72,153,0.7)' }}/>
        {/* inner ring */}
        <div className="absolute rounded-full animate-ai-spin"
          style={{ width: 66, height: 66, border: '1.5px solid rgba(56,189,248,0.3)',
            borderLeftColor: 'rgba(56,189,248,0.8)' }}/>
        {/* core glow */}
        <div className="absolute w-9 h-9 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.9), transparent)',
            filter: 'blur(10px)', animation: 'planet-pulse 3s ease-in-out infinite' }}/>
      </div>

      {/* insight text */}
      <div className="relative z-10 text-center px-2 mt-1">
        <p className="text-[13px] font-bold text-white/90 leading-snug">{insightText}</p>
        <p className="text-[11px] text-white/40 leading-relaxed mt-1">{subText}</p>
      </div>

      <button
        onClick={onOpen}
        className="relative z-10 flex items-center justify-center gap-2 mt-4 text-[13px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
      >
        Më trego si <ArrowRight size={13}/>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DAILY SUGGESTIONS CARD
═══════════════════════════════════════════════ */

function DailySuggestionsCard({ onSuggestionClick }) {
  return (
    <div className="rounded-3xl p-5 relative overflow-hidden" style={CARD}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 10% 50%, rgba(88,28,220,0.05) 0%, transparent 55%)' }}/>

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          {/* small visual */}
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center text-3xl"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
            🧘‍♀️
          </div>
          <div>
            <p className={`${LABEL_CLS} text-purple-400`}>SUGJERIMI I DITËS</p>
            <p className="text-[12px] text-white/40 mt-0.5 leading-relaxed">
              Bëj një pauzë 5-minutëshe.<br/>Merr frymë thellë dhe kthehu tek vetja.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {SUGGESTIONS.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => onSuggestionClick(s)}
              className="flex-1 flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}2a` }}
              whileHover={{ scale: 1.02, borderColor: `${s.color}60` }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
                style={{ background: `${s.color}1c` }}>
                {s.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-white/85 leading-snug">{s.label}</p>
                <p className="text-[10px] text-white/35 mt-0.5">{s.dur}</p>
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${s.color}28` }}>
                <Play size={10} fill={s.color} strokeWidth={0}/>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MODALS
═══════════════════════════════════════════════ */

const MODAL_BG = {
  background: 'rgba(12,6,36,0.96)',
  border: '1px solid rgba(139,92,246,0.28)',
  borderRadius: 28,
}

function AiModal({ onClose }) {
  const tips = [
    { emoji: '🌬️', title: 'Ushtrim frymëmarrjeje', body: 'Merr frymë 4 sek, mbaj 4 sek, nxirr 6 sek. Përsërit 5 herë ngadalë.' },
    { emoji: '📝', title: 'Shprehje emocioneve', body: 'Shkruaj 3 gjëra që po të shqetësojnë tani. Shprehja i zbeh ato.' },
    { emoji: '🌿', title: 'Ankorimi në të tanishme', body: 'Gjej 5 gjëra që mund t\'i shohësh rreth teje. Fokus tek e tashmja.' },
  ]
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}/>
      <motion.div className="relative max-w-md w-full p-6" style={MODAL_BG}
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <X size={14}/>
        </button>
        <p className={`${LABEL_CLS} text-purple-400 mb-0.5`}>AI MIRROR</p>
        <h2 className="text-lg font-black text-white mb-5">Udhëzimi yt personal</h2>
        <div className="space-y-3">
          {tips.map((t, i) => (
            <div key={i} className="flex gap-3 p-3.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-2xl leading-none mt-0.5">{t.emoji}</span>
              <div>
                <p className="text-[13px] font-bold text-white">{t.title}</p>
                <p className="text-[11px] text-white/45 mt-0.5 leading-relaxed">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function SuggestionModal({ s, onClose }) {
  const [elapsed, setElapsed] = useState(0)
  const total = parseInt(s.dur) * 60

  useEffect(() => {
    const t = setInterval(() => setElapsed(p => p + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const pct  = Math.min(100, (elapsed / total) * 100)
  const mins = Math.floor(elapsed / 60)
  const secs = (elapsed % 60).toString().padStart(2, '0')

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}/>
      <motion.div className="relative max-w-sm w-full p-6 text-center"
        style={{ ...MODAL_BG, borderColor: `${s.color}44` }}
        initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <X size={14}/>
        </button>
        <div className="text-4xl mb-2">{s.emoji}</div>
        <h2 className="text-base font-black text-white mb-0.5">{s.label}</h2>
        <p className="text-[11px] text-white/40 mb-6">{s.dur}</p>

        <div className="relative inline-flex items-center justify-center mb-6">
          <svg width={120} height={120}>
            <circle cx={60} cy={60} r={50} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8}/>
            <circle cx={60} cy={60} r={50} fill="none" stroke={s.color} strokeWidth={8}
              strokeDasharray={314} strokeDashoffset={314 * (1 - pct / 100)}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}/>
          </svg>
          <div className="absolute text-xl font-black text-white">{mins}:{secs}</div>
        </div>

        <button onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-[13px] transition-all"
          style={{ background: `${s.color}28`, border: `1px solid ${s.color}50`, color: s.color }}>
          Mbaro seancën
        </button>
      </motion.div>
    </motion.div>
  )
}

function NoteModal({ onClose }) {
  const [text,  setText]  = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!text.trim()) return
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 1500)
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}/>
      <motion.div className="relative max-w-md w-full p-6" style={MODAL_BG}
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <X size={14}/>
        </button>
        <p className={`${LABEL_CLS} text-purple-400 mb-0.5`}>SHËNIM I RI</p>
        <h2 className="text-lg font-black text-white mb-4">Çfarë ke në mendje?</h2>
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="Shëno mendimin tënd këtu..."
          className="w-full bg-transparent resize-none text-[13px] text-white/80 placeholder-white/20 outline-none leading-relaxed border-b pb-3 mb-4"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          rows={5} autoFocus
        />
        <button onClick={handleSave}
          className="w-full py-3 rounded-2xl font-bold text-[13px] transition-all"
          style={{
            background: saved ? 'rgba(34,197,94,0.18)' : 'rgba(139,92,246,0.18)',
            border: `1px solid ${saved ? 'rgba(34,197,94,0.45)' : 'rgba(139,92,246,0.45)'}`,
            color: saved ? '#4ade80' : '#a78bfa',
          }}>
          {saved ? '✓ U ruajt!' : 'Ruaj shënimin'}
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════ */

export default function Home() {
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const [showAi,       setShowAi]       = useState(false)
  const [showNote,     setShowNote]     = useState(false)
  const [activeSug,    setActiveSug]    = useState(null)
  const [notifCount]                    = useState(3)

  const firstName = (
    user?.username?.split(/[\s_]/)[0] ||
    user?.email?.split('@')[0] ||
    'Arta'
  )

  const hour = new Date().getHours()
  const timeEmoji = hour >= 5 && hour < 12 ? '☀️' : hour >= 12 && hour < 18 ? '🌤️' : '🌙'

  return (
    <div className="space-y-4">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-white leading-tight">
            Mirë u ktheve, {firstName}! {timeEmoji}
          </h1>
          <p className="text-[13px] text-white/45 mt-0.5">
            Si është hapësira jote mendore sot?
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            onClick={() => setShowNote(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white/80 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          >
            <Plus size={14}/> Shto shënim
          </motion.button>
          <button
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <Bell size={15} className="text-white/60"/>
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-[9px] font-black text-white"
                style={{ boxShadow: '0 0 8px rgba(139,92,246,0.7)' }}>
                {notifCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── MOOD ORBIT ── */}
      <MoodOrbitCard onDetailClick={() => navigate('/mood')}/>

      {/* ── JOURNAL + AI MIRROR ── */}
      <div className="grid grid-cols-2 gap-4">
        <LivingJournalCard/>
        <AIMirrorCard onOpen={() => setShowAi(true)}/>
      </div>

      {/* ── DAILY SUGGESTIONS ── */}
      <DailySuggestionsCard onSuggestionClick={s => setActiveSug(s)}/>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showAi    && <AiModal key="ai" onClose={() => setShowAi(false)}/>}
        {showNote  && <NoteModal key="note" onClose={() => setShowNote(false)}/>}
        {activeSug && <SuggestionModal key="sug" s={activeSug} onClose={() => setActiveSug(null)}/>}
      </AnimatePresence>

    </div>
  )
}
