import { describe, it, expect } from 'vitest'
import { detectTopic, isCrisis, pickRandomTip, TIPS, CRISIS_WORDS } from '../data/aiChatData'

describe('detectTopic', () => {
  it('detects anxiety', () => {
    expect(detectTopic('ndihem nën ankth sot')).toBe('anxiety')
    expect(detectTopic('kam panik')).toBe('anxiety')
    expect(detectTopic('frikë nga e ardhmja')).toBe('anxiety')
  })

  it('detects stress', () => {
    expect(detectTopic('jam nën stres nga puna')).toBe('stress')
    expect(detectTopic('ndihem shumë i ngarkuar')).toBe('stress')
    expect(detectTopic('presion i madh')).toBe('stress')
  })

  it('detects tiredness', () => {
    expect(detectTopic('ndihem shumë i lodhur')).toBe('tired')
    expect(detectTopic('nuk fle mirë')).toBe('tired')
    expect(detectTopic('jam i rraskapitur')).toBe('tired')
  })

  it('detects focus issues', () => {
    expect(detectTopic('kam probleme me fokus')).toBe('focus')
    expect(detectTopic('nuk mund të koncentrohem')).toBe('focus')
    expect(detectTopic('vëmendja ime shpërhapet')).toBe('focus')
  })

  it('detects overthinking', () => {
    expect(detectTopic('mendoj shumë gjëra çdo ditë')).toBe('overthinking')
    expect(detectTopic('mendjet nuk ndalen kurrë')).toBe('overthinking')
  })

  it('detects burnout', () => {
    expect(detectTopic('ndihem i ezauruar plotësisht')).toBe('burnout')
    expect(detectTopic('nuk i gjej kuptim gjërave')).toBe('burnout')
  })

  it('detects emptiness', () => {
    expect(detectTopic('ndihem bosh brenda')).toBe('empty')
    expect(detectTopic('kam vakëti të madhe')).toBe('empty')
  })

  it('returns null for unrecognised input', () => {
    expect(detectTopic('mirëdita')).toBeNull()
    expect(detectTopic('si jeni sot')).toBeNull()
    expect(detectTopic('')).toBeNull()
  })

  it('is case-insensitive', () => {
    expect(detectTopic('ANKTH I MADH')).toBe('anxiety')
    expect(detectTopic('STRES')).toBe('stress')
  })

  it('anxiety takes priority over later topics when both keywords present', () => {
    // 'ankth' appears before 'stres' in detectTopic checks
    expect(detectTopic('ndihem nën ankth dhe stres')).toBe('anxiety')
  })
})

describe('isCrisis', () => {
  it('returns true for each crisis keyword', () => {
    CRISIS_WORDS.forEach(word => {
      expect(isCrisis(word)).toBe(true)
    })
  })

  it('returns true for a sentence containing a crisis keyword', () => {
    expect(isCrisis('kam mendime për vetëvrasje shpesh')).toBe(true)
    expect(isCrisis('dua të vdes')).toBe(true)
    expect(isCrisis('nuk dua të jetoj më')).toBe(true)
  })

  it('returns false for normal mental health messages', () => {
    expect(isCrisis('ndihem nën stres sot')).toBe(false)
    expect(isCrisis('kam probleme me gjumin')).toBe(false)
    expect(isCrisis('dua ndihmë')).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isCrisis('VETËVRASJE')).toBe(true)
  })
})

describe('pickRandomTip', () => {
  it('returns a tip object with expected shape', () => {
    const tip = pickRandomTip('anxiety')
    expect(tip).toHaveProperty('id')
    expect(tip).toHaveProperty('text')
  })

  it('falls back to anxiety tips for unknown topic', () => {
    const tip = pickRandomTip('unknown_topic')
    // Should return an anxiety tip (fallback)
    const anxietyIds = (TIPS.anxiety || []).map(t => t.id)
    expect(anxietyIds).toContain(tip.id)
  })

  it('respects used IDs — does not return an already-used tip', () => {
    const allTips = TIPS.anxiety || []
    if (allTips.length < 2) return // skip if not enough tips

    const first = pickRandomTip('anxiety')
    const usedIds = new Set([first.id])
    const second = pickRandomTip('anxiety', usedIds)
    expect(second.id).not.toBe(first.id)
  })

  it('returns first tip when all are used (no crash)', () => {
    const allTips = TIPS.anxiety || []
    const usedIds = new Set(allTips.map(t => t.id))
    const tip = pickRandomTip('anxiety', usedIds)
    expect(tip).toBeDefined()
    expect(tip).toHaveProperty('id')
  })
})
