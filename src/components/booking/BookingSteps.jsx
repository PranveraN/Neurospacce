import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react'
import {
  getAvailableDatesInMonth, getBlockedTimes, generateSlots, AVAILABILITY_RULES,
} from '../../data/appointmentsData'
import { fetchDayBookings } from '../../lib/appointmentsService'

export const STEPS = ['Psikologu', 'Data', 'Ora', 'Konfirmo']

const DAYS_SHORT  = ['Hë', 'Ma', 'Më', 'En', 'Pr', 'Sh', 'Di']
const MONTHS_SQ   = ['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor']

const SLOT_STATUS_STYLE = {
  available: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', hover: true  },
  booked:    { bg: '#f3f4f6', text: '#9ca3af', border: '#e5e7eb', hover: false },
  blocked:   { bg: '#fef2f2', text: '#fca5a5', border: '#fee2e2', hover: false },
  past:      { bg: '#f9fafb', text: '#d1d5db', border: '#f3f4f6', hover: false },
}

// ── Step indicator ────────────────────────────────────────────────────────────
export function StepBar({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-sm"
              style={
                i < current
                  ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: 'white', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }
                  : i === current
                  ? { background: 'white', border: '2px solid #7c3aed', color: '#7c3aed', boxShadow: '0 0 0 4px rgba(124,58,237,0.10)' }
                  : { background: '#f8fafc', border: '2px solid #e2e8f0', color: '#cbd5e1' }
              }
            >
              {i < current ? <CheckCircle size={15} strokeWidth={2.5} /> : <span className="text-[11px] font-black">{i + 1}</span>}
            </div>
            <span className="text-[10px] mt-1.5 font-bold tracking-wide"
              style={{ color: i < current ? '#7c3aed' : i === current ? '#4c1d95' : '#94a3b8' }}>
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all"
              style={{ background: i < current ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : '#e2e8f0' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Expert card ───────────────────────────────────────────────────────────────
export function ExpertCard({ expert, selected, onClick }) {
  const hasRules = !!AVAILABILITY_RULES[expert.id]
  return (
    <button
      onClick={onClick}
      disabled={!hasRules}
      className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 flex items-center gap-0 group"
      style={{
        border: selected ? '2px solid #7c3aed' : '2px solid #f1f5f9',
        background: selected ? '#faf5ff' : 'white',
        opacity: hasRules ? 1 : 0.45,
        boxShadow: selected ? '0 0 0 4px rgba(124,58,237,0.10), 0 4px 16px rgba(124,58,237,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div className="w-20 h-20 shrink-0 overflow-hidden">
        {expert.image
          ? <img src={expert.image} alt={expert.name} loading="lazy"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full bg-violet-100 flex items-center justify-center text-violet-600 font-black text-2xl">
              {expert.name[0]}
            </div>
        }
      </div>
      <div className="flex-1 min-w-0 px-4 py-3">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-black text-slate-800 truncate">{expert.name}</p>
          {expert.status === 'online' && <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />}
        </div>
        <p className="text-xs text-violet-600 font-semibold truncate mb-1.5">{expert.title}</p>
        <div className="flex flex-wrap gap-1">
          {expert.specialties?.slice(0, 2).map(s => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">{s}</span>
          ))}
          {!hasRules && <span className="text-[10px] text-slate-400 italic">Pa orare aktive</span>}
        </div>
      </div>
      <div className="pr-4 shrink-0">
        {selected
          ? <div className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              <CheckCircle size={14} color="white" strokeWidth={2.5} />
            </div>
          : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
        }
      </div>
    </button>
  )
}

// ── Month calendar ────────────────────────────────────────────────────────────
export function MonthCalendar({ psychologistId, selectedDate, onSelect }) {
  const today = new Date(); today.setHours(0,0,0,0)
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const available = useMemo(() => {
    const blocked = getBlockedTimes()
    return getAvailableDatesInMonth(psychologistId, year, month, [], blocked)
  }, [psychologistId, year, month])

  const firstDay  = new Date(year, month, 1).getDay()
  const offset    = firstDay === 0 ? 6 : firstDay - 1
  const daysCount = new Date(year, month + 1, 0).getDate()

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }
  function makeDate(d) {
    return `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  }

  return (
    <div className="bg-white rounded-3xl border border-violet-100 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4"
        style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed)' }}>
        <button onClick={prevMonth} aria-label="Muaji i mëparshëm"
          className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
          <ChevronLeft size={15} />
        </button>
        <p className="text-sm font-black text-white tracking-wide">{MONTHS_SQ[month]} {year}</p>
        <button onClick={nextMonth} aria-label="Muaji i ardhshëm"
          className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {DAYS_SHORT.map(d => (
            <div key={d} className="text-center text-[10px] font-black text-violet-300 py-1.5 uppercase tracking-wider">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array(offset).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {Array(daysCount).fill(null).map((_, i) => {
            const d       = i + 1
            const dateStr = makeDate(d)
            const dayDate = new Date(`${dateStr}T00:00:00`)
            const isPast  = dayDate < today
            const isAvail = available.has(dateStr)
            const isSel   = selectedDate === dateStr
            const isToday = dateStr === today.toISOString().split('T')[0]

            return (
              <button
                key={d}
                onClick={() => isAvail && onSelect(dateStr)}
                disabled={!isAvail || isPast}
                className="relative aspect-square rounded-xl flex items-center justify-center transition-all duration-150 text-xs font-bold"
                style={
                  isSel
                    ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }
                    : isAvail && !isPast
                    ? { background: '#f5f3ff', color: '#6d28d9', cursor: 'pointer', border: '1.5px solid #ede9fe' }
                    : isToday
                    ? { background: '#fdf4ff', color: '#a78bfa', border: '1.5px solid #e9d5ff' }
                    : { color: '#e2e8f0', cursor: 'default' }
                }
              >
                {d}
                {isToday && !isSel && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-violet-50">
          {[
            { bg: '#f5f3ff', border: '#ede9fe', color: '#7c3aed', label: 'E lirë' },
            { bg: 'linear-gradient(135deg,#7c3aed,#ec4899)', border: 'transparent', color: 'white', label: 'Zgjedhur', gradient: true },
            { bg: '#f8fafc', border: '#f1f5f9', color: '#cbd5e1', label: 'Joaktive' },
          ].map(({ bg, border, color, label, gradient }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg shrink-0 flex items-center justify-center"
                style={{ background: bg, border: gradient ? 'none' : `1.5px solid ${border}` }} />
              <span className="text-[10px] text-gray-400 font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Time slot picker ──────────────────────────────────────────────────────────
export function SlotPicker({ psychologistId, date, selected, onSelect }) {
  const [slots,   setSlots]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const blocked = getBlockedTimes()

    const fallback = setTimeout(() => {
      if (cancelled) return
      setSlots(generateSlots(psychologistId, date, [], blocked))
      setLoading(false)
    }, 5000)

    fetchDayBookings(psychologistId, date)
      .then(dayBookings => {
        clearTimeout(fallback)
        if (cancelled) return
        setSlots(generateSlots(psychologistId, date, dayBookings, blocked))
        setLoading(false)
      })
      .catch(() => {
        clearTimeout(fallback)
        if (cancelled) return
        setSlots(generateSlots(psychologistId, date, [], blocked))
        setLoading(false)
      })
    return () => { cancelled = true; clearTimeout(fallback) }
  }, [psychologistId, date])

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-violet-100 shadow-lg p-8 text-center">
        <div className="w-10 h-10 rounded-2xl mx-auto mb-3 flex items-center justify-center animate-pulse"
          style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}>
          <Clock size={18} className="text-violet-500" />
        </div>
        <p className="text-gray-400 text-sm font-semibold">Duke ngarkuar oraret...</p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-3xl mb-3">📅</div>
        <p className="text-gray-500 text-sm font-semibold">Nuk ka orare të disponueshme</p>
        <p className="text-gray-400 text-xs mt-1">Provo një ditë tjetër.</p>
      </div>
    )
  }

  const availableSlots   = slots.filter(s => s.status === 'available')
  const unavailableSlots = slots.filter(s => s.status !== 'available')

  return (
    <div className="bg-white rounded-3xl border border-violet-100 shadow-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-violet-50">
        <p className="text-xs font-black text-gray-700 uppercase tracking-widest">Zgjidhni orën</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{availableSlots.length} orare të disponueshme</p>
      </div>

      <div className="p-4 space-y-4">
        {availableSlots.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableSlots.map(slot => {
              const isSel = selected?.startTime === slot.startTime
              return (
                <button
                  key={slot.startTime}
                  onClick={() => onSelect(slot)}
                  className="rounded-2xl py-3 px-2 text-center text-xs font-bold border-2 transition-all hover:scale-105"
                  style={
                    isSel
                      ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', borderColor: 'transparent', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }
                      : { background: SLOT_STATUS_STYLE.available.bg, color: SLOT_STATUS_STYLE.available.text, borderColor: SLOT_STATUS_STYLE.available.border }
                  }
                >
                  {slot.startTime}
                </button>
              )
            })}
          </div>
        )}

        {unavailableSlots.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Joaktive</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {unavailableSlots.map(slot => {
                const style = SLOT_STATUS_STYLE[slot.status]
                return (
                  <div key={slot.startTime}
                    className="rounded-2xl py-3 px-2 text-center text-xs font-bold border-2"
                    style={{ background: style.bg, color: style.text, borderColor: style.border, opacity: 0.6 }}>
                    <span className="text-[9px] block mb-0.5">
                      {slot.status === 'booked' ? '🔒' : slot.status === 'blocked' ? '🚫' : '⏰'}
                    </span>
                    {slot.startTime}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
