import { useState, useEffect } from 'react'
import { Search, Shield, Trash2, Ban, CheckCircle, MoreVertical, Filter, Download, UserPlus, X, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const ROLE_STYLES = {
  admin:     { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Admin'      },
  moderator: { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Moderator'  },
  user:      { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'User'       },
}
const STATUS_STYLES = {
  active:  { dot: 'bg-green-500', text: 'text-green-600', label: 'Aktiv'    },
  blocked: { dot: 'bg-red-500',   text: 'text-red-500',   label: 'Bllokuar' },
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <p className="font-bold text-gray-800 mb-4">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
            Anulo
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600">
            Konfirmo
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionMenu({ user, onBlock, onUnblock, onDelete, onChangeRole }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
        <MoreVertical size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 animate-fade-in">
            {user.status === 'active'
              ? (
                <button onClick={() => { onBlock(user.id); setOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <Ban size={14} /> Blloko llogarinë
                </button>
              ) : (
                <button onClick={() => { onUnblock(user.id); setOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors">
                  <CheckCircle size={14} /> Zhblloko
                </button>
              )
            }
            <button onClick={() => { onChangeRole(user.id, user.role === 'user' ? 'moderator' : 'user'); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
              <Shield size={14} /> {user.role === 'user' ? 'Bëj Moderator' : 'Hiq rolin'}
            </button>
            <div className="h-px bg-gray-100 my-1" />
            <button onClick={() => { onDelete(user.id); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={14} /> Fshij llogarinë
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const PAGE_SIZE = 5

function exportCSV(users) {
  const headers = ['ID', 'Email', 'Username', 'Role', 'Plan', 'Status', 'CreatedAt']
  const rows    = users.map(u => [u.id, u.email, u.username || '', u.role, u.plan, u.status, u.createdAt])
  const csv     = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob    = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url     = URL.createObjectURL(blob)
  const a       = document.createElement('a'); a.href = url; a.download = 'NeuroSphera_users.csv'; a.click()
  URL.revokeObjectURL(url)
}

function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ email: '', username: '', role: 'user', plan: 'free' })
  const [err, setErr]   = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function submit() {
    if (!form.email.trim()) { setErr('Email është i detyrueshëm'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Email i pavlefshëm'); return }
    onAdd({ ...form, id: `u_${Date.now()}`, status: 'active', createdAt: new Date().toISOString().slice(0,10), lastLogin: '—', moodEntries: 0, journalEntries: 0 })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-800">Shto user të ri</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
            <X size={14} />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Email *</label>
            <input value={form.email} onChange={e => { set('email', e.target.value); setErr('') }}
              placeholder="email@shembull.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-300" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Username</label>
            <input value={form.username} onChange={e => set('username', e.target.value)}
              placeholder="user123"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Roli</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-300">
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Plani</label>
              <select value={form.plan} onChange={e => set('plan', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-300">
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
          {err && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          <button onClick={submit}
            className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-500 transition-colors">
            Shto llogarinë
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const { allUsers, fetchAllUsers, deleteUser, blockUser, unblockUser, changeRole } = useAuth()
  const [search, setSearch]       = useState('')
  const [roleFilter, setRole]     = useState('all')
  const [statusFilter, setStatus] = useState('all')
  const [confirm, setConfirm]     = useState(null)
  const [selected, setSelected]   = useState([])
  const [page, setPage]           = useState(1)
  const [showAddUser, setShowAddUser] = useState(false)
  const [localExtra, setLocalExtra]   = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    setLoadingUsers(true)
    fetchAllUsers().finally(() => setLoadingUsers(false))
  }, [fetchAllUsers])

  const allCombined = [...allUsers, ...localExtra]

  const filtered = allCombined.filter(u => {
    const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleDelete(id) {
    setConfirm({ message: 'Jeni i sigurt se doni të fshini këtë llogari?', onConfirm: () => { deleteUser(id); setLocalExtra(p => p.filter(u => u.id !== id)); setConfirm(null) } })
  }
  function toggleSelect(id) {
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }
  function handleAddUser(newUser) {
    setLocalExtra(p => [...p, newUser])
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onAdd={handleAddUser} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Përdoruesit</h1>
          <p className="text-gray-500 text-sm">{allCombined.length} llogari gjithsej</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Download size={14} /> Eksporto CSV
          </button>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 transition-colors">
            <UserPlus size={14} /> Shto user
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Kërko sipas email ose username..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-300 transition-colors bg-gray-50"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="relative">
          <select value={roleFilter} onChange={e => setRole(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-300 bg-gray-50 text-gray-700 font-semibold">
            <option value="all">Të gjitha rolet</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-300 bg-gray-50 text-gray-700 font-semibold">
            <option value="all">Të gjitha</option>
            <option value="active">Aktiv</option>
            <option value="blocked">Bllokuar</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: allUsers.length,                             color: 'text-gray-800' },
          { label: 'Aktivë',    value: allUsers.filter(u=>u.status==='active').length,  color: 'text-green-600' },
          { label: 'Bllokuar',  value: allUsers.filter(u=>u.status==='blocked').length, color: 'text-red-500'   },
          { label: 'Premium',   value: allUsers.filter(u=>u.plan==='premium').length,   color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="w-10 py-3 px-4">
                <input type="checkbox" className="rounded" onChange={e => setSelected(e.target.checked ? filtered.map(u=>u.id) : [])} />
              </th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-3 px-3">Përdoruesi</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-3 px-3 hidden sm:table-cell">Roli</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-3 px-3 hidden md:table-cell">Plani</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-3 px-3">Statusi</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-3 px-3 hidden lg:table-cell">Regjistruar</th>
              <th className="w-12 py-3 px-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loadingUsers ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                  Asnjë rezultat nuk u gjet
                </td>
              </tr>
            ) : paginated.map(u => {
              const role   = ROLE_STYLES[u.role] || ROLE_STYLES.user
              const status = STATUS_STYLES[u.status] || STATUS_STYLES.active
              return (
                <tr key={u.id} className={`hover:bg-gray-50/60 transition-colors ${selected.includes(u.id) ? 'bg-violet-50/40' : ''}`}>
                  <td className="py-3 px-4">
                    <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} className="rounded" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-black shrink-0">
                        {u.username?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{u.username || '—'}</p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 hidden sm:table-cell">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${role.bg} ${role.text}`}>
                      {role.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.plan === 'premium' ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-400">{u.createdAt}</span>
                  </td>
                  <td className="py-3 px-3">
                    <ActionMenu user={u}
                      onBlock={blockUser} onUnblock={unblockUser}
                      onDelete={handleDelete} onChangeRole={changeRole}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {filtered.length === 0 ? '0' : `${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE, filtered.length)}`} nga {filtered.length}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${p === page ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
