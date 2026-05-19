import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Users, CalendarCheck } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import AskPsychologist from './AskPsychologist'
import BookAppointment from './BookAppointment'

const TABS = [
  { id: 'specialists', label: 'Specialistët', icon: Users,        desc: 'Pyet & eksploro ekspertët' },
  { id: 'book',        label: 'Rezervo Takim', icon: CalendarCheck, desc: 'Cakto seancë online' },
]

export default function PsikologuYt() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [active, setActive] = useState(tabParam === 'book' ? 'book' : 'specialists')

  function switchTab(id) {
    setActive(id)
    setSearchParams(id === 'specialists' ? {} : { tab: id }, { replace: true })
  }

  return (
    <PublicLayout>
      {/* Tab bar */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex gap-1 py-2">
            {TABS.map(t => {
              const Icon = t.icon
              const isActive = active === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={isActive
                    ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: 'white', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }
                    : { color: '#6b7280', background: 'transparent' }
                  }
                >
                  <Icon size={15}/>
                  <span>{t.label}</span>
                  {!isActive && <span className="hidden sm:inline text-xs font-normal opacity-60 ml-0.5">— {t.desc}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content — render the bare version of each page */}
      {active === 'specialists'
        ? <AskPsychologist bare />
        : <BookAppointment bare />
      }
    </PublicLayout>
  )
}
