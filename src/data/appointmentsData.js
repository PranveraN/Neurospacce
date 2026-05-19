// ── Storage key for admin blocked times (localStorage only) ──────────────────
const BLOCKED_KEY = 'ns_blocked_times'

// ── Time helpers ──────────────────────────────────────────────────────────────

/** @param {string} t - "HH:MM"  @returns {number} */
export function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** @param {number} mins  @returns {string} "HH:MM" */
export function minutesToTime(mins) {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
}

// ── Availability rules (dayOfWeek: 0=Sun 1=Mon … 6=Sat) ──────────────────────
export const AVAILABILITY_RULES = {
  'elsa-krasniqi': {
    schedule: {
      1: ['09:00', '17:00'],
      2: ['09:00', '17:00'],
      3: ['10:00', '16:00'],
      4: ['09:00', '17:00'],
      5: ['09:00', '13:00'],
    },
    slotDuration: 60,
  },
  'mentor-gashi': {
    schedule: {
      1: ['10:00', '18:00'],
      2: ['10:00', '18:00'],
      3: ['10:00', '18:00'],
    },
    slotDuration: 60,
  },
  'arjeta-berisha': {
    schedule: {
      2: ['09:00', '17:00'],
      3: ['09:00', '17:00'],
      4: ['09:00', '17:00'],
      6: ['10:00', '14:00'],
    },
    slotDuration: 60,
  },
  'blerim-hoxha': {
    schedule: {
      1: ['09:00', '15:00'],
      3: ['09:00', '15:00'],
      5: ['09:00', '15:00'],
    },
    slotDuration: 60,
  },
  'lara-osmani': {
    schedule: {
      1: ['08:00', '16:00'],
      2: ['08:00', '16:00'],
      3: ['08:00', '16:00'],
      4: ['08:00', '16:00'],
      5: ['08:00', '16:00'],
    },
    slotDuration: 60,
  },
  'drita-halili': {
    schedule: {
      1: ['11:00', '19:00'],
      2: ['11:00', '19:00'],
      3: ['11:00', '19:00'],
      4: ['11:00', '19:00'],
    },
    slotDuration: 60,
  },
  'ilir-sejdini': {
    schedule: {
      2: ['09:00', '17:00'],
      4: ['09:00', '17:00'],
    },
    slotDuration: 60,
  },
  'valbona-curri': {
    schedule: {
      1: ['07:00', '15:00'],
      2: ['07:00', '15:00'],
      3: ['07:00', '15:00'],
      4: ['07:00', '15:00'],
      5: ['07:00', '15:00'],
    },
    slotDuration: 60,
  },
}

// ── Admin blocked times (localStorage — admin-only feature) ───────────────────
export function getBlockedTimes() {
  try { return JSON.parse(localStorage.getItem(BLOCKED_KEY) || '[]') } catch { return [] }
}
export function saveBlockedTimes(list) {
  localStorage.setItem(BLOCKED_KEY, JSON.stringify(list))
}

/**
 * @param {{ psychologistId?: string|null, date: string, startTime: string, endTime: string, reason?: string }} _
 * @returns {{ success: true, entry: object }}
 */
export function blockTime({ psychologistId = null, date, startTime, endTime, reason = '' }) {
  const entry = {
    id: `blk_${Date.now()}`,
    psychologistId,
    date,
    startTime,
    endTime,
    reason,
    createdAt: new Date().toISOString(),
  }
  saveBlockedTimes([...getBlockedTimes(), entry])
  return { success: true, entry }
}

export function unblockTime(id) {
  saveBlockedTimes(getBlockedTimes().filter(b => b.id !== id))
  return { success: true }
}

/**
 * @param {string} psychologistId
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {{ startTime: string, endTime: string }[]} bookedSlots - pre-fetched confirmed bookings
 * @param {{ psychologistId: string|null, date: string, startTime: string, endTime: string }[]} blockedTimes
 * @returns {{ startTime: string, endTime: string, status: 'available'|'booked'|'blocked'|'past' }[]}
 */
