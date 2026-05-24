import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import EditableText from '../components/EditableText'
import PublicLayout from '../components/layout/PublicLayout'
import {
  Brain, BookOpen, Lightbulb, Bot, ChevronRight, ChevronLeft,
  Clock, Send, Zap, TrendingUp, Quote, Shield, ExternalLink,
  Play, Calendar, Trophy, CheckCircle, Circle, Users, Star,
  MessageCircle, Heart, Lock, Activity,
} from 'lucide-react'
import {
  PARENT_CATEGORIES, PARENTING_ARTICLES,
  PARENTING_TECHNIQUES, AI_PROMPTS, generateParentingResponse,
} from '../data/parentingData'

const PARENTING_MAX_DEPTH = 4

// ─── Color palette ───────────────────────────────────────────────────────────
const G = {
  page:    'linear-gradient(160deg,#011c14 0%,#022c22 50%,#011c14 100%)',
  card:    'rgba(255,255,255,0.04)',
  cardHov: 'rgba(255,255,255,0.07)',
  border:  'rgba(110,231,183,0.13)',
  borderA: 'rgba(110,231,183,0.35)',
  accent:  '#34d399',
  accentD: '#059669',
  accentDD:'#047857',
  btn:     'linear-gradient(135deg,#059669,#047857)',
  btnGlow: '0 4px 20px rgba(5,150,105,0.45)',
  textPri: 'rgba(255,255,255,0.92)',
  textSec: 'rgba(255,255,255,0.55)',
  textMut: 'rgba(255,255,255,0.30)',
  dot:     'radial-gradient(circle,rgba(110,231,183,0.09) 1px,transparent 1px)',
}

// ─── Static data ──────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { emoji: '👶', label: 'Nuk më dëgjon',       prompt: 'Fëmija im nuk dëgjon asgjë. Si të veproj?' },
  { emoji: '📱', label: 'Shumë telefon',        prompt: 'Si ta kufizoj kohën e ekranit me fëmijën tim?' },
  { emoji: '😡', label: 'Zemërim & shpërthime', prompt: "Fëmija im ka humbje temperamenti të shpeshta. Si t'i menaxhoj?" },
  { emoji: '📚', label: 'Probleme në mësim',    prompt: 'Fëmija im nuk dëshiron të bëjë detyrat e shtëpisë. Si ta ndihmoj?' },
  { emoji: '😟', label: 'Ankth & frikë',        prompt: 'Fëmija im ka ankth dhe frikë të shpeshta. Si ta ndihmoj?' },
  { emoji: '🏫', label: 'Probleme në shkollë',  prompt: 'Fëmija im ka probleme serioze në shkollë. Si të veproj?' },
  { emoji: '👦', label: 'Bullizëm',             prompt: 'Fëmija im po viktimzohet në shkollë. Çfarë duhet të bëj?' },
  { emoji: '💔', label: 'Konflikte familjare',  prompt: "Ka konflikte të shpeshta në familje. Si t'i zgjidhim?" },
]

const SOS_TAGS = [
  { emoji: '💗', label: 'Krizë emocionale', prompt: 'Fëmija im është në krizë emocionale. Si ta qetësoj?' },
  { emoji: '😡', label: 'Zemërim',          prompt: 'Fëmija im është shumë i zemëruar tani. Çfarë duhet të bëj?' },
  { emoji: '🔥', label: 'Konflikt',         prompt: 'Ka konflikt serioz në familje. Si ta zgjidhim tani?' },
  { emoji: '😟', label: 'Ankth',            prompt: 'Fëmija im tregon shenja ankthi të forta. Si ta ndihmoj?' },
  { emoji: '⚡', label: 'Sjellje sfiduese', prompt: 'Fëmija im ka sjellje sfiduese dhe nuk respekton rregullat.' },
]

const PULSE_DATA = [
  { label: 'Komunikimi',        pct: 78 },
  { label: 'Lidhja emocionale', pct: 72 },
  { label: 'Disiplina',         pct: 64 },
  { label: 'Koha cilësore',     pct: 81 },
  { label: 'Teknologjia',       pct: 58 },
]

const VIDEO_LESSONS = [
  { id: 1, title: 'Si ta dëgjosh fëmijën tënd?',          dur: '2:45', views: '1.2k' },
  { id: 2, title: 'Menaxhimi i zemërimit',                 dur: '3:10', views: '987'  },
  { id: 3, title: 'Rutina që forcon sjelljen pozitive',    dur: '4:02', views: '2.1k' },
]

const JOURNEY_LEVELS = [
  { emoji: '🌱', label: 'Fillestar',       desc: 'Fillo rrugëtimin', active: true,  locked: false },
  { emoji: '🌿', label: 'I Vetëdijshëm',   desc: '5+ teknika',       active: false, locked: false },
  { emoji: '🌳', label: 'I Angazhuar',     desc: '20+ sesione',      active: false, locked: true  },
  { emoji: '👑', label: 'Mentor Familjar', desc: 'Nivel maksimal',   active: false, locked: true  },
]

