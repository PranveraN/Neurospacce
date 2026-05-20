import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, MessageSquare,
  BarChart3, Settings, Brain, LogOut, Bell, Calendar,
  Menu, X, ChevronRight, Shield, Globe, ArrowLeft, Type,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AdminDashboard    from './AdminDashboard'
import AdminUsers        from './AdminUsers'
import AdminContent      from './AdminContent'
import AdminChatrooms    from './AdminChatrooms'
import AdminAnalytics    from './AdminAnalytics'
import AdminSettings     from './AdminSettings'
import AdminAppointments from './AdminAppointments'
import AdminTexts        from './AdminTexts'

const NAV_ITEMS = [
  { to: '',             icon: LayoutDashboard, label: 'Dashboard'   },
  { to: 'users',        icon: Users,           label: 'Përdoruesit' },
  { to: 'appointments', icon: Calendar,        label: 'Takimet'     },
  { to: 'content',      icon: FileText,        label: 'Përmbajtja'  },
  { to: 'chatrooms',    icon: MessageSquare,   label: 'Chatrooms'   },
  { to: 'texts',        icon: Type,            label: 'Tekstet'     },
  { to: 'analytics',    icon: BarChart3,       label: 'Analytics'   },
  { to: 'settings',     icon: Settings,        label: 'Cilësimet'   },
]

function usePageTitle() {
  const { pathname } = useLocation()
  const seg = pathname.replace('/ns-secure-7381', '').replace('/', '')
  const found = NAV_ITEMS.find(n => n.to === seg)
  return found?.label || 'Dashboard'
}

function AdminSidebar({ collapsed, onToggle, onClose }) {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()

  function handleLogout() { logout(); navigate('/') }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 shadow-lg">
          <Brain size={18} color="white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-black text-white text-sm leading-tight">NeuroSphera</p>
            <p className="text-[10px] text-violet-400 font-semibold tracking-wide">Admin Panel</p>
          </div>
        )}
        <button onClick={onToggle || onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 ml-auto">
          {collapsed ? <ChevronRight size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={`/ns-secure-7381${to ? `/${to}` : ''}`}
            end={to === ''}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
              ${isActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                {!collapsed && <span className="text-sm font-semibold">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Back to site */}
      <div className="px-2 pb-2">
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-violet-400 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <Globe size={16} className="shrink-0" />
          {!collapsed && <span className="text-sm font-semibold">Faqja kryesore</span>}
        </button>
      </div>

      {/* User info + logout */}
      <div className="px-2 pb-4 pt-2 border-t border-slate-800 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-black shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.username || 'Admin'}</p>
              <div className="flex items-center gap-1">
                <Shield size={9} className="text-violet-400" />
                <p className="text-[10px] text-violet-400 font-semibold">Administrator</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} />
          {!collapsed && <span className="text-sm font-semibold">Dil</span>}
        </button>
      </div>
    </aside>
  )
}

function AdminHeader({ onMobileMenu }) {
  const { user }        = useAuth()
  const navigate        = useNavigate()
  const pageTitle       = usePageTitle()
  const [bell, setBell] = useState(false)

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenu}
          className="md:hidden w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu size={17} />
        </button>

        <div>
          <h2 className="font-black text-white text-sm leading-tight">{pageTitle}</h2>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            NeuroSphera Admin · {new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Back to app */}
        <button
          onClick={() => navigate('/home')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={13} /> App
        </button>

        {/* Bell */}
        <button
          onClick={() => setBell(!bell)}
          className="relative w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Admin badge */}
        <div className="flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-xl px-3 py-1.5">
          <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-black shrink-0">
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-200 leading-tight">{user?.username || 'Admin'}</p>
            <p className="text-[9px] text-violet-400 font-semibold flex items-center gap-0.5">
              <Shield size={8} /> Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout() {
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:relative md:block
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminHeader onMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route index                  element={<AdminDashboard />} />
            <Route path="users"           element={<AdminUsers />}     />
            <Route path="content"         element={<AdminContent />}   />
            <Route path="chatrooms"       element={<AdminChatrooms />} />
            <Route path="appointments"    element={<AdminAppointments />} />
            <Route path="texts"           element={<AdminTexts />}     />
            <Route path="analytics"       element={<AdminAnalytics />} />
            <Route path="settings"        element={<AdminSettings />}  />
            <Route path="*"               element={<Navigate to="/ns-secure-7381" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
