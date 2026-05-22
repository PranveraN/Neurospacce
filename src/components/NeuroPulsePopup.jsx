import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Sparkles, Brain, TrendingUp, Heart, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const SESSION_KEY = 'ns_neuropulse_popup_shown'
const DELAY_MS    = 60_000  // 1 minutë

const FEATURES = [
  { icon: Heart,      text: 'Gjurmo humorin çdo ditë'          },
  { icon: Brain,      text: 'Udhëzim AI i personalizuar'        },
  { icon: TrendingUp, text: 'Shih progresin tënd të vërtetë'   },
]

export default function NeuroPulsePopup() {
  const { user }       = useAuth()
  const navigate       = useNavigate()
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    // Shfaq vetëm për përdorues të kyçur, vetëm njëherë për sesion
    if (!user || sessionStorage.getItem(SESSION_KEY)) return

    const timer = setTimeout(() => setVisible(true), DELAY_MS)

    // Trigger alternativ: scroll 65% e faqes
    function onScroll() {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (pct >= 0.65 && !sessionStorage.getItem(SESSION_KEY)) {
        clearTimeout(timer)
        setVisible(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [user])

  function close() {
    setClosing(true)
    sessionStorage.setItem(SESSION_KEY, '1')
    setTimeout(() => setVisible(false), 380)
  }

  function goToNeuroPulse() {
    sessionStorage.setItem(SESSION_KEY, '1')
    navigate('/home')
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes np-backdrop { from{opacity:0} to{opacity:1} }
        @keyframes np-slide-up { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes np-slide-down { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(24px) scale(0.97)} }
        @keyframes np-border-spin {
          0%   { background-position: 0% 50% }
          50%  { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes np-orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12px,-8px)} }
        @keyframes np-orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-10px,10px)} }
        @keyframes np-pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.6} }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[500] flex items-center justify-center px-4"
        style={{
          background: 'rgba(2,4,9,0.72)',
          backdropFilter: 'blur(8px)',
          animation: 'np-backdrop 0.3s ease-out',
        }}
        onClick={close}
      >
        {/* Card */}
        <div
          className="relative w-full max-w-[420px] rounded-[28px] p-[1.5px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg,#7c3aed,#3b82f6,#ec4899,#7c3aed)',
            backgroundSize: '300% 300%',
            animation: closing
              ? 'np-slide-down 0.38s ease-in forwards'
              : 'np-slide-up 0.4s cubic-bezier(0.16,1,0.3,1), np-border-spin 5s linear infinite',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Inner card */}
          <div className="relative rounded-[26px] overflow-hidden px-8 py-8"
            style={{ background: 'linear-gradient(160deg,#08021a 0%,#0d0530 50%,#060118 100%)' }}>

            {/* Ambient orbs */}
            <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full opacity-25 blur-[60px] pointer-events-none"
              style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)', animation: 'np-orb1 8s ease-in-out infinite' }} />
            <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] rounded-full opacity-20 blur-[50px] pointer-events-none"
              style={{ background: 'radial-gradient(circle,#3b82f6,transparent 70%)', animation: 'np-orb2 10s ease-in-out infinite' }} />

            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X size={16} />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5 text-[11px] font-black uppercase tracking-widest"
              style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(167,139,250,0.3)', color: '#c4b5fd' }}>
              <Sparkles size={10} />
              I disponueshëm tani
            </div>

            {/* Icon + title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative shrink-0">
                <div className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 8px 32px rgba(124,58,237,0.5)' }}>
                  <Zap size={28} color="white" strokeWidth={2} />
                </div>
                {/* Live dot */}
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#08021a]"
                  style={{ animation: 'np-pulse-dot 2s ease-in-out infinite' }} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white leading-tight">NeuroPulse</h2>
                <p className="text-[13px] font-semibold"
                  style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Bashkëudhëtari yt mendor
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Mbështetja që meriton — çdo ditë, pa gjykim. NeuroPulse të ofron udhëzim të personalizuar, pikërisht kur ke nevojë.
            </p>

            {/* Feature list */}
            <div className="space-y-2.5 mb-7">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(167,139,250,0.2)' }}>
                    <Icon size={13} className="text-violet-400" />
                  </div>
                  <span className="text-sm text-white/70 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={goToNeuroPulse}
              className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', boxShadow: '0 8px 40px rgba(124,58,237,0.55)' }}
            >
              <Zap size={16} />
              Hap NeuroPulse
            </button>

            {/* Social proof */}
            <p className="text-center text-[11px] text-white/22 mt-4 font-medium">
              ⭐ 4.9 · Falas për të gjithë përdoruesit
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
