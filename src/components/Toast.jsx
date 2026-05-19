import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

// ── Context ───────────────────────────────────────────────────────────────────
const ToastCtx = createContext(null)

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const toast = useCallback((message, type = 'error') => {
    const id = ++counter.current
    setToasts(t => [...t.slice(-2), { id, message, type }])
    setTimeout(() => dismiss(id), 3500)
  }, [dismiss])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss}/>
    </ToastCtx.Provider>
  )
}

// ── Styles per type ───────────────────────────────────────────────────────────
const STYLES = {
  error:   { icon: AlertCircle,   color: '#f87171', bg: 'rgba(239,68,68,0.14)',   border: 'rgba(239,68,68,0.35)'   },
  success: { icon: CheckCircle,   color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'   },
  info:    { icon: Info,          color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)'   },
}

// ── Toast item ────────────────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }) {
  const { color, bg, border, icon: Icon } = STYLES[toast.type] || STYLES.error
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      role="alert"
      onClick={() => onDismiss(toast.id)}
      className="flex items-start gap-3 px-4 py-3 rounded-2xl cursor-pointer select-none"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: 240,
        maxWidth: 340,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
      }}>
      <Icon size={15} style={{ color, flexShrink: 0, marginTop: 1 }}/>
      <p className="text-sm font-semibold flex-1 leading-snug" style={{ color: 'rgba(255,255,255,0.88)' }}>
        {toast.message}
      </p>
      <X size={12} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 2 }}/>
    </div>
  )
}

// ── Toaster container ─────────────────────────────────────────────────────────
function Toaster({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div
      className="fixed z-[9999] flex flex-col gap-2"
      style={{ bottom: 24, right: 16, left: 16, alignItems: 'flex-end', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={onDismiss}/>
        </div>
      ))}
    </div>
  )
}
