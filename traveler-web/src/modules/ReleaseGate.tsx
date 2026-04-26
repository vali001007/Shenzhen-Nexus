import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../stores/useAppStore'

interface CheckItem {
  id: string
  label: string
  check: () => boolean
}

export function ReleaseGate() {
  const { t } = useTranslation()
  const { orders, passes, redemptions, events } = useAppStore()
  const [ran, setRan] = useState(false)

  const checks: CheckItem[] = [
    { id: 'spots', label: t('qa-check-spots'), check: () => true },
    { id: 'i18n', label: t('qa-check-i18n'), check: () => true },
    { id: 'order', label: t('qa-check-order'), check: () => orders.length > 0 },
    { id: 'paid', label: t('qa-check-paid'), check: () => orders.some((o) => o.status === 'paid') },
    { id: 'pass', label: t('qa-check-pass'), check: () => passes.length > 0 },
    { id: 'redeem', label: t('qa-check-redeem'), check: () => redemptions.length > 0 },
    { id: 'events', label: t('qa-check-events'), check: () => events.length > 0 },
  ]

  const results = checks.map((c) => ({ ...c, passed: c.check() }))
  const allPassed = results.every((r) => r.passed)

  return (
    <div className="space-y-5">
      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-sm hover:from-sky-400 hover:to-indigo-400 transition"
        onClick={() => setRan(true)}
      >
        {t('qa-run')}
      </button>

      {ran && (
        <>
          <div className="space-y-2">
            {results.map((r) => (
              <div key={r.id} className={`glass-panel p-3 rounded-xl border ${r.passed ? 'border-emerald-500/30' : 'border-rose-500/30'} flex items-center justify-between`}>
                <span className="text-xs text-slate-300">{r.label}</span>
                <span className={`text-xs font-bold ${r.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {r.passed ? '✓ PASS' : '✗ FAIL'}
                </span>
              </div>
            ))}
          </div>

          <div className={`glass-panel p-4 rounded-2xl border ${allPassed ? 'border-emerald-500/50' : 'border-rose-500/50'} text-center`}>
            <p className={`font-bold text-lg ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {allPassed ? t('qa-pass') : t('qa-fail')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {results.filter((r) => r.passed).length}/{results.length} {t('qa-checks-passed')}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
