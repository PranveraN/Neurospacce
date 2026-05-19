import { useState } from 'react'
import { MessageSquare, Plus, Trash2, Shield, Users, Eye, EyeOff, AlertTriangle, X, Save } from 'lucide-react'

const INITIAL_ROOMS = [
  { id: 'anxiety',    name: 'Ankth & Frika',    emoji: '😰', members: 234, messages: 1820, status: 'active',   moderated: true,  created: '2026-01-15' },
  { id: 'school',     name: 'Shkollë & Presion', emoji: '📚', members: 189, messages: 934,  status: 'active',   moderated: true,  created: '2026-01-20' },
  { id: 'confidence', name: 'Vetëbesim',         emoji: '⭐', members: 156, messages: 612,  status: 'inactive', moderated: false, created: '2026-02-01' },
  { id: 'sleep',      name: 'Gjumë & Lodhje',   emoji: '🌙', members: 98,  messages: 287,  status: 'inactive', moderated: false, created: '2026-02-10' },
  { id: 'grief',      name: 'Humbja & Zi',       emoji: '🕊️', members: 67,  messages: 198,  status: 'inactive', moderated: true,  created: '2026-03-01' },
]

const FLAGGED_MESSAGES = [
  { id: 1, room: 'anxiety', user: 'Anonim_442', text: 'Ndihem pa shpresë dhe mendoj...',  time: '10:24', severity: 'high'   },
  { id: 2, room: 'school',  user: 'Anonim_118', text: 'Jam i lodhur nga gjithçka dhe...', time: '14:51', severity: 'medium' },
  { id: 3, room: 'anxiety', user: 'Anonim_089', text: 'Nuk di si ta kaloj ditën...',       time: '16:02', severity: 'low'    },
]

const SEV = {
  high:   { bg: 'bg-red-100',    text: 'text-red-600',    label: 'I lartë'  },
  medium: { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Mesatar'  },
  low:    { bg: 'bg-blue-100',   text: 'text-blue-600',   label: 'I ulët'   },
}

function NewRoomModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', emoji: '💬', description: '' })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-800">Chatroom i ri</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400"><X size={14}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="w-20">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Emoji</label>
              <input value={form.emoji} onChange={e => setForm(f=>({...f,emoji:e.target.value}))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xl text-center focus:outline-none focus:border-violet-300" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Emri *</label>
              <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                placeholder="Emri i chatroom-it"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-300" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Përshkrimi</label>
            <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}
              rows={3} placeholder="Çfarë diskutohet në këtë room?"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-300 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm">Anulo</button>
          <button onClick={() => { if(form.name.trim()) { onSave(form); onClose() }}}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm flex items-center justify-center gap-2">
            <Save size={14}/> Krijo
          </button>
        </div>
      </div>
    </div>
  )
}

function loadRooms() {
  try { const v = localStorage.getItem('ns_rooms'); return v ? JSON.parse(v) : INITIAL_ROOMS } catch { return INITIAL_ROOMS }
}
function saveRooms(data) {
  try { localStorage.setItem('ns_rooms', JSON.stringify(data)) } catch {}
}
function loadFlags() {
  try { const v = localStorage.getItem('ns_flags'); return v ? JSON.parse(v) : FLAGGED_MESSAGES } catch { return FLAGGED_MESSAGES }
}
function saveFlags(data) {
  try { localStorage.setItem('ns_flags', JSON.stringify(data)) } catch {}
}

export default function AdminChatrooms() {
  const [rooms, setRoomsRaw]  = useState(loadRooms)
  const [flags, setFlagsRaw]  = useState(loadFlags)
  const [showModal, setModal] = useState(false)

  function setRooms(updater) {
    setRoomsRaw(prev => { const next = typeof updater === 'function' ? updater(prev) : updater; saveRooms(next); return next })
  }
  function setFlags(updater) {
    setFlagsRaw(prev => { const next = typeof updater === 'function' ? updater(prev) : updater; saveFlags(next); return next })
  }

  function toggleStatus(id) {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r))
  }
  function deleteRoom(id) { setRooms(prev => prev.filter(r => r.id !== id)) }
  function dismissFlag(id) { setFlags(prev => prev.filter(f => f.id !== id)) }
  function addRoom(form) {
    setRooms(prev => [...prev, { ...form, id: Date.now().toString(), members: 0, messages: 0, status: 'active', moderated: true, created: new Date().toISOString().slice(0,10) }])
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {showModal && <NewRoomModal onSave={addRoom} onClose={() => setModal(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Chatrooms</h1>
          <p className="text-gray-500 text-sm">{rooms.length} rooms gjithsej</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500">
          <Plus size={15}/> Room i ri
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Aktive',         value: rooms.filter(r=>r.status==='active').length,   color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Anëtarë',  value: rooms.reduce((a,b)=>a+b.members,0),            color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Raportuar',      value: flags.length,                                  color: 'text-red-600',   bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Flagged messages */}
      {flags.length > 0 && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-red-50 bg-red-50/50">
            <AlertTriangle size={15} className="text-red-500" />
            <h3 className="font-bold text-red-700 text-sm">Mesazhe të raportuar ({flags.length})</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {flags.map(f => {
              const sev = SEV[f.severity]
              return (
                <div key={f.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${f.severity === 'high' ? 'bg-red-500' : f.severity === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">"{f.text}"</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{f.user} · #{f.room} · {f.time}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${sev.bg} ${sev.text}`}>{sev.label}</span>
                  <div className="flex gap-1 shrink-0">
                    <button className="text-xs font-bold text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors">Fshi</button>
                    <button onClick={() => dismissFlag(f.id)} className="text-xs font-bold text-gray-400 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-colors">Shpërfill</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Rooms table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <MessageSquare size={15} className="text-violet-600" />
          <h3 className="font-bold text-gray-800">Të gjitha chatrooms</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {rooms.map(r => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                  {r.moderated && (
                    <span className="text-[9px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Shield size={8}/> AI Mod
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1"><Users size={9}/> {r.members}</span>
                  <span className="text-[10px] text-gray-400">{r.messages} mesazhe</span>
                  <span className="text-[10px] text-gray-400">Krijuar {r.created}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {r.status === 'active' ? 'Aktiv' : 'Joaktiv'}
              </span>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggleStatus(r.id)}
                  className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-green-500 transition-colors">
                  {r.status === 'active' ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
                <button onClick={() => deleteRoom(r.id)}
                  className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
