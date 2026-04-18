import { callGeminiTTS } from './gemini'
import { useLangStore } from '../stores/useLangStore'

export async function playPCM16(base64Data: string, mimeType: string): Promise<void> {
  let sampleRate = 24000
  const rateMatch = mimeType.match(/rate=(\d+)/)
  if (rateMatch?.[1]) {
    sampleRate = parseInt(rateMatch[1], 10)
  }

  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  const pcm16 = new Int16Array(bytes.buffer)
  const audioCtx = new AudioContext()
  const audioBuffer = audioCtx.createBuffer(1, pcm16.length, sampleRate)
  const channelData = audioBuffer.getChannelData(0)
  for (let i = 0; i < pcm16.length; i++) {
    channelData[i] = pcm16[i] / 32768.0
  }
  const source = audioCtx.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioCtx.destination)
  source.start()
}

export async function speakText(text: string): Promise<void> {
  if (!text) return
  try {
    const audioData = await callGeminiTTS(text)
    await playPCM16(audioData.data, audioData.mimeType)
  } catch (err) {
    console.error(err)
    const isZh = useLangStore.getState().currentLang === 'zh'
    throw new Error(isZh ? '语音合成失败。' : 'Text-to-speech failed.')
  }
}
