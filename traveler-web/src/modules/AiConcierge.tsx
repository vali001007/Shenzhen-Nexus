import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Sparkles } from 'lucide-react'
import { callGeminiText } from '../services/gemini'
import { useLangStore } from '../stores/useLangStore'
import { useUIStore } from '../stores/useUIStore'

export function AiConcierge() {
  const { t } = useTranslation()
  const currentLang = useLangStore((s) => s.currentLang)
  const modulePayload = useUIStore((s) => s.modulePayload)

  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ctxHint = modulePayload?.ctx
    ? `\n[Context: User is viewing spot "${(modulePayload.ctx as any).spotTitle}" with merchant "${(modulePayload.ctx as any).merchantName}"]`
    : ''

  const handleAsk = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const langInstruction = currentLang === 'zh' ? 'Respond in Simplified Chinese.' : 'Respond in English.'
      const prompt = `As a helpful APEC 2026 Shenzhen Concierge, briefly answer this query: "${input}". Keep it under 3 sentences. Provide practical, culturally aware advice. ${langInstruction}${ctxHint}`
      const text = await callGeminiText(prompt)
      setAnswer(typeof text === 'string' ? text : text.answer ?? JSON.stringify(text))
    } catch {
      setError(t('ai-concierge-error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl border border-fuchsia-500/30 p-5 space-y-2">
        <h3 className="font-bold text-fuchsia-400 text-sm">{t('ai-concierge-guide')}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{t('ai-concierge-prompt')}</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          placeholder={t('ai-concierge-placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button
          className="w-12 h-12 rounded-xl bg-fuchsia-500 flex items-center justify-center hover:bg-fuchsia-400 transition shrink-0"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {loading && (
        <p className="text-slate-400 text-xs animate-pulse">
          ✨ {t('ai-concierge-thinking')}
        </p>
      )}

      {answer && (
        <div className="glass-panel p-4 rounded-xl border border-fuchsia-500/50 relative fade-in">
          <Sparkles className="w-4 h-4 text-fuchsia-400 absolute top-3 right-3" />
          <p className="text-sm text-white leading-relaxed">{answer}</p>
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
