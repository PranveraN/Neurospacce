import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, CheckCircle, ChevronRight, Brain, Zap, Target, BarChart2, Star } from 'lucide-react'
import { QUESTIONS, MODULES, DIMENSIONS, ARCHETYPES, CAREERS, scoreAssessment } from '../data/careerAssessment'

const BG   = 'linear-gradient(160deg,#030711 0%,#0e0525 55%,#030711 100%)'
const TOTAL = QUESTIONS.length

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Pyetja {current} / {total}</span>
        <span className="text-[10px] font-bold text-violet-400">{pct}%</span>
      </div>
      <div className="h-1 rounded-full" style={{background:'rgba(255,255,255,0.07)'}}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{width:`${pct}%`, background:'linear-gradient(90deg,#7c3aed,#60a5fa)'}} />
      </div>
    </div>
  )
}

function ModuleBadge({ moduleId }) {
  const m = MODULES.find(x => x.id === moduleId)
  if (!m) return null
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
      style={{background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.45)', border:'1px solid rgba(255,255,255,0.1)'}}>
      <span>{m.icon}</span> {m.label}
    </span>
  )
}

function TypeBadge({ type }) {
  const MAP = { pattern:'Model', logic:'Logjikë', rapid:'⚡ Rapid', analogy:'Analogji', deductive:'Deduktive', comparative:'Krahasuese', matrix:'Matricë', scenario:'Skenar', preference:'Preferencë' }
  return (
    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
      style={{background:'rgba(124,58,237,0.15)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.25)'}}>
      {MAP[type] || type}
    </span>
  )
}

// ── INTRO SCREEN ────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden"
      style={{background: BG}}>
      {/* ambient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{background:'radial-gradient(circle,#7c3aed,transparent 70%)'}} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none"
        style={{background:'radial-gradient(circle,#3b82f6,transparent 70%)'}} />

      <div className="relative max-w-2xl w-full text-center">
        {/* badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold text-violet-300 uppercase tracking-widest"
          style={{background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)'}}>
          <Brain size={12}/> NeuroSpace Inteligjenca e Karrierës
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
          Zbulo<br/>
          <span className="text-transparent bg-clip-text"
            style={{backgroundImage:'linear-gradient(135deg,#a78bfa,#60a5fa)'}}>
            Arketipin tënd të Karrierës
          </span>
        </h1>
        <p className="text-white/45 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Vlerësim psikometrik që mat 15 dimensione kognitive — duke prodhuar NeuroScore™ tëndin, arketipin e karrierës dhe rekomandime karriere të përputhura me AI.
        </p>

        {/* stat pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[['60','Pyetje'],['12–15 min','Kohëzgjatja'],['15','Dimensione'],['12','Arkëtipe'],['18','Përputhje Karriere']].map(([v,l]) => (
            <div key={l} className="px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)'}}>
              <span className="text-violet-300">{v}</span> <span className="text-white/40">{l}</span>
            </div>
          ))}
        </div>

        {/* module preview */}
        <div className="grid grid-cols-4 gap-2 mb-10">
          {MODULES.map(m => (
            <div key={m.id} className="rounded-xl p-3 text-center"
              style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)'}}>
              <div className="text-xl mb-1">{m.icon}</div>
              <p className="text-[9px] font-bold text-white/35 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>

        <button onClick={onStart}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-105"
          style={{background:'linear-gradient(135deg,#7c3aed,#3b82f6)', boxShadow:'0 8px 32px rgba(124,58,237,0.45)'}}>
          <Zap size={16}/> Fillo Vlerësimin
          <ArrowRight size={16}/>
        </button>
        <p className="text-white/20 text-xs mt-4">Rezultatet janë konfidenciale dhe nuk ndahen pa lejen tënde.</p>
      </div>
    </div>
  )
}

