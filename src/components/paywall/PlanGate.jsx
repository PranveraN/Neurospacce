import { useState } from 'react'
import { usePlan } from '../../hooks/usePlan'
import { PaywallOverlay, LockBadge } from './UpgradePrompt'

/**
 * Wraps content that requires a specific plan feature.
 *
 * mode="overlay"  — shows blurred content + overlay modal when clicked
 * mode="replace"  — replaces content with a lock placeholder
 * mode="disable"  — renders content but disabled (greyed + badge)
 */
export default function PlanGate({ feature, reason, mode = 'overlay', children, fallback }) {
  const { canUse } = usePlan()
  const [showModal, setShowModal] = useState(false)

  if (canUse(feature)) return children

  if (fallback) return fallback

  if (mode === 'replace') {
    return (
      <div
        className="relative rounded-2xl border border-violet-200 bg-violet-50 flex items-center justify-center cursor-pointer min-h-[80px]"
        onClick={() => setShowModal(true)}
      >
        <LockBadge reason={reason} />
        {showModal && <PaywallOverlay reason={reason} onClose={() => setShowModal(false)} />}
      </div>
    )
  }

  if (mode === 'disable') {
    return (
      <div className="relative opacity-60 pointer-events-none select-none">
        {children}
        <div className="absolute top-1 right-1">
          <LockBadge reason={reason} small />
        </div>
      </div>
    )
  }

  // mode === 'overlay' (default)
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none" aria-hidden>
        {children}
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-2xl"
        onClick={() => setShowModal(true)}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-black text-sm shadow-lg"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
        >
          <LockBadge reason={reason} small />
          <span>Zhblloko</span>
        </div>
      </div>
      {showModal && <PaywallOverlay reason={reason} onClose={() => setShowModal(false)} />}
    </div>
  )
}
