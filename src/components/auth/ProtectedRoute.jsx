import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children, requiredRole = 'user', redirectTo }) {
  const { user, loading } = useAuth()
  const location          = useLocation()
  const [timedOut, setTimedOut] = useState(false)

  // Safety net: if auth hasn't resolved after 12s, treat as not logged in.
  // AuthContext already has a 10s getSession timeout, so this only catches
  // unexpected hangs after that.
  useEffect(() => {
    if (!loading && user !== undefined) return
    const id = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(id)
  }, [loading, user])

  // Still waiting for Supabase session — don't redirect yet
  if (!timedOut && (loading || user === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg,#030711,#0e0525,#030711)' }}>
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in (or timed out)
  if (!user) {
    return <Navigate to={redirectTo ?? '/auth'} state={{ from: location }} replace />
  }

  // Role hierarchy: admin > moderator > user
  const HIERARCHY = { user: 1, moderator: 2, admin: 3 }
  const userLevel     = HIERARCHY[user.role] ?? 1
  const requiredLevel = HIERARCHY[requiredRole] ?? 1

  if (userLevel < requiredLevel) {
    const fallback = user.role === 'admin' ? '/ns-secure-7381/' : '/'
    return <Navigate to={redirectTo ?? fallback} replace />
  }

  return children
}
