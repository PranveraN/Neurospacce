import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Clock, AlertTriangle, Phone, Heart, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TIPS, TOPIC_COLOR, FOLLOWUP_CHIPS, pickRandomTip } from '../../data/aiChatData'
import { getArticlesForTopic, TOPICS } from '../../lib/aiChatEngine'

export function SuggestionChips({ chips, onChip, title }) {
  return (
    <motion.div className="ml-11 mt-3 animate-fade-in"
      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.15}}>
      {title && <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">{title}</p>}
      <div className="flex flex-wrap gap-2">
        {chips.map(ch => (
          <motion.button key={ch.id} onClick={() => onChip(ch)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
            style={{background:`${ch.color}14`,border:`1px solid ${ch.color}35`,color:ch.color}}
            whileHover={{scale:1.04,boxShadow:`0 0 12px ${ch.color}44`}}
            whileTap={{scale:0.96}}>
            <span className="leading-none">{ch.emoji}</span>
            {ch.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function QuickAdviceCard({ topic, onChip }) {
  const initial = pickRandomTip(topic)
  const [tip,     setTip]   = useState(initial)
  const [usedIds, setUsed]  = useState(new Set([initial.id]))
  const [phase,   setPhase] = useState('tip')
  const [saved,   setSaved] = useState(false)

  const color = TOPIC_COLOR[topic] || '#8b5cf6'

  function nextTip() {
    setUsed(prev => {
      const next = pickRandomTip(topic, prev)
      setTip(next)
      return new Set([...prev, next.id])
    })
  }

  function onSave() {
    setSaved(true)
    setPhase('followup')
    try {
      const arr = JSON.parse(localStorage.getItem('ns_saved_tips') || '[]')
      if (!arr.find(t => t.id === tip.id)) {
        arr.push({ ...tip, topic, savedAt: new Date().toISOString() })
        localStorage.setItem('ns_saved_tips', JSON.stringify(arr))
      }
    } catch {}
  }

  return (
    <motion.div className="ml-11 mt-3"
      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.25}}>
      <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">✨ Këshillë e çastit</p>
      <div className="relative rounded-2xl p-4 overflow-hidden"
        style={{background:`${color}0d`,border:`1px solid ${color}30`}}>
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{boxShadow:[`0 0 0px ${color}00`,`0 0 20px ${color}22`,`0 0 0px ${color}00`]}}
          transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}/>

        <AnimatePresence mode="wait">
          {phase === 'tip' ? (
            <motion.div key="tip" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <p className="text-[13px] text-white/80 leading-relaxed mb-4">{tip.text}</p>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setPhase('followup')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all hover:scale-105"
                  style={{background:`${color}20`,border:`1px solid ${color}40`,color}}>
                  ✅ E bëra
                </button>
                <button onClick={nextTip}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all hover:scale-105"
                  style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.55)'}}>
                  🔁 Jep tjetër
                </button>
                <button onClick={onSave}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all hover:scale-105"
                  style={saved
                    ? {background:`${color}28`,border:`1px solid ${color}55`,color}
                    : {background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.55)'}}>
                  {saved ? '📌 Ruajtur' : '📌 Ruaje'}
                </button>
                <button onClick={() => onChip({id:'ask',emoji:'💬',label:'Fol me dikë',action:'ask_psychologist',color:'#fbbf24'})}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all hover:scale-105 ml-auto"
                  style={{background:'rgba(251,191,36,0.12)',border:'1px solid rgba(251,191,36,0.3)',color:'#fbbf24'}}>
                  💬 Fol
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="followup" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}>
              <p className="text-[12px] font-bold text-white/70 mb-3">
                {saved ? '📌 Ruajtur! ' : ''}A dëshiron diçka tjetër?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FOLLOWUP_CHIPS.map(ch => (
                  <button key={ch.id} onClick={() => onChip(ch)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all hover:scale-105"
                    style={{background:`${ch.color}14`,border:`1px solid ${ch.color}35`,color:ch.color}}>
                    {ch.emoji} {ch.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function CheckInPanel({ onResponse }) {
  const opts = [
    {id:'better',label:'Pak më mirë',emoji:'😊',color:'#4ade80'},
    {id:'same',  label:'Njësoj',     emoji:'😐',color:'#fbbf24'},
    {id:'worse', label:'Më keq',     emoji:'😞',color:'#f87171'},
    {id:'crisis',label:'Akoma keq',  emoji:'🌪️',color:'#ef4444'},
  ]
  return (
    <motion.div className="ml-11 mt-3 p-4 rounded-2xl"
      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}
      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
      <p className="text-[11px] font-bold text-white/60 mb-3">Si ndihesh tani? 💙</p>
      <div className="grid grid-cols-2 gap-2">
        {opts.map(o => (
          <motion.button key={o.id} onClick={() => onResponse(o.id)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-[12px] font-bold transition-all"
            style={{background:`${o.color}12`,border:`1px solid ${o.color}30`,color:o.color}}
            whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
            <span>{o.emoji}</span>{o.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function CrisisBanner({ onDismiss }) {
  return (
    <motion.div
      className="flex-shrink-0 px-3 py-2.5 mx-0"
      style={{background:'linear-gradient(90deg,rgba(220,38,38,0.22),rgba(239,68,68,0.18))',borderBottom:'1.5px solid rgba(239,68,68,0.45)'}}
      initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{background:'rgba(239,68,68,0.3)'}}>
          <AlertTriangle size={13} className="text-red-300"/>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black text-red-200 leading-tight">Nëse jeni në rrezik të menjëhershëm</p>
          <div className="flex items-center gap-3 mt-0.5">
            <a href="tel:112" className="text-[10px] font-bold text-white flex items-center gap-1 hover:text-red-200 transition-colors">
              <Phone size={9}/> 112 Emergjenca
            </a>
            <span className="text-white/20 text-[9px]">·</span>
            <a href="tel:08004411" className="text-[10px] font-bold text-pink-300 flex items-center gap-1 hover:text-pink-100 transition-colors">
              <Heart size={9}/> 0800 44 11 Krizë (Falas)
            </a>
          </div>
        </div>
        <button onClick={onDismiss} aria-label="Mbyll" className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors">
          <X size={11} className="text-white/40"/>
        </button>
      </div>
    </motion.div>
  )
}

export function CrisisPanel({ onBook, onAsk }) {
  return (
    <motion.div className="mx-4 my-2 p-4 rounded-2xl"
      style={{background:'rgba(220,38,38,0.14)',border:'1.5px solid rgba(239,68,68,0.45)',boxShadow:'0 4px 24px rgba(239,68,68,0.15)'}}
      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={15} className="text-red-400 shrink-0"/>
        <p className="text-[13px] font-black text-red-200">Mbështetje urgjente</p>
      </div>
      <div className="space-y-2 mb-3">
        <a href="tel:112" className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/8 active:scale-[0.98]"
          style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.35)'}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'rgba(239,68,68,0.25)'}}>
            <Phone size={14} className="text-red-300"/>
          </div>
          <div>
            <p className="text-[13px] font-black text-white">112 — Emergjenca</p>
            <p className="text-[10px] text-white/50">Ambulanca · Policia · Disponibël 24/7</p>
          </div>
        </a>
        <a href="tel:08004411" className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/8 active:scale-[0.98]"
          style={{background:'rgba(236,72,153,0.12)',border:'1px solid rgba(236,72,153,0.3)'}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'rgba(236,72,153,0.2)'}}>
            <Heart size={14} className="text-pink-300"/>
          </div>
          <div>
            <p className="text-[13px] font-black text-white">0800 44 11 — Linja e Krizës</p>
            <p className="text-[10px] text-white/50">Falas · Konfidencial · 24/7</p>
          </div>
        </a>
      </div>
      <div className="flex gap-2">
        <button onClick={onAsk}
          className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-[1.02]"
          style={{background:'rgba(139,92,246,0.3)',border:'1px solid rgba(139,92,246,0.5)'}}>
          💬 Fol tani me ekspert
        </button>
        <button onClick={onBook}
          className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-[1.02]"
          style={{background:'rgba(239,68,68,0.25)',border:'1px solid rgba(239,68,68,0.5)'}}>
          📅 Takim urgjent
        </button>
      </div>
    </motion.div>
  )
}

export function InlineArticles({ topic }) {
  const articles = getArticlesForTopic(topic) || []
  if (!articles.length) return null
  return (
    <div className="ml-11 mt-3 animate-fade-in">
      <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">Artikuj të rekomanduar</p>
      <div className="flex gap-3 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
        {articles.slice(0,3).map(a => (
          <Link key={a.id} to={`/articles/${a.id}`}
            className="shrink-0 w-44 rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all hover:scale-[1.02] group"
            style={{background:'rgba(255,255,255,0.05)'}}>
            {a.image && (
              <div className="h-20 overflow-hidden">
                <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"/>
              </div>
            )}
            <div className="p-3">
              <p className="text-[11px] font-bold text-white/90 leading-tight line-clamp-2 mb-1">{a.title}</p>
              <div className="flex items-center gap-1">
                <Clock size={8} className="text-white/25"/>
                <span className="text-[9px] text-white/25">{a.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ChatBubble({ msg }) {
  const isAI = msg.from === 'ai'
  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      {isAI && (
        <div className="w-8 h-8 rounded-2xl shrink-0 mt-1 flex items-center justify-center shadow-lg"
          style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
          <Brain size={14} color="white" strokeWidth={2}/>
        </div>
      )}
      <div className={`max-w-[82%] ${isAI ? '' : 'items-end flex flex-col'}`}>
        <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
          isAI ? 'rounded-tl-sm' : 'text-white rounded-tr-sm'
        }`}
          style={isAI
            ? {background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.09)',backdropFilter:'blur(10px)'}
            : {background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
          <span className="text-white/85">{msg.text}</span>
        </div>
        <span className="text-[9px] text-white/20 mt-1 px-1">{msg.time}</span>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-2xl shrink-0 flex items-center justify-center"
        style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
        <Brain size={14} color="white" strokeWidth={2}/>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.09)'}}>
        <div className="flex gap-1.5 items-center h-4">
          {[0,150,300].map(d => (
            <div key={d} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
              style={{animationDelay:`${d}ms`}}/>
          ))}
        </div>
      </div>
    </div>
  )
}
