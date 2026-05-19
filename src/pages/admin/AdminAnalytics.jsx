import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, Users, Brain, Activity } from 'lucide-react'

const MONTHLY_USERS = [
  { month: 'Jan', users: 120, premium: 24 }, { month: 'Feb', users: 198, premium: 41 },
  { month: 'Mar', users: 267, premium: 63 }, { month: 'Pri', users: 389, premium: 98 },
]

const FEATURE_USAGE = [
  { feature: 'AI Chat',    usage: 89 }, { feature: 'Journal',   usage: 64 },
  { feature: 'Mood Track', usage: 78 }, { feature: 'Teknikat',  usage: 52 },
  { feature: 'Blog',       usage: 41 }, { feature: 'Community', usage: 33 },
]

const MOOD_TREND = [
  { week: 'J1', avg: 6.1 }, { week: 'J2', avg: 6.4 }, { week: 'J3', avg: 5.9 },
  { week: 'J4', avg: 6.8 }, { week: 'J5', avg: 7.1 }, { week: 'J6', avg: 6.7 },
]

const PLAN_DIST = [
  { name: 'Free', value: 68, color: '#e2e8f0' },
  { name: 'Premium', value: 32, color: '#7c3aed' },
]

const RETENTION = [
  { day: 'D1', rate: 100 }, { day: 'D3', rate: 72 }, { day: 'D7', rate: 54 },
  { day: 'D14', rate: 41 }, { day: 'D30', rate: 28 },
]

function StatBox({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} className="text-white" strokeWidth={2} />
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-semibold text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Statistika të platformës · Prill 2026</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={Users}     label="Regjistrime totale"  value="389"  sub="+42 këtë muaj"  color="bg-violet-600" />
        <StatBox icon={Brain}     label="Sesione AI Chat"     value="2,841" sub="Mesatarisht 7.3/user" color="bg-blue-600" />
        <StatBox icon={TrendingUp}label="Humori mesatar"      value="6.7"  sub="Nga 1-10 ky muaj" color="bg-emerald-600" />
        <StatBox icon={Activity}  label="Retension 7-ditësh"  value="54%"  sub="+6% vs muaji i kaluar" color="bg-amber-500" />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User growth */}
        <ChartCard title="Rritja e përdoruesve" subtitle="Free vs Premium">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_USERS} margin={{ top:5, right:5, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:'12px', border:'none', fontSize:'12px' }} />
              <Area type="monotone" dataKey="users"   stroke="#7c3aed" strokeWidth={2} fill="url(#g1)" name="Total" />
              <Area type="monotone" dataKey="premium" stroke="#f59e0b" strokeWidth={2} fill="url(#g2)" name="Premium" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Feature usage */}
        <ChartCard title="Përdorimi i funksioneve" subtitle="% sessionesh këtë muaj">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FEATURE_USAGE} layout="vertical" margin={{ top:5, right:15, left:20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} domain={[0,100]} />
              <YAxis dataKey="feature" type="category" tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false} width={72} />
              <Tooltip contentStyle={{ borderRadius:'12px', border:'none', fontSize:'12px' }} formatter={(v) => [`${v}%`, 'Përdorim']} />
              <Bar dataKey="usage" fill="#8b5cf6" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Mood trend */}
        <ChartCard title="Trendi i humorit" subtitle="Mesatarja javore e platformës">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MOOD_TREND} margin={{ top:5, right:5, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[4,10]} tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:'12px', border:'none', fontSize:'12px' }} formatter={(v) => [`${v}/10`, 'Humori']} />
              <Line type="monotone" dataKey="avg" stroke="#34d399" strokeWidth={2.5}
                dot={{ fill:'#34d399', r:4, strokeWidth:2, stroke:'white' }} activeDot={{ r:6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Plan distribution + Retention */}
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="Plani" subtitle="Free vs Premium">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={PLAN_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                  {PLAN_DIST.map((d,i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius:'12px', border:'none', fontSize:'12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-1">
              {PLAN_DIST.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-[10px] text-gray-500 font-semibold">{d.name} {d.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Retention" subtitle="% userash aktiv">
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={RETENTION} margin={{ top:5, right:5, left:-25, bottom:0 }}>
                <defs>
                  <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b97f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b97f6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize:9, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fontSize:9, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius:'12px', border:'none', fontSize:'11px' }} formatter={(v) => [`${v}%`]} />
                <Area type="monotone" dataKey="rate" stroke="#3b97f6" strokeWidth={2} fill="url(#retGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
