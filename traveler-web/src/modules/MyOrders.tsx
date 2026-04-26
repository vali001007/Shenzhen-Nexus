import { useTranslation } from 'react-i18next'
import { useAppStore } from '../stores/useAppStore'
import { useUIStore } from '../stores/useUIStore'

export function MyOrders() {
  const { t } = useTranslation()
  const orders = useAppStore((s) => s.orders)
  const openModule = useUIStore((s) => s.openModule)

  const sorted = [...orders].reverse()

  const statusClass = (status: string) => {
    if (status === 'paid') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    if (status === 'failed') return 'bg-rose-500/20 text-rose-200 border-rose-500/40'
    if (status === 'cancelled') return 'bg-amber-500/20 text-amber-200 border-amber-500/40'
    if (status === 'refunded') return 'bg-purple-500/20 text-purple-200 border-purple-500/40'
    return 'bg-sky-500/20 text-sky-200 border-sky-500/40'
  }

  const statusLabel = (status: string) =>
    t(`order-status-${status === 'pending_payment' ? 'pending' : status}`)

  const serviceLabel = (type: string) => {
    const map: Record<string, string> = {
      concierge: t('order-service-concierge'),
      guide: t('order-service-guide'),
      'business-dining': t('order-service-dining'),
      photo: t('order-service-photo'),
    }
    return map[type] ?? type
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <span className="text-4xl">🧾</span>
        <p className="text-slate-500 text-sm">{t('profile-orders-empty')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-6">
      {sorted.map((o) => (
        <div key={o.orderId} className="glass-panel p-4 rounded-2xl border border-slate-700 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-white truncate">{serviceLabel(o.serviceType)}</span>
            <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusClass(o.status)}`}>
              {statusLabel(o.status)}
            </span>
          </div>
          <div className="text-xs text-slate-400 space-y-0.5">
            {o.merchantName && <p className="text-slate-300 font-medium">{o.merchantName}</p>}
            <p>{o.date} {o.time} · {t('order-field-partysize')} {o.guests}</p>
            <p className="text-slate-500 font-mono text-[10px]">{o.orderId}</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-bold text-white">¥{o.amount}</span>
            {o.status === 'pending_payment' && (
              <button
                className="text-xs bg-sky-500 hover:bg-sky-400 text-white font-bold px-3 py-1.5 rounded-lg transition"
                onClick={() => openModule('booking-service', { ctx: { spotId: o.spotId, merchantId: o.merchantId, merchantName: o.merchantName } })}
              >
                {t('order-pay')}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
