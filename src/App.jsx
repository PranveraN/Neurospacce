import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Sentry } from './lib/sentry'
import { MoodProvider }          from './contexts/MoodContext'
import { AuthProvider }          from './contexts/AuthContext'
import ProtectedRoute            from './components/auth/ProtectedRoute'

// ── layout (eager — used on every page) ───────────────────────────────────────
import { PublicHeader }          from './components/layout/PublicLayout'
import Sidebar                   from './components/layout/Sidebar'
import BottomNav                 from './components/layout/BottomNav'
import WidgetBar                 from './components/layout/WidgetBar'
import DesktopWidgetPanel        from './components/layout/DesktopWidgetPanel'

// ── utils (eager — tiny, used everywhere) ─────────────────────────────────────
import ScrollToTop               from './components/ScrollToTop'
import EditModeToggle            from './components/EditModeToggle'
import FloatingBack              from './components/FloatingBack'
import { EditModeProvider }      from './contexts/EditModeContext'
import { ToastProvider }         from './components/Toast'
import './index.css'

// ── public pages (lazy) ───────────────────────────────────────────────────────
const Landing           = lazy(() => import('./pages/Landing'))
const LibraryPage       = lazy(() => import('./pages/LibraryPage'))
const ArticleDetail     = lazy(() => import('./pages/ArticleDetail'))
const AskPsychologist   = lazy(() => import('./pages/AskPsychologist'))
const ExpertProfile     = lazy(() => import('./pages/ExpertProfile'))
const PsikologuYt       = lazy(() => import('./pages/PsikologuYt'))
const Tests             = lazy(() => import('./pages/Tests'))
const EvolutionDashboard= lazy(() => import('./pages/EvolutionDashboard'))
const Parenting         = lazy(() => import('./pages/Parenting'))
const BookAppointment   = lazy(() => import('./pages/BookAppointment'))
const Pricing           = lazy(() => import('./pages/Pricing'))
const About             = lazy(() => import('./pages/About'))
const BrainBoost        = lazy(() => import('./pages/BrainBoost'))
const CareerIntelligence= lazy(() => import('./pages/CareerIntelligence'))
const Auth              = lazy(() => import('./pages/Auth'))
const Privacy           = lazy(() => import('./pages/Privacy'))

// ── user pages (lazy) ─────────────────────────────────────────────────────────
const Home              = lazy(() => import('./pages/Home'))
const AIChat            = lazy(() => import('./pages/AIChat'))
const MoodTracking      = lazy(() => import('./pages/MoodTracking'))
const TechniquesHub     = lazy(() => import('./pages/TechniquesHub'))
const Journal           = lazy(() => import('./pages/Journal'))
const Chatroom          = lazy(() => import('./pages/Chatroom'))
const Blog              = lazy(() => import('./pages/Blog'))
const Profile           = lazy(() => import('./pages/Profile'))
const MyAppointments    = lazy(() => import('./pages/MyAppointments'))
const History           = lazy(() => import('./pages/History'))

// ── admin pages (lazy — heaviest chunk, rarely visited by normal users) ───────
const AdminLogin        = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout       = lazy(() => import('./pages/admin/AdminLayout'))

// ── Suspense fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{background:'linear-gradient(160deg,#030711,#0e0525,#030711)'}}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin"/>
        <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest">Duke ngarkuar</p>
      </div>
    </div>
  )
}

// ── Global top navbar (appears on all public routes except auth/admin) ───────
function GlobalHeader() {
  const { pathname } = useLocation()
  const hide = pathname.startsWith('/auth')
            || pathname.startsWith('/ns-secure-7381')
  if (hide) return null
  return <PublicHeader />
}

