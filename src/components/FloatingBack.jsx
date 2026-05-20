import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

/* ─── Route config ────────────────────────────────────────────────────────── */

// Returns { label, dest } for the current pathname, or null if button should hide
function getConfig(pathname) {
  // Dynamic / prefix matches first
  if (pathname.startsWith('/articles/')) return { label: 'Kthehu te artikujt',    dest: '/library'    }
  if (pathname.startsWith('/ask/'))      return { label: 'Kthehu te psikologët',  dest: '/psikologu'  }
  if (pathname.startsWith('/book/'))     return { label: 'Kthehu te psikologut',  dest: '/psikologu?tab=book' }

  const MAP = {
    '/chat':         { label: 'Largohu nga sesioni',  dest: '/home' },
    '/journal':      { label: 'Kthehu në ballinë',    dest: '/home' },
    '/mood':         { label: 'Kthehu në ballinë',    dest: '/home' },
    '/techniques':   { label: 'Kthehu',               dest: '/home' },
    '/community':    { label: 'Kthehu',               dest: '/home' },
    '/blog':         { label: 'Kthehu te blogu',      dest: '/home' },
    '/profile':      { label: 'Kthehu',               dest: '/home' },
    '/appointments': { label: 'Kthehu te takimet',    dest: '/home' },
    '/evolution':    { label: 'Kthehu në ballinë',    dest: '/home' },
    '/history':      { label: 'Kthehu në ballinë',    dest: '/home' },
    '/tests':        { label: 'Kthehu',               dest: -1      },
    '/parenting':    { label: 'Kthehu',               dest: -1      },
    '/pricing':      { label: 'Kthehu',               dest: -1      },
    '/about':        { label: 'Kthehu',               dest: -1      },
    '/library':      { label: 'Kthehu',               dest: -1      },
    '/psikologu':    { label: 'Kthehu',               dest: -1      },
    '/brainboost':   { label: 'Kthehu',               dest: -1      },
  }
  return MAP[pathname] ?? null
}

// Pages where the button must NOT appear
const HIDDEN = new Set(['/', '/home', '/auth'])
const HIDDEN_PREFIX = ['/ns-secure-7381']

// User-shell pages that have the sidebar (desktop → button offset to clear sidebar)
const USER_SHELL = new Set([
  '/chat', '/mood', '/techniques', '/journal',
  '/community', '/blog', '/profile', '/appointments', '/history',
])

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function FloatingBack() {
  const { pathname } = useLocation()
  const navigate      = useNavigate()
  const [scrolling,   setScrolling]  = useState(false)
  const timerRef                     = useRef(null)

  const config     = getConfig(pathname)
  const isHidden   = HIDDEN.has(pathname) || HIDDEN_PREFIX.some(p => pathname.startsWith(p)) || !config
  const withSidebar = USER_SHELL.has(pathname)

  // Detect scroll to fade button while actively scrolling
  const onScroll = useCallback(() => {
    setScrolling(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setScrolling(false), 180)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    const mainEl = document.getElementById('main-scroll')
    if (mainEl) mainEl.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      mainEl?.removeEventListener('scroll', onScroll)
      clearTimeout(timerRef.current)
    }
  }, [onScroll])

  function handleBack() {
    if (!config) return
    config.dest === -1 ? navigate(-1) : navigate(config.dest)
  }

  if (isHidden) return null

  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        className={[
          'fixed z-40 pointer-events-none',
          // Mobile: above BottomNav + WidgetBar, right side (thumb-friendly)
          'bottom-[148px] right-4',
          // Desktop: bottom-left, clear sidebar width (w-56 = 14rem) when inside user shell
          withSidebar
            ? 'md:bottom-8 md:right-auto md:left-[15rem]'
            : 'md:bottom-8 md:right-auto md:left-6',
        ].join(' ')}
        initial={{ opacity: 0, x: -12, scale: 0.9 }}
        animate={{ opacity: scrolling ? 0.4 : 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -12, scale: 0.9 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <motion.button
          onClick={handleBack}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full text-[12px] font-bold select-none"
          style={{
            padding: '9px 16px 9px 12px',
            background: 'rgba(8,4,28,0.82)',
            border: '1px solid rgba(139,92,246,0.45)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 0 18px rgba(139,92,246,0.18), 0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
            color: '#c4b5fd',
          }}
          whileHover={{
            scale: 1.06,
            boxShadow: '0 0 28px rgba(139,92,246,0.55), 0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Neon left arrow */}
          <span className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)' }}>
            <ChevronLeft size={11} strokeWidth={3} style={{ color: '#a78bfa' }}/>
          </span>

          {/* Label */}
          <span className="leading-none tracking-[0.01em]">{config.label}</span>

          {/* Subtle neon ring on desktop hover — done via framer boxShadow above */}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  )
}
