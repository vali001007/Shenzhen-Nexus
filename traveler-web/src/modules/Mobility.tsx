import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Volume2, Loader } from 'lucide-react'
import { speakText } from '../services/audio'
import { useUIStore } from '../stores/useUIStore'

export function Mobility() {
  const { t } = useTranslation()
  const showToast = useUIStore((s) => s.showToast)

  const phrases = [
    { key: 'mob-p1-en' },
    { key: 'mob-p2-en' },
  ]

  const [speakingKey, setSpeakingKey] = useState<string | null>(null)

  const handleSpeak = async (key: string) => {
    const text = t(key)
    setSpeakingKey(key)
    try {
      await speakText(text)
    } catch (err: any) {
      showToast(err.message || 'TTS failed')
    } finally {
      setSpeakingKey(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl border border-amber-500/30 p-4">
        <h3 className="text-amber-400 font-bold text-sm mb-2">🗺️ {t('mob-map-adv')}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          <Trans i18nKey="mob-map-desc" components={{ strong: <strong className="text-white" /> }} />
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700 p-5 space-y-4">
        <h3 className="font-bold text-white text-sm">{t('mob-ride')}</h3>
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3">
          <div>
            <p className="text-sm font-semibold text-white">{t('mob-didi')}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{t('mob-didi-open')}</p>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-semibold hover:bg-sky-400 transition">
            {t('mob-open-btn')}
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">{t('mob-emer-phrases')}</h3>
          <span className="text-[10px] text-sky-400 font-semibold bg-sky-500/20 px-2 py-0.5 rounded">{t('mob-ai-audio')}</span>
        </div>
        <p className="text-xs text-slate-400">{t('mob-emer-desc')}</p>
        <div className="space-y-2">
          {phrases.map((phrase) => (
            <div key={phrase.key} className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3">
              <p className="text-sm text-slate-200 flex-1">{t(phrase.key)}</p>
              <button
                className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 ml-3 hover:bg-sky-500/30 transition"
                onClick={() => handleSpeak(phrase.key)}
                disabled={speakingKey !== null}
              >
                {speakingKey === phrase.key ? (
                  <Loader className="w-4 h-4 text-sky-400 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4 text-sky-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
