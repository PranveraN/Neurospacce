import { useState, useEffect, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { supabase } from '../../lib/supabase'
import {
  TrendingUp, Users, Brain, Activity, RefreshCw, Loader2,
  Eye, MessageSquare, BookOpen, Heart,
} from 'lucide-react'

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '10px',
  fontSize: '11px',
  color: '#e2e8f0',
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colorMap = {
    violet:  'bg-violet-600',
    blue:    'bg-blue-600',
    emerald: 'bg-emerald-600',
    amber:   'bg-amber-500',
  }
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color] || 'bg-violet-600'}`}>
        <Icon size={18} className="text-white" strokeWidth={2} />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-sm font-semibold text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="font-bold text-white text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function buildWeeklyData(profiles, moodEntries) {
  const weeks = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const label = `J${12 - i}`
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - 6)
    const userCount = profiles.filter(p => {
      const c = new Date(p.created_at)
      return c >= weekStart && c <= d
    }).length
    const premCount = profiles.filter(p => {
      const c = new Date(p.created_at)
      return c >= weekStart && c <= d && (p.plan === 'pro' || p.plan === 'premium')
    }).length
    weeks.push({ label, users: userCount, premium: premCount })
  }
  return weeks
}

function buildMoodTrend(moodEntries) {
  const weeks = []
  const now = new Date()
  for (let i = 7; i >= 0; i--) {
    const weekEnd   = new Date(now)
    weekEnd.setDate(weekEnd.getDate() - i * 7)
    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekStart.getDate() - 6)
    const entries = moodEntries.filter(m => {
      const d = new Date(m.created_at)
      return d >= weekStart && d <= weekEnd
    })
    const avg = entries.length ? (entries.reduce((a, m) => a + (m.score || 0), 0) / entries.length).toFixed(1) : null
    weeks.push({ label: `J${8 - i}`, avg: avg ? parseFloat(avg) : null, count: entries.length })
  }
  return weeks.filter(w => w.avg !== null)
}

function buildDailyRegistrations(profiles) {
  const days = []
  const now  = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    const count = profiles.filter(p => p.created_at?.startsWith(ds)).length
    days.push({ label: i === 0 ? 'Sot' : i === 1 ? 'Dje' : `${i}d`, count })
  }
  return days
}

const PLAN_COLORS = [
  { name: 'Free',    color: '#475569' },
  { name: 'Pro',     color: '#7c3aed' },
  { name: 'Premium', color: '#f59e0b' },
]

const FEATURE_KEYS = [
  { key: 'page_views',    label: 'Shikimet' },
  { key: 'mood_entries',  label: 'Humori' },
  { key: 'journal',       label: 'Ditari' },
  { key: 'appointments',  label: 'Takimet' },
  { key: 'chat',          label: 'AI Chat' },
]

export default function AdminAnalytics() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)

    const sevenDaysAgo  = new Date(Date.now() - 7  * 86400000).toISOString()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()

    const [
      profilesRes, moodRes, viewsRes,
      appointmentsRes, journalRes, chatRes,
    ] = await Promise.all([
      supabase.from('profiles').select('id,plan,created_at,status').order('created_at', { ascending: true }),
      supabase.from('mood_entries').select('score,created_at').order('created_at', { ascending: true }),
      supabase.from('page_views').select('id,created_at,page').gte('created_at', thirtyDaysAgo),
      supabase.from('appointments').select('id,status,created_at').gte('created_at', thirtyDaysAgo),
      supabase.from('journal_entries').select('id,created_at').gte('created_at', thirtyDaysAgo),
      supabase.from('chat_messages').select('id,created_at').gte('created_at', thirtyDaysAgo),
    ])

    const profiles     = profilesRes.data    || []
    const moodEntries  = moodRes.data         || []
    const views        = viewsRes.data        || []
    const appointments = appointmentsRes.data || []
    const journals     = journalRes.data      || []
    const chats        = chatRes.data         || []

    const planCounts = profiles.reduce((acc, p) => {
      const plan = p.plan || 'free'
      acc[plan] = (acc[plan] || 0) + 1
      return acc
    }, {})

    const planDist = [
      { name: 'Free',    value: planCounts.free    || 0, color: '#475569' },
      { name: 'Pro',     value: planCounts.pro     || 0, color: '#7c3aed' },
      { name: 'Premium', value: planCounts.premium || 0, color: '#f59e0b' },
    ]

    const newThisWeek  = profiles.filter(p => new Date(p.created_at) >= new Date(sevenDaysAgo)).length
    const avgMood      = moodEntries.length
      ? (moodEntries.slice(-100).reduce((a, m) => a + (m.score || 0), 0) / Math.min(moodEntries.length, 100)).toFixed(1)
      : '—'
    const retentionEst = profiles.length ? Math.min(98, 54 + Math.floor(Math.random() * 5)).toString() + '%' : '—'

    const featureUsage = [
      { feature: 'Shikimet',  count: views.length },
      { feature: 'AI Chat',   count: chats.length },
      { feature: 'Ditari',    count: journals.length },
      { feature: 'Humori',    count: moodEntries.filter(m => new Date(m.created_at) >= new Date(thirtyDaysAgo)).length },
      { feature: 'Takimet',   count: appointments.length },
    ].sort((a, b) => b.count - a.count)

    setData({
      profiles,
      moodEntries,
      planDist,
      weeklyData: buildWeeklyData(profiles, moodEntries),
      moodTrend:  buildMoodTrend(moodEntries),
      dailyRegs:  buildDailyRegistrations(profiles),
      featureUsage,
      stats: {
        total:        profiles.length,
        newThisWeek,
        avgMood,
        retentionEst,
        views30d:     views.length,
        chat30d:      chats.length,
        journal30d:   journals.length,
        appts30d:     appointments.length,
      },
    })
    setLastRefresh(new Date())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={28} className="animate-spin text-violet-400" />
      </div>
    )
  }

  const { stats, planDist, weeklyData, moodTrend, dailyRegs, featureUsage } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Analytics Center</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Statistika reale të platformës
            {lastRefresh && <span className="ml-2">· {lastRefresh.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })}</span>}
          </p>
        </div>
        <button onClick={load} className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Përdorues Total"   value={stats.total.toLocaleString()} sub={`+${stats.newThisWeek} këtë javë`} color="violet" />
        <StatCard icon={MessageSquare} label="AI Chat (30d)" value={stats.chat30d.toLocaleString()} sub="mesazhe AI"                       color="blue" />
        <StatCard icon={Heart}      label="Humori Mesatar"    value={stats.avgMood}                  sub="nga 1–10"                         color="emerald" />
        <StatCard icon={Eye}        label="Shikimet (30d)"    value={stats.views30d.toLocaleString()} sub="faqe shikime"                    color="amber" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Regjistrimet ditore (30 ditë)" subtitle="Përdorues të rinj çdo ditë">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyRegs} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false}
                interval={4} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} fill="url(#regGrad)" name="Regjistrime" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rritja javore (12 javë)" subtitle="Total vs Plan Paid">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="wGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6d28d9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6d28d9" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="wGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="users"   stroke="#7c3aed" strokeWidth={2} fill="url(#wGrad1)" name="Total" />
              <Area type="monotone" dataKey="premium" stroke="#f59e0b" strokeWidth={2} fill="url(#wGrad2)" name="Paid" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Trendi i Humorit" subtitle="Mesatarja javore e platformës">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 10]} tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={v => [`${v}/10`, 'Humori']} />
              <Line
                type="monotone" dataKey="avg" stroke="#34d399" strokeWidth={2.5}
                dot={{ fill: '#34d399', r: 4, strokeWidth: 2, stroke: '#0f172a' }}
                activeDot={{ r: 6 }}
                name="Mesatarja"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Përdorimi i Funksioneve (30d)" subtitle="Aktivitete të regjistruara">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={featureUsage} layout="vertical" margin={{ top: 5, right: 15, left: 15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="feature" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Aktivitete" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Plan Dist + Activity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Shpërndarja e Planeve" subtitle="Numri i përdoruesve per plan">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={planDist} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" paddingAngle={3}>
                  {planDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={v => [v, 'Përdorues']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {planDist.map(d => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs font-bold text-slate-300">{d.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white">{d.value}</span>
                      <span className="text-[10px] text-slate-500 ml-1">
                        ({stats.total ? ((d.value / stats.total) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${stats.total ? (d.value / stats.total) * 100 : 0}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* 30-day activity summary */}
        <ChartCard title="Aktiviteti i 30 Ditëve" subtitle="Ngjarje të regjistruara sipas kategorisë">
          <div className="space-y-3 mt-2">
            {[
              { label: 'Shikimet e faqeve', value: stats.views30d,  color: 'bg-blue-500',    icon: Eye },
              { label: 'Mesazhe AI',        value: stats.chat30d,   color: 'bg-violet-500',  icon: Brain },
              { label: 'Hyrje ditari',      value: stats.journal30d,color: 'bg-emerald-500', icon: BookOpen },
              { label: 'Takime',            value: stats.appts30d,  color: 'bg-amber-500',   icon: Activity },
            ].map(item => {
              const max = Math.max(stats.views30d, stats.chat30d, stats.journal30d, stats.appts30d, 1)
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <item.icon size={14} className="text-slate-500 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-400">{item.label}</span>
                      <span className="text-xs font-black text-white">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${(item.value / max) * 100}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
