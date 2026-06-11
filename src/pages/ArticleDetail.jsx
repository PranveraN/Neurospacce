import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Clock, Calendar, ArrowRight, BookOpen, Plus, Trash2, Check, GripVertical } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { loadArticles, getCatColor } from '../data/articlesData'
import ShareMenu from '../components/ShareMenu'
import { useEditMode } from '../contexts/EditModeContext'

const LS_KEY = 'ns_landing_articles'

function persistArticle(updated) {
  try {
    const raw  = localStorage.getItem(LS_KEY)
    const all  = raw ? JSON.parse(raw) : []
    const idx  = all.findIndex(a => a.id === updated.id)
    if (idx >= 0) all[idx] = { ...all[idx], ...updated }
    else all.push(updated)
    localStorage.setItem(LS_KEY, JSON.stringify(all))
  } catch {}
}

/* ── Paragraph editor ─────────────────────────────────────────────────────── */
function ParaEditor({ text, onSave, onCancel }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.focus()
    ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length)
  }, [])

  function commit() {
    const v = ref.current?.value?.trim()
    if (v) onSave(v)
    else onCancel()
  }

  return (
    <textarea
      ref={ref}
      defaultValue={text}
      rows={Math.max(3, text.split('\n').length + 2)}
      className="w-full text-gray-700 leading-[1.85] text-[15px] border-2 border-violet-400 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white shadow-sm"
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); onCancel() } }}
    />
  )
}

/* ── Inline field editor (title / excerpt) ────────────────────────────────── */
function FieldEditor({ value, multiline, className, onSave, onCancel }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.focus()
    const len = ref.current.value?.length ?? 0
    ref.current.setSelectionRange?.(len, len)
  }, [])

  function commit() {
    const v = (ref.current?.value ?? '').trim()
    if (v) onSave(v)
    else onCancel()
  }

  const shared = {
    ref,
    defaultValue: value,
    className: `${className} border-2 border-violet-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white/80 w-full resize-none`,
    onBlur: commit,
    onKeyDown: e => {
      if (!multiline && e.key === 'Enter') { e.preventDefault(); commit() }
      if (e.key === 'Escape') { e.preventDefault(); onCancel() }
    },
  }

  return multiline
    ? <textarea {...shared} rows={Math.max(2, value.split('\n').length + 1)} />
    : <input type="text" {...shared} />
}

