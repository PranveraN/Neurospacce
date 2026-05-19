import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Bell, Shield, ChevronRight, LogOut,
  Flame, BookOpen, Brain, Star, Settings,
  HelpCircle, X, Check, Mail, Phone, User,
  History, Trash2, TrendingUp, Award, Target,
  Activity,
} from 'lucide-react'
import { useMood }       from '../contexts/MoodContext'
import { useAuth }       from '../contexts/AuthContext'
import { AvatarDisplay } from '../components/Avatar'
import { getActivity, clearActivity, syncActivitiesFromDB } from '../lib/activityLog'

// ── Animations ────────────────────────────────────────────────────────────────
const KF = `
  @keyframes nsPulse   { 0%,100%{opacity:.65;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
  @keyframes nsRainbow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes nsFloat   { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.2} 50%{transform:translateY(-10px) rotate(180deg);opacity:.55} }
  @keyframes nsFlame   { 0%,100%{transform:scale(1) rotate(-2deg)} 33%{transform:scale(1.07) rotate(3deg)} 66%{transform:scale(.96) rotate(-1deg)} }
  @keyframes nsFadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
`

// ── Rank system ───────────────────────────────────────────────────────────────
const RANKS = [
  { key:'beginner',  name:'Fillestar',  min:0,    icon:'🌱', color:'#94a3b8', glow:'rgba(148,163,184,0.2)',  border:'rgba(148,163,184,0.25)', grad:'linear-gradient(135deg,#334155,#475569)',         bg:'rgba(148,163,184,0.06)' },
  { key:'active',    name:'Aktiv',      min:150,  icon:'⚡', color:'#60a5fa', glow:'rgba(96,165,250,0.4)',   border:'rgba(96,165,250,0.45)',   grad:'linear-gradient(135deg,#1e40af,#3b82f6)',         bg:'rgba(59,130,246,0.07)'  },
  { key:'advanced',  name:'Avancuar',   min:400,  icon:'💎', color:'#a78bfa', glow:'rgba(167,139,250,0.45)', border:'rgba(167,139,250,0.5)',   grad:'linear-gradient(135deg,#4c1d95,#8b5cf6)',         bg:'rgba(139,92,246,0.07)'  },
  { key:'elite',     name:'Elite',      min:800,  icon:'👑', color:'#fbbf24', glow:'rgba(251,191,36,0.55)',  border:'rgba(251,191,36,0.5)',    grad:'linear-gradient(135deg,#78350f,#d97706,#fbbf24)', bg:'rgba(251,191,36,0.06)'  },
  { key:'legendary', name:'Legjendarë', min:1500, icon:'✨', color:'#f472b6', glow:'rgba(244,114,182,0.65)', border:'rainbow',                 grad:'linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)', bg:'rgba(244,114,182,0.06)' },
]

