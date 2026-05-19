import { useState } from 'react'
import { Play, X, Zap, Clock, Lightbulb, ChevronRight, AlertTriangle, Phone } from 'lucide-react'
import BackButton from '../components/BackButton'
import { useMood }    from '../contexts/MoodContext'
import { useAuth }    from '../contexts/AuthContext'
import { ActivityLog } from '../lib/activityLog'
import { TECHNIQUES } from '../data/mockData'

const CATEGORIES = [
  { key: 'all',          label: 'Të gjitha'   },
  { key: 'anxiety',      label: 'Ankth'       },
  { key: 'stress',       label: 'Stres'       },
  { key: 'overthinking', label: 'Overthinking' },
  { key: 'confidence',   label: 'Vetëbesim'   },
]

const QUICK_HELP = [
  { label: 'Jam në ankth',    cat: 'anxiety',      color: '#f87171' },
  { label: 'Jam nën stres',   cat: 'stress',       color: '#fb923c' },
  { label: 'Mendoj shumë',    cat: 'overthinking', color: '#818cf8' },
  { label: 'Ndihem keq',      cat: 'anxiety',      color: '#60a5fa' },
  { label: 'Dua vetëbesim',   cat: 'confidence',   color: '#fbbf24' },
]

function TechniqueModal({ tech, onClose, theme, onComplete }) {
  const [step, setStep]       = useState(0)
  const [started, setStarted] = useState(false)
  const done                  = step >= tech.steps.length

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl p-6 animate-slide-up"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5 md:hidden" />

        <div className="flex items-start justify-between mb-4">
          <div>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-2xl"
              style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)` }}
            >
              {tech.emoji}
            </div>
            <h2 className="text-xl font-black text-gray-800">{tech.title}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock size={11} className="text-gray-400" />
              <span className="text-xs text-gray-400 font-semibold">{tech.duration}</span>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
            <X size={15} />
          </button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">{tech.description}</p>

        {!started ? (
          <button onClick={() => setStarted(true)}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-md"
            style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
            <Play size={16} fill="white" />
            Fillo ushtrimet
          </button>
        ) : done ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Play size={24} className="text-green-500 rotate-90" />
            </div>
            <h3 className="font-black text-xl text-gray-800 mb-1">Ushtrim i kryer!</h3>
            <p className="text-gray-500 text-sm mb-4">Si ndihesh tani?</p>
            <div className="flex gap-2 justify-center mb-4">
              {['Më mirë', 'Njëlloj', 'Shumë mirë'].map(r => (
                <button key={r} onClick={onClose}
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200">
                  {r}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(step / tech.steps.length) * 100}%`,
                  background: `linear-gradient(90deg, ${theme.start}, ${theme.end})` }} />
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 mb-4 text-center">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
                Hapi {step + 1} / {tech.steps.length}
              </p>
              <p className="text-lg font-bold text-gray-800">{tech.steps[step]}</p>
            </div>
            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm">
                  ← Mbrapa
                </button>
              )}
              <button
                onClick={() => { if (step === tech.steps.length - 1) onComplete?.(); setStep(s => s + 1) }}
                className="flex-1 py-3 rounded-2xl text-white font-bold text-sm shadow-sm"
                style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
                {step === tech.steps.length - 1 ? 'Përfundo ✓' : 'Hapi tjetër →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TechCard({ tech, onOpen, theme }) {
  return (
    <div
      className="glass rounded-3xl p-4 shadow-card flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all active:scale-[0.98]"
      onClick={() => onOpen(tech)}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)` }}
      >
        {tech.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-sm">{tech.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{tech.description}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Clock size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-400 font-semibold">{tech.duration}</span>
          <span className="text-[10px] text-gray-300 mx-1">·</span>
          <span className="text-[10px] font-bold" style={{ color: theme.start }}>
            {tech.steps.length} hapa
          </span>
        </div>
      </div>
      <ChevronRight size={15} className="text-gray-300 shrink-0" />
    </div>
  )
}

export default function TechniquesHub() {
  const { theme }             = useMood()
  const { user }              = useAuth()
  const [cat, setCat]         = useState('all')
  const [modal, setModal]     = useState(null)
  const [quickOpen, setQuickOpen] = useState(false)

  const filtered = cat === 'all' ? TECHNIQUES : TECHNIQUES.filter(t => t.category === cat)

  return (
    <div className="animate-fade-in">
      <BackButton fallback="/home" />
      {modal && <TechniqueModal tech={modal} onClose={() => setModal(null)} theme={theme} onComplete={() => ActivityLog.technique(user?.id, modal.title)} />}

      {/* Header */}
      <div
        className="px-5 pt-14 md:pt-6 pb-6 text-white md:rounded-3xl mb-4"
        style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb size={20} />
          <div>
            <h1 className="text-xl font-black">Teknikat</h1>
            <p className="text-white/70 text-xs">Mjete praktike për çdo moment</p>
          </div>
        </div>

        <button
          onClick={() => setQuickOpen(!quickOpen)}
          className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2"
        >
          <Zap size={15} fill="white" strokeWidth={0} />
          1-Tap Help: Ndihmë e menjëhershme
        </button>
      </div>

      {/* Quick help */}
      {quickOpen && (
        <div className="px-4 md:px-0 mb-4 animate-slide-up">
          <div className="glass rounded-3xl p-4 shadow-card border" style={{ borderColor: theme.start + '33' }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
              Si ndihem tani...
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_HELP.map(({ label, cat: c, color }) => (
                <button
                  key={label}
                  onClick={() => { setCat(c); setQuickOpen(false) }}
                  className="text-sm font-bold px-4 py-2.5 rounded-2xl border-2 transition-all hover:scale-105"
                  style={{ borderColor: color + '44', color, background: color + '12' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 md:px-0 space-y-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto widget-scroll pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`shrink-0 text-xs font-bold px-4 py-2 rounded-2xl transition-all ${
                cat === c.key ? 'text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
              }`}
              style={cat === c.key ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` } : {}}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(t => (
            <TechCard key={t.id} tech={t} onOpen={setModal} theme={theme} />
          ))}
        </div>

        {/* Emergency */}
        <div className="bg-red-50 border border-red-100 rounded-3xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-700 text-sm mb-1">Krizë emocionale?</h3>
              <p className="text-xs text-red-400 mb-3">Nëse ndihesh shumë keq, mos je vetëm.</p>
              <a href="tel:112" className="inline-flex items-center gap-2 bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-red-600 transition-colors">
                <Phone size={12} />
                Emergjenca: 112
              </a>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
