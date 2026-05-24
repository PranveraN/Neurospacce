import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import {
  CalendarDays, CheckSquare, Bell, FileText, ChevronLeft, ChevronRight,
  Plus, Trash2, Star, Search, Brain, Clock, TrendingUp, Zap,
  CheckCircle, Circle, X, Sparkles, Edit3, Heart, Activity,
  BookOpen, Target, MoreHorizontal, Calendar,
} from 'lucide-react'

// ─── Palette ──────────────────────────────────────────────────────────────────
const A = {
  page:    'linear-gradient(160deg,#081410 0%,#0c1e16 50%,#081410 100%)',
  card:    'rgba(255,255,255,0.05)',
  cardHov: 'rgba(255,255,255,0.08)',
  border:  'rgba(110,231,183,0.12)',
  borderA: 'rgba(110,231,183,0.30)',
  accent:  '#34d399',
  accentD: '#059669',
  accentDD:'#047857',
  btn:     'linear-gradient(135deg,#059669,#047857)',
  btnGlow: '0 4px 20px rgba(5,150,105,0.45)',
  textPri: 'rgba(255,255,255,0.92)',
  textSec: 'rgba(255,255,255,0.55)',
  textMut: 'rgba(255,255,255,0.28)',
  dot:     'radial-gradient(circle,rgba(110,231,183,0.08) 1px,transparent 1px)',
}

// ─── Static data ──────────────────────────────────────────────────────────────
const QUOTES = [
  { text: 'Përparimi i vogël çdo ditë është ende përparim.', author: 'James Clear' },
  { text: 'Mos prit për motivim. Fillo dhe motivimi do të vijë.', author: 'Psychology Today' },
  { text: 'Ndryshimi fillon me një hap të vetëm të guximshëm.', author: 'NeuroSphera' },
  { text: 'Sot je versioni më i mirë i çdo versionit të kaluar.', author: 'Anonimë' },
  { text: 'Mendja e qetë është burim i fuqisë pa kufi.', author: 'Stoicizmi' },
  { text: 'Energjia rrjedh ku shkon vëmendja.', author: 'Tony Robbins' },
  { text: 'Mirëqenia nuk është destinacion, është mënyrë udhëtimi.', author: 'NeuroSphera' },
]

