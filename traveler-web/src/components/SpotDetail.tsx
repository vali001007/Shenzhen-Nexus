import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import type { SpotRuntime } from '../data/types'
import { useUIStore } from '../stores/useUIStore'
import { MerchantCard } from './MerchantCard'
import { getLocaleText } from '../utils/locale'
import { fetchSpotFusionDetail } from '../services/api'

export function SpotDetail() {
  const { t } = useTranslation()
  const currentSpotId = useUIStore((s) => s.currentSpotId)
  const openModule = useUIStore((s) => s.openModule)

  const [spot, setSpot] = useState<SpotRuntime | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentSpotId) return
    setLoading(true)
    fetchSpotFusionDetail(currentSpotId).then((data) => {
      setSpot(data)
      setLoading(false)
    })
  }, [currentSpotId])

  if (loading || !spot) {
    return (
      <div className="glass-panel rounded-2xl border border-slate-700 p-4 animate-pulse text-sm text-slate-300">
        {t('leader-loading')}
      </div>
    )
  }

  const handleCta = (type: string, merchantId: string) => {
    const merchant = spot.merchants.find((m) => m.merchantId === merchantId)
    const ctx = {
      spotId: spot.id,
      spotTitle: getLocaleText(spot.title),
      merchantId,
      merchantName: merchant ? getLocaleText(merchant.name) : null,
      source: 'fusion_overlay',
      ctaType: type,
    }

    if (type === 'pass') openModule('pass-claim', { ctx })
    else if (type === 'booking') openModule('booking-service', { ctx })
    else if (type === 'translate') openModule('ai-concierge', { ctx })
    else if (type === 'map') openModule('route-directions', { ctx })
  }

  return (
    <div className="space-y-5">
      <img
        src={spot.image}
        className="w-full h-52 object-cover rounded-2xl"
        alt={getLocaleText(spot.title)}
      />

      <div className="space-y-2">
        <h3 className="font-bold text-xl text-white">{getLocaleText(spot.title)}</h3>
        <p className="text-xs text-slate-400">{getLocaleText(spot.subtitle)}</p>
        <p className="text-sm text-slate-300 leading-relaxed">{getLocaleText(spot.description)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {spot.quickTags.map((tag, i) => (
          <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            {getLocaleText(tag)}
          </span>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">{t('leader-route-idea')}</p>
        <p className="text-sm text-slate-200">{getLocaleText(spot.routeIdea)}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('leader-nearby-merchants')}</h4>
        {spot.merchants.map((merchant) => (
          <MerchantCard
            key={merchant.merchantId}
            merchant={merchant}
            onCta={handleCta}
          />
        ))}
      </div>
    </div>
  )
}