// ── user app shell ────────────────────────────────────────────────────────────
function UserApp() {
  return (
    <>
      {/* Desktop: fill remaining height below the 64px global header */}
      <div className="hidden md:flex cosmic-bg" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <main id="main-scroll" className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            <UserRoutes />
          </div>
        </main>
        <DesktopWidgetPanel />
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col min-h-screen" style={{background:'#07041a'}}>
        <main className="flex-1 pb-48">
          <UserRoutes />
        </main>
        <BottomNav />
        <WidgetBar />
      </div>
    </>
  )
}

function UserRoutes() {
  return (
    <Routes>
      <Route path="/home"          element={<Home />}             />
      <Route path="/chat"          element={<AIChat />}           />
      <Route path="/mood"          element={<MoodTracking />}     />
      <Route path="/techniques"    element={<TechniquesHub />}    />
      <Route path="/journal"       element={
        <ProtectedRoute><Journal /></ProtectedRoute>
      } />
      <Route path="/community"     element={<Chatroom />}         />
      <Route path="/blog"          element={<Blog />}             />
      <Route path="/profile"       element={<Profile />}          />
      <Route path="/appointments"  element={<MyAppointments />}   />
      <Route path="/history"       element={<History />}          />
      <Route path="*"              element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

// ── Sentry error fallback ─────────────────────────────────────────────────────
function SentryFallback({ error, resetError }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg,#030711,#0e0525,#030711)' }}>
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-white font-black text-lg mb-2">Diçka shkoi keq</p>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">
          Gabimi u raportua automatikisht. Provo të rifreskosh faqen.
        </p>
        {import.meta.env.DEV && error && (
          <pre className="text-left text-[10px] text-red-300/70 bg-red-950/30 rounded-xl p-3 mb-4 overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
        <button
          onClick={resetError}
          className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
          Provo përsëri
        </button>
      </div>
    </div>
  )
}

// ── root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Sentry.ErrorBoundary fallback={SentryFallback} showDialog={false}>
    <AuthProvider>
      <ToastProvider>
        <MoodProvider>
          <EditModeProvider>
            <BrowserRouter>
            <GlobalHeader />
            <ScrollToTop />
            <EditModeToggle />
            <FloatingBack />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Landing & public content */}
                <Route path="/"              element={<Landing />}           />
                <Route path="/library"       element={<LibraryPage />}       />
                <Route path="/articles"      element={<Navigate to="/library" replace />} />
                <Route path="/articles/:id"  element={<ArticleDetail />}     />
                <Route path="/category/:id"  element={<Navigate to="/library" replace />} />
                <Route path="/psikologu"     element={<PsikologuYt />}       />
                <Route path="/ask"           element={<Navigate to="/psikologu" replace />} />
                <Route path="/ask/:expertId" element={<ExpertProfile />}     />
                <Route path="/tests"         element={<Tests />}             />
                <Route path="/evolution"     element={<EvolutionDashboard />}/>
                <Route path="/parenting"     element={<Parenting />}         />
                <Route path="/book"          element={<Navigate to="/psikologu?tab=book" replace />} />
                <Route path="/book/:expertId" element={<BookAppointment />}  />
                <Route path="/pricing"       element={<Pricing />}           />
                <Route path="/about"         element={<About />}             />
                <Route path="/brainboost"    element={<BrainBoost />}        />
                <Route path="/career"        element={<CareerIntelligence />}/>

                {/* Auth */}
                <Route path="/auth"          element={<Auth />}              />
                <Route path="/privacy"       element={<Privacy />}           />
                {/* Admin — secret URL (do not share publicly) */}
                <Route path="/ns-secure-7381/login" element={<AdminLogin />} />
                <Route path="/ns-secure-7381/*" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/ns-secure-7381/login">
                    <AdminLayout />
                  </ProtectedRoute>
                } />

                {/* App shell — /home /chat /mood etc */}
                <Route path="/*" element={<UserApp />} />
              </Routes>
            </Suspense>
            </BrowserRouter>
          </EditModeProvider>
        </MoodProvider>
      </ToastProvider>
    </AuthProvider>
    </Sentry.ErrorBoundary>
  )
}