const CHALLENGE_ITEMS = [
  { label: '3 darka pa telefon',    done: true  },
  { label: '2 biseda 10-minutëshe', done: true  },
  { label: '1 aktivitet familjar',  done: false },
]

const AGE_CATS = [
  { emoji: '👶', label: '0–2 vjeç',    sub: 'Bebet',            id: 'first-time'    },
  { emoji: '🧒', label: '3–5 vjeç',    sub: 'Parashkollorët',   id: 'first-time'    },
  { emoji: '👦', label: '6–12 vjeç',   sub: 'Fëmijët',          id: 'kids-6-12'     },
  { emoji: '🧑', label: 'Adoleshentë', sub: '13–18 vjeç',       id: 'teens'         },
  { emoji: '❤️', label: 'Marrëdhënie', sub: 'Çift & Familje',   id: 'special-needs' },
  { emoji: '📱', label: 'Teknologjia', sub: 'Telefon & Ekranet', id: 'kids-6-12'    },
]

const TRENDING = [
  { label: 'Ekranet & Fëmijët', n: 234 },
  { label: 'Disiplina Pozitive', n: 189 },
  { label: 'Gjumi Adoleshentit', n: 145 },
  { label: 'Ankthi Shkollor',    n: 128 },
  { label: 'Bullizmi Online',    n: 97  },
  { label: 'Komunikimi i Hapur', n: 86  },
]

