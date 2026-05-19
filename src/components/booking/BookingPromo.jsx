import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Award, Brain, Clock, Heart, Shield, Users, Zap } from 'lucide-react'
import { loadExperts } from '../../data/expertsData'

const DARK = 'linear-gradient(160deg,#07041a 0%,#0e0826 55%,#07041a 100%)'
const CARD_GLASS = { background:'rgba(255,255,255,0.045)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(14px)' }

const STATS = [
  { value:'1 në 4', sub:'njerëzve kalon krizë mendore gjatë jetës' },
  { value:'80%',    sub:'nuk kërkojnë kurrë ndihmë profesionale' },
  { value:'6×',     sub:'më efektive terapia vs vetë-menaxhimi' },
  { value:'98%',    sub:'satisfaksion i klientëve NeuroSpace' },
]

const WHY = [
  {
    icon: Brain,
    title: 'Shkenca thotë: funksionon',
    desc: 'CBT, DBT dhe EMDR janë metodat psikoterapeutike me prova klinike më të forta në botë. 8–12 sesione reduktojnë ankthin me deri 65% — jo premtim, por meta-analizë e 500+ studimeve peer-reviewed.',
    color: '#a78bfa',
    glow: 'rgba(139,92,246,0.2)',
  },
  {
    icon: Shield,
    title: 'Konfidencialitet absolut',
    desc: 'Çdo seancë është e enkriptuar end-to-end dhe e mbrojtur me protokollin GDPR. Psikologu nuk ndan asnjë informacion pa lejen tuaj të shprehur. Privatësia juaj nuk është opsion — është standard.',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.2)',
  },
  {
    icon: Zap,
    title: 'Ndryshim i matshëm',
    desc: 'Ndryshe nga këshilla të përgjithshme, psikologu ndërton me ju një plan të personalizuar — bazuar në historikun tuaj, jo në një protokoll standard. Progresi matet çdo sesion.',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.2)',
  },
  {
    icon: Heart,
    title: 'Hapi i parë është i vështirë',
    desc: 'Shumica e njerëzve presin mesatarisht 11 vjet para se të kërkojnë ndihmë. Ti nuk do të presësh. Rezervimi i takimit të parë zgjat 2 minuta — dhe mund të ndryshojë gjithçka.',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.2)',
  },
]

const QUOTES = [
  { text: '"Nuk ka njeri të thyer — vetëm njerëz që nuk kanë gjetur ende mjetet e duhura."', author: 'NeuroSpace' },
  { text: '"Gjumi nuk është luksi — është neurokirurgjia natyrale e trurit tuaj."',            author: 'NeuroSpace' },
  { text: '"Intelekti nuk është i fikse. Është muskul që mund ta stërvitësh."',               author: 'NeuroSpace' },
]

function AnimCounter({ target, suffix = '', delay = 0 }) {
  const [val, setVal] = useState(0)
  const numTarget = parseFloat(target.replace(/[^0-9.]/g, '')) || 0
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0
      const step = numTarget / 40
      const iv = setInterval(() => {
        start = Math.min(start + step, numTarget)
        setVal(start)
        if (start >= numTarget) clearInterval(iv)
      }, 35)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(timer)
  }, [numTarget, delay])
  if (isNaN(numTarget) || numTarget === 0) return <>{target}</>
  return <>{Number.isInteger(numTarget) ? Math.round(val) : val.toFixed(0)}{suffix}</>
}

