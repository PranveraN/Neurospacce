import { useState, useRef, useEffect } from 'react'
import { useEditMode } from '../contexts/EditModeContext'

const LS_KEY    = 'ns_editable'
const LS_KEY_EN = 'ns_editable_en'

function autoId(str) {
  let h = 5381
  const s = String(str).trim().slice(0, 60)
  for (let i = 0; i < s.length; i++) h = Math.imul(h, 31) + s.charCodeAt(i) | 0
  return 'et_' + (h >>> 0).toString(36)
}

function loadLS(id, lang) {
  try {
    const key   = lang === 'en' ? LS_KEY_EN : LS_KEY
    const store = JSON.parse(localStorage.getItem(key) || '{}')
    return store[id] ?? null
  } catch { return null }
}

function persistLS(id, lang, value) {
  try {
    const key   = lang === 'en' ? LS_KEY_EN : LS_KEY
    const store = JSON.parse(localStorage.getItem(key) || '{}')
    localStorage.setItem(key, JSON.stringify({ ...store, [id]: value }))
  } catch {}
}

const MULTILINE_TAGS = new Set(['p', 'div', 'blockquote', 'li', 'td'])

export default function EditableText({
  id: idProp,
  as: Tag = 'span',
  multiline,
  className = '',
  style,
  children,
}) {
  const { editMode, flash, lang, dbTexts, saveToDb } = useEditMode()
  const id         = idProp ?? autoId(children)
  const isMultiline = multiline ?? MULTILINE_TAGS.has(String(Tag))

  // Priority: Supabase DB > localStorage > children
  function resolveValue() {
    const db = dbTexts?.[id]
    if (db) return lang === 'en' ? (db.en || db.sq) : (db.sq || String(children))
    const ls = loadLS(id, lang)
    return ls ?? children
  }

  const [value,   setValue]   = useState(resolveValue)
  const [editing, setEditing] = useState(false)
  const ref = useRef(null)

  // Re-resolve when DB texts load or lang changes
  useEffect(() => {
    setValue(resolveValue())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbTexts, lang, id])

  // Sync with children if no override anywhere
  useEffect(() => {
    const db = dbTexts?.[id]
    if (!db && loadLS(id, lang) === null) setValue(children)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, id])

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      const len = ref.current.value?.length ?? 0
      ref.current.setSelectionRange?.(len, len)
    }
  }, [editing])

  function startEdit() { if (editMode) setEditing(true) }

  async function commit(raw) {
    const val = (raw ?? '').trim() || String(children)
    setValue(val)
    persistLS(id, lang, val)   // immediate local cache
    saveToDb(id, lang, val)    // async Supabase persist (fire and forget)
    setEditing(false)
    flash()
  }

  function handleKeyDown(e) {
    if (!isMultiline && e.key === 'Enter') { e.preventDefault(); commit(e.target.value) }
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    const sharedCls   = `${className} focus:outline-none ring-2 ring-violet-400 rounded bg-transparent`
    const sharedStyle = {
      ...style,
      fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit',
      lineHeight: 'inherit', letterSpacing: 'inherit', color: 'inherit',
    }
    return isMultiline
      ? (
        <textarea ref={ref} defaultValue={value}
          onBlur={e => commit(e.target.value)} onKeyDown={handleKeyDown}
          rows={Math.max(2, String(value).split('\n').length + 1)}
          className={`${sharedCls} w-full resize-none`} style={sharedStyle} />
      ) : (
        <input ref={ref} type="text" defaultValue={value}
          onBlur={e => commit(e.target.value)} onKeyDown={handleKeyDown}
          className={`${sharedCls} w-full`} style={sharedStyle} />
      )
  }

  const editHint = editMode
    ? 'outline outline-2 outline-dashed outline-violet-400/50 outline-offset-2 cursor-pointer hover:bg-violet-500/5 rounded transition-all'
    : ''

  return (
    <Tag className={`${className} ${editHint}`.trim()} style={style} onClick={startEdit}>
      {value}
    </Tag>
  )
}
