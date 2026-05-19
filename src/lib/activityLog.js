import { supabase } from './supabase'

const MAX_ENTRIES = 50

function lsKey(userId) {
  return `ns_activity_${userId}`
}

function lsRead(userId) {
  try {
    const raw = localStorage.getItem(lsKey(userId))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function lsWrite(userId, list) {
  try { localStorage.setItem(lsKey(userId), JSON.stringify(list)) } catch {}
}

// ── Core API ──────────────────────────────────────────────────────────────────

/**
 * Write to localStorage immediately, then fire-and-forget Supabase insert.
 * @param {string} userId
 * @param {{ type: string, icon?: string, label?: string, route?: string }} entry
 * @returns {void}
 */
export function logActivity(userId, entry) {
  if (!userId) return

  const item = { ...entry, time: new Date().toISOString(), id: Date.now() }

  // Write to localStorage immediately (synchronous, offline-safe)
  const list = lsRead(userId)
  list.unshift(item)
  if (list.length > MAX_ENTRIES) list.length = MAX_ENTRIES
  lsWrite(userId, list)

  // Fire-and-forget Supabase insert (don't await — never blocks callers)
  supabase
    .from('activity_logs')
    .insert({
      user_id:   userId,
      type:      entry.type,
      icon:      entry.icon  || '📌',
      label:     entry.label || '',
      route:     entry.route || '/',
      logged_at: item.time,
    })
    .then(({ error }) => {
      // Silently ignore — localStorage copy is already saved
      if (error && import.meta.env.DEV) console.warn('[activityLog] sync failed:', error.message)
    })
}

/**
 * @param {string} userId
 * @returns {{ id: number, type: string, icon: string, label: string, route: string, time: string }[]}
 */
export function getActivity(userId) {
  if (!userId) return []
  return lsRead(userId)
}

/**
 * Fetches the latest entries from Supabase and merges with pending localStorage writes.
 * DB is authoritative; local-only entries newer than the oldest DB row are preserved.
 * @param {string} userId
 * @returns {Promise<{ id: number|string, type: string, icon: string, label: string, route: string, time: string }[]>}
 */
export async function syncActivitiesFromDB(userId) {
  if (!userId) return lsRead(userId)

  const { data, error } = await supabase
    .from('activity_logs')
    .select('id, type, icon, label, route, logged_at')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(MAX_ENTRIES)

  if (error || !data?.length) return lsRead(userId)

  // Normalise DB rows to the same shape as localStorage entries
  const dbList = data.map(r => ({
    id:    r.id,
    type:  r.type,
    icon:  r.icon,
    label: r.label,
    route: r.route,
    time:  r.logged_at,
  }))

  // Merge: DB is authoritative for cross-device data; keep local entries
  // that are newer than the oldest DB entry so we don't lose pending writes
  const oldest  = new Date(dbList[dbList.length - 1]?.time || 0)
  const lsOnly  = lsRead(userId).filter(e => new Date(e.time) > oldest && !dbList.some(d => d.time === e.time))
  const merged  = [...lsOnly, ...dbList]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, MAX_ENTRIES)

  lsWrite(userId, merged)
  return merged
}

/**
 * Clears localStorage and deletes all rows from Supabase for this user.
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function clearActivity(userId) {
  if (!userId) return
  try { localStorage.removeItem(lsKey(userId)) } catch {}

  // Best-effort DB delete
  await supabase
    .from('activity_logs')
    .delete()
    .eq('user_id', userId)
}

// ── Pre-built log helpers ─────────────────────────────────────────────────────
export const ActivityLog = {
  chat:      (userId)        => logActivity(userId, { type: 'chat',      icon: '🤖', label: 'Bisedë me NeuroAI',              route: '/chat'       }),
  mood:      (userId, score) => logActivity(userId, { type: 'mood',      icon: '😊', label: `Humor i regjistruar: ${score}/10`, route: '/mood'      }),
  journal:   (userId)        => logActivity(userId, { type: 'journal',   icon: '📓', label: 'Hyrje e re në journal',           route: '/journal'    }),
  technique: (userId, title) => logActivity(userId, { type: 'technique', icon: '💡', label: `Teknikë: ${title}`,               route: '/techniques' }),
  article:   (userId, title) => logActivity(userId, { type: 'article',   icon: '📖', label: `Artikull: ${title}`,              route: '/blog'       }),
  test:      (userId, title) => logActivity(userId, { type: 'test',      icon: '🧪', label: `Test: ${title}`,                  route: '/tests'      }),
}
