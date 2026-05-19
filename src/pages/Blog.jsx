import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Clock, ArrowLeft, BookOpen, Zap, ChevronRight, Tag } from 'lucide-react'
import BackButton from '../components/BackButton'
import { useMood }       from '../contexts/MoodContext'
import { BLOG_ARTICLES } from '../data/mockData'

const CATEGORIES = ['Të gjitha', 'Neuroshkencë', 'Terapia', 'Gjumë', 'Mindfulness']

const CAT_COLORS = {
  'Neuroshkencë': 'from-violet-500 to-purple-600',
  'Terapia':      'from-blue-500 to-cyan-500',
  'Gjumë':        'from-indigo-500 to-purple-500',
  'Mindfulness':  'from-emerald-500 to-teal-500',
}

function ArticleCard({ article, onClick, theme }) {
  return (
    <div
      className="glass rounded-3xl overflow-hidden shadow-card cursor-pointer hover:scale-[1.02] transition-all active:scale-[0.98]"
      onClick={() => onClick(article)}
    >
      <div className={`bg-gradient-to-br ${article.color} p-5 flex items-center justify-between`}>
        <span className="text-4xl">{article.emoji}</span>
        <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full">
          {article.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-black text-gray-800 text-base leading-tight mb-1">{article.title}</h3>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{article.subtitle}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-gray-400" />
            <span className="text-[11px] text-gray-400 font-semibold">{article.readTime} lexim</span>
          </div>
          {article.interactive && (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white flex items-center gap-1"
              style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
            >
              <Zap size={9} fill="white" strokeWidth={0} />
              Interaktiv
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ExerciseBlock({ exercise, theme }) {
  const [answer, setAnswer] = useState('')
  const [saved, setSaved]   = useState(false)

  function save() {
    if (!answer.trim()) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div
      className="rounded-2xl p-4 my-4"
      style={{
        background: `linear-gradient(135deg, ${theme.start}12, ${theme.end}12)`,
        border: `1.5px solid ${theme.start}33`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
        >
          <Zap size={12} color="white" fill="white" strokeWidth={0} />
        </div>
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: theme.start }}>
          Ushtrim interaktiv
        </p>
      </div>
      <h4 className="font-bold text-gray-800 text-sm mb-2">{exercise.title}</h4>
      <p className="text-xs text-gray-600 mb-3 leading-relaxed">{exercise.text}</p>
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Shkruaj përgjigjen tënde..."
        rows={3}
        className="w-full bg-white rounded-xl p-3 text-xs text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 resize-none"
        style={{ '--tw-ring-color': theme.start + '33' }}
      />
      <button
        onClick={save}
        className="mt-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
        style={saved
          ? { background: '#22c55e' }
          : { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }
        }
      >
        {saved ? '✓ Ruajtur!' : 'Ruaj përgjigjen'}
      </button>
    </div>
  )
}

function ArticleView({ article, onBack, theme }) {
  return (
    <div className="animate-fade-in">
      <div className={`bg-gradient-to-br ${article.color} px-5 pt-14 md:pt-6 pb-6 text-white md:rounded-3xl mb-4`}>
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center mb-4"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-5xl mb-3 block">{article.emoji}</span>
        <div className="flex items-center gap-2 mb-2">
          <Tag size={11} className="opacity-70" />
          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">{article.category}</span>
        </div>
        <h1 className="text-xl font-black mt-2 leading-tight">{article.title}</h1>
        <p className="text-sm opacity-80 mt-1 mb-3">{article.subtitle}</p>
        <div className="flex items-center gap-1.5 opacity-70">
          <Clock size={12} />
          <span className="text-xs font-semibold">{article.readTime} lexim</span>
        </div>
      </div>

      <div className="px-5 md:px-0 py-2 space-y-4 max-w-2xl">
        {article.content.map((block, i) => {
          if (block.type === 'p') {
            return <p key={i} className="text-sm text-gray-700 leading-7">{block.text}</p>
          }
          if (block.type === 'exercise') {
            return <ExerciseBlock key={i} exercise={block} theme={theme} />
          }
          return null
        })}

        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)` }}
          >
            <Zap size={18} style={{ color: theme.start }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-700">Provo teknikat praktike</p>
            <p className="text-xs text-gray-500">Zbato menjëherë çfarë mësove</p>
          </div>
          <ChevronRight size={15} className="text-gray-400 shrink-0" />
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}

export default function Blog() {
  const { theme }             = useMood()
  const { state }             = useLocation()
  const [cat, setCat]         = useState('Të gjitha')
  const [article, setArticle] = useState(() => {
    if (!state?.articleId) return null
    return BLOG_ARTICLES.find(a => a.id === state.articleId) || null
  })

  if (article) {
    return <ArticleView article={article} onBack={() => setArticle(null)} theme={theme} />
  }

  const filtered = cat === 'Të gjitha'
    ? BLOG_ARTICLES
    : BLOG_ARTICLES.filter(a => a.category === cat)

  return (
    <div className="animate-fade-in">
      <BackButton fallback="/home" />
      {/* Header */}
      <div
        className="px-5 pt-14 md:pt-6 pb-6 text-white md:rounded-3xl mb-4"
        style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
      >
        <div className="flex items-center gap-3">
          <BookOpen size={20} />
          <div>
            <h1 className="text-xl font-black">Artikuj</h1>
            <p className="text-white/70 text-xs">Psikologji e thjeshtë + Ushtrime interaktive</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0 space-y-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto widget-scroll pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 text-xs font-bold px-4 py-2 rounded-2xl transition-all ${
                cat === c ? 'text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
              }`}
              style={cat === c ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` } : {}}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured (only when no filter) */}
        {cat === 'Të gjitha' && (
          <div
            className={`rounded-3xl p-5 text-white shadow-lg relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-all bg-gradient-to-br ${BLOG_ARTICLES[0].color}`}
            onClick={() => setArticle(BLOG_ARTICLES[0])}
          >
            <div className="absolute top-0 right-0 text-8xl opacity-15 -translate-y-3 translate-x-3 leading-none">
              {BLOG_ARTICLES[0].emoji}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Tag size={11} className="opacity-70" />
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">I Featured</span>
            </div>
            <h2 className="font-black text-xl mt-2 leading-tight">{BLOG_ARTICLES[0].title}</h2>
            <p className="text-sm opacity-80 mt-1 mb-3">{BLOG_ARTICLES[0].subtitle}</p>
            <div className="flex items-center gap-2 opacity-80">
              <Clock size={12} />
              <span className="text-xs font-semibold">{BLOG_ARTICLES[0].readTime} lexim</span>
              <ChevronRight size={14} className="ml-1" />
            </div>
          </div>
        )}

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.slice(cat === 'Të gjitha' ? 1 : 0).map(a => (
            <ArticleCard key={a.id} article={a} onClick={setArticle} theme={theme} />
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