function ExpertPromoCard({ expert, index }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-40px' }}
      transition={{ duration:0.45, delay: index * 0.07, ease:'easeOut' }}
      className="relative rounded-3xl overflow-hidden group cursor-pointer"
      style={CARD_GLASS}
      whileHover={{ scale:1.025, transition:{ duration:0.18 } }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{ boxShadow:`inset 0 0 0 1px rgba(139,92,246,0.4)` }}/>

      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
              style={{ background: expert.avatarGrad || 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              {expert.name.split(' ').map(w => w[0]).join('').slice(0,2)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 shrink-0"
              style={{
                background: expert.status === 'online' ? '#22c55e' : expert.status === 'busy' ? '#f59e0b' : '#6b7280',
                borderColor: '#0e0826',
              }}/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-black text-white leading-tight truncate">{expert.name}</p>
            <p className="text-[11px] text-violet-300/80 mt-0.5 leading-snug line-clamp-2">{expert.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-3 h-3" viewBox="0 0 20 20" fill={i <= Math.round(expert.rating) ? '#fbbf24' : 'rgba(255,255,255,0.15)'}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <span className="text-[11px] font-bold text-amber-400">{expert.rating}</span>
          <span className="text-[10px] text-white/30">({expert.reviewCount})</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {expert.specialties.slice(0,3).map(s => (
            <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', color:'#c4b5fd' }}>
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-white/30"/>
            <span className="text-[10px] text-white/40">{expert.responseTime}</span>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: expert.status === 'online' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
              color: expert.status === 'online' ? '#4ade80' : '#fbbf24',
              border: `1px solid ${expert.status === 'online' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
            }}>
            {expert.status === 'online' ? '● Online' : expert.status === 'busy' ? '● I/E zënë' : '○ Offline'}
          </span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <Link to={`/ask/${expert.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-[11px] font-bold text-white transition-all"
          style={{ background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.35)' }}
          onClick={e => e.stopPropagation()}>
          Shiko profilin <ArrowRight size={11}/>
        </Link>
      </div>
    </motion.div>
  )
}

export function PsychPromoLanding() {
  const allExperts = loadExperts()
  const quoteIdx   = new Date().getDay() % QUOTES.length
  const quote      = QUOTES[quoteIdx]

  return (
    <div style={{ background: DARK, minHeight:'100vh' }}>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-20 px-5 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)', filter:'blur(40px)' }}/>
        <div className="absolute top-20 right-0 w-72 h-72 pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 70%)', filter:'blur(30px)' }}/>

        <motion.div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
          style={{ background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.35)' }}
          initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"/>
          <span className="text-[11px] font-bold text-violet-300 tracking-wider uppercase">8 psikologë të verifikuar · Online</span>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-5xl font-black text-white leading-tight mb-5 max-w-3xl mx-auto"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, delay:0.1 }}>
          Shëndeti mendor meriton<br/>
          <span style={{ background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            po aq vëmendje sa ai fizik
          </span>
        </motion.h1>

        <motion.p
          className="text-[15px] text-white/55 max-w-xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.2 }}>
          Psikologët tanë të verifikuar aplikojnë metoda CBT, DBT dhe EMDR — të provuara shkencërisht.
          Konfidenciale, fleksibile, efektive. Hapi i parë i madh fillon me 2 minuta.
        </motion.p>

        <motion.div className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.3 }}>
          <Link to="/pricing"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-black text-[14px] transition-all hover:scale-105 hover:shadow-2xl"
            style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow:'0 0 28px rgba(124,58,237,0.4)' }}>
            <Award size={15}/> Zbulo planin Pro
          </Link>
          <Link to="/psikologu"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-black text-[14px] transition-all hover:scale-105"
            style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.75)' }}>
            Pyet falas <ArrowRight size={14}/>
          </Link>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="px-5 pb-16">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={i} className="rounded-3xl p-5 text-center"
              style={CARD_GLASS}
              initial={{ opacity:0, scale:0.88 }} whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }} transition={{ duration:0.4, delay: i*0.08 }}>
              <p className="text-2xl md:text-3xl font-black mb-1.5"
                style={{ background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {s.value}
              </p>
              <p className="text-[10px] text-white/45 leading-snug font-medium">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="px-5 pb-20 max-w-4xl mx-auto">
        <motion.div className="text-center mb-10"
          initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-2">Pse psikologu?</p>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
            Nuk është dobësi —<br/>
            <span className="text-white/55">është vendim i guximshëm</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {WHY.map((w, i) => {
            const Icon = w.icon
            return (
              <motion.div key={i} className="relative rounded-3xl p-6 overflow-hidden"
                style={{ ...CARD_GLASS, borderColor: `${w.color}25` }}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-30px' }} transition={{ duration:0.42, delay: i*0.08 }}>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: w.glow, filter:'blur(20px)' }}/>
                <div className="flex items-start gap-4 relative">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background:`${w.color}18`, border:`1px solid ${w.color}35` }}>
                    <Icon size={18} style={{ color: w.color }}/>
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-white mb-2">{w.title}</p>
                    <p className="text-[12px] text-white/50 leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* QUOTE */}
      <section className="px-5 pb-20">
        <motion.div className="max-w-2xl mx-auto text-center rounded-3xl p-8 relative overflow-hidden"
          style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(139,92,246,0.3)' }}
          initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background:'radial-gradient(ellipse at center,rgba(124,58,237,0.15),transparent 70%)' }}/>
          <div className="text-4xl mb-4 relative">💬</div>
          <p className="text-[16px] md:text-lg font-black text-white/85 italic leading-relaxed mb-4 relative">{quote.text}</p>
          <p className="text-[12px] text-violet-400 font-semibold relative">{quote.author}</p>
        </motion.div>
      </section>

      {/* EXPERT GRID */}
      <section className="px-5 pb-20 max-w-5xl mx-auto">
        <motion.div className="text-center mb-10"
          initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-2">Ekipi ynë</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            Njohuni me psikologët tanë
          </h2>
          <p className="text-[13px] text-white/40 max-w-lg mx-auto">
            Çdo psikolog është i verifikuar manualisht — diplloma, licenca, eksperiencë klinike.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allExperts.map((expert, i) => (
            <ExpertPromoCard key={expert.id} expert={expert} index={i}/>
          ))}
        </div>

        <motion.div className="text-center mt-8"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <Link to="/psikologu"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-violet-400 hover:text-violet-200 transition-colors">
            <Users size={14}/> Shiko profilet e plota dhe pyet falas <ArrowRight size={13}/>
          </Link>
        </motion.div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="px-5 pb-20">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-6">
          {[
            { icon:'🔒', label:'GDPR-compliant',         sub:'Të dhënat tuaja janë private' },
            { icon:'✅', label:'Psikologë të verifikuar', sub:'Diplomë + licencë klinike' },
            { icon:'📱', label:'Online & fleksibël',      sub:'Nga çdo vend, çdo kohë' },
            { icon:'💳', label:'Anulim i lirë',           sub:'Deri 24h para takimit' },
          ].map((t, i) => (
            <motion.div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={CARD_GLASS}
              initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.35, delay: i*0.07 }}>
              <span className="text-xl">{t.icon}</span>
              <div>
                <p className="text-[12px] font-black text-white">{t.label}</p>
                <p className="text-[10px] text-white/40">{t.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24">
        <motion.div className="max-w-lg mx-auto rounded-3xl p-8 text-center relative overflow-hidden"
          style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(79,70,229,0.2))', border:'1px solid rgba(139,92,246,0.4)' }}
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 rounded-full"
            style={{ background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.8),transparent)', filter:'blur(4px)' }}/>

          <div className="text-4xl mb-4">🧬</div>
          <h3 className="text-2xl font-black text-white mb-2">Fillo udhëtimin tënd</h3>
          <p className="text-[13px] text-white/50 mb-2 leading-relaxed">
            Me planin Pro keni akses te psikologët tanë të verifikuar — seanca online 15-min, pyetje private, rezervim takimesh.
          </p>
          <div className="inline-flex items-end gap-1 mb-6 mt-3">
            <span className="text-4xl font-black text-white">€9</span>
            <span className="text-xl font-black text-white">.99</span>
            <span className="text-[13px] text-white/40 mb-1">/muaj</span>
          </div>

          <div className="space-y-2 mb-8 text-left max-w-xs mx-auto">
            {[
              '15 pyetje private / muaj',
              '2 sesione online 15-min',
              'Rezervim takimesh',
              'Përgjigje brenda 24 orësh',
              'Gjithçka tjetër falas',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background:'rgba(139,92,246,0.3)', border:'1px solid rgba(139,92,246,0.5)' }}>
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="#c4b5fd" strokeWidth="2.5">
                    <path d="M2 6l3 3 5-5"/>
                  </svg>
                </div>
                <span className="text-[12px] text-white/65">{f}</span>
              </div>
            ))}
          </div>

          <Link to="/pricing"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-[14px] text-white transition-all hover:scale-[1.02] hover:shadow-2xl"
            style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow:'0 0 32px rgba(124,58,237,0.45)' }}>
            <Award size={16}/> Fillo Pro — €9.99/muaj
          </Link>

          <p className="text-[10px] text-white/25 mt-4">
            Anulo kurrë kohë · Pa kontratë · Pa surpriza
          </p>
        </motion.div>
      </section>

    </div>
  )
}
