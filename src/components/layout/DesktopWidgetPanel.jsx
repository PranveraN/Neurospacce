import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Droplets, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMood } from '../../contexts/MoodContext'
import { useAuth } from '../../contexts/AuthContext'

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}
const LBL = 'text-[9px] font-bold tracking-[0.18em] uppercase'

/* ═══════════════════════════════════════════════
   EMOTIONAL HEATMAP
═══════════════════════════════════════════════ */

const DAYS_ALB = ['H', 'M', 'M', 'E', 'P', 'S', 'D']
const WEEKS = 5

// Mood → colour
function moodColor(v) {
  if (!v) return 'rgba(255,255,255,0.05)'
  if (v <= 2) return '#38bdf8'   // calm/low → blue
  if (v <= 5) return '#818cf8'   // mid     → purple
  if (v <= 7) return '#a855f7'   // elevated → violet
  return '#ec4899'                // intense  → pink
}

function buildHeatData(moodHistory) {
  const map = {}
  moodHistory.forEach(({ date, mood }) => { map[date] = mood })

  const cells = []
  const today = new Date()
  for (let w = WEEKS - 1; w >= 0; w--) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const dt = new Date(today)
      dt.setDate(today.getDate() - (w * 7 + (6 - d)))
      const iso = dt.toISOString().slice(0, 10)
      week.push({ iso, val: map[iso] || 0, day: DAYS_ALB[d] })
    }
    cells.push(week)
  }
  return cells   // 5 rows × 7 cols
}

