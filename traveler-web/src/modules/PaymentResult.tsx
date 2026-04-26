import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'

type PaymentResultStatus = 'paid' | 'failed' | 'timeout'

interface PaymentResultPayload {
  status?: PaymentResultStatus
  orderId?: string
}

export function PaymentResult() {
  const { t } = useTranslation()
  const modulePayload = useUIStore((s) => s.modulePayload)
  const closeModule = useUIStore((s) => s.closeModule)
  const openModule = useUIStore((s) => s.openModule)

  const payload = (modulePayload as PaymentResultPayload) || {}
  const status: PaymentResultStatus = payload.status || 'failed'

  const variantMap: Record<PaymentResultStatus, { panelClass: string; badgeClass: string; titleKey: string; descKey: string }> = {
    paid: {
      panelClass: 'border-emerald-500/40 bg-emerald-500/10',
      badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
      titleKey: 'payment-result-paid-title',
      descKey: 'payment-result-paid-desc',
    },
    failed: {
      panelClass: 'border-rose-500/40 bg-rose-500/10',
      badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
      titleKey: 'payment-result-failed-title',
      descKey: 'payment-result-failed-desc',
    },
    timeout: {
      panelClass: 'border-amber-500/40 bg-amber-500/10',
      badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
      titleKey: 'payment-result-timeout-title',
      descKey: 'payment-result-timeout-desc',
    },
  }

  const variant = variantMap[status]

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 ${variant.panelClass}`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300 font-bold">{t('payment-result-title')}</p>
          <span className={`text-[10px] px-2 py-1 rounded-full border ${variant.badgeClass}`}>
            {t(`payment-result-status-${status}`)}
          </span>
        </div>
        <h3 className="text-white font-bold mt-2 text-base">{t(variant.titleKey)}</h3>
        <p className="text-xs text-slate-300 mt-1">{t(variant.descKey)}</p>
        {payload.orderId && <p className="text-xs text-slate-400 mt-3">orderId: {payload.orderId}</p>}
      </div>

      <div className="space-y-2">
        {(status === 'failed' || status === 'timeout') && payload.orderId && (
          <button
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition"
            onClick={() => openModule('booking-service')}
          >
            {t('payment-result-retry')}
          </button>
        )}

        <button
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-3 rounded-xl transition"
          onClick={closeModule}
        >
          {t('payment-result-close')}
        </button>
      </div>
    </div>
  )
}
