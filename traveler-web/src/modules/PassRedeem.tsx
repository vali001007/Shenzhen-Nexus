import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'
import { useAppStore } from '../stores/useAppStore'

export function PassRedeem() {
  const { t } = useTranslation()
  const showToast = useUIStore((s) => s.showToast)
  const { passes, redemptions, redeemPass } = useAppStore()

  const [passIdInput, setPassIdInput] = useState('')
  const [merchantIdInput, setMerchantIdInput] = useState('')

  const handleRedeem = () => {
    if (!passIdInput.trim() || !merchantIdInput.trim()) return

    const pass = passes.find((p) => p.passId === passIdInput.trim())
    if (!pass) {
      showToast(t('redeem-failed'))
      return
    }

    if (redemptions.some((r) => r.passId === passIdInput.trim())) {
      showToast(t('redeem-duplicate'))
      return
    }

    const result = redeemPass(passIdInput.trim(), merchantIdInput.trim())
    if (result) {
      showToast(t('redeem-success'))
    } else {
      showToast(t('redeem-failed'))
    }
  }

  return (
    <div className="space-y-5">
      <div className="glass-panel p-4 rounded-2xl border border-slate-700 space-y-3">
        <label className="text-xs text-slate-400">
          Pass ID
          <input
            type="text"
            className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            placeholder="PASS-..."
            value={passIdInput}
            onChange={(e) => setPassIdInput(e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-400">
          Merchant ID
          <input
            type="text"
            className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            placeholder="e.g. pingan-merchant-1"
            value={merchantIdInput}
            onChange={(e) => setMerchantIdInput(e.target.value)}
          />
        </label>
        <button
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition"
          onClick={handleRedeem}
        >
          {t('redeem-now')}
        </button>
      </div>

      {redemptions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Redemption History</p>
          {[...redemptions].reverse().map((r) => (
            <div key={r.redemptionId} className="glass-panel p-3 rounded-xl border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white font-semibold">{r.redemptionId}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {t('redeem-success')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">passId: {r.passId}</p>
              <p className="text-[10px] text-slate-400">merchantId: {r.merchantId}</p>
              <p className="text-[10px] text-slate-400">{new Date(r.redeemedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
