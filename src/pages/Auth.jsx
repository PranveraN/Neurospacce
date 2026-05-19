import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Mail, Eye, EyeOff, UserX, Brain, Shield, Zap, User,
  AlertCircle, CheckCircle, Camera, ArrowLeft, Shuffle,
} from 'lucide-react'
import { useMood } from '../contexts/MoodContext'
import { useAuth, validateSignup, validatePassword } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { AvatarDisplay, MinimalistAvatar, CreativeAvatar, FuturisticAvatar } from '../components/Avatar'

const FEATURES = [
  { icon: Brain,  text: 'AI Chat bazuar në CBT'              },
  { icon: Shield, text: 'Hapësirë 100% private dhe e sigurt' },
  { icon: Zap,    text: 'Teknika të provuara shkencërisht'   },
]

const PRESETS = [
  { id: 'avatar1', label: 'Minimalist', desc: 'I qetë dhe neutral',     Component: MinimalistAvatar },
  { id: 'avatar2', label: 'Kreativ',    desc: 'Ekspresiv dhe ngjyrë',   Component: CreativeAvatar   },
  { id: 'avatar3', label: 'Futuristik', desc: 'Modern dhe teknologjik', Component: FuturisticAvatar },
]

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5 ml-1">
      <AlertCircle size={11} />
      {msg}
    </p>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  const errors = validatePassword(password)
  const score  = 3 - errors.length
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const labels = ['Shumë i dobët', 'I dobët', 'I mesëm', 'I fortë']
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-[10px] font-semibold"
        style={{ color: score >= 3 ? '#22c55e' : score === 2 ? '#eab308' : '#ef4444' }}>
        {labels[score]}
      </p>
    </div>
  )
}

