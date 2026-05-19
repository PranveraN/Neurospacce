import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, User, Plus, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import BackButton from '../components/BackButton'
import { useAuth } from '../contexts/AuthContext'
import { loadExperts } from '../data/expertsData'
import { formatDate, isUpcoming, STATUS_COLORS } from '../data/appointmentsData'
import {
  fetchUserAppointments,
  cancelAppointment as svcCancel,
} from '../lib/appointmentsService'

function AppointmentCard({ apt, expert, onCancel }) {
  const [open,    setOpen]    = useState(false)
  const [confirm, setConfirm] = useState(false)
  const upcoming = isUpcoming(apt.date, apt.startTime)
  const sc       = STATUS_COLORS[apt.status] || STATUS_COLORS.booked

  async function doCancel() {
    await svcCancel(apt.id, 'user')
    onCancel()
    setConfirm(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className="p-4 flex items-start gap-3 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        {/* Avatar */}
        {expert?.image
          ? <img src={expert.image} alt={expert.name} loading="lazy" className="w-11 h-11 rounded-xl object-cover shrink-0" />
          : <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-black text-lg shrink-0">
              {expert?.name?.[0] || '?'}
            </div>
        }

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-900 truncate">{expert?.name || apt.psychologistId}</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: sc.bg, color: sc.text }}>
              {sc.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">{formatDate(apt.date)}</p>
          <p className="text-xs font-semibold text-gray-700 mt-0.5 flex items-center gap-1">
            <Clock size={11} /> {apt.startTime} – {apt.endTime}
          </p>
        </div>

        {open ? <ChevronUp size={16} className="text-gray-400 shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-400 shrink-0 mt-1" />}
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
          {expert && (
            <p className="text-xs text-gray-400">{expert.title}</p>
          )}
          {apt.notes && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-gray-500 mb-1">Shënime</p>
              <p className="text-xs text-gray-700">{apt.notes}</p>
            </div>
          )}
          <p className="text-[10px] text-gray-400">
            Rezervuar: {new Date(apt.createdAt).toLocaleDateString('sq-AL')}
          </p>

          {/* Actions */}
          {upcoming && apt.status === 'booked' && (
            <div className="space-y-2 pt-1">
              {!confirm ? (
                <button
                  onClick={() => setConfirm(true)}
                  className="w-full py-2 rounded-xl text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle size={13} /> Anulo takimin
                </button>
              ) : (
                <div className="bg-red-50 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-bold text-red-700 text-center">A jeni i sigurt?</p>
                  <div className="flex gap-2">
                    <button onClick={doCancel} className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors">
                      Po, anulo
                    </button>
                    <button onClick={() => setConfirm(false)} className="flex-1 py-2 rounded-xl text-xs font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                      Jo, kthehu
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MyAppointments() {
  const { user }     = useAuth()
  const [apts,  setApts]  = useState([])
  const [tab,   setTab]   = useState('upcoming')
  const [exps,  setExps]  = useState({})

  async function load() {
    const userId = user?.id || null
    const expertMap = {}
    loadExperts().forEach(e => { expertMap[e.id] = e })
    setExps(expertMap)
    if (!userId) { setApts([]); return }
    const all = await fetchUserAppointments(userId)
    setApts(all)
  }

  useEffect(() => { load() }, [user])

  const now      = new Date()
  const upcoming = apts.filter(a => a.status !== 'cancelled' && new Date(`${a.date}T${a.startTime}`) > now)
  const past     = apts.filter(a => a.status === 'cancelled' || new Date(`${a.date}T${a.startTime}`) <= now)
  const list     = tab === 'upcoming' ? upcoming : past

  return (
    <div className="max-w-lg mx-auto space-y-5 pb-10">
      <BackButton fallback="/home" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Takimet e mia</h1>
          <p className="text-xs text-gray-400">Menaxhoni rezervimet tuaja</p>
        </div>
        <Link
          to="/book"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
        >
          <Plus size={14} /> Rezervo
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1">
        {[
          { id: 'upcoming', label: `Të ardhshme (${upcoming.length})` },
          { id: 'past',     label: `Të kaluara (${past.length})` },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
            style={tab === id
              ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white' }
              : { color: '#9ca3af' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {!user ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm mb-4">Kyçuni për të parë takimet tuaja.</p>
          <Link to="/auth" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
            Kyçu
          </Link>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-500 text-sm font-semibold mb-1">
            {tab === 'upcoming' ? 'Nuk keni takime të ardhshme.' : 'Nuk keni historik takimesh.'}
          </p>
          {tab === 'upcoming' && (
            <Link to="/book" className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              <Plus size={14} /> Rezervo tani
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(apt => (
            <AppointmentCard
              key={apt.id}
              apt={apt}
              expert={exps[apt.psychologistId]}
              onCancel={load}
            />
          ))}
        </div>
      )}
    </div>
  )
}
