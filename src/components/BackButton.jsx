import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

/**
 * Returns true when React Router has a previous entry in the SPA history.
 * window.history.state?.idx is set by React Router v6 — idx 0 means the
 * user landed directly on this page (no SPA back-entry exists).
 */
function hasSPAHistory() {
  try {
    return (window.history.state?.idx ?? 0) > 0
  } catch {
    return false
  }
}

export function goBack(navigate, fallback = '/') {
  if (hasSPAHistory()) {
    navigate(-1)
  } else {
    navigate(fallback, { replace: true })
  }
}

export default function BackButton({ fallback = '/', label = 'Kthehu mbrapa' }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => goBack(navigate, fallback)}
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors group mb-4"
    >
      <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-violet-300 group-hover:bg-violet-50 transition-all">
        <ChevronLeft size={15} />
      </div>
      {label}
    </button>
  )
}
