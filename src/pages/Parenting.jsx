import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import EditableText from '../components/EditableText'
import PublicLayout from '../components/layout/PublicLayout'
import {
  Brain, BookOpen, Lightbulb, Bot, ChevronRight, ChevronLeft,
  Clock, Send, Zap, TrendingUp, Quote, Shield, ExternalLink,
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

/* ─── Carousel slides ────────────────────────────────────────────────────── */
const CAROUSEL = [
  { emoji: '👨‍👧',   title: '"Fëmija im nuk dëgjon asnjëherë"',             tip: 'Uluni në nivelin e tij dhe kuptoni arsyen. Sjellja vjen shpesh nga nevoja e paplotësuar, jo nga keqdashja.', tag: 'Komunikim' },
  { emoji: '👩‍👦',   title: '"Si ta kufizoj kohën e ekranit?"',              tip: 'Vendosni rregulla bashkërisht, jo vetëm ju. Fëmijët respektojnë kufijt kur janë pjesë e vendimmarrjes.',       tag: 'Teknologjia' },
  { emoji: '👨‍👩‍👦', title: '"Detyrat e shtëpisë janë betejë çdo ditë"',    tip: 'I njëjti vend, i njëjti orar. Pas 2 javësh truri i fëmijës do ta presë rutinën natyrshëm.',                   tag: 'Shkolla' },
  { emoji: '👶',    title: '"Gjumi është i pamundur"',                       tip: 'Banja → libri → gjumi. Sekuenca e njëjtë çdo natë i tregon trurit se është koha e qetësisë.',                  tag: 'Gjumi' },
  { emoji: '🧒',    title: '"Po sillet keq me shokët"',                     tip: 'Para ndërhyrjes pyesni pse. Sjellja negative shpesh është komunikim i paplotësuar i ndjenjave.',                 tag: 'Social' },
  { emoji: '👩‍👧‍👦', title: '"Adoleshenti im nuk flet me mua"',             tip: 'Mos pyesni — bëni diçka bashkë. Bisednat e mira ndodhin kur jemi anash, jo përballë njëri-tjetrit.',           tag: 'Adoleshencë' },
]

/* ─── Situations ─────────────────────────────────────────────────────────── */
const SITUATIONS = [
  { emoji: '😠', label: 'Nuk dëgjon',    tip: 'Qetësohu i pari — fëmija ndien tensionin. Uluni, bëni kontakt me sy dhe shpjegoni me fjalë të thjeshta.', prompt: 'Fëmija im nuk dëgjon asgjë. Si të veproj?' },
  { emoji: '📱', label: 'Shumë telefon', tip: 'Vendosni "zonat pa ekran" bashkë: dhoma e gjumit, tryeza e darkës. Bëni rregullin, jo dënimin.',           prompt: 'Si ta kufizoj kohën e ekranit me fëmijën tim?' },
  { emoji: '😢', label: 'Qan shpesh',    tip: 'Qarja është komunikim. Para se të qetësonit, pranojeni: "E kuptoj që je i trishtuar." Kjo ndihmon.',        prompt: 'Fëmija im qan shpesh dhe nuk di pse. Si të ndihmoj?' },
  { emoji: '🛡️', label: 'Bullizmi',      tip: 'Dëgjoni pa ndërhyrë fillimisht. Fëmija duhet të ndihet i besuar. Pastaj veproni me shkollën bashkë.',        prompt: 'Fëmija im po viktimzohet në shkollë. Çfarë duhet të bëj?' },
  { emoji: '📚', label: 'Detyrat',       tip: 'Ndani detyrën: 20 min punë + 10 min pushim. Mos qëndroni pranë — lëreni të ndihet kompetent.',              prompt: 'Fëmija im nuk dëshiron të bëjë detyrat e shtëpisë.' },
  { emoji: '😤', label: 'Krizat',        tip: 'Gjatë krizës mos debatoni — prini. Pas krizës flisni. Para krizës identifikoni triggerët.',                  prompt: 'Fëmija im ka humbje temperamenti të shpeshta. Çfarë të bëj?' },
]

const INSIGHTS = [
  { label: 'Disiplina & Kufijtë', pct: 67 },
  { label: 'Komunikimi',          pct: 54 },
  { label: 'Ekranet',             pct: 42 },
]

const TABS = [
  { id: 'articles',   label: 'Artikuj',      icon: BookOpen },
  { id: 'techniques', label: 'Teknikat',     icon: Lightbulb },
  { id: 'ai',         label: 'Asistenti AI', icon: Bot },
]

/* ─── Glass card wrapper ─────────────────────────────────────────────────── */
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

/* ─── Family Carousel ───────────────────────────────────────────────────── */
function FamilyCarousel() {
  const [idx,    setIdx]    = useState(0)
  const [paused, setPaused] = useState(false)
  const [fade,   setFade]   = useState(true)

  function goTo(next) {
    setFade(false)
    setTimeout(() => { setIdx(next); setFade(true) }, 180)
  }

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => goTo((idx + 1) % CAROUSEL.length), 4200)
    return () => clearInterval(id)
  }, [idx, paused])

  const c = CAROUSEL[idx]

  return (
    <div
      className="rounded-3xl overflow-hidden relative"
      style={{ background: 'rgba(5,150,105,0.08)', border: `1px solid ${G.border}` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Aurora blob */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[60px] pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.20),transparent 70%)' }} />

      <div
        className="px-5 pt-5 pb-4 flex items-center gap-4 transition-all duration-200 relative"
        style={{ opacity: fade ? 1 : 0, transform: fade ? 'translateY(0)' : 'translateY(6px)' }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
          style={{ background: 'rgba(52,211,153,0.12)', border: `1px solid rgba(52,211,153,0.25)` }}
        >
          {c.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: G.accent }}>
            {c.tag}
          </span>
          <p className="text-sm font-black leading-snug mb-2" style={{ color: G.textPri }}>{c.title}</p>
          <div className="flex items-start gap-2">
            <Quote size={11} style={{ color: G.accent }} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>{c.tip}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 flex items-center justify-between relative">
        <div className="flex gap-1.5 items-center">
          {CAROUSEL.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === idx ? 18 : 6, height: 6, background: i === idx ? G.accent : 'rgba(52,211,153,0.25)' }}
            />
          ))}
        </div>
        <div className="flex gap-1">
          {[
            { icon: ChevronLeft,  action: () => goTo((idx - 1 + CAROUSEL.length) % CAROUSEL.length) },
            { icon: ChevronRight, action: () => goTo((idx + 1) % CAROUSEL.length) },
          ].map(({ icon: Icon, action }, i) => (
            <button
              key={i}
              onClick={action}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(52,211,153,0.12)', color: G.accent }}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Article card ──────────────────────────────────────────────────────── */
function ArticleCard({ article, category }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 group"
      style={{
        background: open ? 'rgba(5,150,105,0.10)' : G.card,
        border: `1px solid ${open ? 'rgba(52,211,153,0.30)' : G.border}`,
        borderLeft: `3px solid ${G.accentD}`,
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ background: 'rgba(52,211,153,0.12)', border: `1px solid rgba(52,211,153,0.20)` }}
          >
            {article.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-snug mb-1.5" style={{ color: G.textPri }}>{article.title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: G.textMut }}>
                <Clock size={9} /> {article.readTime}
              </span>
              {article.tags.slice(0, 2).map(t => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(52,211,153,0.12)', color: G.accent }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
            style={{
              background: open ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
              color: open ? G.accent : G.textMut,
            }}
          >
            <ChevronRight size={13} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </div>
        </div>

        {open && (
          <div className="mt-3 pt-3 space-y-3" style={{ borderTop: `1px solid rgba(52,211,153,0.15)` }}>
            <EditableText
              id={`parenting-article-${article.id}-excerpt`}
              as="p"
              className="text-sm font-semibold leading-relaxed"
              style={{ color: G.accent }}
            >
              {article.excerpt}
            </EditableText>
            {(article.content || []).map((para, i) => (
              <EditableText
                key={i}
                id={`parenting-article-${article.id}-p${i}`}
                as="p"
                multiline
                className="text-sm leading-relaxed"
                style={{ color: G.textSec }}
              >
                {para}
              </EditableText>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Technique card ────────────────────────────────────────────────────── */
function TechniqueCard({ technique, category }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: open ? 'rgba(5,150,105,0.10)' : G.card,
        border: `1px solid ${open ? 'rgba(52,211,153,0.30)' : G.border}`,
      }}
    >
      <button className="w-full p-4 text-left flex items-center gap-3" onClick={() => setOpen(o => !o)}>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'rgba(52,211,153,0.12)', border: `1px solid rgba(52,211,153,0.20)` }}
        >
          {technique.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: G.textPri }}>{technique.title}</p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: G.textMut }}>{technique.situation}</p>
        </div>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
          style={{
            background: open ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
            color: open ? G.accent : G.textMut,
          }}
        >
          <ChevronRight size={13} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
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
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 text-white"
                    style={{ background: G.accentD }}
                  >
                    {i + 1}
                  </div>
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

/* ─── AI Assistant ──────────────────────────────────────────────────────── */
function AIAssistant({ pendingPrompt, onClearPending }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: 'Mirë se vini! Jam asistenti i prindërisë — bazuar në psikologji zhvillimore.\n\nNuk jam psikolog dhe nuk diagnostikoj, por mund të ofroj udhëzime praktike dhe t\'ju drejtoj te ekspertët e duhur.\n\nSi mund t\'ju ndihmoj sot? 🤍',
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
    const newDepth = depth + 1
    setDepth(newDepth)
    setTimeout(() => {
      let reply
      if (newDepth >= PARENTING_MAX_DEPTH) {
        reply = 'Kemi eksploruar disa perspektiva së bashku. Kjo platformë ofron mbështetje orientuese.\n\nPër situata komplekse familjare ose nëse ndiheni të mbingarkuar, rekomandoj të konsultoheni me një specialist:\n\n👩‍⚕️ Psik. Lara Osmani — Psikolog Fëmijësh & Adoleshentësh\n👩‍⚕️ Psik. Drita Halili — Terapiste Çiftesh & Familjeje\n\nMund t\'i gjeni te seksioni "Psikologët" i platformës.'
      } else {
        const res = generateParentingResponse(q)
        reply = [res.empathy, '', ...res.steps.map((s, i) => `${i + 1}. ${s}`), '', `💡 ${res.tip}`, '', `❓ ${res.followUp}`].join('\n')
      }
      setMessages(m => [...m, { role: 'assistant', text: reply }])
      setLoading(false)
    }, 900)
  }

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ height: 540, background: G.card, border: `1px solid ${G.border}` }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
        style={{ background: 'rgba(5,150,105,0.15)', borderColor: 'rgba(52,211,153,0.15)' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: G.btn }}>
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
            <div
              className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line"
              style={m.role === 'user'
                ? { background: G.btn, color: 'white', borderBottomRightRadius: 4 }
                : { background: 'rgba(52,211,153,0.08)', color: G.textSec, borderBottomLeftRadius: 4, border: `1px solid rgba(52,211,153,0.15)` }
              }
            >
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
              {[0, 1, 2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: G.accent, animationDelay: `${d * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {capped && (
        <div className="mx-3 mb-2 rounded-xl px-3 py-2 flex items-center gap-2 shrink-0" style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.20)` }}>
          <ExternalLink size={12} style={{ color: G.accent }} className="shrink-0" />
          <p className="text-[10px] flex-1" style={{ color: G.accent }}>Mbështetje e thelluar — konsulto specialistin</p>
          <Link to="/ask-psychologist" className="text-[10px] font-bold underline whitespace-nowrap" style={{ color: G.accent }}>Psikologët →</Link>
        </div>
      )}

      <div className="mx-3 mb-2 rounded-xl px-3 py-2 flex items-start gap-2 shrink-0" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${G.border}` }}>
        <Shield size={10} className="shrink-0 mt-0.5" style={{ color: G.textMut }} />
        <p className="text-[9px] leading-relaxed" style={{ color: G.textMut }}>Ky asistent ofron udhëzim orientues. Nuk diagnostikon dhe nuk zëvendëson psikologun.</p>
      </div>

      {!capped && (
        <div className="px-4 py-2 overflow-x-auto shrink-0" style={{ borderTop: `1px solid ${G.border}` }}>
          <div className="flex gap-2 min-w-max">
            {AI_PROMPTS.slice(0, 4).map((p, i) => (
              <button
                key={i}
                onClick={() => send(p)}
                className="text-[10px] px-2.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors"
                style={{ background: 'rgba(52,211,153,0.10)', color: G.accent, border: `1px solid rgba(52,211,153,0.18)` }}
              >
                {p.length > 28 ? p.slice(0, 28) + '…' : p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 pb-3 pt-2 shrink-0" style={{ borderTop: `1px solid ${G.border}` }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={capped ? 'Konsulto ekspertin për mbështetje të thelluar' : 'Pyesni diçka për fëmijën tuaj…'}
            disabled={capped}
            className="flex-1 text-xs rounded-xl px-3 py-2.5 outline-none transition-colors disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${G.border}`, color: G.textPri }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading || capped}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: G.btn }}
          >
            <Send size={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Left panel ────────────────────────────────────────────────────────── */
function LeftPanel({ onGoToAI }) {
  const [quickInput,    setQuickInput]    = useState('')
  const [quickResponse, setQuickResponse] = useState(null)
  const [loading,       setLoading]       = useState(false)

  const todayIdx = new Date().getDay() % PARENTING_TECHNIQUES.length
  const dailyTech = PARENTING_TECHNIQUES[todayIdx]
  const dailyCat  = PARENT_CATEGORIES.find(c => c.id === dailyTech.categoryId)

  function handleQuickAsk() {
    const q = quickInput.trim()
    if (!q || loading) return
    setLoading(true); setQuickResponse(null)
    setTimeout(() => { setQuickResponse(generateParentingResponse(q)); setLoading(false) }, 800)
  }

  return (
    <div className="space-y-4">
      {/* Quick AI */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: G.btn }}>
            <Brain size={13} color="white" />
          </div>
          <span className="text-sm font-bold" style={{ color: G.textPri }}>Ndihmë e shpejtë</span>
          <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: G.accent }}>AI</span>
        </div>
        <p className="text-[11px] mb-3" style={{ color: G.textMut }}>Ke një situatë tani? Përshkruaje shkurt…</p>

        <textarea
          value={quickInput}
          onChange={e => setQuickInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleQuickAsk())}
          placeholder="Fëmija im nuk më dëgjon…"
          rows={2}
          className="w-full text-xs rounded-xl px-3 py-2.5 outline-none resize-none mb-2 transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${G.border}`, color: G.textPri }}
        />
        <button
          onClick={handleQuickAsk}
          disabled={!quickInput.trim() || loading}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 transition-all"
          style={{ background: G.btn, boxShadow: G.btnGlow }}
        >
          <Send size={12} />
          {loading ? 'Duke menduar…' : 'Merr përgjigje'}
        </button>

        {quickResponse && (
          <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.20)` }}>
            <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: G.accent }}>✨ Përgjigja</p>
            <p className="text-xs leading-relaxed mb-2" style={{ color: G.textSec }}>{quickResponse.empathy}</p>
            {quickResponse.steps[0] && (
              <div className="flex gap-2 items-start mb-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0 mt-0.5" style={{ background: G.accentD }}>1</div>
                <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>{quickResponse.steps[0]}</p>
              </div>
            )}
            <button
              onClick={() => onGoToAI(quickInput)}
              className="w-full py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ border: `1px solid rgba(52,211,153,0.25)`, color: G.accent, background: 'transparent' }}
            >
              Shiko zgjidhjen e plotë →
            </button>
          </div>
        )}
      </GlassCard>

      {/* Daily tip */}
      <GlassCard className="overflow-hidden" style={{ background: 'rgba(5,150,105,0.08)' }}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span>💡</span>
            <span className="text-sm font-bold" style={{ color: G.textPri }}>Këshilla e ditës</span>
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'rgba(52,211,153,0.15)' }}>
              {dailyTech.emoji}
            </div>
            <div>
              <p className="text-[11px] font-bold" style={{ color: G.textPri }}>{dailyTech.title}</p>
              <p className="text-[10px] font-semibold" style={{ color: G.accent }}>{dailyCat?.label}</p>
            </div>
          </div>
          <div className="rounded-xl p-3 mb-3 flex items-start gap-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Quote size={11} style={{ color: G.accent }} className="shrink-0 mt-0.5" />
            <p className="text-xs italic leading-relaxed" style={{ color: G.textSec }}>{dailyTech.tip}</p>
          </div>
          <button
            onClick={() => onGoToAI(`Më shpjego teknikën "${dailyTech.title}" hap pas hapi me shembuj praktikë.`)}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: G.btn, boxShadow: G.btnGlow }}
          >
            Shpjego me AI →
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

/* ─── Right panel ───────────────────────────────────────────────────────── */
function RightPanel({ onSituation }) {
  const [activeSit, setActiveSit] = useState(null)
  function toggle(label) { setActiveSit(a => a === label ? null : label) }
  const sit = SITUATIONS.find(s => s.label === activeSit)

  return (
    <div className="space-y-4">
      {/* Situations */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} style={{ color: G.accent }} />
          <span className="text-sm font-bold" style={{ color: G.textPri }}>Çfarë po përballon?</span>
        </div>
        <p className="text-[11px] mb-3" style={{ color: G.textMut }}>Klikoni për këshillë të shpejtë</p>

        <div className="space-y-1.5">
          {SITUATIONS.map(s => (
            <button
              key={s.label}
              onClick={() => toggle(s.label)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left"
              style={{
                background: activeSit === s.label ? G.accentD : 'rgba(52,211,153,0.07)',
                color:      activeSit === s.label ? 'white' : G.accent,
                border:     `1px solid ${activeSit === s.label ? G.accentD : 'rgba(52,211,153,0.15)'}`,
              }}
            >
              <span className="text-sm leading-none">{s.emoji}</span>
              <span className="flex-1">{s.label}</span>
              <ChevronRight size={12} className="shrink-0" style={{ transform: activeSit === s.label ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }} />
            </button>
          ))}
        </div>

        {sit && (
          <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.20)` }}>
            <p className="text-[10px] font-black uppercase tracking-wide mb-1.5" style={{ color: G.accent }}>💡 Këshillë e shpejtë</p>
            <p className="text-xs leading-relaxed mb-2" style={{ color: G.textSec }}>{sit.tip}</p>
            <button onClick={() => onSituation(sit.prompt)} className="text-[10px] font-black flex items-center gap-1 hover:underline" style={{ color: G.accent }}>
              Merr ndihmë të plotë nga AI <ChevronRight size={10} />
            </button>
          </div>
        )}
      </GlassCard>

      {/* Insights */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={14} style={{ color: G.accent }} />
          <span className="text-sm font-bold" style={{ color: G.textPri }}>Temat kryesore</span>
        </div>
        <p className="text-[11px] mb-3 leading-relaxed" style={{ color: G.textMut }}>Çfarë po presin prindërit këtë javë</p>
        <div className="space-y-3">
          {INSIGHTS.map(({ label, pct }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold" style={{ color: G.textSec }}>{label}</span>
                <span className="text-[10px] font-black" style={{ color: G.accent }}>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${G.accentD},${G.accent})` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-3" style={{ color: G.textMut }}>Bazuar në aktivitetin e platformës këtë javë.</p>
      </GlassCard>

      {/* AI CTA */}
      <button
        onClick={() => onSituation('')}
        className="w-full flex items-center gap-3 p-4 rounded-2xl text-white transition-all active:scale-95 hover:opacity-90"
        style={{ background: G.btn, boxShadow: G.btnGlow }}
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Bot size={20} color="white" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-black">Pyet Asistentin AI</p>
          <p className="text-[11px] text-white/70">Psikologji zhvillimore · 24/7</p>
        </div>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function Parenting() {
  const [tab,             setTab]             = useState('articles')
  const [filterCat,       setFilterCat]       = useState('all')
  const [pendingAIPrompt, setPendingAIPrompt] = useState(null)

  function goToAI(prompt) { setTab('ai'); if (prompt) setPendingAIPrompt(prompt) }
  const filtered = filterCat === 'all' ? PARENTING_ARTICLES : PARENTING_ARTICLES.filter(a => a.categoryId === filterCat)

  return (
    <PublicLayout>
      {/* Page background */}
      <div className="min-h-screen" style={{ background: G.page }}>

        {/* Aurora blobs */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.25),transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle,rgba(5,150,105,0.35),transparent 70%)' }} />
        {/* Dot grid */}
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: G.dot, backgroundSize: '28px 28px' }} />

        <div className="relative max-w-6xl mx-auto px-5 py-8 flex gap-5 items-start pb-10">

          {/* ── Left panel ── */}
          <div className="hidden lg:block w-64 shrink-0 sticky top-6">
            <LeftPanel onGoToAI={goToAI} />
          </div>

          {/* ── Center ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group"
              style={{ color: G.textMut }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${G.border}` }}
              >
                <ChevronLeft size={15} style={{ color: G.textSec }} />
              </div>
              <span className="group-hover:text-emerald-400 transition-colors">Kthehu te faqja kryesore</span>
            </Link>

            {/* Hero */}
            <div className="rounded-3xl overflow-hidden relative" style={{ boxShadow: '0 8px 60px rgba(5,150,105,0.25)' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#022c22 0%,#064e3b 50%,#065f46 100%)' }} />
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.40),transparent 70%)' }} />
              <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full blur-[70px] pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(5,150,105,0.30),transparent 70%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: G.dot, backgroundSize: '24px 24px' }} />
              <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ border: `1px solid rgba(110,231,183,0.20)` }} />

              <div className="relative px-6 py-7">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,183,0.30)' }}>
                    👨‍👩‍👧‍👦
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: G.accent }}>NeuroSphera</span>
                    </div>
                    <EditableText as="h1" className="text-2xl font-black text-white leading-tight">Prindëria e Ndërgjegjshme</EditableText>
                    <EditableText as="p" className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>Psikologji zhvillimore · Teknika praktike · AI</EditableText>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { n: PARENTING_ARTICLES.length,   label: 'Artikuj',  icon: '📚' },
                    { n: PARENTING_TECHNIQUES.length,  label: 'Teknika',  icon: '💡' },
                    { n: PARENT_CATEGORIES.length,     label: 'Kategori', icon: '🗂️' },
                  ].map(({ n, label, icon }) => (
                    <div key={label} className="rounded-2xl py-3 px-4 text-center"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                      <p className="text-xl font-black text-white">{icon} {n}</p>
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Family Carousel */}
            <FamilyCarousel />

            {/* Tabs */}
            <div className="rounded-2xl p-1.5 flex gap-1" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}` }}>
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
                  <Icon size={14} strokeWidth={tab === id ? 2.5 : 1.8} />
                  {label}
                </button>
              ))}
            </div>

            {/* Articles */}
            {tab === 'articles' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <div className="flex gap-2 min-w-max pb-1">
                    <button
                      onClick={() => setFilterCat('all')}
                      className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all"
                      style={filterCat === 'all'
                        ? { background: G.btn, color: 'white' }
                        : { background: 'rgba(255,255,255,0.05)', color: G.textMut, border: `1px solid ${G.border}` }}
                    >
                      Të gjitha
                    </button>
                    {PARENT_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCat(cat.id)}
                        className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap"
                        style={filterCat === cat.id
                          ? { background: G.btn, color: 'white' }
                          : { background: 'rgba(52,211,153,0.07)', color: G.accent, border: `1px solid rgba(52,211,153,0.15)` }}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] font-semibold" style={{ color: G.textMut }}>{filtered.length} artikuj</p>
                <div className="space-y-3">
                  {filtered.map(a => (
                    <ArticleCard
                      key={a.id}
                      article={a}
                      category={PARENT_CATEGORIES.find(c => c.id === a.categoryId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Techniques */}
            {tab === 'techniques' && (
              <div className="space-y-4">
                <div className="rounded-2xl p-4" style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.18)` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: G.textPri }}>Teknikat për situatat kryesore</p>
                  <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>
                    Çdo teknikë tregon qasjen e gabuar, hapat e duhur, shembull real dhe këshillë praktike për ta zbatuar sot.
                  </p>
                </div>
                <p className="text-[11px] font-semibold" style={{ color: G.textMut }}>{PARENTING_TECHNIQUES.length} teknika</p>
                <div className="space-y-3">
                  {PARENTING_TECHNIQUES.map(tech => (
                    <TechniqueCard
                      key={tech.id}
                      technique={tech}
                      category={PARENT_CATEGORIES.find(c => c.id === tech.categoryId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* AI */}
            {tab === 'ai' && (
              <AIAssistant
                pendingPrompt={pendingAIPrompt}
                onClearPending={() => setPendingAIPrompt(null)}
              />
            )}

            {/* Mobile panels */}
            <div className="lg:hidden space-y-4 pt-2">
              <div className="h-px" style={{ background: G.border }} />
              <LeftPanel onGoToAI={goToAI} />
              <RightPanel onSituation={goToAI} />
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="hidden lg:block w-64 shrink-0 sticky top-6">
            <RightPanel onSituation={goToAI} />
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
