import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { callGeminiText } from '../services/gemini'
import { useLangStore } from '../stores/useLangStore'
import { useUIStore } from '../stores/useUIStore'

const timeOptions = ['ai-planner-t1', 'ai-planner-t2', 'ai-planner-t3'] as const
const interestOptions = [
  'ai-planner-i1', 'ai-planner-i2', 'ai-planner-i3', 'ai-planner-i4',
  'ai-planner-i5', 'ai-planner-i6', 'ai-planner-i7',
] as const

export function AiPlanner() {
  const { t } = useTranslation()
  const currentLang = useLangStore((s) => s.currentLang)
  const openModule = useUIStore((s) => s.openModule)
  const showToast = useUIStore((s) => s.showToast)

  const [selectedTime, setSelectedTime] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [customReq, setCustomReq] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleInterest = (key: string) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const handleGenerate = async () => {
    if (selectedInterests.length === 0 && !selectedTime && !customReq.trim()) {
      showToast(t('ai-planner-warn'))
      return
    }
    setLoading(true)
    setError('')

    try {
      const timeLabel = selectedTime ? t(selectedTime) : ''
      const interests = selectedInterests.map((k) => t(k)).join(', ')

      const prompt = `Create a short, practical tech/cultural tour in Shenzhen based on this request.
Time: ${timeLabel || 'Flexible'}
Interests: ${interests || 'General'}
Special requests: ${customReq || 'None'}
The stops must be realistic locations in Shenzhen (e.g., DJI Sky City, Huaqiangbei, Talent Park, specific local restaurants, etc.).
Include 2-4 stops with time, location name, district, and a one-line description for each.
IMPORTANT: For title, description, and locationName fields, provide BOTH English and Chinese (Simplified) versions as {"en": "...", "zh": "..."} objects.
The duration field should be a simple string like "4.5 Hours".`

      const localeTextSchema = {
        type: 'OBJECT',
        properties: {
          en: { type: 'STRING' },
          zh: { type: 'STRING' },
        },
      }

      const schema = {
        type: 'OBJECT',
        properties: {
          title: localeTextSchema,
          duration: { type: 'STRING', description: 'e.g. 4.5 Hours' },
          stops: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                time: { type: 'STRING', description: 'e.g. 14:00' },
                title: localeTextSchema,
                description: localeTextSchema,
                locationName: { ...localeTextSchema, description: 'District or place, e.g. Futian CBD' },
                theme: { type: 'STRING', description: 'Must be exactly one of: tech, food, culture, city' },
              },
            },
          },
        },
      }

      const data = await callGeminiText(prompt, schema)
      openModule('ai-result', { result: data })
    } catch (err) {
      console.error(err)
      setError(t('ai-planner-error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">{t('ai-planner-time')}</h3>
        <div className="flex flex-wrap gap-2">
          {timeOptions.map((key) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                selectedTime === key
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
              onClick={() => setSelectedTime(key)}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">{t('ai-planner-interest')}</h3>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((key) => (
            <button
              key={key}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedInterests.includes(key)
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
              onClick={() => toggleInterest(key)}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-white">
          {t('ai-planner-req')} <span className="text-slate-500 font-normal">{t('ai-planner-req-opt')}</span>
        </h3>
        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition resize-none h-20"
          placeholder={t('ai-planner-placeholder')}
          value={customReq}
          onChange={(e) => setCustomReq(e.target.value)}
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-sm hover:from-sky-400 hover:to-indigo-400 transition disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {currentLang === 'zh' ? '生成中...' : 'Generating...'}
          </span>
        ) : (
          t('ai-planner-btn')
        )}
      </button>
    </div>
  )
}
