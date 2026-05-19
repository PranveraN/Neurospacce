import { useState } from 'react'
import { Mail, Lock, TrendingUp, Calendar, Zap, ChevronRight } from 'lucide-react'

const BENEFITS = [
  { icon: <TrendingUp size={15} />, text: 'Gjurmo evolucionin e personalitetit me kalimin e kohës' },
  { icon: <Calendar size={15} />,   text: 'Raporti psikologjik javore (AI-powered)' },
  { icon: <Zap size={15} />,        text: 'Sfida ditore të personalizuara sipas arketipës' },
  { icon: <Mail size={15} />,        text: 'Insights ekskluzive mbi sjelljen tënde' },
]

export default function EmailGate({ archetypeNickname, archetypeEmoji, onSubmit, onSkip }) {
  const [email, setEmail]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function validate(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate(email)) { setError('Fut një email të vlefshëm'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600)) // feel real
    setLoading(false)
    onSubmit(email)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-full max-w-md bg-gray-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Top gradient band */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#8b5cf6,#ec4899,#f59e0b)' }} />

        <div className="p-7">
          {/* Archetype teaser */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
              {archetypeEmoji}
            </div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">Arketipa jote u zbulua</p>
            <h2 className="text-white text-2xl font-bold">{archetypeNickname}</h2>
            <p className="text-white/50 text-sm mt-1">Ruaj profilin tënd dhe gjurmo evolucionin</p>
          </div>

          {/* Blur preview strip */}
          <div className="relative rounded-2xl overflow-hidden mb-6 border border-white/10"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="p-4 filter blur-sm select-none pointer-events-none">
              <div className="h-3 bg-white/20 rounded-full w-3/4 mb-2" />
              <div className="h-3 bg-white/15 rounded-full w-1/2 mb-2" />
              <div className="h-3 bg-white/10 rounded-full w-2/3" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                <Lock size={14} className="text-violet-400" />
                <span className="text-sm font-semibold text-white">Raporti i plotë i mbyllur</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2.5 mb-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-violet-400"
                  style={{ background: 'rgba(139,92,246,0.15)' }}>
                  {b.icon}
                </div>
                <span className="text-sm text-white/70">{b.text}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="emaili@yt.com"
                className="w-full bg-white/8 border border-white/15 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500 focus:bg-white/10 transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Duke analizuar...
                </span>
              ) : (
                <><span>Zbulo Profilin e Plotë</span><ChevronRight size={16} /></>
              )}
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="w-full py-2 text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              Vazhdo pa email (rezultate të kufizuara)
            </button>
          </form>

          <p className="text-center text-xs text-white/20 mt-4">
            Pa spam. Mund të çregjistrohet çdo kohë.
          </p>
        </div>
      </div>
    </div>
  )
}
