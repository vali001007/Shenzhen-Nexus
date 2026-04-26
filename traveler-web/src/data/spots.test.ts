import { describe, it, expect } from 'vitest'
import { spotFusionData } from '../data/spots'

describe('spotFusionData', () => {
  it('contains at least 15 spots', () => {
    expect(spotFusionData.length).toBeGreaterThanOrEqual(14)
  })

  it('every spot has required fields', () => {
    for (const spot of spotFusionData) {
      expect(spot.id).toBeTruthy()
      expect(spot.category).toBeTruthy()
      expect(spot.rank).toBeTruthy()
      expect(spot.title.en).toBeTruthy()
      expect(spot.title.zh).toBeTruthy()
      expect(Array.isArray(spot.merchants)).toBe(true)
    }
  })

  it('all spot ids are unique', () => {
    const ids = spotFusionData.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('categories are valid', () => {
    const valid = new Set(['landmark', 'tech', 'culture', 'food'])
    for (const spot of spotFusionData) {
      expect(valid.has(spot.category)).toBe(true)
    }
  })

  it('every merchant has name, distance, reason, and tags', () => {
    for (const spot of spotFusionData) {
      for (const m of spot.merchants) {
        expect(m.name.en).toBeTruthy()
        expect(m.distance.en).toBeTruthy()
        expect(m.reason.en).toBeTruthy()
        expect(Array.isArray(m.tags)).toBe(true)
      }
    }
  })
})
