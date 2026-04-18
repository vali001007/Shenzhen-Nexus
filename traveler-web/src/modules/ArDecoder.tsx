import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera } from 'lucide-react'
import { callGeminiImage } from '../services/gemini'
import { useLangStore } from '../stores/useLangStore'

interface DecodeResult {
  term: string
  pinyin: string
  translation: string
  context: string
  tags: string[]
}

export function ArDecoder() {
  const { t } = useTranslation()
  const currentLang = useLangStore((s) => s.currentLang)
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DecodeResult | null>(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')

  const handleFile = async (file: File) => {
    setLoading(true)
    setError('')
    setResult(null)

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string
        setPreview(dataUrl)
        const base64 = dataUrl.split(',')[1]
        const mimeType = file.type || 'image/jpeg'

        const data = await callGeminiImage(base64, mimeType)
        if (data && data.term) {
          setResult({
            term: data.term || '',
            pinyin: data.pinyin || '',
            translation: data.translation || '',
            context: data.context || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
          })
        } else {
          setError(currentLang === 'zh' ? '分析结果为空，请换一张图片重试。' : 'Empty result. Please try another image.')
        }
      } catch (e) {
        console.error('ArDecoder error:', e)
        setError(currentLang === 'zh' ? '图片分析失败，请重试。' : 'Image analysis failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    reader.onerror = () => {
      setError(currentLang === 'zh' ? '图片读取失败，请重试。' : 'Failed to read image. Please try again.')
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleClick = () => {
    fileRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl border border-sky-500/30 p-5 space-y-2">
        <p className="text-xs text-slate-400 leading-relaxed">{t('ar-upload-desc')}</p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-sm hover:from-sky-400 hover:to-indigo-400 transition flex items-center justify-center gap-2"
        onClick={handleClick}
        disabled={loading}
      >
        <Camera className="w-4 h-4" />
        {t('ar-btn-decode')}
      </button>

      {preview && (
        <img src={preview} className="w-full h-48 object-cover rounded-2xl" alt="preview" />
      )}

      {loading && (
        <div className="glass-panel rounded-2xl border border-slate-700 p-4 animate-pulse text-center">
          <p className="text-sm text-slate-300">{t('ar-analyzing')}</p>
        </div>
      )}

      {result && (
        <div className="glass-panel rounded-2xl border border-sky-500/50 p-5 space-y-3 fade-in">
          <div>
            <h3 className="font-bold text-white text-xl">{result.term}</h3>
            <p className="text-sky-400 text-sm">{result.pinyin}</p>
          </div>
          <p className="text-sm text-white leading-relaxed">{result.translation}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{result.context}</p>
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