const PLAN_SUGGESTIONS = [
  'Bëni 10 minuta lojë të lirë me fëmijën çdo ditë.',
  'Vendosni 1 rregull të ri familjar këtë javë bashkë.',
  'Lexoni 1 libër historish para gjumit çdo natë.',
  'Krijoni "kohë cilësore" pa ekrane 30 min në ditë.',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function GlassCard({ children, className = '', style = {}, onClick }) {
  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${className}`}
      style={{ background: G.card, border: `1px solid ${G.border}`, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ─── AI Coach Panel (Left) ────────────────────────────────────────────────────
function AICoachPanel({ onSendPrompt }) {
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [reply,   setReply]   = useState(null)

  function ask(text) {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput(''); setReply(null); setLoading(true)
    setTimeout(() => {
      const res = generateParentingResponse(q)
      setReply(res); setLoading(false)
    }, 800)
  }

  return (
    <GlassCard className="p-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative" style={{ background: G.btn }}>
          <Bot size={18} color="white" />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#022c22]" />
        </div>
        <div>
          <p className="text-sm font-black" style={{ color: G.textPri }}>AI Parenting Coach</p>
          <p className="text-[10px]" style={{ color: G.textMut }}>Psikologji zhvillimore · 24/7</p>
        </div>
      </div>

      {/* Input */}
      <div className="relative mb-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), ask())}
          placeholder="Përshkruaj situatën që po përballon…"
          rows={2}
          className="w-full text-xs rounded-xl px-3 py-2.5 outline-none resize-none pr-10"
          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${G.border}`, color: G.textPri }}
        />
        <button
          onClick={() => ask()}
          disabled={!input.trim() || loading}
          className="absolute right-2 bottom-2 w-6 h-6 rounded-lg flex items-center justify-center disabled:opacity-40 transition-all active:scale-95"
          style={{ background: G.btn }}
        >
          <Send size={11} color="white" />
        </button>
      </div>

      {/* Quick actions grid */}
      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: G.textMut }}>Situata të shpejta</p>
      <div className="grid grid-cols-2 gap-1.5">
        {QUICK_ACTIONS.map(a => (
          <button
            key={a.label}
            onClick={() => ask(a.prompt)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.12)` }}
          >
            <span className="text-sm leading-none shrink-0">{a.emoji}</span>
            <span className="text-[10px] font-semibold leading-tight" style={{ color: G.accent }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-3 rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.18)` }}>
          {[0,1,2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: G.accent, animationDelay: `${d*0.15}s` }} />)}
          <span className="text-[10px] ml-1" style={{ color: G.textMut }}>Duke menduar…</span>
        </div>
      )}

      {/* Reply */}
      {reply && (
        <div className="mt-3 rounded-xl p-3 space-y-2" style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.20)` }}>
          <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>{reply.empathy}</p>
          {reply.steps[0] && (
            <div className="flex gap-2 items-start">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0 mt-0.5" style={{ background: G.accentD }}>1</div>
              <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>{reply.steps[0]}</p>
            </div>
          )}
          <button
            onClick={() => onSendPrompt(reply)}
            className="w-full py-1.5 rounded-lg text-[10px] font-black transition-colors"
            style={{ border: `1px solid rgba(52,211,153,0.25)`, color: G.accent }}
          >
            Shiko zgjidhjen e plotë →
          </button>
        </div>
      )}
    </GlassCard>
  )
}

// ─── SOS Widget (Left) ────────────────────────────────────────────────────────
function SOSWidget({ onSendPrompt }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid rgba(239,68,68,0.20)`, background: 'rgba(239,68,68,0.05)' }}>
      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
            <Zap size={16} color="white" />
          </div>
          <div>
            <p className="text-sm font-black" style={{ color: G.textPri }}>Parenting SOS</p>
            <p className="text-[10px]" style={{ color: 'rgba(252,165,165,0.70)' }}>Kam nevojë për ndihmë tani</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 4px 16px rgba(239,68,68,0.40)' }}
        >
          <Zap size={13} />
          Nis ndihmën · 60 sekonda
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-1.5">
          {SOS_TAGS.map(t => (
            <button
              key={t.label}
              onClick={() => onSendPrompt(t.prompt)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(252,165,165,0.85)' }}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Journey Widget (Left) ───────────────────────────────────────────────────
function JourneyWidget() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={14} style={{ color: G.accent }} />
        <span className="text-sm font-black" style={{ color: G.textPri }}>Parenting Journey</span>
      </div>
      <div className="space-y-2">
        {JOURNEY_LEVELS.map((lv, i) => (
          <div
            key={lv.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
            style={{
              background: lv.active ? 'rgba(52,211,153,0.12)' : lv.locked ? 'rgba(255,255,255,0.02)' : 'rgba(52,211,153,0.06)',
              border: `1px solid ${lv.active ? 'rgba(52,211,153,0.35)' : 'rgba(52,211,153,0.08)'}`,
              opacity: lv.locked ? 0.55 : 1,
            }}
          >
            <span className="text-lg leading-none">{lv.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black leading-tight" style={{ color: lv.active ? G.accent : G.textPri }}>{lv.label}</p>
              <p className="text-[9px]" style={{ color: G.textMut }}>{lv.desc}</p>
            </div>
            {lv.active && <div className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: G.accent }} />}
            {lv.locked && <Lock size={11} style={{ color: G.textMut }} className="shrink-0" />}
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

// ─── Article Modal ────────────────────────────────────────────────────────────
function ArticleModal({ article, category, onClose }) {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(1,28,20,0.85)', backdropFilter: 'blur(12px)' }} />
      <div
        className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#022c22,#011c14)', border: `1px solid rgba(52,211,153,0.25)`, boxShadow: '0 24px 80px rgba(0,0,0,0.60)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Aurora */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full blur-[60px] pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.35),transparent 70%)' }} />

        {/* Header */}
        <div className="relative flex items-start gap-4 p-5 pb-4 shrink-0" style={{ borderBottom: `1px solid rgba(52,211,153,0.12)` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.22)' }}>
            {article.emoji}
          </div>
          <div className="flex-1 min-w-0 pr-8">
            {category && (
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1.5"
                style={{ background: 'rgba(52,211,153,0.15)', color: G.accent }}>
                {category.emoji} {category.label}
              </span>
            )}
            <h2 className="text-base font-black leading-snug" style={{ color: G.textPri }}>{article.title}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: G.textMut }}>
                <Clock size={9} /> {article.readTime}
              </span>
              {article.tags.map(t => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(52,211,153,0.10)', color: G.accent }}>{t}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)', color: G.textMut }}>
            <ChevronRight size={14} style={{ transform: 'rotate(-135deg)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-sm font-semibold leading-relaxed" style={{ color: G.accent }}>{article.excerpt}</p>
          {(article.content || []).map((para, i) => (
            <p key={i} className="text-sm leading-[1.8]" style={{ color: G.textSec }}>{para}</p>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 shrink-0 flex gap-3" style={{ borderTop: `1px solid rgba(52,211,153,0.12)` }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ background: 'rgba(52,211,153,0.10)', border: `1px solid rgba(52,211,153,0.20)`, color: G.accent }}>
            ← Kthehu
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article, category, onOpen }) {
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 group hover:scale-[1.02] hover:-translate-y-0.5"
      style={{ background: G.card, border: `1px solid ${G.border}` }}
      onClick={onOpen}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg,${G.accentD},transparent 70%)` }} />

      <div className="p-4">
        {/* Category badge */}
        {category && (
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-2.5"
            style={{ background: 'rgba(52,211,153,0.10)', color: G.accent }}>
            {category.emoji} {category.label}
          </span>
        )}

        {/* Emoji + title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110"
            style={{ background: 'rgba(52,211,153,0.12)', border: `1px solid rgba(52,211,153,0.20)` }}>
            {article.emoji}
          </div>
          <p className="text-sm font-bold leading-snug pt-0.5 flex-1 min-w-0" style={{ color: G.textPri }}>
            {article.title}
          </p>
        </div>

        {/* Excerpt */}
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: G.textSec }}>
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: G.textMut }}>
              <Clock size={9} /> {article.readTime}
            </span>
            {article.tags.slice(0, 2).map(t => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(52,211,153,0.10)', color: G.accent }}>{t}</span>
            ))}
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
            style={{ background: 'rgba(52,211,153,0.12)', color: G.accent }}>
            <ChevronRight size={13} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Technique Card ───────────────────────────────────────────────────────────
function TechniqueCard({ technique }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: open ? 'rgba(5,150,105,0.10)' : G.card, border: `1px solid ${open ? 'rgba(52,211,153,0.30)' : G.border}` }}>
      <button className="w-full p-4 text-left flex items-center gap-3" onClick={() => setOpen(o => !o)}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'rgba(52,211,153,0.12)', border: `1px solid rgba(52,211,153,0.20)` }}>
          {technique.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: G.textPri }}>{technique.title}</p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: G.textMut }}>{technique.situation}</p>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
          style={{ background: open ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)', color: open ? G.accent : G.textMut }}>
          <ChevronRight size={13} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid rgba(52,211,153,0.12)` }}>
          <div className="rounded-xl p-3 mt-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
            <p className="text-[10px] font-black text-red-400 uppercase tracking-wide mb-1">❌ Qasja e gabuar</p>
            <p className="text-xs text-red-300 leading-relaxed">{technique.wrongApproach}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: G.textMut }}>✅ Hapat e duhur</p>
            <div className="space-y-2">
              {technique.steps.map((s, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 text-white" style={{ background: G.accentD }}>{i + 1}</div>
                  <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}` }}>
            <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{ color: G.textMut }}>💬 Shembull</p>
            <p className="text-xs italic leading-relaxed" style={{ color: G.textSec }}>"{technique.example}"</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.20)` }}>
            <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{ color: G.accent }}>💡 Këshillë</p>
            <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>{technique.tip}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────
function AIChat({ pendingPrompt, onClearPending }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: 'Mirë se vini! Jam asistenti i prindërisë — bazuar në psikologji zhvillimore.\n\nNuk jam psikolog dhe nuk diagnostikoj, por mund të ofroj udhëzime praktike.\n\nSi mund t\'ju ndihmoj sot? 🤍',
  }])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [depth,   setDepth]   = useState(0)
  const bottomRef             = useRef(null)
  const capped                = depth >= PARENTING_MAX_DEPTH

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (pendingPrompt) { send(pendingPrompt); onClearPending() } }, [pendingPrompt])

  function send(text) {
    const q = (text ?? input).trim()
    if (!q || capped) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setLoading(true)
    const nd = depth + 1; setDepth(nd)
    setTimeout(() => {
      let reply
      if (nd >= PARENTING_MAX_DEPTH) {
        reply = 'Kemi eksploruar disa perspektiva bashkë. Për situata komplekse, rekomandoj konsultën me specialist:\n\n👩‍⚕️ Psik. Lara Osmani — Psikolog Fëmijësh\n👩‍⚕️ Psik. Drita Halili — Terapiste Familjeje\n\nI gjeni te seksioni "Psikologu yt".'
      } else {
        const res = generateParentingResponse(q)
        reply = [res.empathy, '', ...res.steps.map((s, i) => `${i + 1}. ${s}`), '', `💡 ${res.tip}`, '', `❓ ${res.followUp}`].join('\n')
      }
      setMessages(m => [...m, { role: 'assistant', text: reply }])
      setLoading(false)
    }, 900)
  }

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden" style={{ height: 520, background: G.card, border: `1px solid ${G.border}` }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
        style={{ background: 'rgba(5,150,105,0.15)', borderColor: 'rgba(52,211,153,0.15)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: G.btn }}>
          <Bot size={18} color="white" />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: G.textPri }}>Asistenti i Prindërisë</p>
          <p className="text-[10px]" style={{ color: G.textMut }}>Psikologji zhvillimore · Udhëzim praktik</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px]" style={{ color: G.textMut }}>Online</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: G.btn }}>
                <Bot size={14} color="white" />
              </div>
            )}
            <div className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line"
              style={m.role === 'user'
                ? { background: G.btn, color: 'white', borderBottomRightRadius: 4 }
                : { background: 'rgba(52,211,153,0.08)', color: G.textSec, borderBottomLeftRadius: 4, border: `1px solid rgba(52,211,153,0.15)` }
              }>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: G.btn }}>
              <Bot size={14} color="white" />
            </div>
            <div className="rounded-2xl px-4 py-3 flex gap-1.5 items-center" style={{ background: 'rgba(52,211,153,0.08)', borderBottomLeftRadius: 4 }}>
              {[0,1,2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: G.accent, animationDelay: `${d*0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {capped && (
        <div className="mx-3 mb-2 rounded-xl px-3 py-2 flex items-center gap-2 shrink-0"
          style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.20)` }}>
          <ExternalLink size={12} style={{ color: G.accent }} className="shrink-0" />
          <p className="text-[10px] flex-1" style={{ color: G.accent }}>Mbështetje e thelluar</p>
          <Link to="/ask-psychologist" className="text-[10px] font-bold underline whitespace-nowrap" style={{ color: G.accent }}>Psikologët →</Link>
        </div>
      )}
      <div className="mx-3 mb-2 rounded-xl px-3 py-2 flex items-start gap-2 shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${G.border}` }}>
        <Shield size={10} className="shrink-0 mt-0.5" style={{ color: G.textMut }} />
        <p className="text-[9px] leading-relaxed" style={{ color: G.textMut }}>Ky asistent ofron udhëzim orientues. Nuk diagnostikon dhe nuk zëvendëson psikologun.</p>
      </div>
      {!capped && (
        <div className="px-4 py-2 overflow-x-auto shrink-0" style={{ borderTop: `1px solid ${G.border}` }}>
          <div className="flex gap-2 min-w-max">
            {AI_PROMPTS.slice(0, 4).map((p, i) => (
              <button key={i} onClick={() => send(p)} className="text-[10px] px-2.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors"
                style={{ background: 'rgba(52,211,153,0.10)', color: G.accent, border: `1px solid rgba(52,211,153,0.18)` }}>
                {p.length > 28 ? p.slice(0, 28) + '…' : p}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="px-3 pb-3 pt-2 shrink-0" style={{ borderTop: `1px solid ${G.border}` }}>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={capped ? 'Konsulto ekspertin…' : 'Pyesni diçka për fëmijën tuaj…'}
            disabled={capped}
            className="flex-1 text-xs rounded-xl px-3 py-2.5 outline-none transition-colors disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${G.border}`, color: G.textPri }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading || capped}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: G.btn }}>
            <Send size={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Parenting Pulse (Right sidebar) ─────────────────────────────────────────
function ParentingPulse() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: G.accent }} />
          <span className="text-sm font-black" style={{ color: G.textPri }}>Parenting Pulse</span>
        </div>
        <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: G.accent }}>
          Java e fundit <ChevronRight size={10} />
        </span>
      </div>
      <p className="text-[10px] mb-3 leading-relaxed" style={{ color: G.textMut }}>Nivelet tuaja të prindërimit</p>
      <div className="space-y-2.5">
        {PULSE_DATA.map(({ label, pct }) => (
          <div key={label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-semibold" style={{ color: G.textSec }}>{label}</span>
              <span className="text-[10px] font-black" style={{ color: G.accent }}>{pct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg,${G.accentDD},${G.accent})` }} />
            </div>
          </div>
        ))}
      </div>
      {/* Mini sparkline */}
      <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${G.border}` }}>
        <svg viewBox="0 0 200 40" className="w-full" style={{ opacity: 0.7 }}>
          <polyline points="0,35 30,25 60,30 90,18 120,22 150,12 180,16 200,10"
            fill="none" stroke={G.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="0,35 30,25 60,30 90,18 120,22 150,12 180,16 200,10 200,40 0,40"
            fill="rgba(52,211,153,0.08)" stroke="none" />
        </svg>
        <div className="flex justify-between mt-1">
          {['Hën','Mar','Mër','Enj','Pre','Sht','Die'].map(d => (
            <span key={d} className="text-[8px]" style={{ color: G.textMut }}>{d}</span>
          ))}
        </div>
      </div>
      <button className="w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
        style={{ background: 'rgba(52,211,153,0.10)', border: `1px solid rgba(52,211,153,0.20)`, color: G.accent }}>
        Shiko analizën e plotë →
      </button>
    </GlassCard>
  )
}

// ─── Video Mini-Lessons (Right sidebar) ──────────────────────────────────────
function VideoMiniLessons() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Play size={14} style={{ color: G.accent }} />
          <span className="text-sm font-black" style={{ color: G.textPri }}>Video Mini-Lessons</span>
        </div>
        <span className="text-[10px] font-semibold" style={{ color: G.accent }}>Shiko të gjitha →</span>
      </div>
      <div className="space-y-2.5">
        {VIDEO_LESSONS.map(v => (
          <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
            style={{ background: 'rgba(52,211,153,0.06)', border: `1px solid rgba(52,211,153,0.12)` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative"
              style={{ background: 'linear-gradient(135deg,#022c22,#064e3b)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.25)' }}>
                <Play size={12} color={G.accent} fill={G.accent} />
              </div>
              <span className="absolute bottom-0.5 right-0.5 text-[8px] font-black px-1 rounded"
                style={{ background: 'rgba(0,0,0,0.60)', color: 'white' }}>{v.dur}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold leading-snug" style={{ color: G.textPri }}>{v.title}</p>
              <p className="text-[10px] mt-0.5" style={{ color: G.textMut }}>{v.views} shikime</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

// ─── Parenting Planner (Right sidebar) ───────────────────────────────────────
function ParentingPlannerWidget() {
  const [plan,   setPlan]   = useState(null)
  const [loading, setLoading] = useState(false)

  function generate() {
    setLoading(true); setPlan(null)
    setTimeout(() => {
      const today = new Date().getDay()
      setPlan(PLAN_SUGGESTIONS[today % PLAN_SUGGESTIONS.length])
      setLoading(false)
    }, 1000)
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} style={{ color: G.accent }} />
        <span className="text-sm font-black" style={{ color: G.textPri }}>Parenting Planner</span>
        <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: G.accent }}>AI</span>
      </div>
      <p className="text-[11px] mb-3" style={{ color: G.textMut }}>AI gjeneron planin tënd familjar</p>
      {plan ? (
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.20)` }}>
          <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{ color: G.accent }}>✨ Plani i javës</p>
          <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>{plan}</p>
        </div>
      ) : (
        <div className="rounded-xl p-3 mb-3 space-y-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${G.border}` }}>
          {['Plan javor', 'Aktivitet familjar', 'Objektivë javor', 'Teknikë rekomanduese'].map(item => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(52,211,153,0.12)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.accent }} />
              </div>
              <span className="text-[10px]" style={{ color: G.textMut }}>{item}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={generate} disabled={loading}
        className="w-full py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 transition-all"
        style={{ background: G.btn, boxShadow: G.btnGlow }}>
        {loading
          ? <>{[0,1,2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce bg-white/70" style={{ animationDelay: `${d*0.15}s` }} />)}</>
          : <><Calendar size={12} />Krijo plan javor</>
        }
      </button>
    </GlassCard>
  )
}

// ─── Weekly Challenge (Right sidebar) ────────────────────────────────────────
function WeeklyChallengeWidget() {
  const [items, setItems] = useState(CHALLENGE_ITEMS)
  const done = items.filter(i => i.done).length

  function toggle(idx) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, done: !it.done } : it))
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star size={14} style={{ color: G.accent }} />
          <span className="text-sm font-black" style={{ color: G.textPri }}>Sfida Javore</span>
        </div>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: G.accent }}>
          3 hapa drejt lidhjes
        </span>
      </div>
      <div className="space-y-2 mb-3">
        {items.map((it, i) => (
          <button key={it.label} onClick={() => toggle(i)}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all hover:scale-[1.01]"
            style={{ background: it.done ? 'rgba(52,211,153,0.10)' : 'rgba(255,255,255,0.03)', border: `1px solid ${it.done ? 'rgba(52,211,153,0.25)' : G.border}` }}>
            {it.done
              ? <CheckCircle size={14} style={{ color: G.accent }} className="shrink-0" />
              : <Circle     size={14} style={{ color: G.textMut }} className="shrink-0" />
            }
            <span className="text-xs font-semibold" style={{ color: it.done ? G.accent : G.textSec }}>{it.label}</span>
          </button>
        ))}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px]" style={{ color: G.textMut }}>{done} / {items.length} të përfunduara</span>
          <span className="text-[10px] font-black" style={{ color: G.accent }}>{Math.round((done / items.length) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(done / items.length) * 100}%`, background: `linear-gradient(90deg,${G.accentDD},${G.accent})` }} />
        </div>
      </div>
    </GlassCard>
  )
}

// ─── Ask Psychologist (Right sidebar) ────────────────────────────────────────
function AskPsychologistWidget() {
  return (
    <div className="rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg,#022c22,#064e3b)', border: `1px solid rgba(52,211,153,0.25)` }}>
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[40px] pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.25),transparent 70%)' }} />
      <div className="relative p-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle size={14} style={{ color: G.accent }} />
          <span className="text-sm font-black" style={{ color: G.textPri }}>Pyet Psikologun</span>
        </div>
        <p className="text-[11px] mb-3 leading-relaxed" style={{ color: G.textSec }}>
          Bëj pyetjen tënde dhe merr përgjigje profesionale brenda 24 orësh.
        </p>
        <div className="flex -space-x-2 mb-3">
          {['👩‍⚕️','👨‍⚕️','👩‍⚕️'].map((e, i) => (
            <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-base border-2"
              style={{ background: 'rgba(52,211,153,0.15)', borderColor: '#022c22' }}>{e}</div>
          ))}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black border-2"
            style={{ background: 'rgba(52,211,153,0.20)', borderColor: '#022c22', color: G.accent }}>+4</div>
        </div>
        <Link to="/ask-psychologist"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black text-white transition-all active:scale-95 hover:opacity-90"
          style={{ background: G.btn, boxShadow: G.btnGlow }}>
          <MessageCircle size={12} />
          Bëj pyetjen →
        </Link>
      </div>
    </div>
  )
}

// ─── Trending Topics (Right sidebar) ─────────────────────────────────────────
function TrendingTopicsWidget() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} style={{ color: G.accent }} />
        <span className="text-sm font-black" style={{ color: G.textPri }}>Temat Trend</span>
        <span className="ml-auto text-[9px]" style={{ color: G.textMut }}>Kjo javë</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {TRENDING.map(({ label, n }) => (
          <button key={label}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-all hover:scale-[1.03]"
            style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.15)`, color: G.accent }}>
            {label}
            <span className="text-[8px] opacity-60 ml-0.5">{n}</span>
          </button>
        ))}
      </div>
    </GlassCard>
  )
}

