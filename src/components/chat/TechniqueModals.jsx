import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { TECHNIQUES } from '../../data/aiChatData'

const MOD = {
  background: 'rgba(10,5,30,0.97)',
  border: '1px solid rgba(139,92,246,0.25)',
  borderRadius: 28,
  backdropFilter: 'blur(20px)',
}

export function ModalOverlay({ children, onClose, wide }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-6"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}
        style={{background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)'}}/>
      <motion.div className="relative w-full p-6 overflow-y-auto"
        style={{...MOD, maxWidth: wide ? 500 : 400, maxHeight:'90vh'}}
        initial={{y:30,scale:0.96}} animate={{y:0,scale:1}} exit={{y:20,opacity:0}}>
        <button onClick={onClose} aria-label="Mbyll"
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-colors"
          style={{background:'rgba(255,255,255,0.06)'}}>
          <X size={14}/>
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}

function StepTechModal({ t, onClose }) {
  const [step,  setStep]  = useState(0)
  const [timer, setTimer] = useState(t.steps[0].dur)
  const [done,  setDone]  = useState(false)

  useEffect(() => {
    if (done) return
    const id = setInterval(() => {
      setTimer(s => {
        if (s <= 1) {
          if (step < t.steps.length - 1) { setStep(p => p + 1); return t.steps[step + 1]?.dur || 0 }
          else { setDone(true); return 0 }
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [step, done, t])

  const cur = t.steps[step] || t.steps[t.steps.length - 1]

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl mb-3">{t.emoji}</div>
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{color:t.color}}>{t.title}</p>
        <p className="text-[11px] text-white/40 mb-6">{t.subtitle}</p>

        {!done ? (
          <>
            <div className="w-full rounded-2xl p-5 mb-5"
              style={{background:`${t.color}12`,border:`1px solid ${t.color}30`}}>
              <p className="text-[10px] text-white/40 mb-1 font-bold">Hapi {step+1}/{t.steps.length}</p>
              <p className="text-base font-black text-white mb-2">{cur.label}</p>
              <p className="text-[13px] text-white/65 leading-relaxed">{cur.instruction}</p>
              {cur.dur > 5 && <p className="text-2xl font-black mt-4" style={{color:t.color}}>{timer}s</p>}
            </div>
            <div className="w-full h-1 rounded-full mb-4" style={{background:'rgba(255,255,255,0.08)'}}>
              <motion.div className="h-full rounded-full"
                animate={{width:`${((step+1)/t.steps.length)*100}%`}}
                style={{background:`linear-gradient(to right, ${t.color}88, ${t.color})`}}/>
            </div>
            <button onClick={() => {
              if (step < t.steps.length-1) { setStep(s=>s+1); setTimer(t.steps[step+1].dur) }
              else setDone(true)
            }} className="w-full py-3 rounded-2xl font-bold text-[13px] text-white"
              style={{background:`${t.color}25`,border:`1px solid ${t.color}50`}}>
              {step < t.steps.length-1 ? 'Hapi tjetër →' : 'Mbarova ✓'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-base font-black text-white mb-2">Bravo! Shumë mirë!</p>
            <p className="text-[12px] text-white/50 mb-6 leading-relaxed">{t.benefit}</p>
            <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold text-[13px] text-white"
              style={{background:`${t.color}25`,border:`1px solid ${t.color}50`}}>Mbyll</button>
          </div>
        )}
      </div>
    </ModalOverlay>
  )
}

function CycleBreathModal({ t, onClose }) {
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(t.phases[0].dur)
  const [round, setRound] = useState(1)
  const [done,  setDone]  = useState(false)

  // Refs give the interval callback the latest phase/round without
  // making them dependencies (which would restart the interval on every tick)
  const phaseRef = useRef(0)
  const roundRef = useRef(1)

  useEffect(() => {
    if (done) return
    const id = setInterval(() => {
      setCount(c => {
        if (c > 1) return c - 1
        const nextP = (phaseRef.current + 1) % t.phases.length
        if (nextP === 0) {
          if (roundRef.current >= t.rounds) { setDone(true); return 0 }
          roundRef.current += 1
          setRound(roundRef.current)
        }
        phaseRef.current = nextP
        setPhase(nextP)
        return t.phases[nextP].dur
      })
    }, 1000)
    return () => clearInterval(id)
  }, [done, t])

  const cur   = t.phases[phase]
  const scale = cur.dir > 0 ? 1.2 : cur.dir < 0 ? 0.8 : 1
  const pct   = (count / cur.dur) * 100

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="text-3xl mb-2">{t.emoji}</div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{color:t.color}}>{t.title}</p>
        <p className="text-[11px] text-white/40 mb-6">{t.subtitle}</p>

        {!done ? (
          <>
            <div className="relative flex items-center justify-center mb-6" style={{width:160,height:160}}>
              <svg className="absolute" width={160} height={160} style={{transform:'rotate(-90deg)'}}>
                <circle cx={80} cy={80} r={70} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6}/>
                <circle cx={80} cy={80} r={70} fill="none" stroke={t.color} strokeWidth={6}
                  strokeDasharray={440} strokeDashoffset={440*(1-pct/100)} strokeLinecap="round"/>
              </svg>
              <motion.div className="rounded-full flex flex-col items-center justify-center"
                animate={{scale}} transition={{duration:cur.dur, ease:'easeInOut'}}
                style={{width:100,height:100,background:`radial-gradient(circle,${t.color}40,${t.color}15)`,
                  border:`2px solid ${t.color}44`}}>
                <p className="text-2xl font-black text-white">{count}</p>
                <p className="text-[9px] text-white/50">{cur.label}</p>
              </motion.div>
            </div>
            <p className="text-base font-black text-white mb-1">{cur.label}</p>
            <p className="text-[11px] text-white/40 mb-6">Rundi {round}/{t.rounds}</p>
            <button onClick={onClose} className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
              Ndalo ushtrim
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">🌟</div>
            <p className="text-base font-black text-white mb-2">Shumë mirë!</p>
            <p className="text-[12px] text-white/50 mb-6 leading-relaxed">{t.benefit}</p>
            <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold text-[13px] text-white"
              style={{background:`${t.color}25`,border:`1px solid ${t.color}50`}}>Mbyll</button>
          </div>
        )}
      </div>
    </ModalOverlay>
  )
}

export function BreathingModal({ tech, onClose }) {
  const t = TECHNIQUES[tech]
  if (!t) return null
  if (t.phases) return <CycleBreathModal t={t} onClose={onClose}/>
  return <StepTechModal t={t} onClose={onClose}/>
}
