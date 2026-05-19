import { useState } from 'react'
import {
  Palette, CreditCard,
  Save, RotateCcw, Shield, Bell, Globe, Lock, Zap, CheckCircle,
} from 'lucide-react'

const ACCENT_COLORS = [
  { label: 'Violet',  value: '#7c3aed' },
  { label: 'Blue',    value: '#2563eb' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Rose',    value: '#e11d48' },
  { label: 'Amber',   value: '#d97706' },
  { label: 'Cyan',    value: '#0891b2' },
]

const DEFAULTS = {
  accent: '#7c3aed',
  general: {
    siteName: 'NeuroSpace',
    supportEmail: 'support@neurospace.com',
    maxUsersPerRoom: '50',
    sessionTimeout: '24',
    maintenanceMode: false,
  },
  security: {
    twoFactor: false,
    passwordMinLength: '8',
    loginAttempts: '5',
    requireEmailVerify: false,
  },
  notif: {
    emailOnSignup: true,
    emailOnReport: true,
    emailOnPremium: true,
    digestWeekly: false,
  },
  features: [
    { id: 'ai_chat',     label: 'AI Chat',              desc: 'Asistenti AI i personalizuar',       enabled: true  },
    { id: 'chatrooms',   label: 'Chatrooms',             desc: 'Dhoma anonime të komunitetit',        enabled: true  },
    { id: 'journal',     label: 'Ditari',                desc: 'Shënimet personale me AI Reflect',    enabled: true  },
    { id: 'mood_track',  label: 'Gjurmimi i humorit',   desc: 'Grafiku dhe historia e humorit',      enabled: true  },
    { id: 'techniques',  label: 'Teknikat',              desc: 'Ushtrimet e shëndetit mendor',        enabled: true  },
    { id: 'blog',        label: 'Blogu',                 desc: 'Artikujt dhe ushtrimet interaktive',  enabled: true  },
    { id: 'breathing',   label: 'Widget frymëmarrje',   desc: 'Ushtrimet e frymëmarrjes së kutisë', enabled: true  },
    { id: 'premium',     label: 'Subscriptions',         desc: 'Abonimi Premium dhe pagesat',         enabled: true  },
    { id: 'anonymous',   label: 'Hyrje anonime',         desc: 'Lejo hyrjen pa regjistrim',           enabled: false },
    { id: 'google_auth', label: 'Google OAuth',          desc: 'Hyrja me llogari Google',             enabled: false },
  ],
  plans: [
    { id: 'free',    name: 'Free',    price: '0',    currency: '€', features: 'AI Chat i kufizuar, Ditari, Teknikat bazë' },
    { id: 'premium', name: 'Premium', price: '4.99', currency: '€', features: 'Gjithçka e lirë + AI pa limit, Analytics, Prioritet mbështetje' },
  ],
}

function load(key) {
  try { const v = localStorage.getItem(`ns_settings_${key}`); return v ? JSON.parse(v) : null } catch { return null }
}

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
          <Icon size={15} className="text-violet-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${enabled ? 'bg-violet-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export default function AdminSettings() {
  const [features, setFeatures] = useState(() => load('features') ?? DEFAULTS.features)
  const [plans,    setPlans]    = useState(() => load('plans')    ?? DEFAULTS.plans)
  const [accent,   setAccent]   = useState(() => load('accent')   ?? DEFAULTS.accent)
  const [general,  setGeneral]  = useState(() => load('general')  ?? DEFAULTS.general)
  const [security, setSecurity] = useState(() => load('security') ?? DEFAULTS.security)
  const [notif,    setNotif]    = useState(() => load('notif')    ?? DEFAULTS.notif)
  const [saved,    setSaved]    = useState(false)

  function toggleFeature(id) {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  function updatePlan(id, field, value) {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  function handleSave() {
    localStorage.setItem('ns_settings_features', JSON.stringify(features))
    localStorage.setItem('ns_settings_plans',    JSON.stringify(plans))
    localStorage.setItem('ns_settings_accent',   JSON.stringify(accent))
    localStorage.setItem('ns_settings_general',  JSON.stringify(general))
    localStorage.setItem('ns_settings_security', JSON.stringify(security))
    localStorage.setItem('ns_settings_notif',    JSON.stringify(notif))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleReset() {
    ['features','plans','accent','general','security','notif'].forEach(k => localStorage.removeItem(`ns_settings_${k}`))
    setFeatures(DEFAULTS.features)
    setPlans(DEFAULTS.plans)
    setAccent(DEFAULTS.accent)
    setGeneral(DEFAULTS.general)
    setSecurity(DEFAULTS.security)
    setNotif(DEFAULTS.notif)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Cilësimet</h1>
          <p className="text-gray-500 text-sm mt-0.5">Konfigurimi i sistemit · NeuroSpace</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
            <RotateCcw size={14} /> Rivendos
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${saved ? 'bg-green-500 text-white' : 'bg-violet-600 text-white hover:bg-violet-500'}`}>
            {saved ? <><CheckCircle size={14} /> Ruajtur!</> : <><Save size={14} /> Ruaj ndryshimet</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* General */}
        <SectionCard icon={Globe} title="Konfigurim i përgjithshëm" subtitle="Të dhënat bazë të platformës">
          <div className="space-y-4">
            {[
              { label: 'Emri i platformës',   key: 'siteName',        type: 'text'   },
              { label: 'Email mbështetja',     key: 'supportEmail',    type: 'email'  },
              { label: 'Maks. anëtarë/room',  key: 'maxUsersPerRoom', type: 'number' },
              { label: 'Session timeout (h)', key: 'sessionTimeout',  type: 'number' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
                <input type={type} value={general[key]}
                  onChange={e => setGeneral(g => ({ ...g, [key]: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300" />
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-semibold text-gray-700">Modaliteti i mirëmbajtjes</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Bllokon hyrjen e përdoruesve</p>
              </div>
              <Toggle enabled={general.maintenanceMode} onChange={v => setGeneral(g => ({ ...g, maintenanceMode: v }))} />
            </div>
          </div>
        </SectionCard>

        {/* Appearance */}
        <SectionCard icon={Palette} title="Pamja" subtitle="Ngjyra e theksit të ndërfaqes">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 mb-3">Ngjyra kryesore</p>
              <div className="flex flex-wrap gap-3">
                {ACCENT_COLORS.map(c => (
                  <button key={c.value} onClick={() => setAccent(c.value)} title={c.label}
                    className={`w-10 h-10 rounded-xl transition-all duration-150 ${accent === c.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                    style={{ background: c.value }} />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-8 h-8 rounded-lg" style={{ background: accent }} />
                <div>
                  <p className="text-sm font-bold text-gray-700">Ngjyra e zgjedhur</p>
                  <p className="text-xs text-gray-400 font-mono">{accent}</p>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-500 mb-3">Pamja paraprake e butonit</p>
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: accent }}>Buton kryesor</button>
                <button className="px-4 py-2 rounded-xl text-sm font-bold border-2" style={{ borderColor: accent, color: accent }}>Buton dytësor</button>
                <span className="px-3 py-1 rounded-full text-white text-xs font-bold flex items-center" style={{ background: accent }}>Badge</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Features */}
        <SectionCard icon={Zap} title="Funksionet e platformës" subtitle="Aktivizo ose çaktivizo funksionet">
          <div className="space-y-3">
            {features.map(f => (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-semibold text-gray-700">{f.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{f.desc}</p>
                </div>
                <Toggle enabled={f.enabled} onChange={() => toggleFeature(f.id)} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard icon={Lock} title="Siguria" subtitle="Konfigurimet e autentikimit">
          <div className="space-y-4">
            {[
              { label: 'Gjatësia min. e fjalëkalimit', key: 'passwordMinLength', type: 'number' },
              { label: 'Tentativa max. hyrjeje',       key: 'loginAttempts',     type: 'number' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
                <input type={type} value={security[key]}
                  onChange={e => setSecurity(s => ({ ...s, [key]: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-300" />
              </div>
            ))}
            {[
              { label: 'Autentikimi me dy faktorë (2FA)', key: 'twoFactor',          desc: 'Kërko TOTP për adminët'            },
              { label: 'Verifikimi i email-it',           key: 'requireEmailVerify', desc: 'Kërko verifikim pas regjistrimit'  },
            ].map(({ label, key, desc }) => (
              <div key={key} className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                </div>
                <Toggle enabled={security[key]} onChange={v => setSecurity(s => ({ ...s, [key]: v }))} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Plans */}
        <SectionCard icon={CreditCard} title="Planet e abonimit" subtitle="Çmimet dhe funksionet e planeve">
          <div className="space-y-4">
            {plans.map(plan => (
              <div key={plan.id} className={`p-4 rounded-xl border-2 ${plan.id === 'premium' ? 'border-violet-200 bg-violet-50/40' : 'border-gray-200 bg-gray-50/40'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${plan.id === 'premium' ? 'bg-violet-600' : 'bg-gray-400'}`} />
                  <p className="font-black text-gray-800">{plan.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Çmimi</label>
                    <div className="flex gap-1">
                      <input value={plan.currency} onChange={e => updatePlan(plan.id, 'currency', e.target.value)}
                        className="w-10 bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-violet-300" />
                      <input value={plan.price} onChange={e => updatePlan(plan.id, 'price', e.target.value)} type="text"
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-300" />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <span className="text-2xl font-black text-gray-800">{plan.currency}{plan.price}<span className="text-xs text-gray-400 font-medium">/muaj</span></span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Funksionet e përfshira</label>
                  <textarea value={plan.features} onChange={e => updatePlan(plan.id, 'features', e.target.value)}
                    rows={2} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-300 resize-none text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={Bell} title="Njoftimet" subtitle="Email-et automatike të sistemit">
          <div className="space-y-3">
            {[
              { key: 'emailOnSignup',  label: 'Regjistrim i ri',       desc: 'Email kur regjistrohet një user i ri' },
              { key: 'emailOnReport',  label: 'Mesazh i raportuar',     desc: 'Alert kur flaget një mesazh'          },
              { key: 'emailOnPremium', label: 'Abonament Premium i ri', desc: 'Konfirmim kur blihet premium'         },
              { key: 'digestWeekly',   label: 'Raport javor',           desc: 'Përmbledhje analytics çdo të hënë'   },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-semibold text-gray-700">{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                </div>
                <Toggle enabled={notif[key]} onChange={v => setNotif(n => ({ ...n, [key]: v }))} />
              </div>
            ))}
          </div>
        </SectionCard>

      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={15} className="text-red-500" />
          <h3 className="font-bold text-red-700 text-sm">Zona e rrezikshme</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              const keep = ['ns_user', 'ns_token']
              Object.keys(localStorage).filter(k => !keep.includes(k)).forEach(k => localStorage.removeItem(k))
              alert('Cache u pastrua me sukses! Faqja do rindërtojë të dhënat.')
            }}
            className="text-left p-4 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-100 transition-colors">
            <p className="font-bold text-sm">Pastro cache-in</p>
            <p className="text-xs mt-0.5 opacity-70">Fshi të gjitha të dhënat lokale (journal, mood, artikuj)</p>
          </button>
          <button
            onClick={() => {
              const backup = {}
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i)
                try { backup[k] = JSON.parse(localStorage.getItem(k)) } catch { backup[k] = localStorage.getItem(k) }
              }
              const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
              const url  = URL.createObjectURL(blob)
              const a    = document.createElement('a'); a.href = url; a.download = `neurospace_backup_${new Date().toISOString().slice(0,10)}.json`; a.click()
              URL.revokeObjectURL(url)
            }}
            className="text-left p-4 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-100 transition-colors">
            <p className="font-bold text-sm">Eksporto DB</p>
            <p className="text-xs mt-0.5 opacity-70">Shkarko backup JSON të të gjitha të dhënave</p>
          </button>
          <button onClick={handleReset}
            className="text-left p-4 rounded-xl border-2 bg-red-500 text-white border-red-500 hover:bg-red-600 transition-colors">
            <p className="font-bold text-sm">Resetim i plotë</p>
            <p className="text-xs mt-0.5 opacity-70">Rivendos të gjitha cilësimet në default</p>
          </button>
        </div>
      </div>
    </div>
  )
}
