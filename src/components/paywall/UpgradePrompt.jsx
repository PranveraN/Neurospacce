import { Link } from 'react-router-dom'
import { Sparkles, X, ArrowRight, Heart, Star, Zap, TrendingUp } from 'lucide-react'
import { PLANS, UPGRADE_MESSAGES } from '../../data/plansData'
import { usePlan } from '../../hooks/usePlan'

// ─── Tone helpers ───────────────────────────────────────────────────────────
// soft = gentle nudge, doesn't feel like a wall
// warm = benefit-first, emotional invitation
function getToneStyle(tone) {
  if (tone === 'warm') {
    return {
      bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
      iconBg: 'linear-gradient(135deg,#7c3aed,#a855f7)',
      accent: '#7c3aed',
      pill: { bg: 'rgba(124,58,237,0.12)', text: '#7c3aed', border: 'rgba(124,58,237,0.25)' },
    }
  }
  return {
    bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    iconBg: 'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    accent: '#6366f1',
    pill: { bg: 'rgba(99,102,241,0.10)', text: '#4f46e5', border: 'rgba(99,102,241,0.20)' },
  }
}

function FeatureIcon({ tone }) {
  const style = getToneStyle(tone)
  const Icon = tone === 'warm' ? Heart : Sparkles
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
      style={{ background: style.iconBg }}
    >
      <Icon size={26} color="white" />
    </div>
  )
}

// ─── Inline lock badge ──────────────────────────────────────────────────────
export function LockBadge({ reason, small = false }) {
  const msg = UPGRADE_MESSAGES[reason] || { title: 'Kërkon Pro', feature: 'Pro' }
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full font-bold text-white ${small ? 'text-[9px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1'}`}
      style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}
      title={msg.title}
    >
      <Star size={small ? 7 : 9} fill="white" strokeWidth={0} />
      {!small && 'Pro'}
    </div>
  )
}

// ─── Inline usage bar ───────────────────────────────────────────────────────
export function UsageBar({ current, limit, label, colorClass = 'bg-violet-500' }) {
  if (limit === Infinity) return null
  const pct = Math.min(100, (current / limit) * 100)
  const nearLimit = pct >= 80
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className={nearLimit ? 'text-amber-600 font-bold' : ''}>{label}</span>
      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${nearLimit ? 'bg-amber-500' : colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={nearLimit ? 'text-amber-600 font-bold' : ''}>
        {current}/{limit}
      </span>
    </div>
  )
}

// ─── Full-screen overlay paywall ────────────────────────────────────────────
export function PaywallOverlay({ reason, onClose }) {
  const msg = UPGRADE_MESSAGES[reason] || {
    title: 'Hapi tjetër kërkon Pro',
    desc: 'Vazhdo udhëtimin tënd me mbështetje të plotë nga psikologë të verifikuar.',
    feature: 'Akses Pro',
    tone: 'warm',
  }
  const { planId } = usePlan()
  const targetPlan = planId === 'free' ? 'pro' : 'premium'
  const target = PLANS[targetPlan]
  const tone = msg.tone || 'warm'
  const style = getToneStyle(tone)

  // Some messages route elsewhere (e.g. bookAppointment → /ask)
  const ctaLink = msg.cta === 'Shfleto psikologët' ? '/ask' : '/pricing'
  const ctaLabel = msg.cta || `Zbulo planin Pro për €${target.price}/muaj`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative text-center">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={15} className="text-slate-400" />
          </button>
        )}

        <FeatureIcon tone={tone} />

        <h3 className="text-xl font-black text-slate-800 mb-2 leading-snug">{msg.title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{msg.desc}</p>

        {/* Feature highlight pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-semibold"
          style={{
            background: style.pill.bg,
            color: style.pill.text,
            border: `1px solid ${style.pill.border}`,
          }}
        >
          <Sparkles size={14} />
          {msg.feature}
        </div>

        <Link
          to={ctaLink}
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 mb-3"
          style={{ background: style.bg }}
        >
          {ctaLabel}
          <ArrowRight size={15} />
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Tani jo, faleminderit
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Inline banner (soft nudge, doesn't block) ─────────────────────────────
export function UpgradeBanner({ reason, compact = false }) {
  const msg = UPGRADE_MESSAGES[reason] || {
    title: 'Shfrytëzo më shumë me Pro',
    desc: 'Akses te psikologë dhe analitikë e avancuar.',
    tone: 'warm',
  }
  const { planId } = usePlan()
  const targetPlan = planId === 'free' ? 'pro' : 'premium'
  const target = PLANS[targetPlan]
  const tone = msg.tone || 'warm'
  const style = getToneStyle(tone)

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-3 py-2"
        style={{
          background: style.pill.bg,
          border: `1px solid ${style.pill.border}`,
        }}
      >
        <Sparkles size={13} style={{ color: style.accent }} className="shrink-0" />
        <p className="text-xs flex-1" style={{ color: style.accent }}>{msg.title}</p>
        <Link
          to="/pricing"
          className="text-xs font-bold whitespace-nowrap hover:opacity-80"
          style={{ color: style.accent }}
        >
          Pro →
        </Link>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: style.pill.bg, border: `1px solid ${style.pill.border}` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: style.iconBg }}
        >
          <Sparkles size={16} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">{msg.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{msg.desc}</p>
        </div>
        <Link
          to="/pricing"
          className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl text-white transition-all hover:opacity-90"
          style={{ background: style.bg }}
        >
          Pro →
        </Link>
      </div>
    </div>
  )
}

// ─── Limit reached card (inline, replaces content area) ────────────────────
export function LimitReachedCard({ reason, resetInfo }) {
  const msg = UPGRADE_MESSAGES[reason] || {
    title: 'Kufiri u arrit',
    desc: 'Vazhdo nesër ose zbulo planin Pro.',
    tone: 'soft',
  }
  const tone = msg.tone || 'soft'
  const style = getToneStyle(tone)

  const Icon = tone === 'warm' ? TrendingUp : Zap

  return (
    <div className="text-center py-10 px-6">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: style.iconBg }}
      >
        <Icon size={24} color="white" />
      </div>

      <h3 className="text-lg font-black text-slate-800 mb-2">{msg.title}</h3>
      <p className="text-sm text-slate-500 mb-2 leading-relaxed max-w-xs mx-auto">{msg.desc}</p>

      {resetInfo && (
        <p className="text-xs text-slate-400 mb-6">{resetInfo}</p>
      )}
      {!resetInfo && <div className="mb-6" />}

      <Link
        to="/pricing"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95"
        style={{ background: style.bg }}
      >
        Shiko planin Pro
        <ArrowRight size={15} />
      </Link>
    </div>
  )
}
