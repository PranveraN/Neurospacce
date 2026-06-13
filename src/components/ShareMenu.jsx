import { useState, useRef, useEffect } from 'react'
import { Share2, Copy, Check, ExternalLink } from 'lucide-react'

const PLATFORMS = [
  {
    id: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    getUrl: (url, title) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title || '')}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    getUrl: (url, title) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: 'viber',
    label: 'Viber',
    color: '#7360F2',
    getUrl: (url, title) =>
      `viber://forward?text=${encodeURIComponent(`${title}\n${url}`)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
        <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.625 9.82c-.067 3.121-.14 8.972 5.52 10.566h.005l-.004 2.42s-.038.997.625 1.199c.803.247 1.272-.511 2.038-1.33.42-.453.999-1.119 1.436-1.622 3.955.33 6.995-.424 7.34-.538.798-.257 5.314-.834 6.048-6.802.757-6.15-.369-10.037-2.982-11.784l-.001-.001c-.769-.558-3.392-1.56-8.252-1.526zM11.455 2c4.29-.028 6.68.874 7.318 1.337 2.149 1.44 3.054 4.745 2.39 10.054-.62 5.076-4.228 5.407-4.895 5.62-.292.094-3.013.769-6.488.544 0 0-2.572 3.09-3.374 3.899-.126.129-.273.18-.371.157-.138-.032-.176-.19-.174-.42l.021-3.828C4.72 17.78 1.47 16.573 1.525 9.88c.06-2.748.564-4.89 2.013-6.333C5.605 1.937 9.134 2.024 11.455 2zm.23 3.36c-.362-.002-.362.553 0 .555 3.024.017 5.51 2.237 5.53 6.022.001.362.557.36.555 0-.023-4.07-2.773-6.559-6.085-6.577zm-3.07.94c-.307-.085-.606.098-.7.374-.93 2.732-.162 5.28 1.665 7.188.069.071.161.123.262.134.41.047.772-.49.447-.836-1.624-1.694-2.297-3.901-1.476-6.286.083-.25-.066-.505-.198-.574zm3.29 1.145c-.358-.022-.39.531-.034.554 1.545.097 2.43 1.055 2.43 2.628 0 .36.554.36.554 0 0-1.875-1.149-3.099-2.95-3.182zm-1.52.865c-.208.163-.239.476-.088.699.647.952.644 1.834-.004 2.748-.252.351.168.748.506.502.823-1.09.832-2.259.05-3.414a.53.53 0 00-.464-.535zm1.663.86c-.36-.011-.391.54-.034.553a.682.682 0 01.697.749c-.05.361.504.452.553.09.087-.636-.476-1.378-1.216-1.392z"/>
      </svg>
    ),
  },
]

export default function ShareMenu({ title, url, className = '' }) {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || (typeof document !== 'undefined' ? document.title : '')

  // Web Share API — available on iOS Safari, Android Chrome, etc.
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // On mobile: native share sheet (includes Facebook natively, works 100%)
  // On desktop: open dropdown with platform buttons
  async function handleMainClick() {
    if (canNativeShare) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl })
      } catch (e) {
        if (e.name !== 'AbortError') setOpen(v => !v)
      }
    } else {
      setOpen(v => !v)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const el = document.createElement('textarea')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={handleMainClick}
        className="flex items-center gap-1.5 text-gray-400 hover:text-violet-600 transition-colors"
      >
        <Share2 size={14} /> Ndaj
      </button>

      {/* Desktop fallback dropdown — only shown when Web Share API is unavailable */}
      {!canNativeShare && open && (
        <div
          className="absolute z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 w-52"
          style={{ animation: 'fadeSlideDown .15s ease', top: 'calc(100% + 8px)', right: 0 }}
        >
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">
            Shpërndaje në
          </p>

          <div className="space-y-1">
            {PLATFORMS.map(p => (
              <a
                key={p.id}
                href={p.getUrl(shareUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `${p.color}18`, color: p.color }}
                >
                  {p.icon}
                </span>
                <span className="text-sm font-semibold text-gray-700">{p.label}</span>
              </a>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group"
            >
              <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 text-gray-500 transition-transform group-hover:scale-110">
                {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {copied ? 'U kopjua!' : 'Kopjo linkun'}
              </span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