function EmotionalHeatmap() {
  const { moodHistory } = useMood()
  const navigate         = useNavigate()
  const [tooltip, setTooltip] = useState(null)

  const grid = buildHeatData(moodHistory)

  return (
    <div className="p-4 rounded-[20px]" style={CARD}>
      <p className={`${LBL} text-purple-400 mb-0.5`}>EMOTIONAL HEATMAP</p>
      <p className="text-[11px] text-white/35 mb-3">Monitoro javët e tua</p>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1.5 px-0.5">
        {DAYS_ALB.map((d, i) => (
          <p key={i} className="text-[9px] text-white/30 font-bold text-center">{d}</p>
        ))}
      </div>

      {/* Grid */}
      <div className="space-y-1 relative">
        {grid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map(({ iso, val, day }, di) => (
              <div
                key={di}
                className="heatmap-cell rounded-sm"
                style={{ width: '100%', paddingBottom: '100%', position: 'relative', background: moodColor(val) }}
                onMouseEnter={() => setTooltip({ iso, val })}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-white whitespace-nowrap pointer-events-none z-20"
              style={{ background: 'rgba(20,10,50,0.95)', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              {tooltip.iso} · {tooltip.val ? `Score: ${tooltip.val}` : 'Pa të dhëna'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <p className="text-[9px] text-white/30 shrink-0">Qetë</p>
        <div className="flex-1 h-1.5 rounded-full"
          style={{ background: 'linear-gradient(to right, #38bdf8, #818cf8, #a855f7, #ec4899)' }}/>
        <p className="text-[9px] text-white/30 shrink-0">I mbingarkuar</p>
      </div>

      <button
        onClick={() => navigate('/mood')}
        className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold text-white/50 hover:text-white/80 transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        Shiko analizën javore <ArrowRight size={11}/>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   INNER BATTERY
═══════════════════════════════════════════════ */

const BATTERY_METRICS = [
  { icon: '🧠', label: 'Energjia mendore',    key: 'mental',   color: '#a855f7', baseVal: 65 },
  { icon: '❤️', label: 'Stabiliteti emocional', key: 'emotional',color: '#ec4899', baseVal: 55 },
  { icon: '👥', label: 'Energjia sociale',     key: 'social',   color: '#fbbf24', baseVal: 35 },
  { icon: '🌙', label: 'Trupi & Gjumi',        key: 'sleep',    color: '#34d399', baseVal: 70 },
]

function BatteryBar({ metric, moodScore, streak }) {
  const tweaked = Math.min(99, Math.max(10, metric.baseVal + (moodScore || 6) * 2 - 8 + (streak % 5)))
  const pct = tweaked

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm leading-none shrink-0">{metric.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-white/55 font-medium truncate">{metric.label}</p>
          <p className="text-[10px] font-bold shrink-0 ml-1" style={{ color: metric.color }}>{pct}%</p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ background: `linear-gradient(to right, ${metric.color}99, ${metric.color})` }}
          />
        </div>
      </div>
    </div>
  )
}

function InnerBattery() {
  const { moodScore, streak } = useMood()
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="p-4 rounded-[20px]" style={CARD}>
      <div className="flex items-start justify-between mb-0.5">
        <p className={`${LBL} text-purple-400`}>INNER BATTERY</p>
      </div>
      <p className="text-[11px] text-white/35 mb-4">Niveli yt i energjisë sot</p>

      <div className="space-y-3">
        {BATTERY_METRICS.map(m => (
          <BatteryBar key={m.key} metric={m} moodScore={moodScore} streak={streak}/>
        ))}
      </div>

      <button
        onClick={() => setShowInfo(v => !v)}
        className="flex items-center gap-1 mt-4 text-[10px] text-white/35 hover:text-white/65 transition-colors font-medium"
      >
        Si funksionon? <ChevronRight size={10} className={`transition-transform ${showInfo ? 'rotate-90' : ''}`}/>
      </button>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
              Inner Battery llogarit energjinë tënde bazuar në gjumin, humorin, aktivitetin dhe streak-un tënd. Hyrja e rregullt e të dhënave e bën llogaritjen më të saktë.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   NEURO GARDEN
═══════════════════════════════════════════════ */

const GARDEN_PLANTS = [
  { emoji: '🌱', growth: ['🌱','🌿','🪴','🌳','🌲'], label: 'Fokus',      color: '#22c55e' },
  { emoji: '🌸', growth: ['🌱','🌷','🌸','🌺','🌻'], label: 'Qetësi',    color: '#ec4899' },
  { emoji: '🌻', growth: ['🌱','🌿','🌼','🌻','⭐'], label: 'Mirënjohje', color: '#fbbf24' },
]

function NeuroGarden() {
  const { streak }              = useMood()
  const navigate                = useNavigate()
  const [watered, setWatered]   = useState(false)
  const [drops,   setDrops]     = useState([])

  const level = Math.max(0, Math.min(4, Math.floor(streak / 4)))

  function handleWater() {
    if (watered) return
    setWatered(true)
    setDrops([1, 2, 3])
    setTimeout(() => setDrops([]), 900)
  }

  return (
    <div className="p-4 rounded-[20px]" style={CARD}>
      <div className="flex items-start justify-between mb-0.5">
        <p className={`${LBL} text-purple-400`}>NEURO GARDEN</p>
        <button onClick={() => navigate('/home')}
          className="text-white/25 hover:text-white/60 transition-colors">
          <ChevronRight size={12}/>
        </button>
      </div>
      <p className="text-[11px] text-white/35 mb-4">Kopshti yt po rritet 🌱</p>

      {/* plants */}
      <div className="flex justify-around mb-4 relative">
        {GARDEN_PLANTS.map((p, i) => {
          const lvl = Math.max(0, Math.min(4, level - i + 2 + i))
          const emoji = p.growth[Math.min(lvl, p.growth.length - 1)]
          return (
            <div key={i} className="flex flex-col items-center gap-1 relative">
              {/* watering drops */}
              {watered && drops.map(d => (
                <motion.div key={d}
                  className="absolute"
                  style={{ top: -16, left: 4 + d * 5 }}
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: 28, opacity: 0 }}
                  transition={{ duration: 0.55, delay: d * 0.1 }}>
                  <Droplets size={10} className="text-blue-400"/>
                </motion.div>
              ))}
              <motion.span
                className="text-3xl leading-none"
                animate={watered ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {emoji}
              </motion.span>
              <p className="text-[10px] text-white/45 font-medium">{p.label}</p>
              <p className="text-[9px] font-bold" style={{ color: p.color }}>
                Level {Math.min(5, lvl + 1)}
              </p>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleWater}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[12px] transition-all"
        style={{
          background: watered ? 'rgba(34,197,94,0.15)' : 'rgba(56,189,248,0.12)',
          border: `1px solid ${watered ? 'rgba(34,197,94,0.4)' : 'rgba(56,189,248,0.3)'}`,
          color: watered ? '#4ade80' : '#38bdf8',
        }}
      >
        <Droplets size={13}/>
        {watered ? 'U ujit! 💧' : 'Ujitë kopshtin'}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DEFAULT WIDGET PANEL (other routes - dark themed)
═══════════════════════════════════════════════ */

function DefaultPanel() {
  const { streak, moodScore } = useMood()
  const navigate               = useNavigate()

  const metrics = [
    { label: 'Fokus',        val: Math.min(99, 60 + streak * 2),  max: 100, color: '#8b5cf6' },
    { label: 'Humor',        val: Math.min(10, moodScore || 7),   max: 10,  color: '#22c55e' },
    { label: 'Produktivitet',val: Math.min(99, 50 + streak * 3),  max: 100, color: '#f97316' },
  ]

  return (
    <div className="space-y-4">
      {/* Quick summary */}
      <div className="p-4 rounded-[20px]" style={CARD}>
        <p className={`${LBL} text-purple-400 mb-3`}>PËRMBLEDHJE</p>
        <div className="space-y-3">
          {metrics.map((m, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-white/55 font-medium">{m.label}</span>
                <span className="text-[11px] font-bold" style={{ color: m.color }}>{m.val}/{m.max}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(m.val / m.max) * 100}%`, background: m.color }}/>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/55 font-medium">Konsistencë</span>
            <span className="text-[11px] font-bold text-purple-400">{streak} ditë</span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="p-4 rounded-[20px]"
        style={{ ...CARD, border: '1px solid rgba(139,92,246,0.2)' }}>
        <p className={`${LBL} text-purple-400 mb-2`}>INSIGHT I DITËS</p>
        <p className="text-[11px] text-white/55 leading-relaxed italic">
          "Truri yt është si një muskul. Sa më shumë që e trajnon, aq më i fortë bëhet."
        </p>
        <p className="text-[9px] text-white/25 mt-2 font-semibold">— NeuroSphera</p>
      </div>

      {/* Community */}
      <div className="p-4 rounded-[20px]" style={CARD}>
        <p className={`${LBL} text-purple-400 mb-2`}>KOMUNITETI AKTIV</p>
        <p className="text-[13px] font-black text-white leading-tight">Sfida: 7 Ditë Fokus</p>
        <p className="text-[10px] text-white/35 mt-0.5 mb-3">1,245 pjesëmarrës</p>
        <button onClick={() => navigate('/community')}
          className="w-full py-2.5 rounded-xl font-bold text-[12px] text-white transition-all"
          style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.4)' }}>
          Bashkohu Tani
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════ */

export default function DesktopWidgetPanel() {
  const { pathname } = useLocation()
  const isHome = pathname === '/home'

  return (
    <aside
      className="w-72 min-h-screen sticky top-0 overflow-y-auto"
      style={{
        background: 'rgba(6,3,22,0.6)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="px-4 py-6 space-y-4">
        {isHome ? (
          <>
            <EmotionalHeatmap/>
            <InnerBattery/>
            <NeuroGarden/>
          </>
        ) : (
          <DefaultPanel/>
        )}
      </div>
    </aside>
  )
}
