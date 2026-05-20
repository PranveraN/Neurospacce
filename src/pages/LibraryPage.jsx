import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Clock, X, Sparkles,
  BookOpen, TrendingUp, Star, Filter, ChevronRight, ChevronLeft,
  Brain, Flame, Zap, Quote,
} from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { loadArticles, CATEGORIES, getCatColor } from '../data/articlesData'
import EditableText from '../components/EditableText'
import { PLATFORM_CATS } from '../data/categoriesData'

const ALL_ARTICLES = loadArticles()

/* ─── Keyframes ─────────────────────────────────────────────────────── */
const KF = `
@keyframes libSlideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes libFadeIn  { from{opacity:0} to{opacity:1} }
@keyframes libPop     { 0%{opacity:0;transform:scale(.94) translateY(10px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
`

/* ─── Quotes ─────────────────────────────────────────────────────────── */
const QUOTES = [
  { text: 'Truri yt mund të rindërtojë veten çdo ditë. Çdo libër, çdo ide e re — ndryshon strukturën e neuroneve.', author: 'NeuroSphera' },
  { text: 'Nëse nuk mëson diçka të re çdo ditë, je duke qëndruar "të qëndrueshëm" — dhe qëndrueshmëria është regres i ngadaltë.', author: 'NeuroSphera' },
  { text: 'Kujtesa nuk është e fiksuar. Ajo është e ndryshueshme, e formësueshme — dhe mund të optimizohet plotësisht.', author: 'NeuroSphera' },
  { text: 'Gjumi nuk është koha kur ndalon të mësuarit. Është kur truri proceson, organizon dhe forcon gjithçka mësove.', author: 'NeuroSphera' },
  { text: 'Ankthi nuk është armiku. Është sistemi i alarmit i trurit tënd. Mëso gjuhën e tij dhe ai bëhet aleat.', author: 'NeuroSphera' },
  { text: 'Çdo minutë e rileximit është investim me interesa. Truri quan çdo rishikim si "informacion i rëndësishëm" dhe e ruan thellë.', author: 'NeuroSphera' },
]

/* ─── Smart Popup ────────────────────────────────────────────────────── */
const POPUP_KEY  = 'ns_lib_last_visit'
const POPUP_DISM = 'ns_lib_popup_dism'

function getPopupType() {
  try {
    const dismissed = localStorage.getItem(POPUP_DISM)
    if (dismissed === new Date().toDateString()) return null
    const last = parseInt(localStorage.getItem(POPUP_KEY) || '0')
    if (!last) return 'new'
    const days = (Date.now() - last) / 86_400_000
    if (days > 7) return 'returning'
    if (days > 2) return 'inactive'
    return null
  } catch { return null }
}

function markVisited() {
  try { localStorage.setItem(POPUP_KEY, Date.now().toString()) } catch {}
}

function dismissPopupForDay() {
  try { localStorage.setItem(POPUP_DISM, new Date().toDateString()) } catch {}
}

