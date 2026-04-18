import { spotFusionData } from '../data/spots'
import type { Spot, SpotRuntime, Merchant, MerchantStatus } from '../data/types'
import { useAppStore } from '../stores/useAppStore'

function getMerchantStatus(_spotId: string, _merchantName: string): MerchantStatus {
  return 'available'
}

export function getSpotById(spotId: string): Spot | undefined {
  return spotFusionData.find((s) => s.id === spotId)
}

export function getSpotWithRuntimeMeta(spot: Spot): SpotRuntime {
  return {
    ...spot,
    merchants: spot.merchants.map((merchant, idx) => ({
      ...merchant,
      merchantId: `${spot.id}-merchant-${idx + 1}`,
      status: getMerchantStatus(spot.id, merchant.name.en),
    })),
  }
}

export function getPreferredMerchant(spot: SpotRuntime): Merchant | null {
  const selectedId = useAppStore.getState().selectedMerchantBySpot[spot.id]
  const selected = spot.merchants.find((m) => m.merchantId === selectedId)
  if (selected && selected.status === 'available') return selected
  return spot.merchants.find((m) => m.status === 'available') || spot.merchants[0] || null
}