/* ── Related article card ─────────────────────────────────────────────────── */
function RelatedCard({ article }) {
  return (
    <Link to={`/articles/${article.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 p-4">
      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
        <img src={article.image} alt={article.title} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCatColor(article.category)}`}>
          {article.category}
        </span>
        <h4 className="font-bold text-gray-800 text-sm leading-snug mt-1 line-clamp-2 group-hover:text-violet-600 transition-colors">
          {article.title}
        </h4>
        <p className="text-xs text-gray-400 mt-1">{article.readTime} lexim</p>
      </div>
    </Link>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function ArticleDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { editMode } = useEditMode()

  const [article, setArticle] = useState(() => {
    const all = loadArticles()
    return all.find(a => a.id === Number(id)) ?? null
  })

  useEffect(() => {
    const all = loadArticles()
    setArticle(all.find(a => a.id === Number(id)) ?? null)
  }, [id])

  // editing state
  const [editingField, setEditingField] = useState(null) // 'title' | 'excerpt' | number (para idx)
  const [savedFlash,   setSavedFlash]   = useState(false)

  function applyUpdate(changes) {
    const updated = { ...article, ...changes }
    setArticle(updated)
    persistArticle(updated)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1800)
  }

  function saveField(field, value) {
    applyUpdate({ [field]: value })
    setEditingField(null)
  }

  function savePara(idx, value) {
    const content = [...(article.content || [])]
    content[idx] = value
    applyUpdate({ content })
    setEditingField(null)
  }

  function deletePara(idx) {
    const content = [...(article.content || [])]
    content.splice(idx, 1)
    applyUpdate({ content })
  }

  function addPara() {
    const content = [...(article.content || []), 'Shkruaj paragrafin e ri këtu...']
    applyUpdate({ content })
    setEditingField(content.length - 1)
  }

  function insertParaAfter(idx) {
    const content = [...(article.content || [])]
    content.splice(idx + 1, 0, 'Shkruaj paragrafin e ri këtu...')
    applyUpdate({ content })
    setEditingField(idx + 1)
  }

  /* ── Not found ─────────────────────────────────────────────────────────── */
  if (!article) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
          <BookOpen size={48} className="text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Artikulli nuk u gjet</h2>
          <p className="text-gray-400 mb-6 text-sm">Ky artikull nuk ekziston ose është fshirë.</p>
          <Link to="/articles" className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-500 transition-colors">
            Shko tek artikujt
          </Link>
        </div>
      </PublicLayout>
    )
  }

  const allArticles = loadArticles()
  const related = allArticles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3)
  const others  = related.length < 3
    ? [...related, ...allArticles.filter(a => a.id !== article.id && !related.includes(a))].slice(0, 3)
    : related

  const canEdit = editMode

  return (
    <PublicLayout>
      {/* ── HERO IMAGE ── */}
      <div className="relative w-full h-64 md:h-[480px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* back button */}
        <button
          onClick={() => (window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/library', { replace: true })}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-white/30 transition-colors">
          <ArrowLeft size={14} /> Kthehu
        </button>

        {/* edit mode indicator */}
        {canEdit && (
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-violet-600/90 backdrop-blur border border-violet-400/50 text-white text-xs font-bold px-3 py-2 rounded-xl">
            {savedFlash ? (
              <><Check size={13} className="text-green-300" /> Ruajtur</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Modaliteti i redaktimit</>
            )}
          </div>
        )}

        {/* category badge */}
        <div className="absolute bottom-6 left-6">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow ${getCatColor(article.category)}`}>
            {article.category}
          </span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

          {/* main */}
          <article>
            {/* meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-black text-xs">
                  N
                </div>
                <span className="font-semibold text-gray-600">{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={13} /> {article.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={13} /> {article.readTime} lexim
              </div>
              <ShareMenu
                title={article.title}
                url={`https://myneurosphera.com/articles/${article.id}`}
                className="ml-auto"
              />
            </div>

            {/* ── TITLE ── */}
            {canEdit && editingField === 'title' ? (
              <FieldEditor
                value={article.title}
                multiline={false}
                className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8"
                onSave={v => saveField('title', v)}
                onCancel={() => setEditingField(null)}
              />
            ) : (
              <h1
                className={`text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8 ${canEdit ? 'cursor-pointer hover:bg-violet-50 hover:outline hover:outline-2 hover:outline-dashed hover:outline-violet-300 rounded-xl px-2 -mx-2 transition-all' : ''}`}
                onClick={() => canEdit && setEditingField('title')}
                title={canEdit ? 'Kliko për të redaktuar titullin' : undefined}
              >
                {article.title}
              </h1>
            )}

            {/* ── EXCERPT ── */}
            {canEdit && editingField === 'excerpt' ? (
              <FieldEditor
                value={article.excerpt}
                multiline
                className="text-base text-violet-700 font-medium leading-relaxed mb-8 pl-4 border-l-4 border-violet-300 bg-violet-50 py-3 pr-4 rounded-r-xl"
                onSave={v => saveField('excerpt', v)}
                onCancel={() => setEditingField(null)}
              />
            ) : (
              <p
                className={`text-lg text-violet-700 font-medium leading-relaxed mb-8 pl-4 border-l-4 border-violet-300 bg-violet-50 py-3 pr-4 rounded-r-xl ${canEdit ? 'cursor-pointer hover:bg-violet-100 hover:outline hover:outline-2 hover:outline-dashed hover:outline-violet-300 transition-all' : ''}`}
                onClick={() => canEdit && setEditingField('excerpt')}
                title={canEdit ? 'Kliko për të redaktuar hyrjen' : undefined}
              >
                {article.excerpt}
              </p>
            )}

            {/* ── PARAGRAPHS ── */}
            <div className="space-y-4">
              {(article.content || []).map((para, i) => (
                <div key={i} className="relative group">
                  {canEdit && editingField === i ? (
                    <ParaEditor
                      text={para}
                      onSave={v => savePara(i, v)}
                      onCancel={() => setEditingField(null)}
                    />
                  ) : (
                    <div
                      className={`relative ${canEdit ? 'cursor-pointer rounded-xl px-3 py-2 -mx-3 hover:bg-violet-50 hover:outline hover:outline-2 hover:outline-dashed hover:outline-violet-200 transition-all' : ''}`}
                      onClick={() => canEdit && setEditingField(i)}
                    >
                      <p className="text-gray-700 leading-[1.85] text-[15px]">{para}</p>

                      {/* paragraph action buttons */}
                      {canEdit && (
                        <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => { e.stopPropagation(); insertParaAfter(i) }}
                            title="Shto paragraf pas këtij"
                            className="w-6 h-6 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center hover:bg-violet-200 transition-colors text-xs font-bold"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); deletePara(i) }}
                            title="Fshi paragrafin"
                            className="w-6 h-6 rounded-lg bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add paragraph button */}
              {canEdit && (
                <button
                  onClick={addPara}
                  className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-violet-300 text-violet-500 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 transition-all text-sm font-semibold w-full justify-center"
                >
                  <Plus size={15} /> Shto paragraf të ri
                </button>
              )}
            </div>

            {/* divider + author + share */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              {canEdit && (
                <p className="text-xs text-violet-500 font-semibold mb-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                  Klikoni mbi titull, hyrje ose paragraf për ta redaktuar. Ruhet automatikisht.
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Shkruar nga</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-black">
                      N
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{article.author}</p>
                      <p className="text-xs text-gray-400">Ekipi Editorial · NeuroSphera</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShareMenu
                    title={article.title}
                    url={`https://myneurosphera.com/articles/${article.id}`}
                    className="text-sm"
                  />
                  <Link to="/ask"
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white font-bold rounded-xl text-sm hover:bg-violet-500 transition-colors shadow-md">
                    Pyet {article.author.split(' ')[0]} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* sidebar */}
          <aside className="space-y-6">
            {/* CTA box */}
            <div className="bg-gradient-to-br from-violet-600 to-blue-700 rounded-2xl p-6 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <BookOpen size={18} color="white" />
              </div>
              <h3 className="font-black text-lg mb-2 leading-tight">Keni pyetje personale?</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Psikologët tanë i përgjigjen pyetjeve tuaja falas dhe anonim.
              </p>
              <Link to="/ask"
                className="block text-center py-2.5 bg-white text-violet-700 font-bold rounded-xl text-sm hover:bg-violet-50 transition-colors">
                Pyet psikologun
              </Link>
            </div>

            {/* App CTA */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="font-bold text-gray-800 text-sm mb-2">Gjurmo humorin çdo ditë</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Regjistrohu falas dhe përdor AI-n tonë për mbështetje 24/7.
              </p>
              <Link to="/auth"
                className="block text-center py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors">
                Regjistrohu falas
              </Link>
            </div>
          </aside>
        </div>

        {/* ── RELATED ── */}
        {others.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">Artikuj të ngjashëm</h2>
              <Link to="/articles" className="text-sm font-bold text-violet-600 flex items-center gap-1 hover:gap-2 transition-all">
                Të gjitha <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {others.map(a => <RelatedCard key={a.id} article={a} />)}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
