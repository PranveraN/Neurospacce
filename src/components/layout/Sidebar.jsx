import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  Home, Radio, BookOpen, BarChart2, Zap,
  Wind, Users, User, Brain, Crown, Settings,
  Globe, LayoutDashboard, ChevronRight, Leaf, History,
} from 'lucide-react'
import LogoMark from '../LogoMark'
import { useMood } from '../../contexts/MoodContext'
import { useAuth } from '../../contexts/AuthContext'
import { usePlan } from '../../hooks/usePlan'
import { AvatarDisplay } from '../Avatar'

const NAV = [
  { to: '/home',      icon: Home,      label: 'Ballina',    color: '#8b5cf6' },
  { to: '/mood',      icon: Radio,     label: 'Humor',      color: '#ec4899' },
  { to: '/journal',   icon: BookOpen,  label: 'Ditar',      color: '#a78bfa' },
  { to: '/history',   icon: History,   label: 'Historia',   color: '#38bdf8' },
  { to: '/techniques',icon: Zap,       label: 'Teknika',    color: '#fbbf24' },
  { to: '/chat',      icon: Wind,      label: 'NeuroAI',    color: '#34d399' },
  { to: '/community', icon: Users,     label: 'Komuniteti', color: '#60a5fa' },
  { to: '/profile',   icon: User,      label: 'Profil',     color: '#c084fc' },
]

const CARD = 'rgba(255,255,255,0.04)'
const BORDER = '1px solid rgba(255,255,255,0.08)'

export default function Sidebar() {
  const { streak } = useMood()
  const { user }   = useAuth()
  const { plan }   = usePlan()
  const navigate   = useNavigate()

  const firstName = user?.username?.split(/[\s_]/)[0] || user?.email?.split('@')[0] || 'User'
  const isPremium = plan?.id === 'premium'
  const isPro     = plan?.id === 'pro'

  // Garden plants data (gamified)
  const gardenPlants = [
    { emoji: '🌱', label: 'Fokus',     level: Math.max(1, Math.min(5, Math.floor(streak / 3))) },
    { emoji: '🌺', label: 'Qetësi',    level: Math.max(1, 3) },
    { emoji: '🌻', label: 'Mirënjohje',level: Math.max(1, 4) },
  ]

  return (
    <aside
      className="w-56 h-full flex flex-col overflow-y-auto"
      style={{
        background: 'rgba(8,4,28,0.98)',
        borderRight: '1px solid rgba(139,92,246,0.15)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <LogoMark size={38} radius="rounded-2xl"/>
        <div>
          <h1 className="font-black text-base leading-tight tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-300 to-blue-400 bg-clip-text text-transparent">NeuroSphera</h1>
          <p className="text-[9px] text-violet-400/70 font-semibold tracking-widest uppercase">Shëndeti Mendor</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group relative ${
                isActive ? 'sidebar-active-glow' : 'hover:bg-white/[0.04]'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: `linear-gradient(135deg, ${color}22, ${color}0a)`, border: `1px solid ${color}33` }
                : { border: '1px solid transparent' }
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                  style={
                    isActive
                      ? { background: `${color}28`, boxShadow: `0 0 10px ${color}44` }
                      : { background: 'rgba(255,255,255,0.05)' }
                  }
                >
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2.5 : 2}
                    color={isActive ? color : 'rgba(255,255,255,0.4)'}
                  />
                </div>
                <span
                  className="text-[13px] font-semibold transition-colors duration-200"
                  style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.45)' }}
                >
                  {label}
                </span>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Neuro Garden mini widget */}
      <div className="mx-3 my-3 rounded-2xl p-4" style={{ background: CARD, border: BORDER }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Leaf size={11} className="text-green-400" />
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Neuro Garden</p>
          </div>
          <button
            onClick={() => navigate('/home')}
            aria-label="Shiko Garden"
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex justify-around">
          {gardenPlants.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-xl">{p.emoji}</span>
              <p className="text-[9px] text-white/35 font-medium">{p.label}</p>
              <p className="text-[9px] text-purple-400 font-bold">Lv{p.level}</p>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-white/25 text-center mt-2">Bimët e tua po rriten!</p>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Extra links */}
      <div className="px-3 py-2 space-y-0.5">
        <Link to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors group">
          <Globe size={13} color="rgba(255,255,255,0.3)" />
          <span className="text-[12px] text-white/30 font-medium group-hover:text-white/60 transition-colors">Faqja kryesore</span>
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors group">
            <LayoutDashboard size={13} color="rgba(251,191,36,0.5)" />
            <span className="text-[12px] text-amber-400/60 font-medium group-hover:text-amber-400 transition-colors">Paneli Admin</span>
          </Link>
        )}
      </div>

      {/* User card */}
      <div className="mx-3 mb-4 mt-1">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all group"
          style={{ background: CARD, border: BORDER }}
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 ring-2"
            style={{ ringColor: 'rgba(139,92,246,0.4)' }}>
            <AvatarDisplay avatar={user?.avatar} size={32} />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-bold text-white/90 truncate leading-tight">
              {firstName}
            </p>
            <p className="text-[10px] flex items-center gap-1 mt-0.5">
              {isPremium ? (
                <><Crown size={9} className="text-amber-400" fill="currentColor" />
                  <span className="text-amber-400 font-bold">Premium</span>
                  <span className="text-red-400">❤</span></>
              ) : isPro ? (
                <><Crown size={9} className="text-purple-400" fill="currentColor" />
                  <span className="text-purple-400 font-bold">Pro</span></>
              ) : (
                <><span className="text-white/30">Falas</span>
                  <span className="text-purple-400 font-bold">· Pro</span></>
              )}
            </p>
          </div>
          <Settings size={12} className="text-white/20 shrink-0 group-hover:text-white/50 transition-colors" />
        </button>
      </div>
    </aside>
  )
}
