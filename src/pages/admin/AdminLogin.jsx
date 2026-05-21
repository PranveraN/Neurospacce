import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Brain, Shield, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLogin() {
  const navigate             = useNavigate()
  const { login }            = useAuth()
  const [email, setEmail]    = useState('')
  const [pass,  setPass]     = useState('')
  const [show,  setShow]     = useState(false)
  const [error, setError]    = useState('')
  const [loading, setLoad]   = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const attempts   = useRef({ count: 0, windowStart: 0 })
  const cooldownTimer = useRef(null)

  // Preload the AdminLayout chunk while the user is still on the login page,
  // so the panel appears instantly after login instead of showing the dark Suspense loader.
  useEffect(() => { import('./AdminLayout') }, [])

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

  async function handleSubmit(e) {
    e.preventDefault()
    if (cooldown > 0) return
    if (!email || !pass) { setError('Plotëso të gjitha fushat'); return }

    // 5 attempts per 3 minutes
    const now = Date.now()
    const att = attempts.current
    if (now - att.windowStart > 3 * 60 * 1000) { att.count = 0; att.windowStart = now }
    if (att.count >= 5) {
      const wait = Math.ceil((att.windowStart + 3 * 60 * 1000 - now) / 1000)
      setError(`Shumë tentativa. Provo pas ${wait} sekondash.`)
      startCooldown(wait)
      return
    }

    setLoad(true); setError('')
    const res = await login({ email, password: pass })
    setLoad(false)

    if (!res.success) {
      att.count++
      if (att.count >= 5) {
        att.windowStart = Date.now()
        setError('5 tentativa dështuan. Provo pas 3 minutash.')
        startCooldown(180)
      } else {
        setError(res.error)
      }
      return
    }
    if (res.user.role !== 'admin') { setError('Kjo llogari nuk ka akses admin'); return }
    attempts.current = { count: 0, windowStart: 0 }
    navigate('/ns-secure-7381/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
            <Brain size={30} color="white" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-black text-white">NeuroSphera Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Paneli i administrimit</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 flex items-center justify-center">
              <Lock size={14} className="text-violet-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Akses i kufizuar</p>
              <p className="text-[10px] text-slate-500">Vetëm për administratorë</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 mb-4">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@NeuroSphera.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Fjalëkalimi</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || cooldown > 0}
              className={`w-full py-3.5 rounded-2xl text-white font-black text-sm transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 mt-2 ${cooldown > 0 ? 'bg-slate-600' : 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/25'}`}
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Duke u kyçur...</>
                : cooldown > 0
                  ? `Provo pas ${cooldown}s`
                  : <><Shield size={15} /> Hyr si Admin</>
              }
            </button>
          </form>

        </div>

        <p className="text-center text-[10px] text-slate-700 mt-6">
          NeuroSphera Admin Panel v1.0 · Akses i mbrojtur me JWT + RBAC
        </p>
      </div>
    </div>
  )
}
