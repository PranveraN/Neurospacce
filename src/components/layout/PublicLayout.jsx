import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Brain, Menu, X, ArrowRight, Mail, Search, ChevronRight } from 'lucide-react'
import LogoMark from '../LogoMark'
import { PLATFORM_CATS } from '../../data/categoriesData'
import { ARTICLES as STATIC_ARTICLES } from '../../data/articlesData'

function loadArticles() {
  try { const v = localStorage.getItem('ns_landing_articles'); return v ? JSON.parse(v) : STATIC_ARTICLES } catch { return STATIC_ARTICLES }
}

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

  const allArticles = useMemo(loadArticles, [])

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
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Kërko artikuj, tema, kategori..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl text-base bg-white shadow-2xl border border-gray-200 focus:outline-none focus:border-violet-400 text-gray-800"/>
          <button onClick={onClose} aria-label="Mbyll kërkimin" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={18}/></button>
        </div>

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

        {q.length >= 2 && (
          <div className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {results.length === 0 ? (
              <div className="p-8 text-center"><p className="text-gray-400 text-sm">Asnjë rezultat për <strong>"{q}"</strong></p></div>
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-violet-50 text-violet-700">{a.category}</span>
                  </button>
                ))}
                <div className="px-4 py-3 border-t border-gray-100">
                  <Link to="/library" onClick={onClose} className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
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

import { useAuth } from '../../contexts/AuthContext'
import NeuroPulse from '../NeuroPulse'

function PublicHeader() {
  const [open,       setOpen]       = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/library',    label: 'NeuroArtikuj' },
    { to: '/brainboost', label: 'BrainBoost' },
    { to: '/psikologu',  label: 'Psikologu yt', adminOnly: true },
    { to: '/tests',      label: 'Teste' },
    { to: '/parenting',  label: 'Familje' },
    { to: '/assistant',  label: 'Asistenti', adminOnly: true },
    { to: '/pricing',    label: 'Planet' },
    { to: '/about',      label: 'Rreth nesh' },
  ]

  return (
    <>
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)}/>}

      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(229,231,235,0.8)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(109,40,217,0.06)',
        }}>
        {/* Violet accent line at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, #7c3aed 0%, #6d28d9 40%, #3b82f6 100%)',
          opacity: 0.7,
        }}/>

        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0 mr-2">
            <LogoMark size={36} radius="rounded-xl"/>
            <Link to="/" className="flex flex-col leading-none">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">NeuroSphera</span>
              <span className="text-[9px] font-semibold text-violet-400 uppercase tracking-widest">Shëndeti Mendor</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0 flex-1">
            {links.map(l => {
              if (l.adminOnly && !isAdmin) return (
                <div key={l.to} className="relative px-2.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap text-gray-400 cursor-default select-none">
                  {l.label}
                  <span className="absolute -top-1 -right-1 text-[8px] font-black px-1 py-0.5 rounded-full text-white leading-none"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                    soon
                  </span>
                </div>
              )
              return (
                <NavLink key={l.to} to={l.to}
                  className={({ isActive }) =>
                    `px-2.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${isActive ? 'text-violet-600 bg-violet-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                  }>
                  {l.label}
                </NavLink>
              )
            })}
          </nav>

          {/* Search + CTAs */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <button onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
              <Search size={15}/><span className="hidden lg:inline">Kërko</span>
            </button>
            {user ? (
              <>
                <button onClick={() => { logout(); navigate('/') }}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors">
                  Dil
                </button>
                <NeuroPulse scrolled={false} />
              </>
            ) : (
              <>
                <Link to="/auth" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Kyçu</Link>
                <NeuroPulse scrolled={false} />
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button onClick={() => setShowSearch(true)} aria-label="Kërko" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600">
              <Search size={16}/>
            </button>
            <button onClick={() => setOpen(!open)} aria-label={open ? 'Mbyll menunë' : 'Hap menunë'} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600">
              {open ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-1">
            {links.map(l => {
              if (l.adminOnly && !isAdmin) return (
                <div key={l.to} className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 cursor-default select-none">
                  <span>{l.label}</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full text-white"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                    Se shpejti
                  </span>
                </div>
              )
              return (
                <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'text-violet-600 bg-violet-50' : 'text-gray-700 hover:bg-gray-50'}`
                  }>
                  {l.label}
                </NavLink>
              )
            })}
            <div className="pt-3 flex flex-col gap-2 border-t border-gray-100 mt-2">
              {user ? (
                <>
                  <button onClick={() => { logout(); navigate('/'); setOpen(false) }}
                    className="py-2.5 text-center text-sm font-semibold border border-red-100 rounded-xl text-red-500">
                    Dil nga llogaria
                  </button>
                  <div className="flex justify-center" onClick={() => setOpen(false)}>
                    <NeuroPulse scrolled={false} />
                  </div>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setOpen(false)}
                    className="py-2.5 text-center text-sm font-semibold border border-gray-200 rounded-xl text-gray-600">Kyçu</Link>
                  <div className="flex justify-center" onClick={() => setOpen(false)}>
                    <NeuroPulse scrolled={false} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}

function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <LogoMark size={36} radius="rounded-xl"/>
              <div className="flex flex-col leading-none">
                <span className="font-black text-base tracking-tight bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">NeuroSphera</span>
                <span className="text-[9px] font-semibold text-violet-400 uppercase tracking-widest">Shëndeti Mendor</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platforma pioniere e mirëqenies mendore. Artikuj, mbështetje nga psikologë të verifikuar dhe asistent AI i specializuar.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-bold text-sm mb-4 text-slate-300 uppercase tracking-wider">Navigimi</p>
            <ul className="space-y-2.5">
              {[
                { to: '/',         label: 'Faqja kryesore' },
                { to: '/library',    label: 'NeuroArtikuj' },
                { to: '/brainboost', label: 'BrainBoost' },
                { to: '/psikologu',  label: 'Psikologu yt' },
                { to: '/tests',    label: 'Vlerësime' },
                { to: '/pricing',  label: 'Planet' },
                { to: '/about',    label: 'Rreth nesh' },
                { to: '/auth',     label: 'Regjistrohu falas' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-400 hover:text-white text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-bold text-sm mb-4 text-slate-300 uppercase tracking-wider">Kontakti</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={15} className="text-violet-400 shrink-0" />
                info@myneurosphera.com
              </li>
            </ul>
            <div className="mt-6 p-4 bg-slate-800 rounded-2xl">
              <p className="text-xs font-bold text-slate-300 mb-1">Keni nevojë për ndihmë urgjente?</p>
              <p className="text-xs text-slate-400">Numri i emergjencës: <span className="text-violet-400 font-bold">112</span> (24/7)</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 NeuroSphera. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex gap-4">
            <span className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer">Politika e Privatësisë</span>
            <span className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer">Kushtet e Shërbimit</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { PublicHeader }

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}
