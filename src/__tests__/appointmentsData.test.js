import { describe, it, expect } from 'vitest'
import {
  timeToMinutes,
  minutesToTime,
  generateSlots,
  getAvailableDatesInMonth,
  hasAvailableSlots,
  isUpcoming,
} from '../data/appointmentsData'

// All test dates are in 2027 (future) so "isPast" logic never fires.
// 2027-01-04 = Monday (dow 1), 2027-01-06 = Wednesday (dow 3), 2027-01-10 = Sunday (dow 0)

describe('timeToMinutes', () => {
  it('converts whole hours', () => {
    expect(timeToMinutes('09:00')).toBe(540)
    expect(timeToMinutes('00:00')).toBe(0)
    expect(timeToMinutes('17:00')).toBe(1020)
  })

  it('converts hours with minutes', () => {
    expect(timeToMinutes('09:30')).toBe(570)
    expect(timeToMinutes('17:45')).toBe(1065)
  })
})

describe('minutesToTime', () => {
  it('converts back to HH:MM', () => {
    expect(minutesToTime(540)).toBe('09:00')
    expect(minutesToTime(0)).toBe('00:00')
    expect(minutesToTime(1020)).toBe('17:00')
    expect(minutesToTime(570)).toBe('09:30')
  })

  it('is inverse of timeToMinutes', () => {
    ;['09:00', '10:30', '16:45', '07:00'].forEach(t => {
      expect(minutesToTime(timeToMinutes(t))).toBe(t)
    })
  })
})

describe('generateSlots', () => {
  it('returns empty array for unknown psychologist', () => {
    expect(generateSlots('unknown-id', '2027-01-04', [], [])).toEqual([])
  })

  it('returns empty array when psychologist has no schedule on that weekday', () => {
    // Sunday = dow 0 — elsa-krasniqi has no Sunday schedule
    const slots = generateSlots('elsa-krasniqi', '2027-01-10', [], [])
    expect(slots).toEqual([])
  })

  it('generates correct slots for elsa-krasniqi on Monday (09:00–17:00, 60 min)', () => {
    const slots = generateSlots('elsa-krasniqi', '2027-01-04', [], [])
    expect(slots).toHaveLength(8)
    expect(slots[0]).toMatchObject({ startTime: '09:00', endTime: '10:00', status: 'available' })
    expect(slots[7]).toMatchObject({ startTime: '16:00', endTime: '17:00', status: 'available' })
  })

  it('generates correct slots for elsa-krasniqi on Wednesday (10:00–16:00, 60 min)', () => {
    const slots = generateSlots('elsa-krasniqi', '2027-01-06', [], [])
    expect(slots).toHaveLength(6)
    expect(slots[0]).toMatchObject({ startTime: '10:00', endTime: '11:00', status: 'available' })
    expect(slots[5]).toMatchObject({ startTime: '15:00', endTime: '16:00', status: 'available' })
  })

  it('marks a booked slot correctly', () => {
    const booked = [{ startTime: '09:00', endTime: '10:00' }]
    const slots = generateSlots('elsa-krasniqi', '2027-01-04', booked, [])
    expect(slots[0]).toMatchObject({ startTime: '09:00', status: 'booked' })
    expect(slots[1]).toMatchObject({ startTime: '10:00', status: 'available' })
  })

  it('marks a blocked slot correctly', () => {
    const blocked = [{ psychologistId: 'elsa-krasniqi', date: '2027-01-04', startTime: '11:00', endTime: '12:00' }]
    const slots = generateSlots('elsa-krasniqi', '2027-01-04', [], blocked)
    const slot11 = slots.find(s => s.startTime === '11:00')
    expect(slot11).toMatchObject({ status: 'blocked' })
  })

  it('a global block (null psychologistId) blocks the slot', () => {
    const blocked = [{ psychologistId: null, date: '2027-01-04', startTime: '09:00', endTime: '10:00' }]
    const slots = generateSlots('elsa-krasniqi', '2027-01-04', [], blocked)
    expect(slots[0]).toMatchObject({ startTime: '09:00', status: 'blocked' })
  })

  it('blocked status takes priority over booked', () => {
    const booked  = [{ startTime: '09:00', endTime: '10:00' }]
    const blocked = [{ psychologistId: 'elsa-krasniqi', date: '2027-01-04', startTime: '09:00', endTime: '10:00' }]
    const slots = generateSlots('elsa-krasniqi', '2027-01-04', booked, blocked)
    // blocked check happens after booked in the code, so blocked wins
    expect(slots[0].status).toBe('blocked')
  })

  it('a block for a different psychologist does not affect others', () => {
    const blocked = [{ psychologistId: 'mentor-gashi', date: '2027-01-04', startTime: '09:00', endTime: '10:00' }]
    const slots = generateSlots('elsa-krasniqi', '2027-01-04', [], blocked)
    expect(slots[0]).toMatchObject({ status: 'available' })
  })
})

describe('hasAvailableSlots', () => {
  it('returns true when at least one slot is available', () => {
    expect(hasAvailableSlots('elsa-krasniqi', '2027-01-04', [], [])).toBe(true)
  })

  it('returns false when all slots are booked', () => {
    // elsa Monday: 8 slots 09:00–17:00
    const booked = Array.from({ length: 8 }, (_, i) => ({
      startTime: `${String(9 + i).padStart(2, '0')}:00`,
      endTime:   `${String(10 + i).padStart(2, '0')}:00`,
    }))
    expect(hasAvailableSlots('elsa-krasniqi', '2027-01-04', booked, [])).toBe(false)
  })

  it('returns false for a day with no schedule', () => {
    expect(hasAvailableSlots('elsa-krasniqi', '2027-01-10', [], [])).toBe(false)
  })
})

describe('getAvailableDatesInMonth', () => {
  it('returns a Set', () => {
    const result = getAvailableDatesInMonth('elsa-krasniqi', 2027, 0, [], [])
    expect(result).toBeInstanceOf(Set)
  })

  it('includes working days for elsa-krasniqi in Jan 2027', () => {
    const result = getAvailableDatesInMonth('elsa-krasniqi', 2027, 0, [], [])
    // Jan 4 2027 = Monday → in schedule
    expect(result.has('2027-01-04')).toBe(true)
    // Jan 10 2027 = Sunday → not in schedule
    expect(result.has('2027-01-10')).toBe(false)
  })

  it('does not include past dates', () => {
    // Month 0 of year 2020 is well in the past
    const result = getAvailableDatesInMonth('elsa-krasniqi', 2020, 0, [], [])
    expect(result.size).toBe(0)
  })

  it('returns empty Set for unknown psychologist', () => {
    const result = getAvailableDatesInMonth('unknown', 2027, 0, [], [])
    expect(result.size).toBe(0)
  })
})

describe('isUpcoming', () => {
  it('returns true for a future date+time', () => {
    expect(isUpcoming('2099-12-31', '23:00')).toBe(true)
  })

  it('returns false for a past date+time', () => {
    expect(isUpcoming('2000-01-01', '09:00')).toBe(false)
  })
})
