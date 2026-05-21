import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

// ─── Read stored session from localStorage (synchronous, no network) ──────────
function readStoredSession() {
  try {
    const raw = localStorage.getItem('ns_auth')
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

// ─── Write session to localStorage ───────────────────────────────────────────
function writeStoredSession(session) {
  if (!session) return
  try {
    localStorage.setItem('ns_auth', JSON.stringify({
      access_token:  session.access_token,
      refresh_token: session.refresh_token,
      expires_in:    session.expires_in,
      expires_at:    session.expires_at,
      token_type:    'bearer',
      user:          session.user,
    }))
  } catch {}
}

const AuthContext = createContext(null)

// ─── Validation helpers (kept for Auth.jsx form validation) ──────────────────
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(pw) {
  const errors = []
  if (pw.length < 8)       errors.push('Minimumi 8 karaktere')
  if (!/[A-Z]/.test(pw))   errors.push('Të paktën 1 shkronjë e madhe')
  if (!/[0-9]/.test(pw))   errors.push('Të paktën 1 numër')
  return errors
}

export function validateSignup({ email, password, confirmPassword, username }) {
  const errors = {}
  if (!email)                    errors.email    = 'Email është i detyrueshëm'
  else if (!validateEmail(email)) errors.email    = 'Email i pavlefshëm'

  if (!password)                 errors.password = 'Fjalëkalimi është i detyrueshëm'
  else {
    const pwErrors = validatePassword(password)
    if (pwErrors.length)         errors.password = pwErrors[0]
  }

  if (!confirmPassword)          errors.confirm  = 'Konfirmo fjalëkalimin'
  else if (password !== confirmPassword) errors.confirm = 'Fjalëkalimet nuk përputhen'

  if (username && username.length < 3) errors.username = 'Minimumi 3 karaktere'
  return errors
}

// ─── Kept for backward compat (no longer stores anything) ────────────────────
export function getLoginHistory() { return [] }

// ─── Fetch profile row from DB ────────────────────────────────────────────────
async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('[AuthContext] fetchProfile error:', error.message)
    return null
  }
  return data
}

