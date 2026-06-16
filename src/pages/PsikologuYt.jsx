import { Clock, Bell } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'

export default function PsikologuYt() {
  return (
    <PublicLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-5 py-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7c3aed22,#6d28d922)', border: '1px solid #7c3aed33' }}>
            <Clock size={36} className="text-violet-500" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{ background: '#7c3aed15', color: '#7c3aed' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Në zhvillim
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-3 leading-tight">
            Psikologu yt vjen shpejt
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            Jemi duke punuar për të sjellë psikologë të licencuar dhe mundësi rezervimi direkt në platformë.
            Do të njoftoheni sapo të jetë gati.
          </p>

          <a
            href="mailto:psikolog@NeuroSphera.com?subject=Njoftomë kur të jetë gati"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
            <Bell size={15} />
            Njoftomë kur të jetë gati
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}
