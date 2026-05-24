import { useState, useEffect, useCallback } from 'react'
import {
  EXPERTS,
  fetchExpertsFromDB,
  upsertSpecialistToDB,
  deleteSpecialistFromDB,
} from '../../data/expertsData'
import {
  Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight,
  Star, CheckCircle, XCircle, Loader2, X, Save,
  RefreshCw, UserCheck, Mail, Phone, Globe,
} from 'lucide-react'

const SPECIALTIES_OPTIONS = [
  'Ankth', 'Trauma & PTSD', 'CBT', 'Depresion', 'Fobia Sociale',
  'Çrregullim Bipolar', 'Insomnia', 'Psikofarmakologji', 'Stres Kronik',
  'Çift & Familje', 'Fëmijë & Adoleshentë', 'Çrregullime Ngrënieje',
  'Autizëm & Zhvillim', 'ADHD', 'Trajtim Trauma', 'Koçing',
]

const CATEGORY_OPTIONS = [
  'Psikolog Klinik', 'Psikiatër', 'Psikoterapist', 'Neuroloq',
  'Koç Jetësor', 'Këshilltar Familjar',
]

const EMPTY_FORM = {
  name: '', title: '', email: '', phone: '', category: '',
  shortBio: '', education: '', specialties: [],
  rating: 4.5, reviewCount: 0, responseTime: 'Brenda 24h',
  price_per_session: 30, is_active: true, status: 'online',
}

