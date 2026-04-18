import { describe, it, expect } from 'vitest'
import { validateEventPayload } from './useTracking'

describe('validateEventPayload', () => {
  it('passes through for unregistered events (no required fields)', () => {
    expect(validateEventPayload('some_unknown_event', {})).toBe(true)
    expect(validateEventPayload('some_unknown_event', { foo: 'bar' })).toBe(true)
  })

  it('returns false when a registered event is missing required fields', () => {
    expect(
      validateEventPayload('spot_card_click', { sessionId: 's1' }),
    ).toBe(false)
  })

  it('returns true when a registered event has all required fields', () => {
    expect(
      validateEventPayload('spot_card_click', {
        sessionId: 's1',
        spotId: 'sp1',
        category: 'landmark',
      }),
    ).toBe(true)
  })

  it('treats null and undefined as missing', () => {
    expect(
      validateEventPayload('spot_card_click', {
        sessionId: 's1',
        spotId: null,
        category: 'landmark',
      }),
    ).toBe(false)
    expect(
      validateEventPayload('spot_card_click', {
        sessionId: 's1',
        spotId: undefined,
        category: 'landmark',
      }),
    ).toBe(false)
  })

  it('accepts empty strings as present (current behaviour: only nil is rejected)', () => {
    expect(
      validateEventPayload('spot_card_click', {
        sessionId: '',
        spotId: '',
        category: '',
      }),
    ).toBe(true)
  })

  it('validates the full redemption event tuple end-to-end', () => {
    const full = {
      sessionId: 's1',
      spotId: 'sp1',
      merchantId: 'm1',
      passId: 'p1',
      redemptionId: 'r1',
    }
    expect(validateEventPayload('redeem_success_by_spot', full)).toBe(true)
    expect(
      validateEventPayload('redeem_success_by_spot', {
        ...full,
        redemptionId: undefined,
      }),
    ).toBe(false)
  })
})