function SmartPopup({ type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 9000)
    return () => clearTimeout(t)
  }, [onClose])

  const MAP = {
    new: {
      emoji: '🧠',
      title: 'Mirë se vjen në Bibliotekë!',
      text: 'Mbi 40 artikuj nga psikologë të licencuar. Fillo me të rekomanduarat.',
      grad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    },
    returning: {
      emoji: '🔥',
      title: 'Je kthyer! Kemi diçka të re.',
      text: 'Janë shtuar artikuj të rinj që kur ishte hera e fundit. Shiko çfarë ka ndryshuar.',
      grad: 'linear-gradient(135deg,#c2410c,#f97316)',
    },
    inactive: {
      emoji: '✨',
      title: 'Çdo ditë, diçka e re.',
      text: 'Biblioteka rritet çdo javë. Mos humb artikujt e rekomanduar nga AI.',
      grad: 'linear-gradient(135deg,#065f46,#10b981)',
    },
  }
  const c = MAP[type]
  if (!c) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs w-full" style={{ animation: 'libSlideUp .4s ease forwards' }}>
      <div className="relative rounded-2xl p-4 backdrop-blur-xl"
        style={{ background: 'rgba(10,10,26,0.93)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,.55)' }}>
        <button onClick={() => { dismissPopupForDay(); onClose() }}
          className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors">
          <X size={14} />
        </button>
        <div className="flex items-start gap-3 pr-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
            style={{ background: c.grad }}>{c.emoji}</div>
          <div>
            <EditableText as="p" className="font-bold text-white text-sm mb-0.5">{c.title}</EditableText>
            <EditableText as="p" className="text-white/50 text-xs leading-relaxed">{c.text}</EditableText>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/8 flex items-center gap-1 text-xs font-bold text-violet-400">
          Eksploro tani <ArrowRight size={10} />
        </div>
      </div>
    </div>
  )
}

/* ─── Quote Widget ────────────────────────────────────────────────────── */
function QuoteWidget() {
  const [idx, setIdx]       = useState(0)
  const [visible, setVis]   = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVis(false)
      setTimeout(() => { setIdx(i => (i + 1) % QUOTES.length); setVis(true) }, 450)
    }, 7500)
    return () => clearInterval(id)
  }, [])

  const q = QUOTES[idx]

  return (
    <div className="relative rounded-2xl px-6 py-5 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg,rgba(124,58,237,.08),rgba(236,72,153,.05))',
        border: '1px solid rgba(139,92,246,.18)',
      }}>
      <div className="absolute top-2 right-4 font-serif text-8xl leading-none select-none pointer-events-none"
        style={{ color: 'rgba(139,92,246,.06)', fontFamily: 'Georgia,serif' }}>"</div>

      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(7px)', transition: 'opacity .4s ease, transform .4s ease' }}>
        <Quote size={14} className="text-violet-500/50 mb-2" />
        <p className="text-white/72 text-sm leading-relaxed italic font-medium mb-2">{q.text}</p>
        <p className="text-violet-400/55 text-xs font-semibold">— {q.author}</p>
      </div>

      <div className="flex items-center gap-1.5 mt-4">
        {QUOTES.map((_, i) => (
          <button key={i} onClick={() => { setIdx(i); setVis(true) }}
            className="rounded-full transition-all duration-300"
            style={{ width: i === idx ? 16 : 5, height: 5, background: i === idx ? '#7c3aed' : 'rgba(255,255,255,0.12)' }} />
        ))}
      </div>
    </div>
  )
}

/* ─── Section Header ──────────────────────────────────────────────────── */
function SectionHeader({ icon: Icon, label, color = '#a78bfa', action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
          <Icon size={12} style={{ color }} />
        </div>
        <EditableText as="span" className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</EditableText>
      </div>
      {action && (
        <button onClick={onAction}
          className="text-[11px] font-bold flex items-center gap-1 transition-colors"
          style={{ color: `${color}80` }}
          onMouseEnter={e => e.currentTarget.style.color = color}
          onMouseLeave={e => e.currentTarget.style.color = `${color}80`}>
          <EditableText as="span">{action}</EditableText> <ChevronRight size={11} />
        </button>
      )}
    </div>
  )
}

