import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain, Baby, FlaskConical, CalendarCheck,
  TrendingUp, BarChart2, ChevronLeft, ChevronRight, ArrowRight, Sparkles,
} from 'lucide-react'
import EditableText from '../EditableText'

const SLIDES = [
  {
    id: 'ai',
    icon: Brain,
    emoji: '🤖',
    tag: 'Asistent personal',
    title: 'AI që të kupton vërtet',
    desc: 'Fol lirshëm me NeuroAI — gjithmonë i disponueshëm, pa gjykim. Bazuar në psikologji klinike.',
    cta: 'Fillo bisedën',
    href: '/chat',
    from: '#7c3aed',
    to: '#6d28d9',
    accent: '#c084fc',
    soft: 'rgba(124,58,237,0.08)',
    preview: [
      { from: 'ai',   text: 'Si ndihesh sot? Jam këtu për ty. 💙' },
      { from: 'user', text: 'Ndihem i/e anksioz...' },
      { from: 'ai',   text: 'E kuptoj. Provo frymëmarrjen 4-7-8 tani... ✨' },
    ],
  },
  {
    id: 'parenting',
    icon: Baby,
    emoji: '👶',
    tag: 'Modul prindëror',
    title: 'Prindëri me qëndrim, jo teori',
    desc: 'Udhëzim praktik për çdo fazë të rritjes. Pyete AI-n, lexo artituj, zbulo teknikat.',
    cta: 'Eksploro modulin',
    href: '/parenting',
    from: '#ec4899',
    to: '#be185d',
    accent: '#f9a8d4',
    soft: 'rgba(236,72,153,0.08)',
    preview: [
      { icon: '🎯', label: 'Komunikim jo-dhunshëm' },
      { icon: '😴', label: 'Rutina e gjumit' },
      { icon: '🧩', label: 'Zhvillim kognitiv' },
      { icon: '💬', label: 'Menaxhim emocionesh' },
    ],
  },
  {
    id: 'tests',
    icon: FlaskConical,
    emoji: '🧠',
    tag: 'Teste shkencore',
    title: 'Zbulo personalitetin tënd',
    desc: 'Teste të validuara shkencërisht — Big Five, PANAS dhe teste kognitive. Rezultate reale pa gjykim.',
    cta: 'Fillo testin',
    href: '/tests',
    from: '#0891b2',
    to: '#0e7490',
    accent: '#67e8f9',
    soft: 'rgba(8,145,178,0.08)',
    preview: [
      { trait: 'Hapur ndaj eksperiencave', value: 82, color: '#7c3aed' },
      { trait: 'Koshiencues',              value: 68, color: '#0891b2' },
      { trait: 'Ekstravert',               value: 54, color: '#059669' },
      { trait: 'Dashamirës',               value: 91, color: '#d97706' },
    ],
  },
  {
    id: 'book',
    icon: CalendarCheck,
    emoji: '📅',
    tag: 'Takime profesionale',
    title: 'Psikolog real, brenda minutave',
    desc: 'Zgjidhni psikologun, datën dhe orën — konfirmim i menjëhershëm. Pa radhë pritjeje.',
    cta: 'Rezervo tani',
    href: '/book',
    from: '#059669',
    to: '#047857',
    accent: '#6ee7b7',
    soft: 'rgba(5,150,105,0.08)',
    preview: {
      date: 'E Hënë, 12 Maj',
      slots: ['09:00', '10:30', '14:00', '16:30'],
      selected: '10:30',
      name: 'Dr. Arta Krasniqi',
    },
  },
  {
    id: 'growth',
    icon: TrendingUp,
    emoji: '🌱',
    tag: 'Zhvillim personal',
    title: 'Teknika që funksionojnë',
    desc: 'Mindfulness, CBT, Spaced Repetition — metoda të dëshmuara shkencore për rritje të qëndrueshme.',
    cta: 'Shiko teknikat',
    href: '/techniques',
    from: '#d97706',
    to: '#b45309',
    accent: '#fcd34d',
    soft: 'rgba(217,119,6,0.08)',
    preview: [
      { icon: '🧘', name: 'Meditim 5-minutësh', duration: '5 min' },
      { icon: '📓', name: 'Journaling i drejtuar', duration: '10 min' },
      { icon: '🫁', name: 'Frymëmarrje 4-7-8', duration: '3 min' },
    ],
  },
  {
    id: 'mood',
    icon: BarChart2,
    emoji: '📊',
    tag: 'Analitika mendore',
    title: 'Shijo progresin tënd',
    desc: 'Gjurmo humorin çdo ditë, zbulo modelet dhe merr rekomandime të personalizuara nga AI.',
    cta: 'Gjurmo humorin',
    href: '/mood',
    from: '#7c3aed',
    to: '#ec4899',
    accent: '#c084fc',
    soft: 'rgba(124,58,237,0.08)',
    preview: {
      days: ['H','M','M','E','P','Sh','Di'],
      values: [55, 70, 45, 80, 72, 90, 85],
      streak: 14,
    },
  },
]

