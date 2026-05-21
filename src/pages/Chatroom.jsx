import { useState, useRef, useEffect } from 'react'
import { Send, Users, Shield, ChevronRight, ArrowLeft, Brain, Lock, Hash } from 'lucide-react'
import { useMood }                  from '../contexts/MoodContext'
import { CHAT_ROOMS, ROOM_MESSAGES } from '../data/mockData'

function RoomCard({ room, onEnter, theme }) {
  return (
    <div
      className={`glass rounded-3xl p-4 shadow-card flex items-center gap-4 transition-all
        ${room.active ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50'}`}
      onClick={() => room.active && onEnter(room)}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl"
        style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)` }}
      >
        {room.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-sm">{room.name}</h3>
          {room.active && <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{room.description}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <Users size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-400 font-semibold">{room.members} anëtarë</span>
        </div>
      </div>

      {room.active
        ? <ChevronRight size={15} className="text-gray-300 shrink-0" />
        : (
          <div className="flex items-center gap-1 shrink-0">
            <Lock size={12} className="text-gray-300" />
            <span className="text-[10px] text-gray-400 font-semibold">Shpejt</span>
          </div>
        )
      }
    </div>
  )
}

function ChatView({ room, onBack, theme }) {
  const [msgs, setMsgs]   = useState(ROOM_MESSAGES[room.id] || [])
  const [input, setInput] = useState('')
  const bottomRef          = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  function sendMsg() {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })
    setMsgs(prev => [...prev, { id: Date.now(), user: 'Anonim_Tu', text: input.trim(), time: now, isAI: false }])
    setInput('')

    if (input.toLowerCase().includes('keq') || input.toLowerCase().includes('ankth')) {
      setTimeout(() => {
        const t = new Date().toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })
        setMsgs(prev => [...prev, {
          id: Date.now() + 1, user: 'AI Guide', isAI: true, time: t,
          text: 'Faleminderit që e ndave. Ti nuk je vetëm. Shumë njerëz ndiejnë të njëjtën gjë. A dëshiron të provojmë bashkë një teknikë të shpejtë?',
        }])
      }, 1500)
    }
  }

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-48px)] md:rounded-3xl md:overflow-hidden md:shadow-card">
      {/* Header */}
      <div
        className="px-4 pt-14 md:pt-5 pb-4 text-white flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-xl shrink-0">{room.emoji}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-base leading-tight">{room.name}</h2>
            <p className="text-[10px] opacity-70 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
              {room.members} online · Anonim
            </p>
          </div>
          <Shield size={15} className="opacity-60 shrink-0" />
        </div>

        <div className="mt-3 bg-white/15 rounded-xl px-3 py-2 flex items-center gap-2">
          <Shield size={11} className="opacity-70 shrink-0" />
          <p className="text-[10px] opacity-75">Bisedë anonime · AI moderues aktiv · Rregulla respekti</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f8f7ff]">
        {msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)` }}>
              💬
            </div>
            <p className="text-sm font-black text-gray-600">Komuniteti është duke u ndërtuar</p>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Ky komunitet hapet së shpejti. Jini të parët — shkruani mesazhin e parë dhe filloni bisedën.
            </p>
          </div>
        )}
        {msgs.map(m => {
          const isMe = m.user === 'Anonim_Tu'
          return (
            <div key={m.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {m.isAI && (
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1"
                  style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
                >
                  <Brain size={13} color="white" strokeWidth={2} />
                </div>
              )}
              {!m.isAI && !isMe && (
                <div className="w-7 h-7 rounded-xl bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                  <Users size={12} className="text-gray-500" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-3xl shadow-sm ${
                  isMe ? 'text-white rounded-tr-sm' :
                  m.isAI ? 'bg-purple-50 text-gray-800 rounded-tl-sm' :
                  'bg-white text-gray-800 rounded-tl-sm'
                }`}
                style={isMe ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` } : {}}
              >
                {!isMe && (
                  <p className={`text-[10px] font-bold mb-0.5 ${m.isAI ? 'text-purple-500' : 'text-gray-400'}`}>
                    {m.user}
                  </p>
                )}
                <p className="text-sm leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>{m.time}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 bg-white flex-shrink-0 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2.5 gap-2 focus-within:border-purple-300 focus-within:bg-white transition-all">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="Shkruaj anonim..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
          <button
            onClick={sendMsg}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Chatroom() {
  const { theme }             = useMood()
  const [activeRoom, setRoom] = useState(null)

  if (activeRoom) {
    return <ChatView room={activeRoom} onBack={() => setRoom(null)} theme={theme} />
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div
        className="px-5 pt-14 md:pt-6 pb-6 text-white md:rounded-3xl mb-4"
        style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Users size={20} />
          <div>
            <h1 className="text-xl font-black">Komuniteti</h1>
            <p className="text-white/70 text-xs">Biseda anonime · Mbështetje reale</p>
          </div>
        </div>

        <div className="bg-white/15 rounded-2xl px-4 py-3 flex items-center gap-3">
          <Shield size={16} className="shrink-0" />
          <div>
            <p className="font-bold text-sm">Hapësirë e Sigurt</p>
            <p className="text-[10px] opacity-75">AI moderues aktiv · Anonymitet total · Rregulla të qarta</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0 space-y-4">
        {/* Active rooms */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash size={13} style={{ color: theme.start }} />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Rooms aktive</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHAT_ROOMS.filter(r => r.active).map(r => (
              <RoomCard key={r.id} room={r} onEnter={setRoom} theme={theme} />
            ))}
          </div>
        </div>

        {/* Coming soon */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock size={12} className="text-gray-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Së shpejti</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHAT_ROOMS.filter(r => !r.active).map(r => (
              <RoomCard key={r.id} room={r} onEnter={setRoom} theme={theme} />
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <div className="glass rounded-3xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} style={{ color: theme.start }} />
            <h3 className="font-bold text-gray-700 text-sm">Rregullat e komunitetit</h3>
          </div>
          {[
            'Respekto të tjerët gjithmonë',
            'Mos hap informacione personale',
            'Ofro mbështetje, jo këshilla mjekësore',
            'Raporto sjellje të papërshtatshme',
          ].map((r, i) => (
            <div key={r} className={`flex items-start gap-2 py-2 text-xs text-gray-500 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: theme.start }} />
              {r}
            </div>
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
