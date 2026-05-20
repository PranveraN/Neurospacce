import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'

const WELLNESS_QUOTES = [
  { text: 'Kërkimi i ndihmës nuk është dobësi, por trimëri.', author: 'Barack Obama' },
  { text: 'Kujdesi ndaj vetes nuk është egoist. Është thelbësor.', author: 'Brené Brown' },
  { text: 'Shëndeti mendor është po aq i rëndësishëm sa ai fizik.', author: 'Kate Middleton' },
  { text: 'Çdo udhëtim i madh fillon me një hap të vetëm të guximshëm.', author: 'Lao Tzu' },
  { text: 'Nuk je vetëm. Ndihma është pranë.', author: 'NeuroSphera' },
  { text: 'Forca nuk është mungesa e frikës, por veprimi pavarësisht saj.', author: 'Nelson Mandela' },
  { text: 'Kujdesi i mirë i vetes ndez dritën brenda teje.', author: 'Rumi' },
]

export function LeftSidebar() {
  const dayIndex = new Date().getDay()
  const quote = WELLNESS_QUOTES[dayIndex % WELLNESS_QUOTES.length]

  return (
    <aside className="hidden lg:flex flex-col gap-4 sticky top-24">

      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed)' }}>
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-15 blur-xl"
          style={{ background: 'radial-gradient(circle,#ec4899,transparent)' }} />
        <p className="text-[10px] font-bold text-violet-300 uppercase tracking-widest mb-3">Fjala e ditës</p>
        <p className="text-sm text-white/90 leading-relaxed italic mb-3">"{quote.text}"</p>
        <p className="text-[11px] text-violet-300 font-semibold">— {quote.author}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Si funksionon</p>
        <div className="space-y-4">
          {[
            { n: '1', icon: '🧑‍⚕️', title: 'Zgjidh psikologun', desc: 'Filtro sipas specialitetit dhe disponueshmërisë.' },
            { n: '2', icon: '📅', title: 'Cakto datën & orën', desc: 'Zgjidhni kohën që ju përshtatet.' },
            { n: '3', icon: '✅', title: 'Konfirmo takimin', desc: 'Konfirmim i menjëhershëm. Anulim falas deri 24h.' },
          ].map((s) => (
            <div key={s.n} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-base shrink-0">{s.icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-700">{s.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Lock size={15} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-800">Konfidencialitet i plotë</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">GDPR-compliant · E enkriptuar</p>
        </div>
      </div>
    </aside>
  )
}

export function RightSidebar({ experts }) {
  const featuredExperts = experts.slice(0, 3)

  return (
    <aside className="hidden lg:flex flex-col gap-4 sticky top-24">

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Platforma jonë</p>
        <div className="space-y-3">
          {[
            { icon: '🧑‍⚕️', value: '8+',   label: 'Psikologë të verifikuar' },
            { icon: '📋',   value: '500+', label: 'Seanca të kryera' },
            { icon: '⚡',   value: '24h',  label: 'Kohë mesatare përgjigjes' },
            { icon: '⭐',   value: '98%',  label: 'Satisfaksion' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-lg w-6 shrink-0">{s.icon}</span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-black text-slate-800">{s.value}</span>
                <span className="text-[11px] text-slate-400">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {featuredExperts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Psikologë Online</p>
          <div className="space-y-3">
            {featuredExperts.map((e) => (
              <Link
                key={e.id}
                to={`/ask/${e.id}`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="relative shrink-0">
                  <img src={e.image} alt={e.name} loading="lazy"
                    className="w-10 h-10 rounded-xl object-cover object-top" />
                  {e.status === 'online' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-violet-700 transition-colors">{e.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{e.specialties?.[0]}</p>
                </div>
                <ArrowRight size={12} className="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
          <Link to="/psikologu"
            className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-violet-600 hover:text-violet-800 transition-colors pt-3 border-t border-slate-100">
            Shiko të gjithë ekspertët <ArrowRight size={11} />
          </Link>
        </div>
      )}

      <div className="rounded-2xl p-4 text-center"
        style={{ background: 'linear-gradient(135deg,#fdf4ff,#ede9fe)' }}>
        <p className="text-base mb-1">💬</p>
        <p className="text-xs font-black text-slate-800 mb-1">1 pyetje falas</p>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
          Nuk je gati për takim? Dërgo një pyetje falas te psikologët tanë.
        </p>
        <Link to="/psikologu"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white px-3.5 py-2 rounded-xl transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
          Pyet tani <ArrowRight size={11} />
        </Link>
      </div>
    </aside>
  )
}
