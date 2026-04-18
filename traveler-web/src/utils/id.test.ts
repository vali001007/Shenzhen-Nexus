import { describe, it, expect } from 'vitest'
import { generateId } from './id'

describe('generateId', () => {
  it('uses SNX as the default prefix', () => {
    const id = generateId()
    expect(id.startsWith('SNX-')).toBe(true)
  })

  it('uses the provided prefix', () => {
    const id = generateId('ORD')
    expect(id.startsWith('ORD-')).toBe(true)
  })

  it('follows the {prefix}-{epoch}-{6 base36 chars} format', () => {
    const id = generateId('PASS')
    const match = id.match(/^PASS-(\d+)-([0-9a-z]{6})$/)
    expect(match).not.toBeNull()
    const epoch = Number(match![1])
    expect(Number.isFinite(epoch)).toBe(true)
    expect(epoch).toBeGreaterThan(0)
  })

  it('produces 100 unique ids back-to-back', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) ids.add(generateId())
    expect(ids.size).toBe(100)
  })
})
