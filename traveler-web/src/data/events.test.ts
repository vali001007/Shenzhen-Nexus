import { describe, it, expect } from 'vitest'
import { EVENT_REQUIRED_FIELDS } from './events'

describe('EVENT_REQUIRED_FIELDS', () => {
  it('declares exactly 18 tracked events (matches CLAUDE.md spec)', () => {
    expect(Object.keys(EVENT_REQUIRED_FIELDS)).toHaveLength(18)
  })

  it('every entry is a non-empty array of non-empty strings', () => {
    for (const [name, fields] of Object.entries(EVENT_REQUIRED_FIELDS)) {
      expect(Array.isArray(fields)).toBe(true)
      expect(fields.length).toBeGreaterThan(0)
      for (const f of fields) {
        expect(typeof f).toBe('string')
        expect(f.length).toBeGreaterThan(0)
        expect(name).toBeTruthy()
      }
    }
  })

  it('every event requires sessionId', () => {
    for (const fields of Object.values(EVENT_REQUIRED_FIELDS)) {
      expect(fields).toContain('sessionId')
    }
  })

  it('spot_card_click requires sessionId, spotId, category', () => {
    expect(EVENT_REQUIRED_FIELDS.spot_card_click).toEqual([
      'sessionId',
      'spotId',
      'category',
    ])
  })

  it('redeem_success_by_spot requires the full redemption tuple', () => {
    expect(EVENT_REQUIRED_FIELDS.redeem_success_by_spot).toEqual([
      'sessionId',
      'spotId',
      'merchantId',
      'passId',
      'redemptionId',
    ])
  })

  it('all 4 fusion CTA events share the same required field shape', () => {
    const ctaEvents = [
      'fusion_cta_click_pass',
      'fusion_cta_click_booking',
      'fusion_cta_click_translate',
      'fusion_cta_click_map',
    ]
    for (const e of ctaEvents) {
      expect(EVENT_REQUIRED_FIELDS[e]).toEqual([
        'sessionId',
        'spotId',
        'merchantId',
        'ctaType',
      ])
    }
  })
})
