import { useTranslation } from 'react-i18next'
import { useAppStore } from '../stores/useAppStore'

export function PassRedeem() {
  const { t } = useTranslation()
  const { passes, redemptions } = useAppStore()

  return (
    <div className="space-y-5">
      {passes.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('pass-my-passes') || 'My Passes'}</p>
          {[...passes].reverse().map((p) => {
            const redeemed = redemptions.find((r) => r.passId === p.passId)
            const expired = new Date(p.expiresAt) < new Date()
            const statusLabel = redeemed ? t('redeem-success') : expired ? (t('pass-expired') || 'Expired') : t('pass-active')
            const statusColor = redeemed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : expired ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : 'bg-sky-500/20 text-sky-300 border-sky-500/30'

            return (
              <div key={p.passId} className="glass-panel p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-semibold">{p.merchantName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusColor}`}>{statusLabel}</span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <p>passId: {p.passId}</p>
                  <p>claimed: {new Date(p.claimedAt).toLocaleString()}</p>
                  <p>expires: {new Date(p.expiresAt).toLocaleString()}</p>
                  {redeemed && <p>redeemed: {new Date(redeemed.redeemedAt).toLocaleString()}</p>}
                </div>
                {!redeemed && !expired && (
                  <div className="flex justify-center pt-2">
                    <img src={p.qrCode} alt="QR" className="w-32 h-32 rounded-lg bg-white p-1" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-slate-500 text-sm">{t('pass-no-passes') || 'No passes yet'}</p>
        </div>
      )}
    </div>
  )
}