export default function Auth() {
  const navigate                   = useNavigate()
  const location                   = useLocation()
  const { theme }                  = useMood()
  const { login, signup, goAnonymous, resetPassword } = useAuth()

  const [tab, setTab]              = useState('login')
  const [step, setStep]            = useState('form')   // 'form' | 'avatar'
  const [showPass, setShow]        = useState(false)
  const [showConfirm, setShowC]    = useState(false)
  const [loading, setLoad]         = useState(false)
  const [serverErr, setServErr]    = useState('')
  const [cooldown, setCooldown]    = useState(0)  // seconds remaining

  // Rate limit: max 5 failed attempts per 3 minutes
  const loginAttempts = useRef({ count: 0, windowStart: 0 })
  const cooldownTimer = useRef(null)

  const [form, setForm]    = useState({ email: '', password: '', confirmPassword: '', username: '' })
  const [errors, setErrors]= useState({})

  const [avatar,      setAvatar]     = useState('avatar1')
  const [photoUrl,    setPhotoUrl]   = useState(null)
  const fileRef                      = useRef(null)
  const [resetEmail,  setResetEmail] = useState('')
  const [resetSent,   setResetSent]  = useState(false)
  const [newPass,     setNewPass]    = useState('')
  const [newPassConf, setNewPassConf]= useState('')

  // Detect PASSWORD_RECOVERY event when user clicks reset link in email
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStep('newpass')
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleNewPassword(e) {
    e.preventDefault()
    if (newPass !== newPassConf) { setErrors({ newPass: 'Fjalëkalimet nuk përputhen' }); return }
    const pwErrors = validatePassword(newPass)
    if (pwErrors.length) { setErrors({ newPass: pwErrors[0] }); return }
    setLoad(true)
    const { error } = await supabase.auth.updateUser({ password: newPass })
    setLoad(false)
    if (error) { setServErr(error.message); return }
    navigate('/home', { replace: true })
  }

  function field(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
    setServErr('')
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setPhotoUrl(ev.target.result); setAvatar(null) }
    reader.readAsDataURL(file)
  }

  function handleAutoGenerate() {
    const picks = ['avatar1', 'avatar2', 'avatar3']
    setAvatar(picks[Math.floor(Math.random() * picks.length)])
    setPhotoUrl(null)
  }

  function handleSignup(e) {
    e.preventDefault()
    const errs = validateSignup(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep('avatar')
  }

  async function handleFinish() {
    setLoad(true)
    const finalAvatar = photoUrl || avatar || 'avatar1'
    const res = await signup({ email: form.email, password: form.password, username: form.username, avatar: finalAvatar })
    setLoad(false)
    if (!res.success) { setStep('form'); setServErr(res.error || 'Gabim gjatë regjistrimit'); return }
    if (res.requiresConfirmation) {
      setServErr('')
      setStep('confirm')
      return
    }
    const from = location.state?.from?.pathname
    navigate(from && from !== '/auth' ? from : '/home', { replace: true })
  }

  function startCooldown(seconds) {
    setCooldown(seconds)
    clearInterval(cooldownTimer.current)
    cooldownTimer.current = setInterval(() => {
      setCooldown(s => {
        if (s <= 1) { clearInterval(cooldownTimer.current); return 0 }
        return s - 1
      })
    }, 1000)
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (cooldown > 0) return

    const errs = {}
    if (!form.email)    errs.email    = 'Email është i detyrueshëm'
    if (!form.password) errs.password = 'Fjalëkalimi është i detyrueshëm'
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Client-side rate limit: 5 attempts per 3 minutes
    const now = Date.now()
    const att = loginAttempts.current
    if (now - att.windowStart > 3 * 60 * 1000) {
      att.count = 0; att.windowStart = now
    }
    if (att.count >= 5) {
      const wait = Math.ceil((att.windowStart + 3 * 60 * 1000 - now) / 1000)
      setServErr(`Shumë tentativa. Provo pas ${wait} sekondash.`)
      startCooldown(wait)
      return
    }

    setLoad(true)
    const res = await login({ email: form.email, password: form.password })
    setLoad(false)

    if (!res.success) {
      att.count++
      if (att.count >= 5) {
        att.windowStart = Date.now()
        setServErr('5 tentativa dështuan. Provo pas 3 minutash.')
        startCooldown(180)
      } else {
        setServErr(res.error)
      }
      return
    }
    loginAttempts.current = { count: 0, windowStart: 0 }
    if (res.user?.role === 'admin') {
      navigate('/admin', { replace: true })
    } else {
      const from = location.state?.from?.pathname
      navigate(from && from !== '/auth' ? from : '/home', { replace: true })
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    if (!resetEmail) return
    setLoad(true)
    const res = await resetPassword(resetEmail)
    setLoad(false)
    if (!res.success) { setServErr(res.error || 'Gabim. Provo përsëri.'); return }
    setResetSent(true)
  }

  async function handleAnonymous() {
    setLoad(true)
    const res = await goAnonymous()
    setLoad(false)
    if (res?.success) {
      navigate('/home', { replace: true })
    } else {
      // Anonymous sign-in not enabled in Supabase — just browse as guest
      navigate('/', { replace: true })
    }
  }

  function switchTab(t) {
    setTab(t); setErrors({}); setServErr('')
    setForm({ email: '', password: '', confirmPassword: '', username: '' })
    setStep('form')
  }

  const selectedPreset = avatar && !photoUrl ? avatar : null

  return (
    <div className="min-h-screen flex items-stretch bg-gray-50">

      {/* ── Left hero panel (desktop only) ── */}
      <div
        className="hidden md:flex flex-col justify-center items-center w-5/12 p-12 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${theme.start} 0%, ${theme.end} 60%, #3b97f6 100%)` }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/8 blur-2xl" />
        <div className="relative text-center max-w-xs">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Brain size={36} color="white" strokeWidth={1.8} />
          </div>
          <h1 className="text-3xl font-black mb-2">NeuroSpace</h1>
          <p className="text-white/75 text-sm mb-10 leading-relaxed">
            Platforma jote e mirëqenies mendore.<br />E ndërtuar mbi shkencë, e dizajnuar për ty.
          </p>
          <div className="space-y-3 text-left">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/15 rounded-2xl px-4 py-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Icon size={15} color="white" strokeWidth={2} />
                </div>
                <p className="text-sm font-semibold">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white/10 rounded-2xl px-4 py-3 text-left border border-white/20">
            <p className="text-xs font-bold text-white/80 mb-1">🔒 Autentifikim i sigurt</p>
            <p className="text-[11px] text-white/60">Supabase Auth · JWT i nënshkruar · RLS</p>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-12">

        {/* Mobile logo */}
        <div className="md:hidden text-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
          >
            <Brain size={28} color="white" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">NeuroSpace</h1>
        </div>

        <div className="max-w-sm w-full mx-auto">

          {/* ════════════════════════════════════════
              STEP 2 — AVATAR PICKER
          ════════════════════════════════════════ */}
          {step === 'avatar' ? (
            <div>
              <button onClick={() => setStep('form')}
                className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold hover:text-gray-600 mb-5 transition-colors">
                <ArrowLeft size={13} /> Kthehu
              </button>

              <h2 className="text-2xl font-black text-gray-900 mb-1">Zgjidh avatarin</h2>
              <p className="text-gray-500 text-sm mb-5">Personalizoje profilin tënd të ri</p>

              {/* Selected preview */}
              <div className="flex flex-col items-center mb-5">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg mb-2 ring-4 ring-violet-100"
                  style={{ background: photoUrl ? 'transparent' : '#f3f4f6' }}>
                  <AvatarDisplay avatar={photoUrl || avatar || 'avatar1'} size={96} />
                </div>
                <p className="text-[11px] text-gray-400 font-semibold">
                  {photoUrl
                    ? 'Foto e ngarkuar'
                    : PRESETS.find(p => p.id === (avatar || 'avatar1'))?.label}
                </p>
              </div>

              {/* Photo upload */}
              <label htmlFor="photo-upload"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 text-sm font-semibold cursor-pointer hover:border-violet-300 hover:text-violet-500 transition-all mb-4 bg-white">
                <Camera size={15} />
                Ngarko foton tënde
                <input id="photo-upload" ref={fileRef} type="file" accept="image/*"
                  className="hidden" onChange={handlePhotoUpload} />
              </label>

              {/* Preset grid */}
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Avatarë të gatshëm
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {PRESETS.map(({ id, label, desc, Component }) => (
                  <button key={id} onClick={() => { setAvatar(id); setPhotoUrl(null) }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                      selectedPreset === id
                        ? 'border-violet-500 bg-violet-50 shadow-sm'
                        : 'border-gray-100 bg-white hover:border-violet-200'
                    }`}>
                    <Component size={56} />
                    <p className="text-[11px] font-black text-gray-700">{label}</p>
                    <p className="text-[9px] text-gray-400 text-center leading-tight">{desc}</p>
                  </button>
                ))}
              </div>

              {/* Auto-generate */}
              <button onClick={handleAutoGenerate}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-100 bg-white text-gray-500 text-sm font-semibold hover:border-gray-300 hover:text-gray-700 transition-all mb-5">
                <Shuffle size={14} />
                Opsion automatik
              </button>

              {/* Finish */}
              <button onClick={handleFinish} disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Duke u krijuar...</>
                  : 'Krijo llogarinë'
                }
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-3">
                Avatari mund të ndryshohet më vonë nga profili yt.
              </p>
            </div>

          ) : step === 'confirm' ? (
          /* ════════════════════════════════════════
              STEP 3 — EMAIL CONFIRMATION
          ════════════════════════════════════════ */
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `linear-gradient(135deg,${theme.start}22,${theme.end}22)` }}>
                <Mail size={28} style={{ color: theme.start }} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Konfirmo emailin</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Dërguam një email konfirmimi tek <strong className="text-gray-800">{form.email}</strong>.
                <br />Kliko linkun për të aktivizuar llogarinë.
              </p>
              <button onClick={() => switchTab('login')}
                className="w-full py-3 rounded-2xl text-white font-black text-sm"
                style={{ background: `linear-gradient(135deg,${theme.start},${theme.end})` }}>
                Kthehu te hyrja
              </button>
              <p className="text-xs text-gray-400 mt-3">
                Nuk e gjetët emailin? Kontrolloni dosjen Spam.
              </p>
            </div>

          ) : step === 'newpass' ? (
          /* ════════════════════════════════════════
              STEP — SET NEW PASSWORD (from recovery link)
          ════════════════════════════════════════ */
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Fjalëkalim i ri</h2>
              <p className="text-gray-500 text-sm mb-6">Vendos fjalëkalimin tënd të ri.</p>
              {serverErr && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
                  <AlertCircle size={15} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-600 font-medium">{serverErr}</p>
                </div>
              )}
              <form onSubmit={handleNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Fjalëkalimi i ri</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={newPass}
                      onChange={e => { setNewPass(e.target.value); setErrors({}) }}
                      placeholder="••••••••" autoFocus
                      className={`w-full bg-white rounded-2xl border px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none transition-colors shadow-sm ${errors.newPass ? 'border-red-300' : 'border-gray-200 focus:border-purple-300'}`}
                    />
                    <button type="button" onClick={() => setShow(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <FieldError msg={errors.newPass} />
                  <PasswordStrength password={newPass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Konfirmo fjalëkalimin</label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} value={newPassConf}
                      onChange={e => { setNewPassConf(e.target.value); setErrors({}) }}
                      placeholder="••••••••"
                      className={`w-full bg-white rounded-2xl border px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none transition-colors shadow-sm ${newPassConf && newPass === newPassConf ? 'border-green-300' : 'border-gray-200 focus:border-purple-300'}`}
                    />
                    <button type="button" onClick={() => setShowC(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {newPassConf && newPass === newPassConf && (
                    <p className="flex items-center gap-1.5 text-xs text-green-500 mt-1.5 ml-1">
                      <CheckCircle size={11} /> Fjalëkalimet përputhen
                    </p>
                  )}
                </div>
                <button type="submit" disabled={loading || !newPass || !newPassConf}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Duke ruajtur...</>
                    : 'Ruaj fjalëkalimin'
                  }
                </button>
              </form>
            </div>

          ) : step === 'reset' ? (
          /* ════════════════════════════════════════
              STEP 4 — PASSWORD RESET
          ════════════════════════════════════════ */
            <div>
              <button onClick={() => { setStep('form'); setResetSent(false); setServErr('') }}
                className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold hover:text-gray-600 mb-5 transition-colors">
                <ArrowLeft size={13} /> Kthehu
              </button>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Rivendos fjalëkalimin</h2>
              <p className="text-gray-500 text-sm mb-6">
                Shkruaj emailin tënd dhe do të të dërgojmë udhëzime.
              </p>

              {resetSent ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <CheckCircle size={40} className="text-green-500" />
                  <p className="text-gray-800 font-bold text-center">Email dërguar!</p>
                  <p className="text-gray-500 text-sm text-center">
                    Kontrolloni kutinë postare (dhe Spam).<br />Klikoni linkun brenda 1 ore.
                  </p>
                  <button onClick={() => switchTab('login')}
                    className="mt-2 text-xs font-bold hover:underline"
                    style={{ color: theme.start }}>
                    Kthehu te hyrja
                  </button>
                </div>
              ) : (
                <>
                  {serverErr && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
                      <AlertCircle size={15} className="text-red-500 shrink-0" />
                      <p className="text-sm text-red-600 font-medium">{serverErr}</p>
                    </div>
                  )}
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Email</label>
                      <div className="relative">
                        <input type="email" value={resetEmail}
                          onChange={e => { setResetEmail(e.target.value); setServErr('') }}
                          placeholder="email@example.com" autoFocus
                          className="w-full bg-white rounded-2xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none focus:border-purple-300 shadow-sm" />
                        <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                    <button type="submit" disabled={loading || !resetEmail}
                      className="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg,${theme.start},${theme.end})` }}>
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Duke dërguar...</>
                        : 'Dërgo linkun'
                      }
                    </button>
                  </form>
                </>
              )}
            </div>

          ) : (
          /* ════════════════════════════════════════
              STEP 1 — FORM (login / signup)
          ════════════════════════════════════════ */
            <>
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                {tab === 'login' ? 'Mirë se vjen!' : 'Krijo llogarinë'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {tab === 'login' ? 'Hyr në hapësirën tënde' : 'Filloje udhëtimin tënd sot'}
              </p>

              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                {[{ key: 'login', label: 'Hyr' }, { key: 'signup', label: 'Regjistrohu' }].map(t => (
                  <button key={t.key} onClick={() => switchTab(t.key)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'text-white shadow-sm' : 'text-gray-400'}`}
                    style={tab === t.key ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` } : {}}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Server error */}
              {serverErr && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
                  <AlertCircle size={15} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-600 font-medium">{serverErr}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-4">

                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">
                      Emri i përdoruesit <span className="text-gray-400 font-normal">(opsional)</span>
                    </label>
                    <div className="relative">
                      <input type="text" value={form.username}
                        onChange={e => field('username', e.target.value)}
                        placeholder="username_yt"
                        className={`w-full bg-white rounded-2xl border px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none transition-colors shadow-sm ${errors.username ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-purple-300'}`}
                      />
                      <User size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                    <FieldError msg={errors.username} />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Email</label>
                  <div className="relative">
                    <input type="email" value={form.email}
                      onChange={e => field('email', e.target.value)}
                      placeholder="email@example.com"
                      className={`w-full bg-white rounded-2xl border px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none transition-colors shadow-sm ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-purple-300'}`}
                    />
                    {errors.email
                      ? <AlertCircle size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400" />
                      : form.email && !errors.email
                        ? <CheckCircle size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                        : <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    }
                  </div>
                  <FieldError msg={errors.email} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Fjalëkalimi</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={form.password}
                      onChange={e => field('password', e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-white rounded-2xl border px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none transition-colors shadow-sm ${errors.password ? 'border-red-300' : 'border-gray-200 focus:border-purple-300'}`}
                    />
                    <button type="button" onClick={() => setShow(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <FieldError msg={errors.password} />
                  {tab === 'signup' && <PasswordStrength password={form.password} />}
                </div>

                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Konfirmo fjalëkalimin</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                        onChange={e => field('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className={`w-full bg-white rounded-2xl border px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none transition-colors shadow-sm ${errors.confirm ? 'border-red-300' : form.confirmPassword && form.password === form.confirmPassword ? 'border-green-300' : 'border-gray-200 focus:border-purple-300'}`}
                      />
                      <button type="button" onClick={() => setShowC(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <p className="flex items-center gap-1.5 text-xs text-green-500 mt-1.5 ml-1">
                        <CheckCircle size={11} /> Fjalëkalimet përputhen
                      </p>
                    )}
                    <FieldError msg={errors.confirm} />
                  </div>
                )}

                {tab === 'login' && (
                  <button type="button"
                    onClick={() => { setResetEmail(form.email); setResetSent(false); setServErr(''); setStep('reset') }}
                    className="block ml-auto text-xs font-semibold hover:underline transition-colors"
                    style={{ color: theme.start }}>
                    Harrove fjalëkalimin?
                  </button>
                )}

                <button type="submit" disabled={loading || cooldown > 0}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: cooldown > 0 ? '#94a3b8' : `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Duke u lidhur...</>
                    : cooldown > 0
                      ? `Provo pas ${cooldown}s`
                      : tab === 'login' ? 'Hyr' : 'Vazhdo'
                  }
                </button>
              </form>

              {/* Anonymous */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-semibold">ose vazhdo</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <button onClick={handleAnonymous} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm font-semibold hover:border-gray-400 hover:text-gray-600 transition-all bg-white disabled:opacity-60">
                  <UserX size={15} />
                  Vazhdo anonim
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                Jeni administrator?{' '}
                <Link to="/admin/login" className="font-bold hover:underline" style={{ color: theme.start }}>
                  Hyrja si administrator
                </Link>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
