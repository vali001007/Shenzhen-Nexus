import { useTranslation } from 'react-i18next'
import { MapPin } from 'lucide-react'
import type { SpotRuntime } from '../data/types'
import { getLocaleText } from '../utils/locale'

interface SpotCardProps {
  spot: SpotRuntime
  onClick: () => void
}

export function SpotCard({ spot, onClick }: SpotCardProps) {
  const { t } = useTranslation()

  return (
    <button
      className={`w-full text-left glass-panel rounded-2xl overflow-hidden ${spot.borderClass} border relative cursor-pointer group transition hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(56,189,248,0.12)]`}
      onClick={onClick}
    >
      <img
        src={spot.image}
        className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition duration-300"
        alt={getLocaleText(spot.title)}
      />
      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 border border-slate-700">
        <MapPin className="w-3 h-3 text-sky-400" />
        <span>{t(spot.checkinsKey)}</span>
      </div>
      <div className={`absolute top-3 left-3 ${spot.rankClass} text-xs w-7 h-7 flex items-center justify-center rounded-full font-bold`}>
        {spot.rank.replace('#', '')}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-bold text-base text-white">{getLocaleText(spot.title)}</h4>
          <p className="text-xs text-slate-400 mt-1">{getLocaleText(spot.subtitle)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {spot.quickTags.map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
              {getLocaleText(tag)}
            </span>
          ))}
        </div>
        <div className="rounded-2xl bg-slate-950/50 border border-slate-800 p-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 font-bold">{t('leader-scene-fit')}</p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{getLocaleText(spot.sceneFit)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-sky-400 font-semibold">{getLocaleText(spot.merchantCount)}</span>
          <span className="text-[10px] text-slate-500">{t('leader-card-cta')} →</span>
        </div>
      </div>
    </button>
  )
}