// ─── Featured Article ─────────────────────────────────────────────────────────
function FeaturedArticle({ article, onExpand }) {
  if (!article) return null
  return (
    <div className="rounded-2xl overflow-hidden relative cursor-pointer group transition-all hover:scale-[1.005]"
      style={{ background: 'linear-gradient(135deg,#022c22 0%,#064e3b 60%,#047857 100%)', border: `1px solid rgba(52,211,153,0.25)`, boxShadow: '0 8px 40px rgba(5,150,105,0.20)' }}
      onClick={onExpand}>
      <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.35),transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: G.dot, backgroundSize: '24px 24px' }} />
      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.25)' }}>
            {article.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(52,211,153,0.20)', color: G.accent }}>⭐ ARTIKULL I REKOMANDUAR</span>
            </div>
            <p className="text-base font-black text-white leading-snug mb-1.5">{article.title}</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.60)' }}>{article.excerpt}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.50)' }}>
                <Clock size={9} /> {article.readTime}
              </span>
              {article.tags.slice(0, 2).map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(52,211,153,0.20)', color: G.accent }}>{t}</span>
              ))}
              <button className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-white transition-all active:scale-95"
                style={{ background: G.btn, boxShadow: '0 2px 12px rgba(5,150,105,0.40)' }}>
                Lexo artikullin <ChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Age Category Cards ───────────────────────────────────────────────────────
