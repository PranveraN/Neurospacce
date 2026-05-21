import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const HIERARCHY = { user: 1, moderator: 2, admin: 3 }

export default function ProtectedRoute({ children, requiredRole = 'user', redirectTo }) {
  const { user } = useAuth()
  const location  = useLocation()
  const [timedOut, setTimedOut] = useState(false)

  // Start a 12 s safety-net timer only while user is still undefined.
  // Clears immediately once user resolves to any value (null or object).
  useEffect(() => {
    if (user !== undefined) return
    const id = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(id)
  }, [user])

  // ── User is already resolved — decide immediately, no loading wait ──────────
  // This is the key fix: if user is set (even while AuthContext.loading is still
  // true due to a supabase-js lock), we render immediately instead of spinning.
  if (user !== undefined) {
    console.log('[ProtectedRoute] user resolved:', user?.role ?? 'null', '| required:', requiredRole)
    if (!user) {
      return <Navigate to={redirectTo ?? '/auth'} state={{ from: location }} replace />
    }
    const userLevel     = HIERARCHY[user.role] ?? 1
    const requiredLevel = HIERARCHY[requiredRole] ?? 1
    if (userLevel < requiredLevel) {
      console.log('[ProtectedRoute] insufficient role – redirecting')
      const fallback = user.role === 'admin' ? '/ns-secure-7381/' : '/'
      return <Navigate to={redirectTo ?? fallback} replace />
    }
    console.log('[ProtectedRoute] access granted – rendering children')
    return children
  }

  console.log('[ProtectedRoute] user still undefined – showing spinner')

  // ── user is still undefined (auth not yet resolved) ─────────────────────────
  if (!timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg,#030711,#0e0525,#030711)' }}>
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
      </div>
    )
  }

  // 12 s timed out and user is still unknown — treat as not logged in
  return <Navigate to={redirectTo ?? '/auth'} state={{ from: location }} replace />
}
