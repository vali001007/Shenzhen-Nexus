import { useLangStore } from '../stores/useLangStore'

async function apiPost<T = any>(path: string, body: object): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`)
  return data as T
}

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
}

export async function callGeminiText(prompt: string, parseJson = false): Promise<any> {
  const lang = useLangStore.getState().currentLang
  const data = await apiPost<{ text: string }>('/ai/chat', { prompt, lang })
  if (!parseJson) return data.text
  return JSON.parse(stripFences(data.text))
}

export async function callGeminiTTS(_text: string): Promise<{ data: string; mimeType: string }> {
  console.warn('[AI] TTS not supported')
  throw new Error('TTS not supported')
}

export async function callGeminiImage(
  base64Data: string,
  mimeType: string,
): Promise<{ term: string; pinyin: string; translation: string; context: string; tags: string[] }> {
  const lang = useLangStore.getState().currentLang
  return apiPost('/ai/vision', { base64Data, mimeType, lang })
}