const PLAN_META = {
  free:    { name:'Free',    icon:'🌐', color:'#64748b', grad:'linear-gradient(135deg,#1e293b,#334155)', glow:'rgba(100,116,139,0.25)' },
  pro:     { name:'Pro',     icon:'⚡', color:'#60a5fa', grad:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(59,130,246,0.4)'   },
  premium: { name:'Premium', icon:'💎', color:'#a78bfa', grad:'linear-gradient(135deg,#3b0764,#7c3aed)', glow:'rgba(139,92,246,0.5)'   },
  admin:   { name:'Admin',   icon:'🔑', color:'#ef4444', grad:'linear-gradient(135deg,#450a0a,#dc2626)', glow:'rgba(239,68,68,0.4)'    },
}

const RARITY = {
  common:    { color:'#94a3b8', bg:'rgba(148,163,184,0.12)' },
  rare:      { color:'#60a5fa', bg:'rgba(96,165,250,0.12)'  },
  epic:      { color:'#a78bfa', bg:'rgba(167,139,250,0.12)' },
  legendary: { color:'#fbbf24', bg:'rgba(251,191,36,0.12)'  },
}

function calcXP(streak, moodLen, journalCount, actCount) {
  return Math.min(streak,365)*15 + Math.min(moodLen,30)*8 + Math.min(journalCount,50)*20 + Math.min(actCount,50)*3
}
function getRank(xp)     { for(let i=RANKS.length-1;i>=0;i--) if(xp>=RANKS[i].min) return RANKS[i]; return RANKS[0] }
function getNextRank(xp) { return RANKS.find(r=>xp<r.min)??null }

function buildAchievements({ streak, moodLen, journalCount, chatCount, xp }) {
  return [
    { id:'first',  icon:'🌱', name:'Hapi i Parë',   desc:'Aktiviteti i parë',    unlocked:chatCount+moodLen+journalCount>=1, rarity:'common'    },
    { id:'s3',     icon:'🔥', name:'3-Ditësh',       desc:'Streak 3 ditë',         unlocked:streak>=3,                         rarity:'common'    },
    { id:'s7',     icon:'⚡', name:'Javë Streak',    desc:'7 ditë radhazi',         unlocked:streak>=7,                         rarity:'rare'      },
    { id:'s30',    icon:'🏆', name:'Muaj Streak',    desc:'30 ditë radhazi',        unlocked:streak>=30,                        rarity:'epic'      },
    { id:'s100',   icon:'👑', name:'100 Ditë',       desc:'Streak 100 ditë',        unlocked:streak>=100,                       rarity:'legendary' },
    { id:'m5',     icon:'😊', name:'Gjurmues',       desc:'5 humore ruajtur',       unlocked:moodLen>=5,                        rarity:'common'    },
    { id:'m20',    icon:'📊', name:'Analist',        desc:'20 humore ruajtur',      unlocked:moodLen>=20,                       rarity:'rare'      },
    { id:'j3',     icon:'📓', name:'Shkrimtar',      desc:'3 hyrje ditari',         unlocked:journalCount>=3,                   rarity:'common'    },
    { id:'j15',    icon:'✍️', name:'Autor',          desc:'15 hyrje ditari',        unlocked:journalCount>=15,                  rarity:'epic'      },
    { id:'c5',     icon:'🤖', name:'Eksploruesi AI', desc:'5 biseda me AI',          unlocked:chatCount>=5,                      rarity:'rare'      },
    { id:'xp400',  icon:'💎', name:'Avancuar',       desc:'400 XP të grumbulluara', unlocked:xp>=400,                           rarity:'epic'      },
    { id:'xp1500', icon:'✨', name:'Legjendarë',     desc:'1500 XP',                unlocked:xp>=1500,                          rarity:'legendary' },
  ]
}

function getMoodColor(s) {
  if(!s) return 'rgba(255,255,255,0.05)'
  if(s>=8) return '#22c55e'; if(s>=6) return '#818cf8'; if(s>=4) return '#f97316'; return '#ef4444'
}
function getMoodEmoji(s) {
  if(!s) return null
  if(s>=8) return '😊'; if(s>=6) return '😐'; if(s>=4) return '😔'; return '😢'
}

// ── Particles ─────────────────────────────────────────────────────────────────
function Particles({ rank }) {
  const cols = rank.key==='legendary'
    ? ['#f472b6','#a78bfa','#fbbf24','#60a5fa','#34d399']
    : ['#fbbf24','#f59e0b','#fde68a']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({length:14}).map((_,i)=>(
        <div key={i} className="absolute w-1 h-1 rounded-full"
          style={{ background:cols[i%cols.length], left:`${5+(i*6.5)}%`, top:`${10+(i*5.7)%70}%`,
            animation:`nsFloat ${2.4+(i*0.35)}s ease-in-out ${i*0.25}s infinite` }} />
      ))}
    </div>
  )
}

// ── XP Bar ────────────────────────────────────────────────────────────────────
function XPBar({ xp, rank, nextRank, pct }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">{rank.icon} {rank.name}</span>
        <span className="text-[10px] font-bold" style={{color:rank.color}}>
          {nextRank ? `${xp} / ${nextRank.min} XP` : `${xp} XP ✦ MAX`}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.07)'}}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width:`${pct}%`,
            background: rank.key==='legendary'
              ? 'linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b,#10b981)'
              : rank.grad,
            boxShadow:`0 0 10px ${rank.glow}`,
          }} />
      </div>
      {nextRank && (
        <p className="text-[9px] text-white/20 mt-1.5 text-right">
          {nextRank.min-xp} XP deri te {nextRank.icon} {nextRank.name}
        </p>
      )}
    </div>
  )
}

