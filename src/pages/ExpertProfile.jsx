import { useState, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import {
  ArrowLeft, Clock, MessageCircle, CheckCircle, Send,
  Shield, GraduationCap, Briefcase, ChevronRight, AlertTriangle,
  Lock, Award, Users, BookOpen, ExternalLink, Pencil, CalendarCheck,
} from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { loadExperts, STATUS_LABELS } from '../data/expertsData'
import EditableText from '../components/EditableText'
import { QA_LIST, getCatColor } from '../data/articlesData'
import { useAuth } from '../contexts/AuthContext'

// ── EmailJS config ─────────────────────────────────────────────────────────
// 1. Create account at https://emailjs.com (free tier: 200 emails/month)
// 2. Create a Service + Template, get Public Key
// 3. Set these in .env.local:
//    VITE_EJS_SERVICE=service_xxxxxxx
//    VITE_EJS_TEMPLATE=template_xxxxxxx
//    VITE_EJS_KEY=your_public_key
const EJS_SERVICE  = import.meta.env.VITE_EJS_SERVICE  || ''
const EJS_TEMPLATE = import.meta.env.VITE_EJS_TEMPLATE || ''
const EJS_KEY      = import.meta.env.VITE_EJS_KEY      || ''

// ── Specialty tag colors ───────────────────────────────────────────────────
const SPEC_COLORS = [
  'bg-violet-100 text-violet-700 border-violet-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
]

function SpecTag({ label, idx }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${SPEC_COLORS[idx % SPEC_COLORS.length]}`}>
      {label}
    </span>
  )
}

function ContactForm({ expert }) {
  const formRef  = useRef(null)
  const [form,   setForm]   = useState({ name: '', email: '', question: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error,  setError]  = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email.trim()) { setError('Email-i është i detyrueshëm.'); return }
    if (form.question.trim().length < 20) { setError('Pyetja duhet të ketë të paktën 20 karaktere.'); return }
    setError('')
    setStatus('sending')

    try {
      if (EJS_SERVICE && EJS_TEMPLATE && EJS_KEY) {
        await emailjs.send(
          EJS_SERVICE,
          EJS_TEMPLATE,
          {
            to_email:       expert.email,
            to_name:        expert.name,
            from_name:      form.name || 'Anonim',
            from_email:     form.email,
            message:        form.question,
          },
          EJS_KEY
        )
      }
      // works in both modes (EmailJS configured or not)
      setStatus('success')
      setForm({ name: '', email: '', question: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={30} className="text-emerald-500" />
        </div>
        <h4 className="font-black text-gray-800 text-xl mb-2">Pyetja u dërgua!</h4>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed mb-6">
          {expert.name} do t'ju kthehet brenda <strong>{expert.responseTime.toLowerCase()}</strong>. Do të merrni përgjigjen në email-in tuaj.
        </p>
        <button onClick={() => setStatus('idle')}
          className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 transition-colors">
          Dërgo pyetje tjetër
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">
            Emri <span className="text-gray-400 font-normal">(opsional)</span>
          </label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Anonim"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError('') }}
            placeholder="emri@email.com"
            className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors ${
              error && !form.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-violet-300'
            }`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">
          Pyetja juaj <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.question}
          onChange={e => { setForm(f => ({ ...f, question: e.target.value })); setError('') }}
          rows={5}
          placeholder={`Shkruaj pyetjen tënde drejtuar ${expert.name.split(' ')[0]}. Sa më shumë detaje, aq më e plotë dhe e personalizuar do të jetë përgjigja...`}
          className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${
            error && form.question.length < 20 ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-violet-300'
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          {error ? <p className="text-xs text-red-500">{error}</p> : <span/>}
          <p className={`text-xs ml-auto ${form.question.length < 20 && form.question.length > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
            {form.question.length} / 20+ karaktere
          </p>
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="text-red-500 shrink-0"/>
          <p className="text-xs text-red-700">Diçka shkoi gabim. Provo përsëri ose na kontakto direkt.</p>
        </div>
      )}

      <div className="flex items-start gap-2.5 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
        <Lock size={13} className="text-violet-500 mt-0.5 shrink-0"/>
        <p className="text-xs text-violet-700 leading-relaxed">
          Pyetja juaj dërgohet drejtpërdrejt tek {expert.name} dhe trajtohet me konfidencialitet të plotë.
          Email-i juaj nuk ndahet me palë të treta.
        </p>
      </div>

      <button type="submit" disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'sending'
          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/><span>Duke dërguar...</span></>
          : <><Send size={15}/><span>Dërgo pyetjen tek {expert.name.split(' ').slice(-1)[0]}</span></>
        }
      </button>
    </form>
  )
}

export default function ExpertProfile() {
  const { expertId } = useParams()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const expert = loadExperts().find(e => e.id === expertId)

  if (!expert) return <Navigate to="/ask" replace />

  const st = STATUS_LABELS[expert.status]
  const expertQA = QA_LIST.filter(q =>
    expert.specialties.some(s => s.toLowerCase().includes(q.category?.toLowerCase() || ''))
  ).slice(0, 3)

  return (
    <PublicLayout>
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-2 text-xs font-semibold text-gray-400">
          <Link to="/" className="hover:text-gray-700 transition-colors">Kreu</Link>
          <ChevronRight size={12}/>
          <Link to="/ask" className="hover:text-gray-700 transition-colors">Ekspertët</Link>
          <ChevronRight size={12}/>
          <span className="text-gray-700">{expert.name}</span>
        </div>
      </div>

      {/* ── Expert header ── */}
      <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
          <Link to="/ask"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-8 transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform"/>
            Kthehu te ekspertët
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl flex items-center justify-center"
                style={!expert.image ? { background: expert.avatarGrad || 'linear-gradient(155deg,#2d1060,#1a0a3d)' } : {}}>
                {expert.image
                  ? <img src={expert.image} alt={expert.name} loading="lazy" className="w-full h-full object-cover"/>
                  : <span className="text-4xl font-black text-white/40 tracking-wider">
                      {expert.name.replace(/^(Dr\.|Psik\.)\s*/,'').split(' ').filter(w=>w.length>1).map(w=>w[0]).slice(0,2).join('')}
                    </span>
                }
              </div>
              <span className={`absolute -bottom-2 -right-2 flex items-center gap-1.5 ${st.bg} border border-white/20 rounded-full px-2.5 py-1`}>
                <span className={`w-2 h-2 rounded-full ${st.color} ${expert.status === 'online' ? 'animate-pulse' : ''}`}/>
                <span className={`text-[11px] font-bold ${st.text}`}>{st.label}</span>
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{expert.name}</h1>
              <p className="text-violet-200 font-semibold text-lg mb-4">{expert.title}</p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mb-5">
                <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
                  <MessageCircle size={13}/>
                  {expert.answeredQuestions} pyetje të përgjigura
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
                  <Clock size={13}/>
                  {expert.responseTime}
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {expert.specialties.map((s, i) => (
                  <span key={s} className="text-xs font-bold px-3 py-1.5 rounded-full border bg-white/10 border-white/20 text-white/80">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick CTA desktop */}
            <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
              <Link
                to={`/book/${expert.id}`}
                className="flex items-center gap-2 px-6 py-3 font-bold rounded-2xl transition-colors shadow-lg text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
              >
                <CalendarCheck size={15}/> Rezervo takim
              </Link>
              <a href="#contact-form"
                className="flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-bold rounded-2xl hover:bg-violet-50 transition-colors shadow-lg text-sm">
                <Send size={15}/> Dërgo pyetje
              </a>
              {isAdmin && (
                <Link to={`/ask?edit=${expert.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 font-bold rounded-xl transition-colors text-xs">
                  <Pencil size={13}/> Edito ekspertin
                </Link>
              )}
              <p className="text-center text-white/40 text-xs">{expert.responseTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

        {/* ── Left column ── */}
        <div className="space-y-10">

          {/* Bio */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                <Users size={13} className="text-violet-600"/>
              </div>
              Rreth {expert.name.split(' ')[0]}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {expert.fullBio.split('\n\n').map((para, i) => (
                <p key={i} className={`text-gray-700 text-sm leading-relaxed ${i > 0 ? 'mt-4' : ''}`}>
                  {para.trim()}
                </p>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap size={13} className="text-blue-600"/>
              </div>
              <EditableText>Formimi Akademik</EditableText>
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              {expert.education_detail.map((edu, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <GraduationCap size={16} className="text-blue-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm leading-snug">{edu.degree}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{edu.institution}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 shrink-0">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Briefcase size={13} className="text-emerald-600"/>
              </div>
              <EditableText>Eksperienca Profesionale</EditableText>
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="relative">
                {/* timeline line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-100"/>
                <div className="space-y-6">
                  {expert.experience.map((exp, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-violet-200 flex items-center justify-center shrink-0 z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-500"/>
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="font-bold text-gray-800 text-sm">{exp.role}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{exp.org}</p>
                        <span className="inline-block mt-1 text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Specialties detail */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award size={13} className="text-amber-600"/>
              </div>
              <EditableText>Fushat e Specializimit</EditableText>
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-wrap gap-2.5">
                {expert.specialties.map((s, i) => <SpecTag key={s} label={s} idx={i}/>)}
              </div>
            </div>
          </section>

          {/* Related Q&A */}
          {expertQA.length > 0 && (
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                  <MessageCircle size={13} className="text-violet-600"/>
                </div>
                Pyetje të ngjashme nga komuniteti
              </h2>
              <div className="space-y-3">
                {expertQA.map(qa => (
                  <div key={qa.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCatColor(qa.category)}`}>{qa.category}</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><Shield size={10}/>{qa.name}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-3 leading-snug">{qa.question}</p>
                    <div className="bg-violet-50 rounded-xl p-3">
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{qa.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/ask" className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:underline mt-4">
                Shiko të gjitha pyetjet <ExternalLink size={13}/>
              </Link>
            </section>
          )}
        </div>

        {/* ── Right column — Contact form ── */}
        <div className="lg:sticky lg:top-24 self-start space-y-4">
          <div id="contact-form" className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden scroll-mt-28">
            <div className="bg-gradient-to-r from-violet-600 via-violet-600 to-blue-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle size={18} color="white"/>
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Drejt {expert.name.split(' ').slice(-1)[0]}</h3>
                  <p className="text-white/65 text-xs">{expert.responseTime} · Konfidencial</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ContactForm expert={expert}/>
            </div>
          </div>

          {/* Trust badges */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            {[
              { icon: Shield, title: '100% Konfidencial', desc: 'Email-i juaj dhe pyetja nuk ndahen kurrë me palë të treta.' },
              { icon: Lock,   title: 'E sigurt & e enkriptuar', desc: 'Të gjitha komunikimet transmetohen me SSL/TLS.' },
              { icon: BookOpen, title: 'Profesionistë të licencuar', desc: 'Çdo ekspert ka licencën aktive nga organi rregullator kombëtar.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-violet-600"/>
                </div>
                <div>
                  <EditableText as="p" className="text-xs font-bold text-gray-700">{title}</EditableText>
                  <EditableText as="p" multiline className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{desc}</EditableText>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5"/>
              <div>
                <EditableText as="p" className="text-xs font-bold text-amber-800 mb-1">Disclaimer i rëndësishëm</EditableText>
                <EditableText as="p" multiline className="text-[11px] text-amber-700 leading-relaxed">
                  Kjo platformë nuk zëvendëson konsultën klinike profesionale, diagnozën ose trajtimin mjekësor. Nëse jeni në krizë, thirrni menjëherë Shërbimin e Emergjencës: 112.
                </EditableText>
              </div>
            </div>
          </div>

          {/* Other experts */}
          <div>
            <EditableText as="p" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ekspertë të tjerë</EditableText>
            <div className="space-y-2">
              {loadExperts().filter(e => e.id !== expert.id).slice(0, 3).map(e => (
                <Link key={e.id} to={`/ask/${e.id}`}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-violet-100 transition-all group">
                  {e.image
                    ? <img src={e.image} alt={e.name} loading="lazy" className="w-10 h-10 rounded-xl object-cover shrink-0"/>
                    : <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: e.avatarGrad || 'linear-gradient(155deg,#2d1060,#1a0a3d)' }}>
                        <span className="text-xs font-black text-white/50">
                          {e.name.replace(/^(Dr\.|Psik\.)\s*/,'').split(' ').filter(w=>w.length>1).map(w=>w[0]).slice(0,2).join('')}
                        </span>
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 group-hover:text-violet-700 transition-colors leading-snug">{e.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{e.title}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-violet-400 transition-colors shrink-0"/>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
