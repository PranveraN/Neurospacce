import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Bell, Send, Plus, Trash2, Loader2, X, RefreshCw,
  Users, Crown, Zap, Shield, CheckCircle, Clock,
  AlertTriangle, Info, Megaphone, Gift,
} from 'lucide-react'

const NOTIFICATION_TYPES = [
  { id: 'info',       label: 'Informacion', icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30' },
  { id: 'success',    label: 'Sukses',      icon: CheckCircle,    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { id: 'warning',    label: 'Kujdes',      icon: AlertTriangle,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'promo',      label: 'Promovim',    icon: Gift,           color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/30' },
  { id: 'announce',   label: 'Njoftim',     icon: Megaphone,      color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/30' },
]

const TARGET_OPTIONS = [
  { id: 'all',     label: 'Të gjithë përdoruesit', icon: Users,   color: 'text-slate-400' },
  { id: 'free',    label: 'Plani Free',             icon: Shield,  color: 'text-slate-400' },
  { id: 'pro',     label: 'Plani Pro',              icon: Zap,     color: 'text-violet-400' },
  { id: 'premium', label: 'Plani Premium',          icon: Crown,   color: 'text-amber-400' },
]

const EMPTY_FORM = {
  title: '', body: '', type: 'info', target: 'all', scheduled_at: '',
}

function TypeBadge({ type }) {
  const t = NOTIFICATION_TYPES.find(n => n.id === type) || NOTIFICATION_TYPES[0]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${t.bg}`}>
      <t.icon size={10} className={t.color} />
      <span className={t.color}>{t.label}</span>
    </span>
  )
}

function ComposeModal({ onClose, onSend, userCount }) {
  const [form, setForm]   = useState(EMPTY_FORM)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent]   = useState(false)

  const targetCount = userCount?.[form.target] ?? 0

  async function handleSend() {
    if (!form.title.trim() || !form.body.trim()) {
      setError('Titulli dhe mesazhi janë të detyrueshëm.')
      return
    }
    setSending(true)
    setError(null)

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      type: form.type,
      target_plan: form.target,
      scheduled_at: form.scheduled_at || null,
      sent_at: form.scheduled_at ? null : new Date().toISOString(),
      status: form.scheduled_at ? 'scheduled' : 'sent',
      created_at: new Date().toISOString(),
    }

    const { error: err } = await supabase.from('notifications').insert(payload)
    setSending(false)
    if (err) {
      setError(`Gabim: ${err.message}. Tabela "notifications" mund të mos ekzistojë.`)
      return
    }
    setSent(true)
    setTimeout(() => { onSend(); onClose() }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="font-black text-white text-base flex items-center gap-2">
            <Bell size={16} className="text-violet-400" /> Njoftim i Ri
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle size={40} className="text-emerald-400" />
              <p className="font-black text-white">Njoftimi u dërgua!</p>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">{error}</div>}

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Lloji i Njoftimit</label>
                <div className="flex flex-wrap gap-2">
                  {NOTIFICATION_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setForm(f => ({ ...f, type: t.id }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        form.type === t.id ? `${t.bg}` : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <t.icon size={12} className={form.type === t.id ? t.color : ''} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Dërgoni tek</label>
                <div className="grid grid-cols-2 gap-2">
                  {TARGET_OPTIONS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setForm(f => ({ ...f, target: t.id }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        form.target === t.id ? 'bg-violet-600 border-violet-500 text-white' : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <t.icon size={13} className={form.target === t.id ? 'text-white' : t.color} />
                      {t.label}
                    </button>
                  ))}
                </div>
                {targetCount > 0 && (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Do të dërgohet tek <strong className="text-white">{targetCount}</strong> përdorues
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Titulli *</label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Titulli i njoftimit..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Mesazhi *</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                  value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Teksti i njoftimit..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Planifiko (opsionale)</label>
                <input
                  type="datetime-local"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  value={form.scheduled_at}
                  onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))}
                />
              </div>
            </>
          )}
        </div>

        {!sent && (
          <div className="flex gap-3 p-5 border-t border-slate-800">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors">
              Anulo
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {form.scheduled_at ? 'Planifiko' : 'Dërgo Tani'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [showCompose, setShowCompose]     = useState(false)
  const [userCount, setUserCount]         = useState({})
  const [deleteTarget, setDeleteTarget]   = useState(null)
  const [deleting, setDeleting]           = useState(false)
  const [tableExists, setTableExists]     = useState(true)

  const load = useCallback(async () => {
    setLoading(true)

    const [notifRes, profilesRes] = await Promise.all([
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('profiles').select('id,plan'),
    ])

    if (notifRes.error?.code === '42P01') {
      setTableExists(false)
    } else {
      setTableExists(true)
      setNotifications(notifRes.data || [])
    }

    if (profilesRes.data) {
      const counts = profilesRes.data.reduce((acc, p) => {
        const plan = p.plan || 'free'
        acc[plan] = (acc[plan] || 0) + 1
        acc.all   = (acc.all   || 0) + 1
        return acc
      }, {})
      setUserCount(counts)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await supabase.from('notifications').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    load()
  }

  const sentCount      = notifications.filter(n => n.status === 'sent').length
  const scheduledCount = notifications.filter(n => n.status === 'scheduled').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Qendra e Njoftimeve</h1>
          <p className="text-sm text-slate-500 mt-0.5">Dërgoni njoftime dhe njoftimet e platformës</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors">
            <Plus size={15} /> Njoftim i Ri
          </button>
        </div>
      </div>

      {!tableExists && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-bold text-sm">Tabela "notifications" nuk ekziston</p>
            <p className="text-amber-400/70 text-xs mt-0.5">Krijoni tabelën në Supabase për të aktivizuar njoftimet. Skema: id, title, body, type, target_plan, status, sent_at, scheduled_at, created_at.</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gjithsej Dërguar', value: sentCount,      color: 'text-violet-400' },
          { label: 'Të planifikuara',  value: scheduledCount,  color: 'text-amber-400' },
          { label: 'Bazë Përdoruesish', value: userCount.all || 0, color: 'text-white' },
          { label: 'Me Plan Paid',     value: (userCount.pro || 0) + (userCount.premium || 0), color: 'text-emerald-400' },
        ].map(k => (
          <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-500">{k.label}</p>
            <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="font-black text-white text-sm">Historia e Njoftimeve</h2>
          </div>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-600">
              <Bell size={32} />
              <p className="text-sm font-semibold">Nuk ka njoftime deri tani</p>
              <button onClick={() => setShowCompose(true)} className="text-xs text-violet-400 hover:text-violet-300 font-bold">
                Dërgo njoftimin e parë
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {notifications.map(n => {
                const t = NOTIFICATION_TYPES.find(x => x.id === n.type) || NOTIFICATION_TYPES[0]
                const target = TARGET_OPTIONS.find(x => x.id === n.target_plan) || TARGET_OPTIONS[0]
                return (
                  <div key={n.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${t.bg}`}>
                      <t.icon size={16} className={t.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-white truncate">{n.title}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <TypeBadge type={n.type} />
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            n.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {n.status === 'sent' ? <CheckCircle size={9} /> : <Clock size={9} />}
                            {n.status === 'sent' ? 'Dërguar' : 'Planifikuar'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.body}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-slate-600 flex items-center gap-1">
                          <target.icon size={9} className={target.color} />
                          {target.label}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {n.sent_at
                            ? new Date(n.sent_at).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                            : n.scheduled_at
                              ? `Planifikuar: ${new Date(n.scheduled_at).toLocaleDateString('sq-AL')}`
                              : '—'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(n)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSend={load}
          userCount={userCount}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-black text-white text-base mb-2">Fshi Njoftimin</h3>
            <p className="text-sm text-slate-400 mb-5">
              Jeni i sigurt që doni të fshini njoftimin <strong className="text-white">"{deleteTarget.title}"</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors">
                Anulo
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Fshi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