const CAT_META = {
  takim:    { label: 'Takim',     color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  emoji: '📅' },
  shendet:  { label: 'Shëndet',   color: '#34d399', bg: 'rgba(52,211,153,0.15)',  emoji: '💚' },
  lexim:    { label: 'Lexim',     color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  emoji: '📚' },
  punë:     { label: 'Punë',      color: '#14b8a6', bg: 'rgba(20,184,166,0.15)',  emoji: '💼' },
  personal: { label: 'Personal',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', emoji: '💜' },
  stërvitje:{ label: 'Stërvitje', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)',  emoji: '💪' },
}

const PRIORITY_META = {
  high:   { label: 'Lartë',    color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'   },
  medium: { label: 'Mesatare', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  low:    { label: 'Ulët',     color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
}

const REMINDER_TYPES = {
  birthday: { label: 'Ditëlindje',  emoji: '🎂', color: '#f43f5e' },
  payment:  { label: 'Pagesë',      emoji: '💳', color: '#f59e0b' },
  meeting:  { label: 'Takim',       emoji: '📅', color: '#3b82f6' },
  personal: { label: 'Personal',    emoji: '💜', color: '#8b5cf6' },
  health:   { label: 'Shëndet',     emoji: '💚', color: '#34d399' },
}

const WEEK_DAYS = ['Hën','Mar','Mër','Enj','Pre','Sht','Die']
const MONTHS_AL = ['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor']

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0] }
function fmtDate(d) {
  const dt = new Date(d)
  return `${dt.getDate()} ${MONTHS_AL[dt.getMonth()]} ${dt.getFullYear()}`
}
function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date(todayStr())
  return Math.round(diff / 86400000)
}
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Mirëmëngjes', emoji: '🌅' }
  if (h < 17) return { text: 'Mirëdita',    emoji: '☀️' }
  return              { text: 'Mirëmbrëma',  emoji: '🌙' }
}
function useLS(key, getInitial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : getInitial() }
    catch { return getInitial() }
  })
  function save(v) {
    const next = typeof v === 'function' ? v(val) : v
    setVal(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
  }
  return [val, save]
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

// ─── Seed data ────────────────────────────────────────────────────────────────
function seedTasks() {
  const today = todayStr()
  const tom = new Date(); tom.setDate(tom.getDate() + 1)
  const tomStr = tom.toISOString().split('T')[0]
  return [
    { id: uid(), title: 'Seancë me psikologun',    desc: 'Konsultë online',          time: '10:00', date: today,  cat: 'takim',    done: false, priority: 'high'   },
    { id: uid(), title: 'Ushtrim frymëmarrjeje',   desc: '10 minuta mindfulness',    time: '12:30', date: today,  cat: 'shendet',  done: false, priority: 'medium' },
    { id: uid(), title: 'Lexo 1 artikull',          desc: 'Zhvillo dijen tënde',      time: '16:00', date: today,  cat: 'lexim',    done: false, priority: 'low'    },
    { id: uid(), title: 'Kohë për veten',           desc: 'Relaksohu dhe reflekto',   time: '20:30', date: today,  cat: 'personal', done: false, priority: 'medium' },
    { id: uid(), title: 'Takim me ekipin',          desc: 'Diskutim projekti të ri',  time: '09:00', date: tomStr, cat: 'punë',     done: false, priority: 'high'   },
    { id: uid(), title: 'Stërvitje 30 min',         desc: 'Cardio & stretching',      time: '18:00', date: tomStr, cat: 'stërvitje',done: false, priority: 'medium' },
  ]
}
function seedNotes() {
  return [
    { id: uid(), title: 'Ide për projektin tim personal', content: 'Duhet të krijoj një plan 30-ditor për të arritur qëllimet e mia. Filloj me 3 hapa të vegjël çdo ditë dhe monitoroj progresin.', cat: 'personal', favorite: true,  createdAt: new Date(Date.now() - 86400000*2).toISOString() },
    { id: uid(), title: 'Teknika e frymëmarrjes 4-7-8',   content: 'Marr frymë 4 sekonda, mbaj 7 sekonda, nxjerr 8 sekonda. Përsërit 3 herë. Ndihmon me ankth dhe gjumin.', cat: 'shendet',  favorite: false, createdAt: new Date(Date.now() - 86400000*5).toISOString() },
    { id: uid(), title: 'Libra për të lexuar',              content: '1. Atomic Habits — James Clear\n2. Thinking Fast and Slow — Kahneman\n3. The Body Keeps Score — Van der Kolk', cat: 'lexim', favorite: true, createdAt: new Date(Date.now() - 86400000*8).toISOString() },
  ]
}
function seedReminders() {
  const d1 = new Date(); d1.setDate(d1.getDate() + 21)
  const d2 = new Date(); d2.setFullYear(d2.getFullYear() + 1, 0, 1)
  return [
    { id: uid(), title: 'Ditëlindja e mamit',    date: d1.toISOString().split('T')[0], time: '09:00', type: 'birthday', done: false },
    { id: uid(), title: 'Viti im i ri personal', date: d2.toISOString().split('T')[0], time: '00:00', type: 'personal', done: false },
  ]
}
function seedRoutines() {
  return [
    { id: uid(), emoji: '🔥', label: 'Meditim mëngjesi', streak: 3,  lastDone: todayStr()  },
    { id: uid(), emoji: '📓', label: 'Shkruaj në ditar',  streak: 5,  lastDone: new Date(Date.now()-86400000).toISOString().split('T')[0] },
    { id: uid(), emoji: '💪', label: 'Aktivitet fizik',   streak: 0,  lastDone: null },
  ]
}

// ─── Add Task Modal ───────────────────────────────────────────────────────────
function AddTaskModal({ defaultDate, onSave, onClose }) {
  const [title,    setTitle]    = useState('')
  const [date,     setDate]     = useState(defaultDate || todayStr())
  const [time,     setTime]     = useState('')
  const [cat,      setCat]      = useState('personal')
  const [priority, setPriority] = useState('medium')
  const [desc,     setDesc]     = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [onClose])

  function submit() {
    if (!title.trim()) return
    onSave({ id: uid(), title: title.trim(), desc: desc.trim(), time, date, cat, priority, done: false })
    onClose()
  }

  const inp = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(52,211,153,0.18)',
    color: 'rgba(255,255,255,0.90)',
    borderRadius: 12,
    padding: '9px 12px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,10,18,0.80)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#0a1f18,#0d2a1e)', border: '1px solid rgba(52,211,153,0.22)', boxShadow: '0 24px 60px rgba(5,150,105,0.30)' }}>

        {/* Header */}
        <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(52,211,153,0.12)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: A.btn, boxShadow: A.btnGlow }}>
            <Plus size={17} color="white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black" style={{ color: A.textPri }}>Aktivitet i ri</p>
            <p className="text-[10px]" style={{ color: A.textMut }}>Shto në kalendar</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.40)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: A.accent }}>Titulli *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="p.sh. Ushtrim 30 minuta..."
              style={inp}
              onKeyDown={e => { if (e.key === 'Enter') submit() }}
              autoFocus />
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: A.accent }}>Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={{ ...inp, colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: A.accent }}>Ora</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                style={{ ...inp, colorScheme: 'dark' }} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: A.accent }}>Kategoria</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CAT_META).map(([key, cm]) => (
                <button key={key} onClick={() => setCat(key)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all"
                  style={cat === key
                    ? { background: cm.bg, border: `1px solid ${cm.color}60`, color: cm.color }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }
                  }>
                  {cm.emoji} {cm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: A.accent }}>Prioriteti</label>
            <div className="flex gap-2">
              {Object.entries(PRIORITY_META).map(([key, pm]) => (
                <button key={key} onClick={() => setPriority(key)}
                  className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all"
                  style={priority === key
                    ? { background: pm.bg, border: `1px solid ${pm.color}60`, color: pm.color }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }
                  }>
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional note */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: A.accent }}>Shënim (opsional)</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Detaje shtesë..."
              rows={2}
              style={{ ...inp, resize: 'none', lineHeight: 1.5 }} />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.60)', border: '1px solid rgba(255,255,255,0.10)' }}>
            Anulo
          </button>
          <button onClick={submit}
            disabled={!title.trim()}
            className="flex-2 flex-1 py-3 rounded-2xl text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            style={{ background: A.btn, color: 'white', boxShadow: title.trim() ? A.btnGlow : 'none' }}>
            + Shto aktivitetin
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Panel Drawer (slide-in from right) ──────────────────────────────────────
function PanelDrawer({ title, icon, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[350] flex justify-end"
      style={{ background: 'rgba(4,10,18,0.70)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-lg h-full flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#081410,#0c1e16)', borderLeft: '1px solid rgba(52,211,153,0.18)', boxShadow: '-20px 0 60px rgba(0,0,0,0.50)' }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-3 shrink-0" style={{ borderBottom: '1px solid rgba(52,211,153,0.12)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: A.btn, boxShadow: A.btnGlow }}>
            {icon}
          </div>
          <p className="text-sm font-black flex-1" style={{ color: A.textPri }}>{title}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.40)' }}>
            <X size={14} />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'none' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── GlassCard ────────────────────────────────────────────────────────────────
function GlassCard({ children, className = '', style = {}, onClick }) {
  return (
    <div className={`rounded-2xl transition-all duration-200 ${className}`}
      style={{ background: A.card, border: `1px solid ${A.border}`, ...style }}
      onClick={onClick}>
      {children}
    </div>
  )
}

// ─── Left: Greeting + Today ───────────────────────────────────────────────────
function LeftGreeting({ tasks, setTasks, onAdd, onOpenAI }) {
  const g = getGreeting()
  const today = todayStr()
  const todayTasks = tasks.filter(t => t.date === today)
  const done = todayTasks.filter(t => t.done).length
  const nowH = new Date().getHours()
  const nextTask = todayTasks.filter(t => !t.done && parseInt(t.time) > nowH)[0]
  function toggleTask(id) { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)) }

  return (
    <div className="space-y-4">
      {/* Personal assistant header */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: A.btn }}>
            <Brain size={18} color="white" />
          </div>
          <div>
            <p className="text-sm font-black" style={{ color: A.textPri }}>Asistenti im personal</p>
            <p className="text-[10px]" style={{ color: A.textMut }}>Planifiko. Kujo. Reflekto.</p>
          </div>
        </div>

        {/* Greeting card */}
        <div className="rounded-xl p-3 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(5,150,105,0.20),rgba(52,211,153,0.10))', border: `1px solid rgba(52,211,153,0.20)` }}>
          <div className="absolute -right-4 -top-4 text-5xl opacity-20">{g.emoji}</div>
          <p className="text-sm font-black mb-1" style={{ color: A.textPri }}>{g.text}! {g.emoji}</p>
          <p className="text-[11px] leading-relaxed" style={{ color: A.textSec }}>
            {todayTasks.length > 0
              ? `Sot ke ${todayTasks.length} aktivitete të planifikuara. ${done > 0 ? `Ke kryer ${done} deri tani.` : 'Fillo ditën e fortë!'}`
              : 'Sot nuk ke aktivitete. Shto diçka për të qëndruar produktiv!'
            }
          </p>
          {nextTask && (
            <div className="mt-2 flex items-center gap-2">
              <Clock size={10} style={{ color: A.accent }} />
              <span className="text-[10px] font-semibold" style={{ color: A.accent }}>
                Tjetri: {nextTask.title} — {nextTask.time}
              </span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Today's activities */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-black" style={{ color: A.textPri }}>Sot</p>
            <p className="text-[10px]" style={{ color: A.textMut }}>{new Date().toLocaleDateString('sq-AL', { weekday:'long', day:'numeric', month:'long' })}</p>
          </div>
          <button onClick={() => onAdd(todayStr())}
            className="flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg transition-all active:scale-95 hover:opacity-80"
            style={{ background: 'rgba(52,211,153,0.12)', color: A.accent, border: `1px solid rgba(52,211,153,0.20)` }}>
            <Plus size={11} /> Shto
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-1">🌱</p>
            <p className="text-[11px]" style={{ color: A.textMut }}>Asnjë aktivitet sot</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.slice(0, 4).map(task => {
              const cm = CAT_META[task.cat] || CAT_META.personal
              return (
                <button key={task.id} onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: task.done ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${task.done ? 'rgba(52,211,153,0.20)' : 'rgba(52,211,153,0.08)'}` }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: cm.bg }}>
                    {task.done ? <CheckCircle size={14} style={{ color: A.accentD }} /> : cm.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate" style={{ color: task.done ? A.textMut : A.textPri, textDecoration: task.done ? 'line-through' : 'none' }}>
                      {task.title}
                    </p>
                  </div>
                  <span className="text-[10px] shrink-0 font-semibold" style={{ color: A.textMut }}>{task.time}</span>
                </button>
              )
            })}
          </div>
        )}

        {todayTasks.length > 4 && (
          <button onClick={() => onAdd(todayStr())}
            className="w-full mt-2 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors hover:opacity-80"
            style={{ color: A.accent }}>
            +{todayTasks.length - 4} të tjera · Shiko të gjitha <ChevronRight size={10} />
          </button>
        )}
      </GlassCard>

      {/* Weekly stats */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={13} style={{ color: A.accent }} />
          <span className="text-sm font-black" style={{ color: A.textPri }}>Statistikat e javës</span>
        </div>
        {(() => {
          const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
          const weekTasks = tasks.filter(t => new Date(t.date) >= weekAgo)
          const doneTasks = weekTasks.filter(t => t.done).length
          const totalDays = 7
          const activeDays = [...new Set(weekTasks.filter(t => t.done).map(t => t.date))].length
          const pct = weekTasks.length ? Math.round((doneTasks / weekTasks.length) * 100) : 0
          const isGood = pct >= 70
          return (
            <>
              <p className="text-[11px] mb-3 font-semibold" style={{ color: A.textMut }}>
                {isGood ? 'Javë e mrekullueshme! 🎉' : 'Vazhdo — je duke bërë progres! 💪'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: doneTasks, label: 'Detyra të kryera' },
                  { val: activeDays, label: 'Ditë radhazi' },
                  { val: `${pct}%`, label: 'Progresi mesatar', accent: true },
                ].map(s => (
                  <div key={s.label} className="text-center rounded-xl p-2.5"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${A.border}` }}>
                    <p className="text-base font-black" style={{ color: s.accent ? A.accent : A.textPri }}>{s.val}</p>
                    <p className="text-[9px] mt-0.5 leading-tight" style={{ color: A.textMut }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={onOpenAI}
                className="w-full mt-3 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-all hover:opacity-80 active:scale-95"
                style={{ color: A.accent, background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.15)` }}>
                <Sparkles size={10} /> Sugjero ditën time <ChevronRight size={10} />
              </button>
            </>
          )
        })()}
      </GlassCard>
    </div>
  )
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function CalendarView({ tasks, onAddTask }) {
  const [year,  setYear]  = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [selDay, setSelDay] = useState(new Date().getDate())
  const today = new Date()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = (() => { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1 })()

  const todaySelStr = `${year}-${String(month+1).padStart(2,'0')}-${String(selDay).padStart(2,'0')}`
  const selTasks = tasks.filter(t => t.date === todaySelStr)

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }

  function getDayTasks(d) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    return tasks.filter(t => t.date === dateStr)
  }

  const cells = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: A.card, border: `1px solid ${A.border}` }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.06)', color: A.textSec }}>
            <ChevronLeft size={12} />
          </button>
          <h3 className="text-sm font-black" style={{ color: A.textPri }}>
            {MONTHS_AL[month]} {year}
          </h3>
          <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.06)', color: A.textSec }}>
            <ChevronRight size={12} />
          </button>
        </div>
        <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelDay(today.getDate()) }}
          className="text-[9px] font-black px-2.5 py-1 rounded-lg transition-all"
          style={{ background: 'rgba(52,211,153,0.12)', color: A.accent, border: `1px solid rgba(52,211,153,0.20)` }}>
          Sot
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-0.5">
        {WEEK_DAYS.map(d => (
          <div key={d} className="text-center text-[8px] font-black uppercase tracking-wide py-0.5" style={{ color: A.textMut }}>{d}</div>
        ))}
      </div>

      {/* Day grid — compact */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />
          const isToday  = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const isSel    = d === selDay
          const dayTasks = getDayTasks(d)
          const hasPend  = dayTasks.some(t => !t.done)
          const hasDone  = dayTasks.some(t => t.done)
          return (
            <button key={d} onClick={() => setSelDay(d)}
              className="relative flex flex-col items-center py-1.5 rounded-lg transition-all hover:scale-105"
              style={{
                background: isToday ? A.btn : isSel ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isToday ? 'transparent' : isSel ? 'rgba(52,211,153,0.35)' : A.border}`,
                boxShadow: isToday ? A.btnGlow : 'none',
              }}>
              <span className="text-[11px] font-bold leading-none" style={{ color: isToday ? 'white' : isSel ? A.accent : A.textSec }}>{d}</span>
              {dayTasks.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasPend && <div className="w-[3px] h-[3px] rounded-full" style={{ background: isToday ? 'rgba(255,255,255,0.8)' : A.accent }} />}
                  {hasDone && <div className="w-[3px] h-[3px] rounded-full" style={{ background: 'rgba(52,211,153,0.45)' }} />}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day — mini strip */}
      <div className="pt-2" style={{ borderTop: `1px solid ${A.border}` }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-black" style={{ color: A.textPri }}>
            {selDay} {MONTHS_AL[month]}
          </p>
          <span className="text-[9px]" style={{ color: A.textMut }}>
            {selTasks.filter(t => t.done).length}/{selTasks.length} ✓
          </span>
        </div>
        {selTasks.length === 0 ? (
          <button onClick={() => onAddTask(todaySelStr)}
            className="w-full text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
            style={{ background: 'rgba(52,211,153,0.07)', color: A.accent, border: `1px solid rgba(52,211,153,0.15)` }}>
            <Plus size={10} /> Shto aktivitet
          </button>
        ) : (
          <div className="space-y-1">
            {selTasks.slice(0, 3).map(t => {
              const cm = CAT_META[t.cat] || CAT_META.personal
              return (
                <div key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${A.border}` }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cm.color }} />
                  <p className="text-[10px] font-semibold truncate flex-1" style={{ color: t.done ? A.textMut : A.textPri, textDecoration: t.done ? 'line-through' : 'none' }}>
                    {t.title}
                  </p>
                  {t.time && <span className="text-[9px] shrink-0" style={{ color: A.textMut }}>{t.time}</span>}
                </div>
              )
            })}
            {selTasks.length > 3 && (
              <p className="text-[9px] text-center" style={{ color: A.textMut }}>+{selTasks.length - 3} të tjera</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
function TasksView({ tasks, setTasks }) {
  const [showForm, setShowForm] = useState(false)
  const [filter,   setFilter]   = useState('all')
  const [form, setForm] = useState({ title: '', desc: '', time: '', date: todayStr(), cat: 'personal', priority: 'medium' })

  function addTask() {
    if (!form.title.trim()) return
    setTasks(prev => [{ id: uid(), ...form, done: false }, ...prev])
    setForm({ title: '', desc: '', time: '', date: todayStr(), cat: 'personal', priority: 'medium' })
    setShowForm(false)
  }
  function toggleTask(id) { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)) }
  function deleteTask(id) { setTasks(prev => prev.filter(t => t.id !== id)) }

  const today = todayStr()
  const filtered = tasks.filter(t =>
    filter === 'all'    ? true :
    filter === 'today'  ? t.date === today :
    filter === 'done'   ? t.done :
    filter === 'active' ? !t.done : true
  ).sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    const pd = { high: 0, medium: 1, low: 2 }
    return (pd[a.priority] || 1) - (pd[b.priority] || 1)
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[['all','Të gjitha'],['today','Sot'],['active','Aktive'],['done','Të kryera']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className="text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all"
            style={filter === k
              ? { background: A.btn, color: 'white' }
              : { background: 'rgba(255,255,255,0.05)', color: A.textMut, border: `1px solid ${A.border}` }}>
            {l}
          </button>
        ))}
        <button onClick={() => setShowForm(true)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95"
          style={{ background: A.btn, color: 'white', boxShadow: A.btnGlow }}>
          <Plus size={11} /> Shto detyrë
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.20)` }}>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Titulli i detyrës…" autoFocus
            className="w-full text-sm rounded-xl px-3 py-2.5 outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
          <input value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            placeholder="Përshkrim (opsional)…"
            className="w-full text-xs rounded-xl px-3 py-2.5 outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
          <div className="grid grid-cols-3 gap-2">
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="text-xs rounded-xl px-3 py-2.5 outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
            <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              className="text-xs rounded-xl px-3 py-2.5 outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              className="text-xs rounded-xl px-3 py-2.5 outline-none"
              style={{ background: '#132117', border: `1px solid ${A.border}`, color: A.textPri }}>
              <option value="high">🔴 Lartë</option>
              <option value="medium">🟡 Mesatare</option>
              <option value="low">🟢 Ulët</option>
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(CAT_META).map(([k, cm]) => (
              <button key={k} onClick={() => setForm(f => ({ ...f, cat: k }))}
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all"
                style={form.cat === k
                  ? { background: cm.bg, color: cm.color, border: `1px solid ${cm.color}40` }
                  : { background: 'rgba(255,255,255,0.04)', color: A.textMut, border: `1px solid ${A.border}` }}>
                {cm.emoji} {cm.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={addTask}
              className="flex-1 py-2.5 rounded-xl text-xs font-black text-white active:scale-95 transition-all"
              style={{ background: A.btn, boxShadow: A.btnGlow }}>
              Shto detyrën
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: A.textMut }}>
              Anulo
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">✅</p>
          <p className="text-sm font-bold" style={{ color: A.textMut }}>Asnjë detyrë gjetur</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const cm = CAT_META[task.cat] || CAT_META.personal
            const pm = PRIORITY_META[task.priority] || PRIORITY_META.medium
            return (
              <div key={task.id}
                className="flex items-start gap-3 p-3.5 rounded-2xl group transition-all hover:scale-[1.005]"
                style={{ background: task.done ? 'rgba(255,255,255,0.025)' : A.card, border: `1px solid ${task.done ? A.border : 'rgba(52,211,153,0.15)'}` }}>
                <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0 transition-transform hover:scale-110">
                  {task.done
                    ? <CheckCircle size={18} style={{ color: A.accentD }} />
                    : <Circle      size={18} style={{ color: A.textMut  }} />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-bold truncate" style={{ color: task.done ? A.textMut : A.textPri, textDecoration: task.done ? 'line-through' : 'none' }}>
                      {task.title}
                    </p>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: pm.bg, color: pm.color }}>{pm.label}</span>
                  </div>
                  {task.desc && <p className="text-[11px] truncate" style={{ color: A.textMut }}>{task.desc}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: cm.bg, color: cm.color }}>
                      {cm.emoji} {cm.label}
                    </span>
                    {task.time && (
                      <span className="flex items-center gap-0.5 text-[9px]" style={{ color: A.textMut }}>
                        <Clock size={8} /> {task.time}
                      </span>
                    )}
                    {task.date !== todayStr() && (
                      <span className="text-[9px]" style={{ color: A.textMut }}>{fmtDate(task.date)}</span>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Reminders ────────────────────────────────────────────────────────────────
function RemindersView({ reminders, setReminders }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '09:00', type: 'personal' })

  function addReminder() {
    if (!form.title.trim() || !form.date) return
    setReminders(prev => [...prev, { id: uid(), ...form, done: false }])
    setForm({ title: '', date: '', time: '09:00', type: 'personal' })
    setShowForm(false)
  }
  function deleteReminder(id) { setReminders(prev => prev.filter(r => r.id !== id)) }

  const sorted = [...reminders].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: A.textMut }}>{reminders.length} përkujtime aktive</p>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black active:scale-95 transition-all"
          style={{ background: A.btn, color: 'white', boxShadow: A.btnGlow }}>
          <Plus size={11} /> Shto përkujtim
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.20)` }}>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Titulli i përkujtimit…" autoFocus
            className="w-full text-sm rounded-xl px-3 py-2.5 outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="text-xs rounded-xl px-3 py-2.5 outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
            <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              className="text-xs rounded-xl px-3 py-2.5 outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(REMINDER_TYPES).map(([k, rm]) => (
              <button key={k} onClick={() => setForm(f => ({ ...f, type: k }))}
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all"
                style={form.type === k
                  ? { background: 'rgba(52,211,153,0.15)', color: A.accent, border: `1px solid rgba(52,211,153,0.30)` }
                  : { background: 'rgba(255,255,255,0.04)', color: A.textMut, border: `1px solid ${A.border}` }}>
                {rm.emoji} {rm.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={addReminder}
              className="flex-1 py-2.5 rounded-xl text-xs font-black text-white active:scale-95 transition-all"
              style={{ background: A.btn, boxShadow: A.btnGlow }}>Shto</button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: A.textMut }}>Anulo</button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">🔔</p>
          <p className="text-sm font-bold" style={{ color: A.textMut }}>Asnjë përkujtim</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map(r => {
            const rm = REMINDER_TYPES[r.type] || REMINDER_TYPES.personal
            const days = daysUntil(r.date)
            return (
              <div key={r.id} className="flex items-center gap-3 p-3.5 rounded-2xl group transition-all hover:scale-[1.005]"
                style={{ background: A.card, border: `1px solid ${A.border}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {rm.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: A.textPri }}>{r.title}</p>
                  <p className="text-[10px]" style={{ color: A.textMut }}>{fmtDate(r.date)} — {r.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black" style={{ color: days <= 7 ? '#f43f5e' : days <= 30 ? '#f59e0b' : A.accent }}>
                    {days === 0 ? 'Sot!' : days < 0 ? 'Kaluar' : `${days} ditë`}
                  </p>
                </div>
                <button onClick={() => deleteReminder(r.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all w-7 h-7 rounded-lg flex items-center justify-center ml-1"
                  style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Notes ────────────────────────────────────────────────────────────────────
function NotesView({ notes, setNotes }) {
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [search,   setSearch]   = useState('')
  const [filterCat,setFilterCat]= useState('all')
  const [form, setForm] = useState({ title: '', content: '', cat: 'personal', favorite: false })

  function saveNote() {
    if (!form.title.trim()) return
    if (editing) {
      setNotes(prev => prev.map(n => n.id === editing ? { ...n, ...form } : n))
      setEditing(null)
    } else {
      setNotes(prev => [{ id: uid(), ...form, createdAt: new Date().toISOString() }, ...prev])
    }
    setForm({ title: '', content: '', cat: 'personal', favorite: false })
    setShowForm(false)
  }
  function deleteNote(id) { setNotes(prev => prev.filter(n => n.id !== id)) }
  function toggleFav(id)  { setNotes(prev => prev.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n)) }
  function startEdit(note){ setForm({ title: note.title, content: note.content, cat: note.cat, favorite: note.favorite }); setEditing(note.id); setShowForm(true) }

  const cats = [...new Set(notes.map(n => n.cat))]
  const filtered = notes.filter(n => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || n.cat === filterCat
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: A.textMut }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Kërko shënime…"
            className="w-full text-xs rounded-xl pl-8 pr-3 py-2.5 outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${A.border}`, color: A.textPri }} />
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black whitespace-nowrap active:scale-95 transition-all"
          style={{ background: A.btn, color: 'white', boxShadow: A.btnGlow }}>
          <Plus size={11} /> Shënim i ri
        </button>
      </div>

      {/* Category filters */}
      {cats.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {[['all','Të gjitha'], ...cats.map(c => [c, CAT_META[c]?.label || c])].map(([k, l]) => (
            <button key={k} onClick={() => setFilterCat(k)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all"
              style={filterCat === k
                ? { background: A.btn, color: 'white' }
                : { background: 'rgba(255,255,255,0.04)', color: A.textMut, border: `1px solid ${A.border}` }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.20)` }}>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Titulli i shënimit…" autoFocus
            className="w-full text-sm font-bold rounded-xl px-3 py-2.5 outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Shkruaj shënimin tënd…"
            rows={4}
            className="w-full text-xs rounded-xl px-3 py-2.5 outline-none resize-none leading-relaxed"
            style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${A.border}`, color: A.textPri }} />
          <div className="flex gap-2 flex-wrap">
            {Object.entries(CAT_META).map(([k, cm]) => (
              <button key={k} onClick={() => setForm(f => ({ ...f, cat: k }))}
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all"
                style={form.cat === k
                  ? { background: cm.bg, color: cm.color, border: `1px solid ${cm.color}40` }
                  : { background: 'rgba(255,255,255,0.04)', color: A.textMut, border: `1px solid ${A.border}` }}>
                {cm.emoji} {cm.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={saveNote}
              className="flex-1 py-2.5 rounded-xl text-xs font-black text-white active:scale-95 transition-all"
              style={{ background: A.btn, boxShadow: A.btnGlow }}>
              {editing ? 'Ruaj ndryshimet' : 'Ruaj shënimin'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null) }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: A.textMut }}>Anulo</button>
          </div>
        </div>
      )}

      {/* Notes grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-sm font-bold" style={{ color: A.textMut }}>Asnjë shënim gjetur</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(note => {
            const cm = CAT_META[note.cat] || CAT_META.personal
            return (
              <div key={note.id}
                className="rounded-2xl p-4 group cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: A.card, border: `1px solid ${A.border}` }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-black leading-snug flex-1" style={{ color: A.textPri }}>{note.title}</p>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleFav(note.id)} className="transition-transform hover:scale-110">
                      <Star size={13} style={{ color: note.favorite ? '#f59e0b' : A.textMut, fill: note.favorite ? '#f59e0b' : 'none' }} />
                    </button>
                    <button onClick={() => startEdit(note)} className="opacity-0 group-hover:opacity-100 transition-all">
                      <Edit3 size={13} style={{ color: A.textMut }} />
                    </button>
                    <button onClick={() => deleteNote(note.id)} className="opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={13} style={{ color: '#f43f5e' }} />
                    </button>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: A.textSec }}>
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: cm.bg, color: cm.color }}>
                    {cm.emoji} {cm.label}
                  </span>
                  <span className="text-[9px]" style={{ color: A.textMut }}>
                    {new Date(note.createdAt).toLocaleDateString('sq-AL')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Right: Quote ─────────────────────────────────────────────────────────────
function DailyQuote() {
  const q = QUOTES[new Date().getDay() % QUOTES.length]
  const [liked, setLiked] = useState(false)
  return (
    <div className="rounded-2xl p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,rgba(5,150,105,0.15),rgba(52,211,153,0.08))', border: `1px solid rgba(52,211,153,0.22)` }}>
      <div className="absolute -top-6 -right-6 text-6xl opacity-10 pointer-events-none">✨</div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} style={{ color: A.accent }} />
        <span className="text-xs font-black" style={{ color: A.textPri }}>Citim i ditës ✨</span>
      </div>
      <p className="text-sm font-bold leading-relaxed italic mb-2" style={{ color: A.textPri }}>
        " {q.text} "
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: A.textMut }}>— {q.author}</span>
        <button onClick={() => setLiked(l => !l)} className="transition-transform hover:scale-110">
          <Heart size={14} style={{ color: liked ? '#f43f5e' : A.textMut, fill: liked ? '#f43f5e' : 'none' }} />
        </button>
      </div>
    </div>
  )
}

// ─── Right: Recent Notes ──────────────────────────────────────────────────────
function RecentNotesWidget({ notes, onViewAll }) {
  const recent = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText size={13} style={{ color: A.accent }} />
          <span className="text-sm font-black" style={{ color: A.textPri }}>Shënimet e mia</span>
        </div>
        <button onClick={onViewAll} className="text-[10px] font-semibold flex items-center gap-1" style={{ color: A.accent }}>
          Shiko të gjitha <ChevronRight size={10} />
        </button>
      </div>
      {recent.length === 0 ? (
        <p className="text-[11px] text-center py-2" style={{ color: A.textMut }}>Asnjë shënim ende</p>
      ) : (
        <div className="space-y-2">
          {recent.map(n => {
            const cm = CAT_META[n.cat] || CAT_META.personal
            return (
              <button key={n.id} onClick={onViewAll}
                className="w-full text-left p-2.5 rounded-xl transition-all hover:scale-[1.01]"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${A.border}` }}>
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-bold truncate flex-1" style={{ color: A.textPri }}>{n.title}</p>
                  {n.favorite && <Star size={10} style={{ color: '#f59e0b', fill: '#f59e0b' }} className="shrink-0 mt-0.5" />}
                </div>
                <p className="text-[10px] truncate mt-0.5" style={{ color: A.textMut }}>{n.content}</p>
                <p className="text-[9px] mt-1" style={{ color: cm.color }}>{cm.emoji} {cm.label}</p>
              </button>
            )
          })}
        </div>
      )}
      <button onClick={onViewAll}
        className="w-full mt-3 py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all"
        style={{ background: 'rgba(52,211,153,0.08)', color: A.accent, border: `1px solid rgba(52,211,153,0.15)` }}>
        <Plus size={11} /> Shto shënim të ri
      </button>
    </GlassCard>
  )
}

// ─── Right: Reminders widget ──────────────────────────────────────────────────
function RemindersWidget({ reminders, onViewAll }) {
  const upcoming = [...reminders]
    .filter(r => !r.done && daysUntil(r.date) >= 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={13} style={{ color: A.accent }} />
          <span className="text-sm font-black" style={{ color: A.textPri }}>Përkujtime të rëndësishme</span>
        </div>
        <button onClick={onViewAll} className="text-[10px] font-semibold flex items-center gap-1 whitespace-nowrap"
          style={{ color: A.accent }}>
          Shto <Plus size={10} />
        </button>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-[11px] text-center py-2" style={{ color: A.textMut }}>Asnjë përkujtim i afërt</p>
      ) : (
        <div className="space-y-2">
          {upcoming.map(r => {
            const rm = REMINDER_TYPES[r.type] || REMINDER_TYPES.personal
            const days = daysUntil(r.date)
            return (
              <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${A.border}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>{rm.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold truncate" style={{ color: A.textPri }}>{r.title}</p>
                  <p className="text-[9px]" style={{ color: A.textMut }}>{fmtDate(r.date)}</p>
                </div>
                <span className="text-[10px] font-black shrink-0"
                  style={{ color: days <= 7 ? '#f43f5e' : days <= 30 ? '#f59e0b' : A.accent }}>
                  {days === 0 ? 'Sot!' : `${days} ditë`}
                </span>
              </div>
            )
          })}
        </div>
      )}
      <button onClick={onViewAll}
        className="w-full mt-3 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1"
        style={{ color: A.textMut }}>
        Shiko të gjitha <ChevronRight size={10} />
      </button>
    </GlassCard>
  )
}

// ─── Right: Routines ──────────────────────────────────────────────────────────
function RoutinesWidget({ routines, setRoutines }) {
  const today = todayStr()
  function toggle(id) {
    setRoutines(prev => prev.map(r => {
      if (r.id !== id) return r
      const wasToday = r.lastDone === today
      return {
        ...r,
        lastDone: wasToday ? null : today,
        streak: wasToday ? Math.max(0, r.streak - 1) : r.streak + 1,
      }
    }))
  }
  const done = routines.filter(r => r.lastDone === today).length
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity size={13} style={{ color: A.accent }} />
          <span className="text-sm font-black" style={{ color: A.textPri }}>Rutinat e mia</span>
        </div>
        <span className="text-[10px] font-black" style={{ color: A.accent }}>{done}/{routines.length} sot</span>
      </div>
      <div className="space-y-2">
        {routines.map(r => {
          const isDone = r.lastDone === today
          return (
            <button key={r.id} onClick={() => toggle(r.id)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:scale-[1.01]"
              style={{ background: isDone ? 'rgba(52,211,153,0.10)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isDone ? 'rgba(52,211,153,0.25)' : A.border}` }}>
              <span className="text-base leading-none">{r.emoji}</span>
              <span className="flex-1 text-[11px] font-bold" style={{ color: isDone ? A.accent : A.textPri }}>{r.label}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {r.streak > 0 && (
                  <span className="text-[9px] font-black flex items-center gap-0.5" style={{ color: '#f59e0b' }}>
                    🔥 {r.streak}
                  </span>
                )}
                {isDone
                  ? <CheckCircle size={14} style={{ color: A.accentD }} />
                  : <Circle      size={14} style={{ color: A.textMut }} />
                }
              </div>
            </button>
          )
        })}
      </div>
      <p className="text-[9px] mt-3 text-center" style={{ color: A.textMut }}>Klikoni për të shënuar si të kryer</p>
    </GlassCard>
  )
}

// ─── Right: Weekly Goals ──────────────────────────────────────────────────────
function WeeklyGoalsWidget({ tasks }) {
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  const weekTasks = tasks.filter(t => new Date(t.date) >= weekAgo)
  const done = weekTasks.filter(t => t.done).length
  const total = weekTasks.length || 1
  const pct = Math.round((done / total) * 100)

  const goals = [
    { label: '7 detyra të kryera', target: 7,  current: done,    icon: CheckSquare },
    { label: '5 rutina ditore',    target: 5,   current: 3,       icon: Activity    },
    { label: '3 shënime të reja',  target: 3,   current: 1,       icon: FileText    },
  ]

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Target size={13} style={{ color: A.accent }} />
        <span className="text-sm font-black" style={{ color: A.textPri }}>Objektivat e javës</span>
      </div>
      <div className="space-y-3">
        {goals.map(g => {
          const gPct = Math.min(100, Math.round((g.current / g.target) * 100))
          const Icon = g.icon
          return (
            <div key={g.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon size={11} style={{ color: A.textMut }} />
                  <span className="text-[11px] font-semibold" style={{ color: A.textSec }}>{g.label}</span>
                </div>
                <span className="text-[10px] font-black" style={{ color: gPct >= 100 ? A.accent : A.textMut }}>
                  {g.current}/{g.target}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${gPct}%`, background: gPct >= 100 ? `linear-gradient(90deg,${A.accentDD},${A.accent})` : `linear-gradient(90deg,rgba(52,211,153,0.50),rgba(52,211,153,0.70))` }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${A.border}` }}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px]" style={{ color: A.textMut }}>Progresi total</span>
          <span className="text-[10px] font-black" style={{ color: A.accent }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg,${A.accentDD},${A.accent})` }} />
        </div>
      </div>
    </GlassCard>
  )
}

// ─── AI Suggest ───────────────────────────────────────────────────────────────
function AISuggest({ tasks, routines, externalOpen, onExternalClose }) {
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [plan,    setPlan]    = useState(null)

  useEffect(() => {
    if (externalOpen && !open) generate()
  }, [externalOpen])

  function close() { setOpen(false); onExternalClose?.() }

  function generate() {
    setLoading(true); setPlan(null); setOpen(true)
    const today = todayStr()
    const todayTasks = tasks.filter(t => t.date === today && !t.done)
    const doneRoutines = routines.filter(r => r.lastDone === today)
    setTimeout(() => {
      const h = new Date().getHours()
      const blocks = []
      if (h < 9)  blocks.push({ time: '07:00–08:00', act: 'Meditim mëngjesi + frymëmarrje', icon: '🧘', why: 'Fillo ditën me qetësi' })
      if (h < 12) blocks.push({ time: '09:00–11:00', act: 'Punë e thellë (deep work)', icon: '💼', why: 'Energjia kognitive është në kulm' })
      blocks.push({ time: '12:30–13:00', act: 'Pushim aktiv — ec 10 min', icon: '🚶', why: 'Ndihmon fokusin e pasdites' })
      if (todayTasks.length > 0) blocks.push({ time: '14:00–16:00', act: todayTasks[0].title, icon: '✅', why: 'Prioritet i lartë i ditës' })
      blocks.push({ time: '17:00–18:00', act: 'Aktivitet fizik', icon: '💪', why: 'Ul kortizolinë, rrit energjinë' })
      blocks.push({ time: '21:00–21:30', act: 'Lexim + Ditar', icon: '📚', why: 'Reflektim para gjumit' })
      setPlan(blocks); setLoading(false)
    }, 1400)
  }

  return (
    <>
      <button onClick={generate}
        className="w-full flex items-center gap-3 p-4 rounded-2xl text-white transition-all active:scale-95 hover:opacity-90"
        style={{ background: A.btn, boxShadow: A.btnGlow }}>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles size={17} color="white" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-black">✨ Sugjero Ditën Time</p>
          <p className="text-[11px] text-white/65">AI analizon detyrat & rutinat tua</p>
        </div>
        <ChevronRight size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={close}>
          <div className="absolute inset-0" style={{ background: 'rgba(8,20,16,0.90)', backdropFilter: 'blur(12px)' }} />
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(160deg,#0c1e16,#081410)', border: `1px solid rgba(52,211,153,0.25)`, boxShadow: '0 24px 80px rgba(0,0,0,0.60)' }}
            onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: A.accent }} />
                  <span className="text-sm font-black" style={{ color: A.textPri }}>Plani i ditës — AI</span>
                </div>
                <button onClick={close} className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.07)', color: A.textMut }}>
                  <X size={13} />
                </button>
              </div>
              {loading ? (
                <div className="py-8 flex flex-col items-center gap-3">
                  <div className="flex gap-1.5">
                    {[0,1,2].map(d => <div key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: A.accent, animationDelay: `${d*0.15}s` }} />)}
                  </div>
                  <p className="text-xs" style={{ color: A.textMut }}>Duke analizuar kalendarin tënd…</p>
                </div>
              ) : plan && (
                <div className="space-y-2">
                  {plan.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(52,211,153,0.07)', border: `1px solid rgba(52,211,153,0.12)` }}>
                      <span className="text-lg leading-none shrink-0">{b.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(52,211,153,0.15)', color: A.accent }}>{b.time}</span>
                        </div>
                        <p className="text-xs font-bold" style={{ color: A.textPri }}>{b.act}</p>
                        <p className="text-[10px]" style={{ color: A.textMut }}>{b.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Weekly Hormone-Balancing Diet ───────────────────────────────────────────
const DIET_DAYS = [
  {
    day: 'E Hënë', short: 'Hën',
    meals: [
      { label: 'Mëngjes', emoji: '🌅', foods: 'Tërshëra + banane + arra greku', note: 'Triptofani → serotonin', photo: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=340&fit=crop&auto=format' },
      { label: 'Drekë',   emoji: '☀️', foods: 'Salmon i pjekur + oriz kaf + brokoli', note: 'Omega-3 ul kortizolin', photo: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=340&fit=crop&auto=format' },
      { label: 'Darkë',   emoji: '🌙', foods: 'Vezë + avokado + spinaq', note: 'B6 + magnez → gjumë cilësor', photo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=340&fit=crop&auto=format' },
    ],
  },
  {
    day: 'E Martë', short: 'Mar',
    meals: [
      { label: 'Mëngjes', emoji: '🌅', foods: 'Kos grek + luleshtrydhe + fara liri', note: 'Probiotikë + fitoestrogenë', photo: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=340&fit=crop&auto=format' },
      { label: 'Drekë',   emoji: '☀️', foods: 'Gjeldeti i gatuar + patate të embla + fasule jeshile', note: 'Triptofan + krom → insulinë stabile', photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=340&fit=crop&auto=format' },
      { label: 'Darkë',   emoji: '🌙', foods: 'Supë thjerrëzash + bukë gruri integral', note: 'Hekur + fibra → energji e qëndrueshme', photo: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=340&fit=crop&auto=format' },
    ],
  },
  {
    day: 'E Mërkurë', short: 'Mër',
    meals: [
      { label: 'Mëngjes', emoji: '🌅', foods: 'Smoothie: spinaq + banane + bajame + fara kia', note: 'Magnez + K + serotonin', photo: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&h=340&fit=crop&auto=format' },
      { label: 'Drekë',   emoji: '☀️', foods: 'Sardele + quinoa + asparagus', note: 'D3 + selenë → tiroide e shëndetshme', photo: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=340&fit=crop&auto=format' },
      { label: 'Darkë',   emoji: '🌙', foods: 'Mish pule i lehtë + brokoli + ulliri', note: 'Indol-3-karbinol balanton estrogjenin', photo: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=600&h=340&fit=crop&auto=format' },
    ],
  },
  {
    day: 'E Enjte', short: 'Enj',
    meals: [
      { label: 'Mëngjes', emoji: '🌅', foods: 'Vezë të ziera + avokado + bukë thekre', note: 'Kolina → funksion i trurit', photo: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=340&fit=crop&auto=format' },
      { label: 'Drekë',   emoji: '☀️', foods: 'Tofu + perime të kaluara + oriz kaf', note: 'Izoflavonet + zink → hormon seksuale', photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=340&fit=crop&auto=format' },
      { label: 'Darkë',   emoji: '🌙', foods: 'Mish viçi i ligët + spinaq + arra', note: 'Hekuri + B12 → dopaminë', photo: 'https://images.unsplash.com/photo-1544025162-d76538b2a5d0?w=600&h=340&fit=crop&auto=format' },
    ],
  },
  {
    day: 'E Premte', short: 'Pre',
    meals: [
      { label: 'Mëngjes', emoji: '🌅', foods: 'Tërshëra + manaferrat + fara liri + mjalt', note: 'Antooksidantë ulin inflamimin', photo: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&h=340&fit=crop&auto=format' },
      { label: 'Drekë',   emoji: '☀️', foods: 'Salmon + sallatë avokado + ulliri', note: 'Omega-3 + E → kortizol i ulët', photo: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=340&fit=crop&auto=format' },
      { label: 'Darkë',   emoji: '🌙', foods: 'Gjeldeti + batatë + brokoli', note: 'Triptofan + karbohidrate → relaksim', photo: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=340&fit=crop&auto=format' },
    ],
  },
  {
    day: 'E Shtunë', short: 'Sht',
    meals: [
      { label: 'Mëngjes', emoji: '🌅', foods: 'Frittata me spinaq + kerpudha + djathë dhie', note: 'B2 + D + proteina → qetësi', photo: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&h=340&fit=crop&auto=format' },
      { label: 'Drekë',   emoji: '☀️', foods: 'Peshk i pjekur + sallatë me gruar + ulliri', note: 'Jodi + magnez → tiroide', photo: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=340&fit=crop&auto=format' },
      { label: 'Darkë',   emoji: '🌙', foods: 'Çokollatë e zezë 85% + arra brazilje + kos', note: 'Magnez + selenë → melatonin', photo: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&h=340&fit=crop&auto=format' },
    ],
  },
  {
    day: 'E Diel', short: 'Die',
    meals: [
      { label: 'Mëngjes', emoji: '🌅', foods: 'Smoothie bowl: fara kia + manaferra + bajame', note: 'Omega-3 + antioks → humor pozitiv', photo: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=340&fit=crop&auto=format' },
      { label: 'Drekë',   emoji: '☀️', foods: 'Mish qengji i ligët + perime të pjekura + oriz kaf', note: 'Zink + hekur → testosteron & energji', photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=340&fit=crop&auto=format' },
      { label: 'Darkë',   emoji: '🌙', foods: 'Supë miso + tofu + alga deti', note: 'Jodi + probiotikë → tiroide & zorre', photo: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=340&fit=crop&auto=format' },
    ],
  },
]

const MEAL_COLORS = {
  'Mëngjes': { bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.20)', dot: '#fbbf24' },
  'Drekë':   { bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.20)', dot: '#34d399' },
  'Darkë':   { bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.20)', dot: '#8b5cf6' },
}

// ─── Diet Full-Screen Modal ───────────────────────────────────────────────────
function DietModal({ initialDay = 0, onClose }) {
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 })()
  const [selDay, setSelDay]   = useState(initialDay)
  const [photos, setPhotos]   = useLS('ns_diet_custom_photos', () => ({}))
  const fileRef               = useRef(null)
  const uploadTarget          = useRef(null) // { dayIdx, mealIdx }

  const day = DIET_DAYS[selDay]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [onClose])

  function openUpload(dayIdx, mealIdx) {
    uploadTarget.current = { dayIdx, mealIdx }
    fileRef.current.value = ''
    fileRef.current.click()
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const key = `${uploadTarget.current.dayIdx}_${uploadTarget.current.mealIdx}`
      setPhotos(prev => ({ ...prev, [key]: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  function getMealPhoto(dayIdx, mealIdx, fallback) {
    return photos[`${dayIdx}_${mealIdx}`] || fallback
  }

  function removePhoto(dayIdx, mealIdx) {
    const key = `${dayIdx}_${mealIdx}`
    setPhotos(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  return (
    <div className="fixed inset-0 z-[300] flex" style={{ background: 'rgba(4,10,18,0.94)', backdropFilter: 'blur(14px)' }}>
      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* ── LEFT sidebar: days list ── */}
      <div className="w-64 shrink-0 flex flex-col overflow-y-auto" style={{ background: 'rgba(8,20,16,0.97)', borderRight: '1px solid rgba(52,211,153,0.15)' }}>
        {/* top bar */}
        <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(52,211,153,0.15)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>🥗</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white leading-tight">Dieta Javore</p>
            <p className="text-[9px]" style={{ color: '#34d399' }}>7 ditë · 3 vakte · me foto</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Day list */}
        <div className="flex-1 p-3 space-y-2">
          {DIET_DAYS.map((d, i) => {
            const active = selDay === i
            const firstMealPhoto = getMealPhoto(i, 0, d.meals[0].photo)
            return (
              <button key={i} onClick={() => setSelDay(i)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200"
                style={active
                  ? { background: 'linear-gradient(135deg,rgba(5,150,105,0.28),rgba(52,211,153,0.12))', border: '1px solid rgba(52,211,153,0.40)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
                }>
                {/* thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img src={firstMealPhoto} alt={d.day} className="w-full h-full object-cover" style={{ filter: 'brightness(0.80)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black truncate" style={{ color: active ? 'white' : 'rgba(255,255,255,0.75)' }}>
                    {d.day}
                  </p>
                  {i === todayIdx && (
                    <span className="text-[9px] font-bold" style={{ color: '#34d399' }}>● sot</span>
                  )}
                </div>
                {active && <div className="w-1 h-6 rounded-full shrink-0" style={{ background: 'linear-gradient(180deg,#059669,#34d399)' }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── RIGHT main area ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

        {/* Header bar — no big hero photo */}
        <div className="px-8 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(52,211,153,0.12)', background: 'rgba(8,20,16,0.80)' }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 4px 18px rgba(5,150,105,0.40)' }}>🥗</div>
          <div className="flex-1">
            <p className="text-xl font-black text-white leading-tight">{day.day}</p>
            <p className="text-sm mt-0.5" style={{ color: '#34d399' }}>Ekuilibër hormonal · Disponim pozitiv</p>
          </div>
          {selDay === todayIdx && (
            <span className="text-xs font-black px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.30)' }}>
              ● Sot
            </span>
          )}
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 ml-2"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.60)' }}>
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">

          {/* Meals header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,rgba(52,211,153,0.35),transparent)' }} />
            <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: '#34d399' }}>3 vakte ditore</p>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(52,211,153,0.35))' }} />
          </div>

          {/* Meal cards — horizontal: small photo left, text right */}
          <div className="space-y-3 mb-6">
            {day.meals.map((m, mealIdx) => {
              const mc = MEAL_COLORS[m.label]
              const customPhoto = photos[`${selDay}_${mealIdx}`]
              const src = customPhoto || m.photo
              const isCustom = !!customPhoto
              return (
                <div key={m.label} className="rounded-2xl overflow-hidden group/meal flex flex-row items-stretch"
                  style={{ background: mc.bg, border: `1px solid ${isCustom ? mc.border.replace('0.20','0.50') : mc.border}`, minHeight: 100 }}>

                  {/* Small photo — left side */}
                  <div className="relative shrink-0" style={{ width: 110 }}>
                    <img src={src} alt={m.label}
                      className="w-full h-full object-cover transition-all duration-300"
                      style={{ filter: 'brightness(0.75) saturate(1.10)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,transparent 60%,rgba(4,12,8,0.60))' }} />

                    {/* Custom badge */}
                    {isCustom && (
                      <div className="absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(5,150,105,0.85)', color: 'white' }}>
                        ✓
                      </div>
                    )}

                    {/* Upload overlay — visible on hover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover/meal:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(4,10,18,0.72)', backdropFilter: 'blur(4px)' }}>
                      <button
                        onClick={() => openUpload(selDay, mealIdx)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black text-white transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
                        📤 Ngarko
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => removePhoto(selDay, mealIdx)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
                          style={{ background: 'rgba(244,63,94,0.25)', color: '#f87171', border: '1px solid rgba(244,63,94,0.35)' }}>
                          🗑 Hiq
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Text — right side */}
                  <div className="flex-1 px-4 py-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg leading-none">{m.emoji}</span>
                        <span className="text-xs font-black" style={{ color: mc.dot }}>{m.label}</span>
                        <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: mc.dot, boxShadow: `0 0 5px ${mc.dot}` }} />
                      </div>
                      <p className="text-[15px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.92)' }}>{m.foods}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[9px]" style={{ color: mc.dot }}>✦</span>
                      <p className="text-[11px] italic" style={{ color: 'rgba(255,255,255,0.50)' }}>{m.note}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Science footer */}
          <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
            style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.18)' }}>
            <span className="text-xl shrink-0 mt-0.5">🔬</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#34d399' }}>Burime shkencore</p>
              <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.55)' }}>
                J. Psychiatry Neurosci. · Nutrients · Frontiers in Endocrinology · PubMed
              </p>
            </div>
          </div>

          {/* Day navigation */}
          <div className="flex gap-3 mt-5">
            <button onClick={() => setSelDay(s => Math.max(0, s - 1))}
              disabled={selDay === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <ChevronLeft size={14} /> Dita e kaluar
            </button>
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {DIET_DAYS.map((_, i) => (
                <button key={i} onClick={() => setSelDay(i)}
                  className="rounded-full transition-all duration-200"
                  style={{ width: selDay === i ? 20 : 6, height: 6, background: selDay === i ? 'linear-gradient(90deg,#059669,#34d399)' : 'rgba(255,255,255,0.18)' }} />
              ))}
            </div>
            <button onClick={() => setSelDay(s => Math.min(DIET_DAYS.length - 1, s + 1))}
              disabled={selDay === DIET_DAYS.length - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg,#059669,#047857)', color: 'white', boxShadow: '0 4px 14px rgba(5,150,105,0.35)' }}>
              Dita tjetër <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Diet Preview Card (clickable → opens DietModal) ─────────────────────────
function WeeklyDietCard() {
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 })()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDay,  setModalDay]  = useState(todayIdx)

  function open(i = todayIdx) { setModalDay(i); setModalOpen(true) }

  return (
    <>
      {modalOpen && <DietModal initialDay={modalDay} onClose={() => setModalOpen(false)} />}

      <div className="rounded-3xl overflow-hidden flex flex-col cursor-pointer group transition-all duration-200 hover:scale-[1.01]"
        onClick={() => open(todayIdx)}
        style={{
          background: 'linear-gradient(160deg,#0a1f18 0%,#0d2a1e 60%,#091710 100%)',
          border: '1px solid rgba(52,211,153,0.20)',
          boxShadow: '0 8px 40px rgba(5,150,105,0.18)',
        }}>

        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.25),transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(52,211,153,0.30),transparent)' }} />
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(52,211,153,0.22),rgba(5,150,105,0.16))', border: '1px solid rgba(52,211,153,0.28)' }}>
              🥗
            </div>
            <div className="flex-1">
              <p className="text-sm font-black" style={{ color: 'rgba(255,255,255,0.95)' }}>Dieta Javore</p>
              <p className="text-[10px]" style={{ color: A.accent }}>Hormonet · Serotonin · Disponim</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all group-hover:scale-105"
              style={{ background: A.btn, color: 'white', boxShadow: A.btnGlow }}>
              Hap <ChevronRight size={11} />
            </div>
          </div>
        </div>

        {/* Meal photo grid preview — 3 meals × today */}
        <div className="grid grid-cols-3 gap-1.5 px-4 pb-2">
          {DIET_DAYS.map((d, i) => (
            <button key={i}
              onClick={ev => { ev.stopPropagation(); open(i) }}
              className="relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 hover:z-10"
              style={{ height: 80 }}>
              <img src={d.meals[0].photo} alt={d.day} className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.70) saturate(1.1)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(4,12,8,0.85),transparent 55%)' }} />
              <div className="absolute bottom-1.5 left-0 right-0 text-center">
                <p className="text-[9px] font-black text-white leading-tight px-1 truncate">{d.short}</p>
                {i === todayIdx && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#34d399' }} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mx-4 mb-4 rounded-xl px-4 py-2.5 flex items-center justify-between"
          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.18)' }}>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            7 ditë · 21 vakte · foto + ngarkuese · bazuar shkencërisht
          </p>
          <ChevronRight size={13} style={{ color: A.accent }} />
        </div>
      </div>
    </>
  )
}

// ─── Exercise Mood Card ───────────────────────────────────────────────────────
const EXERCISES = [
  {
    id: 1, name: 'Ecje e shpejtë', emoji: '🚶', time: '20–30 min', intensity: 'E ulët',
    benefit: 'Serotonin ↑  Kortizol ↓', benefitColor: '#34d399',
    photo: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=400&fit=crop&auto=format',
    science: 'Ecja 20 min/ditë rrit serotonin me 30% dhe ul kortizolin (Sharma et al., 2006)',
    steps: [
      { text: 'Ec me ritëm të qëndrueshëm mesatar — mos nxito', photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=320&fit=crop&auto=format' },
      { text: 'Mbaj shpinën drejt, shikimet përpara, supet relaks', photo: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&h=320&fit=crop&auto=format' },
      { text: 'Frymëmarrje e thellë me hundë 4 sek — nxjerr me gojë 6 sek', photo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=320&fit=crop&auto=format' },
      { text: 'Prefero park, natyrë ose rrugë të qetë — larg ekraneve', photo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=320&fit=crop&auto=format' },
    ],
  },
  {
    id: 2, name: 'Joga', emoji: '🧘', time: '15–25 min', intensity: 'E ulët',
    benefit: 'Ankth ↓  GABA ↑', benefitColor: '#8b5cf6',
    photo: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&h=400&fit=crop&auto=format',
    science: 'Joga rrit GABA me 27% — po aq efektive sa ilaçet anxiolitike (Streeter et al., 2010)',
    steps: [
      { text: 'Pozicioni i fëmijës — gjunjëzohesh, ul ballin në dysheme, mbaj 2 min', photo: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&h=320&fit=crop&auto=format' },
      { text: 'Cat-Cow stretch — katër këmbësh, lëviz shpinën lart-poshtë, 10 herë', photo: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=500&h=320&fit=crop&auto=format' },
      { text: 'Warrior II — hap këmbët gjerë, krah drejt, 5 frymëmarrje çdo anë', photo: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&h=320&fit=crop&auto=format' },
      { text: 'Shavasana — shtrihesh shpine, mbyll sytë, relaksim total 5 min', photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=320&fit=crop&auto=format' },
    ],
  },
  {
    id: 3, name: 'HIIT', emoji: '⚡', time: '12–15 min', intensity: 'E lartë',
    benefit: 'Dopaminë ↑  Endorfina ↑', benefitColor: '#f43f5e',
    photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop&auto=format',
    science: 'HIIT rrit BDNF (faktori neuronal i rritjes) me 32% — "vrapim për trurin" (Raichlen & Alexander, 2017)',
    steps: [
      { text: 'Squat Jumps — 30 sek aktive + 15 sek pushim — 4 seri', photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=320&fit=crop&auto=format' },
      { text: 'Mountain Climbers — 30 sek me ritëm të shpejtë + 15 sek pushim', photo: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=500&h=320&fit=crop&auto=format' },
      { text: 'Burpees — 30 sek qëndrim + 15 sek pushim — nxeh të gjithë trupin', photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=320&fit=crop&auto=format' },
      { text: 'Ftohje aktive — shtrihesh, frymëmarrje e thellë, stretch lehtë 3 min', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=320&fit=crop&auto=format' },
    ],
  },
  {
    id: 4, name: 'Vallëzim i lirë', emoji: '💃', time: '10–20 min', intensity: 'Mesatare',
    benefit: 'Dopaminë ↑  Izolim ↓', benefitColor: '#f59e0b',
    photo: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=400&fit=crop&auto=format',
    science: 'Vallëzimi aktivizon reward circuits njëlloj si dashuria romantike (Brown et al., 2006 · NeuroImage)',
    steps: [
      { text: 'Zgjidh muzikën që të bën të lumtur — volume lart!', photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=320&fit=crop&auto=format' },
      { text: 'Lëviz trupin spontanisht — mos gjyko veten, je vetëm', photo: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&h=320&fit=crop&auto=format' },
      { text: 'Fokusohu vetëm tek ritmi — lër mendimin të shkojë', photo: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=500&h=320&fit=crop&auto=format' },
      { text: 'Mbyll sytë, ndie trupin, shijo çdo sekondë të lëvizjes', photo: 'https://images.unsplash.com/photo-1519925610903-381054cc2a1c?w=500&h=320&fit=crop&auto=format' },
    ],
  },
  {
    id: 5, name: 'Stërvitje forcash', emoji: '💪', time: '25–35 min', intensity: 'Mesatare-lartë',
    benefit: 'Testosteron ↑  Vetëbesim ↑', benefitColor: '#14b8a6',
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop&auto=format',
    science: 'Stërvitja e forcës ul simptomat depresive me 45% (Gordon et al., 2018 · JAMA Psychiatry)',
    steps: [
      { text: '3 × 10 Push-ups — gjoks e krahë — shpina drejt gjatë gjithë kohës', photo: 'https://images.unsplash.com/photo-1616279969096-54b228b1c0d4?w=500&h=320&fit=crop&auto=format' },
      { text: '3 × 15 Squats me peshën e trupit — gjunjët mbi majë të këmbës', photo: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&h=320&fit=crop&auto=format' },
      { text: '3 × 10 Dips — duart mbi karrige/karikë, ul trupin ngadalë', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=320&fit=crop&auto=format' },
      { text: '3 × 30 sek Plank — barka e tensionuar, trupi drejt si dërrasë', photo: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=500&h=320&fit=crop&auto=format' },
    ],
  },
  {
    id: 6, name: 'Frymëmarrje 4-7-8', emoji: '🌬️', time: '5–10 min', intensity: 'Shumë e ulët',
    benefit: 'Stres ↓↓  Melatonin ↑', benefitColor: '#3b82f6',
    photo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop&auto=format',
    science: 'Teknika 4-7-8 aktivizon nervus vagus — ul frekuencën kardiake brenda 60 sek (Zaccaro et al., 2018)',
    steps: [
      { text: 'Ul veten komod — shpina drejt, duart mbi gjunjë, mbyll sytë', photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=320&fit=crop&auto=format' },
      { text: 'Thith frymë ngadalë me hundë — numëro 4 sekonda', photo: 'https://images.unsplash.com/photo-1559595500-c5f23e2a95b0?w=500&h=320&fit=crop&auto=format' },
      { text: 'Mbaj frymën — numëro 7 sekonda pa lëvizje', photo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=320&fit=crop&auto=format' },
      { text: 'Nxjerr ngadalë me gojë — 8 sekonda, si fishkëllimë e butë — Përsërit 4×', photo: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&h=320&fit=crop&auto=format' },
    ],
  },
]

const INTENSITY_META = {
  'E ulët':           { bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
  'Mesatare':         { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  'Mesatare-lartë':   { bg: 'rgba(20,184,166,0.12)',  color: '#14b8a6' },
  'E lartë':          { bg: 'rgba(244,63,94,0.12)',   color: '#f43f5e' },
  'Shumë e ulët':     { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
}

// ─── Exercise Full-Screen Modal ───────────────────────────────────────────────
function ExerciseModal({ initialIdx = 0, onClose }) {
  const [sel, setSel]       = useState(initialIdx)
  const [photos, setPhotos] = useLS('ns_ex_custom_photos', () => ({}))
  const fileRef             = useRef(null)
  const uploadTarget        = useRef(null) // { exId, stepIdx }

  const ex = EXERCISES[sel]
  const im = INTENSITY_META[ex.intensity] || INTENSITY_META['Mesatare']

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [onClose])

  function openUpload(exId, stepIdx) {
    uploadTarget.current = { exId, stepIdx }
    fileRef.current.value = ''
    fileRef.current.click()
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const key = `${uploadTarget.current.exId}_${uploadTarget.current.stepIdx}`
      setPhotos(prev => ({ ...prev, [key]: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  function getStepPhoto(exId, stepIdx, fallback) {
    return photos[`${exId}_${stepIdx}`] || fallback
  }

  function removePhoto(exId, stepIdx) {
    const key = `${exId}_${stepIdx}`
    setPhotos(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  return (
    <div className="fixed inset-0 z-[300] flex" style={{ background: 'rgba(4,10,18,0.94)', backdropFilter: 'blur(14px)' }}>
      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* ── LEFT sidebar: exercise list ── */}
      <div className="w-64 shrink-0 flex flex-col overflow-y-auto" style={{ background: 'rgba(14,26,38,0.95)', borderRight: '1px solid rgba(99,102,241,0.15)' }}>
        {/* top bar */}
        <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)' }}>🏃</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white leading-tight">Ushtrime Mendore</p>
            <p className="text-[9px]" style={{ color: '#818cf8' }}>6 ushtrime · me foto demo</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Exercise list */}
        <div className="flex-1 p-3 space-y-2">
          {EXERCISES.map((e, i) => {
            const active = sel === i
            const im2 = INTENSITY_META[e.intensity] || INTENSITY_META['Mesatare']
            return (
              <button key={e.id} onClick={() => setSel(i)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200"
                style={active
                  ? { background: 'linear-gradient(135deg,rgba(79,70,229,0.25),rgba(59,130,246,0.15))', border: '1px solid rgba(99,102,241,0.40)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
                }>
                {/* thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img src={e.photo} alt={e.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.80)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black truncate" style={{ color: active ? 'white' : 'rgba(255,255,255,0.75)' }}>
                    {e.emoji} {e.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-bold" style={{ color: im2.color }}>⏱ {e.time}</span>
                  </div>
                </div>
                {active && <div className="w-1 h-6 rounded-full shrink-0" style={{ background: 'linear-gradient(180deg,#4f46e5,#3b82f6)' }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── RIGHT main area ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

        {/* Header bar — compact, no big hero */}
        <div className="px-8 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)', background: 'rgba(10,14,26,0.80)' }}>
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0" style={{ border: '2px solid rgba(99,102,241,0.30)' }}>
            <img src={ex.photo} alt={ex.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.15)' }} />
          </div>
          <div className="flex-1">
            <p className="text-xl font-black text-white leading-tight">{ex.emoji} {ex.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-bold" style={{ color: ex.benefitColor }}>{ex.benefit}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: im.bg, color: im.color }}>⏱ {ex.time}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: im.bg, color: im.color }}>{ex.intensity}</span>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 ml-2"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.60)' }}>
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">

          {/* Steps header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,rgba(99,102,241,0.35),transparent)' }} />
            <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: '#818cf8' }}>Hap pas hapi</p>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.35))' }} />
          </div>

          {/* Steps — horizontal cards: small photo left, text right */}
          <div className="space-y-3 mb-6">
            {ex.steps.map((step, i) => {
              const customPhoto = photos[`${ex.id}_${i}`]
              const src = customPhoto || step.photo
              const isCustom = !!customPhoto
              return (
                <div key={i} className="rounded-2xl overflow-hidden flex flex-row items-stretch group/step"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${isCustom ? 'rgba(99,102,241,0.45)' : 'rgba(99,102,241,0.18)'}`, minHeight: 100 }}>

                  {/* Small photo — left */}
                  <div className="relative shrink-0" style={{ width: 110 }}>
                    <img src={src} alt={`Hapi ${i+1}`}
                      className="w-full h-full object-cover transition-all duration-300"
                      style={{ filter: 'brightness(0.75) saturate(1.10)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,transparent 60%,rgba(14,26,38,0.55))' }} />

                    {/* Step number */}
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                      style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)', boxShadow: '0 3px 10px rgba(79,70,229,0.55)' }}>
                      {i + 1}
                    </div>

                    {isCustom && (
                      <div className="absolute bottom-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(79,70,229,0.85)', color: 'white' }}>✓</div>
                    )}

                    {/* Upload overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover/step:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(4,10,18,0.72)', backdropFilter: 'blur(4px)' }}>
                      <button
                        onClick={() => openUpload(ex.id, i)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black text-white transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)' }}>
                        📤 Ngarko
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => removePhoto(ex.id, i)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
                          style={{ background: 'rgba(244,63,94,0.25)', color: '#f87171', border: '1px solid rgba(244,63,94,0.35)' }}>
                          🗑 Hiq
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Text — right */}
                  <div className="flex-1 px-4 py-3 flex items-center">
                    <p className="text-[15px] font-semibold leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)' }}>{step.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Science note */}
          <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.20)' }}>
            <span className="text-xl shrink-0 mt-0.5">🔬</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#818cf8' }}>Studimi shkencor</p>
              <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.60)' }}>{ex.science}</p>
            </div>
          </div>

          {/* Navigation between exercises */}
          <div className="flex gap-3 mt-5">
            <button onClick={() => setSel(s => Math.max(0, s - 1))}
              disabled={sel === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <ChevronLeft size={14} /> Mëparshmi
            </button>
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {EXERCISES.map((_, i) => (
                <button key={i} onClick={() => setSel(i)}
                  className="rounded-full transition-all duration-200"
                  style={{ width: sel === i ? 20 : 6, height: 6, background: sel === i ? 'linear-gradient(90deg,#4f46e5,#3b82f6)' : 'rgba(255,255,255,0.18)' }} />
              ))}
            </div>
            <button onClick={() => setSel(s => Math.min(EXERCISES.length - 1, s + 1))}
              disabled={sel === EXERCISES.length - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)', color: 'white', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
              Tjetri <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Exercise Preview Card (clickable → opens modal) ─────────────────────────
function ExerciseMoodCard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIdx,  setModalIdx]  = useState(0)

  function open(i = 0) { setModalIdx(i); setModalOpen(true) }

  return (
    <>
      {modalOpen && <ExerciseModal initialIdx={modalIdx} onClose={() => setModalOpen(false)} />}

      <div className="rounded-3xl overflow-hidden flex flex-col cursor-pointer group transition-all duration-200 hover:scale-[1.01]"
        onClick={() => open(0)}
        style={{
          background: 'linear-gradient(160deg,#0e1a26 0%,#0a1520 60%,#070d18 100%)',
          border: '1px solid rgba(59,130,246,0.18)',
          boxShadow: '0 8px 40px rgba(59,130,246,0.12)',
        }}>

        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.22),transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.30),transparent)' }} />
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(59,130,246,0.18))', border: '1px solid rgba(99,102,241,0.30)' }}>
              🏃
            </div>
            <div className="flex-1">
              <p className="text-sm font-black" style={{ color: 'rgba(255,255,255,0.95)' }}>Ushtrime Mendore</p>
              <p className="text-[10px]" style={{ color: '#818cf8' }}>Lëvizje · Humor · Shëndet mendor</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)', color: 'white', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
              Hap <ChevronRight size={11} />
            </div>
          </div>
        </div>

        {/* Exercise photo grid preview — 2×3 */}
        <div className="grid grid-cols-3 gap-1.5 px-4 pb-2">
          {EXERCISES.map((e, i) => (
            <button key={e.id}
              onClick={ev => { ev.stopPropagation(); open(i) }}
              className="relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 hover:z-10"
              style={{ height: 80 }}>
              <img src={e.photo} alt={e.name} className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.70) saturate(1.1)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(7,13,24,0.80),transparent 55%)' }} />
              <div className="absolute bottom-1.5 left-0 right-0 text-center">
                <p className="text-[9px] font-black text-white leading-tight px-1 truncate">{e.emoji} {e.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mx-4 mb-4 rounded-xl px-4 py-2.5 flex items-center justify-between"
          style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)' }}>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            6 ushtrime · foto demonstruese · bazuar shkencërisht
          </p>
          <ChevronRight size={13} style={{ color: '#818cf8' }} />
        </div>
      </div>
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Assistant() {
  const [tasks,     setTasks]     = useLS('ns_ass_tasks',     seedTasks)
  const [notes,     setNotes]     = useLS('ns_ass_notes',     seedNotes)
  const [reminders, setReminders] = useLS('ns_ass_reminders', seedReminders)
  const [routines,  setRoutines]  = useLS('ns_ass_routines',  seedRoutines)
  const [addModal,  setAddModal]  = useState({ open: false, date: todayStr() })
  const [drawer,    setDrawer]    = useState(null) // 'notes' | 'reminders' | 'tasks'
  const [aiOpen,    setAiOpen]    = useState(false)

  function openAdd(date) { setAddModal({ open: true, date: date || todayStr() }) }
  function saveTask(task) { setTasks(prev => [...prev, task]) }

  return (
    <PublicLayout>
      {addModal.open && (
        <AddTaskModal
          defaultDate={addModal.date}
          onSave={saveTask}
          onClose={() => setAddModal(m => ({ ...m, open: false }))}
        />
      )}
      {drawer === 'notes' && (
        <PanelDrawer title="Shënimet e mia" icon={<FileText size={15} color="white" />} onClose={() => setDrawer(null)}>
          <NotesView notes={notes} setNotes={setNotes} />
        </PanelDrawer>
      )}
      {drawer === 'reminders' && (
        <PanelDrawer title="Përkujtime të rëndësishme" icon={<Bell size={15} color="white" />} onClose={() => setDrawer(null)}>
          <RemindersView reminders={reminders} setReminders={setReminders} />
        </PanelDrawer>
      )}
      {drawer === 'tasks' && (
        <PanelDrawer title="Të gjitha detyrat" icon={<CheckSquare size={15} color="white" />} onClose={() => setDrawer(null)}>
          <TasksView tasks={tasks} setTasks={setTasks} />
        </PanelDrawer>
      )}
      <div className="min-h-screen" style={{ background: A.page }}>

        {/* Aurora */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.28),transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle,rgba(5,150,105,0.35),transparent 70%)' }} />
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: A.dot, backgroundSize: '28px 28px' }} />

        <div className="relative max-w-[1380px] mx-auto px-5 py-7 pb-12">
          <div className="flex gap-5 items-start">

            {/* ── LEFT ── */}
            <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0 sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              <LeftGreeting tasks={tasks} setTasks={setTasks} onAdd={openAdd} onOpenAI={() => setAiOpen(true)} />
              <CalendarView tasks={tasks} onAddTask={openAdd} />
            </div>

            {/* ── CENTER ── */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Page header */}
              <div className="rounded-3xl overflow-hidden relative" style={{ boxShadow: '0 8px 50px rgba(5,150,105,0.18)' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#0c1e16 0%,#1a3028 50%,#0c2218 100%)' }} />
                <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-[70px] pointer-events-none"
                  style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.35),transparent 70%)' }} />
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: A.dot, backgroundSize: '24px 24px' }} />
                <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ border: '1px solid rgba(110,231,183,0.18)' }} />
                <div className="relative px-6 py-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: A.btn, boxShadow: A.btnGlow }}>
                    <Brain size={26} color="white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: A.accent }}>NeuroSphera · Asistenti</span>
                    </div>
                    <h1 className="text-2xl font-black text-white leading-tight">Asistenti im personal</h1>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Planifiko. Kujo. Reflekto. Ri në rrugën e duhur.
                    </p>
                  </div>
                  {/* AI button */}
                  <div className="hidden md:block">
                    <AISuggest tasks={tasks} routines={routines} externalOpen={aiOpen} onExternalClose={() => setAiOpen(false)} />
                  </div>
                </div>
              </div>

              {/* Main content — Diet & Exercise always visible */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <WeeklyDietCard />
                <ExerciseMoodCard />
              </div>

              {/* Mobile AI button */}
              <div className="lg:hidden">
                <AISuggest tasks={tasks} routines={routines} externalOpen={aiOpen} onExternalClose={() => setAiOpen(false)} />
              </div>

              {/* Mobile calendar */}
              <div className="lg:hidden">
                <CalendarView tasks={tasks} onAddTask={openAdd} />
              </div>

              {/* Mobile right panels */}
              <div className="lg:hidden space-y-4">
                <div className="h-px" style={{ background: A.border }} />
                <DailyQuote />
                <RemindersWidget reminders={reminders} onViewAll={() => setDrawer('reminders')} />
                <RoutinesWidget routines={routines} setRoutines={setRoutines} />
                <WeeklyGoalsWidget tasks={tasks} />
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0 sticky top-6">
              <DailyQuote />
              <RecentNotesWidget notes={notes} onViewAll={() => setDrawer('notes')} />
              <RemindersWidget reminders={reminders} onViewAll={() => setDrawer('reminders')} />
              <RoutinesWidget routines={routines} setRoutines={setRoutines} />
              <WeeklyGoalsWidget tasks={tasks} />
            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
