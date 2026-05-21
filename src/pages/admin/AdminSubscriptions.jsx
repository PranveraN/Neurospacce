import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import {
  CreditCard, Users, TrendingUp, DollarSign, RefreshCw,
  CheckCircle, XCircle, Edit2, Save, X, Loader2, Crown,
  Zap, Star, Shield, ArrowUp, ArrowDown, AlertCircle,
} from 'lucide-react'

const PLAN_PRICES = { free: 0, pro: 9.99, premium: 19.99 }
const PLAN_COLORS = {
  free:    { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-300', badge: 'bg-slate-700 text-slate-300 border-slate-600' },
  pro:     { bg: 'bg-violet-900/30', border: 'border-violet-500/40', text: 'text-violet-300', badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  premium: { bg: 'bg-amber-900/20', border: 'border-amber-500/30', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
}

const PLAN_FEATURES = {
  free: [
    { key: 'ai_messages_daily', label: 'Mesazhe AI / ditë', value: 5, editable: true },
    { key: 'journal_entries', label: 'Hyrje ditari', value: 10, editable: true },
    { key: 'techniques_access', label: 'Teknika (nivel bazë)', value: true, editable: false },
    { key: 'mood_tracking', label: 'Gjurmim Humori', value: true, editable: false },
    { key: 'chatroom_access', label: 'Akses Chatroom', value: false, editable: false },
    { key: 'specialist_booking', label: 'Rezervim Specialisti', value: false, editable: false },
  ],
  pro: [
    { key: 'ai_messages_daily', label: 'Mesazhe AI / ditë', value: 50, editable: true },
    { key: 'journal_entries', label: 'Hyrje ditari', value: -1, editable: false, label2: 'Pa limit' },
    { key: 'techniques_access', label: 'Të gjitha teknikat', value: true, editable: false },
    { key: 'mood_tracking', label: 'Gjurmim i avancuar', value: true, editable: false },
    { key: 'chatroom_access', label: 'Akses Chatroom', value: true, editable: false },
    { key: 'specialist_booking', label: 'Rezervim Specialisti', value: true, editable: false },
    { key: 'neuro_garden', label: 'Neuro Garden', value: true, editable: false },
  ],
  premium: [
    { key: 'ai_messages_daily', label: 'Mesazhe AI / ditë', value: -1, editable: false, label2: 'Pa limit' },
    { key: 'journal_entries', label: 'Hyrje ditari', value: -1, editable: false, label2: 'Pa limit' },
    { key: 'techniques_access', label: 'Të gjitha teknikat', value: true, editable: false },
    { key: 'mood_tracking', label: 'Analytics i plotë', value: true, editable: false },
    { key: 'chatroom_access', label: 'Chatroom + VIP', value: true, editable: false },
    { key: 'specialist_booking', label: 'Takime prioritare', value: true, editable: false },
    { key: 'neuro_garden', label: 'Neuro Garden Pro', value: true, editable: false },
    { key: 'ai_report', label: 'Raporte AI javore', value: true, editable: false },
    { key: 'dedicated_support', label: 'Support i dedikuar', value: true, editable: false },
  ],
}

function PlanIcon({ plan }) {
  if (plan === 'premium') return <Crown size={18} className="text-amber-400" />
  if (plan === 'pro')     return <Zap size={18} className="text-violet-400" />
  return <Shield size={18} className="text-slate-400" />
}

function StatCard({ label, value, sub, icon: Icon, color = 'violet' }) {
  const colorMap = {
    violet:  'text-violet-400',
    emerald: 'text-emerald-400',
    amber:   'text-amber-400',
    blue:    'text-blue-400',
  }
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <p className={`text-3xl font-black mt-1 ${colorMap[color]}`}>{value}</p>
          {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
        </div>
        {Icon && <Icon size={20} className={`${colorMap[color]} opacity-50`} />}
      </div>
    </div>
  )
}

function PlanEditor({ plan, stats, onRefresh }) {
  const c      = PLAN_COLORS[plan]
  const feats  = PLAN_FEATURES[plan]
  const count  = stats?.[plan] ?? 0
  const mrr    = count * PLAN_PRICES[plan]

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlanIcon plan={plan} />
          <h3 className={`font-black text-base ${c.text} capitalize`}>{plan}</h3>
        </div>
        <div className="text-right">
          <p className={`text-lg font-black ${c.text}`}>
            {PLAN_PRICES[plan] === 0 ? 'Falas' : `€${PLAN_PRICES[plan]}/muaj`}
          </p>
          <p className="text-xs text-slate-500">{count} përdorues</p>
        </div>
      </div>

      {plan !== 'free' && (
        <div className="bg-slate-900/50 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MRR</p>
          <p className="text-lg font-black text-emerald-400">€{mrr.toFixed(0)}</p>
        </div>
      )}

      <div className="space-y-2">
        {feats.map(f => (
          <div key={f.key} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
            <span className="text-xs font-semibold text-slate-400">{f.label}</span>
            <span className="text-xs font-black">
              {typeof f.value === 'boolean'
                ? f.value
                  ? <CheckCircle size={14} className="text-emerald-400" />
                  : <XCircle size={14} className="text-red-500/60" />
                : f.value === -1
                  ? <span className="text-violet-400">∞</span>
                  : <span className={c.text}>{f.value}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminSubscriptions() {
  const [stats, setStats]         = useState({ free: 0, pro: 0, premium: 0, total: 0 })
  const [history, setHistory]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState('overview')

  const load = useCallback(async () => {
    setLoading(true)

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id,plan,username,email,created_at,status')
      .order('created_at', { ascending: false })

    if (profiles) {
      const counts = profiles.reduce((acc, p) => {
        const plan = p.plan || 'free'
        acc[plan] = (acc[plan] || 0) + 1
        return acc
      }, {})
      setStats({
        free:    counts.free    || 0,
        pro:     counts.pro     || 0,
        premium: counts.premium || 0,
        total:   profiles.length,
      })
      setHistory(profiles.filter(p => p.plan && p.plan !== 'free').slice(0, 50))
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const mrr     = stats.pro * PLAN_PRICES.pro + stats.premium * PLAN_PRICES.premium
  const arr     = mrr * 12
  const payingPct = stats.total ? (((stats.pro + stats.premium) / stats.total) * 100).toFixed(1) : '0.0'

  const tabs = [
    { id: 'overview',  label: 'Pasqyrë' },
    { id: 'plans',     label: 'Planet' },
    { id: 'members',   label: 'Abonentët' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Menaxhimi i Abonimeve</h1>
          <p className="text-sm text-slate-500 mt-0.5">Planet, çmimet dhe abonentët</p>
        </div>
        <button onClick={load} className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t.id ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      ) : tab === 'overview' ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="MRR (mujor)" value={`€${mrr.toFixed(0)}`} sub="të ardhura mujore" icon={DollarSign} color="emerald" />
            <StatCard label="ARR (vjetor)" value={`€${arr.toFixed(0)}`} sub="projektion vjetor" icon={TrendingUp} color="violet" />
            <StatCard label="Abonentë Pagues" value={stats.pro + stats.premium} sub={`${payingPct}% e bazës`} icon={CreditCard} color="amber" />
            <StatCard label="Konvertimi" value={`${payingPct}%`} sub="free → paid" icon={Users} color="blue" />
          </div>

          {/* Plan Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="font-black text-white text-sm mb-4">Shpërndarja e Planeve</h2>
            <div className="space-y-3">
              {[
                { plan: 'free',    count: stats.free,    color: 'bg-slate-600' },
                { plan: 'pro',     count: stats.pro,     color: 'bg-violet-500' },
                { plan: 'premium', count: stats.premium, color: 'bg-amber-500' },
              ].map(({ plan, count, color }) => (
                <div key={plan}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <PlanIcon plan={plan} />
                      <span className="text-sm font-bold text-slate-300 capitalize">{plan}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white">{count}</span>
                      <span className="text-xs text-slate-500 ml-1.5">
                        ({stats.total ? ((count / stats.total) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${color} transition-all`}
                      style={{ width: stats.total ? `${(count / stats.total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { plan: 'free', label: 'Free', count: stats.free, revenue: 0, icon: Shield, c: 'text-slate-400' },
              { plan: 'pro', label: 'Pro', count: stats.pro, revenue: stats.pro * PLAN_PRICES.pro, icon: Zap, c: 'text-violet-400' },
              { plan: 'premium', label: 'Premium', count: stats.premium, revenue: stats.premium * PLAN_PRICES.premium, icon: Crown, c: 'text-amber-400' },
            ].map(p => (
              <div key={p.plan} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center`}>
                    <p.icon size={18} className={p.c} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">{p.label}</p>
                    <p className="text-sm font-black text-white">{p.count} user</p>
                  </div>
                </div>
                <p className="text-lg font-black text-emerald-400">€{p.revenue.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </>
      ) : tab === 'plans' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {['free', 'pro', 'premium'].map(plan => (
            <PlanEditor key={plan} plan={plan} stats={stats} onRefresh={load} />
          ))}
        </div>
      ) : (
        /* Members Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="font-black text-white text-sm">Abonentët Pagues ({history.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Përdoruesi', 'Plani', 'Email', 'Data e Regjistrimit'].map(h => (
                    <th key={h} className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-slate-600 text-sm">Nuk ka abonentë pagues</td></tr>
                ) : history.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                          {u.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-bold text-white">{u.username || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${PLAN_COLORS[u.plan]?.badge || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                        <PlanIcon plan={u.plan} />
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{u.email || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('sq-AL') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
