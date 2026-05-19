import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Clock, Calendar, X } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { loadArticles, CATEGORIES, getCatColor } from '../data/articlesData'

const ARTICLES = loadArticles()

function ArticleCard({ article }) {
  return (
    <Link to={`/articles/${article.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${getCatColor(article.category)}`}>
          {article.category}
        </span>
        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
          <Clock size={10} className="text-white/80" />
          <span className="text-[10px] text-white font-medium">{article.readTime}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-black text-[10px]">
              N
            </div>
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-violet-600 group-hover:gap-2 transition-all">
            Lexo <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  )
}

function FeaturedCard({ article }) {
  return (
    <Link to={`/articles/${article.id}`}
      className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-64 md:h-80 block">
      <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${getCatColor(article.category)} mb-3 inline-block`}>
          {article.category}
        </span>
        <h3 className="font-black text-white text-xl leading-tight mb-2 group-hover:text-violet-200 transition-colors">
          {article.title}
        </h3>
        <p className="text-white/65 text-sm line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-white/50 text-xs">{article.date} · {article.readTime}</span>
          <span className="text-xs font-bold text-violet-300 flex items-center gap-1 group-hover:gap-2 transition-all">
            Lexo <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ArticlesPage() {
  const [search, setSearch]   = useState('')
  const [active, setActive]   = useState('Të gjitha')

  const filtered = ARTICLES.filter(a => {
    const matchCat    = active === 'Të gjitha' || a.category === active
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) ||
                        a.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = ARTICLES.filter(a => a.featured)

  return (
    <PublicLayout>
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-14">
          <p className="text-sm font-bold text-violet-600 uppercase tracking-widest mb-3">Bazuar në shkencë</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Artikuj & Këshilla</h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Udhëzues praktikë nga psikologë të licencuar — për ankth, depresion, marrëdhënie dhe mirëqenie.
          </p>
        </div>
      </div>

      {/* ── FEATURED ── */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Të rekomanduara</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map(a => <FeaturedCard key={a.id} article={a} />)}
          </div>
        </div>
      </section>

      {/* ── FILTERS + GRID ── */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        {/* search + filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kërko artikuj..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-300 bg-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  active === c
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* count */}
        <p className="text-sm text-gray-400 mb-6">
          {filtered.length} artikuj {active !== 'Të gjitha' ? `në "${active}"` : ''}
          {search ? ` për "${search}"` : ''}
        </p>

        {/* grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-gray-400 text-lg font-semibold">Asnjë artikull nuk u gjet.</p>
            <button onClick={() => { setSearch(''); setActive('Të gjitha') }}
              className="mt-4 text-sm text-violet-600 font-bold hover:underline">
              Pastro filtrat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
