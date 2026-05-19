import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const LIVE = [
  { label: 'Mendja',  value: '87%',      dot: '#a78bfa' },
  { label: 'Seria',   value: '7d 🔥',    dot: '#34d399' },
  { label: 'Humor',   value: 'Mirë 💚',  dot: '#6ee7b7' },
  { label: 'Analiza', value: '3 reja',   dot: '#c084fc' },
  { label: 'Sinjalin', value: '⚡ i ri', dot: '#f9a8d4' },
]

/* Cycling gradient stops for border + glow */
const AURORA = [
  ['#7c3aed', '#ec4899', '#6366f1'],
  ['#ec4899', '#f97316', '#7c3aed'],
  ['#3b82f6', '#7c3aed', '#ec4899'],
  ['#6366f1', '#06b6d4', '#a855f7'],
]

export default function NeuroPulse({ scrolled = false }) {
  const { user }  = useAuth()
  const [live, setLive]     = useState(0)
  const [aurora, setAurora] = useState(0)

  useEffect(() => {
    const a = setInterval(() => setAurora(i => (i + 1) % AURORA.length), 2200)
    const l = setInterval(() => setLive(i  => (i + 1) % LIVE.length),   3400)
    return () => { clearInterval(a); clearInterval(l) }
  }, [])

  const cur  = LIVE[live]
  const cols = AURORA[aurora]
  const dest = user ? '/home' : '/auth'

  const grad = `linear-gradient(135deg, ${cols[0]}, ${cols[1]}, ${cols[2]})`

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {/* ── Ambient glow — color-cycling ── */}
      <motion.div
        animate={{ background: grad }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -6, borderRadius: 999,
          filter: 'blur(14px)', opacity: 0.45, zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── Animated border ring (1.5 px gradient) ── */}
      <motion.div
        animate={{ background: grad }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -1.5, borderRadius: 999,
          zIndex: 1, pointerEvents: 'none',
        }}
      />

      {/* ── Pill ── */}
      <Link
        to={dest}
        style={{
          position: 'relative', zIndex: 2,
          display: 'inline-flex', alignItems: 'center', gap: 9,
          padding: '5px 13px 5px 6px',
          borderRadius: 999,
          background: 'linear-gradient(145deg, #12062a 0%, #1a0a3d 55%, #0e0520 100%)',
          textDecoration: 'none',
          overflow: 'hidden',
          minWidth: 148,
        }}
      >
        {/* inner aurora tint */}
        <motion.div
          animate={{ background: `radial-gradient(ellipse at 20% 50%, ${cols[0]}22 0%, transparent 70%)` }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />

        {/* shimmer sweep — loops every 4 s */}
        <motion.div
          animate={{ x: ['-120%', '220%'] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut', repeatDelay: 2.4 }}
          style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: '55%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />

        {/* ── Gem orb ── */}
        <GemOrb cols={cols} />

        {/* ── Text ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', zIndex: 1 }}>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              fontSize: 11.5, fontWeight: 900, color: '#fff',
              letterSpacing: '0.04em', lineHeight: 1,
            }}>
              NeuroPulse
            </span>
            {/* live blink */}
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              style={{
                display: 'inline-block',
                width: 5, height: 5, borderRadius: '50%',
                background: cur.dot,
                boxShadow: `0 0 6px ${cur.dot}`,
                flexShrink: 0,
              }}
            />
          </div>

          {/* Rotating stat */}
          <AnimatePresence mode="wait">
            <motion.div
              key={live}
              initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
              exit={{    opacity: 0, y: -5, filter: 'blur(4px)' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 8.5, fontWeight: 700, whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: cur.dot, letterSpacing: '0.02em' }}>{cur.label}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{cur.value}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </Link>
    </motion.div>
  )
}

/* ─── Color-shifting gem orb ─────────────────────────────────────── */
function GemOrb({ cols }) {
  const grad = `radial-gradient(circle at 32% 28%, #fff 0%, ${cols[0]} 35%, ${cols[1]} 70%, #0a0220 100%)`

  return (
    <div style={{ position: 'relative', width: 32, height: 32, flexShrink: 0, zIndex: 1 }}>

      {/* Ambient halo */}
      <motion.div
        animate={{ background: `radial-gradient(circle, ${cols[0]}66 0%, transparent 70%)` }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: -5, borderRadius: '50%', pointerEvents: 'none' }}
      />

      {/* Spinning outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid transparent',
          borderTopColor: `${cols[0]}99`,
          borderRightColor: `${cols[1]}55`,
        }}
      />

      {/* Second ring — counter-rotate */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 11, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 2, borderRadius: '50%',
          border: '1px solid transparent',
          borderBottomColor: `${cols[1]}77`,
          borderLeftColor: `${cols[2]}44`,
        }}
      />

      {/* Core gem */}
      <motion.div
        animate={{ background: grad }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 5, borderRadius: '50%',
          boxShadow: `0 2px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4)`,
        }}
      >
        {/* Glass highlight */}
        <div style={{
          position: 'absolute', top: '14%', left: '18%',
          width: '40%', height: '32%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.45)',
          filter: 'blur(1.5px)',
        }} />
      </motion.div>

      {/* Orbiting spark */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <motion.div
          animate={{ background: cols[2] }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 2, left: '50%', marginLeft: -2,
            width: 4, height: 4, borderRadius: '50%',
            boxShadow: `0 0 5px ${cols[2]}`,
          }}
        />
      </motion.div>

      {/* Second orbiting spark (slower, opposite) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
        style={{ position: 'absolute', inset: 3 }}
      >
        <motion.div
          animate={{ background: cols[1] }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: 0, left: '50%', marginLeft: -1.5,
            width: 3, height: 3, borderRadius: '50%',
            boxShadow: `0 0 4px ${cols[1]}`,
          }}
        />
      </motion.div>
    </div>
  )
}
