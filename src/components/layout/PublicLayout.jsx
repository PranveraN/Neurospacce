import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Brain, Menu, X, ArrowRight, Mail, Search, ChevronRight } from 'lucide-react'
import LogoMark from '../LogoMark'
import { PLATFORM_CATS } from '../../data/categoriesData'
import { ARTICLES as STATIC_ARTICLES } from '../../data/articlesData'
import MedicalDisclaimer from '../MedicalDisclaimer'

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

function PublicHeader() {
  const [open,       setOpen]       = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isLanding = pathname === '/'

  useEffect(() => {
    if (!isLanding) { setScrolled(false); return }
    const fn = () => setScrolled(window.scrollY > 60)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [isLanding])

  const transparent = isLanding && !scrolled

  const links = [
    { to: '/library',    label: 'NeuroArtikuj' },
    { to: '/brainboost', label: 'BrainBoost' },
    { to: '/psikologu',  label: 'Psikologu yt' },
    { to: '/tests',      label: 'Teste' },
    { to: '/parenting',  label: 'Familje' },
    { to: '/assistant',  label: 'Asistenti' },
    { to: '/pricing',    label: 'Planet' },
    { to: '/about',      label: 'Rreth nesh' },
  ]

  /* ── styles shared between transparent & dark ── */
  const headerBg   = transparent ? 'transparent'                     : 'rgba(7,4,26,0.97)'
  const headerBdr  = transparent ? '1px solid rgba(255,255,255,0.06)': '1px solid rgba(139,92,246,0.14)'
  const headerBlur = transparent ? 'none'                            : 'blur(22px)'
  const linkBase   = 'px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200'
  const linkIdle   = transparent ? 'text-white/72 hover:text-white hover:bg-white/8' : 'text-white/55 hover:text-white hover:bg-white/6'
  const linkActive = transparent ? 'text-white bg-white/12'          : 'text-white bg-white/10'

  return (
    <>
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)}/>}

      <header
        className={transparent ? 'fixed top-0 left-0 right-0 z-50' : 'sticky top-0 z-50'}
        style={{
          background: headerBg,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur,
          borderBottom: headerBdr,
          transition: 'background 0.35s ease, border-color 0.35s ease',
        }}>

        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center gap-2">

          {/* ── Logo ── */}
          <div className="flex items-center gap-2.5 shrink-0 mr-3">
            <LogoMark size={36} radius="rounded-xl"/>
            <Link to="/" className="flex flex-col leading-none">
              <span className="font-black text-base tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-300 to-blue-400 bg-clip-text text-transparent">
                NeuroSphera
              </span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/45">
                Shëndeti Mendor
              </span>
            </Link>
          </div>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="hidden md:flex items-center gap-1.5 ml-auto">
            <button onClick={() => setShowSearch(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${linkIdle}`}>
              <Search size={14}/><span>Kërko</span>
            </button>

            {user ? (
              <button onClick={() => { logout(); navigate('/') }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-red-400 transition-colors">
                Dil
              </button>
            ) : (
              <Link to="/auth"
                className="px-5 py-2 rounded-xl text-xs font-bold border transition-all hover:bg-white/8"
                style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(139,92,246,0.45)' }}>
                Hyr / Regjistrohu
              </Link>
            )}
          </div>

          {/* ── Mobile actions ── */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button onClick={() => setShowSearch(true)} aria-label="Kërko"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <Search size={16}/>
            </button>
            <button onClick={() => setOpen(!open)} aria-label={open ? 'Mbyll' : 'Menu'}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              {open ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {open && (
          <div className="md:hidden px-4 pb-5 pt-2 space-y-1"
            style={{ background: 'rgba(7,4,26,0.98)', borderTop: '1px solid rgba(139,92,246,0.12)' }}>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'text-white bg-white/8' : 'text-white/55 hover:text-white hover:bg-white/5'}`
                }>
                {l.label}
              </NavLink>
            ))}
            <div className="pt-3 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {user ? (
                <button onClick={() => { logout(); navigate('/'); setOpen(false) }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                  Dil nga llogaria
                </button>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)}
                  className="block py-2.5 text-center text-sm font-bold rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                  Hyr / Regjistrohu
                </Link>
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

        <div className="mt-10 mb-6">
          <MedicalDisclaimer variant="dark" />
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
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
