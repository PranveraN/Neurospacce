import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, CheckCircle } from 'lucide-react'
import { ModalOverlay } from './TechniqueModals'
import { loadExperts } from '../../data/expertsData'
import { BOOK_CATEGORIES, TIME_SLOTS } from '../../data/aiChatData'

export function BookingModal({ onClose }) {
  const [step,      setStep]  = useState(0)
  const [cat,       setCat]   = useState('')
  const [expert,    setExpert]= useState(null)
  const [date,      setDate]  = useState('')
  const [time,      setTime]  = useState('')
  const [confirmed, setConf]  = useState(false)

  const experts3 = loadExperts().slice(0, 3)

  const days = Array.from({length:7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1)
    return { iso: d.toISOString().slice(0,10), label: d.toLocaleDateString('sq-AL',{weekday:'short',day:'numeric',month:'short'}) }
  })

  function confirm() {
    setConf(true)
    try {
      const arr = JSON.parse(localStorage.getItem('ns_appointments') || '[]')
      arr.push({ id: Date.now(), expertId: expert?.id, category: cat, date, time, status:'pending', createdAt: new Date().toISOString() })
      localStorage.setItem('ns_appointments', JSON.stringify(arr))
    } catch {}
  }

  return (
    <ModalOverlay onClose={onClose} wide>
      {confirmed ? (
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-lg font-black text-white mb-2">Takimi u rezervua!</p>
          <p className="text-[13px] text-white/50 mb-2">{expert?.name}</p>
          <p className="text-[13px] text-white/50 mb-6">{date} · {time}</p>
          <p className="text-[11px] text-white/30 mb-6 leading-relaxed">
            Do të merrni konfirmim brenda 24 orëve. Psikologu do t'ju kontaktojë para takimit.
          </p>
          <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold text-[13px] text-white"
            style={{background:'rgba(139,92,246,0.25)',border:'1px solid rgba(139,92,246,0.5)'}}>
            Mbyll
          </button>
        </div>
      ) : (
        <>
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            {['Çështja','Psikologu','Data','Ora'].map((s,i) => (
              <div key={i} className="flex items-center gap-1.5 flex-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 transition-all"
                  style={i <= step ? {background:'#8b5cf6',color:'#fff'} : {background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.3)'}}>
                  {i < step ? '✓' : i+1}
                </div>
                <span className="text-[10px] font-semibold transition-all" style={{color: i <= step ? '#c4b5fd' : 'rgba(255,255,255,0.2)'}}>
                  {s}
                </span>
                {i < 3 && <div className="flex-1 h-px" style={{background: i < step ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}}/>}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <p className="text-base font-black text-white mb-4">Çfarë ke nevojë të trajtosh?</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {BOOK_CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCat(c)}
                      className="p-3 rounded-2xl text-[13px] font-bold text-left transition-all"
                      style={cat===c ? {background:'rgba(139,92,246,0.25)',border:'1px solid rgba(139,92,246,0.5)',color:'#c4b5fd'}
                                     : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.55)'}}>
                      {c}
                    </button>
                  ))}
                </div>
                <button disabled={!cat} onClick={() => setStep(1)}
                  className="w-full py-3 rounded-2xl font-bold text-[13px] text-white transition-all disabled:opacity-30"
                  style={{background:'rgba(139,92,246,0.25)',border:'1px solid rgba(139,92,246,0.4)'}}>
                  Vazhdo →
                </button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <p className="text-base font-black text-white mb-4">Zgjidh psikologun</p>
                <div className="space-y-3 mb-6">
                  {experts3.map(ex => (
                    <button key={ex.id} onClick={() => setExpert(ex)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all"
                      style={expert?.id===ex.id ? {background:'rgba(139,92,246,0.2)',border:'1px solid rgba(139,92,246,0.5)'}
                                                 : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                      <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-xl font-black text-white"
                        style={{background: ex.avatarGrad || 'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
                        {ex.name[3]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-white truncate">{ex.name}</p>
                        <p className="text-[10px] text-white/45 truncate">{ex.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={9} className="text-amber-400" fill="#fbbf24"/>
                          <span className="text-[10px] text-amber-400 font-bold">{ex.rating}</span>
                          <span className="text-[9px] text-white/25 ml-1">{ex.responseTime}</span>
                        </div>
                      </div>
                      {expert?.id===ex.id && <CheckCircle size={16} className="text-violet-400 shrink-0"/>}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(0)} className="py-3 px-5 rounded-2xl text-[13px] font-bold text-white/40 hover:text-white transition-colors"
                    style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>← Kthehu</button>
                  <button disabled={!expert} onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-2xl font-bold text-[13px] text-white transition-all disabled:opacity-30"
                    style={{background:'rgba(139,92,246,0.25)',border:'1px solid rgba(139,92,246,0.4)'}}>Vazhdo →</button>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <p className="text-base font-black text-white mb-4">Zgjidh datën</p>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {days.map(d => (
                    <button key={d.iso} onClick={() => setDate(d.iso)}
                      className="p-2.5 rounded-2xl text-center transition-all"
                      style={date===d.iso ? {background:'rgba(139,92,246,0.25)',border:'1px solid rgba(139,92,246,0.5)'}
                                          : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                      <p className="text-[11px] font-bold text-white">{d.label.split(' ')[0]}</p>
                      <p className="text-[10px] text-white/45">{d.label.split(' ').slice(1).join(' ')}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="py-3 px-5 rounded-2xl text-[13px] font-bold text-white/40"
                    style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>← Kthehu</button>
                  <button disabled={!date} onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-2xl font-bold text-[13px] text-white disabled:opacity-30"
                    style={{background:'rgba(139,92,246,0.25)',border:'1px solid rgba(139,92,246,0.4)'}}>Vazhdo →</button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <p className="text-base font-black text-white mb-4">Zgjidh orën</p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {TIME_SLOTS.map(s => (
                    <button key={s} onClick={() => setTime(s)}
                      className="py-3 rounded-2xl font-bold text-[13px] transition-all"
                      style={time===s ? {background:'rgba(139,92,246,0.25)',border:'1px solid rgba(139,92,246,0.5)',color:'#c4b5fd'}
                                      : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.55)'}}>
                      {s}
                    </button>
                  ))}
                </div>
                {date && time && (
                  <div className="p-3 rounded-2xl mb-5" style={{background:'rgba(139,92,246,0.1)',border:'1px solid rgba(139,92,246,0.2)'}}>
                    <p className="text-[11px] text-white/60 font-medium">{expert?.name} · {cat}</p>
                    <p className="text-[13px] font-bold text-white mt-0.5">{date} ora {time}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="py-3 px-5 rounded-2xl text-[13px] font-bold text-white/40"
                    style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>← Kthehu</button>
                  <button disabled={!time} onClick={confirm}
                    className="flex-1 py-3 rounded-2xl font-bold text-[13px] text-white disabled:opacity-30"
                    style={{background:'linear-gradient(135deg,rgba(124,58,237,0.5),rgba(79,70,229,0.5))',border:'1px solid rgba(139,92,246,0.5)'}}>
                    ✓ Konfirmo takimin
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </ModalOverlay>
  )
}
