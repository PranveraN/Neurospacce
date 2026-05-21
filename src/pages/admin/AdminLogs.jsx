import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import {
  ScrollText, RefreshCw, Search, Filter, Loader2,
  LogIn, LogOut, UserPlus, Settings, Shield,
  AlertTriangle, Info, CheckCircle, XCircle,
  Download, Eye, Clock, User,
} from 'lucide-react'

const LOG_TYPES = [
  { id: 'all',     label: 'Të gjitha' },
  { id: 'auth',    label: 'Autentifikim' },
  { id: 'admin',   label: 'Admin' },
  { id: 'error',   label: 'Gabime' },
  { id: 'system',  label: 'Sistem' },
]

const LOG_LEVELS = {
  info:    { icon: Info,          color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30' },
  success: { icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  warning: { icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/30' },
  error:   { icon: XCircle,       color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/30' },
}

const LOG_ACTIONS = {
  login:        { icon: LogIn,    label: 'Hyrje',          level: 'success' },
  logout:       { icon: LogOut,   label: 'Dalje',          level: 'info' },
  register:     { icon: UserPlus, label: 'Regjistrim',     level: 'success' },
  settings:     { icon: Settings, label: 'Cilësimet',      level: 'info' },
  admin_action: { icon: Shield,   label: 'Veprim Admin',   level: 'warning' },
  error:        { icon: XCircle,  label: 'Gabim',          level: 'error' },
  view:         { icon: Eye,      label: 'Shikuar',        level: 'info' },
}

function generateMockLogs(profiles) {
  const actions = ['login', 'logout', 'register', 'settings', 'view', 'admin_action']
  const now = Date.now()
  return Array.from({ length: 50 }, (_, i) => {
    const profile = profiles?.[i % (profiles?.length || 1)]
    const action  = actions[Math.floor(Math.random() * actions.length)]
    const minsAgo = Math.floor(Math.random() * 10080)
    return {
      id: `mock-${i}`,
      action,
      user_id:    profile?.id || null,
      username:   profile?.username || `user_${i}`,
      email:      profile?.email || '',
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
      details:    `${LOG_ACTIONS[action]?.label || action} — NeuroSphera platform`,
      level:      LOG_ACTIONS[action]?.level || 'info',
      created_at: new Date(now - minsAgo * 60000).toISOString(),
    }
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

function LogRow({ log }) {
  const action    = LOG_ACTIONS[log.action] || LOG_ACTIONS.view
  const level     = LOG_LEVELS[log.level]   || LOG_LEVELS.info
  const LevelIcon = level.icon
  const ActionIcon = action.icon

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/30 transition-colors border-b border-slate-800/60 last:border-0">
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${level.bg}`}>
        <LevelIcon size={13} className={level.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <ActionIcon size={13} className="text-slate-500 shrink-0" />
            <span className="text-sm font-bold text-white">{action.label}</span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${level.bg} ${level.color}`}>
              {log.level}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 shrink-0">
            {new Date(log.created_at).toLocaleString('sq-AL', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{log.details}</p>
        <div className="flex items-center gap-3 mt-1">
          {log.username && (
            <span className="text-[10px] text-slate-600 flex items-center gap-1">
              <User size={9} /> {log.username}
            </span>
          )}
          {log.ip_address && (
            <span className="text-[10px] text-slate-600 flex items-center gap-1">
              <Shield size={9} /> {log.ip_address}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminLogs() {
  const [logs, setLogs]             = useState([])
  const [profiles, setProfiles]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isMock, setIsMock]         = useState(false)

  const load = useCallback(async () => {
    setLoading(true)

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id,username,email,created_at,last_sign_in_at')
      .order('created_at', { ascending: false })

    setProfiles(profileData || [])

    const { data: logsData, error: logsErr } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    if (logsErr || !logsData || logsData.length === 0) {
      setIsMock(true)
      setLogs(generateMockLogs(profileData))
    } else {
      setIsMock(false)
      setLogs(logsData)
    }

    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = logs.filter(log => {
    const q = search.toLowerCase()
    const matchSearch = !q
      || log.username?.toLowerCase().includes(q)
      || log.action?.toLowerCase().includes(q)
      || log.details?.toLowerCase().includes(q)
      || log.ip_address?.includes(q)

    const matchType = typeFilter === 'all'
      || (typeFilter === 'auth'   && ['login','logout','register'].includes(log.action))
      || (typeFilter === 'admin'  && log.action === 'admin_action')
      || (typeFilter === 'error'  && log.level  === 'error')
      || (typeFilter === 'system' && ['settings','view'].includes(log.action))

    return matchSearch && matchType
  })

  const errCount     = logs.filter(l => l.level === 'error').length
  const warnCount    = logs.filter(l => l.level === 'warning').length
  const loginCount   = logs.filter(l => l.action === 'login').length
  const today        = new Date().toDateString()
  const todayLogins  = logs.filter(l => l.action === 'login' && new Date(l.created_at).toDateString() === today).length

  function downloadCSV() {
    const headers = ['Data', 'Veprim', 'Nivel', 'Përdoruesi', 'IP', 'Detaje']
    const rows = filtered.map(l => [
      new Date(l.created_at).toISOString(),
      l.action, l.level, l.username || '', l.ip_address || '', l.details || '',
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `neurosphera-logs-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Logs & Siguria</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Aktiviteti i platformës dhe historitë e sigurisë
            {isMock && <span className="ml-2 text-amber-400 text-xs font-bold">(të dhëna të simuluara)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-colors">
            <Download size={13} /> Export CSV
          </button>
          <button onClick={load} className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs',      value: logs.length,   color: 'text-white' },
          { label: 'Hyrje Sot',       value: todayLogins,   color: 'text-emerald-400' },
          { label: 'Kujdes',          value: warnCount,     color: 'text-amber-400' },
          { label: 'Gabime',          value: errCount,      color: 'text-red-400' },
        ].map(k => (
          <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-500">{k.label}</p>
            <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
            placeholder="Kërko në logs..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {LOG_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${typeFilter === t.id ? 'bg-violet-600 border-violet-500 text-white' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Auth Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="font-black text-white text-sm mb-4 flex items-center gap-2">
          <Clock size={14} className="text-violet-400" />
          Aktiviteti i Fundit i Hyrjeve ({profiles.length} llogari)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {['Përdoruesi', 'Email', 'Regjistruar', 'Hyrja e Fundit'].map(h => (
                  <th key={h} className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {profiles.slice(0, 10).map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                        {p.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-bold text-white">{p.username || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{p.email || '—'}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString('sq-AL') : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">
                    {p.last_sign_in_at
                      ? new Date(p.last_sign_in_at).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h2 className="font-black text-white text-sm flex items-center gap-2">
              <ScrollText size={14} className="text-violet-400" />
              Feed i Aktivitetit ({filtered.length})
            </h2>
            <span className="text-xs text-slate-500">{logs.length} total</span>
          </div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-600">
              <ScrollText size={32} />
              <p className="text-sm font-semibold">Nuk u gjet asnjë log</p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              {filtered.map(log => <LogRow key={log.id} log={log} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
