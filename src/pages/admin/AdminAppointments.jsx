import { useState, useEffect } from 'react'
import {
  Calendar, Clock, Plus, X, Search,
  XCircle, AlertTriangle, RefreshCw,
  Lock, Unlock, Shield, Trash2, Ban,
} from 'lucide-react'
import { loadExperts } from '../../data/expertsData'
import {
  generateSlots, formatDate, formatShortDate,
  getBlockedTimes, blockTime, unblockTime,
  STATUS_COLORS, AVAILABILITY_RULES,
} from '../../data/appointmentsData'
import {
  fetchAllAppointments,
  fetchDayBookings,
  createAppointment as svcCreate,
  cancelAppointment as svcCancel,
} from '../../lib/appointmentsService'

const STATUS_OPTS = ['all', 'booked', 'completed', 'cancelled', 'pending']

// ── Create manual appointment modal ──────────────────────────────────────────
function CreateModal({ experts, onClose, onCreated }) {
  const [expertId, setExpertId] = useState('')
  const [date,     setDate]     = useState('')
  const [slots,    setSlots]    = useState([])
  const [slotTime, setSlotTime] = useState('')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [notes,    setNotes]    = useState('')
  const [error,    setError]    = useState('')

  useEffect(() => {
    if (!expertId || !date) return
    let cancelled = false
    const blocked = getBlockedTimes()
    fetchDayBookings(expertId, date).then(dayBookings => {
      if (cancelled) return
      setSlots(generateSlots(expertId, date, dayBookings, blocked).filter(s => s.status === 'available'))
      setSlotTime('')
    })
    return () => { cancelled = true }
  }, [expertId, date])

  async function handleCreate() {
    if (!expertId || !date || !slotTime || !name) { setError('Plotësoni fushat e detyrueshme.'); return }
    const slot   = slots.find(s => s.startTime === slotTime)
    const result = await svcCreate({
      userId: `admin_${Date.now()}`, userName: name, userEmail: email,
      psychologistId: expertId, date, startTime: slotTime, endTime: slot?.endTime || '', notes,
    })
    if (result.success) { onCreated(); onClose() }
    else setError(result.message)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">Krijo takim manual</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <X size={15} />
          </button>
        </div>
        {error && <div className="bg-red-50 rounded-xl p-3 flex items-center gap-2"><AlertTriangle size={14} className="text-red-500 shrink-0" /><p className="text-xs text-red-700 font-semibold">{error}</p></div>}
        {[
          { label: 'Emri i klientit *', el: <input value={name} onChange={e => setName(e.target.value)} placeholder="Emri i plotë" className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300" /> },
          { label: 'Email', el: <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@example.com" className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300" /> },
        ].map(({ label, el }) => <div key={label}><label className="text-xs font-bold text-gray-600 block mb-1">{label}</label>{el}</div>)}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Psikologu *</label>
          <select value={expertId} onChange={e => setExpertId(e.target.value)} className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300">
            <option value="">— Zgjidhni —</option>
            {experts.filter(e => AVAILABILITY_RULES[e.id]).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Data *</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300" />
        </div>
        {slots.length > 0 && (
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Ora *</label>
            <div className="grid grid-cols-4 gap-2">
              {slots.map(s => (
                <button key={s.startTime} onClick={() => setSlotTime(s.startTime)} className="py-2 rounded-xl text-xs font-bold border-2 transition-all"
                  style={slotTime === s.startTime ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', borderColor: '#7c3aed' } : { background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                  {s.startTime}
                </button>
              ))}
            </div>
          </div>
        )}
        {expertId && date && slots.length === 0 && <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 font-semibold">Nuk ka orare të lira për këtë ditë.</p>}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Shënime</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300 resize-none" />
        </div>
        <button onClick={handleCreate} className="w-full py-3 rounded-2xl text-white text-sm font-bold transition-all active:scale-95 shadow-sm" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
          Krijo takimin
        </button>
      </div>
    </div>
  )
}

// ── Block Manager tab ─────────────────────────────────────────────────────────
function BlockManager({ experts }) {
  const [psychId,  setPsychId]  = useState('')
  const [date,     setDate]     = useState('')
  const [slots,    setSlots]    = useState([])
  const [reason,   setReason]   = useState('')
  const [blocked,  setBlocked]  = useState([])
  const [msg,      setMsg]      = useState(null) // {type:'ok'|'err', text}
  const [filterP,  setFilterP]  = useState('all')

  function refreshBlocked() {
    setBlocked(getBlockedTimes())
  }

  useEffect(() => { refreshBlocked() }, [])

  useEffect(() => {
    if (!psychId || !date) { setSlots([]); return }
    let cancelled = false
    const blockedAll = getBlockedTimes()
    fetchDayBookings(psychId, date).then(dayBookings => {
      if (cancelled) return
      setSlots(generateSlots(psychId, date, dayBookings, blockedAll))
    })
    return () => { cancelled = true }
  }, [psychId, date, blocked])

  function flash(type, text) {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 2500)
  }

  async function refreshSlots() {
    const blockedAll = getBlockedTimes()
    const dayBookings = await fetchDayBookings(psychId, date)
    setSlots(generateSlots(psychId, date, dayBookings, blockedAll))
  }

  async function handleToggle(slot) {
    if (slot.status === 'booked' || slot.status === 'past') return

    if (slot.status === 'blocked') {
      const entry = getBlockedTimes().find(
        b => (b.psychologistId === psychId || !b.psychologistId) &&
             b.date === date &&
             b.startTime === slot.startTime
      )
      if (entry) {
        unblockTime(entry.id)
        refreshBlocked()
        await refreshSlots()
        flash('ok', `Ora ${slot.startTime} u zhbllokua.`)
      }
    } else {
      blockTime({ psychologistId: psychId, date, startTime: slot.startTime, endTime: slot.endTime, reason: reason || 'E bllokuar nga admini' })
      refreshBlocked()
      await refreshSlots()
      flash('ok', `Ora ${slot.startTime} u bllokua.`)
    }
  }

  async function handleUnblock(id, label) {
    unblockTime(id)
    refreshBlocked()
    if (psychId && date) await refreshSlots()
    flash('ok', `${label} u zhbllokua.`)
  }

  async function handleBlockAll() {
    const available = slots.filter(s => s.status === 'available')
    if (!available.length) { flash('err', 'Nuk ka orare të lira për t\'u bllokuar.'); return }
    available.forEach(s => blockTime({ psychologistId: psychId, date, startTime: s.startTime, endTime: s.endTime, reason: reason || 'E bllokuar nga admini' }))
    refreshBlocked()
    await refreshSlots()
    flash('ok', `${available.length} orare u bllokuan.`)
  }

  async function handleUnblockAll() {
    const toRemove = getBlockedTimes().filter(
      b => (b.psychologistId === psychId || !b.psychologistId) && b.date === date
    )
    toRemove.forEach(b => unblockTime(b.id))
    refreshBlocked()
    await refreshSlots()
    flash('ok', `${toRemove.length} orare u zhbllokuan.`)
  }

  const SLOT_STYLE = {
    available: { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: null,       cursor: 'pointer',    label: 'E lirë' },
    blocked:   { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', icon: '🔒',        cursor: 'pointer',    label: 'Bllokuar' },
    booked:    { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', icon: '👤',        cursor: 'not-allowed',label: 'Rezervuar' },
    past:      { bg: '#f9fafb', border: '#e5e7eb', text: '#9ca3af', icon: '⏰',        cursor: 'not-allowed',label: 'Kaluar' },
  }

  const filteredBlocked = filterP === 'all' ? blocked : blocked.filter(b => b.psychologistId === filterP || !b.psychologistId)

  const expertName = (id) => experts.find(e => e.id === id)?.name || id || 'Të gjithë'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* ── Left: Slot editor ── */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
              <Ban size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">Blloko / Zhblloko Orare</p>
              <p className="text-xs text-gray-400">Klik mbi orar për ta bllokuar ose zhbllokuar</p>
            </div>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Psikologu</label>
              <select value={psychId} onChange={e => setPsychId(e.target.value)}
                className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300">
                <option value="">— Zgjidhni —</option>
                {experts.filter(e => AVAILABILITY_RULES[e.id]).map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300" />
            </div>
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-600 block mb-1">Arsyeja (opsionale)</label>
            <input value={reason} onChange={e => setReason(e.target.value)}
              placeholder="p.sh. Pushim, Trajnim, Sëmundje..."
              className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 focus:border-violet-300" />
          </div>

          {/* Flash message */}
          {msg && (
            <div className={`rounded-xl px-4 py-2.5 mb-4 text-xs font-bold flex items-center gap-2 ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg.type === 'ok' ? '✅' : '❌'} {msg.text}
            </div>
          )}

          {/* Slot grid */}
          {!psychId || !date ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
              Zgjidhni psikologun dhe datën për të parë oraret
            </div>
          ) : slots.length === 0 ? (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
              <p className="text-sm font-bold text-amber-700">Psikologu nuk punon këtë ditë.</p>
              <p className="text-xs text-amber-500 mt-1">Zgjidhni një ditë pune.</p>
            </div>
          ) : (
            <>
              {/* Quick actions */}
              <div className="flex gap-2 mb-3">
                <button onClick={handleBlockAll}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
                  <Lock size={12} /> Blloko të gjitha të lira
                </button>
                <button onClick={handleUnblockAll}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors">
                  <Unlock size={12} /> Zhblloko të gjitha
                </button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-3">
                {Object.entries(SLOT_STYLE).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded border" style={{ background: v.bg, borderColor: v.border }} />
                    <span className="text-[10px] text-gray-500 font-medium">{v.label}</span>
                  </div>
                ))}
              </div>

              {/* Slots */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map(slot => {
                  const st = SLOT_STYLE[slot.status] || SLOT_STYLE.available
                  return (
                    <button
                      key={slot.startTime}
                      onClick={() => handleToggle(slot)}
                      disabled={slot.status === 'booked' || slot.status === 'past'}
                      title={st.label}
                      className="rounded-xl py-3 px-2 text-center border-2 transition-all duration-150 group relative"
                      style={{ background: st.bg, borderColor: st.border, cursor: st.cursor }}
                    >
                      <p className="text-xs font-black" style={{ color: st.text }}>{slot.startTime}</p>
                      <p className="text-[9px] mt-0.5 font-semibold" style={{ color: st.text, opacity: 0.7 }}>
                        {st.icon ? st.icon : (slot.status === 'available' ? '→ Blloko' : '')}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Day summary */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-4 text-xs">
                {[
                  { label: 'Të lira',     count: slots.filter(s => s.status === 'available').length, color: '#166534' },
                  { label: 'Bllokuar',    count: slots.filter(s => s.status === 'blocked').length,   color: '#dc2626' },
                  { label: 'Rezervuar',   count: slots.filter(s => s.status === 'booked').length,    color: '#1d4ed8' },
                ].map(({ label, count, color }) => (
                  <div key={label}>
                    <span className="font-black" style={{ color }}>{count}</span>
                    <span className="text-gray-400 ml-1">{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right: All blocked times ── */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-red-500" />
              <p className="text-sm font-black text-gray-900">Oraret e bllokuara</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 bg-red-50 text-red-600 rounded-full">
              {filteredBlocked.length}
            </span>
          </div>

          {/* Filter */}
          <select value={filterP} onChange={e => setFilterP(e.target.value)}
            className="w-full text-xs bg-gray-50 rounded-xl px-3 py-2 outline-none border border-gray-200 mb-3 font-semibold text-gray-700">
            <option value="all">Të gjithë psikologët</option>
            {experts.filter(e => AVAILABILITY_RULES[e.id]).map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          {filteredBlocked.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              <Lock size={24} className="mx-auto mb-2 text-gray-300" />
              Nuk ka orare të bllokuara.
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-0.5">
              {[...filteredBlocked].reverse().map(b => (
                <div key={b.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 group">
                  <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock size={12} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-900 truncate">
                      {expertName(b.psychologistId)}
                    </p>
                    <p className="text-[10px] text-gray-600 font-semibold capitalize">
                      {b.date ? formatShortDate(b.date) : '—'} · {b.startTime}–{b.endTime}
                    </p>
                    {b.reason && (
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{b.reason}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblock(b.id, `${b.startTime}–${b.endTime}`)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-200 hover:text-red-700 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                    title="Zhblloko"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Admin Appointments ───────────────────────────────────────────────────
export default function AdminAppointments() {
  const [tab,     setTab]     = useState('takimet')
  const [apts,    setApts]    = useState([])
  const [experts, setExperts] = useState([])
  const [expMap,  setExpMap]  = useState({})
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('all')
  const [psych,   setPsych]   = useState('all')
  const [modal,   setModal]   = useState(false)

  async function load() {
    const exps = loadExperts()
    setExperts(exps)
    const map = {}
    exps.forEach(e => { map[e.id] = e })
    setExpMap(map)
    const all = await fetchAllAppointments()
    setApts(all)
  }

  useEffect(() => { load() }, [])

  async function handleCancel(id) {
    if (window.confirm('Anulo këtë takim?')) { await svcCancel(id, 'admin'); load() }
  }

  const filtered = apts.filter(a => {
    if (status !== 'all' && a.status !== status) return false
    if (psych  !== 'all' && a.psychologistId !== psych) return false
    if (search) {
      const q = search.toLowerCase()
      return a.userName?.toLowerCase().includes(q) ||
             a.userEmail?.toLowerCase().includes(q) ||
             expMap[a.psychologistId]?.name?.toLowerCase().includes(q)
    }
    return true
  })

  const counts   = apts.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc }, {})
  const now      = new Date()
  const upcoming = apts.filter(a => a.status === 'booked' && new Date(`${a.date}T${a.startTime}`) > now).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-black text-gray-900">Takimet</h1>
          <p className="text-xs text-gray-400">{apts.length} total · {upcoming} të ardhshme</p>
        </div>
        <div className="flex gap-2">
          {tab === 'takimet' && (
            <button onClick={() => setModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              <Plus size={15} /> Takim manual
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1 w-fit">
        {[
          { id: 'takimet',  label: '📋 Takimet',          },
          { id: 'blloko',   label: '🔒 Blloko Orare',     },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
            style={tab === id
              ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white' }
              : { color: '#9ca3af' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Takimet ── */}
      {tab === 'takimet' && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Rezervuar',   count: counts.booked    || 0, color: '#1d4ed8', bg: '#eff6ff' },
              { label: 'Përfunduar',  count: counts.completed  || 0, color: '#166534', bg: '#f0fdf4' },
              { label: 'Anuluar',     count: counts.cancelled  || 0, color: '#dc2626', bg: '#fef2f2' },
              { label: 'Të ardhshme', count: upcoming,              color: '#7c3aed', bg: '#f5f3ff' },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className="rounded-2xl p-4" style={{ background: bg }}>
                <p className="text-2xl font-black" style={{ color }}>{count}</p>
                <p className="text-xs font-semibold text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
            <div className="flex-1 min-w-48 flex items-center gap-2 bg-gray-50 rounded-xl px-3 border border-gray-200">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kërko emrin, email..."
                className="flex-1 text-sm bg-transparent py-2 outline-none" />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="text-sm bg-gray-50 rounded-xl px-3 py-2 outline-none border border-gray-200 font-semibold text-gray-700">
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s === 'all' ? 'Të gjitha statuset' : STATUS_COLORS[s]?.label || s}</option>)}
            </select>
            <select value={psych} onChange={e => setPsych(e.target.value)}
              className="text-sm bg-gray-50 rounded-xl px-3 py-2 outline-none border border-gray-200 font-semibold text-gray-700">
              <option value="all">Të gjithë psikologët</option>
              {experts.filter(e => AVAILABILITY_RULES[e.id]).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <button onClick={load} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Klienti', 'Psikologu', 'Data & Ora', 'Statusi', 'Veprimet'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-500 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-sm text-gray-400">Nuk u gjetën takime.</td></tr>
                  ) : filtered.map(apt => {
                    const exp = expMap[apt.psychologistId]
                    const sc  = STATUS_COLORS[apt.status] || STATUS_COLORS.booked
                    return (
                      <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-gray-900">{apt.userName || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{apt.userEmail}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">{exp?.name || apt.psychologistId}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">{exp?.title}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-700 capitalize">{formatShortDate(apt.date)}</p>
                          <p className="text-xs text-gray-400">{apt.startTime} – {apt.endTime}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          {apt.status === 'booked' && (
                            <button onClick={() => handleCancel(apt.id)} className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors">
                              <XCircle size={13} /> Anulo
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── TAB: Blloko Orare ── */}
      {tab === 'blloko' && <BlockManager experts={experts} />}

      {modal && (
        <CreateModal experts={experts} onClose={() => setModal(false)} onCreated={() => { load(); setModal(false) }} />
      )}
    </div>
  )
}