/* ─── Article Cards ───────────────────────────────────────────────────── */
function ArticleCard({ article }) {
  return (
    <Link to={`/articles/${article.id}`}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(124,58,237,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}>
      <div className="relative overflow-hidden aspect-video">
        <img src={article.image} alt={article.title} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/80 via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${getCatColor(article.category)}`}>
          {article.category}
        </span>
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <Clock size={9} className="text-white/70" />
          <span className="text-[9px] text-white/80 font-medium">{article.readTime}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-white/90 text-sm leading-snug mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-white/30 text-[10px] font-medium">{article.author}</span>
          <span className="text-[10px] font-bold text-violet-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            Lexo <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function FeaturedCard({ article, large = false }) {
  return (
    <Link to={`/articles/${article.id}`}
      className={`group relative rounded-3xl overflow-hidden block transition-all duration-500 ${large ? '' : ''}`}
      style={{ boxShadow: 'none' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 25px 60px rgba(124,58,237,0.2)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      <img src={article.image} alt={article.title}
        className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 ${large ? 'h-full min-h-[280px] md:min-h-[340px]' : 'h-52'}`} />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top,rgba(10,10,26,.95) 0%,rgba(10,10,26,.5) 50%,transparent 100%)' }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 60px rgba(139,92,246,.12)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 bg-violet-500/20 backdrop-blur-sm border border-violet-400/30 rounded-full px-2.5 py-1">
            <Sparkles size={9} className="text-violet-400" />
            <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wide">Featured</span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getCatColor(article.category)}`}>
            {article.category}
          </span>
        </div>
        <h3 className={`font-black text-white leading-tight mb-1 group-hover:text-violet-200 transition-colors ${large ? 'text-xl' : 'text-base'}`}>
          {article.title}
        </h3>
        {large && <p className="text-white/50 text-sm line-clamp-2 mb-3">{article.excerpt}</p>}
        <div className="flex items-center justify-between">
          <span className="text-white/35 text-xs">{article.readTime} lexim</span>
          <span className="text-[10px] font-bold text-violet-300 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            Lexo <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function TrendingCard({ article }) {
  return (
    <Link to={`/articles/${article.id}`}
      className="group relative flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shrink-0 w-72"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'; e.currentTarget.style.background = 'rgba(52,211,153,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
        <img src={article.image} alt={article.title} loading="lazy"
          className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white/85 text-xs leading-snug line-clamp-2 group-hover:text-emerald-200 transition-colors mb-1">
          {article.title}
        </p>
        <div className="flex items-center gap-1.5">
          <Clock size={9} className="text-white/30" />
          <span className="text-[10px] text-white/30">{article.readTime}</span>
        </div>
      </div>
    </Link>
  )
}

function AIPickCard({ article, rank }) {
  const rankColors = ['#f59e0b', '#a78bfa', '#34d399', '#60a5fa', '#f472b6']
  const color = rankColors[rank] || '#a78bfa'
  return (
    <Link to={`/articles/${article.id}`}
      className="group flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.background = `${color}08` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
        style={{ background: `${color}20`, color }}>
        {rank + 1}
      </div>
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
        <img src={article.image} alt={article.title} loading="lazy"
          className="w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white/85 text-xs leading-snug line-clamp-2 group-hover:text-white transition-colors mb-0.5">
          {article.title}
        </p>
        <p className="text-[10px] text-white/30">{article.author} · {article.readTime}</p>
      </div>
      <ChevronRight size={13} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
    </Link>
  )
}

