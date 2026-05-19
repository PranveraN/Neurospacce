import { useState, useEffect, useCallback } from 'react'
import {
  EXPERTS,
  loadExperts,
  saveExperts,
  fetchExpertsFromDB,
  upsertSpecialistToDB,
  deleteSpecialistFromDB,
  seedSpecialistsToDB,
} from '../data/expertsData'

/**
 * Source-of-truth hook for the specialists list.
 *
 * Strategy:
 *  1. Render immediately with localStorage cache (zero flicker).
 *  2. On mount: fetch from Supabase. If DB is empty, seed it once
 *     from the localStorage cache (or hardcoded defaults).
 *  3. CRUD operations update localStorage + Supabase atomically
 *     (optimistic UI — localStorage first, DB sync in background).
 */
export function useExperts() {
  const [experts, setExperts] = useState(() => loadExperts())

  // Sync from Supabase on mount
  useEffect(() => {
    let active = true
    ;(async () => {
      const dbList = await fetchExpertsFromDB()
      if (!active) return

      if (dbList === null) {
        // Supabase unreachable — keep localStorage data as-is
        return
      }

      if (dbList.length === 0) {
        // DB is empty: seed it from localStorage cache or hardcoded defaults
        const cached = loadExperts()
        const source = cached.length > 0 ? cached : EXPERTS
        await seedSpecialistsToDB(source)
        const seeded = await fetchExpertsFromDB()
        if (!active) return
        const final = seeded && seeded.length > 0 ? seeded : source
        setExperts(final)
        saveExperts(final)
      } else {
        // DB has data — it is the source of truth
        setExperts(dbList)
        saveExperts(dbList)
      }
    })()
    return () => { active = false }
  }, [])

  /**
   * Add or update a specialist.
   * Optimistic: updates localStorage + React state immediately,
   * then syncs to Supabase in background.
   */
  const saveExpert = useCallback((specialist) => {
    let displayOrder = 0
    setExperts(prev => {
      const exists = prev.some(e => e.id === specialist.id)
      const next = exists
        ? prev.map(e => e.id === specialist.id ? specialist : e)
        : [...prev, specialist]
      displayOrder = next.findIndex(e => e.id === specialist.id)
      saveExperts(next)
      return next
    })
    // Fire-and-forget DB sync
    upsertSpecialistToDB(specialist, displayOrder)
  }, [])

  /**
   * Remove a specialist by id.
   * Optimistic: updates localStorage + React state immediately,
   * then syncs to Supabase in background.
   */
  const removeExpert = useCallback((id) => {
    setExperts(prev => {
      const next = prev.filter(e => e.id !== id)
      saveExperts(next)
      return next
    })
    // Fire-and-forget DB sync
    deleteSpecialistFromDB(id)
  }, [])

  return { experts, saveExpert, removeExpert }
}
