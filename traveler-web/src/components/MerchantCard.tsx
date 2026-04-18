import { Ticket, CalendarCheck, MessageCircle, Navigation } from 'lucide-react'
import type { Merchant } from '../data/types'
import { getLocaleText } from '../utils/locale'
import { useLangStore } from '../stores/useLangStore'

interface MerchantCardProps {
  merchant: Merchant
  onCta: (type: string, merchantId: string) => void
}

const ctaButtons = [
  { type: 'pass', icon: Ticket, labelZh: '权益', labelEn: 'Pass', color: 'bg-sky-500/20 text-sky-400 border-sky-500/40 hover:bg-sky-500/30' },
  { type: 'booking', icon: CalendarCheck, labelZh: '预约', labelEn: 'Book', color: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40 hover:bg-fuchsia-500/30' },
  { type: 'translate', icon: MessageCircle, labelZh: '沟通', labelEn: 'Chat', color: 'bg-slate-700/60 text-slate-300 border-slate-600 hover:bg-slate-700' },
  { type: 'map', icon: Navigation, labelZh: '导航', labelEn: 'Nav', color: 'bg-slate-700/60 text-slate-300 border-slate-600 hover:bg-slate-700' },
]

export function MerchantCard({ merchant, onCta }: MerchantCardProps) {
  const isZh = useLangStore((s) => s.currentLang) === 'zh'

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-700 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-white text-sm">{getLocaleText(merchant.name)}</h4>
          <p className="text-[10px] uppercase tracking-wider text-sky-400 mt-1">
            {getLocaleText(merchant.distance)}
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border-emerald-500/30 border font-bold">
          {isZh ? '可承接' : 'Available'}
        </span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{getLocaleText(merchant.reason)}</p>
      <div className="flex flex-wrap gap-2">
        {merchant.tags.map((tag, i) => (
          <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            {getLocaleText(tag)}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {ctaButtons.map((btn) => {
          const Icon = btn.icon
          return (
            <button
              key={btn.type}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-[10px] font-semibold transition ${btn.color}`}
              onClick={() => onCta(btn.type, merchant.merchantId)}
            >
              <Icon className="w-4 h-4" />
              {isZh ? btn.labelZh : btn.labelEn}
            </button>
          )
        })}
      </div>
    </div>
  )
}
