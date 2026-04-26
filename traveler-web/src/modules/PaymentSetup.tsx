import { useTranslation, Trans } from 'react-i18next'

export function PaymentSetup() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl border border-amber-500/30 p-4">
        <h3 className="text-amber-400 font-bold text-sm mb-2">⚠️ {t('pay-tip')}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          <Trans i18nKey="pay-tip-desc" components={{ strong: <strong className="text-white" /> }} />
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-sky-500/30 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-xl">💳</div>
          <div>
            <h3 className="font-bold text-white">Alipay <span className="text-sky-400 text-xs">{t('pay-alipay-rec')}</span></h3>
            <p className="text-[10px] text-emerald-400 font-semibold">{t('pay-alipay-tour')}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-sm font-semibold text-white">{t('pay-step1')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('pay-step1-desc')}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-sm font-semibold text-white">{t('pay-step2')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('pay-step2-desc')}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-sm font-semibold text-white">{t('pay-step3')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('pay-step3-desc')}</p>
          </div>
        </div>
        <a
          href="https://render.alipay.com/p/yuyan/180020040001212700/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2.5 rounded-xl bg-sky-500 text-white font-semibold text-sm hover:bg-sky-400 transition text-center"
        >
          {t('pay-btn-alipay')}
        </a>
      </div>

      <div className="glass-panel rounded-2xl border border-emerald-500/30 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">💬</div>
          <div>
            <h3 className="font-bold text-white">WeChat Pay</h3>
            <p className="text-[10px] text-emerald-400 font-semibold">{t('pay-wechat-ess')}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-sm font-semibold text-white">{t('pay-w-step1')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('pay-w-step1-desc')}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-sm font-semibold text-white">{t('pay-w-step2')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('pay-w-step2-desc')}</p>
          </div>
        </div>
        <a
          href="https://weixin.qq.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition text-center"
        >
          {t('pay-btn-wechat')}
        </a>
      </div>
    </div>
  )
}
