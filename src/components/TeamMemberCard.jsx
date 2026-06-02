import { useState, useRef, useEffect } from 'react'
import { Camera } from 'lucide-react'
import { useEditMode } from '../contexts/EditModeContext'
import { useAuth } from '../contexts/AuthContext'
import EditableText from './EditableText'

const LS_PREFIX = 'ns_team_photo_'

export default function TeamMemberCard({ index, initials, name, role, grad, size = 'lg' }) {
  const { editMode, dbTexts, saveToDb } = useEditMode()
  const { isAdmin } = useAuth()
  const photoId = `team-photo-${index}`

  const [photo, setPhoto] = useState(() => {
    try { return localStorage.getItem(`${LS_PREFIX}${index}`) || null } catch { return null }
  })
  const fileRef = useRef(null)

  // Sync from Supabase once dbTexts loads
  useEffect(() => {
    const dbPhoto = dbTexts?.[photoId]?.sq
    if (dbPhoto && dbPhoto.startsWith('data:')) {
      setPhoto(dbPhoto)
      try { localStorage.setItem(`${LS_PREFIX}${index}`, dbPhoto) } catch {}
    } else if (dbPhoto === '') {
      // Explicitly cleared
      setPhoto(null)
      try { localStorage.removeItem(`${LS_PREFIX}${index}`) } catch {}
    }
  }, [dbTexts, photoId, index])

  function handleFile(e) {
    if (!isAdmin) return
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const b64 = ev.target.result
      setPhoto(b64)
      // Save to localStorage as fast cache
      try { localStorage.setItem(`${LS_PREFIX}${index}`, b64) } catch {}
      // Save to Supabase for permanent persistence across devices/deployments
      saveToDb(photoId, 'sq', b64)
    }
    reader.readAsDataURL(file)
  }

  function removePhoto() {
    setPhoto(null)
    try { localStorage.removeItem(`${LS_PREFIX}${index}`) } catch {}
    saveToDb(photoId, 'sq', '')
  }

  const dim  = size === 'sm' ? 'w-14 h-14' : 'w-20 h-20'
  const text = size === 'sm' ? 'text-base' : 'text-xl'
  const canEditPhoto = editMode && isAdmin

  return (
    <div className="text-center">
      <div className={`relative ${dim} mx-auto mb-4`}>
        <div className={`${dim} rounded-2xl overflow-hidden flex items-center justify-center`}
          style={!photo ? { background: grad } : {}}>
          {photo
            ? <img src={photo} alt={name} loading="lazy" className="w-full h-full object-cover"/>
            : <span className={`${text} font-black text-white/60`}>{initials}</span>
          }
        </div>
        {canEditPhoto && (
          <>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shadow-lg hover:bg-violet-700 transition-colors z-10"
              title="Ngarko foto">
              <Camera size={12} color="white"/>
            </button>
            {photo && (
              <button
                onClick={removePhoto}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow text-white text-[10px] font-black z-10 hover:bg-red-600 transition-colors"
                title="Hiq foton">✕</button>
            )}
          </>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
      </div>
      <EditableText id={`team-name-${index}`} as="p" className="font-black text-gray-900">{name}</EditableText>
      <EditableText id={`team-role-${index}`} as="p" className="text-sm text-gray-500 mt-0.5">{role}</EditableText>
    </div>
  )
}
