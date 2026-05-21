import { Pencil, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useEditMode } from '../contexts/EditModeContext'
import { useAuth } from '../contexts/AuthContext'

export default function EditModeToggle() {
  const { isAdmin } = useAuth()
  const { editMode, toggle, flashVisible, syncState } = useEditMode()

  if (!isAdmin) return null

  return (
    <>
      {/* Saved toast */}
      <div
        className={`fixed bottom-20 right-5 z-[400] pointer-events-none transition-all duration-300 ${
          flashVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="flex items-center gap-2 bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl">
          <CheckCircle size={14} />
          Ruajtur
        </div>
      </div>

      {/* Toggle button — desktop only (admins edit on desktop) */}
      <button
        onClick={toggle}
        title={editMode ? 'Dil nga mënyra e redaktimit' : 'Redakto tekstet e faqes'}
        className={`hidden md:flex fixed bottom-5 right-5 z-[400] items-center gap-2 px-4 py-2.5 rounded-full shadow-lg font-bold text-sm transition-all duration-200 border ${
          editMode
            ? 'bg-violet-600 text-white border-violet-500 hover:bg-violet-500 shadow-violet-200'
            : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600 hover:shadow-md'
        }`}
      >
        {editMode
          ? <><X size={14} /> Dil nga redaktimi</>
          : <><Pencil size={14} /> Redakto faqen</>
        }
        {syncState === 'saving' && <Loader2 size={11} className="animate-spin opacity-60" />}
        {syncState === 'saved'  && <CheckCircle size={11} className="text-emerald-400" />}
        {syncState === 'error'  && <AlertCircle size={11} className="text-red-400" />}
      </button>
    </>
  )
}
