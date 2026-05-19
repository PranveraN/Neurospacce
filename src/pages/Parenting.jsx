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

/* ─── Carousel slides ────────────────────────────────────────────────────── */
const CAROUSEL = [
  { emoji: '👨‍👧',   title: '"Fëmija im nuk dëgjon asnjëherë"',             tip: 'Uluni në nivelin e tij dhe kuptoni arsyen. Sjellja vjen shpesh nga nevoja e paplotësuar, jo nga keqdashja.', color: '#7c3aed', soft: '#f5f3ff', tag: 'Komunikim' },
  { emoji: '👩‍👦',   title: '"Si ta kufizoj kohën e ekranit?"',              tip: 'Vendosni rregulla bashkërisht, jo vetëm ju. Fëmijët respektojnë kufijt kur janë pjesë e vendimmarrjes.',       color: '#3b82f6', soft: '#eff6ff', tag: 'Teknologjia' },
  { emoji: '👨‍👩‍👦', title: '"Detyrat e shtëpisë janë betejë çdo ditë"',    tip: 'I njëjti vend, i njëjti orar. Pas 2 javësh truri i fëmijës do ta presë rutinën natyrshëm.',                   color: '#f97316', soft: '#fff7ed', tag: 'Shkolla' },
  { emoji: '👶',    title: '"Gjumi është i pamundur"',                       tip: 'Banja → libri → gjumi. Sekuenca e njëjtë çdo natë i tregon trurit se është koha e qetësisë.',                  color: '#ec4899', soft: '#fdf2f8', tag: 'Gjumi' },
  { emoji: '🧒',    title: '"Po sillet keq me shokët"',                     tip: 'Para ndërhyrjes pyesni pse. Sjellja negative shpesh është komunikim i paplotësuar i ndjenjave.',                 color: '#059669', soft: '#ecfdf5', tag: 'Social' },
  { emoji: '👩‍👧‍👦', title: '"Adoleshenti im nuk flet me mua"',             tip: 'Mos pyesni — bëni diçka bashkë. Bisednat e mira ndodhin kur jemi anash, jo përballë njëri-tjetrit.',           color: '#0891b2', soft: '#ecfeff', tag: 'Adoleshencë' },
]

/* ─── Situations with inline tips ───────────────────────────────────────── */
const SITUATIONS = [
  { emoji: '😠', label: 'Nuk dëgjon',    color: '#ef4444', soft: '#fef2f2', tip: 'Qetësohu i pari — fëmija ndien tensionin. Uluni, bëni kontakt me sy dhe shpjegoni me fjalë të thjeshta.', prompt: 'Fëmija im nuk dëgjon asgjë. Si të veproj?' },
  { emoji: '📱', label: 'Shumë telefon', color: '#3b82f6', soft: '#eff6ff', tip: 'Vendosni "zonat pa ekran" bashkë: dhoma e gjumit, tryeza e darkës. Bëni rregullin, jo dënimin.',           prompt: 'Si ta kufizoj kohën e ekranit me fëmijën tim?' },
  { emoji: '😢', label: 'Qan shpesh',    color: '#f59e0b', soft: '#fffbeb', tip: 'Qarja është komunikim. Para se të qetësonit, pranojeni: "E kuptoj që je i trishtuar." Kjo ndihmon.',        prompt: 'Fëmija im qan shpesh dhe nuk di pse. Si të ndihmoj?' },
  { emoji: '🛡️', label: 'Bullizmi',      color: '#10b981', soft: '#ecfdf5', tip: 'Dëgjoni pa ndërhyrë fillimisht. Fëmija duhet të ndihet i besuar. Pastaj veproni me shkollën bashkë.',        prompt: 'Fëmija im po viktimzohet në shkollë. Çfarë duhet të bëj?' },
  { emoji: '📚', label: 'Detyrat',       color: '#8b5cf6', soft: '#f5f3ff', tip: 'Ndani detyrën: 20 min punë + 10 min pushim. Mos qëndroni pranë — lëreni të ndihet kompetent.',              prompt: 'Fëmija im nuk dëshiron të bëjë detyrat e shtëpisë.' },
  { emoji: '😤', label: 'Krizat',        color: '#f97316', soft: '#fff7ed', tip: 'Gjatë krizës mos debatoni — prini. Pas krizës flisni. Para krizës identifikoni triggerët.',                  prompt: 'Fëmija im ka humbje temperamenti të shpeshta. Çfarë të bëj?' },
]

const INSIGHTS = [
  { label: 'Disiplina & Kufijtë', pct: 67, color: '#7c3aed' },
  { label: 'Komunikimi',          pct: 54, color: '#ec4899' },
  { label: 'Ekranet',             pct: 42, color: '#3b82f6' },
]