// ─── Preview renderers ─────────────────────────────────────────────────────

function ChatPreview({ items, from, to }) {
  return (
    <div className="space-y-2.5 px-1">
      {items.map((m, i) => (
        <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
          {m.from === 'ai' && (
            <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg,${from},${to})` }}>
              <Brain size={12} color="white"/>
            </div>
          )}
          <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-xs leading-relaxed ${m.from === 'ai' ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
            style={m.from === 'ai'
              ? { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }
              : { background: `linear-gradient(135deg,${from}99,${to}99)`, color: 'white' }}>
            {m.text}
          </div>
        </div>
      ))}
    </div>
  )
}

function TagsPreview({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          <span className="text-base">{item.icon}</span>
          <p className="text-white/75 text-xs font-semibold leading-tight">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function BarsPreview({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <span className="text-white/60 text-[11px] font-medium">{item.trait}</span>
            <span className="text-white/80 text-[11px] font-black">{item.value}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${item.value}%`, background: item.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function CalendarPreview({ data }) {
  return (
    <div>
      <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3">{data.date}</p>
      <p className="text-white/80 text-sm font-bold mb-3">{data.name}</p>
      <div className="grid grid-cols-4 gap-2">
        {data.slots.map(s => (
          <div key={s} className={`rounded-xl py-2 text-center text-xs font-bold transition-all ${s === data.selected ? 'text-white scale-105' : 'text-white/50'}`}
            style={s === data.selected
              ? { background: 'linear-gradient(135deg,#059669,#10b981)' }
              : { background: 'rgba(255,255,255,0.08)' }}>
            {s}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5"
        style={{ background: 'rgba(5,150,105,0.25)', border: '1px solid rgba(110,231,183,0.3)' }}>
        <CalendarCheck size={14} style={{ color: '#6ee7b7' }} />
        <p className="text-emerald-300 text-xs font-bold">Konfirmo rezervimin</p>
      </div>
    </div>
  )
}

function TechPreview({ items, from, to }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl px-3.5 py-3"
          style={{ background: 'rgba(255,255,255,0.07)' }}>
          <span className="text-xl">{item.icon}</span>
          <p className="text-white/80 text-xs font-semibold flex-1">{item.name}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${from}30`, color: from }}>
            {item.duration}
          </span>
        </div>
      ))}
    </div>
  )
}

function MoodPreview({ data, from, to }) {
  const max = Math.max(...data.values)
  return (
    <div>
      <div className="flex items-end gap-1.5 h-20 mb-3">
        {data.values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-full transition-all duration-500"
              style={{
                height: `${(v / max) * 100}%`,
                background: i === data.values.length - 1
                  ? `linear-gradient(to top,${from},${to})`
                  : 'rgba(255,255,255,0.15)',
              }}/>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-4">
        {data.days.map(d => (
          <span key={d} className="text-[9px] text-white/30 font-bold">{d}</span>
        ))}
      </div>
      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
        style={{ background: 'rgba(255,255,255,0.07)' }}>
        <span className="text-xl">🔥</span>
        <p className="text-white/75 text-xs font-bold">{data.streak} ditë streak aktiv</p>
      </div>
    </div>
  )
}

function SlidePreview({ slide }) {
  if (slide.id === 'ai')       return <ChatPreview     items={slide.preview} from={slide.from} to={slide.to}/>
  if (slide.id === 'parenting') return <TagsPreview    items={slide.preview}/>
  if (slide.id === 'tests')    return <BarsPreview     items={slide.preview}/>
  if (slide.id === 'book')     return <CalendarPreview data={slide.preview}/>
  if (slide.id === 'growth')   return <TechPreview     items={slide.preview} from={slide.from} to={slide.to}/>
  if (slide.id === 'mood')     return <MoodPreview     data={slide.preview}  from={slide.from} to={slide.to}/>
  return null
}

// ─── Main carousel ─────────────────────────────────────────────────────────

export default function ServicesCarousel() {
  const [active,  setActive]  = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [animDir, setAnimDir] = useState('right')
  const touchStart             = useRef(null)
  const total                  = SLIDES.length

  const goTo = useCallback((idx, dir = 'right') => {
    setAnimDir(dir)
    setActive((idx + total) % total)
  }, [total])

  const next = useCallback(() => goTo(active + 1, 'right'), [active, goTo])
  const prev = useCallback(() => goTo(active - 1, 'left'),  [active, goTo])

  // Auto-slide every 5s
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next])

  function onTouchStart(e) { touchStart.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (!touchStart.current) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (diff > 40)       next()
    else if (diff < -40) prev()
    touchStart.current = null
  }

  const slide = SLIDES[active]
  const Icon  = slide.icon

  return (
    <section className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #faf5ff 0%, #fdf2f8 50%, #eff6ff 100%)' }}>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #c084fc, transparent)' }}/>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #f9a8d4, transparent)' }}/>
      </div>

      <div className="relative max-w-7xl mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 border border-violet-200 rounded-full px-4 py-2 mb-4">
            <Sparkles size={14} className="text-violet-600"/>
            <EditableText id="carousel-badge" as="span" className="text-sm font-bold text-violet-700">
              Tota çfarë ke nevojë
            </EditableText>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
            <EditableText id="carousel-h2" as="span">Një platformë,</EditableText>{' '}
            <EditableText id="carousel-h2-accent" as="span"
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              gjithçka
            </EditableText>
          </h2>
          <EditableText id="carousel-sub" as="p" multiline className="text-gray-500 text-base max-w-xl mx-auto">
            Nga biseda me AI deri te takimet me psikolog — mbështetje e plotë mendore në një vend.
          </EditableText>
        </div>

        {/* Pill tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i, i > active ? 'right' : 'left')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
              style={i === active
                ? { background: `linear-gradient(135deg,${s.from},${s.to})`, color: 'white', boxShadow: `0 4px 16px ${s.from}40` }
                : { background: s.soft, color: s.from, border: `1px solid ${s.from}30` }
              }
            >
              <span className="text-base leading-none">{s.emoji}</span>
              <EditableText id={`carousel-slide-${s.id}-tag`} as="span" className="hidden sm:inline">{s.tag}</EditableText>
            </button>
          ))}
        </div>

        {/* Slide card */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: '#ffffff', border: `2px solid ${slide.from}30`, boxShadow: `0 25px 60px ${slide.from}20` }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30"
              style={{ background: slide.accent }}/>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-15"
              style={{ background: slide.to }}/>
          </div>

          <div className="relative grid md:grid-cols-2 gap-0 min-h-[420px]">

            {/* LEFT: Content */}
            <div className="flex flex-col justify-center p-8 md:p-12">
              {/* Icon + tag */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg,${slide.from},${slide.to})`, boxShadow: `0 8px 24px ${slide.from}50` }}>
                  <Icon size={26} color="white" strokeWidth={1.8}/>
                </div>
                <EditableText
                  id={`carousel-slide-${slide.id}-tag`}
                  as="span"
                  className="text-xs font-black px-3 py-1.5 rounded-full"
                  style={{ background: `${slide.from}20`, color: slide.from }}
                >
                  {slide.tag}
                </EditableText>
              </div>

              {/* Text */}
              <EditableText
                id={`carousel-slide-${slide.id}-title`}
                as="h3"
                className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4"
              >
                {slide.title}
              </EditableText>
              <EditableText
                id={`carousel-slide-${slide.id}-desc`}
                as="p"
                multiline
                className="text-gray-500 text-base leading-relaxed mb-8"
              >
                {slide.desc}
              </EditableText>

              {/* CTA */}
              <Link to={slide.href}
                className="self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-black text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: `linear-gradient(135deg,${slide.from},${slide.to})`, boxShadow: `0 6px 20px ${slide.from}40` }}>
                <EditableText id={`carousel-slide-${slide.id}-cta`} as="span">{slide.cta}</EditableText>
                <ArrowRight size={16}/>
              </Link>
            </div>

            {/* RIGHT: Preview */}
            <div className="hidden md:flex items-center p-8 md:p-10">
              <div className="w-full rounded-2xl p-5"
                style={{ background: `linear-gradient(135deg,${slide.from},${slide.to})` }}>
                <SlidePreview slide={slide}/>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button onClick={prev} aria-label="Rrëshqitja e mëparshme"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            style={{ background: 'rgba(0,0,0,0.15)' }}>
            <ChevronLeft size={20}/>
          </button>
          <button onClick={next} aria-label="Rrëshqitja e ardhshme"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            style={{ background: 'rgba(0,0,0,0.15)' }}>
            <ChevronRight size={20}/>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i, i > active ? 'right' : 'left')}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === active ? 28 : 8,
                height: 8,
                background: i === active ? `linear-gradient(135deg,${s.from},${s.to})` : '#e5e7eb',
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4 max-w-sm mx-auto h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            key={active}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right,${slide.from},${slide.to})`,
              animation: paused ? 'none' : 'carouselProgress 5s linear forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes carouselProgress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  )
}
