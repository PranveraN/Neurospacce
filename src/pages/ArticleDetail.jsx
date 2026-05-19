import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Share2, BookOpen } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { loadArticles, getCatColor } from '../data/articlesData'

const ARTICLES = loadArticles()

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

export default function ArticleDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const article    = ARTICLES.find(a => a.id === Number(id))

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

  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3)
  const others  = related.length < 3
    ? [...related, ...ARTICLES.filter(a => a.id !== article.id && !related.includes(a))].slice(0, 3)
    : related

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
            {/* meta */}
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
              <button className="ml-auto flex items-center gap-1.5 text-gray-400 hover:text-violet-600 transition-colors">
                <Share2 size={14} /> Ndaj
              </button>
            </div>

            {/* title */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8">
              {article.title}
            </h1>

            {/* excerpt */}
            <p className="text-lg text-violet-700 font-medium leading-relaxed mb-8 pl-4 border-l-4 border-violet-300 bg-violet-50 py-3 pr-4 rounded-r-xl">
              {article.excerpt}
            </p>

            {/* paragraphs */}
            <div className="space-y-6">
              {article.content.map((para, i) => (
                <p key={i} className="text-gray-700 leading-[1.85] text-[15px]">{para}</p>
              ))}
            </div>

            {/* divider */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Shkruar nga</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-black">
                      N
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{article.author}</p>
                      <p className="text-xs text-gray-400">Ekipi Editorial · NeuroSpace</p>
                    </div>
                  </div>
                </div>

                <Link to="/ask"
                  className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white font-bold rounded-xl text-sm hover:bg-violet-500 transition-colors shadow-md">
                  Pyet {article.author.split(' ')[0]} <ArrowRight size={14} />
                </Link>
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
