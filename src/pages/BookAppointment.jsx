import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Calendar, Clock, CheckCircle,
  User, Mail, FileText, AlertTriangle, Sparkles, CalendarCheck,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePlan } from '../hooks/usePlan'
import { LimitReachedCard } from '../components/paywall/UpgradePrompt'
import { loadExperts } from '../data/expertsData'
import { formatDate, formatShortDate, AVAILABILITY_RULES } from '../data/appointmentsData'
import { createAppointment } from '../lib/appointmentsService'
import { sendBookingConfirmation } from '../lib/emailService'
import EditableText from '../components/EditableText'
import PublicLayout from '../components/layout/PublicLayout'
import { STEPS, StepBar, ExpertCard, MonthCalendar, SlotPicker } from '../components/booking/BookingSteps'
import { LeftSidebar, RightSidebar } from '../components/booking/BookingSidebars'
import { PsychPromoLanding } from '../components/booking/BookingPromo'

export default function BookAppointment({ bare = false }) {
  const { expertId }    = useParams()
  const { user }        = useAuth()
  const { canUse, consumeFeature, getUsage } = usePlan()
  const navigate        = useNavigate()

  const canBook = canUse('bookAppointment')
  const [monthCheck, setMonthCheck] = useState({ allowed: true, count: 0, limit: -1 })

  const [step,       setStep]       = useState(expertId ? 1 : 0)
  const [experts,    setExperts]    = useState([])
  const [expert,     setExpert]     = useState(null)
  const [date,       setDate]       = useState(null)
  const [slot,       setSlot]       = useState(null)
  const [notes,      setNotes]      = useState('')
  const [guestName,  setGuestName]  = useState(user?.username || '')
  const [guestEmail, setGuestEmail] = useState(user?.email || '')
  const [booking,    setBooking]    = useState(null)
  const [conflict,   setConflict]   = useState(null)
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    getUsage('appointment').then(u => {
      const limit = u.limit ?? -1
      setMonthCheck({ allowed: limit === -1 || u.count < limit, count: u.count || 0, limit })
    })
  }, [getUsage])

  useEffect(() => {
    const all = loadExperts()
    setExperts(all.filter(e => AVAILABILITY_RULES[e.id]))
    if (expertId) {
      const found = all.find(e => e.id === expertId)
      setExpert(found || null)
    }
  }, [expertId])

  useEffect(() => { setSlot(null) }, [date])
  useEffect(() => { setDate(null); setSlot(null) }, [expert])

  function handleSelectExpert(e) { setExpert(e); setStep(1) }
  function handleSelectDate(d)   { setDate(d);   setStep(2) }
  function handleSelectSlot(s)   { setSlot(s);   setStep(3) }

  function handleBack() {
    if (step === 0) {
      if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
      else navigate('/psikologu', { replace: true })
    } else if (step === 1) {
      if (!expertId) { setStep(0); setExpert(null) }
      else if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
      else navigate('/psikologu', { replace: true })
    } else if (step === 2) { setStep(1); setSlot(null) }
    else if (step === 3) { setStep(2) }
  }

  async function handleConfirm() {
    if (!expert || !date || !slot) return
    setLoading(true)
    setConflict(null)

    const usage = await consumeFeature('appointment')
    if (!usage.allowed) {
      setLoading(false)
      if (usage.reason === 'service_unavailable') {
        setConflict('Shërbimi është përkohësisht i padisponueshëm. Provo përsëri pas disa minutash.')
      } else {
        setMonthCheck({ allowed: false, count: monthCheck.count, limit: monthCheck.limit })
      }
      return
    }

    const result = await createAppointment({
      userId:         user?.id   || `guest_${Date.now()}`,
      userName:       user?.username || guestName,
      userEmail:      user?.email    || guestEmail,
      psychologistId: expert.id,
      date,
      startTime:      slot.startTime,
      endTime:        slot.endTime,
      notes,
    })

    setLoading(false)
    if (result.success) {
      setBooking(result.appointment)
      setStep(4)
      // Fire-and-forget — email failure must never block the booking flow
      sendBookingConfirmation({
        toName:           user?.username || guestName || 'Vizitor',
        toEmail:          user?.email    || guestEmail,
        psychologistName: expert.name,
        appointmentDate:  formatDate(date),
        appointmentTime:  `${slot.startTime} – ${slot.endTime}`,
      })
    } else {
      setConflict({ message: result.message, suggestions: [] })
    }
  }

  function W({ children }) { return bare ? children : <PublicLayout>{children}</PublicLayout> }

  // ── Success screen ───────────────────────────────────────────────────────────
  if (step === 4 && booking) {
    return (
      <W>
        <div className="min-h-[80vh] flex items-center justify-center p-6"
          style={{ background: 'linear-gradient(135deg,#faf5ff 0%,#ede9fe 50%,#fdf4ff 100%)' }}>
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-violet-100">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }} />
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' }}>
                <CheckCircle size={44} className="text-emerald-500" />
              </div>
            </div>
            <EditableText as="h1" className="text-2xl font-black text-gray-900 mb-2">Rezervimi u krye!</EditableText>
            <EditableText as="p" multiline className="text-gray-400 text-sm mb-8 leading-relaxed">Takimi juaj është konfirmuar. Një email konfirmimi është dërguar tek adresa juaj.</EditableText>

            <div className="rounded-2xl p-5 text-left space-y-4 mb-8"
              style={{ background: 'linear-gradient(135deg,#faf5ff,#f5f3ff)', border: '1px solid #ede9fe' }}>
              {[
                { icon: User,     bg: '#ede9fe', color: '#7c3aed', label: 'Psikologu', value: expert?.name },
                { icon: Calendar, bg: '#dbeafe', color: '#2563eb', label: 'Data',      value: <span className="capitalize">{formatDate(date)}</span> },
                { icon: Clock,    bg: '#d1fae5', color: '#059669', label: 'Ora',       value: `${slot?.startTime} – ${slot?.endTime}` },
              ].map(({ icon: Icon, bg, color, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                    <Icon size={17} style={{ color }} />
                  </div>
                  <div>
                    <EditableText as="p" className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</EditableText>
                    <p className="text-sm font-black text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link to="/appointments"
                className="flex-1 py-3 rounded-2xl text-white text-sm font-bold text-center transition-all hover:opacity-90 shadow-lg"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                <EditableText>Takimet e mia</EditableText>
              </Link>
              <Link to="/"
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 text-sm font-bold text-center transition-all hover:bg-gray-200">
                <EditableText>Faqja kryesore</EditableText>
              </Link>
            </div>
          </div>
        </div>
      </W>
    )
  }

  // ── Plan gate ────────────────────────────────────────────────────────────────
  if (!canBook) {
    return <W><PsychPromoLanding /></W>
  }

  // ── Monthly quota reached ────────────────────────────────────────────────────
  if (!monthCheck.allowed && step < 4) {
    return (
      <W>
        <div className="min-h-[70vh] flex items-center justify-center p-6"
          style={{ background: 'linear-gradient(135deg,#faf5ff,#ede9fe)' }}>
          <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl">
            <LimitReachedCard
              reason="bookAppointment"
              resetInfo={`Kufiri mujor: ${monthCheck.limit} takime. Riset muajin e ardhshëm.`}
            />
          </div>
        </div>
      </W>
    )
  }

  // ── Booking wizard ───────────────────────────────────────────────────────────
  return (
    <W>
      <div className="min-h-screen py-10 px-4"
        style={{ background: 'linear-gradient(160deg,#faf5ff 0%,#f5f3ff 30%,#ede9fe 70%,#fdf4ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[220px_1fr_220px] gap-6 items-start">

            <LeftSidebar />

            <div>
              {/* Header */}
              <div className="flex items-center gap-4 mb-7">
                <button onClick={handleBack}
                  className="w-10 h-10 rounded-2xl bg-white border border-violet-100 flex items-center justify-center shadow-sm hover:bg-violet-50 hover:border-violet-300 transition-all shrink-0">
                  <ArrowLeft size={17} className="text-violet-600" />
                </button>
                <div>
                  <EditableText as="h1" className="text-xl font-black text-gray-900 leading-tight">Rezervo takim</EditableText>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {expert
                      ? <><span className="text-violet-600 font-semibold">{expert.name}</span> · Hap {step + 1} nga {STEPS.length}</>
                      : <EditableText>Zgjidhni psikologun tuaj</EditableText>
                    }
                  </p>
                </div>
              </div>

              <StepBar current={step} />

              {/* Step 0: Select expert */}
              {step === 0 && (
                <div className="space-y-3">
                  <EditableText as="p" className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Psikologët e disponueshëm</EditableText>
                  {experts.map(e => (
                    <ExpertCard key={e.id} expert={e} selected={expert?.id === e.id} onClick={() => handleSelectExpert(e)} />
                  ))}
                </div>
              )}

              {/* Step 1: Select date */}
              {step === 1 && expert && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '1.5px solid #ddd6fe' }}>
                    {expert.image
                      ? <img src={expert.image} alt={expert.name} loading="lazy" className="w-11 h-11 rounded-xl object-cover object-top shrink-0 shadow-sm" />
                      : <div className="w-11 h-11 rounded-xl bg-violet-200 flex items-center justify-center text-violet-700 font-black text-lg shrink-0">{expert.name[0]}</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-violet-900 truncate">{expert.name}</p>
                      <p className="text-xs text-violet-500 truncate">{expert.title}</p>
                    </div>
                    <button onClick={() => { setStep(0); setExpert(null) }}
                      className="text-[10px] font-bold text-violet-400 hover:text-violet-700 transition-colors px-2 py-1 rounded-lg hover:bg-violet-100 shrink-0">
                      Ndrysho
                    </button>
                  </div>

                  <MonthCalendar psychologistId={expert.id} selectedDate={date} onSelect={handleSelectDate} />

                  {date && (
                    <button onClick={() => setStep(2)}
                      className="w-full py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                      <EditableText>Vazhdo</EditableText> <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: Select time */}
              {step === 2 && expert && date && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '1.5px solid #ddd6fe' }}>
                    <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                      <Calendar size={15} className="text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wide">Data e zgjedhur</p>
                      <p className="text-sm font-black text-violet-900 capitalize">{formatDate(date)}</p>
                    </div>
                    <button onClick={() => setStep(1)}
                      className="text-[10px] font-bold text-violet-400 hover:text-violet-700 transition-colors px-2 py-1 rounded-lg hover:bg-violet-100 shrink-0">
                      Ndrysho
                    </button>
                  </div>

                  <SlotPicker psychologistId={expert.id} date={date} selected={slot} onSelect={handleSelectSlot} />

                  {slot && (
                    <button onClick={() => setStep(3)}
                      className="w-full py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                      <EditableText>Vazhdo</EditableText> <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && expert && date && slot && (
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden border border-violet-100 shadow-lg">
                    <div className="relative flex items-center gap-4 px-5 py-5"
                      style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed,#a855f7)' }}>
                      <div className="absolute inset-0 opacity-20"
                        style={{ background: 'radial-gradient(circle at 80% 20%,#ec4899,transparent 60%)' }} />
                      {expert.image
                        ? <img src={expert.image} alt={expert.name} loading="lazy"
                            className="relative w-14 h-14 rounded-2xl object-cover object-top border-2 border-white/30 shrink-0" />
                        : <div className="relative w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-xl shrink-0">
                            {expert.name[0]}
                          </div>
                      }
                      <div className="relative">
                        <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest mb-0.5">Takimi juaj me</p>
                        <p className="text-white font-black text-lg leading-tight">{expert.name}</p>
                        <p className="text-violet-200 text-xs mt-0.5">{expert.title}</p>
                      </div>
                    </div>

                    <div className="bg-white divide-y divide-violet-50">
                      {[
                        { icon: Calendar, bg: '#ede9fe', color: '#7c3aed', label: 'Data', value: <span className="capitalize">{formatDate(date)}</span> },
                        { icon: Clock,    bg: '#d1fae5', color: '#059669', label: 'Ora',  value: `${slot.startTime} – ${slot.endTime} (15 min)` },
                      ].map(({ icon: Icon, bg, color, label, value }) => (
                        <div key={label} className="flex items-center gap-4 px-5 py-4">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                            <Icon size={16} style={{ color }} />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                            <p className="text-sm font-black text-gray-900">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!user && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
                      <EditableText as="p" className="text-xs font-black text-gray-700 uppercase tracking-widest">Informacioni juaj</EditableText>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Emri</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                          <input value={guestName} onChange={e => setGuestName(e.target.value)}
                            className="w-full text-sm bg-gray-50 rounded-2xl pl-9 pr-4 py-3 outline-none border border-gray-200 focus:border-violet-300 focus:bg-white focus:shadow-sm transition-all"
                            placeholder="Emri juaj i plotë" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                          <input value={guestEmail} onChange={e => setGuestEmail(e.target.value)} type="email"
                            className="w-full text-sm bg-gray-50 rounded-2xl pl-9 pr-4 py-3 outline-none border border-gray-200 focus:border-violet-300 focus:bg-white focus:shadow-sm transition-all"
                            placeholder="emaili@juaj.com" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-2">
                      Shënime <span className="font-normal normal-case text-gray-300">(opsionale)</span>
                    </label>
                    <div className="relative">
                      <FileText size={14} className="absolute left-3.5 top-3.5 text-gray-300" />
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Çfarë dëshironi të diskutoni në seancë?"
                        className="w-full text-sm bg-gray-50 rounded-2xl pl-9 pr-4 py-3 outline-none border border-gray-200 focus:border-violet-300 focus:bg-white focus:shadow-sm transition-all resize-none"
                      />
                    </div>
                  </div>

                  {conflict && (
                    <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                      <div className="flex items-start gap-2 mb-3">
                        <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-red-700">{conflict.message}</p>
                      </div>
                      {conflict.suggestions?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1">
                            <Sparkles size={12} /> <EditableText>Oraret e tjera të lira:</EditableText>
                          </p>
                          <div className="space-y-2">
                            {conflict.suggestions.map((s, i) => (
                              <button key={i}
                                onClick={() => { setDate(s.date); setSlot(s.slot); setConflict(null) }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-red-100 text-xs font-semibold text-gray-700 hover:border-violet-300 transition-colors">
                                <span className="capitalize">{formatShortDate(s.date)}</span>
                                <span className="text-violet-600 font-bold">{s.slot.startTime} – {s.slot.endTime}</span>
                                <ArrowRight size={13} className="text-gray-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleConfirm}
                    disabled={loading || (!user && (!guestName.trim() || !guestEmail.trim()))}
                    className="w-full py-4 rounded-2xl text-white text-sm font-black flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: loading ? 'none' : '0 8px 24px rgba(124,58,237,0.35)' }}>
                    <CalendarCheck size={18} />
                    {loading ? <EditableText>Duke rezervuar...</EditableText> : <EditableText>Konfirmo rezervimin</EditableText>}
                  </button>

                  <EditableText as="p" multiline className="text-center text-[11px] text-gray-400 leading-relaxed">
                    Duke konfirmuar, pranoni kushtet e platformës. Anulimi i lirë deri 24h para takimit.
                  </EditableText>
                </div>
              )}
            </div>

            <RightSidebar experts={experts} />

          </div>
        </div>
      </div>
    </W>
  )
}
