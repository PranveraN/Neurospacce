import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ChevronLeft, Send, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth }   from '../contexts/AuthContext'
import { ActivityLog } from '../lib/activityLog'
import {
  EMOTION_STARTERS, TOPIC_COLOR, RESPONSES, CHIP_SETS, TECHNIQUES, TIPS,
  detectTopic, isCrisis, nowTime,
} from '../data/aiChatData'
import { TOPICS } from '../lib/aiChatEngine'
import { BreathingModal }  from '../components/chat/TechniqueModals'
import { BookingModal }    from '../components/chat/BookingModal'
import { AskModal }        from '../components/chat/AskModal'
import {
  SuggestionChips, QuickAdviceCard, CheckInPanel,
  CrisisBanner, CrisisPanel, InlineArticles, ChatBubble, TypingIndicator,
} from '../components/chat/ChatWidgets'

const BG = 'linear-gradient(160deg, #0b0717 0%, #100c22 50%, #0d0a1e 100%)'

export default function AIChat() {
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [messages, setMsgs]  = useState([{
    id:0, from:'ai', time:nowTime(),
    text:'Mirë se vjen! Jam **NeuroAI** — udhëzuesi yt i shëndetit mendor. 🤍\n\nNuk jam terapis dhe nuk zëvendësoj ekspertin — por jam këtu të të ndihmoj të gjesh **psikologun e duhur**, të të rekomandoj **artikujt relevantë** dhe të të udhëzoj drejt mbështetjes që ke nevojë.\n\nSi mund të të ndihmoj sot?',
    chips: null, articles: null, checkIn: false, crisis: false,
  }])
  const [input,      setInput]   = useState('')
  const [typing,     setTyping]  = useState(false)
  const [topic,      setTopic]   = useState(null)
  const [depth,      setDepth]   = useState(0)
  const [aiMsgCount, setAiMC]    = useState(0)

  // Modals
  const [technique, setTech]    = useState(null)
  const [showBook,  setBook]    = useState(false)
  const [showAsk,   setAsk]     = useState(false)
  const [showCrisis,setCrisis]  = useState(false)

  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, typing])

  const addMessage = useCallback((msg) => {
    setMsgs(prev => [...prev, { id: Date.now() + Math.random(), time: nowTime(), ...msg }])
  }, [])

  function getTopicResponse(t, d) {
    const arr = RESPONSES[t] || RESPONSES.anxiety
    return arr[Math.min(d, arr.length - 1)]
  }

  function getChipsForTopic(t) {
    return CHIP_SETS[t] || CHIP_SETS.anxiety
  }

  function sendAiResponse(text, t, d, extraChips, articles, checkIn) {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const chips      = extraChips || (t ? getChipsForTopic(t) : null)
      const showCheckIn = checkIn || (aiMsgCount > 0 && aiMsgCount % 2 === 0)
      const quickTip   = (d === 0 && t && TIPS[t]) ? t : null
      addMessage({ from:'ai', text, chips, articles: articles || null, checkIn: showCheckIn, crisis: false, quickTip })
      setAiMC(c => c + 1)
    }, 1000 + Math.random() * 600)
  }

  function processUserMessage(text) {
    if (!text.trim() || typing) return
    if (text.length > 500) return
    ActivityLog.chat(user?.id)

    if (isCrisis(text)) {
      addMessage({ from:'user', text })
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setCrisis(true)
        addMessage({
          from:'ai',
          text:'Faleminderit që u ndave me mua. Kam dëgjuar. 💙\n\nKjo që ndjen tani është reale dhe e rëndë — dhe nuk je vetëm.\n\nJam duke shfaqur burimet e mbështetjes urgjente. Njerëzit e trajnuar janë aty.',
          chips: [
            {id:'ask',emoji:'💬',label:'Fol tani me ekspert',action:'ask_psychologist',color:'#8b5cf6'},
            {id:'bk', emoji:'📅',label:'Takim urgjent',       action:'booking',         color:'#ec4899'},
          ],
          checkIn: false, crisis: true,
        })
      }, 800)
      setInput('')
      return
    }

    const detected = detectTopic(text) || topic
    addMessage({ from:'user', text, chips:null })
    setInput('')

    if (detected && !topic) setTopic(detected)
    const d = depth
    setDepth(p => p + 1)

    const resp = getTopicResponse(detected || 'anxiety', d)
    sendAiResponse(resp, detected || 'anxiety', d)
  }

  function handleChip(chip) {
    const { action, label, emoji } = chip

    if (action.startsWith('technique:')) {
      const key = action.split(':')[1]
      if (TECHNIQUES[key]) { setTech(key); return }
    }
    if (action === 'booking')          { setBook(true); return }
    if (action === 'ask_psychologist') { setAsk(true);  return }
    if (action === 'navigate:journal') { navigate('/journal'); return }

    if (action.startsWith('article:')) {
      const t = action.split(':')[1]
      addMessage({ from:'user', text:`${emoji} ${label}`, chips:null })
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        addMessage({
          from:'ai',
          text:`Ja disa artikuj të rekomanduar bazuar mbi atë që po kalon. Leximi i tyre mund të ndihmojë të kuptosh më mirë emocionet e tua. 📖`,
          chips: getChipsForTopic(topic || 'anxiety'),
          articles: t, checkIn: false,
        })
        setAiMC(c => c + 1)
      }, 900)
      return
    }

    if (action.startsWith('switch:')) {
      const newTopic = action.split(':')[1]
      setTopic(newTopic)
      setDepth(0)
      addMessage({ from:'user', text:`${emoji} ${label}`, chips:null })
      sendAiResponse(getTopicResponse(newTopic, 0), newTopic, 0)
      return
    }

    if (action.startsWith('check_in:')) {
      handleCheckIn(action.split(':')[1])
      return
    }

    addMessage({ from:'user', text:`${emoji} ${label}`, chips:null })
    const d = depth
    setDepth(p => p + 1)
    sendAiResponse(getTopicResponse(topic || 'anxiety', d), topic || 'anxiety', d)
  }

  function handleEmotionStarter(em) {
    setTopic(em.id)
    setDepth(1)
    addMessage({ from:'user', text:`${em.emoji} ${em.label}`, chips:null })
    sendAiResponse(getTopicResponse(em.id, 0), em.id, 0)
  }

  function handleCheckIn(feel) {
    const texts = {
      better: `Kjo më bën shumë mirë ta dëgjoj. 🌱\n\nProgresimi — madje edhe minimal — është tregues se jeni duke u kujdesur për veten. Vazhdo me teknikat që ndiheshe mirë.`,
      same:   `Normalja ndodh. Nuk çdo gjë zgjidhet brenda minutave. 💙\n\nLe të provojmë diçka ndryshe — ndoshta teknikë tjetër ose qasje tjetër do të ndihmojë.`,
      worse:  `Faleminderit që më tregove — kjo kurajon. 🤍\n\nKur ndihesh kështu, mbështetja njerëzore është hapi i duhur. Psikologu mund të të ndihmojë shumë.`,
      crisis: `Kuptoj. Do të të tregoj burimet e mbështetjes menjëherë. 💙\n\nNuk je vetëm në këtë.`,
    }
    const followChips = {
      better: [{id:'more',emoji:'✨',label:'Teknikë tjetër',action:'technique:box_breathing',color:'#8b5cf6'},{id:'jrl',emoji:'✍️',label:'Shkruaj progresit',action:'navigate:journal',color:'#22c55e'}],
      same:   [{id:'box',emoji:'🫁',label:'Box Breathing',action:'technique:box_breathing',color:'#38bdf8'},{id:'grd',emoji:'🌿',label:'Grounding',action:'technique:grounding',color:'#22c55e'},{id:'ask',emoji:'💬',label:'Fol me ekspert',action:'ask_psychologist',color:'#fbbf24'}],
      worse:  [{id:'ask',emoji:'💬',label:'Pyet psikologun',action:'ask_psychologist',color:'#fbbf24'},{id:'bk',emoji:'📅',label:'Rezervo takim',action:'booking',color:'#ec4899'}],
      crisis: [{id:'ask',emoji:'💬',label:'Fol tani',action:'ask_psychologist',color:'#8b5cf6'},{id:'bk',emoji:'📅',label:'Takim urgjent',action:'booking',color:'#ec4899'}],
    }

    addMessage({ from:'user', text: feel==='better'?'😊 Pak më mirë':feel==='same'?'😐 Njësoj':feel==='worse'?'😞 Më keq':'🌪️ Akoma keq', chips:null })
    if (feel === 'crisis') setCrisis(true)

    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      addMessage({ from:'ai', text: texts[feel] || texts.same, chips: followChips[feel], checkIn:false, crisis: feel==='crisis' })
      setAiMC(c => c + 1)
    }, 900)
  }

  const showStarters = messages.length <= 1

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-48px)] overflow-hidden md:rounded-3xl overflow-x-hidden"
      style={{background: BG}}>

      {/* ── HEADER ── */}
      <div className="px-4 pt-14 md:pt-4 pb-4 flex-shrink-0"
        style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} aria-label="Kthehu"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all">
              <ChevronLeft size={16}/>
            </button>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)',boxShadow:'0 0 14px rgba(124,58,237,0.4)'}}>
              <Brain size={16} color="white" strokeWidth={2}/>
            </div>
            <div>
              <h2 className="font-black text-white text-base leading-tight">NeuroAI</h2>
              <p className="text-[10px] text-white/35 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"/>
                Udhëzues AI · Gjen ekspertin e duhur
              </p>
            </div>
          </div>
          {topic && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{background:`${TOPIC_COLOR[topic]}18`,color:TOPIC_COLOR[topic],border:`1px solid ${TOPIC_COLOR[topic]}35`}}>
              {TOPICS[topic]?.icon} {TOPICS[topic]?.label || topic}
            </span>
          )}
        </div>
      </div>

      {/* ── CRISIS BANNER ── */}
      <AnimatePresence>
        {showCrisis && <CrisisBanner onDismiss={() => setCrisis(false)}/>}
      </AnimatePresence>

      {/* ── MESSAGES ── */}
      <div ref={msgsRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id}>
            <ChatBubble msg={msg}/>
            {msg.articles  && <InlineArticles topic={msg.articles}/>}
            {msg.quickTip  && <QuickAdviceCard topic={msg.quickTip} onChip={handleChip}/>}
            {msg.chips && !msg.checkIn && (
              <SuggestionChips chips={msg.chips} onChip={handleChip} title="Çfarë do të ndihmonte tani?"/>
            )}
            {msg.checkIn  && <CheckInPanel onResponse={handleCheckIn}/>}
            {msg.crisis && showCrisis && (
              <CrisisPanel onBook={() => setBook(true)} onAsk={() => setAsk(true)}/>
            )}
          </div>
        ))}

        {typing && <TypingIndicator/>}

        {showStarters && !typing && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.18em] mb-3 ml-11">
              Si ndihesh sot?
            </p>
            <div className="flex flex-wrap gap-2 ml-11">
              {EMOTION_STARTERS.map(em => (
                <motion.button key={em.id} onClick={() => handleEmotionStarter(em)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all"
                  style={{background:`${em.color}14`,border:`1px solid ${em.color}30`,color:em.color}}
                  whileHover={{scale:1.05,boxShadow:`0 0 16px ${em.color}44`}}
                  whileTap={{scale:0.96}}>
                  <span>{em.emoji}</span>{em.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        <div className="h-2"/>
      </div>

      {/* ── SAFETY NOTE ── */}
      <div className="px-4 flex-shrink-0">
        <div className="flex items-center gap-2 py-2 px-3 rounded-2xl mb-2"
          style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
          <Shield size={11} className="text-violet-400 shrink-0"/>
          <p className="text-[9px] text-white/25 leading-relaxed">
            NeuroAI nuk zëvendëson ekspertin. Për krizë thirr{' '}
            <a href="tel:112" className="font-black text-red-400/70 hover:text-red-300 transition-colors">112</a>
            {' '}ose{' '}
            <a href="tel:08004411" className="font-black text-pink-400/70 hover:text-pink-300 transition-colors">0800 44 11</a>.
          </p>
        </div>
      </div>

      {/* ── INPUT ── */}
      <div className="px-4 pb-5 pt-1 flex-shrink-0"
        style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center rounded-2xl px-4 py-3 gap-2"
            style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.09)'}}>
            <input
              value={input}
              onChange={e => setInput(e.target.value.slice(0, 500))}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && processUserMessage(input)}
              placeholder="Shkruaj si ndihesh..."
              className="flex-1 text-base md:text-[13px] bg-transparent outline-none text-white/80 placeholder-white/20"
            />
            {input.length > 400 && (
              <span className={`text-[10px] font-bold shrink-0 ${input.length >= 500 ? 'text-red-400' : 'text-amber-400'}`}>
                {input.length}/500
              </span>
            )}
          </div>
          <motion.button
            onClick={() => processUserMessage(input)}
            disabled={!input.trim() || typing}
            aria-label="Dërgo mesazhin"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all disabled:opacity-25"
            style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}
            whileHover={{scale:1.05}} whileTap={{scale:0.95}}>
            <Send size={14}/>
          </motion.button>
        </div>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {technique && <BreathingModal key="tech" tech={technique} onClose={() => setTech(null)}/>}
        {showBook   && <BookingModal  key="book" onClose={() => setBook(false)}/>}
        {showAsk    && <AskModal      key="ask"  onClose={() => setAsk(false)}/>}
      </AnimatePresence>
    </div>
  )
}
