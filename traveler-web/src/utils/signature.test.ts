import { describe, it, expect } from 'vitest'
import { computeSignature } from './signature'

const base = { orderId: 'ORD-1', paymentIntentId: 'PI-1', status: 'paid' }

describe('computeSignature', () => {
  it('returns a 24-character base64 fragment', () => {
    const sig = computeSignature(base)
    expect(sig).toHaveLength(24)
    expect(typeof sig).toBe('string')
    expect(sig.length).toBeGreaterThan(0)
  })

  it('is deterministic for the same payload', () => {
    expect(computeSignature(base)).toBe(computeSignature({ ...base }))
  })

  it('changes when orderId changes', () => {
    expect(computeSignature(base)).not.toBe(
      computeSignature({ ...base, orderId: 'ORD-2' }),
    )
  })

  it('changes when paymentIntentId changes', () => {
    expect(computeSignature(base)).not.toBe(
      computeSignature({ ...base, paymentIntentId: 'PI-2' }),
    )
  })

  it('changes when status changes', () => {
    expect(computeSignature(base)).not.toBe(
      computeSignature({ ...base, status: 'failed' }),
    )
  })

  it('produces a stable non-empty signature for an empty payload', () => {
    const sig = computeSignature({})
    expect(sig).toHaveLength(24)
    expect(sig).toBe(computeSignature({}))
  })
})
