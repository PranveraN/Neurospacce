import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Disable browser's own scroll restoration — we handle it ourselves.
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

export default function ScrollToTop() {
  const { pathname } = useLocation()

  // useLayoutEffect fires synchronously before the browser paints,
  // so our reset always wins over browser scroll restoration.
  useLayoutEffect(() => {
    // Standard window scroll (all public pages + mobile)
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Desktop app shell container (/home, /chat, /mood, etc.)
    const main = document.getElementById('main-scroll')
    if (main) main.scrollTop = 0
  }, [pathname])

  return null
}
