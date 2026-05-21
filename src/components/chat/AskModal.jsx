import { useState } from 'react'
import { ModalOverlay } from './TechniqueModals'

export function AskModal({ onClose }) {
  const [msg,     setMsg]     = useState('')
  const [cat,     setCat]     = useState('')
  const [urgency, setUrgency] = useState('medium')
  const [anon,    setAnon]    = useState(false)
  const [sent,    setSent]    = useState(false)

  const cats = ['Ankth','Stres','Depresion','Marrëdhënie','Gjumë','Tjetër']

  function send() {
    if (!msg.trim() || !cat) return
    setSent(true)
  }

  return (
    <ModalOverlay onClose={onClose} wide>
      {sent ? (
        <div className="text-center">
          <div className="text-5xl mb-4">💌</div>
          <p className="text-base font-black text-white mb-2">Mesazhi u dërgua!</p>
          <p className="text-[12px] text-white/45 mb-6 leading-relaxed">
            Psikologu do t'ju përgjigjet brenda 24 orëve. Ju do të njoftoheni kur të keni përgjigje.
          </p>
          <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold text-white"
            style={{background:'rgba(139,92,246,0.25)',border:'1px solid rgba(139,92,246,0.4)'}}>Mbyll</button>
        </div>
      ) : (
        <>
          <p className="text-base font-black text-white mb-1">Pyet Psikologun</p>
          <p className="text-[11px] text-white/35 mb-5">Mesazhi juaj është konfidencial dhe i sigurt.</p>

          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Kategoria</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
                style={cat===c ? {background:'rgba(139,92,246,0.3)',border:'1px solid rgba(139,92,246,0.6)',color:'#c4b5fd'}
                               : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)'}}>
                {c}
              </button>
            ))}
          </div>

          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Urgjenca</p>
          <div className="flex gap-2 mb-5">
            {[['low','E ulët','#22c55e'],['medium','Mesatare','#fbbf24'],['high','E lartë','#ef4444']].map(([k,l,c]) => (
              <button key={k} onClick={() => setUrgency(k)}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all"
                style={urgency===k ? {background:`${c}20`,border:`1px solid ${c}60`,color:c}
                                   : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.35)'}}>
                {l}
              </button>
            ))}
          </div>

          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Mesazhi</p>
          <textarea value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Shkruani çfarë ndiheni ose çfarë dëshironi të diskutoni..."
            className="w-full rounded-2xl p-4 text-[13px] text-white/80 placeholder-white/20 outline-none resize-none mb-4"
            style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',minHeight:100}}
            rows={4}/>

          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <div onClick={() => setAnon(v=>!v)}
              className="w-10 h-6 rounded-full relative transition-colors"
              style={{background: anon ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{left: anon ? 22 : 4}}/>
            </div>
            <span className="text-[12px] text-white/55">Dërgoje anonim</span>
          </label>

          <button disabled={!msg.trim() || !cat} onClick={send}
            className="w-full py-3 rounded-2xl font-bold text-[13px] text-white disabled:opacity-30 transition-all"
            style={{background:'linear-gradient(135deg,rgba(124,58,237,0.45),rgba(79,70,229,0.45))',border:'1px solid rgba(139,92,246,0.5)'}}>
            Dërgo mesazhin →
          </button>
        </>
      )}
    </ModalOverlay>
  )
}