// ── Dark modals ───────────────────────────────────────────────────────────────
function DarkModal({ title, icon:Icon, color, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6 shadow-2xl"
        style={{background:'linear-gradient(160deg,#0f0d22,#13102a)',border:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:color+'18'}}>
              <Icon size={17} style={{color}} />
            </div>
            <h3 className="font-black text-white">{title}</h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function NotificationsModal({ onClose }) {
  const def = { reminder:true, moodAlert:true, journal:false, tips:true }
  const [prefs, setPrefs] = useState(()=>{ try{ return {...def,...JSON.parse(localStorage.getItem('ns_notif_prefs'))} } catch{ return def } })
  const [time, setTime]   = useState(()=>localStorage.getItem('ns_reminder_time')||'20:00')
  function save() { localStorage.setItem('ns_notif_prefs',JSON.stringify(prefs)); localStorage.setItem('ns_reminder_time',time); onClose() }
  const items = [
    {key:'reminder',  label:'Kujtues ditor',     sub:'Kontrollo humorin çdo ditë'},
    {key:'moodAlert', label:'Alarmi i humorit',  sub:'Kur humori bie nën 4/10'},
    {key:'journal',   label:'Sugjerim ditari',   sub:'Sugjerim shkrimi çdo mbrëmje'},
    {key:'tips',      label:'Tip i ditës',        sub:'Këshilla të reja çdo mëngjes'},
  ]
  return (
    <DarkModal title="Njoftimet" icon={Bell} color="#818cf8" onClose={onClose}>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{background:'rgba(255,255,255,0.05)'}}>
          <div>
            <p className="text-sm font-bold text-white/80">Ora e reminder</p>
            <p className="text-[11px] text-white/35">Njoftime ditore</p>
          </div>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)}
            className="rounded-xl px-2 py-1 text-sm text-white focus:outline-none"
            style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)'}} />
        </div>
        {items.map(({key,label,sub})=>(
          <div key={key} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-semibold text-white/80">{label}</p>
              <p className="text-[11px] text-white/30">{sub}</p>
            </div>
            <button onClick={()=>setPrefs(p=>({...p,[key]:!p[key]}))}
              className={`relative w-10 h-5 rounded-full transition-colors ${prefs[key]?'bg-violet-500':'bg-white/10'}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[key]?'translate-x-5':''}`} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={save} className="w-full py-3 rounded-2xl text-white font-bold text-sm"
        style={{background:'linear-gradient(135deg,#4c1d95,#7c3aed)'}}>
        <Check size={14} className="inline mr-2"/>Ruaj
      </button>
    </DarkModal>
  )
}

function PrivacyModal({ onClose }) {
  return (
    <DarkModal title="Privatësia" icon={Shield} color="#34d399" onClose={onClose}>
      <div className="space-y-3 text-sm">
        {[
          {c:'#34d399', t:'Të gjitha të dhënat ruhen vetëm në pajisjen tënde. Asnjë server nuk mbledh informacionin tënd personal.'},
          {c:'#60a5fa', t:'Hyrjet e journalit janë të enkriptuara dhe nuk mund të lexohen nga askush tjetër.'},
          {c:'#a78bfa', t:'AI Chat nuk ruan biseda pas sesionit. Çdo bisedë fillon nga fillimi.'},
        ].map((item,i)=>(
          <div key={i} className="rounded-2xl p-3 flex gap-2" style={{background:item.c+'12',border:`1px solid ${item.c}22`}}>
            <Check size={13} className="shrink-0 mt-0.5" style={{color:item.c}} />
            <p className="text-white/65 leading-relaxed">{item.t}</p>
          </div>
        ))}
        <button onClick={()=>{
          const keep = ['ns_experts','ns_experts_initialized']
          const saved = Object.fromEntries(keep.map(k=>[k,localStorage.getItem(k)]))
          localStorage.clear()
          keep.forEach(k=>{ if(saved[k]!=null) localStorage.setItem(k,saved[k]) })
          window.location.reload()
        }}
          className="w-full py-2.5 rounded-xl font-bold text-sm hover:bg-red-500/10 transition-colors"
          style={{border:'1px solid rgba(239,68,68,0.3)',color:'#f87171'}}>
          Fshi të gjitha të dhënat lokale
        </button>
      </div>
    </DarkModal>
  )
}

function SettingsModal({ onClose }) {
  const [lang,setLang] = useState(()=>localStorage.getItem('ns_lang')||'sq')
  const [dark,setDark] = useState(()=>localStorage.getItem('ns_ui_theme')==='dark')
  function save(){ localStorage.setItem('ns_lang',lang); localStorage.setItem('ns_ui_theme',dark?'dark':'light'); onClose() }
  return (
    <DarkModal title="Cilësimet" icon={Settings} color="#60a5fa" onClose={onClose}>
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">Gjuha</label>
          <select value={lang} onChange={e=>setLang(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
            style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)'}}>
            <option value="sq" style={{background:'#1a1730'}}>Shqip</option>
            <option value="en" style={{background:'#1a1730'}}>English</option>
          </select>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-white/5">
          <div>
            <p className="text-sm font-semibold text-white/80">Modaliteti i errët</p>
            <p className="text-[11px] text-white/30">Ndryshon pamjen vizuale</p>
          </div>
          <button onClick={()=>setDark(d=>!d)}
            className={`relative w-10 h-5 rounded-full transition-colors ${dark?'bg-violet-500':'bg-white/10'}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark?'translate-x-5':''}`} />
          </button>
        </div>
      </div>
      <button onClick={save} className="w-full py-3 rounded-2xl text-white font-bold text-sm"
        style={{background:'linear-gradient(135deg,#1e3a8a,#2563eb)'}}>
        <Check size={14} className="inline mr-2"/>Ruaj cilësimet
      </button>
    </DarkModal>
  )
}

function SupportModal({ onClose }) {
  return (
    <DarkModal title="Mbështetje" icon={HelpCircle} color="#f87171" onClose={onClose}>
      <div className="space-y-3">
        <a href="mailto:info@neurospace.com"
          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'rgba(167,139,250,0.2)'}}>
            <Mail size={14} className="text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white/80">Email</p>
            <p className="text-xs text-white/35">info@neurospace.com</p>
          </div>
        </a>
        <div className="flex items-center gap-3 p-3 rounded-2xl"
          style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)'}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'rgba(239,68,68,0.2)'}}>
            <Phone size={14} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white/80">Emergjenca (24/7)</p>
            <p className="text-xs font-bold text-red-400">112</p>
          </div>
        </div>
        <div className="rounded-2xl p-3" style={{background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.15)'}}>
          <p className="text-xs font-bold text-violet-400 mb-2">FAQ</p>
          {['Si të fshij të dhënat e mia?','Si funksionon NeuroAI?','A janë të sigurta hyrjet e ditarit?'].map(q=>(
            <p key={q} className="text-xs text-white/40 py-1.5 border-b border-white/5 last:border-0">{q}</p>
          ))}
        </div>
      </div>
    </DarkModal>
  )
}

