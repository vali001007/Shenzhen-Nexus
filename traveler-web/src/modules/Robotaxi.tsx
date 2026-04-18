import { useTranslation } from 'react-i18next'

export function Robotaxi() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl border border-fuchsia-500/30 p-5">
        <h3 className="font-bold text-fuchsia-400 text-lg mb-1">{t('robo-title')}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{t('robo-desc-long')}</p>
      </div>

      <div className="space-y-3">
        {[
          { step: 'robo-s1', sub: 'robo-s1-sub', desc: 'robo-s1-desc', num: '1' },
          { step: 'robo-s2', sub: 'robo-s2-sub', desc: 'robo-s2-desc', num: '2' },
          { step: 'robo-s3', sub: 'robo-s3-sub', desc: 'robo-s3-desc', num: '3' },
        ].map((item) => (
          <div key={item.step} className="glass-panel rounded-2xl border border-slate-700 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold text-sm">
                {item.num}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t(item.step)}</p>
                <p className="text-[10px] text-slate-400">{t(item.sub)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-11">{t(item.desc)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
