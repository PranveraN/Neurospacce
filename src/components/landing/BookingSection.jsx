import { Link } from 'react-router-dom'
import { CalendarCheck, ChevronRight, Star } from 'lucide-react'
import { loadExperts } from '../../data/expertsData'
import { AVAILABILITY_RULES } from '../../data/appointmentsData'
import EditableText from '../EditableText'

const STEPS = [
  { n: '01', emoji: '🧑‍⚕️', title: 'Zgjidh psikologun', desc: 'Shfleto profilin, specialitetin dhe oraret e disponueshme.' },
  { n: '02', emoji: '📅', title: 'Zgjidh datën & orën',  desc: 'Sistemi tregon automatikisht vetëm oraret e lira.' },
  { n: '03', emoji: '✅', title: 'Konfirmo rezervimin',  desc: 'Merrni konfirmim të menjëhershëm dhe kujtues para takimit.' },
]

const STATUS_DOT = {
  online:  { color: '#22c55e', label: 'Online' },
  busy:    { color: '#f59e0b', label: 'I/E zënë' },
  offline: { color: '#9ca3af', label: 'Offline' },
}

export default function BookingSection() {
  const allExperts = loadExperts()
  const bookable = allExperts
    .filter(e => AVAILABILITY_RULES[e.id])
    .slice(0, 4)

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-950 to-[#0f0c29]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-500/30 rounded-full px-4 py-2 mb-5">
            <CalendarCheck size={14} className="text-violet-400" />
            <EditableText as="span" className="text-sm font-bold text-violet-300">Takime Online</EditableText>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
            <EditableText>Rezervo takim me</EditableText>{' '}
            <EditableText as="span" className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              psikologun tënd
            </EditableText>
          </h2>
          <EditableText as="p" multiline className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Lidhuni me psikologë të licencuar brenda minutave. Pa radhë pritjeje —
            zgjidhni orarin që ju përshtatet dhe konfirmoni menjëherë.
          </EditableText>
        </div>

        {/* 3 steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-9 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-px bg-gradient-to-r from-violet-500/40 to-transparent z-0" />
              )}
              <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-pink-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 text-3xl">
                  {s.emoji}
                </div>
                <div className="text-xs font-black text-violet-400 mb-2 tracking-widest">{s.n}</div>
                <EditableText as="p" className="text-base font-black text-white mb-2">{s.title}</EditableText>
                <EditableText as="p" multiline className="text-sm text-slate-400 leading-relaxed">{s.desc}</EditableText>
              </div>
            </div>
          ))}
        </div>

        {/* Psychologist preview cards */}
        {bookable.length > 0 && (
          <div className="mb-12">
            <EditableText as="p" className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
              Psikologët tanë të disponueshëm
            </EditableText>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bookable.map(expert => {
                const dot = STATUS_DOT[expert.status] || STATUS_DOT.offline
                return (
                  <div key={expert.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 hover:border-violet-500/30 transition-all group">
                    <div className="relative mb-3">
                      {expert.image
                        ? <img src={expert.image} alt={expert.name} loading="lazy" className="w-14 h-14 rounded-2xl object-cover" />
                        : <div className="w-14 h-14 rounded-2xl bg-violet-600/30 flex items-center justify-center text-violet-300 font-black text-2xl">
                            {expert.name[0]}
                          </div>
                      }
                      <div
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900"
                        style={{ background: dot.color }}
                        title={dot.label}
                      />
                    </div>

                    <p className="text-sm font-black text-white leading-tight mb-0.5">{expert.name}</p>
                    <p className="text-xs text-slate-400 mb-2 line-clamp-1">{expert.title}</p>

                    <div className="flex items-center gap-1 mb-3">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-300">{expert.rating?.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500">({expert.reviewCount})</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {expert.specialties?.slice(0, 2).map(s => (
                        <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/20">
                          {s}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/book/${expert.id}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 text-white"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
                    >
                      <CalendarCheck size={12} /> Rezervo
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: '🔒', label: 'Konfidenciale 100%' },
            { icon: '✅', label: 'Psikologë të licencuar' },
            { icon: '⚡', label: 'Konfirmim i menjëhershëm' },
            { icon: '🔄', label: 'Anulim falas deri 24h' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-400">
              <span>{icon}</span>
              <EditableText as="span" className="font-semibold">{label}</EditableText>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/book"
            className="inline-flex items-center gap-3 text-white px-10 py-4 rounded-2xl font-black text-base transition-all hover:shadow-2xl hover:scale-105 active:scale-95 shadow-lg shadow-violet-900/40"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
          >
            <CalendarCheck size={20} />
            <EditableText>Rezervo takimin tënd tani</EditableText>
            <ChevronRight size={18} />
          </Link>
          <EditableText as="p" className="text-slate-500 text-xs mt-4">
            Pa regjistrim të detyrueshëm · Shiko disponueshmërinë falas
          </EditableText>
        </div>

      </div>
    </section>
  )
}
