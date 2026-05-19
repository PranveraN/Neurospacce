import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children, requiredRole = 'user', redirectTo }) {
  const { user, loading } = useAuth()
  const location          = useLocation()

  // Still waiting for Supabase session — don't redirect yet
  if (loading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to={redirectTo ?? '/auth'} state={{ from: location }} replace />
  }

  // Role hierarchy: admin > moderator > user
  const HIERARCHY = { user: 1, moderator: 2, admin: 3 }
  const userLevel     = HIERARCHY[user.role] ?? 1
  const requiredLevel = HIERARCHY[requiredRole] ?? 1

  if (userLevel < requiredLevel) {
    const fallback = user.role === 'admin' ? '/admin' : '/'
    return <Navigate to={redirectTo ?? fallback} replace />
  }

  return children
}
