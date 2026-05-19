import { useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowRight, Clock, Search, X, Users, BookOpen, ChevronRight } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { PLATFORM_CATS } from '../data/categoriesData'
import { loadArticles, getCatColor } from '../data/articlesData'

function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={article.image} alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${getCatColor(article.category)}`}>
          {article.category}
        </span>
        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
          <Clock size={10} className="text-white/80" />
          <span className="text-[10px] text-white font-medium">{article.readTime}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">{article.date}</span>
          <span className="text-xs font-bold text-violet-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Lexo <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function CategoryPage() {
  const { id } = useParams()
  const [activeSub, setActiveSub] = useState('all')
  const [search, setSearch] = useState('')

  const cat = PLATFORM_CATS.find(c => c.id === id)
  if (!cat) return <Navigate to="/articles" replace />

  const Icon = cat.icon

  const allArticles = useMemo(loadArticles, [])

  const filtered = allArticles.filter(a => {
    const matchCat = a.platformCat === id
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = filtered.find(a => a.featured)
  const rest     = filtered.filter(a => !featured || a.id !== featured.id)

  return (
    <PublicLayout>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: `linear-gradient(135deg, ${cat.from} 0%, ${cat.to} 100%)` }}
      >
        {/* bg blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'white' }}/>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 blur-3xl"
          style={{ background: 'white' }}/>

        <div className="relative max-w-6xl mx-auto px-5">
          {/* breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-xs font-semibold mb-6">
            <Link to="/" className="hover:text-white transition-colors">Kreu</Link>
            <ChevronRight size={12}/>
            <span className="text-white/80">Kategoritë</span>
            <ChevronRight size={12}/>
            <span className="text-white">{cat.label}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              <Icon size={36} color="white" strokeWidth={1.8}/>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 mb-3">
                <BookOpen size={11} className="text-white/80"/>
                <span className="text-white/80 text-xs font-semibold">{cat.count}+ burime</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{cat.label}</h1>
              <p className="text-white/70 text-lg max-w-2xl leading-relaxed">{cat.desc}</p>
            </div>
          </div>

          {/* sub-category chips */}
          <div className="flex flex-wrap gap-2 mt-8">
            <button
              onClick={() => setActiveSub('all')}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
                activeSub === 'all' ? 'bg-white text-gray-900 shadow-md' : 'bg-white/15 text-white/80 hover:bg-white/25'
              }`}
            >
              Të gjitha
            </button>
            {cat.sub.map(s => (
              <button key={s}
                onClick={() => setActiveSub(activeSub === s ? 'all' : s)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
                  activeSub === s ? 'bg-white text-gray-900 shadow-md' : 'bg-white/15 text-white/80 hover:bg-white/25'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-wrap items-center gap-6">
          {[
            { label: 'Artikuj', value: filtered.length },
            { label: 'Nënkategori', value: cat.sub.length },
            { label: 'Anëtarë aktivë', value: cat.count > 1000 ? `${(cat.count/1000).toFixed(1)}K` : cat.count },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-lg font-black" style={{ color: cat.from }}>{s.value}</span>
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <Users size={13}/>
            Komunitet aktiv
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 py-12">

        {/* search */}
        <div className="relative max-w-md mb-10">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Kërko në ${cat.label}...`}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-300 bg-white shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14}/>
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: cat.soft }}>
              <Icon size={28} style={{ color: cat.from }}/>
            </div>
            <p className="text-gray-500 text-lg font-semibold mb-2">
              {search ? `Asnjë rezultat për "${search}"` : 'Asnjë artikull gjendur'}
            </p>
            <button onClick={() => { setSearch(''); setActiveSub('all') }}
              className="text-sm font-bold hover:underline" style={{ color: cat.from }}>
              Pastro filtrat
            </button>
          </div>
        ) : (
          <>
            {/* featured */}
            {featured && (
              <div className="mb-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">I rekomanduar</p>
                <Link to={`/articles/${featured.id}`}
                  className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block">
                  <div className="aspect-[21/8]">
                    <img src={featured.image} alt={featured.title} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)' }}/>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 max-w-2xl">
                    <span className={`self-start text-[11px] font-bold px-3 py-1 rounded-full mb-4 ${getCatColor(featured.category)}`}>
                      {featured.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">{featured.title}</h2>
                    <p className="text-white/65 text-sm line-clamp-2 mb-4">{featured.excerpt}</p>
                    <div className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors">
                      Lexo tani <ArrowRight size={14}/>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* grid */}
            {rest.length > 0 && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
                  {featured ? 'Më shumë artikuj' : 'Të gjitha'}
                  <span className="ml-2 font-normal normal-case">({rest.length})</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(a => <ArticleCard key={a.id} article={a}/>)}
                </div>
              </>
            )}
          </>
        )}

        {/* other categories */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Eksploro kategori të tjera</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORM_CATS.filter(c => c.id !== id).slice(0, 4).map(c => {
              const CIcon = c.icon
              return (
                <Link key={c.id} to={`/category/${c.id}`}
                  className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
                    <CIcon size={18} color="white" strokeWidth={2}/>
                  </div>
                  <p className="text-xs font-bold text-gray-700 leading-snug">{c.label}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
