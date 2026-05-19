import { useState, useRef, useEffect } from 'react'
import { Brain, Upload } from 'lucide-react'

const LS_KEY = 'ns_custom_logo'

export function useCustomLogo() {
  const [src, setSrc] = useState(() => {
    try { return localStorage.getItem(LS_KEY) || null } catch { return null }
  })

  function saveLogo(dataUrl) {
    try { localStorage.setItem(LS_KEY, dataUrl) } catch {}
    setSrc(dataUrl)
    window.dispatchEvent(new CustomEvent('ns_logo_changed', { detail: dataUrl }))
  }

  useEffect(() => {
    const handler = e => setSrc(e.detail)
    window.addEventListener('ns_logo_changed', handler)
    return () => window.removeEventListener('ns_logo_changed', handler)
  }, [])

  return { src, saveLogo }
}

// Always uploadable — click the logo icon to replace it.
// Pass stopLink={true} when the component lives inside a <Link> so the
// click on the icon doesn't trigger navigation.
export default function LogoMark({ size = 36, radius = 'rounded-xl', stopLink = false }) {
  const { src, saveLogo } = useCustomLogo()
  const inputRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => saveLogo(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleClick(e) {
    if (stopLink) e.preventDefault()
    inputRef.current?.click()
  }

  return (
    <div
      className={`relative shrink-0 ${radius} overflow-hidden`}
      style={{ width: size, height: size, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      title="Kliko për të ngarkuar logo"
    >
      {src ? (
        <img src={src} alt="Logo" className="w-full h-full object-contain"/>
      ) : (
        <div className="w-full h-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: `0 0 ${size / 2}px rgba(124,58,237,0.45)` }}>
          <Brain size={Math.round(size * 0.5)} color="white" strokeWidth={2}/>
        </div>
      )}

      {hovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
          style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(2px)' }}>
          <Upload size={Math.round(size * 0.33)} color="white"/>
          <span style={{ fontSize: Math.round(size * 0.19), color: 'white', fontWeight: 700, lineHeight: 1 }}>Ngarko</span>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
    </div>
  )
}
