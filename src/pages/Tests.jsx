import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import EditableText from '../components/EditableText'
import PublicLayout from '../components/layout/PublicLayout'
import {
  Brain,
  Zap,
  Heart,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  RotateCcw,
  History,
  ChevronRight,
  Star,
  X,
  Lock,
  Sparkles,
  TrendingUp,
  Users,
  Flame,
  Target,
  Lightbulb,
  Shield,
} from 'lucide-react'
import {
  PERSONALITY_TEST,
  MOOD_TEST,
  COGNITIVE_TEST,
  scorePersonality,
  scoreMood,
  scoreCognitive,
  saveTestResult,
  getTestHistory,
} from '../data/testsData'
import { IQ_TEST, scoreIQ } from '../data/iqTestData'
import {
  PERSONA_MATRIX_TEST,
  PM_CATEGORIES,
  PM_QUESTIONS,
  scorePersonaMatrix,
} from '../data/personaMatrixData'
import EmailGate from '../components/personaMatrix/EmailGate'
import { useEvolution } from '../hooks/useEvolution'
import { usePlan }   from '../hooks/usePlan'
import { PaywallOverlay } from '../components/paywall/UpgradePrompt'

// Map testId → required feature key
const TEST_FEATURE = {
  personality:   'testPersonality',
  mood:          'testMood',
  cognitive:     'testCognitive',
  iq:            'testIQ',
  personaMatrix: 'testPersonaMatrix',
}
const TEST_REASON = {
  personality:   null,
  mood:          'testMood',
  cognitive:     'testCognitive',
  iq:            null,
  personaMatrix: 'testPersonaMatrix',
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const TRAIT_LABELS = {
  O: 'Hapur ndaj Eksperiencave',
  C: 'Koshiencues/e',
  E: 'Ekstravert/e',
  A: 'Dashamirës/e',
  N: 'Emocional/e',
}

const TRAIT_COLORS = {
  O: '#7c3aed',
  C: '#0891b2',
  E: '#059669',
  A: '#d97706',
  N: '#dc2626',
}

const TEST_ICONS = {
  personality: <Brain size={28} />,
  mood: <Heart size={28} />,
  cognitive: <Zap size={28} />,
}

const TEST_DESCRIPTIONS = {
  personality: 'Zbulo tiparet e personalitetit tënd bazuar në modelin shkencor Big Five.',
  mood: 'Maso gjendjen tënde emocionale aktuale me shkallën PANAS të validuar shkencërisht.',
  cognitive: 'Testo aftësitë e logjikës, njohjes së modeleve dhe arsyetimit tënd.',
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Progress Bar ──────────────────────────────────────────────────────────

function ProgressBar({ value, color = '#7c3aed', label }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">{label}</span>
          <span className="text-xs font-bold" style={{ color }}>{value}%</span>
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── HUB VIEW ─────────────────────────────────────────────────────────────

function HubView({ onStart }) {
  const navigate = useNavigate()
  const { canUse } = usePlan()
  const [paywallReason, setPaywallReason] = useState(null)
  const history = getTestHistory().slice(0, 3)
  const classicTests = [PERSONALITY_TEST, MOOD_TEST, COGNITIVE_TEST]

  function handleStart(testId) {
    const feature = TEST_FEATURE[testId]
    if (!canUse(feature)) {
      setPaywallReason(TEST_REASON[testId])
      return
    }
    onStart(testId)
  }

  const pmLocked = !canUse('testPersonaMatrix')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40">
      {/* Top navigation */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <button
          onClick={() => (window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/home', { replace: true })}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Kthehu
        </button>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-4 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Brain size={15} />
          <EditableText>Teste Shkencore</EditableText>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          <EditableText>Teset e NeuroSphera</EditableText>
        </h1>
        <EditableText as="p" multiline className="text-lg text-gray-500 max-w-xl mx-auto">
          Zbulo veten nëpërmjet shkencës: rezultate reale, pa gjykim.
        </EditableText>
      </div>

      {paywallReason && (
        <PaywallOverlay reason={paywallReason} onClose={() => setPaywallReason(null)} />
      )}

      {/* ── PersonaMatrix Featured Card ── */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div
          className="relative rounded-3xl overflow-hidden cursor-pointer group"
          style={{ boxShadow: '0 8px 60px rgba(124,58,237,0.35), 0 2px 12px rgba(0,0,0,0.25)' }}
          onClick={() => handleStart('personaMatrix')}
        >
          {/* ── Deep cosmic background ── */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#080118 0%,#120530 35%,#1a0640 60%,#0d0225 100%)' }}/>

          {/* Aurora blobs */}
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full blur-[80px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.55),transparent 70%)' }}/>
          <div className="absolute -bottom-12 left-1/4 w-64 h-64 rounded-full blur-[70px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(236,72,153,0.40),transparent 70%)' }}/>
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-72 h-72 rounded-full blur-[90px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)' }}/>

          {/* Dot constellation grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle,rgba(167,139,250,0.12) 1px,transparent 1px)', backgroundSize: '28px 28px' }}/>

          {/* Shimmer border */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: '1px solid rgba(167,139,250,0.20)' }}/>
          <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ border: '1px solid rgba(167,139,250,0.50)', boxShadow: 'inset 0 0 40px rgba(124,58,237,0.08)' }}/>

          {/* ── Content ── */}
          <div className="relative flex flex-col lg:flex-row gap-0 min-h-[280px]">

            {/* LEFT — main content */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">

              {/* Top: badge + title */}
              <div>
                {/* Badge row */}
                <div className="flex items-center gap-3 mb-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 relative"
                    style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(236,72,153,0.3))', border: '1px solid rgba(167,139,250,0.30)' }}>
                    🔮
                    <div className="absolute inset-0 rounded-2xl"
                      style={{ boxShadow: '0 0 20px rgba(124,58,237,0.4)', border: '1px solid rgba(167,139,250,0.20)' }}/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-violet-300 uppercase tracking-[0.15em]">Testi Kryesor</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                        <Star size={8} fill="currentColor" strokeWidth={0}/> PRO
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black leading-none tracking-tight"
                      style={{ background: 'linear-gradient(135deg,#fff 40%,#c4b5fd 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      PersonaMatrix
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <EditableText as="p" multiline className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
                  Zbulo arketipën tënde origjinale nëpërmjet 60 pyetjeve shkencore. 16 profile unike, 6 metrika të avancuara dhe raporti i plotë premium i personalitetit tënd.
                </EditableText>
              </div>

              {/* Bottom: stats + CTA */}
              <div>
                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-2 mb-6 max-w-sm">
                  {[
                    { n: '60',  sub: 'Pyetje',   color: '#a78bfa' },
                    { n: '16',  sub: 'Arketipe',  color: '#f472b6' },
                    { n: '15',  sub: 'Minuta',    color: '#34d399' },
                    { n: '6',   sub: 'Metrika',   color: '#60a5fa' },
                  ].map(s => (
                    <div key={s.sub}
                      className="rounded-2xl px-3 py-3 text-center"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xl font-black" style={{ color: s.color }}>{s.n}</p>
                      <p className="text-[9px] font-bold text-white/35 uppercase tracking-wide mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={e => { e.stopPropagation(); handleStart('personaMatrix') }}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-black text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 6px 24px rgba(124,58,237,0.50)' }}>
                    {pmLocked
                      ? <><Lock size={15}/><EditableText>Zhblloko Pro</EditableText></>
                      : <><Sparkles size={15}/><EditableText>Fillo Testin</EditableText></>
                    }
                  </button>
                  <div>
                    <p className="text-[10px] text-white/35 font-semibold uppercase tracking-wider">Disponueshëm</p>
                    <p className="text-[11px] text-amber-400 font-black">Plan Pro ✦</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — archetype preview panel */}
            <div className="hidden lg:flex w-72 shrink-0 flex-col items-center justify-center p-8 relative"
              style={{ borderLeft: '1px solid rgba(167,139,250,0.12)' }}>

              {/* Panel bg */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg,rgba(124,58,237,0.08) 0%,rgba(236,72,153,0.06) 100%)' }}/>

              <div className="relative w-full">
                {/* Label */}
                <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.18em] text-center mb-4">16 Arketipe</p>

                {/* Archetype emoji ring — 2 rows x 4 */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    {e:'✨',n:'VEGA'},  {e:'🔥',n:'IGNIS'}, {e:'🌊',n:'ARCA'},  {e:'⚡',n:'VOLT'},
                    {e:'🌿',n:'TERRA'}, {e:'💎',n:'LUXE'},  {e:'🦅',n:'APEX'},  {e:'🌙',n:'LUNA'},
                  ].map(a => (
                    <div key={a.n}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-transform hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span className="text-base leading-none">{a.e}</span>
                      <span className="text-[7px] font-black text-white/30 tracking-wider">{a.n}</span>
                    </div>
                  ))}
                </div>

                {/* +8 more */}
                <p className="text-center text-[10px] text-white/25 font-bold mb-5">+8 arketipe të tjera</p>

                {/* Sample result preview mini-card */}
                <div className="rounded-2xl p-4 text-center"
                  style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(236,72,153,0.15))', border: '1px solid rgba(167,139,250,0.25)' }}>
                  <p className="text-[9px] font-black text-violet-300 uppercase tracking-widest mb-1">Shembull rezultati</p>
                  <p className="text-2xl mb-1">✨</p>
                  <p className="text-base font-black text-white">VEGA</p>
                  <p className="text-[10px] text-white/50 font-semibold">Visionari</p>
                  {/* Mini bars */}
                  <div className="mt-3 space-y-1.5">
                    {[{l:'Analitike',p:91,c:'#34d399'},{l:'Kreative',p:84,c:'#a78bfa'},{l:'Sociale',p:72,c:'#60a5fa'}].map(b => (
                      <div key={b.l}>
                        <div className="flex justify-between text-[8px] mb-0.5">
                          <span className="text-white/40 font-semibold">{b.l}</span>
                          <span className="font-black" style={{color:b.c}}>{b.p}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full" style={{width:`${b.p}%`,background:b.c}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── IQ Test Featured Card ── */}
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div
          className="relative rounded-3xl overflow-hidden cursor-pointer group"
          onClick={() => handleStart('iq')}
          style={{ boxShadow: '0 8px 40px rgba(79,70,229,0.25), 0 2px 8px rgba(0,0,0,0.15)' }}
        >
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 45%,#1e1b4b 100%)' }} />
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full blur-[60px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.55),transparent 70%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle,rgba(165,180,252,0.1) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: '1px solid rgba(165,180,252,0.18)' }} />
          <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ border: '1px solid rgba(165,180,252,0.45)' }} />

          <div className="relative flex flex-col md:flex-row gap-0 p-7 md:p-8 items-start">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(165,180,252,0.3)' }}>
                  🧠
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.15em]">Testi Kognitiv</p>
                  <h2 className="text-2xl font-black text-white leading-tight">IQ Test — NeuroSphera</h2>
                </div>
              </div>
              <EditableText as="p" multiline className="text-white/60 text-sm leading-relaxed mb-5 max-w-md">
                20 pyetje · 5 domaine kognitive · Llogarit kuofientin tënd intelektual me metodologji shkencore.
              </EditableText>
              <div className="flex gap-3 mb-5 flex-wrap">
                {[
                  { n: '20', sub: 'Pyetje' },
                  { n: '8',  sub: 'Minuta' },
                  { n: '5',  sub: 'Domaine' },
                  { n: 'IQ', sub: 'Rezultat' },
                ].map(s => (
                  <div key={s.sub} className="rounded-xl px-3 py-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-base font-black text-indigo-300">{s.n}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-wide">{s.sub}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleStart('iq') }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 4px 20px rgba(79,70,229,0.4)' }}
              >
                <Brain size={15} /> Fillo Testin IQ
              </button>
            </div>

            {/* Right — domain list (desktop only) */}
            <div className="hidden md:flex flex-col justify-center w-44 shrink-0 gap-2 mt-1">
              {[
                { e: '🔷', l: 'Njohja e Modeleve' },
                { e: '🔢', l: 'Arsyetimi Numerik' },
                { e: '⚡', l: 'Deduktimi Logjik' },
                { e: '🌀', l: 'Hapësinor/Abstrakt' },
                { e: '🧩', l: 'Kujtesa Operative' },
              ].map(d => (
                <div key={d.l} className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-sm">{d.e}</span>
                  <span className="text-xs font-semibold text-white/50">{d.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Karriera IQ Featured Card ── */}
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div
          className="relative rounded-3xl overflow-hidden cursor-pointer group"
          onClick={() => navigate('/career')}
          style={{ boxShadow: '0 8px 40px rgba(5,150,105,0.22), 0 2px 8px rgba(0,0,0,0.12)' }}
        >
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg,#022c22 0%,#064e3b 45%,#065f46 100%)' }} />
          <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full blur-[70px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.45),transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.30),transparent 70%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle,rgba(110,231,183,0.09) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: '1px solid rgba(110,231,183,0.18)' }} />
          <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ border: '1px solid rgba(110,231,183,0.45)' }} />

          <div className="relative flex flex-col md:flex-row gap-0 p-7 md:p-8 items-start">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: 'rgba(5,150,105,0.35)', border: '1px solid rgba(110,231,183,0.30)' }}>
                  💼
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.15em]">Inteligjenca e Karrierës</p>
                  <h2 className="text-2xl font-black text-white leading-tight">Karriera IQ</h2>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-md">
                60 pyetje · 15 dimensione kognitive · 12 arketipe karriere · Zbulon stilin tënd të punës, vendimmarrjes dhe udhëheqjes.
              </p>
              <div className="flex gap-3 mb-5 flex-wrap">
                {[
                  { n: '60',  sub: 'Pyetje' },
                  { n: '30',  sub: 'Minuta' },
                  { n: '15',  sub: 'Dimensione' },
                  { n: '12',  sub: 'Arketipe' },
                ].map(s => (
                  <div key={s.sub} className="rounded-xl px-3 py-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-base font-black text-emerald-300">{s.n}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-wide">{s.sub}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={e => { e.stopPropagation(); navigate('/career') }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 4px 20px rgba(5,150,105,0.4)' }}
              >
                <TrendingUp size={15} /> Fillo Karriera IQ
              </button>
            </div>

            {/* Right — module list (desktop only) */}
            <div className="hidden md:flex flex-col justify-center w-48 shrink-0 gap-2 mt-1">
              {[
                { e: '🧠', l: 'Modelet Kognitive' },
                { e: '♟',  l: 'Inteligjenca Strategjike' },
                { e: '⚡', l: 'Stili i Punës' },
                { e: '🎯', l: 'Udhëheqja' },
                { e: '💡', l: 'Inovacioni' },
              ].map(d => (
                <div key={d.l} className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-sm">{d.e}</span>
                  <span className="text-xs font-semibold text-white/50">{d.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Classic Tests Grid ── */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-5">
          <Brain size={16} className="text-gray-400" />
          <EditableText as="h2" className="text-sm font-bold text-gray-500 uppercase tracking-wider">Teste Klasike</EditableText>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {classicTests.map((test) => {
            const feature = TEST_FEATURE[test.id]
            const locked = !canUse(feature)
            return (
            <div
              key={test.id}
              className={`rounded-3xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col ${locked ? 'border-violet-200' : 'border-gray-200'}`}
              style={{ background: test.softBg }}
            >
              <div className="h-1.5 w-full" style={{ background: test.gradient }} />
              <div className="p-6 flex flex-col flex-1">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm"
                  style={{ background: test.gradient }}
                >
                  {test.emoji}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ background: test.color }}
                  >
                    <Clock size={11} />
                    <EditableText>{test.duration}</EditableText>
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-white/70 px-2.5 py-1 rounded-full border border-gray-200">
                    <EditableText>{String(test.questionCount)}</EditableText> <EditableText>pyetje</EditableText>
                  </span>
                </div>
                <EditableText as="h2" className="text-xl font-bold text-gray-900 mb-1">{test.title}</EditableText>
                <EditableText as="p" className="text-xs font-medium text-gray-400 mb-3">{test.subtitle}</EditableText>
                <EditableText as="p" multiline className="text-sm text-gray-600 leading-relaxed flex-1">
                  {TEST_DESCRIPTIONS[test.id]}
                </EditableText>
                <button
                  onClick={() => handleStart(test.id)}
                  className="mt-5 w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-200 shadow-md"
                  style={{ background: locked ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : test.gradient }}
                >
                  {locked ? <><Lock size={14} /> <EditableText>Pro: Zhblloko</EditableText></> : <><ArrowRight size={16} /> <EditableText>Fillo Testin</EditableText></>}
                </button>
              </div>
            </div>
            )
          })}
        </div>
      </div>

      {/* History Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-2 mb-5">
          <History size={18} className="text-gray-400" />
          <EditableText as="h2" className="text-lg font-bold text-gray-800">Historiku im</EditableText>
        </div>

        {history.length === 0 ? (
          <div className="bg-white/70 border border-gray-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">📭</div>
            <EditableText as="p" className="font-semibold text-gray-700 mb-1">Nuk ke bërë ende asnjë test</EditableText>
            <EditableText as="p" multiline className="text-sm text-gray-400">Rezultatet do të shfaqen këtu pasi të plotësosh testin e parë.</EditableText>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {history.map((r, i) => {
              const testMeta =
                r.testId === 'personality' ? PERSONALITY_TEST
                : r.testId === 'mood'      ? MOOD_TEST
                : r.testId === 'cognitive' ? COGNITIVE_TEST
                : r.testId === 'iq'        ? IQ_TEST
                : PERSONA_MATRIX_TEST
              return (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: testMeta.softBg }}
                  >
                    {r.profile?.emoji || testMeta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {r.profile?.name || testMeta.title}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(r.completedAt)}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 shrink-0" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PERSONALITY RUNNER ────────────────────────────────────────────────────

function PersonalityRunner({ onResult, onBack }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const questions = PERSONALITY_TEST.questions
  const q = questions[currentQ]
  const selected = answers[q.id]
  const isLast = currentQ === questions.length - 1
  const progress = ((currentQ) / questions.length) * 100

  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  function handleSelect(score) {
    setAnswers((prev) => ({ ...prev, [q.id]: score }))
  }

  function handleNext() {
    if (isLast) {
      onResult(scorePersonality({ ...answers, [q.id]: selected }))
    } else {
      setCurrentQ((c) => c + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/30 flex flex-col">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors">
            <X size={16} />
            Dil
          </button>
          <span className="text-sm font-semibold text-gray-500">
            Pyetja {currentQ + 1} nga {questions.length}
          </span>
          <div className="w-6" />
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-6">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: PERSONALITY_TEST.gradient }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-2xl mx-auto w-full px-4 flex-1 flex flex-col">
        {/* Trait badge */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white"
            style={{ background: PERSONALITY_TEST.color }}
          >
            {PERSONALITY_TEST.emoji} {TRAIT_LABELS[q.trait]}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
          <EditableText id={`pt_q_${q.id}`} as="span" multiline>{q.text}</EditableText>
        </h2>

        {/* Options */}
        <div className="space-y-3 flex-1">
          {q.options.map((opt, idx) => {
            const isSelected = selected === opt.score
            return (
              <button
                key={opt.score}
                onClick={() => handleSelect(opt.score)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 group ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-violet-100 group-hover:text-violet-700'
                  }`}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <EditableText id={`pt_opt_${q.id}_${idx}`} as="span"
                  className={`font-medium text-sm ${isSelected ? 'text-violet-900' : 'text-gray-700'}`}
                >
                  {opt.label}
                </EditableText>
                {isSelected && (
                  <CheckCircle size={18} className="ml-auto text-violet-600 shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8 pb-8">
          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ((c) => c - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft size={16} />
              Prapa
            </button>
          )}
          <button
            disabled={selected === undefined}
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-md"
            style={{ background: PERSONALITY_TEST.gradient }}
          >
            {isLast ? 'Shiko Rezultatin' : 'Tjetër'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MOOD RUNNER ──────────────────────────────────────────────────────────

function MoodRunner({ onResult, onBack }) {
  const [ratings, setRatings] = useState({})
  const allRated = MOOD_TEST.items.every((i) => ratings[i.id] !== undefined)

  function handleRate(itemId, val) {
    setRatings((prev) => ({ ...prev, [itemId]: val }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-orange-50/20 to-yellow-50/30 flex flex-col">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors">
            <X size={16} />
            Dil
          </button>
          <div className="text-center">
            <span className="text-2xl">{MOOD_TEST.emoji}</span>
          </div>
          <div className="w-6" />
        </div>

        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ background: MOOD_TEST.color }}>
            {MOOD_TEST.emoji} {MOOD_TEST.title}
          </span>
        </div>
        <EditableText as="h2" className="text-2xl font-bold text-gray-900 mb-2">Si ndihesh tani?</EditableText>
        <EditableText as="p" className="text-sm text-gray-500 mb-6">Vlerëso çdo emocion sipas intensitetit aktual.</EditableText>

        {/* Scale labels */}
        <div className="flex justify-between mb-4 px-1">
          {MOOD_TEST.scaleLabels.map((l, i) => (
            <span key={i} className="text-xs text-gray-400 font-medium">{l}</span>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="max-w-2xl mx-auto w-full px-4 flex-1">
        <div className="space-y-3">
          {MOOD_TEST.items.map((item) => {
            const selected = ratings[item.id]
            const isPositive = item.type === 'positive'
            const activeColor = isPositive ? '#f59e0b' : '#ef4444'

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3"
              >
                {/* Left: emoji + label */}
                <div className="flex items-center gap-2 w-36 shrink-0">
                  <span className="text-xl">{item.emoji}</span>
                  <EditableText as="span" className="text-sm font-semibold text-gray-700">{item.label}</EditableText>
                </div>

                {/* Rating buttons */}
                <div className="flex gap-2 flex-1 justify-end">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isActive = selected === val
                    return (
                      <button
                        key={val}
                        onClick={() => handleRate(item.id, val)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                          isActive
                            ? 'text-white border-transparent scale-110 shadow-md'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                        style={isActive ? { background: activeColor, borderColor: activeColor } : {}}
                      >
                        {val}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 pb-8">
          <button
            disabled={!allRated}
            onClick={() => onResult(scoreMood(ratings))}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-md"
            style={{ background: MOOD_TEST.gradient }}
          >
            Shiko Rezultatin
            <ArrowRight size={16} />
          </button>
          {!allRated && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Vlerëso të gjitha {MOOD_TEST.items.length} emocionet për të vazhduar
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── COGNITIVE RUNNER ─────────────────────────────────────────────────────

function CognitiveRunner({ onResult, onBack }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [startTime] = useState(() => Date.now())

  const questions = COGNITIVE_TEST.questions
  const q = questions[currentQ]
  const selected = answers[q.id]
  const isCorrect = selected === q.correct
  const isLast = currentQ === questions.length - 1
  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function handleSelect(opt) {
    if (revealed) return
    setAnswers((prev) => ({ ...prev, [q.id]: opt }))
    setRevealed(true)
  }

  function handleNext() {
    setRevealed(false)
    if (isLast) {
      onResult(scoreCognitive(answers))
    } else {
      setCurrentQ((c) => c + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/40 via-sky-50/20 to-blue-50/30 flex flex-col">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors">
            <X size={16} />
            Dil
          </button>
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm">
            <Clock size={14} className="text-cyan-600" />
            {formatTime(elapsed)}
          </div>
          <span className="text-sm font-semibold text-gray-500">
            Sfida {currentQ + 1} nga {questions.length}
          </span>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-6">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(currentQ / questions.length) * 100}%`,
              background: COGNITIVE_TEST.gradient,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto w-full px-4 flex-1 flex flex-col">
        {/* Type badge */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white capitalize"
            style={{ background: COGNITIVE_TEST.color }}
          >
            {COGNITIVE_TEST.emoji}{' '}
            {q.type === 'sequence' ? 'Varg Numrash' : q.type === 'analogy' ? 'Analogji' : 'Logjikë'}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
          <EditableText id={`cog_q_${q.id}`} as="span" multiline>{q.text}</EditableText>
        </h2>

        {/* Sequence display */}
        {q.display && (
          <div className="bg-white border-2 border-cyan-200 rounded-2xl p-4 mb-5 text-center">
            <span className="font-mono text-2xl font-bold text-gray-800 tracking-widest">
              {q.display}
            </span>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = selected === opt
            const isRight = opt === q.correct
            let borderClass = 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/50'
            let labelClass = 'bg-gray-100 text-gray-500'

            if (revealed) {
              if (isRight) {
                borderClass = 'border-green-400 bg-green-50'
                labelClass = 'bg-green-500 text-white'
              } else if (isSelected && !isRight) {
                borderClass = 'border-red-400 bg-red-50'
                labelClass = 'bg-red-500 text-white'
              } else {
                borderClass = 'border-gray-100 bg-gray-50 opacity-50'
              }
            } else if (isSelected) {
              borderClass = 'border-cyan-500 bg-cyan-50 shadow-md'
              labelClass = 'bg-cyan-600 text-white'
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={revealed}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${borderClass}`}
              >
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${labelClass}`}>
                  {OPTION_LABELS[idx]}
                </span>
                <EditableText id={`cog_opt_${q.id}_${idx}`} as="span" className="font-medium text-sm text-gray-700">{opt}</EditableText>
                {revealed && isRight && <CheckCircle size={18} className="ml-auto text-green-500 shrink-0" />}
                {revealed && isSelected && !isRight && <X size={18} className="ml-auto text-red-500 shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <div
            className={`mt-4 p-4 rounded-2xl border-2 ${
              isCorrect
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <p className="text-sm font-semibold mb-1">
              {isCorrect ? '✅ Saktë!' : '❌ Gabim, por mëso nga kjo:'}
            </p>
            <p className="text-sm">{q.explanation}</p>
          </div>
        )}

        {/* Next */}
        {revealed && (
          <div className="mt-6 pb-8">
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
              style={{ background: COGNITIVE_TEST.gradient }}
            >
              {isLast ? 'Shiko Rezultatin' : 'Sfida tjetër'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── RESULT VIEW ──────────────────────────────────────────────────────────

function ResultView({ result, onReset, onHub }) {
  const [saved, setSaved] = useState(false)

  const { testId, profile } = result

  const testMeta =
    testId === 'personality'
      ? PERSONALITY_TEST
      : testId === 'mood'
      ? MOOD_TEST
      : COGNITIVE_TEST

  function handleSave() {
    saveTestResult(result)
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/30">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Profile card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-6">
          {/* Top gradient band */}
          <div className="h-2" style={{ background: profile?.color || testMeta.gradient }} />

          <div className="p-8 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg"
              style={{ background: profile?.color ? `${profile.color}20` : testMeta.softBg }}
            >
              {profile?.emoji || testMeta.emoji}
            </div>

            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white mb-3"
              style={{ background: profile?.color || testMeta.color }}
            >
              {testMeta.emoji} {testMeta.title}
            </div>

            <EditableText as="h1" className="text-3xl font-bold text-gray-900 mb-3">{profile?.name}</EditableText>
            <EditableText as="p" multiline className="text-gray-600 leading-relaxed text-sm">{profile?.desc}</EditableText>
          </div>
        </div>

        {/* ── Personality Scores ── */}
        {testId === 'personality' && result.scores && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Brain size={18} className="text-violet-600" />
              <EditableText>I profileit tënd OCEAN</EditableText>
            </h3>
            <div className="space-y-4">
              {Object.entries(result.scores).map(([trait, val]) => (
                <ProgressBar
                  key={trait}
                  value={val}
                  color={TRAIT_COLORS[trait]}
                  label={TRAIT_LABELS[trait]}
                />
              ))}
            </div>

            {/* Strengths */}
            {profile?.strengths && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <EditableText as="p" className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Pikat e tua të forta
                </EditableText>
                <div className="flex flex-wrap gap-2">
                  {profile.strengths.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{ background: profile.color }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tip box */}
            {profile?.tip && (
              <div
                className="mt-5 p-4 rounded-2xl text-sm leading-relaxed"
                style={{ background: `${profile.color}12`, color: profile.color }}
              >
                <EditableText as="p" className="font-semibold mb-1">💡 Këshillë personale</EditableText>
                <EditableText as="p" multiline className="opacity-90">{profile.tip}</EditableText>
              </div>
            )}
          </div>
        )}

        {/* ── Mood Scores ── */}
        {testId === 'mood' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Heart size={18} className="text-amber-500" />
              <EditableText>Ekuilibri emocional</EditableText>
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <EditableText as="span" className="text-xs font-medium text-gray-600">Afekti Pozitiv (PA)</EditableText>
                  <span className="text-xs font-bold text-green-600">{result.pa}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{ width: `${result.pa}%`, background: '#059669' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <EditableText as="span" className="text-xs font-medium text-gray-600">Afekti Negativ (NA)</EditableText>
                  <span className="text-xs font-bold text-red-500">{result.na}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{ width: `${result.na}%`, background: '#dc2626' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Cognitive Score ── */}
        {testId === 'cognitive' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap size={18} className="text-cyan-600" />
              <EditableText>Rezultati</EditableText>
            </h3>
            <div className="text-center py-2">
              <div className="text-5xl font-bold text-gray-900 mb-1">
                {result.correct}
                <span className="text-2xl text-gray-400 font-normal"> / {result.total}</span>
              </div>
              <EditableText as="p" className="text-sm text-gray-500 mb-4">të sakta</EditableText>
              {/* Star display */}
              <div className="flex justify-center gap-1.5">
                {Array.from({ length: result.total }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className="transition-all"
                    fill={i < result.correct ? '#f59e0b' : '#e5e7eb'}
                    color={i < result.correct ? '#f59e0b' : '#e5e7eb'}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            disabled={saved}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-violet-300 text-violet-700 bg-violet-50 hover:bg-violet-100 disabled:opacity-60 transition-all"
          >
            {saved ? (
              <>
                <CheckCircle size={18} className="text-green-600" />
                <EditableText as="span" className="text-green-700">Rezultati u ruajt!</EditableText>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <EditableText>Ruaj Rezultatin</EditableText>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReset}
              className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <RotateCcw size={16} />
              <EditableText>Bëj sërish</EditableText>
            </button>
            <button
              onClick={onHub}
              className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white transition-all hover:opacity-90 shadow-md"
              style={{ background: testMeta.gradient }}
            >
              <EditableText>Teste tjera</EditableText>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── IQ RUNNER ────────────────────────────────────────────────────────────

const IQ_DOMAIN_LABELS = {
  pattern:   'Njohja e Modeleve',
  numerical: 'Arsyetimi Numerik',
  logical:   'Deduktimi Logjik',
  spatial:   'Hapësinor/Abstrakt',
  memory:    'Kujtesa Operative',
}
const IQ_DOMAIN_EMOJIS = {
  pattern: '🔷', numerical: '🔢', logical: '⚡', spatial: '🌀', memory: '🧩',
}

function IQRunner({ onResult, onBack }) {
  const [currentQ,       setCurrentQ]       = useState(0)
  const [answers,        setAnswers]         = useState({})
  const [revealed,       setRevealed]        = useState(false)
  const [startTime]                          = useState(() => Date.now())
  const [elapsed,        setElapsed]         = useState(0)
  const [extraTime,      setExtraTime]       = useState(0)
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false)

  const questions   = IQ_TEST.questions
  const q           = questions[currentQ]
  const selected    = answers[q.id]
  const isCorrect   = selected === q.correct
  const isLast      = currentQ === questions.length - 1
  const TIME_LIMIT  = IQ_TEST.time_limit_sec + extraTime
  const remaining   = Math.max(0, TIME_LIMIT - elapsed)
  const timeUp      = remaining === 0
  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 500)
    return () => clearInterval(id)
  }, [startTime])

  useEffect(() => {
    if (timeUp && !showTimeUpPopup) setShowTimeUpPopup(true)
  }, [timeUp]) // eslint-disable-line

  function addTime(seconds) {
    setExtraTime(prev => prev + seconds)
    setShowTimeUpPopup(false)
  }

  function submitNow() {
    setShowTimeUpPopup(false)
    onResult(scoreIQ(answers, TIME_LIMIT * 1000))
  }

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function handleSelect(opt) {
    if (revealed) return
    setAnswers(prev => ({ ...prev, [q.id]: opt }))
    setRevealed(true)
  }

  function handleNext() {
    setRevealed(false)
    if (isLast) {
      onResult(scoreIQ(answers, Date.now() - startTime))
    } else {
      setCurrentQ(c => c + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg,#eef2ff 0%,#f5f3ff 50%,#ede9fe 100%)' }}>

      {/* ── TIME UP POPUP ── */}
      {showTimeUpPopup && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center px-4"
          style={{ background: 'rgba(10,5,30,0.7)', backdropFilter: 'blur(12px)' }}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            style={{ animation: 'fadeSlideUp .25s ease' }}>
            {/* icon */}
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
              ⏰
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-1">Na vjen keq!</h2>
            <p className="text-gray-500 font-semibold mb-1">Koha juaj mbaroi.</p>
            <p className="text-gray-400 text-sm mb-6">Të duhet më shumë kohë?</p>

            <div className="space-y-3 mb-5">
              {[
                { label: 'Shto edhe 2 min tjera', sec: 120, color: '#6366f1' },
                { label: 'Shto edhe 5 min tjera', sec: 300, color: '#8b5cf6' },
                { label: 'Shto edhe 10 min tjera', sec: 600, color: '#7c3aed' },
              ].map(({ label, sec, color }) => (
                <button key={sec}
                  onClick={() => addTime(sec)}
                  className="w-full py-3 rounded-2xl font-bold text-white text-sm hover:opacity-90 active:scale-95 transition-all"
                  style={{ background: `linear-gradient(135deg,${color},${color}cc)` }}>
                  {label}
                </button>
              ))}
            </div>

            <button onClick={submitNow}
              className="w-full py-2.5 rounded-2xl font-semibold text-gray-400 text-sm hover:text-gray-600 hover:bg-gray-50 transition-colors border border-gray-100">
              Dërgo rezultatet tani
            </button>
          </div>
          <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
      )}

      {/* Header */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors">
            <X size={16} /> Dil
          </button>
          <div className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl border shadow-sm transition-colors ${
            remaining < 120
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-white border-gray-200 text-gray-700'
          }`}>
            <Clock size={14} className={remaining < 120 ? 'text-red-500' : 'text-indigo-500'} />
            {formatTime(remaining)}
          </div>
          <span className="text-sm font-semibold text-gray-500">
            {currentQ + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-6">
          <div className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentQ / questions.length) * 100}%`, background: IQ_TEST.gradient }} />
        </div>
      </div>

      {/* Question area */}
      <div className="max-w-2xl mx-auto w-full px-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white"
            style={{ background: IQ_TEST.gradient }}>
            {IQ_DOMAIN_EMOJIS[q.domain]} {IQ_DOMAIN_LABELS[q.domain]}
          </span>
          <span className="text-xs text-gray-400 font-medium tracking-wide">
            {'★'.repeat(q.difficulty)}{'☆'.repeat(3 - q.difficulty)}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-5 leading-snug">
          <EditableText id={`iq_q_${q.id}`} as="span" multiline>{q.text}</EditableText>
        </h2>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = selected === opt
            const isRight    = opt === q.correct
            let borderClass = 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
            let labelClass  = 'bg-gray-100 text-gray-500'

            if (revealed) {
              if (isRight) {
                borderClass = 'border-green-400 bg-green-50'
                labelClass  = 'bg-green-500 text-white'
              } else if (isSelected && !isRight) {
                borderClass = 'border-red-400 bg-red-50'
                labelClass  = 'bg-red-500 text-white'
              } else {
                borderClass = 'border-gray-100 bg-gray-50 opacity-50'
              }
            } else if (isSelected) {
              borderClass = 'border-indigo-500 bg-indigo-50 shadow-md'
              labelClass  = 'bg-indigo-600 text-white'
            }

            return (
              <button key={opt} onClick={() => handleSelect(opt)} disabled={revealed}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${borderClass}`}>
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${labelClass}`}>
                  {OPTION_LABELS[idx]}
                </span>
                <EditableText id={`iq_opt_${q.id}_${idx}`} as="span" className="font-medium text-sm text-gray-700">{opt}</EditableText>
                {revealed && isRight    && <CheckCircle size={18} className="ml-auto text-green-500 shrink-0" />}
                {revealed && isSelected && !isRight && <X size={18} className="ml-auto text-red-500 shrink-0" />}
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className={`mt-4 p-4 rounded-2xl border-2 ${
            isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="text-sm font-semibold mb-1">
              {isCorrect ? '✅ Saktë!' : '❌ Jo saktë — shpjegimi:'}
            </p>
            <p className="text-sm">{q.explanation}</p>
          </div>
        )}

        {revealed && (
          <div className="mt-6 pb-8">
            <button onClick={handleNext}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
              style={{ background: IQ_TEST.gradient }}>
              {isLast ? 'Shiko Rezultatin IQ' : 'Pyetja tjetër'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── IQ RESULT VIEW ────────────────────────────────────────────────────────

function IQResultView({ result, onReset, onHub }) {
  const [saved, setSaved] = useState(false)
  const [animIQ, setAnimIQ] = useState(result.band.min)

  const { iq, correct, total, accuracy, timeMs, band, answers } = result

  useEffect(() => {
    const steps = 35
    const range = iq - band.min
    let step = 0
    const id = setInterval(() => {
      step++
      setAnimIQ(Math.round(band.min + (range * Math.min(step, steps)) / steps))
      if (step >= steps) clearInterval(id)
    }, 18)
    return () => clearInterval(id)
  }, [iq, band.min])

  const domainStats = ['pattern', 'numerical', 'logical', 'spatial', 'memory'].map(d => {
    const qs = IQ_TEST.questions.filter(q => q.domain === d)
    const dc = qs.filter(q => answers[q.id] === q.correct).length
    return { domain: d, correct: dc, total: qs.length }
  })

  function formatTime(ms) {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  }

  function handleSave() {
    saveTestResult(result)
    setSaved(true)
  }

  const markerPct = Math.min(100, Math.max(0, ((animIQ - 60) / 100) * 100))

  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff,#ede9fe)' }}>
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Hero IQ card */}
        <div className="rounded-3xl overflow-hidden border border-indigo-200 shadow-xl mb-5">
          <div className="h-2" style={{ background: IQ_TEST.gradient }} />
          <div className="p-8 text-center"
            style={{ background: `linear-gradient(135deg,${band.color}12,${band.color}06,#fff)` }}>
            <div className="text-5xl mb-3">🧠</div>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: band.color }}>
              Testi IQ · NeuroSphera
            </div>
            <div className="text-8xl font-black mb-2 tabular-nums" style={{ color: band.color }}>
              {animIQ}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{band.label}</div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">{band.desc}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { val: `${correct}/${total}`, sub: 'Sakta' },
            { val: `${accuracy}%`,        sub: 'Saktësi' },
            { val: formatTime(timeMs),    sub: 'Kohë' },
          ].map(s => (
            <div key={s.sub} className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
              <div className="text-xl font-bold text-gray-900">{s.val}</div>
              <div className="text-xs text-gray-500 font-medium mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* IQ scale bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shkalla IQ</p>
          <div className="relative mb-2">
            <div className="w-full h-4 rounded-full overflow-hidden"
              style={{ background: 'linear-gradient(to right,#d97706,#059669,#2563eb,#7c3aed)' }} />
            <div className="absolute top-0 h-4 w-0.5 bg-white rounded-full shadow-lg transition-all duration-700"
              style={{ left: `calc(${markerPct}% - 1px)` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            {['60', '85', '115', '130', '160'].map(n => <span key={n}>{n}</span>)}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {IQ_TEST.iq_classification.map(b => {
              const active = iq >= b.min && iq <= b.max
              return (
                <div key={b.label}
                  className={`flex items-center gap-2 p-2.5 rounded-xl transition-all ${active ? 'ring-2' : 'opacity-40'}`}
                  style={{
                    background: `${b.color}12`,
                    ...(active ? { outlineColor: b.color, outline: `2px solid ${b.color}` } : {}),
                  }}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                  <span className="text-xs font-semibold" style={{ color: b.color }}>{b.label}</span>
                  <span className="text-xs text-gray-400 ml-auto">{b.min}–{b.max}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Domain breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Performanca sipas Domainit</p>
          <div className="space-y-3">
            {domainStats.map(({ domain, correct: dc, total: dt }) => (
              <div key={domain}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    {IQ_DOMAIN_EMOJIS[domain]} {IQ_DOMAIN_LABELS[domain]}
                  </span>
                  <span className="text-xs font-bold text-gray-500">{dc}/{dt}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(dc / dt) * 100}%`, background: IQ_TEST.gradient }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button onClick={handleSave} disabled={saved}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-60 transition-all">
            {saved
              ? <><CheckCircle size={18} className="text-green-600" /><span className="text-green-700">Rezultati u ruajt!</span></>
              : <><CheckCircle size={18} />Ruaj Rezultatin</>
            }
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onReset}
              className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
              <RotateCcw size={16} /> Bëj sërish
            </button>
            <button onClick={onHub}
              className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white hover:opacity-90 shadow-md transition-all"
              style={{ background: IQ_TEST.gradient }}>
              Teste tjera <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PERSONA MATRIX RUNNER ────────────────────────────────────────────────

const PM_SCALE_LABELS = ['Nuk pajtohem', 'Pak pajtohem', 'Neutral', 'Pajtohem', 'Plotësisht pajtohem']
const PM_SCALE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981']

function PersonaMatrixRunner({ onResult, onBack }) {
  const [catIndex, setCatIndex] = useState(0)       // 0-9 category index
  const [answers, setAnswers] = useState({})         // { questionId: 1-5 }
  const [intro, setIntro] = useState(true)           // show intro screen first

  const currentCat = PM_CATEGORIES[catIndex]
  const catQuestions = PM_QUESTIONS.filter((q) => q.cat === currentCat.id)
  const totalAnswered = Object.keys(answers).length
  const catAnswered = catQuestions.every((q) => answers[q.id] !== undefined)
  const isLastCat = catIndex === PM_CATEGORIES.length - 1
  const progress = (catIndex / PM_CATEGORIES.length) * 100

  function handleRate(qId, val) {
    setAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  function handleNext() {
    if (isLastCat) {
      onResult(scorePersonaMatrix(answers))
    } else {
      setCatIndex((c) => c + 1)
    }
  }

  function handlePrev() {
    if (catIndex === 0) onBack()
    else setCatIndex((c) => c - 1)
  }

  // ── Intro screen ──
  if (intro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-pink-900 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full text-center">
          <div className="text-7xl mb-6">🔮</div>
          <EditableText as="h1" className="text-3xl md:text-4xl font-bold text-white mb-3">PersonaMatrix Assessment</EditableText>
          <EditableText as="p" multiline className="text-white/70 text-base mb-8 leading-relaxed">
            60 pyetje · 10 kategori · 16 arketipe origjinale. Zbulo profilin e vërtetë të personalitetit tënd.
          </EditableText>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {PM_CATEGORIES.map((c) => (
              <div key={c.id} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2.5">
                <span className="text-xl">{c.icon}</span>
                <EditableText as="span" className="text-sm font-medium text-white/90">{c.label}</EditableText>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-xl border-2 border-white/30 text-white/70 font-semibold text-sm hover:bg-white/10 transition-all"
            >
              Kthehu
            </button>
            <button
              onClick={() => setIntro(false)}
              className="px-8 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 active:scale-95 transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles size={16} />
              <EditableText>Fillo Testin</EditableText>
            </button>
          </div>
          <EditableText as="p" className="text-white/40 text-xs mt-4">Rreth 15 minuta · Përgjigju sinqerisht</EditableText>
        </div>
      </div>
    )
  }

  // ── Category question screen ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-fuchsia-50/20 flex flex-col">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrev} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors">
            <ArrowLeft size={16} />
            Prapa
          </button>
          <span className="text-sm font-semibold text-gray-500">
            Kategoria {catIndex + 1} nga {PM_CATEGORIES.length}
          </span>
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Overall progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#8b5cf6,#ec4899)' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-5">
          <span>{totalAnswered} / 60 të plota</span>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* Category header */}
        <div className="flex items-center gap-3 mb-6 bg-white rounded-2xl border border-gray-200 px-4 py-3 shadow-sm">
          <span className="text-3xl">{currentCat.icon}</span>
          <div>
            <EditableText as="p" className="font-bold text-gray-900">{currentCat.label}</EditableText>
            <EditableText as="p" className="text-xs text-gray-400">6 pohime: vlerëso shkallën e dakordësisë</EditableText>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-2xl mx-auto w-full px-4 flex-1 space-y-4">
        {catQuestions.map((q, idx) => {
          const selected = answers[q.id]
          return (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-4 leading-snug">
                <span className="inline-flex w-6 h-6 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold items-center justify-center mr-2 shrink-0">
                  {idx + 1}
                </span>
                {q.text}
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isActive = selected === val
                  return (
                    <button
                      key={val}
                      onClick={() => handleRate(q.id, val)}
                      title={PM_SCALE_LABELS[val - 1]}
                      className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all duration-200 border-2 ${
                        isActive
                          ? 'text-white border-transparent scale-105 shadow-md'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-violet-300 hover:bg-violet-50'
                      }`}
                      style={isActive ? { background: PM_SCALE_COLORS[val - 1], borderColor: PM_SCALE_COLORS[val - 1] } : {}}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
              {selected !== undefined && (
                <p className="text-xs text-gray-400 mt-2 text-right">{PM_SCALE_LABELS[selected - 1]}</p>
              )}
            </div>
          )
        })}

        {/* Scale legend */}
        <div className="flex justify-between text-xs text-gray-400 px-1 pb-2">
          <span>1 = Nuk pajtohem</span>
          <span>5 = Plotësisht pajtohem</span>
        </div>

        {/* Navigation */}
        <div className="pb-8">
          <button
            disabled={!catAnswered}
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-md"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}
          >
            {isLastCat ? (
              <><Sparkles size={16} /> <EditableText>Zbulo Arketipën</EditableText></>
            ) : (
              <><EditableText>Kategoria tjetër</EditableText> <ArrowRight size={16} /></>
            )}
          </button>
          {!catAnswered && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Plotëso të 6 pohimet për të vazhduar
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PERSONA MATRIX RESULT ────────────────────────────────────────────────

const METRIC_META = {
  emotionalIntelligence: { label: 'Inteligjenca Emocionale', icon: Heart,     color: '#ec4899' },
  socialEnergy:          { label: 'Energjia Sociale',         icon: Users,     color: '#3b82f6' },
  resilience:            { label: 'Rezistenca',               icon: Shield,    color: '#10b981' },
  strategicThinking:     { label: 'Mendimi Strategjik',       icon: Target,    color: '#8b5cf6' },
  creativityIndex:       { label: 'Indeksi i Kreativitetit',  icon: Lightbulb, color: '#f59e0b' },
  leadershipIndex:       { label: 'Indeksi i Udhëheqjes',     icon: Flame,     color: '#ef4444' },
  adaptabilityIndex:     { label: 'Adaptueshmëria',           icon: TrendingUp,color: '#06b6d4' },
}

const SCORE_DIM_META = {
  social:       { label: 'Energia Sociale',       color: '#3b82f6' },
  emotional:    { label: 'Ndjeshmëria Emocionale',color: '#ec4899' },
  analytical:   { label: 'Mendimi Analitik',      color: '#8b5cf6' },
  drive:        { label: 'Forca e Drejtimit',      color: '#ef4444' },
  creativity:   { label: 'Kreativiteti',           color: '#f59e0b' },
  adaptability: { label: 'Adaptueshmëria',         color: '#06b6d4' },
}

function PersonaMatrixResult({ result, onReset, onHub }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // profile | metrics | premium
  const [showEmailGate, setShowEmailGate] = useState(true)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [showEvoCTA, setShowEvoCTA] = useState(false)
  const { isPro, isPremium } = usePlan()
  const evo = useEvolution()
  const hasPremiumReport = isPro || isPremium
  const { archetype, scores, metrics, code } = result

  // If already has email, skip gate
  const gateActive = showEmailGate && !evo.hasEmail && !emailSubmitted

  function handleEmailSubmit(email) {
    evo.saveEmail(email)
    evo.saveArchetype(result)
    setEmailSubmitted(true)
    setShowEmailGate(false)
    setShowEvoCTA(true)
    saveTestResult(result)
  }

  function handleSkipEmail() {
    setShowEmailGate(false)
    evo.saveArchetype(result)
    saveTestResult(result)
  }

  function handleSave() {
    saveTestResult(result)
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-fuchsia-50/20">
      {/* Email Gate */}
      {gateActive && (
        <EmailGate
          archetypeNickname={archetype.nickname}
          archetypeEmoji={archetype.emoji}
          onSubmit={handleEmailSubmit}
          onSkip={handleSkipEmail}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Evolution CTA (shown after email submission) ── */}
        {showEvoCTA && (
          <div
            className="rounded-3xl overflow-hidden border border-violet-200 mb-5 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/evolution')}
            style={{ background: 'linear-gradient(135deg,#1e0a3c,#2d1259,#3b0764)' }}
          >
            <div className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl shrink-0">🌱</div>
              <div className="flex-1">
                <p className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-0.5">Udhëtimi fillon tani</p>
                <p className="text-base font-bold text-white">Hap Evolution Dashboard</p>
                <p className="text-xs text-violet-300/70">Sfida ditore · Streak · AI Coach · +150 XP fituar</p>
              </div>
              <ArrowRight size={20} className="text-violet-300 shrink-0" />
            </div>
          </div>
        )}

        {/* ── Archetype Hero Card ── */}
        <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-xl mb-5">
          <div className="h-2" style={{ background: archetype.gradient }} />
          <div className="p-8 text-center">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg"
              style={{ background: archetype.gradient }}
            >
              {archetype.emoji}
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                style={{ background: archetype.color }}
              >
                🔮 PersonaMatrix
              </span>
              <span className="font-mono text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{code}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <EditableText as="h1" className="text-3xl font-bold text-gray-900">{archetype.name}</EditableText>
            </div>
            <span className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4 block">{archetype.nickname}</span>
            <EditableText as="p" multiline className="text-gray-600 leading-relaxed text-sm max-w-md mx-auto">
              {archetype.desc}
            </EditableText>
          </div>
        </div>

        {/* Core traits */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {archetype.coreTraits.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: archetype.gradient }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex rounded-2xl bg-gray-100 p-1 mb-5 gap-1">
          {[
            { key: 'profile', label: 'Profili' },
            { key: 'metrics', label: 'Metrikat' },
            { key: 'premium', label: '⭐ Raport i Plotë' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Dimension scores */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Brain size={18} className="text-violet-600" />
                <EditableText>Profili i Dimensioneve</EditableText>
              </h3>
              <div className="space-y-4">
                {Object.entries(scores).map(([dim, val]) => {
                  const meta = SCORE_DIM_META[dim]
                  return (
                    <ProgressBar key={dim} value={val} color={meta.color} label={meta.label} />
                  )
                })}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3">✅ Pikat e forta</p>
                <div className="space-y-2">
                  {archetype.strengths.map((s) => (
                    <p key={s} className="text-xs text-gray-700 flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5 shrink-0">•</span>{s}
                    </p>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">⚡ Sfidat</p>
                <div className="space-y-2">
                  {archetype.weaknesses.map((w) => (
                    <p key={w} className="text-xs text-gray-700 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5 shrink-0">•</span>{w}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Growth advice */}
            <div
              className="rounded-2xl p-5"
              style={{ background: `${archetype.color}12`, border: `1.5px solid ${archetype.color}30` }}
            >
              <EditableText as="p" className="font-bold text-sm mb-2" style={{ color: archetype.color }}>
                💡 Këshillë për rritje personale
              </EditableText>
              <EditableText as="p" multiline className="text-sm text-gray-700 leading-relaxed">
                {archetype.growthAdvice}
              </EditableText>
            </div>

            {/* Careers */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <EditableText as="p" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🎯 Karriera të përshtatshme</EditableText>
              <div className="flex flex-wrap gap-2">
                {archetype.careerMatches.map((c) => (
                  <span key={c} className="px-3 py-1.5 text-xs font-semibold bg-violet-50 text-violet-700 rounded-full border border-violet-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Metrics Tab ── */}
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
                <TrendingUp size={18} className="text-violet-600" />
                <EditableText>Metrikat e Avancuara</EditableText>
              </h3>
              <div className="space-y-5">
                {Object.entries(metrics).map(([key, val]) => {
                  const meta = METRIC_META[key]
                  const Icon = meta.icon
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon size={14} style={{ color: meta.color }} />
                          <span className="text-xs font-semibold text-gray-700">{meta.label}</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: meta.color }}>{val}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-700"
                          style={{ width: `${val}%`, background: meta.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Relationship + Stress info */}
            <div className="grid gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-2">💞 Stili në Marrëdhënie</p>
                <EditableText as="p" multiline className="text-sm text-gray-700 leading-relaxed">{archetype.relationshipStyle}</EditableText>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">⛈️ Nën Stres</p>
                <EditableText as="p" multiline className="text-sm text-gray-700 leading-relaxed">{archetype.stressBehavior}</EditableText>
              </div>
            </div>
          </div>
        )}

        {/* ── Premium Report Tab ── */}
        {activeTab === 'premium' && (
          <div className="space-y-4">
            {hasPremiumReport ? (
              <>
                {[
                  { key: 'overview',         icon: '🔮', label: 'Pasqyrë e Plotë',       color: '#8b5cf6' },
                  { key: 'emotionalProfile', icon: '💫', label: 'Profili Emocional',      color: '#ec4899' },
                  { key: 'hiddenStrengths',  icon: '⚡', label: 'Pikat e Fshehura',       color: '#f59e0b' },
                  { key: 'blindSpots',       icon: '🌫️', label: 'Zonat e Verbëta',        color: '#6b7280' },
                  { key: 'workplaceStyle',   icon: '💼', label: 'Stili në Punë',          color: '#0891b2' },
                  { key: 'friendshipStyle',  icon: '🤝', label: 'Stili i Miqësisë',       color: '#059669' },
                  { key: 'romanceStyle',     icon: '❤️', label: 'Stili Romantik',         color: '#dc2626' },
                  { key: 'conflictStyle',    icon: '⚖️', label: 'Menaxhimi i Konfliktit', color: '#d97706' },
                  { key: 'productivityStyle',icon: '🚀', label: 'Stili i Produktivitetit',color: '#7c3aed' },
                  { key: 'learningStyle',    icon: '📚', label: 'Stili i Mësimit',        color: '#1e40af' },
                ].map(({ key, icon, label, color }) => (
                  <div key={key} className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color }}>
                      {icon} {label}
                    </p>
                    <EditableText as="p" multiline className="text-sm text-gray-700 leading-relaxed">
                      {archetype.premiumReport[key]}
                    </EditableText>
                  </div>
                ))}
                {/* Ideal environments */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3">🌿 Ambiente Ideale</p>
                  <div className="flex flex-wrap gap-2">
                    {archetype.premiumReport.idealEnvironments.map((env) => (
                      <span key={env} className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-200">
                        {env}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div
                className="rounded-3xl overflow-hidden border border-violet-200 text-center py-12 px-8"
                style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed,#ec4899)' }}
              >
                <div className="text-5xl mb-4">⭐</div>
                <EditableText as="h3" className="text-xl font-bold text-white mb-2">Raport Premium i Plotë</EditableText>
                <EditableText as="p" multiline className="text-white/70 text-sm mb-6 leading-relaxed">
                  Zhblloko 10 seksione premium: stili në punë, miqësi, romanticizëm, konflikt, produktivitet, mësim dhe ambiente ideale.
                </EditableText>
                <button
                  className="bg-white text-violet-700 font-bold px-8 py-3 rounded-2xl text-sm hover:bg-violet-50 transition-all shadow-lg"
                  onClick={() => {/* upgrade flow */}}
                >
                  <Lock size={14} className="inline mr-2" />
                  <EditableText>Kalon në Pro</EditableText>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saved}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-violet-300 text-violet-700 bg-violet-50 hover:bg-violet-100 disabled:opacity-60 transition-all"
          >
            {saved ? (
              <><CheckCircle size={18} className="text-green-600" /><EditableText as="span" className="text-green-700">Rezultati u ruajt!</EditableText></>
            ) : (
              <><CheckCircle size={18} /><EditableText>Ruaj Rezultatin</EditableText></>
            )}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReset}
              className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <RotateCcw size={16} />
              <EditableText>Bëj sërish</EditableText>
            </button>
            <button
              onClick={onHub}
              className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white transition-all hover:opacity-90 shadow-md"
              style={{ background: archetype.gradient }}
            >
              <EditableText>Teste tjera</EditableText>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────

export default function Tests() {
  const [view, setView] = useState('hub')
  const [activeTest, setActiveTest] = useState(null)
  const [testResult, setTestResult] = useState(null)

  const handleStart = useCallback((testId) => {
    setActiveTest(testId)
    setView(testId)
    setTestResult(null)
  }, [])

  const handleResult = useCallback((result) => {
    setTestResult(result)
    if (result.testId === 'personaMatrix') setView('pm_result')
    else if (result.testId === 'iq')       setView('iq_result')
    else                                   setView('result')
  }, [])

  const handleBack = useCallback(() => {
    setView('hub')
    setActiveTest(null)
    setTestResult(null)
  }, [])

  const handleReset = useCallback(() => {
    setView(activeTest)
    setTestResult(null)
  }, [activeTest])

  if (view === 'hub') {
    return <PublicLayout><HubView onStart={handleStart} /></PublicLayout>
  }

  if (view === 'result' && testResult) {
    return (
      <PublicLayout>
        <ResultView
          result={testResult}
          onReset={handleReset}
          onHub={handleBack}
        />
      </PublicLayout>
    )
  }

  if (view === 'pm_result' && testResult) {
    return (
      <PublicLayout>
        <PersonaMatrixResult
          result={testResult}
          onReset={handleReset}
          onHub={handleBack}
        />
      </PublicLayout>
    )
  }

  if (view === 'personality') {
    return <PersonalityRunner onResult={handleResult} onBack={handleBack} />
  }

  if (view === 'mood') {
    return <MoodRunner onResult={handleResult} onBack={handleBack} />
  }

  if (view === 'cognitive') {
    return <CognitiveRunner onResult={handleResult} onBack={handleBack} />
  }

  if (view === 'iq') {
    return <IQRunner onResult={handleResult} onBack={handleBack} />
  }

  if (view === 'iq_result' && testResult) {
    return (
      <PublicLayout>
        <IQResultView
          result={testResult}
          onReset={handleReset}
          onHub={handleBack}
        />
      </PublicLayout>
    )
  }

  if (view === 'personaMatrix') {
    return <PersonaMatrixRunner onResult={handleResult} onBack={handleBack} />
  }

  return null
}