function AgeCategorySection({ onFilter }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-black" style={{ color: G.textPri }}>Kategoritë sipas moshës & temave</p>
        <button className="text-[10px] font-semibold flex items-center gap-1" style={{ color: G.accent }}>
          Shiko të gjitha <ChevronRight size={10} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {AGE_CATS.map(cat => (
          <button
            key={cat.label}
            onClick={() => onFilter(cat.id)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all hover:scale-[1.03] active:scale-95 text-center"
            style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.14)` }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(52,211,153,0.12)', border: `1px solid rgba(52,211,153,0.20)` }}>
              {cat.emoji}
            </div>
            <div>
              <p className="text-[11px] font-black leading-tight" style={{ color: G.textPri }}>{cat.label}</p>
              <p className="text-[9px]" style={{ color: G.textMut }}>{cat.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Techniques Quick Grid ────────────────────────────────────────────────────
function TechniquesQuickGrid({ onOpenTab }) {
  const preview = PARENTING_TECHNIQUES.slice(0, 5)
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-black" style={{ color: G.textPri }}>Teknikat Praktike</p>
        <button onClick={onOpenTab} className="text-[10px] font-semibold flex items-center gap-1" style={{ color: G.accent }}>
          Shiko të gjitha <ChevronRight size={10} />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {preview.map(tech => (
          <button
            key={tech.id}
            onClick={onOpenTab}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all hover:scale-[1.04] active:scale-95 text-center"
            style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.14)` }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(52,211,153,0.12)' }}>
              {tech.emoji}
            </div>
            <p className="text-[9px] font-bold leading-tight" style={{ color: G.textSec }}>{tech.title}</p>
            <div className="w-full h-0.5 rounded-full" style={{ background: `linear-gradient(90deg,${G.accentD},transparent)` }} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'articles',   label: 'Artikuj',  icon: BookOpen },
  { id: 'techniques', label: 'Teknikat', icon: Lightbulb },
  { id: 'ai',         label: 'AI Coach', icon: Bot },
]

export default function Parenting() {
  const [tab,             setTab]             = useState('articles')
  const [filterCat,       setFilterCat]       = useState('all')
  const [pendingAIPrompt, setPendingAIPrompt] = useState(null)
  const [featOpen,        setFeatOpen]        = useState(false)
  const [openArticle,     setOpenArticle]     = useState(null)
  const centerRef = useRef(null)

  function goToAI(prompt) {
    setTab('ai')
    if (prompt) setPendingAIPrompt(typeof prompt === 'string' ? prompt : null)
    centerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const featured = PARENTING_ARTICLES[1] || PARENTING_ARTICLES[0]
  const filtered = filterCat === 'all'
    ? PARENTING_ARTICLES
    : PARENTING_ARTICLES.filter(a => a.categoryId === filterCat)

  return (
    <PublicLayout>
      <div className="min-h-screen" style={{ background: G.page }}>

        {/* Aurora blobs */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.30),transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle,rgba(5,150,105,0.40),transparent 70%)' }} />
        {/* Dot grid */}
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: G.dot, backgroundSize: '28px 28px' }} />

        <div className="relative max-w-[1380px] mx-auto px-5 py-7 pb-12">
          <div className="flex gap-5 items-start">

            {/* ── LEFT COLUMN ── */}
            <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0 sticky top-6">
              <AICoachPanel onSendPrompt={goToAI} />
              <SOSWidget onSendPrompt={goToAI} />
              <JourneyWidget />
            </div>

            {/* ── CENTER COLUMN ── */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Hero */}
              <div className="rounded-3xl overflow-hidden relative" style={{ boxShadow: '0 8px 60px rgba(5,150,105,0.22)' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#022c22 0%,#064e3b 50%,#065f46 100%)' }} />
                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none"
                  style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.40),transparent 70%)' }} />
                <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full blur-[70px] pointer-events-none"
                  style={{ background: 'radial-gradient(circle,rgba(5,150,105,0.30),transparent 70%)' }} />
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: G.dot, backgroundSize: '24px 24px' }} />
                <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ border: '1px solid rgba(110,231,183,0.20)' }} />

                <div className="relative px-6 py-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                      style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,183,0.30)' }}>
                      👨‍👩‍👧‍👦
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] block mb-1" style={{ color: G.accent }}>NeuroSphera · Familje</span>
                      <EditableText as="h1" className="text-2xl font-black text-white leading-tight">Prindëria e Ndërgjegjshme</EditableText>
                      <EditableText as="p" className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
                        Këshilla, teknika, AI dhe mbështetje profesionale për çdo fazë të zhvillimit të fëmijës.
                      </EditableText>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { n: PARENTING_ARTICLES.length,    label: 'Artikuj',           icon: '📚' },
                      { n: PARENTING_TECHNIQUES.length,   label: 'Teknika',           icon: '💡' },
                      { n: PARENT_CATEGORIES.length,      label: 'Kategori',          icon: '🗂️' },
                      { n: 6,                             label: 'Specialistë aktivë', icon: '👨‍⚕️' },
                    ].map(({ n, label, icon }) => (
                      <div key={label} className="rounded-2xl py-3 px-3 text-center"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                        <p className="text-lg font-black text-white">{icon} {n}</p>
                        <p className="text-[9px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured Article */}
              <FeaturedArticle article={featured} onExpand={() => setFeatOpen(o => !o)} />
              {featOpen && featured && (
                <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(5,150,105,0.08)', border: `1px solid rgba(52,211,153,0.20)` }}>
                  <p className="text-sm font-semibold leading-relaxed" style={{ color: G.accent }}>{featured.excerpt}</p>
                  {(featured.content || []).map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: G.textSec }}>{para}</p>
                  ))}
                </div>
              )}

              {/* Age Categories */}
              <AgeCategorySection onFilter={id => { setFilterCat(id); setTab('articles') }} />

              {/* Techniques Quick Grid */}
              <TechniquesQuickGrid onOpenTab={() => setTab('techniques')} />

              {/* Tabs + Content */}
              <div ref={centerRef}>
                <div className="rounded-2xl p-1.5 flex gap-1 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}` }}>
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                      style={tab === id
                        ? { background: G.btn, color: 'white', boxShadow: G.btnGlow }
                        : { color: G.textMut }
                      }
                    >
                      <Icon size={13} strokeWidth={tab === id ? 2.5 : 1.8} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Articles tab */}
                {tab === 'articles' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <div className="flex gap-2 min-w-max pb-1">
                        <button onClick={() => setFilterCat('all')}
                          className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all"
                          style={filterCat === 'all'
                            ? { background: G.btn, color: 'white' }
                            : { background: 'rgba(255,255,255,0.05)', color: G.textMut, border: `1px solid ${G.border}` }}>
                          Të gjitha
                        </button>
                        {PARENT_CATEGORIES.map(cat => (
                          <button key={cat.id} onClick={() => setFilterCat(cat.id)}
                            className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap"
                            style={filterCat === cat.id
                              ? { background: G.btn, color: 'white' }
                              : { background: 'rgba(52,211,153,0.07)', color: G.accent, border: `1px solid rgba(52,211,153,0.15)` }}>
                            {cat.emoji} {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold" style={{ color: G.textMut }}>{filtered.length} artikuj</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filtered.map(a => (
                        <ArticleCard
                          key={a.id}
                          article={a}
                          category={PARENT_CATEGORIES.find(c => c.id === a.categoryId)}
                          onOpen={() => setOpenArticle(a)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Techniques tab */}
                {tab === 'techniques' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.18)` }}>
                      <p className="text-sm font-bold mb-1" style={{ color: G.textPri }}>Teknikat për situatat kryesore</p>
                      <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>
                        Çdo teknikë tregon qasjen e gabuar, hapat e duhur, shembull real dhe këshillë praktike.
                      </p>
                    </div>
                    <p className="text-[11px] font-semibold" style={{ color: G.textMut }}>{PARENTING_TECHNIQUES.length} teknika</p>
                    <div className="space-y-3">
                      {PARENTING_TECHNIQUES.map(tech => <TechniqueCard key={tech.id} technique={tech} />)}
                    </div>
                  </div>
                )}

                {/* AI Chat tab */}
                {tab === 'ai' && (
                  <AIChat
                    pendingPrompt={pendingAIPrompt}
                    onClearPending={() => setPendingAIPrompt(null)}
                  />
                )}
              </div>

              {/* Mobile panels */}
              <div className="lg:hidden space-y-4 pt-2">
                <div className="h-px" style={{ background: G.border }} />
                <AICoachPanel onSendPrompt={goToAI} />
                <SOSWidget onSendPrompt={goToAI} />
                <JourneyWidget />
                <ParentingPulse />
                <VideoMiniLessons />
                <WeeklyChallengeWidget />
                <AskPsychologistWidget />
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0 sticky top-6">
              <ParentingPulse />
              <VideoMiniLessons />
              <ParentingPlannerWidget />
              <WeeklyChallengeWidget />
              <TrendingTopicsWidget />
              <AskPsychologistWidget />
            </div>

          </div>
        </div>
      </div>
      {openArticle && (
        <ArticleModal
          article={openArticle}
          category={PARENT_CATEGORIES.find(c => c.id === openArticle.categoryId)}
          onClose={() => setOpenArticle(null)}
        />
      )}
    </PublicLayout>
  )
}
