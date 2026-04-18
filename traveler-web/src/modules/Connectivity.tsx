import { useTranslation } from 'react-i18next'

export function Connectivity() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl border border-red-500/30 p-4">
        <h3 className="text-red-400 font-bold text-sm mb-2">⚠️ {t('conn-restrict')}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{t('conn-restrict-desc')}</p>
      </div>

      <div className="glass-panel rounded-2xl border border-emerald-500/30 p-5 space-y-3">
        <div>
          <h3 className="font-bold text-emerald-400 text-sm">{t('conn-s1')}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{t('conn-s1-sub')}</p>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{t('conn-s1-desc')}</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700 p-5 space-y-3">
        <div>
          <h3 className="font-bold text-sky-400 text-sm">{t('conn-s2')}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{t('conn-s2-sub')}</p>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{t('conn-s2-desc')}</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2 bg-slate-800/50 rounded-xl p-3">
            <span className="text-sky-400 text-sm mt-0.5">1.</span>
            <p className="text-xs text-slate-300">{t('conn-s2-l1')}</p>
          </div>
          <div className="flex items-start gap-2 bg-slate-800/50 rounded-xl p-3">
            <span className="text-sky-400 text-sm mt-0.5">2.</span>
            <p className="text-xs text-slate-300">{t('conn-s2-l2')}</p>
          </div>
          <div className="flex items-start gap-2 bg-slate-800/50 rounded-xl p-3">
            <span className="text-sky-400 text-sm mt-0.5">3.</span>
            <p className="text-xs text-slate-300">{t('conn-s2-l3')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
