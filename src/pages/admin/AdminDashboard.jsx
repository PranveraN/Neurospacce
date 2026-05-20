import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, FileText, MessageSquare, TrendingUp, ArrowUp, ArrowDown, Activity, Clock, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const WEEKLY_SIGNUPS = [
  { day: 'Hën', users: 12 }, { day: 'Mar', users: 19 }, { day: 'Mër', users: 8  },
  { day: 'Enj', users: 25 }, { day: 'Pre', users: 31 }, { day: 'Sht', users: 17 }, { day: 'Die', users: 22 },
]

const MOOD_DIST = [
  { mood: 'Shkëlqyer', count: 124 }, { mood: 'Mirë',      count: 289 },
  { mood: 'Ok',        count: 201 }, { mood: 'Keq',       count: 98  },
  { mood: 'Shumë keq', count: 43  },
]

const RECENT_ACTIVITY = [
  { id: 1, action: 'Regjistrim i ri',        user: 'flutura_b',  time: '2 min',  type: 'signup'  },
  { id: 2, action: 'Artikull i publikuar',   user: 'admin',      time: '18 min', type: 'content' },
  { id: 3, action: 'Mesazh i raportuar',     user: 'anonim_342', time: '35 min', type: 'report'  },
  { id: 4, action: 'Abonament Premium',      user: 'drita_k',    time: '1 orë',  type: 'premium' },
  { id: 5, action: 'Llogari e bllokuar',     user: 'admin',      time: '2 orë',  type: 'block'   },
]

const TYPE_COLORS = {
  signup:  { bg: 'bg-green-100',  text: 'text-green-700'  },
  content: { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  report:  { bg: 'bg-red-100',    text: 'text-red-700'    },
  premium: { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  block:   { bg: 'bg-slate-100',  text: 'text-slate-700'  },
}

function KPICard({ icon: Icon, label, value, delta, deltaUp, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={18} className={color} strokeWidth={2} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${deltaUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {deltaUp ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {delta}
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const { allUsers } = useAuth()
  const active    = allUsers.filter(u => u.status === 'active').length
  const premium   = allUsers.filter(u => u.plan === 'premium').length
  const blocked   = allUsers.filter(u => u.status === 'blocked').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Pasqyra e sistemit · NeuroSphera</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users}        label="Përdorues aktivë"   value={active}   delta="+12%"  deltaUp bg="bg-violet-100"  color="text-violet-600" />
        <KPICard icon={TrendingUp}   label="Premium users"      value={premium}  delta="+8%"   deltaUp bg="bg-amber-100"   color="text-amber-600"  />
        <KPICard icon={FileText}     label="Artikuj të botuar"  value="24"       delta="+3"    deltaUp bg="bg-blue-100"    color="text-blue-600"   />
        <KPICard icon={MessageSquare}label="Mesazhe sot"        value="341"      delta="-4%"   deltaUp={false} bg="bg-red-100" color="text-red-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Signups chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Regjistrimet javore</h3>
              <p className="text-xs text-gray-400 mt-0.5">Të re këtë javë</p>
            </div>
            <span className="text-xs font-bold bg-green-50 text-green-600 px-2.5 py-1 rounded-full">+18% vs javë e kaluar</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={WEEKLY_SIGNUPS} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2.5}
                fill="url(#adminGrad)" dot={{ fill: '#7c3aed', r: 3, strokeWidth: 2, stroke: 'white' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mood distribution */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Shpërndarja e humorit</h3>
              <p className="text-xs text-gray-400 mt-0.5">Regjistrimet e sotme</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOOD_DIST} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="mood" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-violet-600" />
            <h3 className="font-bold text-gray-800">Aktiviteti i fundit</h3>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map(a => {
              const c = TYPE_COLORS[a.type]
              return (
                <div key={a.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                    <span className={`text-[10px] font-black ${c.text}`}>{a.type[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{a.action}</p>
                    <p className="text-[11px] text-gray-400">nga <span className="font-bold">{a.user}</span></p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 shrink-0">
                    <Clock size={11} />
                    <span className="text-[11px]">{a.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* System status */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-violet-600" />
            <h3 className="font-bold text-gray-800">Statusi i sistemit</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'API Server',     status: 'online',   uptime: '99.9%'  },
              { label: 'Database',       status: 'online',   uptime: '99.7%'  },
              { label: 'AI Service',     status: 'online',   uptime: '98.2%'  },
              { label: 'Auth Service',   status: 'online',   uptime: '100%'   },
              { label: 'CDN / Media',    status: 'degraded', uptime: '94.1%'  },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${s.status === 'online' ? 'bg-green-500' : 'bg-yellow-400'}`} />
                  <span className="text-sm text-gray-700">{s.label}</span>
                </div>
                <span className="text-xs font-bold text-gray-500">{s.uptime}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500">Llogaritë e bllokuara</span>
              <span className="font-bold text-red-500">{blocked}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Total përdorues</span>
              <span className="font-bold text-gray-800">{allUsers.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
