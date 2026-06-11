import { AlertTriangle } from 'lucide-react'

/**
 * Shënim ligjor/etik i detyrueshëm:
 * NeuroSphera nuk diagnostikon dhe nuk zëvendëson specialistin.
 *
 * variant="light"  — për footer të bardhë/gri (PublicLayout)
 * variant="dark"   — për footer/sidebar me sfond të errët (Landing, Sidebar)
 * variant="inline" — banner i ngushtë brenda faqeve
 */
export default function MedicalDisclaimer({ variant = 'light' }) {
  if (variant === 'dark') {
    return (
      <div
        className="flex gap-3 items-start rounded-2xl p-4"
        style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)' }}
      >
        <AlertTriangle size={15} color="#fbbf24" className="shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(251,191,36,0.75)' }}>
          <span className="font-bold">Shënim i rëndësishëm:</span> NeuroSphera nuk ofron diagnozë
          mjekësore dhe nuk zëvendëson specialistin e shëndetit mendor. Çdo përmbajtje është
          vetëm informative. Nëse keni nevojë për ndihmë, drejtohuni tek një profesionist i licencuar.
        </p>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div
        className="mx-3 mb-2 rounded-xl p-3 flex gap-2 items-start"
        style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
      >
        <AlertTriangle size={11} color="#fbbf24" className="shrink-0 mt-0.5" />
        <p className="text-[9px] leading-relaxed" style={{ color: 'rgba(251,191,36,0.65)' }}>
          NeuroSphera nuk diagnostikon dhe nuk zëvendëson specialistin. Nëse ke nevojë, drejtoju
          tek një profesionist i shëndetit mendor.
        </p>
      </div>
    )
  }

  // variant="light" (default)
  return (
    <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-xl p-4">
      <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
      <p className="text-[11px] text-amber-900 leading-relaxed">
        <span className="font-bold">Shënim i rëndësishëm:</span> NeuroSphera nuk ofron diagnozë
        mjekësore dhe nuk zëvendëson konsultin me specialist të shëndetit mendor. Çdo përmbajtje
        është vetëm informative. Nëse keni nevojë për ndihmë, drejtohuni tek një profesionist i
        licencuar i shëndetit mendor ose thirrni numrin e emergjencës{' '}
        <span className="font-bold">112</span>.
      </p>
    </div>
  )
}