/* ─────────────────────────────────────────────── Main Page ── */
export default function LibraryPage() {
  const [params]                     = useSearchParams()
  const [search, setSearch]          = useState(params.get('q') || '')
  const [activePlatCat, setPlatCat]  = useState(params.get('cat') || 'all')
  const [activeArtCat, setArtCat]    = useState('Të gjitha')
  const [showFilters, setFilters]    = useState(false)
  const [popup, setPopup]            = useState(null)
  const tabsRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  /* Popup */
  useEffect(() => {
    const type = getPopupType()
    if (type) {
      const t = setTimeout(() => setPopup(type), 1800)
      return () => clearTimeout(t)
    }
    markVisited()
  }, [])

  useEffect(() => { if (popup) markVisited() }, [popup])

  /* Derived */
  const currentCatMeta = PLATFORM_CATS.find(c => c.id === activePlatCat)

  const filtered = useMemo(() => ALL_ARTICLES.filter(a => {
    const matchPlat   = activePlatCat === 'all' || a.platformCat === activePlatCat
    const matchArt    = activeArtCat === 'Të gjitha' || a.category === activeArtCat
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase())
    return matchPlat && matchArt && matchSearch
  }), [activePlatCat, activeArtCat, search])

  const featured = useMemo(() => filtered.filter(a => a.featured).slice(0, 3), [filtered])
  const rest     = useMemo(() => filtered.filter(a => !a.featured), [filtered])

  /* Home-view only data (from full catalogue) */
  const trending   = useMemo(() => ALL_ARTICLES.filter(a => !a.featured).slice(0, 8), [])
  const aiPicks    = useMemo(() => ALL_ARTICLES.filter(a => a.featured).slice(0, 5), [])
  const newArrivals = useMemo(() => [...ALL_ARTICLES].slice(-4).reverse(), [])

  const isDefault = activePlatCat === 'all' && !search && activeArtCat === 'Të gjitha'

  function selectPlatCat(id) { setPlatCat(id); setArtCat('Të gjitha'); setSearch('') }

  useEffect(() => {
    if (!tabsRef.current) return
    tabsRef.current.querySelector('[data-active="true"]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activePlatCat])

  return (
    <PublicLayout>
      <style>{KF}</style>
      {popup && <SmartPopup type={popup} onClose={() => setPopup(null)} />}

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#060611 0%,#0e0525 60%,#120730 100%)' }}>

        <div className="absolute top-4 left-4 z-20">
          <button onClick={() => (window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/', { replace: true })}
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold transition-colors">
            <ChevronLeft size={15} /> Kthehu mbrapa
          </button>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
        <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle,#ec4899,transparent)' }} />

        <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <BookOpen size={12} className="text-violet-400" />
            <EditableText as="span" className="text-xs font-bold text-violet-300 tracking-widest uppercase">Biblioteka Neurale</EditableText>
          </div>

          <h1 className="font-black text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)' }}>
            <EditableText>Çdo gjë që duhet të dish,</EditableText><br />
            <EditableText as="span" className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg,#a78bfa 20%,#f472b6 80%)' }}>
              e organizuar sipas shkencës
            </EditableText>
          </h1>
          <EditableText as="p" multiline className="text-white/45 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Artikuj, studime dhe udhëzues nga psikologë të licencuar — filtruar sipas kategorisë, nevojës dhe nivelit.
          </EditableText>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Kërko artikuj, tema, autorë..."
              className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm text-white placeholder-white/25 focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none' }} />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-8 text-white/30 text-xs">
            <span className="flex items-center gap-1.5">
              <Star size={11} className="text-amber-400/60" /> {ALL_ARTICLES.filter(a => a.featured).length} të rekomanduara
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <TrendingUp size={11} className="text-emerald-400/60" /> {ALL_ARTICLES.length}+ artikuj
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <BookOpen size={11} className="text-violet-400/60" /> {PLATFORM_CATS.length} kategori
            </span>
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div ref={tabsRef} className="flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
              <button data-active={activePlatCat === 'all'} onClick={() => selectPlatCat('all')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${activePlatCat === 'all' ? 'text-white' : 'text-white/45 hover:text-white/75'}`}
                style={activePlatCat === 'all' ? { background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' } : { border: '1px solid transparent' }}>
                <span>Të gjitha</span>
                <span className="text-[10px] opacity-60 font-medium">{ALL_ARTICLES.length}</span>
              </button>

              {PLATFORM_CATS.map(cat => {
                const Icon = cat.icon
                const count = ALL_ARTICLES.filter(a => a.platformCat === cat.id).length
                const isActive = activePlatCat === cat.id
                return (
                  <button key={cat.id} data-active={isActive} onClick={() => selectPlatCat(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${isActive ? 'text-white' : 'text-white/45 hover:text-white/75'}`}
                    style={isActive ? { background: `${cat.from}20`, border: `1px solid ${cat.from}40` } : { border: '1px solid transparent' }}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-50'}`}
                      style={{ background: `linear-gradient(135deg,${cat.from},${cat.to})` }}>
                      <Icon size={9} color="white" strokeWidth={2.5} />
                    </div>
                    <span>{cat.label.split(' ')[0]}</span>
                    {count > 0 && <span className="text-[10px] opacity-50 font-medium">{count}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONTENT ═══════════════════════════════════════════════ */}
      <div style={{ background: '#0d0d1f', minHeight: '60vh' }}>

        {/* ───────────────────── DEFAULT HOME VIEW ───────────── */}
        {isDefault && (
          <div className="max-w-7xl mx-auto px-5 py-10 space-y-14" style={{ animation: 'libFadeIn .4s ease' }}>

            {/* Featured */}
            {featured.length > 0 && (
              <section>
                <SectionHeader icon={Sparkles} label="Të rekomanduara" color="#a78bfa" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridTemplateRows: 'auto auto' }}>
                  {featured[0] && (
                    <div className="md:col-span-2 md:row-span-2">
                      <FeaturedCard article={featured[0]} large />
                    </div>
                  )}
                  {featured[1] && <FeaturedCard article={featured[1]} />}
                  {featured[2] && <FeaturedCard article={featured[2]} />}
                </div>
              </section>
            )}

            {/* Quote */}
            <QuoteWidget />

            {/* Trending */}
            {trending.length > 0 && (
              <section>
                <SectionHeader icon={TrendingUp} label="Trending tani" color="#34d399" />
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {trending.map(a => <TrendingCard key={a.id} article={a} />)}
                </div>
              </section>
            )}

            {/* AI Picks + New Arrivals */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <section className="lg:col-span-3">
                <SectionHeader icon={Brain} label="AI Picks — Për ty" color="#f59e0b" />
                <div className="space-y-2">
                  {aiPicks.map((a, i) => <AIPickCard key={a.id} article={a} rank={i} />)}
                </div>
              </section>

              <section className="lg:col-span-2">
                <SectionHeader icon={Flame} label="Të reja" color="#f97316" />
                <div className="space-y-3">
                  {newArrivals.map(a => (
                    <Link key={a.id} to={`/articles/${a.id}`}
                      className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; e.currentTarget.style.background = 'rgba(249,115,22,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <img src={a.image} alt={a.title} loading="lazy"
                          className="w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white/80 text-xs leading-snug line-clamp-2 group-hover:text-white transition-colors">
                          {a.title}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1">
                          <Clock size={8} /> {a.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* All articles */}
            <section>
              <SectionHeader icon={BookOpen} label="Të gjithë artikujt" color="#60a5fa"
                action={showFilters ? 'Largo filtrat' : 'Filtro'} onAction={() => setFilters(f => !f)} />
              {showFilters && (
                <div className="flex items-center gap-2 flex-wrap mb-5">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setArtCat(c)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                        activeArtCat === c
                          ? 'bg-violet-600 text-white border-violet-500'
                          : 'text-white/45 hover:text-white/70 hover:border-white/20'
                      }`}
                      style={activeArtCat !== c ? { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' } : {}}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rest.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            </section>

            {/* Explore categories */}
            <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
              <SectionHeader icon={Zap} label="Eksploro sipas kategorisë" color="#a78bfa" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLATFORM_CATS.map(cat => {
                  const Icon = cat.icon
                  const count = ALL_ARTICLES.filter(a => a.platformCat === cat.id).length
                  return (
                    <button key={cat.id} onClick={() => selectPlatCat(cat.id)}
                      className="group text-left p-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `${cat.from}40`; e.currentTarget.style.background = `${cat.from}0a` }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg,${cat.from},${cat.to})` }}>
                        <Icon size={16} color="white" strokeWidth={2} />
                      </div>
                      <p className="font-bold text-white/80 text-xs leading-snug mb-1 group-hover:text-white transition-colors">{cat.label}</p>
                      <p className="text-white/25 text-[10px]">{count} artikuj</p>
                    </button>
                  )
                })}
              </div>
            </section>

            <div className="h-4" />
          </div>
        )}

        {/* ───────────────────── FILTERED / SEARCH VIEW ────── */}
        {!isDefault && (
          <div className="max-w-7xl mx-auto px-5 py-10" style={{ animation: 'libFadeIn .3s ease' }}>

            {/* Category banner */}
            {activePlatCat !== 'all' && currentCatMeta && !search && (
              <div className="mb-8 px-6 py-4 rounded-2xl flex items-center gap-4"
                style={{
                  background: `linear-gradient(135deg,${currentCatMeta.from}15,${currentCatMeta.to}08)`,
                  border: `1px solid ${currentCatMeta.from}25`,
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg,${currentCatMeta.from},${currentCatMeta.to})` }}>
                  {(() => { const I = currentCatMeta.icon; return <I size={18} color="white" strokeWidth={2} /> })()}
                </div>
                <div>
                  <p className="font-black text-white text-sm">{currentCatMeta.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{currentCatMeta.desc}</p>
                </div>
                <div className="ml-auto shrink-0">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: `${currentCatMeta.from}20`, color: currentCatMeta.from }}>
                    {filtered.length} artikuj
                  </span>
                </div>
              </div>
            )}

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setFilters(f => !f)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: showFilters ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${showFilters ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: showFilters ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                  }}>
                  <Filter size={11} /> Filtro
                </button>

                {showFilters && CATEGORIES.map(c => (
                  <button key={c} onClick={() => setArtCat(c)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                      activeArtCat === c
                        ? 'bg-violet-600 text-white border-violet-500'
                        : 'text-white/45 hover:text-white/70 hover:border-white/20'
                    }`}
                    style={activeArtCat !== c ? { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' } : {}}>
                    {c}
                  </button>
                ))}
              </div>

              <div className="sm:ml-auto text-xs text-white/25 shrink-0">
                {filtered.length} artikuj
                {activeArtCat !== 'Të gjitha' && <span className="text-white/40"> · {activeArtCat}</span>}
                {search && <span className="text-white/40"> · "{search}"</span>}
              </div>
            </div>

            {/* Empty */}
            {filtered.length === 0 && (
              <div className="py-32 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <Search size={24} className="text-violet-400/50" />
                </div>
                <p className="text-white/40 font-semibold mb-1">Asnjë artikull nuk u gjet</p>
                <p className="text-white/20 text-sm mb-6">Provo me terma të ndryshme ose largo filtrat</p>
                <button onClick={() => { setSearch(''); setArtCat('Të gjitha'); selectPlatCat('all') }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-colors">
                  Largo filtrat
                </button>
              </div>
            )}

            {/* Featured in category */}
            {featured.length > 0 && !search && (
              <div className="mb-10">
                <SectionHeader icon={Sparkles} label="Të rekomanduara" color="#a78bfa" />
                <div className={`grid gap-5 ${featured.length >= 3 ? 'grid-cols-1 md:grid-cols-3' : featured.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl'}`}>
                  {featured.map(a => <FeaturedCard key={a.id} article={a} />)}
                </div>
              </div>
            )}

            {/* Rest */}
            {(rest.length > 0 || (search && filtered.length > 0)) && (
              <div>
                {featured.length > 0 && !search && (
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp size={13} className="text-emerald-400/70" />
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      {activePlatCat === 'all' ? 'Të gjithë artikujt' : 'Artikuj në këtë kategori'}
                    </span>
                  </div>
                )}
                {search && (
                  <div className="flex items-center gap-2 mb-5">
                    <Search size={13} className="text-white/30" />
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      Rezultate për "{search}"
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(search ? filtered : rest).map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
