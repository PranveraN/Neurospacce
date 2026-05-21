import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Flame, Zap, Star, Trophy, CheckCircle, Circle,
  TrendingUp, Brain, Heart, Target, Shield, Lightbulb,
  Users, RotateCcw, Share2, ChevronRight, Calendar, Lock,
} from 'lucide-react'
import { useEvolution } from '../hooks/useEvolution'
import {
  EVOLUTION_LEVELS, BADGES, COACH_MESSAGES, WEEKLY_INSIGHTS,
  getDailyChallenges, getLevelFromXP, getXPProgress,
} from '../data/evolutionData'
import { PM_ARCHETYPES } from '../data/personaMatrixData'
import EditableText from '../components/EditableText'

// ─── Mini Progress Bar ─────────────────────────────────────────────
function MiniBar({ value, color, label, sublabel }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-300">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }} />
      </div>
      {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
    </div>
  )
}

// ─── Check-in Strip ────────────────────────────────────────────────
function CheckinStrip({ checkins }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000)
    const key = d.toISOString().slice(0, 10)
    const c = checkins.find((ci) => ci.date === key)
    return { key, label: d.toLocaleDateString('sq-AL', { weekday: 'short' }), mood: c?.mood }
  })
  const MOOD_COLORS = ['', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981']
  return (
    <div className="flex gap-1.5 justify-between">
      {days.map((d) => (
        <div key={d.key} className="flex flex-col items-center gap-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
            style={{
              background: d.mood ? MOOD_COLORS[d.mood] + '30' : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${d.mood ? MOOD_COLORS[d.mood] + '60' : 'rgba(255,255,255,0.08)'}`,
              color: d.mood ? MOOD_COLORS[d.mood] : 'rgba(255,255,255,0.2)',
            }}
          >
            {d.mood || '·'}
          </div>
          <span className="text-xs text-gray-600">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Mood Check-in Modal ───────────────────────────────────────────
function CheckinModal({ onClose, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const OPTIONS = [
    { val: 1, emoji: '😔', label: 'Rëndë' },
    { val: 2, emoji: '😕', label: 'Vështirë' },
    { val: 3, emoji: '😐', label: 'Neutral' },
    { val: 4, emoji: '🙂', label: 'Mirë' },
    { val: 5, emoji: '😊', label: 'Shkëlqyer' },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-sm rounded-3xl overflow-hidden border border-white/10"
        style={{ background: '#0f0f1a' }}>
        <div className="h-1" style={{ background: 'linear-gradient(90deg,#8b5cf6,#ec4899)' }} />
        <div className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Gjendja Sot</p>
          <EditableText as="h3" className="text-lg font-bold text-white mb-6">Si ndihesh sot?</EditableText>
          <div className="flex justify-between gap-2 mb-6">
            {OPTIONS.map((o) => (
              <button key={o.val} onClick={() => setSelected(o.val)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all ${
                  selected === o.val ? 'border-violet-500 bg-violet-500/20' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}>
                <span className="text-2xl">{o.emoji}</span>
                <span className="text-xs text-gray-400">{o.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/15 text-sm text-gray-400 hover:bg-white/5 transition-all">
              Anulo
            </button>
            <button onClick={() => selected && onSubmit(selected)} disabled={!selected}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
              Regjistro +10 XP
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────
export default function EvolutionDashboard() {
  const navigate = useNavigate()
  const evo = useEvolution()
  const [showCheckin, setShowCheckin] = useState(false)
  const [tab, setTab] = useState('today') // today | progress | badges

  const archObj = evo.archetype
    ? PM_ARCHETYPES.find((a) => a.code === evo.archetype.code) || null
    : null

  const { current: level, nextLevel, pct: xpPct, xpInLevel, needed } = getXPProgress(evo.xp)

  // Coach message (deterministic by day)
  const coachMessages = archObj ? (COACH_MESSAGES[archObj.nickname] || []) : []
  const dayIndex = Math.floor(Date.now() / 86400000)
  const todayCoach = coachMessages[dayIndex % Math.max(coachMessages.length, 1)] || null

  // Daily challenges
  const dailyChallenges = getDailyChallenges(archObj?.code || '', 3)

  // Weekly insight (deterministic)
  const weekInsight = WEEKLY_INSIGHTS[dayIndex % WEEKLY_INSIGHTS.length]

  function handleCompleteChallenge(challengeId) {
    if (!evo.isChallengeCompleted(challengeId)) {
      evo.completeChallenge(challengeId)
    }
  }

  function handleCheckin(mood) {
    evo.recordCheckin(mood)
    setShowCheckin(false)
  }

  if (!evo.hasArchetype) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#0a0a12,#0f0f20,#1a0a2e)' }}>
        <div className="text-center px-6 max-w-sm">
          <div className="text-6xl mb-4">🔮</div>
          <EditableText as="h2" className="text-2xl font-bold text-white mb-2">Paneli i Evolucionit</EditableText>
          <EditableText as="p" className="text-gray-400 text-sm mb-6">
            Plotëso PersonaMatrix Assessment për të filluar udhëtimin tënd të vetë-evolucionit.
          </EditableText>
          <button onClick={() => navigate('/tests')}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
            Fillo PersonaMatrix
          </button>
          <button onClick={() => navigate(-1)}
            className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Kthehu prapa
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#080812,#0f0f1e,#160a28)' }}>
      {showCheckin && (
        <CheckinModal onClose={() => setShowCheckin(false)} onSubmit={handleCheckin} />
      )}

      {/* ── Header ── */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            <EditableText>Kthehu</EditableText>
          </button>
          <button onClick={() => navigate('/tests')}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
            <RotateCcw size={13} />
            <EditableText>Bëj testin sërish</EditableText>
          </button>
        </div>

        {/* ── Identity Card ── */}
        <div className="rounded-3xl overflow-hidden border border-white/10 mb-5"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="h-1" style={{ background: archObj?.gradient || 'linear-gradient(135deg,#8b5cf6,#ec4899)' }} />
          <div className="p-5">
            <div className="flex items-center gap-4">
              {/* Archetype avatar */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: archObj?.gradient || 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                {archObj?.emoji || '🔮'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold text-white/40">{evo.archetype?.code}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: archObj?.color || '#8b5cf6' }}>
                    {archObj?.nickname}
                  </span>
                </div>
                <p className="font-bold text-white text-lg leading-tight truncate">{archObj?.name}</p>
                <p className="text-xs text-gray-400">{level.titleSq}</p>
              </div>
              {/* Streak */}
              <div className="shrink-0 text-center">
                <div className="flex items-center gap-1 justify-center mb-0.5">
                  <Flame size={18} className="text-orange-400" />
                  <span className="text-2xl font-bold text-white">{evo.streak}</span>
                </div>
                <p className="text-xs text-gray-500">ditë radhazi</p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{level.emoji}</span>
                  <span className="text-xs font-bold text-white">{level.titleSq}</span>
                </div>
                {nextLevel && (
                  <span className="text-xs text-gray-500">{xpInLevel}/{needed} XP → {nextLevel.titleSq}</span>
                )}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(xpPct, 100)}%`, background: level.gradient }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{evo.xp} XP totale</span>
                <span className="text-xs text-gray-500">{xpPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex rounded-2xl p-1 gap-1 mb-5"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          {[
            { key: 'today',    label: 'Sot' },
            { key: 'progress', label: 'Progresi' },
            { key: 'badges',   label: 'Arritjet' },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t.key ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════ TODAY TAB ════════════════ */}
        {tab === 'today' && (
          <div className="space-y-4">
            {/* AI Coach */}
            {todayCoach && (
              <div className="rounded-2xl border border-violet-500/20 overflow-hidden"
                style={{ background: 'rgba(139,92,246,0.08)' }}>
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <Brain size={14} className="text-violet-400" />
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Këshilltari AI Ditor</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 leading-relaxed">{todayCoach}</p>
                </div>
              </div>
            )}

            {/* Daily Check-in */}
            <div className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-pink-400" />
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Kontrolli Emocional</span>
                </div>
                {evo.todayCheckin && (
                  <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                    <CheckCircle size={12} /> +10 XP
                  </span>
                )}
              </div>
              <div className="p-4">
                <CheckinStrip checkins={evo.checkins} />
                {!evo.todayCheckin && (
                  <button onClick={() => setShowCheckin(true)}
                    className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#ec4899,#f43f5e)' }}>
                    Regjistro gjendjen sot · +10 XP
                  </button>
                )}
              </div>
            </div>

            {/* Daily Challenges */}
            <div className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Zap size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Sfidat e Sotme</span>
                <span className="ml-auto text-xs text-gray-500">secila = +25 XP</span>
              </div>
              <div className="p-4 space-y-3">
                {dailyChallenges.map((ch) => {
                  const done = evo.isChallengeCompleted(ch.id)
                  return (
                    <div key={ch.id}
                      className={`rounded-xl border p-4 transition-all ${
                        done
                          ? 'border-green-500/20 bg-green-500/5'
                          : 'border-white/8 bg-white/3 hover:border-white/15'
                      }`}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{ch.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm font-bold ${done ? 'text-gray-500 line-through' : 'text-white'}`}>
                              {ch.title}
                            </p>
                            <span className="text-xs text-gray-600">{ch.duration}</span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed mb-2">{ch.desc}</p>
                          <p className="text-xs text-violet-400/70 italic">💡 {ch.insight}</p>
                        </div>
                        <button
                          onClick={() => handleCompleteChallenge(ch.id)}
                          disabled={done}
                          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            done
                              ? 'bg-green-500/20 cursor-default'
                              : 'bg-white/8 hover:bg-violet-500/20 hover:border-violet-500/40 border border-white/10'
                          }`}>
                          {done
                            ? <CheckCircle size={16} className="text-green-400" />
                            : <Circle size={16} className="text-gray-500" />
                          }
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Weekly Insight */}
            <div className="rounded-2xl border border-cyan-500/20 p-4"
              style={{ background: 'rgba(6,182,212,0.05)' }}>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp size={13} /> Insight i Javës
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">{weekInsight}</p>
            </div>

            {/* Go to test CTA */}
            <button onClick={() => navigate('/tests')}
              className="w-full py-3.5 rounded-2xl border border-violet-500/30 text-sm font-bold text-violet-400 flex items-center justify-center gap-2 hover:bg-violet-500/10 transition-all">
              <RotateCcw size={15} />
              Bëj PersonaMatrix sërish · +50 XP
            </button>
          </div>
        )}

        {/* ════════════════ PROGRESS TAB ════════════════ */}
        {tab === 'progress' && (
          <div className="space-y-4">
            {/* Dimension scores */}
            {evo.archetype?.scores && (
              <div className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <Brain size={14} className="text-violet-400" />
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Dimensionet e Personalitetit</span>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { key: 'social',       label: 'Energjia Sociale',        color: '#3b82f6' },
                    { key: 'emotional',    label: 'Ndjeshmëria Emocionale',   color: '#ec4899' },
                    { key: 'analytical',   label: 'Mendimi Analitik',         color: '#8b5cf6' },
                    { key: 'drive',        label: 'Forca Drejtimit',          color: '#ef4444' },
                    { key: 'creativity',   label: 'Kreativiteti',             color: '#f59e0b' },
                    { key: 'adaptability', label: 'Adaptueshmëria',           color: '#06b6d4' },
                  ].map(({ key, label, color }) => (
                    <MiniBar key={key}
                      value={evo.archetype.scores[key] || 0}
                      color={color} label={label} />
                  ))}
                </div>
              </div>
            )}

            {/* Advanced metrics */}
            {evo.archetype?.metrics && (
              <div className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-400" />
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Metrikat e Avancuara</span>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { key: 'emotionalIntelligence', label: 'Inteligjenca Emocionale', color: '#ec4899' },
                    { key: 'resilience',             label: 'Rezistenca',             color: '#10b981' },
                    { key: 'strategicThinking',      label: 'Mendimi Strategjik',     color: '#8b5cf6' },
                    { key: 'leadershipIndex',        label: 'Indeksi i Udhëheqjes',   color: '#ef4444' },
                    { key: 'creativityIndex',        label: 'Indeksi Kreativ',        color: '#f59e0b' },
                    { key: 'adaptabilityIndex',      label: 'Adaptueshmëria',         color: '#06b6d4' },
                  ].map(({ key, label, color }) => (
                    <MiniBar key={key}
                      value={evo.archetype.metrics[key] || 0}
                      color={color} label={label} />
                  ))}
                </div>
              </div>
            )}

            {/* Level roadmap */}
            <div className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Star size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Rruga e Evolucionit</span>
              </div>
              <div className="p-4 space-y-3">
                {EVOLUTION_LEVELS.map((lv) => {
                  const isActive = lv.level === level.level
                  const isPassed = lv.level < level.level
                  return (
                    <div key={lv.level}
                      className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                        isActive ? 'border border-white/20 bg-white/8' : ''
                      }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isPassed ? 'opacity-60' : ''
                      }`}
                        style={{ background: isPassed || isActive ? lv.gradient : 'rgba(255,255,255,0.05)' }}>
                        {isPassed ? '✓' : lv.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${isActive ? 'text-white' : isPassed ? 'text-gray-500' : 'text-gray-400'}`}>
                          {lv.titleSq}
                        </p>
                        <p className="text-xs text-gray-600">{lv.minXP}+ XP</p>
                      </div>
                      {isActive && (
                        <span className="text-xs font-bold text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full">
                          Aktuale
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* History */}
            {evo.archetypeHistory.length > 1 && (
              <div className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <Calendar size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Historia e Testeve</span>
                </div>
                <div className="p-4 space-y-2">
                  {evo.archetypeHistory.slice(0, 5).map((h, i) => {
                    const arch = PM_ARCHETYPES.find((a) => a.code === h.code)
                    return (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <span className="text-xl">{arch?.emoji || '🔮'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{arch?.name || h.code}</p>
                          <p className="text-xs text-gray-500">{h.date}</p>
                        </div>
                        <span className="font-mono text-xs text-gray-500">{h.code}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ BADGES TAB ════════════════ */}
        {tab === 'badges' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {BADGES.map((badge) => {
                const earned = evo.badges.includes(badge.id)
                return (
                  <div key={badge.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      earned
                        ? 'border-violet-500/30 bg-violet-500/8'
                        : 'border-white/6 bg-white/2 opacity-50'
                    }`}>
                    <div className="text-3xl mb-2">{earned ? badge.emoji : '🔒'}</div>
                    <p className={`text-sm font-bold mb-1 ${earned ? 'text-white' : 'text-gray-600'}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-500">{badge.desc}</p>
                    {badge.xpNeeded && (
                      <p className="text-xs text-violet-400 mt-1">{badge.xpNeeded} XP</p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Share CTA */}
            <button
              onClick={() => {
                evo.recordShare()
                if (navigator.share && archObj) {
                  navigator.share({
                    title: `Arketipa ime: ${archObj.name}`,
                    text: `Zbulova arketipën time në NeuroSphera PersonaMatrix: ${archObj.nickname} (${archObj.code}) — ${archObj.desc.slice(0, 100)}...`,
                  }).catch(() => {})
                }
              }}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
              <Share2 size={16} />
              Nda Arketipën Tënde · +30 XP
            </button>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  )
}
