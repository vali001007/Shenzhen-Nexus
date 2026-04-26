import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'
import { useAppStore } from '../stores/useAppStore'
import { apiPost } from '../services/api'

interface ClaimResponse {
  passId: string
  spotId: string
  merchantId: string
  merchantName: string
  claimedAt: string
  expiresAt: string
  qrPayload: string
  hmac: string
}

export function PassClaim() {
  const { t } = useTranslation()
  const modulePayload = useUIStore((s) => s.modulePayload)
  const showToast = useUIStore((s) => s.showToast)
  const { passes, claimPass } = useAppStore()

  const ctx = (modulePayload?.ctx as any) || {}
  const [claiming, setClaiming] = useState(false)

  const existingPass = passes.find(
    (p) => p.spotId === ctx.spotId && p.merchantId === ctx.merchantId,
  )

  const handleClaim = async () => {
    if (existingPass) {
      showToast(t('pass-duplicate'))
      return
    }

    setClaiming(true)
    try {
      const result = await apiPost<ClaimResponse>('/passes/claim', {
        spotId: ctx.spotId || '',
        merchantId: ctx.merchantId || '',
        merchantName: ctx.merchantName || '',
        source: ctx.source || 'fusion_overlay',
      })

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(result.qrPayload)}`

      claimPass({
        passId: result.passId,
        spotId: result.spotId,
        merchantId: result.merchantId,
        merchantName: result.merchantName,
        source: ctx.source || 'fusion_overlay',
        claimedAt: result.claimedAt,
        expiresAt: result.expiresAt,
        qrCode: qrUrl,
      })

      showToast(t('pass-claimed'))
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        showToast(t('pass-duplicate'))
      } else {
        showToast(e.message || t('pass-claim-failed'))
      }
    } finally {
      setClaiming(false)
    }
  }

  const passItem = existingPass || passes.find(
    (p) => p.spotId === ctx.spotId,
  )

  return (
    <div className="space-y-5">
      <div className="glass-panel p-4 rounded-2xl border border-sky-500/30">
        <p className="text-[10px] uppercase tracking-[0.18em] text-sky-300 font-bold">{t('pass-context')}</p>
        <h3 className="text-white font-bold mt-2 text-base">{ctx.spotTitle || t('pass-spot-empty')}</h3>
        <p className="text-xs text-slate-400 mt-1">{ctx.merchantName || t('pass-merchant-empty')}</p>
      </div>

      {passItem ? (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-emerald-400">✓ {t('pass-claimed')}</p>
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">{t('pass-active')}</span>
          </div>
          <div className="flex justify-center">
            <img
              src={passItem.qrCode}
              alt="QR Code"
              className="w-48 h-48 rounded-xl bg-white p-2"
            />
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <p>passId: {passItem.passId}</p>
            <p>expires: {new Date(passItem.expiresAt).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <button
          className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          onClick={handleClaim}
          disabled={claiming}
        >
          {claiming ? '...' : t('pass-claim')}
        </button>
      )}
    </div>
  )
}