export function generateSlots(psychologistId, dateStr, bookedSlots = [], blockedTimes = []) {
  const rules = AVAILABILITY_RULES[psychologistId]
  if (!rules) return []

  const date  = new Date(`${dateStr}T00:00:00`)
  const dow   = date.getDay()
  const hours = rules.schedule[dow]
  if (!hours) return []

  const [startStr, endStr] = hours
  const start    = timeToMinutes(startStr)
  const end      = timeToMinutes(endStr)
  const duration = rules.slotDuration || 60

  const dayBlocked = blockedTimes.filter(
    b => (b.psychologistId === psychologistId || !b.psychologistId) && b.date === dateStr
  )

  const now        = new Date()
  const isToday    = dateStr === now.toISOString().split('T')[0]
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const slots  = []
  let current  = start

  while (current + duration <= end) {
    const startTime = minutesToTime(current)
    const endTime   = minutesToTime(current + duration)

    const isPast = isToday && current <= nowMinutes

    const isBooked = bookedSlots.some(a => {
      const aStart = timeToMinutes(a.startTime)
      const aEnd   = timeToMinutes(a.endTime)
      return current < aEnd && current + duration > aStart
    })

    const isBlocked = dayBlocked.some(b => {
      const bStart = timeToMinutes(b.startTime)
      const bEnd   = timeToMinutes(b.endTime)
      return current < bEnd && current + duration > bStart
    })

    let status = 'available'
    if (isPast)         status = 'past'
    else if (isBlocked) status = 'blocked'
    else if (isBooked)  status = 'booked'

    slots.push({ startTime, endTime, status })
    current += duration
  }

  return slots
}

/**
 * @param {string} psychologistId
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {{ startTime: string, endTime: string }[]} bookedSlots
 * @param {object[]} blockedTimes
 * @returns {boolean}
 */
export function hasAvailableSlots(psychologistId, dateStr, bookedSlots = [], blockedTimes = []) {
  return generateSlots(psychologistId, dateStr, bookedSlots, blockedTimes).some(s => s.status === 'available')
}

/**
 * @param {string} psychologistId
 * @param {number} year
 * @param {number} month - 0-indexed (0 = January)
 * @param {{ date: string, startTime: string, endTime: string }[]} monthBookings - non-cancelled bookings
 * @param {object[]} blockedTimes
 * @returns {Set<string>} set of "YYYY-MM-DD" strings with at least one available slot
 */
export function getAvailableDatesInMonth(psychologistId, year, month, monthBookings = [], blockedTimes = []) {
  const available   = new Set()
  const today       = new Date(); today.setHours(0, 0, 0, 0)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    if (date < today) continue
    const dateStr    = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayBooked  = monthBookings.filter(b => b.date === dateStr)
    if (hasAvailableSlots(psychologistId, dateStr, dayBooked, blockedTimes)) {
      available.add(dateStr)
    }
  }
  return available
}

// ── Display helpers ───────────────────────────────────────────────────────────

/** @param {string} dateStr - "YYYY-MM-DD"  @returns {string} long locale string */
export function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('sq-AL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

/** @param {string} dateStr - "YYYY-MM-DD"  @returns {string} short locale string */
export function formatShortDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('sq-AL', {
    month: 'short', day: 'numeric',
  })
}

/**
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {string} startTime - "HH:MM"
 * @returns {boolean}
 */
export function isUpcoming(dateStr, startTime) {
  return new Date(`${dateStr}T${startTime}`) > new Date()
}

export const STATUS_COLORS = {
  booked:    { bg: '#eff6ff', text: '#1d4ed8', label: 'Rezervuar'  },
  pending:   { bg: '#fefce8', text: '#b45309', label: 'Në pritje'  },
  completed: { bg: '#f0fdf4', text: '#166534', label: 'Përfunduar' },
  cancelled: { bg: '#fef2f2', text: '#dc2626', label: 'Anuluar'    },
  conflict:  { bg: '#fff7ed', text: '#c2410c', label: 'Konflikt'   },
}
