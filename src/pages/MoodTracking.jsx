import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Zap, Calendar, Activity, Smile, Frown, Meh } from 'lucide-react'
import BackButton from '../components/BackButton'
import { useMood } from '../contexts/MoodContext'
import { useAuth } from '../contexts/AuthContext'
import { ActivityLog } from '../lib/activityLog'

const MOOD_LEVELS = [
  { score: [1,2], icon: Frown,  label: 'Shumë keq', color: '#f87171' },
  { score: [3,4], icon: Frown,  label: 'Keq',       color: '#fb923c' },
  { score: [5,6], icon: Meh,    label: 'Ok',         color: '#818cf8' },
  { score: [7,8], icon: Smile,  label: 'Mirë',       color: '#34d399' },
  { score: [9,10],icon: Smile,  label: 'Shkëlqyer', color: '#fbbf24' },
]

const ACTIVITIES = [
  { id: 'sleep',    label: 'Gjumë i mirë',  icon: '💤' },
  { id: 'exercise', label: 'Sport',          icon: '🏃' },
  { id: 'work',     label: 'Punë e shumë',  icon: '💼' },
  { id: 'social',   label: 'Shoqëri',       icon: '👥' },
  { id: 'nature',   label: 'Natyrë',        icon: '🌿' },
  { id: 'stress',   label: 'Stres',         icon: '😤' },
  { id: 'creative', label: 'Kreativitet',   icon: '🎨' },
  { id: 'rest',     label: 'Pushim',        icon: '🛋️' },
]

const AI_INSIGHTS = [
  { icon: Activity, text: 'Kur shënon "Gjumë i mirë", humori yt është mesatarisht +2.4 pikë.', color: '#3b97f6' },
  { icon: TrendingUp, text: 'Sporti 3× javën lidhet me rritje 40% të humorit të premtes.',       color: '#34d399' },
  { icon: Calendar,   text: 'E martja është dita jote më e vështirë — planifiko mbështetje.',    color: '#8b5cf6' },
]

const MONTHLY = [
  { week: 'J1', avg: 6.2 }, { week: 'J2', avg: 5.8 },
  { week: 'J3', avg: 7.1 }, { week: 'J4', avg: 6.5 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-2xl shadow-xl px-3 py-2 border border-purple-100">
      <p className="text-xs font-bold text-gray-600">{label}</p>
      <p className="text-sm font-black" style={{ color: '#8b5cf6' }}>{payload[0]?.value}/10</p>
    </div>
  )
}

function getMoodLevel(score) {
  return MOOD_LEVELS.find(m => score >= m.score[0] && score <= m.score[1]) || MOOD_LEVELS[2]
}

export default function MoodTracking() {
  const { theme, moodHistory, logMood, moodScore, streak } = useMood()
  const { user } = useAuth()
  const [selected, setSelected] = useState([])
  const [view, setView]         = useState('week')
  const [sliderVal, setSliderVal] = useState(moodScore)
  const [saved, setSaved]       = useState(false)

  const chartData = view === 'week' ? moodHistory : MONTHLY
  const dataKey   = view === 'week' ? 'mood' : 'avg'
  const xKey      = view === 'week' ? 'day' : 'week'
  const avg       = (moodHistory.reduce((a, b) => a + b.mood, 0) / moodHistory.length).toFixed(1)
  const trend     = moodHistory[moodHistory.length - 1]?.mood >= moodHistory[0]?.mood

  const level = getMoodLevel(sliderVal)
  const LevelIcon = level.icon

  function toggleActivity(id) {
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  function saveMood() {
    if (saved) return
    const keys = ['anxious','sad','sad','neutral','calm','calm','happy','happy','happy','happy']
    logMood(keys[Math.min(sliderVal - 1, 9)], sliderVal)
    ActivityLog.mood(user?.id, sliderVal)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="animate-fade-in">
      <BackButton fallback="/home" />
      {/* Page header */}
      <div
        className="px-5 pt-14 md:pt-6 pb-6 text-white md:rounded-3xl mb-4"
        style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={20} />
          <div>
            <h1 className="text-xl font-black leading-tight">Gjurmimi i Humorit</h1>
            <p className="text-white/70 text-xs">Njoh veten me të dhëna reale</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Mesatarja', value: `${avg}/10` },
            { label: 'Trendi',   value: trend ? '↑ Lart' : '↓ Poshtë' },
            { label: 'Seria',    value: `${streak}d 🔥` },
          ].map(s => (
            <div key={s.label} className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="font-black text-lg leading-tight">{s.value}</p>
              <p className="text-[10px] opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-0 space-y-4">
        {/* Daily log */}
        <div className="glass rounded-3xl p-5 shadow-card">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Humori i sot</p>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${level.color}22`, border: `2px solid ${level.color}44` }}
            >
              <LevelIcon size={28} color={level.color} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="font-black text-2xl text-gray-800">{sliderVal}/10</p>
              <p className="text-sm font-semibold" style={{ color: level.color }}>{level.label}</p>
            </div>
          </div>

          <input
            type="range" min={1} max={10} value={sliderVal}
            onChange={e => setSliderVal(Number(e.target.value))}
            className="w-full mb-1"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-4">
            <span>Shumë keq</span><span>Shumë mirë</span>
          </div>

          <p className="text-xs font-semibold text-gray-500 mb-2">Çfarë bëre sot?</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {ACTIVITIES.map(a => (
              <button
                key={a.id}
                onClick={() => toggleActivity(a.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  selected.includes(a.id) ? 'text-white shadow-sm scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selected.includes(a.id)
                  ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }
                  : {}
                }
              >
                <span className="text-sm leading-none">{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>

          <button
            onClick={saveMood}
            disabled={saved}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-sm transition-all"
            style={{ background: saved ? '#22c55e' : `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
          >
            {saved ? '✓ Humori u ruajt!' : 'Ruaj humorin e sotëm'}
          </button>
        </div>

        {/* Chart */}
        <div className="glass rounded-3xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={15} style={{ color: theme.start }} />
              <p className="font-bold text-gray-800 text-sm">Grafiku</p>
            </div>
            <div className="flex bg-gray-100 rounded-xl overflow-hidden">
              {['week', 'month'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-[11px] font-bold px-3 py-1.5 transition-all ${view === v ? 'text-white' : 'text-gray-400'}`}
                  style={view === v ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` } : {}}
                >
                  {v === 'week' ? 'Javë' : 'Muaj'}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={theme.start} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.end}   stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eaff" />
              <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,10]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={dataKey} stroke={theme.start} strokeWidth={2.5}
                fill="url(#moodGrad)"
                dot={{ fill: theme.start, r: 4, strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="glass rounded-3xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} style={{ color: theme.start }} />
            <p className="font-bold text-gray-800 text-sm">AI Insights</p>
            <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full ml-auto">
              Premium
            </span>
          </div>
          <div className="space-y-3">
            {AI_INSIGHTS.map((ins, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: ins.color + '22' }}
                >
                  <ins.icon size={15} color={ins.color} strokeWidth={2} />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
