import { useState, useMemo, useRef, useCallback } from 'react'
import {
  Search, RotateCcw, Download, Upload,
  CheckCircle, AlertCircle, ChevronDown, ChevronUp, X,
  Clock, Copy, Globe, Languages, Loader2, CloudUpload,
} from 'lucide-react'
import {
  SITE_TEXTS, SECTIONS,
  getStoredForLang, setStoredForLang, resetStoredForLang, resetAllForLang,
  addToHistory, getHistory,
} from '../../data/siteTexts'
import { useEditMode } from '../../contexts/EditModeContext'

/* ── useTexts hook ───────────────────────────────────────────────────────── */
function useTexts(lang) {
  const [rev, setRev] = useState(0)
  const refresh = useCallback(() => setRev(r => r + 1), [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stored = useMemo(() => getStoredForLang(lang), [lang, rev])

  const save = useCallback((id, value) => {
    const prev = stored[id]
    if (prev !== undefined && prev !== value) addToHistory(id, lang, prev)
    setStoredForLang(lang, id, value)
    refresh()
  }, [lang, stored, refresh])

  const reset = useCallback((id) => {
    const prev = stored[id]
    if (prev !== undefined) addToHistory(id, lang, prev)
    resetStoredForLang(lang, id)
    refresh()
  }, [lang, stored, refresh])

  const resetAll = useCallback(() => {
    resetAllForLang(lang)
    refresh()
  }, [lang, refresh])

  return { stored, save, reset, resetAll, refresh }
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function defVal(item, lang) {
  return lang === 'en' ? (item.defaultEn || item.default) : item.default
}

function formatTs(ts) {
  const d = new Date(ts)
  return (
    d.toLocaleDateString('sq-AL', { day: '2-digit', month: 'short' }) +
    ' · ' +
    d.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })
  )
}

/* ── HistoryPanel ────────────────────────────────────────────────────────── */
function HistoryPanel({ id, lang, onRestore }) {
  const history = getHistory(id, lang)
  if (!history.length) {
    return (
      <div className="mt-2 px-3 py-2.5 rounded-xl bg-slate-700/30 border border-slate-700/50 text-[11px] text-slate-500 text-center">
        Nuk ka histori për këtë fushë
      </div>
    )
  }
  return (
    <div className="mt-2 rounded-xl border border-slate-700/60 bg-slate-900/60 overflow-hidden">
      {history.map((h, i) => (
        <div
          key={i}
          className="group/h flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-700/40 last:border-0 hover:bg-slate-700/30 transition-colors"
        >
          <Clock size={11} className="text-slate-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-600 mb-0.5">{formatTs(h.ts)}</p>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{h.value}</p>
          </div>
          <button
            onClick={() => onRestore(h.value)}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/20 hover:bg-violet-600/40 transition-colors opacity-0 group-hover/h:opacity-100 shrink-0"
          >
            Rikthe
          </button>
        </div>
      ))}
    </div>
  )
}

/* ── TextRow ─────────────────────────────────────────────────────────────── */
function TextRow({ item, lang, stored, otherStored, onSave, onReset }) {
  const def     = defVal(item, lang)
  const current = stored[item.id] ?? def
  const isDirty = stored[item.id] !== undefined && stored[item.id] !== def
  const isLong  = def.length > 80
  const hasHist = getHistory(item.id, lang).length > 0

  const [editing,  setEditing]  = useState(false)
  const [draft,    setDraft]    = useState('')
  const [saved,    setSaved]    = useState(false)
  const [showHist, setShowHist] = useState(false)

  function startEdit() {
    setDraft(current)
    setEditing(true)
    setSaved(false)
    setShowHist(false)
  }

  function commit() {
    onSave(item.id, draft.trim() || def)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  function cancel() { setEditing(false); setDraft('') }

  function handleReset() {
    onReset(item.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  function copyFromOther() {
    const otherDef = lang === 'en' ? item.default : (item.defaultEn || item.default)
    const otherVal = otherStored[item.id] ?? otherDef
    setDraft(otherVal)
    setEditing(true)
    setSaved(false)
    setShowHist(false)
  }

  function restoreFromHistory(val) {
    onSave(item.id, val)
    setShowHist(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      isDirty
        ? 'border-violet-500/35 bg-violet-950/15'
        : 'border-slate-700/40 bg-slate-800/30 hover:border-slate-600/50'
    }`}>
      <div className="px-4 py-3.5">

        {/* Top row: label + actions */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-xs font-bold text-slate-200">{item.label}</span>
              {isDirty && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/25">
                  ✎ Redaktuar
                </span>
              )}
              {saved && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                  <CheckCircle size={9} /> Ruajtur
                </span>
              )}
            </div>
            <code className="text-[9px] text-slate-600 font-mono">{item.id}</code>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {hasHist && (
              <button
                onClick={() => setShowHist(s => !s)}
                title="Shiko historinë"
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  showHist
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-slate-600 hover:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Clock size={11} />
              </button>
            )}
            <button
              onClick={copyFromOther}
              title={`Kopjo nga ${lang === 'sq' ? 'EN' : 'SQ'}`}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
            >
              <Copy size={11} />
            </button>
            {isDirty && (
              <button
                onClick={handleReset}
                title="Kthe origjinalin"
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <RotateCcw size={11} />
              </button>
            )}
            {!editing && (
              <button
                onClick={startEdit}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-700/80 text-slate-300 hover:bg-violet-600 hover:text-white transition-colors"
              >
                Redakto
              </button>
            )}
          </div>
        </div>

        {/* Value display / editor */}
        {editing ? (
          <div className="mt-1.5">
            {isLong ? (
              <textarea
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={Math.max(3, Math.ceil(draft.length / 65))}
                className="w-full text-sm text-slate-100 bg-slate-900 border border-violet-500/60 rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-400 resize-none leading-relaxed transition-colors"
              />
            ) : (
              <input
                autoFocus
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }}
                className="w-full text-sm text-slate-100 bg-slate-900 border border-violet-500/60 rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-400 transition-colors"
              />
            )}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={commit}
                className="text-[11px] font-bold px-3.5 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors"
              >
                Ruaj
              </button>
              <button
                onClick={cancel}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-slate-700/80 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Anulo
              </button>
              <span className="text-[10px] text-slate-600 ml-1 hidden sm:inline">Enter ↵ ruaj · Esc anulo</span>
            </div>
          </div>
        ) : (
          <p
            className="text-sm text-slate-300 leading-relaxed cursor-pointer hover:text-slate-100 transition-colors line-clamp-3 mt-1"
            onClick={startEdit}
            title="Klikoni për të redaktuar"
          >
            {current}
          </p>
        )}

        {/* Original comparison when dirty */}
        {isDirty && !editing && (
          <p className="text-[10px] text-slate-600 mt-2 line-clamp-1">
            <span className="text-slate-500 font-semibold">Origjinal:</span> {def}
          </p>
        )}

        {/* History panel */}
        {showHist && (
          <HistoryPanel id={item.id} lang={lang} onRestore={restoreFromHistory} />
        )}
      </div>
    </div>
  )
}

/* ── SectionGroup ────────────────────────────────────────────────────────── */
function SectionGroup({ section, items, lang, stored, otherStored, onSave, onReset, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const dirty = items.filter(i => {
    const d = defVal(i, lang)
    return stored[i.id] !== undefined && stored[i.id] !== d
  }).length

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600/60 transition-all text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-200">{section}</span>
          <span className="text-[10px] text-slate-500 font-medium bg-slate-700/60 px-1.5 py-0.5 rounded-md">
            {items.length}
          </span>
          {dirty > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600/25 text-violet-400 border border-violet-500/25">
              {dirty} ✎
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={13} className="text-slate-500" />
          : <ChevronDown size={13} className="text-slate-500" />
        }
      </button>

      {open && (
        <div className="mt-1.5 space-y-1.5">
          {items.map(item => (
            <TextRow
              key={item.id}
              item={item}
              lang={lang}
              stored={stored}
              otherStored={otherStored}
              onSave={onSave}
              onReset={onReset}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── StatCard ────────────────────────────────────────────────────────────── */
function StatCard({ label, value, accent }) {
  const accents = {
    slate:   { bg: 'bg-slate-800/80',       border: 'border-slate-700/50', val: 'text-slate-100' },
    violet:  { bg: 'bg-violet-950/30',      border: 'border-violet-500/25',val: 'text-violet-300' },
    blue:    { bg: 'bg-sky-950/30',         border: 'border-sky-500/25',   val: 'text-sky-300'   },
    emerald: { bg: 'bg-emerald-950/30',     border: 'border-emerald-500/25',val:'text-emerald-300'},
  }
  const c = accents[accent] || accents.slate
  return (
    <div className={`rounded-xl border px-3.5 py-2.5 ${c.bg} ${c.border}`}>
      <p className="text-[10px] text-slate-500 font-medium mb-0.5">{label}</p>
      <p className={`text-sm font-black ${c.val}`}>{value}</p>
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function AdminTexts() {
  const { lang, setLang, saveToDb, publishAll, syncState } = useEditMode()
  const { stored, save: saveLocal, reset, resetAll, refresh } = useTexts(lang)

  const save = useCallback((id, value) => {
    saveLocal(id, value)
    saveToDb(id, lang, value)
  }, [saveLocal, saveToDb, lang])

  const otherLang   = lang === 'sq' ? 'en' : 'sq'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const otherStored = useMemo(() => getStoredForLang(otherLang), [otherLang, stored])

  const [query,     setQuery]     = useState('')
  const [section,   setSection]   = useState('Të gjitha')
  const [confirm,   setConfirm]   = useState(false)
  const [importErr, setImportErr] = useState('')
  const fileRef = useRef(null)

  // Stats (recompute with stored so they update on save)
  const stats = useMemo(() => {
    const sqS = getStoredForLang('sq')
    const enS = getStoredForLang('en')
    const sqEdited = SITE_TEXTS.filter(i => sqS[i.id] !== undefined && sqS[i.id] !== i.default).length
    const enEdited = SITE_TEXTS.filter(i => enS[i.id] !== undefined && enS[i.id] !== (i.defaultEn || i.default)).length
    return {
      total: SITE_TEXTS.length,
      sqEdited,
      enEdited,
      sqPct:  Math.round((sqEdited / SITE_TEXTS.length) * 100),
      enPct:  Math.round((enEdited / SITE_TEXTS.length) * 100),
    }
  }, [stored]) // stored changes on any save → stats refresh

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase()
    return SITE_TEXTS.filter(item => {
      const secMatch   = section === 'Të gjitha' || item.section === section
      const def        = defVal(item, lang)
      const queryMatch = !q
        || item.label.toLowerCase().includes(q)
        || item.id.toLowerCase().includes(q)
        || def.toLowerCase().includes(q)
        || (stored[item.id] || '').toLowerCase().includes(q)
      return secMatch && queryMatch
    })
  }, [query, section, stored, lang])

  const grouped = useMemo(() => {
    const map = {}
    filteredItems.forEach(item => {
      if (!map[item.section]) map[item.section] = []
      map[item.section].push(item)
    })
    return map
  }, [filteredItems])

  const langEdited = lang === 'sq' ? stats.sqEdited : stats.enEdited

  // Export JSON for active language
  function handleExport() {
    const data = {}
    SITE_TEXTS.forEach(item => {
      data[item.id] = stored[item.id] ?? defVal(item, lang)
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `NeuroSphera-texts-${lang}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  // Import JSON for active language
  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result)
        Object.entries(data).forEach(([id, value]) => {
          if (typeof value === 'string') setStoredForLang(lang, id, value)
        })
        refresh()
        setImportErr('')
      } catch {
        setImportErr('Skedari JSON nuk është valid.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleResetAll() {
    resetAll()
    setConfirm(false)
  }

  async function handlePublishAll() {
    const sqS = getStoredForLang('sq')
    const enS = getStoredForLang('en')
    await publishAll(sqS, enS, SITE_TEXTS)
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg shadow-violet-900/40 shrink-0">
            <Languages size={18} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-black text-slate-100 text-lg leading-tight">Menaxhimi i Teksteve</h1>
            <p className="text-xs text-slate-500">
              Content Management System · {SITE_TEXTS.length} tekste
            </p>
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1 bg-slate-800 border border-slate-700/50 rounded-xl p-1">
          <button
            onClick={() => { setLang('sq'); setSection('Të gjitha') }}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              lang === 'sq'
                ? 'bg-violet-600 text-white shadow shadow-violet-900/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe size={12} /> SQ
          </button>
          <button
            onClick={() => { setLang('en'); setSection('Të gjitha') }}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              lang === 'en'
                ? 'bg-sky-600 text-white shadow shadow-sky-900/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe size={12} /> EN
          </button>
        </div>
      </div>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <StatCard label="Gjithsej tekste"      value={stats.total}        accent="slate"   />
        <StatCard label="SQ të redaktuara"     value={stats.sqEdited}     accent="violet"  />
        <StatCard label="EN të redaktuara"     value={stats.enEdited}     accent="blue"    />
        <StatCard
          label={`${lang.toUpperCase()} mbulimi`}
          value={`${lang === 'sq' ? stats.sqPct : stats.enPct}%`}
          accent="emerald"
        />
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 mb-4 space-y-3">

        {/* Language indicator pill */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            lang === 'sq'
              ? 'bg-violet-600/20 text-violet-400 border-violet-500/30'
              : 'bg-sky-600/20 text-sky-400 border-sky-500/30'
          }`}>
            {lang === 'sq' ? '🇦🇱 Shqip' : '🇬🇧 English'}
          </span>
          <span className="text-[10px] text-slate-600">
            — redaktoni tekstet për gjuhën aktive
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Kërko tekst, ID, ose fjalë kyçe (${lang.toUpperCase()})…`}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/60 border border-slate-600/50 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Section filter */}
        <div className="flex gap-1.5 flex-wrap">
          {['Të gjitha', ...SECTIONS].map(s => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                section === s
                  ? lang === 'en'
                    ? 'bg-sky-600 text-white'
                    : 'bg-violet-600 text-white'
                  : 'bg-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {s === 'Të gjitha' ? `Të gjitha (${SITE_TEXTS.length})` : s.split('›').pop().trim()}
            </button>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-slate-100 border border-slate-600/40 transition-colors"
          >
            <Download size={11} /> Eksporto {lang.toUpperCase()}
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-slate-100 border border-slate-600/40 transition-colors"
          >
            <Upload size={11} /> Importo {lang.toUpperCase()}
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          <button
            onClick={handlePublishAll}
            disabled={syncState === 'saving'}
            title="Publiko të gjitha ndryshimet lokale në Supabase"
            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600/40 border border-violet-500/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncState === 'saving'
              ? <><Loader2 size={11} className="animate-spin" /> Duke publikuar…</>
              : syncState === 'saved'
              ? <><CheckCircle size={11} className="text-emerald-400" /> Publikuar</>
              : <><CloudUpload size={11} /> Publiko në server</>
            }
          </button>

          {langEdited > 0 && !confirm && (
            <button
              onClick={() => setConfirm(true)}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors ml-auto"
            >
              <RotateCcw size={11} /> Reseto {lang.toUpperCase()} ({langEdited})
            </button>
          )}

          {confirm && (
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <span className="text-[11px] text-red-400 font-semibold">Jeni i sigurt? ({lang.toUpperCase()})</span>
              <button
                onClick={handleResetAll}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
              >
                Po, reseto
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
              >
                Anulo
              </button>
            </div>
          )}
        </div>

        {importErr && (
          <p className="flex items-center gap-2 text-[11px] text-red-400 font-semibold">
            <AlertCircle size={12} /> {importErr}
          </p>
        )}
      </div>

      {/* Results info when searching */}
      {query && (
        <p className="text-xs text-slate-500 mb-3 px-1">
          {filteredItems.length} rezultate për{' '}
          <strong className="text-slate-300">"{query}"</strong>
          <span className="ml-1.5 text-slate-600">· {lang.toUpperCase()}</span>
        </p>
      )}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Search size={28} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-semibold">Asnjë tekst nuk u gjet.</p>
        </div>
      ) : query ? (
        // Flat list when searching
        <div className="space-y-1.5">
          {filteredItems.map(item => (
            <TextRow
              key={item.id}
              item={item}
              lang={lang}
              stored={stored}
              otherStored={otherStored}
              onSave={save}
              onReset={reset}
            />
          ))}
        </div>
      ) : (
        // Grouped by section
        Object.entries(grouped).map(([sec, items], i) => (
          <SectionGroup
            key={sec}
            section={sec}
            items={items}
            lang={lang}
            stored={stored}
            otherStored={otherStored}
            onSave={save}
            onReset={reset}
            defaultOpen={i === 0}
          />
        ))
      )}
    </div>
  )
}