function Badge({ children, color = 'violet' }) {
  const map = {
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    green:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    red:    'bg-red-500/20 text-red-300 border-red-500/30',
    slate:  'bg-slate-700 text-slate-300 border-slate-600',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[color]}`}>
      {children}
    </span>
  )
}

function SpecialistModal({ specialist, onClose, onSave }) {
  const [form, setForm] = useState(specialist ? {
    name: specialist.name || '',
    title: specialist.title || '',
    email: specialist.email || '',
    phone: specialist.phone || '',
    category: specialist.category || '',
    shortBio: specialist.shortBio || specialist.short_bio || '',
    education: specialist.education || '',
    specialties: specialist.specialties || [],
    rating: specialist.rating || 4.5,
    reviewCount: specialist.reviewCount || specialist.review_count || 0,
    responseTime: specialist.responseTime || specialist.response_time || 'Brenda 24h',
    price_per_session: specialist.price_per_session || 30,
    is_active: specialist.is_active ?? true,
    status: specialist.status || 'online',
  } : EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function toggle(spec) {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(spec)
        ? f.specialties.filter(s => s !== spec)
        : [...f.specialties, spec],
    }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.title.trim()) {
      setError('Emri dhe titulli janë të detyrueshëm.')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      // Preserve existing id or generate a stable string id for new specialists
      id: specialist?.id || `expert-${Date.now()}`,
      name: form.name.trim(),
      title: form.title.trim(),
      email: form.email.trim(),
      phone: (form.phone || '').trim(),
      category: form.category || '',
      shortBio: form.shortBio.trim(),
      education: form.education.trim(),
      specialties: form.specialties,
      rating: parseFloat(form.rating) || 4.5,
      reviewCount: parseInt(form.reviewCount) || 0,
      responseTime: form.responseTime,
      price_per_session: parseFloat(form.price_per_session) || 30,
      is_active: form.is_active,
      status: form.status,
      // Preserve rich fields from original if editing
      image: specialist?.image ?? null,
      avatarGrad: specialist?.avatarGrad ?? 'linear-gradient(155deg,#6d28d9,#7c3aed,#4c1d95)',
      fullBio: specialist?.fullBio ?? '',
      education_detail: specialist?.education_detail ?? [],
      experience: specialist?.experience ?? [],
      answeredQuestions: specialist?.answeredQuestions ?? 0,
    }
    const ok = await upsertSpecialistToDB(payload, 0)
    setSaving(false)
    if (!ok) { setError('Gabim gjatë ruajtjes në server.'); return }
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h3 className="font-black text-white text-base">
            {specialist?.id ? 'Ndrysho Specialistin' : 'Shto Specialist të Ri'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Emri i plotë *</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Dr. Emri Mbiemri"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Titulli *</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Psikolog Klinik & Neuropsikolog"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Email</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="specialist@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Telefon</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+355 69 xxx xxxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Kategoria</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Zgjidh kategorinë</option>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Çmimi / Seancë (€)</label>
              <input
                type="number" min="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                value={form.price_per_session} onChange={e => setForm(f => ({ ...f, price_per_session: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Edukimi</label>
            <input
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
              placeholder="PhD · Universiteti i Tiranës"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Bio e shkurtër</label>
            <textarea
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
              value={form.shortBio} onChange={e => setForm(f => ({ ...f, shortBio: e.target.value }))}
              placeholder="Përshkrim i shkurtër i specialistit..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">Specialitetet</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES_OPTIONS.map(spec => (
                <button
                  key={spec}
                  onClick={() => toggle(spec)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    form.specialties.includes(spec)
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Rating</label>
              <input
                type="number" min="1" max="5" step="0.1"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Numri komenteve</label>
              <input
                type="number" min="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                value={form.reviewCount} onChange={e => setForm(f => ({ ...f, reviewCount: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Koha e Përgjigjes</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                value={form.responseTime} onChange={e => setForm(f => ({ ...f, responseTime: e.target.value }))}>
                <option>Brenda 1h</option>
                <option>Brenda 3h</option>
                <option>Brenda 6h</option>
                <option>Brenda 12h</option>
                <option>Brenda 24h</option>
                <option>Brenda 48h</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                className={`transition-colors ${form.is_active ? 'text-emerald-400' : 'text-slate-600'}`}>
                {form.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
              <span className="text-sm font-semibold text-slate-300">Aktiv</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Status</label>
              <select
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500"
                value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="online">Online</option>
                <option value="busy">I zënë</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors">
            Anulo
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Duke ruajtur...' : 'Ruaj'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminSpecialists() {
  const [specialists, setSpecialists]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal]               = useState(null) // null | 'add' | specialist object
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const [usingStatic, setUsingStatic]   = useState(false)
  const [error, setError]               = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const dbList = await fetchExpertsFromDB()
    if (dbList === null || dbList.length === 0) {
      // DB unreachable or empty — show static data read-only
      setUsingStatic(true)
      setSpecialists(EXPERTS.map(e => ({
        ...e, is_active: e.is_active ?? true, price_per_session: e.price_per_session ?? 30,
      })))
    } else {
      setUsingStatic(false)
      setSpecialists(dbList.map(e => ({
        ...e, is_active: e.is_active ?? true, price_per_session: e.price_per_session ?? 30,
      })))
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleToggleActive(spec) {
    if (usingStatic) return
    const idx = specialists.findIndex(s => s.id === spec.id)
    await upsertSpecialistToDB({ ...spec, is_active: !spec.is_active }, idx)
    load()
  }

  async function handleDelete() {
    if (!deleteTarget || usingStatic) return
    setDeleting(true)
    await deleteSpecialistFromDB(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    load()
  }

  const filtered = specialists.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.name?.toLowerCase().includes(q) || s.title?.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all'
      || (filterStatus === 'active' && s.is_active)
      || (filterStatus === 'inactive' && !s.is_active)
    return matchSearch && matchStatus
  })

  const activeCount   = specialists.filter(s => s.is_active).length
  const inactiveCount = specialists.filter(s => !s.is_active).length
  const avgRating     = specialists.length
    ? (specialists.reduce((a, s) => a + (parseFloat(s.rating) || 0), 0) / specialists.length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Menaxhimi i Specialistëve</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {specialists.length} specialistë gjithsej
            {usingStatic && <span className="ml-2 text-amber-400 text-xs font-bold">(të dhëna statike)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          {!usingStatic && (
            <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors">
              <Plus size={15} /> Shto Specialist
            </button>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gjithsej', value: specialists.length, color: 'violet' },
          { label: 'Aktivë', value: activeCount, color: 'emerald' },
          { label: 'Joaktivë', value: inactiveCount, color: 'slate' },
          { label: 'Rating Mesatar', value: avgRating, color: 'amber' },
        ].map(k => (
          <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-500">{k.label}</p>
            <p className={`text-2xl font-black mt-1 ${k.color === 'violet' ? 'text-violet-400' : k.color === 'emerald' ? 'text-emerald-400' : k.color === 'amber' ? 'text-amber-400' : 'text-slate-400'}`}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
            placeholder="Kërko specialist..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${filterStatus === f ? 'bg-violet-600 border-violet-500 text-white' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
            >
              {f === 'all' ? 'Të gjithë' : f === 'active' ? 'Aktivë' : 'Joaktivë'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Specialisti', 'Specialitetet', 'Rating', 'Çmimi', 'Status', 'Veprimet'].map(h => (
                    <th key={h} className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-600 text-sm">Nuk u gjet asnjë specialist</td></tr>
                ) : filtered.map(spec => (
                  <tr key={spec.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                          style={{ background: spec.avatarGrad || 'linear-gradient(135deg,#6d28d9,#4c1d95)' }}>
                          {spec.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{spec.name}</p>
                          <p className="text-xs text-slate-500">{spec.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(spec.specialties || []).slice(0, 3).map(s => (
                          <Badge key={s}>{s}</Badge>
                        ))}
                        {(spec.specialties || []).length > 3 && (
                          <Badge color="slate">+{spec.specialties.length - 3}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-amber-400">{spec.rating || '—'}</span>
                        <span className="text-xs text-slate-600">({spec.reviewCount || spec.review_count || 0})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-emerald-400">€{spec.price_per_session || 30}</span>
                    </td>
                    <td className="px-4 py-3">
                      {spec.is_active
                        ? <Badge color="green"><CheckCircle size={10} className="mr-1" />Aktiv</Badge>
                        : <Badge color="red"><XCircle size={10} className="mr-1" />Joaktiv</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(spec)}
                          disabled={usingStatic}
                          title={spec.is_active ? 'Çaktivizo' : 'Aktivo'}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
                        >
                          {spec.is_active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        </button>
                        <button
                          onClick={() => setModal(spec)}
                          disabled={usingStatic}
                          title="Ndrysho"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(spec)}
                          disabled={usingStatic}
                          title="Fshi"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <SpecialistModal
          specialist={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-black text-white text-base mb-2">Konfirmo Fshirjen</h3>
            <p className="text-sm text-slate-400 mb-5">
              A jeni i sigurt që doni të fshini <strong className="text-white">{deleteTarget.name}</strong>? Ky veprim nuk mund të kthehet.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors">
                Anulo
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Fshi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
