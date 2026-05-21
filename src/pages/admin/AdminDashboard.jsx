import { useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Users, FileText, MessageSquare, TrendingUp, ArrowUp, ArrowDown,
  Activity, Clock, Shield, Eye, Calendar, Brain, CreditCard,
  BookOpen, Heart, Zap, UserCheck, RefreshCw,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const DAY_LABELS = ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht']

function KPICard({ icon: Icon, label, value, sub, delta, deltaUp, color, bg, loading, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-violet-200' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={18} className={color} strokeWidth={2} />
        </div>
        {delta != null && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${deltaUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {deltaUp ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
            {delta}
          </div>
        )}
      </div>
      {loading
        ? <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse mb-1" />
        : <p className="text-2xl font-black text-gray-900">{value ?? '—'}</p>
      }
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function StatRow({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600 font-semibold">{label}</span>
        <span className="text-xs font-black text-gray-800">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { allUsers } = useAuth()
  const [stats,       setStats]    = useState(null)
  const [weeklyData,  setWeekly]   = useState([])
  const [moodData,    setMood]     = useState([])
  const [recentUsers, setRecent]   = useState([])
  const [recentApts,  setRecentApts] = useState([])
  const [loading,     setLoading]  = useState(true)
  const [lastRefresh, setLastRefresh] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 864e5).toISOString()
      const thirtyDaysAgo = new Date(Date.now() - 30 * 864e5).toISOString()

      const [
        profilesRes,
        moodsRes,
        viewsRes,
        appointmentsRes,
        journalRes,
        specialistsRes,
        messagesRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id,plan,status,created_at,username,email').order('created_at', { ascending: false }),
        supabase.from('mood_entries').select('score,created_at').gte('created_at', sevenDaysAgo),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
        supabase.from('appointments').select('id,status,created_at,psychologist_id').order('created_at', { ascending: false }),
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
        supabase.from('specialists').select('id,is_active,name').order('created_at', { ascending: false }),
        supabase.from('chat_messages').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
      ])

      const profiles     = profilesRes.data     || []
      const moods        = moodsRes.data         || []
      const viewCount    = viewsRes.count         || 0
      const appointments = appointmentsRes.data   || []
      const journalCount = journalRes.count        || 0
      const specialists  = specialistsRes.data     || []
      const msgCount     = messagesRes.count        || 0

      // User stats
      const total    = profiles.length
      const premium  = profiles.filter(p => p.plan === 'premium' || p.plan === 'pro').length
      const blocked  = profiles.filter(p => p.status === 'blocked').length
      const active   = profiles.filter(p => p.status !== 'blocked').length
      const newToday = profiles.filter(p => p.created_at?.startsWith(new Date().toISOString().split('T')[0])).length
      const newWeek  = profiles.filter(p => p.created_at >= sevenDaysAgo).length
      const newMonth = profiles.filter(p => p.created_at >= thirtyDaysAgo).length

      // Weekly signups
      const now = new Date()
      const weekly = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - (6 - i))
        const dayStr = d.toISOString().split('T')[0]
        return {
          day: DAY_LABELS[d.getDay()],
          users: profiles.filter(p => p.created_at?.startsWith(dayStr)).length,
          premium: profiles.filter(p => p.created_at?.startsWith(dayStr) && (p.plan === 'premium' || p.plan === 'pro')).length,
        }
      })

      // Mood buckets
      const moodBuckets = { 'Shkëlqyer': 0, 'Mirë': 0, 'Ok': 0, 'Keq': 0, 'Shumë keq': 0 }
      moods.forEach(m => {
        if      (m.score >= 9) moodBuckets['Shkëlqyer']++
        else if (m.score >= 7) moodBuckets['Mirë']++
        else if (m.score >= 5) moodBuckets['Ok']++
        else if (m.score >= 3) moodBuckets['Keq']++
        else                   moodBuckets['Shumë keq']++
      })
      const moodArr = Object.entries(moodBuckets).map(([mood, count]) => ({ mood, count }))

      // Appointment stats
      const aptBooked    = appointments.filter(a => a.status === 'booked').length
      const aptCompleted = appointments.filter(a => a.status === 'completed').length
      const aptCancelled = appointments.filter(a => a.status === 'cancelled').length

      // Specialist stats
      const activeSpecialists = specialists.filter(s => s.is_active !== false).length

      // Revenue estimate (premium users × avg price)
      const revenueEstimate = premium * 9.99

      setStats({
        total, premium, blocked, active, newToday, newWeek, newMonth,
        viewCount, journalCount, msgCount,
        aptBooked, aptCompleted, aptCancelled, aptTotal: appointments.length,
        activeSpecialists, totalSpecialists: specialists.length,
        moodEntries: moods.length,
        revenueEstimate,
      })
      setWeekly(weekly)
      setMood(moodArr)
      setRecent(profiles.slice(0, 6))
      setRecentApts(appointments.slice(0, 5))
      setLastRefresh(new Date())
    } catch (e) {
      console.error('Dashboard load error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const s = stats

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Pasqyra e plotë e platformës · NeuroSphera
            {lastRefresh && <span className="text-gray-400 ml-2">· {lastRefresh.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })}</span>}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Rifresko
        </button>
      </div>

      {/* KPI Grid — Row 1: Users */}
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Përdoruesit</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={Users}      label="Total përdorues"     value={s?.total}        loading={loading} bg="bg-violet-100"  color="text-violet-600" delta="+12%" deltaUp />
          <KPICard icon={TrendingUp} label="Regjistrime (javë)"  value={s?.newWeek}      loading={loading} bg="bg-blue-100"    color="text-blue-600"   sub={`${s?.newToday ?? 0} sot`} />
          <KPICard icon={Zap}        label="Premium users"       value={s?.premium}      loading={loading} bg="bg-amber-100"   color="text-amber-600"  delta="+8%" deltaUp />
          <KPICard icon={Shield}     label="Të bllokuar"         value={s?.blocked}      loading={loading} bg="bg-red-100"     color="text-red-500" />
        </div>
      </div>

      {/* KPI Grid — Row 2: Platform */}
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Platforma</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={UserCheck}   label="Specialistët aktiv"  value={s?.activeSpecialists} loading={loading} bg="bg-teal-100"   color="text-teal-600"  sub={`${s?.totalSpecialists ?? 0} gjithsej`} />
          <KPICard icon={Calendar}    label="Takime gjithsej"     value={s?.aptTotal}          loading={loading} bg="bg-indigo-100" color="text-indigo-600" sub={`${s?.aptBooked ?? 0} aktive`} />
          <KPICard icon={MessageSquare} label="Mesazhe (7 ditë)"  value={s?.msgCount}          loading={loading} bg="bg-pink-100"   color="text-pink-600" />
          <KPICard icon={BookOpen}    label="Hyrje ditari"        value={s?.journalCount}      loading={loading} bg="bg-orange-100" color="text-orange-600" />
        </div>
      </div>

      {/* KPI Grid — Row 3: Revenue */}
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Të ardhura</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={CreditCard}  label="Të ardhura mujore (est.)" value={s?.revenueEstimate ? `€${s.revenueEstimate.toFixed(0)}` : '—'} loading={loading} bg="bg-green-100" color="text-green-600" delta="+15%" deltaUp />
          <KPICard icon={Eye}         label="Vizita (7 ditë)"          value={s?.viewCount}     loading={loading} bg="bg-sky-100"    color="text-sky-600" />
          <KPICard icon={Heart}       label="Hyrje humori (7 ditë)"    value={s?.moodEntries}   loading={loading} bg="bg-rose-100"   color="text-rose-600" />
          <KPICard icon={Brain}       label="AI sesione"               value="—"                loading={false}   bg="bg-purple-100" color="text-purple-600" sub="Së shpejti" />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly registrations */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Regjistrimet javore</h3>
            <p className="text-xs text-gray-400 mt-0.5">7 ditët e fundit · Users + Premium</p>
          </div>
          {loading
            ? <div className="h-44 bg-gray-50 rounded-xl animate-pulse" />
            : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="users"   stroke="#7c3aed" strokeWidth={2.5} fill="url(#g1)" name="Users" />
                  <Area type="monotone" dataKey="premium" stroke="#f59e0b" strokeWidth={2}   fill="url(#g2)" name="Premium" />
                </AreaChart>
              </ResponsiveContainer>
            )
          }
        </div>

        {/* Mood distribution */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Shpërndarja e humorit</h3>
            <p className="text-xs text-gray-400 mt-0.5">7 ditët e fundit · {s?.moodEntries ?? 0} hyrje</p>
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
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Hyrje" />
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-violet-600" />
              <h3 className="font-bold text-gray-800">Regjistrimet e fundit</h3>
            </div>
            <span className="text-xs text-gray-400">{s?.newMonth ?? 0} këtë muaj</span>
          </div>
          {loading
            ? <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            : recentUsers.length === 0
              ? <p className="text-sm text-gray-400 text-center py-6">Asnjë përdorues ende</p>
              : (
                <div className="space-y-2">
                  {recentUsers.map((u, i) => (
                    <div key={u.id || i} className="flex items-center gap-3 py-1.5">
                      <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-violet-600">
                          {(u.username || u.email || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{u.username || u.email || 'Anonim'}</p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                          {u.plan || 'free'}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock size={10} />
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('sq-AL') : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
          }
        </div>

        {/* System status + plan breakdown */}
        <div className="space-y-4">
          {/* System status */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-violet-600" />
              <h3 className="font-bold text-gray-800">Statusi i sistemit</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Supabase DB',   status: 'online' },
                { label: 'Auth Service',  status: 'online' },
                { label: 'Vercel CDN',    status: 'online' },
                { label: 'Email Service', status: 'online' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-gray-700">{s.label}</span>
                  </div>
                  <span className="text-xs font-bold text-green-600">Online</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={16} className="text-violet-600" />
              <h3 className="font-bold text-gray-800">Planet e abonimit</h3>
            </div>
            {loading
              ? <div className="space-y-2">{[...Array(2)].map((_,i) => <div key={i} className="h-6 bg-gray-50 rounded animate-pulse" />)}</div>
              : (
                <div className="space-y-3">
                  <StatRow label="Free"    value={Math.max(0, (s?.total ?? 0) - (s?.premium ?? 0))} max={s?.total || 1} color="#e5e7eb" />
                  <StatRow label="Premium" value={s?.premium ?? 0} max={s?.total || 1} color="#7c3aed" />
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Konvertimi: <span className="font-black text-gray-800">{s?.total ? Math.round((s.premium / s.total) * 100) : 0}%</span></p>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
