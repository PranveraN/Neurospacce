import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import EditableText from '../components/EditableText'
import {
  Brain, Zap, Timer, Battery, Shield, BookOpen, Trophy,
  Play, Pause, RotateCcw, Volume2, VolumeX, ChevronRight,
  ChevronLeft, CheckCircle, AlertCircle, Sparkles, Lock,
  Eye, Cpu, ArrowRight, Star, Flame, BarChart2, Headphones,
  Upload, X,
} from 'lucide-react'

/* ─── shared tokens ─────────────────────────────────────── */
const BG  = 'linear-gradient(160deg,#030711 0%,#0e0525 60%,#030711 100%)'
const C   = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)' }

/* ══════════════════════════════════════════════════════════
   1. FOCUS SPRINT
══════════════════════════════════════════════════════════ */
function FocusSprint() {
  const [dur, setDur]         = useState(25)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [done, setDone]       = useState(false)
  const [sound, setSound]     = useState('rain')
  const iv = useRef(null)

  useEffect(() => {
    if (running && seconds > 0) {
      iv.current = setInterval(() => setSeconds(s => s - 1), 1000)
    } else if (seconds === 0 && running) {
      clearInterval(iv.current)
      setRunning(false)
      setDone(true)
    }
    return () => clearInterval(iv.current)
  }, [running, seconds])

  const reset = (d = dur) => {
    clearInterval(iv.current)
    setRunning(false)
    setDone(false)
    setSeconds(d * 60)
  }
  const pick = (d) => { setDur(d); reset(d) }

  const r    = 54
  const circ = 2 * Math.PI * r
  const pct  = (dur * 60 - seconds) / (dur * 60)
  const mm   = String(Math.floor(seconds / 60)).padStart(2,'0')
  const ss   = String(seconds % 60).padStart(2,'0')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[15,25,45].map(d => (
            <button key={d} onClick={() => pick(d)}
              className="px-3 py-1 rounded-xl text-xs font-bold transition-all"
              style={d===dur
                ? {background:'rgba(124,58,237,0.3)',border:'1px solid rgba(167,139,250,0.5)',color:'#c4b5fd'}
                : {background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)'}}>
              {d} min
            </button>
          ))}
        </div>
        <button onClick={() => reset()} className="text-white/30 hover:text-white/60 transition-colors">
          <RotateCcw size={14}/>
        </button>
      </div>

      <div className="flex justify-center py-1">
        <div className="relative">
          <svg width="140" height="140" className="-rotate-90">
            <circle cx="70" cy="70" r={r} fill="none" strokeWidth="6" stroke="rgba(255,255,255,0.07)"/>
            <circle cx="70" cy="70" r={r} fill="none" strokeWidth="6"
              stroke={done ? '#10b981' : '#7c3aed'} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
              style={{transition:'stroke-dashoffset 1s linear',filter:'drop-shadow(0 0 8px rgba(124,58,237,0.6))'}}/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {done
              ? <><CheckCircle size={22} className="text-emerald-400"/><p className="text-[11px] font-black text-emerald-400 mt-1">Perfekt!</p></>
              : <><span className="text-3xl font-black text-white tabular-nums">{mm}:{ss}</span>
                  <EditableText as="span" id="bb-sprint-label" className="text-[10px] text-white/40 mt-0.5">Fokus i thellë</EditableText></>}
          </div>
        </div>
      </div>

      <button onClick={() => setRunning(r => !r)}
        className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
        style={{background:running?'rgba(239,68,68,0.35)':'linear-gradient(135deg,#7c3aed,#4f46e5)',boxShadow:'0 4px 16px rgba(124,58,237,0.3)'}}>
        {running ? '⏸ Pauzë' : done ? '🔄 Rifillo' : '▶ Start Sprint'}
      </button>

      <div className="flex items-center gap-2">
        <Volume2 size={11} className="text-white/25 shrink-0"/>
        <div className="flex gap-1.5 flex-1">
          {[['rain','🌧 Rain'],['brown','🌊 Brown'],['lofi','🎵 Lo-fi']].map(([k,l]) => (
            <button key={k} onClick={() => setSound(k)}
              className="flex-1 py-1 rounded-lg text-[10px] font-bold transition-all"
              style={k===sound
                ? {background:'rgba(124,58,237,0.25)',color:'#c4b5fd',border:'1px solid rgba(167,139,250,0.3)'}
                : {background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.3)',border:'1px solid rgba(255,255,255,0.07)'}}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   2. MENTAL ENERGY SCANNER
══════════════════════════════════════════════════════════ */
const EQ = [
  {q:'Si je fizikisht sot?',            opts:['Lodhur','Mesatar','Energjik']},
  {q:'Si është gjumi i natës?',          opts:['Keq <5h','Mesatar 6-7h','Mirë 8h+']},
  {q:'Si ndihesh mendërisht?',           opts:['I/E hutuar','Mesatar','I/E qartë']},
  {q:'Motivimi sot?',                    opts:['Zero','Pak','Lart']},
]

function MentalEnergyScanner() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore]     = useState(null)

  const answer = (i) => {
    const next = [...answers, i]
    if (step < EQ.length-1) { setAnswers(next); setStep(s => s+1) }
    else { setScore(Math.round((next.reduce((a,b)=>a+b,0)/(EQ.length*2))*100)) }
  }
  const reset = () => { setStep(0); setAnswers([]); setScore(null) }

  const label = (s) => s>=75
    ? {text:'Energji e lartë! 🚀',color:'#10b981',tip:'Koha perfekte për deep work 4h.'}
    : s>=45
    ? {text:'Energji e mirë ✅',color:'#f59e0b',tip:'Bëj sprint 25 min + pushim 5.'}
    : {text:'Energji e ulët 😔',color:'#f43f5e',tip:'Hidratim + shëtitje 10 min, pastaj rifillo.'}

  if (score !== null) {
    const l = label(score)
    const r = 46, c2 = 2*Math.PI*r
    return (
      <div className="flex flex-col items-center gap-4 py-1">
        <div className="relative">
          <svg width="110" height="110" className="-rotate-90">
            <circle cx="55" cy="55" r={r} fill="none" strokeWidth="7" stroke="rgba(255,255,255,0.07)"/>
            <circle cx="55" cy="55" r={r} fill="none" strokeWidth="7" stroke={l.color}
              strokeLinecap="round" strokeDasharray={c2} strokeDashoffset={c2*(1-score/100)}
              style={{filter:`drop-shadow(0 0 8px ${l.color}80)`}}/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{score}</span>
            <span className="text-[9px] text-white/40">nga 100</span>
          </div>
        </div>
        <p className="font-black text-sm" style={{color:l.color}}>{l.text}</p>
        <div className="w-full p-3 rounded-xl text-xs text-white/55 leading-relaxed"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
          💡 {l.tip}
        </div>
        <button onClick={reset} className="text-xs text-violet-400 font-bold hover:text-violet-300">Skano Sërisht</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 mb-1">
        {EQ.map((_,i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all"
            style={{background:i<=step?'#7c3aed':'rgba(255,255,255,0.1)'}}/>
        ))}
      </div>
      <EditableText as="p" id={`bb-eq-${step}-q`} className="text-sm font-bold text-white">{EQ[step].q}</EditableText>
      <div className="flex flex-col gap-2">
        {EQ[step].opts.map((opt,i) => (
          <button key={opt} onClick={() => answer(i)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-left transition-all hover:-translate-x-0.5"
            style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.75)'}}>
            <EditableText id={`bb-eq-${step}-opt-${i}`}>{opt}</EditableText>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-white/25 text-center">{step+1} / {EQ.length}</p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   3. ANTI-DISTRACTION MODE
══════════════════════════════════════════════════════════ */
function AntiDistraction() {
  const [checked, setChecked] = useState([false,false,false])
  const [active, setActive]   = useState(false)
  const [seconds, setSeconds] = useState(0)
  const iv = useRef(null)

  const toggle = (i) => {
    const n = [...checked]; n[i] = !n[i]; setChecked(n)
    if (n.every(Boolean)) { setActive(true); iv.current = setInterval(() => setSeconds(s=>s+1),1000) }
  }
  const quit = () => { clearInterval(iv.current); setActive(false); setSeconds(0); setChecked([false,false,false]) }
  useEffect(() => () => clearInterval(iv.current), [])

  const mm = String(Math.floor(seconds/60)).padStart(2,'0')
  const ss = String(seconds%60).padStart(2,'0')
  const STEPS = ['Mbyll të gjitha tab-et tjerë','Vendos telefonin tutje','Bëj 3 frymëmarrje të thella']

  if (active) return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="text-5xl font-black text-white tabular-nums tracking-tight">{mm}:{ss}</div>
      <div className="text-center">
        <p className="font-bold text-violet-300 text-sm">Focus Mode Aktiv</p>
        <p className="text-xs text-white/40 mt-1">Largo distraksionet. Kthe fokusin.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        {[{label:'Sesion',val:`${mm}:${ss}`,c:'rgba(124,58,237,0.1)',bc:'rgba(124,58,237,0.2)',tc:'#a78bfa'},
          {label:'Streak',val:'1 ditë',c:'rgba(16,185,129,0.1)',bc:'rgba(16,185,129,0.2)',tc:'#6ee7b7'}].map(s=>(
          <div key={s.label} className="p-3 rounded-xl text-center" style={{background:s.c,border:`1px solid ${s.bc}`}}>
            <p className="text-[10px]" style={{color:s.tc}}>{s.label}</p>
            <p className="text-sm font-black text-white">{s.val}</p>
          </div>
        ))}
      </div>
      <button onClick={quit} className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors">Dil nga Focus Mode</button>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      <EditableText as="p" id="bb-antidist-desc" className="text-xs text-white/50 leading-relaxed">3 hapa para fokusimit të plotë:</EditableText>
      {STEPS.map((s,i) => (
        <button key={i} onClick={() => toggle(i)}
          className="flex items-center gap-3 p-3 rounded-xl transition-all text-left"
          style={{background:checked[i]?'rgba(124,58,237,0.15)':'rgba(255,255,255,0.04)',
            border:`1px solid ${checked[i]?'rgba(167,139,250,0.3)':'rgba(255,255,255,0.08)'}`}}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            style={{background:checked[i]?'#7c3aed':'rgba(255,255,255,0.08)'}}>
            {checked[i] && <CheckCircle size={12} className="text-white"/>}
          </div>
          <EditableText id={`bb-antidist-step-${i}`} className="text-xs text-white/70 font-medium">{s}</EditableText>
        </button>
      ))}
      <EditableText as="p" id="bb-antidist-footer" className="text-[10px] text-white/20 text-center">Aktivizon Focus Mode automatikisht</EditableText>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   4. MEMORY BOOST TECHNIQUES
══════════════════════════════════════════════════════════ */
const TECHS = [
  {name:'Active Recall',    e:'🧠',c:'#7c3aed',short:'Rikujto aktivsht',    desc:'Mbyll librin dhe shkruaj çfarë mban mend. Forcon gjurmët nervore 50% më shumë se rileximi.'},
  {name:'Spaced Repetition',e:'📅',c:'#3b82f6',short:'Përsëritje e zgjitur', desc:'Rishiko pikërisht kur je gati ta harrosh. Anki e automatizes. Forcon kujtesën afatgjatë.'},
  {name:'Feynman Method',   e:'💡',c:'#f59e0b',short:'Mëso duke shpjeguar', desc:'Shpjegoje si t\'ia shpjegoje një fëmije. Kur ngelesh, ke gjetur gap-in e vërtetë.'},
  {name:'Mind Palace',      e:'🏛',c:'#10b981',short:'Pallati i mendjes',   desc:'Vendos info në vende imagjinare të njohura. Mnemonic i fuqishëm për sasi të madhe.'},
  {name:'Blurting',         e:'✍️',c:'#f43f5e',short:'Shkruaj gjithçka',    desc:'Hap fletore bosh dhe shkruaj gjithçka pa shikuar. Pastaj kontrollo çfarë mungon.'},
]

function MemoryBoost() {
  const [a, setA] = useState(0)
  const t = TECHS[a]
  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-2xl overflow-hidden" style={{ height: '100px' }}>
        <img
          src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1200&q=70"
          alt="Brain memory"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.85) 0%, rgba(6,5,26,0.5) 60%, rgba(6,5,26,0.2) 100%)' }}/>
        <div className="absolute inset-0 flex items-center px-6">
          <div>
            <p className="text-white font-black text-base leading-tight">5 teknikat shkencore</p>
            <p className="text-blue-200/70 text-xs mt-0.5">Forco kujtesën afatgjatë sot</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
        {TECHS.map((tech,i) => (
          <button key={tech.name} onClick={() => setA(i)}
            className="shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all w-20"
            style={i===a
              ? {background:`${tech.c}18`,border:`1px solid ${tech.c}50`}
              : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
            <span className="text-2xl">{tech.e}</span>
            <p className="text-[9px] font-bold text-center leading-tight" style={{color:i===a?tech.c:'rgba(255,255,255,0.4)'}}>
              {tech.name.split(' ')[0]}
            </p>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 p-4 rounded-2xl"
        style={{background:`${t.c}12`,border:`1px solid ${t.c}30`}}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{t.e}</span>
          <div>
            <EditableText as="p" id={`bb-tech-${a}-name`} className="font-black text-white text-sm">{t.name}</EditableText>
            <EditableText as="p" id={`bb-tech-${a}-short`} className="text-xs mt-0.5" style={{color:t.c}}>{t.short}</EditableText>
          </div>
        </div>
        <EditableText as="p" multiline id={`bb-tech-${a}-desc`} className="text-xs text-white/60 leading-relaxed">{t.desc}</EditableText>
        <button className="w-full py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all"
          style={{background:t.c,boxShadow:`0 4px 16px ${t.c}40`}}>
          Provoje tani →
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   5. SI MËSON TRURI?
══════════════════════════════════════════════════════════ */
const BTOPICS = [
  {icon:'🧠',label:'Dopamine', c:'#7c3aed', desc:'Lëshohet me pritje, jo me marrje. Loop-i i motivimit dhe varësisë.'},
  {icon:'💾',label:'Memory',   c:'#3b82f6', desc:'Hipokampusi konsolidon gjatë gjumit REM. Gjumin mos e heq kurrë!'},
  {icon:'🎯',label:'Focus',    c:'#f59e0b', desc:'Prefrontal cortex + norepinefrine = fokus maksimal. Stimuloje.'},
  {icon:'😴',label:'Sleep',    c:'#6366f1', desc:'8h = BDNF +20%, memoria ×3, kortizol -40%. Nevojë biologjike.'},
  {icon:'😰',label:'Stress',   c:'#ef4444', desc:'Kortizoli kronik zvogëlon hipokampusin. Menaxho stresin aktivisht.'},
]

function SiMesonTruri() {
  const [a, setA] = useState(0)
  const t = BTOPICS[a]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 flex-wrap">
        {BTOPICS.map((b,i) => (
          <button key={b.label} onClick={() => setA(i)}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all"
            style={i===a
              ? {background:`${b.c}25`,border:`1px solid ${b.c}50`,color:b.c}
              : {background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.4)'}}>
            {b.icon} {b.label}
          </button>
        ))}
      </div>
      <div className="p-4 rounded-xl flex gap-3" style={{background:`${t.c}12`,border:`1px solid ${t.c}25`}}>
        <span className="text-3xl">{t.icon}</span>
        <div>
          <EditableText as="p" id={`bb-brain-${a}-label`} className="font-black text-white text-sm">{t.label}</EditableText>
          <EditableText as="p" multiline id={`bb-brain-${a}-desc`} className="text-xs text-white/60 mt-1 leading-relaxed">{t.desc}</EditableText>
        </div>
      </div>
      <Link to="/articles" className="text-xs text-violet-400 font-bold hover:text-violet-300 flex items-center gap-1">
        Eksploroj më shumë <ArrowRight size={10}/>
      </Link>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   6. STUDY BATTLE
══════════════════════════════════════════════════════════ */
const MISSIONS_DATA = [
  { id:1, icon:'⏱', label:'Bëj 1 sprint fokusi 25 min',     xp:100, flames:2 },
  { id:2, icon:'📖', label:'Lexo 1 artikull BrainBoost',    xp:50,  flames:1 },
  { id:3, icon:'🧪', label:'Kryej sfidën e kujtesës',       xp:75,  flames:1 },
  { id:4, icon:'🔬', label:'Zgjidh testin e trurit',        xp:60,  flames:1 },
  { id:5, icon:'💧', label:'Hid 2 gota ujë tani',           xp:30,  flames:1 },
  { id:6, icon:'😴', label:'Cakto orën e gjumit sonte',     xp:40,  flames:1 },
]

function StudyBattle() {
  const [xp, setXp]           = useState(2450)
  const [streak, setStreak]   = useState(12)
  const [flames, setFlames]   = useState(24)
  const [done, setDone]       = useState(new Set())
  const [showMissions, setShowMissions] = useState(false)
  const [flash, setFlash]     = useState(null)   // { xp, label }

  const complete = (m) => {
    if (done.has(m.id)) return
    setDone(prev => new Set([...prev, m.id]))
    setXp(x => x + m.xp)
    setFlames(f => f + m.flames)
    setFlash(m)
    setTimeout(() => setFlash(null), 1800)
  }

  const LEVELS = [
    { name:'Beginner Mind',    min:0,    max:500  },
    { name:'Focus Apprentice', min:500,  max:1500 },
    { name:'Deep Thinker',     min:1500, max:3000 },
    { name:'Neuro Master',     min:3000, max:5000 },
  ]
  const lvl  = LEVELS.reduce((a,l) => xp >= l.min ? l : a, LEVELS[0])
  const pct  = Math.min(((xp - lvl.min) / (lvl.max - lvl.min)) * 100, 100)
  const lvlN = LEVELS.findIndex(l => l === lvl) + 1

  return (
    <div className="flex flex-col gap-3 relative">

      {/* XP flash toast */}
      {flash && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-xl text-xs font-black text-white animate-bounce pointer-events-none"
          style={{background:'linear-gradient(135deg,#7c3aed,#ec4899)',boxShadow:'0 4px 16px rgba(124,58,237,0.5)'}}>
          +{flash.xp} XP 🎉
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/40">Level {lvlN}</p>
          <p className="font-black text-white text-sm">{lvl.name}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)',boxShadow:'0 4px 16px rgba(124,58,237,0.4)'}}>
          <Trophy size={17} className="text-white"/>
        </div>
      </div>

      {/* XP bar */}
      <div>
        <div className="flex justify-between text-[10px] text-white/35 mb-1">
          <span>XP: {xp.toLocaleString()}</span>
          <span>Synimi: {lvl.max.toLocaleString()}</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{width:`${pct}%`,background:'linear-gradient(90deg,#7c3aed,#ec4899)',
              boxShadow:'0 0 10px rgba(124,58,237,0.5)'}}/>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl text-center"
          style={{background:'rgba(249,115,22,0.1)',border:'1px solid rgba(249,115,22,0.2)'}}>
          <p className="text-lg">🔥</p>
          <p className="text-lg font-black text-orange-400">{streak}</p>
          <p className="text-[10px] text-white/40">Streak ditë</p>
        </div>
        <div className="p-3 rounded-xl text-center"
          style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)'}}>
          <p className="text-lg">⚡</p>
          <p className="text-lg font-black text-red-400">{flames}</p>
          <p className="text-[10px] text-white/40">Flakët e Fokusit</p>
        </div>
      </div>

      {/* Missions toggle */}
      <button onClick={() => setShowMissions(s => !s)}
        className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
        style={{background:'linear-gradient(135deg,#7c3aed,#ec4899)',
          boxShadow:'0 4px 16px rgba(124,58,237,0.35)'}}>
        <Trophy size={12}/>
        {showMissions ? 'Mbyll Misionet' : 'Shiko Misionet'}
        <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black"
          style={{background:'rgba(255,255,255,0.2)'}}>
          {done.size}/{MISSIONS_DATA.length}
        </span>
      </button>

      {/* Missions panel */}
      {showMissions && (
        <div className="flex flex-col gap-2 mt-1">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Misionet e sotme</p>
          {MISSIONS_DATA.map(m => {
            const isDone = done.has(m.id)
            return (
              <button key={m.id} onClick={() => complete(m)} disabled={isDone}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-95 disabled:cursor-default"
                style={{
                  background: isDone ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isDone ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.09)'}`,
                }}>
                <span className="text-xl shrink-0">{isDone ? '✅' : m.icon}</span>
                <div className="flex-1 min-w-0">
                  <EditableText as="p" id={`bb-mission-${m.id}-label`} className={`text-xs font-semibold leading-snug ${isDone ? 'text-emerald-400 line-through' : 'text-white/80'}`}>{m.label}</EditableText>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-0.5">
                  <span className="text-[10px] font-black text-violet-300">+{m.xp} XP</span>
                  <span className="text-[10px] text-orange-400">+{m.flames}⚡</span>
                </div>
              </button>
            )
          })}
          {done.size === MISSIONS_DATA.length && (
            <div className="text-center py-3 rounded-xl text-sm font-black text-emerald-400"
              style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)'}}>
              🏆 Të gjitha misionet komplet!
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   7. SLEEP & BRAIN
══════════════════════════════════════════════════════════ */
const SLEEP_CARDS = [
  {icon:'😴',title:'Gjumi cilësor = tru i fuqishëm',body:'Gjatë gjumit REM truri konsolidon kujtimet dhe formon lidhje të reja. "Të flemë mbi problem" funksionon: është proces biologjik.'},
  {icon:'🌙',title:'Mungesa e gjumit & fokusi',body:'Vetëm 1 natë pa gjumë të mjaftueshëm zvogëlon kapacitetin kognitiv me 30%. Amigdala bëhet 60% më reaktive ndaj stresit.'},
  {icon:'☀️',title:'Optimizo gjumin tënd',body:'Orë fikse çdo ditë (edhe fundjavë), dhomë 18°C, asnjë ekran 60 min para gjumit, kofeinë 0 pas orës 14:00.'},
]

function SleepBrain() {
  const [c, setC] = useState(0)
  const card = SLEEP_CARDS[c]
  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-xl overflow-hidden" style={{ height: '105px' }}>
        <img
          src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=70"
          alt="Sleep and brain"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.75) 0%, rgba(6,5,26,0.45) 100%)' }}/>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white font-black text-sm tracking-wide" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            Gjumi · Kujtesa · Fokusi
          </p>
        </div>
      </div>
      <div className="p-4 rounded-xl flex gap-3 min-h-[100px]"
        style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)'}}>
        <span className="text-2xl">{card.icon}</span>
        <div>
          <EditableText as="p" id={`bb-sleep-${c}-title`} className="font-bold text-white text-sm leading-snug">{card.title}</EditableText>
          <EditableText as="p" multiline id={`bb-sleep-${c}-body`} className="text-xs text-white/55 mt-1.5 leading-relaxed">{card.body}</EditableText>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {SLEEP_CARDS.map((_,i) => (
            <button key={i} onClick={() => setC(i)}
              className="w-5 h-1.5 rounded-full transition-all"
              style={{background:i===c?'#6366f1':'rgba(255,255,255,0.15)'}}/>
          ))}
        </div>
        <div className="flex gap-2">
          {[[-1,ChevronLeft],[1,ChevronRight]].map(([d,Icon]) => (
            <button key={d} onClick={() => setC(p=>(p+d+SLEEP_CARDS.length)%SLEEP_CARDS.length)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>
              <Icon size={13} className="text-white/60"/>
            </button>
          ))}
        </div>
      </div>
      <Link to="/articles/3" className="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Lexo artikullin →</Link>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   8. BRAIN HACKS
══════════════════════════════════════════════════════════ */
const HACKS = [
  {e:'💧',h:'Hid 500ml ujë para studimit. Dehidratimi zvogëlon fokusin me 25%.'},
  {e:'🚶',h:'10 min shëtitje para studimit rrit BDNF dhe memoria afatshkurtër.'},
  {e:'✋',h:'Shkruaj me dorë, jo laptop. 40% kujtim më i mirë konceptual.'},
  {e:'🎯',h:'Vendos micro-qëllim: "lexoj 5 faqe" jo "studioj" — specifik funksionon.'},
  {e:'🌡️',h:'Dhoma 20-22°C = fokus optimal. Shumë nxehtë dhe truri ngrin.'},
  {e:'👁️',h:'Rregulli 20-20-20: çdo 20 min, shiko 20m larg, 20 sekonda.'},
]

function BrainHacks() {
  const [i, setI] = useState(0)
  return (
    <div className="flex flex-col gap-3">
      <div className="p-4 rounded-xl flex gap-3 min-h-[80px]"
        style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)'}}>
        <span className="text-3xl shrink-0">{HACKS[i].e}</span>
        <EditableText as="p" multiline id={`bb-hack-${i}`} className="text-sm text-white/70 leading-relaxed">{HACKS[i].h}</EditableText>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/25">{i+1} / {HACKS.length}</p>
        <div className="flex gap-2">
          {[[-1,ChevronLeft],[1,ChevronRight]].map(([d,Icon]) => (
            <button key={d} onClick={() => setI(p=>(p+d+HACKS.length)%HACKS.length)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>
              <Icon size={13} className="text-white/60"/>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   9. DEEP FOCUS SOUNDS  –  Web Audio API engine
══════════════════════════════════════════════════════════ */
const SOUNDS = [
  { key:'rain',   icon:'🌧️', name:'Shi i lehtë',  sub:'Pika të buta · ambient qetësues'  },
  { key:'fire',   icon:'🔥',  name:'Oxhak',         sub:'Zjarr troçëllues · ngrohtësi'     },
  { key:'ocean',  icon:'🌊',  name:'Valë deti',      sub:'Dallgë të buta · meditues'        },
  { key:'forest', icon:'🌿',  name:'Pyllin natën',   sub:'Grila · natyrë e heshtur'         },
  { key:'wind',   icon:'💨',  name:'Erë e butë',     sub:'Zhurmë rozë · e fokusuar'         },
]

/* ── buffer helpers ── */
function _white(ctx, sec) {
  const sr = ctx.sampleRate, n = sr * sec
  const buf = ctx.createBuffer(1, n, sr)
  const d = buf.getChannelData(0)
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1
  return buf
}
function _brown(ctx, sec) {
  const sr = ctx.sampleRate, n = sr * sec
  const buf = ctx.createBuffer(1, n, sr)
  const d = buf.getChannelData(0); let last = 0
  for (let i = 0; i < n; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    d[i] = last * 4
  }
  return buf
}

/* ── 1. SHI I LEHTË ── */
function _startRain(ctx, gainNode) {
  const src = ctx.createBufferSource(); src.buffer = _white(ctx, 4); src.loop = true
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 700
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 8500
  const pk = ctx.createBiquadFilter(); pk.type = 'peaking';  pk.frequency.value = 2200; pk.gain.value = 5; pk.Q.value = 1.2
  const g  = ctx.createGain(); g.gain.value = 0.52
  const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.08
  const lfoG = ctx.createGain(); lfoG.gain.value = 0.11
  lfo.connect(lfoG); lfoG.connect(g.gain)
  src.connect(hp); hp.connect(lp); lp.connect(pk); pk.connect(g); g.connect(gainNode)
  src.start(); lfo.start()
  // individual droplets
  const dropId = setInterval(() => {
    if (ctx.state !== 'running') return
    const t = ctx.currentTime, n = 1 + Math.floor(Math.random() * 3)
    for (let i = 0; i < n; i++) {
      const dt = t + Math.random() * 0.22, f = 900 + Math.random() * 3200, dur = 0.022 + Math.random() * 0.05
      const o = ctx.createOscillator(); o.type = 'sine'
      o.frequency.setValueAtTime(f, dt); o.frequency.exponentialRampToValueAtTime(f * 0.3, dt + dur)
      const dg = ctx.createGain()
      dg.gain.setValueAtTime(0, dt)
      dg.gain.linearRampToValueAtTime(0.022 + Math.random() * 0.018, dt + 0.002)
      dg.gain.exponentialRampToValueAtTime(0.0001, dt + dur)
      o.connect(dg); dg.connect(gainNode); o.start(dt); o.stop(dt + dur + 0.01)
    }
  }, 170)
  return { src, oscs: [lfo], intervalId: dropId }
}

/* ── 2. OXHAK (Fireplace) ── */
function _startFire(ctx, gainNode) {
  const base = ctx.createBufferSource(); base.buffer = _brown(ctx, 5); base.loop = true
  const lp  = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; lp.Q.value = 0.6
  const bG  = ctx.createGain(); bG.gain.value = 0.42
  const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.17
  const lfoG = ctx.createGain(); lfoG.gain.value = 0.13
  lfo.connect(lfoG); lfoG.connect(bG.gain)
  base.connect(lp); lp.connect(bG); bG.connect(gainNode)
  base.start(); lfo.start()
  const crackleId = setInterval(() => {
    if (ctx.state !== 'running') return
    const t = ctx.currentTime
    const nc = Math.random() < 0.5 ? 1 : Math.random() < 0.65 ? 2 : 3
    for (let i = 0; i < nc; i++) {
      const dt = t + Math.random() * 0.32, dur = 0.007 + Math.random() * 0.032
      const frames = Math.max(1, Math.floor(ctx.sampleRate * dur))
      const cBuf = ctx.createBuffer(1, frames, ctx.sampleRate)
      const cd = cBuf.getChannelData(0)
      for (let j = 0; j < cd.length; j++) cd[j] = Math.random() * 2 - 1
      const cs = ctx.createBufferSource(); cs.buffer = cBuf
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1600 + Math.random() * 1600; bp.Q.value = 3
      const cg = ctx.createGain()
      cg.gain.setValueAtTime(0.001, dt)
      cg.gain.linearRampToValueAtTime(0.22 + Math.random() * 0.28, dt + 0.001)
      cg.gain.exponentialRampToValueAtTime(0.001, dt + dur)
      cs.connect(bp); bp.connect(cg); cg.connect(gainNode); cs.start(dt); cs.stop(dt + dur + 0.005)
    }
    if (Math.random() < 0.25) {
      const dt = t + Math.random() * 0.32
      const o  = ctx.createOscillator(); o.type = 'sine'
      o.frequency.setValueAtTime(220 + Math.random() * 160, dt)
      o.frequency.exponentialRampToValueAtTime(48, dt + 0.1)
      const pg = ctx.createGain()
      pg.gain.setValueAtTime(0.16, dt); pg.gain.exponentialRampToValueAtTime(0.001, dt + 0.1)
      o.connect(pg); pg.connect(gainNode); o.start(dt); o.stop(dt + 0.12)
    }
  }, 290)
  return { src: base, oscs: [lfo], intervalId: crackleId }
}

/* ── 3. VALË DETI ── */
function _startOcean(ctx, gainNode) {
  function wave(period, amp) {
    const src = ctx.createBufferSource(); src.buffer = _white(ctx, period + 2); src.loop = true
    const hp  = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 80
    const lp  = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 2400
    const wg  = ctx.createGain(); wg.gain.value = amp
    const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 1 / period
    const lfoG = ctx.createGain(); lfoG.gain.value = amp * 0.8
    lfo.connect(lfoG); lfoG.connect(wg.gain)
    src.connect(hp); hp.connect(lp); lp.connect(wg); wg.connect(gainNode)
    src.start(); lfo.start()
    return { src, lfo }
  }
  const w1 = wave(8, 0.30), w2 = wave(13, 0.18)
  return { srcs: [w1.src, w2.src], oscs: [w1.lfo, w2.lfo] }
}

/* ── 4. PYLLIN NATËN (Forest / Crickets) ── */
function _startForest(ctx, gainNode) {
  // soft background hum
  const src = ctx.createBufferSource(); src.buffer = _white(ctx, 5); src.loop = true
  const hp  = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 200
  const lp  = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 3500
  const amG = ctx.createGain(); amG.gain.value = 0.055
  src.connect(hp); hp.connect(lp); lp.connect(amG); amG.connect(gainNode); src.start()
  // cricket songs: 3 chirps every ~1.5 s
  const chirpId = setInterval(() => {
    if (ctx.state !== 'running') return
    const t = ctx.currentTime, baseF = 3700 + Math.random() * 700
    for (let i = 0; i < 3; i++) {
      const dt = t + i * 0.095, dur = 0.022
      const frames = Math.floor(ctx.sampleRate * dur)
      const cBuf = ctx.createBuffer(1, frames, ctx.sampleRate)
      const cd = cBuf.getChannelData(0)
      for (let j = 0; j < cd.length; j++) cd[j] = Math.random() * 2 - 1
      const cs = ctx.createBufferSource(); cs.buffer = cBuf
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = baseF + i * 60; bp.Q.value = 10
      const cg = ctx.createGain()
      cg.gain.setValueAtTime(0.001, dt)
      cg.gain.linearRampToValueAtTime(0.15, dt + 0.003)
      cg.gain.exponentialRampToValueAtTime(0.001, dt + dur)
      cs.connect(bp); bp.connect(cg); cg.connect(gainNode); cs.start(dt); cs.stop(dt + dur + 0.005)
    }
  }, 1500)
  return { src, oscs: [], intervalId: chirpId }
}

/* ── 5. ERË E BUTË ── */
function _startWind(ctx, gainNode) {
  const src  = ctx.createBufferSource(); src.buffer = _white(ctx, 6); src.loop = true
  const bp   = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = 0.55
  const lp   = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 2800
  // frequency sweep LFO: swooshes between ~220–1000 Hz
  const fLfo = ctx.createOscillator(); fLfo.type = 'sine'; fLfo.frequency.value = 0.18
  const fLfoG = ctx.createGain(); fLfoG.gain.value = 380
  fLfo.connect(fLfoG); fLfoG.connect(bp.frequency)
  // amplitude LFO: gentle gusts
  const aLfo = ctx.createOscillator(); aLfo.type = 'sine'; aLfo.frequency.value = 0.065
  const aLfoG = ctx.createGain(); aLfoG.gain.value = 0.14
  const wG = ctx.createGain(); wG.gain.value = 0.46
  aLfo.connect(aLfoG); aLfoG.connect(wG.gain)
  src.connect(bp); bp.connect(lp); lp.connect(wG); wG.connect(gainNode)
  src.start(); fLfo.start(); aLfo.start()
  return { src, oscs: [fLfo, aLfo] }
}

function _stopNodes(nodes) {
  if (!nodes) return
  try { nodes.src?.stop() } catch(_) {}
  nodes.srcs?.forEach(s => { try { s.stop() } catch(_) {} })
  nodes.oscs?.forEach(o => { try { o.stop() } catch(_) {} })
  if (nodes.intervalId != null) clearInterval(nodes.intervalId)
}

function DeepFocusSounds() {
  const { isAnonymous } = useAuth()
  const [playing, setPlaying]     = useState(null)
  const [vol, setVol]             = useState(70)
  const [customFile, setCustomFile] = useState(null)
  const ctxRef       = useRef(null)
  const nodesRef     = useRef(null)
  const keyRef       = useRef(null)
  const fileInputRef = useRef(null)
  const audioElRef   = useRef(null)
  const mediaNodeRef = useRef(null)
  const touchRef     = useRef(null)   // tracks touchstart position to distinguish tap vs scroll

  // iOS Safari: AudioContext must be created AND resumed synchronously
  // inside a user gesture handler. Any async/await breaks the gesture
  // context on iOS < 14.5, causing resume() to silently fail.
  function getCtx() {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    if (!ctxRef.current) ctxRef.current = new AC()
    return ctxRef.current
  }

  // touchstart fires before click — resume here so the context is
  // already running by the time the click handler calls start().
  useEffect(() => {
    function unlock() {
      const ctx = getCtx()
      if (!ctx || ctx.state === 'running') return
      ctx.resume().then(() => {
        try {
          const buf = ctx.createBuffer(1, 1, 22050)
          const src = ctx.createBufferSource()
          src.buffer = buf; src.connect(ctx.destination); src.start(0)
        } catch (_) {}
      })
    }
    document.addEventListener('touchstart', unlock, { passive: true })
    return () => document.removeEventListener('touchstart', unlock)
  }, [])

  function stopAll() {
    _stopNodes(nodesRef.current); nodesRef.current = null
    if (audioElRef.current) { audioElRef.current.pause(); audioElRef.current.currentTime = 0 }
    keyRef.current = null
    setPlaying(null)
  }

  function toggle(key) {
    if (keyRef.current === key) { stopAll(); return }
    stopAll()
    const ctx = getCtx()
    if (!ctx) return
    // Show playing state immediately so UI feels responsive
    keyRef.current = key
    setPlaying(key)
    const volSnap = vol  // capture before async gap
    function startNodes() {
      const g = ctx.createGain(); g.gain.value = volSnap / 100; g.connect(ctx.destination)
      let nodes
      if (key === 'rain')   nodes = _startRain(ctx, g)
      if (key === 'fire')   nodes = _startFire(ctx, g)
      if (key === 'ocean')  nodes = _startOcean(ctx, g)
      if (key === 'forest') nodes = _startForest(ctx, g)
      if (key === 'wind')   nodes = _startWind(ctx, g)
      nodesRef.current = { ...nodes, gain: g }
    }
    // resume() MUST resolve before start() on Chrome Android — nodes on a
    // suspended context are silently dropped in some Chrome versions.
    if (ctx.state === 'running') {
      startNodes()
    } else {
      ctx.resume().then(startNodes).catch(() => { keyRef.current = null; setPlaying(null) })
    }
  }

  function handleCustomClick() {
    if (!customFile) { fileInputRef.current?.click(); return }
    if (playing === 'custom') { stopAll(); return }
    stopAll()
    const ctx = getCtx()
    if (!ctx) return
    keyRef.current = 'custom'
    setPlaying('custom')
    const volSnap = vol
    function startCustom() {
      const g = ctx.createGain(); g.gain.value = volSnap / 100; g.connect(ctx.destination)
      if (!mediaNodeRef.current) {
        mediaNodeRef.current = ctx.createMediaElementSource(audioElRef.current)
      }
      mediaNodeRef.current.connect(g)
      nodesRef.current = { gain: g }
      audioElRef.current.currentTime = 0
      audioElRef.current.play()
    }
    if (ctx.state === 'running') {
      startCustom()
    } else {
      ctx.resume().then(startCustom).catch(() => { keyRef.current = null; setPlaying(null) })
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (customFile?.url) URL.revokeObjectURL(customFile.url)
    stopAll()
    mediaNodeRef.current = null
    const url   = URL.createObjectURL(file)
    const audio = new Audio(url)
    audio.loop  = true
    audioElRef.current = audio
    const name  = file.name.replace(/\.[^.]+$/, '')
    setCustomFile({ name, url })
    // file-input close counts as a user gesture on most browsers
    const ctx = getCtx()
    if (ctx) {
      if (ctx.state !== 'running') ctx.resume()
      const g   = ctx.createGain(); g.gain.value = vol / 100; g.connect(ctx.destination)
      const node = ctx.createMediaElementSource(audio)
      node.connect(g)
      mediaNodeRef.current = node
      nodesRef.current     = { gain: g }
      audio.play()
      keyRef.current = 'custom'
      setPlaying('custom')
    }
    e.target.value = ''
  }

  function removeCustom(ev) {
    ev.stopPropagation()
    stopAll()
    if (customFile?.url) URL.revokeObjectURL(customFile.url)
    mediaNodeRef.current = null
    audioElRef.current   = null
    setCustomFile(null)
  }

  useEffect(() => {
    if (nodesRef.current?.gain) nodesRef.current.gain.gain.value = vol / 100
  }, [vol])

  useEffect(() => () => {
    _stopNodes(nodesRef.current)
    audioElRef.current?.pause()
    if (customFile?.url) URL.revokeObjectURL(customFile.url)
    ctxRef.current?.close()
  }, [])

  // onTouchEnd fires inside the real iOS gesture context (before the synthetic
  // click). preventDefault stops the duplicate click from also calling toggle().
  function handleTouchStart(e) {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  function makeTouchEnd(fn) {
    return function(e) {
      if (!touchRef.current) return
      const dx = Math.abs(e.changedTouches[0].clientX - touchRef.current.x)
      const dy = Math.abs(e.changedTouches[0].clientY - touchRef.current.y)
      touchRef.current = null
      if (dx < 12 && dy < 12) { e.preventDefault(); fn() }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {SOUNDS.map(s => (
        <button key={s.key}
          onTouchStart={handleTouchStart}
          onTouchEnd={makeTouchEnd(() => toggle(s.key))}
          onClick={() => toggle(s.key)}
          className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
          style={playing===s.key
            ? {background:'rgba(124,58,237,0.2)',border:'1px solid rgba(167,139,250,0.4)'}
            : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
          <span className="text-lg w-7 text-center">{s.icon}</span>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-white">{s.name}</p>
            <p className="text-[10px] text-white/40">{s.sub}</p>
          </div>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{background:playing===s.key?'#7c3aed':'rgba(255,255,255,0.08)'}}>
            {playing===s.key
              ? <Pause size={9} className="text-white"/>
              : <Play  size={9} className="text-white/60"/>}
          </div>
        </button>
      ))}

      {/* ── Custom upload row — hidden for anonymous users ── */}
      {!isAnonymous && <>
      <input ref={fileInputRef} type="file" accept="audio/*,video/mp4,.mp4,.mp3,.wav,.ogg,.m4a"
        className="hidden" onChange={handleFileChange} />
      <button
        onTouchStart={handleTouchStart}
        onTouchEnd={makeTouchEnd(handleCustomClick)}
        onClick={handleCustomClick}
        className="flex items-center gap-3 p-2.5 rounded-xl transition-all mt-0.5"
        style={playing==='custom'
          ? {background:'rgba(124,58,237,0.2)',border:'1px solid rgba(167,139,250,0.4)'}
          : customFile
            ? {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}
            : {background:'rgba(255,255,255,0.02)',border:'1px dashed rgba(255,255,255,0.18)'}}>
        <span className="text-lg w-7 text-center">{customFile ? '🎶' : '📁'}</span>
        <div className="flex-1 text-left min-w-0">
          {customFile ? (
            <>
              <p className="text-xs font-bold text-white truncate">{customFile.name}</p>
              <p className="text-[10px] text-white/40">Tingulli yt · loop aktiv</p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-white/50">Ngarko tingullin tënd</p>
              <p className="text-[10px] text-white/30">MP4, MP3, WAV, OGG, M4A…</p>
            </>
          )}
        </div>
        {customFile ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={removeCustom}
              className="w-5 h-5 rounded-md flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
              style={{background:'rgba(255,255,255,0.06)'}}>
              <X size={8}/>
            </button>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{background:playing==='custom'?'#7c3aed':'rgba(255,255,255,0.08)'}}>
              {playing==='custom'
                ? <Pause size={9} className="text-white"/>
                : <Play  size={9} className="text-white/60"/>}
            </div>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{background:'rgba(255,255,255,0.06)'}}>
            <Upload size={9} className="text-white/40"/>
          </div>
        )}
      </button>
      </>}

      {/* ── Volume ── */}
      <div className="flex items-center gap-2 pt-1">
        <VolumeX size={11} className="text-white/30"/>
        <input type="range" min={0} max={100} value={vol} onChange={e=>setVol(+e.target.value)}
          className="flex-1 h-1 appearance-none rounded-full cursor-pointer accent-violet-500"
          style={{background:`linear-gradient(90deg,#7c3aed ${vol}%,rgba(255,255,255,0.1) ${vol}%)`}}/>
        <Volume2 size={11} className="text-white/30"/>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   10. FOCUS ANALYTICS
══════════════════════════════════════════════════════════ */
function FocusAnalytics() {
  const [period, setPeriod] = useState('Ditë')
  const DATA = {
    'Ditë': [3,5,2,7,4,6,5],
    'Javë': [20,35,28,42,31,25,38],
    'Muaj': [85,92,78,110,95,88,102],
  }
  const vals = DATA[period]
  const max  = Math.max(...vals)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {Object.keys(DATA).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
            style={p===period
              ? {background:'rgba(124,58,237,0.25)',color:'#c4b5fd',border:'1px solid rgba(167,139,250,0.35)'}
              : {background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.35)',border:'1px solid rgba(255,255,255,0.08)'}}>
            {p}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-1.5 h-20 px-1">
        {vals.map((v,i) => (
          <div key={i} className="flex-1 rounded-t-md transition-all duration-700"
            style={{height:`${(v/max)*72}px`,
              background:i===vals.length-1?'linear-gradient(180deg,#a78bfa,#7c3aed)':'rgba(167,139,250,0.25)',
              boxShadow:i===vals.length-1?'0 0 12px rgba(124,58,237,0.5)':'none'}}/>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[{l:'Fokus',v:'7.2 h',c:'#a78bfa'},{l:'Mësim',v:'5.1 h',c:'#3b82f6'},{l:'Energji',v:'75%',c:'#10b981'},{l:'Distr.',v:'23 min',c:'#f43f5e'}].map(s=>(
          <div key={s.l} className="text-center">
            <p className="text-xs font-black" style={{color:s.c}}>{s.v}</p>
            <p className="text-[9px] text-white/35">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   11. BRAINTYPE TEST
══════════════════════════════════════════════════════════ */
const BTQ = [
  {q:'Si mëson më mirë?',opts:['Grafikë & Diagrame','Dëgjim leksionesh','Analiza logjike','Eksperimentim']},
  {q:'Kur studion zakonisht?',opts:['Gjatë ditës','Natën vonë','Herët mëngjes','Kur e ndiej']},
  {q:'Si mban shënime?',opts:['Mind maps & vizuale','Audio rekordim','Lista & hapa','Praktikë direkte']},
]
const BT_RES = [
  {type:'Visual',   icon:'👁',c:'#a78bfa',tip:'Përdor mind maps, diagrame dhe ngjyra të shumta.'},
  {type:'Auditory', icon:'👂',c:'#3b82f6',tip:'Dëgjo podcast, lexo me zë të lartë, rekordo.'},
  {type:'Analytical',icon:'🔍',c:'#10b981',tip:'Strukturo gjithçka me lista, hapa dhe framework.'},
  {type:'Practical', icon:'🛠',c:'#f59e0b',tip:'Mëso duke bërë: projekte reale > lexim pasiv.'},
]

function BrainTypeTest() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult]   = useState(null)

  const answer = (i) => {
    const next = [...answers,i]
    if (step < BTQ.length-1) { setAnswers(next); setStep(s=>s+1) }
    else {
      const counts = [0,0,0,0]
      next.forEach(a => counts[a]++)
      setResult(BT_RES[counts.indexOf(Math.max(...counts))])
    }
  }
  const reset = () => { setStep(0); setAnswers([]); setResult(null) }

  if (result) return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
        style={{background:`${result.c}18`,border:`1px solid ${result.c}40`}}>
        {result.icon}
      </div>
      <div className="text-center">
        <p className="text-xs text-white/40 mb-1">Stili yt i të mësuarit</p>
        <p className="text-xl font-black" style={{color:result.c}}>{result.type}</p>
        <p className="text-xs text-white/55 mt-2 leading-relaxed">{result.tip}</p>
      </div>
      <button onClick={reset} className="text-xs text-violet-400 font-bold hover:text-violet-300">Bëj Testin Sërisht</button>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 mb-1">
        {BTQ.map((_,i) => (
          <div key={i} className="flex-1 h-1 rounded-full" style={{background:i<=step?'#7c3aed':'rgba(255,255,255,0.1)'}}/>
        ))}
      </div>
      <p className="text-sm font-bold text-white">{BTQ[step].q}</p>
      <div className="grid grid-cols-2 gap-2">
        {BTQ[step].opts.map((opt,i) => (
          <button key={opt} onClick={() => answer(i)}
            className="p-2.5 rounded-xl text-xs font-semibold text-center transition-all hover:border-violet-500/50"
            style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.75)'}}>
            {opt}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-white/25 text-center">{step+1} / {BTQ.length}</p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   12. QUICK RECALL CHALLENGE
══════════════════════════════════════════════════════════ */
const WSETS = [
  ['Amigdala','Neuron','Sinaps','Dopamina','Kortizol'],
  ['Fokus','Kujtesë','Motivim','Qëllim','Zakon'],
  ['Mindfulness','Meditim','Vetëdija','Qetësi','Pranë'],
]

function QuickRecallChallenge() {
  const [phase, setPhase] = useState('idle')
  const [words, setWords] = useState([])
  const [timer, setTimer] = useState(10)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(null)
  const iv = useRef(null)

  const start = () => {
    const set = WSETS[Math.floor(Math.random()*WSETS.length)]
    setWords(set); setPhase('show'); setTimer(10); setInput(''); setScore(null)
    iv.current = setInterval(() => setTimer(t => {
      if (t<=1) { clearInterval(iv.current); setPhase('recall'); return 0 }
      return t-1
    }), 1000)
  }
  const submit = () => {
    const typed   = input.toLowerCase().split(/[\s,]+/).filter(Boolean)
    const matched = words.filter(w => typed.some(t => w.toLowerCase().startsWith(t.slice(0,4)) || t.startsWith(w.toLowerCase().slice(0,4)))).length
    setScore(matched); setPhase('result')
  }
  const reset = () => { setPhase('idle'); setWords([]); setTimer(10); setInput(''); setScore(null) }
  useEffect(() => () => clearInterval(iv.current), [])

  return (
    <div className="flex flex-col gap-3">
      {phase==='idle' && (
        <>
          <EditableText as="p" id="bb-recall-desc" className="text-xs text-white/50 leading-relaxed">5 fjalë shfaqen 10 sekonda. Mbaji mend, pastaj shkruaji!</EditableText>
          <button onClick={start} className="w-full py-2.5 rounded-xl font-bold text-sm text-white"
            style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)',boxShadow:'0 4px 16px rgba(124,58,237,0.3)'}}>
            <EditableText id="bb-recall-btn">Fillo Sfidën ⚡</EditableText>
          </button>
        </>
      )}
      {phase==='show' && (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="text-4xl font-black text-violet-300">{timer}s</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {words.map(w => (
              <span key={w} className="px-3 py-1.5 rounded-xl text-sm font-bold text-violet-200"
                style={{background:'rgba(124,58,237,0.2)',border:'1px solid rgba(167,139,250,0.35)'}}>
                {w}
              </span>
            ))}
          </div>
          <p className="text-xs text-white/30 animate-pulse">Mbaj mend!</p>
        </div>
      )}
      {phase==='recall' && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-white">Shkruaj fjalët që mbajte mend:</p>
          <textarea value={input} onChange={e=>setInput(e.target.value)} rows={3}
            placeholder="Shkruaj fjalët, të ndara me presje..."
            className="w-full p-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white/80 resize-none focus:outline-none focus:border-violet-500/50 placeholder:text-white/20"/>
          <button onClick={submit} className="w-full py-2 rounded-xl font-bold text-sm text-white"
            style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>Kontroll</button>
        </div>
      )}
      {phase==='result' && (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="text-5xl font-black" style={{color:score>=4?'#10b981':score>=2?'#f59e0b':'#ef4444'}}>{score}/5</div>
          <p className="text-sm font-bold text-white">{score>=4?'Shkëlqyeshëm! 🏆':score>=2?'Mirë! 👍':'Provo sërisht!'}</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {words.map(w=><span key={w} className="px-2 py-0.5 rounded-lg text-xs text-white/60"
              style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>{w}</span>)}
          </div>
          <button onClick={reset} className="text-xs text-violet-400 font-bold hover:text-violet-300">Provo Sërisht</button>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   13. NEUROPULSE FOR BRAIN
══════════════════════════════════════════════════════════ */
const PULSE_STATES = {
  fokus:    {c:'#7c3aed',g:'rgba(124,58,237,0.7)', label:'Fokus',    bars:[0.9,0.3,0.7,0.5]},
  clarity:  {c:'#10b981',g:'rgba(16,185,129,0.7)',  label:'Clarity',  bars:[0.85,0.2,0.9,0.8]},
  overload: {c:'#ef4444',g:'rgba(239,68,68,0.7)',   label:'Overload', bars:[0.4,0.9,0.3,0.2]},
  memory:   {c:'#3b82f6',g:'rgba(59,130,246,0.7)',  label:'Memory',   bars:[0.7,0.4,0.6,0.95]},
}

function NeuroPulse() {
  const [state, setState] = useState('fokus')
  const s = PULSE_STATES[state]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center py-2">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full animate-pulse"
            style={{background:`radial-gradient(circle at 35% 35%,${s.c}cc,${s.c}44)`,
              boxShadow:`0 0 40px ${s.g},0 0 80px ${s.g}50`}}/>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <Brain size={22} className="text-white"/>
            <p className="text-[10px] font-black text-white">{s.label}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['Fokus','Clarity','Memory','Overload'].map((l,i) => (
          <div key={l}>
            <div className="flex justify-between text-[9px] text-white/40 mb-1">
              <EditableText id={`bb-pulse-bar-${i}`} className="text-[9px] text-white/40">{l}</EditableText>
              <span>{Math.round(s.bars[i]*100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{width:`${s.bars[i]*100}%`,background:s.c}}/>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(PULSE_STATES).map(([k,v]) => (
          <button key={k} onClick={() => setState(k)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all"
            style={state===k
              ? {background:`${v.c}25`,border:`1px solid ${v.c}50`,color:v.c}
              : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.35)'}}>
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   14. WHY YOU FORGET
══════════════════════════════════════════════════════════ */
const FORGET_REASONS = [
  {icon:'📉',title:'Kurba e harresës',body:'Harrojmë 70% brenda 24h pa përsëritje. Spaced repetition e zgjidh.'},
  {icon:'⚡',title:'Interferenca',body:'Info e re shtyn të vjetrën nga memoria afatshkurtër. Ndaro materialet.'},
  {icon:'😴',title:'Gjumi i pamjaftueshëm',body:'Pa gjumë REM, hipokampusi nuk transferon kujtesën afatgjatë.'},
]

function WhyYouForget() {
  const [open, setOpen] = useState(0)
  return (
    <div className="flex flex-col gap-2">
      {FORGET_REASONS.map((r,i) => (
        <div key={r.title}>
          <button onClick={() => setOpen(open===i?-1:i)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
            style={{background:open===i?'rgba(124,58,237,0.12)':'rgba(255,255,255,0.04)',
              border:`1px solid ${open===i?'rgba(167,139,250,0.25)':'rgba(255,255,255,0.08)'}`}}>
            <span className="text-lg">{r.icon}</span>
            <EditableText id={`bb-forget-${i}-title`} className="text-xs font-bold text-white flex-1">{r.title}</EditableText>
            <ChevronRight size={12} className={`text-white/30 transition-transform ${open===i?'rotate-90':''}`}/>
          </button>
          {open===i && (
            <div className="px-4 py-2.5 text-xs text-white/55 leading-relaxed"
              style={{background:'rgba(124,58,237,0.06)',borderLeft:'2px solid rgba(167,139,250,0.3)'}}>
              <EditableText as="span" multiline id={`bb-forget-${i}-body`} className="text-xs text-white/55 leading-relaxed">{r.body}</EditableText>
            </div>
          )}
        </div>
      ))}
      <EditableText as="p" id="bb-forget-footer" className="text-[10px] text-white/25 pt-1">Zgjidhja: Active Recall + Spaced Repetition çdo ditë.</EditableText>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   15. RESET BRAIN
══════════════════════════════════════════════════════════ */
const RESET_STEPS = [
  '🌬 Frymëmarrje 4-7-8: frymëzim 4s, mbajtje 7s, nxjerrje 8s',
  '👁 Shiko dritare / horizont 20 sekonda — relakso sytë',
  '💪 Shtrij krahët lart, ndrysho pozicionin e trupit',
  '💧 Çohu, pi ujë — hidratimi rrit fokusit 14%',
  '🎯 Vendos 1 detyrë mikro: "bëj vetëm këtë 10 minuta"',
]

function ResetBrain() {
  const [active, setActive]   = useState(false)
  const [seconds, setSeconds] = useState(60)
  const [stepIdx, setStepIdx] = useState(0)
  const iv = useRef(null)

  const start = () => {
    setActive(true); setSeconds(60); setStepIdx(0)
    let t = 60
    iv.current = setInterval(() => {
      t--
      setSeconds(t)
      setStepIdx(Math.min(Math.floor((60-t)/12), RESET_STEPS.length-1))
      if (t<=0) clearInterval(iv.current)
    }, 1000)
  }
  useEffect(() => () => clearInterval(iv.current), [])

  const pct = ((60-seconds)/60)*100
  const r   = 34
  const circ= 2*Math.PI*r

  if (!active) return (
    <div className="flex flex-col items-center gap-4 text-center py-2">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)'}}>
        <AlertCircle size={24} className="text-red-400"/>
      </div>
      <div>
        <EditableText as="p" id="bb-reset-title" className="font-black text-white text-sm">Nuk po mundem të foksohem</EditableText>
        <EditableText as="p" id="bb-reset-subtitle" className="text-xs text-white/45 mt-1">5 hapa shkencore — 60 sekonda reset i plotë</EditableText>
      </div>
      <button onClick={start} className="w-full py-2.5 rounded-xl font-bold text-sm text-white"
        style={{background:'linear-gradient(135deg,#ef4444,#dc2626)',boxShadow:'0 4px 16px rgba(239,68,68,0.3)'}}>
        <EditableText id="bb-reset-btn">Reset Brain — 60s</EditableText>
      </button>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative w-20 h-20">
        <svg width="80" height="80" className="-rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" strokeWidth="5" stroke="rgba(255,255,255,0.07)"/>
          <circle cx="40" cy="40" r={r} fill="none" strokeWidth="5"
            stroke={seconds===0?'#10b981':'#ef4444'} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
            style={{filter:`drop-shadow(0 0 8px ${seconds===0?'#10b98180':'rgba(239,68,68,0.6)'})`}}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-white">{seconds}s</span>
        </div>
      </div>
      <div className="text-center px-2">
        {seconds===0
          ? <EditableText as="p" id="bb-reset-done" className="text-emerald-400 font-black text-sm">Reset komplet! 🎯 Rifillo tani.</EditableText>
          : <EditableText as="p" id={`bb-reset-step-${stepIdx}`} className="text-xs font-bold text-white leading-relaxed animate-pulse">{RESET_STEPS[stepIdx]}</EditableText>
        }
      </div>
      {seconds===0 && (
        <button onClick={() => { setActive(false); setSeconds(60) }}
          className="text-xs text-white/40 hover:text-white/60">Mbyll</button>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   16. LEVEL UP YOUR BRAIN
══════════════════════════════════════════════════════════ */
const LEVELS = [
  {name:'Beginner Mind',    icon:'🌱',xp:0,    c:'#6ee7b7'},
  {name:'Focus Apprentice', icon:'📚',xp:500,  c:'#3b82f6'},
  {name:'Deep Thinker',     icon:'🧠',xp:1500, c:'#7c3aed'},
  {name:'Neuro Master',     icon:'⚡',xp:3000, c:'#f59e0b'},
]

function LevelUp() {
  const xp      = 2450
  const current = LEVELS.reduce((a,l) => xp>=l.xp ? l : a, LEVELS[0])
  const nextIdx = LEVELS.findIndex(l=>l===current)+1
  const next    = LEVELS[nextIdx]
  const pct     = next ? ((xp-current.xp)/(next.xp-current.xp))*100 : 100

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 p-4 rounded-2xl"
        style={{background:`${current.c}12`,border:`1px solid ${current.c}30`}}>
        <span className="text-3xl">{current.icon}</span>
        <div className="flex-1">
          <EditableText as="p" id="bb-levelup-label" className="text-[10px] text-white/40">Niveli yt tani</EditableText>
          <p className="font-black text-lg text-white">{current.name}</p>
          {next && (
            <>
              <div className="flex justify-between text-[10px] text-white/30 mt-2 mb-1">
                <span>{xp.toLocaleString()} XP</span><span>{next.xp.toLocaleString()} XP</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{width:`${pct}%`,background:`linear-gradient(90deg,${current.c},${next.c})`,boxShadow:`0 0 10px ${current.c}60`}}/>
              </div>
              <p className="text-[10px] text-white/30 mt-1">Niveli tjetër: {next.name} — edhe {(next.xp-xp).toLocaleString()} XP</p>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {LEVELS.map((l) => {
          const done = xp >= l.xp
          const act  = l === current
          return (
            <div key={l.name} className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all"
                style={{background:done?`${l.c}20`:'rgba(255,255,255,0.05)',
                  border:`1px solid ${done?l.c+'50':'rgba(255,255,255,0.08)'}`,
                  boxShadow:act?`0 0 24px ${l.c}50`:'none'}}>
                {done ? l.icon : <Lock size={14} className="text-white/20"/>}
              </div>
              <p className="text-[9px] font-bold text-center leading-tight"
                style={{color:done?l.c:'rgba(255,255,255,0.25)'}}>
                {l.name.split(' ').map(w=>w[0]).join('')}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   17. AI STUDY COACH
══════════════════════════════════════════════════════════ */
const AI_PLANS = {
  'provim nesër':       {blocks:['17:00–19:00 → Active Recall + Cornell','20:00–21:00 → Spaced Rep (Anki)','21:30 → Rishikim final 30 min'],tip:'Gjumë 22:30. Kofeinë 0 pas 16:00. Mëngjesi është aleati yt.'},
  'provim javë tjetër': {blocks:['Sot → Feynman 2 kapituj','Nesër → Spaced Rep + Mind Map','Javë → 2 mock teste + rishikim'],tip:'Interleaving: ndërkëmbi kapitujt. Pushim çdo 90 min.'},
  default:              {blocks:['1 → Vendos qëllim mikro sot','2 → 25 min Pomodoro × 4','3 → Rishikim i shkurtër mbrëmje'],tip:'Vendos telefon larg. Ambient sound + 0 njoftime.'},
}

function AIStudyCoach() {
  const [goal, setGoal]     = useState('')
  const [plan, setPlan]     = useState(null)
  const [loading, setLoad]  = useState(false)

  const generate = () => {
    if (!goal.trim()) return
    setLoad(true)
    setTimeout(() => {
      const key = Object.keys(AI_PLANS).find(k => k!=='default' && goal.toLowerCase().includes(k))
      setPlan(AI_PLANS[key||'default'])
      setLoad(false)
    }, 1100)
  }

  return (
    <div className="flex flex-col gap-3">
      {!plan ? (
        <>
          <EditableText as="p" id="bb-coach-desc" className="text-xs text-white/50">Shkruaj qëllimin tënd (p.sh. "Kam provim nesër")</EditableText>
          <input value={goal} onChange={e=>setGoal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&generate()}
            placeholder='"Kam provim nesër"'
            className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white/80 focus:outline-none focus:border-violet-500/50 placeholder:text-white/20"/>
          <button onClick={generate} disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)',boxShadow:'0 4px 16px rgba(124,58,237,0.3)'}}>
            {loading ? '⚡ Krijon planin...' : 'Krijo Planin'}
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-violet-300">📋 Plani yt personal:</p>
          {plan.blocks.map((b,i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg"
              style={{background:'rgba(124,58,237,0.1)',border:'1px solid rgba(167,139,250,0.15)'}}>
              <span className="text-xs text-violet-400 font-black mt-0.5">{i+1}</span>
              <span className="text-xs text-white/70 leading-relaxed">{b}</span>
            </div>
          ))}
          <div className="p-2.5 rounded-lg" style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)'}}>
            <p className="text-[10px] font-bold text-emerald-400 mb-1">💡 Tips</p>
            <p className="text-xs text-white/55">{plan.tip}</p>
          </div>
          <button onClick={() => {setPlan(null);setGoal('')}} className="text-xs text-violet-400 font-bold hover:text-violet-300">
            Krijo plan tjetër
          </button>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   18. TODAY'S BRAIN TIP
══════════════════════════════════════════════════════════ */
const TIPS = [
  {icon:'🧠',c:'#7c3aed',tip:'"Truri yt është si një muskul — sa më shumë e stërvit, aq më fortë bëhet."',tag:'Neuroplasticitet'},
  {icon:'💧',c:'#3b82f6',tip:'"Hidratimi optimal (2.5L/ditë) rrit kapacitetin kognitiv me 14%."',tag:'Neuroshkencë'},
  {icon:'🎯',c:'#f59e0b',tip:'"Çdo qëllim i madh fillon me 1 hap i vogël. Fillo tani, perfeksionoje pastaj."',tag:'Produktivitet'},
  {icon:'😴',c:'#6366f1',tip:'"Gjumi 8h = memoria 3× + kortizol -40%. Jo luksi, nevojë biologjike."',tag:'Gjumë'},
  {icon:'🌊',c:'#10b981',tip:'"Flow state aktivizohet me detyrë që sfidon 4% mbi nivelin tënd actual."',tag:'Flow State'},
]

function TodaysBrainTip() {
  const [i, setI] = useState(() => new Date().getDate() % TIPS.length)
  const tip = TIPS[i]
  return (
    <div className="flex flex-col gap-4">
      <div className="p-5 rounded-2xl text-center" style={{background:`${tip.c}12`,border:`1px solid ${tip.c}30`}}>
        <div className="text-4xl mb-3">{tip.icon}</div>
        <EditableText as="p" multiline id={`bb-tip-${i}-text`} className="text-sm text-white/80 leading-relaxed font-medium italic">{tip.tip}</EditableText>
        <span className="inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-bold"
          style={{background:`${tip.c}20`,color:tip.c,border:`1px solid ${tip.c}35`}}>
          <EditableText id={`bb-tip-${i}-tag`} style={{color:tip.c}}>{tip.tag}</EditableText>
        </span>
      </div>
      <div className="flex gap-1.5 justify-center">
        {TIPS.map((_,j) => (
          <button key={j} onClick={() => setI(j)}
            className="w-6 h-1.5 rounded-full transition-all"
            style={{background:j===i?tip.c:'rgba(255,255,255,0.12)'}}/>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   VIDEO CARD
══════════════════════════════════════════════════════════ */
function VideoCard({ youtubeId, title, speaker, duration, category, color = '#7c3aed' }) {
  const [active, setActive] = useState(false)
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <div className="relative cursor-pointer group" style={{ aspectRatio: '16/9' }}
        onClick={() => !active && setActive(true)}>
        {active ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&color=white`}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={{ border: 'none', display: 'block' }}
          />
        ) : (
          <>
            <img src={thumb} alt={title} className="w-full h-full object-cover" style={{ display: 'block' }}/>
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.08) 55%)' }}/>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.35)' }}>
                <Play size={20} className="text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: color + '30', color, border: `1px solid ${color}50` }}>
                {category}
              </span>
              <p className="text-white font-black text-sm leading-snug mt-1.5 line-clamp-2">{title}</p>
              <p className="text-white/50 text-[10px] mt-1 flex items-center gap-1.5">
                <span>{speaker}</span><span>·</span><Clock size={9}/><span>{duration}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   CARD WRAPPER
══════════════════════════════════════════════════════════ */
function Card({ id, icon, title, children, accent, className='' }) {
  const accentBg  = accent ? `${accent}09` : 'rgba(255,255,255,0.04)'
  const accentBor = accent ? `1px solid ${accent}20` : '1px solid rgba(255,255,255,0.09)'
  const titleId   = id ? `bb-card-${id}-title` : undefined
  return (
    <div id={id} className={`p-5 rounded-3xl flex flex-col gap-3 ${className}`}
      style={{background:accentBg, border:accentBor, boxShadow:'0 4px 24px rgba(0,0,0,0.2)'}}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
          style={{background:accent?`${accent}22`:'rgba(255,255,255,0.07)',border:`1px solid ${accent||'rgba(255,255,255,0.12)'}`}}>
          {icon}
        </div>
        <EditableText as="p" id={titleId} className="font-black text-white text-sm">{title}</EditableText>
      </div>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function BrainBoost() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})

  const NAV = [
    {id:'focus-sprint',   label:'Sprint Fokusi',        icon:'⏱'},
    {id:'mental-energy',  label:'Energjia Mendore',     icon:'⚡'},
    {id:'anti-dist',      label:'Kundër Shpërhapjes',   icon:'🛡'},
    {id:'memory-boost',   label:'Forcimi i Kujtesës',   icon:'🧠'},
    {id:'si-meson',       label:'Si Mëson Truri?',      icon:'🔬'},
    {id:'study-battle',   label:'Sfida e Studimit',     icon:'🏆'},
  ]

  return (
    <div className="min-h-screen" style={{background:BG}}>
      {/* ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{background:'rgba(124,58,237,0.04)',filter:'blur(100px)'}}/>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full"
          style={{background:'rgba(59,130,246,0.04)',filter:'blur(80px)'}}/>
        <div className="absolute top-2/3 left-1/2 w-48 h-48 rounded-full"
          style={{background:'rgba(236,72,153,0.03)',filter:'blur(80px)'}}/>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pb-24" style={{zIndex:1}}>

        {/* ── HERO ── */}
        <div className="pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{background:'rgba(124,58,237,0.15)',border:'1px solid rgba(124,58,237,0.3)'}}>
            <Zap size={12} className="text-violet-400"/>
            <span className="text-[11px] font-black text-violet-300 uppercase tracking-widest">Performanca Kognitive</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-none tracking-tight">
            Brain<span className="bg-gradient-to-r from-violet-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Boost</span>
          </h1>
          <EditableText as="p" id="bb-hero-subtitle" className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed mb-1">Optimizo Trurin Tënd. Përmirëso Fokusin, Kujtesën dhe Performancën.</EditableText>
          <EditableText as="p" id="bb-hero-desc" className="text-white/30 text-sm">Mjetet, teknikat dhe udhëzimet më të mira bazuar në shkencë dhe AI.</EditableText>
        </div>

        {/* ── QUICK NAV ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8" style={{scrollbarWidth:'none'}}>
          {NAV.map(t => (
            <button key={t.id} onClick={() => scrollTo(t.id)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
              style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.65)'}}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ── HERO BANNER ── */}
        <div className="relative rounded-3xl overflow-hidden mb-6">
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1400&q=75"
            alt="Neural connections"
            className="w-full object-cover"
            style={{ height: '210px', filter: 'hue-rotate(20deg) saturate(1.3)' }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(7,4,26,0.94) 0%, rgba(13,5,32,0.5) 55%, rgba(7,4,26,0.85) 100%)' }}/>
          <div className="absolute inset-0 flex items-center px-8 sm:px-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"/>
                <span className="text-[10px] font-black text-violet-300 uppercase tracking-widest">Neuroshkenca e Aplikuar</span>
              </div>
              <h2 className="text-white font-black text-xl sm:text-2xl leading-tight mb-2">
                Optimizo çdo aspekt të<br/>performancës kognitive
              </h2>
              <p className="text-white/45 text-xs leading-relaxed">
                Bazuar në kërkimet nga Harvard, MIT dhe Stanford.
              </p>
            </div>
          </div>
        </div>

        {/* ── ROW 1: Focus Sprint · Mental Energy · Anti-Distraction ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card id="focus-sprint" icon={<Timer size={13} className="text-violet-400"/>} title="Sprint Fokusi" accent="#7c3aed">
            <FocusSprint/>
          </Card>
          <Card id="mental-energy" icon={<Battery size={13} className="text-amber-400"/>} title="Skaneri i Energjisë Mendore" accent="#f59e0b">
            <MentalEnergyScanner/>
          </Card>
          <Card id="anti-dist" icon={<Shield size={13} className="text-red-400"/>} title="Mënyra Anti-Shpërhapje" accent="#ef4444">
            <AntiDistraction/>
          </Card>
        </div>

        {/* ── ROW 2: Memory Boost full width ── */}
        <div className="mb-4">
          <Card id="memory-boost" icon={<Brain size={13} className="text-blue-400"/>} title="Teknikat e Forcimit të Kujtesës" accent="#3b82f6">
            <MemoryBoost/>
          </Card>
        </div>

        {/* ── ROW 3: 4 cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card id="si-meson" icon="🔬" title="Si Mëson Truri?"><SiMesonTruri/></Card>
          <Card id="study-battle" icon={<Trophy size={13} className="text-violet-400"/>} title="Sfida e Studimit" accent="#7c3aed"><StudyBattle/></Card>
          <Card icon="🌙" title="Gjumi & Truri"><SleepBrain/></Card>
          <Card icon="💡" title="Truket e Trurit"><BrainHacks/></Card>
        </div>

        {/* ── ROW 4: Sounds · Analytics · BrainType ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card icon={<Headphones size={13} className="text-violet-400"/>} title="Deep Focus Sounds"><DeepFocusSounds/></Card>
          <Card icon={<BarChart2 size={13} className="text-violet-400"/>} title="Focus Analytics"><FocusAnalytics/></Card>
          <Card icon={<Eye size={13} className="text-emerald-400"/>} title="BrainType Test" accent="#10b981"><BrainTypeTest/></Card>
        </div>

        {/* ── VIDEO SECTION ── */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }}/>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
              <Play size={10} className="text-violet-400" fill="#7c3aed"/>
              <span className="text-[10px] font-black text-violet-300 uppercase tracking-widest">Video Edukative</span>
            </div>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VideoCard
              youtubeId="U6PoUg7jXsA"
              title="Feats of Memory Anyone Can Do"
              speaker="Joshua Foer · TED"
              duration="20 min"
              category="Kujtesa"
              color="#7c3aed"
            />
            <VideoCard
              youtubeId="5MgBikgcWnY"
              title="The First 20 Hours — How to Learn Anything"
              speaker="Josh Kaufman · TEDx"
              duration="19 min"
              category="Mësim i Shpejtë"
              color="#3b82f6"
            />
            <VideoCard
              youtubeId="5BoNavXmFBo"
              title="Sleep Is Your Superpower"
              speaker="Matt Walker · TED"
              duration="19 min"
              category="Gjumi & Truri"
              color="#6366f1"
            />
          </div>
        </div>

        {/* ── ROW 5: 4 cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card icon="⚡" title="Quick Recall Challenge"><QuickRecallChallenge/></Card>
          <Card icon="🔮" title="NeuroPulse for Brain" accent="#7c3aed"><NeuroPulse/></Card>
          <Card icon="🧩" title="Why You Forget"><WhyYouForget/></Card>
          <Card icon={<AlertCircle size={13} className="text-red-400"/>} title="Reset Brain" accent="#ef4444"><ResetBrain/></Card>
        </div>

        {/* ── MID-PAGE PHOTO STRIP ── */}
        <div className="relative rounded-3xl overflow-hidden mb-4">
          <img
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1400&q=70"
            alt="Focus and study"
            className="w-full object-cover"
            style={{ height: '170px' }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(7,4,26,0.92) 0%, rgba(7,4,26,0.5) 50%, rgba(124,58,237,0.35) 100%)' }}/>
          <div className="absolute inset-0 flex items-center justify-between px-8 sm:px-12">
            <div>
              <p className="text-violet-300 text-[10px] font-black uppercase tracking-widest mb-1">Progresi yt</p>
              <p className="text-white font-black text-lg leading-tight">Çdo ditë pak.<br/>Çdo javë shumë.</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 text-right">
              <span className="text-[10px] text-white/40 font-bold">Konsistenca &gt; Intensiteti</span>
              <span className="text-[10px] text-white/25">— James Clear, Atomic Habits</span>
            </div>
          </div>
        </div>

        {/* ── ROW 6: Level Up full width ── */}
        <div className="mb-4">
          <Card icon="🏅" title="Level Up Your Brain" accent="#f59e0b"><LevelUp/></Card>
        </div>

        {/* ── ROW 7: AI Coach · Today's Tip ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card icon={<Sparkles size={13} className="text-violet-400"/>} title="AI Study Coach" accent="#7c3aed"><AIStudyCoach/></Card>
          <Card icon="💎" title="Today's Brain Tip" accent="#7c3aed"><TodaysBrainTip/></Card>
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
            <Brain size={16} className="text-violet-400"/>
            <p className="text-white/45 text-sm font-bold">BrainBoost – For a Stronger Mind, Every Day.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
