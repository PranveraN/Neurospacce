import { Brain, Heart, Shield, Users, Zap, Mail, ChevronRight, Sparkles, BookOpen, Baby, UserCheck, Globe2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import EditableText from '../components/EditableText'
import TeamMemberCard from '../components/TeamMemberCard'

/* ── Who we serve ── */
const SERVE = [
  {
    icon: Heart,
    title: 'Njerëzit që vuajnë në heshtje',
    desc: 'Ankthi, depresioni, stresi kronik: kaq shumë njerëz jetojnë me barrë të padukshme. NeuroSpace i jep çdonjërit hapësirë të sigurt për të kuptuar dhe menaxhuar emocionet e veta.',
    from: '#ec4899', to: '#9d174d',
    tag: 'Shëndet mendor',
  },
  {
    icon: Baby,
    title: 'Prindërit që duan të bëjnë mirë',
    desc: 'Rritja e fëmijëve është sfida më e madhe dhe më e bukur. Ofrojmë udhëzime të bazuara në shkencë për komunikim, kufij të shëndetshëm dhe lidhje emocionale me fëmijën.',
    from: '#f59e0b', to: '#b45309',
    tag: 'Prindërim',
  },
  {
    icon: UserCheck,
    title: 'Profesionistët e lodhur',
    desc: 'Burnout, presioni i punës, ekuilibri jeta-punë: profesionistët modernë kanë nevojë për mbështetje të specializuar. NeuroSpace ofron teknika konkrete dhe mentorim profesional.',
    from: '#3b82f6', to: '#1e3a8a',
    tag: 'Mirëqenie',
  },
  {
    icon: Globe2,
    title: 'Diaspora dhe ata larg shtëpisë',
    desc: 'Të jetosh larg shtëpisë sjell sfida unike: vetmi, nostalgjia, identiteti. NeuroSpace është gjithmonë këtu, në gjuhën tënde, me kuptimin e kontekstit tënd kulturor.',
    from: '#7c3aed', to: '#4c1d95',
    tag: 'Komunitet',
  },
]

/* ── Manifesto stats ── */
const PILLARS = [
  { num: '1 në 4', label: 'persona përballet me probleme të shëndetit mendor gjatë jetës, por shumica nuk kërkojnë ndihmë kurrë' },
  { num: '74%', label: 'e njerëzve me probleme të shëndetit mendor nuk marrin asnjë ndihmë profesionale' },
  { num: '1-e', label: 'platformë cilësore e shëndetit mendor në gjuhën shqipe: NeuroSpace' },
]

/* ── Values ── */
const VALUES = [
  { icon: Heart,  title: 'Njeriu para çdo tjetri',   desc: 'Çdo funksion vendoset duke pyetur: "A ndihmon vërtet dikë sot?" Jo metrika, jo viral, por vetëm ndikim real.', from: '#ec4899', to: '#be185d' },
  { icon: Shield, title: 'Privatësi pa kompromis',    desc: 'Çfarë ndani me ne qëndron me ne. Asnjë të dhënë për reklama, asnjë profilizim, asnjë shitje e të dhënave.', from: '#7c3aed', to: '#4c1d95' },
  { icon: Zap,    title: 'Shkencë, jo klishe',        desc: 'Çdo teknikë, çdo artikull, çdo vlerësim buron nga kërkime të verifikuara. Nuk ofrojmë "motivim", por dije.', from: '#f59e0b', to: '#b45309' },
  { icon: Users,  title: 'Gjithëpërfshirje reale',   desc: 'Nga Prishtina në Tiranë deri te diaspora në Zvicër: NeuroSpace është për çdo folës të shqipes, pavarësisht vendndodhjes.', from: '#10b981', to: '#065f46' },
]

export const TEAM_DEFAULTS = [
  { initials: 'AN', name: 'Arben Nushi', role: 'CEO & Co-Founder', grad: 'linear-gradient(135deg,#7c3aed,#4c1d95)' },
  { initials: 'MK', name: 'Mirela Koci',  role: 'Kryepsikologja',   grad: 'linear-gradient(135deg,#ec4899,#9d174d)' },
  { initials: 'DH', name: 'Dion Hoxha',  role: 'CTO',               grad: 'linear-gradient(135deg,#3b82f6,#1e3a8a)' },
]

export default function About() {
  return (
    <PublicLayout>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-5" style={{ background: 'linear-gradient(135deg,#0c0028 0%,#1a0050 55%,#09001f 100%)' }}>
        {/* Ambient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }}/>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle,#ec4899,transparent)' }}/>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-300 text-xs font-bold mb-8 uppercase tracking-widest">
            <Sparkles size={12}/> Misioni ynë
          </div>
          <EditableText id="about-hero-h1" as="h1" className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1]">
            Kujdesi për mendjen s'duhet të jetë luks
          </EditableText>
          <EditableText id="about-hero-sub" as="p" multiline className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Miliona njerëz vuajnë nga ankthi, depresioni dhe stresi pa e ditur ku të drejtohen, pa gjetur ndihmë në gjuhën e tyre. NeuroSpace ekziston për t'i ndryshuar këto shifra.
          </EditableText>
          <Link to="/auth"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-sm text-white hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
            Fillo falas <ArrowRight size={16}/>
          </Link>
        </div>
      </section>

      {/* ── MANIFESTO / STATS ───────────────────────────────── */}
      <section className="py-16 px-5 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {PILLARS.map((p, i) => (
              <div key={i} className="py-8 md:py-4 md:px-10 first:pl-0 last:pr-0 text-center">
                <p className="text-4xl font-black text-violet-600 mb-2">{p.num}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: 'linear-gradient(180deg,#faf9ff 0%,#f3f0ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black text-violet-500 uppercase tracking-widest mb-3">Kujt i shërbejmë</p>
            <EditableText id="about-serve-h2" as="h2" className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Për këdo që ka nevojë, pa gjykim
            </EditableText>
            <EditableText id="about-serve-sub" as="p" multiline className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              NeuroSpace është ndërtuar për njerëz të vërtetë me sfida të vërteta, nga Kosova në Shqipëri deri te diaspora në çdo cep të botës.
            </EditableText>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {SERVE.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="group relative bg-white rounded-3xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all overflow-hidden">
                  {/* bg glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-5 transition-opacity blur-2xl"
                    style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}/>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
                      <Icon size={22} color="white" strokeWidth={2}/>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <EditableText id={`about-serve-title-${i}`} as="p" className="font-black text-gray-900 text-base">{s.title}</EditableText>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: `${s.from}15`, color: s.from }}>
                          {s.tag}
                        </span>
                      </div>
                      <EditableText id={`about-serve-desc-${i}`} as="p" multiline className="text-sm text-gray-500 leading-relaxed">{s.desc}</EditableText>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── STORY ───────────────────────────────────────────── */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-center">

            {/* Quote card — left, spans 2 cols */}
            <div className="md:col-span-2 relative">
              <div className="rounded-3xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg,#0c0028,#2d1060,#1a0050)' }}>
                <div className="p-8">
                  {/* decorative quote mark */}
                  <div className="text-7xl font-black text-violet-400/20 leading-none -mt-2 mb-2 select-none">"</div>
                  <EditableText id="about-quote" as="p" className="text-xl font-black text-white leading-snug mb-5">
                    Çdo mendje meriton kujdes, pavarësisht nga vjen, sa fiton, apo çfarë ndjen.
                  </EditableText>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                      <Brain size={15} color="white" strokeWidth={2}/>
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">NeuroSpace</p>
                      <p className="text-[10px] text-white/40">Fondimi i platformës, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* decorative blobs */}
              <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-2xl -z-10 opacity-30"
                style={{ background: 'linear-gradient(135deg,#ec4899,#7c3aed)' }}/>
              <div className="absolute -top-5 -right-5 w-14 h-14 rounded-2xl -z-10 opacity-20"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}/>
            </div>

            {/* Story text — right, spans 3 cols */}
            <div className="md:col-span-3">
              <p className="text-xs font-black text-violet-500 uppercase tracking-widest mb-3">Historia jonë</p>
              <EditableText id="about-story-h2" as="h2" className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                Pse e ndërtuam NeuroSpace
              </EditableText>

              <div className="space-y-4">
                <EditableText id="about-story-p1" as="p" multiline className="text-gray-600 leading-relaxed">
                  Çdo ditë, njerëz të zakonshëm: nëna që nuk fle natën nga ankthi, i riu që nuk guxon të flasë me askënd, prindi që nuk di si t'i afrohet fëmijës, jetojnë me barrë të padukshme pa asnjë mbështetje.
                </EditableText>
                <EditableText id="about-story-p2" as="p" multiline className="text-gray-600 leading-relaxed">
                  Burimet ekzistonin, por jo në shqip. Psikologët ekzistonin, por me tarifa shumë të larta. Platformat ekzistonin, por pa kuptuar kontekstin kulturor dhe gjuhësor tonin.
                </EditableText>
                <EditableText id="about-story-p3" as="p" multiline className="text-gray-600 leading-relaxed">
                  Kështu lindi NeuroSpace, një platformë e ndërtuar nga njerëz që kuptojnë sfidën, për njerëz që meritojnë ndihmë reale. Sot jemi këtu, nesër do të jemi edhe më afër.
                </EditableText>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Kosovë', 'Shqipëri', 'Maqedoni', 'Diaspora'].map(loc => (
                  <span key={loc} className="px-3 py-1.5 rounded-full text-xs font-bold bg-violet-50 text-violet-600 border border-violet-100">
                    📍 {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: 'linear-gradient(180deg,#f8f7ff 0%,#f0eeff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black text-violet-500 uppercase tracking-widest mb-3">Vlerat tona</p>
            <EditableText id="about-values-h2" as="h2" className="text-3xl font-black text-gray-900">
              Çfarë na udhëheq çdo ditë
            </EditableText>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <div key={i} className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 flex gap-5 hover:shadow-md transition-shadow">
                  <div className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg,${v.from},${v.to})` }}>
                    <Icon size={22} color="white" strokeWidth={2}/>
                  </div>
                  <div>
                    <EditableText id={`about-val-title-${i}`} as="p" className="font-black text-gray-900 mb-2 text-base">{v.title}</EditableText>
                    <EditableText id={`about-val-desc-${i}`} as="p" multiline className="text-sm text-gray-500 leading-relaxed">{v.desc}</EditableText>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────── */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black text-violet-500 uppercase tracking-widest mb-3">Ekipi</p>
            <EditableText id="about-team-h2" as="h2" className="text-3xl font-black text-gray-900 mb-3">
              Njerëzit pas NeuroSpace
            </EditableText>
            <EditableText id="about-team-sub" as="p" multiline className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Ekspertizë psikologjike, teknologjike dhe dizajn, bashkuar nga një qëllim i vetëm.
            </EditableText>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEAM_DEFAULTS.map((m, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-violet-100 transition-colors">
                <TeamMemberCard index={i} {...m}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREERS ─────────────────────────────────────────── */}
      <section id="careers" className="py-20 px-5" style={{ background: 'linear-gradient(135deg,#0f0035,#1a0050)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-4">Karriera</p>
          <EditableText id="about-careers-h2" as="h2" className="text-3xl font-black text-white mb-4">
            Bashkohu me misionin tonë
          </EditableText>
          <EditableText id="about-careers-sub" as="p" multiline className="text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
            Nëse besoni se çdo njeri meriton akses në shëndetin mendor dhe doni të bëni ndryshim real, ne po ju kërkojmë.
          </EditableText>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {['Psikolog/e klinike', 'Zhvillues/e React', 'Menaxher/e Komuniteti'].map((role, i) => (
              <div key={i}
                className="p-5 rounded-2xl text-left hover:border-violet-400/50 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <EditableText id={`about-career-role-${i}`} as="p" className="font-black text-white text-sm mb-1">{role}</EditableText>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"/>Pozicion i hapur
                </p>
              </div>
            ))}
          </div>

          <a href="mailto:karriera@neurospace.com"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
            <Mail size={15}/> Dërgoni CV-në tuaj
          </a>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 px-5 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <EditableText id="about-cta-h2" as="h2" className="text-2xl font-black text-gray-900 mb-3">
            Gati të filloni?
          </EditableText>
          <EditableText id="about-cta-sub" as="p" multiline className="text-gray-500 mb-6">
            Regjistrohu falas. Pa kartë krediti, pa kushte.
          </EditableText>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth"
              className="px-6 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)' }}>
              Regjistrohu falas
            </Link>
            <a href="mailto:info@neurospace.com"
              className="px-6 py-3 rounded-xl font-bold text-sm text-gray-700 border border-gray-200 hover:border-violet-300 transition-colors flex items-center justify-center gap-2">
              <Mail size={15}/> Na kontaktoni
            </a>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
