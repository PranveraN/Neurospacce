import { useState, useRef } from 'react'
import { Wind, Brain, Headphones, Zap, Sliders, X } from 'lucide-react'
import { useMood } from '../../contexts/MoodContext'

const WIDGETS = [
  { id: 'calm',    icon: Wind,       label: 'Qetësi',  grad: 'from-sky-400 to-blue-500'      },
  { id: 'thought', icon: Brain,      label: 'Mendim',  grad: 'from-violet-500 to-purple-600'  },
  { id: 'audio',   icon: Headphones, label: 'Tinguj',  grad: 'from-pink-400 to-rose-500'     },
  { id: 'cbt',     icon: Zap,        label: 'CBT',     grad: 'from-amber-400 to-orange-500'   },
  { id: 'mood',    icon: Sliders,    label: 'Humori',  grad: 'from-emerald-400 to-teal-500'  },
]

function BreathingContent({ theme }) {
  const [phase, setPhase]   = useState('idle')
  const [count, setCount]   = useState(4)
  const timerRef            = useRef(null)
  const PHASES = ['inhale','hold1','exhale','hold2']
  const LABELS = { inhale: 'Merr frymë...', hold1: 'Mbaj...', exhale: 'Nxirr...', hold2: 'Mbaj...' }

  function start() {
    setPhase('inhale'); setCount(4)
    let pi = 0, c = 4
    timerRef.current = setInterval(() => {
      c--
      if (c <= 0) { pi = (pi + 1) % 4; c = 4; setPhase(PHASES[pi]) }
      setCount(c)
    }, 1000)
  }
  function stop() { clearInterval(timerRef.current); setPhase('idle'); setCount(4) }

  const active   = phase !== 'idle'
  const isExpand = phase === 'inhale' || phase === 'hold1'

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full opacity-15"
          style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }} />
        <div
          className="rounded-full flex items-center justify-center font-black text-xl text-white transition-all duration-[1000ms] ease-in-out"
          style={{
            width:  active ? (isExpand ? '88px' : '60px') : '72px',
            height: active ? (isExpand ? '88px' : '60px') : '72px',
            background: `linear-gradient(135deg, ${theme.start}, ${theme.end})`,
          }}
        >
          {active ? count : <Wind size={22} />}
        </div>
      </div>
      <p className="text-xs text-gray-500 font-medium h-4">{active ? LABELS[phase] : 'Box Breathing'}</p>
      <button
        onClick={active ? stop : start}
        className="px-6 py-2 rounded-xl text-white text-xs font-bold"
        style={{ background: active ? '#ef4444' : `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}
      >
        {active ? 'Ndalo' : 'Fillo'}
      </button>
    </div>
  )
}

function MoodContent() {
  const { moodScore, setMoodScore, theme } = useMood()
  const ICONS = ['😰','😔','😐','🙂','😊','😄','🤩']
  return (
    <div className="flex flex-col gap-3 py-1">
      <div className="text-center">
        <span className="text-3xl">{ICONS[Math.min(moodScore - 1, 6)]}</span>
        <p className="font-black text-xl mt-1" style={{ color: theme.start }}>{moodScore}/10</p>
      </div>
      <input type="range" min={1} max={10} value={moodScore}
        onChange={e => setMoodScore(Number(e.target.value))} className="w-full" />
      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
        <span>Shumë keq</span><span>Shumë mirë</span>
      </div>
    </div>
  )
}

const WIDGET_PANELS = {
  calm:    { title: 'Qetësi e Shpejtë',    type: 'breathing' },
  thought: { title: 'Kontroll Mendimesh',  type: 'question',  body: 'Ky mendim është fakt apo opinion?\n\nNëse është opinion, çfarë argumente ke kundër tij?' },
  audio:   { title: 'Audio Qetësues',      type: 'audio' },
  cbt:     { title: 'Pyetje CBT',          type: 'question',  body: 'Sot, cila ishte situata më e vështirë?\n\nÇfarë menduat? Çfarë ndjetë? Si reaguat?' },
  mood:    { title: 'Humor Sot',           type: 'slider' },
}

export default function WidgetBar() {
  const [active, setActive] = useState(null)
  const { theme }           = useMood()
  const panel               = active ? WIDGET_PANELS[active] : null

  return (
    <>
      {/* Backdrop */}
      {active && (
        <div className="fixed inset-0 bg-black/25 z-40 backdrop-blur-sm"
          onClick={() => setActive(null)} />
      )}

      {/* Expanded panel */}
      {active && panel && (
        <div className="fixed bottom-[72px] left-0 right-0 z-50 px-3">
          <div
            className="bg-white rounded-3xl p-5 shadow-2xl animate-slide-up"
            style={{ borderTop: `3px solid ${theme.start}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-800">{panel.title}</h3>
              <button
                onClick={() => setActive(null)}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {panel.type === 'breathing' && <BreathingContent theme={theme} />}
            {panel.type === 'slider'    && <MoodContent />}
            {panel.type === 'question'  && (
              <div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed whitespace-pre-line">{panel.body}</p>
                <textarea rows={3} placeholder="Shkruaj këtu..."
                  className="w-full bg-gray-50 rounded-2xl p-3 text-sm text-gray-700 border border-gray-200 focus:outline-none resize-none" />
              </div>
            )}
            {panel.type === 'audio' && (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${theme.start}22, ${theme.end}22)` }}>
                  <Headphones size={26} style={{ color: theme.start }} />
                </div>
                <p className="text-xs text-gray-500 text-center">Relaksim me tinguj natyre · 45 sekonda</p>
                <button className="px-6 py-2 rounded-xl text-white text-xs font-bold"
                  style={{ background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }}>
                  ▶ Luaj
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed strip */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div
          className="mx-2 mb-2 rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${theme.start}18, ${theme.end}18)`, border: `1px solid ${theme.start}33` }}
        >
          <div className="bg-white/70 backdrop-blur-md widget-scroll">
            <div className="flex items-center gap-1.5 px-3 py-2 min-w-max">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-1 shrink-0">
                Shkurt
              </span>
              {WIDGETS.map(({ id, icon: Icon, label, grad }) => (
                <button
                  key={id}
                  onClick={() => setActive(active === id ? null : id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 shrink-0 no-select
                    ${active === id ? 'scale-95' : 'hover:scale-105'}`}
                  style={active === id
                    ? { background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` }
                    : { background: 'rgba(255,255,255,0.8)' }
                  }
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br ${grad} shrink-0`}>
                    <Icon size={13} color="white" strokeWidth={2} />
                  </div>
                  <span className={`text-[10px] font-bold leading-none ${active === id ? 'text-white' : 'text-gray-600'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
