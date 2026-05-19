import { useState, useRef, useEffect } from 'react'
import { useEditMode } from '../contexts/EditModeContext'

const LS_KEY = 'ns_editable'
const LS_KEY_EN = 'ns_editable_en'

/* Stable hash-based ID from text content — used when no explicit id is given */
function autoId(str) {
  let h = 5381
  const s = String(str).trim().slice(0, 60)
  for (let i = 0; i < s.length; i++) h = Math.imul(h, 31) + s.charCodeAt(i) | 0
  return 'et_' + (h >>> 0).toString(36)
}

function storageKey(id, lang) {
  return lang === 'en' ? `${id}__en` : id
}

function loadValue(id, lang) {
  try {
    if (lang === 'en') {
      // Try EN store first
      const enStore = JSON.parse(localStorage.getItem(LS_KEY_EN) || '{}')
      if (enStore[id] != null) return enStore[id]
      // Fall back to SQ store
      const sqStore = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
      if (sqStore[id] != null) return sqStore[id]
      return null
    }
    return (JSON.parse(localStorage.getItem(LS_KEY) || '{}'))[id] ?? null
  } catch { return null }
}

function persistValue(id, lang, value) {
  try {
    if (lang === 'en') {
      const store = JSON.parse(localStorage.getItem(LS_KEY_EN) || '{}')
      localStorage.setItem(LS_KEY_EN, JSON.stringify({ ...store, [id]: value }))
    } else {
      const store = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
      localStorage.setItem(LS_KEY, JSON.stringify({ ...store, [id]: value }))
    }
  } catch {}
}

// Tags that should default to multiline textarea when clicked
const MULTILINE_TAGS = new Set(['p', 'div', 'blockquote', 'li', 'td'])

export default function EditableText({
  id: idProp,
  as: Tag = 'span',
  multiline,
  className = '',
  style,
  children,
}) {
  const { editMode, flash, lang } = useEditMode()
  const id = idProp ?? autoId(children)
  const isMultiline = multiline ?? MULTILINE_TAGS.has(String(Tag))
  const [value, setValue] = useState(() => loadValue(id, lang) ?? children)
  const [editing, setEditing] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      const len = ref.current.value?.length ?? 0
      ref.current.setSelectionRange?.(len, len)
    }
  }, [editing])

  // Re-load value when lang changes
  useEffect(() => {
    const stored = loadValue(id, lang)
    setValue(stored ?? children)
  }, [lang, id])

  // Sync with children if no saved value (code update path)
  useEffect(() => {
    if (loadValue(id, lang) === null) setValue(children)
  }, [children, id])

  function startEdit() {
    if (editMode) setEditing(true)
  }

  function commit(raw) {
    const val = (raw ?? '').trim() || String(children)
    setValue(val)
    persistValue(id, lang, val)
    setEditing(false)
    flash()
  }

  function handleKeyDown(e) {
    if (!isMultiline && e.key === 'Enter') { e.preventDefault(); commit(e.target.value) }
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    // Inherit the tag's visual styling — only overlay the ring
    const sharedCls = `${className} focus:outline-none ring-2 ring-violet-400 rounded bg-transparent`
    const sharedStyle = {
      ...style,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      color: 'inherit',
    }

    return isMultiline
      ? (
        <textarea
          ref={ref}
          defaultValue={value}
          onBlur={e => commit(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={Math.max(2, String(value).split('\n').length + 1)}
          className={`${sharedCls} w-full resize-none`}
          style={sharedStyle}
        />
      ) : (
        <input
          ref={ref}
          type="text"
          defaultValue={value}
          onBlur={e => commit(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${sharedCls} w-full`}
          style={sharedStyle}
        />
      )
  }

  const editHint = editMode
    ? 'outline outline-2 outline-dashed outline-violet-400/50 outline-offset-2 cursor-pointer hover:bg-violet-500/5 rounded transition-all'
    : ''

  return (
    <Tag
      className={`${className} ${editHint}`.trim()}
      style={style}
      onClick={startEdit}
    >
      {value}
    </Tag>
  )
}