// ─── Merge Supabase session + profile into our app user shape ────────────────
function buildUser(supabaseUser, profile) {
  if (!supabaseUser) return null
  return {
    id:        supabaseUser.id,
    email:     supabaseUser.email,
    username:  profile?.username || supabaseUser.email.split('@')[0],
    role:      profile?.role     || 'user',
    plan:      profile?.plan     || 'free',
    status:    profile?.status   || 'active',
    avatar:    profile?.avatar   || 'avatar1',
    createdAt: profile?.created_at,
    anonymous: supabaseUser.is_anonymous || false,
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  // undefined = still loading, null = not logged in, object = logged in
  const [user,        setUser]        = useState(undefined)
  const [loading,     setLoading]     = useState(true)
  const [allUsers,    setAllUsers]    = useState([])
  const [accessToken, setAccessToken] = useState(null)

  // In-memory profile cache — prevents duplicate fetchProfile calls on login
  // (login() and onAuthStateChange both call fetchProfile for the same userId)
  const profileCache = useRef({})
  // Timestamp set at login() start — suppress ALL SIGNED_OUT events that fire
  // within 30 s of login (supabase can fire up to two SIGNED_OUTs during
  // setSession: one when clearing the stale session, one from its internal cleanup).
  const loginStartedAt = useRef(0)
  // Keep for backward-compat reference; actual guard uses loginStartedAt
  const suppressNextSignedOut = useRef(false)

  async function fetchProfileCached(userId) {
    if (profileCache.current[userId]) return profileCache.current[userId]
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) { console.error('[AuthContext] fetchProfile error:', error.message); return null }
    if (data) profileCache.current[userId] = data
    return data
  }

  // ── Silent session refresh (used by visibility + periodic checks) ────────────
  const silentRefresh = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error || !session) return false
      writeStoredSession(session)
      const profile = await fetchProfileCached(session.user.id)
      setUser(buildUser(session.user, profile))
      setAccessToken(session.access_token)
      return true
    } catch { return false }
  }, [])

  // ── Listen to Supabase auth state ─────────────────────────────────────────
  useEffect(() => {
    // Try getSession() with fallback to localStorage if it times out.
    // This prevents logout caused by slow networks or mobile backgrounding.
    const timeout = new Promise(r =>
      setTimeout(() => r({ data: { session: null }, timedOut: true }), 10000)
    )

    Promise.race([
      supabase.auth.getSession().then(r => ({ ...r, timedOut: false })),
      timeout,
    ]).then(async ({ data: { session }, timedOut }) => {
      if (session) {
        writeStoredSession(session)
        const profile = await fetchProfileCached(session.user.id)
        setUser(buildUser(session.user, profile))
        setAccessToken(session.access_token)
        setLoading(false)
        return
      }

      // No session from Supabase — try localStorage fallback before logging out.
      // This handles: timeout, slow network, mobile wake-up, Vite hot-reload.
      const stored = readStoredSession()
      if (stored?.user && stored?.refresh_token) {
        // We have stored creds — restore user immediately, then refresh silently.
        const profile = await fetchProfileCached(stored.user.id).catch(() => null)
        setUser(buildUser(stored.user, profile))
        setLoading(false)
        // Refresh in background — updates token without interrupting the user
        silentRefresh()
        return
      }

      // Truly no session anywhere
      setUser(null)
      setLoading(false)
    })

    // Keep listening for auth events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Suppress ANY SIGNED_OUT that fires within 30 s of login() starting.
          // supabase can fire two SIGNED_OUTs during setSession (stale-session
          // clear + internal cleanup). Without this guard the second one would
          // null out the user right after login.
          if (Date.now() - loginStartedAt.current < 30_000) return
          setUser(null)
          setAccessToken(null)
          localStorage.removeItem('ns_auth')
          return
        }
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION')) {
          // Suppress SIGNED_IN fired by setSession inside login() — login() handles
          // setUser directly via raw-fetch profile, so this event would overwrite the role.
          // Google OAuth SIGNED_IN is NOT suppressed (loginStartedAt resets on page load).
          if (event === 'SIGNED_IN' && Date.now() - loginStartedAt.current < 15_000) return
          writeStoredSession(session) // keep localStorage in sync on every refresh
          const profile = await fetchProfileCached(session.user.id)
          setUser(buildUser(session.user, profile))
          setAccessToken(session.access_token)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [silentRefresh])

  // ── Refresh when tab becomes visible (mobile wake-up, Alt+Tab) ───────────
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState !== 'visible') return
      const stored = readStoredSession()
      if (!stored?.expires_at) return
      const secsLeft = stored.expires_at - Date.now() / 1000
      // Refresh proactively if token expires within 10 minutes
      if (secsLeft < 600) silentRefresh()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [silentRefresh])

  // ── Periodic refresh every 8 minutes (keeps long sessions alive) ──────────
  useEffect(() => {
    if (!user) return
    const id = setInterval(() => {
      const stored = readStoredSession()
      if (!stored?.expires_at) return
      const secsLeft = stored.expires_at - Date.now() / 1000
      if (secsLeft < 600) silentRefresh()
    }, 8 * 60 * 1000)
    return () => clearInterval(id)
  }, [user, silentRefresh])

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    try {
      const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
      const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

      // A stale refresh token in ns_auth makes supabase-js hold its internal
      // lock indefinitely. Clear it first so the lock is free, then use a raw
      // fetch that bypasses the lock entirely. Mark the login start time so the
      // SIGNED_OUT handler suppresses all events for 30 s (supabase can fire
      // multiple SIGNED_OUTs during setSession).
      loginStartedAt.current = Date.now()
      suppressNextSignedOut.current = true   // kept for legacy; guard uses timestamp
      localStorage.removeItem('ns_auth')

      const ac  = new AbortController()
      const tid = setTimeout(() => ac.abort(), 20000)
      let res, body
      try {
        res  = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
          method:  'POST',
          headers: {
            apikey:         SUPA_KEY,
            Authorization:  `Bearer ${SUPA_KEY}`,
            'Content-Type': 'application/json',
          },
          body:   JSON.stringify({ email, password }),
          signal: ac.signal,
        })
        body = await res.json()
      } finally {
        clearTimeout(tid)
      }

      if (!res.ok || body.error) {
        const raw = body.error_description || body.error_code || body.error || body.message || body.msg || ''
        const msg =
          raw.includes('Invalid login credentials') || raw.includes('invalid_credentials')
            ? 'Email ose fjalëkalim i gabuar'
            : raw.includes('Email not confirmed')
            ? 'Konfirmo email-in tënd para se të hysh'
            : raw.includes('too many requests')
            ? 'Shumë tentativa. Provo pas disa minutash.'
            : raw || `Gabim HTTP ${res.status}`
        return { success: false, error: msg }
      }

      // Persist session to localStorage immediately (bypasses supabase-js lock)
      writeStoredSession({ ...body, user: body.user })
      setAccessToken(body.access_token)

      // Fire setSession in background — supabase-js needs it for subsequent queries.
      // We do NOT await it here: awaiting caused a deadlock in the old code because
      // supabase.from() queued behind the same internal lock that setSession held.
      // Profile fetch uses raw REST (no lock dependency), so login() returns immediately.
      supabase.auth.setSession({
        access_token:  body.access_token,
        refresh_token: body.refresh_token,
      }).catch(() => {})

      // Fetch profile via raw REST — completely independent of the supabase-js lock.
      let profile = profileCache.current[body.user.id] || null
      if (!profile) {
        try {
          const pr = await fetch(
            `${SUPA_URL}/rest/v1/profiles?id=eq.${body.user.id}&select=*&limit=1`,
            {
              headers: {
                apikey:        SUPA_KEY,
                Authorization: `Bearer ${body.access_token}`,
                Accept:        'application/json',
              },
            }
          )
          if (pr.ok) {
            const rows = await pr.json()
            profile = rows?.[0] || null
            if (profile) profileCache.current[body.user.id] = profile
          }
        } catch {}
      }

      if (profile?.status === 'blocked') {
        return { success: false, error: 'Llogaria juaj është e bllokuar. Kontaktoni administratorin.' }
      }

      const u = buildUser(body.user, profile)
      console.log('[login] buildUser result:', u)
      setUser(u)

      return { success: true, user: u }
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Auth endpoint nuk u përgjigj pas 20s. Kontrollo VITE_SUPABASE_URL në .env.local.' }
      }
      return { success: false, error: `Gabim rrjeti: ${err?.message || 'i papritur'}` }
    }
  }, [])

  // ── SIGNUP ────────────────────────────────────────────────────────────────
  const signup = useCallback(async ({ email, password, username, avatar }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // These go into auth.users.raw_user_meta_data
        // Our DB trigger reads them to create the profiles row
        data: {
          username: username || email.split('@')[0],
          avatar:   avatar   || 'avatar1',
        },
      },
    })

    if (error) {
      const msg = error.message.includes('already registered')
        ? 'Ky email është tashmë i regjistruar'
        : error.message
      return { success: false, error: msg }
    }

    // If email confirmation is disabled in Supabase → user is immediately active
    // If enabled → data.session will be null until confirmed
    if (data.session) {
      const profile = await fetchProfile(data.user.id)
      const u = buildUser(data.user, profile)
      setUser(u)
      return { success: true, user: u, requiresConfirmation: false }
    }

    return { success: true, requiresConfirmation: true }
  }, [])

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    // Clear local state immediately — don't wait on supabase-js lock
    localStorage.removeItem('ns_auth')
    setUser(null)
    setAccessToken(null)
    // Signal server-side revocation in background (best-effort, 5s cap)
    Promise.race([
      supabase.auth.signOut(),
      new Promise(r => setTimeout(r, 5000)),
    ]).catch(() => {})
  }, [])

  // ── UPDATE OWN PROFILE (avatar, username) ─────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: 'Not logged in' }
    // Only allow safe fields — never role, plan, status
    const safe = {}
    if (updates.username !== undefined) safe.username = updates.username
    if (updates.avatar   !== undefined) safe.avatar   = updates.avatar

    const { error } = await supabase
      .from('profiles')
      .update(safe)
      .eq('id', user.id)

    if (!error) {
      // Invalidate cache so the next token-refresh re-fetches fresh data
      delete profileCache.current[user.id]
      setUser(prev => ({ ...prev, ...safe }))
    }
    return { error }
  }, [user])

  // ── ADMIN: fetch all users ─────────────────────────────────────────────────
  const fetchAllUsers = useCallback(async () => {
    if (user?.role !== 'admin') return []
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setAllUsers(data)
    return data || []
  }, [user?.role])

  // ── ADMIN: block / unblock ────────────────────────────────────────────────
  const blockUser = useCallback(async (id) => {
    const { error } = await supabase.from('profiles').update({ status: 'blocked' }).eq('id', id)
    if (!error) setAllUsers(p => p.map(u => u.id === id ? { ...u, status: 'blocked' } : u))
    return !error
  }, [])

  const unblockUser = useCallback(async (id) => {
    const { error } = await supabase.from('profiles').update({ status: 'active' }).eq('id', id)
    if (!error) setAllUsers(p => p.map(u => u.id === id ? { ...u, status: 'active'  } : u))
    return !error
  }, [])

  // ── ADMIN: change role ────────────────────────────────────────────────────
  const changeRole = useCallback(async (id, role) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (!error) setAllUsers(p => p.map(u => u.id === id ? { ...u, role } : u))
    return !error
  }, [])

  // ── ADMIN: change plan ────────────────────────────────────────────────────
  const changePlan = useCallback(async (id, plan) => {
    const { error } = await supabase.from('profiles').update({ plan }).eq('id', id)
    if (!error) setAllUsers(p => p.map(u => u.id === id ? { ...u, plan } : u))
    return !error
  }, [])

  // ── ADMIN: delete user ────────────────────────────────────────────────────
  // Note: deletes the profile row. The auth.users row can only be deleted
  // server-side (Supabase Edge Function with service role key).
  const deleteUser = useCallback(async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (!error) setAllUsers(p => p.filter(u => u.id !== id))
    return !error
  }, [])

  // ── ANONYMOUS SIGN-IN ─────────────────────────────────────────────────────
  // Requires "Anonymous sign-ins" to be enabled in Supabase Dashboard →
  // Authentication → Providers → Anonymous. Gracefully falls back if disabled.
  const goAnonymous = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error || !data?.user) return { success: false, error: error?.message }
      const profile = await fetchProfileCached(data.user.id)
      const u = buildUser(data.user, profile)
      setUser(u)
      return { success: true, user: u }
    } catch (err) {
      return { success: false, error: err?.message }
    }
  }, [])

  // ── PASSWORD RESET ─────────────────────────────────────────────────────────
  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }, [])

  // ── Derived flags ──────────────────────────────────────────────────────────
  const isAdmin     = user?.role === 'admin'
  const isModerator = user?.role === 'moderator' || user?.role === 'admin'
  const isPremium   = user?.plan === 'premium'   || user?.plan === 'admin'
  const isAnonymous = user?.anonymous === true

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      accessToken,
      allUsers,
      login,
      signup,
      logout,
      updateProfile,
      fetchAllUsers,
      blockUser,
      unblockUser,
      changeRole,
      changePlan,
      deleteUser,
      isAdmin,
      isModerator,
      isPremium,
      isAnonymous,
      goAnonymous,
      resetPassword,
      silentRefresh,
      MOCK_DB: { users: allUsers, admins: [] },
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
