import { NavLink, Link } from 'react-router-dom'
import { Home, MessageCircle, BarChart2, Lightbulb, BookOpen, Users, Newspaper, User, Globe, FlaskConical, Baby, CalendarCheck, History } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/home',       icon: Home,          label: 'Ballina',  from: '#6d28d9', to2: '#8b5cf6', soft: '#ede9fe' },
  { to: '/chat',       icon: MessageCircle, label: 'NeuroAI',  from: '#1d4ed8', to2: '#3b82f6', soft: '#dbeafe' },
  { to: '/mood',       icon: BarChart2,     label: 'Humori',   from: '#065f46', to2: '#10b981', soft: '#d1fae5' },
  { to: '/techniques', icon: Lightbulb,     label: 'Teknika',  from: '#b45309', to2: '#f59e0b', soft: '#fef3c7' },
  { to: '/journal',    icon: BookOpen,      label: 'Ditar',    from: '#9d174d', to2: '#ec4899', soft: '#fce7f3' },
  { to: '/history',    icon: History,       label: 'Historia', from: '#0e7490', to2: '#0891b2', soft: '#ecfeff' },
  { to: '/tests',      icon: FlaskConical,  label: 'Testet',   from: '#0e7490', to2: '#0891b2', soft: '#ecfeff' },
  { to: '/parenting',    icon: Baby,          label: 'Prindërit', from: '#9d174d', to2: '#ec4899', soft: '#fdf2f8' },
  { to: '/appointments', icon: CalendarCheck, label: 'Takimet',   from: '#0e7490', to2: '#0891b2', soft: '#ecfeff' },
  { to: '/community',  icon: Users,         label: 'Bashkësi',  from: '#0e7490', to2: '#06b6d4', soft: '#cffafe' },
  { to: '/blog',       icon: Newspaper,     label: 'Blog',     from: '#3730a3', to2: '#6366f1', soft: '#e0e7ff' },
  { to: '/profile',    icon: User,          label: 'Profili',  from: '#334155', to2: '#64748b', soft: '#f1f5f9' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-[76px] left-0 right-0 z-40 px-3">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-xl overflow-x-auto widget-scroll">
        <div className="flex items-center px-2 py-1.5 gap-0.5 min-w-max">
          {/* Public site link */}
          <Link
            to="/"
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 no-select min-w-[56px] group"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 bg-violet-50 group-active:scale-95">
              <Globe size={18} strokeWidth={1.8} color="#7c3aed" />
            </div>
            <span className="text-[9px] font-bold leading-none text-violet-400">Kryefaqja</span>
          </Link>

          {NAV_ITEMS.map(({ to, icon: Icon, label, from, to2, soft }) => (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 no-select min-w-[56px] group"
            >
              {({ isActive }) => (
                <>
                  {/* Icon bubble */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={
                      isActive
                        ? {
                            background: `linear-gradient(135deg, ${from}, ${to2})`,
                            boxShadow: `0 4px 14px ${from}55`,
                            transform: 'scale(1.1)',
                          }
                        : { background: 'transparent' }
                    }
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      color={isActive ? 'white' : '#9ca3af'}
                      style={!isActive ? {} : {}}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className="text-[9px] font-bold leading-none transition-colors duration-200"
                    style={{ color: isActive ? from : '#d1d5db' }}
                  >
                    {label}
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: to2 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
