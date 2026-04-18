import { useLangStore } from '../stores/useLangStore'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const API_BASE = 'https://api.aicodewith.com'

async function fetchWithRetry(url: string, payload: object, retries = 5): Promise<any> {
  let delay = 1000
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorBody = await response.text().catch(() => '')
        console.error(`[Gemini] HTTP ${response.status}:`, errorBody)
        throw new Error(`HTTP ${response.status}: ${errorBody}`)
      }
      return await response.json()
    } catch (e) {
      console.error(`[Gemini] Attempt ${i + 1}/${retries} failed:`, e)
      if (i === retries - 1) throw e
      await new Promise((res) => setTimeout(res, delay))
      delay *= 2
    }
  }
}

export async function callGeminiText(prompt: string, schema?: object): Promise<any> {
  const currentLang = useLangStore.getState().currentLang
  const url = `${API_BASE}/api/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
  const langInstruction =
    currentLang === 'zh'
      ? 'IMPORTANT: YOU MUST RESPOND ENTIRELY IN SIMPLIFIED CHINESE (简体中文), except for specific original names.'
      : ''

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [
        {
          text: `You are an expert local guide in Shenzhen curating experiences for foreign APEC visitors. ${langInstruction}`,
        },
      ],
    },
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  }
  const result = await fetchWithRetry(url, payload)
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return JSON.parse(text)
}

export async function callGeminiTTS(text: string): Promise<{ data: string; mimeType: string }> {
  const url = `${API_BASE}/api/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
  const payload = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } } },
    },
  }
  const result = await fetchWithRetry(url, payload)
  return result.candidates[0].content.parts[0].inlineData
}

export async function callGeminiImage(
  base64Data: string,
  mimeType: string,
): Promise<{ term: string; pinyin: string; translation: string; context: string; tags: string[] }> {
  const currentLang = useLangStore.getState().currentLang
  const url = `${API_BASE}/api/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
  const langInstruction =
    currentLang === 'zh'
      ? "IMPORTANT: YOU MUST RESPOND ENTIRELY IN SIMPLIFIED CHINESE (简体中文), except for 'term' and 'pinyin' fields."
      : ''

  const schema = {
    type: 'OBJECT',
    properties: {
      term: { type: 'STRING' },
      pinyin: { type: 'STRING' },
      translation: { type: 'STRING' },
      context: { type: 'STRING' },
      tags: { type: 'ARRAY', items: { type: 'STRING' } },
    },
    required: ['term', 'pinyin', 'translation', 'context', 'tags'],
  }

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `You are an expert local guide in Shenzhen. Analyze this image (menu, sign, landmark, or product) and return structured information. ${langInstruction}`,
          },
          { inlineData: { mimeType, data: base64Data } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  }
  const result = await fetchWithRetry(url, payload)
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini image analysis')
  const parsed = JSON.parse(text)
  if (!parsed.term || !parsed.translation) throw new Error('Incomplete response structure')
  return parsed
}