// ── QUESTION SCREEN ─────────────────────────────────────────────────────────
function QuestionScreen({ q, qIndex, answers, onAnswer, onNext, onBack }) {
  const selected = answers[q.id]
  const isFirst  = qIndex === 0
  const isLast   = qIndex === TOTAL - 1

  return (
    <div className="min-h-screen flex flex-col" style={{background: BG}}>
      {/* top bar */}
      <div className="sticky top-0 z-10 px-5 pt-5 pb-3"
        style={{background:'rgba(3,7,17,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="max-w-2xl mx-auto">
          <ProgressBar current={qIndex + 1} total={TOTAL} />
        </div>
      </div>

      {/* content */}
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-2xl">
          {/* badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <ModuleBadge moduleId={q.module} />
            <TypeBadge type={q.type} />
          </div>

          {/* question */}
          <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3 whitespace-pre-line">
            {q.q}
          </h2>
          {q.n && (
            <p className="text-sm text-white/35 mb-6 flex items-start gap-2">
              <span className="text-violet-400 font-bold shrink-0">→</span> {q.n}
            </p>
          )}

          {/* options */}
          <div className="space-y-3 mb-8">
            {q.opts.map((opt) => {
              const isSelected = selected === opt.id
              return (
                <button key={opt.id} onClick={() => onAnswer(q.id, opt.id)}
                  className="w-full text-left p-4 rounded-2xl transition-all duration-200 group"
                  style={isSelected
                    ? {background:'rgba(124,58,237,0.2)', border:'1.5px solid rgba(167,139,250,0.6)', transform:'translateY(-1px)'}
                    : {background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)'}}>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all"
                      style={isSelected
                        ? {background:'#7c3aed', border:'none'}
                        : {background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)'}}>
                      {isSelected
                        ? <CheckCircle size={13} className="text-white"/>
                        : <span className="text-[9px] font-black text-white/30">{opt.id.toUpperCase()}</span>}
                    </div>
                    <p className="text-sm text-white/75 leading-relaxed group-hover:text-white/95 transition-colors"
                      style={isSelected ? {color:'rgba(255,255,255,0.95)'} : {}}>
                      {opt.t}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* navigation */}
          <div className="flex items-center justify-between">
            <button onClick={onBack} disabled={isFirst}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-20"
              style={{background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.08)'}}>
              <ArrowLeft size={14}/> Prapa
            </button>
            <button onClick={onNext} disabled={!selected}
              className="flex items-center gap-3 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30 hover:scale-105 disabled:hover:scale-100"
              style={{background:'linear-gradient(135deg,#7c3aed,#3b82f6)', boxShadow: selected ? '0 4px 16px rgba(124,58,237,0.4)' : 'none'}}>
              {isLast ? 'Shiko Rezultatet' : 'Tjetër'} <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PROCESSING SCREEN ───────────────────────────────────────────────────────
function ProcessingScreen() {
  const [step, setStep] = useState(0)
  const STEPS = [
    'Duke analizuar 15 dimensionet kognitive…',
    'Duke hartëzuar arketipin tënd të karrierës…',
    'Duke llogaritur NeuroScore™…',
    'Duke përputhur përputhshmërinë e karrierës…',
    'Duke gjeneruar raportin tënd të inteligjencës…',
  ]
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 900)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{background: BG}}>
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{background:'linear-gradient(135deg,#7c3aed,#3b82f6)'}}>
          <Brain size={36} color="white"/>
        </div>
        <div className="absolute inset-0 rounded-2xl animate-ping opacity-20"
          style={{background:'linear-gradient(135deg,#7c3aed,#3b82f6)'}} />
      </div>
      <h2 className="text-2xl font-black text-white mb-3">Analizë në progres</h2>
      <p className="text-white/40 text-sm mb-8 h-5 transition-all">{STEPS[step]}</p>
      <div className="flex gap-1.5">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
            style={{background: i === step ? '#7c3aed' : 'rgba(255,255,255,0.15)'}} />
        ))}
      </div>
    </div>
  )
}

// ── DIMENSION BAR ────────────────────────────────────────────────────────────
function DimBar({ label, icon, score, highlight }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-sm w-5 text-center shrink-0">{icon}</span>
      <span className="text-xs text-white/50 w-40 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{
            width:`${score}%`,
            background: highlight ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : 'rgba(167,139,250,0.35)',
          }} />
      </div>
      <span className="text-xs font-bold w-8 text-right"
        style={{color: highlight ? '#a78bfa' : 'rgba(255,255,255,0.35)'}}>
        {score}
      </span>
    </div>
  )
}

