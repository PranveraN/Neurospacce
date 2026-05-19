import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import {
  MessageCircle, ChevronDown, ChevronUp, Heart, Send, CheckCircle,
  Shield, Clock, Search, X, Users, Award, ArrowRight,
  AlertTriangle, Lock, Filter, Plus, Pencil, Trash2, ChevronLeft,
} from 'lucide-react'
import BackButton from '../components/BackButton'
import PublicLayout from '../components/layout/PublicLayout'
import EditableText from '../components/EditableText'
import { STATUS_LABELS } from '../data/expertsData'
import { useExperts } from '../hooks/useExperts'
import { QA_LIST, CATEGORIES, getCatColor } from '../data/articlesData'
import { useAuth } from '../contexts/AuthContext'

const FORM_CATS = CATEGORIES.filter(c => c !== 'Të gjitha')

const SPEC_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]

// ── Expert Modal (add / edit) ─────────────────────────────────────────────────
function ExpertModal({ expert, onSave, onClose }) {
  const [tab, setTab] = useState(0)
  const [form, setForm] = useState(
    expert
      ? { ...expert, education_detail: expert.education_detail || [], experience: expert.experience || [], specialties: expert.specialties || [] }
      : {
          id: `expert-${Date.now()}`,
          name: '', title: '', education: '', email: '',
          status: 'online', responseTime: '24-48 orë',
          answeredQuestions: 0, image: '',
          shortBio: '', fullBio: '',
          specialties: [],
          education_detail: [],
          experience: [],
          rating: 4.8, reviewCount: 0,
        }
  )
  const [specInput, setSpecInput] = useState('')

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function addSpec() {
    const v = specInput.trim()
    if (v && !form.specialties.includes(v)) set('specialties', [...form.specialties, v])
    setSpecInput('')
  }
  function removeSpec(s) { set('specialties', form.specialties.filter(x => x !== s)) }

  function addEdu() { set('education_detail', [...form.education_detail, { degree: '', institution: '', year: '' }]) }
  function updateEdu(i, field, value) {
    const arr = form.education_detail.map((e, idx) => idx === i ? { ...e, [field]: value } : e)
    set('education_detail', arr)
  }
  function removeEdu(i) { set('education_detail', form.education_detail.filter((_, idx) => idx !== i)) }

  function addExp() { set('experience', [...form.experience, { role: '', org: '', period: '' }]) }
  function updateExp(i, field, value) {
    const arr = form.experience.map((e, idx) => idx === i ? { ...e, [field]: value } : e)
    set('experience', arr)
  }
  function removeExp(i) { set('experience', form.experience.filter((_, idx) => idx !== i)) }

  const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300 transition-colors'
  const labelCls = 'block text-xs font-bold text-gray-500 mb-1.5'

  const TABS = ['Informacion Bazë', 'Bio & Specializime', 'Arsim & Eksperiencë']

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-black text-gray-900 text-lg">
            {expert ? 'Edito Ekspertin' : 'Shto Ekspert të Ri'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} className="text-gray-500"/>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${
                tab === i ? 'text-violet-600 border-violet-500' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Tab 0 — Basic Info */}
          {tab === 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Emri i plotë <span className="text-red-400">*</span></label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dr. Emri Mbiemri" className={inputCls}/>
                </div>
                <div>
                  <label className={labelCls}>Titulli profesional <span className="text-red-400">*</span></label>
                  <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Psikolog Klinik" className={inputCls}/>
                </div>
              </div>

              <div>
                <label className={labelCls}>Arsimi (njëlinjëshe)</label>
                <input value={form.education} onChange={e => set('education', e.target.value)} placeholder="Ph.D. Psikologji, Universiteti i Tiranës" className={inputCls}/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email kontakti</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="emri@neurospace.com" className={inputCls}/>
                </div>
                <div>
                  <label className={labelCls}>Statusi</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls + ' appearance-none'}>
                    <option value="online">Online</option>
                    <option value="busy">I zënë</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Koha e përgjigjes</label>
                  <input value={form.responseTime} onChange={e => set('responseTime', e.target.value)} placeholder="24-48 orë" className={inputCls}/>
                </div>
                <div>
                  <label className={labelCls}>Pyetje të përgjigura</label>
                  <input type="number" min="0" value={form.answeredQuestions} onChange={e => set('answeredQuestions', Number(e.target.value))} className={inputCls}/>
                </div>
              </div>

              <div>
                <label className={labelCls}>URL e fotos</label>
                <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." className={inputCls}/>
                {form.image && (
                  <img src={form.image} alt="preview" loading="lazy" className="mt-2 w-16 h-16 rounded-xl object-cover border border-gray-100"/>
                )}
              </div>
            </>
          )}

          {/* Tab 1 — Bio & Specialties */}
          {tab === 1 && (
            <>
              <div>
                <label className={labelCls}>Bio e shkurtër <span className="text-gray-400 font-normal">(shfaqet në kartë)</span></label>
                <textarea value={form.shortBio} onChange={e => set('shortBio', e.target.value)} rows={3} placeholder="Psikolog klinik me 10 vjet eksperiencë..." className={inputCls + ' resize-none'}/>
              </div>
              <div>
                <label className={labelCls}>Bio e plotë <span className="text-gray-400 font-normal">(shfaqet në profil, paragrafe të ndara me rresht bosh)</span></label>
                <textarea value={form.fullBio} onChange={e => set('fullBio', e.target.value)} rows={7} placeholder="Paragraf i parë&#10;&#10;Paragraf i dytë..." className={inputCls + ' resize-none'}/>
              </div>
              <div>
                <label className={labelCls}>Specializimet</label>
                <div className="flex gap-2 mb-2">
                  <input value={specInput} onChange={e => setSpecInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSpec() }}}
                    placeholder="p.sh. Ankthi" className={inputCls + ' flex-1'}/>
                  <button type="button" onClick={addSpec}
                    className="px-4 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-500 transition-colors shrink-0">
                    Shto
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.specialties.map((s, i) => (
                    <span key={s} className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${SPEC_COLORS[i % SPEC_COLORS.length]}`}>
                      {s}
                      <button type="button" onClick={() => removeSpec(s)} className="ml-0.5 opacity-60 hover:opacity-100">
                        <X size={10}/>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tab 2 — Education & Experience */}
          {tab === 2 && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls + ' mb-0'}>Formimi Akademik</label>
                  <button type="button" onClick={addEdu}
                    className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-500">
                    <Plus size={13}/> Shto
                  </button>
                </div>
                <div className="space-y-3">
                  {form.education_detail.map((edu, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
                      <div className="flex gap-2">
                        <input value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)}
                          placeholder="Titulli (p.sh. Ph.D. Psikologji)"
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-300"/>
                        <input value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)}
                          placeholder="Viti"
                          className="w-20 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-300"/>
                        <button type="button" onClick={() => removeEdu(i)}
                          className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 self-center">
                          <Trash2 size={13} className="text-red-400"/>
                        </button>
                      </div>
                      <input value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)}
                        placeholder="Institucioni"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-300"/>
                    </div>
                  ))}
                  {form.education_detail.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">
                      Nuk ka të dhëna arsimore. Kliko "+ Shto" për të shtuar.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls + ' mb-0'}>Eksperienca Profesionale</label>
                  <button type="button" onClick={addExp}
                    className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-500">
                    <Plus size={13}/> Shto
                  </button>
                </div>
                <div className="space-y-3">
                  {form.experience.map((exp, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
                      <div className="flex gap-2">
                        <input value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)}
                          placeholder="Roli (p.sh. Psikolog Klinik)"
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-300"/>
                        <button type="button" onClick={() => removeExp(i)}
                          className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 self-center">
                          <Trash2 size={13} className="text-red-400"/>
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input value={exp.org} onChange={e => updateExp(i, 'org', e.target.value)}
                          placeholder="Organizata / Institucioni"
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-300"/>
                        <input value={exp.period} onChange={e => updateExp(i, 'period', e.target.value)}
                          placeholder="Periudha (p.sh. 2018–tani)"
                          className="w-32 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-300"/>
                      </div>
                    </div>
                  ))}
                  {form.experience.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">
                      Nuk ka eksperiencë. Kliko "+ Shto" për të shtuar.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Anulo
          </button>
          <button onClick={() => onSave(form)} disabled={!form.name.trim() || !form.title.trim()}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {expert ? 'Ruaj ndryshimet' : 'Shto ekspertin'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Expert Card ───────────────────────────────────────────────────────────────
function ExpertCard({ expert, isAdmin, onEdit, onDelete, deletingId, onConfirmDelete, onCancelDelete }) {
  const st = STATUS_LABELS[expert.status]
  const isOnline = expert.status === 'online'

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-400 cursor-pointer"
      style={{
        background: 'linear-gradient(175deg,#0e0525 0%,#130730 55%,#0a0220 100%)',
        border: '1px solid rgba(139,92,246,0.18)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = isOnline
          ? '0 16px 48px rgba(124,58,237,0.35), 0 4px 12px rgba(0,0,0,0.4)'
          : '0 16px 48px rgba(80,40,160,0.25), 0 4px 12px rgba(0,0,0,0.4)'
        e.currentTarget.style.borderColor = 'rgba(167,139,250,0.40)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)'
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.18)'
      }}
    >
      {/* ── Delete overlay ── */}
      {deletingId === expert.id && (
        <div className="absolute inset-0 z-20 rounded-3xl flex flex-col items-center justify-center p-6"
          style={{ background: 'rgba(10,2,30,0.97)', backdropFilter: 'blur(8px)' }}>
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4">
            <Trash2 size={20} className="text-red-400"/>
          </div>
          <p className="font-black text-white text-sm mb-1 text-center">Fshi {expert.name}?</p>
          <p className="text-xs text-white/40 mb-6 text-center leading-relaxed">Ky veprim nuk mund të kthehet mbrapsht.</p>
          <div className="flex gap-2 w-full">
            <button onClick={onCancelDelete}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}>
              Anulo
            </button>
            <button onClick={() => onConfirmDelete(expert.id)}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-colors">
              Fshi
            </button>
          </div>
        </div>
      )}

      {/* ── Photo ── */}
      <div className="relative h-52 overflow-hidden shrink-0">
        {expert.image
          ? <img src={expert.image} alt={expert.name} loading="lazy"
              className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              style={{ transition: 'transform 700ms ease' }}
            />
          : (() => {
              const initials = expert.name.replace(/^(Dr\.|Psik\.)\s*/,'').split(' ').filter(w=>w.length>1).map(w=>w[0]).slice(0,2).join('')
              return (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: expert.avatarGrad || 'linear-gradient(155deg,#2d1060,#1a0a3d)' }}>
                  <span className="text-5xl font-black text-white/30 select-none tracking-wider">{initials}</span>
                </div>
              )
            })()
        }

        {/* Multi-layer overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(10,2,30,0.55) 55%, rgba(10,2,30,0.97) 100%)' }}/>

        {/* Aurora tint based on status */}
        <div className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{ background: isOnline
            ? 'radial-gradient(ellipse at 80% 0%, rgba(52,211,153,0.4) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 80% 0%, rgba(251,146,60,0.3) 0%, transparent 60%)'
          }}/>

        {/* Status pill — top left */}
        <div className="absolute top-3.5 left-3.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(10,2,30,0.75)',
              border: isOnline ? '1px solid rgba(52,211,153,0.40)' : '1px solid rgba(251,146,60,0.40)',
              backdropFilter: 'blur(12px)',
            }}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'} ${isOnline ? 'animate-pulse' : ''}`}/>
            <span className={`text-[10px] font-black tracking-wide ${isOnline ? 'text-emerald-300' : 'text-amber-300'}`}>
              {st.label}
            </span>
          </div>
        </div>

        {/* Rating — top right */}
        <div className="absolute top-3.5 right-3.5">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
            style={{ background: 'rgba(10,2,30,0.75)', border: '1px solid rgba(250,204,21,0.30)', backdropFilter: 'blur(12px)' }}>
            <span className="text-amber-400 text-[10px]">★</span>
            <span className="text-[10px] font-black text-white">{expert.rating ?? '4.9'}</span>
          </div>
        </div>

        {/* Admin buttons */}
        {isAdmin && (
          <div className="absolute top-3.5 right-3.5 hidden group-hover:flex items-center gap-1.5 z-10">
            <button onClick={() => onEdit(expert)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(124,58,237,0.7)', border: '1px solid rgba(167,139,250,0.40)' }}>
              <Pencil size={12} className="text-white"/>
            </button>
            <button onClick={() => onDelete(expert.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(239,68,68,0.7)', border: '1px solid rgba(248,113,113,0.40)' }}>
              <Trash2 size={12} className="text-white"/>
            </button>
          </div>
        )}

        {/* Name + title — bottom of photo */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h3 className="font-black text-white text-[16px] leading-tight drop-shadow-lg"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            {expert.name}
          </h3>
          <p className="text-[11px] font-semibold mt-0.5" style={{ color: '#c4b5fd' }}>
            {expert.title}
          </p>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-4">

        {/* Education */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3 truncate"
          style={{ color: 'rgba(167,139,250,0.55)' }}>
          {expert.education}
        </p>

        {/* Bio */}
        <p className="text-[12.5px] leading-relaxed line-clamp-2 flex-1 mb-4"
          style={{ color: 'rgba(255,255,255,0.52)' }}>
          {expert.shortBio}
        </p>

        {/* Specialty tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {expert.specialties.slice(0, 3).map((s) => (
            <span key={s}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(139,92,246,0.28)', color: '#c4b5fd' }}>
              {s}
            </span>
          ))}
          {expert.specialties.length > 3 && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.35)' }}>
              +{expert.specialties.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: 'rgba(167,139,250,0.55)' }}>
              <Clock size={10}/>{expert.responseTime}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: 'rgba(167,139,250,0.55)' }}>
              <MessageCircle size={10}/>{expert.answeredQuestions}
            </span>
          </div>
          <Link to={`/ask/${expert.id}`}
            className="flex items-center gap-1.5 text-[11px] font-black text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 4px 16px rgba(124,58,237,0.40)' }}
            onClick={e => e.stopPropagation()}>
            Bëj pyetje <ArrowRight size={11}/>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Q&A Card ─────────────────────────────────────────────────────────────────
function QACard({ qa }) {
  const [open, setOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
          <MessageCircle size={16} className="text-violet-600"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getCatColor(qa.category)}`}>{qa.category}</span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1"><Shield size={10}/>{qa.name}</span>
            <span className="text-[11px] text-gray-400 ml-auto">{qa.date}</span>
          </div>
          <p className="text-sm font-semibold text-gray-800 leading-snug">{qa.question}</p>
        </div>
        <div className="shrink-0 ml-2 mt-0.5">
          {open ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                <Award size={12} color="white"/>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Përgjigje nga psikologu</p>
                <p className="text-[10px] text-gray-400">NeuroSpace Expert Team</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{qa.answer}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">A ishte e dobishme kjo përgjigje?</p>
            <button onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${liked ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:bg-gray-100'}`}>
              <Heart size={13} className={liked ? 'fill-red-500' : ''}/>
              {liked ? qa.likes + 1 : qa.likes}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Ask paywall ───────────────────────────────────────────────────────────────
const FREE_LIMIT = 2
const COUNT_KEY  = 'ns_ask_count'
const SINGLE_KEY = 'ns_ask_single_ts'

function getAskCount()  { try { return parseInt(localStorage.getItem(COUNT_KEY)  || '0') } catch { return 0 } }
function getSingleValid() {
  try { const ts = parseInt(localStorage.getItem(SINGLE_KEY) || '0'); return ts > 0 && Date.now() - ts < 86_400_000 }
  catch { return false }
}

function AskPaywall({ onClose, onUnlock }) {
  const [step, setStep] = useState('choose') // 'choose' | 'paying' | 'done'

  function simulatePay() {
    setStep('paying')
    setTimeout(() => {
      try { localStorage.setItem(SINGLE_KEY, String(Date.now())) } catch {}
      setStep('done')
      setTimeout(() => { onUnlock(); onClose() }, 1100)
    }, 1600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed)' }}>
              <Lock size={19} color="white" />
            </div>
            <h3 className="font-black text-gray-900 text-lg leading-tight">
              {step === 'done' ? '✓ Pagesa u krye!' : 'Kufiri falas u arrit'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {step === 'done' ? 'Formulari u hap...' : `Ke përdorur ${FREE_LIMIT}/${FREE_LIMIT} pyetje falas`}
            </p>
          </div>
          {step === 'choose' && (
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors shrink-0 mt-1">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Loading / done state */}
        {step !== 'choose' && (
          <div className="px-6 pb-8 flex flex-col items-center gap-4 pt-2">
            {step === 'paying' && (
              <>
                <div className="w-14 h-14 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
                <p className="text-sm font-semibold text-gray-600">Duke procesuar pagesën €0.99...</p>
              </>
            )}
            {step === 'done' && (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle size={30} className="text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-600">Pyetja juaj është e zhbllokuar!</p>
              </>
            )}
          </div>
        )}

        {/* Options */}
        {step === 'choose' && (
          <div className="px-5 pb-6 space-y-3">
            {/* Pro plan */}
            <Link to="/pricing" onClick={onClose}
              className="flex items-start gap-3 p-4 rounded-2xl text-white relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg,#3b0764,#7c3aed,#1d4ed8)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-xl">👑</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-black text-[15px]">Pro Plan</p>
                  <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full tracking-wide">POPULLOR</span>
                </div>
                <div className="space-y-0.5 text-[11px] text-white/70 mb-2">
                  <p>✓ Pyetje pa limit te psikologët</p>
                  <p>✓ 50 mesazhe AI / ditë</p>
                  <p>✓ 3 takime me specialist / muaj</p>
                </div>
                <p className="font-black text-xl">€9.99 <span className="text-sm font-semibold text-white/55">/ muaj</span></p>
              </div>
              <ArrowRight size={16} className="self-center opacity-60 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-[11px] text-gray-400 font-semibold">ose</p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Single question */}
            <button onClick={simulatePay}
              className="w-full flex items-start gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-violet-400 hover:bg-violet-50/40 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0 text-xl">💬</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-black text-gray-900 text-[15px]">1 Pyetje</p>
                  <span className="text-[9px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">NJËHERËSH</span>
                </div>
                <div className="space-y-0.5 text-[11px] text-gray-500 mb-2">
                  <p>✓ Akses i menjëhershëm</p>
                  <p>✓ Aktiv 24 orë</p>
                  <p>✓ Pa abonament</p>
                </div>
                <p className="font-black text-gray-900 text-xl">€0.99 <span className="text-sm font-semibold text-gray-400">/ pyetje</span></p>
              </div>
              <ChevronRight size={16} className="self-center text-gray-300 group-hover:text-violet-500 transition-colors shrink-0" />
            </button>

            <p className="text-[10px] text-gray-400 text-center leading-relaxed px-2">
              Pagesa simuluese · Integrimi real i pagesave Stripe vjen së shpejti.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── General ask form ──────────────────────────────────────────────────────────
function GeneralAskForm() {
  const { user } = useAuth()
  const isPro    = user?.plan === 'pro' || user?.plan === 'premium' || user?.role === 'admin'

  const [submitted, setSubmitted] = useState(false)
  const [form, setForm]           = useState({ name: '', category: FORM_CATS[0], question: '' })
  const [error, setError]         = useState('')
  const [count, setCount]         = useState(getAskCount)
  const [hasSingle, setHasSingle] = useState(getSingleValid)
  const [showWall, setShowWall]   = useState(false)

  const locked    = !isPro && count >= FREE_LIMIT && !hasSingle
  const remaining = isPro ? null : Math.max(0, FREE_LIMIT - count)

  function handleUnlock() {
    setHasSingle(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.question.trim().length < 20) { setError('Pyetja duhet të ketë të paktën 20 karaktere.'); return }
    setError('')

    if (locked) { setShowWall(true); return }

    // Consume the quota
    if (!isPro) {
      if (hasSingle) {
        try { localStorage.removeItem(SINGLE_KEY) } catch {}
        setHasSingle(false)
      } else {
        const next = count + 1
        try { localStorage.setItem(COUNT_KEY, String(next)) } catch {}
        setCount(next)
      }
    }

    setSubmitted(true)
    setForm({ name: '', category: FORM_CATS[0], question: '' })
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-emerald-500"/>
        </div>
        <h4 className="font-black text-gray-800 text-lg mb-2">Pyetja u dërgua!</h4>
        <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-xs mx-auto">
          Eksperti do t'i përgjigjet brenda 24 orësh. Përgjigjen do ta shohësh në seksionin e pyetjeve publike.
        </p>
        <button onClick={() => setSubmitted(false)}
          className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-500 transition-colors">
          Bëj pyetje tjetër
        </button>
      </div>
    )
  }

  return (
    <>
      {showWall && (
        <AskPaywall
          onClose={() => setShowWall(false)}
          onUnlock={handleUnlock}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Usage indicator — only for free users */}
        {!isPro && (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-xs text-gray-500 font-semibold">
              {hasSingle
                ? '💬 1 pyetje bonus aktive'
                : count >= FREE_LIMIT
                ? '🔒 Kufiri falas u arrit'
                : `${count}/${FREE_LIMIT} pyetje falas të përdorura`
              }
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: FREE_LIMIT }).map((_, i) => (
                <div key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i < count && !hasSingle ? 'bg-violet-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Emri <span className="text-gray-300 font-normal">(opsional)</span></label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Anonim"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300 transition-colors"/>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Kategoria</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300 transition-colors appearance-none">
            {FORM_CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Pyetja juaj <span className="text-red-400">*</span></label>
          <textarea value={form.question}
            onChange={e => { setForm(f => ({ ...f, question: e.target.value })); setError('') }}
            rows={5}
            placeholder="Shkruaj pyetjen tënde. Sa më shumë detaje, aq më e plotë do të jetë përgjigja..."
            className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${error ? 'border-red-300' : 'border-gray-200 focus:border-violet-300'}`}/>
          <div className="flex items-center justify-between mt-1">
            {error ? <p className="text-xs text-red-500">{error}</p> : <span/>}
            <p className="text-xs text-gray-400 ml-auto">{form.question.length} karaktere</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-violet-50 rounded-xl px-3 py-2.5">
          <Shield size={13} className="text-violet-500 mt-0.5 shrink-0"/>
          <p className="text-xs text-violet-700 leading-relaxed">
            Pyetja juaj do të publikohet anonimisht për të ndihmuar edhe njerëz me situata të ngjashme.
          </p>
        </div>
        <button type="submit"
          className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-bold rounded-xl transition-all shadow-md text-sm"
          style={locked
            ? { background: 'linear-gradient(135deg,#4c1d95,#7c3aed)' }
            : { background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }
          }>
          {locked ? <><Lock size={15}/> Zhblloko pyetjen</> : <><Send size={15}/> Dërgo pyetjen</>}
        </button>
      </form>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AskPsychologist({ bare = false }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [searchParams, setSearchParams] = useSearchParams()

  const { experts, saveExpert, removeExpert } = useExperts()
  const [modalOpen, setModalOpen]   = useState(false)
  const [modalExpert, setModalExpert] = useState(null) // null = new, object = edit
  const [deletingId, setDeletingId] = useState(null)

  const [filter, setFilter]   = useState('Të gjitha')
  const [search, setSearch]   = useState('')
  const [specFilter, setSpec] = useState('Të gjitha')

  // Auto-open modal when ?edit=expertId is in URL
  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId && isAdmin) {
      const e = experts.find(ex => ex.id === editId)
      if (e) { setModalExpert(e); setModalOpen(true) }
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, isAdmin])

  const ALL_SPECS = ['Të gjitha', ...new Set(experts.flatMap(e => e.specialties))]

  const filteredExperts = experts.filter(e => {
    const matchSpec   = specFilter === 'Të gjitha' || e.specialties.includes(specFilter)
    const matchSearch = !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchSpec && matchSearch
  })

  const filteredQA = filter === 'Të gjitha' ? QA_LIST : QA_LIST.filter(q => q.category === filter)

  function handleSave(form) {
    saveExpert(form)
    setModalOpen(false)
    setModalExpert(null)
  }

  function handleOpenEdit(expert) {
    setModalExpert(expert)
    setModalOpen(true)
  }

  function handleOpenNew() {
    setModalExpert(null)
    setModalOpen(true)
  }

  function handleDelete(id)        { setDeletingId(id) }
  function handleCancelDelete()    { setDeletingId(null) }
  function handleConfirmDelete(id) {
    removeExpert(id)
    setDeletingId(null)
  }

  const inner = (
    <>
      <div className="max-w-6xl mx-auto px-5 pt-5">
        <BackButton fallback="/" />
      </div>

      {/* ── Expert modal ── */}
      {modalOpen && (
        <ExpertModal
          expert={modalExpert}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setModalExpert(null) }}
        />
      )}

      {/* ── HERO ── */}
      <div className="relative overflow-hidden py-24 md:py-32"
        style={{ background: 'linear-gradient(160deg,#06001a 0%,#0f0428 35%,#140836 60%,#0a021e 100%)' }}>

        {/* ── Background layers ── */}
        {/* Photo overlay — very dark */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1400&q=40)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.06,
          }}/>

        {/* Glow blobs */}
        <div className="absolute -top-24 right-0 w-[520px] h-[520px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.45),transparent 70%)' }}/>
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(236,72,153,0.30),transparent 70%)' }}/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.18),transparent 70%)' }}/>

        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.10) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}/>

        {/* ── Content ── */}
        <div className="relative max-w-5xl mx-auto px-5 text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(167,139,250,0.25)',
              backdropFilter: 'blur(12px)',
            }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"/>
            </span>
            <span className="text-sm font-semibold text-white/70">
              <span className="text-white font-black">{experts.filter(e => e.status === 'online').length}</span>
              {' '}psikologë online tani
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-black text-white leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)' }}>
            <EditableText>Pyet ekspertët,</EditableText>
            <br/>
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg,#c084fc 10%,#f472b6 55%,#818cf8 90%)' }}>
              <EditableText>falas & konfidencial</EditableText>
            </span>
          </h1>

          {/* Sub */}
          <EditableText as="p" multiline
            className="text-white/55 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            {experts.length} psikologë dhe terapistë të licencuar, gati të përgjigjen pyetjeve tuaja. Pa gjykim, pa pagesë.
          </EditableText>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <a href="#ask-form"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white text-sm font-black shadow-xl transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 8px 30px rgba(124,58,237,0.40)' }}>
              <MessageCircle size={16}/> <EditableText>Bëj pyetjen tënde</EditableText>
            </a>
            <a href="#experts-grid"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white/70 text-sm font-bold border transition-all hover:text-white hover:border-white/30"
              style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}>
              <Users size={15}/> <EditableText>Shiko ekspertët</EditableText>
            </a>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden"
            style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.18)' }}>
            {[
              { icon: '🧑‍⚕️', v: `${experts.length}`,  l: 'Ekspertë të licencuar' },
              { icon: '⚡',   v: '24h',               l: 'Kohë mesatare përgjigjes' },
              { icon: '💬',  v: '98%',                l: 'Satisfaksion i përdoruesve' },
              { icon: '⭐',  v: '98%',                l: 'Satisfaksion' },
            ].map((s, i) => (
              <div key={s.l}
                className="flex flex-col items-center justify-center py-6 px-4 text-center"
                style={{ background: 'rgba(15,4,40,0.60)', backdropFilter: 'blur(16px)' }}>
                <span className="text-2xl mb-1">{s.icon}</span>
                <p className="text-2xl md:text-3xl font-black text-white mb-0.5">{s.v}</p>
                <p className="text-[11px] text-white/40 font-medium leading-tight">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
            {[
              { icon: Shield,   label: 'Konfidencialitet i plotë' },
              { icon: Award,    label: 'Psikologë të licencuar' },
              { icon: Clock,    label: 'Përgjigje brenda 24h' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={13} className="text-violet-400 shrink-0"/>
                <span className="text-xs text-white/40 font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPERTS SECTION ── */}
      <section id="experts-grid" className="py-16"
        style={{ background: 'linear-gradient(180deg,#07001a 0%,#0e0330 40%,#070018 100%)' }}><div className="max-w-6xl mx-auto px-5">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Ekipi ynë</p>
            <EditableText as="h2" className="text-3xl font-black text-white">Ekspertët tanë</EditableText>
            <EditableText as="p" multiline className="text-white/45 text-sm mt-1">Çdo ekspert është i verifikuar, i licensuar dhe me eksperiencë klinike të dokumentuar.</EditableText>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Admin: add expert button */}
            {isAdmin && (
              <button onClick={handleOpenNew}
                className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-500 transition-colors shadow-sm">
                <Plus size={15}/> Shto ekspert
              </button>
            )}

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Kërko emër ose specializim..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm focus:outline-none text-white placeholder-white/30"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(139,92,246,0.25)' }}/>
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14}/>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Specialty filter chips */}
        <div className="flex gap-2 flex-wrap mb-8 pb-4" style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="flex items-center gap-1.5 text-xs font-bold mr-1" style={{ color: 'rgba(167,139,250,0.50)' }}>
            <Filter size={12}/> Filtro:
          </div>
          {ALL_SPECS.slice(0, 10).map(s => (
            <button key={s} onClick={() => setSpec(s)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={specFilter === s
                ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: 'white', border: '1px solid transparent', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(167,139,250,0.70)', border: '1px solid rgba(139,92,246,0.20)' }
              }>
              {s}
            </button>
          ))}
        </div>

        {filteredExperts.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={40} className="mx-auto mb-4 text-gray-200"/>
            <p className="text-gray-500 font-semibold">Asnjë ekspert nuk u gjet.</p>
            <button onClick={() => { setSearch(''); setSpec('Të gjitha') }}
              className="mt-3 text-sm text-violet-600 font-bold hover:underline">
              Pastro filtrat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredExperts.map(e => (
              <ExpertCard
                key={e.id}
                expert={e}
                isAdmin={isAdmin}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCancelDelete}
              />
            ))}
          </div>
        )}
      </div></section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gradient-to-br from-violet-50 to-blue-50 border-y border-violet-100 py-16">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <EditableText as="p" className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Si funksionon</EditableText>
          <EditableText as="h2" className="text-3xl font-black text-gray-900 mb-12">Tre hapa të thjeshtë</EditableText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', icon: Users, title: 'Zgjidh ekspertin', desc: 'Shiko profilet, specializimet dhe vlerësimet. Gjej ekspertin që i përshtatet situatës tënde.' },
              { n: '02', icon: MessageCircle, title: 'Bëj pyetjen', desc: 'Shkruaj pyetjen tënde anonim ose me emrin tënd. Sistemi dërgon direkt tek eksperti.' },
              { n: '03', icon: CheckCircle, title: 'Merr përgjigjen', desc: 'Eksperti i licencuar të kthehet me përgjigje brenda 24-48 orësh. Falas, konfidencial.' },
            ].map(step => {
              const Icon = step.icon
              return (
                <div key={step.n} className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-violet-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon size={22} className="text-violet-600"/>
                  </div>
                  <span className="absolute top-0 right-1/2 translate-x-6 -translate-y-1 text-[10px] font-black text-violet-300 bg-violet-50 rounded-full px-1.5">
                    {step.n}
                  </span>
                  <EditableText as="h3" className="font-black text-gray-900 text-base mb-2">{step.title}</EditableText>
                  <EditableText as="p" multiline className="text-gray-500 text-sm leading-relaxed">{step.desc}</EditableText>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Q&A + FORM ── */}
      <div className="max-w-6xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

        {/* Q&A List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1">Komuniteti</p>
              <h2 className="text-2xl font-black text-gray-900">
                Pyetje të përgjigura
                <span className="ml-2 text-base font-bold text-gray-400">({filteredQA.length})</span>
              </h2>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            {['Të gjitha', ...FORM_CATS].map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  filter === c
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600'
                }`}>
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredQA.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <MessageCircle size={40} className="mx-auto mb-3 opacity-30"/>
                <p className="font-semibold">Asnjë pyetje në këtë kategori.</p>
              </div>
            ) : filteredQA.map(qa => <QACard key={qa.id} qa={qa}/>)}
          </div>
        </div>

        {/* Ask form sidebar */}
        <div className="lg:sticky lg:top-24 self-start space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle size={18} color="white"/>
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Bëj pyetjen tënde</h3>
                  <p className="text-white/65 text-xs">Anonim · Falas · Përgjigje në 24h</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <GeneralAskForm/>
            </div>
          </div>

          {/* Trust badges */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            {[
              { icon: Shield,  t: '100% Anonim', d: 'Identiteti juaj nuk zbulohet kurrë pa lejen tuaj.' },
              { icon: Lock,    t: 'Plotësisht konfidencial', d: 'Çdo komunikim kodohet dhe mbrohet me SSL.' },
              { icon: Award,   t: 'Ekspertë të verifikuar', d: 'Çdo psikolog ka licencën aktive të verifikuar.' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-violet-600"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">{t}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5"/>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                <strong>Disclaimer:</strong> Kjo platformë nuk zëvendëson konsultën klinike profesionale.
                Nëse jeni në krizë, thirrni <strong>Linjën e Emergjencës: 127</strong> (24/7).
              </p>
            </div>
          </div>
        </div>
      </div>

    </>
  )
  return bare ? inner : <PublicLayout>{inner}</PublicLayout>
}
