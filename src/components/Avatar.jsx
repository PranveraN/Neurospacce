export function MinimalistAvatar({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#f3f4f6"/>
      <circle cx="50" cy="37" r="17" fill="#d1d5db"/>
      <ellipse cx="50" cy="79" rx="23" ry="14" fill="#d1d5db"/>
      <circle cx="43" cy="35" r="2.5" fill="#6b7280"/>
      <circle cx="57" cy="35" r="2.5" fill="#6b7280"/>
      <path d="M 43 43 Q 50 49 57 43" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function CreativeAvatar({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="av2bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#av2bg)"/>
      <circle cx="50" cy="37" r="16" fill="rgba(255,255,255,0.3)"/>
      <circle cx="43.5" cy="35" r="2.5" fill="white"/>
      <circle cx="56.5" cy="35" r="2.5" fill="white"/>
      <path d="M 43 43 Q 50 50 57 43" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <ellipse cx="50" cy="77" rx="21" ry="13" fill="rgba(255,255,255,0.25)"/>
      <circle cx="76" cy="24" r="3"   fill="rgba(255,255,255,0.55)"/>
      <circle cx="26" cy="29" r="2"   fill="rgba(255,255,255,0.45)"/>
      <circle cx="81" cy="58" r="1.5" fill="rgba(255,255,255,0.4)"/>
    </svg>
  )
}

export function FuturisticAvatar({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="av3bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a"/>
          <stop offset="100%" stopColor="#1e293b"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#av3bg)"/>
      <circle cx="50" cy="50" r="47" fill="none" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="4 3"/>
      <circle cx="50" cy="37" r="15" fill="none" stroke="#06b6d4" strokeWidth="1.5"/>
      <circle cx="50" cy="37" r="10" fill="rgba(6,182,212,0.15)"/>
      <rect x="40" y="33.5" width="6" height="3" rx="1.5" fill="#06b6d4"/>
      <rect x="54" y="33.5" width="6" height="3" rx="1.5" fill="#06b6d4"/>
      <line x1="44" y1="42.5" x2="56" y2="42.5" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 27 79 L 36 66 L 50 70 L 64 66 L 73 79" fill="none" stroke="#06b6d4" strokeWidth="1.5"/>
      <line x1="20" y1="20" x2="27" y2="20" stroke="#22d3ee" strokeWidth="1.5"/>
      <line x1="20" y1="20" x2="20" y2="27" stroke="#22d3ee" strokeWidth="1.5"/>
      <line x1="80" y1="20" x2="73" y2="20" stroke="#22d3ee" strokeWidth="1.5"/>
      <line x1="80" y1="20" x2="80" y2="27" stroke="#22d3ee" strokeWidth="1.5"/>
    </svg>
  )
}

export function AvatarDisplay({ avatar, size = 80 }) {
  if (!avatar || avatar === 'avatar1') return <MinimalistAvatar size={size} />
  if (avatar === 'avatar2') return <CreativeAvatar size={size} />
  if (avatar === 'avatar3') return <FuturisticAvatar size={size} />
  if (typeof avatar === 'string' && avatar.startsWith('data:')) {
    return (
      <img
        src={avatar} alt="avatar"
        style={{ width: size, height: size, objectFit: 'cover', display: 'block' }}
      />
    )
  }
  return <MinimalistAvatar size={size} />
}