const TABS = [
  { id: 'articles',   label: 'Artikuj',      icon: BookOpen },
  { id: 'techniques', label: 'Teknikat',     icon: Lightbulb },
  { id: 'ai',         label: 'Asistenti AI', icon: Bot },
]

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
      className="rounded-3xl overflow-hidden border transition-all duration-500"
      style={{ background: c.soft, borderColor: `${c.color}25` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide content */}
      <div
        className="px-5 pt-5 pb-4 flex items-center gap-4 transition-all duration-200"
        style={{ opacity: fade ? 1 : 0, transform: fade ? 'translateY(0)' : 'translateY(6px)' }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0 border-2"
          style={{ background: `${c.color}18`, borderColor: `${c.color}30` }}
        >
          {c.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-[10px] font-black uppercase tracking-widest block mb-1"
            style={{ color: c.color }}
          >
            {c.tag}
          </span>
          <p className="text-sm font-black text-gray-800 leading-snug mb-2">{c.title}</p>
          <div className="flex items-start gap-2">
            <Quote size={11} style={{ color: c.color }} className="shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 leading-relaxed">{c.tip}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex gap-1.5 items-center">
          {CAROUSEL.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === idx ? 18 : 6, height: 6, background: i === idx ? c.color : `${c.color}40` }}
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
              style={{ background: `${c.color}18`, color: c.color }}
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
      className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md group"
      style={{
        border: `1px solid ${open ? category?.color + '35' : '#f0f0f0'}`,
        borderLeft: `3px solid ${category?.color || '#7c3aed'}`,
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ background: category?.soft || '#f3f4f6' }}
          >
            {article.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-snug mb-1.5">{article.title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <Clock size={9} /> {article.readTime}
              </span>
              {article.tags.slice(0, 2).map(t => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: category?.soft, color: category?.color }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
            style={{
              background: open ? (category?.soft || '#f5f3ff') : '#f9fafb',
              color:      open ? (category?.color || '#7c3aed') : '#d1d5db',
            }}
          >
            <ChevronRight size={13} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </div>
        </div>

        {open && (
          <div className="mt-3 pt-3 space-y-3" style={{ borderTop: `1px solid ${category?.color}20` }}>
            {/* Lead */}
            <EditableText
              id={`parenting-article-${article.id}-excerpt`}
              as="p"
              className="text-sm font-semibold leading-relaxed"
              style={{ color: category?.color || '#7c3aed' }}
            >
              {article.excerpt}
            </EditableText>

            {/* Body paragraphs */}
            {(article.content || []).map((para, i) => (
              <EditableText
                key={i}
                id={`parenting-article-${article.id}-p${i}`}
                as="p"
                multiline
                className="text-sm text-gray-600 leading-relaxed"
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
      className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
      style={{ border: `1px solid ${open ? category?.color + '35' : '#f0f0f0'}` }}
    >
      <button className="w-full p-4 text-left flex items-center gap-3" onClick={() => setOpen(o => !o)}>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: category?.soft || '#f3f4f6' }}
        >
          {technique.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{technique.title}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{technique.situation}</p>
        </div>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
          style={{ background: open ? category?.soft : '#f9fafb', color: open ? category?.color : '#d1d5db' }}
        >
          <ChevronRight size={13} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${category?.color}15` }}>
          <div className="rounded-xl p-3 mt-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-wide mb-1">❌ Qasja e gabuar</p>
            <p className="text-xs text-red-700 leading-relaxed">{technique.wrongApproach}</p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-gray-400 mb-2">✅ Hapat e duhur</p>
            <div className="space-y-2">
              {technique.steps.map((s, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 text-white"
                    style={{ background: category?.color || '#7c3aed' }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">💬 Shembull</p>
            <p className="text-xs text-gray-700 italic leading-relaxed">"{technique.example}"</p>
          </div>

          <div className="rounded-xl p-3" style={{ background: category?.soft, border: `1px solid ${category?.color}25` }}>
            <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{ color: category?.color }}>💡 Këshillë</p>
            <p className="text-xs leading-relaxed" style={{ color: category?.color }}>{technique.tip}</p>
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
    <div className="flex flex-col rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white" style={{ height: 540 }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0" style={{ background: 'linear-gradient(135deg,#f5f3ff,#fdf2f8)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
          <Bot size={18} color="white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Asistenti i Prindërisë</p>
          <p className="text-[10px] text-gray-400">Psikologji zhvillimore · Udhëzim praktik</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-gray-400">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                <Bot size={14} color="white" />
              </div>
            )}
            <div
              className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line"
              style={m.role === 'user'
                ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', borderBottomRightRadius: 4 }
                : { background: '#f8f7ff', color: '#374151', borderBottomLeftRadius: 4 }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              <Bot size={14} color="white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3 flex gap-1.5 items-center" style={{ borderBottomLeftRadius: 4 }}>
              {[0, 1, 2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Expert CTA after depth cap */}
      {capped && (
        <div className="mx-3 mb-2 rounded-xl px-3 py-2 flex items-center gap-2 shrink-0" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
          <ExternalLink size={12} className="text-violet-500 shrink-0" />
          <p className="text-[10px] text-violet-600 flex-1">Mbështetje e thelluar — konsulto specialistin</p>
          <Link to="/ask-psychologist" className="text-[10px] font-bold text-violet-700 underline whitespace-nowrap">Psikologët →</Link>
        </div>
      )}

      {/* Safety note */}
      <div className="mx-3 mb-2 rounded-xl px-3 py-2 flex items-start gap-2 shrink-0" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
        <Shield size={10} className="text-gray-400 shrink-0 mt-0.5" />
        <p className="text-[9px] text-gray-400 leading-relaxed">Ky asistent ofron udhëzim orientues. Nuk diagnostikon dhe nuk zëvendëson psikologun.</p>
      </div>

      {!capped && (
        <div className="px-4 py-2 border-t border-gray-50 overflow-x-auto shrink-0">
          <div className="flex gap-2 min-w-max">
            {AI_PROMPTS.slice(0, 4).map((p, i) => (
              <button key={i} onClick={() => send(p)} className="text-[10px] px-2.5 py-1.5 rounded-xl bg-violet-50 text-violet-600 font-semibold whitespace-nowrap hover:bg-violet-100 transition-colors">
                {p.length > 28 ? p.slice(0, 28) + '…' : p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 pb-3 pt-2 border-t border-gray-100 shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={capped ? 'Konsulto ekspertin për mbështetje të thelluar' : 'Pyesni diçka për fëmijën tuaj…'}
            disabled={capped}
            className="flex-1 text-xs bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300 focus:bg-white transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading || capped}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
            <Brain size={13} color="white" />
          </div>
          <span className="text-sm font-bold text-gray-900">Ndihmë e shpejtë</span>
          <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">AI</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-3">Ke një situatë tani? Përshkruaje shkurt…</p>

        <textarea
          value={quickInput}
          onChange={e => setQuickInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleQuickAsk())}
          placeholder="Fëmija im nuk më dëgjon…"
          rows={2}
          className="w-full text-xs bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300 focus:bg-white transition-colors resize-none mb-2"
        />
        <button
          onClick={handleQuickAsk}
          disabled={!quickInput.trim() || loading}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 transition-all"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
        >
          <Send size={12} />
          {loading ? 'Duke menduar…' : 'Merr përgjigje'}
        </button>

        {quickResponse && (
          <div className="mt-3 rounded-xl p-3" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
            <p className="text-[10px] font-black text-violet-600 uppercase tracking-wide mb-2">✨ Përgjigja</p>
            <p className="text-xs text-gray-700 leading-relaxed mb-2">{quickResponse.empathy}</p>
            {quickResponse.steps[0] && (
              <div className="flex gap-2 items-start mb-2">
                <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-[8px] font-black text-white shrink-0 mt-0.5">1</div>
                <p className="text-xs text-gray-600 leading-relaxed">{quickResponse.steps[0]}</p>
              </div>
            )}
            <button onClick={() => onGoToAI(quickInput)} className="w-full py-1.5 rounded-lg text-xs font-bold text-violet-600 border border-violet-200 hover:bg-violet-50 transition-colors">
              Shiko zgjidhjen e plotë →
            </button>
          </div>
        )}
      </div>

      {/* Daily tip */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: dailyCat?.soft, borderColor: `${dailyCat?.color}30` }}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span>💡</span>
            <span className="text-sm font-bold text-gray-900">Këshilla e ditës</span>
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${dailyCat?.color}22` }}>
              {dailyTech.emoji}
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800">{dailyTech.title}</p>
              <p className="text-[10px] font-semibold" style={{ color: dailyCat?.color }}>{dailyCat?.label}</p>
            </div>
          </div>
          <div className="bg-white/70 rounded-xl p-3 mb-3 flex items-start gap-2">
            <Quote size={11} style={{ color: dailyCat?.color }} className="shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 leading-relaxed italic">{dailyTech.tip}</p>
          </div>
          <button
            onClick={() => onGoToAI(`Më shpjego teknikën "${dailyTech.title}" hap pas hapi me shembuj praktikë.`)}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: `linear-gradient(135deg,${dailyCat?.color},${dailyCat?.color}cc)` }}
          >
            Shpjego me AI →
          </button>
        </div>
      </div>
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} className="text-amber-500" />
          <span className="text-sm font-bold text-gray-900">Çfarë po përballon?</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-3">Klikoni për këshillë të shpejtë</p>

        <div className="space-y-1.5">
          {SITUATIONS.map(s => (
            <button
              key={s.label}
              onClick={() => toggle(s.label)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left"
              style={{
                background: activeSit === s.label ? s.color : s.soft,
                color:      activeSit === s.label ? 'white' : s.color,
              }}
            >
              <span className="text-sm leading-none">{s.emoji}</span>
              <span className="flex-1">{s.label}</span>
              <ChevronRight size={12} className="shrink-0" style={{ transform: activeSit === s.label ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }} />
            </button>
          ))}
        </div>

        {/* Inline tip */}
        {sit && (
          <div className="mt-3 rounded-xl p-3" style={{ background: sit.soft, border: `1px solid ${sit.color}30` }}>
            <p className="text-[10px] font-black uppercase tracking-wide mb-1.5" style={{ color: sit.color }}>💡 Këshillë e shpejtë</p>
            <p className="text-xs text-gray-700 leading-relaxed mb-2">{sit.tip}</p>
            <button onClick={() => onSituation(sit.prompt)} className="text-[10px] font-black flex items-center gap-1 hover:underline" style={{ color: sit.color }}>
              Merr ndihmë të plotë nga AI <ChevronRight size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={14} className="text-blue-500" />
          <span className="text-sm font-bold text-gray-900">Temat kryesore</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">Çfarë po presin prindërit këtë javë</p>
        <div className="space-y-3">
          {INSIGHTS.map(({ label, pct, color }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold text-gray-600">{label}</span>
                <span className="text-[10px] font-black" style={{ color }}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}88)` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-3">Bazuar në aktivitetin e platformës këtë javë.</p>
      </div>

      {/* AI CTA */}
      <button
        onClick={() => onSituation('')}
        className="w-full flex items-center gap-3 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
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
    <div className="max-w-6xl mx-auto px-5 py-8 flex gap-5 items-start pb-10">

      {/* ── Left panel ── */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-6">
        <LeftPanel onGoToAI={goToAI} />
      </div>

      {/* ── Center ── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-violet-300 group-hover:bg-violet-50 transition-all">
            <ChevronLeft size={15} />
          </div>
          Kthehu te faqja kryesore
        </Link>

        {/* Hero */}
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg,#4c1d95 0%,#7c3aed 45%,#ec4899 78%,#f97316 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="relative px-6 py-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-3xl">
                👨‍👩‍👧‍👦
              </div>
              <div>
                <EditableText as="h1" className="text-xl font-black text-white leading-tight">NeuroSpace për Prindërit</EditableText>
                <EditableText as="p" className="text-sm text-white/75 mt-0.5">Psikologji zhvillimore · Teknika praktike · AI</EditableText>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { n: PARENTING_ARTICLES.length,   label: 'Artikuj',  icon: '📚' },
                { n: PARENTING_TECHNIQUES.length,  label: 'Teknika',  icon: '💡' },
                { n: PARENT_CATEGORIES.length,     label: 'Kategori', icon: '🗂️' },
              ].map(({ n, label, icon }) => (
                <div key={label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl py-3 px-4 text-center">
                  <p className="text-xl font-black text-white">{icon} {n}</p>
                  <p className="text-[10px] text-white/70 font-semibold mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Family Carousel */}
        <FamilyCarousel />

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={tab === id
                ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', boxShadow: '0 4px 12px #7c3aed44' }
                : { color: '#9ca3af' }
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
                    ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white' }
                    : { background: '#f3f4f6', color: '#6b7280' }}
                >
                  Të gjitha
                </button>
                {PARENT_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCat(cat.id)}
                    className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap"
                    style={filterCat === cat.id
                      ? { background: cat.gradient, color: 'white' }
                      : { background: cat.soft,     color: cat.color }}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold">{filtered.length} artikuj</p>
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
            <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,#f5f3ff,#fdf2f8)', border: '1px solid #ede9fe' }}>
              <p className="text-sm font-bold text-gray-800 mb-1">Teknikat për situatat kryesore</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Çdo teknikë tregon qasjen e gabuar, hapat e duhur, shembull real dhe këshillë praktike për ta zbatuar sot.
              </p>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold">{PARENTING_TECHNIQUES.length} teknika</p>
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
          <div className="h-px bg-gray-100" />
          <LeftPanel onGoToAI={goToAI} />
          <RightPanel onSituation={goToAI} />
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-6">
        <RightPanel onSituation={goToAI} />
      </div>
    </div>
    </PublicLayout>
  )
}
