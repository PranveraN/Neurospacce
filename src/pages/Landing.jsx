import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Brain, ArrowRight, Star, Shield, BookOpen, MessageCircle,
  Mail, Phone, Sparkles, CheckCircle, AlertCircle, Menu, X, Edit3, Trash2,
  Plus, Save, LayoutDashboard, Eye, EyeOff, Upload,
  Link2, RefreshCw, AlertTriangle, Zap, Users, Newspaper,
  BarChart2, FlaskConical, Archive, Globe, ChevronRight,
  Play, TrendingUp, Clock, Target, Layers,
  Quote, ArrowUpRight, Search, CalendarCheck, Heart, ShieldCheck,
} from 'lucide-react'
import { ARTICLES as INITIAL_ARTICLES, getCatColor } from '../data/articlesData'
import EditableText from '../components/EditableText'
import TeamMemberCard from '../components/TeamMemberCard'
import { TEAM_DEFAULTS } from './About'
import { PLATFORM_CATS } from '../data/categoriesData'
import { useAuth } from '../contexts/AuthContext'
import NeuroPulse from '../components/NeuroPulse'
import NeuroPulsePopup from '../components/NeuroPulsePopup'
import TestsSection      from '../components/landing/TestsSection'
import ParentingSection  from '../components/landing/ParentingSection'
import BookingSection    from '../components/landing/BookingSection'
import ServicesCarousel  from '../components/landing/ServicesCarousel'
import ProblemModal      from '../components/landing/ProblemModal'

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PERSISTENCE                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const NS_ARTICLES_KEY = 'ns_landing_articles'
function loadArticles() {
  try { const v = localStorage.getItem(NS_ARTICLES_KEY); return v ? JSON.parse(v) : INITIAL_ARTICLES } catch { return INITIAL_ARTICLES }
}
function saveArticles(list) {
  try { localStorage.setItem(NS_ARTICLES_KEY, JSON.stringify(list)) } catch {}
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PLATFORM DATA                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const STATS = [
  { value: '10K+',  label: 'Artikuj & Burime' },
  { value: '50+',   label: 'Eksperimente Labs' },
  { value: '25K+',  label: 'Anëtarë Aktivë'   },
  { value: '4.9★',  label: 'Vlerësim mesatar'  },
]

const HOW_STEPS = [
  { n: '01', icon: Target,    title: 'Zgjidh fushën tënde',    desc: 'Fillo me kategorinë që të intereson më shumë, nga neuroshkenca te produktiviteti.' },
  { n: '02', icon: Layers,    title: 'Mëso sipas shkencës',    desc: 'Çdo përmbajtje ndërtohet mbi kërkime të vërteta shkencore, jo mite apo klishe.' },
  { n: '03', icon: TrendingUp, title: 'Gjurmo progresin tënd', desc: 'Streak ditor, sfida dhe community mbajnë motivimin tuaj gjithmonë lart.' },
]

const TESTIMONIALS = [
  {
    text: 'NeuroSphera ndryshoi mënyrën time të studimit. Rezultatet u dyfishuan brenda 3 javësh me teknikat e tyre të bazuara në neuroshkencë.',
    name: 'Arjeta M.', role: 'Studente Mjekësie', avatar: 'A',
    stars: 5, color: '#7c3aed',
  },
  {
    text: 'Si entrepreneur, "Deep Work" dhe sistemet e fokusit nga NeuroSphera u bënë fondamenti i çdo dite produktive. Jashtzakonisht praktike.',
    name: 'Blerim K.', role: 'Themelues Startup', avatar: 'B',
    stars: 5, color: '#1d4ed8',
  },
  {
    text: 'Eksperimentet e Labs janë unik. Nuk ke ku gjet kurrë kaq shumë material praktik dhe shkencor bashkë në gjuhën shqipe.',
    name: 'Drita H.', role: 'Mësuese & Trainer', avatar: 'D',
    stars: 5, color: '#065f46',
  },
]

const DIFFERENTIATORS = [
  {
    icon: Brain,    title: 'Neural Learning Paths',
    desc: 'Rrugë mësimi të personalizuara bazuar në parimet e neuroplasticitetit, jo kurse lineare, por sisteme adaptive.',
    color: '#7c3aed',
  },
  {
    icon: FlaskConical, title: 'Interactive Labs',
    desc: 'Ushtrime dhe eksperimente të vërteta, jo vetëm lexim, por veprim i dokumentuar me rezultate të matshme.',
    color: '#065f46',
  },
  {
    icon: Zap,      title: 'Spaced Repetition Engine',
    desc: 'Sistemi ynë i brendshëm i kujtesës siguron që çfarë mëson sot, e mban edhe pas 6 muajsh.',
    color: '#b45309',
  },
  {
    icon: Users,    title: 'Community-Powered Learning',
    desc: 'Grupe studimi, sfida kolektive dhe mentorë realë, sepse mësohet më mirë bashkë.',
    color: '#0e7490',
  },
  {
    icon: Sparkles, title: 'AI Tutor Personal',
    desc: 'Rekomandime të personalizuara bazuar në interesat, historikun dhe qëllimet e çdo anëtari.',
    color: '#ec4899',
  },
]

const FORM_CATS = ['Neuroshkencë', 'Mësim', 'Produktivitet', 'Labs', 'Studime Rasti', 'Burime', 'Blog', 'Komuniteti']
const SOCIALS   = [{ label: 'IG', href: '#' }, { label: 'FB', href: '#' }, { label: 'LI', href: '#' }]

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ARTICLE MODAL (upload foto + URL)                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
function ArticleModal({ article, onSave, onClose }) {
  const [form, setForm] = useState(
    article ? { ...article }
            : { title: '', category: FORM_CATS[0], excerpt: '', image: '', readTime: '5 min', featured: false, author: 'Admin' }
  )
  const [imgTab,  setImgTab]  = useState('upload')
  const [dragOver,setDragOver]= useState(false)
  const [err,     setErr]     = useState('')
  const fileRef               = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) { setErr('Zgjidh një imazh (JPG, PNG, WEBP)'); return }
    setErr('')
    const img = new window.Image()
    const blobUrl = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 900
      let { width, height } = img
      if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      set('image', canvas.toDataURL('image/jpeg', 0.78))
      URL.revokeObjectURL(blobUrl)
    }
    img.src = blobUrl
  }

  const canSave = form.title.trim() && form.image.trim()

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
              <Edit3 size={15} className="text-violet-600" />
            </div>
            <h3 className="font-black text-gray-800">{article ? 'Edito artikullin' : 'Artikull i ri'}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200"><X size={15} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Titulli *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Titulli i artikullit..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Kategoria</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-300">
                {FORM_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Koha e leximit</label>
              <input value={form.readTime || ''} onChange={e => set('readTime', e.target.value)} placeholder="5 min"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-300" />
            </div>
          </div>

          {/* Image */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-500">Foto *</label>
              <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                {[['upload','Ngarko',Upload],['url','URL',Link2]].map(([t,l,Ic]) => (
                  <button key={t} onClick={() => setImgTab(t)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${imgTab===t?'bg-white text-violet-600 shadow-sm':'text-gray-400'}`}>
                    <Ic size={11}/>{l}
                  </button>
                ))}
              </div>
            </div>
            {imgTab === 'upload' && (
              <>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => processFile(e.target.files[0])} />
                {form.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video">
                    <img src={form.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-bold text-gray-700 shadow"><RefreshCw size={12}/> Ndrysho</button>
                      <button onClick={() => set('image','')} className="flex items-center gap-1.5 px-3 py-2 bg-red-500 rounded-lg text-xs font-bold text-white shadow"><Trash2 size={12}/> Fshi</button>
                    </div>
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">✓ Ngarkuar</span>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current?.click()}
                    onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
                    onDrop={e=>{e.preventDefault();setDragOver(false);processFile(e.dataTransfer.files[0])}}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver?'border-violet-400 bg-violet-50':'border-gray-200 hover:border-violet-300 hover:bg-gray-50'}`}>
                    <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-3"><Upload size={22} className="text-violet-500"/></div>
                    <p className="text-sm font-bold text-gray-700">Kliko ose tërhiq foton këtu</p>
                    <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WEBP</p>
                  </div>
                )}
                {err && <div className="flex items-center gap-2 mt-2 text-xs text-red-500"><AlertTriangle size={12}/>{err}</div>}
              </>
            )}
            {imgTab === 'url' && (
              <div className="space-y-2">
                <input value={form.image.startsWith('data:')?'':form.image} onChange={e=>set('image',e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-300"/>
                {form.image && !form.image.startsWith('data:') && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
                    <img src={form.image} alt="" loading="lazy" className="w-full h-full object-cover" onError={e=>e.target.style.opacity='0.3'}/>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Përshkrim i shkurtër</label>
            <textarea value={form.excerpt} onChange={e=>set('excerpt',e.target.value)} rows={3}
              placeholder="Një përshkrim tërheqës..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300 resize-none"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Autori</label>
            <input value={form.author||''} onChange={e=>set('author',e.target.value)} placeholder="Emri i autorit..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300"/>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div><p className="text-sm font-semibold text-gray-700">I rekomanduar (featured)</p><p className="text-[11px] text-gray-400">Shfaqet kryesor në landing</p></div>
            <button onClick={()=>set('featured',!form.featured)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.featured?'bg-violet-600':'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured?'translate-x-5':''}`}/>
            </button>
          </div>

          {!canSave && <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2"><AlertTriangle size={12}/> Titulli dhe foto janë të detyrueshme.</p>}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">Anulo</button>
          <button disabled={!canSave} onClick={()=>{if(canSave){onSave(form);onClose()}}}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all">
            <Save size={14}/>{article?'Ruaj ndryshimet':'Publiko'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ARTICLE CARD (with admin controls)                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
function ArticleCard({ article, isAdmin, onEdit, onDelete, onToggleFeatured }) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button onClick={e=>{e.preventDefault();onToggleFeatured(article.id)}} title={article.featured?'Hiq featured':'Bëj featured'}
            className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-md hover:bg-amber-600 transition-colors">
            <Star size={13} fill={article.featured?'white':'none'}/>
          </button>
          <button onClick={e=>{e.preventDefault();onEdit(article)}}
            className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
            <Edit3 size={13}/>
          </button>
          <button onClick={e=>{e.preventDefault();onDelete(article.id)}}
            className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors">
            <Trash2 size={13}/>
          </button>
        </div>
      )}
      {isAdmin && article.featured && (
        <div className="absolute top-2 left-2 z-20">
          <span className="text-[10px] font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full shadow">Featured</span>
        </div>
      )}
      <Link to={`/articles/${article.id}`} className="flex flex-col flex-1">
        <div className="relative overflow-hidden aspect-video">
          <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
          <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${getCatColor(article.category)}`}>
            {article.category}
          </span>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">{article.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11}/>{article.readTime}</span>
            <span className="text-xs font-bold text-violet-600 flex items-center gap-1 group-hover:gap-2 transition-all">Lexo<ArrowRight size={12}/></span>
          </div>
        </div>
      </Link>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ADMIN BAR                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const ADMIN_BAR_H = 44

function AdminBar({ onAdd, articleCount }) {
  const navigate = useNavigate()
  return (
    <div
      className="fixed top-16 left-0 right-0 z-[60] bg-gradient-to-r from-violet-700 via-violet-600 to-blue-700 text-white px-4"
      style={{ height: ADMIN_BAR_H }}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield size={13} className="opacity-80 shrink-0"/>
          <span className="text-xs font-bold">Admin</span>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full">{articleCount} artikuj</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => navigate('/ns-secure-7381')}
            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg transition-colors border border-white/20">
            <LayoutDashboard size={11}/> Paneli
          </button>
          <button onClick={onAdd}
            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 bg-white text-violet-700 hover:bg-violet-50 rounded-lg transition-colors shadow-sm">
            <Plus size={11}/> Shto artikull
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  LOGIN MODAL                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function LoginModal({ onClose }) {
  const { login }               = useAuth()
  const navigate                = useNavigate()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [err,  setErr]          = useState('')
  const [loading, setLoad]      = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [statusMsg, setStatus]  = useState('')
  const timerRef                = useRef(null)

  async function handleSubmit(e) {
    if (e?.preventDefault) e.preventDefault()
    if (!form.email || !form.password) { setErr('Plotëso të dy fushat'); return }
    setLoad(true)
    setErr('')
    setStatus('')

    // After 5s still loading → tell user we're connecting
    timerRef.current = setTimeout(
      () => setStatus('Duke u lidhur… (mund të duhen deri 20 sekonda)'),
      5000
    )

    try {
      const res = await login({ email: form.email, password: form.password })

      clearTimeout(timerRef.current)
      setStatus('')

      if (!res.success) {
        setErr(res.error || 'Email ose fjalëkalim i gabuar')
        return
      }

      if (res.user?.role !== 'admin') {
        setErr(`Llogaria "${res.user?.email}" ka rol "${res.user?.role}" — jo admin. Ndrysho rolin te Supabase dashboard → profiles → role = "admin".`)
        return
      }

      onClose()
      navigate('/ns-secure-7381')
    } catch (caught) {
      clearTimeout(timerRef.current)
      setStatus('')
      setErr(`Gabim: ${caught?.message || 'i papritur'}`)
    } finally {
      clearTimeout(timerRef.current)
      setLoad(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-md">
              <Brain size={16} color="white" strokeWidth={2}/>
            </div>
            <div><p className="font-black text-gray-900 text-base leading-tight">Kyçu në NeuroSphera</p><p className="text-[10px] text-gray-400">Admin ose anëtar</p></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200"><X size={15}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="email" value={form.email} onChange={e=>{setForm(f=>({...f,email:e.target.value}));setErr('')}}
                placeholder="email@shembull.com"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 transition-colors"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Fjalëkalimi</label>
            <div className="relative">
              <input type={showPw?'text':'password'} value={form.password} onChange={e=>{setForm(f=>({...f,password:e.target.value}));setErr('')}}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 transition-colors pr-10"/>
              <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw?<EyeOff size={14}/>:<Eye size={14}/>}
              </button>
            </div>
          </div>
          {statusMsg && !err && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
              <span className="w-3 h-3 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin shrink-0"/>
              <p className="text-xs text-blue-600 leading-relaxed">{statusMsg}</p>
            </div>
          )}
          {err && (
            <div className="flex flex-col gap-2 bg-red-50 border-2 border-red-200 rounded-xl px-3 py-2.5">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0"/>
                <p className="text-xs text-red-600 font-semibold leading-relaxed">{err}</p>
              </div>
              <button type="button" onClick={handleSubmit}
                className="self-start text-xs text-red-600 underline font-bold hover:text-red-800">
                Provo sërish →
              </button>
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><ArrowRight size={14}/> Kyçu</>}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          Nuk ke llogari? <Link to="/auth" onClick={onClose} className="text-violet-600 font-bold hover:underline">Regjistrohu falas</Link>
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SEARCH OVERLAY                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */
function SearchOverlay({ onClose }) {
  const [q, setQ] = useState('')
  const navigate  = useNavigate()
  const inputRef  = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const allArticles = useMemo(() => {
    try { const v = localStorage.getItem('ns_landing_articles'); return v ? JSON.parse(v) : INITIAL_ARTICLES } catch { return INITIAL_ARTICLES }
  }, [])

  const results = q.length >= 2
    ? allArticles.filter(a =>
        a.title?.toLowerCase().includes(q.toLowerCase()) ||
        (a.excerpt || '').toLowerCase().includes(q.toLowerCase()) ||
        (a.category || '').toLowerCase().includes(q.toLowerCase())
      ).slice(0, 6)
    : []

  function go(id) { navigate(`/articles/${id}`); onClose() }

  return (
    <div className="fixed inset-0 z-[300] flex flex-col" onClick={onClose}>
      <div className="bg-black/60 backdrop-blur-sm absolute inset-0"/>

      <div className="relative mt-20 mx-auto w-full max-w-2xl px-4" onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Kërko artikuj, tema, kategori..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl text-base bg-white shadow-2xl border border-gray-200 focus:outline-none focus:border-violet-400 text-gray-800"
          />
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={18}/>
          </button>
        </div>

        {/* Category shortcuts */}
        {!q && (
          <div className="mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Kategori të shpejta</p>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORM_CATS.map(cat => {
                const Icon = cat.icon
                return (
                  <Link key={cat.id} to={`/category/${cat.id}`} onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})` }}>
                      <Icon size={15} color="white" strokeWidth={2}/>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 leading-tight">{cat.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {q.length >= 2 && (
          <div className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {results.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-sm">Asnjë rezultat për <strong>"{q}"</strong></p>
              </div>
            ) : (
              <div>
                <div className="px-4 py-2.5 border-b border-gray-50">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{results.length} rezultate</p>
                </div>
                {results.map(a => (
                  <button key={a.id} onClick={() => go(a.id)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img src={a.image} alt="" loading="lazy" className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm leading-snug line-clamp-1">{a.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.excerpt}</p>
                    </div>
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                      {a.category}
                    </div>
                  </button>
                ))}
                <div className="px-4 py-3 border-t border-gray-100">
                  <Link to={`/articles`} onClick={onClose}
                    className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
                    Shiko të gjithë artikujt <ArrowRight size={12}/>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  NAV                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function LandingNav() {
  const [scrolled,    setScrolled]   = useState(false)
  const [open,        setOpen]       = useState(false)
  const [showLogin,   setShowLogin]  = useState(false)
  const [showSearch,  setShowSearch] = useState(false)
  const { user, logout }             = useAuth()
  const navigate                     = useNavigate()

  useEffect(() => {
    const getScroll = () =>
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
    const fn = () => setScrolled(getScroll() > 8)
    fn() // check immediately on mount
    window.addEventListener('scroll', fn, { passive: true })
    document.addEventListener('scroll', fn, { passive: true })
    return () => {
      window.removeEventListener('scroll', fn)
      document.removeEventListener('scroll', fn)
    }
  }, [])

  const navLinks = [
    { to: '/library',   label: 'NeuroArtikuj' },
    { to: '/brainboost',label: 'BrainBoost'   },
    { to: '/career',    label: 'Karriera IQ'  },
    { to: '/ask',       label: 'Psikologu yt' },
    { to: '/tests',     label: 'Teste'        },
    { to: '/parenting', label: 'Familje'      },
    { to: '/pricing',   label: 'Planet'       },
    { to: '/about',     label: 'Rreth nesh'   },
  ]

  const tc = (light, dark) => scrolled ? light : dark

  return (
    <>
      {showLogin  && <LoginModal    onClose={() => setShowLogin(false)} />}
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}

      <nav
        className={`fixed left-0 right-0 z-[80] transition-all duration-300 ${user?.role === 'admin' ? 'top-[44px]' : 'top-0'}`}
        style={scrolled ? {
          background: '#ffffff',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(139,92,246,0.15)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(109,40,217,0.10), 0 20px 60px rgba(0,0,0,0.06)',
        } : {
          background: 'rgba(3,7,17,0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
        {/* Accent line — always visible when scrolled */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg,#7c3aed 0%,#a855f7 45%,#3b82f6 100%)',
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}/>

        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mr-2 shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md border transition-all duration-300 ${scrolled ? 'bg-gradient-to-br from-violet-600 to-blue-600 border-violet-400 shadow-violet-200' : 'bg-white/15 border-white/30'}`}>
              <Brain size={18} color="white" strokeWidth={2}/>
            </div>
            <span className={`font-black text-base transition-colors duration-300 ${tc('text-gray-900','text-white')}`}>NeuroSphera</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${tc('text-gray-600 hover:bg-gray-100 hover:text-gray-900','text-white/80 hover:text-white hover:bg-white/10')}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Search + Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {/* Search button */}
            <button onClick={() => setShowSearch(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${tc('text-gray-600 hover:bg-gray-100','text-white/80 hover:text-white hover:bg-white/10')}`}>
              <Search size={15}/>
              <span className="hidden lg:inline">Kërko</span>
            </button>

            {/* NeuroPulse — intelligent emotional core */}
            <NeuroPulse scrolled={scrolled}/>

            {user ? (
              <button onClick={logout}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-colors ${tc('text-gray-500 hover:bg-gray-100','text-white/60 hover:bg-white/10')}`}>
                Dil
              </button>
            ) : (
              <button onClick={() => setShowLogin(true)}
                className={`px-4 py-2 text-sm font-semibold transition-colors rounded-xl ${tc('text-gray-600 hover:bg-gray-100','text-white/80 hover:text-white hover:bg-white/10')}`}>
                Hyr
              </button>
            )}
          </div>

          {/* Mobile right actions */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button onClick={() => setShowSearch(true)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${scrolled ? 'border border-gray-200 text-gray-700' : 'bg-white/15 text-white border border-white/30'}`}>
              <Search size={16}/>
            </button>
            {user && (
              <button onClick={logout}
                className={`px-3 h-9 text-sm font-semibold rounded-xl transition-colors ${scrolled ? 'border border-gray-200 text-gray-600' : 'bg-white/15 text-white border border-white/30'}`}>
                Dil
              </button>
            )}
            <button onClick={() => setOpen(!open)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${scrolled ? 'border border-gray-200 text-gray-700' : 'bg-white/15 text-white border border-white/30'}`}>
              {open ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-1 shadow-lg animate-fade-in">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  l.to === '/library'
                    ? 'text-violet-700 bg-violet-50 hover:bg-violet-100'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}>
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
              <Link to={user ? '/home' : '/auth'} onClick={() => setOpen(false)}
                className="flex-1 py-3 text-center text-sm font-black text-white rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  boxShadow: '0 6px 20px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                  border: '1px solid rgba(167,139,250,0.35)',
                }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#c4b5fd', display:'inline-block', animation:'pulse 1.8s infinite' }}/>
                NeuroPulse
              </Link>
              {user ? (
                <button onClick={() => { logout(); setOpen(false) }}
                  className="px-4 py-3 text-sm font-semibold border border-gray-200 rounded-2xl text-gray-600">
                  Dil
                </button>
              ) : (
                <button onClick={() => { setShowLogin(true); setOpen(false) }}
                  className="px-4 py-3 text-sm font-semibold border border-gray-200 rounded-2xl text-gray-600">
                  Hyr
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  STARFIELD                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x:  Math.sin(i * 47.3) * 50 + 50,
  y:  Math.cos(i * 31.7) * 50 + 50,
  sz: (Math.sin(i * 13.1) * 0.5 + 0.5) * 1.8 + 0.4,
  dur: (Math.sin(i * 7.9) * 0.5 + 0.5) * 4 + 2,
  del: (Math.cos(i * 5.3) * 0.5 + 0.5) * 5,
}))

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {STARS.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.sz, height: s.sz,
            animation: `twinkle ${s.dur}s ${s.del}s infinite alternate ease-in-out`,
            opacity: 0.3,
          }}/>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HERO CAROUSEL DATA                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
const CAROUSEL_MODULES = [
  {
    icon: Brain, title: 'AI Assistant',
    desc: 'NeuroAI të udhëzon tek eksperti i duhur dhe artikujt relevantë për situatën tënde.',
    color: '#a78bfa', grad: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
    bg: 'rgba(124,58,237,0.18)', preview: 'chat',
    photo: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&q=80',
    tag: 'AI · 24/7',
    stat: '50K+ sesione',
  },
  {
    icon: CalendarCheck, title: 'Rezervo Takim',
    desc: 'Psikolog i licencuar të gatshëm brenda 60 sekondave.',
    color: '#34d399', grad: 'linear-gradient(135deg,#059669,#10b981)',
    bg: 'rgba(16,185,129,0.15)', preview: 'booking',
    photo: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&q=80',
    tag: '8 Psikologë · Online',
    stat: '98% satisfaksion',
  },
  {
    icon: Users, title: 'Komunitet',
    desc: 'Histori reale, mbështetje nga njerëz që kuptojnë.',
    color: '#93c5fd', grad: 'linear-gradient(135deg,#2563eb,#3b82f6)',
    bg: 'rgba(59,130,246,0.15)', preview: 'patients',
    photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80',
    tag: 'Komunitet · Live',
    stat: '2.4K+ anëtarë',
  },
  {
    icon: BarChart2, title: 'Gjurmim Humori',
    desc: 'Analiza e humorit çdo ditë me insight-e nga AI.',
    color: '#fcd34d', grad: 'linear-gradient(135deg,#d97706,#f59e0b)',
    bg: 'rgba(245,158,11,0.15)', preview: 'mood',
    photo: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80',
    tag: 'Çdo ditë · Smart',
    stat: '30 ditë historik',
  },
  {
    icon: Play, title: 'Sesione Video',
    desc: 'Terapi online me cilësi HD direkt nga shtëpia jote.',
    color: '#f9a8d4', grad: 'linear-gradient(135deg,#db2777,#ec4899)',
    bg: 'rgba(236,72,153,0.15)', preview: 'video',
    photo: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=700&q=80',
    tag: 'HD · E sigurt',
    stat: '500+ sesione',
  },
  {
    icon: TrendingUp, title: 'Raporte & Progres',
    desc: 'Progresi yt mendor në raporte javore dhe mujore.',
    color: '#c4b5fd', grad: 'linear-gradient(135deg,#7c3aed,#8b5cf6)',
    bg: 'rgba(139,92,246,0.15)', preview: 'reports',
    photo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80',
    tag: 'Raporte · PDF',
    stat: 'Insight javor',
  },
]

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HERO                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function HeroSection() {
  const [slide, setSlide] = useState(0)
  const [key,   setKey]   = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setSlide(s => (s + 1) % CAROUSEL_MODULES.length)
      setKey(k => k + 1)
    }, 3200)
    return () => clearInterval(t)
  }, [])

  const mod = CAROUSEL_MODULES[slide]
  const Icon = mod.icon

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #030711 0%, #0d0520 40%, #16042e 70%, #0a0118 100%)' }}>

      {/* Starfield */}
      <StarField/>

      {/* Animated nebula orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute animate-orb-pulse rounded-full"
          style={{ width: 600, height: 600, top: '-15%', left: '-10%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }}/>
        <div className="absolute animate-orb-pulse rounded-full"
          style={{ width: 500, height: 500, top: '20%', right: '-8%', animationDelay: '2s',
            background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }}/>
        <div className="absolute animate-orb-pulse rounded-full"
          style={{ width: 400, height: 400, bottom: '5%', left: '30%', animationDelay: '1s',
            background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)' }}/>
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '36px 36px' }}/>

      <div className="relative max-w-7xl mx-auto px-5 pt-16 pb-24 md:pt-20 md:pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-24 items-center">

          {/* ── LEFT ─────────────────────────────────────────────── */}
          <div className="animate-slide-up">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8 backdrop-blur-sm"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(167,139,250,0.25)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0"/>
              <EditableText id="hero-badge" as="span" className="text-violet-300 text-sm font-semibold tracking-wide">Platforma #1 e shëndetit mendor</EditableText>
            </div>

            {/* Headline */}
            <h1 className="font-black text-white leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)' }}>
              <EditableText id="hero-h1-line1" as="span">Mendo më</EditableText>
              {' '}
              <EditableText id="hero-h1-line2" as="span" className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #c084fc 20%, #f472b6 80%)' }}>
                qartë.
              </EditableText>
              <br/>
              <EditableText id="hero-h1-line3" as="span">Ndihu më</EditableText>
              {' '}
              <EditableText id="hero-h1-line4" as="span" className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #67e8f9 20%, #34d399 80%)' }}>
                mirë.
              </EditableText>
            </h1>

            {/* Sub */}
            <EditableText id="hero-subtitle" as="p" multiline
              className="text-white/50 leading-relaxed mb-10 max-w-md"
              style={{ fontSize: '1.1rem' }}>
              NeuroSphera bashkon psikologji klinike, AI dhe gjurmim humori për mbështetje e vërtetë mendore, çdo ditë, kudo.
            </EditableText>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link to="/auth"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-black text-white transition-all duration-200 hover:scale-[1.03] hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 8px 32px rgba(124,58,237,0.4), 0 0 0 1px rgba(255,255,255,0.08)' }}>
                <EditableText id="hero-cta1" as="span">Fillo falas sot</EditableText> <ArrowRight size={18}/>
              </Link>
              <Link to="/book"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white/75 hover:text-white transition-all duration-200 hover:bg-white/8 backdrop-blur-sm"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <CalendarCheck size={17}/> <EditableText id="hero-cta2" as="span">Rezervo takim</EditableText>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5">
              <div className="flex -space-x-2.5">
                {[['A','#7c3aed'],['B','#2563eb'],['D','#059669'],['E','#d97706'],['F','#ec4899']].map(([l,bg]) => (
                  <div key={l} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black text-white"
                    style={{ borderColor: '#030711', background: bg }}>{l}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#fbbf24" color="#fbbf24"/>)}
                  <span className="text-white/40 text-xs ml-2">4.9/5</span>
                </div>
                <EditableText id="hero-social-proof" as="p" className="text-white/35 text-xs">Platforma pioniere e shëndetit mendor</EditableText>
              </div>
            </div>
          </div>

          {/* ── RIGHT: carousel ──────────────────────────────────── */}
          <div className="flex flex-col items-center gap-6 relative mt-8 lg:mt-0">

            {/* Floating stat badges */}
            <div className="absolute -left-6 top-10 animate-badge flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-xl backdrop-blur-md z-10"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(52,211,153,0.25)' }}>
              <span className="text-lg">🔥</span>
              <div><p className="text-white font-bold text-xs leading-tight">14 ditë streak</p><p className="text-green-400 text-[10px]">Vazhdo kështu!</p></div>
            </div>

            <div className="absolute -right-4 top-16 animate-badge flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-xl backdrop-blur-md z-10"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(167,139,250,0.25)', animationDelay: '1.5s' }}>
              <div className="flex -space-x-1.5">
                {['#7c3aed','#ec4899','#3b82f6'].map((c,i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white/20" style={{ background: c }}/>
                ))}
              </div>
              <p className="text-white/80 text-[11px] font-semibold">+12 sot aktiv</p>
            </div>

            <div className="absolute -left-2 bottom-16 animate-badge z-10 flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-xl backdrop-blur-md"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(147,197,253,0.25)', animationDelay: '0.8s' }}>
              <CalendarCheck size={14} color="#93c5fd"/>
              <div><p className="text-white text-[11px] font-bold">Takim ✓</p><p className="text-blue-300 text-[10px]">Dr. Arta K. · 10:00</p></div>
            </div>

            {/* ── PREMIUM CAROUSEL CARD ── */}
            <div className="relative w-[380px]">

              {/* Outer glow halo */}
              <div className="absolute -inset-4 rounded-[2.5rem] pointer-events-none blur-2xl opacity-40 transition-all duration-700"
                style={{ background: `radial-gradient(ellipse at 50% 40%, ${mod.color}55, transparent 70%)` }}/>

              <div key={key} className="animate-carousel relative rounded-[2rem] overflow-hidden shadow-2xl"
                style={{
                  background: 'rgba(8,4,24,0.85)',
                  border: `1px solid ${mod.color}35`,
                  backdropFilter: 'blur(32px)',
                  boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${mod.color}20, inset 0 1px 0 rgba(255,255,255,0.07)`,
                }}>

                {/* ── Photo area ── */}
                <div className="relative h-[195px] overflow-hidden">
                  <img
                    src={mod.photo}
                    alt={mod.title}
                    className="w-full h-full object-cover transition-transform duration-700 scale-[1.04]"
                  />
                  {/* Multi-layer darkening + color tint */}
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(8,4,24,0.0) 40%, rgba(8,4,24,0.95) 100%)` }}/>
                  <div className="absolute inset-0 mix-blend-color opacity-25"
                    style={{ background: mod.grad }}/>

                  {/* Top-left tag pill */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(8,4,24,0.72)', border: `1px solid ${mod.color}45`, backdropFilter: 'blur(10px)' }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: mod.color }}/>
                    <span className="text-[10px] font-bold tracking-wide" style={{ color: mod.color }}>{mod.tag}</span>
                  </div>

                  {/* Top-right stat */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(8,4,24,0.72)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                    <span className="text-[10px] font-bold text-white/70">{mod.stat}</span>
                  </div>

                  {/* Dot nav — bottom of photo */}
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {CAROUSEL_MODULES.map((_, i) => (
                      <button key={i} onClick={() => { setSlide(i); setKey(k => k + 1) }}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === slide ? 18 : 6, height: 6,
                          background: i === slide ? mod.color : 'rgba(255,255,255,0.3)',
                        }}/>
                    ))}
                  </div>
                </div>

                {/* ── Card body ── */}
                <div className="px-5 pt-4 pb-5">

                  {/* Icon + title row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                      style={{ background: mod.grad, boxShadow: `0 6px 20px ${mod.color}50` }}>
                      <Icon size={18} color="white" strokeWidth={2}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black text-[15px] leading-tight">{mod.title}</p>
                      <p className="text-white/40 text-[11px] mt-0.5 leading-snug">{mod.desc}</p>
                    </div>
                  </div>

                  {/* Mini progress bars — decorative */}
                  <div className="space-y-2 mb-4">
                    {[['Progresi juaj', 72], ['Qëllimi javor', 55], ['Ndjeshmëria', 88]].map(([label, pct]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-[9px] text-white/30 w-24 shrink-0">{label}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, background: mod.grad }}/>
                        </div>
                        <span className="text-[9px] font-bold w-6 text-right" style={{ color: mod.color }}>{pct}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-3"
                    style={{ borderTop: `1px solid ${mod.color}18` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: mod.color }}/>
                      <span className="text-white/35 text-[11px]">Aktiv tani</span>
                    </div>
                    <Link to="/auth"
                      className="flex items-center gap-1.5 text-[11px] font-black px-4 py-2 rounded-xl transition-all hover:opacity-90 hover:scale-105"
                      style={{ background: mod.grad, color: 'white', boxShadow: `0 4px 14px ${mod.color}40` }}>
                      Hap <ArrowRight size={11}/>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Module grid pills ── */}
            <div className="grid grid-cols-3 gap-2 w-[380px]">
              {CAROUSEL_MODULES.map((m, i) => {
                const MI = m.icon
                const isAct = i === slide
                return (
                  <button key={i} onClick={() => { setSlide(i); setKey(k => k + 1) }}
                    className="relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all duration-200 overflow-hidden"
                    style={{
                      background: isAct ? m.bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isAct ? m.color + '50' : 'rgba(255,255,255,0.07)'}`,
                      transform: isAct ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isAct ? `0 4px 16px ${m.color}25` : 'none',
                    }}>
                    {isAct && (
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(circle at 50% 0%, ${m.color}20, transparent 70%)` }}/>
                    )}
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center relative"
                      style={{ background: isAct ? m.grad : 'rgba(255,255,255,0.07)', boxShadow: isAct ? `0 4px 12px ${m.color}40` : 'none' }}>
                      <MI size={13} color={isAct ? 'white' : 'rgba(255,255,255,0.35)'} strokeWidth={2}/>
                    </div>
                    <span className="text-[9px] font-bold leading-tight text-center relative"
                      style={{ color: isAct ? m.color : 'rgba(255,255,255,0.28)' }}>
                      {m.title.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-16 lg:mt-20">
          {STATS.map(({ value, label }, i) => (
            <div key={label} className="text-center rounded-2xl py-4 px-3 backdrop-blur-sm transition-all hover:bg-white/6"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <EditableText id={`hero-stat-${i}-value`} as="p" className="text-xl font-black text-white mb-0.5">{value}</EditableText>
              <EditableText id={`hero-stat-${i}-label`} as="p" className="text-[11px] text-white/35 font-medium">{label}</EditableText>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }}/>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  STATS BAR                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function StatsBar() {
  const TRUST = [
    { icon: ShieldCheck, label: 'Konfidenciale 100%', color: '#059669' },
    { icon: Users,       label: 'Komunitet aktiv',     color: '#7c3aed' },
    { icon: Star,        label: 'Vlerësim 4.9/5',     color: '#d97706' },
    { icon: Heart,       label: 'Psikologë të licencuar', color: '#ec4899' },
  ]
  return (
    <section className="bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-gray-100">
          {TRUST.map(({ icon: Icon, label, color }, i) => (
            <div key={label} className="flex items-center justify-center gap-3 px-6 py-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '15' }}>
                <Icon size={17} style={{ color }} strokeWidth={2}/>
              </div>
              <EditableText id={`trust-${i}-label`} as="p" className="text-sm font-bold text-gray-700">{label}</EditableText>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PROBLEM SECTION                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
const PROBLEMS = [
  {
    key: 'memory', icon: '😵',
    title: 'Mëson shumë, por nuk mban mend asgjë',
    sub: 'Memory · Active Recall · Spaced Repetition',
    tags: ['Ebbinghaus Curve', 'Testing Effect', 'Make It Stick'],
    color: '#a78bfa', border: 'rgba(167,139,250,0.25)', bg: 'rgba(124,58,237,0.10)',
    stat: '70% harrohet / 24 orë',
  },
  {
    key: 'distraction', icon: '📱',
    title: 'Distraktimet marrin 70% të ditës',
    sub: 'Focus · Deep Work · Dopamine',
    tags: ['Attention Residue', 'Pomodoro', 'Flow State'],
    color: '#f9a8d4', border: 'rgba(249,168,212,0.25)', bg: 'rgba(236,72,153,0.10)',
    stat: '23 min rifokusim pas ndërhyrjeje',
  },
  {
    key: 'motivation', icon: '🔄',
    title: 'Motivimi vjen e shkon dhe nuk ka sistem',
    sub: 'Habit Loop · Tiny Habits · Identity',
    tags: ['Self-Determination', 'Atomic Habits', 'BJ Fogg'],
    color: '#6ee7b7', border: 'rgba(110,231,183,0.25)', bg: 'rgba(16,185,129,0.10)',
    stat: '66 ditë mesatare formim zakoni',
  },
]

function ProblemSection() {
  const [open, setOpen] = useState(null)

  return (
    <>
      {open && <ProblemModal problemKey={open} onClose={() => setOpen(null)}/>}

      <section className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #030711 0%, #0e0525 100%)' }}>

        {/* Subtle bg glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(124,58,237,0.08) 0%, transparent 70%)' }}/>

        <div className="relative max-w-7xl mx-auto px-5">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-full mb-5">Problemi real</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              <EditableText id="problem-h2">Informacion pa sistem =</EditableText><br/>
              <EditableText id="problem-h2-accent" as="span" className="text-red-400">kaos kognitiv</EditableText>
            </h2>
            <EditableText id="problem-sub" as="p" multiline className="text-white/55 text-lg leading-relaxed">
              Shumë njerëz kanë akses në informacion, por pak dinë si ta shndërrojnë atë në aftësi të vërteta. Kliko çdo problem për zgjidhjet shkencore.
            </EditableText>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {PROBLEMS.map((p, pi) => (
              <button key={p.key} onClick={() => setOpen(p.key)}
                className="group text-left flex flex-col gap-4 p-5 rounded-3xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{
                  background: p.bg, border: `1px solid ${p.border}`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = p.bg.replace('0.10', '0.16'); e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 40px ${p.border.replace('0.25','0.2')}` }}
                onMouseLeave={e => { e.currentTarget.style.background = p.bg; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)' }}>

                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.icon}</span>
                    <div className="min-w-0">
                      <EditableText id={`problem-item-${pi}`} as="p" className="font-black text-white text-sm leading-snug">{p.title}</EditableText>
                      <p className="text-[10px] mt-0.5" style={{ color: p.color }}>{p.sub}</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: p.color + '22', color: p.color }}>
                    <ArrowRight size={13}/>
                  </div>
                </div>

                {/* Stat badge */}
                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: 'rgba(0,0,0,0.25)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: p.color }}/>
                  <p className="text-[10px] font-mono font-bold" style={{ color: p.color }}>{p.stat}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(t => (
                    <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <p className="text-[11px] font-bold" style={{ color: p.color }}>Eksploro zgjidhjet shkencore</p>
                  <ArrowRight size={11} style={{ color: p.color }} className="group-hover:translate-x-1 transition-transform"/>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CATEGORIES                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
function CategoriesSection() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="categories" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 px-4 py-2 rounded-full mb-4">8 Kategori Kryesore</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            <EditableText id="cats-h2">Gjithçka që nevojitet,</EditableText><br/>
            <EditableText id="cats-h2-accent" as="span" className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}>në një vend</EditableText>
          </h2>
          <EditableText id="cats-sub" as="p" multiline className="text-gray-500 text-lg max-w-2xl mx-auto">
            Nga neuroshkenca bazë te eksperimentet avancuara, struktura e ndërtuar sipas mënyrës si funksionon truri.
          </EditableText>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLATFORM_CATS.map((cat) => {
            const Icon = cat.icon
            const isHov = hovered === cat.id
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                className="group bg-white rounded-3xl p-6 border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden block"
                style={isHov ? { boxShadow: `0 20px 60px ${cat.from}25` } : {}}
              >
                {/* BG glow */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle, ${cat.from}55, transparent)` }}/>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 relative"
                  style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})`, boxShadow: isHov ? `0 8px 24px ${cat.from}55` : 'none' }}>
                  <Icon size={22} color="white" strokeWidth={2}/>
                </div>

                {/* Label + count */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-black text-gray-900 text-sm leading-snug pr-2 group-hover:text-violet-700 transition-colors">{cat.label}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                    style={{ background: cat.soft, color: cat.from }}>
                    {cat.count}+
                  </span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{cat.desc}</p>

                {/* Sub-tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.sub.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                      {s}
                    </span>
                  ))}
                  {cat.sub.length > 3 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-400">+{cat.sub.length - 3}</span>
                  )}
                </div>

                {/* Arrow */}
                <div className="absolute bottom-4 right-4 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})` }}>
                  <ArrowUpRight size={13} color="white" strokeWidth={2.5}/>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HOW IT WORKS                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: 'linear-gradient(160deg, #0e0525 0%, #1a0535 100%)' }}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full mb-4">Si funksionon</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            <EditableText id="how-h2">3 hapa drejt</EditableText><br/>
            <EditableText id="how-h2-accent" as="span" className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #34d399, #60a5fa)' }}>zhvillimit real</EditableText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)' }}/>

          {HOW_STEPS.map(({ n, icon: Icon, title, desc }, i) => (
            <div key={n} className="relative text-center">
              <div className="flex flex-col items-center">
                {/* Number */}
                <div className="text-[10px] font-black text-white/30 mb-3 tracking-widest">{n}</div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Icon size={32} color="white" strokeWidth={1.5}/>
                  {i < HOW_STEPS.length - 1 && (
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:block">
                      <ChevronRight size={20} className="text-white/20"/>
                    </div>
                  )}
                </div>

                <EditableText id={`how-${i}-title`} as="h3" className="font-black text-white text-lg mb-3">{title}</EditableText>
                <EditableText id={`how-${i}-desc`} as="p" multiline className="text-white/55 text-sm leading-relaxed max-w-xs mx-auto">{desc}</EditableText>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DIFFERENTIATORS                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
function DifferentiatorsSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 px-4 py-2 rounded-full mb-6">
              <EditableText id="diff-badge">Pse NeuroSphera</EditableText>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              <EditableText id="diff-h2-line1">Jo vetëm</EditableText><br/>
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                <EditableText id="diff-h2-line2">përmbajtje</EditableText>
              </span>
              <br/><EditableText id="diff-h2-line3">por transformim</EditableText>
            </h2>
            <EditableText id="diff-sub" as="p" multiline className="text-gray-500 text-lg leading-relaxed mb-8">
              Portalet tjera ofrojnë artikuj. NeuroSphera ofron një sistem të plotë, nga teoria te praktika, nga leximi te zakoni i qëndrueshëm.
            </EditableText>
            <Link to="/auth"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg hover:scale-105 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}>
              <EditableText id="diff-cta" as="span">Fillo pa kushte</EditableText> <ArrowRight size={16}/>
            </Link>
          </div>

          <div className="space-y-4">
            {DIFFERENTIATORS.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group bg-gray-50 hover:bg-white">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: color + '15' }}>
                  <Icon size={18} strokeWidth={2} style={{ color }}/>
                </div>
                <div>
                  <EditableText id={`diff-item-${i}-title`} as="h4" className="font-bold text-gray-900 text-sm mb-1">{title}</EditableText>
                  <EditableText id={`diff-item-${i}-desc`} as="p" multiline className="text-gray-500 text-xs leading-relaxed">{desc}</EditableText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  BRAINBOOST TEASER                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
const BB_MODULES = [
  { icon:'⏱', name:'Focus Sprint',      desc:'Pomodoro me neurofeedback' },
  { icon:'🧠', name:'BrainType Test',    desc:'Zbulo stilin tënd kognitiv' },
  { icon:'⚔️', name:'Study Battle',      desc:'Misione XP & streak ditor' },
  { icon:'🎵', name:'Deep Focus Sounds', desc:'Tinguj AI + upload tëndi' },
  { icon:'💧', name:'Hidratimi',          desc:'Ujë çdo 30 min' },
  { icon:'📊', name:'Focus Analytics',   desc:'Statistika orash fokusi' },
]

function BrainBoostSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'linear-gradient(160deg,#030711 0%,#0e0525 50%,#030711 100%)' }}>

      {/* ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }}/>
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#3b82f6,transparent 70%)' }}/>
      </div>

      <div className="relative max-w-7xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* ── LEFT ── */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-300 bg-violet-950/60 border border-violet-700/40 px-4 py-2 rounded-full mb-6">
              <Zap size={11}/> Produktivitet & Neuroshkencë
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              BrainBoost<br/>
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg,#a78bfa,#60a5fa)' }}>
                forco mendjen
              </span>{' '}tënde
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-md">
              18 module interaktive — nga Focus Sprint te Alpha Waves dhe Study Battle — të gjitha në një cockpit.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/brainboost"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white hover:scale-105 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', boxShadow: '0 8px 28px rgba(124,58,237,0.45)' }}>
                Hap BrainBoost <ArrowRight size={15}/>
              </Link>
              <Link to="/auth"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.12)' }}>
                Regjistrohu falas
              </Link>
            </div>

            {/* mini stats */}
            <div className="flex gap-6 mt-8">
              {[['18','Module'],['100%','Falas'],['0s','Setup']].map(([v,l]) => (
                <div key={l}>
                  <p className="text-xl font-black text-white">{v}</p>
                  <p className="text-xs text-white/35 font-medium">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: module grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BB_MODULES.map((m,i) => (
              <Link key={m.name} to="/brainboost"
                className="group rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                aria-label={m.name}>
                <span className="text-2xl leading-none">{m.icon}</span>
                <p className="text-[13px] font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">{m.name}</p>
                <p className="text-[10px] text-white/35 leading-relaxed">{m.desc}</p>
              </Link>
            ))}

            {/* CTA tile */}
            <Link to="/brainboost"
              className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2 col-span-2 sm:col-span-1 transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(59,130,246,0.2))', border: '1px solid rgba(167,139,250,0.25)' }}>
              <Brain size={22} className="text-violet-400"/>
              <p className="text-xs font-bold text-violet-300 text-center">+12 module tjera</p>
              <span className="text-[10px] text-white/40">Shiko të gjitha →</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FEATURED ARTICLES (admin-controlled)                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function FeaturedSection({ articles, isAdmin, onEdit, onDelete, onToggleFeatured, onAdd }) {
  const featured = articles.filter(a => a.featured).slice(0, 3)
  const recent   = articles.slice(0, 6)

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 px-4 py-2 rounded-full mb-4">Artikuj të zgjedhur</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Zbulimet e kësaj jave</h2>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 transition-colors shadow-sm">
                <Plus size={15}/> Shto artikull
              </button>
            )}
            <Link to="/articles"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors">
              Shiko të gjithë <ArrowRight size={14}/>
            </Link>
          </div>
        </div>

        {/* Featured big card */}
        {featured[0] && (
          <div className="relative rounded-3xl overflow-hidden mb-8 group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="aspect-[21/8] md:aspect-[21/7]">
              <img src={featured[0].image} alt={featured[0].title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}/>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 max-w-2xl">
              <span className={`self-start text-[11px] font-bold px-3 py-1 rounded-full mb-4 ${getCatColor(featured[0].category)}`}>
                {featured[0].category}
              </span>
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3">{featured[0].title}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-2">{featured[0].excerpt}</p>
              <Link to={`/articles/${featured[0].id}`}
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors">
                Lexo tani <ArrowRight size={14}/>
              </Link>
            </div>

            {isAdmin && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={e=>{e.preventDefault();onEdit(featured[0])}} className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"><Edit3 size={14}/></button>
                <button onClick={e=>{e.preventDefault();onDelete(featured[0].id)}} className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600"><Trash2 size={14}/></button>
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.filter(a => !featured[0] || a.id !== featured[0].id).slice(0, 6).map(article => (
            <ArticleCard key={article.id} article={article} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} onToggleFeatured={onToggleFeatured}/>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TESTIMONIALS                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: 'linear-gradient(160deg, #030711 0%, #0e0525 60%, #1a0535 100%)' }}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-full mb-4">Rezultate reale</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            <EditableText id="testimonials-h2">Çfarë thonë</EditableText><br/>
            <EditableText id="testimonials-h2-accent" as="span" className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24, #f97316)' }}>anëtarët tanë</EditableText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ text, name, role, avatar, stars, color }, i) => (
            <div key={name} className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/8 transition-colors relative">
              <Quote size={32} className="text-white/10 absolute top-6 right-6"/>
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(stars)].map((_, si) => (
                  <Star key={si} size={14} fill="#fbbf24" color="#fbbf24"/>
                ))}
              </div>
              <EditableText id={`testimonial-${i}-text`} as="p" multiline className="text-white/75 text-sm leading-relaxed mb-6">"{text}"</EditableText>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
                  {avatar}
                </div>
                <div>
                  <EditableText id={`testimonial-${i}-name`} as="p" className="font-bold text-white text-sm">{name}</EditableText>
                  <EditableText id={`testimonial-${i}-role`} as="p" className="text-white/40 text-xs">{role}</EditableText>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CTA SECTION                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function CTASection() {
  const PERKS = ['Pa kartë krediti', 'Akses i plotë 14 ditë', 'Anulo kur të duash']
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <div className="relative rounded-3xl overflow-hidden p-12 md:p-20"
          style={{ background: 'linear-gradient(135deg, #1a0535, #7c3aed 50%, #ec4899)' }}>
          {/* Blobs */}
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-25 blur-3xl" style={{ background: '#a78bfa' }}/>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ background: '#f472b6' }}/>

          <div className="relative">
            <div className="w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Brain size={28} color="white" strokeWidth={1.5}/>
            </div>

            <EditableText id="cta-h2" as="h2" className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Gati të fillosh?
            </EditableText>
            <EditableText id="cta-sub" as="p" multiline className="text-white/70 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              NeuroSphera është platforma pioniere e kujdesit mendor, ndërtuar me neuroshkencë dhe empati. Sot mund të fillosh edhe ti.
            </EditableText>

            <Link to="/auth"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-black text-white mb-8 hover:scale-105 transition-all duration-200 shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)' }}>
              <EditableText id="cta-btn" as="span">Fillo falas tani</EditableText> <ArrowRight size={18}/>
            </Link>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {PERKS.map((p, i) => (
                <div key={p} className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle size={14} className="text-green-400 shrink-0"/>
                  <EditableText id={`cta-perk-${i}`} as="span">{p}</EditableText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ABOUT SECTION                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
function AboutSection() {
  const WHO = [
    { emoji: '💭', label: 'Njerëzit me ankth & depresion' },
    { emoji: '👨‍👩‍👧', label: 'Prindërit me sfida në edukim' },
    { emoji: '💼', label: 'Profesionistët e lodhur' },
    { emoji: '🌍', label: 'Komunitetin e shpërndarë' },
  ]

  return (
    <section className="py-20 px-5" style={{ background: 'linear-gradient(180deg,#faf9ff 0%,#f0eeff 100%)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Top: mission + who */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black text-violet-600 bg-violet-50 border border-violet-100 uppercase tracking-widest mb-5">
              Rreth nesh
            </div>
            <EditableText id="about-landing-h2" as="h2" className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
              Ndërtuar për njerëz të vërtetë, me sfida të vërteta
            </EditableText>
            <EditableText id="about-landing-sub" as="p" multiline className="text-gray-500 leading-relaxed mb-7">
              NeuroSphera ekziston sepse miliona njerëz vuajnë në heshtje, pa ditur ku të drejtohen, pa gjetur mbështetje në gjuhën e tyre. Ne ndryshojmë këtë.
            </EditableText>
            <div className="grid grid-cols-2 gap-3">
              {WHO.map((w, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xl">{w.emoji}</span>
                  <span className="text-xs font-bold text-gray-700 leading-tight">{w.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote card */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden p-8 text-white"
              style={{ background: 'linear-gradient(145deg,#0c0028,#2d1060,#1a0050)' }}>
              <div className="text-6xl font-black text-violet-400/20 leading-none -mt-2 mb-2 select-none">"</div>
              <EditableText id="about-quote" as="p" className="text-xl font-black text-white leading-snug mb-6">
                Çdo mendje meriton kujdes, pavarësisht nga vjen, sa fiton, apo çfarë ndjen.
              </EditableText>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                  <Brain size={14} color="white" strokeWidth={2}/>
                </div>
                <div>
                  <p className="text-xs font-black text-white">NeuroSphera</p>
                  <p className="text-[10px] text-white/40">Mirëqenie · Neuroshkencë · Empati</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl -z-10 opacity-25"
              style={{ background: 'linear-gradient(135deg,#ec4899,#7c3aed)' }}/>
          </div>
        </div>

        {/* Team */}
        <div className="text-center mb-10">
          <p className="text-xs font-black text-violet-500 uppercase tracking-widest mb-2">Ekipi</p>
          <EditableText id="about-team-landing-h3" as="h3" className="text-2xl font-black text-gray-900">
            Njerëzit pas NeuroSphera
          </EditableText>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {TEAM_DEFAULTS.map((m, i) => (
            <div key={i} className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:border-violet-100 transition-colors">
              <TeamMemberCard index={i} {...m}/>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)' }}>
            Mëso më shumë rreth nesh <ArrowRight size={15}/>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FOOTER                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
function Footer() {
  const NAV_GROUPS = [
    {
      title: 'Platforma',
      links: [{ to: '/library', label: 'NeuroArtikuj' }, { to: '/ask', label: 'Specialistë' }, { to: '/book', label: 'Konsultim' }, { to: '/tests', label: 'Vlerësime' }, { to: '/auth', label: 'Regjistrohu' }],
    },
    {
      title: 'Kategori',
      links: PLATFORM_CATS.slice(0, 4).map(c => ({ to: '#categories', label: c.label })),
    },
    {
      title: 'Kompania',
      links: [{ to: '/about', label: 'Rreth nesh' }, { to: '/library', label: 'Blog' }, { to: '/about#careers', label: 'Karriera' }, { to: 'mailto:info@myneurosphera.com', label: 'Kontakti' }],
    },
  ]

  return (
    <footer style={{ background: '#0a0a1a' }} className="text-white">
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg">
                <Brain size={18} color="white" strokeWidth={2}/>
              </div>
              <EditableText id="footer-brand" as="span" className="font-black text-white text-base">NeuroSphera</EditableText>
            </div>
            <EditableText id="footer-tagline" as="p" multiline className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Platforma pioniere e zhvillimit të mendjes bazuar në neuroshkencë. Mëso si funksionon truri yt.
            </EditableText>
            <div className="flex gap-2">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-600 transition-all text-xs font-black">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {NAV_GROUPS.map(group => (
            <div key={group.title}>
              <p className="font-bold text-xs mb-4 text-slate-400 uppercase tracking-wider">{group.title}</p>
              <ul className="space-y-2.5">
                {group.links.map(l => (
                  <li key={l.label}>
                    {l.to.startsWith('mailto:') || l.to.startsWith('http')
                      ? <a href={l.to} className="text-slate-500 hover:text-white text-sm transition-colors">{l.label}</a>
                      : <Link to={l.to} className="text-slate-500 hover:text-white text-sm transition-colors">{l.label}</Link>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="border-t border-white/5 pt-8 mb-6">
          <div className="flex flex-wrap gap-6 text-slate-500 text-sm">
            <a href="mailto:info@myneurosphera.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} className="text-violet-400"/>&nbsp;info@myneurosphera.com
            </a>
            <span className="flex items-center gap-2">
              <Phone size={14} className="text-violet-400"/>psikolog@NeuroSphera.com
            </span>
            <span className="flex items-center gap-2">
              <Globe size={14} className="text-violet-400"/>NeuroSphera.com
            </span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <EditableText id="footer-copyright" as="p" className="text-xs text-slate-600">© 2026 NeuroSphera. Të gjitha të drejtat e rezervuara.</EditableText>
          <div className="flex gap-5">
            {['Privatësia', 'Kushtet', 'Cookies'].map(t => (
              <span key={t} className="text-xs text-slate-600 hover:text-slate-300 cursor-pointer transition-colors">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN EXPORT                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Landing() {
  const { user }                    = useAuth()
  const isAdmin                     = user?.role === 'admin'
  const [articles, setArticlesRaw]  = useState(loadArticles)
  const [modal,    setModal]        = useState(null)
  const [deleteId, setDeleteId]     = useState(null)

  function setArticles(updater) {
    setArticlesRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveArticles(next)
      return next
    })
  }

  function handleSave(form) {
    if (form.id) {
      setArticles(prev => prev.map(a => a.id === form.id ? { ...a, ...form } : a))
    } else {
      setArticles(prev => [
        { ...form, id: Date.now(), date: new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' }) },
        ...prev,
      ])
    }
  }
  function confirmDelete() { setArticles(prev => prev.filter(a => a.id !== deleteId)); setDeleteId(null) }
  function toggleFeatured(id) { setArticles(prev => prev.map(a => a.id === id ? { ...a, featured: !a.featured } : a)) }

  return (
    <div className="bg-white">
      <NeuroPulsePopup />
      {/* Article modal */}
      {modal && (
        <ArticleModal article={modal === 'new' ? null : modal} onSave={handleSave} onClose={() => setModal(null)}/>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-7 shadow-2xl max-w-sm w-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500"/>
            </div>
            <p className="font-black text-gray-800 text-lg mb-1">Fshi artikullin?</p>
            <p className="text-gray-400 text-sm mb-6">Ky veprim nuk mund të kthehet mbrapsht.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">Anulo</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600">Po, fshi</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin bar */}
      {isAdmin && <AdminBar onAdd={() => setModal('new')} articleCount={articles.length}/>}

      {/* Sections */}
      <HeroSection/>
      <StatsBar/>
      <ServicesCarousel/>
      <ProblemSection/>
      <CategoriesSection/>
      <HowItWorksSection/>
      <DifferentiatorsSection/>
      <BrainBoostSection/>
      <FeaturedSection
        articles={articles}
        isAdmin={isAdmin}
        onEdit={article => setModal(article)}
        onDelete={id => setDeleteId(id)}
        onToggleFeatured={toggleFeatured}
        onAdd={() => setModal('new')}
      />
      <TestimonialsSection/>
      <AboutSection/>
      <BookingSection/>
      <TestsSection/>
      <ParentingSection/>
      <CTASection/>
      <Footer/>
    </div>
  )
}