// ── Streak Section ────────────────────────────────────────────────────────────
function StreakSection({ streak, moodHistory, rank }) {
  const DAY_LABELS = ['Di','Hë','Ma','Më','En','Pr','Sh']
  const last7 = useMemo(() => Array.from({length:7}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const iso = d.toISOString().slice(0, 10)
    const entry = moodHistory.find(m => m.date === iso)
    return { label: DAY_LABELS[d.getDay()], mood: entry?.mood || null, isToday: i === 6 }
  }), [moodHistory])
  const MILESTONES = [3,7,14,30,60,100,365]
  const nextM  = MILESTONES.find(m=>streak<m)||365
  const prevM  = [...MILESTONES].reverse().find(m=>streak>=m)||0
  const mPct   = nextM>prevM ? Math.min(100,((streak-prevM)/(nextM-prevM))*100) : 100

  return (
    <div className="rounded-3xl p-5"
      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">Seria Ditore</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none" style={{display:'inline-block',animation:'nsFlame 1.8s ease-in-out infinite'}}>🔥</span>
            <div>
              <p className="text-4xl font-black text-white leading-none">{streak}</p>
              <p className="text-xs text-white/35 font-semibold mt-0.5">ditë radhazi</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/25 mb-1">Caku tjetër</p>
          <p className="text-2xl font-black leading-none" style={{color:rank.color}}>{nextM} 🎯</p>
          <p className="text-[10px] text-white/25 mt-1">{nextM-streak} ditë larg</p>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        {last7.map((d,i)=>{
          const mc = getMoodColor(d.mood)
          const em = getMoodEmoji(d.mood)
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <p className="text-[9px] text-white/25 font-bold">{d.label}</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                style={{
                  background: d.mood ? mc+'20' : 'rgba(255,255,255,0.04)',
                  border: d.isToday ? `2px solid ${rank.color}80` : d.mood ? `1px solid ${mc}44` : '1px solid rgba(255,255,255,0.07)',
                }}>
                {em || (d.isToday ? <div className="w-1.5 h-1.5 rounded-full bg-white/25" /> : null)}
              </div>
            </div>
          )
        })}
      </div>

      <div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.07)'}}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{width:`${mPct}%`,background:rank.grad,boxShadow:`0 0 8px ${rank.glow}`}} />
        </div>
        <div className="flex justify-between mt-1.5">
          <p className="text-[9px] text-white/20">{prevM} ditë</p>
          <p className="text-[9px]" style={{color:rank.color}}>🎯 {nextM} ditë</p>
        </div>
      </div>
    </div>
  )
}

