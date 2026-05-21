import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from './supabase'
import { useAuth } from '../contexts/AuthContext'

export function usePageView() {
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const page = location.pathname
    // Don't track admin pages
    if (page.startsWith('/ns-secure-7381')) return

    supabase.from('page_views').insert({
      page,
      user_id: user?.id || null,
    }).then(() => {})
  }, [location.pathname])
}
