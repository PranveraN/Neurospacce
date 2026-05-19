import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Sparkles, CheckCircle, Star, Lock } from 'lucide-react'
import { PERSONALITY_TEST, MOOD_TEST, COGNITIVE_TEST } from '../../data/testsData'
import EditableText from '../EditableText'

// ── Small classic test row ──────────────────────────────────────────────────
function TestPreviewCard({ test }) {
  return (
    <Link
      to="/tests"
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 group"
      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.11)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md"
        style={{ background: test.gradient }}>
        {test.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-tight">{test.title}</p>
        <p className="text-white/45 text-xs truncate mt-0.5">{test.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-white/40 flex items-center gap-1">
          <Clock size={10} />{test.duration}
        </span>
        <ArrowRight size={15} className="text-white/25 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  )
}

// ── Archetype preview (right-side marketing card) ───────────────────────────
const SAMPLE_ARCHETYPE = {
  emoji: '✨', name: 'VEGA', nickname: 'The Visionary',
  color: '#a855f7',
  traits: ['Vizionar', 'Analitik', 'Kreativ', 'Drejtues'],
  dims: [
    { label: 'Sociale',    pct: 82, color: '#818cf8' },
    { label: 'Emocionale', pct: 67, color: '#f472b6' },
    { label: 'Analitike',  pct: 91, color: '#34d399' },
    { label: 'Ambicie',    pct: 78, color: '#fb923c' },
  ],
}

function ArchetypePreviewCard() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto">
      {/* Header strip */}
      <div className="px-6 pt-6 pb-5"
        style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed,#a855f7)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
            Rezultati PersonaMatrix
          </span>
          <span className="text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={9} fill="currentColor" strokeWidth={0} /> PRO
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner">
            {SAMPLE_ARCHETYPE.emoji}
          </div>
          <div>
            <p className="text-white/60 text-xs font-semibold mb-0.5">Arketipa jote</p>
            <p className="text-white font-black text-2xl leading-none">{SAMPLE_ARCHETYPE.name}</p>
            <p className="text-white/70 text-sm mt-0.5 font-medium">{SAMPLE_ARCHETYPE.nickname}</p>
          </div>
        </div>
        {/* Trait pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {SAMPLE_ARCHETYPE.traits.map((t) => (
            <span key={t} className="text-xs font-semibold bg-white/15 text-white px-2.5 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Dimension bars */}
      <div className="px-6 py-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">6 Metrika Personaliteti</p>
        <div className="space-y-3">
          {SAMPLE_ARCHETYPE.dims.map((d) => (
            <div key={d.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-600">{d.label}</span>
                <span className="font-bold" style={{ color: d.color }}>{d.pct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="h-2 rounded-full transition-all"
                  style={{ width: `${d.pct}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked premium section */}
      <div className="mx-5 mb-5 rounded-2xl border-2 border-dashed border-gray-200 p-4 flex items-center gap-3 bg-gray-50">
        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
          <Lock size={15} className="text-violet-500" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-700">Raporti Premium — 10 Seksione</p>
          <p className="text-xs text-gray-400 mt-0.5">Stili në punë · Relacionet · Vendimmarrja…</p>
        </div>
        <span className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full whitespace-nowrap">
          Pro
        </span>
      </div>
    </div>
  )
}

// ── Main section ────────────────────────────────────────────────────────────
export default function TestsSection() {
  const classicTests = [PERSONALITY_TEST, MOOD_TEST, COGNITIVE_TEST]

  return (
    <section className="py-20 md:py-28"
      style={{ background: 'linear-gradient(135deg,#0f0c29,#1e1648)' }}>
      <div className="max-w-7xl mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-400/15 text-amber-400 border border-amber-400/25 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={14} />
            <EditableText>Zbulo Veten</EditableText>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            <EditableText>Teste shkencore.</EditableText>{' '}
            <EditableText as="span" className="text-amber-400">Rezultate reale.</EditableText>
          </h2>
          <EditableText as="p" multiline className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Nga Big Five dhe PANAS te PersonaMatrix — 4 teste shkencore që zbulojnë kush je me të vërtetë.
          </EditableText>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT */}
          <div className="flex flex-col gap-4">

            {/* ── PersonaMatrix hero card ── */}
            <Link to="/tests"
              className="relative rounded-3xl overflow-hidden group cursor-pointer block"
              style={{ background: 'linear-gradient(135deg,#1e0a3c,#3b0764,#4c1d95)' }}>

              {/* Glow blobs */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle,#ec4899,transparent)' }} />

              {/* Border shimmer */}
              <div className="absolute inset-0 rounded-3xl border border-violet-500/30 group-hover:border-violet-400/60 transition-colors duration-300 pointer-events-none" />

              <div className="relative p-6 md:p-7">
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner border border-white/10">
                      🔮
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">Testi Kryesor</span>
                        <span className="text-[10px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star size={8} fill="currentColor" strokeWidth={0} /> PRO
                        </span>
                      </div>
                      <p className="text-white font-black text-xl leading-none">PersonaMatrix</p>
                      <p className="text-violet-300/70 text-xs mt-0.5">Assessment i Arketipave</p>
                    </div>
                  </div>
                  <ArrowRight size={18}
                    className="text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                </div>

                <EditableText as="p" multiline className="text-white/65 text-sm leading-relaxed mb-5">
                  60 pyetje shkencore → 1 nga 16 arketipe origjinale → raport premium i personalitetit tënd me 6 metrika, stili në punë, relacionet dhe shumë të tjera.
                </EditableText>

                {/* Archetype emoji row */}
                <div className="flex items-center gap-2 mb-5">
                  {['✨','🔥','🌊','⚡','🌿','💎','🦅','🌙'].map((e, i) => (
                    <div key={i}
                      className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-base hover:scale-110 transition-transform"
                      title="Arketipë">
                      {e}
                    </div>
                  ))}
                  <span className="text-white/30 text-xs font-semibold ml-1">+8</span>
                </div>

                {/* Stat pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: '📋', label: '60 Pyetje' },
                    { icon: '🔮', label: '16 Arketipe' },
                    { icon: '⏱️', label: '15 Min' },
                    { icon: '📊', label: '6 Metrika' },
                  ].map((s) => (
                    <div key={s.label}
                      className="flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">
                      <span className="text-xs">{s.icon}</span>
                      <span className="text-xs font-semibold text-white/80">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>

            {/* ── Classic tests ── */}
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 px-1">
                Teste Klasike — Falas
              </p>
              <div className="space-y-2">
                {classicTests.map((test) => (
                  <TestPreviewCard key={test.id} test={test} />
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link to="/tests"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-xl"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)' }}>
              <EditableText>Fillo tani — pa llogari</EditableText>
              <ArrowRight size={18} />
            </Link>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {['Pa nevojë për llogari', 'Rezultate të menjëhershme', 'Historia ruhet automatikisht'].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-white/45 text-xs">
                  <CheckCircle size={11} className="text-green-400 shrink-0" />
                  <EditableText>{item}</EditableText>
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Archetype result preview */}
          <div className="lg:sticky lg:top-24">
            <ArchetypePreviewCard />
            <p className="text-center text-white/30 text-xs mt-4">
              Shembull rezultati real — PersonaMatrix Pro
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