// ── Achievements ──────────────────────────────────────────────────────────────
function AchievementsSection({ achievements, rank }) {
  const unlocked = achievements.filter(a=>a.unlocked).length
  return (
    <div className="rounded-3xl p-5"
      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award size={14} style={{color:rank.color}} />
          <p className="text-sm font-black text-white">Arritjet</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{background:rank.color+'18',color:rank.color,border:`1px solid ${rank.color}30`}}>
          {unlocked}/{achievements.length} ✦
        </span>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {achievements.map(a=>{
          const r = RARITY[a.rarity]
          return (
            <div key={a.id} title={`${a.name}: ${a.desc}`}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl cursor-default transition-all hover:scale-105"
              style={{
                background: a.unlocked ? r.bg : 'rgba(255,255,255,0.03)',
                border: a.unlocked ? `1px solid ${r.color}30` : '1px solid rgba(255,255,255,0.06)',
                opacity: a.unlocked ? 1 : 0.35,
              }}>
              <span className="text-xl leading-none"
                style={{filter:a.unlocked?'none':'grayscale(1) brightness(0.4)'}}>
                {a.unlocked ? a.icon : '🔒'}
              </span>
              <p className="text-[8px] font-bold text-center leading-tight"
                style={{color:a.unlocked?r.color:'rgba(255,255,255,0.2)'}}>
                {a.name}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Activity Stats ────────────────────────────────────────────────────────────
function ActivityStats({ activities, moodHistory, journalCount, rank }) {
  const stats = useMemo(() => {
    const chatCount = activities.filter(a => a.type === 'chat').length
    const techCount = activities.filter(a => a.type === 'technique').length
    const avg = moodHistory.length
      ? (moodHistory.reduce((a, b) => a + b.mood, 0) / moodHistory.length).toFixed(1)
      : 'N/A'
    return [
      { icon:Brain,      value:chatCount,         label:'Biseda AI',  color:'#a78bfa' },
      { icon:TrendingUp, value:moodHistory.length, label:'Humor',      color:'#34d399' },
      { icon:Target,     value:techCount,          label:'Teknika',    color:'#60a5fa' },
      { icon:BookOpen,   value:journalCount,       label:'Ditar',      color:'#fbbf24' },
      { icon:Activity,   value:activities.length,  label:'Aktivitete', color:'#f472b6' },
      { icon:Star,       value:avg,                label:'Mesatarja',  color:'#fb923c' },
    ]
  }, [activities, moodHistory, journalCount])

  return (
    <div className="rounded-3xl p-5"
      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
      <div className="flex items-center gap-2 mb-4">
        <Activity size={13} style={{color:rank.color}} />
        <p className="text-sm font-black text-white">Statistikat</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map(s=>(
          <div key={s.label} className="rounded-2xl p-3"
            style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <s.icon size={13} style={{color:s.color}} className="mb-2" />
            <p className="text-xl font-black text-white leading-none">{s.value}</p>
            <p className="text-[9px] text-white/30 mt-1 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── History Section ───────────────────────────────────────────────────────────
function HistorySection({ userId, rank }) {
  const [acts, setActs]       = useState(()=>getActivity(userId))
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    syncActivitiesFromDB(userId).then(merged => setActs(merged))
  }, [userId])

  async function handleClear() { await clearActivity(userId); setActs([]); setConfirm(false) }
  function fmt(iso) {
    const d=(Date.now()-new Date(iso))/1000
    if(d<60)    return 'tani'
    if(d<3600)  return `${Math.floor(d/60)}m`
    if(d<86400) return `${Math.floor(d/3600)}h`
    return new Date(iso).toLocaleDateString('sq-AL',{day:'numeric',month:'short'})
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <History size={12} style={{color:rank.color}} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">Historia juaj</p>
        </div>
        {acts.length>0 && (
          confirm
            ? <div className="flex gap-2">
                <button onClick={handleClear} className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                  style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.25)',color:'#f87171'}}>Po, fshi</button>
                <button onClick={()=>setConfirm(false)} className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white/30"
                  style={{background:'rgba(255,255,255,0.06)'}}>Anulo</button>
              </div>
            : <button onClick={()=>setConfirm(true)}
                className="flex items-center gap-1 text-[10px] text-white/20 hover:text-red-400 transition-colors">
                <Trash2 size={9} /> Fshi
              </button>
        )}
      </div>
      <div className="rounded-3xl overflow-hidden"
        style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
        {acts.length===0 ? (
          <div className="px-5 py-8 text-center">
            <History size={28} className="mx-auto mb-2 text-white/10" />
            <p className="text-sm text-white/25 font-semibold">Asnjë aktivitet ende</p>
          </div>
        ) : (
          acts.slice(0,15).map((a,i)=>(
            <Link key={a.id} to={a.route||'#'}
              className={`flex items-center gap-3 px-5 py-3.5 hover:bg-white/5 transition-colors ${i<Math.min(acts.length,15)-1?'border-b border-white/5':''}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                style={{background:rank.color+'12',border:`1px solid ${rank.color}20`}}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/75 truncate">{a.label}</p>
                <p className="text-[10px] text-white/25">{fmt(a.time)}</p>
              </div>
              <ChevronRight size={12} className="text-white/15 shrink-0" />
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Profile() {
  const { streak, moodHistory }      = useMood()
  const { user, logout, isPremium }  = useAuth()
  const navigate                      = useNavigate()
  const [activeModal, setActiveModal] = useState(null)

  const journalCount = useMemo(()=>{
    try { const v=localStorage.getItem('ns_journal_entries'); return v?JSON.parse(v).length:0 } catch { return 0 }
  }, [])

  const [activities, setActivities] = useState(()=>getActivity(user?.id))
  useEffect(() => {
    if (user?.id) syncActivitiesFromDB(user.id).then(setActivities)
  }, [user?.id])
  const chatCount = useMemo(()=>activities.filter(a=>a.type==='chat').length, [activities])

  const { xp, rank, nextRank, xpPct, achievements } = useMemo(() => {
    const xp       = calcXP(streak, moodHistory.length, journalCount, activities.length)
    const rank     = getRank(xp)
    const nextRank = getNextRank(xp)
    const xpPct    = nextRank ? Math.min(100, ((xp - rank.min) / (nextRank.min - rank.min)) * 100) : 100
    const achievements = buildAchievements({ streak, moodLen: moodHistory.length, journalCount, chatCount, xp })
    return { xp, rank, nextRank, xpPct, achievements }
  }, [streak, moodHistory.length, journalCount, chatCount, activities.length])

  const planMeta = useMemo(() => PLAN_META[user?.plan] || PLAN_META.free, [user?.plan])

  const isLegendary  = rank.key==='legendary'
  const isElitePlus  = rank.key==='elite' || rank.key==='legendary'

  const MENU_SECTIONS = [
    { title:'Llogaria', items:[
      { icon:Bell,      label:'Njoftimet',  sub:'Reminder '+(localStorage.getItem('ns_reminder_time')||'20:00'), modal:'notif',    color:'#818cf8' },
      { icon:Shield,    label:'Privatësia', sub:'Të dhënat e sigurta',  modal:'privacy',  color:'#34d399' },
      { icon:Settings,  label:'Cilësimet',  sub:'Preferencat e tua',    modal:'settings', color:'#60a5fa' },
    ]},
    { title:'Ndihmë', items:[
      { icon:HelpCircle, label:'Mbështetje', sub:'FAQ dhe kontakt',      modal:'support',  color:'#f87171' },
    ]},
  ]

  // Hero card (shared between plain and legendary wrapper)
  const heroCard = (
    <div className="relative overflow-hidden"
      style={{
        background:'linear-gradient(160deg,#08061c 0%,#0e0b26 100%)',
        ...(isLegendary
          ? { borderRadius:22 }
          : { borderRadius:24, border:`1px solid ${rank.border}` }
        ),
      }}>
      {/* Rank glow bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{background:`radial-gradient(ellipse 100% 50% at 50% 0%, ${rank.glow}, transparent 70%)`}} />
      {/* Floating particles */}
      {isElitePlus && <Particles rank={rank} />}

      <div className="relative z-10 px-5 pt-14 md:pt-8 pb-7">
        {/* Avatar */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-5">
            <div className="absolute inset-[-3px] rounded-[28px]"
              style={{background:rank.grad, animation:'nsPulse 3s ease-in-out infinite', opacity:0.8}} />
            <div className="absolute inset-[-7px] rounded-[32px] opacity-20"
              style={{background:rank.grad, filter:'blur(10px)', animation:'nsPulse 3s ease-in-out infinite'}} />
            <div className="relative w-24 h-24 rounded-[24px] overflow-hidden"
              style={{border:`2px solid ${rank.border==='rainbow'?'transparent':rank.border}`}}>
              {user?.avatar
                ? <AvatarDisplay avatar={user.avatar} size={96} />
                : <div className="w-full h-full flex items-center justify-center" style={{background:'rgba(255,255,255,0.08)'}}>
                    <User size={36} className="text-white/50" />
                  </div>
              }
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-base shadow-xl"
              style={{background:rank.grad, boxShadow:`0 0 14px ${rank.glow}`}}>
              {rank.icon}
            </div>
          </div>

          <h2 className="text-2xl font-black text-white leading-tight mb-1">
            {user?.name || user?.username || 'Anonim'}
          </h2>
          <p className="text-white/30 text-xs">{user?.email}</p>

          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-white"
              style={{background:planMeta.grad, boxShadow:`0 0 20px ${planMeta.glow}`}}>
              {planMeta.icon} {planMeta.name}
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold"
              style={{background:rank.bg, border:`1px solid ${rank.border==='rainbow'?rank.color+'60':rank.border}`, color:rank.color}}>
              {rank.icon} {rank.name}
            </div>
            {streak>=7 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-white"
                style={{background:'rgba(251,146,60,0.15)',border:'1px solid rgba(251,146,60,0.3)'}}>
                🔥 {streak}d
              </div>
            )}
          </div>
        </div>

        {/* XP bar */}
        <div className="mb-5 px-1">
          <XPBar xp={xp} rank={rank} nextRank={nextRank} pct={xpPct} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon:Flame,      value:streak,                                                    label:'Seria',   color:'#fb923c' },
            { icon:Star,       value:moodHistory.length?(moodHistory.reduce((a,b)=>a+b.mood,0)/moodHistory.length).toFixed(1):'N/A', label:'Humor', color:'#fbbf24' },
            { icon:BookOpen,   value:journalCount,                                              label:'Ditar',   color:'#34d399' },
            { icon:TrendingUp, value:xp,                                                        label:'XP',      color:rank.color},
          ].map(({icon:Icon,value,label,color})=>(
            <div key={label} className="rounded-2xl py-3.5 px-2 text-center"
              style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)'}}>
              <Icon size={13} style={{color}} className="mx-auto mb-2" />
              <p className="font-black text-lg text-white leading-none">{value}</p>
              <p className="text-[9px] text-white/30 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{background:'linear-gradient(160deg,#060613 0%,#0b0920 50%,#070615 100%)',minHeight:'100vh'}}
      className="animate-fade-in">
      <style>{KF}</style>

      {/* Modals */}
      {activeModal==='notif'    && <NotificationsModal onClose={()=>setActiveModal(null)} />}
      {activeModal==='privacy'  && <PrivacyModal       onClose={()=>setActiveModal(null)} />}
      {activeModal==='settings' && <SettingsModal      onClose={()=>setActiveModal(null)} />}
      {activeModal==='support'  && <SupportModal       onClose={()=>setActiveModal(null)} />}

      {/* Hero — rainbow wrapper for legendary */}
      {isLegendary ? (
        <div style={{
          background:'linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b,#10b981,#7c3aed)',
          backgroundSize:'400% 400%',
          animation:'nsRainbow 4s ease infinite',
          padding:'1.5px',
          borderBottomLeftRadius:24,
          borderBottomRightRadius:24,
        }}>
          {heroCard}
        </div>
      ) : heroCard}

      {/* Content */}
      <div className="px-4 md:px-0 space-y-3 pt-4 pb-10">

        <StreakSection streak={streak} moodHistory={moodHistory} rank={rank} />

        <AchievementsSection achievements={achievements} rank={rank} />

        {!isPremium && (
          <Link to="/pricing"
            className="block rounded-3xl p-5 hover:scale-[1.01] transition-transform"
            style={{background:'linear-gradient(135deg,#1a0530,#3b0764,#6d28d9)',border:'1px solid rgba(139,92,246,0.35)',boxShadow:'0 0 40px rgba(124,58,237,0.15)'}}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{background:'rgba(255,255,255,0.1)'}}>👑</div>
              <div className="flex-1">
                <p className="font-black text-base text-white">Shko Premium</p>
                <p className="text-xs text-white/50 mt-0.5">AI pa limit · Takime · Analytics → nga €9.99/muaj</p>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </div>
          </Link>
        )}

        <ActivityStats activities={activities} moodHistory={moodHistory} journalCount={journalCount} rank={rank} />

        {MENU_SECTIONS.map(section=>(
          <div key={section.title}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2 px-1">{section.title}</p>
            <div className="rounded-3xl overflow-hidden"
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
              {section.items.map((item,i)=>(
                <button key={item.label} onClick={()=>setActiveModal(item.modal)}
                  className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors ${i<section.items.length-1?'border-b border-white/5':''}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{background:item.color+'15'}}>
                    <item.icon size={15} style={{color:item.color}} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-white/85 text-sm">{item.label}</p>
                    <p className="text-[11px] text-white/30">{item.sub}</p>
                  </div>
                  <ChevronRight size={13} className="text-white/20" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {user?.id && <HistorySection userId={user.id} rank={rank} />}

        <div className="rounded-3xl p-4 text-center"
          style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.05)'}}>
          <p className="text-xs font-bold text-white/15">NeuroSpace v1.0 · AI Mental Wellness</p>
          <p className="text-[10px] text-white/10 mt-1">Nuk zëvendëson terapinë profesionale</p>
        </div>

        <button onClick={()=>{ logout(); navigate('/') }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all hover:opacity-80"
          style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.18)',color:'#f87171'}}>
          <LogOut size={15} /> Dil nga llogaria
        </button>

        <div className="h-6" />
      </div>
    </div>
  )
}
