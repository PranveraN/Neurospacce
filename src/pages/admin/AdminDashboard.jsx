import { useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, FileText, MessageSquare, TrendingUp, ArrowUp, ArrowDown, Activity, Clock, Shield, Eye } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const DAY_LABELS = ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht']

function KPICard({ icon: Icon, label, value, delta, deltaUp, color, bg, loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={18} className={color} strokeWidth={2} />
        </div>
        {delta && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${deltaUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {deltaUp ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
            {delta}
          </div>
        )}
      </div>
      {loading
        ? <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse mb-1" />
        : <p className="text-2xl font-black text-gray-900">{value}</p>
      }
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const { allUsers } = useAuth()
  const [stats,      setStats]    = useState(null)
  const [weeklyData, setWeekly]   = useState([])
  const [moodData,   setMood]     = useState([])
  const [recentUsers,setRecent]   = useState([])
  const [pageViews,  setViews]    = useState(0)
  const [loading,    setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // ── 1. Total users & plan breakdown ──────────────────────────────────
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, plan, status, created_at, username, email')
          .order('created_at', { ascending: false })

        const total   = profiles?.length || 0
        const premium = profiles?.filter(p => p.plan === 'premium' || p.plan === 'pro').length || 0
        const blocked = profiles?.filter(p => p.status === 'blocked').length || 0
        const active  = profiles?.filter(p => p.status !== 'blocked').length || 0

        // ── 2. Weekly signups (last 7 days) ───────────────────────────────────
        const now = new Date()
        const weekly = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now)
          d.setDate(d.getDate() - (6 - i))
          const dayStr = d.toISOString().split('T')[0]
          const count  = profiles?.filter(p => p.created_at?.startsWith(dayStr)).length || 0
          return { day: DAY_LABELS[d.getDay()], users: count }
        })

        // ── 3. Recent signups ─────────────────────────────────────────────────
        const recent = profiles?.slice(0, 5) || []

        // ── 4. Mood distribution (last 7 days) ────────────────────────────────
        const sevenDaysAgo = new Date(Date.now() - 7 * 864e5).toISOString()
        const { data: moods } = await supabase
          .from('mood_entries')
          .select('score')
          .gte('created_at', sevenDaysAgo)

        const moodBuckets = { 'Shkëlqyer': 0, 'Mirë': 0, 'Ok': 0, 'Keq': 0, 'Shumë keq': 0 }
        moods?.forEach(m => {
          if      (m.score >= 9) moodBuckets['Shkëlqyer']++
          else if (m.score >= 7) moodBuckets['Mirë']++
          else if (m.score >= 5) moodBuckets['Ok']++
          else if (m.score >= 3) moodBuckets['Keq']++
          else                   moodBuckets['Shumë keq']++
        })
        const moodArr = Object.entries(moodBuckets).map(([mood, count]) => ({ mood, count }))

        // ── 5. Page views (if table exists) ───────────────────────────────────
        const { count: viewCount } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo)

        setStats({ total, premium, blocked, active })
        setWeekly(weekly)
        setMood(moodArr)
        setRecent(recent)
        setViews(viewCount || 0)
      } catch (e) {
        console.error('Dashboard load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalUsers = stats?.total ?? allUsers.length
  const premium    = stats?.premium ?? allUsers.filter(u => u.plan === 'premium' || u.plan === 'pro').length
  const blocked    = stats?.blocked ?? allUsers.filter(u => u.status === 'blocked').length

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Pasqyra e sistemit · NeuroSphera</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users}         label="Total përdorues"    value={totalUsers} loading={loading} bg="bg-violet-100"  color="text-violet-600" />
        <KPICard icon={TrendingUp}    label="Premium users"      value={premium}    loading={loading} bg="bg-amber-100"   color="text-amber-600"  />
        <KPICard icon={Eye}           label="Vizita (7 ditë)"    value={pageViews}  loading={loading} bg="bg-blue-100"    color="text-blue-600"   />
        <KPICard icon={Shield}        label="Llogari të bllok."  value={blocked}    loading={loading} bg="bg-red-100"     color="text-red-500"    />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Regjistrimet javore</h3>
              <p className="text-xs text-gray-400 mt-0.5">7 ditët e fundit</p>
            </div>
          </div>
          {loading
            ? <div className="h-44 bg-gray-50 rounded-xl animate-pulse" />
            : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}   />
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
            )
          }
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Shpërndarja e humorit</h3>
            <p className="text-xs text-gray-400 mt-0.5">7 ditët e fundit</p>
          </div>
          {loading
            ? <div className="h-44 bg-gray-50 rounded-xl animate-pulse" />
            : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={moodData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="mood" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent signups */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-violet-600" />
            <h3 className="font-bold text-gray-800">Regjistrimet e fundit</h3>
          </div>
          {loading
            ? <div className="space-y-3">{[...Array(5)].map((_,i) => (
                <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
              ))}</div>
            : recentUsers.length === 0
              ? <p className="text-sm text-gray-400 text-center py-6">Asnjë përdorues ende</p>
              : (
                <div className="space-y-3">
                  {recentUsers.map((u, i) => (
                    <div key={u.id || i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-violet-600">
                          {(u.username || u.email || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {u.username || u.email || 'Anonim'}
                        </p>
                        <p className="text-[11px] text-gray-400 capitalize">{u.plan || 'free'}</p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 shrink-0">
                        <Clock size={11} />
                        <span className="text-[11px]">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('sq-AL') : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
          }
        </div>

        {/* System status */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-violet-600" />
            <h3 className="font-bold text-gray-800">Statusi i sistemit</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Supabase DB',   status: 'online' },
              { label: 'Auth Service',  status: 'online' },
              { label: 'Vercel CDN',    status: 'online' },
              { label: 'Google OAuth',  status: 'online' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-gray-700">{s.label}</span>
                </div>
                <span className="text-xs font-bold text-green-600">Online</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Total përdorues</span>
              <span className="font-bold text-gray-800">{totalUsers}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Të bllokuar</span>
              <span className="font-bold text-red-500">{blocked}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Premium</span>
              <span className="font-bold text-amber-600">{premium}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
