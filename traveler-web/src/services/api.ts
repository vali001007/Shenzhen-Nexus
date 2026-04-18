import { spotFusionData } from '../data/spots'
import type { LeaderboardPage, SpotRuntime, MerchantStatus } from '../data/types'
import { getLocaleText } from '../utils/locale'

function getMerchantStatus(spotId: string, merchantName: string): MerchantStatus {
  const hash = (spotId + merchantName).length
  if (hash % 5 === 0) return 'unavailable'
  if (hash % 7 === 0) return 'fallback'
  return 'available'
}

function getSpotWithRuntimeMeta(spot: typeof spotFusionData[number]): SpotRuntime {
  return {
    ...spot,
    merchants: spot.merchants.map((merchant, idx) => ({
      ...merchant,
      merchantId: `${spot.id}-merchant-${idx + 1}`,
      status: getMerchantStatus(spot.id, getLocaleText(merchant.name)),
    })),
  }
}

export async function fetchLeaderboardPage(
  category: string,
  page = 1,
  pageSize = 3,
): Promise<LeaderboardPage> {
  if (!['all', 'landmark', 'tech', 'culture', 'food'].includes(category)) {
    throw new Error('UNSUPPORTED_CATEGORY')
  }

  const sorted = [...spotFusionData]
    .filter((spot) => (category === 'all' ? true : spot.category === category))
    .sort((a, b) => Number(a.rank.replace('#', '')) - Number(b.rank.replace('#', '')))

  const start = (page - 1) * pageSize
  const pageList = sorted.slice(start, start + pageSize)

  await new Promise((resolve) => setTimeout(resolve, 260))

  return {
    items: pageList.map(getSpotWithRuntimeMeta),
    total: sorted.length,
    page,
    pageSize,
    hasMore: start + pageSize < sorted.length,
  }
}

export async function fetchSpotFusionDetail(spotId: string): Promise<SpotRuntime> {
  const spot = spotFusionData.find((s) => s.id === spotId)
  if (!spot) throw new Error('SPOT_NOT_FOUND')

  await new Promise((resolve) => setTimeout(resolve, 260))
  return getSpotWithRuntimeMeta(spot)
}
