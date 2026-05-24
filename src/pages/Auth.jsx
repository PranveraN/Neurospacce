import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Mail, Eye, EyeOff, UserX, Brain, User,
  AlertCircle, CheckCircle, Camera, ArrowLeft, Shuffle, Sparkles,
} from 'lucide-react'
import { useAuth, validateSignup, validatePassword } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { AvatarDisplay, MinimalistAvatar, CreativeAvatar, FuturisticAvatar } from '../components/Avatar'

const PRESETS = [
  { id: 'avatar1', label: 'Minimalist', Component: MinimalistAvatar },
  { id: 'avatar2', label: 'Kreativ',    Component: CreativeAvatar   },
  { id: 'avatar3', label: 'Futuristik', Component: FuturisticAvatar },
]

// Stable starfield — not random on every render
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: (i * 137.508) % 100,
  y: (i * 97.333)  % 100,
  size: (i % 3) === 0 ? 2 : 1,
  delay:    (i * 0.37)  % 5,
  duration: 2 + (i % 4),
  opacity:  0.08 + (i % 6) * 0.04,
}))

/* ── Small components ─────────────────────────────────────────────────────── */

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
  const bars   = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500']
  const labels = ['Shumë i dobët', 'I dobët', 'I mesëm', 'I fortë']
  const texts  = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400']
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2].map(i => (
          <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${i < score ? bars[score] : 'bg-white/10'}`} />
        ))}
      </div>
      <p className={`text-[10px] font-semibold ${texts[score]}`}>{labels[score]}</p>
    </div>
  )
}

function ErrorBanner({ msg }) {
  return (
    <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-4">
      <AlertCircle size={14} className="text-red-400 shrink-0" />
      <p className="text-sm text-red-300 font-medium leading-snug">{msg}</p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */

export default function Auth() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login, signup, goAnonymous, resetPassword, user, loading: authLoading } = useAuth()

  const [tab,        setTab]       = useState('login')
  const [step,       setStep]      = useState('form')
  const [showPass,   setShow]      = useState(false)
  const [showConf,   setShowC]     = useState(false)
  const [loading,    setLoad]      = useState(false)
  const [serverErr,  setServErr]   = useState('')
  const [cooldown,   setCooldown]  = useState(0)

  const loginAttempts = useRef({ count: 0, windowStart: 0 })
  const cooldownTimer = useRef(null)

  const [form, setForm]           = useState({ email: '', password: '', confirmPassword: '', username: '' })
  const [errors, setErrors]       = useState({})
  const [avatar, setAvatar]       = useState('avatar1')
  const [photoUrl, setPhotoUrl]   = useState(null)
  const fileRef                   = useRef(null)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent]   = useState(false)
  const [newPass, setNewPass]       = useState('')
  const [newPassConf, setNewPassConf] = useState('')

  // Restore last used email
  useEffect(() => {
    const saved = localStorage.getItem('ns_last_email')
    if (saved) setForm(f => ({ ...f, email: saved }))
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStep('newpass')
    })
    return () => subscription.unsubscribe()
  }, [])

  // Google OAuth redirect handling
  const isOAuthRedirect = new URLSearchParams(location.search).get('oauth') === 'google'
  useEffect(() => {
    if (!isOAuthRedirect || authLoading || !user) return
    navigate(user.role === 'admin' ? '/ns-secure-7381/' : '/', { replace: true })
  }, [isOAuthRedirect, authLoading, user, navigate])

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  async function handleGoogleLogin() {
    setLoad(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth?oauth=google` },
    })
    if (error) { setServErr('Kyçja me Google dështoi. Provo sërish.'); setLoad(false) }
  }

  async function handleNewPassword(e) {
    e.preventDefault()
    if (newPass !== newPassConf) { setErrors({ newPass: 'Fjalëkalimet nuk përputhen' }); return }
    const pwErrors = validatePassword(newPass)
    if (pwErrors.length) { setErrors({ newPass: pwErrors[0] }); return }
    setLoad(true)
    const { error } = await supabase.auth.updateUser({ password: newPass })
    setLoad(false)
    if (error) { setServErr('Gabim gjatë ndryshimit. Provo sërish.'); return }
    navigate(user?.role === 'admin' ? '/ns-secure-7381/' : '/', { replace: true })
  }

  function field(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
    setServErr('')
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setPhotoUrl(ev.target.result); setAvatar(null) }
    reader.readAsDataURL(file)
  }

  function handleAutoGenerate() {
    const picks = ['avatar1', 'avatar2', 'avatar3']
    setAvatar(picks[Math.floor(Math.random() * picks.length)]); setPhotoUrl(null)
  }

  function handleSignup(e) {
    e.preventDefault()
    const errs = validateSignup(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep('avatar')
  }

  async function handleFinish() {
    setLoad(true)
    const res = await signup({ email: form.email, password: form.password, username: form.username, avatar: photoUrl || avatar || 'avatar1' })
    setLoad(false)
    if (!res.success) { setStep('form'); setServErr(res.error || 'Gabim gjatë regjistrimit. Provo sërish.'); return }
    if (res.requiresConfirmation) { setStep('confirm'); return }
    localStorage.setItem('ns_last_email', form.email)
    const from = location.state?.from?.pathname
    navigate(from && from !== '/auth' ? from : '/', { replace: true })
  }

  function startCooldown(seconds) {
    setCooldown(seconds); clearInterval(cooldownTimer.current)
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

    const now = Date.now(), att = loginAttempts.current
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
    localStorage.setItem('ns_last_email', form.email)
    const from = location.state?.from?.pathname
    navigate(res.user?.role === 'admin' ? '/ns-secure-7381/' : (from && from !== '/auth' ? from : '/'), { replace: true })
  }

  async function handleReset(e) {
    e.preventDefault(); if (!resetEmail) return
    setLoad(true)
    const res = await resetPassword(resetEmail)
    setLoad(false)
    if (!res.success) { setServErr(res.error || 'Gabim. Provo përsëri.'); return }
    setResetSent(true)
  }

  async function handleAnonymous() {
    setLoad(true); const res = await goAnonymous(); setLoad(false)
    navigate(res?.success ? '/' : '/', { replace: true })
  }

  function switchTab(t) {
    setTab(t); setErrors({}); setServErr('')
    setForm(f => ({ ...f, password: '', confirmPassword: '', username: '' }))
    setStep('form')
  }

  const inp = (hasError) =>
    `w-full bg-white/[0.13] border rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30
     focus:outline-none transition-all duration-200
     ${hasError ? 'border-red-500/50 focus:border-red-400/70 focus:bg-white/[0.17]' : 'border-white/[0.14] focus:border-violet-500/70 focus:bg-white/[0.18]'}`

  const selectedPreset = avatar && !photoUrl ? avatar : null
  const btnGrad = { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', boxShadow: '0 8px 40px rgba(124,58,237,0.50)' }

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#020409 0%,#08021a 45%,#050112 75%,#020409 100%)' }}>

      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes nf1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(45px,-35px) scale(1.06)} 66%{transform:translate(-25px,25px) scale(0.96)} }
        @keyframes nf2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-55px,35px) scale(1.05)} 66%{transform:translate(35px,-25px) scale(0.95)} }
        @keyframes nf3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(35px,45px) scale(1.07)} }
        @keyframes nf4 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,-40px) scale(1.04)} }
        @keyframes twinkle { 0%,100%{opacity:var(--op)} 50%{opacity:calc(var(--op) * 3)} }
        @keyframes cardglow { 0%,100%{box-shadow:0 0 50px rgba(124,58,237,0.12),0 30px 70px rgba(0,0,0,0.55)} 50%{box-shadow:0 0 80px rgba(124,58,237,0.22),0 30px 70px rgba(0,0,0,0.55)} }
        @keyframes logopulse { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.5),0 8px 32px rgba(124,58,237,0.4)} 50%{box-shadow:0 0 0 10px rgba(124,58,237,0),0 8px 32px rgba(124,58,237,0.6)} }
        @keyframes slidein { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Nebula orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-12%] w-[650px] h-[650px] rounded-full opacity-[0.28] blur-[140px]"
          style={{ background:'radial-gradient(circle,#7c3aed,transparent 70%)', animation:'nf1 30s ease-in-out infinite' }} />
        <div className="absolute bottom-[-22%] right-[-15%] w-[550px] h-[550px] rounded-full opacity-[0.22] blur-[130px]"
          style={{ background:'radial-gradient(circle,#3b82f6,transparent 70%)', animation:'nf2 38s ease-in-out infinite' }} />
        <div className="absolute top-[35%] right-[18%] w-[320px] h-[320px] rounded-full opacity-[0.14] blur-[110px]"
          style={{ background:'radial-gradient(circle,#ec4899,transparent 70%)', animation:'nf3 24s ease-in-out infinite' }} />
        <div className="absolute top-[15%] left-[25%] w-[280px] h-[280px] rounded-full opacity-[0.11] blur-[100px]"
          style={{ background:'radial-gradient(circle,#06b6d4,transparent 70%)', animation:'nf4 44s ease-in-out infinite' }} />
      </div>

      {/* ── Starfield ── */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map(s => (
          <div key={s.id} className="absolute rounded-full bg-white"
            style={{
              '--op': s.opacity,
              width: s.size + 'px', height: s.size + 'px',
              top: s.y + '%', left: s.x + '%',
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
            }} />
        ))}
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[415px] mx-auto px-4 py-10"
        style={{ animation: 'slidein 0.45s ease-out' }}>

        <div className="rounded-3xl border border-white/[0.07] px-8 py-9"
          style={{ background:'rgba(255,255,255,0.033)', backdropFilter:'blur(36px)', animation:'cardglow 7s ease-in-out infinite' }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center mb-3"
              style={{ background:'linear-gradient(135deg,#7c3aed,#3b82f6)', animation:'logopulse 3.5s ease-in-out infinite' }}>
              <Brain size={28} color="white" strokeWidth={1.7} />
            </div>
            <h1 className="text-[19px] font-black text-white tracking-tight">NeuroSphera</h1>
            <p className="text-[11px] text-white/30 font-medium mt-0.5">Mirëqenia Mendore</p>
          </div>

          {/* ════ AVATAR STEP ════ */}
          {step === 'avatar' ? (
            <div>
              <button onClick={() => setStep('form')}
                className="flex items-center gap-1.5 text-white/35 text-xs font-semibold hover:text-white/65 mb-5 transition-colors">
                <ArrowLeft size={13} /> Kthehu
              </button>
              <h2 className="text-lg font-black text-white mb-1">Zgjidh pamjen tënde</h2>
              <p className="text-white/35 text-sm mb-5">Personalizoni profilin tuaj</p>

              <div className="flex flex-col items-center mb-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-2"
                  style={{ background:'rgba(255,255,255,0.05)', boxShadow:'0 0 0 2px rgba(124,58,237,0.4)' }}>
                  <AvatarDisplay avatar={photoUrl || avatar || 'avatar1'} size={80} />
                </div>
              </div>

              <label htmlFor="photo-upload"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/10 text-white/35 text-sm font-semibold cursor-pointer hover:border-violet-500/40 hover:text-violet-400 transition-all mb-4">
                <Camera size={14} /> Ngarko fotografinë
                <input id="photo-upload" ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {PRESETS.map(({ id, label, Component }) => (
                  <button key={id} onClick={() => { setAvatar(id); setPhotoUrl(null) }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedPreset === id ? 'border-violet-500/60 bg-violet-500/10' : 'border-white/5 bg-white/3 hover:border-white/15'
                    }`}>
                    <Component size={48} />
                    <p className="text-[10px] font-bold text-white/55">{label}</p>
                  </button>
                ))}
              </div>

              <button onClick={handleAutoGenerate}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 text-white/35 text-sm font-semibold hover:border-white/18 hover:text-white/55 transition-all mb-4">
                <Shuffle size={13} /> Gjenero rastësisht
              </button>

              <button onClick={handleFinish} disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90"
                style={btnGrad}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Duke u krijuar...</>
                  : <><Sparkles size={15} /> Krijo llogarinë</>}
              </button>
            </div>

          /* ════ CONFIRM EMAIL (fallback — shfaqet vetëm nëse Supabase ende kërkon konfirmim) ════ */
          ) : step === 'confirm' ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-amber-500/10 border border-amber-500/20">
                <Mail size={28} className="text-amber-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Një hap i fundit</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-2">
                Llogaria u krijua! Konfirmo emailin tek<br />
                <strong className="text-white/70">{form.email}</strong>
              </p>
              <p className="text-white/25 text-xs mb-6">pastaj kthehu dhe kyçu normalisht.</p>
              <button onClick={() => switchTab('login')}
                className="w-full py-3.5 rounded-2xl text-white font-black text-sm hover:opacity-90 transition-all"
                style={btnGrad}>
                Kyçu
              </button>
              <p className="text-xs text-white/20 mt-3">Nuk e gjeni emailin? Kontrolloni dosjen spam.</p>
            </div>

          /* ════ NEW PASSWORD ════ */
          ) : step === 'newpass' ? (
            <div>
              <h2 className="text-xl font-black text-white mb-1">Fjalëkalim i ri</h2>
              <p className="text-white/35 text-sm mb-5">Vendos fjalëkalimin tënd të ri.</p>
              {serverErr && <ErrorBanner msg={serverErr} />}
              <form onSubmit={handleNewPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/35 mb-1.5">Fjalëkalimi i ri</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={newPass}
                      onChange={e => { setNewPass(e.target.value); setErrors({}) }}
                      placeholder="••••••••" autoFocus className={inp(errors.newPass)} />
                    <button type="button" onClick={() => setShow(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/55 transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <FieldError msg={errors.newPass} />
                  <PasswordStrength password={newPass} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/35 mb-1.5">Konfirmo</label>
                  <div className="relative">
                    <input type={showConf ? 'text' : 'password'} value={newPassConf}
                      onChange={e => { setNewPassConf(e.target.value); setErrors({}) }}
                      placeholder="••••••••" className={inp(false)} />
                    <button type="button" onClick={() => setShowC(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/55 transition-colors">
                      {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading || !newPass || !newPassConf}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  style={btnGrad}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Duke ruajtur...</>
                    : 'Ruaj fjalëkalimin'
                  }
                </button>
              </form>
            </div>

          /* ════ RESET PASSWORD ════ */
          ) : step === 'reset' ? (
            <div>
              <button onClick={() => { setStep('form'); setResetSent(false); setServErr('') }}
                className="flex items-center gap-1.5 text-white/35 text-xs font-semibold hover:text-white/65 mb-5 transition-colors">
                <ArrowLeft size={13} /> Kthehu
              </button>
              <h2 className="text-xl font-black text-white mb-1">Rivendos fjalëkalimin</h2>
              <p className="text-white/35 text-sm mb-5">Dërgo lidhjen e rivendosjes në email.</p>

              {resetSent ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle size={28} className="text-emerald-400" />
                  </div>
                  <p className="text-white font-bold">Emaili u dërgua!</p>
                  <p className="text-white/35 text-sm">Kontrollo kutinë hyrëse dhe dosjen spam.</p>
                  <button onClick={() => switchTab('login')}
                    className="mt-2 text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
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
                      <Mail size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                    </div>
                    <button type="submit" disabled={loading || !resetEmail}
                      className="w-full py-3.5 rounded-2xl text-white font-black text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                      style={btnGrad}>
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Duke dërguar...</>
                        : 'Dërgo linkun'
                      }
                    </button>
                  </form>
                </>
              )}
            </div>

          /* ════ MAIN FORM ════ */
          ) : (
            <>
              {/* Sliding tab switcher */}
              <div className="flex rounded-2xl p-1 mb-7 relative"
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div className="absolute top-1 bottom-1 rounded-xl pointer-events-none transition-all duration-300 ease-out"
                  style={{
                    width: 'calc(50% - 4px)',
                    left: tab === 'login' ? '4px' : 'calc(50%)',
                    background: 'linear-gradient(135deg,rgba(124,58,237,0.45),rgba(59,130,246,0.35))',
                    border: '1px solid rgba(167,139,250,0.22)',
                  }} />
                <button onClick={() => switchTab('login')}
                  className={`flex-1 text-sm font-bold py-2.5 rounded-xl relative z-10 transition-colors duration-200 ${tab === 'login' ? 'text-white' : 'text-white/38 hover:text-white/65'}`}>
                  Hyr
                </button>
                <button onClick={() => switchTab('signup')}
                  className={`flex-1 text-sm font-bold py-2.5 rounded-xl relative z-10 transition-colors duration-200 ${tab === 'signup' ? 'text-white' : 'text-white/38 hover:text-white/65'}`}>
                  Regjistrohu
                </button>
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-[22px] font-black text-white">
                  {tab === 'login' ? 'Mirë se vjen!' : 'Fillo udhëtimin'}
                </h2>
                <p className="text-white/30 text-sm mt-0.5">
                  {tab === 'login' ? 'Kyçu në hapësirën tënde mendore' : 'Hap një kapitull të ri sot'}
                </p>
              </div>

              {/* Google button */}
              <button onClick={handleGoogleLogin} disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-white/75 text-sm font-semibold transition-all duration-200 mb-4 disabled:opacity-50 hover:bg-white/[0.09] active:scale-[0.99]"
                style={{ background:'rgba(255,255,255,0.065)', border:'1px solid rgba(255,255,255,0.09)' }}>
                <GoogleIcon />
                {tab === 'login' ? 'Kyçu me Google' : 'Regjistrohu me Google'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.07)' }} />
                <span className="text-[10px] text-white/18 font-semibold uppercase tracking-widest">ose</span>
                <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.07)' }} />
              </div>

              {serverErr && <ErrorBanner msg={serverErr} />}

              {/* Form */}
              <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-3">

                {tab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-white/32 mb-1.5">
                      Emri <span className="text-white/15">(opsional)</span>
                    </label>
                    <div className="relative">
                      <input type="text" value={form.username}
                        onChange={e => field('username', e.target.value)}
                        placeholder="username_yt" className={inp(errors.username)} />
                      <User size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15" />
                    </div>
                    <FieldError msg={errors.username} />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-white/32 mb-1.5">Email</label>
                  <div className="relative">
                    <input type="email" value={form.email}
                      onChange={e => field('email', e.target.value)}
                      placeholder="email@example.com" className={inp(errors.email)} />
                    {errors.email
                      ? <AlertCircle size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400" />
                      : form.email
                        ? <CheckCircle size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                        : <Mail size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15" />}
                  </div>
                  <FieldError msg={errors.email} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-white/32">Fjalëkalimi</label>
                    {tab === 'login' && (
                      <button type="button"
                        onClick={() => { setResetEmail(form.email); setResetSent(false); setServErr(''); setStep('reset') }}
                        className="text-[11px] text-white/22 hover:text-violet-400 transition-colors">
                        E harruat?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={form.password}
                      onChange={e => field('password', e.target.value)}
                      placeholder="••••••••" className={inp(errors.password)} />
                    <button type="button" onClick={() => setShow(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/55 transition-colors">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <FieldError msg={errors.password} />
                  {tab === 'signup' && <PasswordStrength password={form.password} />}
                </div>

                {tab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-white/32 mb-1.5">Konfirmo fjalëkalimin</label>
                    <div className="relative">
                      <input type={showConf ? 'text' : 'password'} value={form.confirmPassword}
                        onChange={e => field('confirmPassword', e.target.value)}
                        placeholder="••••••••" className={inp(errors.confirm)} />
                      <button type="button" onClick={() => setShowC(s => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/55 transition-colors">
                        {showConf ? <EyeOff size={14} /> : <Eye size={14} />}
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

                {/* Submit */}
                <button type="submit" disabled={loading || cooldown > 0}
                  className="w-full py-4 rounded-2xl text-white font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 !mt-5 hover:opacity-90 active:scale-[0.99]"
                  style={cooldown > 0
                    ? { background:'rgba(255,255,255,0.08)' }
                    : btnGrad
                  }>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {tab === 'login' ? 'Duke hyrë...' : 'Duke vazhduar...'}</>
                    : cooldown > 0
                      ? `Provo pas ${cooldown}s`
                      : tab === 'login' ? 'Kyçu' : 'Vazhdo →'
                  }
                </button>
              </form>

              {/* Anonymous */}
              <div className="mt-5 pt-4" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={handleAnonymous} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2 text-white/22 text-xs font-semibold hover:text-white/42 transition-colors disabled:opacity-50">
                  <UserX size={13} /> Vazhdo pa llogari
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-white/12 text-xs mt-5 font-medium tracking-wide">
          Platforma e parë shqiptare e mirëqenies mendore
        </p>
      </div>
    </div>
  )
}
