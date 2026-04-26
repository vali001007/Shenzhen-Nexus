import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'
import { MapPin, Navigation } from 'lucide-react'

export function RouteDirections() {
  const { t } = useTranslation()
  const modulePayload = useUIStore((s) => s.modulePayload)

  const ctx = (modulePayload?.ctx as any) || {}

  return (
    <div className="space-y-5">
      <div className="glass-panel p-5 rounded-2xl border border-sky-500/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">{ctx.spotTitle || 'Destination'}</h3>
            <p className="text-xs text-slate-400">{ctx.merchantName || ''}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Navigation className="w-4 h-4 text-sky-400" />
            <span>{ctx.merchantName ? `${t('leader-btn-map')} → ${ctx.merchantName}` : t('leader-btn-map')}</span>
          </div>
          <p className="text-xs text-slate-500">
            spotId: {ctx.spotId || 'N/A'} | merchantId: {ctx.merchantId || 'N/A'}
          </p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-amber-500/30">
        <h4 className="text-amber-400 font-bold text-sm mb-2">🗺️ {t('mob-map-adv')}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t('route-maps-tip')}
        </p>
      </div>

      <button
        className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition"
        onClick={() => {
          const query = encodeURIComponent(ctx.spotTitle || 'Shenzhen')
          window.open(`https://maps.apple.com/?q=${query}`, '_blank')
        }}
      >
        {t('route-open-maps')}
      </button>
    </div>
  )
}
