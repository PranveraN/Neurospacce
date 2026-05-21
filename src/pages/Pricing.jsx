import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Check, ArrowLeft, ArrowRight, Sparkles, Heart, Shield,
  MessageCircle, Calendar, Star, Users, Clock, Zap,
  ChevronDown, Lock, Brain, X, Bell, Eye, EyeOff,
} from 'lucide-react'
import { useEffect } from 'react'
import { PLANS } from '../data/plansData'
import { useAuth } from '../contexts/AuthContext'
import { usePlan } from '../hooks/usePlan'
import { useEditMode } from '../contexts/EditModeContext'
import EditableText from '../components/EditableText'

// ─── Reusable check row ────────────────────────────────────────────
function Feature({ text, sub, highlight }) {
  return (
    <li className="flex items-start gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        highlight ? 'bg-violet-600' : 'bg-violet-100'
      }`}>
        <Check size={11} color={highlight ? 'white' : '#7c3aed'} strokeWidth={3} />
      </div>
      <div>
        <span className="text-sm text-slate-700">{text}</span>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </li>
  )
}

// ─── FAQ Accordion ─────────────────────────────────────────────────
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-200 transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-800">{q}</span>
        <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <p className="text-sm text-slate-500 mt-3 leading-relaxed border-t border-slate-100 pt-3">{a}</p>
      )}
    </button>
  )
}

// ─── Psychologist card preview ─────────────────────────────────────
function PsychCard({ name, spec, price, rating, avatar, online }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-200 to-pink-200 flex items-center justify-center text-2xl">
          {avatar}
        </div>
        {online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <EditableText as="p" className="text-sm font-bold text-slate-800 truncate">{name}</EditableText>
        <EditableText as="p" className="text-xs text-slate-400 truncate">{spec}</EditableText>
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <EditableText as="span" className="text-xs font-bold text-slate-600">{String(rating)}</EditableText>
        </div>
      </div>
      <div className="text-right">
        <EditableText as="p" className="text-sm font-black text-slate-900">€{price}</EditableText>
        <p className="text-xs text-slate-400">/ seancë</p>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────
export default function Pricing() {
  const { user }   = useAuth()
  const { planId } = usePlan()
  const navigate   = useNavigate()
  const [annual, setAnnual] = useState(false)
  const freePlan = PLANS.free
  const proPlan  = PLANS.pro

  const proPrice  = annual ? (proPlan.price * 10).toFixed(0) : proPlan.price.toFixed(2)
  const period    = annual ? 'vit' : 'muaj'

  const { editMode } = useEditMode()
  const [comingSoon, setComingSoon] = useState(false)

  const [showPsychSection, setShowPsychSection] = useState(() => {
    try { return localStorage.getItem('ns_show_psych_section') !== 'false' } catch { return true }
  })
  useEffect(() => {
    try { localStorage.setItem('ns_show_psych_section', String(showPsychSection)) } catch {}
  }, [showPsychSection])
  const [applyOpen,  setApplyOpen]  = useState(false)
  const [applyStep,  setApplyStep]  = useState('form') // 'form' | 'success'
  const [applyForm,  setApplyForm]  = useState({
    name: '', email: '', license: '', specialties: '', experience: '', message: '',
  })
  const [applyErrors, setApplyErrors] = useState({})

  function setField(k, v) { setApplyForm(f => ({ ...f, [k]: v })); setApplyErrors(e => ({ ...e, [k]: '' })) }

  function openApply() { setApplyStep('form'); setApplyForm({ name:'',email:'',license:'',specialties:'',experience:'',message:'' }); setApplyErrors({}); setApplyOpen(true) }

  function submitApply(e) {
    e.preventDefault()
    const errs = {}
    if (!applyForm.name.trim())       errs.name       = 'Kërkohet emri'
    if (!applyForm.email.trim())      errs.email      = 'Kërkohet emaili'
    if (!/\S+@\S+\.\S+/.test(applyForm.email)) errs.email = 'Email i pavlefshëm'
    if (!applyForm.license.trim())    errs.license    = 'Kërkohet numri i licensës'
    if (!applyForm.specialties.trim()) errs.specialties = 'Kërkohen specializimet'
    if (Object.keys(errs).length) { setApplyErrors(errs); return }

    const subject = encodeURIComponent(`Aplikim Psikolog Partner — ${applyForm.name}`)
    const body = encodeURIComponent(
      `APLIKIM I RI — PSIKOLOG PARTNER\n` +
      `================================\n\n` +
      `Emri i plotë:     ${applyForm.name}\n` +
      `Email:            ${applyForm.email}\n` +
      `Nr. Licensës:     ${applyForm.license}\n` +
      `Specializimet:    ${applyForm.specialties}\n` +
      `Vite eksperiencë: ${applyForm.experience || 'Jo specifiku'}\n\n` +
      `Mesazh motivues:\n${applyForm.message || '(pa mesazh)'}\n\n` +
      `--- Dërguar nga forma e aplikimit NeuroSphera ---`
    )
    window.location.href = `mailto:info@myneurosphera.com?subject=${subject}&body=${body}`
    setApplyStep('success')
  }

  function handleSelect(id) {
    if (id === planId) return
    if (!user || user.anonymous) { navigate('/auth'); return }
    setComingSoon(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* ── Coming Soon Modal ── */}
      {comingSoon && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={() => setComingSoon(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl"
            style={{ background: 'linear-gradient(160deg,#0f062a,#1a0a3d,#0e0520)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setComingSoon(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <X size={15} color="rgba(255,255,255,0.6)" />
            </button>

            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
            >
              <Bell size={28} color="white" />
            </div>

            <h3 className="text-xl font-black text-white mb-2">Pagesa vjen së shpejti</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Jemi duke integruar sistemin e pagesave. Do të njoftoheni sapo Pro të jetë i disponueshëm.
            </p>

            <div
              className="rounded-2xl p-4 mb-6 text-left"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <p className="text-xs font-bold text-violet-300 mb-2">Ndërkohë, provoni falas:</p>
              <ul className="space-y-1.5">
                {['Journal & gjurmim humori', 'Asistent AI (10 msg/ditë)', 'Teste psikologjike', '1 pyetje falas te psikologu'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={11} color="#a78bfa" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setComingSoon(false)}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
            >
              Kuptova. Vazhdo falas
            </button>
          </div>
        </div>
      )}

      {/* ── Apply Modal ── */}
      {applyOpen && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)' }}
          onClick={() => setApplyOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            style={{ background: 'linear-gradient(160deg,#0f062a,#1a0a3d,#0e0520)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setApplyOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <X size={15} color="rgba(255,255,255,0.6)" />
            </button>

            {applyStep === 'success' ? (
              /* ── Success state ── */
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>
                  <Check size={28} color="white" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Aplikimi u dërgua!</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Klienti i emailit u hap me aplikimin tënd gati. Konfirmo dërgimin dhe do të kontaktohesh brenda <span className="text-violet-300 font-bold">3–5 ditëve pune</span>.
                </p>
                <button
                  onClick={() => setApplyOpen(false)}
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}
                >
                  Mbyll
                </button>
              </div>
            ) : (
              /* ── Form state ── */
              <form onSubmit={submitApply} className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                    <Brain size={22} color="white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white leading-tight">Apliko si Psikolog Partner</h3>
                    <p className="text-xs text-slate-400">Shqyrtojmë çdo aplikim me kujdes</p>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  {/* Name + Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Emri i plotë *</label>
                      <input
                        value={applyForm.name}
                        onChange={e => setField('name', e.target.value)}
                        placeholder="Dr. Emri Mbiemri"
                        className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: applyErrors.name ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.10)' }}
                      />
                      {applyErrors.name && <p className="text-red-400 text-[10px] mt-1">{applyErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={applyForm.email}
                        onChange={e => setField('email', e.target.value)}
                        placeholder="email@tuaj.com"
                        className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: applyErrors.email ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.10)' }}
                      />
                      {applyErrors.email && <p className="text-red-400 text-[10px] mt-1">{applyErrors.email}</p>}
                    </div>
                  </div>

                  {/* License */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Nr. i Licensës Profesionale *</label>
                    <input
                      value={applyForm.license}
                      onChange={e => setField('license', e.target.value)}
                      placeholder="p.sh. ODP-2019-04521"
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: applyErrors.license ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.10)' }}
                    />
                    {applyErrors.license && <p className="text-red-400 text-[10px] mt-1">{applyErrors.license}</p>}
                  </div>

                  {/* Specialties + Experience */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Specializimet *</label>
                      <input
                        value={applyForm.specialties}
                        onChange={e => setField('specialties', e.target.value)}
                        placeholder="p.sh. Ankth, CBT, Trauma"
                        className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: applyErrors.specialties ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.10)' }}
                      />
                      {applyErrors.specialties && <p className="text-red-400 text-[10px] mt-1">{applyErrors.specialties}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Vite eksperiencë</label>
                      <select
                        value={applyForm.experience}
                        onChange={e => setField('experience', e.target.value)}
                        className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500 transition-all appearance-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                      >
                        <option value="" style={{ background: '#1a0a3d' }}>Zgjidhni</option>
                        {['1–3 vjet', '3–5 vjet', '5–10 vjet', '10+ vjet'].map(o => (
                          <option key={o} value={o} style={{ background: '#1a0a3d' }}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Mesazh motivues <span className="font-normal opacity-60">(opsional)</span></label>
                    <textarea
                      value={applyForm.message}
                      onChange={e => setField('message', e.target.value)}
                      placeholder="Pse dëshiron të bashkohesh me NeuroSphera? Çfarë mund të sjellësh..."
                      rows={3}
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                    />
                  </div>
                </div>

                {/* Info note */}
                <div className="mt-4 rounded-xl px-4 py-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.20)' }}>
                  <Shield size={13} className="text-violet-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Aplikimi dërgohet me email. Pas klikimit, konfirmo dërgimin në klientin tënd të emailit. Do të kontaktohesh brenda <strong className="text-violet-300">3–5 ditëve pune</strong>.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full mt-5 py-4 rounded-2xl font-black text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-violet-900/40"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}
                >
                  Dërgo Aplikimin
                </button>
              </form>
            )}
          </div>
        </div>
      )}


      {/* ── Back ── */}
      <div className="max-w-6xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-semibold transition-colors">
          <ArrowLeft size={15} /> Kthehu
        </Link>
      </div>

      {/* ── HERO ── */}
      <div className="max-w-3xl mx-auto px-5 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-2 mb-6">
          <Heart size={13} className="text-violet-500" />
          <EditableText as="span" className="text-sm font-bold text-violet-600">NeuroSphera: Aksesibël dhe humane</EditableText>
        </div>
        <EditableText as="h1" className="text-4xl md:text-5xl font-black text-slate-900 mb-5 leading-tight">
          Mbështetja mendore nuk<br />duhet të jetë luks
        </EditableText>
        <EditableText as="p" multiline className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          Të gjitha vegëlat bazë të mirëqenies janë falas, gjithmonë. Premium vlerë vjen nga lidhja me profesionistë njerëzorë.
        </EditableText>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          {[
            { icon: '🔒', text: 'Privatësi e plotë' },
            { icon: '✅', text: 'Psikologë të verifikuar' },
            { icon: '🔄', text: 'Anulo kurdo' },
            { icon: '💚', text: 'Dizajnuar me empati' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PLAN CARDS ── */}
      <div className="max-w-5xl mx-auto px-5 pb-16">

        {/* Annual toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-bold ${!annual ? 'text-slate-800' : 'text-slate-400'}`}>Mujor</span>
          <button
            onClick={() => setAnnual((a) => !a)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${annual ? 'bg-violet-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${annual ? 'left-7' : 'left-1'}`} />
          </button>
          <span className={`text-sm font-bold ${annual ? 'text-slate-800' : 'text-slate-400'}`}>
            Vjetor <span className="text-green-600 text-xs font-black ml-1">−17%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">

          {/* ── FREE CARD ── */}
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-8 flex flex-col">
            <div className="mb-6">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Shield size={20} className="text-slate-500" />
              </div>
              <EditableText as="h3" className="text-2xl font-black text-slate-900 mb-1">Falas</EditableText>
              <EditableText as="p" className="text-sm text-slate-500">{freePlan.tagline}</EditableText>
            </div>

            <div className="mb-7">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900">€0</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Pa karta krediti. Pa kushte.</p>
            </div>

            <ul className="space-y-3 flex-1 mb-7">
              <Feature text="Gjurmim humori çdo ditë" />
              <Feature text="Journal pa limit" />
              <Feature text="Asistent AI (10 msg/ditë)" />
              <Feature text="Teknika mindfulness & frymëmarrje" />
              <Feature text="Komunitet & artikuj" />
              <Feature text="Të gjitha testet psikologjike" sub="Big Five, Mood, Kognitiv, PersonaMatrix" />
              <Feature text="1 pyetje falas te psikologu" sub="Pas regjistrimit, njëherë" />
              <Feature text="Burime emergjente 24/7" />
            </ul>

            <button
              onClick={() => planId === 'free' ? null : navigate('/auth')}
              disabled={planId === 'free'}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                planId === 'free'
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-slate-900 text-white hover:bg-slate-700'
              }`}
            >
              {planId === 'free' ? '✓ Plani aktual' : 'Regjistrohu falas'}
            </button>
          </div>

          {/* ── PRO CARD ── */}
          <div className="relative rounded-3xl border-2 border-violet-500 bg-white p-8 flex flex-col shadow-2xl shadow-violet-500/15">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              ⭐ Rekomanduar
            </div>

            <div className="mb-6">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                <Zap size={20} color="white" />
              </div>
              <EditableText as="h3" className="text-2xl font-black text-slate-900 mb-1">Pro</EditableText>
              <EditableText as="p" className="text-sm text-slate-500">{proPlan.tagline}</EditableText>
            </div>

            <div className="mb-7">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900">€{proPrice}</span>
                <span className="text-slate-400 text-sm mb-1.5">/{period}</span>
              </div>
              {annual && (
                <p className="text-xs text-green-600 font-bold mt-1">Kurseni €24/vit, 2 muaj falas</p>
              )}
              <p className="text-xs text-slate-400 mt-1">Pa kontratë. Anulo kurdo.</p>
            </div>

            <ul className="space-y-3 flex-1 mb-7">
              <Feature text="Gjithçka nga Free, pa limit" />
              <Feature text="15 pyetje private/muaj" sub="Deri 3/ditë · Te psikologë të verifikuar, brenda 24h" highlight />
              <Feature text="2 sesione të shkurtra online (15 min)/muaj" sub="Kontroll emocional me profesionist" highlight />
              <Feature text="Radhë prioritare me përgjigje brenda 24h" highlight />
              <Feature text="Rezervim i plotë + radhë prioritare" highlight />
              <Feature text="PersonaMatrix: raport premium 10 seksione" highlight />
              <Feature text="Evolution Dashboard + AI Coach ditor" highlight />
              <Feature text="Analitikë e avancuar & raporte javore" />
              <Feature text="Eksportim të dhënash" />
            </ul>

            <button
              onClick={() => handleSelect('pro')}
              disabled={planId === 'pro'}
              className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                planId === 'pro'
                  ? 'bg-violet-100 text-violet-400 cursor-default hover:scale-100'
                  : 'text-white'
              }`}
              style={planId !== 'pro' ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' } : {}}
            >
              {planId === 'pro' ? '✓ Plani aktual' : 'Fillo Pro për €9.99/muaj'}
            </button>
          </div>
        </div>

        {/* Mini note */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Sesionet e plota (45–60 min) me psikolog janë gjithmonë të disponueshme veçmas →{' '}
          <a href="#sessions" className="text-violet-500 font-semibold hover:text-violet-700 transition-colors">
            Shiko çmimet
          </a>
        </p>
      </div>

      {/* ── PRIVATE QUESTIONS SYSTEM ── */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border-y border-violet-100 py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <MessageCircle size={14} />
              <EditableText>Pyetjet Private te Psikologu</EditableText>
            </div>
            <EditableText as="h2" className="text-3xl font-black text-slate-900 mb-4">
              Flet me një profesionist real
            </EditableText>
            <EditableText as="p" multiline className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
              Jo chatbot. Jo FAQ. Psikologë të verifikuar me licensë, që i përgjigjen pyetjeve tuaja private brenda 24 orësh. I ngrohtë, konfidencial, dhe njerëzor.
            </EditableText>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: '🆓',
                label: 'Pyetja e Parë Falas',
                desc: 'Çdo përdorues i ri merr 1 pyetje falas te psikologu. Pa kartë krediti, pa kushte.',
                badge: 'Free',
                badgeColor: '#059669',
              },
              {
                icon: '💬',
                label: 'Pyetje Individuale',
                desc: 'Pas pyetjes falas, mund të blesh pyetje individuale. Secila pyetje trajtohet nga psikologë të verifikuar.',
                badge: '€0.99 / pyetje',
                badgeColor: '#0891b2',
              },
              {
                icon: '⭐',
                label: 'Me Pro: 15 Pyetje/Muaj',
                desc: 'Me planin Pro, merr 15 pyetje private çdo muaj (deri 3/ditë), me radhë prioritare dhe garanci 24h.',
                badge: 'Pro',
                badgeColor: '#7c3aed',
              },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-base font-black text-slate-800">{item.label}</h3>
                  <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full"
                    style={{ background: item.badgeColor }}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm">
            <EditableText as="h3" className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <span>Si funksionon</span>
              <span className="text-sm font-normal text-slate-400">· 3 hapa të thjeshtë</span>
            </EditableText>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Shkruaj pyetjen', desc: 'Shpreh shqetësimin tënd me fjalët e tua. Pa formularë të ndërlikuar, thjesht fol.' },
                { step: '02', title: 'Psikologu e lexon', desc: 'Psikologu i caktuar e lexon me kujdes dhe përgatit një përgjigje të personalizuar.' },
                { step: '03', title: 'Merr brenda 24h', desc: 'Një përgjigje e vërtetë, e menduar, nga një profesionist i licencuar. Jo gjenerike.' },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="text-3xl font-black text-violet-200 shrink-0">{s.step}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{s.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL THERAPY SESSIONS ── */}
      <div id="sessions" className="py-16 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Calendar size={14} />
              <EditableText>Sesione të Plota Veçmas</EditableText>
            </div>
            <EditableText as="h2" className="text-3xl font-black text-slate-900 mb-4">
              Terapi individuale me psikolog
            </EditableText>
            <EditableText as="p" multiline className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
              Sesionet e plota (45–60 min) janë gjithmonë të disponueshme si pagesë e veçantë. Asnjë plan nuk i përfshin si të pakufizuara, sepse koha e psikologut ka vlerë reale.
            </EditableText>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* What's included */}
            <div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-7 mb-5">
                <Clock size={24} className="text-emerald-600 mb-4" />
                <EditableText as="h3" className="text-xl font-black text-slate-900 mb-4">Çfarë përfshin seanca</EditableText>
                <ul className="space-y-3">
                  {[
                    '45–60 minuta sesion individual',
                    'Online (video) ose fizik',
                    'Konfidencialitet i plotë',
                    'Psikolog i licencuar',
                    'Regjistrimi dhe anulimi falas deri 24h',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <Check size={15} className="text-emerald-500 shrink-0" strokeWidth={3} />
                      <EditableText>{f}</EditableText>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price range */}
              <div className="bg-slate-900 text-white rounded-3xl p-6">
                <EditableText as="p" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gama e çmimeve</EditableText>
                <div className="flex items-end gap-2 mb-2">
                  <EditableText as="span" className="text-4xl font-black">€20–€30</EditableText>
                  <span className="text-slate-400 mb-1">/ seancë</span>
                </div>
                <EditableText as="p" multiline className="text-sm text-slate-400 leading-relaxed">
                  Psikologët e vendosin çmimin e vet. NeuroSphera merr 15–20% komision dhe ju merrni profesionistin e duhur.
                </EditableText>
              </div>
            </div>

            {/* Sample psychologists */}
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Psikologët tanë</p>
              <div className="space-y-3 mb-5">
                <PsychCard name="Dr. Arta Krasniqi" spec="Ankth · Depresion · Trauma" price={25} rating={4.9} avatar="👩‍⚕️" online={true} />
                <PsychCard name="Dr. Besnik Hoxha"  spec="Çift · Familje · Stress"     price={22} rating={4.8} avatar="👨‍⚕️" online={false} />
                <PsychCard name="Dr. Mirela Gjoka"  spec="Fëmijë · Adoleshentë · ADHD" price={28} rating={5.0} avatar="🧑‍⚕️" online={true} />
              </div>
              <Link to="/ask"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition-all">
                Shfleto të gjithë psikologët
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Session types comparison */}
          <div className="mt-10 bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <EditableText as="h3" className="text-base font-black text-slate-800">Mini-Seancë vs Seancë e Plotë</EditableText>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-4 text-left w-1/3" />
                  <th className="px-5 py-4 text-center w-1/3 border-l border-slate-100">
                    <EditableText as="span" className="block font-black text-violet-700 text-sm">Mini-Seancë</EditableText>
                    <EditableText as="span" className="block font-normal text-violet-400 mt-0.5">Përfshihet në Pro</EditableText>
                  </th>
                  <th className="px-5 py-4 text-center w-1/3 border-l border-slate-100">
                    <EditableText as="span" className="block font-black text-emerald-700 text-sm">Seancë e Plotë</EditableText>
                    <EditableText as="span" className="block font-normal text-emerald-400 mt-0.5">€20–30 veçmas</EditableText>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { label: 'Kohëzgjatja', mini: '15 min', full: '45–60 min' },
                  { label: 'Formati',     mini: 'Online vetëm', full: 'Online + Fizik' },
                  { label: 'Qëllimi',     mini: 'Kontroll i shpejtë', full: 'Terapi e thelluar' },
                  { label: 'Frekuenca',   mini: '2/muaj (përfshihet)', full: 'Sa herë të dëshirosh' },
                  { label: 'Pagesa',      mini: 'Përfshihet në Pro', full: 'Veçmas €20–30' },
                ].map((r) => (
                  <tr key={r.label} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-500">{r.label}</td>
                    <td className="px-5 py-3.5 text-center border-l border-slate-100">
                      <EditableText as="span" className="font-semibold text-violet-700">{r.mini}</EditableText>
                    </td>
                    <td className="px-5 py-3.5 text-center border-l border-slate-100">
                      <EditableText as="span" className="font-semibold text-emerald-700">{r.full}</EditableText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── PSYCHOLOGIST PARTNERSHIP ── */}
      {editMode && !showPsychSection && (
        <div className="flex items-center justify-center py-6 px-5 border-y-2 border-dashed border-violet-300/40"
          style={{ background: 'rgba(124,58,237,0.04)' }}>
          <button
            onClick={() => setShowPsychSection(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-violet-300 transition-all hover:scale-[1.03]"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1.5px dashed rgba(167,139,250,0.45)' }}
          >
            <Eye size={15} />
            Shfaq seksionin "Për Psikologë"
          </button>
        </div>
      )}

      {showPsychSection && (
      <div className="relative overflow-hidden py-20 px-5"
        style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#1a1040 50%,#0d1f3c 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle,#6366f1,transparent)' }} />

        <div className="max-w-4xl mx-auto relative">

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 border border-violet-500/30 rounded-full px-5 py-2 text-sm font-bold text-violet-300"
              style={{ background: 'rgba(124,58,237,0.12)' }}>
              <Users size={13} />
              <EditableText>Për Psikologë & Terapistë</EditableText>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-12">
            <EditableText as="h2" className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Zgjero praktikën tënde.<br />Ndihmo njerëz që kanë nevojë.
            </EditableText>
            <EditableText as="p" multiline className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
              NeuroSphera të lidh me klientë të motivuar, që kanë zgjedhur vetë të kërkojnë mbështetje. Ti fokusohesh te terapia dhe platformë kujdeset për pjesën tjetër.
            </EditableText>
          </div>

          {/* Benefit cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: '🌐', title: 'Profil profesional', desc: 'Prani dixhitale e plotë me bio, specializime, vlerësime dhe disponueshmëri.' },
              { icon: '📅', title: 'Rezervime automatike', desc: 'Sistemi menaxhon oraret, konfirmimet dhe anullimet. Zero punë administrative.' },
              { icon: '🔐', title: 'Platformë e sigurt', desc: 'Konfidencialitet i plotë, GDPR-compliant. Çdo seancë mbrohet me enkriptim.' },
              { icon: '📊', title: 'Analitikë e praktikës', desc: 'Shiko rritjen e klientëve, vlerësimet dhe tendencat, nga paneli yt.' },
              { icon: '💬', title: 'Komunikim i integruar', desc: 'Mesazhe, pyetje private dhe video-seanca, të gjitha në një vend.' },
              { icon: '⏱️', title: 'Orare sipas teje', desc: 'Vendos vetë disponueshmërinë. Online, fizike, ose hibride, si të preferosh.' },
            ].map(({ icon, title, desc }) => (
              <div key={title}
                className="rounded-2xl p-5 border border-white/8 hover:border-violet-500/30 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="text-2xl mb-3">{icon}</div>
                <p className="text-sm font-black text-white mb-1.5">{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA block */}
          <div className="text-center">
            <EditableText as="p" className="text-slate-400 text-sm mb-6">
              Bashkohu me psikologët që ndërtojnë praktikën e tyre dixhitale në NeuroSphera.
            </EditableText>
            <button
              onClick={openApply}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-violet-900/50"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              <Brain size={18} color="white" />
              <span className="text-white">Apliko si psikolog partner</span>
              <ArrowRight size={18} color="white" />
            </button>
            <p className="text-xs text-slate-600 mt-4">
              <EditableText>Shqyrtojmë çdo aplikim me kujdes. Do të kontaktohesh brenda 3–5 ditëve pune.</EditableText>
            </p>
          </div>

        </div>

        {editMode && <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowPsychSection(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.05]"
            style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}
          >
            <EyeOff size={12} />
            Fshih seksionin
          </button>
        </div>}
      </div>
      )}

      {/* invisible anchor kept for old links */}
      <div id="_psych-old" />

      {/* ── FREE PLAN EMPHASIS ── */}
      <div className="py-16 px-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-y border-emerald-100">
        <div className="max-w-4xl mx-auto text-center">
          <EditableText as="h2" className="text-3xl font-black text-slate-900 mb-4">
            Shumica e platformës është falas
          </EditableText>
          <EditableText as="p" multiline className="text-slate-500 text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Filozofia jonë: vegëlat bazë të mirëqenies duhet të jenë të arritshme për të gjithë. Pa barriera. Vlera premium vjen nga lidhja njerëzore.
          </EditableText>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🧘', label: 'Teknika Mindfulness', sub: 'Plotësisht falas' },
              { icon: '📔', label: 'Journal i Plotë', sub: 'Pa kufizime' },
              { icon: '🤖', label: 'Asistent AI', sub: '10 msg/ditë falas' },
              { icon: '🧪', label: 'Teste Psikologjike', sub: 'Të gjitha falas' },
              { icon: '😊', label: 'Gjurmim Humori', sub: 'Çdo ditë falas' },
              { icon: '👥', label: 'Komunitet', sub: 'Lexo & posto falas' },
              { icon: '📚', label: 'Artikuj Shëndetësorë', sub: 'Bibliotekë falas' },
              { icon: '🆘', label: 'Burime Krize', sub: 'Gjithmonë falas' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-xs font-black text-slate-800">{label}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── UPGRADE PSYCHOLOGY SECTION ── */}
      <div className="py-16 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <EditableText as="h2" className="text-3xl font-black text-slate-900 mb-3">Si duket Pro në praktikë</EditableText>
            <EditableText as="p" className="text-slate-500">Shembuj nga jeta reale e përdoruesve Pro</EditableText>
          </div>
          <div className="space-y-4">
            {[
              {
                avatar: '👩',
                name: 'Arta, 28 vjeçe',
                quote: '"Çdo muaj dërgoj 2–3 pyetje te psikologja ime. Ajo i përgjigjet brenda 24h. E ndihem e kuptuar pa pasur nevojë të caktoj seancë të plotë çdo javë."',
                tag: '15 pyetje/muaj',
              },
              {
                avatar: '👨',
                name: 'Besnik, 35 vjeçe',
                quote: '"2 mini-seancat çdo muaj janë perfekte për mua. 20 minuta kontroll me psikologun, dhe di ku jam emocionalisht."',
                tag: '2 mini-seance/muaj',
              },
              {
                avatar: '🧑',
                name: 'Elira, 22 vjeçe',
                quote: '"Fillova me planin falas: journali dhe testi i personalitetit. Pastaj mora pyetjen falas te psikologu dhe vendosa të marr Pro. 9.99€ janë si Spotify, vetëm për shëndetin tim."',
                tag: 'Nga falas → Pro',
              },
            ].map((t) => (
              <div key={t.name} className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-200 to-pink-200 flex items-center justify-center text-2xl shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-black text-slate-800">{t.name}</span>
                      <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">{t.tag}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">{t.quote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="py-16 px-5 bg-slate-50 border-t border-slate-200">
        <div className="max-w-2xl mx-auto">
          <EditableText as="h2" className="text-2xl font-black text-slate-900 text-center mb-8">Pyetje të shpeshta</EditableText>
          <div className="space-y-3">
            {[
              {
                q: 'A përfshihen sesionet e plota në planin Pro?',
                a: 'Jo, qëllimisht. Sesionet e plota (45–60 min) janë gjithmonë pagesa e veçantë (€20–30) sepse koha e psikologut ka vlerë reale. Pro përfshin 2 mini-seancë (15 min) dhe 15 pyetje private (deri 3/ditë), ideal për mbështetje të rregullt pa koston e shumë seancave të plota.',
              },
              {
                q: 'Çfarë është pyetja e parë falas?',
                a: 'Çdo përdorues i ri merr 1 pyetje private falas te një psikolog të verifikuar, pa kartë krediti, pa kushte. Psikologu i përgjigjet brenda 24h. Pas kësaj, mund të blejësh pyetje individuale (€0.99) ose të kalosh në Pro për 15/muaj.',
              },
              {
                q: 'Sa zgjat seanca e shkurtër dhe çfarë mbulon?',
                a: 'Seanca e shkurtër zgjat 15 minuta online. Është projektuar si kontroll emocional i shpejtë — ideal kur keni diçka specifike për të diskutuar, por nuk keni kohë ose nevojë për seancë të plotë. Ndihmon të krijoni besim dhe marrëdhënie me psikologun.',
              },
              {
                q: 'A mund të anuloj Pro kurdo?',
                a: 'Po, plotësisht. Nga faqja e profilit → Aboniment → Anulo. Pa tarifa, pa humbje të dhënash. Vazhdon të kesh akses deri në fund të periudhës tashmë të paguar.',
              },
              {
                q: 'Si funksionon modeli i komisionit për psikologët?',
                a: 'Psikologu vendos çmimin e seancës (€20–50). NeuroSphera merr 15–20% komision vetëm kur seanca mbahet. Pa tarifa mujore, pa kontrata. Psikologu përfiton nga klientët e rinj dhe sistemi automatik i rezervimeve.',
              },
              {
                q: 'A janë psikologët të verifikuar?',
                a: 'Po, çdo psikolog kalon nëpër proces verifikimi: licencë profesionale, CV, referencë dhe intervistë onboarding. Shikoni "Të verifikuar" badge-in në çdo profil.',
              },
            ].map((item) => (
              <FAQ key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="py-16 px-5 text-center"
        style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🌱</div>
          <EditableText as="h2" className="text-3xl font-black text-white mb-4">
            Fillo udhëtimin tënd sot
          </EditableText>
          <EditableText as="p" multiline className="text-slate-400 text-base mb-8 leading-relaxed">
            Qoftë me planin falas apo Pro, NeuroSphera është këtu. Pa presion dhe pa gjykim.
          </EditableText>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth"
              className="px-8 py-4 rounded-2xl font-black text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              Fillo falas, pa kartë krediti
            </Link>
            <Link to="/ask"
              className="px-8 py-4 rounded-2xl font-black text-sm border-2 border-white/20 text-white hover:bg-white/10 transition-all">
              Shfleto psikologët
            </Link>
          </div>
          <p className="text-slate-500 text-xs mt-6">
            Psikologë të verifikuar me licensë. GDPR-compliant. Pa kontrata.
          </p>
        </div>
      </div>

    </div>
  )
}
