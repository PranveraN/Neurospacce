import { describe, it, expect } from 'vitest'
import { PLANS, FEATURES } from '../data/plansData'

// Pure canUse logic extracted from usePlan hook — tests the same rules
function canUse(featureKey, planId, isAdmin = false) {
  if (isAdmin) return true
  const row = FEATURES[featureKey]
  if (!row) return true   // unknown feature → open by default
  return row[planId] === true
}

describe('PLANS', () => {
  it('exports free, pro and premium plans', () => {
    expect(PLANS).toHaveProperty('free')
    expect(PLANS).toHaveProperty('pro')
    expect(PLANS).toHaveProperty('premium')
  })

  it('free plan has price 0', () => {
    expect(PLANS.free.price).toBe(0)
  })

  it('pro plan has a positive price', () => {
    expect(PLANS.pro.price).toBeGreaterThan(0)
  })

  it('premium plan price >= pro plan price', () => {
    expect(PLANS.premium.price).toBeGreaterThanOrEqual(PLANS.pro.price)
  })
})

describe('FEATURES', () => {
  it('every feature row has free, pro and premium keys', () => {
    Object.entries(FEATURES).forEach(([key, row]) => {
      expect(row, `${key} missing "free"`).toHaveProperty('free')
      expect(row, `${key} missing "pro"`).toHaveProperty('pro')
      expect(row, `${key} missing "premium"`).toHaveProperty('premium')
    })
  })

  it('premium never restricts what pro can access', () => {
    Object.entries(FEATURES).forEach(([key, row]) => {
      if (row.pro === true) {
        expect(row.premium, `${key}: premium should also be true when pro is true`).toBe(true)
      }
    })
  })
})

describe('canUse — plan enforcement', () => {
  // Paid-only features
  it('free user cannot book appointments', () => {
    expect(canUse('bookAppointment', 'free')).toBe(false)
  })

  it('pro user can book appointments', () => {
    expect(canUse('bookAppointment', 'pro')).toBe(true)
  })

  it('premium user can book appointments', () => {
    expect(canUse('bookAppointment', 'premium')).toBe(true)
  })

  it('free user cannot ask psychologist privately', () => {
    expect(canUse('askPsychologist', 'free')).toBe(false)
    expect(canUse('privateQuestions', 'free')).toBe(false)
    expect(canUse('miniSessions', 'free')).toBe(false)
  })

  // Free features
  it('free user can use AI chat', () => {
    expect(canUse('aiChat', 'free')).toBe(true)
  })

  it('free user can track mood', () => {
    expect(canUse('moodTracking', 'free')).toBe(true)
  })

  it('free user can write journal', () => {
    expect(canUse('journalWrite', 'free')).toBe(true)
  })

  it('free user can use basic techniques', () => {
    expect(canUse('techniquesBasic', 'free')).toBe(true)
  })

  // Admin override
  it('admin can access any feature regardless of plan', () => {
    expect(canUse('bookAppointment', 'free', true)).toBe(true)
    expect(canUse('miniSessions',    'free', true)).toBe(true)
    expect(canUse('aiVoice',         'free', true)).toBe(true)
  })

  // Unknown feature
  it('unknown feature returns true (open by default)', () => {
    expect(canUse('nonExistentFeature', 'free')).toBe(true)
  })

  // Voice is premium-only
  it('free and pro cannot use AI voice, premium can', () => {
    expect(canUse('aiVoice', 'free')).toBe(false)
    expect(canUse('aiVoice', 'pro')).toBe(false)
    expect(canUse('aiVoice', 'premium')).toBe(true)
  })
})
