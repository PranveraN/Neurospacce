import { NavLink, useLocation } from 'react-router-dom'
import { Home, MessageCircle, BarChart2, Lightbulb, BookOpen, Users, Newspaper, User } from 'lucide-react'
import { useMood } from '../../contexts/MoodContext'

const NAV_ITEMS = [
  { to: '/',           icon: Home,          label: 'Ballina'   },
  { to: '/chat',       icon: MessageCircle, label: 'NeuroAI'   },
  { to: '/mood',       icon: BarChart2,     label: 'Humori'    },
  { to: '/techniques', icon: Lightbulb,     label: 'Teknika'   },
  { to: '/journal',    icon: BookOpen,      label: 'Ditar'     },
  { to: '/community',  icon: Users,         label: 'Komunitet' },
  { to: '/blog',       icon: Newspaper,     label: 'Blog'      },
  { to: '/profile',    icon: User,          label: 'Profili'   },
]

export default function Navigation() {
  const { theme } = useMood()
  const location  = useLocation()

  const isChat = location.pathname === '/chat'

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40"
      style={{ bottom: '88px' }}
    >
      <div className="glass border-t border-white/40 shadow-soft overflow-x-auto widget-scroll">
        <div className="flex items-center px-1 py-1 gap-0.5 min-w-max mx-auto justify-center">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 no-select min-w-[52px]
                ${isActive
                  ? 'text-white shadow-glow-purple'
                  : 'text-gray-400 hover:text-gray-600'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }
                : {}
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[9px] font-medium leading-none">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
