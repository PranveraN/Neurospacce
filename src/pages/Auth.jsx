import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Mail, Eye, EyeOff, UserX, Brain, Shield, Zap, User,
  AlertCircle, CheckCircle, Camera, ArrowLeft, Shuffle, Sparkles,
} from 'lucide-react'
import { useMood } from '../contexts/MoodContext'
import { useAuth, validateSignup, validatePassword } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { AvatarDisplay, MinimalistAvatar, CreativeAvatar, FuturisticAvatar } from '../components/Avatar'

const PRESETS = [
  { id: 'avatar1', label: 'Minimalist', desc: 'I qetë', Component: MinimalistAvatar },
  { id: 'avatar2', label: 'Kreativ',    desc: 'Ekspresiv', Component: CreativeAvatar },
  { id: 'avatar3', label: 'Futuristik', desc: 'Modern',  Component: FuturisticAvatar },
]

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5 ml-1">
      <AlertCircle size={11} />{msg}
    </p>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  const errors = validatePassword(password)
  const score  = 3 - errors.length
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400']
  const labels = ['Shumë i dobët', 'I dobët', 'I mesëm', 'I fortë']
  const textCol= ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400']
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2].map(i => (
          <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score] : 'bg-white/10'}`} />
        ))}
      </div>
      <p className={`text-[10px] font-semibold ${textCol[score]}`}>{labels[score]}</p>
    </div>
  )
}

/* ─── Google SVG ─────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export default function Auth() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { theme } = useMood()
  const { login, signup, goAnonymous, resetPassword } = useAuth()

  const [tab, setTab]           = useState('login')
  const [step, setStep]         = useState('form')
  const [showPass, setShow]     = useState(false)
  const [showConfirm, setShowC] = useState(false)
  const [loading, setLoad]      = useState(false)
  const [serverErr, setServErr] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const loginAttempts = useRef({ count: 0, windowStart: 0 })
  const cooldownTimer = useRef(null)

  const [form, setForm]     = useState({ email: '', password: '', confirmPassword: '', username: '' })
  const [errors, setErrors] = useState({})

  const [avatar,      setAvatar]     = useState('avatar1')
  const [photoUrl,    setPhotoUrl]   = useState(null)
  const fileRef                      = useRef(null)
  const [resetEmail,  setResetEmail] = useState('')
  const [resetSent,   setResetSent]  = useState(false)
  const [newPass,     setNewPass]    = useState('')
  const [newPassConf, setNewPassConf]= useState('')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStep('newpass')
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleGoogleLogin() {
    setLoad(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` },
    })
    if (error) { setServErr(error.message); setLoad(false) }
  }

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
    if (res.requiresConfirmation) { setServErr(''); setStep('confirm'); return }
    const from = location.state?.from?.pathname
    navigate(from && from !== '/auth' ? from : '/home', { replace: true })
  }

  function startCooldown(seconds) {
    setCooldown(seconds)
    clearInterval(cooldownTimer.current)
    cooldownTimer.current = setInterval(() => {
      setCooldown(s => { if (s <= 1) { clearInterval(cooldownTimer.current); return 0 } return s - 1 })
    }, 1000)
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (cooldown > 0) return
    const errs = {}
    if (!form.email)    errs.email    = 'Email është i detyrueshëm'
    if (!form.password) errs.password = 'Fjalëkalimi është i detyrueshëm'
    if (Object.keys(errs).length) { setErrors(errs); return }
    const now = Date.now()
    const att = loginAttempts.current
    if (now - att.windowStart > 3 * 60 * 1000) { att.count = 0; att.windowStart = now }
    if (att.count >= 5) {
      const wait = Math.ceil((att.windowStart + 3 * 60 * 1000 - now) / 1000)
      setServErr(`Shumë tentativa. Provo pas ${wait} sekondash.`)
      startCooldown(wait); return
    }
    setLoad(true)
    const res = await login({ email: form.email, password: form.password })
    setLoad(false)
    if (!res.success) {
      att.count++
      if (att.count >= 5) { att.windowStart = Date.now(); setServErr('5 tentativa dështuan. Provo pas 3 minutash.'); startCooldown(180) }
      else setServErr(res.error)
      return
    }
    loginAttempts.current = { count: 0, windowStart: 0 }
    if (res.user?.role === 'admin') navigate('/admin', { replace: true })
    else { const from = location.state?.from?.pathname; navigate(from && from !== '/auth' ? from : '/home', { replace: true }) }
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
    if (res?.success) navigate('/home', { replace: true })
    else navigate('/', { replace: true })
  }

  function switchTab(t) {
    setTab(t); setErrors({}); setServErr('')
    setForm({ email: '', password: '', confirmPassword: '', username: '' })
    setStep('form')
  }

  const selectedPreset = avatar && !photoUrl ? avatar : null

  /* ─── Shared input class ──────────────────────────────── */
  const inp = (hasError) =>
    `w-full bg-white/5 border rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25
     focus:outline-none transition-all duration-200
     ${hasError ? 'border-red-500/50 focus:border-red-400' : 'border-white/10 focus:border-violet-500/60 focus:bg-white/8'}`

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#030711 0%,#0e0525 50%,#030711 100%)' }}>

      {/* ── Background orbs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: `radial-gradient(circle, ${theme.start}, transparent)` }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: `radial-gradient(circle, ${theme.end}, transparent)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-[150px]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
            }} />
        ))}
      </div>

      {/* ── Main container ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 flex items-center gap-8">

        {/* ── Left branding (desktop) ── */}
        <div className="hidden lg:flex flex-col justify-center flex-1 pr-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30"
              style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
              <Brain size={24} color="white" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">NeuroSphera</h1>
              <p className="text-[11px] text-white/40 font-medium">Mental Wellness Platform</p>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Kujdesu për<br />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
              shëndetin tënd mendor.
            </span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-xs">
            Platforma e parë shqiptare e mirëqenies mendore. E ndërtuar mbi shkencë, e dizajnuar për ty.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: Brain,   text: 'AI Chat bazuar në CBT',              sub: 'Mbështetje 24/7' },
              { icon: Shield,  text: 'Hapësirë 100% private',              sub: 'E enkriptuar plotësisht' },
              { icon: Zap,     text: 'Teknika të provuara shkencërisht',   sub: 'Bazuar në kërkime' },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)`, border: `1px solid ${theme.start}33` }}>
                  <Icon size={15} style={{ color: theme.start }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">{text}</p>
                  <p className="text-[11px] text-white/30">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-2xl border border-white/5 bg-white/3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-white/60">Mbi 1,000+ përdorues aktivë</p>
            </div>
            <p className="text-[11px] text-white/25">Supabase Auth · JWT · RLS · End-to-end security</p>
          </div>
        </div>

        {/* ── Right: Auth card ── */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="rounded-3xl border border-white/8 p-7 shadow-2xl shadow-black/50"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)' }}>

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
                <Brain size={20} color="white" strokeWidth={1.8} />
              </div>
              <h1 className="text-lg font-black text-white">NeuroSphera</h1>
            </div>

            {/* ═══ AVATAR STEP ═══ */}
            {step === 'avatar' ? (
              <div>
                <button onClick={() => setStep('form')}
                  className="flex items-center gap-1.5 text-white/40 text-xs font-semibold hover:text-white/70 mb-5 transition-colors">
                  <ArrowLeft size={13} /> Kthehu
                </button>
                <h2 className="text-xl font-black text-white mb-1">Zgjidh avatarin</h2>
                <p className="text-white/40 text-sm mb-5">Personalizoje profilin tënd</p>

                <div className="flex flex-col items-center mb-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mb-2 ring-2 ring-violet-500/30"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <AvatarDisplay avatar={photoUrl || avatar || 'avatar1'} size={80} />
                  </div>
                  <p className="text-[11px] text-white/30 font-semibold">
                    {photoUrl ? 'Foto e ngarkuar' : PRESETS.find(p => p.id === (avatar || 'avatar1'))?.label}
                  </p>
                </div>

                <label htmlFor="photo-upload"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/10 text-white/40 text-sm font-semibold cursor-pointer hover:border-violet-500/40 hover:text-violet-400 transition-all mb-4">
                  <Camera size={14} /> Ngarko foton tënde
                  <input id="photo-upload" ref={fileRef} type="file" accept="image/*"
                    className="hidden" onChange={handlePhotoUpload} />
                </label>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {PRESETS.map(({ id, label, Component }) => (
                    <button key={id} onClick={() => { setAvatar(id); setPhotoUrl(null) }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedPreset === id
                          ? 'border-violet-500/60 bg-violet-500/10'
                          : 'border-white/5 bg-white/3 hover:border-white/15'
                      }`}>
                      <Component size={48} />
                      <p className="text-[10px] font-bold text-white/60">{label}</p>
                    </button>
                  ))}
                </div>

                <button onClick={handleAutoGenerate}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/5 bg-white/3 text-white/40 text-sm font-semibold hover:border-white/15 hover:text-white/60 transition-all mb-4">
                  <Shuffle size={13} /> Opsion automatik
                </button>

                <button onClick={handleFinish} disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-black text-sm shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})`, boxShadow: `0 8px 32px ${theme.start}44` }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Duke u krijuar...</>
                    : <><Sparkles size={15} /> Krijo llogarinë</>}
                </button>
              </div>

            /* ═══ EMAIL CONFIRM ═══ */
            ) : step === 'confirm' ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)`, border: `1px solid ${theme.start}44` }}>
                  <Mail size={28} style={{ color: theme.start }} />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Konfirmo emailin</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Dërguam një link konfirmimi tek<br />
                  <strong className="text-white/70">{form.email}</strong>
                </p>
                <button onClick={() => switchTab('login')}
                  className="w-full py-3.5 rounded-xl text-white font-black text-sm"
                  style={{ background: `linear-gradient(135deg,${theme.start},${theme.end})` }}>
                  Kthehu te hyrja
                </button>
                <p className="text-xs text-white/25 mt-3">Nuk e gjetët? Kontrolloni Spam.</p>
              </div>

            /* ═══ NEW PASSWORD ═══ */
            ) : step === 'newpass' ? (
              <div>
                <h2 className="text-xl font-black text-white mb-1">Fjalëkalim i ri</h2>
                <p className="text-white/40 text-sm mb-5">Vendos fjalëkalimin tënd të ri.</p>
                {serverErr && <ErrorBanner msg={serverErr} />}
                <form onSubmit={handleNewPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 mb-1.5 ml-1">Fjalëkalimi i ri</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={newPass}
                        onChange={e => { setNewPass(e.target.value); setErrors({}) }}
                        placeholder="••••••••" autoFocus className={inp(errors.newPass)} />
                      <button type="button" onClick={() => setShow(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <FieldError msg={errors.newPass} />
                    <PasswordStrength password={newPass} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 mb-1.5 ml-1">Konfirmo</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} value={newPassConf}
                        onChange={e => { setNewPassConf(e.target.value); setErrors({}) }}
                        placeholder="••••••••" className={inp(false)} />
                      <button type="button" onClick={() => setShowC(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading || !newPass || !newPassConf}
                    className="w-full py-3.5 rounded-xl text-white font-black text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg,${theme.start},${theme.end})` }}>
                    {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Duke ruajtur...</> : 'Ruaj fjalëkalimin'}
                  </button>
                </form>
              </div>

            /* ═══ RESET PASSWORD ═══ */
            ) : step === 'reset' ? (
              <div>
                <button onClick={() => { setStep('form'); setResetSent(false); setServErr('') }}
                  className="flex items-center gap-1.5 text-white/40 text-xs font-semibold hover:text-white/70 mb-5 transition-colors">
                  <ArrowLeft size={13} /> Kthehu
                </button>
                <h2 className="text-xl font-black text-white mb-1">Rivendos fjalëkalimin</h2>
                <p className="text-white/40 text-sm mb-5">Dërgojmë udhëzime në emailin tënd.</p>

                {resetSent ? (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <CheckCircle size={28} className="text-emerald-400" />
                    </div>
                    <p className="text-white font-bold">Email dërguar!</p>
                    <p className="text-white/40 text-sm text-center">Kontrolloni kutinë postare (dhe Spam).</p>
                    <button onClick={() => switchTab('login')} className="mt-2 text-sm font-bold text-violet-400 hover:text-violet-300">
                      Kthehu te hyrja
                    </button>
                  </div>
                ) : (
                  <>
                    {serverErr && <ErrorBanner msg={serverErr} />}
                    <form onSubmit={handleReset} className="space-y-4">
                      <div className="relative">
                        <input type="email" value={resetEmail}
                          onChange={e => { setResetEmail(e.target.value); setServErr('') }}
                          placeholder="email@example.com" autoFocus className={inp(false)} />
                        <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                      </div>
                      <button type="submit" disabled={loading || !resetEmail}
                        className="w-full py-3.5 rounded-xl text-white font-black text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg,${theme.start},${theme.end})` }}>
                        {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Duke dërguar...</> : 'Dërgo linkun'}
                      </button>
                    </form>
                  </>
                )}
              </div>

            /* ═══ MAIN FORM ═══ */
            ) : (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white mb-1">
                    {tab === 'login' ? 'Mirë se vjen!' : 'Krijo llogarinë'}
                  </h2>
                  <p className="text-white/35 text-sm">
                    {tab === 'login' ? 'Hyr në hapësirën tënde mendore' : 'Fillo udhëtimin tënd sot'}
                  </p>
                </div>

                {/* ── Google button ── */}
                <button onClick={handleGoogleLogin} disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-200 mb-3 disabled:opacity-50">
                  <GoogleIcon />
                  {tab === 'login' ? 'Hyr me Google' : 'Regjistrohu me Google'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[11px] text-white/25 font-semibold">ose me email</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Tabs */}
                <div className="flex bg-white/5 rounded-xl p-1 mb-5 border border-white/5">
                  {[{ key: 'login', label: 'Hyr' }, { key: 'signup', label: 'Regjistrohu' }].map(t => (
                    <button key={t.key} onClick={() => switchTab(t.key)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                        tab === t.key ? 'text-white shadow-sm' : 'text-white/30 hover:text-white/50'
                      }`}
                      style={tab === t.key ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` } : {}}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Error */}
                {serverErr && <ErrorBanner msg={serverErr} />}

                {/* Form */}
                <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-3.5">

                  {tab === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-1.5 ml-1">
                        Emri i përdoruesit <span className="text-white/20 font-normal">(opsional)</span>
                      </label>
                      <div className="relative">
                        <input type="text" value={form.username}
                          onChange={e => field('username', e.target.value)}
                          placeholder="username_yt"
                          className={inp(errors.username)} />
                        <User size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                      </div>
                      <FieldError msg={errors.username} />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-1.5 ml-1">Email</label>
                    <div className="relative">
                      <input type="email" value={form.email}
                        onChange={e => field('email', e.target.value)}
                        placeholder="email@example.com"
                        className={inp(errors.email)} />
                      {errors.email
                        ? <AlertCircle size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400" />
                        : form.email && !errors.email
                          ? <CheckCircle size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                          : <Mail size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                      }
                    </div>
                    <FieldError msg={errors.email} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-1.5 ml-1">Fjalëkalimi</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={form.password}
                        onChange={e => field('password', e.target.value)}
                        placeholder="••••••••"
                        className={inp(errors.password)} />
                      <button type="button" onClick={() => setShow(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <FieldError msg={errors.password} />
                    {tab === 'signup' && <PasswordStrength password={form.password} />}
                  </div>

                  {tab === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-1.5 ml-1">Konfirmo fjalëkalimin</label>
                      <div className="relative">
                        <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                          onChange={e => field('confirmPassword', e.target.value)}
                          placeholder="••••••••"
                          className={inp(errors.confirm)} />
                        <button type="button" onClick={() => setShowC(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                          {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {form.confirmPassword && form.password === form.confirmPassword && (
                        <p className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1.5 ml-1">
                          <CheckCircle size={11} /> Fjalëkalimet përputhen
                        </p>
                      )}
                      <FieldError msg={errors.confirm} />
                    </div>
                  )}

                  {tab === 'login' && (
                    <div className="flex justify-end">
                      <button type="button"
                        onClick={() => { setResetEmail(form.email); setResetSent(false); setServErr(''); setStep('reset') }}
                        className="text-xs font-semibold text-white/30 hover:text-violet-400 transition-colors">
                        Harrove fjalëkalimin?
                      </button>
                    </div>
                  )}

                  <button type="submit" disabled={loading || cooldown > 0}
                    className="w-full py-3.5 rounded-xl text-white font-black text-sm shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                    style={{
                      background: cooldown > 0 ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${theme.start}, ${theme.end})`,
                      boxShadow: cooldown > 0 ? 'none' : `0 8px 32px ${theme.start}44`,
                    }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Duke u lidhur...</>
                      : cooldown > 0
                        ? `Provo pas ${cooldown}s`
                        : tab === 'login' ? 'Hyr me Email' : 'Vazhdo'
                    }
                  </button>
                </form>

                {/* Anonymous */}
                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-[11px] text-white/20 font-semibold">ose</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>
                  <button onClick={handleAnonymous} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/8 text-white/25 text-sm font-semibold hover:border-white/15 hover:text-white/40 transition-all disabled:opacity-50">
                    <UserX size={14} /> Vazhdo anonim
                  </button>
                </div>

                <p className="text-center text-xs text-white/20 mt-5">
                  Jeni administrator?{' '}
                  <Link to="/admin/login" className="font-bold text-white/35 hover:text-violet-400 transition-colors">
                    Hyrja si administrator
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorBanner({ msg }) {
  return (
    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
      <AlertCircle size={14} className="text-red-400 shrink-0" />
      <p className="text-sm text-red-400 font-medium">{msg}</p>
    </div>
  )
}
