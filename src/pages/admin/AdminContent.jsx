import { useState } from 'react'
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, FileText, X, Save, Tag, Clock } from 'lucide-react'

const INITIAL_ARTICLES = [
  { id: 1, title: 'Çfarë ndodh në tru gjatë ankthit?', category: 'Neuroshkencë', status: 'published', author: 'admin', views: 1240, createdAt: '2026-04-10' },
  { id: 2, title: 'CBT: Ndryshimi i mendimeve negative',  category: 'Terapia',      status: 'published', author: 'admin', views: 892,  createdAt: '2026-04-14' },
  { id: 3, title: 'Gjumi dhe shëndeti mendor',           category: 'Gjumë',        status: 'draft',     author: 'admin', views: 0,    createdAt: '2026-04-20' },
  { id: 4, title: 'Mindfulness për fillestarë',          category: 'Mindfulness',  status: 'published', author: 'admin', views: 673,  createdAt: '2026-04-22' },
  { id: 5, title: 'Teknikat e frymëmarrjes',            category: 'Teknika',      status: 'draft',     author: 'admin', views: 0,    createdAt: '2026-04-27' },
]

const CATEGORIES = ['Neuroshkencë', 'Terapia', 'Gjumë', 'Mindfulness', 'Teknika', 'Vetëbesim']

function ArticleModal({ article, onSave, onClose }) {
  const [form, setForm] = useState(article || { title: '', category: CATEGORIES[0], status: 'draft', content: '' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
              <FileText size={15} className="text-violet-600" />
            </div>
            <h3 className="font-black text-gray-800">{article ? 'Edito artikullin' : 'Artikull i ri'}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Titulli *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Shkruaj titullin e artikullit..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Kategoria</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-300">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Statusi</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-300">
                <option value="draft">Draft</option>
                <option value="published">Publikuar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Përmbajtja</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={8} placeholder="Shkruaj përmbajtjen e artikullit (markdown)..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-300 resize-none font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
            Anulo
          </button>
          <button
            onClick={() => { if (form.title.trim()) { onSave(form); onClose() } }}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-500 flex items-center justify-center gap-2">
            <Save size={14} />
            {form.status === 'published' ? 'Publiko' : 'Ruaj si Draft'}
          </button>
        </div>
      </div>
    </div>
  )
}

function loadArticles() {
  try { const v = localStorage.getItem('ns_articles'); return v ? JSON.parse(v) : INITIAL_ARTICLES } catch { return INITIAL_ARTICLES }
}
function saveArticles(data) {
  try { localStorage.setItem('ns_articles', JSON.stringify(data)) } catch {}
}

export default function AdminContent() {
  const [articles, setArticlesRaw] = useState(loadArticles)
  const [search, setSearch]        = useState('')
  const [filter, setFilter]        = useState('all')
  const [modal, setModal]          = useState(null)

  function setArticles(updater) {
    setArticlesRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveArticles(next)
      return next
    })
  }

  const filtered = articles.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || a.status === filter
    return matchSearch && matchFilter
  })

  function handleSave(form) {
    if (form.id) {
      setArticles(prev => prev.map(a => a.id === form.id ? { ...a, ...form } : a))
    } else {
      setArticles(prev => [...prev, { ...form, id: Date.now(), author: 'admin', views: 0, createdAt: new Date().toISOString().slice(0,10) }])
    }
  }

  function toggleStatus(id) {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'published' ? 'draft' : 'published' } : a))
  }

  function deleteArticle(id) {
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  const published = articles.filter(a => a.status === 'published').length
  const drafts    = articles.filter(a => a.status === 'draft').length

  return (
    <div className="space-y-5 animate-fade-in">
      {modal && <ArticleModal article={modal === 'new' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Përmbajtja</h1>
          <p className="text-gray-500 text-sm">{articles.length} artikuj gjithsej</p>
        </div>
        <button onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 transition-colors self-start">
          <Plus size={15} /> Artikull i ri
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',     value: articles.length,   color: 'text-gray-800',  bg: 'bg-gray-50' },
          { label: 'Publikuar', value: published,          color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Draft',     value: drafts,             color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Kërko artikuj..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-300 bg-gray-50"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[['all','Të gjitha'],['published','Publikuar'],['draft','Draft']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${filter === v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Articles list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">Asnjë artikull nuk u gjet</div>
          ) : filtered.map(a => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
              <div className={`w-2 h-10 rounded-full shrink-0 ${a.status === 'published' ? 'bg-green-500' : 'bg-amber-400'}`} />

              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm leading-tight truncate">{a.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Tag size={9} /> {a.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock size={9} /> {a.createdAt}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Eye size={9} /> {a.views} views
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${a.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {a.status === 'published' ? 'Publikuar' : 'Draft'}
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setModal(a)}
                  className="w-8 h-8 rounded-xl hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => toggleStatus(a.id)}
                  className="w-8 h-8 rounded-xl hover:bg-green-50 flex items-center justify-center text-gray-400 hover:text-green-500 transition-colors">
                  {a.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => deleteArticle(a.id)}
                  className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
