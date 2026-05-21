import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext({
  editMode: false, toggle: () => {}, flash: () => {}, flashVisible: false,
  lang: 'sq', setLang: () => {},
  dbTexts: {}, saveToDb: async () => {}, publishAll: async () => ({}), syncState: 'idle',
})

export function EditModeProvider({ children }) {
  const [editMode,     setEditMode]     = useState(false)
  const [flashVisible, setFlashVisible] = useState(false)
  const [lang,         setLang]         = useState('sq')
  const [dbTexts,      setDbTexts]      = useState({})   // { id: { sq, en } }
  const [syncState,    setSyncState]    = useState('idle') // idle|saving|saved|error

  // ── Load all texts from Supabase on mount ─────────────────────────────────
  useEffect(() => {
    supabase
      .from('site_texts')
      .select('id,value_sq,value_en')
      .then(({ data }) => {
        if (!data?.length) return
        const map = {}
        data.forEach(r => { map[r.id] = { sq: r.value_sq || '', en: r.value_en || null } })
        setDbTexts(map)
      })
  }, [])

  // ── Save one text entry to Supabase (called on each inline edit) ──────────
  const saveToDb = useCallback(async (id, lng, value) => {
    setSyncState('saving')
    const col = lng === 'en' ? 'value_en' : 'value_sq'
    const { error } = await supabase
      .from('site_texts')
      .upsert({ id, [col]: value, updated_at: new Date().toISOString() }, { onConflict: 'id' })

    if (!error) {
      setDbTexts(prev => ({
        ...prev,
        [id]: { ...(prev[id] || {}), [lng === 'en' ? 'en' : 'sq']: value },
      }))
      setSyncState('saved')
      setTimeout(() => setSyncState('idle'), 2000)
    } else {
      console.warn('[EditMode] Supabase save error:', error.message)
      setSyncState('error')
      setTimeout(() => setSyncState('idle'), 3000)
    }
  }, [])

  // ── Bulk-publish all localStorage edits to Supabase ───────────────────────
  const publishAll = useCallback(async (storedSq, storedEn, allItems) => {
    setSyncState('saving')
    const rows = allItems
      .filter(item => storedSq[item.id] !== undefined || storedEn?.[item.id] !== undefined)
      .map(item => ({
        id:       item.id,
        value_sq: storedSq[item.id] ?? item.default,
        value_en: storedEn?.[item.id] ?? item.defaultEn ?? null,
        updated_at: new Date().toISOString(),
      }))

    if (!rows.length) { setSyncState('idle'); return { count: 0 } }

    const { error } = await supabase
      .from('site_texts')
      .upsert(rows, { onConflict: 'id' })

    if (!error) {
      const newMap = {}
      rows.forEach(r => { newMap[r.id] = { sq: r.value_sq, en: r.value_en } })
      setDbTexts(prev => ({ ...prev, ...newMap }))
      setSyncState('saved')
      setTimeout(() => setSyncState('idle'), 3000)
      return { count: rows.length }
    } else {
      console.warn('[EditMode] publishAll error:', error.message)
      setSyncState('error')
      setTimeout(() => setSyncState('idle'), 4000)
      return { count: 0, error: error.message }
    }
  }, [])

  const flash = useCallback(() => {
    setFlashVisible(true)
    setTimeout(() => setFlashVisible(false), 1400)
  }, [])

  return (
    <Ctx.Provider value={{
      editMode, toggle: () => setEditMode(m => !m),
      flash, flashVisible,
      lang, setLang,
      dbTexts, saveToDb, publishAll, syncState,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useEditMode = () => useContext(Ctx)