// ── NEUROSCORE DISPLAY ───────────────────────────────────────────────────────
function NeuroScoreRing({ score }) {
  const pct = (score - 60) / 100
  const r   = 54
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  const color = score >= 130 ? '#10b981' : score >= 110 ? '#3b82f6' : score >= 90 ? '#7c3aed' : '#f59e0b'
  const label = score >= 140 ? 'Elitë' : score >= 125 ? 'Avancuar' : score >= 105 ? 'Kompetent' : score >= 85 ? 'Në Zhvillim' : 'Bazë'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
          <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{transition:'stroke-dasharray 1.5s ease'}}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">NeuroScore™</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full"
        style={{background:`${color}20`, color}}>
        {label}
      </span>
    </div>
  )
}

// ── RESULTS DASHBOARD ────────────────────────────────────────────────────────
function ResultsDashboard({ result }) {
  const { dimensions, neuroScore, archetype, careers, strengths, growth } = result
  const [activeTab, setActiveTab] = useState('overview')

  const TABS = [
    { id:'overview',   label:'Përmbledhje'    },
    { id:'dimensions', label:'Dimensionet'    },
    { id:'careers',    label:'Karrierat'      },
    { id:'report',     label:'Raport i Plotë' },
  ]

  return (
    <div className="min-h-screen" style={{background: BG}}>
      {/* HEADER */}
      <div className="relative overflow-hidden py-12 px-5"
        style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full opacity-15"
            style={{background:`radial-gradient(circle,${archetype.color},transparent 70%)`}}/>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Raporti yt i Inteligjencës</p>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <NeuroScoreRing score={neuroScore}/>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{archetype.emoji}</span>
                <div>
                  <h1 className="text-2xl font-black text-white">{archetype.name}</h1>
                  <p className="text-sm text-white/40 italic">{archetype.tagline}</p>
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed max-w-xl">{archetype.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-0 z-10 px-5 py-3"
        style={{background:'rgba(3,7,17,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
              style={activeTab===t.id
                ? {background:'rgba(124,58,237,0.25)', color:'#c4b5fd', border:'1px solid rgba(167,139,250,0.35)'}
                : {background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.08)'}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* top strengths + growth */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-5" style={{background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)'}}>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">⬆ Pikat e tua të forta</p>
                {strengths.map(s => (
                  <div key={s.key} className="flex items-center gap-2.5 mb-2">
                    <span>{s.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white/80">{s.label}</span>
                        <span className="text-xs font-black text-emerald-400">{s.score}</span>
                      </div>
                      <p className="text-[10px] text-white/35 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-5" style={{background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)'}}>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">📈 Zonat e rritjes</p>
                {growth.map(s => (
                  <div key={s.key} className="flex items-center gap-2.5 mb-2">
                    <span>{s.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white/80">{s.label}</span>
                        <span className="text-xs font-black text-amber-400">{s.score}</span>
                      </div>
                      <p className="text-[10px] text-white/35 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* archetype deep-dive */}
            <div className="rounded-2xl p-6" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)'}}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">{archetype.emoji}</span>
                <h3 className="font-black text-white text-lg">{archetype.name}</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Avantazhet</p>
                  {archetype.strengths.map(s => (
                    <div key={s} className="flex items-start gap-1.5 mb-1.5">
                      <CheckCircle size={10} className="text-violet-400 mt-0.5 shrink-0"/>
                      <span className="text-xs text-white/60">{s}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Sfidat</p>
                  {archetype.challenges.map(c => (
                    <div key={c} className="flex items-start gap-1.5 mb-1.5">
                      <ChevronRight size={10} className="text-amber-400 mt-0.5 shrink-0"/>
                      <span className="text-xs text-white/60">{c}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Mjediset ideale</p>
                  {archetype.environments.map(e => (
                    <div key={e} className="flex items-start gap-1.5 mb-1.5">
                      <Star size={10} className="text-blue-400 mt-0.5 shrink-0"/>
                      <span className="text-xs text-white/60">{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* top 3 careers preview */}
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Karrierat kryesore</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {careers.slice(0, 3).map((c, i) => (
                  <div key={c.id} className="rounded-2xl p-4" style={{background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)'}}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{c.icon}</span>
                      <span className="text-[10px] font-black text-violet-400">{c.compatibility}%</span>
                    </div>
                    <p className="text-xs font-bold text-white">{c.name}</p>
                    <div className="mt-2 h-1 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}>
                      <div className="h-full rounded-full" style={{width:`${c.compatibility}%`, background:'linear-gradient(90deg,#7c3aed,#60a5fa)'}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DIMENSIONS TAB ── */}
        {activeTab === 'dimensions' && (
          <div>
            <p className="text-xs font-bold text-white/35 uppercase tracking-widest mb-5">Të 15 dimensionet kognitive</p>
            <div className="rounded-2xl p-6" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)'}}>
              {Object.entries(DIMENSIONS).map(([key, dim]) => (
                <DimBar key={key} label={dim.label} icon={dim.icon}
                  score={dimensions[key] || 0}
                  highlight={dimensions[key] >= 70} />
              ))}
            </div>
          </div>
        )}

        {/* ── CAREERS TAB ── */}
        {activeTab === 'careers' && (
          <div>
            <p className="text-xs font-bold text-white/35 uppercase tracking-widest mb-5">Karriera sipas përputhshmërisë</p>
            <div className="space-y-3">
              {careers.map((c, i) => (
                <div key={c.id} className="rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5"
                  style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)'}}>
                  <span className="text-2xl w-9 text-center shrink-0">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-white text-sm">{c.name}</p>
                      <span className="text-sm font-black"
                        style={{color: c.compatibility >= 85 ? '#10b981' : c.compatibility >= 75 ? '#7c3aed' : 'rgba(255,255,255,0.5)'}}>
                        {c.compatibility}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width:`${c.compatibility}%`,
                          background: c.compatibility >= 85 ? 'linear-gradient(90deg,#10b981,#34d399)' :
                                      c.compatibility >= 75 ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' :
                                      'linear-gradient(90deg,#475569,#64748b)'
                        }}/>
                    </div>
                  </div>
                  {i === 0 && (
                    <span className="text-[9px] font-bold px-2 py-1 rounded-lg shrink-0"
                      style={{background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)'}}>
                      #1 Përputhje
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FULL REPORT TAB ── */}
        {activeTab === 'report' && (
          <div className="space-y-5">
            {/* Leadership profile */}
            <ReportSection icon="🎯" title="Profili i Udhëheqjes" color="rgba(124,58,237,0.15)" borderColor="rgba(124,58,237,0.25)">
              <p className="text-sm text-white/60 leading-relaxed">{archetype.leadership}</p>
            </ReportSection>

            {/* Burnout risk */}
            <ReportSection icon="⚠️" title="Profili i Rrezikut të Burnout" color="rgba(239,68,68,0.08)" borderColor="rgba(239,68,68,0.2)">
              <p className="text-sm text-white/60 leading-relaxed">{archetype.burnout}</p>
            </ReportSection>

            {/* Growth roadmap */}
            <ReportSection icon="📈" title="Rekomandim Rritjeje" color="rgba(16,185,129,0.08)" borderColor="rgba(16,185,129,0.2)">
              <p className="text-sm text-white/60 leading-relaxed">{archetype.growth}</p>
            </ReportSection>

            {/* Ideal careers */}
            <ReportSection icon="🚀" title="Karriera të Ndërtuara për Këtë Arkëtip" color="rgba(59,130,246,0.08)" borderColor="rgba(59,130,246,0.2)">
              <div className="flex flex-wrap gap-2">
                {archetype.careers.map(c => (
                  <span key={c} className="text-xs font-bold px-3 py-1.5 rounded-xl"
                    style={{background:'rgba(59,130,246,0.15)', color:'#93c5fd', border:'1px solid rgba(59,130,246,0.25)'}}>
                    {c}
                  </span>
                ))}
              </div>
            </ReportSection>

            {/* All archetypes comparison */}
            <ReportSection icon="🧬" title="Harta e Afërsisë së Arkëtipave" color="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.07)">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ARCHETYPES.map(a => {
                  const dist = Object.keys(DIMENSIONS).reduce((s, d) => {
                    const diff = (dimensions[d] || 50) - (a.profile[d] || 50)
                    return s + diff * diff
                  }, 0)
                  const maxDist = 15 * 100 * 100
                  const sim = Math.round(100 - (dist / maxDist) * 100)
                  const isMe = a.id === archetype.id
                  return (
                    <div key={a.id} className="rounded-xl p-3 transition-all"
                      style={isMe
                        ? {background:`${a.color}25`, border:`1.5px solid ${a.color}60`}
                        : {background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)'}}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{a.emoji}</span>
                        <span className="text-[10px] font-bold text-white/70 leading-tight">{a.name}</span>
                      </div>
                      <div className="h-1 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}>
                        <div className="h-full rounded-full" style={{width:`${Math.max(sim,0)}%`, background: isMe ? a.color : 'rgba(255,255,255,0.2)'}}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ReportSection>
          </div>
        )}
      </div>

      {/* BOTTOM CTA */}
      <div className="max-w-4xl mx-auto px-5 pb-12">
        <div className="rounded-2xl p-6 text-center"
          style={{background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(59,130,246,0.15))', border:'1px solid rgba(167,139,250,0.2)'}}>
          <p className="text-white font-bold mb-1">Dëshiron të zhvillosh {archetype.name} tek potenciali maksimal?</p>
          <p className="text-white/40 text-sm mb-4">BrainBoost ka module specifike të dizajnuara për arketipin tënd.</p>
          <Link to="/brainboost"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
            style={{background:'linear-gradient(135deg,#7c3aed,#3b82f6)'}}>
            Hap BrainBoost <ArrowRight size={14}/>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ReportSection({ icon, title, color, borderColor, children }) {
  return (
    <div className="rounded-2xl p-5" style={{background:color, border:`1px solid ${borderColor}`}}>
      <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">
        {icon} {title}
      </p>
      {children}
    </div>
  )
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function CareerIntelligence() {
  const [stage,   setStage]   = useState('intro')
  const [qIndex,  setQIndex]  = useState(0)
  const [answers, setAnswers] = useState({})
  const [result,  setResult]  = useState(null)

  const q = QUESTIONS[qIndex]

  function handleAnswer(qId, optId) {
    setAnswers(prev => ({ ...prev, [qId]: optId }))
  }

  function handleNext() {
    if (qIndex < TOTAL - 1) {
      setQIndex(i => i + 1)
    } else {
      setStage('processing')
      setTimeout(() => {
        const r = scoreAssessment(answers)
        setResult(r)
        setStage('results')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 4500)
    }
  }

  function handleBack() {
    if (qIndex > 0) setQIndex(i => i - 1)
  }

  if (stage === 'intro')      return <IntroScreen onStart={() => setStage('assessment')} />
  if (stage === 'assessment') return <QuestionScreen q={q} qIndex={qIndex} answers={answers} onAnswer={handleAnswer} onNext={handleNext} onBack={handleBack} />
  if (stage === 'processing') return <ProcessingScreen />
  if (stage === 'results')    return <ResultsDashboard result={result} />
  return null
}
